import { describe, expect, it } from 'vitest';
import {
  aap2022Thresholds,
  EXCHANGE_NO_RF,
  EXCHANGE_RF,
  evaluateCurve,
  PHOTO_NO_RF,
  PHOTO_RF,
  phototherapyCurve,
} from './aap2022';
import {
  baRatioThreshold,
  followUpRecommendation,
  nice38Thresholds,
  NO_RISK_FACTORS,
  pretermRow,
  rateOfRise,
  reboundPlan,
  tcbNeedsTsb,
} from './guidelines';
import { assess } from './assess';
import { formatBili, toMgdl, toUmol } from './units';

const allCurves = [
  ...Object.entries(PHOTO_NO_RF).map(([g, c]) => [`photo noRF ${g}`, c] as const),
  ...Object.entries(PHOTO_RF).map(([g, c]) => [`photo RF ${g}`, c] as const),
  ...Object.entries(EXCHANGE_NO_RF).map(([g, c]) => [`exchange noRF ${g}`, c] as const),
  ...Object.entries(EXCHANGE_RF).map(([g, c]) => [`exchange RF ${g}`, c] as const),
];

describe('AAP 2022 Supplemental Tables 1–4', () => {
  it.each([
    [35, 48, false, 14.2, 20.7],
    [35, 48, true, 12.2, 18.5],
    [39, 80, false, 20.2, 26.4],
    [39, 80, true, 17.2, 22.7],
    [40, 93, false, 21.6, 26.9],
    [40, 96, false, 21.8, 27],
  ] as const)('35–40 wk table value at GA %i, hour %i, with risks %s', (ga, h, risk, photo, exchange) => {
    const t = aap2022Thresholds(ga, h, risk);
    expect(t.phototherapy.value).toBe(photo);
    expect(t.exchange.value).toBe(exchange);
    expect(t.escalation.value).toBeCloseTo(exchange - 2, 8);
    expect(t.phototherapy.completedHour).toBe(h);
  });

  it('uses completed gestational and postnatal hours, with no invented hour zero or post-limit rows', () => {
    expect(phototherapyCurve(42, false)).toBe(PHOTO_NO_RF[40]);
    expect(phototherapyCurve(41, true)).toBe(PHOTO_RF[38]);
    expect(phototherapyCurve(37.9, false)).toBe(PHOTO_NO_RF[37]);
    expect(aap2022Thresholds(39, 80.75, false).phototherapy.completedHour).toBe(80);
    expect(aap2022Thresholds(39, 1, false).phototherapy.value).toBe(8.4);
    for (const age of [-1, 0, 0.9, 336.2, 400, NaN]) {
      expect(aap2022Thresholds(39, age, false).exchange.value).toBeNull();
    }
    expect(aap2022Thresholds(34, 48, false).phototherapy.value).toBeNull();
    expect(aap2022Thresholds(NaN, 48, false).phototherapy.value).toBeNull();
  });

  it.each(allCurves)('%s has 336 finite published hour values and blank hour zero', (_name, curve) => {
    expect(curve.length).toBe(337);
    expect(curve[0]).toBeNull();
    for (let h = 1; h <= 336; h++) {
      const t = evaluateCurve(curve, h);
      expect(Number.isFinite(t.value)).toBe(true);
      expect(t.completedHour).toBe(h);
      expect(t.value).toBe(curve[h]);
    }
  });

  it('does not plateau every curve from 96 h; preserves the Table 3 GA37 hour-154 step', () => {
    expect(aap2022Thresholds(38, 112, false).phototherapy.value).toBe(20.8);
    expect(aap2022Thresholds(38, 96, false).phototherapy.value).toBe(20.7);
    expect(aap2022Thresholds(37, 153, false).exchange.value).toBe(26.9);
    expect(aap2022Thresholds(37, 154, false).exchange.value).toBe(27);
  });

  it('only the exchange/escalation series shifts for confirmed rise despite phototherapy', () => {
    const before = aap2022Thresholds(40, 96, false);
    const after = aap2022Thresholds(40, 96, false, true);
    expect(before.phototherapy.value).toBe(after.phototherapy.value);
    expect(after.escalation.value).toBe(21.5);
    expect(after.exchange.value).toBe(23.5);
  });
});

describe('Follow-up algorithm (delta to threshold)', () => {
  it.each([
    [0, 30, 'at-or-above'],
    [-1, 30, 'at-or-above'],
    [0.1, 20, '0.1-1.9'],
    [1.9, 30, '0.1-1.9'],
    [1.95, 30, '2.0-3.4'], // rounds to 2.0
    [2.0, 30, '2.0-3.4'],
    [3.4, 30, '2.0-3.4'],
    [3.5, 30, '3.5-5.4'],
    [5.4, 30, '3.5-5.4'],
    [5.5, 30, '5.5-6.9'],
    [6.9, 30, '5.5-6.9'],
    [7.0, 30, '>=7.0'],
    [3, 11, 'too-early'],
  ] as const)('delta %f at %i h → %s', (d, h, band) => {
    expect(followUpRecommendation(d, h).band).toBe(band);
  });

  it('0.1–1.9 differs before and after 24 h', () => {
    expect(followUpRecommendation(1, 20).action).toMatch(/4–8 h/);
    expect(followUpRecommendation(1, 30).action).toMatch(/4–24 h/);
    expect(followUpRecommendation(1, 30).options).toHaveLength(3);
  });

  it('≥5.5 depends on 72 h', () => {
    expect(followUpRecommendation(6, 60).action).toMatch(/2 days/);
    expect(followUpRecommendation(6, 80).action).toBe('Clinical judgment.');
    expect(followUpRecommendation(8, 60).action).toMatch(/3 days/);
  });
});

describe('Other rules', () => {
  it('rate of rise uses 0.3 mg/dL/h before 24 h and 0.2 after', () => {
    const early = rateOfRise({ ageHours: 10, value: 4, method: 'TSB' }, { ageHours: 20, value: 7, method: 'TSB' })!;
    expect(early.threshold).toBe(0.3);
    expect(early.suggestsHemolysis).toBe(true);
    const late = rateOfRise({ ageHours: 30, value: 10, method: 'TSB' }, { ageHours: 40, value: 11.9, method: 'TSB' })!;
    expect(late.threshold).toBe(0.2);
    expect(late.suggestsHemolysis).toBe(false);
    expect(rateOfRise({ ageHours: 30, value: 10, method: 'TSB' }, { ageHours: 30, value: 11, method: 'TSB' })).toBeNull();
    // order-independent
    expect(
      rateOfRise({ ageHours: 40, value: 12, method: 'TSB' }, { ageHours: 30, value: 10, method: 'TSB' })!.mgdlPerHour,
    ).toBeCloseTo(0.2, 9);
  });

  it('TcB confirmation rule', () => {
    expect(tcbNeedsTsb(15, 20)).toBe(true);
    expect(tcbNeedsTsb(14, 16.9)).toBe(true); // within 3
    expect(tcbNeedsTsb(14, 17)).toBe(true); // exactly 3 below counts as "within"
    expect(tcbNeedsTsb(14, 17.1)).toBe(false);
    expect(tcbNeedsTsb(12.3, 15.3)).toBe(true); // float-safe boundary
    expect(tcbNeedsTsb(10, null)).toBe(true);
  });

  it('B/A ratio thresholds', () => {
    expect(baRatioThreshold(39, false)).toBe(8.0);
    expect(baRatioThreshold(39, true)).toBe(7.2);
    expect(baRatioThreshold(36, false)).toBe(7.2);
    expect(baRatioThreshold(36, true)).toBe(6.8);
  });

  it('NICE ≥38-week table: exact rows, linear between rows, flat ≥96 h', () => {
    expect(nice38Thresholds(0)).toEqual({ photo: 100, exchange: 100 });
    expect(nice38Thresholds(30)).toEqual({ photo: 212, exchange: 350 });
    expect(nice38Thresholds(42)).toEqual({ photo: 237, exchange: 450 });
    expect(nice38Thresholds(96)).toEqual({ photo: 350, exchange: 450 });
    expect(nice38Thresholds(500)).toEqual({ photo: 350, exchange: 450 });
    expect(nice38Thresholds(3)!.photo).toBeCloseTo(112.5, 6);
    expect(nice38Thresholds(-1)).toBeNull();
  });

  it('preterm table by postmenstrual age', () => {
    expect(pretermRow(27.9)!.phototherapy).toEqual([5, 6]);
    expect(pretermRow(28)!.label).toBe('28 0/7 – 29 6/7');
    expect(pretermRow(34.5)!.exchange).toEqual([17, 19]);
    expect(pretermRow(35)).toBeNull();
  });

  it('rebound plan', () => {
    expect(reboundPlan({ startedBefore48h: true, hemolysis: false, context: 'birth-admission' })).toMatch(/6–12 h/);
    expect(reboundPlan({ startedBefore48h: false, hemolysis: false, context: 'first-treatment-on-readmission-or-home' })).toMatch(/1–2 days/);
    expect(reboundPlan({ startedBefore48h: true, hemolysis: true, context: 'readmitted-after-birth-phototherapy' })).toMatch(/day after/);
  });

  it('unit conversion round-trips and formats', () => {
    expect(toMgdl(toUmol(12.3))).toBeCloseTo(12.3, 9);
    expect(formatBili(20, 'umol')).toBe('342 µmol/L');
    expect(formatBili(20, 'mgdl')).toBe('20.0 mg/dL');
    expect(formatBili(null, 'mgdl')).toBe('—');
  });
});

describe('assess() end-to-end', () => {
  it('well 39-week infant below threshold gets a follow-up band', () => {
    const a = assess({
      gaWeeks: 39,
      measurements: [{ ageHours: 48, value: 12.0, method: 'TSB' }],
      riskFactors: NO_RISK_FACTORS,
    })!;
    expect(a.zone).toBe('below');
    expect(a.deltaToPhototherapy).toBeCloseTo(4.6, 6);
    expect(a.followUp!.band).toBe('3.5-5.4');
  });

  it('isoimmune hemolysis at escalation threshold triggers IVIG and escalation', () => {
    const a = assess({
      gaWeeks: 39,
      measurements: [
        { ageHours: 24, value: 13, method: 'TSB' },
        { ageHours: 30, value: 17.5, method: 'TSB' },
      ],
      riskFactors: { ...NO_RISK_FACTORS, isoimmune: true },
    })!;
    expect(a.withRiskFactors).toBe(true);
    expect(a.zone).toBe('escalation');
    expect(a.rate!.suggestsHemolysis).toBe(true);
    expect(a.actions.some((x) => /IVIG/.test(x.text))).toBe(true);
  });

  it('low albumin entered as a number becomes a risk factor', () => {
    const a = assess({
      gaWeeks: 39,
      measurements: [{ ageHours: 60, value: 16, method: 'TSB' }],
      riskFactors: NO_RISK_FACTORS,
      albumin: 2.8,
    })!;
    expect(a.withRiskFactors).toBe(true);
    expect(a.thresholds.phototherapyCurveLabel).toMatch(/≥38 wk, ≥1/);
  });

  it('uses Table 4 at KAS 17 escalation even below the unchanged photo line; includes IV hydration', () => {
    const a = assess({
      gaWeeks: 40, measurements: [{ ageHours: 96, value: 21.6, method: 'TSB' }],
      riskFactors: NO_RISK_FACTORS, risingDespitePhototherapy: true,
    })!;
    expect(a.zone).toBe('escalation');
    expect(a.thresholds.phototherapy.value).toBe(21.8);
    expect(a.actions.some((a) => /IV hydration/.test(a.text))).toBe(true);
  });

  it('does not apply a treatment zone to a TcB even beyond the exchange line', () => {
    const a = assess({
      gaWeeks: 36, albumin: 2.9,
      measurements: [{ ageHours: 36, value: 9, method: 'TSB' }, { ageHours: 48, value: 35, method: 'TcB' }],
      riskFactors: NO_RISK_FACTORS, risingDespitePhototherapy: true,
    })!;
    expect(a.zone).toBe('screening');
    expect(a.tcbConfirm).toBe(true);
    expect(a.baRatio).toBeNull();
    expect(a.rate).toBeNull();
    expect(a.followUp).toBeNull();
    expect(a.actions.every((x) => x.level === 'urgent' || x.level === 'info')).toBe(true);
    expect(tcbNeedsTsb(17.2 - 3, 17.2)).toBe(true);
    expect(tcbNeedsTsb(14.17, 17.2)).toBe(false);
  });

  it('keeps discharge timing distinct from acute treatment and rebound', () => {
    const base = { gaWeeks: 39, riskFactors: NO_RISK_FACTORS };
    const early = assess({ ...base, measurements: [{ ageHours: 4, value: 10, method: 'TSB' }] })!;
    const treated = assess({ ...base, measurements: [{ ageHours: 48, value: 12, method: 'TSB' }], receivedPhototherapy: true })!;
    expect(early.zone).toBe('phototherapy');
    expect(early.followUp).toBeNull();
    expect(treated.followUp).toBeNull();
    expect(treated.actions.some((a) => a.text.includes('KAS 16'))).toBe(true);
  });

  it('TcB near threshold demands TSB', () => {
    const a = assess({
      gaWeeks: 38,
      measurements: [{ ageHours: 48, value: 13.5, method: 'TcB' }],
      riskFactors: NO_RISK_FACTORS,
    })!;
    expect(a.tcbConfirm).toBe(true);
  });

  it('ABE signs always produce an emergency exchange action', () => {
    const a = assess({
      gaWeeks: 40,
      measurements: [{ ageHours: 120, value: 22, method: 'TSB' }],
      riskFactors: NO_RISK_FACTORS,
      abeSigns: true,
    })!;
    expect(a.actions[0].level).toBe('emergency');
    expect(a.actions[0].text).toMatch(/exchange/);
  });

  it('fuzz: random inputs never throw or produce NaN thresholds', () => {
    let seed = 42;
    const rnd = () => ((seed = (seed * 1664525 + 1013904223) % 2 ** 32) / 2 ** 32);
    for (let i = 0; i < 5000; i++) {
      const ga = 30 + rnd() * 13;
      const h = rnd() * 400 - 10;
      const v = rnd() * 35;
      const a = assess({
        gaWeeks: ga,
        measurements: [{ ageHours: h, value: v, method: rnd() > 0.5 ? 'TSB' : 'TcB' }],
        riskFactors: { ...NO_RISK_FACTORS, sepsis: rnd() > 0.5 },
        albumin: rnd() > 0.5 ? 2 + rnd() * 2 : null,
      })!;
      if (h < 0) { expect(a).toBeNull(); continue; }
      for (const t of [a.thresholds.phototherapy, a.thresholds.exchange, a.thresholds.escalation]) {
        if (t.value != null) expect(Number.isFinite(t.value)).toBe(true);
      }
      expect(['screening', 'below', 'phototherapy', 'escalation', 'exchange', 'unknown']).toContain(a.zone);
    }
  });
});

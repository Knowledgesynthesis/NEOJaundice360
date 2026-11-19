import { describe, expect, it } from 'vitest';
import {
  aap2022Thresholds,
  ANCHOR_HOURS,
  EXCHANGE_NO_RF_38,
  EXCHANGE_RF_38,
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
  ...Object.entries(PHOTO_NO_RF).map(([k, c]) => [`photo noRF ${k}`, c] as const),
  ...Object.entries(PHOTO_RF).map(([k, c]) => [`photo RF ${k}`, c] as const),
  ['exchange noRF ≥38', EXCHANGE_NO_RF_38] as const,
  ['exchange RF ≥38', EXCHANGE_RF_38] as const,
];

describe('AAP 2022 curves — published anchor values', () => {
  it.each([
    [40, false, [13.3, 17.0, 19.8, 21.8]],
    [39, false, [12.8, 16.6, 19.5, 21.5]],
    [38, false, [12.3, 16.0, 18.8, 20.7]],
    [37, false, [11.7, 15.4, 18.1, 20.0]],
    [35, false, [10.6, 14.2, 16.8, 18.6]],
    [38, true, [10.5, 14.0, 16.6, 18.2]],
    [35, true, [8.9, 12.2, 14.6, 16.1]],
  ] as const)('GA %i, RF=%s returns the published values at 24/48/72/96 h', (ga, rf, expected) => {
    ANCHOR_HOURS.forEach((h, i) => {
      const r = aap2022Thresholds(ga, h, rf).phototherapy;
      expect(r.value).toBeCloseTo(expected[i], 6);
      expect(r.atPublishedHour).toBe(true);
    });
  });

  it('36-week no-RF curve hits the published 48 h value (14.8)', () => {
    expect(aap2022Thresholds(36, 48, false).phototherapy.value).toBeCloseTo(14.8, 6);
  });

  it('≥38-week no-RF exchange anchors', () => {
    expect(aap2022Thresholds(39, 24, false).exchange.value).toBeCloseTo(21.4, 6);
    expect(aap2022Thresholds(41, 96, false).exchange.value).toBeCloseTo(27.0, 6);
  });

  it('GA ≥40 maps to the 40-week curve; ≥38 maps to the 38-week RF curve', () => {
    expect(phototherapyCurve(42, false)).toBe(PHOTO_NO_RF[40]);
    expect(phototherapyCurve(41, true)).toBe(PHOTO_RF[38]);
    expect(phototherapyCurve(37.9, false)).toBe(PHOTO_NO_RF[37]); // completed weeks
  });
});

describe('AAP 2022 curves — structural invariants (stress)', () => {
  it.each(allCurves)('%s is non-decreasing from 12 h to 336 h and flat after 96 h', (_name, curve) => {
    let prev = -Infinity;
    for (let h = 12; h <= 336; h += 0.5) {
      const r = evaluateCurve(curve, h);
      expect(r.value).not.toBeNull();
      expect(Number.isFinite(r.value!)).toBe(true);
      expect(r.value!).toBeGreaterThanOrEqual(prev - 1e-9);
      prev = r.value!;
    }
    expect(evaluateCurve(curve, 96).value).toBe(evaluateCurve(curve, 336).value);
  });

  it('higher GA never has a lower threshold (no RF and RF)', () => {
    for (let h = 12; h <= 200; h += 1) {
      const noRf = [35, 36, 37, 38, 39, 40].map((g) => aap2022Thresholds(g, h, false).phototherapy.value!);
      const rf = [35, 36, 37, 38].map((g) => aap2022Thresholds(g, h, true).phototherapy.value!);
      for (let i = 1; i < noRf.length; i++) expect(noRf[i]).toBeGreaterThanOrEqual(noRf[i - 1]);
      for (let i = 1; i < rf.length; i++) expect(rf[i]).toBeGreaterThanOrEqual(rf[i - 1]);
    }
  });

  it('risk-factor curve is always below the no-RF curve for the same GA', () => {
    for (const ga of [35, 36, 37, 38, 39, 40]) {
      for (let h = 12; h <= 200; h += 1) {
        expect(aap2022Thresholds(ga, h, true).phototherapy.value!).toBeLessThan(
          aap2022Thresholds(ga, h, false).phototherapy.value!,
        );
      }
    }
  });

  it('exchange > escalation > phototherapy wherever exchange is embedded; escalation = exchange − 2', () => {
    for (const rf of [false, true]) {
      for (let h = 12; h <= 336; h += 1) {
        const t = aap2022Thresholds(39, h, rf);
        expect(t.exchange.value! - t.escalation.value!).toBeCloseTo(2, 9);
        expect(t.escalation.value!).toBeGreaterThan(t.phototherapy.value!);
      }
    }
  });

  it('interpolation stays within the bracketing anchors', () => {
    for (const [, curve] of allCurves) {
      for (let i = 0; i < 3; i++) {
        for (let h = ANCHOR_HOURS[i]; h <= ANCHOR_HOURS[i + 1]; h += 0.25) {
          const v = evaluateCurve(curve, h).value!;
          expect(v).toBeGreaterThanOrEqual(curve.values[i] - 1e-9);
          expect(v).toBeLessThanOrEqual(curve.values[i + 1] + 1e-9);
        }
      }
    }
  });

  it('12–<24 h is flagged as extrapolated; <12 h and >336 h are not computed', () => {
    expect(aap2022Thresholds(39, 18, false).phototherapy.status).toBe('extrapolated');
    expect(aap2022Thresholds(39, 11.9, false).phototherapy.value).toBeNull();
    expect(aap2022Thresholds(39, 337, false).phototherapy.value).toBeNull();
    expect(aap2022Thresholds(39, Number.NaN, false).phototherapy.value).toBeNull();
  });

  it('35–37-week exchange curves are reported as not embedded (never invented)', () => {
    for (const ga of [35, 36, 37]) {
      const t = aap2022Thresholds(ga, 48, true);
      expect(t.exchange.value).toBeNull();
      expect(t.exchange.status).toBe('not-embedded');
      expect(t.escalation.value).toBeNull();
    }
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
    expect(reboundPlan({ startedBefore48h: true, hemolysis: false, readmitted: false })).toMatch(/6–12 h/);
    expect(reboundPlan({ startedBefore48h: false, hemolysis: false, readmitted: true })).toMatch(/1–2 days/);
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
      for (const t of [a.thresholds.phototherapy, a.thresholds.exchange, a.thresholds.escalation]) {
        if (t.value != null) expect(Number.isFinite(t.value)).toBe(true);
      }
      expect(['below', 'phototherapy', 'escalation', 'exchange', 'unknown']).toContain(a.zone);
    }
  });
});

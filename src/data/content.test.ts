import { describe, expect, it } from 'vitest';
import { assess } from '@/lib/bili/assess';
import { NO_RISK_FACTORS } from '@/lib/bili/guidelines';
import { CASES } from './cases';
import { QUESTIONS } from './questions';
import { REF_BY_ID, REFERENCES } from './references';
import { ETIOLOGIES } from './etiologies';
import { GLOSSARY } from './glossary';

const allRefIds = [
  ...QUESTIONS.flatMap((q) => q.refs),
  ...ETIOLOGIES.flatMap((e) => e.refs),
  ...CASES.flatMap((c) => c.steps.flatMap((s) => s.refs ?? [])),
];

describe('content integrity', () => {
  it('every cited reference exists', () => {
    for (const id of allRefIds) expect(REF_BY_ID[id], `missing reference ${id}`).toBeDefined();
  });

  it('reference ids are unique and URLs are https', () => {
    expect(new Set(REFERENCES.map((r) => r.id)).size).toBe(REFERENCES.length);
    for (const r of REFERENCES) if (r.url) expect(r.url.startsWith('https://')).toBe(true);
  });

  it('questions are well-formed and ids unique', () => {
    expect(new Set(QUESTIONS.map((q) => q.id)).size).toBe(QUESTIONS.length);
    for (const q of QUESTIONS) {
      expect(q.options.length).toBeGreaterThanOrEqual(3);
      expect(q.answer).toBeGreaterThanOrEqual(0);
      expect(q.answer).toBeLessThan(q.options.length);
      expect(new Set(q.options).size, `duplicate option in ${q.id}`).toBe(q.options.length);
      expect(q.explanation.length).toBeGreaterThan(20);
    }
  });

  it('every case step has at least one correct option; single-answer steps exactly one', () => {
    for (const c of CASES) {
      for (const s of c.steps) {
        const n = s.options.filter((o) => o.correct).length;
        if (s.multi) expect(n, `${c.id}: ${s.title}`).toBeGreaterThanOrEqual(1);
        else expect(n, `${c.id}: ${s.title}`).toBe(1);
      }
    }
  });

  it('case narratives agree with the engine (expected zone)', () => {
    for (const c of CASES) {
      for (const s of c.steps) {
        if (!s.calc) continue;
        const a = assess({
          gaWeeks: s.calc.gaWeeks,
          measurements: s.calc.measurements,
          riskFactors: { ...NO_RISK_FACTORS, ...s.calc.rf },
          albumin: s.calc.albumin,
          abeSigns: s.calc.abeSigns,
        })!;
        expect(a.zone, `${c.id}: ${s.title}`).toBe(s.calc.expectZone);
      }
    }
  });

  it('case conclusions that depend on the ±0.5 approximate ≥38-wk RF exchange curve hold across that uncertainty', () => {
    const rh = CASES.find((c) => c.id === 'rh')!;
    const esc = rh.steps[1].calc!;
    const ex = rh.steps[2].calc!;
    const a1 = assess({ gaWeeks: esc.gaWeeks, measurements: esc.measurements, riskFactors: { ...NO_RISK_FACTORS, isoimmune: true } })!;
    const a2 = assess({ gaWeeks: ex.gaWeeks, measurements: ex.measurements, riskFactors: { ...NO_RISK_FACTORS, isoimmune: true } })!;
    const v1 = esc.measurements.at(-1)!.value;
    const v2 = ex.measurements.at(-1)!.value;
    expect(v1).toBeGreaterThanOrEqual(a1.thresholds.escalation.value! + 0.5);
    expect(v1).toBeLessThan(a1.thresholds.exchange.value! - 0.5);
    expect(v2).toBeGreaterThanOrEqual(a2.thresholds.exchange.value! + 0.5);
  });

  it('late-preterm case bands are robust to the interpolated 36-week row (35- vs 37-week bounds)', () => {
    for (const ga of [35, 37]) {
      const a = assess({ gaWeeks: ga, measurements: [{ ageHours: 30, value: 9.4, method: 'TSB' }], riskFactors: NO_RISK_FACTORS })!;
      expect(a.followUp!.band).toBe('2.0-3.4');
      const b = assess({ gaWeeks: ga, measurements: [{ ageHours: 30, value: 10.0, method: 'TcB' }], riskFactors: NO_RISK_FACTORS })!;
      expect(b.tcbConfirm).toBe(true);
    }
  });

  it('G6PD case conclusion holds for any plausible 37-week RF value (35–38-week bounds)', () => {
    for (const ga of [35, 38]) {
      const a = assess({ gaWeeks: ga, measurements: [{ ageHours: 100, value: 18.4, method: 'TSB' }], riskFactors: { ...NO_RISK_FACTORS, g6pd: true } })!;
      expect(a.zone).toBe('phototherapy');
    }
  });

  it('glossary terms are unique', () => {
    expect(new Set(GLOSSARY.map((t) => t.term)).size).toBe(GLOSSARY.length);
  });
});

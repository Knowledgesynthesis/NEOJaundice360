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
          context: s.calc.context,
          risingDespitePhototherapy: s.calc.risingDespitePhototherapy,
        })!;
        expect(a.zone, `${c.id}: ${s.title}`).toBe(s.calc.expectZone);
      }
    }
  });

  it('Rh escalation and exchange teaching match Table 4, not the old approximate curve', () => {
    const rh = CASES.find((c) => c.id === 'rh')!;
    for (const [index, exchange, escalation] of [[1, 18.3, 16.3], [2, 18.8, 16.8]]) {
      const calc = rh.steps[index].calc!;
      const a = assess({ ...calc, riskFactors: { ...NO_RISK_FACTORS, ...calc.rf } })!;
      expect(a.thresholds.exchange.value).toBe(exchange);
      expect(a.thresholds.escalation.value).toBe(escalation);
      expect(a.actions.some((x) => /IV hydration/.test(x.text))).toBe(true);
    }
  });

  it('uses the exact late-preterm row and reserves treatment decisions for TSB', () => {
    const a = assess({ gaWeeks: 36, measurements: [{ ageHours: 30, value: 9.4, method: 'TSB' }], riskFactors: NO_RISK_FACTORS })!;
    const b = assess({ gaWeeks: 36, measurements: [{ ageHours: 30, value: 10.0, method: 'TcB' }], riskFactors: NO_RISK_FACTORS })!;
    expect(a.thresholds.phototherapy.value).toBe(12.1);
    expect(a.followUp?.band).toBe('2.0-3.4');
    expect(b.zone).toBe('screening');
    expect(b.tcbConfirm).toBe(true);
  });

  it('glossary terms are unique', () => {
    expect(new Set(GLOSSARY.map((t) => t.term)).size).toBe(GLOSSARY.length);
  });
});

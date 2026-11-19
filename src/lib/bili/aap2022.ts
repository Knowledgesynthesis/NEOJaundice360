/**
 * AAP 2022 hour-specific treatment thresholds for infants ≥35 weeks' gestation.
 * Source: Kemper AR, et al. Pediatrics 2022;150(3):e2022058859 (Figures 2–4 and Supplemental Tables 1–4).
 *
 * DATA POLICY — only values that could be verified are embedded:
 *  • 'published'   – value at 24/48/72/96 h matching the AAP supplemental tables, cross-checked in ≥2
 *                    independent implementations.
 *  • 'interpolated'– a gestational-age row derived from adjacent published rows (stated per curve).
 *  • 'approximate' – secondary source rounded to 0.5 mg/dL.
 *  • Between anchor hours, values follow a monotone cubic spline (typical error ≤0.2 mg/dL).
 *  • 12–<24 h values are extrapolated (flagged). <12 h: not computed (AAP gives no follow-up guidance
 *    for measurements <12 h, and the curve is too steep to extrapolate safely).
 *  • All curves are flat from 96 h to 14 days (336 h), as in the AAP figures.
 *  • Exchange curves for 35–37 weeks are NOT embedded (not verifiable offline) → the app says so
 *    instead of inventing numbers.
 */

export type Provenance = 'published' | 'interpolated' | 'approximate';

export interface Curve {
  /** Threshold (mg/dL) at 24, 48, 72, 96 h. */
  values: readonly [number, number, number, number];
  provenance: Provenance;
  note?: string;
}

export const ANCHOR_HOURS = [24, 48, 72, 96] as const;
export const MIN_HOURS = 12;
export const MAX_HOURS = 336;

/** Phototherapy — no neurotoxicity risk factors other than GA. Keys: completed weeks (40 = ≥40). */
export const PHOTO_NO_RF: Record<35 | 36 | 37 | 38 | 39 | 40, Curve> = {
  35: { values: [10.6, 14.2, 16.8, 18.6], provenance: 'published' },
  36: {
    values: [11.2, 14.8, 17.5, 19.3],
    provenance: 'interpolated',
    note: '48 h value (14.8) published; other hours = mean of the 35- and 37-week rows (the published 48 h value equals that mean exactly).',
  },
  37: { values: [11.7, 15.4, 18.1, 20.0], provenance: 'published' },
  38: { values: [12.3, 16.0, 18.8, 20.7], provenance: 'published' },
  39: { values: [12.8, 16.6, 19.5, 21.5], provenance: 'published' },
  40: { values: [13.3, 17.0, 19.8, 21.8], provenance: 'published' },
};

/** Phototherapy — ≥1 neurotoxicity risk factor. Keys: completed weeks (38 = ≥38). */
export const PHOTO_RF: Record<35 | 36 | 37 | 38, Curve> = {
  35: { values: [8.9, 12.2, 14.6, 16.1], provenance: 'published' },
  36: {
    values: [9.4, 12.8, 15.3, 16.8],
    provenance: 'interpolated',
    note: 'Linear interpolation between the published 35- and ≥38-week risk-factor rows.',
  },
  37: {
    values: [10.0, 13.4, 15.9, 17.5],
    provenance: 'interpolated',
    note: 'Linear interpolation between the published 35- and ≥38-week risk-factor rows.',
  },
  38: { values: [10.5, 14.0, 16.6, 18.2], provenance: 'published' },
};

/** Exchange transfusion — only ≥38-week curves are embedded. */
export const EXCHANGE_NO_RF_38: Curve = { values: [21.4, 24.0, 25.9, 27.0], provenance: 'published' };
export const EXCHANGE_RF_38: Curve = {
  values: [17.5, 20.0, 22.0, 23.5],
  provenance: 'approximate',
  note: 'Secondary source, rounded to 0.5 mg/dL — treat as ±0.5 mg/dL.',
};

/** Escalation-of-care threshold sits 2 mg/dL below the exchange threshold. */
export const ESCALATION_OFFSET = 2;

export type ValueStatus = 'ok' | 'extrapolated' | 'too-early' | 'too-late' | 'not-embedded';

export interface ThresholdValue {
  /** mg/dL, or null when not computed. */
  value: number | null;
  status: ValueStatus;
  provenance?: Provenance;
  /** True when the age is exactly an anchor hour or on the plateau (≥96 h). */
  atPublishedHour?: boolean;
  note?: string;
}

/** Completed weeks of gestation → curve key. */
export function gaKey(gaWeeks: number, withRiskFactors: boolean): number {
  const w = Math.floor(gaWeeks);
  if (withRiskFactors) return Math.min(38, Math.max(35, w));
  return Math.min(40, Math.max(35, w));
}

export function phototherapyCurve(gaWeeks: number, withRiskFactors: boolean): Curve {
  const k = gaKey(gaWeeks, withRiskFactors);
  return withRiskFactors ? PHOTO_RF[k as 35 | 36 | 37 | 38] : PHOTO_NO_RF[k as 35 | 36 | 37 | 38 | 39 | 40];
}

export function exchangeCurve(gaWeeks: number, withRiskFactors: boolean): Curve | null {
  if (Math.floor(gaWeeks) < 38) return null;
  return withRiskFactors ? EXCHANGE_RF_38 : EXCHANGE_NO_RF_38;
}

/* ----------------------------- interpolation ----------------------------- */

/** Fritsch–Carlson monotone cubic Hermite interpolation. */
function monotoneCubic(xs: readonly number[], ys: readonly number[], x: number): number {
  const n = xs.length;
  const h: number[] = [];
  const d: number[] = [];
  for (let i = 0; i < n - 1; i++) {
    h.push(xs[i + 1] - xs[i]);
    d.push((ys[i + 1] - ys[i]) / h[i]);
  }
  const m: number[] = new Array(n);
  m[0] = d[0];
  m[n - 1] = d[n - 2];
  for (let i = 1; i < n - 1; i++) {
    m[i] = d[i - 1] * d[i] <= 0 ? 0 : (d[i - 1] + d[i]) / 2;
  }
  for (let i = 0; i < n - 1; i++) {
    if (d[i] === 0) {
      m[i] = 0;
      m[i + 1] = 0;
      continue;
    }
    const a = m[i] / d[i];
    const b = m[i + 1] / d[i];
    const s = a * a + b * b;
    if (s > 9) {
      const t = 3 / Math.sqrt(s);
      m[i] = t * a * d[i];
      m[i + 1] = t * b * d[i];
    }
  }
  let i = 0;
  while (i < n - 2 && x > xs[i + 1]) i++;
  const t = (x - xs[i]) / h[i];
  const t2 = t * t;
  const t3 = t2 * t;
  return (
    (2 * t3 - 3 * t2 + 1) * ys[i] +
    (t3 - 2 * t2 + t) * h[i] * m[i] +
    (-2 * t3 + 3 * t2) * ys[i + 1] +
    (t3 - t2) * h[i] * m[i + 1]
  );
}

/** Quadratic through the first three anchors, used only to extrapolate 12–<24 h. */
function quadraticExtrapolate(ys: readonly number[], x: number): number {
  const [x0, x1, x2] = [24, 48, 72];
  const [y0, y1, y2] = ys;
  return (
    (y0 * ((x - x1) * (x - x2))) / ((x0 - x1) * (x0 - x2)) +
    (y1 * ((x - x0) * (x - x2))) / ((x1 - x0) * (x1 - x2)) +
    (y2 * ((x - x0) * (x - x1))) / ((x2 - x0) * (x2 - x1))
  );
}

/** Evaluate a curve at an age in hours. */
export function evaluateCurve(curve: Curve, ageHours: number): ThresholdValue {
  if (!Number.isFinite(ageHours) || ageHours < MIN_HOURS) {
    return { value: null, status: 'too-early', note: 'Not computed for measurements before 12 h of age.' };
  }
  if (ageHours > MAX_HOURS) {
    return { value: null, status: 'too-late', note: 'AAP 2022 curves end at 14 days (336 h).' };
  }
  const ys = curve.values;
  if (ageHours < 24) {
    return {
      value: Math.min(ys[0], quadraticExtrapolate(ys, ageHours)),
      status: 'extrapolated',
      provenance: curve.provenance,
      note: 'Extrapolated below 24 h — confirm with BiliTool/PediTools before acting.',
    };
  }
  if (ageHours >= 96) {
    return { value: ys[3], status: 'ok', provenance: curve.provenance, atPublishedHour: true, note: curve.note };
  }
  const atAnchor = (ANCHOR_HOURS as readonly number[]).includes(ageHours);
  return {
    value: monotoneCubic(ANCHOR_HOURS, ys, ageHours),
    status: 'ok',
    provenance: curve.provenance,
    atPublishedHour: atAnchor,
    note: curve.note,
  };
}

export interface Aap2022Thresholds {
  phototherapy: ThresholdValue;
  escalation: ThresholdValue;
  exchange: ThresholdValue;
  /** Label of the curve used, e.g. "≥40 wk, no risk factors". */
  phototherapyCurveLabel: string;
  exchangeCurveLabel: string;
}

export function curveLabel(gaWeeks: number, withRiskFactors: boolean, kind: 'photo' | 'exchange'): string {
  const k = kind === 'photo' ? gaKey(gaWeeks, withRiskFactors) : Math.min(38, Math.max(35, Math.floor(gaWeeks)));
  const top = kind === 'photo' && !withRiskFactors ? 40 : 38;
  const ga = k === top ? `≥${k} wk` : `${k} wk`;
  return `${ga}, ${withRiskFactors ? '≥1 neurotoxicity risk factor' : 'no neurotoxicity risk factors'}`;
}

export function aap2022Thresholds(gaWeeks: number, ageHours: number, withRiskFactors: boolean): Aap2022Thresholds {
  const phototherapy = evaluateCurve(phototherapyCurve(gaWeeks, withRiskFactors), ageHours);
  const ex = exchangeCurve(gaWeeks, withRiskFactors);
  let exchange: ThresholdValue;
  let escalation: ThresholdValue;
  if (!ex) {
    const note =
      'Exchange/escalation curves for 35–37 weeks are not embedded in this app. Read them from the AAP figure (BiliTool or PediTools).';
    exchange = { value: null, status: 'not-embedded', note };
    escalation = { value: null, status: 'not-embedded', note };
  } else {
    exchange = evaluateCurve(ex, ageHours);
    escalation = {
      ...exchange,
      value: exchange.value == null ? null : exchange.value - ESCALATION_OFFSET,
      note: 'Escalation-of-care threshold = exchange threshold − 2 mg/dL.',
    };
  }
  return {
    phototherapy,
    escalation,
    exchange,
    phototherapyCurveLabel: curveLabel(gaWeeks, withRiskFactors, 'photo'),
    exchangeCurveLabel: curveLabel(gaWeeks, withRiskFactors, 'exchange'),
  };
}

/** Sampled curve for charting. */
export function sampleCurve(curve: Curve, fromH = MIN_HOURS, toH = 168, step = 2): { h: number; v: number; extrapolated: boolean }[] {
  const out: { h: number; v: number; extrapolated: boolean }[] = [];
  for (let h = fromH; h <= toH; h += step) {
    const r = evaluateCurve(curve, h);
    if (r.value != null) out.push({ h, v: r.value, extrapolated: r.status === 'extrapolated' });
  }
  return out;
}

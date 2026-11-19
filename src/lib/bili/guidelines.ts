/**
 * Guideline rules other than the AAP threshold curves.
 * Every rule cites its source id (see src/data/references.ts).
 */

/* ---------------- AAP 2022 Table 2: hyperbilirubinemia NEUROTOXICITY risk factors ---------------- */
export interface NeurotoxicityRiskFactors {
  isoimmune: boolean; // positive DAT / isoimmune hemolytic disease
  g6pd: boolean; // G6PD deficiency
  otherHemolysis: boolean; // other hemolytic conditions (e.g., hereditary spherocytosis)
  albuminLow: boolean; // albumin < 3.0 g/dL
  sepsis: boolean;
  instability: boolean; // significant clinical instability in the previous 24 h
}

export const NEUROTOXICITY_RF_LABELS: Record<keyof NeurotoxicityRiskFactors, string> = {
  isoimmune: 'Isoimmune hemolytic disease (positive DAT)',
  g6pd: 'G6PD deficiency',
  otherHemolysis: 'Other hemolytic condition',
  albuminLow: 'Albumin < 3.0 g/dL',
  sepsis: 'Sepsis',
  instability: 'Significant clinical instability in previous 24 h',
};

export const NO_RISK_FACTORS: NeurotoxicityRiskFactors = {
  isoimmune: false,
  g6pd: false,
  otherHemolysis: false,
  albuminLow: false,
  sepsis: false,
  instability: false,
};

export const hasAnyRiskFactor = (rf: NeurotoxicityRiskFactors) => Object.values(rf).some(Boolean);

/* ---------------- Rate of rise (AAP 2022) ---------------- */
export interface Measurement {
  ageHours: number;
  /** mg/dL */
  value: number;
  method: 'TSB' | 'TcB';
}

export interface RateOfRise {
  mgdlPerHour: number;
  threshold: number;
  suggestsHemolysis: boolean;
}

/**
 * A rise ≥0.3 mg/dL/h in the first 24 h, or ≥0.2 mg/dL/h thereafter, suggests hemolysis (AAP 2022).
 * The later measurement's age decides which cut-off applies.
 */
export function rateOfRise(a: Measurement, b: Measurement): RateOfRise | null {
  const [m1, m2] = a.ageHours <= b.ageHours ? [a, b] : [b, a];
  const dt = m2.ageHours - m1.ageHours;
  if (!(dt > 0)) return null;
  const r = (m2.value - m1.value) / dt;
  const threshold = m2.ageHours < 24 ? 0.3 : 0.2;
  return { mgdlPerHour: r, threshold, suggestsHemolysis: r >= threshold };
}

/* ---------------- TcB → TSB confirmation (AAP 2022) ---------------- */
/** Measure TSB if TcB is ≥15 mg/dL or within 3 mg/dL of (or above) the phototherapy threshold. */
export function tcbNeedsTsb(tcb: number, phototherapyThreshold: number | null): boolean {
  if (tcb >= 15) return true;
  if (phototherapyThreshold == null) return true;
  // 'within 3 mg/dL' read inclusively (conservative); rounded to 0.1 to avoid float artefacts
  return Math.round((phototherapyThreshold - tcb) * 10) / 10 <= 3;
}

/* ---------------- Bilirubin/albumin ratio (AAP 2022, retained from 2004) ---------------- */
/** B/A ratio (mg/dL ÷ g/dL) at which exchange should be considered — used WITH, never instead of, TSB. */
export function baRatioThreshold(gaWeeks: number, withRiskFactors: boolean): number {
  const term = Math.floor(gaWeeks) >= 38;
  if (term && !withRiskFactors) return 8.0;
  if (term || !withRiskFactors) return 7.2;
  return 6.8;
}

/* ---------------- Post-discharge follow-up (AAP 2022 algorithm) ---------------- */
export type FollowUpBand = 'at-or-above' | '0.1-1.9' | '2.0-3.4' | '3.5-5.4' | '5.5-6.9' | '>=7.0' | 'too-early';

export interface FollowUp {
  band: FollowUpBand;
  action: string;
  options?: string[];
}

/**
 * Follow-up when phototherapy was NOT needed during the birth hospitalization.
 * delta = phototherapy threshold − TcB/TSB (mg/dL), measured closest to discharge, at ≥12 h.
 */
export function followUpRecommendation(delta: number, ageHours: number): FollowUp {
  if (ageHours < 12) {
    return {
      band: 'too-early',
      action: 'No evidence-based follow-up guidance for measurements before 12 h — repeat the measurement later.',
    };
  }
  const d = Math.round(delta * 10) / 10;
  if (d <= 0) {
    return {
      band: 'at-or-above',
      action: 'At/above the phototherapy threshold: start phototherapy (confirm a TcB with a TSB first).',
    };
  }
  if (d < 2) {
    if (ageHours < 24) {
      return { band: '0.1-1.9', action: 'Delay discharge, consider phototherapy, measure TSB in 4–8 h.' };
    }
    return {
      band: '0.1-1.9',
      action: 'Measure TSB in 4–24 h.',
      options: [
        'Delay discharge and consider phototherapy',
        'Discharge with home phototherapy if all criteria are met',
        'Discharge without phototherapy but with close follow-up',
      ],
    };
  }
  if (d < 3.5) return { band: '2.0-3.4', action: 'TSB or TcB in 4–24 h.' };
  if (d < 5.5) return { band: '3.5-5.4', action: 'TSB or TcB in 1–2 days.' };
  if (d < 7) {
    return {
      band: '5.5-6.9',
      action: ageHours < 72 ? 'Follow-up within 2 days; TcB or TSB per clinical judgment.' : 'Clinical judgment.',
    };
  }
  return {
    band: '>=7.0',
    action: ageHours < 72 ? 'Follow-up within 3 days; TcB or TSB per clinical judgment.' : 'Clinical judgment.',
  };
}

/* ---------------- Home phototherapy eligibility (AAP 2022) ---------------- */
export const HOME_PHOTOTHERAPY_CRITERIA = [
  'Gestational age ≥38 weeks',
  'Age ≥48 hours',
  'Clinically well with adequate feeding',
  'No known hyperbilirubinemia neurotoxicity risk factors',
  'No previous phototherapy',
  'TSB no more than 1 mg/dL above the phototherapy threshold',
  'An LED-based home device is available without delay',
  'TSB can be measured daily',
] as const;

/* ---------------- Preterm < 35 weeks (Maisels et al., J Perinatol 2012) ---------------- */
export interface PretermRow {
  label: string;
  minWeeks: number;
  maxWeeks: number; // exclusive
  phototherapy: [number, number];
  exchange: [number, number];
}

export const PRETERM_TABLE: PretermRow[] = [
  { label: '<28 0/7', minWeeks: 0, maxWeeks: 28, phototherapy: [5, 6], exchange: [11, 14] },
  { label: '28 0/7 – 29 6/7', minWeeks: 28, maxWeeks: 30, phototherapy: [6, 8], exchange: [12, 14] },
  { label: '30 0/7 – 31 6/7', minWeeks: 30, maxWeeks: 32, phototherapy: [8, 10], exchange: [13, 16] },
  { label: '32 0/7 – 33 6/7', minWeeks: 32, maxWeeks: 34, phototherapy: [10, 12], exchange: [15, 18] },
  { label: '34 0/7 – 34 6/7', minWeeks: 34, maxWeeks: 35, phototherapy: [12, 14], exchange: [17, 19] },
];

/** Uses postmenstrual age (GA at birth + postnatal age), per the table's footnote. */
export function pretermRow(postmenstrualWeeks: number): PretermRow | null {
  return PRETERM_TABLE.find((r) => postmenstrualWeeks >= r.minWeeks && postmenstrualWeeks < r.maxWeeks) ?? null;
}

/* ---------------- NICE CG98 threshold table, babies ≥38 weeks (µmol/L) ---------------- */
export const NICE_38_TABLE: { h: number; photo: number; exchange: number }[] = [
  { h: 0, photo: 100, exchange: 100 },
  { h: 6, photo: 125, exchange: 150 },
  { h: 12, photo: 150, exchange: 200 },
  { h: 18, photo: 175, exchange: 250 },
  { h: 24, photo: 200, exchange: 300 },
  { h: 30, photo: 212, exchange: 350 },
  { h: 36, photo: 225, exchange: 400 },
  { h: 42, photo: 237, exchange: 450 },
  { h: 48, photo: 250, exchange: 450 },
  { h: 54, photo: 262, exchange: 450 },
  { h: 60, photo: 275, exchange: 450 },
  { h: 66, photo: 287, exchange: 450 },
  { h: 72, photo: 300, exchange: 450 },
  { h: 78, photo: 312, exchange: 450 },
  { h: 84, photo: 325, exchange: 450 },
  { h: 90, photo: 337, exchange: 450 },
  { h: 96, photo: 350, exchange: 450 },
];

/** NICE ≥38-week thresholds in µmol/L, linear between table rows (as on the NICE graph), flat ≥96 h. */
export function nice38Thresholds(ageHours: number): { photo: number; exchange: number } | null {
  if (!Number.isFinite(ageHours) || ageHours < 0) return null;
  const t = NICE_38_TABLE;
  if (ageHours >= 96) return { photo: 350, exchange: 450 };
  const i = t.findIndex((r) => r.h > ageHours) - 1;
  const a = t[i];
  const b = t[i + 1];
  if (ageHours === a.h) return { photo: a.photo, exchange: a.exchange };
  const f = (ageHours - a.h) / (b.h - a.h);
  return { photo: a.photo + f * (b.photo - a.photo), exchange: a.exchange + f * (b.exchange - a.exchange) };
}

/* ---------------- Stopping phototherapy ---------------- */
export function stopPhototherapyAt(thresholdAtStart: number) {
  return {
    /** AAP 2022: an option is to stop once TSB is ≥2 mg/dL below the threshold at initiation. */
    aap: thresholdAtStart - 2,
  };
}

/* ---------------- Rebound check after phototherapy (AAP 2022) ---------------- */
export function reboundPlan(opts: { startedBefore48h: boolean; hemolysis: boolean; readmitted: boolean }): string {
  if (opts.readmitted && !opts.hemolysis && !opts.startedBefore48h) {
    return 'Readmitted infant: bilirubin 1–2 days after stopping, or clinical follow-up 1–2 days after stopping.';
  }
  if (opts.startedBefore48h || opts.hemolysis) {
    return 'Higher rebound risk: measure TSB 6–12 h after stopping AND again the next day.';
  }
  return 'Measure bilirubin the day after stopping (TcB acceptable if ≥24 h since phototherapy).';
}

/** Hourly AAP 2022 thresholds, Supplemental Tables 1–4 (Kemper et al., e2022058859). */
import data from './aap2022-hourly.json';

export const MIN_HOURS = 1;
export const MAX_HOURS = 336;
export const ESCALATION_OFFSET = 2;
export type Curve = readonly (number | null)[];

export const PHOTO_NO_RF = data.phototherapy.noRisk;
export const PHOTO_RF = data.phototherapy.risk;
export const EXCHANGE_NO_RF = data.exchange.noRisk;
export const EXCHANGE_RF = data.exchange.risk;

export type ValueStatus = 'ok' | 'too-early' | 'too-late' | 'not-applicable';

export interface ThresholdValue {
  /** mg/dL; null when the tables do not apply. */
  value: number | null;
  status: ValueStatus;
  /** Published completed-hour row used for the result. */
  completedHour?: number;
  note?: string;
}

export interface Aap2022Thresholds {
  phototherapy: ThresholdValue;
  escalation: ThresholdValue;
  exchange: ThresholdValue;
  phototherapyCurveLabel: string;
  exchangeCurveLabel: string;
}

export function gaKey(gaWeeks: number, withRiskFactors: boolean): number {
  return Math.min(withRiskFactors ? 38 : 40, Math.floor(gaWeeks));
}

function validGa(gaWeeks: number): boolean {
  return Number.isFinite(gaWeeks) && Math.floor(gaWeeks) >= 35;
}

export function phototherapyCurve(gaWeeks: number, withRiskFactors: boolean): Curve | null {
  if (!validGa(gaWeeks)) return null;
  const k = gaKey(gaWeeks, withRiskFactors);
  return withRiskFactors ? PHOTO_RF[k as keyof typeof PHOTO_RF] : PHOTO_NO_RF[k as keyof typeof PHOTO_NO_RF];
}

export function exchangeCurve(gaWeeks: number, withRiskFactors: boolean): Curve | null {
  if (!validGa(gaWeeks)) return null;
  const k = Math.min(38, Math.floor(gaWeeks)) as keyof typeof EXCHANGE_NO_RF;
  return withRiskFactors ? EXCHANGE_RF[k] : EXCHANGE_NO_RF[k];
}

export function evaluateCurve(curve: Curve | null, ageHours: number): ThresholdValue {
  if (!curve || !Number.isFinite(ageHours)) {
    return { value: null, status: 'not-applicable', note: 'AAP 2022 thresholds require a valid age and gestational age of at least 35 weeks.' };
  }
  if (ageHours < MIN_HOURS) return { value: null, status: 'too-early', note: 'The first published treatment row is 1 completed hour; there is no hour-0 value.' };
  if (ageHours > MAX_HOURS) return { value: null, status: 'too-late', note: 'AAP 2022 supplemental tables end at 336 hours (14 days).' };
  const completedHour = Math.floor(ageHours);
  return { value: curve[completedHour], status: 'ok', completedHour };
}

export function curveLabel(gaWeeks: number, withRiskFactors: boolean, kind: 'photo' | 'exchange', risingDespitePhototherapy = false): string {
  if (!validGa(gaWeeks)) return 'AAP 2022 curves do not apply below 35 weeks';
  const top = kind === 'photo' && !withRiskFactors ? 40 : 38;
  const k = Math.min(top, Math.floor(gaWeeks));
  const ga = k === top ? `≥${k} wk` : `${k} wk`;
  if (kind === 'exchange' && risingDespitePhototherapy && !withRiskFactors) return `${ga}, rising TSB despite phototherapy (Table 4)`;
  return `${ga}, ${withRiskFactors ? '≥1 additional neurotoxicity risk factor' : 'no additional neurotoxicity risk factors'}`;
}

export function aap2022Thresholds(gaWeeks: number, ageHours: number, withRiskFactors: boolean, risingDespitePhototherapy = false): Aap2022Thresholds {
  const phototherapy = evaluateCurve(phototherapyCurve(gaWeeks, withRiskFactors), ageHours);
  const exchange = evaluateCurve(exchangeCurve(gaWeeks, withRiskFactors || risingDespitePhototherapy), ageHours);
  const escalation = exchange.value == null ? exchange : {
    ...exchange,
    value: Math.round((exchange.value - ESCALATION_OFFSET) * 10) / 10,
    note: 'Escalation-of-care threshold = exchange threshold − 2 mg/dL (KAS 17).',
  };
  return {
    phototherapy, escalation, exchange,
    phototherapyCurveLabel: curveLabel(gaWeeks, withRiskFactors, 'photo'),
    exchangeCurveLabel: curveLabel(gaWeeks, withRiskFactors, 'exchange', risingDespitePhototherapy),
  };
}

/** Chart samples use official hourly rows, not interpolated anchor thresholds. */
export function sampleCurve(curve: Curve | null, fromH = MIN_HOURS, toH = 168, step = 1): { h: number; v: number }[] {
  if (!curve || !Number.isFinite(step) || step <= 0) return [];
  const out: { h: number; v: number }[] = [];
  for (let h = Math.max(MIN_HOURS, fromH); h <= Math.min(MAX_HOURS, toH); h += step) {
    const r = evaluateCurve(curve, h);
    if (r.value != null) out.push({ h, v: r.value });
  }
  return out;
}

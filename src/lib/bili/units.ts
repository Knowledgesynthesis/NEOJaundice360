/** Bilirubin unit handling. 1 mg/dL = 17.1 µmol/L (molar mass of bilirubin 584.7 g/mol). */
export type BiliUnit = 'mgdl' | 'umol';

export const UMOL_PER_MGDL = 17.1;

export const toUmol = (mgdl: number) => mgdl * UMOL_PER_MGDL;
export const toMgdl = (umol: number) => umol / UMOL_PER_MGDL;

/** Convert a mg/dL value to the display unit. */
export const fromMgdl = (mgdl: number, unit: BiliUnit) => (unit === 'mgdl' ? mgdl : toUmol(mgdl));
/** Convert a value entered in the display unit back to mg/dL. */
export const toMgdlFrom = (value: number, unit: BiliUnit) => (unit === 'mgdl' ? value : toMgdl(value));

export const unitLabel = (unit: BiliUnit) => (unit === 'mgdl' ? 'mg/dL' : 'µmol/L');

/** Format a mg/dL value in the chosen unit (1 decimal for mg/dL, integer for µmol/L). */
export function formatBili(mgdl: number | null | undefined, unit: BiliUnit, withUnit = true): string {
  if (mgdl == null || !Number.isFinite(mgdl)) return '—';
  const v = fromMgdl(mgdl, unit);
  const s = unit === 'mgdl' ? v.toFixed(1) : Math.round(v).toString();
  return withUnit ? `${s} ${unitLabel(unit)}` : s;
}

/** Hours between two ISO/datetime-local strings (b − a). Returns null if either is invalid. */
export function hoursBetween(a: string, b: string): number | null {
  const ta = new Date(a).getTime();
  const tb = new Date(b).getTime();
  if (!Number.isFinite(ta) || !Number.isFinite(tb)) return null;
  return (tb - ta) / 3_600_000;
}

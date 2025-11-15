import { NomogramDataPoint, RiskZone } from '@/types';

// Bhutani Nomogram data - Risk zones for hyperbilirubinemia
// Based on hour-specific bilirubin percentiles

export const nomogramZones: NomogramDataPoint[][] = [
  // High Risk Zone (>95th percentile)
  [
    { ageInHours: 0, bilirubin: 0, zone: 'high' },
    { ageInHours: 12, bilirubin: 6, zone: 'high' },
    { ageInHours: 18, bilirubin: 8, zone: 'high' },
    { ageInHours: 24, bilirubin: 10, zone: 'high' },
    { ageInHours: 36, bilirubin: 12.5, zone: 'high' },
    { ageInHours: 48, bilirubin: 15, zone: 'high' },
    { ageInHours: 60, bilirubin: 16.5, zone: 'high' },
    { ageInHours: 72, bilirubin: 17.5, zone: 'high' },
    { ageInHours: 96, bilirubin: 19, zone: 'high' },
    { ageInHours: 120, bilirubin: 20, zone: 'high' },
  ],
  // High-Intermediate Zone (75th-95th percentile)
  [
    { ageInHours: 0, bilirubin: 0, zone: 'high-intermediate' },
    { ageInHours: 12, bilirubin: 5, zone: 'high-intermediate' },
    { ageInHours: 18, bilirubin: 6.5, zone: 'high-intermediate' },
    { ageInHours: 24, bilirubin: 8, zone: 'high-intermediate' },
    { ageInHours: 36, bilirubin: 10, zone: 'high-intermediate' },
    { ageInHours: 48, bilirubin: 11.5, zone: 'high-intermediate' },
    { ageInHours: 60, bilirubin: 13, zone: 'high-intermediate' },
    { ageInHours: 72, bilirubin: 14, zone: 'high-intermediate' },
    { ageInHours: 96, bilirubin: 15.5, zone: 'high-intermediate' },
    { ageInHours: 120, bilirubin: 16.5, zone: 'high-intermediate' },
  ],
  // Low-Intermediate Zone (40th-75th percentile)
  [
    { ageInHours: 0, bilirubin: 0, zone: 'low-intermediate' },
    { ageInHours: 12, bilirubin: 3.5, zone: 'low-intermediate' },
    { ageInHours: 18, bilirubin: 5, zone: 'low-intermediate' },
    { ageInHours: 24, bilirubin: 6, zone: 'low-intermediate' },
    { ageInHours: 36, bilirubin: 7.5, zone: 'low-intermediate' },
    { ageInHours: 48, bilirubin: 9, zone: 'low-intermediate' },
    { ageInHours: 60, bilirubin: 10, zone: 'low-intermediate' },
    { ageInHours: 72, bilirubin: 11, zone: 'low-intermediate' },
    { ageInHours: 96, bilirubin: 12, zone: 'low-intermediate' },
    { ageInHours: 120, bilirubin: 13, zone: 'low-intermediate' },
  ],
  // Low Risk Zone (<40th percentile)
  [
    { ageInHours: 0, bilirubin: 0, zone: 'low' },
    { ageInHours: 12, bilirubin: 2, zone: 'low' },
    { ageInHours: 18, bilirubin: 3, zone: 'low' },
    { ageInHours: 24, bilirubin: 4, zone: 'low' },
    { ageInHours: 36, bilirubin: 5, zone: 'low' },
    { ageInHours: 48, bilirubin: 6, zone: 'low' },
    { ageInHours: 60, bilirubin: 7, zone: 'low' },
    { ageInHours: 72, bilirubin: 7.5, zone: 'low' },
    { ageInHours: 96, bilirubin: 8.5, zone: 'low' },
    { ageInHours: 120, bilirubin: 9, zone: 'low' },
  ],
];

export function determineRiskZone(ageInHours: number, bilirubin: number): RiskZone {
  // Determine which risk zone a given bilirubin level falls into

  if (ageInHours < 0 || ageInHours > 120) {
    // Outside nomogram range
    return 'low';
  }

  // Find the bilirubin thresholds for this age
  const highZone = nomogramZones[0];
  const highIntZone = nomogramZones[1];
  const lowIntZone = nomogramZones[2];

  const highThreshold = interpolate(highZone, ageInHours);
  const highIntThreshold = interpolate(highIntZone, ageInHours);
  const lowIntThreshold = interpolate(lowIntZone, ageInHours);

  if (bilirubin >= highThreshold) {
    return 'high';
  } else if (bilirubin >= highIntThreshold) {
    return 'high-intermediate';
  } else if (bilirubin >= lowIntThreshold) {
    return 'low-intermediate';
  } else {
    return 'low';
  }
}

function interpolate(zone: NomogramDataPoint[], ageInHours: number): number {
  // Find the two points to interpolate between
  let lower = zone[0];
  let upper = zone[zone.length - 1];

  for (let i = 0; i < zone.length - 1; i++) {
    if (ageInHours >= zone[i].ageInHours && ageInHours <= zone[i + 1].ageInHours) {
      lower = zone[i];
      upper = zone[i + 1];
      break;
    }
  }

  // Linear interpolation
  const ageDiff = upper.ageInHours - lower.ageInHours;
  const bilirubinDiff = upper.bilirubin - lower.bilirubin;
  const ageOffset = ageInHours - lower.ageInHours;

  return lower.bilirubin + (bilirubinDiff * ageOffset) / ageDiff;
}

export function getRiskZoneDescription(zone: RiskZone): string {
  const descriptions: Record<RiskZone, string> = {
    'low': 'Low risk (<40th percentile) - Routine follow-up recommended',
    'low-intermediate': 'Low-intermediate risk (40th-75th percentile) - Close follow-up recommended',
    'high-intermediate': 'High-intermediate risk (75th-95th percentile) - Closer follow-up and possible intervention',
    'high': 'High risk (>95th percentile) - Immediate evaluation and likely intervention needed'
  };

  return descriptions[zone];
}

export function getRiskZoneColor(zone: RiskZone): string {
  const colors: Record<RiskZone, string> = {
    'low': '#22c55e',      // green
    'low-intermediate': '#eab308',  // yellow
    'high-intermediate': '#f97316', // orange
    'high': '#ef4444'      // red
  };

  return colors[zone];
}

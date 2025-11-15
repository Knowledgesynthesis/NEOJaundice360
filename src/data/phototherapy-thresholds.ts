import { PhototherapyThreshold } from '@/types';

// AAP 2022 Phototherapy Thresholds for infants ≥35 weeks gestation
export const phototherapyThresholds: PhototherapyThreshold[] = [
  { ageInHours: 12, lowRisk: 6, mediumRisk: 5, highRisk: 4 },
  { ageInHours: 18, lowRisk: 8, mediumRisk: 7, highRisk: 5 },
  { ageInHours: 24, lowRisk: 10, mediumRisk: 8, highRisk: 6 },
  { ageInHours: 30, lowRisk: 11, mediumRisk: 9, highRisk: 7 },
  { ageInHours: 36, lowRisk: 12, mediumRisk: 10, highRisk: 8 },
  { ageInHours: 42, lowRisk: 13, mediumRisk: 11, highRisk: 8.5 },
  { ageInHours: 48, lowRisk: 14, mediumRisk: 12, highRisk: 9 },
  { ageInHours: 54, lowRisk: 14.5, mediumRisk: 12.5, highRisk: 9.5 },
  { ageInHours: 60, lowRisk: 15, mediumRisk: 13, highRisk: 10 },
  { ageInHours: 66, lowRisk: 15.5, mediumRisk: 13.5, highRisk: 10 },
  { ageInHours: 72, lowRisk: 16, mediumRisk: 14, highRisk: 10.5 },
  { ageInHours: 84, lowRisk: 16.5, mediumRisk: 14.5, highRisk: 11 },
  { ageInHours: 96, lowRisk: 17, mediumRisk: 15, highRisk: 11.5 },
  { ageInHours: 108, lowRisk: 17.5, mediumRisk: 15.5, highRisk: 12 },
  { ageInHours: 120, lowRisk: 18, mediumRisk: 16, highRisk: 12.5 },
];

// Exchange transfusion thresholds (typically 2-3 mg/dL above phototherapy threshold)
export const exchangeThresholds: PhototherapyThreshold[] = [
  { ageInHours: 12, lowRisk: 9, mediumRisk: 8, highRisk: 7 },
  { ageInHours: 18, lowRisk: 11, mediumRisk: 10, highRisk: 8 },
  { ageInHours: 24, lowRisk: 13, mediumRisk: 11, highRisk: 9 },
  { ageInHours: 30, lowRisk: 14, mediumRisk: 12, highRisk: 10 },
  { ageInHours: 36, lowRisk: 15, mediumRisk: 13, highRisk: 11 },
  { ageInHours: 42, lowRisk: 16, mediumRisk: 14, highRisk: 11.5 },
  { ageInHours: 48, lowRisk: 17, mediumRisk: 15, highRisk: 12 },
  { ageInHours: 72, lowRisk: 19, mediumRisk: 17, highRisk: 13.5 },
  { ageInHours: 96, lowRisk: 20, mediumRisk: 18, highRisk: 14.5 },
  { ageInHours: 120, lowRisk: 21, mediumRisk: 19, highRisk: 15.5 },
];

export type RiskCategory = 'low' | 'medium' | 'high';

export interface RiskFactors {
  gestationalAge: number;
  hasIsoimmune: boolean;
  hasG6PD: boolean;
  hasAsphyxia: boolean;
  hasLethargy: boolean;
  hasInstability: boolean;
  hasAlbumin: boolean; // <3 g/dL
}

export function calculateRiskCategory(factors: RiskFactors): RiskCategory {
  const { gestationalAge, hasIsoimmune, hasG6PD, hasAsphyxia, hasLethargy, hasInstability, hasAlbumin } = factors;

  // High risk factors
  const highRiskFactors = [
    hasIsoimmune,
    hasG6PD,
    hasAsphyxia,
    hasLethargy,
    hasInstability,
    hasAlbumin
  ].filter(Boolean).length;

  if (highRiskFactors > 0) {
    return 'high';
  }

  // Medium risk: 35-37 6/7 weeks AND other factors OR 38+ weeks with complications
  if (gestationalAge >= 35 && gestationalAge < 38) {
    return 'medium';
  }

  // Low risk: ≥38 weeks AND well
  return 'low';
}

export function getPhototherapyThreshold(ageInHours: number, riskCategory: RiskCategory): number {
  const threshold = phototherapyThresholds.find(t => t.ageInHours >= ageInHours);

  if (!threshold) {
    // Use last threshold if beyond range
    const lastThreshold = phototherapyThresholds[phototherapyThresholds.length - 1];
    return riskCategory === 'low' ? lastThreshold.lowRisk :
           riskCategory === 'medium' ? lastThreshold.mediumRisk :
           lastThreshold.highRisk;
  }

  return riskCategory === 'low' ? threshold.lowRisk :
         riskCategory === 'medium' ? threshold.mediumRisk :
         threshold.highRisk;
}

export function getExchangeThreshold(ageInHours: number, riskCategory: RiskCategory): number {
  const threshold = exchangeThresholds.find(t => t.ageInHours >= ageInHours);

  if (!threshold) {
    const lastThreshold = exchangeThresholds[exchangeThresholds.length - 1];
    return riskCategory === 'low' ? lastThreshold.lowRisk :
           riskCategory === 'medium' ? lastThreshold.mediumRisk :
           lastThreshold.highRisk;
  }

  return riskCategory === 'low' ? threshold.lowRisk :
         riskCategory === 'medium' ? threshold.mediumRisk :
         threshold.highRisk;
}

export function shouldStartPhototherapy(
  totalBilirubin: number,
  ageInHours: number,
  riskCategory: RiskCategory
): boolean {
  const threshold = getPhototherapyThreshold(ageInHours, riskCategory);
  return totalBilirubin >= threshold;
}

export function needsExchangeTransfusion(
  totalBilirubin: number,
  ageInHours: number,
  riskCategory: RiskCategory
): boolean {
  const threshold = getExchangeThreshold(ageInHours, riskCategory);
  return totalBilirubin >= threshold;
}

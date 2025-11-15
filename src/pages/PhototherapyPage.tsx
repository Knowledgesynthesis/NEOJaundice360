import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  calculateRiskCategory,
  getPhototherapyThreshold,
  getExchangeThreshold,
  shouldStartPhototherapy,
  needsExchangeTransfusion,
  RiskCategory
} from '@/data/phototherapy-thresholds';
import { AlertCircle, CheckCircle, Lightbulb } from 'lucide-react';

export default function PhototherapyPage() {
  const [ageInHours, setAgeInHours] = useState<number>(48);
  const [totalBilirubin, setTotalBilirubin] = useState<number>(12);
  const [gestationalAge, setGestationalAge] = useState<number>(38);
  const [hasIsoimmune, setHasIsoimmune] = useState(false);
  const [hasG6PD, setHasG6PD] = useState(false);
  const [hasAsphyxia, setHasAsphyxia] = useState(false);
  const [hasLethargy, setHasLethargy] = useState(false);
  const [hasInstability, setHasInstability] = useState(false);
  const [hasLowAlbumin, setHasLowAlbumin] = useState(false);

  const [result, setResult] = useState<{
    riskCategory: RiskCategory;
    photoThreshold: number;
    exchangeThreshold: number;
    needsPhoto: boolean;
    needsExchange: boolean;
  } | null>(null);

  const handleCalculate = () => {
    const riskFactors = {
      gestationalAge,
      hasIsoimmune,
      hasG6PD,
      hasAsphyxia,
      hasLethargy,
      hasInstability,
      hasAlbumin: hasLowAlbumin
    };

    const riskCategory = calculateRiskCategory(riskFactors);
    const photoThreshold = getPhototherapyThreshold(ageInHours, riskCategory);
    const exchangeThreshold = getExchangeThreshold(ageInHours, riskCategory);
    const needsPhoto = shouldStartPhototherapy(totalBilirubin, ageInHours, riskCategory);
    const needsExchange = needsExchangeTransfusion(totalBilirubin, ageInHours, riskCategory);

    setResult({
      riskCategory,
      photoThreshold,
      exchangeThreshold,
      needsPhoto,
      needsExchange
    });
  };

  const getRiskColor = (category: RiskCategory) => {
    if (category === 'high') return 'destructive';
    if (category === 'medium') return 'warning';
    return 'success';
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Phototherapy Calculator</h1>
        <p className="text-muted-foreground">
          AAP guideline-based phototherapy and exchange transfusion thresholds
        </p>
      </div>

      {/* Info */}
      <Card>
        <CardHeader>
          <CardTitle>About AAP Guidelines</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p>
            This calculator uses the American Academy of Pediatrics (AAP) 2022 guidelines for
            management of hyperbilirubinemia in newborns ≥35 weeks gestation.
          </p>
          <p>
            Treatment thresholds are based on the infant's age in hours, total serum bilirubin
            level, and risk factors for neurotoxicity.
          </p>
        </CardContent>
      </Card>

      {/* Calculator */}
      <Card className="border-primary">
        <CardHeader>
          <CardTitle>Calculate Treatment Thresholds</CardTitle>
          <CardDescription>Enter infant data to determine recommendations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Info */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Age (hours)</label>
              <input
                type="number"
                value={ageInHours}
                onChange={(e) => setAgeInHours(Number(e.target.value))}
                min="0"
                max="120"
                className="w-full px-3 py-2 rounded-md border bg-background"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Total Bilirubin (mg/dL)</label>
              <input
                type="number"
                value={totalBilirubin}
                onChange={(e) => setTotalBilirubin(Number(e.target.value))}
                min="0"
                max="30"
                step="0.1"
                className="w-full px-3 py-2 rounded-md border bg-background"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Gestational Age (weeks)</label>
              <input
                type="number"
                value={gestationalAge}
                onChange={(e) => setGestationalAge(Number(e.target.value))}
                min="35"
                max="42"
                step="0.1"
                className="w-full px-3 py-2 rounded-md border bg-background"
              />
              <p className="text-xs text-muted-foreground">Calculator valid for ≥35 weeks</p>
            </div>
          </div>

          {/* Risk Factors */}
          <div>
            <h4 className="font-semibold mb-3">Neurotoxicity Risk Factors</h4>
            <div className="grid md:grid-cols-2 gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasIsoimmune}
                  onChange={(e) => setHasIsoimmune(e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm">Isoimmune hemolytic disease</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasG6PD}
                  onChange={(e) => setHasG6PD(e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm">G6PD deficiency</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasAsphyxia}
                  onChange={(e) => setHasAsphyxia(e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm">Asphyxia</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasLethargy}
                  onChange={(e) => setHasLethargy(e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm">Lethargy</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasInstability}
                  onChange={(e) => setHasInstability(e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm">Temperature instability</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasLowAlbumin}
                  onChange={(e) => setHasLowAlbumin(e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm">Albumin &lt;3 g/dL</span>
              </label>
            </div>
          </div>

          <Button onClick={handleCalculate} className="w-full">
            Calculate Thresholds
          </Button>

          {/* Results */}
          {result && (
            <div className="space-y-4">
              <div className="p-4 rounded-lg border bg-muted">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold">Risk Category:</span>
                  <Badge variant={getRiskColor(result.riskCategory)}>
                    {result.riskCategory.toUpperCase()}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Based on gestational age and neurotoxicity risk factors
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg border">
                  <div className="flex items-center gap-2 mb-2">
                    <Lightbulb className="h-5 w-5 text-blue-500" />
                    <span className="font-semibold">Phototherapy Threshold</span>
                  </div>
                  <p className="text-2xl font-bold mb-1">{result.photoThreshold.toFixed(1)} mg/dL</p>
                  <p className="text-sm text-muted-foreground">
                    For infant at {ageInHours} hours
                  </p>
                </div>

                <div className="p-4 rounded-lg border border-red-500/50">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="h-5 w-5 text-red-500" />
                    <span className="font-semibold">Exchange Threshold</span>
                  </div>
                  <p className="text-2xl font-bold mb-1">{result.exchangeThreshold.toFixed(1)} mg/dL</p>
                  <p className="text-sm text-muted-foreground">
                    Consider if phototherapy fails
                  </p>
                </div>
              </div>

              {/* Recommendation */}
              {result.needsExchange ? (
                <div className="p-4 rounded-lg bg-red-500/20 border border-red-500">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-6 w-6 text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-lg mb-1">URGENT: Exchange Transfusion Indicated</p>
                      <p className="text-sm">
                        Bilirubin {totalBilirubin} mg/dL exceeds exchange threshold of {result.exchangeThreshold.toFixed(1)} mg/dL.
                        Consider IVIG if isoimmune hemolytic disease. Prepare for double-volume exchange transfusion.
                      </p>
                    </div>
                  </div>
                </div>
              ) : result.needsPhoto ? (
                <div className="p-4 rounded-lg bg-yellow-500/20 border border-yellow-500">
                  <div className="flex items-start gap-3">
                    <Lightbulb className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-lg mb-1">Phototherapy Indicated</p>
                      <p className="text-sm">
                        Bilirubin {totalBilirubin} mg/dL exceeds phototherapy threshold of {result.photoThreshold.toFixed(1)} mg/dL.
                        Initiate intensive phototherapy and recheck bilirubin in 4-6 hours.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-lg bg-green-500/20 border border-green-500">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-lg mb-1">Below Treatment Threshold</p>
                      <p className="text-sm">
                        Current bilirubin {totalBilirubin} mg/dL is below phototherapy threshold.
                        Continue monitoring per clinical protocol. Recheck based on risk zone and trajectory.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Management Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Phototherapy Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div>
            <h4 className="font-semibold mb-2">Intensive Phototherapy</h4>
            <ul className="space-y-1 ml-4 list-disc">
              <li>Use high-intensity blue-green light (420-470 nm)</li>
              <li>Maximum skin surface exposure (remove all clothing except diaper)</li>
              <li>Place lights close to infant (per manufacturer guidelines)</li>
              <li>Use multiple light sources if available</li>
              <li>Protect eyes with appropriate shields</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Monitoring</h4>
            <ul className="space-y-1 ml-4 list-disc">
              <li>Recheck bilirubin 4-6 hours after starting phototherapy</li>
              <li>Continue frequent monitoring until declining trend established</li>
              <li>Monitor hydration status and ensure adequate feeding</li>
              <li>Watch for side effects: loose stools, skin rash, temperature instability</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">When to Consider IVIG</h4>
            <ul className="space-y-1 ml-4 list-disc">
              <li>Isoimmune hemolytic disease (Rh or ABO)</li>
              <li>Bilirubin rising despite intensive phototherapy</li>
              <li>Bilirubin within 2-3 mg/dL of exchange level</li>
              <li>Dose: 0.5-1 g/kg IV over 2 hours</li>
              <li>May repeat in 12 hours if needed</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Exchange Transfusion */}
      <Card className="border-red-500/50">
        <CardHeader>
          <CardTitle className="text-red-600 dark:text-red-400">Exchange Transfusion</CardTitle>
          <CardDescription>Reserved for severe cases</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div>
            <h4 className="font-semibold mb-2">Indications</h4>
            <ul className="space-y-1 ml-4 list-disc">
              <li>Bilirubin at or above exchange threshold despite phototherapy + IVIG</li>
              <li>Signs of acute bilirubin encephalopathy at any bilirubin level</li>
              <li>Rapidly rising bilirubin (≥1 mg/dL/hour) despite treatment</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Procedure</h4>
            <ul className="space-y-1 ml-4 list-disc">
              <li>Double-volume exchange (160-200 mL/kg total blood volume)</li>
              <li>Removes bilirubin and antibodies (if isoimmune)</li>
              <li>Performed in NICU with experienced team</li>
              <li>Continue phototherapy during and after procedure</li>
            </ul>
          </div>

          <div className="bg-yellow-500/10 border border-yellow-500/30 p-3 rounded-lg">
            <p className="font-medium mb-1">Important:</p>
            <p>
              Exchange transfusion carries significant risks (infection, electrolyte abnormalities,
              hemodynamic instability). Should only be performed when absolutely necessary and by
              experienced practitioners.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

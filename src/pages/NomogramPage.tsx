import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceDot } from 'recharts';
import { nomogramZones, determineRiskZone, getRiskZoneDescription, getRiskZoneColor } from '@/data/nomogram-data';
import { RiskZone } from '@/types';

export default function NomogramPage() {
  const [ageInHours, setAgeInHours] = useState<number>(48);
  const [bilirubin, setBilirubin] = useState<number>(10);
  const [riskZone, setRiskZone] = useState<RiskZone>('low');

  const handleCalculate = () => {
    const zone = determineRiskZone(ageInHours, bilirubin);
    setRiskZone(zone);
  };

  // Prepare chart data
  const chartData = nomogramZones[0].map((_, index) => {
    return {
      age: nomogramZones[0][index].ageInHours,
      high: nomogramZones[0][index].bilirubin,
      highInt: nomogramZones[1][index].bilirubin,
      lowInt: nomogramZones[2][index].bilirubin,
      low: nomogramZones[3][index].bilirubin,
    };
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Bhutani Nomogram</h1>
        <p className="text-muted-foreground">
          Hour-specific bilirubin nomogram for risk stratification
        </p>
      </div>

      {/* Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>About the Nomogram</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p>
            The Bhutani nomogram is an hour-specific bilirubin nomogram used to assess the risk
            of subsequent significant hyperbilirubinemia in healthy term and near-term newborns
            (≥35 weeks gestation).
          </p>
          <p>
            Bilirubin levels are plotted against the infant's postnatal age in hours to determine
            which risk zone the infant falls into. This helps predict the risk of developing
            severe hyperbilirubinemia and guides follow-up recommendations.
          </p>
        </CardContent>
      </Card>

      {/* Calculator */}
      <Card className="border-primary">
        <CardHeader>
          <CardTitle>Nomogram Calculator</CardTitle>
          <CardDescription>Enter values to determine risk zone</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
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
              <p className="text-xs text-muted-foreground">Valid range: 0-120 hours</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Total Bilirubin (mg/dL)</label>
              <input
                type="number"
                value={bilirubin}
                onChange={(e) => setBilirubin(Number(e.target.value))}
                min="0"
                max="25"
                step="0.1"
                className="w-full px-3 py-2 rounded-md border bg-background"
              />
              <p className="text-xs text-muted-foreground">Enter total serum bilirubin</p>
            </div>
          </div>

          <Button onClick={handleCalculate} className="w-full">
            Calculate Risk Zone
          </Button>

          {riskZone && (
            <div className="p-4 rounded-lg border" style={{ borderColor: getRiskZoneColor(riskZone), backgroundColor: `${getRiskZoneColor(riskZone)}15` }}>
              <div className="flex items-center gap-2 mb-2">
                <Badge style={{ backgroundColor: getRiskZoneColor(riskZone), color: 'white' }}>
                  {riskZone.toUpperCase().replace('-', ' ')}
                </Badge>
                <span className="font-semibold">Risk Zone</span>
              </div>
              <p className="text-sm">{getRiskZoneDescription(riskZone)}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Nomogram Chart</CardTitle>
          <CardDescription>Hour-specific bilirubin risk zones</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="age"
                  label={{ value: 'Age (hours)', position: 'insideBottom', offset: -5 }}
                  className="text-sm"
                />
                <YAxis
                  label={{ value: 'Bilirubin (mg/dL)', angle: -90, position: 'insideLeft' }}
                  className="text-sm"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px'
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="high"
                  stroke="#ef4444"
                  strokeWidth={2}
                  name="High Risk (>95th)"
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="highInt"
                  stroke="#f97316"
                  strokeWidth={2}
                  name="High-Int (75-95th)"
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="lowInt"
                  stroke="#eab308"
                  strokeWidth={2}
                  name="Low-Int (40-75th)"
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="low"
                  stroke="#22c55e"
                  strokeWidth={2}
                  name="Low Risk (<40th)"
                  dot={false}
                />
                <ReferenceDot
                  x={ageInHours}
                  y={bilirubin}
                  r={6}
                  fill="hsl(var(--primary))"
                  stroke="white"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Risk Zone Descriptions */}
      <Card>
        <CardHeader>
          <CardTitle>Risk Zone Interpretations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-3 rounded-lg border border-red-500/50 bg-red-500/10">
            <div className="flex items-center gap-2 mb-2">
              <Badge style={{ backgroundColor: '#ef4444', color: 'white' }}>HIGH RISK</Badge>
              <span className="font-semibold">&gt;95th percentile</span>
            </div>
            <p className="text-sm">
              <strong>Follow-up:</strong> Evaluate and treat within 24 hours. Likely needs phototherapy.
              Consider evaluation for pathologic causes.
            </p>
          </div>

          <div className="p-3 rounded-lg border border-orange-500/50 bg-orange-500/10">
            <div className="flex items-center gap-2 mb-2">
              <Badge style={{ backgroundColor: '#f97316', color: 'white' }}>HIGH-INTERMEDIATE</Badge>
              <span className="font-semibold">75th-95th percentile</span>
            </div>
            <p className="text-sm">
              <strong>Follow-up:</strong> Evaluate within 24-48 hours. Consider risk factors and
              phototherapy thresholds.
            </p>
          </div>

          <div className="p-3 rounded-lg border border-yellow-500/50 bg-yellow-500/10">
            <div className="flex items-center gap-2 mb-2">
              <Badge style={{ backgroundColor: '#eab308', color: 'white' }}>LOW-INTERMEDIATE</Badge>
              <span className="font-semibold">40th-75th percentile</span>
            </div>
            <p className="text-sm">
              <strong>Follow-up:</strong> Routine follow-up per discharge recommendations (typically
              within 3-5 days).
            </p>
          </div>

          <div className="p-3 rounded-lg border border-green-500/50 bg-green-500/10">
            <div className="flex items-center gap-2 mb-2">
              <Badge style={{ backgroundColor: '#22c55e', color: 'white' }}>LOW RISK</Badge>
              <span className="font-semibold">&lt;40th percentile</span>
            </div>
            <p className="text-sm">
              <strong>Follow-up:</strong> Routine follow-up per discharge recommendations. Very low
              likelihood of developing severe hyperbilirubinemia.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Clinical Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Clinical Notes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p><strong>Applicable to:</strong> Healthy infants ≥35 weeks gestation</p>
          <p><strong>Not applicable to:</strong> Infants &lt;35 weeks, those with hemolytic disease, or significant illness</p>
          <p><strong>Important:</strong> The nomogram predicts risk but does not replace clinical judgment or treatment thresholds</p>
          <p><strong>Follow-up timing:</strong> Based on risk zone, age at discharge, and presence of other risk factors</p>
        </CardContent>
      </Card>
    </div>
  );
}

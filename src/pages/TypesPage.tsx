import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { jaundiceEtiologies } from '@/data/jaundice-etiologies';
import { JaundiceEtiology } from '@/types';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function TypesPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getBilirubinColor = (type: string) => {
    if (type === 'conjugated') return 'success';
    if (type === 'unconjugated') return 'warning';
    return 'secondary';
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Types of Neonatal Jaundice</h1>
        <p className="text-muted-foreground">
          Comprehensive overview of jaundice etiologies and their distinguishing features
        </p>
      </div>

      {/* Summary Table */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Reference Table</CardTitle>
          <CardDescription>Compare key features across etiologies</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2 font-semibold">Etiology</th>
                  <th className="text-left p-2 font-semibold">Type</th>
                  <th className="text-left p-2 font-semibold">Onset</th>
                  <th className="text-left p-2 font-semibold">Key Features</th>
                </tr>
              </thead>
              <tbody>
                {jaundiceEtiologies.map((etiology) => (
                  <tr key={etiology.id} className="border-b hover:bg-muted/50">
                    <td className="p-2 font-medium">{etiology.name}</td>
                    <td className="p-2">
                      <Badge variant={getBilirubinColor(etiology.bilirubinType)} className="text-xs">
                        {etiology.bilirubinType}
                      </Badge>
                    </td>
                    <td className="p-2 text-muted-foreground">{etiology.onsetTiming}</td>
                    <td className="p-2 text-muted-foreground">
                      {etiology.keyFeatures[0]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Etiologies */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Detailed Descriptions</h2>

        {jaundiceEtiologies.map((etiology: JaundiceEtiology) => {
          const isExpanded = expandedId === etiology.id;

          return (
            <Card key={etiology.id} className="overflow-hidden">
              <CardHeader className="cursor-pointer" onClick={() => toggleExpand(etiology.id)}>
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CardTitle>{etiology.name}</CardTitle>
                      <Badge variant={getBilirubinColor(etiology.bilirubinType)}>
                        {etiology.bilirubinType}
                      </Badge>
                    </div>
                    <CardDescription>{etiology.onsetTiming}</CardDescription>
                  </div>
                  <Button variant="ghost" size="icon">
                    {isExpanded ? <ChevronUp /> : <ChevronDown />}
                  </Button>
                </div>
              </CardHeader>

              {isExpanded && (
                <CardContent className="space-y-4 border-t pt-4">
                  {/* Key Features */}
                  <div>
                    <h4 className="font-semibold mb-2">Key Features</h4>
                    <ul className="space-y-1">
                      {etiology.keyFeatures.map((feature, idx) => (
                        <li key={idx} className="text-sm flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Common Causes */}
                  <div>
                    <h4 className="font-semibold mb-2">Common Causes</h4>
                    <ul className="space-y-1">
                      {etiology.commonCauses.map((cause, idx) => (
                        <li key={idx} className="text-sm flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span>{cause}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Diagnostic Tests */}
                  <div>
                    <h4 className="font-semibold mb-2">Diagnostic Tests</h4>
                    <div className="flex flex-wrap gap-2">
                      {etiology.diagnosticTests.map((test, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {test}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Management */}
                  <div>
                    <h4 className="font-semibold mb-2">Management</h4>
                    <ul className="space-y-1">
                      {etiology.management.map((mgmt, idx) => (
                        <li key={idx} className="text-sm flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span>{mgmt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>

      {/* Clinical Pearls */}
      <Card className="border-primary">
        <CardHeader>
          <CardTitle>Clinical Pearls</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p><strong>Jaundice &lt;24 hours:</strong> Always pathologic. Evaluate immediately.</p>
          <p><strong>Direct bilirubin &gt;1 mg/dL or &gt;20% of total:</strong> Cholestasis. Urgent evaluation needed.</p>
          <p><strong>Pale stools + jaundice:</strong> Biliary atresia until proven otherwise. Time-sensitive!</p>
          <p><strong>Positive Coombs + spherocytes:</strong> ABO incompatibility.</p>
          <p><strong>Positive Coombs + severe anemia:</strong> Consider Rh disease.</p>
          <p><strong>Thriving breastfed baby with prolonged jaundice:</strong> Likely breast milk jaundice (benign).</p>
          <p><strong>Poor feeding + jaundice in first week:</strong> Breastfeeding failure jaundice (needs lactation support).</p>
        </CardContent>
      </Card>
    </div>
  );
}

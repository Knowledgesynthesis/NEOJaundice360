import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle } from 'lucide-react';

export default function DiagnosisPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Diagnostic Approach</h1>
        <p className="text-muted-foreground">
          Systematic evaluation of neonatal jaundice
        </p>
      </div>

      {/* Red Flags */}
      <Card className="border-red-500/50 bg-red-500/5">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <CardTitle className="text-red-600 dark:text-red-400">Red Flags - Pathologic Jaundice</CardTitle>
          </div>
          <CardDescription>Immediate evaluation required</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <Badge variant="destructive" className="mt-0.5">Critical</Badge>
              <span className="text-sm">Jaundice appearing <strong>within first 24 hours of life</strong></span>
            </li>
            <li className="flex items-start gap-2">
              <Badge variant="destructive" className="mt-0.5">Critical</Badge>
              <span className="text-sm">Rapid rise in bilirubin <strong>(&gt;5 mg/dL per 24 hours)</strong></span>
            </li>
            <li className="flex items-start gap-2">
              <Badge variant="destructive" className="mt-0.5">Critical</Badge>
              <span className="text-sm">Total bilirubin <strong>&gt;17-18 mg/dL</strong> in full-term infant</span>
            </li>
            <li className="flex items-start gap-2">
              <Badge variant="destructive" className="mt-0.5">Critical</Badge>
              <span className="text-sm">Direct bilirubin <strong>&gt;1 mg/dL or &gt;20% of total</strong></span>
            </li>
            <li className="flex items-start gap-2">
              <Badge variant="destructive" className="mt-0.5">Critical</Badge>
              <span className="text-sm">Prolonged jaundice <strong>(&gt;2 weeks term, &gt;3 weeks preterm)</strong></span>
            </li>
            <li className="flex items-start gap-2">
              <Badge variant="destructive" className="mt-0.5">Urgent</Badge>
              <span className="text-sm"><strong>Pale/acholic stools</strong> (suggests cholestasis)</span>
            </li>
            <li className="flex items-start gap-2">
              <Badge variant="destructive" className="mt-0.5">Urgent</Badge>
              <span className="text-sm"><strong>Dark urine</strong> (tea-colored, suggests conjugated hyperbilirubinemia)</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* History */}
      <Card>
        <CardHeader>
          <CardTitle>1. History</CardTitle>
          <CardDescription>Key questions to ask</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">Maternal History</h4>
            <ul className="space-y-1 text-sm ml-4 list-disc">
              <li>Blood type and antibody screen</li>
              <li>Previous children with jaundice or anemia</li>
              <li>Ethnicity (G6PD risk, other genetic conditions)</li>
              <li>Maternal infections (TORCH, hepatitis)</li>
              <li>Medications during pregnancy</li>
              <li>Diabetes (polycythemia risk)</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Birth History</h4>
            <ul className="space-y-1 text-sm ml-4 list-disc">
              <li>Gestational age</li>
              <li>Birth weight</li>
              <li>Mode of delivery</li>
              <li>Birth trauma (cephalohematoma, bruising)</li>
              <li>Apgar scores</li>
              <li>Delayed cord clamping</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Neonatal History</h4>
            <ul className="space-y-1 text-sm ml-4 list-disc">
              <li>Age when jaundice first noted</li>
              <li>Feeding history (breast vs formula, frequency, intake)</li>
              <li>Stool output (number, color, consistency)</li>
              <li>Urine output (frequency, color)</li>
              <li>Weight loss percentage</li>
              <li>Activity level and tone</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Physical Exam */}
      <Card>
        <CardHeader>
          <CardTitle>2. Physical Examination</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <h4 className="font-semibold mb-2">General Assessment</h4>
            <ul className="space-y-1 text-sm ml-4 list-disc">
              <li>Assess progression: cephalocaudal progression suggests higher bilirubin</li>
              <li>Kramer zones (face only = ~5 mg/dL, to palms/soles = &gt;15 mg/dL)</li>
              <li>Color of sclera (icteric?)</li>
              <li>Overall appearance: well vs ill-appearing</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Signs of Underlying Disease</h4>
            <ul className="space-y-1 text-sm ml-4 list-disc">
              <li>Hepatosplenomegaly (hemolysis, infection, storage disease)</li>
              <li>Petechiae/purpura (infection, thrombocytopenia)</li>
              <li>Cephalohematoma or bruising (extravascular blood)</li>
              <li>Pallor (anemia from hemolysis)</li>
              <li>Plethora (polycythemia)</li>
              <li>Umbilical findings (omphalitis, delayed cord separation)</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Neurologic Signs (Acute Bilirubin Encephalopathy)</h4>
            <ul className="space-y-1 text-sm ml-4 list-disc">
              <li>Lethargy, poor feeding</li>
              <li>Hypotonia or hypertonia</li>
              <li>High-pitched cry</li>
              <li>Opisthotonos (arching)</li>
              <li>Seizures (severe cases)</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Laboratory Workup */}
      <Card>
        <CardHeader>
          <CardTitle>3. Laboratory Workup</CardTitle>
          <CardDescription>Stepwise approach based on presentation</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Initial Tests (All Jaundiced Infants)
            </h4>
            <ul className="space-y-1 text-sm ml-4 list-disc">
              <li><strong>Total and direct bilirubin</strong> - determine conjugation status</li>
              <li><strong>Infant blood type and Coombs (DAT)</strong> - screen for immune hemolysis</li>
              <li><strong>Maternal blood type</strong> (if not already known)</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">If Pathologic Features Present</h4>
            <ul className="space-y-1 text-sm ml-4 list-disc">
              <li><strong>CBC with blood smear</strong> - anemia, spherocytes, bite cells</li>
              <li><strong>Reticulocyte count</strong> - marker of hemolysis</li>
              <li><strong>G6PD level</strong> (if ethnicity suggests, or hemolysis without obvious cause)</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">If Conjugated Hyperbilirubinemia (Direct &gt;1 mg/dL or &gt;20%)</h4>
            <ul className="space-y-1 text-sm ml-4 list-disc">
              <li><strong>Liver function tests</strong> - AST, ALT, GGT, alkaline phosphatase</li>
              <li><strong>Hepatic ultrasound</strong> - evaluate biliary tree</li>
              <li><strong>Alpha-1 antitrypsin level and phenotype</strong></li>
              <li><strong>TORCH titers</strong> if indicated</li>
              <li><strong>Metabolic screening</strong> (galactosemia, tyrosinemia)</li>
              <li><strong>HIDA scan</strong> or liver biopsy if biliary atresia suspected</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Additional Tests if Indicated</h4>
            <ul className="space-y-1 text-sm ml-4 list-disc">
              <li><strong>Sepsis workup</strong> - if signs of infection</li>
              <li><strong>Thyroid function</strong> - if prolonged jaundice</li>
              <li><strong>Urine for reducing substances</strong> - galactosemia</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Decision Algorithm */}
      <Card className="border-primary">
        <CardHeader>
          <CardTitle>Diagnostic Decision Tree</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="p-3 bg-muted rounded-lg">
              <p className="font-semibold mb-1">Step 1: When did jaundice appear?</p>
              <p className="ml-4">&lt;24 hours → <strong>PATHOLOGIC</strong> → Full workup</p>
              <p className="ml-4">&gt;24 hours → Proceed to Step 2</p>
            </div>

            <div className="p-3 bg-muted rounded-lg">
              <p className="font-semibold mb-1">Step 2: Check direct bilirubin</p>
              <p className="ml-4">&gt;1 mg/dL or &gt;20% → <strong>CHOLESTASIS</strong> → Urgent GI referral</p>
              <p className="ml-4">Normal → Proceed to Step 3</p>
            </div>

            <div className="p-3 bg-muted rounded-lg">
              <p className="font-semibold mb-1">Step 3: Check for hemolysis</p>
              <p className="ml-4">Positive Coombs → Immune-mediated (ABO/Rh)</p>
              <p className="ml-4">High retic, anemia → Non-immune hemolysis (G6PD, spherocytosis)</p>
              <p className="ml-4">Negative → Likely physiologic or non-hemolytic cause</p>
            </div>

            <div className="p-3 bg-muted rounded-lg">
              <p className="font-semibold mb-1">Step 4: Assess feeding and hydration</p>
              <p className="ml-4">Poor intake, weight loss → Breastfeeding failure jaundice</p>
              <p className="ml-4">Good intake, thriving → Consider breast milk jaundice if prolonged</p>
            </div>

            <div className="p-3 bg-muted rounded-lg">
              <p className="font-semibold mb-1">Step 5: Plot on nomogram</p>
              <p className="ml-4">Determine risk zone and need for intervention</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

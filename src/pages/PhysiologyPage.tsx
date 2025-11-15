import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, AlertCircle } from 'lucide-react';

export default function PhysiologyPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Bilirubin Physiology</h1>
        <p className="text-muted-foreground">
          Understanding the pathway from heme breakdown to bilirubin excretion
        </p>
      </div>

      {/* Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Bilirubin is a yellow pigment produced from the breakdown of heme, primarily from
            senescent red blood cells. Understanding bilirubin metabolism is essential for
            recognizing why newborns are particularly susceptible to jaundice.
          </p>
        </CardContent>
      </Card>

      {/* Bilirubin Production */}
      <Card>
        <CardHeader>
          <CardTitle>1. Bilirubin Production</CardTitle>
          <CardDescription>Heme breakdown pathway</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <div className="flex items-start gap-3">
              <ArrowRight className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Hemoglobin breakdown</p>
                <p className="text-sm text-muted-foreground">
                  Senescent RBCs (lifespan ~120 days in adults, ~70-90 days in newborns) are
                  phagocytosed by reticuloendothelial cells in the spleen, liver, and bone marrow.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <ArrowRight className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Heme → Biliverdin</p>
                <p className="text-sm text-muted-foreground">
                  Heme oxygenase breaks down heme to biliverdin, producing carbon monoxide (CO)
                  and iron. The CO can be measured as end-tidal CO, correlating with hemolysis.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <ArrowRight className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Biliverdin → Unconjugated Bilirubin</p>
                <p className="text-sm text-muted-foreground">
                  Biliverdin reductase converts green biliverdin to yellow unconjugated bilirubin
                  (indirect bilirubin).
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transport */}
      <Card>
        <CardHeader>
          <CardTitle>2. Transport in Blood</CardTitle>
          <CardDescription>Albumin binding</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <p>
            Unconjugated bilirubin is lipophilic (fat-soluble) and water-insoluble. It binds
            tightly to albumin for transport in the bloodstream.
          </p>
          <div className="bg-muted p-4 rounded-lg space-y-2">
            <p className="font-medium text-sm">Clinical Significance:</p>
            <ul className="text-sm space-y-1 ml-4 list-disc">
              <li>Free (unbound) bilirubin can cross the blood-brain barrier → neurotoxicity</li>
              <li>Factors reducing albumin binding: acidosis, hypothermia, medications, sepsis</li>
              <li>Low albumin (&lt;3 g/dL) increases risk of kernicterus</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Hepatic Uptake and Conjugation */}
      <Card>
        <CardHeader>
          <CardTitle>3. Hepatic Uptake & Conjugation</CardTitle>
          <CardDescription>Liver processing</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <div className="flex items-start gap-3">
              <ArrowRight className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Hepatic uptake</p>
                <p className="text-sm text-muted-foreground">
                  Bilirubin is transported into hepatocytes via membrane transporters.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <ArrowRight className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Conjugation (glucuronidation)</p>
                <p className="text-sm text-muted-foreground">
                  UDP-glucuronosyltransferase (UGT1A1) conjugates bilirubin with glucuronic acid,
                  creating water-soluble conjugated bilirubin (direct bilirubin).
                </p>
              </div>
            </div>
          </div>
          <div className="bg-yellow-500/10 border border-yellow-500/30 p-4 rounded-lg">
            <div className="flex gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-500 flex-shrink-0" />
              <div>
                <p className="font-medium text-sm">Why Newborns Are At Risk:</p>
                <ul className="text-sm space-y-1 mt-2 ml-4 list-disc">
                  <li>UGT1A1 activity is only 1% of adult levels at birth</li>
                  <li>Reaches adult levels by 6-14 weeks of age</li>
                  <li>This developmental immaturity is the basis of physiologic jaundice</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Excretion */}
      <Card>
        <CardHeader>
          <CardTitle>4. Biliary Excretion</CardTitle>
          <CardDescription>Elimination pathway</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <p>
            Conjugated bilirubin is excreted into bile and then into the intestinal tract. In the
            colon, bacteria convert it to urobilinogen and stercobilin (gives stool its brown
            color).
          </p>
          <div className="bg-muted p-4 rounded-lg">
            <p className="font-medium text-sm mb-2">Normal pathway:</p>
            <p className="text-sm">
              Conjugated bilirubin → Bile → Intestine → Bacterial conversion → Urobilinogen →
              Stercobilin (feces) and Urobilin (urine)
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Enterohepatic Circulation */}
      <Card>
        <CardHeader>
          <CardTitle>5. Enterohepatic Circulation</CardTitle>
          <CardDescription>Reabsorption in newborns</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <p>
            In newborns, beta-glucuronidase in the intestine deconjugates bilirubin back to its
            unconjugated form, which can be reabsorbed into the bloodstream.
          </p>
          <div className="bg-yellow-500/10 border border-yellow-500/30 p-4 rounded-lg">
            <div className="flex gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-500 flex-shrink-0" />
              <div>
                <p className="font-medium text-sm">Increased in Newborns Due To:</p>
                <ul className="text-sm space-y-1 mt-2 ml-4 list-disc">
                  <li>High intestinal beta-glucuronidase activity</li>
                  <li>Delayed meconium passage (meconium contains bilirubin)</li>
                  <li>Sterile gut (lack of bacteria to convert bilirubin)</li>
                  <li>Decreased intestinal motility</li>
                  <li>Poor feeding → less stool output</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Why Newborns Get Jaundice */}
      <Card className="border-primary">
        <CardHeader>
          <CardTitle>Why Newborns Are Prone to Jaundice</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Badge variant="destructive">Increased Production</Badge>
              <ul className="text-sm space-y-1 ml-4 list-disc">
                <li>Higher RBC mass (hematocrit ~50-60%)</li>
                <li>Shorter RBC lifespan (70-90 vs 120 days)</li>
                <li>Increased RBC turnover</li>
              </ul>
            </div>
            <div className="space-y-2">
              <Badge variant="destructive">Decreased Clearance</Badge>
              <ul className="text-sm space-y-1 ml-4 list-disc">
                <li>Immature UGT1A1 (1% of adult levels)</li>
                <li>Decreased hepatic uptake</li>
                <li>Increased enterohepatic circulation</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

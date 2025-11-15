import { JaundiceEtiology } from '@/types';

export const jaundiceEtiologies: JaundiceEtiology[] = [
  {
    id: 'physiologic',
    name: 'Physiologic Jaundice',
    type: 'physiologic',
    bilirubinType: 'unconjugated',
    onsetTiming: '2-4 days of life',
    keyFeatures: [
      'Appears after 24 hours of life',
      'Peaks at 3-5 days (term) or 5-7 days (preterm)',
      'Total bilirubin < 12 mg/dL in term infants',
      'Resolves by 1-2 weeks',
      'No pathologic signs',
      'Normal feeding and activity'
    ],
    commonCauses: [
      'Increased RBC breakdown (shorter RBC lifespan)',
      'Decreased hepatic conjugation',
      'Increased enterohepatic circulation'
    ],
    diagnosticTests: [
      'Total and direct bilirubin',
      'Blood type and Coombs test (if indicated)',
      'CBC with reticulocyte count'
    ],
    management: [
      'Observation if within normal range',
      'Ensure adequate feeding',
      'Monitor bilirubin trends',
      'Phototherapy if exceeds threshold'
    ]
  },
  {
    id: 'pathologic',
    name: 'Pathologic Jaundice',
    type: 'pathologic',
    bilirubinType: 'unconjugated',
    onsetTiming: 'Within first 24 hours or persistent beyond 2 weeks',
    keyFeatures: [
      'Jaundice in first 24 hours of life',
      'Rapid rise (>5 mg/dL per day)',
      'Total bilirubin >17 mg/dL',
      'Direct bilirubin >2 mg/dL or >20% of total',
      'Prolonged jaundice (>2 weeks term, >3 weeks preterm)',
      'Signs of underlying disease'
    ],
    commonCauses: [
      'Hemolytic disease (ABO, Rh)',
      'G6PD deficiency',
      'Sepsis',
      'Cephalohematoma/bruising',
      'Polycythemia'
    ],
    diagnosticTests: [
      'Blood type and Coombs test',
      'CBC, reticulocyte count, smear',
      'G6PD level',
      'Sepsis workup if indicated',
      'Liver function tests'
    ],
    management: [
      'Identify and treat underlying cause',
      'Aggressive phototherapy',
      'Consider IVIG for immune-mediated hemolysis',
      'Exchange transfusion if severe'
    ]
  },
  {
    id: 'breast-milk',
    name: 'Breast Milk Jaundice',
    type: 'breast-milk',
    bilirubinType: 'unconjugated',
    onsetTiming: 'After first week, peaks at 2-3 weeks',
    keyFeatures: [
      'Occurs after physiologic jaundice resolves',
      'Peak at 2-3 weeks of life',
      'Can persist 3-12 weeks',
      'Otherwise healthy, thriving infant',
      'Good weight gain',
      'Unconjugated hyperbilirubinemia'
    ],
    commonCauses: [
      'Substances in breast milk inhibit glucuronidation',
      'Increased enterohepatic circulation',
      'Beta-glucuronidase in breast milk'
    ],
    diagnosticTests: [
      'Total and direct bilirubin',
      'Rule out other causes',
      'Optional: temporary cessation of breastfeeding (bilirubin drops)'
    ],
    management: [
      'Continue breastfeeding',
      'Monitor bilirubin levels',
      'Reassure parents',
      'Phototherapy rarely needed',
      'Usually resolves spontaneously'
    ]
  },
  {
    id: 'breastfeeding-failure',
    name: 'Breastfeeding Failure Jaundice',
    type: 'breastfeeding-failure',
    bilirubinType: 'unconjugated',
    onsetTiming: 'First week of life',
    keyFeatures: [
      'Occurs in first week',
      'Related to inadequate intake',
      'Poor weight gain',
      'Dehydration',
      'Infrequent stools',
      'Decreased urine output'
    ],
    commonCauses: [
      'Inadequate milk intake',
      'Dehydration',
      'Increased enterohepatic circulation',
      'Delayed meconium passage'
    ],
    diagnosticTests: [
      'Total bilirubin',
      'Weight assessment',
      'Feeding evaluation',
      'Urine specific gravity'
    ],
    management: [
      'Lactation support',
      'Increase feeding frequency',
      'Supplementation if needed',
      'Hydration',
      'Monitor weight and output',
      'Phototherapy if bilirubin elevated'
    ]
  },
  {
    id: 'hemolytic-abo',
    name: 'ABO Incompatibility',
    type: 'hemolytic',
    bilirubinType: 'unconjugated',
    onsetTiming: 'First 24-48 hours',
    keyFeatures: [
      'Mother O, baby A or B',
      'Positive direct Coombs test',
      'Spherocytes on smear',
      'Elevated reticulocyte count',
      'Anemia may develop',
      'Early onset jaundice'
    ],
    commonCauses: [
      'Maternal anti-A or anti-B antibodies',
      'Hemolysis of fetal RBCs'
    ],
    diagnosticTests: [
      'Blood types (mother and baby)',
      'Direct Coombs (DAT)',
      'CBC, reticulocyte count',
      'Blood smear (spherocytes)',
      'Total and direct bilirubin'
    ],
    management: [
      'Phototherapy',
      'Monitor hemoglobin',
      'IVIG if severe (0.5-1 g/kg)',
      'Exchange transfusion if refractory',
      'Monitor for late anemia'
    ]
  },
  {
    id: 'hemolytic-rh',
    name: 'Rh Incompatibility',
    type: 'hemolytic',
    bilirubinType: 'unconjugated',
    onsetTiming: 'First 24 hours',
    keyFeatures: [
      'Rh negative mother, Rh positive baby',
      'Strongly positive Coombs test',
      'Severe anemia at birth',
      'Hydrops fetalis in severe cases',
      'Rapidly rising bilirubin',
      'Hepatosplenomegaly'
    ],
    commonCauses: [
      'Maternal anti-D antibodies',
      'Prior sensitization',
      'Hemolysis of fetal RBCs'
    ],
    diagnosticTests: [
      'Rh typing (mother and baby)',
      'Direct Coombs test',
      'CBC, reticulocyte count',
      'Total bilirubin',
      'Maternal antibody screen'
    ],
    management: [
      'Immediate phototherapy',
      'IVIG (0.5-1 g/kg)',
      'Prepare for exchange transfusion',
      'Monitor hemoglobin closely',
      'Treat anemia',
      'Prevention: RhoGAM in mother'
    ]
  },
  {
    id: 'g6pd',
    name: 'G6PD Deficiency',
    type: 'hemolytic',
    bilirubinType: 'unconjugated',
    onsetTiming: 'First few days, triggered by oxidative stress',
    keyFeatures: [
      'X-linked disorder',
      'Triggered by oxidative stress',
      'Bite cells on smear',
      'Hemolysis with certain medications/foods',
      'More common in certain ethnic groups',
      'Can cause severe jaundice'
    ],
    commonCauses: [
      'Enzyme deficiency',
      'Oxidative stress (fava beans, naphthalene, certain drugs)',
      'Infection'
    ],
    diagnosticTests: [
      'G6PD level (may be falsely normal during acute hemolysis)',
      'CBC, reticulocyte count',
      'Blood smear',
      'Total bilirubin',
      'Recheck G6PD after acute episode'
    ],
    management: [
      'Phototherapy',
      'Avoid triggering agents',
      'Monitor for hemolysis',
      'Exchange transfusion if severe',
      'Family education',
      'Genetic counseling'
    ]
  },
  {
    id: 'cholestatic',
    name: 'Cholestatic Jaundice',
    type: 'cholestatic',
    bilirubinType: 'conjugated',
    onsetTiming: 'After 2 weeks of age (persisting jaundice)',
    keyFeatures: [
      'Direct bilirubin >1 mg/dL or >20% of total',
      'Dark urine',
      'Pale/acholic stools',
      'Hepatomegaly',
      'Failure to thrive',
      'Requires urgent evaluation'
    ],
    commonCauses: [
      'Biliary atresia (urgent!)',
      'Neonatal hepatitis',
      'Metabolic disorders',
      'Alpha-1 antitrypsin deficiency',
      'TPN-associated cholestasis'
    ],
    diagnosticTests: [
      'Total and direct bilirubin',
      'Liver function tests',
      'GGT, alkaline phosphatase',
      'Hepatic ultrasound',
      'HIDA scan',
      'Alpha-1 antitrypsin',
      'Metabolic screening',
      'Liver biopsy if indicated'
    ],
    management: [
      'URGENT GI/hepatology referral',
      'Biliary atresia requires surgery before 60 days',
      'Fat-soluble vitamin supplementation',
      'Ursodeoxycholic acid',
      'Treat underlying cause',
      'Monitor growth and development'
    ]
  }
];

export function getEtiologyById(id: string): JaundiceEtiology | undefined {
  return jaundiceEtiologies.find(e => e.id === id);
}

export function getEtiologiesByType(type: string): JaundiceEtiology[] {
  return jaundiceEtiologies.filter(e => e.type === type);
}

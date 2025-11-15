import { GlossaryTerm } from '@/types';

export const glossaryTerms: GlossaryTerm[] = [
  {
    term: 'Bilirubin',
    definition: 'Yellow pigment formed from the breakdown of heme (from hemoglobin). Exists as unconjugated (indirect) or conjugated (direct) forms.',
    category: 'Basic',
    relatedTerms: ['Unconjugated bilirubin', 'Conjugated bilirubin', 'Jaundice']
  },
  {
    term: 'Jaundice',
    definition: 'Yellow discoloration of skin and sclera due to elevated bilirubin levels. Clinically visible when total bilirubin >5 mg/dL.',
    category: 'Basic',
    relatedTerms: ['Hyperbilirubinemia', 'Icterus']
  },
  {
    term: 'Unconjugated Bilirubin',
    definition: 'Water-insoluble form of bilirubin (also called indirect bilirubin). Binds to albumin in blood and can cross blood-brain barrier causing neurotoxicity.',
    category: 'Basic',
    relatedTerms: ['Indirect bilirubin', 'Kernicterus']
  },
  {
    term: 'Conjugated Bilirubin',
    definition: 'Water-soluble form of bilirubin (also called direct bilirubin) produced by hepatic glucuronidation. Elevated levels indicate cholestasis.',
    category: 'Basic',
    relatedTerms: ['Direct bilirubin', 'Cholestasis']
  },
  {
    term: 'Physiologic Jaundice',
    definition: 'Normal, self-limited jaundice in newborns appearing after 24 hours, peaking at 3-5 days, and resolving by 1-2 weeks. Due to immature hepatic conjugation.',
    category: 'Etiology',
    relatedTerms: ['Pathologic jaundice']
  },
  {
    term: 'Pathologic Jaundice',
    definition: 'Abnormal jaundice characterized by: onset <24 hours, rapid rise (>5 mg/dL/day), total bilirubin >17 mg/dL, direct >2 mg/dL, or prolonged duration.',
    category: 'Etiology',
    relatedTerms: ['Physiologic jaundice', 'Hemolysis']
  },
  {
    term: 'Kernicterus',
    definition: 'Chronic, permanent bilirubin encephalopathy from unconjugated bilirubin deposition in basal ganglia. Causes movement disorders, hearing loss, and developmental delay.',
    category: 'Complications',
    relatedTerms: ['BIND', 'Acute bilirubin encephalopathy']
  },
  {
    term: 'BIND',
    definition: 'Bilirubin-Induced Neurologic Dysfunction. Spectrum of acute and chronic neurological effects from hyperbilirubinemia.',
    category: 'Complications',
    relatedTerms: ['Kernicterus', 'Acute bilirubin encephalopathy']
  },
  {
    term: 'Phototherapy',
    definition: 'Treatment using blue-green light (420-470nm) to convert unconjugated bilirubin to water-soluble photoisomers that can be excreted without conjugation.',
    category: 'Management',
    relatedTerms: ['Lumirubin', 'Photoisomers']
  },
  {
    term: 'Exchange Transfusion',
    definition: 'Procedure to rapidly reduce bilirubin by replacing infant blood with donor blood. Reserved for severe hyperbilirubinemia unresponsive to phototherapy.',
    category: 'Management',
    relatedTerms: ['Double volume exchange', 'IVIG']
  },
  {
    term: 'Bhutani Nomogram',
    definition: 'Hour-specific bilirubin nomogram used to assess risk of severe hyperbilirubinemia based on bilirubin level and age in hours.',
    category: 'Diagnosis',
    relatedTerms: ['Risk zones', 'Percentiles']
  },
  {
    term: 'Coombs Test (DAT)',
    definition: 'Direct Antiglobulin Test detecting antibodies bound to RBC surface. Positive in immune-mediated hemolysis (ABO, Rh incompatibility).',
    category: 'Diagnosis',
    relatedTerms: ['ABO incompatibility', 'Rh disease', 'Hemolysis']
  },
  {
    term: 'Cholestasis',
    definition: 'Impaired bile flow resulting in elevated conjugated bilirubin. Characterized by dark urine, pale stools, and direct bilirubin >1 mg/dL or >20% of total.',
    category: 'Etiology',
    relatedTerms: ['Biliary atresia', 'Neonatal hepatitis', 'Conjugated hyperbilirubinemia']
  },
  {
    term: 'Biliary Atresia',
    definition: 'Progressive obliteration of extrahepatic bile ducts. Requires surgical intervention (Kasai procedure) before 60 days of life. Presents with cholestatic jaundice and acholic stools.',
    category: 'Etiology',
    relatedTerms: ['Cholestasis', 'Acholic stools', 'Kasai procedure']
  },
  {
    term: 'ABO Incompatibility',
    definition: 'Hemolytic disease when mother is type O and baby is A or B. Maternal anti-A or anti-B antibodies cross placenta causing hemolysis. Positive DAT and spherocytes on smear.',
    category: 'Etiology',
    relatedTerms: ['Hemolysis', 'Coombs test', 'Spherocytes']
  },
  {
    term: 'Rh Disease',
    definition: 'Hemolytic disease when Rh-negative mother develops anti-D antibodies against Rh-positive fetus. Can cause severe anemia and hydrops. Prevented by RhoGAM.',
    category: 'Etiology',
    relatedTerms: ['RhoGAM', 'Hemolysis', 'Hydrops fetalis']
  },
  {
    term: 'G6PD Deficiency',
    definition: 'X-linked enzyme deficiency causing hemolysis with oxidative stress. Triggered by infections, certain foods (fava beans), and medications. More common in Mediterranean, African, and Asian populations.',
    category: 'Etiology',
    relatedTerms: ['Hemolysis', 'Bite cells', 'Oxidative stress']
  },
  {
    term: 'Breast Milk Jaundice',
    definition: 'Prolonged unconjugated hyperbilirubinemia in thriving breastfed infants. Peaks at 2-3 weeks, can last 3-12 weeks. Caused by substances in breast milk inhibiting conjugation.',
    category: 'Etiology',
    relatedTerms: ['Breastfeeding failure jaundice', 'Physiologic jaundice']
  },
  {
    term: 'Breastfeeding Failure Jaundice',
    definition: 'Jaundice in first week from inadequate breast milk intake causing dehydration and increased enterohepatic circulation. Poor weight gain and decreased output.',
    category: 'Etiology',
    relatedTerms: ['Breast milk jaundice', 'Dehydration']
  },
  {
    term: 'Enterohepatic Circulation',
    definition: 'Reabsorption of unconjugated bilirubin from intestine back into bloodstream. Increased in newborns due to beta-glucuronidase and delayed meconium passage.',
    category: 'Physiology',
    relatedTerms: ['Beta-glucuronidase', 'Bilirubin metabolism']
  },
  {
    term: 'IVIG',
    definition: 'Intravenous Immunoglobulin (0.5-1 g/kg) used in immune-mediated hemolysis to reduce antibody-mediated RBC destruction. May prevent need for exchange transfusion.',
    category: 'Management',
    relatedTerms: ['Exchange transfusion', 'Hemolysis', 'ABO incompatibility']
  },
  {
    term: 'TcB',
    definition: 'Transcutaneous Bilirubin measurement. Non-invasive screening tool. Should be confirmed with serum bilirubin if elevated or for clinical decisions.',
    category: 'Diagnosis',
    relatedTerms: ['TSB', 'Total serum bilirubin']
  },
  {
    term: 'TSB',
    definition: 'Total Serum Bilirubin. Blood test measuring total bilirubin level. Gold standard for diagnosis and management decisions.',
    category: 'Diagnosis',
    relatedTerms: ['TcB', 'Direct bilirubin', 'Indirect bilirubin']
  },
  {
    term: 'Acholic Stools',
    definition: 'Pale, clay-colored stools indicating absence of bile. Key sign of cholestasis and biliary obstruction. Urgent evaluation needed.',
    category: 'Diagnosis',
    relatedTerms: ['Cholestasis', 'Biliary atresia']
  },
  {
    term: 'Spherocytes',
    definition: 'Small, round RBCs without central pallor seen on blood smear. Characteristic of ABO incompatibility and hereditary spherocytosis.',
    category: 'Diagnosis',
    relatedTerms: ['ABO incompatibility', 'Blood smear']
  }
];

export function searchGlossary(searchTerm: string): GlossaryTerm[] {
  const lowerSearch = searchTerm.toLowerCase();
  return glossaryTerms.filter(
    term =>
      term.term.toLowerCase().includes(lowerSearch) ||
      term.definition.toLowerCase().includes(lowerSearch) ||
      term.category.toLowerCase().includes(lowerSearch)
  );
}

export function getGlossaryByCategory(category: string): GlossaryTerm[] {
  return glossaryTerms.filter(term => term.category === category);
}

export function getGlossaryCategories(): string[] {
  return Array.from(new Set(glossaryTerms.map(term => term.category)));
}

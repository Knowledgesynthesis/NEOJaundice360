import { Assessment } from '@/types';

export const assessments: Assessment[] = [
  {
    id: 'q1',
    question: 'A full-term newborn develops jaundice at 36 hours of life. Total bilirubin is 10 mg/dL. This is most consistent with:',
    options: [
      'Pathologic jaundice requiring immediate workup',
      'Physiologic jaundice',
      'Breast milk jaundice',
      'Cholestatic jaundice'
    ],
    correctAnswer: 1,
    explanation: 'Physiologic jaundice typically appears after 24 hours of life, peaks at 3-5 days, and total bilirubin is usually <12 mg/dL in term infants. The timing and level are consistent with physiologic jaundice.',
    category: 'Diagnosis',
    difficulty: 'easy'
  },
  {
    id: 'q2',
    question: 'Which of the following is a RED FLAG suggesting pathologic jaundice?',
    options: [
      'Jaundice appearing at 48 hours of life',
      'Jaundice appearing within the first 24 hours of life',
      'Peak bilirubin of 11 mg/dL at day 4',
      'Resolution by 2 weeks of age'
    ],
    correctAnswer: 1,
    explanation: 'Jaundice appearing in the first 24 hours of life is ALWAYS pathologic and requires immediate investigation. Other red flags include rapid rise (>5 mg/dL/day), direct bilirubin >2 mg/dL, and prolonged jaundice.',
    category: 'Diagnosis',
    difficulty: 'easy'
  },
  {
    id: 'q3',
    question: 'A 3-day-old term infant has total bilirubin 18 mg/dL, direct bilirubin 0.5 mg/dL. Mother is O+, baby is A+. Direct Coombs is positive. What is the most likely diagnosis?',
    options: [
      'Physiologic jaundice',
      'G6PD deficiency',
      'ABO incompatibility',
      'Biliary atresia'
    ],
    correctAnswer: 2,
    explanation: 'ABO incompatibility occurs when mother is type O and baby is A or B. The positive direct Coombs test (DAT) indicates antibody coating of RBCs, confirming immune-mediated hemolysis. The predominantly unconjugated hyperbilirubinemia is also consistent.',
    category: 'Diagnosis',
    difficulty: 'medium'
  },
  {
    id: 'q4',
    question: 'What percentage of direct (conjugated) bilirubin relative to total bilirubin is concerning for cholestasis?',
    options: [
      '>5%',
      '>10%',
      '>20%',
      '>50%'
    ],
    correctAnswer: 2,
    explanation: 'Direct bilirubin >20% of total bilirubin OR >1 mg/dL (whichever is lower) suggests cholestasis and requires urgent evaluation, as biliary atresia must be identified and treated before 60 days of life.',
    category: 'Diagnosis',
    difficulty: 'medium'
  },
  {
    id: 'q5',
    question: 'A 2-week-old breastfed infant has persistent jaundice. Total bilirubin is 12 mg/dL, direct is 0.8 mg/dL. The infant is feeding well, gaining weight appropriately, and has normal urine and stool output. What is the most likely diagnosis?',
    options: [
      'Breastfeeding failure jaundice',
      'Breast milk jaundice',
      'Biliary atresia',
      'Hypothyroidism'
    ],
    correctAnswer: 1,
    explanation: 'Breast milk jaundice occurs after the first week, peaks at 2-3 weeks, and can persist for weeks. The infant is otherwise thriving with good weight gain and normal output, which distinguishes this from breastfeeding failure jaundice.',
    category: 'Diagnosis',
    difficulty: 'medium'
  },
  {
    id: 'q6',
    question: 'Which lab finding is most specific for hemolytic disease?',
    options: [
      'Elevated total bilirubin',
      'Elevated reticulocyte count',
      'Low hemoglobin',
      'Elevated liver enzymes'
    ],
    correctAnswer: 1,
    explanation: 'Elevated reticulocyte count indicates increased RBC production in response to hemolysis. While anemia and hyperbilirubinemia occur in hemolysis, reticulocytosis is the most specific marker of ongoing hemolytic process.',
    category: 'Diagnosis',
    difficulty: 'medium'
  },
  {
    id: 'q7',
    question: 'A term newborn at 48 hours has total bilirubin of 15 mg/dL with no risk factors. According to AAP guidelines, what is the appropriate management?',
    options: [
      'Observation and recheck in 24 hours',
      'Start phototherapy',
      'Prepare for exchange transfusion',
      'Discontinue breastfeeding'
    ],
    correctAnswer: 1,
    explanation: 'For a term infant (≥38 weeks) with no risk factors (low risk category), the phototherapy threshold at 48 hours is approximately 14-15 mg/dL. At 15 mg/dL, phototherapy should be initiated per AAP guidelines.',
    category: 'Management',
    difficulty: 'medium'
  },
  {
    id: 'q8',
    question: 'What is the mechanism of phototherapy in treating neonatal jaundice?',
    options: [
      'Increases hepatic conjugation of bilirubin',
      'Converts unconjugated bilirubin to water-soluble isomers',
      'Blocks bilirubin production',
      'Enhances renal excretion of bilirubin'
    ],
    correctAnswer: 1,
    explanation: 'Phototherapy works by converting unconjugated bilirubin in the skin to water-soluble photoisomers (lumirubin) that can be excreted in bile and urine without conjugation.',
    category: 'Management',
    difficulty: 'hard'
  },
  {
    id: 'q9',
    question: 'In which scenario would IVIG be most appropriate?',
    options: [
      'Physiologic jaundice at 72 hours',
      'Breastfeeding failure jaundice',
      'Rh incompatibility with rapidly rising bilirubin despite phototherapy',
      'Breast milk jaundice at 3 weeks'
    ],
    correctAnswer: 2,
    explanation: 'IVIG (0.5-1 g/kg) is indicated for immune-mediated hemolytic disease (Rh or ABO incompatibility) when bilirubin is rising rapidly despite phototherapy. It reduces hemolysis and may prevent the need for exchange transfusion.',
    category: 'Management',
    difficulty: 'hard'
  },
  {
    id: 'q10',
    question: 'What is the most critical time window for surgical intervention in biliary atresia?',
    options: [
      'Before 30 days of life',
      'Before 60 days of life',
      'Before 90 days of life',
      'Before 6 months of life'
    ],
    correctAnswer: 1,
    explanation: 'Biliary atresia requires Kasai portoenterostomy before 60 days of life for optimal outcomes. Success rates decrease dramatically after this window, making early identification of cholestatic jaundice critical.',
    category: 'Management',
    difficulty: 'hard'
  },
  {
    id: 'q11',
    question: 'A 5-day-old term infant has jaundice, poor feeding, and decreased stooling. What is the most likely diagnosis?',
    options: [
      'Breast milk jaundice',
      'Breastfeeding failure jaundice',
      'ABO incompatibility',
      'Sepsis'
    ],
    correctAnswer: 1,
    explanation: 'Breastfeeding failure jaundice occurs in the first week with inadequate milk intake, leading to dehydration, decreased stooling, and increased enterohepatic circulation of bilirubin. Poor feeding and decreased output are key clues.',
    category: 'Diagnosis',
    difficulty: 'easy'
  },
  {
    id: 'q12',
    question: 'What is kernicterus?',
    options: [
      'Acute bilirubin encephalopathy',
      'Chronic bilirubin encephalopathy with permanent neurological damage',
      'Temporary neurological dysfunction from hyperbilirubinemia',
      'Hepatic dysfunction from cholestasis'
    ],
    correctAnswer: 1,
    explanation: 'Kernicterus is chronic, permanent bilirubin encephalopathy resulting from deposition of unconjugated bilirubin in the basal ganglia. It presents with movement disorders, hearing loss, and developmental delays.',
    category: 'Complications',
    difficulty: 'medium'
  },
  {
    id: 'q13',
    question: 'Which ethnic group has the highest incidence of G6PD deficiency?',
    options: [
      'Northern European',
      'East Asian',
      'Mediterranean and African',
      'Native American'
    ],
    correctAnswer: 2,
    explanation: 'G6PD deficiency is most common in Mediterranean, Middle Eastern, African, and Asian populations. It is X-linked and provides some protection against malaria, explaining its geographic distribution.',
    category: 'Etiology',
    difficulty: 'easy'
  },
  {
    id: 'q14',
    question: 'What finding on peripheral blood smear suggests ABO incompatibility?',
    options: [
      'Bite cells',
      'Spherocytes',
      'Schistocytes',
      'Target cells'
    ],
    correctAnswer: 1,
    explanation: 'Spherocytes are characteristic of ABO incompatibility. These are small, round RBCs without central pallor that result from antibody-mediated membrane damage.',
    category: 'Diagnosis',
    difficulty: 'medium'
  },
  {
    id: 'q15',
    question: 'A newborn has pale, acholic stools and dark urine. What is the most urgent diagnosis to rule out?',
    options: [
      'Physiologic jaundice',
      'Breast milk jaundice',
      'Biliary atresia',
      'ABO incompatibility'
    ],
    correctAnswer: 2,
    explanation: 'Acholic (pale, clay-colored) stools and dark urine indicate cholestasis. Biliary atresia is the most urgent diagnosis requiring surgical intervention before 60 days. Direct bilirubin should be checked immediately.',
    category: 'Diagnosis',
    difficulty: 'easy'
  }
];

export function getAssessmentsByCategory(category: string): Assessment[] {
  return assessments.filter(a => a.category === category);
}

export function getAssessmentsByDifficulty(difficulty: string): Assessment[] {
  return assessments.filter(a => a.difficulty === difficulty);
}

export function getRandomAssessments(count: number): Assessment[] {
  const shuffled = [...assessments].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

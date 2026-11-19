import type { ModuleId } from './questions';

export interface LearningModule {
  id: ModuleId;
  path: string;
  step: number;
  title: string;
  summary: string;
  minutes: number;
  objectives: string[];
}

export const MODULES: LearningModule[] = [
  {
    id: 'physiology',
    path: '/physiology',
    step: 1,
    title: 'Bilirubin physiology',
    summary: 'Production, transport, conjugation, excretion — and why the newborn tips the balance.',
    minutes: 15,
    objectives: [
      'Trace bilirubin from heme to stool and name the enzyme at each step',
      'Explain the three newborn mechanisms: ↑ production, ↓ conjugation, ↑ enterohepatic recirculation',
      'Explain why only unbound unconjugated bilirubin is neurotoxic',
    ],
  },
  {
    id: 'causes',
    path: '/causes',
    step: 2,
    title: 'Causes & classification',
    summary: 'Unconjugated vs conjugated, mechanism-based differential, and the look-alikes.',
    minutes: 20,
    objectives: [
      'Classify a jaundiced infant by fraction, timing and mechanism',
      'Distinguish suboptimal intake jaundice from breast milk jaundice',
      'Recognize isoimmune, G6PD and membrane hemolysis',
    ],
  },
  {
    id: 'evaluation',
    path: '/evaluation',
    step: 3,
    title: 'Evaluation & work-up',
    summary: 'Universal screening, TcB vs TSB, rate of rise, and a hemolysis analyzer.',
    minutes: 20,
    objectives: [
      'Apply universal screening and the TcB→TSB rule',
      'Calculate rate of rise and recognize hemolysis',
      'Order the right first-line tests for early, rapid or prolonged jaundice',
    ],
  },
  {
    id: 'thresholds',
    path: '/thresholds',
    step: 4,
    title: 'Thresholds & follow-up calculator',
    summary: 'AAP 2022 curves, escalation, distance-to-threshold follow-up, NICE and preterm tables.',
    minutes: 25,
    objectives: [
      'Select the correct AAP 2022 curve from GA and neurotoxicity risk factors',
      'Plan follow-up from the distance to the phototherapy threshold',
      'Convert between mg/dL and µmol/L and compare AAP with NICE',
    ],
  },
  {
    id: 'treatment',
    path: '/treatment',
    step: 5,
    title: 'Treatment',
    summary: 'Phototherapy dose and monitoring, stopping and rebound, escalation, IVIG, exchange.',
    minutes: 25,
    objectives: [
      'Prescribe intensive phototherapy and judge its response',
      'Run the escalation-of-care bundle and indicate exchange transfusion',
      'Plan stopping, rebound checks and home phototherapy',
    ],
  },
  {
    id: 'neurotoxicity',
    path: '/neurotoxicity',
    step: 6,
    title: 'Neurotoxicity',
    summary: 'Acute bilirubin encephalopathy, BIND scoring, kernicterus spectrum, hearing.',
    minutes: 15,
    objectives: ['Stage ABE with the BIND score', 'Know when signs override the number', 'Order ABR and neurodevelopmental follow-up'],
  },
  {
    id: 'cholestasis',
    path: '/cholestasis',
    step: 7,
    title: 'Cholestasis & biliary atresia',
    summary: 'DB/CB ≥1.0 mg/dL, the 2–4-week check, stool colors, work-up and Kasai timing.',
    minutes: 20,
    objectives: [
      'Detect cholestasis with “eyes, stool, first bilirubin” at 2–4 weeks',
      'Start the first-line work-up and urgent referral',
      'Explain why Kasai timing drives outcomes',
    ],
  },
];

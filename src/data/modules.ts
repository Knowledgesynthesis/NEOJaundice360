import { Module } from '@/types';

export const modules: Module[] = [
  {
    id: 'home',
    title: 'Home',
    description: 'Welcome to NeoJaundice360',
    icon: 'Home',
    path: '/',
    estimatedTime: 0,
    topics: []
  },
  {
    id: 'physiology',
    title: 'Bilirubin Physiology',
    description: 'Understanding bilirubin metabolism from production to excretion',
    icon: 'FlaskConical',
    path: '/physiology',
    estimatedTime: 15,
    topics: [
      'Heme breakdown pathway',
      'Bilirubin conjugation',
      'Enterohepatic circulation',
      'Why newborns are at risk'
    ]
  },
  {
    id: 'types',
    title: 'Types of Jaundice',
    description: 'Comprehensive overview of jaundice etiologies',
    icon: 'BookOpen',
    path: '/types',
    prerequisites: ['physiology'],
    estimatedTime: 25,
    topics: [
      'Physiologic vs pathologic',
      'Unconjugated hyperbilirubinemia',
      'Conjugated hyperbilirubinemia',
      'Hemolytic causes',
      'Cholestatic causes'
    ]
  },
  {
    id: 'diagnosis',
    title: 'Diagnostic Approach',
    description: 'Systematic evaluation of neonatal jaundice',
    icon: 'Stethoscope',
    path: '/diagnosis',
    prerequisites: ['physiology', 'types'],
    estimatedTime: 20,
    topics: [
      'History and physical exam',
      'Laboratory workup',
      'When to check direct bilirubin',
      'Red flags for pathology',
      'Timing and trajectory'
    ]
  },
  {
    id: 'nomogram',
    title: 'Nomogram Explorer',
    description: 'Interactive Bhutani nomogram for risk stratification',
    icon: 'LineChart',
    path: '/nomogram',
    prerequisites: ['diagnosis'],
    estimatedTime: 15,
    topics: [
      'Hour-specific bilirubin levels',
      'Risk zones',
      'Follow-up recommendations',
      'Predicting severe hyperbilirubinemia'
    ]
  },
  {
    id: 'phototherapy',
    title: 'Phototherapy Calculator',
    description: 'AAP guideline-based treatment thresholds',
    icon: 'Lightbulb',
    path: '/phototherapy',
    prerequisites: ['nomogram'],
    estimatedTime: 20,
    topics: [
      'AAP 2022 guidelines',
      'Risk stratification',
      'Phototherapy thresholds',
      'Exchange transfusion criteria',
      'IVIG indications'
    ]
  },
  {
    id: 'cases',
    title: 'Case Studies',
    description: 'Interactive case-based learning',
    icon: 'FileText',
    path: '/cases',
    prerequisites: ['types', 'diagnosis'],
    estimatedTime: 30,
    topics: [
      'Real-world scenarios',
      'Stepwise reasoning',
      'Differential diagnosis',
      'Management decisions'
    ]
  },
  {
    id: 'assessment',
    title: 'Knowledge Assessment',
    description: 'Test your understanding with questions and explanations',
    icon: 'ClipboardCheck',
    path: '/assessment',
    estimatedTime: 20,
    topics: [
      'Multiple choice questions',
      'Case-based questions',
      'Detailed explanations',
      'Track your progress'
    ]
  },
  {
    id: 'glossary',
    title: 'Glossary',
    description: 'Quick reference for key terms and concepts',
    icon: 'Book',
    path: '/glossary',
    estimatedTime: 10,
    topics: [
      'Key definitions',
      'Clinical terms',
      'Laboratory values',
      'Guidelines summary'
    ]
  }
];

export function getModuleById(id: string): Module | undefined {
  return modules.find(m => m.id === id);
}

export function getModulesByPrerequisite(prereqId: string): Module[] {
  return modules.filter(m => m.prerequisites?.includes(prereqId));
}

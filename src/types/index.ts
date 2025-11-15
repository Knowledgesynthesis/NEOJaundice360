// Core types for NeoJaundice360

export type JaundiceType = 'physiologic' | 'pathologic' | 'breast-milk' | 'breastfeeding-failure' | 'hemolytic' | 'cholestatic';

export type BilirubinType = 'unconjugated' | 'conjugated' | 'mixed';

export type RiskZone = 'low' | 'low-intermediate' | 'high-intermediate' | 'high';

export interface BilirubinLevel {
  total: number; // mg/dL
  direct?: number; // mg/dL
  indirect?: number; // mg/dL
  ageInHours: number;
}

export interface JaundiceCase {
  id: string;
  title: string;
  description: string;
  ageInHours: number;
  gestationalAge: number; // weeks
  totalBilirubin: number;
  directBilirubin?: number;
  riskFactors: string[];
  clinicalFindings: string[];
  labFindings?: Record<string, string>;
  correctDiagnosis: string;
  correctManagement: string[];
  explanation: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface JaundiceEtiology {
  id: string;
  name: string;
  type: JaundiceType;
  bilirubinType: BilirubinType;
  onsetTiming: string;
  keyFeatures: string[];
  commonCauses: string[];
  diagnosticTests: string[];
  management: string[];
}

export interface PhototherapyThreshold {
  ageInHours: number;
  lowRisk: number; // mg/dL
  mediumRisk: number;
  highRisk: number;
}

export interface NomogramDataPoint {
  ageInHours: number;
  bilirubin: number;
  zone: RiskZone;
}

export interface Assessment {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface Module {
  id: string;
  title: string;
  description: string;
  icon: string;
  path: string;
  prerequisites?: string[];
  estimatedTime: number; // minutes
  topics: string[];
}

export interface UserProgress {
  moduleId: string;
  completed: boolean;
  score?: number;
  lastAccessed: Date;
}

export interface GlossaryTerm {
  term: string;
  definition: string;
  relatedTerms?: string[];
  category: string;
}

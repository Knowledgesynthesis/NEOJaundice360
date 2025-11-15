import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, CheckCircle, XCircle } from 'lucide-react';

interface CaseStudy {
  id: string;
  title: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  presentation: string;
  vitals: Record<string, string>;
  labs?: Record<string, string>;
  questions: {
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
  }[];
  diagnosis: string;
  keyLearning: string[];
}

const cases: CaseStudy[] = [
  {
    id: 'case1',
    title: 'Term Newborn with Early Jaundice',
    difficulty: 'beginner',
    presentation: 'A 20-hour-old term male infant (39 weeks gestation, birth weight 3.5 kg) develops visible jaundice. He was born via normal spontaneous vaginal delivery without complications. Mother is O+, baby is A+. The infant is breastfeeding every 2-3 hours with good latch.',
    vitals: {
      'Temperature': '37.0°C',
      'HR': '145 bpm',
      'RR': '42/min',
      'Weight': '3.5 kg (no change from birth)'
    },
    labs: {
      'Total bilirubin': '9.5 mg/dL',
      'Direct bilirubin': '0.3 mg/dL',
      'Blood type': 'A+',
      'Coombs (DAT)': 'Positive',
      'Hematocrit': '52%',
      'Reticulocytes': '5%'
    },
    questions: [
      {
        question: 'What is the most concerning feature of this presentation?',
        options: [
          'The total bilirubin level',
          'Jaundice appearing before 24 hours of life',
          'Positive Coombs test',
          'Reticulocyte count'
        ],
        correctAnswer: 1,
        explanation: 'Jaundice appearing within the first 24 hours of life is ALWAYS pathologic and requires immediate evaluation. This is the most important red flag.'
      },
      {
        question: 'What is the most likely diagnosis?',
        options: [
          'Physiologic jaundice',
          'Breast milk jaundice',
          'ABO incompatibility',
          'G6PD deficiency'
        ],
        correctAnswer: 2,
        explanation: 'ABO incompatibility is the most likely diagnosis given: mother O+ and baby A+, positive Coombs test, early onset jaundice, and elevated reticulocytes indicating hemolysis.'
      },
      {
        question: 'What is the most appropriate next step?',
        options: [
          'Reassurance and routine follow-up',
          'Start phototherapy immediately',
          'Prepare for exchange transfusion',
          'Stop breastfeeding'
        ],
        correctAnswer: 1,
        explanation: 'At 20 hours with bilirubin of 9.5 mg/dL and ABO incompatibility, phototherapy should be started. The infant is in a high-risk category (isoimmune hemolysis), and the bilirubin is likely rising.'
      }
    ],
    diagnosis: 'ABO Incompatibility',
    keyLearning: [
      'Jaundice <24 hours is always pathologic',
      'ABO incompatibility: Mother O, baby A or B',
      'Positive Coombs test indicates immune-mediated hemolysis',
      'Early intervention with phototherapy prevents severe hyperbilirubinemia'
    ]
  },
  {
    id: 'case2',
    title: 'Breastfed Infant with Prolonged Jaundice',
    difficulty: 'intermediate',
    presentation: 'A 3-week-old term female infant presents for well-child visit. Parents report persistent yellow skin color. The infant is exclusively breastfed, feeding 8-10 times daily with good weight gain (birth weight 3.2 kg, current weight 3.8 kg). Stools are yellow and frequent. No fever or illness.',
    vitals: {
      'Temperature': '36.8°C',
      'Weight': '3.8 kg (19% gain from birth)',
      'Activity': 'Alert and active'
    },
    labs: {
      'Total bilirubin': '11 mg/dL',
      'Direct bilirubin': '0.6 mg/dL',
      'Blood type': 'O+',
      'Coombs': 'Negative'
    },
    questions: [
      {
        question: 'What is the most important initial step?',
        options: [
          'Start phototherapy',
          'Check direct bilirubin percentage',
          'Recommend formula supplementation',
          'Reassure parents this is normal'
        ],
        correctAnswer: 1,
        explanation: 'First, confirm this is unconjugated (indirect) hyperbilirubinemia. Direct bilirubin 0.6 mg/dL is <20% of total (5.5%), ruling out cholestasis - the most critical condition to exclude.'
      },
      {
        question: 'What is the most likely diagnosis?',
        options: [
          'Breastfeeding failure jaundice',
          'Breast milk jaundice',
          'Biliary atresia',
          'Hypothyroidism'
        ],
        correctAnswer: 1,
        explanation: 'Breast milk jaundice: prolonged unconjugated hyperbilirubinemia (peaks 2-3 weeks) in a thriving, exclusively breastfed infant with excellent weight gain. Breastfeeding failure would show poor weight gain.'
      },
      {
        question: 'What is the appropriate management?',
        options: [
          'Continue breastfeeding and monitor',
          'Stop breastfeeding for 24-48 hours',
          'Start phototherapy',
          'Urgent hepatology referral'
        ],
        correctAnswer: 0,
        explanation: 'Breast milk jaundice is benign. Continue breastfeeding (provides nutritional and immunological benefits). Monitor clinically. Phototherapy rarely needed. Jaundice will gradually resolve over weeks to months.'
      }
    ],
    diagnosis: 'Breast Milk Jaundice',
    keyLearning: [
      'Breast milk jaundice: prolonged (2-3 weeks), thriving infant, good weight gain',
      'Distinguished from breastfeeding failure jaundice (poor intake, weight loss)',
      'Always check direct bilirubin in prolonged jaundice to rule out cholestasis',
      'Management: continue breastfeeding, reassure parents, monitor'
    ]
  },
  {
    id: 'case3',
    title: 'Infant with Pale Stools',
    difficulty: 'advanced',
    presentation: 'A 5-week-old term male presents with persistent jaundice and parents report pale, clay-colored stools for the past week. Birth history unremarkable. Initially breastfed but now receiving formula due to maternal illness. Dark yellow urine noted.',
    vitals: {
      'Weight': '4.1 kg (adequate gain)',
      'Liver': 'Palpable 2 cm below costal margin, firm'
    },
    labs: {
      'Total bilirubin': '8.5 mg/dL',
      'Direct bilirubin': '5.2 mg/dL',
      'ALT': '145 U/L',
      'AST': '178 U/L',
      'GGT': '285 U/L',
      'Alkaline phosphatase': '450 U/L'
    },
    questions: [
      {
        question: 'What is the most critical diagnosis to rule out?',
        options: [
          'Breast milk jaundice',
          'Biliary atresia',
          'Viral hepatitis',
          'Physiologic jaundice'
        ],
        correctAnswer: 1,
        explanation: 'Biliary atresia is the most critical diagnosis. Acholic stools + conjugated hyperbilirubinemia = cholestasis = URGENT evaluation. Biliary atresia requires surgery (Kasai procedure) before 60 days for optimal outcomes.'
      },
      {
        question: 'What findings confirm conjugated hyperbilirubinemia?',
        options: [
          'Total bilirubin >5 mg/dL',
          'Direct bilirubin 5.2 mg/dL (61% of total)',
          'Elevated liver enzymes',
          'Hepatomegaly'
        ],
        correctAnswer: 1,
        explanation: 'Direct bilirubin >1 mg/dL OR >20% of total indicates conjugated hyperbilirubinemia (cholestasis). Here, direct is 5.2 mg/dL and 61% of total - clearly cholestatic.'
      },
      {
        question: 'What is the most appropriate next step?',
        options: [
          'Routine follow-up in 2 weeks',
          'Start phototherapy',
          'Urgent hepatology/GI referral and hepatobiliary imaging',
          'Recommend formula supplementation'
        ],
        correctAnswer: 2,
        explanation: 'Cholestasis requires URGENT evaluation. Order hepatic ultrasound, consider HIDA scan. Immediate hepatology/GI/surgery referral. Biliary atresia must be identified and treated before 60 days of life.'
      }
    ],
    diagnosis: 'Cholestatic Jaundice (Biliary Atresia suspected)',
    keyLearning: [
      'Acholic stools + jaundice = cholestasis = URGENT',
      'Direct bilirubin >1 mg/dL or >20% of total = conjugated hyperbilirubinemia',
      'Biliary atresia requires Kasai procedure before 60 days',
      'Never delay evaluation of conjugated hyperbilirubinemia',
      'Dark urine + pale stools = bile not reaching intestine'
    ]
  }
];

export default function CasesPage() {
  const [selectedCase, setSelectedCase] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);

  const currentCaseData = cases.find(c => c.id === selectedCase);

  const handleCaseSelect = (caseId: string) => {
    setSelectedCase(caseId);
    setCurrentQuestion(0);
    setSelectedAnswers([]);
    setShowExplanation(false);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    if (currentCaseData && currentQuestion < currentCaseData.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setShowExplanation(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    if (difficulty === 'beginner') return 'success';
    if (difficulty === 'intermediate') return 'warning';
    return 'destructive';
  };

  if (!selectedCase) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Case Studies</h1>
          <p className="text-muted-foreground">
            Interactive clinical cases to develop diagnostic and management skills
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {cases.map((caseStudy) => (
            <Card key={caseStudy.id} className="hover:border-primary transition-colors">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <CardTitle className="text-lg">{caseStudy.title}</CardTitle>
                  <Badge variant={getDifficultyColor(caseStudy.difficulty)}>
                    {caseStudy.difficulty}
                  </Badge>
                </div>
                <CardDescription>{caseStudy.presentation.slice(0, 150)}...</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => handleCaseSelect(caseStudy.id)} className="w-full">
                  Start Case
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!currentCaseData) return null;

  const currentQ = currentCaseData.questions[currentQuestion];
  const isCorrect = selectedAnswers[currentQuestion] === currentQ.correctAnswer;
  const allQuestionsAnswered = selectedAnswers.length === currentCaseData.questions.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">{currentCaseData.title}</h1>
          <Badge variant={getDifficultyColor(currentCaseData.difficulty)} className="mt-2">
            {currentCaseData.difficulty}
          </Badge>
        </div>
        <Button variant="outline" onClick={() => setSelectedCase(null)}>
          Back to Cases
        </Button>
      </div>

      {/* Presentation */}
      <Card>
        <CardHeader>
          <CardTitle>Case Presentation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm">{currentCaseData.presentation}</p>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2 text-sm">Vitals/Physical Exam</h4>
              <div className="text-sm space-y-1">
                {Object.entries(currentCaseData.vitals).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-muted-foreground">{key}:</span>
                    <span className="font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {currentCaseData.labs && (
              <div>
                <h4 className="font-semibold mb-2 text-sm">Laboratory Results</h4>
                <div className="text-sm space-y-1">
                  {Object.entries(currentCaseData.labs).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-muted-foreground">{key}:</span>
                      <span className="font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Question */}
      <Card className="border-primary">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              Question {currentQuestion + 1} of {currentCaseData.questions.length}
            </CardTitle>
            <Badge variant="outline">
              {selectedAnswers.filter((_, i) => i <= currentQuestion).length}/{currentCaseData.questions.length} answered
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="font-medium">{currentQ.question}</p>

          <div className="space-y-2">
            {currentQ.options.map((option, index) => {
              const isSelected = selectedAnswers[currentQuestion] === index;
              const isCorrectOption = index === currentQ.correctAnswer;
              const showResult = showExplanation;

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={showExplanation}
                  className={`w-full p-3 rounded-lg border text-left transition-colors ${
                    showResult && isCorrectOption
                      ? 'border-green-500 bg-green-500/10'
                      : showResult && isSelected && !isCorrect
                      ? 'border-red-500 bg-red-500/10'
                      : isSelected
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{option}</span>
                    {showResult && isCorrectOption && (
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    )}
                    {showResult && isSelected && !isCorrect && (
                      <XCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {showExplanation && (
            <div className={`p-4 rounded-lg border ${isCorrect ? 'border-green-500 bg-green-500/10' : 'border-red-500 bg-red-500/10'}`}>
              <p className="font-semibold mb-2">
                {isCorrect ? 'Correct!' : 'Incorrect'}
              </p>
              <p className="text-sm">{currentQ.explanation}</p>
            </div>
          )}

          {showExplanation && currentQuestion < currentCaseData.questions.length - 1 && (
            <Button onClick={handleNextQuestion} className="w-full">
              Next Question
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Summary */}
      {allQuestionsAnswered && currentQuestion === currentCaseData.questions.length - 1 && showExplanation && (
        <Card>
          <CardHeader>
            <CardTitle>Case Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Diagnosis</h4>
              <p className="text-sm">{currentCaseData.diagnosis}</p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Key Learning Points</h4>
              <ul className="space-y-1">
                {currentCaseData.keyLearning.map((point, idx) => (
                  <li key={idx} className="text-sm flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-4 border-t">
              <p className="text-sm font-medium mb-2">
                Score: {selectedAnswers.filter((ans, i) => ans === currentCaseData.questions[i].correctAnswer).length}/{currentCaseData.questions.length}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

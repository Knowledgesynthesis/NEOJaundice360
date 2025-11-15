import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { assessments, getRandomAssessments } from '@/data/assessments';
import { CheckCircle, XCircle, RotateCcw } from 'lucide-react';

export default function AssessmentPage() {
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestions, setCurrentQuestions] = useState<typeof assessments>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>([]);
  const [quizComplete, setQuizComplete] = useState(false);

  const startQuiz = (count: number = 10) => {
    const questions = getRandomAssessments(count);
    setCurrentQuestions(questions);
    setCurrentIndex(0);
    setUserAnswers(new Array(questions.length).fill(null));
    setSelectedAnswer(null);
    setShowExplanation(false);
    setQuizStarted(true);
    setQuizComplete(false);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (!showExplanation) {
      setSelectedAnswer(answerIndex);
      const newAnswers = [...userAnswers];
      newAnswers[currentIndex] = answerIndex;
      setUserAnswers(newAnswers);
      setShowExplanation(true);
    }
  };

  const handleNext = () => {
    if (currentIndex < currentQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setQuizComplete(true);
    }
  };

  const restartQuiz = () => {
    setQuizStarted(false);
    setQuizComplete(false);
  };

  if (!quizStarted) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Knowledge Assessment</h1>
          <p className="text-muted-foreground">
            Test your understanding with evidence-based questions
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>About the Assessment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p>
              This assessment contains multiple-choice questions covering all aspects of neonatal
              jaundice, from physiology to management.
            </p>
            <p>
              Each question includes a detailed explanation to reinforce learning. Questions are
              categorized by difficulty and topic area.
            </p>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-3 gap-4">
          <Card className="hover:border-primary transition-colors">
            <CardHeader>
              <CardTitle>Quick Quiz</CardTitle>
              <CardDescription>5 random questions</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => startQuiz(5)} className="w-full">
                Start Quick Quiz
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:border-primary transition-colors">
            <CardHeader>
              <CardTitle>Standard Quiz</CardTitle>
              <CardDescription>10 random questions</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => startQuiz(10)} className="w-full">
                Start Standard Quiz
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:border-primary transition-colors">
            <CardHeader>
              <CardTitle>Full Assessment</CardTitle>
              <CardDescription>All {assessments.length} questions</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => startQuiz(assessments.length)} className="w-full">
                Start Full Assessment
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Question Bank Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Question Bank Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2">By Category</h4>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span>Diagnosis</span>
                    <Badge variant="secondary">{assessments.filter(a => a.category === 'Diagnosis').length}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Management</span>
                    <Badge variant="secondary">{assessments.filter(a => a.category === 'Management').length}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Etiology</span>
                    <Badge variant="secondary">{assessments.filter(a => a.category === 'Etiology').length}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Complications</span>
                    <Badge variant="secondary">{assessments.filter(a => a.category === 'Complications').length}</Badge>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">By Difficulty</h4>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span>Easy</span>
                    <Badge variant="success">{assessments.filter(a => a.difficulty === 'easy').length}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Medium</span>
                    <Badge variant="warning">{assessments.filter(a => a.difficulty === 'medium').length}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Hard</span>
                    <Badge variant="destructive">{assessments.filter(a => a.difficulty === 'hard').length}</Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (quizComplete) {
    const correctCount = userAnswers.filter((ans, i) => ans === currentQuestions[i].correctAnswer).length;
    const percentage = Math.round((correctCount / currentQuestions.length) * 100);

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Quiz Complete!</h1>
          <p className="text-muted-foreground">Review your results below</p>
        </div>

        <Card className="border-primary">
          <CardHeader>
            <CardTitle>Your Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-2">
              <div className="text-5xl font-bold text-primary">
                {percentage}%
              </div>
              <p className="text-lg">
                {correctCount} out of {currentQuestions.length} correct
              </p>
              <div className="pt-4">
                {percentage >= 90 && (
                  <Badge variant="success" className="text-lg px-4 py-2">Excellent!</Badge>
                )}
                {percentage >= 70 && percentage < 90 && (
                  <Badge variant="warning" className="text-lg px-4 py-2">Good Job!</Badge>
                )}
                {percentage < 70 && (
                  <Badge variant="secondary" className="text-lg px-4 py-2">Keep Learning!</Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Review Questions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {currentQuestions.map((q, idx) => {
              const userAnswer = userAnswers[idx];
              const isCorrect = userAnswer === q.correctAnswer;

              return (
                <div key={q.id} className="p-4 rounded-lg border">
                  <div className="flex items-start gap-3 mb-2">
                    {isCorrect ? (
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <p className="font-medium mb-2">{idx + 1}. {q.question}</p>
                      <div className="text-sm space-y-1">
                        {userAnswer !== null && (
                          <p className={isCorrect ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                            Your answer: {q.options[userAnswer]}
                          </p>
                        )}
                        {!isCorrect && (
                          <p className="text-green-600 dark:text-green-400">
                            Correct answer: {q.options[q.correctAnswer]}
                          </p>
                        )}
                        <p className="text-muted-foreground pt-2">{q.explanation}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Button onClick={restartQuiz} className="w-full">
          <RotateCcw className="mr-2 h-4 w-4" />
          Start New Quiz
        </Button>
      </div>
    );
  }

  const currentQuestion = currentQuestions[currentIndex];
  const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Question {currentIndex + 1} of {currentQuestions.length}</h1>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline">{currentQuestion.category}</Badge>
            <Badge variant={
              currentQuestion.difficulty === 'easy' ? 'success' :
              currentQuestion.difficulty === 'medium' ? 'warning' : 'destructive'
            }>
              {currentQuestion.difficulty}
            </Badge>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Progress</p>
          <p className="text-lg font-semibold">
            {userAnswers.filter(a => a !== null).length}/{currentQuestions.length} answered
          </p>
        </div>
      </div>

      <Card className="border-primary">
        <CardHeader>
          <CardTitle className="text-lg">{currentQuestion.question}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrectOption = index === currentQuestion.correctAnswer;
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
            <div className={`p-4 rounded-lg border ${isCorrect ? 'border-green-500 bg-green-500/10' : 'border-orange-500 bg-orange-500/10'}`}>
              <p className="font-semibold mb-2">{isCorrect ? 'Correct!' : 'Incorrect'}</p>
              <p className="text-sm">{currentQuestion.explanation}</p>
            </div>
          )}

          {showExplanation && (
            <Button onClick={handleNext} className="w-full">
              {currentIndex < currentQuestions.length - 1 ? 'Next Question' : 'View Results'}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

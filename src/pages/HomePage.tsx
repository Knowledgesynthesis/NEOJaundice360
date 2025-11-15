import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { modules } from '@/data/modules';
import {
  Home,
  FlaskConical,
  BookOpen,
  Stethoscope,
  LineChart,
  Lightbulb,
  FileText,
  ClipboardCheck,
  Book,
  ArrowRight,
  Clock
} from 'lucide-react';

const iconMap: Record<string, any> = {
  Home,
  FlaskConical,
  BookOpen,
  Stethoscope,
  LineChart,
  Lightbulb,
  FileText,
  ClipboardCheck,
  Book,
};

export default function HomePage() {
  const learningModules = modules.filter(m => m.id !== 'home');

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          NeoJaundice360
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Comprehensive, evidence-based education on newborn jaundice
        </p>
        <p className="text-muted-foreground max-w-3xl mx-auto">
          From bilirubin physiology to clinical management, master everything you need to know
          about neonatal hyperbilirubinemia following AAP 2022+ guidelines.
        </p>
      </div>

      {/* Key Features */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LineChart className="h-5 w-5 text-primary" />
              Interactive Tools
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Explore the Bhutani nomogram, calculate phototherapy thresholds, and work through
              clinical cases with our interactive learning tools.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              Evidence-Based
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              All content aligned with AAP guidelines and current evidence-based practices in
              neonatal care.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardCheck className="h-5 w-5 text-primary" />
              Assess Knowledge
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Test your understanding with case-based questions and detailed explanations for
              every answer.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Learning Modules */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Learning Modules</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {learningModules.map((module) => {
            const Icon = iconMap[module.icon] || BookOpen;
            return (
              <Card key={module.id} className="hover:border-primary transition-colors">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{module.title}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            {module.estimatedTime} min
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <CardDescription className="mt-2">
                    {module.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {module.topics.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {module.topics.slice(0, 3).map((topic, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {topic}
                          </Badge>
                        ))}
                        {module.topics.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{module.topics.length - 3} more
                          </Badge>
                        )}
                      </div>
                    )}
                    <Link to={module.path}>
                      <Button className="w-full" variant="outline">
                        Start Learning
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Disclaimer */}
      <Card className="border-yellow-500/50 bg-yellow-500/5">
        <CardHeader>
          <CardTitle className="text-lg">Educational Purpose Only</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <p>
            This application is designed for educational purposes to help healthcare trainees
            learn about neonatal jaundice. It is not intended to provide medical advice or
            replace clinical judgment. Always follow your institution's protocols and consult
            with experienced clinicians for patient care decisions.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

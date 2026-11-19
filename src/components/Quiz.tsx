import { useState } from 'react';
import { permutation } from '@/lib/shuffle';
import { Link } from 'react-router';
import { ArrowRight, CheckCircle2, Circle, XCircle } from 'lucide-react';
import type { ModuleId, Question } from '@/data/questions';
import { QUESTIONS } from '@/data/questions';
import { MODULES } from '@/data/modules';
import { useApp } from '@/stores/appStore';
import { Button, Card } from './ui';
import { cn } from '@/lib/cn';
import { Cite } from './Cite';

export function QuestionCard({
  q,
  index,
  total,
  onAnswered,
}: {
  q: Question;
  index?: number;
  total?: number;
  onAnswered?: (correct: boolean) => void;
}) {
  const [picked, setPicked] = useState<number | null>(null);
  const record = useApp((s) => s.recordAnswer);
  const [order] = useState(() => (q.ordered ? q.options.map((_, i) => i) : permutation(q.options.length, q.id)));
  const done = picked !== null;
  const correct = picked === q.answer;
  const answerLetter = String.fromCharCode(65 + order.indexOf(q.answer));

  const pick = (i: number) => {
    if (done) return;
    setPicked(i);
    record(q.id, i === q.answer);
    onAnswered?.(i === q.answer);
  };

  return (
    <div className="space-y-3">
      {index != null && total != null && (
        <p className="text-xs font-medium text-muted">
          Question {index + 1} of {total}
        </p>
      )}
      <p className="font-semibold text-pretty">{q.stem}</p>
      <ol className="space-y-2" aria-label="Answer options">
        {order.map((i, pos) => {
          const o = q.options[i];
          const isAns = i === q.answer;
          const isPick = i === picked;
          return (
            <li key={i}>
              <button
                type="button"
                onClick={() => pick(i)}
                disabled={done}
                aria-pressed={isPick}
                className={cn(
                  'flex w-full items-start gap-3 rounded-xl border p-3 text-left text-sm transition-colors',
                  !done && 'border-border hover:border-brand hover:bg-surface-2',
                  done && isAns && 'border-ok bg-ok/10',
                  done && isPick && !isAns && 'border-exch bg-exch/10',
                  done && !isAns && !isPick && 'border-border opacity-70',
                )}
              >
                <span className="mt-0.5 shrink-0" aria-hidden>
                  {done && isAns ? (
                    <CheckCircle2 className="h-4 w-4 text-ok" />
                  ) : done && isPick ? (
                    <XCircle className="h-4 w-4 text-exch" />
                  ) : (
                    <Circle className="h-4 w-4 text-muted" />
                  )}
                </span>
                <span>
                  <span className="mr-1 font-semibold">{String.fromCharCode(65 + pos)}.</span>
                  {o}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
      {done && (
        <div role="status" className={cn('rounded-xl border p-3 text-sm', correct ? 'border-ok/50 bg-ok/8' : 'border-esc/50 bg-esc/8')}>
          <p className="font-semibold">{correct ? 'Correct.' : `Not quite — the answer is ${answerLetter}.`}</p>
          <p className="mt-1">
            {q.explanation}
            <Cite ids={q.refs} />
          </p>
        </div>
      )}
    </div>
  );
}

/** End-of-module block: two to four retrieval-practice questions, mark complete, go next. */
export function ModuleCheck({ module }: { module: ModuleId }) {
  const qs = QUESTIONS.filter((q) => q.module === module).slice(0, 4);
  const completed = useApp((s) => s.completed[module]);
  const toggle = useApp((s) => s.toggleComplete);
  const idx = MODULES.findIndex((m) => m.id === module);
  const next = MODULES[idx + 1];

  return (
    <Card className="no-print">
      <h2 className="text-xl font-bold">Check yourself</h2>
      <p className="mt-1 text-sm text-muted">Retrieval practice locks it in. Commit to an answer before you read the explanation.</p>
      <div className="mt-5 space-y-8">
        {qs.map((q) => (
          <QuestionCard key={q.id} q={q} />
        ))}
      </div>
      <div className="mt-6 flex flex-col gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
        <Button variant={completed ? 'outline' : 'primary'} onClick={() => toggle(module)}>
          {completed ? <CheckCircle2 className="h-4 w-4 text-ok" /> : <Circle className="h-4 w-4" />}
          {completed ? 'Module completed' : 'Mark module complete'}
        </Button>
        {next ? (
          <Link to={next.path} className="inline-flex items-center gap-1 text-sm font-semibold text-brand-strong hover:underline">
            Next: {next.title} <ArrowRight className="h-4 w-4" />
          </Link>
        ) : (
          <Link to="/cases" className="inline-flex items-center gap-1 text-sm font-semibold text-brand-strong hover:underline">
            Apply it: clinical cases <ArrowRight className="h-4 w-4" />
          </Link>
        )}
      </div>
    </Card>
  );
}

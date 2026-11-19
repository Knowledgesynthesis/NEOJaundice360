import { useMemo, useState } from 'react';
import { ArrowRight, RotateCcw } from 'lucide-react';
import { MODULE_LABEL, QUESTIONS, type ModuleId, type Question } from '@/data/questions';
import { useApp } from '@/stores/appStore';
import { QuestionCard } from '@/components/Quiz';
import { Button, Card, PageHeader, Segmented } from '@/components/ui';
import { cn } from '@/lib/cn';

function shuffle<T>(a: T[]): T[] {
  const r = [...a];
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [r[i], r[j]] = [r[j], r[i]];
  }
  return r;
}

type Mode = 'quick' | 'full' | 'missed' | ModuleId;

const modules = Object.keys(MODULE_LABEL) as ModuleId[];

export default function AssessmentPage() {
  const stats = useApp((s) => s.questionStats);
  const [mode, setMode] = useState<Mode>('quick');
  const [run, setRun] = useState<Question[] | null>(null);
  const [idx, setIdx] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [correct, setCorrect] = useState(0);

  const missed = QUESTIONS.filter((q) => stats[q.id] && !stats[q.id].lastCorrect);

  const mastery = useMemo(
    () =>
      modules.map((m) => {
        const qs = QUESTIONS.filter((q) => q.module === m);
        const ok = qs.filter((q) => stats[q.id]?.lastCorrect).length;
        return { m, ok, n: qs.length };
      }),
    [stats],
  );

  const start = () => {
    let pool: Question[];
    if (mode === 'quick') {
      // prioritise unseen and previously missed questions
      const weighted = shuffle(QUESTIONS).sort((a, b) => Number(!!stats[a.id]?.lastCorrect) - Number(!!stats[b.id]?.lastCorrect));
      pool = shuffle(weighted.slice(0, 10));
    } else if (mode === 'full') pool = shuffle(QUESTIONS);
    else if (mode === 'missed') pool = shuffle(missed);
    else pool = shuffle(QUESTIONS.filter((q) => q.module === mode));
    if (!pool.length) return;
    setRun(pool);
    setIdx(0);
    setAnswered(false);
    setCorrect(0);
  };

  if (run && idx < run.length) {
    const q = run[idx];
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-extrabold">Mastery quiz</h1>
          <Button variant="ghost" onClick={() => setRun(null)}>
            Exit
          </Button>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-surface-2" aria-hidden>
          <div className="h-full bg-brand transition-all" style={{ width: `${(idx / run.length) * 100}%` }} />
        </div>
        <Card>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-brand-strong">{MODULE_LABEL[q.module]}</p>
          <QuestionCard
            key={`${q.id}-${idx}`}
            q={q}
            index={idx}
            total={run.length}
            onAnswered={(ok) => {
              setAnswered(true);
              if (ok) setCorrect((c) => c + 1);
            }}
          />
          {answered && (
            <div className="mt-4 flex justify-end">
              <Button
                onClick={() => {
                  setIdx((i) => i + 1);
                  setAnswered(false);
                }}
              >
                {idx === run.length - 1 ? 'See results' : 'Next'} <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </Card>
      </div>
    );
  }

  if (run && idx >= run.length) {
    const pct = Math.round((correct / run.length) * 100);
    return (
      <div className="space-y-6">
        <PageHeader title="Results" lead={`${correct} of ${run.length} correct (${pct}%).`} />
        <Card>
          <p className="text-sm">
            {pct >= 85
              ? 'Mastery level. Re-test in a few days — spaced retrieval is what makes it stick.'
              : pct >= 60
                ? 'Solid base. Review the missed explanations, then run “Review missed”.'
                : 'Revisit the modules for the topics you missed, then try again.'}
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button onClick={() => setRun(null)}>
              <RotateCcw className="h-4 w-4" /> New quiz
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Mastery quiz"
        lead={`${QUESTIONS.length} questions written to the current guidelines, each with an explanation and source. Quick mode prioritizes what you haven't mastered yet.`}
      />
      <Card>
        <h2 className="mb-3 font-bold">Choose a set</h2>
        <Segmented<Mode>
          label="Quiz mode"
          value={mode}
          onChange={setMode}
          options={[
            { value: 'quick', label: 'Quick 10' },
            { value: 'full', label: `All ${QUESTIONS.length}` },
            { value: 'missed', label: `Review missed (${missed.length})` },
          ]}
        />
        <div className="mt-3 flex flex-wrap gap-2">
          {modules.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              aria-pressed={mode === m}
              className={cn('min-h-9 rounded-full border px-3 text-sm', mode === m ? 'border-brand bg-brand/15 font-semibold' : 'border-border hover:bg-surface-2')}
            >
              {MODULE_LABEL[m]}
            </button>
          ))}
        </div>
        <Button className="mt-5" onClick={start} disabled={mode === 'missed' && !missed.length}>
          Start <ArrowRight className="h-4 w-4" />
        </Button>
      </Card>

      <Card>
        <h2 className="mb-3 font-bold">Mastery by topic</h2>
        <ul className="space-y-3">
          {mastery.map(({ m, ok, n }) => (
            <li key={m}>
              <div className="flex justify-between text-sm">
                <span>{MODULE_LABEL[m]}</span>
                <span className="tabular text-muted">
                  {ok}/{n}
                </span>
              </div>
              <div className="mt-1 h-2 overflow-hidden rounded-full bg-surface-2" role="progressbar" aria-valuenow={ok} aria-valuemin={0} aria-valuemax={n} aria-label={`${MODULE_LABEL[m]} mastery`}>
                <div className={cn('h-full', ok === n ? 'bg-ok' : 'bg-brand')} style={{ width: `${(ok / n) * 100}%` }} />
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

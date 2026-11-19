import { Link } from 'react-router';
import { ArrowRight, Calculator, CheckCircle2, ClipboardList, GraduationCap, RotateCcw, Syringe } from 'lucide-react';
import { MODULES } from '@/data/modules';
import { QUESTIONS } from '@/data/questions';
import { CASES } from '@/data/cases';
import { useApp } from '@/stores/appStore';
import { Badge, Card } from '@/components/ui';
import { cn } from '@/lib/cn';

const CHANGES: [string, string][] = [
  ['Fixed cut-offs (“physiologic <12 mg/dL”)', 'Hour-specific thresholds by gestational week and neurotoxicity risk factors'],
  ['Bhutani risk zones for follow-up', 'Follow-up from the distance between bilirubin and the treatment threshold'],
  ['Low / medium / high-risk curves (2004)', 'Curves for each week 35–≥40, thresholds raised ~1–2 mg/dL'],
  ['Cholestasis = direct >20% of total', 'Direct/conjugated bilirubin ≥1.0 mg/dL at any total'],
  ['Kasai “before 60 days”', 'Identify by 2–4 weeks; Kasai ideally before 30–45 days'],
  ['Phototherapy 420–470 nm', 'Blue–green ~460–490 nm, ≥30 µW/cm²/nm for intensive phototherapy'],
  ['Exchange when “near” exchange level', 'Escalation-of-care threshold (exchange − 2 mg/dL) as a defined emergency'],
];

export default function HomePage() {
  const completed = useApp((s) => s.completed);
  const stats = useApp((s) => s.questionStats);
  const casesDone = useApp((s) => s.casesDone);
  const reset = useApp((s) => s.resetProgress);

  const doneModules = MODULES.filter((m) => completed[m.id]).length;
  const answered = QUESTIONS.filter((q) => stats[q.id]).length;
  const mastered = QUESTIONS.filter((q) => stats[q.id]?.lastCorrect).length;
  const nextModule = MODULES.find((m) => !completed[m.id]) ?? MODULES[0];
  const totalMinutes = MODULES.reduce((a, m) => a + m.minutes, 0);

  return (
    <div className="space-y-10">
      <section className="relative overflow-hidden rounded-3xl border border-border bg-surface p-6 sm:p-10">
        <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand/25 blur-3xl" />
        <p className="text-xs font-semibold uppercase tracking-wider text-brand-strong">Newborn jaundice, start to finish</p>
        <h1 className="mt-2 max-w-3xl text-4xl font-extrabold tracking-tight text-balance sm:text-5xl">
          Understand it, decide it, and never miss the dangerous ones.
        </h1>
        <p className="mt-4 max-w-2xl text-base text-muted sm:text-lg">
          Seven focused modules (~{Math.round(totalMinutes / 5) * 5} min), a guideline-exact threshold calculator, {CASES.length} branching cases and a{' '}
          {QUESTIONS.length}-question mastery bank. Built on AAP 2022, AAP 2025 biliary-atresia guidance, NASPGHAN/ESPGHAN, NICE and CPS 2025.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to={nextModule.path} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-brand px-5 font-semibold text-brand-fg hover:bg-brand-strong">
            {doneModules ? 'Continue' : 'Start'}: {nextModule.title} <ArrowRight className="h-4 w-4" />
          </Link>
          <Link to="/calculator" className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-border bg-surface px-5 font-semibold hover:bg-surface-2">
            <Calculator className="h-4 w-4" /> Open calculator
          </Link>
        </div>
      </section>

      <section aria-labelledby="progress">
        <h2 id="progress" className="sr-only">
          Your progress
        </h2>
        <div className="grid gap-3 sm:grid-cols-3">
          <Card className="p-4 sm:p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">Modules</p>
            <p className="tabular mt-1 text-3xl font-extrabold">
              {doneModules}
              <span className="text-lg text-muted">/{MODULES.length}</span>
            </p>
          </Card>
          <Card className="p-4 sm:p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">Questions mastered</p>
            <p className="tabular mt-1 text-3xl font-extrabold">
              {mastered}
              <span className="text-lg text-muted">/{QUESTIONS.length}</span>
            </p>
            <p className="text-xs text-muted">{answered} attempted</p>
          </Card>
          <Card className="p-4 sm:p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">Cases completed</p>
            <p className="tabular mt-1 text-3xl font-extrabold">
              {Object.keys(casesDone).length}
              <span className="text-lg text-muted">/{CASES.length}</span>
            </p>
          </Card>
        </div>
        {(doneModules > 0 || answered > 0) && (
          <button type="button" onClick={() => confirm('Reset all progress on this device?') && reset()} className="mt-2 inline-flex items-center gap-1 text-xs text-muted hover:text-fg">
            <RotateCcw className="h-3 w-3" /> Reset progress
          </button>
        )}
      </section>

      <section aria-labelledby="path">
        <h2 id="path" className="mb-4 text-2xl font-bold">
          Learning path
        </h2>
        <ol className="grid gap-3 md:grid-cols-2">
          {MODULES.map((m) => (
            <li key={m.id}>
              <Link
                to={m.path}
                className={cn('group flex h-full gap-4 rounded-2xl border border-border bg-surface p-4 transition-colors hover:border-brand sm:p-5', completed[m.id] && 'border-ok/40')}
              >
                <span
                  className={cn(
                    'grid h-10 w-10 shrink-0 place-items-center rounded-xl text-lg font-extrabold',
                    completed[m.id] ? 'bg-ok/15 text-ok' : 'bg-brand/15 text-brand-strong',
                  )}
                >
                  {completed[m.id] ? <CheckCircle2 className="h-5 w-5" /> : m.step}
                </span>
                <span className="min-w-0">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="font-bold group-hover:text-brand-strong">{m.title}</span>
                    <Badge>{m.minutes} min</Badge>
                  </span>
                  <span className="mt-1 block text-sm text-muted">{m.summary}</span>
                </span>
              </Link>
            </li>
          ))}
        </ol>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {[
            { to: '/cases', icon: ClipboardList, t: 'Clinical cases', d: 'Decide step by step; the engine checks every number.' },
            { to: '/assessment', icon: GraduationCap, t: 'Mastery quiz', d: 'Adaptive review of what you got wrong.' },
            { to: '/quick-reference', icon: Syringe, t: 'Quick reference', d: 'One printable page for the ward.' },
          ].map((x) => (
            <Link key={x.to} to={x.to} className="rounded-2xl border border-border bg-surface p-4 hover:border-brand">
              <x.icon className="h-5 w-5 text-brand-strong" aria-hidden />
              <p className="mt-2 font-bold">{x.t}</p>
              <p className="text-sm text-muted">{x.d}</p>
            </Link>
          ))}
        </div>
      </section>

      <section aria-labelledby="changed">
        <h2 id="changed" className="mb-1 text-2xl font-bold">
          If you learned this before 2022, unlearn these
        </h2>
        <p className="mb-4 text-sm text-muted">The most common outdated rules still taught on wards and in older apps.</p>
        <Card className="p-0 sm:p-0">
          <ul className="divide-y divide-border">
            {CHANGES.map(([old, now]) => (
              <li key={old} className="grid gap-1 p-4 sm:grid-cols-2 sm:gap-6">
                <p className="text-sm text-muted line-through decoration-exch/60">{old}</p>
                <p className="text-sm font-medium">{now}</p>
              </li>
            ))}
          </ul>
        </Card>
      </section>
    </div>
  );
}

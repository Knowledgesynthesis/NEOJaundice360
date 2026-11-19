import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { ArrowLeft, ArrowRight, Calculator, CheckCircle2, Circle, RotateCcw, Square, SquareCheck, XCircle } from 'lucide-react';
import { CASES, type CaseCalc, type ClinicalCase } from '@/data/cases';
import { assess } from '@/lib/bili/assess';
import { NO_RISK_FACTORS } from '@/lib/bili/guidelines';
import { formatBili } from '@/lib/bili/units';
import { useApp } from '@/stores/appStore';
import { Badge, Button, Card, PageHeader } from '@/components/ui';
import { cn } from '@/lib/cn';
import { Cite } from '@/components/Cite';

function CalcPanel({ calc }: { calc: CaseCalc }) {
  const unit = useApp((s) => s.unit);
  const a = useMemo(
    () =>
      assess({
        gaWeeks: calc.gaWeeks,
        measurements: calc.measurements,
        riskFactors: { ...NO_RISK_FACTORS, ...calc.rf },
        albumin: calc.albumin,
        abeSigns: calc.abeSigns,
      })!,
    [calc],
  );
  const t = a.thresholds;
  const q = new URLSearchParams();
  q.set('ga', String(calc.gaWeeks));
  q.set('m', calc.measurements.map((m) => `${m.ageHours}:${m.value}:${m.method}`).join(','));
  const rfs = Object.entries(calc.rf ?? {}).filter(([, v]) => v).map(([k]) => k);
  if (rfs.length) q.set('rf', rfs.join(','));
  if (calc.albumin) q.set('alb', String(calc.albumin));
  if (calc.abeSigns) q.set('abe', '1');

  return (
    <div className="rounded-xl border border-photo/40 bg-photo/6 p-3 text-sm">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-photo">Engine read-out — {t.phototherapyCurveLabel}</p>
      <div className="tabular grid grid-cols-2 gap-x-4 gap-y-1 sm:grid-cols-4">
        <span>
          Phototherapy <strong>{formatBili(t.phototherapy.value, unit)}</strong>
        </span>
        <span>
          Escalation <strong>{formatBili(t.escalation.value, unit)}</strong>
        </span>
        <span>
          Exchange <strong>{formatBili(t.exchange.value, unit)}</strong>
        </span>
        {a.rate && (
          <span>
            Rise <strong>{a.rate.mgdlPerHour.toFixed(2)} mg/dL/h</strong>
          </span>
        )}
      </div>
      <Link to={`/calculator?${q.toString()}`} className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-photo hover:underline">
        <Calculator className="h-3.5 w-3.5" /> Open in calculator
      </Link>
    </div>
  );
}

function Player({ c }: { c: ClinicalCase }) {
  const navigate = useNavigate();
  const recordCase = useApp((s) => s.recordCase);
  const [i, setI] = useState(0);
  const [sel, setSel] = useState<number[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [scores, setScores] = useState<boolean[]>([]);
  const step = c.steps[i];
  const finished = i >= c.steps.length;

  const isRight = (picked: number[]) => {
    const correct = step.options.map((o, j) => (o.correct ? j : -1)).filter((j) => j >= 0);
    return picked.length === correct.length && correct.every((j) => picked.includes(j));
  };

  const submit = (picked: number[]) => {
    setSel(picked);
    setSubmitted(true);
    const ok = isRight(picked);
    const next = [...scores];
    next[i] = ok;
    setScores(next);
    if (i === c.steps.length - 1) recordCase(c.id, Math.round((next.filter(Boolean).length / c.steps.length) * 100));
  };

  const advance = () => {
    setI((x) => x + 1);
    setSel([]);
    setSubmitted(false);
  };

  if (finished) {
    const n = scores.filter(Boolean).length;
    return (
      <Card>
        <h2 className="text-2xl font-bold">Case complete</h2>
        <p className="mt-1 text-muted">
          First-attempt decisions correct: <strong className="text-fg">{n}/{c.steps.length}</strong>
        </p>
        <h3 className="mt-5 font-bold">Take-aways</h3>
        <ul className="mt-2 space-y-1.5">
          {c.takeaways.map((t) => (
            <li key={t} className="flex gap-2 text-sm">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-ok" /> {t}
            </li>
          ))}
        </ul>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button
            variant="outline"
            onClick={() => {
              setI(0);
              setScores([]);
              setSel([]);
              setSubmitted(false);
            }}
          >
            <RotateCcw className="h-4 w-4" /> Replay
          </Button>
          <Button onClick={() => navigate('/cases')}>All cases</Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2" aria-label={`Step ${i + 1} of ${c.steps.length}`}>
        {c.steps.map((_, j) => (
          <span key={j} className={cn('h-1.5 flex-1 rounded-full', j < i ? (scores[j] ? 'bg-ok' : 'bg-esc') : j === i ? 'bg-brand' : 'bg-surface-2')} />
        ))}
      </div>
      <Card>
        <p className="text-xs font-semibold uppercase tracking-wide text-brand-strong">
          Step {i + 1} of {c.steps.length} · {step.title}
        </p>
        <p className="mt-2 text-base">{step.narrative}</p>
        {step.data && (
          <dl className="tabular mt-3 grid grid-cols-1 gap-x-6 gap-y-1 rounded-xl bg-surface-2/60 p-3 text-sm sm:grid-cols-2">
            {step.data.map(([k, v]) => (
              <div key={k} className="flex justify-between gap-3">
                <dt className="text-muted">{k}</dt>
                <dd className="font-medium">{v}</dd>
              </div>
            ))}
          </dl>
        )}
        {step.calc && submitted && (
          <div className="mt-3">
            <CalcPanel calc={step.calc} />
          </div>
        )}

        <p className="mt-5 font-semibold">{step.question}</p>
        {step.multi && <p className="text-xs text-muted">Select all that apply, then submit.</p>}
        <ul className="mt-3 space-y-2">
          {step.options.map((o, j) => {
            const picked = sel.includes(j);
            const Icon = submitted ? (o.correct ? CheckCircle2 : picked ? XCircle : step.multi ? Square : Circle) : step.multi ? (picked ? SquareCheck : Square) : Circle;
            return (
              <li key={j}>
                <button
                  type="button"
                  disabled={submitted}
                  aria-pressed={picked}
                  onClick={() => (step.multi ? setSel((s) => (s.includes(j) ? s.filter((x) => x !== j) : [...s, j])) : submit([j]))}
                  className={cn(
                    'flex w-full items-start gap-3 rounded-xl border p-3 text-left text-sm transition-colors',
                    !submitted && (picked ? 'border-brand bg-brand/10' : 'border-border hover:border-brand hover:bg-surface-2'),
                    submitted && o.correct && 'border-ok bg-ok/10',
                    submitted && !o.correct && picked && 'border-exch bg-exch/10',
                    submitted && !o.correct && !picked && 'border-border opacity-70',
                  )}
                >
                  <Icon className={cn('mt-0.5 h-4 w-4 shrink-0', submitted && o.correct ? 'text-ok' : submitted && picked ? 'text-exch' : 'text-muted')} aria-hidden />
                  <span>
                    {o.text}
                    {submitted && (picked || o.correct) && <span className="mt-1 block text-xs text-muted">{o.feedback}</span>}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
        {step.multi && !submitted && (
          <Button className="mt-3" disabled={!sel.length} onClick={() => submit(sel)}>
            Submit
          </Button>
        )}
        {submitted && (
          <div role="status" className={cn('mt-4 rounded-xl border p-3 text-sm', isRight(sel) ? 'border-ok/50 bg-ok/8' : 'border-esc/50 bg-esc/8')}>
            <p className="font-semibold">{isRight(sel) ? 'Good decision.' : 'Review this one.'}</p>
            <p className="mt-1">
              {step.teaching}
              {step.refs && <Cite ids={step.refs} />}
            </p>
          </div>
        )}
        {submitted && (
          <div className="mt-4 flex justify-end">
            <Button onClick={advance}>
              {i === c.steps.length - 1 ? 'Finish case' : 'Next step'} <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}

export default function CasesPage() {
  const { caseId } = useParams();
  const done = useApp((s) => s.casesDone);
  const c = CASES.find((x) => x.id === caseId);

  if (c) {
    return (
      <div className="space-y-6">
        <Link to="/cases" className="inline-flex items-center gap-1 text-sm font-semibold text-muted hover:text-fg">
          <ArrowLeft className="h-4 w-4" /> All cases
        </Link>
        <header>
          <div className="flex flex-wrap gap-2">
            <Badge tone={c.level === 'Advanced' ? 'esc' : 'brand'}>{c.level}</Badge>
            {c.tags.map((t) => (
              <Badge key={t}>{t}</Badge>
            ))}
          </div>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight">{c.title}</h1>
          <p className="mt-1 text-muted">{c.hook}</p>
        </header>
        <Player key={c.id} c={c} />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Clinical cases"
        lead="Make the call at each step. Numbers are computed live by the same engine as the calculator, so the reasoning always matches the guideline."
      />
      <ul className="grid gap-3 md:grid-cols-2">
        {CASES.map((x) => (
          <li key={x.id}>
            <Link to={`/cases/${x.id}`} className="flex h-full flex-col rounded-2xl border border-border bg-surface p-5 hover:border-brand">
              <span className="flex flex-wrap items-center gap-2">
                <Badge tone={x.level === 'Advanced' ? 'esc' : 'brand'}>{x.level}</Badge>
                {done[x.id] != null && <Badge tone="ok">Done · {done[x.id]}%</Badge>}
              </span>
              <span className="mt-2 text-lg font-bold">{x.title}</span>
              <span className="mt-1 text-sm text-muted">{x.hook}</span>
              <span className="mt-3 flex flex-wrap gap-1.5">
                {x.tags.map((t) => (
                  <Badge key={t}>{t}</Badge>
                ))}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

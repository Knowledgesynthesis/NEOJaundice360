import { useMemo, useState } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import { ETIOLOGIES, MECHANISM_LABEL, type Fraction, type Mechanism } from '@/data/etiologies';
import { Badge, Callout, Card, KeyPoints, PageHeader, Segmented, SectionTitle, Table } from '@/components/ui';
import { cn } from '@/lib/cn';
import { Cite } from '@/components/Cite';
import { ModuleCheck } from '@/components/Quiz';

const mechTone: Record<Mechanism, 'exch' | 'photo' | 'info' | 'esc' | 'neutral'> = {
  production: 'exch',
  conjugation: 'photo',
  enterohepatic: 'info',
  excretion: 'esc',
  mixed: 'neutral',
};

export default function CausesPage() {
  const [fraction, setFraction] = useState<'all' | Fraction>('all');
  const [mech, setMech] = useState<'all' | Mechanism>('all');
  const [q, setQ] = useState('');
  const [open, setOpen] = useState<string | null>(null);

  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    return ETIOLOGIES.filter(
      (e) =>
        (fraction === 'all' || e.fraction === fraction) &&
        (mech === 'all' || e.mechanism === mech) &&
        (!s || [e.name, e.hallmark, ...e.clues, ...e.tests, ...e.management].join(' ').toLowerCase().includes(s)),
    );
  }, [fraction, mech, q]);

  return (
    <div className="space-y-8">
      <PageHeader
        step="Module 2 · 20 min"
        title="Causes & classification"
        lead="Classify by three questions: Which fraction (total vs direct)? When did it start? Which mechanism? The answer narrows 20 causes to two or three."
      />

      <Card>
        <SectionTitle kicker="Frame">Timing narrows the differential</SectionTitle>
        <div className="grid gap-3 md:grid-cols-3">
          {[
            {
              t: 'First 24 hours',
              tone: 'border-exch/50 bg-exch/8',
              items: ['Pathologic until proven otherwise', 'Isoimmune hemolysis (ABO, Rh, others)', 'G6PD deficiency, spherocytosis', 'Sepsis, congenital infection'],
              act: 'Measure now: TSB, DAT, type, CBC/retic/smear.',
            },
            {
              t: 'Day 2 – week 2',
              tone: 'border-photo/50 bg-photo/8',
              items: ['Physiologic (developmental)', 'Suboptimal intake', 'Bruising / cephalohematoma, polycythemia', 'G6PD (sudden rises), Gilbert amplification'],
              act: 'Plot against the hour-specific threshold; check intake and weight.',
            },
            {
              t: 'Beyond 2 weeks',
              tone: 'border-esc/50 bg-esc/8',
              items: ['Breast milk jaundice (most common)', 'CHOLESTASIS — biliary atresia', 'Hypothyroidism, UTI', 'Hemolysis, Crigler–Najjar'],
              act: 'Always: total + direct/conjugated bilirubin, stool color, newborn screen.',
            },
          ].map((c) => (
            <div key={c.t} className={cn('rounded-xl border p-4', c.tone)}>
              <p className="font-bold">{c.t}</p>
              <ul className="mt-2 ml-4 list-disc space-y-1 text-sm">
                {c.items.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
              <p className="mt-3 text-sm font-semibold">{c.act}</p>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-muted">
          <Cite ids={['aap2022', 'harpavat2025', 'nice2010']} />
        </p>
      </Card>

      <Card>
        <SectionTitle kicker="Explorer">All causes</SectionTitle>
        <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center">
          <Segmented
            label="Fraction"
            value={fraction}
            onChange={setFraction}
            options={[
              { value: 'all', label: 'All' },
              { value: 'unconjugated', label: 'Unconjugated' },
              { value: 'conjugated', label: 'Conjugated' },
            ]}
          />
          <select
            aria-label="Mechanism"
            className="min-h-10 rounded-xl border border-border bg-surface px-3 text-sm"
            value={mech}
            onChange={(e) => setMech(e.target.value as 'all' | Mechanism)}
          >
            <option value="all">All mechanisms</option>
            {(Object.keys(MECHANISM_LABEL) as Mechanism[]).map((m) => (
              <option key={m} value={m}>
                {MECHANISM_LABEL[m]}
              </option>
            ))}
          </select>
          <label className="relative flex-1">
            <span className="sr-only">Search causes</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search a clue, e.g. “spherocytes”, “low GGT”"
              className="min-h-10 w-full rounded-xl border border-border bg-surface pl-9 pr-3 text-sm"
            />
          </label>
        </div>
        <p className="mb-3 text-xs text-muted" aria-live="polite">
          {list.length} of {ETIOLOGIES.length} causes
        </p>
        <ul className="space-y-2">
          {list.map((e) => {
            const isOpen = open === e.id;
            return (
              <li key={e.id} className="rounded-xl border border-border">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : e.id)}
                  aria-expanded={isOpen}
                  className="flex w-full items-start gap-3 p-3 text-left hover:bg-surface-2/60 sm:p-4"
                >
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold">{e.name}</span>
                      <Badge tone={e.fraction === 'conjugated' ? 'esc' : 'brand'}>{e.fraction}</Badge>
                      <Badge tone={mechTone[e.mechanism]}>{MECHANISM_LABEL[e.mechanism].split(' (')[0]}</Badge>
                    </span>
                    <span className="mt-1 block text-sm text-muted">
                      {e.onset} — {e.hallmark}
                    </span>
                  </span>
                  <ChevronDown className={cn('mt-1 h-5 w-5 shrink-0 text-muted transition-transform', isOpen && 'rotate-180')} aria-hidden />
                </button>
                {isOpen && (
                  <div className="grid gap-4 border-t border-border p-4 text-sm md:grid-cols-3">
                    <div>
                      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted">Clues</p>
                      <ul className="ml-4 list-disc space-y-1">{e.clues.map((c) => <li key={c}>{c}</li>)}</ul>
                    </div>
                    <div>
                      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted">Tests</p>
                      <ul className="ml-4 list-disc space-y-1">{e.tests.map((c) => <li key={c}>{c}</li>)}</ul>
                    </div>
                    <div>
                      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted">Management</p>
                      <ul className="ml-4 list-disc space-y-1">{e.management.map((c) => <li key={c}>{c}</li>)}</ul>
                    </div>
                    {e.pitfall && (
                      <Callout kind="warn" title="Pitfall" className="md:col-span-3">
                        {e.pitfall}
                      </Callout>
                    )}
                    <p className="text-xs text-muted md:col-span-3">
                      Sources: <Cite ids={e.refs} />
                    </p>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </Card>

      <Card>
        <SectionTitle kicker="Don’t confuse">Suboptimal intake vs breast milk jaundice</SectionTitle>
        <Table
          head={['', 'Suboptimal intake jaundice', 'Breast milk jaundice']}
          rows={[
            ['Timing', 'Days 2–5', 'After week 1; can last 8–12 weeks'],
            ['Infant', 'Sleepy, weight loss >75th percentile (NEWT) or ≥10%', 'Thriving, gaining weight'],
            ['Output', 'Few wet diapers; delayed yellow stools', 'Normal urine and yellow stools'],
            ['Mechanism', 'Calorie deficit → ↑ enterohepatic recirculation', 'Milk factors (e.g., β-glucuronidase) + host UGT1A1 variants'],
            ['Action', 'More milk: lactation support ± supplementation (expressed, donor, formula)', 'Continue breastfeeding; DB/CB first to exclude cholestasis'],
            ['Never', 'Water or dextrose water', 'Interrupt breastfeeding “to test”'],
          ]}
        />
        <p className="mt-2 text-xs text-muted">
          <Cite ids={['abm22', 'flaherman2015']} />
        </p>
      </Card>

      <KeyPoints
        points={[
          'Jaundice <24 h is pathologic until proven otherwise — usually hemolysis.',
          'A positive DAT, G6PD deficiency or other hemolysis are neurotoxicity risk factors that lower the treatment threshold.',
          'Weak or negative DAT does not exclude ABO disease; a weakly positive DAT after maternal anti-D is often passive antibody.',
          'G6PD activity can be falsely normal during hemolysis.',
          'Jaundice beyond 2 weeks always needs a direct/conjugated bilirubin.',
        ]}
      />
      <ModuleCheck module="causes" />
    </div>
  );
}

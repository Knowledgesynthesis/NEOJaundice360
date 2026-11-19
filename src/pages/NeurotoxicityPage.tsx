import { useState } from 'react';
import { Callout, Card, KeyPoints, PageHeader, SectionTitle, Table } from '@/components/ui';
import { cn } from '@/lib/cn';
import { Cite } from '@/components/Cite';
import { ModuleCheck } from '@/components/Quiz';

const BIND_ITEMS = [
  {
    k: 'mental',
    title: 'Mental status',
    levels: ['Normal', 'Sleepy but arousable; decreased feeding', 'Lethargy, poor suck and/or irritable/jittery with strong suck', 'Semi-coma, apnea, unable to feed, seizures, coma'],
  },
  {
    k: 'tone',
    title: 'Muscle tone',
    levels: [
      'Normal',
      'Persistent mild-to-moderate hypotonia',
      'Mild-to-moderate hypertonia alternating with hypotonia; beginning arching of neck/trunk on stimulation',
      'Persistent retrocollis and opisthotonos; bicycling or twitching of hands and feet',
    ],
  },
  {
    k: 'cry',
    title: 'Cry pattern',
    levels: ['Normal', 'High-pitched when aroused', 'Shrill, difficult to console', 'Inconsolable, or weak/absent cry'],
  },
] as const;

function bindBand(score: number) {
  if (score === 0) return { label: 'No signs of ABE', cls: 'border-ok/50 bg-ok/10', action: 'Treat by thresholds; reassess tone, cry and feeding at each review.' };
  if (score <= 3) return { label: 'Subtle (early) ABE', cls: 'border-photo/50 bg-photo/10', action: 'Intensive phototherapy and escalation work-up; reversible.' };
  if (score <= 6) return { label: 'Moderate ABE', cls: 'border-esc/60 bg-esc/12', action: 'Urgent exchange transfusion — potentially reversible with prompt treatment.' };
  return { label: 'Advanced ABE', cls: 'border-exch/60 bg-exch/12', action: 'Emergency exchange transfusion; high risk of permanent kernicterus.' };
}

export default function NeurotoxicityPage() {
  const [s, setS] = useState<Record<string, number>>({ mental: 0, tone: 0, cry: 0 });
  const total = s.mental + s.tone + s.cry;
  const band = bindBand(total);

  return (
    <div className="space-y-8">
      <PageHeader
        step="Module 6 · 15 min"
        title="Neurotoxicity"
        lead="Bilirubin injures specific neurons — globus pallidus, subthalamic nucleus, brainstem auditory and oculomotor nuclei. Recognize the acute syndrome early, because moderate encephalopathy can still be reversed."
      />

      <Card>
        <SectionTitle kicker="Interactive">BIND score — stage acute bilirubin encephalopathy</SectionTitle>
        <div className="grid gap-4 lg:grid-cols-3">
          {BIND_ITEMS.map((item) => (
            <fieldset key={item.k} className="rounded-xl border border-border p-3">
              <legend className="px-1 text-sm font-bold">{item.title}</legend>
              <div className="space-y-1.5">
                {item.levels.map((lv, i) => (
                  <label key={i} className={cn('flex cursor-pointer gap-2 rounded-lg p-2 text-sm hover:bg-surface-2', s[item.k] === i && 'bg-brand/12')}>
                    <input type="radio" name={item.k} className="mt-0.5 accent-[var(--brand)]" checked={s[item.k] === i} onChange={() => setS((x) => ({ ...x, [item.k]: i }))} />
                    <span>
                      <strong className="tabular">{i}</strong> — {lv}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
          ))}
        </div>
        <div aria-live="polite" className={cn('mt-4 rounded-2xl border p-4', band.cls)}>
          <p className="text-lg font-extrabold">
            BIND {total}/9 — {band.label}
          </p>
          <p className="mt-1 text-sm">{band.action}</p>
        </div>
        <p className="mt-2 text-xs text-muted">
          1–3 subtle, 4–6 moderate, 7–9 advanced. A modified version (BIND-M) adds eye movements. <Cite ids={['bind', 'aap2022']} />
        </p>
      </Card>

      <Card>
        <SectionTitle kicker="Recognize">The acute syndrome evolves</SectionTitle>
        <Table
          head={['Phase', 'Signs', 'Action']}
          rows={[
            ['Early', 'Lethargy, hypotonia, poor suck, high-pitched cry', 'Intensive phototherapy, escalation bundle'],
            ['Intermediate', 'Stupor or irritability, hypertonia (retrocollis, opisthotonos), possible fever', 'Urgent exchange transfusion — regardless of TSB'],
            ['Advanced', 'Pronounced retrocollis–opisthotonos, shrill cry, no feeding, apnea, seizures, coma', 'Emergency exchange; high risk of death or kernicterus'],
          ]}
        />
        <p className="mt-2 text-xs text-muted">
          <Cite ids={['aap2022', 'watchko2013']} />
        </p>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <h3 className="mb-2 font-bold">Kernicterus spectrum disorder (chronic)</h3>
          <ul className="ml-4 list-disc space-y-1 text-sm">
            <li>Extrapyramidal movement disorder: dystonia, athetosis</li>
            <li>Auditory neuropathy spectrum disorder (ANSD)</li>
            <li>Upward gaze palsy</li>
            <li>Dental enamel dysplasia of primary teeth</li>
            <li>Subtypes: motor-predominant, auditory-predominant, classic, subtle (“BIND”) forms</li>
          </ul>
          <p className="mt-2 text-xs text-muted">
            <Cite ids={['lepichon2017']} />
          </p>
        </Card>
        <Card>
          <h3 className="mb-2 font-bold">Tests after exchange-level bilirubin</h3>
          <ul className="ml-4 list-disc space-y-1 text-sm">
            <li>
              <strong>Diagnostic ABR</strong> — OAE alone misses ANSD (outer hair cells intact). A JCIH risk indicator.
            </li>
            <li>
              <strong>MRI:</strong> bilateral globus pallidus (± subthalamic) T1 hyperintensity acutely; T2 hyperintensity in chronic kernicterus.
            </li>
            <li>Neurology and developmental follow-up; early audiology and motor intervention.</li>
          </ul>
          <p className="mt-2 text-xs text-muted">
            <Cite ids={['jcih2019', 'watchko2013']} />
          </p>
        </Card>
      </div>

      <Callout kind="danger" title="Kernicterus is a system failure">
        In the US Kernicterus Registry, most affected infants were apparently healthy term or late-preterm babies, often discharged early with no bilirubin measurement or late
        follow-up; G6PD deficiency and unrecognized hemolysis were over-represented. Universal pre-discharge measurement, structured follow-up and the escalation pathway exist to
        close those gaps.
        <Cite ids={['johnson2009', 'aap2022']} />
      </Callout>

      <KeyPoints
        points={[
          'Unbound unconjugated bilirubin injures basal ganglia and brainstem nuclei.',
          'Intermediate/advanced ABE signs → urgent exchange regardless of the TSB.',
          'BIND 4–6 (moderate) can reverse with prompt exchange.',
          'After exchange-level bilirubin: diagnostic ABR, MRI, developmental follow-up.',
        ]}
      />
      <ModuleCheck module="neurotoxicity" />
    </div>
  );
}

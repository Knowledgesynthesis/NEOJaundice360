import { useMemo, useState } from 'react';
import { Link } from 'react-router';
import { ArrowDown, ArrowRight, RotateCcw } from 'lucide-react';
import { Callout, Card, Check, KeyPoints, PageHeader, SectionTitle } from '@/components/ui';
import { cn } from '@/lib/cn';
import { Cite } from '@/components/Cite';
import { ModuleCheck } from '@/components/Quiz';
import { BiliChart } from '@/components/BiliChart';
import { useApp } from '@/stores/appStore';
import { PHOTO_NO_RF, sampleCurve } from '@/lib/bili/aap2022';

interface Step {
  id: string;
  place: string;
  title: string;
  what: string;
  newborn: string;
  breaks: { text: string; to?: string }[];
}

const STEPS: Step[] = [
  {
    id: 'rbc',
    place: 'Spleen / liver macrophages',
    title: 'Red-cell breakdown',
    what: '~75–80% of bilirubin comes from senescent red cells; the rest from ineffective erythropoiesis and other heme proteins. 1 g of hemoglobin → ~35 mg bilirubin.',
    newborn: 'Higher red-cell mass and shorter lifespan (~70–90 days at term, less in preterm) → production ~2–3× the adult rate per kg.',
    breaks: [
      { text: 'Isoimmune hemolysis (ABO, Rh, Kell)', to: '/causes' },
      { text: 'G6PD deficiency, spherocytosis', to: '/causes' },
      { text: 'Cephalohematoma, bruising, polycythemia', to: '/causes' },
    ],
  },
  {
    id: 'ho',
    place: 'Macrophage',
    title: 'Heme oxygenase',
    what: 'Rate-limiting step: heme → biliverdin + Fe²⁺ + carbon monoxide (CO). CO and bilirubin are made one-to-one.',
    newborn: 'End-tidal CO (ETCOc) quantifies bilirubin production — a direct measure of hemolysis where available.',
    breaks: [{ text: 'Rapid rate of rise (≥0.3 mg/dL/h <24 h; ≥0.2 after) signals ↑ production', to: '/evaluation' }],
  },
  {
    id: 'bvr',
    place: 'Macrophage',
    title: 'Biliverdin reductase',
    what: 'Green, water-soluble biliverdin is reduced to yellow, lipophilic unconjugated bilirubin (UCB).',
    newborn: 'UCB is the form that causes both jaundice and neurotoxicity.',
    breaks: [],
  },
  {
    id: 'albumin',
    place: 'Plasma',
    title: 'Albumin transport',
    what: 'UCB binds albumin tightly. A tiny unbound (“free”) fraction crosses the blood–brain barrier.',
    newborn: 'Low albumin, acidosis, sepsis and displacing drugs (ceftriaxone, sulfonamides) raise unbound bilirubin.',
    breaks: [
      { text: 'Albumin <3.0 g/dL and sepsis are neurotoxicity risk factors', to: '/thresholds' },
      { text: 'Kernicterus: globus pallidus, brainstem auditory nuclei', to: '/neurotoxicity' },
    ],
  },
  {
    id: 'uptake',
    place: 'Hepatocyte',
    title: 'Hepatic uptake',
    what: 'OATP1B1/1B3 transporters take up UCB; ligandin (glutathione S-transferase) holds it inside the cell.',
    newborn: 'Ligandin and transporter expression are immature.',
    breaks: [],
  },
  {
    id: 'ugt',
    place: 'Hepatocyte (ER)',
    title: 'Conjugation — UGT1A1',
    what: 'UGT1A1 adds glucuronic acid → water-soluble mono- and diglucuronides (conjugated bilirubin).',
    newborn: 'Activity ≈1% of adult at term, reaching adult levels by ~14 weeks — the dominant cause of physiologic jaundice.',
    breaks: [
      { text: 'Gilbert (UGT1A1*28, *6), Crigler–Najjar', to: '/causes' },
      { text: 'Congenital hypothyroidism; G6PD deficiency', to: '/causes' },
    ],
  },
  {
    id: 'mrp2',
    place: 'Canalicular membrane',
    title: 'Excretion into bile',
    what: 'MRP2 (ABCC2) pumps conjugated bilirubin into bile — the rate-limiting step in mature liver.',
    newborn: 'If bile flow fails, conjugated bilirubin refluxes into blood → dark urine, pale stools.',
    breaks: [{ text: 'Cholestasis: biliary atresia, A1AT, Alagille, infection', to: '/cholestasis' }],
  },
  {
    id: 'gut',
    place: 'Intestine',
    title: 'Gut: elimination or recycling',
    what: 'Gut bacteria reduce bilirubin to urobilinogen → stercobilin (brown stool). Some urobilinogen is reabsorbed and excreted in urine.',
    newborn: 'Few bacteria + intestinal β-glucuronidase deconjugate bilirubin → reabsorbed (enterohepatic recirculation). Meconium holds a large bilirubin load.',
    breaks: [
      { text: 'Suboptimal intake, delayed stooling', to: '/causes' },
      { text: 'Bowel obstruction, pyloric stenosis', to: '/causes' },
    ],
  },
];

/* Conceptual one-compartment model — teaching only, not a predictor. */
function simulate(f: { hemolysis: boolean; bruise: boolean; preterm: boolean; gilbert: boolean; intake: boolean }) {
  const P = 0.2 * (f.hemolysis ? 2 : 1);
  const ehc = f.intake ? 0.45 : 0.15;
  const cmin = f.gilbert ? 0.003 : 0.004;
  const cmax = f.gilbert ? 0.035 : 0.05;
  const tau = f.preterm ? 120 : 80;
  let B = 1.8;
  const pts: { h: number; v: number }[] = [];
  for (let t = 0; t <= 168; t++) {
    const C = cmin + (cmax - cmin) * (1 - Math.exp(-t / tau));
    const extra = f.bruise && t >= 24 && t <= 96 ? 0.08 : 0;
    B += P * (1 + ehc) + extra - C * B;
    if (t % 2 === 0) pts.push({ h: t, v: B });
  }
  return pts;
}

const LEVERS = [
  { k: 'hemolysis', label: 'Hemolysis (production ×2)', mech: 'production' },
  { k: 'bruise', label: 'Cephalohematoma resorbing (days 1–4)', mech: 'production' },
  { k: 'gilbert', label: 'UGT1A1 variant (Gilbert)', mech: 'conjugation' },
  { k: 'preterm', label: 'Late preterm (slower maturation)', mech: 'conjugation' },
  { k: 'intake', label: 'Suboptimal intake / slow stooling', mech: 'enterohepatic' },
] as const;

type LeverKey = (typeof LEVERS)[number]['k'];

export default function PhysiologyPage() {
  const unit = useApp((s) => s.unit);
  const [active, setActive] = useState('ugt');
  const step = STEPS.find((s) => s.id === active)!;
  const [levers, setLevers] = useState<Record<LeverKey, boolean>>({ hemolysis: false, bruise: false, gilbert: false, preterm: false, intake: false });

  const base = useMemo(() => simulate({ hemolysis: false, bruise: false, preterm: false, gilbert: false, intake: false }), []);
  const mod = useMemo(() => simulate(levers), [levers]);
  const anyOn = Object.values(levers).some(Boolean);
  const peak = mod.reduce((a, p) => (p.v > a.v ? p : a), mod[0]);

  return (
    <div className="space-y-8">
      <PageHeader
        step="Module 1 · 15 min"
        title="Bilirubin physiology"
        lead="Every cause of neonatal jaundice is one of four failures: too much production, too little conjugation, too much recycling from the gut, or blocked excretion. Learn the pathway once and the differential writes itself."
      />

      <Card>
        <SectionTitle kicker="Interactive">The pathway — tap a step</SectionTitle>
        <ol className="flex flex-col items-stretch gap-1.5 md:flex-row md:flex-wrap md:items-center">
          {STEPS.map((s, i) => (
            <li key={s.id} className="flex flex-col items-center md:flex-row">
              <button
                type="button"
                onClick={() => setActive(s.id)}
                aria-pressed={active === s.id}
                className={cn(
                  'w-full rounded-xl border px-3 py-2 text-left text-sm transition-colors md:w-auto',
                  active === s.id ? 'border-brand bg-brand/15 font-semibold' : 'border-border bg-surface-2/60 hover:border-brand',
                )}
              >
                <span className="block text-[0.65rem] uppercase tracking-wide text-muted">{s.place}</span>
                {i + 1}. {s.title}
              </button>
              {i < STEPS.length - 1 && (
                <>
                  <ArrowDown className="my-0.5 h-4 w-4 text-muted md:hidden" aria-hidden />
                  <ArrowRight className="mx-1 hidden h-4 w-4 text-muted md:block" aria-hidden />
                </>
              )}
            </li>
          ))}
        </ol>
        <p className="mt-3 flex items-center gap-2 text-xs text-muted">
          <RotateCcw className="h-3.5 w-3.5" aria-hidden /> Enterohepatic loop: step 8 returns unconjugated bilirubin to step 4. Phototherapy is a bypass: light converts
          bilirubin in skin to isomers excreted without step 6.
        </p>

        <div className="mt-5 grid gap-4 rounded-2xl border border-border bg-surface-2/50 p-4 md:grid-cols-3" aria-live="polite">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">What happens</p>
            <p className="mt-1 text-sm">{step.what}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">Why newborns differ</p>
            <p className="mt-1 text-sm">{step.newborn}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">When it breaks</p>
            {step.breaks.length ? (
              <ul className="mt-1 space-y-1 text-sm">
                {step.breaks.map((b) => (
                  <li key={b.text}>{b.to ? <Link className="text-brand-strong underline-offset-2 hover:underline" to={b.to}>{b.text}</Link> : b.text}</li>
                ))}
              </ul>
            ) : (
              <p className="mt-1 text-sm text-muted">—</p>
            )}
          </div>
        </div>
        <p className="mt-2 text-xs text-muted">
          Sources: <Cite ids={['watchko2013', 'kawade1981', 'maisels2008']} />
        </p>
      </Card>

      <Card>
        <SectionTitle kicker="Interactive">Tip the balance</SectionTitle>
        <p className="mb-4 text-sm text-muted">
          A conceptual production-vs-clearance model. Switch on mechanisms and watch them stack. Shapes are illustrative, not a prediction for any infant.
        </p>
        <div className="grid gap-6 lg:grid-cols-[16rem_minmax(0,1fr)]">
          <div className="space-y-2">
            {LEVERS.map((l) => (
              <Check
                key={l.k}
                label={l.label}
                hint={l.mech === 'production' ? '↑ production' : l.mech === 'conjugation' ? '↓ conjugation' : '↑ enterohepatic recirculation'}
                checked={levers[l.k]}
                onChange={(v) => setLevers((s) => ({ ...s, [l.k]: v }))}
              />
            ))}
            {anyOn && (
              <p className="pt-2 text-sm">
                Modeled peak <strong className="tabular">{unit === 'mgdl' ? peak.v.toFixed(1) + ' mg/dL' : Math.round(peak.v * 17.1) + ' µmol/L'}</strong> at ~{peak.h} h.
              </p>
            )}
          </div>
          <BiliChart
            title="Conceptual bilirubin balance"
            unit={unit}
            xMax={168}
            yMax={30}
            series={[
              { id: 'thr', label: 'For scale: AAP ≥40 wk phototherapy line', color: 'var(--photo)', dashed: true, points: sampleCurve(PHOTO_NO_RF[40], 24, 168, 4) },
              { id: 'base', label: 'Typical term infant', color: 'var(--muted)', points: base },
              ...(anyOn ? [{ id: 'mod', label: 'With selected mechanisms', color: 'var(--brand)', points: mod }] : []),
            ]}
          />
        </div>
        <Callout kind="pearl" className="mt-4" title="The clinical translation">
          Production problems rise early and fast (think &lt;24 h, rate of rise). Conjugation problems rise later and stay up. Enterohepatic problems track intake and stooling.
          Combinations — like G6PD deficiency plus Gilbert, or hemolysis plus poor intake — are what produce dangerous levels.
          <Cite ids={['kaplan1997']} />
        </Callout>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <h3 className="mb-2 font-bold">Unconjugated vs conjugated</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <strong>Unconjugated (indirect):</strong> lipophilic, albumin-bound, not in urine, can enter the brain. Treated with phototherapy/exchange.
            </li>
            <li>
              <strong>Conjugated (direct):</strong> water-soluble, appears in urine (dark), not neurotoxic — but always signals liver/biliary disease in an infant.
            </li>
            <li>
              <strong>Delta-bilirubin</strong> (albumin-bound conjugated) is part of “direct” bilirubin and clears slowly, so DB lags after cholestasis resolves.
            </li>
          </ul>
        </Card>
        <Card>
          <h3 className="mb-2 font-bold">Why bilirubin isn’t only a toxin</h3>
          <p className="text-sm">
            At physiologic levels bilirubin is a potent antioxidant — one hypothesis for why mild neonatal hyperbilirubinemia is near-universal. The aim is to prevent
            neurotoxic levels, not to eliminate jaundice; overtreatment has costs.
            <Cite ids={['watchko2013', 'aap2022']} />
          </p>
        </Card>
      </div>

      <KeyPoints
        points={[
          'Four mechanisms: ↑ production, ↓ conjugation, ↑ enterohepatic recirculation, ↓ excretion (cholestasis).',
          'Heme oxygenase makes CO and bilirubin one-to-one — ETCOc measures production.',
          'UGT1A1 is ≈1% of adult activity at term; this immaturity is the core of physiologic jaundice.',
          'Only unbound unconjugated bilirubin crosses the blood–brain barrier; low albumin, acidosis, sepsis and displacing drugs raise risk.',
          'Feeding and stooling interrupt enterohepatic recirculation.',
        ]}
      />

      <ModuleCheck module="physiology" />
    </div>
  );
}

import { useState } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import { Callout, Card, Check, KeyPoints, NumberField, PageHeader, SectionTitle, Table } from '@/components/ui';
import { cn } from '@/lib/cn';
import { Cite } from '@/components/Cite';
import { ModuleCheck } from '@/components/Quiz';
import { HOME_PHOTOTHERAPY_CRITERIA, reboundPlan } from '@/lib/bili/guidelines';
import { formatBili, toMgdlFrom, unitLabel } from '@/lib/bili/units';
import { useApp } from '@/stores/appStore';

function StopPlanner() {
  const unit = useApp((s) => s.unit);
  const [thr, setThr] = useState<number | ''>(unit === 'mgdl' ? 16.6 : 284);
  const [cur, setCur] = useState<number | ''>(unit === 'mgdl' ? 13.9 : 238);
  const [early, setEarly] = useState(false);
  const [hemo, setHemo] = useState(false);
  const [readmit, setReadmit] = useState(false);
  const [preterm, setPreterm] = useState(false);
  const thrMg = thr === '' ? null : toMgdlFrom(thr, unit);
  const curMg = cur === '' ? null : toMgdlFrom(cur, unit);
  const stopAt = thrMg == null ? null : thrMg - 2;
  const cps = thrMg == null ? null : thrMg - (preterm ? 60 : 30) / 17.1;
  const ok = stopAt != null && curMg != null && curMg <= stopAt + 1e-9;

  return (
    <Card>
      <SectionTitle kicker="Interactive">When to stop, and how to check for rebound</SectionTitle>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <NumberField label={`Threshold when started (${unitLabel(unit)})`} value={thr} onChange={setThr} step={unit === 'mgdl' ? 0.1 : 1} min={0} />
            <NumberField label={`Current TSB (${unitLabel(unit)})`} value={cur} onChange={setCur} step={unit === 'mgdl' ? 0.1 : 1} min={0} />
          </div>
          <Check label="Phototherapy started before 48 h of age" checked={early} onChange={setEarly} />
          <Check label="Hemolytic disease (positive DAT or other hemolysis)" checked={hemo} onChange={setHemo} />
          <Check label="Readmitted from home for phototherapy" checked={readmit} onChange={setReadmit} />
          <Check label="Born 35–37 weeks (for CPS 2025 rule)" checked={preterm} onChange={setPreterm} />
        </div>
        <div aria-live="polite" className="space-y-3">
          <Callout kind={ok ? 'ok' : 'info'} title={ok ? 'Stopping is an option now' : 'Continue phototherapy'}>
            AAP 2022: stopping is an option once TSB is ≥2 mg/dL below the threshold at initiation → at or below <strong>{formatBili(stopAt, unit)}</strong>. Continue longer
            when rebound risk is high. <Cite ids={['aap2022']} />
          </Callout>
          <Callout kind="info" title="CPS 2025 alternative">
            Stop when TSB is &gt;{preterm ? '60' : '30'} µmol/L below the treatment threshold ({preterm ? '35–37' : '≥38'} wk) → below <strong>{formatBili(cps, unit)}</strong>.
            <Cite ids={['cps2025']} />
          </Callout>
          <Callout kind="pearl" title="Rebound check">
            {reboundPlan({ startedBefore48h: early, hemolysis: hemo, readmitted: readmit })} Rebound = reaching the phototherapy threshold within 72–96 h of stopping.
            <Cite ids={['aap2022']} />
          </Callout>
        </div>
      </div>
    </Card>
  );
}

function HomeChecker() {
  const [ticks, setTicks] = useState<boolean[]>(HOME_PHOTOTHERAPY_CRITERIA.map(() => false));
  const all = ticks.every(Boolean);
  return (
    <Card>
      <SectionTitle kicker="Interactive">Home phototherapy — all eight must be true</SectionTitle>
      <div className="grid gap-2 sm:grid-cols-2">
        {HOME_PHOTOTHERAPY_CRITERIA.map((c, i) => (
          <Check key={c} label={c} checked={ticks[i]} onChange={(v) => setTicks((t) => t.map((x, j) => (j === i ? v : x)))} />
        ))}
      </div>
      <p className={cn('mt-4 flex items-center gap-2 font-semibold', all ? 'text-ok' : 'text-muted')} aria-live="polite">
        {all ? <CheckCircle2 className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
        {all ? 'Eligible for home phototherapy (measure TSB daily; readmit if rising).' : `${ticks.filter(Boolean).length}/8 met — inpatient phototherapy.`}
      </p>
      <p className="mt-1 text-xs text-muted">
        <Cite ids={['aap2022']} />
      </p>
    </Card>
  );
}

export default function TreatmentPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        step="Module 5 · 25 min"
        title="Treatment"
        lead="Phototherapy is a drug: dose it by spectrum, irradiance and skin area. Know the emergency bundle cold, and know when to stop."
      />

      <Card>
        <SectionTitle kicker="Phototherapy">Intensive phototherapy — the prescription</SectionTitle>
        <div className="grid gap-4 md:grid-cols-2">
          <ul className="space-y-2 text-sm">
            <li>
              <strong>Spectrum:</strong> blue–green, ~460–490 nm (narrow-band LED).
            </li>
            <li>
              <strong>Irradiance:</strong> ≥30 µW/cm²/nm at the infant’s skin, measured with the device’s specified radiometer.
            </li>
            <li>
              <strong>Surface area:</strong> maximize — overhead plus underneath (LED mattress/blanket); diaper can stay unless approaching exchange levels.
            </li>
            <li>
              <strong>Distance:</strong> as close as the manufacturer allows (LEDs run cool; halogen spots can burn).
            </li>
            <li>
              <strong>Eyes:</strong> eye shields; check skin temperature and hydration.
            </li>
          </ul>
          <ul className="space-y-2 text-sm">
            <li>
              <strong>First TSB</strong> within 12 h of starting — sooner with hemolysis or near escalation.
            </li>
            <li>
              <strong>Expected response:</strong> intensive phototherapy typically lowers TSB 30–40% in 24 h (less with ongoing hemolysis).
            </li>
            <li>
              <strong>Feeding:</strong> continue breastfeeding; brief interruptions for feeds are fine unless near escalation. Supplement only for intake problems; IV fluids only for
              dehydration.
            </li>
            <li>
              <strong>Mechanism:</strong> photoisomerization; lumirubin is cleared in bile and urine without conjugation.
            </li>
          </ul>
        </div>
        <Callout kind="warn" className="mt-4" title="Adverse effects and cautions">
          Temperature instability, loose stools, rash, separation from parents and breastfeeding disruption. Bronze baby syndrome in cholestasis (not a contraindication). Contraindicated
          in congenital porphyria or with photosensitizing drugs. Observational studies link phototherapy with small increases in later childhood cancer and epilepsy — a reason not
          to treat below threshold without cause.
          <Cite ids={['aap2022', 'aap2011photo', 'maisels2008', 'newman2016', 'newman2018']} />
        </Callout>
      </Card>

      <StopPlanner />
      <HomeChecker />

      <Card className="border-esc/50">
        <SectionTitle kicker="Emergency">Escalation of care — TSB ≥ exchange threshold − 2 mg/dL</SectionTitle>
        <ol className="ml-5 list-decimal space-y-1.5 text-sm sm:text-base">
          <li>Treat as a medical emergency; admit or transfer promptly to a unit able to perform exchange transfusion.</li>
          <li>Intensive phototherapy now, during transport and throughout.</li>
          <li>TSB at least every 2 h until below the escalation threshold.</li>
          <li>Send CBC, type &amp; crossmatch, albumin (B/A ratio), chemistry panel, DB/CB; G6PD activity if not known.</li>
          <li>Isoimmune hemolysis: IVIG 0.5–1 g/kg over 2 h; may repeat in 12 h.</li>
          <li>Enteral feeding; IV fluids only if dehydrated.</li>
          <li>Exchange if TSB reaches the exchange threshold, or immediately with intermediate/advanced ABE signs.</li>
        </ol>
        <p className="mt-2 text-xs text-muted">
          <Cite ids={['aap2022', 'cochraneIvig2018']} />
        </p>
      </Card>

      <Card>
        <SectionTitle kicker="Exchange transfusion">Indications, procedure, risks</SectionTitle>
        <Table
          head={['', 'Details']}
          rows={[
            ['Indications', 'TSB ≥ exchange threshold despite intensive phototherapy; any intermediate/advanced ABE signs regardless of TSB; B/A ratio supports the decision (≥8.0 / 7.2 / 6.8)'],
            ['Before starting', 'Send G6PD, newborn screen, metabolic and red-cell studies — donor blood invalidates them'],
            ['Blood', 'Fresh, irradiated, CMV-safe reconstituted whole blood, compatible with mother and infant (group O for ABO disease)'],
            ['Volume', 'Double volume ≈160–170 mL/kg; removes ~85% of red cells, halves TSB; expect partial rebound'],
            ['Risks', 'Thrombocytopenia, hypocalcemia, hypo/hyperglycemia, hyperkalemia, catheter thrombosis, NEC, infection, arrhythmia; mortality higher in sick infants'],
            ['After', 'Continue phototherapy; TSB 2–4 h after; diagnostic ABR; neurodevelopmental follow-up'],
          ]}
        />
        <p className="mt-2 text-xs text-muted">
          <Cite ids={['aap2022', 'jcih2019']} />
        </p>
      </Card>

      <Card>
        <SectionTitle kicker="Evidence check">IVIG: what it can and can’t do</SectionTitle>
        <p className="text-sm">
          IVIG blocks Fc receptors on macrophages, slowing destruction of antibody-coated cells. Older trials suggested fewer exchanges, but trials at low risk of bias found no
          reduction; the evidence is low certainty. AAP 2022 still recommends it at the escalation threshold for isoimmune disease. It is an adjunct — never a reason to delay an
          indicated exchange. Not for non-immune hemolysis (G6PD, spherocytosis).
          <Cite ids={['aap2022', 'cochraneIvig2018']} />
        </p>
      </Card>

      <KeyPoints
        points={[
          'Intensive phototherapy = ≥30 µW/cm²/nm, ~460–490 nm, maximal skin exposure; first TSB within 12 h.',
          'Stop when TSB ≥2 mg/dL below the threshold at initiation; rebound check 6–12 h + next day if started <48 h or hemolysis.',
          'Home phototherapy only if all 8 criteria are met.',
          'Escalation (exchange − 2 mg/dL) is an emergency: TSB q2h, labs, IVIG if isoimmune, prepare exchange.',
          'Exchange at threshold or with ABE signs; draw diagnostic blood first.',
        ]}
      />
      <ModuleCheck module="treatment" />
    </div>
  );
}

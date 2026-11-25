import { useMemo, useState } from 'react';
import { Callout, Card, Check, KeyPoints, NumberField, PageHeader, Segmented, SectionTitle, Table } from '@/components/ui';
import { cn } from '@/lib/cn';
import { Cite } from '@/components/Cite';
import { ModuleCheck } from '@/components/Quiz';
import { rateOfRise } from '@/lib/bili/guidelines';
import { toMgdlFrom, unitLabel } from '@/lib/bili/units';
import { useApp } from '@/stores/appStore';

type Tri = 'pos' | 'neg' | 'unknown';
type Smear = 'normal' | 'spherocytes' | 'bite' | 'unknown';

function hemolysisAnalysis(i: {
  dat: Tri;
  motherO: boolean;
  motherAntibody: boolean;
  smear: Smear;
  mchc: number | '';
  mcv: number | '';
  retHigh: boolean;
  familyHs: boolean;
  g6pdAncestry: boolean;
  suddenRise: boolean;
  antiD: boolean;
}) {
  const out: { dx: string; score: number; why: string[]; next: string }[] = [];
  const ratio = typeof i.mchc === 'number' && typeof i.mcv === 'number' && i.mcv > 0 ? i.mchc / i.mcv : null;

  // Isoimmune
  {
    const why: string[] = [];
    let s = 0;
    const add = (pts: number, reason: string) => {
      s += pts;
      why.push(reason);
    };
    if (i.dat === 'pos') add(3, 'positive DAT');
    if (i.motherAntibody) add(3, 'maternal alloantibody');
    if (i.motherO) add(1, 'group O mother');
    if (i.smear === 'spherocytes' && i.motherO) add(1, 'microspherocytes (ABO)');
    if (i.antiD && i.dat === 'pos' && !i.motherAntibody) add(-2, 'weak DAT may be passive antenatal anti-D');
    if (s > 0)
      out.push({
        dx: i.motherAntibody ? 'Alloimmune hemolysis (Rh(D), anti-c, anti-Kell…)' : 'ABO hemolytic disease',
        score: s,
        why,
        next: 'Use the risk-factor curve; TSB every 4–6 h initially; consider IVIG at escalation if DAT-positive; watch for late anemia.',
      });
  }
  // HS
  {
    const why: string[] = [];
    let s = 0;
    const add = (pts: number, reason: string) => {
      s += pts;
      why.push(reason);
    };
    if (i.dat === 'neg') add(1, 'DAT negative');
    if (i.smear === 'spherocytes') add(2, 'spherocytes');
    if (typeof i.mchc === 'number' && i.mchc > 36) add(2, `MCHC ${i.mchc} >36 g/dL`);
    if (ratio != null && ratio > 0.36) add(2, `MCHC/MCV ${ratio.toFixed(2)} >0.36`);
    if (i.familyHs) add(2, 'family history');
    if (s >= 3) out.push({ dx: 'Hereditary spherocytosis', score: s, why, next: 'EMA binding (osmotic fragility unreliable in neonates); hematology follow-up.' });
  }
  // G6PD
  {
    const why: string[] = [];
    let s = 0;
    const add = (pts: number, reason: string) => {
      s += pts;
      why.push(reason);
    };
    if (i.g6pdAncestry) add(2, 'ancestry / family history');
    if (i.smear === 'bite') add(2, 'bite cells');
    if (i.suddenRise) add(2, 'sudden rise / rise despite phototherapy');
    if (i.dat === 'neg') add(1, 'DAT negative');
    if (s >= 2) out.push({ dx: 'G6PD deficiency', score: s, why, next: 'Quantitative G6PD activity; if normal during hemolysis, repeat at ~3 months. Avoid oxidants.' });
  }
  if (i.retHigh && !out.length) out.push({ dx: 'Hemolysis, cause not yet clear', score: 1, why: ['reticulocytosis'], next: 'Smear review, G6PD activity, consider PK deficiency and other enzymopathies.' });
  return out.sort((a, b) => b.score - a.score);
}

export default function EvaluationPage() {
  const unit = useApp((s) => s.unit);
  const [h1, setH1] = useState<number | ''>(12);
  const [v1, setV1] = useState<number | ''>(unit === 'mgdl' ? 6 : 103);
  const [h2, setH2] = useState<number | ''>(22);
  const [v2, setV2] = useState<number | ''>(unit === 'mgdl' ? 9.6 : 164);

  const rate =
    h1 !== '' && h2 !== '' && v1 !== '' && v2 !== ''
      ? rateOfRise({ ageHours: h1, value: toMgdlFrom(v1, unit), method: 'TSB' }, { ageHours: h2, value: toMgdlFrom(v2, unit), method: 'TSB' })
      : null;

  const [dat, setDat] = useState<Tri>('unknown');
  const [smear, setSmear] = useState<Smear>('unknown');
  const [mchc, setMchc] = useState<number | ''>('');
  const [mcv, setMcv] = useState<number | ''>('');
  const [flags, setFlags] = useState({ motherO: false, motherAntibody: false, retHigh: false, familyHs: false, g6pdAncestry: false, suddenRise: false, antiD: false });
  const analysis = useMemo(() => hemolysisAnalysis({ dat, smear, mchc, mcv, ...flags }), [dat, smear, mchc, mcv, flags]);
  const flag = (k: keyof typeof flags, label: string) => <Check key={k} label={label} checked={flags[k]} onChange={(v) => setFlags((s) => ({ ...s, [k]: v }))} />;

  return (
    <div className="space-y-8">
      <PageHeader
        step="Module 3 · 20 min"
        title="Evaluation & work-up"
        lead="Measure every baby, confirm the right number, read the trajectory, and order the few tests that change management."
      />

      <Card>
        <SectionTitle kicker="Screening">Universal measurement, not eyeballing</SectionTitle>
        <ul className="space-y-2 text-sm sm:text-base">
          <li>
            <strong>Every infant:</strong> TcB or TSB between 24 and 48 h, or before discharge if earlier.
          </li>
          <li>
            <strong>Jaundiced before 24 h:</strong> measure as soon as possible.
          </li>
          <li>
            <strong>Visual checks</strong> at least every 12 h prompt measurement — but cannot estimate the level (especially in darker skin). “Kramer zones” are not a substitute.
          </li>
          <li>
            <strong>Use total bilirubin</strong> for all decisions; never subtract the direct fraction.
          </li>
        </ul>
        <p className="mt-2 text-xs text-muted">
          <Cite ids={['aap2022']} />
        </p>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <h3 className="mb-2 font-bold">TcB → TSB rule</h3>
          <p className="text-sm">
            Measure TSB if TcB is <strong>≥15 mg/dL (257 µmol/L)</strong> or <strong>within 3 mg/dL (≈50 µmol/L)</strong> of the phototherapy threshold. TcB is unreliable during
            phototherapy and for 24 h after it stops; device accuracy varies with skin pigmentation — another reason to confirm near decision points.
            <Cite ids={['aap2022', 'cps2025']} />
          </p>
        </Card>
        <Card>
          <h3 className="mb-2 font-bold">Blood-group testing</h3>
          <ul className="ml-4 list-disc space-y-1 text-sm">
            <li>All mothers: ABO, Rh(D) and antibody screen in pregnancy.</li>
            <li>Maternal antibody screen positive or unknown → infant DAT + ABO/Rh(D) (cord or peripheral blood).</li>
            <li>Group O Rh+ mother with negative screen → infant testing is an option, depending on follow-up reliability.</li>
          </ul>
          <p className="mt-2 text-xs text-muted">
            <Cite ids={['aap2022']} />
          </p>
        </Card>
      </div>

      <Card>
        <SectionTitle kicker="Interactive">Rate-of-rise calculator</SectionTitle>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <NumberField label="1st age (h)" value={h1} onChange={setH1} step={1} min={0} />
          <NumberField label={`1st value (${unitLabel(unit)})`} value={v1} onChange={setV1} step={unit === 'mgdl' ? 0.1 : 1} min={0} />
          <NumberField label="2nd age (h)" value={h2} onChange={setH2} step={1} min={0} />
          <NumberField label={`2nd value (${unitLabel(unit)})`} value={v2} onChange={setV2} step={unit === 'mgdl' ? 0.1 : 1} min={0} />
        </div>
        <div aria-live="polite" className="mt-4">
          {rate ? (
            <Callout kind={rate.suggestsHemolysis ? 'warn' : 'ok'} title={`${rate.mgdlPerHour.toFixed(2)} mg/dL/h (${(rate.mgdlPerHour * 17.1).toFixed(1)} µmol/L/h)`}>
              {rate.suggestsHemolysis
                ? `≥${rate.threshold} mg/dL/h ${rate.threshold === 0.3 ? 'in the first 24 h' : 'after 24 h'} suggests hemolysis → DAT, type, CBC, reticulocytes, smear; G6PD if unexplained.`
                : `Below the ${rate.threshold} mg/dL/h hemolysis flag. Still compare the slope with the threshold curve's slope.`}
            </Callout>
          ) : (
            <p className="text-sm text-muted">Enter two measurements at different ages.</p>
          )}
        </div>
      </Card>

      <Card>
        <SectionTitle kicker="Interactive">Hemolysis analyzer</SectionTitle>
        <p className="mb-4 text-sm text-muted">Enter what you know. The analyzer shows which pattern the data support and the test that settles it.</p>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">DAT</p>
              <Segmented label="DAT" value={dat} onChange={setDat} options={[{ value: 'unknown', label: 'Not done' }, { value: 'pos', label: 'Positive' }, { value: 'neg', label: 'Negative' }]} />
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Smear</p>
              <Segmented
                label="Smear"
                value={smear}
                onChange={setSmear}
                options={[
                  { value: 'unknown', label: 'Not seen' },
                  { value: 'normal', label: 'Normal' },
                  { value: 'spherocytes', label: 'Spherocytes' },
                  { value: 'bite', label: 'Bite cells' },
                ]}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <NumberField label="MCHC" value={mchc} onChange={setMchc} suffix="g/dL" step={0.1} />
              <NumberField label="MCV" value={mcv} onChange={setMcv} suffix="fL" step={1} />
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {flag('motherO', 'Mother group O, infant A or B')}
              {flag('motherAntibody', 'Maternal alloantibody (anti-D, -c, -Kell…)')}
              {flag('antiD', 'Mother received antenatal anti-D')}
              {flag('retHigh', 'Reticulocytosis / falling Hb')}
              {flag('familyHs', 'Family: anemia, splenectomy, gallstones')}
              {flag('g6pdAncestry', 'G6PD-prevalent ancestry or family history')}
              {flag('suddenRise', 'Sudden rise / rising despite phototherapy')}
            </div>
          </div>
          <div aria-live="polite" className="space-y-3">
            {analysis.length === 0 ? (
              <p className="rounded-xl border border-dashed border-border p-4 text-sm text-muted">No hemolysis pattern yet. Add findings.</p>
            ) : (
              analysis.map((a, i) => (
                <div key={a.dx} className={cn('rounded-xl border p-4', i === 0 ? 'border-brand bg-brand/8' : 'border-border')}>
                  <p className="font-bold">
                    {i === 0 && <span className="mr-2 text-xs font-semibold uppercase text-brand-strong">Best fit</span>}
                    {a.dx}
                  </p>
                  <p className="mt-1 text-sm text-muted">Supported by: {a.why.join(', ')}</p>
                  <p className="mt-2 text-sm">{a.next}</p>
                </div>
              ))
            )}
            <p className="text-xs text-muted">
              Teaching heuristic, not a diagnostic score. <Cite ids={['christensen2010', 'christensen2015', 'aap2022']} />
            </p>
          </div>
        </div>
      </Card>

      <Card>
        <SectionTitle kicker="Order set">Work-up by scenario</SectionTitle>
        <Table
          head={['Scenario', 'Tests', 'Why']}
          rows={[
            ['Jaundice <24 h or rapid rise', 'TSB, DAT, blood type, CBC, reticulocytes, smear', 'Hemolysis is the usual cause'],
            ['Needs phototherapy', 'DAT/type if not done; CBC/retic/smear when hemolysis possible; G6PD by ancestry/family history', 'Changes the curve and rebound plan'],
            ['Rising despite phototherapy, rise after decline, or escalation', 'G6PD activity, CBC, albumin, chemistry, type & crossmatch', 'G6PD and severe hemolysis; prepare exchange'],
            ['Beyond 2 weeks (term) / 3 weeks (preterm)', 'Total + direct/conjugated bilirubin; stool color; newborn screen (TSH, galactosemia); urine culture if unwell', 'Detect cholestasis (biliary atresia) and hypothyroidism'],
            ['DB/CB ≥1.0 mg/dL', 'Urgent pediatric GI + cholestasis panel (see module 7)', 'Kasai timing'],
          ]}
        />
        <p className="mt-2 text-xs text-muted">
          <Cite ids={['aap2022', 'harpavat2025', 'nice2010']} />
        </p>
      </Card>

      <KeyPoints
        points={[
          'Measure every newborn (24–48 h or before discharge); measure immediately if jaundiced <24 h.',
          'TcB ≥15 mg/dL or within 3 mg/dL of threshold → TSB.',
          'Rate of rise ≥0.3 mg/dL/h (<24 h) or ≥0.2 (after) suggests hemolysis.',
          'Positive/unknown maternal antibody screen → infant DAT + blood type.',
          'Use total bilirubin for decisions; DB/CB ≥1.0 mg/dL is its own emergency pathway.',
        ]}
      />
      <ModuleCheck module="evaluation" />
    </div>
  );
}

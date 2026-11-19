import { useState } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import { Callout, Card, KeyPoints, NumberField, PageHeader, SectionTitle, Table } from '@/components/ui';
import { cn } from '@/lib/cn';
import { Cite } from '@/components/Cite';
import { ModuleCheck } from '@/components/Quiz';

const STOOLS = [
  { id: 's1', color: '#e8e4d8', name: 'Chalky white', abnormal: true },
  { id: 's2', color: '#ebe3a6', name: 'Pale yellow / cream', abnormal: true },
  { id: 's3', color: '#c9c3b2', name: 'Clay / gray', abnormal: true },
  { id: 's4', color: '#d9a51f', name: 'Mustard yellow', abnormal: false },
  { id: 's5', color: '#7a8b2b', name: 'Green', abnormal: false },
  { id: 's6', color: '#7b4a1f', name: 'Brown', abnormal: false },
];

function StoolQuiz() {
  const [picked, setPicked] = useState<Record<string, boolean>>({});
  const [checked, setChecked] = useState(false);
  const allRight = STOOLS.every((s) => !!picked[s.id] === s.abnormal);
  return (
    <Card>
      <SectionTitle kicker="Interactive">Which stools need a same-day call?</SectionTitle>
      <p className="mb-4 text-sm text-muted">Tap every color that should trigger a direct/conjugated bilirubin today. Illustrative swatches — real cards use photographs.</p>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
        {STOOLS.map((s) => (
          <button
            key={s.id}
            type="button"
            aria-pressed={!!picked[s.id]}
            onClick={() => {
              setChecked(false);
              setPicked((p) => ({ ...p, [s.id]: !p[s.id] }));
            }}
            className={cn('rounded-xl border-2 p-2 text-center text-xs transition-colors', picked[s.id] ? 'border-brand' : 'border-border hover:border-muted')}
          >
            <span className="mx-auto block h-12 w-12 rounded-full border border-black/10" style={{ background: s.color }} aria-hidden />
            <span className="mt-2 block font-medium">{s.name}</span>
            {checked && (
              <span className={cn('mt-1 block font-semibold', s.abnormal ? 'text-exch' : 'text-ok')}>{s.abnormal ? 'Acholic' : 'Normal'}</span>
            )}
          </button>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button type="button" onClick={() => setChecked(true)} className="min-h-10 rounded-xl bg-brand px-4 text-sm font-semibold text-brand-fg hover:bg-brand-strong">
          Check
        </button>
        {checked && (
          <p className={cn('flex items-center gap-2 text-sm font-semibold', allRight ? 'text-ok' : 'text-esc')} aria-live="polite">
            {allRight ? <CheckCircle2 className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
            {allRight ? 'Exactly right.' : 'Not quite — pale, white and clay-gray are acholic; yellow, green and brown are normal.'}
          </p>
        )}
      </div>
      <p className="mt-3 text-xs text-muted">
        Early stools may be only intermittently pale. Dark urine (staining the diaper) is also abnormal in a newborn. <Cite ids={['hsiao2008', 'harpavat2025']} />
      </p>
    </Card>
  );
}

function KasaiClock() {
  const [age, setAge] = useState<number | ''>(24);
  const a = typeof age === 'number' ? age : 0;
  const pct = Math.min(100, (a / 90) * 100);
  return (
    <Card>
      <SectionTitle kicker="Interactive">The Kasai clock</SectionTitle>
      <div className="grid gap-4 sm:grid-cols-[12rem_1fr] sm:items-end">
        <NumberField label="Infant age (days)" value={age} onChange={setAge} min={0} max={120} step={1} />
        <div>
          <div className="relative h-4 overflow-hidden rounded-full bg-surface-2" aria-hidden>
            <div className="absolute inset-y-0 left-0 bg-ok/70" style={{ width: `${(30 / 90) * 100}%` }} />
            <div className="absolute inset-y-0 bg-brand/70" style={{ left: `${(30 / 90) * 100}%`, width: `${(15 / 90) * 100}%` }} />
            <div className="absolute inset-y-0 bg-esc/60" style={{ left: `${(45 / 90) * 100}%`, width: `${(15 / 90) * 100}%` }} />
            <div className="absolute inset-y-0 bg-exch/60" style={{ left: `${(60 / 90) * 100}%`, right: 0 }} />
            <div className="absolute inset-y-[-4px] w-1 rounded bg-fg" style={{ left: `calc(${pct}% - 2px)` }} />
          </div>
          <div className="mt-1 flex justify-between text-[0.7rem] text-muted tabular">
            <span>0</span>
            <span>30</span>
            <span>45</span>
            <span>60</span>
            <span>90 d</span>
          </div>
        </div>
      </div>
      <p className="mt-3 text-sm" aria-live="polite">
        {a < 30
          ? `${30 - a} day(s) to the best-outcome window (Kasai before 30 days). Diagnosis must happen now.`
          : a <= 45
            ? 'Inside the 30–45-day window — same-day referral; every day counts.'
            : 'Beyond 45 days: Kasai is still indicated, but bile drainage and native-liver survival fall with each week.'}
      </p>
      <p className="mt-1 text-xs text-muted">
        <Cite ids={['harpavat2025']} />
      </p>
    </Card>
  );
}

export default function CholestasisPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        step="Module 7 · 20 min"
        title="Cholestasis & biliary atresia"
        lead="Conjugated hyperbilirubinemia is never physiologic. The goal is to find biliary atresia by 2–4 weeks of age, while Kasai can still work best."
      />

      <Card className="border-esc/50">
        <SectionTitle kicker="Definition">Direct or conjugated bilirubin ≥1.0 mg/dL (17 µmol/L) is abnormal</SectionTitle>
        <p className="text-sm sm:text-base">
          At any total bilirubin. The old “&gt;20% of total” rule was retired in 2017 because it misses cholestasis when the total is high. Know your lab: “direct” bilirubin includes
          delta-bilirubin; conjugated assays read lower. Even mildly elevated DB/CB in the first days of life is a sensitive early marker of biliary atresia — repeat it.
          <Cite ids={['fawaz2017', 'harpavat2025', 'harpavat2020']} />
        </p>
      </Card>

      <Card>
        <SectionTitle kicker="AAP 2025">The 2–4-week visit: eyes → stool → first bilirubin</SectionTitle>
        <ol className="grid gap-3 md:grid-cols-3">
          {[
            ['1. Eyes & skin', 'Jaundiced beyond 2 weeks of age?'],
            ['2. Stool & urine', 'Pale, white or clay stools, or dark urine → DB/CB today at any age.'],
            ['3. First bilirubin', 'Measure DB/CB unless a prior value was normal. DB/CB ≥1 mg/dL → urgent pediatric GI.'],
          ].map(([t, d]) => (
            <li key={t} className="rounded-xl border border-border bg-surface-2/50 p-4">
              <p className="font-bold">{t}</p>
              <p className="mt-1 text-sm">{d}</p>
            </li>
          ))}
        </ol>
        <p className="mt-3 text-sm text-muted">
          Universal screening (stool-color cards or newborn DB/CB) is the stated future goal. In a 2024 meta-analysis newborn DB/CB had the best accuracy; Taiwan’s card programme
          improved timely Kasai. <Cite ids={['harpavat2025', 'basr2024', 'hsiao2008']} />
        </p>
      </Card>

      <StoolQuiz />
      <KasaiClock />

      <Card>
        <SectionTitle kicker="Same day">First-line work-up while referring</SectionTitle>
        <Table
          head={['Test', 'Why']}
          rows={[
            ['Fractionated bilirubin, ALT, AST, ALP, GGT, albumin', 'Pattern and severity; GGT separates high- from low-GGT causes'],
            ['PT/INR → parenteral vitamin K if prolonged', 'Vitamin K deficiency bleeding (including intracranial) is preventable'],
            ['Glucose', 'Hypoglycemia → hypopituitarism, metabolic disease, liver failure'],
            ['CBC, urinalysis + urine culture', 'Infection, UTI'],
            ['Newborn screen review (TSH, galactosemia, CF); GALT if galactosemia possible', 'Stop lactose immediately if galactosemia suspected'],
            ['Alpha-1 antitrypsin level AND phenotype', 'Most common genetic cause'],
            ['Fasting abdominal ultrasound', 'Choledochal malformation; supports but cannot exclude biliary atresia'],
            ['Then (specialist): MMP-7, HIDA, biopsy, genetic panel, cholangiogram', 'Intraoperative cholangiogram is the diagnostic standard'],
          ]}
        />
        <p className="mt-2 text-xs text-muted">
          <Cite ids={['fawaz2017', 'lertudomphonwanit2017']} />
        </p>
      </Card>

      <Card>
        <SectionTitle kicker="Differential">Use GGT and the company it keeps</SectionTitle>
        <Table
          head={['Clue', 'Think of']}
          rows={[
            ['High GGT, acholic stools, well infant', 'Biliary atresia (± splenic malformation, situs anomalies)'],
            ['Cardiac murmur (PPS), butterfly vertebrae, posterior embryotoxon', 'Alagille syndrome'],
            ['Low/normal GGT despite cholestasis', 'PFIC1/2, bile-acid synthesis defects, TJP2'],
            ['Hypoglycemia, micropenis, midline defects', 'Hypopituitarism (septo-optic dysplasia)'],
            ['Vomiting, E. coli sepsis, coagulopathy after milk feeds', 'Galactosemia'],
            ['Liver failure with low transaminases, very high ferritin', 'Gestational alloimmune liver disease'],
            ['Ill infant, very high transaminases', 'HSV or other infection — start acyclovir if possible'],
            ['Prolonged parenteral nutrition', 'PN-associated cholestasis'],
          ]}
        />
      </Card>

      <Callout kind="warn" title="After Kasai">
        Fat-soluble vitamins (A, D, E, K), MCT-enriched nutrition, cholangitis vigilance (fever + rising bilirubin). Adjuvant high-dose steroids did not improve drainage in the START
        trial. Biliary atresia remains the leading indication for pediatric liver transplant. <Cite ids={['bezerra2014', 'fawaz2017']} />
      </Callout>

      <KeyPoints
        points={[
          'DB/CB ≥1.0 mg/dL at any total = cholestasis → urgent pediatric GI.',
          'At 2–4 weeks: eyes → stool → first bilirubin.',
          'Pale stools or dark urine → DB/CB today.',
          'Kasai best before 30–45 days; ultrasound cannot exclude biliary atresia.',
          'Give vitamin K for prolonged INR; stop lactose if galactosemia possible.',
        ]}
      />
      <ModuleCheck module="cholestasis" />
    </div>
  );
}

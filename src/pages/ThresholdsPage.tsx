import { useState } from 'react';
import BiliCalculator from '@/components/BiliCalculator';
import { BiliChart, type Series } from '@/components/BiliChart';
import { Callout, Card, KeyPoints, PageHeader, Segmented, SectionTitle, Table } from '@/components/ui';
import { Cite } from '@/components/Cite';
import { ModuleCheck } from '@/components/Quiz';
import { PHOTO_NO_RF, PHOTO_RF, sampleCurve } from '@/lib/bili/aap2022';
import { NICE_38_TABLE, PRETERM_TABLE } from '@/lib/bili/guidelines';
import { formatBili } from '@/lib/bili/units';
import { useApp } from '@/stores/appStore';

const gaColors = ['#94a3b8', '#a78bfa', '#38bdf8', '#34d399', '#f59e0b', '#f472b6'];

export default function ThresholdsPage() {
  const unit = useApp((s) => s.unit);
  const [set, setSet] = useState<'noRf' | 'rf'>('noRf');

  const curves: Series[] =
    set === 'noRf'
      ? ([35, 36, 37, 38, 39, 40] as const).map((g, i) => ({
          id: `n${g}`,
          label: g === 40 ? '≥40 wk' : `${g} wk`,
          color: gaColors[i],
          points: sampleCurve(PHOTO_NO_RF[g], 1, 168),
        }))
      : ([35, 36, 37, 38] as const).map((g, i) => ({
          id: `r${g}`,
          label: g === 38 ? '≥38 wk' : `${g} wk`,
          color: gaColors[i],
          points: sampleCurve(PHOTO_RF[g], 1, 168),
        }));

  return (
    <div className="space-y-8">
      <PageHeader
        step="Module 4 · 25 min"
        title="Thresholds & follow-up"
        lead="One number matters at the bedside: how far the bilirubin is from this infant’s hour-specific threshold. Pick the right curve, measure the distance, act on it."
      />

      <Card>
        <SectionTitle kicker="The most-missed distinction">Two different risk-factor lists</SectionTitle>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-exch/40 bg-exch/6 p-4">
            <p className="font-bold">Neurotoxicity risk factors → choose the LOWER curve</p>
            <ul className="mt-2 ml-4 list-disc space-y-1 text-sm">
              <li>Gestational age &lt;38 wk (already built into each GA curve)</li>
              <li>Albumin &lt;3.0 g/dL</li>
              <li>Isoimmune hemolysis (positive DAT), G6PD deficiency, other hemolysis</li>
              <li>Sepsis</li>
              <li>Significant clinical instability in the previous 24 h</li>
            </ul>
          </div>
          <div className="rounded-xl border border-photo/40 bg-photo/6 p-4">
            <p className="font-bold">Hyperbilirubinemia risk factors → follow up MORE CLOSELY</p>
            <ul className="mt-2 ml-4 list-disc space-y-1 text-sm">
              <li>Lower GA; jaundice &lt;24 h; pre-discharge value close to threshold</li>
              <li>Hemolysis (known or suspected from rate of rise); phototherapy before discharge</li>
              <li>Parent/sibling needed phototherapy or exchange; family history/ancestry of RBC disorders (e.g., G6PD)</li>
              <li>Exclusive breastfeeding with suboptimal intake</li>
              <li>Scalp hematoma or significant bruising; Down syndrome; macrosomic infant of a diabetic mother</li>
            </ul>
          </div>
        </div>
        <Callout kind="pearl" className="mt-4">
          A 36-week infant with no other risk factor uses the <strong>36-week, no-risk-factor</strong> curve. Ticking “risk factor” for prematurity double-counts it.
          Race was removed as a risk factor in 2022. <Cite ids={['aap2022']} />
        </Callout>
      </Card>

      <Card>
        <SectionTitle kicker="Interactive">See how GA and risk factors move the line</SectionTitle>
        <Segmented
          label="Curve family"
          value={set}
          onChange={setSet}
          className="mb-4"
          options={[
            { value: 'noRf', label: 'No neurotoxicity risk factors' },
            { value: 'rf', label: '≥1 neurotoxicity risk factor' },
          ]}
        />
        <BiliChart title="AAP 2022 phototherapy thresholds by gestational age" series={curves} unit={unit} xMax={168} yMax={25} />
        <p className="mt-3 text-sm text-muted">
          Curves use the published AAP hourly rows. Thresholds can change after 96 hours, and the age at which a curve levels off varies by gestational age and risk group.
          At 48 h a ≥40-week infant without risk factors is treated at {formatBili(17, unit)}; a 35-week infant with a risk factor at {formatBili(12.2, unit)}.
          <Cite ids={['aap2022']} />
        </p>
      </Card>

      <section aria-labelledby="calc" className="space-y-3">
        <h2 id="calc" className="text-2xl font-bold">
          Calculator
        </h2>
        <BiliCalculator />
      </section>

      <Card>
        <SectionTitle kicker="Follow-up">After a birth hospitalization without phototherapy</SectionTitle>
        <p className="mb-3 text-sm text-muted">Use the value closest to discharge, measured at ≥12 h. Distance = threshold − TcB/TSB.</p>
        <Table
          head={['Below threshold by', '<24 h at measurement', '≥24 h at measurement']}
          rows={[
            ['0.1–1.9 mg/dL (2–32 µmol/L)', 'Delay discharge; consider phototherapy; TSB in 4–8 h', 'TSB in 4–24 h. Options: delay discharge ± phototherapy; home phototherapy if eligible; discharge with close follow-up'],
            ['2.0–3.4 (34–58)', 'TSB or TcB in 4–24 h', 'TSB or TcB in 4–24 h'],
            ['3.5–5.4 (60–92)', 'TSB or TcB in 1–2 days', 'TSB or TcB in 1–2 days'],
            ['5.5–6.9 (94–118)', 'Follow-up within 2 days; TcB/TSB per judgment', '<72 h: within 2 days · ≥72 h: clinical judgment'],
            ['≥7.0 (≥120)', 'Follow-up within 3 days; TcB/TSB per judgment', '<72 h: within 3 days · ≥72 h: clinical judgment'],
          ]}
        />
        <p className="mt-3 text-sm">
          Subthreshold phototherapy during the birth hospitalization is an option when the trajectory makes crossing after discharge likely. Hyperbilirubinemia risk
          factors move you to the earlier end of each window. <Cite ids={['aap2022', 'kuzniewicz2021']} />
        </p>
      </Card>

      <Card>
        <SectionTitle kicker="History you will still hear">Bhutani risk zones and the 2004 curves</SectionTitle>
        <p className="text-sm">
          The 1999 Bhutani nomogram put hour-specific TSB into percentile “risk zones” (low, low-intermediate, high-intermediate, high), and the 2004 AAP guideline used three
          risk-group curves. Both are retired for decisions. Distance-to-threshold predicts later phototherapy better, adjusts for GA and risk factors, and links follow-up
          directly to the treatment line. Its enduring lesson: <strong>always interpret bilirubin by age in hours</strong>.
          <Cite ids={['bhutani1999', 'aap2004', 'kuzniewicz2021']} />
        </p>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h3 className="mb-1 font-bold">NICE CG98 — babies ≥38 weeks (µmol/L)</h3>
          <p className="mb-3 text-xs text-muted">
            UK practice. Linear between rows; flat from 96 h. 2023 surveillance: unchanged. <Cite ids={['nice2010']} />
          </p>
          <Table
            head={['Age (h)', 'Phototherapy', 'Exchange']}
            rows={NICE_38_TABLE.filter((r) => r.h % 12 === 0).map((r) => [r.h === 96 ? '≥96' : String(r.h), `>${r.photo}`, `>${r.exchange}`])}
          />
        </Card>
        <Card>
          <h3 className="mb-1 font-bold">Preterm &lt;35 weeks (mg/dL)</h3>
          <p className="mb-3 text-xs text-muted">
            Consensus ranges by postmenstrual age; lower end with risk factors. <Cite ids={['maisels2012']} />
          </p>
          <Table
            head={['Postmenstrual age (wk)', 'Phototherapy', 'Exchange']}
            rows={PRETERM_TABLE.map((r) => [r.label, `${r.phototherapy[0]}–${r.phototherapy[1]}`, `${r.exchange[0]}–${r.exchange[1]}`])}
          />
        </Card>
      </div>

      <KeyPoints
        points={[
          'Curve = gestational week + neurotoxicity risk factors (yes/no). Prematurity alone is already in the curve.',
          'Escalation-of-care threshold = exchange threshold − 2 mg/dL.',
          'Follow-up is set by the distance below the phototherapy threshold, measured at ≥12 h.',
          'Units: mg/dL × 17.1 = µmol/L.',
          'The hourly tables end at 14 days; use the exact hour rather than assuming a 96-hour plateau. Persistent jaundice needs a separate assessment for cholestasis.',
        ]}
      />
      <ModuleCheck module="thresholds" />
    </div>
  );
}

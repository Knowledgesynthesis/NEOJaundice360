import { Printer } from 'lucide-react';
import { Button, Card, PageHeader, Table } from '@/components/ui';
import { PHOTO_NO_RF, PHOTO_RF, EXCHANGE_NO_RF_38, EXCHANGE_RF_38 } from '@/lib/bili/aap2022';
import { formatBili } from '@/lib/bili/units';
import { useApp } from '@/stores/appStore';

export default function QuickReferencePage() {
  const unit = useApp((s) => s.unit);
  const f = (v: number) => formatBili(v, unit, false);
  const photoRows = [
    ...([35, 36, 37, 38, 39, 40] as const).map((g) => [`${g === 40 ? '≥40' : g} wk · no RF`, ...PHOTO_NO_RF[g].values.map(f)]),
    ...([35, 36, 37, 38] as const).map((g) => [`${g === 38 ? '≥38' : g} wk · RF`, ...PHOTO_RF[g].values.map(f)]),
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Quick reference" lead="The essentials on one page. Print it or save it offline (the app works without a connection once loaded).">
        <Button variant="outline" className="no-print mt-4" onClick={() => window.print()}>
          <Printer className="h-4 w-4" /> Print
        </Button>
      </PageHeader>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <h2 className="mb-2 font-bold">Screen &amp; measure</h2>
          <ul className="ml-4 list-disc space-y-1 text-sm">
            <li>TcB/TSB in every infant at 24–48 h (or before discharge); immediately if jaundiced &lt;24 h.</li>
            <li>TcB ≥15 mg/dL or within 3 mg/dL of threshold → TSB.</li>
            <li>Rate ≥0.3 mg/dL/h (&lt;24 h) or ≥0.2 (after) → hemolysis work-up.</li>
            <li>Maternal antibody screen +/unknown → infant DAT + type.</li>
            <li>Use total bilirubin; never subtract direct.</li>
          </ul>
        </Card>
        <Card>
          <h2 className="mb-2 font-bold">Pick the curve</h2>
          <ul className="ml-4 list-disc space-y-1 text-sm">
            <li>Gestational week (35 … ≥40).</li>
            <li>
              Neurotoxicity RF → lower curve: albumin &lt;3.0, isoimmune/G6PD/other hemolysis, sepsis, instability in 24 h.
            </li>
            <li>Prematurity alone = no-RF curve for that week.</li>
            <li>Escalation = exchange − 2 mg/dL.</li>
          </ul>
        </Card>
      </div>

      <Card>
        <h2 className="mb-2 font-bold">AAP 2022 phototherapy thresholds ({unit === 'mgdl' ? 'mg/dL' : 'µmol/L'})</h2>
        <Table head={['Curve', '24 h', '48 h', '72 h', '≥96 h']} rows={photoRows} caption="Flat from 96 h to 14 days. 36-wk and 36/37-wk RF rows are interpolated." />
        <h3 className="mt-4 mb-2 font-semibold">Exchange (≥38 wk)</h3>
        <Table
          head={['Curve', '24 h', '48 h', '72 h', '≥96 h']}
          rows={[
            ['No RF', ...EXCHANGE_NO_RF_38.values.map(f)],
            ['RF (≈ ±0.5)', ...EXCHANGE_RF_38.values.map(f)],
          ]}
          caption="35–37 wk exchange: use the official figure (BiliTool/PediTools)."
        />
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <h2 className="mb-2 font-bold">Follow-up (no phototherapy; value at ≥12 h)</h2>
          <Table
            head={['Below threshold', 'Do']}
            rows={[
              ['0.1–1.9', '<24 h: delay discharge, TSB 4–8 h · ≥24 h: TSB 4–24 h (± phototherapy options)'],
              ['2.0–3.4', 'TSB/TcB 4–24 h'],
              ['3.5–5.4', 'TSB/TcB 1–2 d'],
              ['5.5–6.9', '<72 h: visit ≤2 d'],
              ['≥7.0', '<72 h: visit ≤3 d'],
            ]}
          />
        </Card>
        <Card>
          <h2 className="mb-2 font-bold">Treat</h2>
          <ul className="ml-4 list-disc space-y-1 text-sm">
            <li>Intensive phototherapy: ≥30 µW/cm²/nm, ~460–490 nm, max skin; TSB within 12 h.</li>
            <li>Stop at ≥2 mg/dL below the threshold at start.</li>
            <li>Rebound: started &lt;48 h or hemolysis → TSB 6–12 h after + next day.</li>
            <li>Escalation: NICU, TSB q2h, CBC/type &amp; cross/albumin/chem, IVIG 0.5–1 g/kg if isoimmune.</li>
            <li>Exchange at threshold or any intermediate/advanced ABE sign; draw G6PD first.</li>
            <li>B/A for exchange: 8.0 / 7.2 / 6.8.</li>
          </ul>
        </Card>
        <Card>
          <h2 className="mb-2 font-bold">Never miss</h2>
          <ul className="ml-4 list-disc space-y-1 text-sm">
            <li>Jaundice &lt;24 h → hemolysis until proven otherwise.</li>
            <li>Jaundice beyond 2 weeks → DB/CB; ≥1.0 mg/dL → urgent pediatric GI.</li>
            <li>Pale stool / dark urine → DB/CB today. Kasai best before 30–45 days.</li>
            <li>Arching, retrocollis, high-pitched cry → exchange now.</li>
            <li>After exchange-level bilirubin → diagnostic ABR.</li>
          </ul>
        </Card>
        <Card>
          <h2 className="mb-2 font-bold">Preterm &lt;35 wk &amp; units</h2>
          <ul className="ml-4 list-disc space-y-1 text-sm">
            <li>Photo / exchange (mg/dL) by postmenstrual age: &lt;28: 5–6 / 11–14 · 28–29: 6–8 / 12–14 · 30–31: 8–10 / 13–16 · 32–33: 10–12 / 15–18 · 34: 12–14 / 17–19.</li>
            <li>mg/dL × 17.1 = µmol/L. NICE ≥38 wk at ≥96 h: 350 / 450 µmol/L.</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}

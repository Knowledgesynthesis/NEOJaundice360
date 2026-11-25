import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router';
import { Activity, AlertOctagon, Plus, Share2, Trash2 } from 'lucide-react';
import { ABE_ACTION, assess, type Zone } from '@/lib/bili/assess';
import {
  ESCALATION_OFFSET,
  MAX_HOURS,
  exchangeCurve,
  phototherapyCurve,
  sampleCurve,
  type ThresholdValue,
} from '@/lib/bili/aap2022';
import {
  HOME_PHOTOTHERAPY_CRITERIA,
  NEUROTOXICITY_RF_LABELS,
  NO_RISK_FACTORS,
  nice38Thresholds,
  PRETERM_TABLE,
  type NeurotoxicityRiskFactors,
} from '@/lib/bili/guidelines';
import { formatBili, fromMgdl, toMgdlFrom, toUmol, unitLabel } from '@/lib/bili/units';
import { useApp } from '@/stores/appStore';
import { BiliChart, type Series } from './BiliChart';
import { Badge, Button, Callout, Card, Check, NumberField, Segmented, Table } from './ui';
import { cn } from '@/lib/cn';
import { Cite } from './Cite';

interface Row {
  ageHours: number | '';
  value: number | ''; // display unit
  method: 'TSB' | 'TcB';
}

const RF_KEYS = Object.keys(NEUROTOXICITY_RF_LABELS) as (keyof NeurotoxicityRiskFactors)[];

function parseParams(sp: URLSearchParams) {
  const rawGa = sp.get('ga');
  const ga = rawGa?.trim() ? Number(rawGa) : NaN;
  const rows: Row[] = (sp.get('m') ?? '')
    .split(',')
    .filter(Boolean)
    .flatMap((s): Row[] => {
      const [h, v, method] = s.split(':');
      if (!h?.trim() || !v?.trim() || (method !== 'TcB' && method !== 'TSB')) return [];
      const ageHours = Number(h), value = Number(v);
      return Number.isFinite(ageHours) && ageHours >= 0 && Number.isFinite(value) && value >= 0 ? [{ ageHours, value, method }] : [];
    });
  const rfList = (sp.get('rf') ?? '').split(',');
  const rf = { ...NO_RISK_FACTORS };
  for (const k of RF_KEYS) if (rfList.includes(k)) rf[k] = true;
  const alb = Number(sp.get('alb'));
  return {
    ga: Number.isInteger(ga) && ga >= 23 && ga <= 42 ? ga : rawGa == null ? 39 : ('' as const),
    gaDays: Math.min(6, Math.max(0, Number(sp.get('gad')) || 0)),
    rows: sp.has('m') ? (rows.length ? rows : [{ ageHours: '', value: '', method: 'TSB' } as Row]) : [{ ageHours: 36, value: 10, method: 'TSB' } as Row],
    rf,
    albumin: Number.isFinite(alb) && alb > 0 ? alb : ('' as const),
    abe: sp.get('abe') === '1',
    outpatient: sp.get('context') === 'outpatient',
    receivedPhototherapy: sp.get('priorPhoto') === '1',
    risingDespitePhototherapy: sp.get('riseOnPhoto') === '1',
  };
}

const zoneMeta: Record<Zone, { label: string; cls: string; icon?: boolean }> = {
  screening: { label: 'TcB screening only — treatment decisions require TSB', cls: 'border-border bg-surface-2 text-fg' },
  below: { label: 'Below phototherapy threshold', cls: 'border-ok/50 bg-ok/10 text-ok' },
  phototherapy: { label: 'Phototherapy indicated', cls: 'border-photo/50 bg-photo/10 text-photo' },
  escalation: { label: 'ESCALATION OF CARE — emergency', cls: 'border-esc/60 bg-esc/12 text-esc', icon: true },
  exchange: { label: 'EXCHANGE TRANSFUSION threshold reached', cls: 'border-exch/60 bg-exch/12 text-exch', icon: true },
  unknown: { label: 'Threshold not computed for this input', cls: 'border-border bg-surface-2 text-muted' },
};

function ProvenanceBadge({ t }: { t: ThresholdValue }) {
  return t.completedHour == null
    ? <Badge tone="neutral">not applicable</Badge>
    : <Badge tone="ok">AAP hour {t.completedHour}</Badge>;
}

export default function BiliCalculator({ compactIntro = false }: { compactIntro?: boolean }) {
  const unit = useApp((s) => s.unit);
  const [sp, setSp] = useSearchParams();
  const [init] = useState(() => parseParams(sp));
  const [ga, setGa] = useState<number | ''>(init.ga);
  const [gaDays, setGaDays] = useState<number | ''>(init.gaDays);
  // rows store values in mg/dL internally; displayed in the chosen unit
  const [rows, setRows] = useState<Row[]>(init.rows);
  const [rf, setRf] = useState<NeurotoxicityRiskFactors>(init.rf);
  const [albumin, setAlbumin] = useState<number | ''>(init.albumin);
  const [abe, setAbe] = useState(init.abe);
  const [outpatient, setOutpatient] = useState(init.outpatient);
  const [receivedPhoto, setReceivedPhoto] = useState(init.receivedPhototherapy);
  const [rising, setRising] = useState(init.risingDespitePhototherapy);
  const [copied, setCopied] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const [inCalc, setInCalc] = useState(false);
  const [resultsVisible, setResultsVisible] = useState(false);
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;
    const a = new IntersectionObserver(([e]) => setInCalc(e.isIntersecting));
    const b = new IntersectionObserver(([e]) => setResultsVisible(e.isIntersecting), { rootMargin: '0px 0px -40% 0px' });
    if (rootRef.current) a.observe(rootRef.current);
    if (resultsRef.current) b.observe(resultsRef.current);
    return () => {
      a.disconnect();
      b.disconnect();
    };
  }, []);

  const gaNum = typeof ga === 'number' && Number.isInteger(ga) && ga >= 23 && ga <= 42 ? ga : NaN;
  const measurements = useMemo(
    () =>
      rows
        .filter((r): r is { ageHours: number; value: number; method: 'TSB' | 'TcB' } => r.ageHours !== '' && r.value !== '')
        .map((r) => ({ ageHours: r.ageHours, value: r.value, method: r.method })),
    [rows],
  );

  const result = useMemo(
    () =>
      measurements.length && Number.isFinite(gaNum)
        ? assess({
            gaWeeks: gaNum,
            gaDays: typeof gaDays === 'number' ? gaDays : 0,
            measurements,
            riskFactors: rf,
            albumin: albumin === '' ? null : albumin,
            abeSigns: abe,
            context: outpatient ? 'outpatient' : undefined,
            receivedPhototherapy: receivedPhoto,
            risingDespitePhototherapy: rising,
          })
        : null,
    [gaNum, gaDays, measurements, rf, albumin, abe, receivedPhoto, rising, outpatient],
  );

  const withRf = result?.withRiskFactors ?? false;
  const latestAge = result?.latest.ageHours ?? 48;
  const withExchangeRf = withRf || (rising && result?.latest.method === 'TSB');
  const xMax = latestAge > 168 ? 336 : 168;

  const series: Series[] = useMemo(() => {
    if (!(gaNum >= 35)) return [];
    const s: Series[] = [
      { id: 'photo', label: 'Phototherapy', color: 'var(--photo)', fillAbove: true, points: sampleCurve(phototherapyCurve(gaNum, withRf), 0, xMax) },
    ];
    const ex = exchangeCurve(gaNum, withExchangeRf);
    if (ex) {
      const exPts = sampleCurve(ex, 0, xMax);
      s.push({ id: 'esc', label: 'Escalation of care', color: 'var(--esc)', dashed: true, fillAbove: true, points: exPts.map((p) => ({ ...p, v: p.v - ESCALATION_OFFSET })) });
      s.push({ id: 'exch', label: 'Exchange transfusion', color: 'var(--exch)', fillAbove: true, points: exPts });
    }
    return s;
  }, [gaNum, withRf, withExchangeRf, xMax]);

  const updateRow = (i: number, patch: Partial<Row>) => setRows((rs) => rs.map((r, j) => (j === i ? { ...r, ...patch } : r)));

  const share = async () => {
    const p = new URLSearchParams();
    p.set('ga', Number.isFinite(gaNum) ? String(gaNum) : '');
    if (gaDays) p.set('gad', String(gaDays));
    p.set('m', measurements.map((m) => `${m.ageHours}:${m.value}:${m.method}`).join(','));
    const on = RF_KEYS.filter((k) => rf[k]);
    if (on.length) p.set('rf', on.join(','));
    if (albumin !== '') p.set('alb', String(albumin));
    if (abe) p.set('abe', '1');
    if (outpatient) p.set('context', 'outpatient');
    if (receivedPhoto) p.set('priorPhoto', '1');
    if (rising) p.set('riseOnPhoto', '1');
    setSp(p, { replace: true });
    try {
      await navigator.clipboard.writeText(window.location.href.split('?')[0] + '?' + p.toString());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked — URL is still updated */
    }
  };

  const t = result?.thresholds;
  const displayedZone = abe ? 'exchange' : result?.zone ?? 'unknown';
  const nice = gaNum >= 38 && result ? nice38Thresholds(result.latest.ageHours) : null;

  return (
    <div ref={rootRef} className="space-y-6" id="calculator">
      {!compactIntro && (
        <Callout kind="info" title="What this calculator embeds">
          Published AAP 2022 hourly phototherapy and exchange tables for infants born at ≥35 weeks, from 1 through 336 completed hours. The escalation line is 2 mg/dL below exchange. Treatment decisions use serum TSB, not TcB.
          <Cite ids={['aap2022', 'bilitool']} />
        </Callout>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]">
        {/* ------------------------------ inputs ------------------------------ */}
        <Card className="min-w-0 space-y-5">
          <div>
            <h3 className="mb-2 font-bold">Infant</h3>
            <div className="grid grid-cols-2 gap-3">
              <NumberField label="GA (completed weeks)" value={ga} onChange={setGa} min={23} max={42} step={1} hint={gaNum < 35 ? 'Preterm table applies' : undefined} />
              <NumberField label="+ days" value={gaDays} onChange={setGaDays} min={0} max={6} step={1} />
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <h3 className="font-bold">Measurements</h3>
              <Button
                variant="ghost"
                className="min-h-8 px-2 text-xs"
                onClick={() =>
                  setRows((rs) => [...rs, { ageHours: (Number(rs.at(-1)?.ageHours) || 24) + 12, value: rs.at(-1)?.value ?? '', method: 'TSB' }])
                }
              >
                <Plus className="h-4 w-4" /> Add
              </Button>
            </div>
            <div className="space-y-3">
              {rows.map((r, i) => (
                <div key={i} className="rounded-xl border border-border bg-surface-2/50 p-3">
                  <div className="grid grid-cols-2 gap-3">
                    <NumberField label="Age (h)" value={r.ageHours} onChange={(v) => updateRow(i, { ageHours: v })} min={0} max={400} step={1} />
                    <NumberField
                      label={`Bilirubin (${unitLabel(unit)})`}
                      value={r.value === '' ? '' : Number(fromMgdl(r.value, unit).toFixed(unit === 'mgdl' ? 1 : 0))}
                      onChange={(v) => updateRow(i, { value: v === '' ? '' : toMgdlFrom(v, unit) })}
                      min={0}
                      max={unit === 'mgdl' ? 40 : 700}
                      step={unit === 'mgdl' ? 0.1 : 1}
                    />
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <Segmented
                      label="Method"
                      value={r.method}
                      onChange={(m) => updateRow(i, { method: m })}
                      options={[
                        { value: 'TSB', label: 'TSB' },
                        { value: 'TcB', label: 'TcB' },
                      ]}
                    />
                    {rows.length > 1 && (
                      <button type="button" onClick={() => setRows((rs) => rs.filter((_, j) => j !== i))} className="rounded-lg p-2 text-muted hover:bg-surface hover:text-exch" aria-label={`Remove measurement ${i + 1}`}>
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-1 font-bold">Neurotoxicity risk factors</h3>
            <p className="mb-2 text-xs text-muted">GA &lt;38 wk is already built into the GA curve — do not tick anything for prematurity alone.</p>
            <div className="space-y-2">
              {RF_KEYS.map((k) => (
                <Check key={k} label={NEUROTOXICITY_RF_LABELS[k]} checked={rf[k]} onChange={(v) => setRf((s) => ({ ...s, [k]: v }))} />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <NumberField label="Albumin (optional)" value={albumin} onChange={setAlbumin} min={1} max={5} step={0.1} suffix="g/dL" hint="<3.0 g/dL counts as a risk factor; enables the B/A ratio" />
            <Check
              label="Outpatient assessment (not birth-discharge planning)"
              checked={outpatient}
              onChange={setOutpatient}
            />
            <Check
              label="Phototherapy already started or completed"
              hint="Suppresses routine discharge follow-up. Use the AAP rebound schedule once treatment stops."
              checked={receivedPhoto || rising}
              onChange={(v) => { setReceivedPhoto(v); if (!v) setRising(false); }}
            />
            <Check
              label="TSB rising despite ongoing phototherapy"
              hint="Select only if serial serum TSB has risen during treatment. A pre-treatment value or TcB does not establish this. Affects exchange/escalation only (KAS 17)."
              checked={rising}
              onChange={setRising}
            />
            <Check
              label="Signs of intermediate/advanced acute bilirubin encephalopathy"
              hint="Hypertonia, arching, retrocollis, opisthotonos, high-pitched cry, recurrent apnea"
              checked={abe}
              onChange={setAbe}
            />
          </div>

          <Button variant="outline" onClick={share} className="w-full">
            <Share2 className="h-4 w-4" /> {copied ? 'Link copied' : 'Copy shareable link'}
          </Button>
          <p className="text-xs text-muted">Links contain the entered values. Share only synthetic examples, never patient information.</p>
        </Card>

        {/* ------------------------------ results ------------------------------ */}
        <div ref={resultsRef} id="calc-results" className="min-w-0 scroll-mt-20 space-y-6">
          {!result ? (
            abe ? (
              <div role="alert" className="rounded-2xl border border-exch/60 bg-exch/12 p-4 text-exch">
                <p className="text-lg font-extrabold">ABE signs — urgent exchange transfusion</p>
                <p className="text-fg">{ABE_ACTION.text} <Cite ids={['aap2022']} /></p>
              </div>
            ) : (
              <Card>
                <p className="text-sm text-muted">Enter a valid gestational age, postnatal age and bilirubin value.</p>
              </Card>
            )
          ) : (
            <>
              <div role={abe ? 'alert' : 'status'} aria-live={abe ? 'assertive' : 'polite'} className={cn('flex min-w-0 items-center gap-3 rounded-2xl border p-4', zoneMeta[displayedZone].cls)}>
                {zoneMeta[displayedZone].icon ? <AlertOctagon className="h-6 w-6 shrink-0" /> : <Activity className="h-6 w-6 shrink-0" />}
                <div>
                  <p className="text-lg font-extrabold">{abe ? 'ABE signs — urgent exchange transfusion' : zoneMeta[displayedZone].label}</p>
                  <p className="text-sm text-fg/80">
                    Latest {result.latest.method} {formatBili(result.latest.value, unit)} at {result.latest.ageHours} h
                    {t?.phototherapy.value != null && <> · Photo: {t.phototherapyCurveLabel}</>}
                  </p>
                </div>
              </div>

              {gaNum >= 35 && t && (
                <div className="space-y-2">
                {t.exchange.value != null && <p className="text-xs text-muted">Exchange and escalation: {t.exchangeCurveLabel}{latestAge < 24 ? ' · greater uncertainty in the first 24 h' : ''}</p>}
                <div className="grid gap-3 sm:grid-cols-3">
                  {[
                    { k: 'Phototherapy', v: t.phototherapy, tone: 'text-photo' },
                    { k: 'Escalation of care', v: t.escalation, tone: 'text-esc' },
                    { k: 'Exchange transfusion', v: t.exchange, tone: 'text-exch' },
                  ].map((c) => (
                    <Card key={c.k} className="p-4 sm:p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted">{c.k}</p>
                      <p className={cn('tabular mt-1 text-2xl font-extrabold', c.tone)}>{c.v.value == null ? '—' : formatBili(c.v.value, unit)}</p>
                      <div className="mt-2">
                        <ProvenanceBadge t={c.v} />
                      </div>
                      {c.v.value == null && c.v.note && <p className="mt-2 text-xs text-muted">{c.v.note}</p>}
                    </Card>
                  ))}
                </div>
                </div>
              )}

              {result.actions.length > 0 && (
                <Card>
                  <h3 className="mb-3 font-bold">What to do</h3>
                  <ol className="space-y-2.5">
                    {result.actions.map((a, i) => (
                      <li key={i} className="flex gap-3 text-sm">
                        <span
                          className={cn(
                            'mt-1 h-2.5 w-2.5 shrink-0 rounded-full',
                            a.level === 'emergency' && 'bg-exch',
                            a.level === 'urgent' && 'bg-esc',
                            a.level === 'act' && 'bg-photo',
                            a.level === 'info' && 'bg-muted',
                          )}
                          aria-hidden
                        />
                        <span>
                          {a.text}
                          {a.refs && <Cite ids={a.refs} />}
                        </span>
                      </li>
                    ))}
                  </ol>
                  {result.followUp?.options && (
                    <ul className="mt-3 ml-5 list-disc space-y-1 text-sm text-muted">
                      {result.followUp.options.map((o) => (
                        <li key={o}>{o}</li>
                      ))}
                    </ul>
                  )}
                </Card>
              )}

              {gaNum >= 35 && (
                <Card>
                  <BiliChart
                    title={`AAP 2022 thresholds — ${t?.phototherapyCurveLabel}`}
                    series={series}
                    markers={measurements.filter((m) => m.ageHours >= 0 && m.ageHours <= MAX_HOURS).map((m) => ({ h: m.ageHours, v: m.value, method: m.method }))}
                    unit={unit}
                    xMax={xMax}
                    yMax={unit === 'mgdl' ? 30 : 30}
                  />
                </Card>
              )}

              <div className="grid gap-3 sm:grid-cols-2">
                {result.rate && (
                  <Card className="p-4 sm:p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted">Rate of rise (last two values)</p>
                    <p className={cn('tabular mt-1 text-xl font-bold', result.rate.suggestsHemolysis && 'text-esc')}>
                      {unit === 'mgdl' ? `${result.rate.mgdlPerHour.toFixed(2)} mg/dL/h` : `${toUmol(result.rate.mgdlPerHour).toFixed(1)} µmol/L/h`}
                    </p>
                    <p className="mt-1 text-xs text-muted">
                      Hemolysis flag at ≥{result.rate.threshold} mg/dL/h ({result.rate.threshold === 0.3 ? 'first 24 h' : 'after 24 h'}).
                    </p>
                  </Card>
                )}
                {result.baRatio != null && (
                  <Card className="p-4 sm:p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted">Bilirubin / albumin ratio</p>
                    <p className={cn('tabular mt-1 text-xl font-bold', result.baRatio >= result.baThreshold && 'text-exch')}>
                      {result.baRatio.toFixed(1)} <span className="text-sm font-medium text-muted">(exchange considered ≥{result.baThreshold.toFixed(1)})</span>
                    </p>
                    <p className="mt-1 text-xs text-muted">mg/dL ÷ g/dL. Use with — never instead of — TSB.</p>
                  </Card>
                )}
                {result.deltaToPhototherapy != null && (
                  <Card className="p-4 sm:p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted">Distance to phototherapy threshold</p>
                    <p className="tabular mt-1 text-xl font-bold">
                      {result.deltaToPhototherapy > 0 ? '−' : '+'}
                      {formatBili(Math.abs(result.deltaToPhototherapy), unit)}
                    </p>
                    <p className="mt-1 text-xs text-muted">{result.deltaToPhototherapy > 0 ? 'below' : 'at/above'} the threshold — drives follow-up timing.</p>
                  </Card>
                )}
                {nice && (
                  <Card className="p-4 sm:p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted">NICE CG98 comparison (≥38 wk)</p>
                    <p className="tabular mt-1 text-sm">
                      Phototherapy <strong>{Math.round(nice.photo)} µmol/L</strong> · exchange <strong>{Math.round(nice.exchange)} µmol/L</strong>
                    </p>
                    <p className="mt-1 text-xs text-muted">
                      ≈ {formatBili(nice.photo / 17.1, 'mgdl')} / {formatBili(nice.exchange / 17.1, 'mgdl')}. UK practice; no risk-factor adjustment.
                      <Cite ids={['nice2010']} />
                    </p>
                  </Card>
                )}
              </div>

              {gaNum < 35 && (
                <Card>
                  <h3 className="mb-1 font-bold">Preterm &lt;35 weeks — consensus TSB ranges (mg/dL)</h3>
                  <p className="mb-3 text-sm text-muted">
                    Use postmenstrual age; use the lower end with risk factors (albumin &lt;2.5 g/dL, rapid rise/hemolysis, clinical instability).
                    <Cite ids={['maisels2012']} />
                  </p>
                  <Table
                    head={['Gestational / postmenstrual age (wk)', 'Start phototherapy', 'Consider exchange']}
                    rows={PRETERM_TABLE.map((r) => [
                      <span className={cn(result.preterm?.label === r.label && 'font-bold text-brand-strong')}>{r.label}</span>,
                      `${r.phototherapy[0]}–${r.phototherapy[1]}`,
                      `${r.exchange[0]}–${r.exchange[1]}`,
                    ])}
                  />
                </Card>
              )}

              {!abe && !receivedPhoto && !rising && result.zone === 'phototherapy' && !withRf && gaNum >= 38 && result.latest.ageHours >= 48 && (
                <Callout kind="pearl" title="Home phototherapy may be an option if ALL apply">
                  <ul className="ml-4 list-disc">
                    {HOME_PHOTOTHERAPY_CRITERIA.map((c) => (
                      <li key={c}>{c}</li>
                    ))}
                  </ul>
                </Callout>
              )}
            </>
          )}
        </div>
      </div>

      {result && inCalc && !resultsVisible && (
        <a
          href="#calc-results"
          onClick={(e) => {
            e.preventDefault();
            document.getElementById('calc-results')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }}
          className={cn(
            'no-print fixed inset-x-3 bottom-3 z-30 flex items-center justify-between gap-3 rounded-2xl border p-3 text-sm shadow-xl backdrop-blur lg:hidden',
            zoneMeta[displayedZone].cls,
            'bg-surface/95',
          )}
        >
          <span className="font-bold">{abe ? 'ABE signs — exchange' : zoneMeta[displayedZone].label}</span>
          <span className="tabular shrink-0 text-xs text-fg">
            Photo {formatBili(t?.phototherapy.value, unit)} ↓
          </span>
        </a>
      )}

      <details className="rounded-2xl border border-border bg-surface p-4 text-sm">
        <summary className="cursor-pointer font-semibold">Data provenance and limits</summary>
        <ul className="mt-3 ml-4 list-disc space-y-1.5 text-muted">
          <li><strong className="text-fg">Published hourly rows:</strong> AAP 2022 Supplemental Tables 1–4, with the published late-age constant rows where applicable. No inferred gestational-age curves or extrapolation. Fractional ages use the completed hour.</li>
          <li><strong className="text-fg">Limits:</strong> AAP treatment tables apply at ≥35 weeks and 1–336 hours; exchange thresholds before 24 h have greater uncertainty. The discharge follow-up table starts at 12 h and applies only before discharge after birth with no prior phototherapy.</li>
          <li><strong className="text-fg">Serum only for treatment:</strong> TcB uses the screening/confirmation rules. Confirmed TSB rising despite phototherapy selects the Table 4 exchange/escalation curve, not the phototherapy risk curve.</li>
          <li>Always use TOTAL bilirubin; if direct bilirubin exceeds 50% of total, consult an expert.</li>
        </ul>
      </details>
    </div>
  );
}

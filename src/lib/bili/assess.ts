import { aap2022Thresholds, type Aap2022Thresholds } from './aap2022';
import {
  baRatioThreshold,
  followUpRecommendation,
  hasAnyRiskFactor,
  pretermRow,
  rateOfRise,
  tcbNeedsTsb,
  type FollowUp,
  type Measurement,
  type NeurotoxicityRiskFactors,
  type PretermRow,
  type RateOfRise,
} from './guidelines';

export type Zone = 'below' | 'phototherapy' | 'escalation' | 'exchange' | 'unknown';

export interface AssessInput {
  gaWeeks: number; // completed weeks
  gaDays?: number; // 0–6
  measurements: Measurement[]; // most recent is used for decisions
  riskFactors: NeurotoxicityRiskFactors;
  albumin?: number | null; // g/dL
  abeSigns?: boolean; // signs of intermediate/advanced acute bilirubin encephalopathy
  context?: 'birth-hospitalization' | 'outpatient';
}

export interface Action {
  level: 'emergency' | 'urgent' | 'act' | 'info';
  text: string;
  refs?: string[];
}

export interface Assessment {
  latest: Measurement;
  withRiskFactors: boolean;
  thresholds: Aap2022Thresholds;
  zone: Zone;
  /** phototherapy threshold − latest value (mg/dL) */
  deltaToPhototherapy: number | null;
  tcbConfirm: boolean;
  rate: RateOfRise | null;
  baRatio: number | null;
  baThreshold: number;
  followUp: FollowUp | null;
  preterm: PretermRow | null;
  actions: Action[];
}

export function assess(input: AssessInput): Assessment | null {
  const ms = [...input.measurements].filter((m) => Number.isFinite(m.ageHours) && Number.isFinite(m.value));
  if (ms.length === 0) return null;
  ms.sort((a, b) => a.ageHours - b.ageHours);
  const latest = ms[ms.length - 1];
  const prev = ms.length > 1 ? ms[ms.length - 2] : null;

  const albuminLow = input.albumin != null && input.albumin > 0 && input.albumin < 3.0;
  const rf: NeurotoxicityRiskFactors = { ...input.riskFactors, albuminLow: input.riskFactors.albuminLow || albuminLow };
  const withRiskFactors = hasAnyRiskFactor(rf);
  const ga = input.gaWeeks;
  const actions: Action[] = [];

  const preterm =
    ga < 35 ? pretermRow(ga + (input.gaDays ?? 0) / 7 + latest.ageHours / 24 / 7) : null;

  const thresholds = aap2022Thresholds(ga, latest.ageHours, withRiskFactors);
  const photo = thresholds.phototherapy.value;
  const esc = thresholds.escalation.value;
  const exch = thresholds.exchange.value;
  const v = latest.value;

  let zone: Zone = 'unknown';
  if (photo != null) {
    zone = 'below';
    if (v >= photo) zone = 'phototherapy';
    if (esc != null && v >= esc) zone = 'escalation';
    if (exch != null && v >= exch) zone = 'exchange';
  }

  const delta = photo != null ? photo - v : null;
  const tcbConfirm = latest.method === 'TcB' && tcbNeedsTsb(v, photo);
  const rate = prev ? rateOfRise(prev, latest) : null;
  const baRatio = input.albumin && input.albumin > 0 ? v / input.albumin : null;
  const baThreshold = baRatioThreshold(ga, withRiskFactors);

  /* ---------- actions, most severe first ---------- */
  if (ga < 35) {
    actions.push({
      level: 'info',
      text: 'AAP 2022 curves apply only to ≥35 weeks. Use the preterm (<35 wk) table below.',
      refs: ['maisels2012'],
    });
  }
  if (input.abeSigns) {
    actions.push({
      level: 'emergency',
      text: 'Signs of intermediate/advanced acute bilirubin encephalopathy → urgent exchange transfusion, regardless of TSB, with intensive phototherapy while preparing.',
      refs: ['aap2022'],
    });
  }
  if (tcbConfirm) {
    actions.push({
      level: 'urgent',
      text: 'TcB is ≥15 mg/dL or within 3 mg/dL of the phototherapy threshold → measure TSB before deciding. TcB can be used again ≥24 h after phototherapy ends.',
      refs: ['aap2022'],
    });
  }
  if (zone === 'exchange') {
    actions.push({
      level: 'emergency',
      text: 'At/above the exchange threshold → urgent exchange transfusion. Continue intensive phototherapy; TSB every 2 h until it is done or the TSB falls below the escalation threshold.',
      refs: ['aap2022'],
    });
  }
  if (zone === 'escalation' || zone === 'exchange') {
    actions.push({
      level: 'emergency',
      text: 'Escalation of care (medical emergency): NICU able to do exchange; intensive phototherapy; TSB at least every 2 h; CBC, type & crossmatch, albumin, chemistry panel; enteral feeding (IV fluids only if dehydrated).',
      refs: ['aap2022'],
    });
    if (rf.isoimmune) {
      actions.push({
        level: 'urgent',
        text: 'Isoimmune hemolysis at escalation threshold → IVIG 0.5–1 g/kg IV over 2 h (may repeat in 12 h). Evidence is low certainty.',
        refs: ['aap2022', 'cochraneIvig2018'],
      });
    }
    actions.push({
      level: 'info',
      text: 'Send G6PD activity and any other diagnostic blood tests BEFORE transfusion — donor cells invalidate them.',
      refs: ['aap2022'],
    });
  }
  if (zone === 'phototherapy') {
    actions.push({
      level: 'act',
      text: 'Start intensive phototherapy now: irradiance ≥30 µW/cm²/nm, ~460–490 nm (blue–green), maximal skin exposure. Repeat TSB within 12 h; sooner if near escalation or hemolysis.',
      refs: ['aap2022', 'aap2011photo'],
    });
  }
  if (zone === 'phototherapy' || zone === 'escalation' || zone === 'exchange') {
    actions.push({
      level: 'info',
      text: 'Continue feeding (breast milk or formula). Do not interrupt breastfeeding to "test" for breast milk jaundice.',
      refs: ['aap2022', 'abm22'],
    });
  }
  if (rate?.suggestsHemolysis) {
    actions.push({
      level: 'urgent',
      text: `Rate of rise ${rate.mgdlPerHour.toFixed(2)} mg/dL/h (≥${rate.threshold}) suggests hemolysis → DAT, blood type, CBC, reticulocytes, smear; G6PD activity if cause unclear.`,
      refs: ['aap2022'],
    });
  }
  if (latest.ageHours < 24 && v >= 0 && photo != null && v >= photo - 2) {
    actions.push({
      level: 'urgent',
      text: 'Bilirubin at/near threshold in the first 24 h is usually pathologic — evaluate for hemolysis now.',
      refs: ['aap2022'],
    });
  }
  if (baRatio != null && baRatio >= baThreshold && (zone === 'escalation' || zone === 'exchange')) {
    actions.push({
      level: 'urgent',
      text: `B/A ratio ${baRatio.toFixed(1)} ≥ ${baThreshold.toFixed(1)}: supports exchange (use with, not instead of, TSB).`,
      refs: ['aap2022'],
    });
  }
  if (thresholds.exchange.status === 'not-embedded' && (zone === 'phototherapy' || zone === 'below') && photo != null && v >= photo) {
    actions.push({
      level: 'info',
      text: 'For 35–37 weeks, check the official escalation/exchange curve (BiliTool/PediTools) — this app does not embed it.',
      refs: ['aap2022', 'bilitool'],
    });
  }

  let followUp: FollowUp | null = null;
  if (zone === 'below' && delta != null) {
    followUp = followUpRecommendation(delta, latest.ageHours);
    actions.push({
      level: 'info',
      text: `Below phototherapy threshold by ${delta.toFixed(1)} mg/dL. If no phototherapy this admission: ${followUp.action}`,
      refs: ['aap2022', 'kuzniewicz2021'],
    });
  }
  if (latest.ageHours < 12) {
    actions.push({
      level: 'info',
      text: 'Thresholds are not computed before 12 h. Any visible jaundice <24 h → measure TSB/TcB now and evaluate for hemolysis.',
      refs: ['aap2022'],
    });
  }
  if (latest.ageHours > 336) {
    actions.push({
      level: 'info',
      text: 'Beyond 14 days, AAP curves no longer apply: measure total AND direct/conjugated bilirubin (DB/CB ≥1.0 mg/dL → urgent GI referral).',
      refs: ['harpavat2025', 'fawaz2017'],
    });
  }

  return {
    latest,
    withRiskFactors,
    thresholds,
    zone,
    deltaToPhototherapy: delta,
    tcbConfirm,
    rate,
    baRatio,
    baThreshold,
    followUp,
    preterm,
    actions,
  };
}

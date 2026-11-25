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

export type Zone = 'screening' | 'below' | 'phototherapy' | 'escalation' | 'exchange' | 'unknown';

export interface AssessInput {
  gaWeeks: number; // completed weeks
  gaDays?: number; // 0–6
  measurements: Measurement[]; // most recent is used for decisions
  riskFactors: NeurotoxicityRiskFactors;
  albumin?: number | null; // g/dL
  receivedPhototherapy?: boolean;
  risingDespitePhototherapy?: boolean; // clinician-confirmed serial TSB rise during ongoing phototherapy (KAS 17)
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

export const ABE_ACTION: Action = {
  level: 'emergency',
  text: 'Intermediate or advanced signs of acute bilirubin encephalopathy require urgent exchange transfusion. Mobilize the exchange-capable NICU and start intensive phototherapy while preparing; do not wait for a bilirubin result.',
  refs: ['aap2022'],
};

export function assess(input: AssessInput): Assessment | null {
  const ms = [...input.measurements].filter((m) => Number.isFinite(m.ageHours) && m.ageHours >= 0 && Number.isFinite(m.value) && m.value >= 0 && (m.method === 'TSB' || m.method === 'TcB'));
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

  const isSerum = latest.method === 'TSB';
  const thresholds = aap2022Thresholds(ga, latest.ageHours, withRiskFactors, isSerum && input.risingDespitePhototherapy);
  const photo = thresholds.phototherapy.value;
  const esc = thresholds.escalation.value;
  const exch = thresholds.exchange.value;
  const v = latest.value;

  let zone: Zone = isSerum ? 'unknown' : 'screening';
  if (isSerum && photo != null) {
    zone = 'below';
    if (v >= photo) zone = 'phototherapy';
    if (esc != null && v >= esc) zone = 'escalation';
    if (exch != null && v >= exch) zone = 'exchange';
  }

  const delta = photo != null ? photo - v : null;
  const tcbConfirm = latest.method === 'TcB' && tcbNeedsTsb(v, photo);
  const rate = prev && prev.method === latest.method ? rateOfRise(prev, latest) : null;
  const baRatio = isSerum && photo != null && input.albumin && input.albumin > 0 ? v / input.albumin : null;
  const baThreshold = baRatioThreshold(ga, withRiskFactors);

  /* ---------- actions, most severe first ---------- */
  if (ga < 35) {
    actions.push({
      level: 'info',
      text: 'AAP 2022 curves apply only to ≥35 weeks. Use the preterm (<35 wk) table below.',
      refs: ['maisels2012'],
    });
  }
  if (input.abeSigns) actions.unshift(ABE_ACTION);
  if (!isSerum) {
    actions.push({
      level: tcbConfirm ? 'urgent' : 'info',
      text: tcbConfirm
        ? (photo == null ? 'No applicable AAP threshold for this screen. Obtain a serum TSB for clinical assessment.' : 'Obtain serum TSB now: TcB is at least 15 mg/dL, at/above the phototherapy threshold, or within 3 mg/dL below it (KAS 6).')
        : 'TcB is a screening result. Use serum TSB, not TcB, to make phototherapy, escalation and exchange decisions (KAS 3).',
      refs: ['aap2022'],
    });
  }
  if (zone === 'exchange') {
    actions.push({
      level: 'emergency',
      text: 'TSB is at or above the exchange threshold: prepare for urgent exchange. If TSB falls below the exchange threshold during preparation and there are no intermediate/advanced ABE signs, exchange may be deferred. Continue intensive phototherapy and measure TSB at least every 2 h until it is below escalation (KAS 23).',
      refs: ['aap2022'],
    });
  }
  if (zone === 'escalation' || zone === 'exchange') {
    actions.push({
      level: 'emergency',
      text: 'Escalation of care is a medical emergency: start IV hydration and emergent intensive phototherapy. Consult neonatology about urgent transfer to an exchange-capable NICU. Send STAT total and direct bilirubin, CBC, albumin, chemistries and type/crossmatch. Measure TSB at least every 2 h until below escalation (KAS 18–20).',
      refs: ['aap2022'],
    });
    if (rf.isoimmune) {
      actions.push({
        level: 'urgent',
        text: 'For positive-DAT isoimmune hemolysis at escalation, IVIG 0.5–1 g/kg over 2 h is an option, not routine; may repeat in 12 h. Benefit is uncertain; do not delay exchange preparation.',
        refs: ['aap2022', 'cochraneIvig2018'],
      });
    }
    actions.push({
      level: 'info',
      text: 'Send G6PD activity and any other diagnostic blood tests BEFORE transfusion — donor cells invalidate them.',
      refs: ['aap2022'],
    });
  }
  if (!input.abeSigns && zone === 'phototherapy') {
    actions.push({
      level: 'act',
      text: input.receivedPhototherapy || input.risingDespitePhototherapy ? 'TSB is at or above the phototherapy threshold. Review response and treatment delivery promptly, and continue or restart intensive phototherapy as indicated. Use serum monitoring, not the routine discharge follow-up chart.' : 'Start intensive phototherapy now: irradiance ≥30 µW/cm²/nm, ~460–490 nm (blue–green), maximal skin exposure. Repeat TSB within 12 h; sooner if near escalation or hemolysis.',
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
  if (isSerum && latest.ageHours < 24 && photo != null && v >= photo) {
    actions.push({
      level: 'urgent',
      text: 'TSB at or above the phototherapy threshold before 24 h suggests hemolysis; evaluate promptly. Exchange thresholds before 24 h have greater uncertainty.',
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
  if (isSerum && latest.ageHours < 24 && (zone === 'escalation' || zone === 'exchange')) {
    actions.push({ level: 'info', text: 'AAP exchange thresholds in the first 24 h have greater uncertainty; consult neonatology urgently.', refs: ['aap2022'] });
  }

  let followUp: FollowUp | null = null;
  if (!input.abeSigns && !input.receivedPhototherapy && !input.risingDespitePhototherapy && input.context !== 'outpatient' && latest.ageHours >= 12 &&
      (zone === 'below' || (zone === 'screening' && !tcbConfirm)) && delta != null && delta > 0) {
    followUp = followUpRecommendation(delta, latest.ageHours);
    actions.push({
      level: 'info',
      text: `Below phototherapy threshold by ${delta.toFixed(1)} mg/dL. For birth-discharge planning only, if no phototherapy this admission: ${followUp.action}`,
      refs: ['aap2022', 'kuzniewicz2021'],
    });
  }
  if ((input.receivedPhototherapy || input.risingDespitePhototherapy) && !input.abeSigns && (zone === 'below' || zone === 'screening')) {
    actions.push({ level: 'info', text: 'After phototherapy, use KAS 16 rebound follow-up rather than the routine birth-discharge chart. Prefer serum TSB during treatment and for the first 24 hours after it stops.', refs: ['aap2022'] });
  }
  if (latest.ageHours < 12) {
    actions.push({
      level: 'info',
      text: 'The AAP discharge follow-up chart does not apply before 12 h. Jaundice before 24 h warrants prompt bilirubin measurement and assessment.',
      refs: ['aap2022'],
    });
  }
  if (latest.ageHours > 336) {
    actions.push({
      level: 'info',
      text: 'The AAP threshold tables end at 14 days. Persistent jaundice needs separate clinical assessment for cholestasis, including total and direct/conjugated bilirubin when indicated.',
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

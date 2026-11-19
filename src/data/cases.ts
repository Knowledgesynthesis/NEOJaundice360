import type { NeurotoxicityRiskFactors } from '@/lib/bili/guidelines';
import type { Zone } from '@/lib/bili/assess';

export interface CaseOption {
  text: string;
  correct: boolean;
  feedback: string;
}

export interface CaseCalc {
  gaWeeks: number;
  measurements: { ageHours: number; value: number; method: 'TSB' | 'TcB' }[];
  rf?: Partial<NeurotoxicityRiskFactors>;
  albumin?: number;
  abeSigns?: boolean;
  /** Asserted by unit tests so the narrative never contradicts the engine. */
  expectZone: Zone;
}

export interface CaseStep {
  title: string;
  narrative: string;
  data?: [string, string][];
  calc?: CaseCalc;
  question: string;
  multi?: boolean;
  options: CaseOption[];
  teaching: string;
  refs?: string[];
}

export interface ClinicalCase {
  id: string;
  title: string;
  hook: string;
  level: 'Core' | 'Advanced';
  tags: string[];
  steps: CaseStep[];
  takeaways: string[];
}

export const CASES: ClinicalCase[] = [
  {
    id: 'abo',
    title: 'Yellow face at 18 hours',
    hook: '39-week boy, group O mother, jaundiced before 24 h.',
    level: 'Core',
    tags: ['Hemolysis', 'Risk factors', 'Rebound'],
    steps: [
      {
        title: 'The nurse’s call',
        narrative:
          '39 2/7-week boy, birth weight 3.4 kg, breastfeeding well. Mother is O Rh(D)+ with a negative antibody screen. At 18 h the nurse notes a yellow face and sclerae.',
        question: 'What is the right next step?',
        options: [
          { text: 'Measure TSB (or TcB) now', correct: true, feedback: 'Jaundice <24 h → measure as soon as possible.' },
          { text: 'Re-examine at 24 h and measure then', correct: false, feedback: 'Delays recognition of hemolysis.' },
          { text: 'Wait for the routine 24–48 h screen', correct: false, feedback: 'Routine screening does not apply to an already-jaundiced infant <24 h.' },
          { text: 'Start phototherapy empirically', correct: false, feedback: 'Measure first; the decision depends on the value and curve.' },
        ],
        teaching: 'Visible jaundice in the first 24 h is presumed pathologic until proven otherwise; visual estimation of the level is unreliable.',
        refs: ['aap2022'],
      },
      {
        title: 'First result',
        narrative: 'TSB at 18 h is 8.6 mg/dL (direct 0.3).',
        question: 'Which tests do you send now? (select all that apply)',
        multi: true,
        options: [
          { text: 'Direct antiglobulin test (DAT)', correct: true, feedback: 'Detects antibody-coated red cells.' },
          { text: 'Infant blood type', correct: true, feedback: 'Group O mother → is the infant A or B?' },
          { text: 'CBC, reticulocytes, peripheral smear', correct: true, feedback: 'Anemia, reticulocytosis, spherocytes.' },
          { text: 'Urine culture', correct: false, feedback: 'Not indicated in a well infant <24 h.' },
          { text: 'TSH / free T4', correct: false, feedback: 'Hypothyroidism causes prolonged, not early, jaundice.' },
        ],
        teaching:
          'Early jaundice = look for hemolysis: DAT, type, CBC/retic/smear. G6PD activity is added if ancestry/family history suggests it or no cause is found.',
        refs: ['aap2022'],
      },
      {
        title: 'Results and the right curve',
        narrative: 'Infant is A Rh(D)+, DAT positive (1+). Hb 14.2 g/dL, reticulocytes 9%, microspherocytes on smear.',
        data: [
          ['Blood type', 'A Rh(D)+'],
          ['DAT', 'Positive (1+)'],
          ['Hb / retic', '14.2 g/dL / 9%'],
        ],
        question: 'Which AAP 2022 threshold curve applies?',
        options: [
          { text: '≥40 weeks, no risk factors', correct: false, feedback: 'He is 39 weeks and has a neurotoxicity risk factor.' },
          { text: '≥38 weeks, with neurotoxicity risk factor (isoimmune hemolysis)', correct: true, feedback: 'Positive DAT = isoimmune hemolytic disease.' },
          { text: '39 weeks, no risk factors', correct: false, feedback: 'Ignores the positive DAT.' },
          { text: 'AAP 2004 medium-risk line', correct: false, feedback: 'Superseded in 2022.' },
        ],
        teaching: 'Risk-factor curves exist for 35, 36, 37 and ≥38 weeks. Isoimmune hemolysis, G6PD deficiency, other hemolysis, albumin <3.0, sepsis and instability all select them.',
        refs: ['aap2022'],
      },
      {
        title: 'Repeat at 24 h',
        narrative: 'Repeat TSB at 24 h: 10.9 mg/dL.',
        calc: {
          gaWeeks: 39,
          measurements: [
            { ageHours: 18, value: 8.6, method: 'TSB' },
            { ageHours: 24, value: 10.9, method: 'TSB' },
          ],
          rf: { isoimmune: true },
          expectZone: 'phototherapy',
        },
        question: 'What now?',
        options: [
          { text: 'Intensive phototherapy; repeat TSB within 12 h (sooner given hemolysis)', correct: true, feedback: 'TSB is above the 10.5 mg/dL threshold at 24 h.' },
          { text: 'IVIG now', correct: false, feedback: 'IVIG is for isoimmune hemolysis at the escalation-of-care threshold — far above this.' },
          { text: 'Exchange transfusion', correct: false, feedback: 'Not near the exchange threshold.' },
          { text: 'Observe; recheck tomorrow', correct: false, feedback: 'He is above threshold with a rate of rise of 0.38 mg/dL/h.' },
        ],
        teaching: 'Rate of rise = (10.9 − 8.6)/6 h = 0.38 mg/dL/h, which also flags hemolysis. Breastfeeding continues during phototherapy.',
        refs: ['aap2022'],
      },
      {
        title: 'Stopping and rebound',
        narrative: 'TSB falls to 9.1 at 36 h and 7.8 mg/dL at 60 h.',
        question: 'Which plan is best?',
        options: [
          {
            text: 'Stopping is an option (≥2 mg/dL below the 10.5 threshold at initiation). Check TSB 6–12 h after stopping and again the next day; check Hb for late anemia over the following weeks.',
            correct: true,
            feedback: 'Started <48 h + hemolysis = higher rebound risk.',
          },
          { text: 'Stop and discharge without further bilirubin', correct: false, feedback: 'High rebound risk.' },
          { text: 'Continue phototherapy until TSB <5 mg/dL', correct: false, feedback: 'Unnecessary prolongation.' },
          { text: 'Stop; TcB in 1 hour', correct: false, feedback: 'TcB is unreliable within 24 h of phototherapy, and 1 h is too early to see rebound.' },
        ],
        teaching: 'ABO disease can cause anemia for several weeks; arrange a hemoglobin check.',
        refs: ['aap2022'],
      },
    ],
    takeaways: [
      'Jaundice <24 h → measure now and look for hemolysis.',
      'Positive DAT selects the risk-factor curve.',
      'Calculate the rate of rise: ≥0.3 mg/dL/h (<24 h) or ≥0.2 (after) suggests hemolysis.',
      'High rebound risk → TSB 6–12 h after stopping and the next day.',
    ],
  },
  {
    id: 'intake',
    title: 'Day 4: sleepy, 12% down',
    hook: '38-week breastfed girl; is this a phototherapy problem or a feeding problem?',
    level: 'Core',
    tags: ['Feeding', 'Follow-up', 'TcB'],
    steps: [
      {
        title: 'Discharge planning',
        narrative: '38 0/7-week girl, exclusively breastfed, no neurotoxicity risk factors. TcB 7.5 mg/dL at 36 h, discharge today.',
        calc: { gaWeeks: 38, measurements: [{ ageHours: 36, value: 7.5, method: 'TcB' }], expectZone: 'below' },
        question: 'What follow-up does the AAP 2022 algorithm give?',
        options: [
          { text: 'Follow-up within 2 days; TcB/TSB per clinical judgment', correct: true, feedback: 'TcB is 6.7 mg/dL below threshold (5.5–6.9 band, <72 h).' },
          { text: 'TSB in 4–24 h', correct: false, feedback: 'That is the 2.0–3.4 band.' },
          { text: 'No follow-up needed', correct: false, feedback: 'Every newborn needs a follow-up plan.' },
          { text: 'Follow-up at 1 week', correct: false, feedback: 'Too late for a 36-h discharge.' },
        ],
        teaching: 'The difference between the bilirubin and the threshold drives follow-up. Feeding risk (exclusive breastfeeding with suboptimal intake) argues for the early end of the window.',
        refs: ['aap2022', 'kuzniewicz2021'],
      },
      {
        title: 'Clinic, 90 h',
        narrative: 'Weight 3.02 kg (birth 3.42 kg, −11.7%). Two wet diapers in 24 h, dark stools. Sleepy, short feeds. TcB 16.2 mg/dL.',
        question: 'Next step?',
        options: [
          { text: 'Measure TSB', correct: true, feedback: 'TcB ≥15 mg/dL → confirm with TSB.' },
          { text: 'Admit for phototherapy on the TcB', correct: false, feedback: 'Treatment decisions use TSB.' },
          { text: 'Recheck TcB in 3 days', correct: false, feedback: 'TcB ≥15 mandates TSB.' },
          { text: 'Advise stopping breastfeeding', correct: false, feedback: 'Never the fix for suboptimal intake.' },
        ],
        teaching: 'With this weight loss, add serum sodium to look for hypernatremic dehydration.',
        refs: ['aap2022'],
      },
      {
        title: 'TSB result',
        narrative: 'TSB 17.6 mg/dL at 90 h; sodium 144 mmol/L.',
        calc: { gaWeeks: 38, measurements: [{ ageHours: 90, value: 17.6, method: 'TSB' }], expectZone: 'below' },
        question: 'Best plan?',
        options: [
          {
            text: 'Feeding plan: lactation support, feed 8–12×/day, supplement with expressed/donor milk or formula; repeat TSB in 4–24 h',
            correct: true,
            feedback: 'Below threshold by ~2.9 mg/dL; the problem is intake.',
          },
          { text: 'Admit for phototherapy', correct: false, feedback: 'Below the 2022 threshold.' },
          { text: 'Stop breastfeeding for 48 h', correct: false, feedback: 'Not recommended.' },
          { text: 'Add dextrose water after feeds', correct: false, feedback: 'Does not lower bilirubin; risks hyponatremia.' },
        ],
        teaching: 'Under AAP 2004 this infant would often have been admitted. Supplementing intake treats the cause.',
        refs: ['abm22', 'aap2022'],
      },
      {
        title: 'Next day',
        narrative: 'At 112 h: weight +45 g, 6 wet diapers, yellow stools. TSB 16.1 mg/dL.',
        calc: { gaWeeks: 38, measurements: [{ ageHours: 112, value: 16.1, method: 'TSB' }], expectZone: 'below' },
        question: 'Interpretation?',
        options: [
          { text: 'Improving: intake restored and TSB falling; recheck in 1–2 days', correct: true, feedback: '~4.6 mg/dL below the plateau threshold.' },
          { text: 'Refractory — needs exchange', correct: false, feedback: 'Far from exchange levels.' },
          { text: 'Breast milk jaundice', correct: false, feedback: 'That is prolonged jaundice in a thriving infant.' },
          { text: 'Start phototherapy', correct: false, feedback: 'Below threshold.' },
        ],
        teaching: 'Weight and stool output are the treatment response measures for suboptimal intake jaundice.',
      },
    ],
    takeaways: [
      'Suboptimal intake jaundice is fixed with milk, not by stopping breastfeeding.',
      'TcB ≥15 mg/dL or within 3 mg/dL of threshold → TSB.',
      'No water or dextrose supplements.',
    ],
  },
  {
    id: 'g6pd',
    title: 'The second rise',
    hook: '37-week boy; jaundice falls, then surges on day 4.',
    level: 'Advanced',
    tags: ['G6PD', 'Hemolysis', 'Testing pitfalls'],
    steps: [
      {
        title: 'Birth hospitalization',
        narrative:
          '37 3/7-week boy. Family originates from the eastern Mediterranean; his brother needed phototherapy. TSB 9.0 mg/dL at 30 h. DAT negative.',
        calc: { gaWeeks: 37, measurements: [{ ageHours: 30, value: 9.0, method: 'TSB' }], expectZone: 'below' },
        question: 'Follow-up from the algorithm?',
        options: [
          { text: 'TSB or TcB in 1–2 days', correct: true, feedback: '~3.6 mg/dL below threshold → 3.5–5.4 band.' },
          { text: 'Follow-up within 3 days', correct: false, feedback: 'That is the ≥7 band.' },
          { text: 'No follow-up', correct: false, feedback: 'Never.' },
          { text: 'Start phototherapy', correct: false, feedback: 'Below threshold.' },
        ],
        teaching: 'Sibling phototherapy and ancestry are risk factors for significant hyperbilirubinemia → choose the earliest end of the window. Many centers test G6PD here.',
        refs: ['aap2022'],
      },
      {
        title: 'Day 4',
        narrative: 'Day 3 TcB was reassuring. On day 4 the grandmother unpacked clothes stored with mothballs. At 100 h he is deeply yellow. TSB 18.4 mg/dL.',
        calc: { gaWeeks: 37, measurements: [{ ageHours: 100, value: 18.4, method: 'TSB' }], rf: { g6pd: true }, expectZone: 'phototherapy' },
        question: 'How do you choose the threshold curve now?',
        options: [
          {
            text: 'Treat suspected hemolysis (likely G6PD deficiency) as a neurotoxicity risk factor → 37-week risk-factor curve; he is above it → intensive phototherapy',
            correct: true,
            feedback: 'On the no-RF curve (20.0) he would wrongly look “below threshold”.',
          },
          { text: '37-week no-risk-factor curve; observe', correct: false, feedback: 'Ignores probable hemolysis.' },
          { text: 'Exchange transfusion now', correct: false, feedback: 'Phototherapy first; escalate if he reaches the escalation curve (read from the official 37-wk figure).' },
          { text: 'Wait for the G6PD result', correct: false, feedback: 'Treat now.' },
        ],
        teaching: 'Naphthalene is a classic oxidant trigger. A sudden rise or a rise after decline should prompt G6PD testing.',
        refs: ['aap2022'],
      },
      {
        title: 'A confusing result',
        narrative: 'Hb 12.1 g/dL (was 17.0), reticulocytes 6%, occasional bite cells. Quantitative G6PD activity reported “normal”.',
        question: 'Interpretation?',
        options: [
          { text: 'G6PD deficiency excluded', correct: false, feedback: 'Not during active hemolysis.' },
          {
            text: 'Possibly falsely normal (young cells have higher activity) — repeat at ~3 months or test the mother; manage as deficient meanwhile',
            correct: true,
            feedback: 'Correct.',
          },
          { text: 'Proves hereditary spherocytosis', correct: false, feedback: 'No spherocytes; DAT negative.' },
          { text: 'Lab error; ignore the anemia', correct: false, feedback: 'The anemia is real.' },
        ],
        teaching: 'Educate the family: avoid naphthalene, specified drugs, some herbal remedies; seek care early for jaundice or dark urine.',
        refs: ['aap2022', 'kaplan1997'],
      },
    ],
    takeaways: [
      'G6PD: sudden rise, rise after decline, or failure to respond to phototherapy → test.',
      'Normal G6PD activity during hemolysis can mislead.',
      'Suspected hemolysis selects the risk-factor curve.',
    ],
  },
  {
    id: 'bmj',
    title: 'Thriving and still yellow at 3 weeks',
    hook: '40-week breastfed girl gaining beautifully.',
    level: 'Core',
    tags: ['Prolonged jaundice', 'Cholestasis screen'],
    steps: [
      {
        title: 'Well visit',
        narrative: '21-day-old, 40 weeks, exclusively breastfed, gaining 35 g/day. Sclerae yellow. Stools mustard-yellow; urine pale.',
        question: 'Which test is essential today?',
        options: [
          { text: 'Total AND direct/conjugated bilirubin', correct: true, feedback: 'Jaundice beyond 2 weeks → exclude cholestasis.' },
          { text: 'None — she is thriving', correct: false, feedback: 'Biliary atresia infants often thrive initially.' },
          { text: 'Stop breastfeeding for 48 h and see', correct: false, feedback: 'Not recommended.' },
          { text: 'HIDA scan', correct: false, feedback: 'Not a first test.' },
        ],
        teaching: 'AAP 2025: eyes → stool → first bilirubin at the 2–4-week visit.',
        refs: ['harpavat2025'],
      },
      {
        title: 'Results',
        narrative: 'TSB 12.4 mg/dL, direct 0.4 mg/dL. Newborn screen (TSH) normal.',
        question: 'Diagnosis and plan?',
        options: [
          { text: 'Breast milk jaundice: continue breastfeeding, reassure, give safety-netting about stool/urine color', correct: true, feedback: 'Unconjugated, thriving, normal DB and thyroid screen.' },
          { text: 'Cholestasis — urgent GI', correct: false, feedback: 'DB 0.4 mg/dL is normal.' },
          { text: 'Phototherapy', correct: false, feedback: 'Not indicated.' },
          { text: 'Switch to formula', correct: false, feedback: 'Unnecessary.' },
        ],
        teaching: 'Breast milk jaundice can persist 8–12 weeks. Re-evaluate if stools turn pale, urine darkens, or she stops thriving.',
        refs: ['abm22'],
      },
      {
        title: 'Safety-netting',
        narrative: 'Parents ask what should make them call.',
        question: 'Which stool color needs same-day contact?',
        options: [
          { text: 'Mustard yellow', correct: false, feedback: 'Normal.' },
          { text: 'Green', correct: false, feedback: 'Normal.' },
          { text: 'Pale yellow, chalky white or clay-gray', correct: true, feedback: 'Acholic stool = possible biliary atresia.' },
          { text: 'Brown', correct: false, feedback: 'Normal.' },
        ],
        teaching: 'Stool-color cards turn parents into the screening tool (Taiwan’s national programme improved timely Kasai).',
        refs: ['hsiao2008'],
      },
    ],
    takeaways: ['Prolonged jaundice always needs a DB/CB.', 'Breast milk jaundice is a diagnosis of exclusion.', 'Teach parents the stool card.'],
  },
  {
    id: 'ba',
    title: 'Cream-colored stools at 4 weeks',
    hook: '39-week formula-fed boy, “always a bit yellow”.',
    level: 'Core',
    tags: ['Biliary atresia', 'Urgency'],
    steps: [
      {
        title: 'History',
        narrative: '28-day-old, gaining well. Parents say stools are “pale yellow, sometimes cream”; urine stains the diaper yellow.',
        question: 'Next step?',
        options: [
          { text: 'Total and direct/conjugated bilirubin today', correct: true, feedback: 'Pale stool + persistent jaundice.' },
          { text: 'Reassure; review at 6–8 weeks', correct: false, feedback: 'Dangerous delay.' },
          { text: 'Switch formula', correct: false, feedback: 'Irrelevant.' },
          { text: 'Phototherapy', correct: false, feedback: 'Wrong problem.' },
        ],
        teaching: 'Dark urine in a newborn is abnormal — it is conjugated bilirubin.',
        refs: ['harpavat2025'],
      },
      {
        title: 'Result',
        narrative: 'TSB 7.8 mg/dL, direct 4.6 mg/dL.',
        question: 'What now?',
        options: [
          { text: 'Same-day/next-day pediatric GI/hepatology referral', correct: true, feedback: 'DB ≥1.0 mg/dL.' },
          { text: 'Repeat in 2 weeks', correct: false, feedback: 'Every week matters for Kasai.' },
          { text: 'HIDA scan, then decide on referral', correct: false, feedback: 'Refer first; imaging shouldn’t delay referral.' },
          { text: 'Start ursodiol and observe', correct: false, feedback: 'Not a diagnostic plan.' },
        ],
        teaching: 'Kasai outcomes are best before 30–45 days. This infant is already 28 days old.',
        refs: ['harpavat2025', 'fawaz2017'],
      },
      {
        title: 'Initial work-up',
        narrative: 'While arranging transfer you can send labs.',
        question: 'Which are appropriate? (select all that apply)',
        multi: true,
        options: [
          { text: 'ALT, AST, ALP, GGT, albumin', correct: true, feedback: 'Pattern and severity.' },
          { text: 'PT/INR — and vitamin K if prolonged', correct: true, feedback: 'Fat-soluble vitamin deficiency.' },
          { text: 'Glucose', correct: true, feedback: 'Hypoglycemia → endocrine/metabolic causes.' },
          { text: 'Alpha-1 antitrypsin level + phenotype', correct: true, feedback: 'Most common genetic cause.' },
          { text: 'Urine culture', correct: true, feedback: 'UTI can cause cholestasis.' },
          { text: 'Wait for all results before referring', correct: false, feedback: 'Refer in parallel.' },
        ],
        teaching: 'Also: fasting ultrasound, newborn-screen review, CMV PCR if indicated; serum MMP-7 where available.',
        refs: ['fawaz2017', 'lertudomphonwanit2017'],
      },
      {
        title: 'Imaging',
        narrative: 'Ultrasound: small irregular gallbladder; echogenic triangular cord at the porta hepatis.',
        question: 'How is the diagnosis confirmed?',
        options: [
          { text: 'Intraoperative cholangiogram, proceeding to Kasai portoenterostomy', correct: true, feedback: 'Diagnostic standard.' },
          { text: 'Repeat ultrasound in 4 weeks', correct: false, feedback: 'Delay.' },
          { text: 'A normal HIDA would be needed first', correct: false, feedback: 'HIDA is sensitive, not specific.' },
          { text: 'Steroids, then reassess', correct: false, feedback: 'No role pre-diagnosis.' },
        ],
        teaching: 'Post-Kasai adjuvant steroids did not improve drainage in the START trial.',
        refs: ['bezerra2014'],
      },
    ],
    takeaways: ['Pale stool or dark urine + jaundice = DB/CB today.', 'DB/CB ≥1.0 mg/dL → urgent pediatric GI.', 'Aim for Kasai before 30–45 days.'],
  },
  {
    id: 'rh',
    title: 'Anti-D and a racing bilirubin',
    hook: '39-week boy after two intrauterine transfusions.',
    level: 'Advanced',
    tags: ['Escalation', 'IVIG', 'Exchange', 'Hearing'],
    steps: [
      {
        title: 'Delivery',
        narrative: '39 1/7 weeks. Mother Rh(D)-negative, anti-D titer 1:64, two intrauterine transfusions. Cord: Hb 10.8 g/dL, DAT strongly positive, TSB 5.8 mg/dL.',
        question: 'Immediate plan?',
        options: [
          { text: 'NICU, intensive phototherapy from now, TSB every 4–6 h, albumin, crossmatched blood available', correct: true, feedback: 'Anticipate a steep rise.' },
          { text: 'Routine care; TSB at 24 h', correct: false, feedback: 'Far too late.' },
          { text: 'Immediate exchange', correct: false, feedback: 'Not yet indicated by TSB.' },
          { text: 'Early discharge with follow-up', correct: false, feedback: 'Unsafe.' },
        ],
        teaching: 'Thresholds are not computed before 12 h here, but severe isoimmune disease is treated pre-emptively.',
        refs: ['aap2022'],
      },
      {
        title: '30 hours',
        narrative: 'Despite intensive phototherapy, TSB 16.9 mg/dL at 30 h (from 12.4 at 18 h). Albumin 2.9 g/dL.',
        calc: {
          gaWeeks: 39,
          measurements: [
            { ageHours: 18, value: 12.4, method: 'TSB' },
            { ageHours: 30, value: 16.9, method: 'TSB' },
          ],
          rf: { isoimmune: true },
          albumin: 2.9,
          expectZone: 'escalation',
        },
        question: 'He has crossed the escalation-of-care threshold. What does that bundle include?',
        options: [
          {
            text: 'IVIG 0.5–1 g/kg over 2 h; TSB every 2 h; CBC, type & crossmatch, chemistry; prepare exchange; enteral feeds',
            correct: true,
            feedback: 'Escalation is a medical emergency.',
          },
          { text: 'Add a second phototherapy unit and recheck tomorrow', correct: false, feedback: 'Too passive.' },
          { text: 'Stop feeds and run IV fluids', correct: false, feedback: 'IV fluids only for dehydration.' },
          { text: 'Exchange immediately', correct: false, feedback: 'Not yet at the exchange threshold.' },
        ],
        teaching: 'IVIG evidence is low certainty (Cochrane); it is an adjunct, never a reason to delay an indicated exchange.',
        refs: ['aap2022', 'cochraneIvig2018'],
      },
      {
        title: '34 hours',
        narrative: 'Two hours after IVIG: 17.4 mg/dL. Four hours: 19.8 mg/dL.',
        calc: {
          gaWeeks: 39,
          measurements: [
            { ageHours: 32, value: 17.4, method: 'TSB' },
            { ageHours: 34, value: 19.8, method: 'TSB' },
          ],
          rf: { isoimmune: true },
          albumin: 2.9,
          expectZone: 'exchange',
        },
        question: 'Next step?',
        options: [
          { text: 'Urgent double-volume exchange transfusion (send G6PD/newborn screen first)', correct: true, feedback: 'At/above the exchange threshold.' },
          { text: 'Second IVIG dose and wait', correct: false, feedback: 'Not when the exchange threshold is reached.' },
          { text: 'Phototherapy alone', correct: false, feedback: 'Insufficient.' },
          { text: 'Albumin infusion instead', correct: false, feedback: 'Not an alternative.' },
        ],
        teaching: 'Expect TSB to fall ~50% and partially rebound; keep phototherapy running.',
        refs: ['aap2022'],
      },
      {
        title: 'Afterwards',
        narrative: 'TSB 10.2 after exchange, 12.5 at 6 h, then falling. Discharged day 7.',
        question: 'Which follow-up is essential?',
        options: [
          { text: 'Diagnostic ABR hearing test and weekly Hb for late anemia', correct: true, feedback: 'Exchange = JCIH hearing risk; Rh disease causes late hyporegenerative anemia.' },
          { text: 'OAE hearing screen only', correct: false, feedback: 'Misses auditory neuropathy.' },
          { text: 'No follow-up', correct: false, feedback: 'Never.' },
          { text: 'Repeat IVIG monthly', correct: false, feedback: 'No role.' },
        ],
        teaching: 'Neurodevelopmental follow-up is indicated after exchange-level bilirubin.',
        refs: ['jcih2019'],
      },
    ],
    takeaways: [
      'Escalation threshold = exchange − 2 mg/dL: emergency bundle + IVIG if isoimmune.',
      'Exchange at threshold or with ABE signs.',
      'ABR + late-anemia surveillance after severe isoimmune disease.',
    ],
  },
  {
    id: 'late-preterm',
    title: 'The 36-weeker going home',
    hook: 'Delta-to-threshold follow-up in a late-preterm infant.',
    level: 'Core',
    tags: ['Late preterm', 'TcB', 'Follow-up'],
    steps: [
      {
        title: 'Pre-discharge',
        narrative: '36 2/7-week girl, well, formula + breast milk. TcB 10.0 mg/dL at 30 h.',
        calc: { gaWeeks: 36, measurements: [{ ageHours: 30, value: 10.0, method: 'TcB' }], expectZone: 'below' },
        question: 'Next step?',
        options: [
          { text: 'Measure TSB — TcB is within 3 mg/dL of the threshold', correct: true, feedback: 'Threshold ≈12.1 mg/dL.' },
          { text: 'Discharge, follow-up in 3 days', correct: false, feedback: 'TcB too close to threshold.' },
          { text: 'Start phototherapy', correct: false, feedback: 'Below threshold.' },
          { text: 'Use the risk-factor curve because she is 36 weeks', correct: false, feedback: 'GA is built into the curve.' },
        ],
        teaching: 'Late-preterm infants peak later (day 5–7) and are over-represented in kernicterus registries.',
        refs: ['aap2022', 'johnson2009'],
      },
      {
        title: 'TSB',
        narrative: 'TSB 9.4 mg/dL at 30 h.',
        calc: { gaWeeks: 36, measurements: [{ ageHours: 30, value: 9.4, method: 'TSB' }], expectZone: 'below' },
        question: 'Follow-up?',
        options: [
          { text: 'TSB or TcB in 4–24 h', correct: true, feedback: '~2.7 mg/dL below → 2.0–3.4 band.' },
          { text: 'TSB or TcB in 1–2 days', correct: false, feedback: 'That is 3.5–5.4.' },
          { text: 'Follow-up within 3 days', correct: false, feedback: 'That is ≥7.' },
          { text: 'Phototherapy', correct: false, feedback: 'Below threshold.' },
        ],
        teaching: 'Discharge can still be safe if a measurement in 4–24 h is guaranteed; otherwise delay discharge.',
        refs: ['aap2022'],
      },
      {
        title: 'Recheck',
        narrative: 'TSB 11.4 mg/dL at 44 h.',
        calc: {
          gaWeeks: 36,
          measurements: [
            { ageHours: 30, value: 9.4, method: 'TSB' },
            { ageHours: 44, value: 11.4, method: 'TSB' },
          ],
          expectZone: 'below',
        },
        question: 'How do you read the trajectory?',
        options: [
          { text: '0.14 mg/dL/h — not suggestive of hemolysis; still 2.0–3.4 below → recheck in 4–24 h', correct: true, feedback: 'Correct on both counts.' },
          { text: 'Hemolysis — start phototherapy', correct: false, feedback: 'Rate is <0.2 mg/dL/h.' },
          { text: 'No more checks needed', correct: false, feedback: 'She has not peaked.' },
          { text: 'Exchange', correct: false, feedback: 'No.' },
        ],
        teaching: 'Compare the slope of the bilirubin with the slope of the threshold — if it is steeper, it will cross.',
        refs: ['aap2022'],
      },
    ],
    takeaways: ['GA <38 is handled by the GA curve.', 'TcB within 3 mg/dL → TSB.', 'Late-preterm infants need the tightest follow-up.'],
  },
  {
    id: 'abe',
    title: 'Arching on day 5',
    hook: 'Readmission with neurological signs.',
    level: 'Advanced',
    tags: ['ABE', 'BIND', 'Exchange', 'Hearing'],
    steps: [
      {
        title: 'Emergency department',
        narrative:
          '38 4/7-week boy discharged at 30 h without a bilirubin measurement. At 118 h: lethargic with a weak suck, intermittent arching and retrocollis when handled, high-pitched cry. TSB 24.1 mg/dL, direct 0.8, albumin 3.2.',
        question: 'BIND score? (mental status 2, tone 2, cry 1)',
        options: [
          { text: '5 — moderate ABE', correct: true, feedback: '4–6 = moderate, potentially reversible.' },
          { text: '2 — subtle ABE', correct: false, feedback: 'Miscounted.' },
          { text: '8 — advanced ABE', correct: false, feedback: 'Not yet.' },
          { text: 'BIND does not apply', correct: false, feedback: 'It is designed for this.' },
        ],
        teaching: 'BIND scores mental status, muscle tone and cry (0–3 each).',
        refs: ['bind'],
      },
      {
        title: 'Decision',
        narrative: 'His TSB is below the no-risk-factor exchange threshold for his age (27.0 mg/dL).',
        calc: {
          gaWeeks: 38,
          measurements: [{ ageHours: 118, value: 24.1, method: 'TSB' }],
          abeSigns: true,
          expectZone: 'below',
        },
        question: 'What now?',
        options: [
          { text: 'Urgent exchange transfusion, with intensive phototherapy while preparing', correct: true, feedback: 'ABE signs override the number.' },
          { text: 'Intensive phototherapy; recheck in 2 h', correct: false, feedback: 'Neurological signs mandate exchange.' },
          { text: 'IVIG', correct: false, feedback: 'Not isoimmune.' },
          { text: 'MRI first', correct: false, feedback: 'Never delay treatment for imaging.' },
        ],
        teaching: 'Moderate ABE can reverse with prompt exchange; advanced ABE often leaves kernicterus.',
        refs: ['aap2022'],
      },
      {
        title: 'Follow-up',
        narrative: 'After exchange he feeds well and tone normalizes.',
        question: 'Which test is mandatory before discharge?',
        options: [
          { text: 'Diagnostic ABR', correct: true, feedback: 'Auditory neuropathy is the most sensitive marker of bilirubin injury.' },
          { text: 'OAE only', correct: false, feedback: 'Misses auditory neuropathy.' },
          { text: 'EEG', correct: false, feedback: 'Only if seizures.' },
          { text: 'Nothing if feeding well', correct: false, feedback: 'Injury may be silent early.' },
        ],
        teaching: 'Arrange MRI (globus pallidus), neurology and developmental follow-up. Root cause: no pre-discharge measurement — the failure universal screening prevents.',
        refs: ['jcih2019', 'johnson2009'],
      },
    ],
    takeaways: ['ABE signs → exchange regardless of TSB.', 'BIND quantifies severity.', 'ABR, not OAE.', 'Kernicterus is a system failure.'],
  },
];

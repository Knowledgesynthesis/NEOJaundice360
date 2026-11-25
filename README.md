# NeoJaundice360

An interactive, evidence-based course and decision tool for newborn jaundice — from bilirubin physiology to the AAP 2022 thresholds, escalation of care, neurotoxicity, and biliary atresia.

**Live:** https://neo-jaundice360.vercel.app

## What’s inside

| Area | What you do there |
| --- | --- |
| **7 learning modules** | Physiology (interactive pathway + production/clearance simulator) · Causes (filterable explorer) · Evaluation (rate-of-rise calculator, hemolysis analyzer) · Thresholds & follow-up · Treatment (stop/rebound planner, home-phototherapy checker) · Neurotoxicity (BIND scorer) · Cholestasis (stool-color exercise, Kasai clock). Each ends with retrieval practice. |
| **Bilirubin calculator** | AAP 2022 thresholds by gestational week and neurotoxicity risk factors, escalation/exchange (≥35 wk), serial values with rate of rise, TcB→TSB rule, B/A ratio, distance-to-threshold follow-up, NICE CG98 comparison, preterm (<35 wk) table, mg/dL ↔ µmol/L, shareable links. |
| **8 clinical cases** | Step-by-step decisions; every number is computed live by the same engine as the calculator. |
| **56-question mastery bank** | Explanations with sources, per-topic mastery, “review missed” mode, randomized option order. |
| **Reference** | Printable quick-reference sheet, 45-term glossary, annotated source list. |

Works offline as a PWA, in light/dark themes, on phones and desktops.

## Evidence base

- AAP 2022 Clinical Practice Guideline (≥35 weeks) — thresholds, risk factors, escalation, follow-up, rebound, home phototherapy
- AAP 2025 Clinical Report — identifying biliary atresia by 2–4 weeks
- NASPGHAN/ESPGHAN 2017 — cholestasis = direct/conjugated bilirubin ≥1.0 mg/dL
- CPS 2025, NICE CG98 (2023 surveillance: unchanged), Maisels 2012 (<35 weeks), plus the key trials and cohorts (full list in the app under *Evidence & sources*).

### Threshold data policy

The calculator uses [AAP 2022 Supplemental Tables 1–4](https://aap2.silverchair-cdn.com/aap2/content_public/journal/pediatrics/150/3/10.1542_peds.2022-058859/5/peds_2022058859supplementarydata.pdf), transcribed into `src/lib/bili/aap2022-hourly.json`. Index 0 is blank in the source. Use completed hours 1–336 and the published late-age constant rows; do not extrapolate outside that range or assume a 96-hour plateau. GA <35 weeks uses a separate preterm reference, not an AAP treatment calculation. Discharge follow-up starts at 12 hours, not hour 1.

TcB is a screen and does not generate treatment-zone actions. Serum TSB with confirmed rise despite ongoing phototherapy selects Table 4 for exchange and escalation without moving the phototherapy threshold. Signs of intermediate/advanced acute bilirubin encephalopathy remain urgent regardless of whether a measurement is entered.

## Development

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # unit tests: guideline engine, invariants, fuzzing, content ↔ engine consistency
npm run lint
npm run build      # type-check + production build (dist/)
npm run preview
```

Requires Node ≥22.12. Stack: React 19, React Router 7, Vite 8, Tailwind CSS 4, Zustand 5, Vitest, vite-plugin-pwa.

```
src/
  lib/bili/        guideline engine (thresholds, follow-up, rate of rise, B/A, NICE, preterm) + tests
  data/            references, etiologies, questions, cases, glossary, modules (+ integrity tests)
  components/      calculator, SVG chart, quiz, layout, UI primitives
  pages/           one file per route
```

## Deployment

Vercel builds `main` automatically (`vercel.json` sets the Vite build, SPA rewrites and cache headers).

## Use

Built for learning. At the bedside, follow your local protocol and confirm thresholds with an official calculator.

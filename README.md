# NeoJaundice360

An interactive, evidence-based course and decision tool for newborn jaundice — from bilirubin physiology to the AAP 2022 thresholds, escalation of care, neurotoxicity, and biliary atresia.

**Live:** https://neo-jaundice360.vercel.app

## What’s inside

| Area | What you do there |
| --- | --- |
| **7 learning modules** | Physiology (interactive pathway + production/clearance simulator) · Causes (filterable explorer) · Evaluation (rate-of-rise calculator, hemolysis analyzer) · Thresholds & follow-up · Treatment (stop/rebound planner, home-phototherapy checker) · Neurotoxicity (BIND scorer) · Cholestasis (stool-color exercise, Kasai clock). Each ends with retrieval practice. |
| **Bilirubin calculator** | AAP 2022 thresholds by gestational week and neurotoxicity risk factors, escalation/exchange (≥38 wk), serial values with rate of rise, TcB→TSB rule, B/A ratio, distance-to-threshold follow-up, NICE CG98 comparison, preterm (<35 wk) table, mg/dL ↔ µmol/L, shareable links. |
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

Only verifiable values are embedded, and each one is labelled in the UI:

- **Published:** AAP 2022 phototherapy values at 24/48/72/96 h (35, 37, 38, 39, ≥40 wk without risk factors; 35 and ≥38 wk with risk factors) and the ≥38-wk exchange curve without risk factors, cross-checked across independent implementations.
- **Interpolated:** the 36-wk curves and the 36/37-wk risk-factor curves (between published rows); hours between anchors use a monotone spline.
- **Approximate (±0.5 mg/dL):** the ≥38-wk exchange curve with risk factors.
- **Not embedded:** 35–37-wk exchange/escalation curves and ages <12 h. The app points to BiliTool/PediTools rather than inventing them.

To embed the complete official hourly tables later, replace the curve objects in `src/lib/bili/aap2022.ts`; the tests in `src/lib/bili/bili.test.ts` and `src/data/content.test.ts` will flag any inconsistency with the cases and questions.

## Development

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # 67 unit tests: guideline engine, invariants, fuzzing, content ↔ engine consistency
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

# **NEOJaundice360 — OPTIMIZED MASTER PROMPT FOR EDUCATIONAL APP GENERATION**  
A clinically rigorous, evidence-based master prompt for generating a **mobile-first, offline-capable, dark-mode educational app** that teaches pediatrics residents *everything* they must know about newborn jaundice — from physiology to pathology, diagnosis, risk stratification, management, treatment thresholds, follow-up, and prognosis — with visual aids, tables, algorithms, and case-based reasoning.

---

# **MASTER PROMPT — NeoJaundice360 Educational App Generator (SPECIALIZED VERSION)**

## **Role & Mission**
You are a cross-functional team (PM + Staff Engineer + Senior Instructional Designer + Neonatology/Pediatric Hospitalist SME + Pediatric Hepatology SME + UX Writer + QA).  
Your mission: design an **interactive neonatology learning platform** that teaches:

**NeoJaundice360: Comprehensive Newborn Jaundice Education**  
—A systems-based, evidence-grounded environment that covers physiology → types of jaundice → risk factors → workup → treatment thresholds → complications → prognosis.

This app must:
- Support **all learner levels:** MS3 → MS4 → pediatric interns → residents → neonatal fellows → general pediatric attendings  
- Follow **AAP 2022+ hyperbilirubinemia guidelines** and other evidence-based standards  
- Use **synthetic examples only**, never real patient data  
- Present information with **tables, diagrams, timelines, ladders, bilirubin curves, case scenarios, and flowcharts**  
- Be **mobile-first, offline-ready, dark-mode optimized**  
- Avoid contradictory physiologic or guideline logic  

---

## **Inputs (Fill These)**
- **Primary Topic(s):**  
  Always centered on **newborn jaundice**, including:  
  - Bilirubin metabolism (production → transport → conjugation → excretion)  
  - Physiologic jaundice  
  - Pathologic jaundice  
  - Breast milk vs breastfeeding failure jaundice  
  - Hemolytic causes (ABO, Rh incompatibility, G6PD, spherocytosis)  
  - Non-hemolytic causes  
  - Cholestatic jaundice (biliary atresia, neonatal hepatitis)  
  - Jaundice within first 24 hours vs later  
  - Conjugated vs unconjugated hyperbilirubinemia  
  - Risk factors (prematurity, bruising, ethnicity, cephalohematoma)  
  - Bilirubin nomograms & risk zones  
  - AAP phototherapy thresholds  
  - IVIG, exchange transfusion indications  
  - Kernicterus & BIND spectrum  
  - Follow-up, prognosis, and counseling  

- **Target Learner Levels:** {{LEVELS}}  
- **Learner Context:** {{CONTEXT}}  
- **Learning Outcomes (SMART + Bloom):** {{LEARNING_OBJECTIVES}}  
  - e.g., “Differentiate physiologic vs pathologic jaundice; interpret bilirubin nomograms; choose correct treatment; identify red flags for cholestasis”
- **Constraints/Preferences:**  
  Always include:  
  - *Mobile-first; dark mode; offline-ready; evidence-based; guideline-consistent*  
- **References/Standards:** {{REFERENCES}}  
  - e.g., “AAP 2022 Hyperbilirubinemia Guideline, Nelson’s Pediatrics, NeoReviews”
- **Brand/Voice:** {{VOICE_TONE}}  
  - e.g., “High-yield, diagram-heavy, clinically rigorous, friendly for stressed residents”
- **Localization:** {{LOCALE}}

---

# **Required Deliverables (Produce All)**

---

## **1. Executive Summary**
- Explain the complexity of newborn jaundice for trainees.  
- Introduce NeoJaundice360 as a **visual-first mastery platform**.  
- Provide 2–3 name alternatives + value proposition.

---

## **2. Learner Personas & Use Cases**
Examples:
- Pediatric resident triaging jaundice in nursery  
- Neonatal fellow evaluating hemolytic anemia  
- General pediatrician distinguishing biliary atresia from benign jaundice  
- Use cases: exam prep, board prep, nursery call shifts, emergency consults.

---

## **3. Curriculum Map & Knowledge Graph**
Should connect:
**Neonatal physiology ↔ Bilirubin metabolism ↔ Etiology classification ↔ Diagnostic approach ↔ Management pathways ↔ Prognosis**

### **Prerequisites**
- Normal neonatal liver physiology  
- Bilirubin production & transport  
- Hematologic basics  

### **Modules**
1. **Bilirubin Physiology & Metabolism**  
   - Breakdown of Hb → biliverdin → bilirubin  
   - Conjugation pathways  
   - Enterohepatic circulation in newborns  

2. **Types of Neonatal Jaundice**  
   - *Unconjugated*  
     - Physiologic  
     - Breastfeeding failure jaundice  
     - Breast milk jaundice  
     - Hemolytic (ABO, Rh, G6PD, hereditary spherocytosis)  
     - Infection  
     - Cephalohematoma/bruising  
   - *Conjugated*  
     - Biliary atresia  
     - Neonatal hepatitis  
     - Metabolic/Endocrine causes  

3. **Pathologic vs Physiologic Jaundice**  
   - Time of onset  
   - Rate of rise  
   - Bilirubin fractions  
   - Clinical red flags  

4. **Diagnostic Approach**  
   - TcB vs TSB  
   - Conjugated % thresholds  
   - Coombs testing, CBC, retic count  
   - G6PD, blood type, LFTs  
   - Stool color, acholic flags  
   - When to refer to GI  

5. **Nomograms & Risk Stratification**  
   - Bhutani nomogram  
   - AAP phototherapy thresholds  
   - Gestational age adjustments  
   - Neurotoxicity risk factors  

6. **Management Pathways**  
   - Phototherapy  
   - IVIG  
   - Exchange transfusion  
   - Hydration and feeding optimization  
   - Management of cholestasis conditions  

7. **Complications & Prognosis**  
   - BIND spectrum  
   - Kernicterus prevention  
   - Long-term outcomes  

8. **Integrated Case Engine**  
   - “Baby with bilirubin X at Y hours—next step?”  
   - Hemolytic vs non-hemolytic flows  

Each module: micro-concepts, Bloom levels, prerequisites.

---

## **4. Interactives (NeoJaundice360–Specific)**

### **Examples**
- **Bilirubin Metabolism Flow Diagram** (visual, stepwise)  
- **Types of Jaundice Table Generator**  
  - Columns: Onset | Total/Direct | Etiology | Key Clues | Workup | Treatment  
- **Nomogram Explorer**  
  - Age slider → bilirubin level → risk zone  
- **Phototherapy Threshold Simulator**  
  - GA, bilirubin, risk factors → show threshold line  
- **Hemolysis Decision Tree**  
  - Coombs positive? retic high? MCHC?  
- **Cholestasis Early Detection Engine**  
  - Red flag triggers → “urgent evaluation” pathway  
- **Case-Based Reasoning Modules**  
  - Stepwise: “What’s your next test? your next intervention?”  

For each interactive:
- purpose  
- inputs/controls  
- outputs  
- visual metaphors  
- preset cases  
- guardrails: guideline-accurate, safe, educational-only.

---

## **5. Assessment & Mastery**
Include:
- MCQs  
- Tables: fill-in distinguishing features  
- Case vignettes  
- Visual interpretation (nomogram, curves)  
- Step-ordering questions  
- Red flag identification  
Provide **10–20 items** with rationales.

---

## **6. Clinical Reasoning Framework**
Teach systematic thinking:
1. Assess age & timing of jaundice  
2. Determine conjugation status  
3. Rule out pathologic causes early  
4. Check hemolysis labs  
5. Plot on nomogram  
6. Evaluate neurotoxicity risk  
7. Select appropriate treatment threshold  
8. Consider cholestasis if direct high  
9. Counsel parents  
10. Establish follow-up & prevention  

Pitfalls:
- Misinterpreting early-onset jaundice  
- Confusing breastmilk vs breastfeeding failure  
- Missing conjugated jaundice  
- Delayed detection of biliary atresia  
- Incorrect threshold application  

---

## **7. Accessibility & Safety**
- WCAG 2.2 AA  
- Synthetic data only  
- No real newborn images; stylized diagrams only  
- Guideline-aligned safety rules  
- Clear disclaimers  
- No medical advice; educational only  

---

## **8. Tech Architecture (Mobile-First, Offline)**
- React/TypeScript  
- Tailwind + shadcn/ui  
- Recharts/D3 for nomograms  
- IndexedDB + Service Worker for offline functionality  
- State management (Zustand/Redux)  
- Diagram engines (SVG)  

---

## **9. Data Schemas (JSON)**
Schemas for:
- bilirubin curves  
- types of jaundice  
- lab panels  
- phototherapy thresholds  
- case vignettes  
- glossary terms  
Include examples.

---

## **10. Screen Specs & Text Wireframes**
Screens:
- Home  
- Physiology Explorer  
- Types of Jaundice Table  
- Nomogram Lab  
- Hemolysis Analyzer  
- Cholestasis Module  
- Phototherapy Calculator  
- Case Engine  
- Assessment Hub  
- Glossary  
- Settings  

Provide text wireframes.

---

## **11. Copy & Content Kit**
Include:
- Microcopy (“Direct >1 mg/dL or >20% of total = concerning after 2 weeks”)  
- Diagram labels  
- Tables summarizing jaundice etiologies  
- Two full lessons + one integrated case  

---

## **12. Analytics & A/B Plan**
UI-only:
- Nomogram display modes  
- Threshold slider styles  
- Table layout variations  

---

## **13. QA Checklist**
- AAP guideline adherence  
- Bilirubin math validated  
- Conjugated thresholds accurate  
- No contradictory physiologic logic  
- No clinically unsafe recommendations  

---

## **14. Roadmap**
Prototype → Pilot → Hemolytic Deep Dive → Cholestasis Expansion → Personalized Mastery Pathways  
Include milestones, risks, acceptance criteria.

---

# **Style & Rigor Requirements**
- High-yield, resident-friendly, diagram-heavy  
- Evidence-based (AAP, UpToDate-like coherence)  
- No contradictions  
- Anatomically & physiologically accurate  
- Pathoma-like clarity but neonatology-grade rigor  

---

# **Acceptance Criteria**
- Learners correctly diagnose & manage newborn jaundice across etiologies  
- All materials evidence-based & guideline-accurate  
- No contradictions across modules  
- App reinforces a unified **NeoJaundice360 Systems Map**

---

# **Now Generate**
Using the inputs above, produce all deliverables in the required order.  
If any input is missing, make neonatology-sound assumptions and label them as defaults.

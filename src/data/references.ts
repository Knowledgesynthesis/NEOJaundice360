export interface Reference {
  id: string;
  short: string;
  citation: string;
  url?: string;
  kind: 'guideline' | 'trial' | 'cohort' | 'review' | 'tool' | 'basic';
  /** Why it matters / how it is used in this app. */
  use: string;
}

export const REFERENCES: Reference[] = [
  {
    id: 'aap2022',
    short: 'AAP 2022',
    kind: 'guideline',
    citation:
      'Kemper AR, Newman TB, Slaughter JL, et al. Clinical Practice Guideline Revision: Management of Hyperbilirubinemia in the Newborn Infant 35 or More Weeks of Gestation. Pediatrics. 2022;150(3):e2022058859.',
    url: 'https://doi.org/10.1542/peds.2022-058859',
    use: 'Primary source for ≥35-week thresholds, neurotoxicity risk factors, escalation of care, follow-up, rebound, home phototherapy, G6PD testing.',
  },
  {
    id: 'harpavat2025',
    short: 'AAP 2025 BA report',
    kind: 'guideline',
    citation:
      'Harpavat S, et al. Guidance for the Primary Care Provider in Identifying Infants With Biliary Atresia by 2–4 Weeks of Life: Clinical Report. Pediatrics. 2025;155(3):e2024070077.',
    url: 'https://doi.org/10.1542/peds.2024-070077',
    use: '“Eyes, stool, first bilirubin” at the 2–4-week visit; DB/CB ≥1 mg/dL → urgent pediatric GI; Kasai best before 30–45 days.',
  },
  {
    id: 'cps2025',
    short: 'CPS 2025',
    kind: 'guideline',
    citation:
      'Canadian Paediatric Society. Guidelines for detection and management of hyperbilirubinemia in term and late preterm newborns (≥35 weeks gestational age). Paediatr Child Health. 2025.',
    url: 'https://doi.org/10.1093/pch/pxaf034',
    use: 'Replaced CPS 2007; ΔTSB-based approach; stop phototherapy >30 µmol/L (≥38 wk) or >60 µmol/L (35–37 wk) below threshold.',
  },
  {
    id: 'nice2010',
    short: 'NICE CG98',
    kind: 'guideline',
    citation:
      'National Institute for Health and Care Excellence. Jaundice in newborn babies under 28 days (CG98). 2010, updated 2016; 2023 exceptional surveillance: no update.',
    url: 'https://www.nice.org.uk/guidance/cg98',
    use: 'UK threshold table (µmol/L) for ≥38 weeks; prolonged jaundice = >14 days term / >21 days preterm.',
  },
  {
    id: 'fawaz2017',
    short: 'NASPGHAN/ESPGHAN 2017',
    kind: 'guideline',
    citation:
      'Fawaz R, Baumann U, Ekong U, et al. Guideline for the Evaluation of Cholestatic Jaundice in Infants: Joint Recommendations of NASPGHAN and ESPGHAN. J Pediatr Gastroenterol Nutr. 2017;64(1):154–168.',
    url: 'https://doi.org/10.1097/MPG.0000000000001334',
    use: 'Direct/conjugated bilirubin >1.0 mg/dL is abnormal regardless of TSB (retired the old “20% of total” rule); cholestasis work-up.',
  },
  {
    id: 'maisels2012',
    short: 'Maisels 2012',
    kind: 'review',
    citation:
      'Maisels MJ, Watchko JF, Bhutani VK, Stevenson DK. An approach to the management of hyperbilirubinemia in the preterm infant less than 35 weeks of gestation. J Perinatol. 2012;32(9):660–664.',
    url: 'https://doi.org/10.1038/jp.2012.71',
    use: 'Consensus TSB ranges for phototherapy/exchange in infants <35 weeks (by postmenstrual age).',
  },
  {
    id: 'kuzniewicz2021',
    short: 'Kuzniewicz 2021',
    kind: 'cohort',
    citation:
      'Kuzniewicz MW, Park J, Niki H, Walsh EM, McCulloch CE, Newman TB. Predicting the Need for Phototherapy After Discharge. Pediatrics. 2021;147(5):e2020019778.',
    url: 'https://doi.org/10.1542/peds.2020-019778',
    use: 'Distance between pre-discharge TSB/TcB and the phototherapy threshold predicts post-discharge phototherapy — basis of the AAP 2022 follow-up algorithm.',
  },
  {
    id: 'bhutani1999',
    short: 'Bhutani 1999',
    kind: 'cohort',
    citation:
      'Bhutani VK, Johnson L, Sivieri EM. Predictive ability of a predischarge hour-specific serum bilirubin for subsequent significant hyperbilirubinemia in healthy term and near-term newborns. Pediatrics. 1999;103(1):6–14.',
    url: 'https://doi.org/10.1542/peds.103.1.6',
    use: 'Origin of hour-specific bilirubin percentiles (risk zones). Historical: no longer used for AAP decisions.',
  },
  {
    id: 'aap2004',
    short: 'AAP 2004',
    kind: 'guideline',
    citation:
      'American Academy of Pediatrics Subcommittee on Hyperbilirubinemia. Management of hyperbilirubinemia in the newborn infant 35 or more weeks of gestation. Pediatrics. 2004;114(1):297–316.',
    url: 'https://doi.org/10.1542/peds.114.1.297',
    use: 'Superseded. Shown only to explain what changed (low/medium/high-risk curves, Bhutani zones).',
  },
  {
    id: 'aap2011photo',
    short: 'AAP 2011 phototherapy',
    kind: 'guideline',
    citation:
      'Bhutani VK; Committee on Fetus and Newborn. Phototherapy to prevent severe neonatal hyperbilirubinemia in the newborn infant 35 or more weeks of gestation. Pediatrics. 2011;128(4):e1046–e1052.',
    url: 'https://doi.org/10.1542/peds.2011-1494',
    use: 'Phototherapy dose: spectrum (460–490 nm), irradiance, surface area, expected response.',
  },
  {
    id: 'maisels2008',
    short: 'Maisels & McDonagh 2008',
    kind: 'review',
    citation: 'Maisels MJ, McDonagh AF. Phototherapy for neonatal jaundice. N Engl J Med. 2008;358(9):920–928.',
    url: 'https://doi.org/10.1056/NEJMct0708376',
    use: 'Photochemistry: configurational (4Z,15E) and structural (lumirubin) isomers; why lumirubin drives elimination.',
  },
  {
    id: 'watchko2013',
    short: 'Watchko & Tiribelli 2013',
    kind: 'review',
    citation:
      'Watchko JF, Tiribelli C. Bilirubin-induced neurologic damage — mechanisms and management approaches. N Engl J Med. 2013;369(21):2021–2030.',
    url: 'https://doi.org/10.1056/NEJMra1308124',
    use: 'Unbound bilirubin, blood–brain barrier, regional vulnerability (globus pallidus, brainstem auditory nuclei).',
  },
  {
    id: 'kawade1981',
    short: 'Kawade & Onishi 1981',
    kind: 'basic',
    citation:
      'Kawade N, Onishi S. The prenatal and postnatal development of UDP-glucuronyltransferase activity towards bilirubin and the effect of premature birth on this activity in the human liver. Biochem J. 1981;196(1):257–260.',
    url: 'https://doi.org/10.1042/bj1960257',
    use: 'Hepatic UGT1A1 activity ≈1% of adult at term; reaches adult levels by ~14 weeks.',
  },
  {
    id: 'kaplan1997',
    short: 'Kaplan 1997',
    kind: 'cohort',
    citation:
      'Kaplan M, Renbaum P, Levy-Lahad E, et al. Gilbert syndrome and glucose-6-phosphate dehydrogenase deficiency: a dose-dependent genetic interaction crucial to neonatal hyperbilirubinemia. Proc Natl Acad Sci USA. 1997;94(22):12128–12132.',
    url: 'https://doi.org/10.1073/pnas.94.22.12128',
    use: 'G6PD deficiency + UGT1A1*28 (Gilbert) multiplies hyperbilirubinemia risk — conjugation, not only hemolysis.',
  },
  {
    id: 'christensen2010',
    short: 'Christensen 2010',
    kind: 'cohort',
    citation:
      'Christensen RD, Henry E. Hereditary spherocytosis in neonates with hyperbilirubinemia. Pediatrics. 2010;125(1):120–125.',
    url: 'https://doi.org/10.1542/peds.2009-0864',
    use: 'MCHC >36 g/dL: ~82% sensitive, ~98% specific for neonatal HS.',
  },
  {
    id: 'christensen2015',
    short: 'Christensen 2015',
    kind: 'review',
    citation:
      'Christensen RD, Yaish HM, Gallagher PG. A pediatrician’s practical guide to diagnosing and treating hereditary spherocytosis in neonates. Pediatrics. 2015;135(6):1107–1114.',
    url: 'https://doi.org/10.1542/peds.2014-3516',
    use: 'Neonatal HS index (MCHC/MCV >0.36: ~97% sensitive, >99% specific); EMA binding for diagnosis.',
  },
  {
    id: 'johnson2009',
    short: 'Kernicterus Registry 2009',
    kind: 'cohort',
    citation:
      'Johnson L, Bhutani VK, Karp K, Sivieri EM, Shapiro SM. Clinical report from the pilot USA Kernicterus Registry (1992 to 2004). J Perinatol. 2009;29(Suppl 1):S25–S45.',
    url: 'https://doi.org/10.1038/jp.2008.211',
    use: 'Kernicterus occurs mostly in “healthy” term/late-preterm infants discharged early; G6PD deficiency over-represented.',
  },
  {
    id: 'cochraneIvig2018',
    short: 'Cochrane IVIG 2018',
    kind: 'review',
    citation:
      'Zwiers C, Scheffer-Rath MEA, Lopriore E, de Haas M, Liley HG. Immunoglobulin for alloimmune hemolytic disease in neonates. Cochrane Database Syst Rev. 2018;3:CD003313.',
    url: 'https://doi.org/10.1002/14651858.CD003313.pub2',
    use: 'Trials at low risk of bias show no reduction in exchange transfusion with IVIG — evidence is low certainty.',
  },
  {
    id: 'lepichon2017',
    short: 'Le Pichon 2017 (KSD)',
    kind: 'review',
    citation:
      'Le Pichon JB, Riordan SM, Watchko J, Shapiro SM. The neurological sequelae of neonatal hyperbilirubinemia: definitions, diagnosis and treatment of the kernicterus spectrum disorders (KSDs). Curr Pediatr Rev. 2017;13(3):199–209.',
    url: 'https://pubmed.ncbi.nlm.nih.gov/?term=Le+Pichon+kernicterus+spectrum+disorders+2017',
    use: 'Kernicterus spectrum disorder: motor-, auditory-predominant, classic, subtle.',
  },
  {
    id: 'bind',
    short: 'BIND score',
    kind: 'cohort',
    citation:
      'Johnson L, Brown AK, Bhutani VK. BIND — a clinical score for bilirubin induced neurologic dysfunction in newborns. Pediatrics. 1999;104(3 Suppl):746–747; Radmacher PG, et al. A modified Bilirubin-induced neurologic dysfunction (BIND-M) algorithm is useful in evaluating severity of jaundice in a resource-limited setting. BMC Pediatr. 2015;15:28.',
    url: 'https://pubmed.ncbi.nlm.nih.gov/?term=Radmacher+BIND-M+2015',
    use: 'Bedside staging of acute bilirubin encephalopathy (mental status, tone, cry).',
  },
  {
    id: 'jcih2019',
    short: 'JCIH 2019',
    kind: 'guideline',
    citation:
      'Joint Committee on Infant Hearing. Year 2019 Position Statement: Principles and Guidelines for Early Hearing Detection and Intervention Programs. J Early Hear Detect Interv. 2019;4(2):1–44.',
    url: 'https://doi.org/10.15142/fptk-b748',
    use: 'Hyperbilirubinemia requiring exchange transfusion is a hearing risk indicator; ABR (not OAE alone) detects auditory neuropathy.',
  },
  {
    id: 'abm22',
    short: 'ABM Protocol #22',
    kind: 'guideline',
    citation:
      'Flaherman VJ, Maisels MJ; Academy of Breastfeeding Medicine. ABM Clinical Protocol #22: Guidelines for Management of Jaundice in the Breastfeeding Infant 35 Weeks or More of Gestation — Revised 2017. Breastfeed Med. 2017;12(5):250–257.',
    url: 'https://doi.org/10.1089/bfm.2017.29042.vjf',
    use: '“Suboptimal intake jaundice” vs “breast milk jaundice”; continue breastfeeding; supplement with expressed/donor milk or formula when indicated.',
  },
  {
    id: 'flaherman2015',
    short: 'NEWT 2015',
    kind: 'cohort',
    citation:
      'Flaherman VJ, Schaefer EW, Kuzniewicz MW, Li SX, Walsh EM, Paul IM. Early weight loss nomograms for exclusively breastfed newborns. Pediatrics. 2015;135(1):e16–e23.',
    url: 'https://doi.org/10.1542/peds.2014-1532',
    use: 'Hour-specific weight-loss percentiles (newbornweight.org) — judge intake objectively.',
  },
  {
    id: 'harpavat2020',
    short: 'Harpavat 2020',
    kind: 'cohort',
    citation:
      'Harpavat S, Garcia-Prats JA, Anaya C, et al. Diagnostic Yield of Newborn Screening for Biliary Atresia Using Direct or Conjugated Bilirubin Measurements. JAMA. 2020;323(12):1141–1150.',
    url: 'https://doi.org/10.1001/jama.2020.0837',
    use: 'Newborn DB/CB screening (first days of life) detects biliary atresia with very high sensitivity.',
  },
  {
    id: 'basr2024',
    short: 'BA screening meta-analysis 2024',
    kind: 'review',
    citation:
      'Population-based screening strategies for biliary atresia in the newborn: a systematic review and meta-analysis. PLoS One. 2024.',
    url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC11357077/',
    use: 'Newborn DB/CB measurement had the best accuracy; stool color cards also perform well.',
  },
  {
    id: 'hsiao2008',
    short: 'Hsiao 2008 (Taiwan)',
    kind: 'cohort',
    citation:
      'Hsiao CH, Chang MH, Chen HL, et al. Universal screening for biliary atresia using an infant stool color card in Taiwan. Hepatology. 2008;47(4):1233–1240.',
    url: 'https://doi.org/10.1002/hep.22182',
    use: 'National stool-color-card programme increased timely Kasai and improved outcomes.',
  },
  {
    id: 'bezerra2014',
    short: 'START trial 2014',
    kind: 'trial',
    citation:
      'Bezerra JA, Spino C, Magee JC, et al. Use of corticosteroids after hepatoportoenterostomy for bile drainage in infants with biliary atresia: the START randomized clinical trial. JAMA. 2014;311(17):1750–1759.',
    url: 'https://doi.org/10.1001/jama.2014.2623',
    use: 'High-dose steroids after Kasai did not significantly improve bile drainage at 6 months.',
  },
  {
    id: 'lertudomphonwanit2017',
    short: 'MMP-7 2017',
    kind: 'basic',
    citation:
      'Lertudomphonwanit C, Mourya R, Fei L, et al. Large-scale proteomics identifies MMP-7 as a sentinel of epithelial injury and of biliary atresia. Sci Transl Med. 2017;9(417):eaan8462.',
    url: 'https://doi.org/10.1126/scitranslmed.aan8462',
    use: 'Serum MMP-7 is an emerging, highly accurate biomarker for biliary atresia where available.',
  },
  {
    id: 'newman2016',
    short: 'Phototherapy & cancer cohorts',
    kind: 'cohort',
    citation:
      'Newman TB, Wickremasinghe AC, Walsh EM, et al. Retrospective cohort study of phototherapy and childhood cancer in Northern California. Pediatrics. 2016;137(6):e20151354; Wickremasinghe AC, et al. Neonatal phototherapy and infantile cancer. Pediatrics. 2016;137(6):e20151353; Auger N, et al. Neonatal phototherapy and future risk of childhood cancer. Int J Cancer. 2019;145(8):2061–2069.',
    url: 'https://doi.org/10.1542/peds.2015-1354',
    use: 'Small associations with later childhood cancer (e.g., myeloid leukemia) — causality unproven; part of the rationale for higher 2022 thresholds.',
  },
  {
    id: 'newman2018',
    short: 'Newman 2018 (seizures)',
    kind: 'cohort',
    citation: 'Newman TB, Wu YW, Kuzniewicz MW, et al. Childhood seizures after phototherapy. Pediatrics. 2018;142(4):e20180648.',
    url: 'https://doi.org/10.1542/peds.2018-0648',
    use: 'Small association of phototherapy with later epilepsy (mainly boys).',
  },
  {
    id: 'bilitool',
    short: 'BiliTool / PediTools',
    kind: 'tool',
    citation:
      'BiliTool (bilitool.org) and PediTools Bilirubin (peditools.org/bili) — calculators implementing the full AAP 2022 hourly tables.',
    url: 'https://bilitool.org',
    use: 'Use for patient care and for curves this app does not embed (35–37-week exchange/escalation).',
  },
];

export const REF_BY_ID: Record<string, Reference> = Object.fromEntries(REFERENCES.map((r) => [r.id, r]));

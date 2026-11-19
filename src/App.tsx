import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';

const PhysiologyPage = lazy(() => import('./pages/PhysiologyPage'));
const CausesPage = lazy(() => import('./pages/CausesPage'));
const EvaluationPage = lazy(() => import('./pages/EvaluationPage'));
const ThresholdsPage = lazy(() => import('./pages/ThresholdsPage'));
const CalculatorPage = lazy(() => import('./pages/CalculatorPage'));
const TreatmentPage = lazy(() => import('./pages/TreatmentPage'));
const NeurotoxicityPage = lazy(() => import('./pages/NeurotoxicityPage'));
const CholestasisPage = lazy(() => import('./pages/CholestasisPage'));
const CasesPage = lazy(() => import('./pages/CasesPage'));
const AssessmentPage = lazy(() => import('./pages/AssessmentPage'));
const GlossaryPage = lazy(() => import('./pages/GlossaryPage'));
const ReferencesPage = lazy(() => import('./pages/ReferencesPage'));
const QuickReferencePage = lazy(() => import('./pages/QuickReferencePage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

export default function App() {
  return (
    <Layout>
      <Suspense fallback={<div className="py-20 text-center text-sm text-muted">Loading…</div>}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/physiology" element={<PhysiologyPage />} />
          <Route path="/causes" element={<CausesPage />} />
          <Route path="/evaluation" element={<EvaluationPage />} />
          <Route path="/thresholds" element={<ThresholdsPage />} />
          <Route path="/calculator" element={<CalculatorPage />} />
          <Route path="/treatment" element={<TreatmentPage />} />
          <Route path="/neurotoxicity" element={<NeurotoxicityPage />} />
          <Route path="/cholestasis" element={<CholestasisPage />} />
          <Route path="/cases" element={<CasesPage />} />
          <Route path="/cases/:caseId" element={<CasesPage />} />
          <Route path="/assessment" element={<AssessmentPage />} />
          <Route path="/glossary" element={<GlossaryPage />} />
          <Route path="/references" element={<ReferencesPage />} />
          <Route path="/quick-reference" element={<QuickReferencePage />} />
          {/* legacy routes from v1 */}
          <Route path="/types" element={<CausesPage />} />
          <Route path="/diagnosis" element={<EvaluationPage />} />
          <Route path="/nomogram" element={<ThresholdsPage />} />
          <Route path="/phototherapy" element={<TreatmentPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </Layout>
  );
}

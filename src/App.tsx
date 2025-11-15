import { Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { useAppStore } from './stores/appStore';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import PhysiologyPage from './pages/PhysiologyPage';
import TypesPage from './pages/TypesPage';
import DiagnosisPage from './pages/DiagnosisPage';
import NomogramPage from './pages/NomogramPage';
import PhototherapyPage from './pages/PhototherapyPage';
import CasesPage from './pages/CasesPage';
import AssessmentPage from './pages/AssessmentPage';
import GlossaryPage from './pages/GlossaryPage';

function App() {
  const darkMode = useAppStore((state) => state.darkMode);

  useEffect(() => {
    // Initialize dark mode
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/physiology" element={<PhysiologyPage />} />
        <Route path="/types" element={<TypesPage />} />
        <Route path="/diagnosis" element={<DiagnosisPage />} />
        <Route path="/nomogram" element={<NomogramPage />} />
        <Route path="/phototherapy" element={<PhototherapyPage />} />
        <Route path="/cases" element={<CasesPage />} />
        <Route path="/assessment" element={<AssessmentPage />} />
        <Route path="/glossary" element={<GlossaryPage />} />
      </Routes>
    </Layout>
  );
}

export default App;

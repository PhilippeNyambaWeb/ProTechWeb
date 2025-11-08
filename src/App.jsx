
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from '@/pages/HomePage';
import PrivacyPage from '@/pages/PrivacyPage';
import TermsPage from '@/pages/TermsPage';
import LegalPage from '@/pages/LegalPage';
import { Toaster } from '@/components/ui/toaster';
import { ScrollProvider } from '@/contexts/ScrollContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import AnimatedBackground from '@/components/AnimatedBackground';

function App() {
  return (
    <LanguageProvider>
      <ScrollProvider>
        <AnimatedBackground />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/legal" element={<LegalPage />} />
        </Routes>
        <Toaster />
      </ScrollProvider>
    </LanguageProvider>
  );
}

export default App;

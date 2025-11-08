
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from '@/pages/HomePage';
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
        </Routes>
        <Toaster />
      </ScrollProvider>
    </LanguageProvider>
  );
}

export default App;

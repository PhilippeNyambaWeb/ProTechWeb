
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from '@/pages/HomePage';
import { Toaster } from '@/components/ui/toaster';
import { ScrollProvider } from '@/contexts/ScrollContext';
import AnimatedBackground from '@/components/AnimatedBackground';

function App() {
  return (
    <ScrollProvider>
      <AnimatedBackground />
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
      <Toaster />
    </ScrollProvider>
  );
}

export default App;

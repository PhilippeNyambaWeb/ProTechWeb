import React, { createContext, useContext, useState, useCallback } from 'react';

const ScrollContext = createContext();

export const useScroll = () => {
  const context = useContext(ScrollContext);
  if (!context) {
    throw new Error('useScroll must be used within ScrollProvider');
  }
  return context;
};

export const ScrollProvider = ({ children }) => {
  const [activeSection, setActiveSection] = useState('home');
  const [formPrefill, setFormPrefill] = useState({
    inquiryType: '',
    subject: '',
    message: ''
  });

  const scrollToSection = useCallback((sectionId, prefillData = null) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });

      if (prefillData) {
        setTimeout(() => {
          setFormPrefill(prefillData);
        }, 800);
      }
    }
  }, []);

  const prefillContactForm = useCallback((data) => {
    setFormPrefill(data);
    scrollToSection('contact');
  }, [scrollToSection]);

  const clearFormPrefill = useCallback(() => {
    setFormPrefill({
      inquiryType: '',
      subject: '',
      message: ''
    });
  }, []);

  const value = {
    activeSection,
    setActiveSection,
    scrollToSection,
    formPrefill,
    prefillContactForm,
    clearFormPrefill
  };

  return (
    <ScrollContext.Provider value={value}>
      {children}
    </ScrollContext.Provider>
  );
};

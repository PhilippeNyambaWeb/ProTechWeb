import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslations } from '@/lib/translations';
import { motion } from 'framer-motion';

const CallToAction = () => {
  const { language } = useLanguage();
  const t = useTranslations(language);
  return (
    <motion.p
      className='text-md text-white max-w-lg mx-auto'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.8 }}
    >
      Let's turn your ideas into reality.
    </motion.p>
  );
};

export default CallToAction;
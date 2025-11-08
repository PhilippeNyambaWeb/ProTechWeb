import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { GlassCard } from '@/components/ui/glass-card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AnimatedBackground from '@/components/AnimatedBackground';

const TermsPage = () => {
  const { language } = useLanguage();

  const content = {
    fr: {
      title: 'Conditions d\'utilisation',
      lastUpdated: 'Dernière mise à jour: Novembre 2025',
      sections: [
        {
          title: '1. Acceptation des conditions',
          content: 'En accédant et en utilisant ce site web, vous acceptez d\'être lié par ces conditions d\'utilisation et toutes les lois et règlements applicables.'
        },
        {
          title: '2. Licence d\'utilisation',
          content: 'Nous vous accordons une licence limitée, non exclusive et non transférable pour accéder et utiliser notre site web à des fins personnelles et non commerciales.'
        },
        {
          title: '3. Propriété intellectuelle',
          content: 'Tout le contenu de ce site, y compris les textes, graphiques, logos, images et logiciels, est la propriété de ProTechWeb et est protégé par les lois sur le droit d\'auteur.'
        },
        {
          title: '4. Restrictions d\'utilisation',
          content: 'Vous ne pouvez pas modifier, copier, distribuer, transmettre, afficher, reproduire, publier ou créer des œuvres dérivées de notre contenu sans notre autorisation écrite préalable.'
        },
        {
          title: '5. Limitation de responsabilité',
          content: 'ProTechWeb ne sera pas responsable des dommages indirects, accessoires ou consécutifs résultant de l\'utilisation ou de l\'impossibilité d\'utiliser notre site web.'
        },
        {
          title: '6. Modifications',
          content: 'Nous nous réservons le droit de modifier ces conditions à tout moment. Les modifications entreront en vigueur dès leur publication sur ce site.'
        }
      ]
    },
    en: {
      title: 'Terms of Service',
      lastUpdated: 'Last updated: November 2025',
      sections: [
        {
          title: '1. Acceptance of Terms',
          content: 'By accessing and using this website, you agree to be bound by these terms of service and all applicable laws and regulations.'
        },
        {
          title: '2. Use License',
          content: 'We grant you a limited, non-exclusive, and non-transferable license to access and use our website for personal and non-commercial purposes.'
        },
        {
          title: '3. Intellectual Property',
          content: 'All content on this site, including text, graphics, logos, images, and software, is the property of ProTechWeb and is protected by copyright laws.'
        },
        {
          title: '4. Usage Restrictions',
          content: 'You may not modify, copy, distribute, transmit, display, reproduce, publish, or create derivative works from our content without our prior written permission.'
        },
        {
          title: '5. Limitation of Liability',
          content: 'ProTechWeb shall not be liable for any indirect, incidental, or consequential damages arising from the use or inability to use our website.'
        },
        {
          title: '6. Modifications',
          content: 'We reserve the right to modify these terms at any time. Changes will take effect upon posting on this site.'
        }
      ]
    }
  };

  const t = content[language];

  return (
    <>
      <AnimatedBackground />
      <Header />
      <div className="min-h-screen pt-32 pb-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 text-center">
              {t.title}
            </h1>
            <p className="text-white/60 text-center mb-12">{t.lastUpdated}</p>

            <GlassCard className="p-8 md:p-12">
              <div className="space-y-8">
                {t.sections.map((section, index) => (
                  <div key={index}>
                    <h2 className="text-2xl font-bold text-white mb-3">{section.title}</h2>
                    <p className="text-white/80 leading-relaxed">{section.content}</p>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default TermsPage;

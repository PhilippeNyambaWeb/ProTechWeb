import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { GlassCard } from '@/components/ui/glass-card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AnimatedBackground from '@/components/AnimatedBackground';

const LegalPage = () => {
  const { language } = useLanguage();

  const content = {
    fr: {
      title: 'Mentions légales',
      lastUpdated: 'Dernière mise à jour: Novembre 2025',
      sections: [
        {
          title: 'Éditeur du site',
          content: 'ProTechWeb\nEmail: contact@protechweb.ca\nTéléphone: +1 (514) 994-4689'
        },
        {
          title: 'Hébergement',
          content: 'Ce site est hébergé par des services d\'hébergement professionnels conformes aux normes de sécurité et de disponibilité.'
        },
        {
          title: 'Propriété intellectuelle',
          content: 'L\'ensemble du contenu de ce site (textes, images, vidéos, logos, etc.) est la propriété exclusive de ProTechWeb, sauf mention contraire. Toute reproduction, distribution ou utilisation sans autorisation préalable est interdite.'
        },
        {
          title: 'Données personnelles',
          content: 'Les informations recueillies sur ce site font l\'objet d\'un traitement informatique destiné à répondre à vos demandes. Conformément à la loi, vous disposez d\'un droit d\'accès, de rectification et de suppression des données vous concernant.'
        },
        {
          title: 'Cookies',
          content: 'Ce site utilise des cookies pour améliorer l\'expérience utilisateur et analyser le trafic. En continuant à naviguer sur ce site, vous acceptez l\'utilisation de cookies.'
        },
        {
          title: 'Crédits',
          content: 'Design et développement: ProTechWeb\nPhotographies: Pexels et sources libres de droits'
        }
      ]
    },
    en: {
      title: 'Legal Notice',
      lastUpdated: 'Last updated: November 2025',
      sections: [
        {
          title: 'Site Publisher',
          content: 'ProTechWeb\nEmail: contact@protechweb.ca\nPhone: +1 (514) 994-4689'
        },
        {
          title: 'Hosting',
          content: 'This site is hosted by professional hosting services compliant with security and availability standards.'
        },
        {
          title: 'Intellectual Property',
          content: 'All content on this site (text, images, videos, logos, etc.) is the exclusive property of ProTechWeb, unless otherwise stated. Any reproduction, distribution, or use without prior authorization is prohibited.'
        },
        {
          title: 'Personal Data',
          content: 'Information collected on this site is processed to respond to your requests. In accordance with the law, you have the right to access, rectify, and delete data concerning you.'
        },
        {
          title: 'Cookies',
          content: 'This site uses cookies to improve user experience and analyze traffic. By continuing to browse this site, you accept the use of cookies.'
        },
        {
          title: 'Credits',
          content: 'Design and development: ProTechWeb\nPhotography: Pexels and royalty-free sources'
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
                    <p className="text-white/80 leading-relaxed whitespace-pre-line">{section.content}</p>
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

export default LegalPage;

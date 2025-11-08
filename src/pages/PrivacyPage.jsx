import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { GlassCard } from '@/components/ui/glass-card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AnimatedBackground from '@/components/AnimatedBackground';

const PrivacyPage = () => {
  const { language } = useLanguage();

  const content = {
    fr: {
      title: 'Politique de confidentialité',
      lastUpdated: 'Dernière mise à jour: Novembre 2025',
      sections: [
        {
          title: '1. Collecte des informations',
          content: 'Nous collectons les informations que vous nous fournissez directement lorsque vous utilisez notre site web, notamment votre nom, adresse email, numéro de téléphone et les détails de votre projet lorsque vous nous contactez.'
        },
        {
          title: '2. Utilisation des informations',
          content: 'Nous utilisons vos informations personnelles pour répondre à vos demandes, fournir nos services, améliorer notre site web et vous envoyer des communications marketing si vous y avez consenti.'
        },
        {
          title: '3. Protection des données',
          content: 'Nous prenons la sécurité de vos données personnelles au sérieux et mettons en œuvre des mesures de sécurité appropriées pour protéger vos informations contre tout accès, utilisation ou divulgation non autorisés.'
        },
        {
          title: '4. Partage des informations',
          content: 'Nous ne vendons ni ne louons vos informations personnelles à des tiers. Nous ne partageons vos informations qu\'avec des prestataires de services de confiance qui nous aident à exploiter notre site web.'
        },
        {
          title: '5. Cookies',
          content: 'Notre site utilise des cookies pour améliorer votre expérience utilisateur. Vous pouvez configurer votre navigateur pour refuser les cookies, mais cela peut affecter certaines fonctionnalités du site.'
        },
        {
          title: '6. Vos droits',
          content: 'Vous avez le droit d\'accéder, de corriger ou de supprimer vos données personnelles. Pour exercer ces droits, veuillez nous contacter à contact@protechweb.ca.'
        }
      ]
    },
    en: {
      title: 'Privacy Policy',
      lastUpdated: 'Last updated: November 2025',
      sections: [
        {
          title: '1. Information Collection',
          content: 'We collect information that you provide directly to us when using our website, including your name, email address, phone number, and project details when you contact us.'
        },
        {
          title: '2. Use of Information',
          content: 'We use your personal information to respond to your inquiries, provide our services, improve our website, and send you marketing communications if you have consented.'
        },
        {
          title: '3. Data Protection',
          content: 'We take the security of your personal data seriously and implement appropriate security measures to protect your information from unauthorized access, use, or disclosure.'
        },
        {
          title: '4. Information Sharing',
          content: 'We do not sell or rent your personal information to third parties. We only share your information with trusted service providers who help us operate our website.'
        },
        {
          title: '5. Cookies',
          content: 'Our site uses cookies to enhance your user experience. You can configure your browser to refuse cookies, but this may affect certain site features.'
        },
        {
          title: '6. Your Rights',
          content: 'You have the right to access, correct, or delete your personal data. To exercise these rights, please contact us at contact@protechweb.ca.'
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

export default PrivacyPage;

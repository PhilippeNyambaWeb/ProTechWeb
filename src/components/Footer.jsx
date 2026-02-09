import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslations } from '@/lib/translations';
import { motion } from 'framer-motion';
import { Facebook, Linkedin, Mail } from 'lucide-react';
import { GlassButton } from '@/components/ui/glass-card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import LegalModal from '@/components/LegalModal';

const Footer = () => {
  const { language } = useLanguage();
  const t = useTranslations(language);
  const { toast } = useToast();
  const [legalModal, setLegalModal] = useState({ isOpen: false, type: null });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formsApiBase = (import.meta.env.VITE_FORMS_API_URL || 'https://api.protechweb.ca').replace(/\/+$/, '');

  const openLegalModal = (type) => {
    setLegalModal({ isOpen: true, type });
  };

  const closeLegalModal = () => {
    setLegalModal({ isOpen: false, type: null });
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const resolveTenant = () => {
    if (typeof window === 'undefined') return null;
    const tenant = window.location.hostname.replace(/^www\./, '');
    try {
      const apiHost = new URL(formsApiBase).hostname;
      return apiHost === tenant ? null : tenant;
    } catch {
      return tenant || null;
    }
  };

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;

    if (!validateEmail(email)) {
      toast({
        title: "Email invalide",
        description: "Veuillez entrer une adresse email valide.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const apiUrl = `${formsApiBase}/forms/newsletter`;
      const tenant = resolveTenant();
      const payload = tenant ? { email, tenant } : { email };

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Une erreur est survenue');
      }

      toast({
        title: "Inscription réussie ! 🎉",
        description: "Merci de vous être abonné à notre newsletter.",
      });

      e.target.reset();
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue, merci de réessayer plus tard.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="glass-effect bg-gray-900/80 text-white pt-16 pb-8 border-t border-white/10">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <div>
            <span className="text-2xl font-bold text-secondary mb-4 block">ProTechWeb</span>
            <p className="text-white mb-4">
              {t.footer.tagline}
            </p>
            <div className="flex space-x-4">
              <motion.a
                whileHover={{ scale: 1.1 }}
                href="https://www.facebook.com/profile.php?id=61583472042647"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 p-2 rounded-full hover:bg-secondary transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1 }}
                href="https://www.linkedin.com/in/philippe-nyamba-26447a209/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 p-2 rounded-full hover:bg-secondary transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </motion.a>
            </div>
          </div>

          <div className="flex justify-center">
            <div>
              <span className="font-bold text-lg mb-4 block text-center">{t.footer.services}</span>
              <ul className="space-y-2 text-white text-center">
                <li><a href="#services" className="hover:text-secondary transition-colors">{t.footer.servicesLinks.webDesign}</a></li>
                <li><a href="#services" className="hover:text-secondary transition-colors">{t.footer.servicesLinks.webDev}</a></li>
                <li><a href="#services" className="hover:text-secondary transition-colors">{t.footer.servicesLinks.webApps}</a></li>
                <li><a href="#services" className="hover:text-secondary transition-colors">{t.footer.servicesLinks.branding}</a></li>
                <li><a href="#services" className="hover:text-secondary transition-colors">{t.footer.servicesLinks.ecommerce}</a></li>
                <li><a href="#services" className="hover:text-secondary transition-colors">{t.footer.servicesLinks.backend}</a></li>
              </ul>
            </div>
          </div>

          <div>
            <span className="font-bold text-lg mb-4 block">{t.footer.newsletter}</span>
            <p className="text-white mb-4">
              {t.footer.newsletterDesc}
            </p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-3">
              <Input
                type="email"
                name="email"
                placeholder={t.footer.newsletterPlaceholder}
                required
                disabled={isSubmitting}
                className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-secondary focus:ring-secondary h-11"
              />
              <GlassButton variant="secondary" type="submit" className="w-full px-6 py-3" disabled={isSubmitting}>
                <Mail className="mr-2 h-4 w-4" />
                <span>{t.footer.subscribe}</span>
              </GlassButton>
            </form>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-white text-sm">
            <p>© 2025 ProTechWeb. {t.footer.rights}</p>
            <div className="flex flex-wrap justify-center gap-4 md:gap-6 mt-4 md:mt-0">
              <button onClick={() => openLegalModal('privacy')} className="hover:text-secondary transition-colors">
                {t.footer.privacy}
              </button>
              <button onClick={() => openLegalModal('terms')} className="hover:text-secondary transition-colors">
                {t.footer.terms}
              </button>
              <button onClick={() => openLegalModal('legal')} className="hover:text-secondary transition-colors">
                {t.footer.legalNotice}
              </button>
              <button onClick={() => openLegalModal('refund')} className="hover:text-secondary transition-colors">
                {language === 'fr' ? 'Politique de remboursement' : 'Refund Policy'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <LegalModal
        isOpen={legalModal.isOpen}
        onClose={closeLegalModal}
        type={legalModal.type}
      />
    </footer>
  );
};

export default Footer;

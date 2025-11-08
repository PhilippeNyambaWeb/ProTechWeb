import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslations } from '@/lib/translations';
import { motion } from 'framer-motion';
import { Facebook, Twitter, Linkedin, Instagram, Mail } from 'lucide-react';
import { GlassButton } from '@/components/ui/glass-card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';

const Footer = () => {
  const { language } = useLanguage();
  const t = useTranslations(language);
  const { toast } = useToast();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    const email = e.target.email.value;

    if (!validateEmail(email)) {
      toast({
        title: "Email invalide",
        description: "Veuillez entrer une adresse email valide.",
      });
      return;
    }

    const subscribers = JSON.parse(localStorage.getItem('newsletter') || '[]');
    subscribers.push({
      email,
      date: new Date().toISOString()
    });
    localStorage.setItem('newsletter', JSON.stringify(subscribers));

    toast({
      title: "Inscription réussie ! 🎉",
      description: "Merci de vous être abonné à notre newsletter.",
    });

    e.target.reset();
  };

  return (
    <footer className="glass-effect bg-gray-900/80 text-white pt-16 pb-8 border-t border-white/10">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <span className="text-2xl font-bold text-secondary mb-4 block">ProTechWeb</span>
            <p className="text-white mb-4">
              Votre partenaire de confiance pour des solutions web professionnelles et innovantes.
            </p>
            <div className="flex space-x-4">
              <motion.a
                whileHover={{ scale: 1.1 }}
                href="#"
                className="bg-gray-800 p-2 rounded-full hover:bg-secondary transition-colors"
              >
                <Facebook size={20} />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1 }}
                href="#"
                className="bg-gray-800 p-2 rounded-full hover:bg-secondary transition-colors"
              >
                <Twitter size={20} />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1 }}
                href="#"
                className="bg-gray-800 p-2 rounded-full hover:bg-secondary transition-colors"
              >
                <Linkedin size={20} />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1 }}
                href="#"
                className="bg-gray-800 p-2 rounded-full hover:bg-secondary transition-colors"
              >
                <Instagram size={20} />
              </motion.a>
            </div>
          </div>

          <div>
            <span className="font-bold text-lg mb-4 block">Services</span>
            <ul className="space-y-2 text-white">
              <li><a href="#services" className="hover:text-secondary transition-colors">Design Web</a></li>
              <li><a href="#services" className="hover:text-secondary transition-colors">Développement</a></li>
              <li><a href="#services" className="hover:text-secondary transition-colors">Applications</a></li>
              <li><a href="#services" className="hover:text-secondary transition-colors">SEO & Marketing</a></li>
            </ul>
          </div>

          <div>
            <span className="font-bold text-lg mb-4 block">Entreprise</span>
            <ul className="space-y-2 text-white">
              <li><a href="#about" className="hover:text-secondary transition-colors">À propos</a></li>
              <li><a href="#contact" className="hover:text-secondary transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-secondary transition-colors">Carrières</a></li>
            </ul>
          </div>

          <div>
            <span className="font-bold text-lg mb-4 block">Newsletter</span>
            <p className="text-white mb-4">
              Restez informé de nos dernières actualités et offres.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-3">
              <Input
                type="email"
                name="email"
                placeholder="Votre email"
                required
                className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-secondary focus:ring-secondary h-11"
              />
              <GlassButton variant="secondary" type="submit" className="w-full px-6 py-3">
                <Mail className="mr-2 h-4 w-4" />
                <span>S'abonner</span>
              </GlassButton>
            </form>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-white text-sm">
            <p>© 2025 ProTechWeb. Tous droits réservés.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-secondary transition-colors">Politique de confidentialité</a>
              <a href="#" className="hover:text-secondary transition-colors">Conditions d'utilisation</a>
              <a href="#" className="hover:text-secondary transition-colors">Mentions légales</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
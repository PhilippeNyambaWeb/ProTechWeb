import React from 'react';
import { motion } from 'framer-motion';
import { Facebook, Twitter, Linkedin, Instagram, Mail } from 'lucide-react';
import { GlassButton } from '@/components/ui/glass-card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';

const Footer = () => {
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
            <span className="text-2xl font-bold text-primary mb-4 block">ProTechWeb</span>
            <p className="text-gray-400 mb-4">
              Votre partenaire de confiance pour des solutions web professionnelles et innovantes.
            </p>
            <div className="flex space-x-4">
              <motion.a
                whileHover={{ scale: 1.1 }}
                href="#"
                className="bg-gray-800 p-2 rounded-full hover:bg-primary transition-colors"
              >
                <Facebook size={20} />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1 }}
                href="#"
                className="bg-gray-800 p-2 rounded-full hover:bg-primary transition-colors"
              >
                <Twitter size={20} />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1 }}
                href="#"
                className="bg-gray-800 p-2 rounded-full hover:bg-primary transition-colors"
              >
                <Linkedin size={20} />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1 }}
                href="#"
                className="bg-gray-800 p-2 rounded-full hover:bg-primary transition-colors"
              >
                <Instagram size={20} />
              </motion.a>
            </div>
          </div>

          <div>
            <span className="font-bold text-lg mb-4 block">Services</span>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#services" className="hover:text-primary transition-colors">Design Web</a></li>
              <li><a href="#services" className="hover:text-primary transition-colors">Développement</a></li>
              <li><a href="#services" className="hover:text-primary transition-colors">Applications</a></li>
              <li><a href="#services" className="hover:text-primary transition-colors">SEO & Marketing</a></li>
            </ul>
          </div>

          <div>
            <span className="font-bold text-lg mb-4 block">Entreprise</span>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#about" className="hover:text-primary transition-colors">À propos</a></li>
              <li><a href="#contact" className="hover:text-primary transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Carrières</a></li>
            </ul>
          </div>

          <div>
            <span className="font-bold text-lg mb-4 block">Newsletter</span>
            <p className="text-gray-400 mb-4">
              Restez informé de nos dernières actualités et offres.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-2">
              <Input
                type="email"
                name="email"
                placeholder="Votre email"
                required
                className="bg-gray-800 border-gray-700 text-white"
              />
              <GlassButton variant="primary" type="submit" className="w-full">
                <Mail className="mr-2 h-4 w-4" />
                S'abonner
              </GlassButton>
            </form>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
            <p>© 2025 ProTechWeb. Tous droits réservés.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-primary transition-colors">Politique de confidentialité</a>
              <a href="#" className="hover:text-primary transition-colors">Conditions d'utilisation</a>
              <a href="#" className="hover:text-primary transition-colors">Mentions légales</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
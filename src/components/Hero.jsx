import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { GlassButton } from '@/components/ui/glass-card';
import { useScroll } from '@/contexts/ScrollContext';

const Hero = () => {
  const { prefillContactForm } = useScroll();

  const handleStartProject = () => {
    prefillContactForm({
      inquiryType: 'Projet',
      subject: 'Demande de démarrage de projet',
      message: 'Je souhaite démarrer un nouveau projet avec ProTechWeb. Voici mes besoins:\n\n'
    });
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col items-center justify-center text-center overflow-hidden"
    >
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          poster="/assets/banner-fallback.jpg"
          className="w-full h-full object-cover"
          style={{ objectPosition: 'center center' }}
        >
          <source
            src="https://videos.pexels.com/video-files/3191752/3191752-sd_640_360_25fps.mp4"
            type="video/mp4"
          />
          Votre navigateur ne supporte pas la vidéo.
        </video>
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/70 z-10" />

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-20 container mx-auto px-4 text-white flex-1 flex flex-col items-center justify-center"
      >
        <motion.div
          className="backdrop-blur-md bg-black/40 rounded-3xl p-8 md:p-12 border border-white/30 max-w-5xl mx-auto"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight text-white drop-shadow-2xl">
            Transformez Votre Vision en{' '}
            <span className="text-secondary">Réalité Digitale</span>
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl mb-8 max-w-3xl mx-auto text-gray-100 drop-shadow-lg">
            Solutions web professionnelles sur mesure. Design moderne, développement robuste et
            applications innovantes pour propulser votre entreprise.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <GlassButton
              variant="accent"
              onClick={handleStartProject}
              className="px-8 py-4 text-lg"
            >
              Démarrer un Projet
              <ArrowRight className="ml-2 h-5 w-5" />
            </GlassButton>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;

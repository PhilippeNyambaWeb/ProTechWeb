import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Target, Eye, Award, Users } from 'lucide-react';
import { GlassButton } from '@/components/ui/glass-card';
import { useScroll } from '@/contexts/ScrollContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslations } from '@/lib/translations';

const Hero = () => {
  const { prefillContactForm } = useScroll();
  const { language } = useLanguage();
  const t = useTranslations(language);

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
      className="relative min-h-screen flex flex-col items-center justify-center text-center overflow-hidden pt-[100px]"
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
            src="/assets/banner-video.mp4"
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
          className="backdrop-blur-md bg-white/20 rounded-3xl p-8 md:p-12 border border-white/40 max-w-6xl mx-auto"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight text-white drop-shadow-2xl">
            {t.hero.title}{' '}
            <span className="text-secondary">{t.hero.titleHighlight}</span>
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl mb-8 max-w-3xl mx-auto text-white drop-shadow-lg">
            {t.hero.subtitle}
          </p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mb-8"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
              {t.hero.aboutTitle}
            </h2>
            <p className="text-base md:text-lg text-white/90 mb-8 max-w-3xl mx-auto">
              {t.hero.aboutDesc}
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="bg-white/20 backdrop-blur-sm w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center mb-3 mx-auto">
                  <Target className="w-6 h-6 md:w-8 md:h-8 text-white" />
                </div>
                <h3 className="text-sm md:text-base font-bold text-white mb-2">{t.hero.mission}</h3>
                <p className="text-xs md:text-sm text-white/80">{t.hero.missionDesc}</p>
              </div>

              <div className="text-center">
                <div className="bg-white/20 backdrop-blur-sm w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center mb-3 mx-auto">
                  <Eye className="w-6 h-6 md:w-8 md:h-8 text-white" />
                </div>
                <h3 className="text-sm md:text-base font-bold text-white mb-2">{t.hero.vision}</h3>
                <p className="text-xs md:text-sm text-white/80">{t.hero.visionDesc}</p>
              </div>

              <div className="text-center">
                <div className="bg-white/20 backdrop-blur-sm w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center mb-3 mx-auto">
                  <Award className="w-6 h-6 md:w-8 md:h-8 text-white" />
                </div>
                <h3 className="text-sm md:text-base font-bold text-white mb-2">{t.hero.excellence}</h3>
                <p className="text-xs md:text-sm text-white/80">{t.hero.excellenceDesc}</p>
              </div>

              <div className="text-center">
                <div className="bg-white/20 backdrop-blur-sm w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center mb-3 mx-auto">
                  <Users className="w-6 h-6 md:w-8 md:h-8 text-white" />
                </div>
                <h3 className="text-sm md:text-base font-bold text-white mb-2">{t.hero.collaboration}</h3>
                <p className="text-xs md:text-sm text-white/80">{t.hero.collaborationDesc}</p>
              </div>
            </div>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-4">
            <GlassButton
              variant="accent"
              onClick={handleStartProject}
              className="px-8 py-4 text-lg inline-flex items-center"
            >
              <span>{t.hero.cta}</span>
              <ArrowRight className="ml-2 h-5 w-5 inline-block" />
            </GlassButton>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;

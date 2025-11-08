import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { GlassButton } from '@/components/ui/glass-card';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslations } from '@/lib/translations';

const ServiceDetails = ({ service, isOpen, onClose, onSelectService }) => {
  const { language } = useLanguage();
  const t = useTranslations(language);

  if (!service) return null;

  const handleSelectService = () => {
    if (onSelectService) {
      onSelectService(service.title);
    } else {
      onClose();
      setTimeout(() => {
        const contactSection = document.getElementById('contact');
        if (contactSection) {
          contactSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 300);
    }
  };

  const details = t.serviceDetails[service.serviceKey];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="fixed inset-4 md:inset-8 lg:inset-16 backdrop-blur-2xl bg-black/30 rounded-3xl shadow-2xl z-50 overflow-hidden border border-white/20"
          >
            <div className="h-full flex flex-col">
              <div className="backdrop-blur-md bg-white/10 text-white p-6 md:p-8 border-b border-white/20">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="bg-white/20 p-3 rounded-full">
                      <service.icon size={32} />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold">{service.title}</h2>
                      <p className="text-white/90 mt-1">{service.description}</p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 md:p-8">
                <div className="max-w-4xl mx-auto space-y-8">
                  <section className="backdrop-blur-sm bg-white/10 p-6 rounded-2xl border border-white/20">
                    <h3 className="text-2xl font-bold text-white mb-3">{t.serviceDetails.overview}</h3>
                    <p className="text-white/90 leading-relaxed">{details.overview}</p>
                  </section>

                  <div className="grid md:grid-cols-2 gap-8">
                    <section className="backdrop-blur-sm bg-white/10 p-6 rounded-2xl border border-white/20">
                      <h3 className="text-xl font-bold text-white mb-4">{t.serviceDetails.process}</h3>
                      <ol className="space-y-3">
                        {details.process?.map((step, index) => (
                          <li key={index} className="flex items-start">
                            <span className="bg-secondary text-white font-bold rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">
                              {index + 1}
                            </span>
                            <span className="text-white/90 pt-1">{step}</span>
                          </li>
                        ))}
                      </ol>
                    </section>

                    <section className="backdrop-blur-sm bg-white/10 p-6 rounded-2xl border border-white/20">
                      <h3 className="text-xl font-bold text-white mb-4">{t.serviceDetails.deliverables}</h3>
                      <ul className="space-y-3">
                        {details.deliverables?.map((item, index) => (
                          <li key={index} className="flex items-start">
                            <div className="bg-secondary rounded-full w-2 h-2 mt-2 mr-3 flex-shrink-0" />
                            <span className="text-white/90">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </section>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <section className="backdrop-blur-sm bg-white/10 p-6 rounded-2xl border border-white/20">
                      <h3 className="text-xl font-bold text-white mb-2">{t.serviceDetails.timeline}</h3>
                      <p className="text-2xl font-bold text-secondary">{details.timeline}</p>
                    </section>

                    <section className="backdrop-blur-sm bg-white/10 p-6 rounded-2xl border border-white/20">
                      <h3 className="text-xl font-bold text-white mb-2">{t.serviceDetails.idealFor}</h3>
                      <p className="text-white/90">{details.idealFor}</p>
                    </section>
                  </div>

                  <section className="backdrop-blur-sm bg-white/10 p-6 md:p-8 rounded-2xl border border-white/20">
                    <h3 className="text-2xl font-bold text-white mb-3">{t.serviceDetails.features}</h3>
                    <ul className="grid md:grid-cols-2 gap-3">
                      {service.features?.map((feature, index) => (
                        <li key={index} className="flex items-center text-white/90">
                          <div className="w-2 h-2 bg-secondary rounded-full mr-3" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </section>
                </div>
              </div>

              <div className="border-t border-white/20 p-6 md:p-8 backdrop-blur-md bg-white/10">
                <div className="max-w-4xl mx-auto flex flex-col sm:flex-row gap-4 justify-between items-center">
                  <p className="text-white text-center sm:text-left">
                    {t.serviceDetails.cta}
                  </p>
                  <GlassButton
                    variant="accent"
                    onClick={handleSelectService}
                    className="px-8 py-3 w-full sm:w-auto"
                  >
                    {t.serviceDetails.quote}
                  </GlassButton>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ServiceDetails;

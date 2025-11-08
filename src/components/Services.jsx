import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Globe, Code2, Smartphone, Palette, ShoppingCart, Database } from 'lucide-react';
import { GlassCard, GlassButton } from '@/components/ui/glass-card';
import { useScroll } from '@/contexts/ScrollContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslations } from '@/lib/translations';
import ServiceDetails from '@/components/ServiceDetails';

const Services = () => {
  const [selectedService, setSelectedService] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { prefillContactForm } = useScroll();
  const { language } = useLanguage();
  const t = useTranslations(language);

  const handleLearnMore = (service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedService(null), 300);
  };

  const handleServiceSelect = (serviceTitle) => {
    prefillContactForm({
      inquiryType: language === 'fr' ? 'Devis' : 'Quote',
      subject: `${language === 'fr' ? 'Service' : 'Service'}: ${serviceTitle}`,
      message: language === 'fr'
        ? `Je suis intéressé par vos services de ${serviceTitle}. Voici plus de détails sur mes besoins:\n\n`
        : `I am interested in your ${serviceTitle} services. Here are more details about my needs:\n\n`
    });
    closeModal();
  };

  const services = [
    {
      icon: Globe,
      title: t.services.webDesign.title,
      description: t.services.webDesign.description,
      features: t.services.webDesign.features,
      serviceKey: 'webDesign'
    },
    {
      icon: Code2,
      title: t.services.webDev.title,
      description: t.services.webDev.description,
      features: t.services.webDev.features,
      serviceKey: 'webDev'
    },
    {
      icon: Smartphone,
      title: t.services.webApps.title,
      description: t.services.webApps.description,
      features: t.services.webApps.features,
      serviceKey: 'webApps'
    },
    {
      icon: Palette,
      title: t.services.branding.title,
      description: t.services.branding.description,
      features: t.services.branding.features,
      serviceKey: 'branding'
    },
    {
      icon: ShoppingCart,
      title: t.services.ecommerce.title,
      description: t.services.ecommerce.description,
      features: t.services.ecommerce.features,
      serviceKey: 'ecommerce'
    },
    {
      icon: Database,
      title: t.services.backend.title,
      description: t.services.backend.description,
      features: t.services.backend.features,
      serviceKey: 'backend'
    }
  ];

  return (
    <section id="services" className="min-h-screen py-20 flex items-center">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            {t.services.title}
          </h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            {t.services.subtitle}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
            >
              <GlassCard className="h-full p-8 hover:scale-105 transition-transform duration-300">
                <service.icon className="w-12 h-12 text-secondary mb-6" />
                <h3 className="text-2xl font-bold mb-4 text-white">{service.title}</h3>
                <p className="text-white/80 mb-6">{service.description}</p>
                <ul className="space-y-2 mb-8">
                  {service.features.map((feature, i) => (
                    <li key={i} className="flex items-center text-white/70">
                      <div className="w-2 h-2 bg-secondary rounded-full mr-3" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <GlassButton
                  variant="secondary"
                  onClick={() => handleLearnMore(service)}
                  className="w-full"
                >
                  {t.services.learnMore}
                </GlassButton>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>

      {selectedService && (
        <ServiceDetails
          service={selectedService}
          isOpen={isModalOpen}
          onClose={closeModal}
          onSelectService={handleServiceSelect}
        />
      )}
    </section>
  );
};

export default Services;

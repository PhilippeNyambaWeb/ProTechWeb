import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { GlassCard, GlassButton } from '@/components/ui/glass-card';
import { useScroll } from '@/contexts/ScrollContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslations } from '@/lib/translations';

const Pricing = () => {
  const { prefillContactForm } = useScroll();
  const { language } = useLanguage();
  const t = useTranslations(language);

  const handlePlanSelect = (planName, price) => {
    prefillContactForm({
      inquiryType: language === 'fr' ? 'Devis' : 'Quote',
      subject: `${language === 'fr' ? 'Forfait' : 'Plan'} ${planName} - ${price}${t.pricing.perProject}`,
      message: language === 'fr'
        ? `Je suis intéressé par le forfait ${planName} à ${price}. Voici les détails de mon projet:\n\n`
        : `I am interested in the ${planName} plan at ${price}. Here are my project details:\n\n`
    });
  };

  const handleCustomQuote = () => {
    prefillContactForm({
      inquiryType: language === 'fr' ? 'Devis' : 'Quote',
      subject: language === 'fr' ? 'Demande de forfait personnalisé' : 'Custom plan request',
      message: language === 'fr'
        ? 'Je souhaite obtenir un devis personnalisé pour mon projet. Voici mes besoins spécifiques:\n\n'
        : 'I would like to get a custom quote for my project. Here are my specific needs:\n\n'
    });
  };

  const pricingTiers = [
    {
      ...t.pricing.starter,
      highlighted: false
    },
    {
      ...t.pricing.professional,
      highlighted: true
    },
    {
      ...t.pricing.enterprise,
      highlighted: false
    }
  ];

  return (
    <section id="tarifs" className="min-h-screen py-20 flex items-center">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            {t.pricing.title}
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            {t.pricing.subtitle}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {pricingTiers.map((tier, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="h-full"
            >
              <GlassCard
                className={`h-full flex flex-col p-8 relative ${
                  tier.highlighted ? 'ring-2 ring-secondary' : ''
                }`}
              >
                {tier.highlighted && tier.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-secondary text-white px-4 py-1 rounded-full text-sm font-bold">
                    {tier.popular}
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-white mb-2">{tier.title}</h3>
                  <div className="flex items-baseline mb-4">
                    <span className="text-4xl font-bold text-secondary">{tier.price}</span>
                    <span className="text-white/60 ml-2">{tier.priceNote}</span>
                  </div>
                  <p className="text-white/70">{tier.description}</p>
                </div>

                <ul className="space-y-3 mb-8 flex-grow">
                  {tier.features.map((feature, i) => (
                    <li key={i} className="flex items-start text-white/80">
                      <Check className="w-5 h-5 text-secondary mr-3 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <GlassButton
                  variant={tier.highlighted ? 'accent' : 'secondary'}
                  onClick={() => handlePlanSelect(tier.title, tier.price)}
                  className="w-full py-3"
                >
                  {t.pricing.cta}
                </GlassButton>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-center mt-16"
        >
          <p className="text-xl text-white/90 mb-6">
            {t.pricing.customQuestion}
          </p>
          <GlassButton
            variant="primary"
            onClick={handleCustomQuote}
            className="px-8 py-3"
          >
            {t.pricing.ctaAlt}
          </GlassButton>
        </motion.div>
      </div>
    </section>
  );
};

export default Pricing;

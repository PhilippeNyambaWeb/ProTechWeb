import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { GlassCard, GlassButton } from '@/components/ui/glass-card';
import { useScroll } from '@/contexts/ScrollContext';

const Pricing = () => {
  const { prefillContactForm } = useScroll();

  const handlePlanSelect = (plan) => {
    prefillContactForm({
      inquiryType: 'Devis',
      subject: `Forfait ${plan.name} - $${plan.price}/${plan.period}`,
      message: `Je suis intéressé par le forfait ${plan.name} à $${plan.price}. Voici les détails de mon projet:\n\n`
    });
  };

  const handleCustomQuote = () => {
    prefillContactForm({
      inquiryType: 'Devis',
      subject: 'Demande de forfait personnalisé',
      message: 'Je souhaite obtenir un devis personnalisé pour mon projet. Voici mes besoins spécifiques:\n\n'
    });
  };

  const pricingTiers = [
    {
      name: 'Essentiel',
      price: '499',
      period: 'projet',
      description: 'Parfait pour les petites entreprises et les startups qui débutent en ligne.',
      features: [
        'Site web responsive (jusqu\'à 5 pages)',
        'Design moderne et professionnel',
        'Optimisation mobile',
        'Formulaire de contact',
        'SEO de base',
        'Hébergement 1 an inclus',
        'Support par email'
      ],
      highlighted: false
    },
    {
      name: 'Pro',
      price: '1299',
      period: 'projet',
      description: 'La solution complète pour les entreprises en croissance qui veulent se démarquer.',
      features: [
        'Site web responsive (jusqu\'à 10 pages)',
        'Design sur mesure premium',
        'Animation et micro-interactions',
        'Système de gestion de contenu (CMS)',
        'Intégration analytics avancée',
        'SEO avancé',
        'Formulaires personnalisés',
        'Hébergement 1 an inclus',
        'Support prioritaire (email & téléphone)',
        'Maintenance 3 mois offerte'
      ],
      highlighted: true
    },
    {
      name: 'Premium',
      price: '2499',
      period: 'projet',
      description: 'Solution entreprise avec fonctionnalités avancées et accompagnement personnalisé.',
      features: [
        'Site web ou application web complète',
        'Pages illimitées',
        'Design et branding complet',
        'Développement sur mesure',
        'Base de données et backend',
        'Espace membre / authentification',
        'API et intégrations tierces',
        'E-commerce (si applicable)',
        'SEO premium & stratégie de contenu',
        'Formation complète',
        'Hébergement 1 an inclus',
        'Support dédié 24/7',
        'Maintenance 6 mois offerte'
      ],
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
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Nos Tarifs
          </h2>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto">
            Des forfaits transparents adaptés à vos besoins et votre budget. Tous nos projets incluent un suivi personnalisé.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {pricingTiers.map((tier, index) => (
            <GlassCard
              key={tier.name}
              as={motion.div}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`relative p-8 ${
                tier.highlighted
                  ? 'bg-gradient-to-br from-primary/20 to-secondary/20 border-primary/40 shadow-2xl scale-105'
                  : ''
              }`}
            >
              {tier.highlighted && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="backdrop-blur-md bg-gradient-to-r from-secondary to-primary text-white px-4 py-1 rounded-full text-sm font-bold border border-white/30">
                    Le plus populaire
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className={`text-2xl font-bold mb-2 ${tier.highlighted ? 'text-primary' : 'text-white'}`}>
                  {tier.name}
                </h3>
                <p className="text-sm text-gray-200">
                  {tier.description}
                </p>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline">
                  <span className={`text-5xl font-bold ${tier.highlighted ? 'text-primary' : 'text-white'}`}>
                    ${tier.price}
                  </span>
                  <span className="ml-2 text-gray-200">
                    /{tier.period}
                  </span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {tier.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start">
                    <Check
                      className={`mr-3 flex-shrink-0 mt-0.5 ${
                        tier.highlighted ? 'text-primary' : 'text-secondary'
                      }`}
                      size={20}
                    />
                    <span className="text-sm text-gray-200">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <GlassButton
                variant={tier.highlighted ? 'accent' : 'primary'}
                onClick={() => handlePlanSelect(tier)}
                className="w-full"
              >
                Démarrer
              </GlassButton>
            </GlassCard>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-12"
        >
          <p className="text-gray-200 mb-4">
            Besoin d'un forfait personnalisé ou d'un devis détaillé ?
          </p>
          <GlassButton
            variant="secondary"
            onClick={handleCustomQuote}
            className="px-8 py-3"
          >
            Demander un devis gratuit
          </GlassButton>
        </motion.div>
      </div>
    </section>
  );
};

export default Pricing;

import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Pricing = () => {
  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
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
    <section id="tarifs" className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Nos Tarifs
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Des forfaits transparents adaptés à vos besoins et votre budget. Tous nos projets incluent un suivi personnalisé.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {pricingTiers.map((tier, index) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`relative rounded-2xl p-8 ${
                tier.highlighted
                  ? 'bg-gradient-to-br from-primary to-primary/90 text-white shadow-2xl scale-105 border-2 border-primary'
                  : 'bg-white shadow-lg border border-gray-200'
              }`}
            >
              {tier.highlighted && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-secondary text-primary px-4 py-1 rounded-full text-sm font-bold">
                    Le plus populaire
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className={`text-2xl font-bold mb-2 ${tier.highlighted ? 'text-white' : 'text-gray-900'}`}>
                  {tier.name}
                </h3>
                <p className={`text-sm ${tier.highlighted ? 'text-white/90' : 'text-gray-600'}`}>
                  {tier.description}
                </p>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline">
                  <span className={`text-5xl font-bold ${tier.highlighted ? 'text-white' : 'text-gray-900'}`}>
                    ${tier.price}
                  </span>
                  <span className={`ml-2 ${tier.highlighted ? 'text-white/90' : 'text-gray-600'}`}>
                    /{tier.period}
                  </span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {tier.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start">
                    <Check
                      className={`mr-3 flex-shrink-0 mt-0.5 ${
                        tier.highlighted ? 'text-secondary' : 'text-primary'
                      }`}
                      size={20}
                    />
                    <span className={`text-sm ${tier.highlighted ? 'text-white' : 'text-gray-700'}`}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Button
                onClick={scrollToContact}
                className={`w-full ${
                  tier.highlighted
                    ? 'bg-white text-primary hover:bg-gray-100'
                    : 'bg-primary text-white hover:bg-primary/90'
                }`}
                size="lg"
              >
                Démarrer
              </Button>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-12"
        >
          <p className="text-gray-600 mb-4">
            Besoin d'un forfait personnalisé ou d'un devis détaillé ?
          </p>
          <Button
            onClick={scrollToContact}
            variant="outline"
            size="lg"
            className="border-primary text-primary hover:bg-primary hover:text-white"
          >
            Demander un devis gratuit
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default Pricing;

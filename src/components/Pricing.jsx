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

  // Pricing overrides (source-of-truth for current specs)
  const overrides = {
    fr: {
      starterMini: {
        setupPrice: '$499',
        monthlyPrice: '$45',
        priceNote: 'mise en place',
        monthlyNote: '/ mois',
        description: 'Pour freelances, solopreneurs et micro-entreprises.',
        setupDetails: 'Configuration du site, SSL et securisation de base',
        monthlyDetails: 'Hebergement gere, mises a jour mineures, support email',
        features: [
          'Pages: 1 a 3',
          'Design moderne et responsive',
          '1 boite mail pro (1ere annee gratuite, 36$/an apres)',
          'Certificat SSL et durcissement securite',
          'Formulaire de contact / capture de leads',
          'SEO on-page de base (title/meta, sitemap)',
          'Modeles conformes accessibilite',
          'Images libres ou couleurs simples',
          'Hebergement gere 1 an',
          'Mises a jour mensuelles mineures et support email',
        ],
      },
      starterPlus: {
        setupPrice: '$999',
        monthlyPrice: '$65',
        priceNote: 'mise en place',
        monthlyNote: '/ mois',
        description: 'Pour PME en croissance avec plus de pages et d’options.',
        setupDetails: 'Pages supplementaires et personnalisation de marque',
        monthlyDetails: 'Hebergement gere, sauvegardes et support prioritaire',
        features: [
          'Pages: 4 a 6',
          'Tout de Mini, plus :',
          '2 boites mail pro (1ere annee gratuite, 36$/an apres)',
          'Modeles de pages et sections additionnels',
          'Sections A propos, Services, Equipe personnalisables',
          'Personnalisation de marque (logo, palette de couleurs)',
          'Blog / module d’actualites',
          'Google Analytics et suivi',
          'Sauvegarde sur site et options de rollback',
          'Reponse prioritaire pour les tickets',
        ],
      },
      professional: {
        setupPrice: '$2,499',
        monthlyPrice: '$150',
        priceNote: 'mise en place',
        monthlyNote: '/ mois',
        description: 'Pour entreprises etablies et organisations.',
        popular: 'Le plus populaire',
        features: [
          'Pages: jusqu’a 12',
          'Tout de Plus, plus :',
          '3 boites mail pro (1ere annee gratuite, 36$/an apres)',
          'Design avance avec animations/micro-interactions',
          'CMS pour mises a jour faciles',
          'Formulaires reutilisables et sections dynamiques (cas, equipe, avis)',
          'SEO on-site complet (schema, images, GSC)',
          'Integrations tierces (calendrier, CRM, reservation, reseaux)',
          'Visuels premium, graphisme et iconographie',
          'Tableau de bord analytics avance',
          '3 mois de mises a jour/maintenance inclus',
        ],
      },
      enterprise: {
        title: 'Premium / Enterprise',
        setupPrice: '$5,999+',
        monthlyPrice: '$350+',
        priceNote: 'mise en place',
        monthlyNote: '/ mois',
        description: 'Pour entreprises, startups, agences ou e-commerce.',
        features: [
          'Pages: illimitees',
          'Tout de Pro, plus :',
          '5 boites mail pro (1ere annee gratuite, 36$/an apres)',
          'UX/UI complete (parcours, wireframes, branding avance)',
          'E‑commerce ou portail/membres si besoin',
          'Integrations backend/API sur mesure',
          'Multilingue (sur demande)',
          'Serveur dedie ou cloud securise et scalable',
          'Strategie de contenu, SEO premium et marketing de lancement',
          'Optimisation performance (CDN, cache, images/videos)',
          'Reporting mensuel, revues analytics, support 24/7',
          '6 mois de support et maintenance continus',
        ],
      },
    },
    en: {
      starterMini: {
        setupPrice: '$499',
        monthlyPrice: '$45',
        priceNote: 'setup',
        monthlyNote: '/ month',
        description: 'For freelancers, solopreneurs, and microbusinesses.',
        setupDetails: 'Site setup with SSL and basic hardening',
        monthlyDetails: 'Managed hosting, minor updates, email support',
        features: [
          'Pages: 1–3',
          'Modern, responsive design',
          '1 professional mailbox (1st year free, $36/year after)',
          'SSL certificate & security hardening',
          'Contact or lead capture form',
          'Basic on-page SEO (title/meta, sitemap)',
          'Accessibility-compliant templates',
          'Stock images or simple brand colors',
          '1 year managed hosting',
          'Monthly minor updates & email support',
        ],
      },
      starterPlus: {
        setupPrice: '$999',
        monthlyPrice: '$65',
        priceNote: 'setup',
        monthlyNote: '/ month',
        description: 'For small to mid-sized growing businesses.',
        setupDetails: 'Extra pages and brand customization',
        monthlyDetails: 'Managed hosting with backups and priority support',
        features: [
          'Pages: 4–6',
          'Everything in Mini, plus:',
          '2 professional mailboxes (1st year free, $36/year after)',
          'Additional page and section templates',
          'Customizable About, Services, Team sections',
          'Enhanced brand customization (logo placement, color palette)',
          'Blog or news module integration',
          'Google Analytics & tracking setup',
          'On-site backup & rollback options',
          'Prioritized response for support tickets',
        ],
      },
      professional: {
        setupPrice: '$2,499',
        monthlyPrice: '$150',
        priceNote: 'setup',
        monthlyNote: '/ month',
        description: 'For established businesses and organizations.',
        popular: 'Most Popular',
        features: [
          'Pages: up to 12',
          'Everything in Plus, plus:',
          '3 professional mailboxes (1st year free, $36/year after)',
          'Advanced custom design with animations/micro-interactions',
          'Content Management System (CMS) for easy updates',
          'Custom reusable forms, dynamic sections (case studies, team, testimonials)',
          'Comprehensive on-site SEO (schema, image optimization, GSC integration)',
          'Third-party integrations: calendar, CRM, booking, or social feeds',
          'Premium image assets, graphic design, or custom iconography',
          'Advanced analytics dashboard',
          '3 months major updates/maintenance included',
        ],
      },
      enterprise: {
        title: 'Premium / Enterprise',
        setupPrice: '$5,999+',
        monthlyPrice: '$350+',
        priceNote: 'setup',
        monthlyNote: '/ month',
        description: 'For enterprises, startups, agencies, or e‑commerce.',
        features: [
          'Pages: unlimited',
          'Everything in Pro, plus:',
          '5 professional mailboxes (1st year free, $36/year after)',
          'Full custom UX/UI (user flows, wireframes, advanced branding)',
          'E‑commerce or membership/portal features (if needed)',
          'Custom backend/API integrations',
          'Multi-language support (if requested)',
          'Dedicated server or cloud hosting with advanced security & scalability',
          'Full content strategy, premium SEO, and digital marketing kickoff',
          'Performance tuning (CDN, caching, image/video optimization)',
          'Monthly reporting, analytics reviews, 24/7 emergency support',
          '6 months ongoing support and maintenance',
        ],
      },
    },
  };

  const handlePlanSelect = (planName, price) => {
    const priceStr = price || planName;
    prefillContactForm({
      inquiryType: language === 'fr' ? 'Devis' : 'Quote',
      subject: `${language === 'fr' ? 'Forfait' : 'Plan'} ${planName} - ${priceStr}`,
      message: language === 'fr'
        ? `Je suis intéressé par le forfait ${planName}. Voici les détails de mon projet:\n\n`
        : `I am interested in the ${planName} plan. Here are my project details:\n\n`
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

  const o = overrides[language];
  const pricingTiers = [
    {
      ...t.pricing.starterMini,
      ...(o?.starterMini || {}),
      highlighted: false,
      isStarter: true
    },
    {
      ...t.pricing.starterPlus,
      ...(o?.starterPlus || {}),
      highlighted: false,
      isStarter: true
    },
    {
      ...t.pricing.professional,
      ...(o?.professional || {}),
      highlighted: true,
      isStarter: false
    },
    {
      ...t.pricing.enterprise,
      ...(o?.enterprise || {}),
      highlighted: false,
      isStarter: false
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

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
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
                className={`h-full flex flex-col p-6 relative ${
                  tier.highlighted ? 'ring-2 ring-secondary' : ''
                }`}
              >
                {tier.highlighted && tier.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-secondary text-white px-4 py-1 rounded-full text-sm font-bold whitespace-nowrap">
                    {tier.popular}
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-xl font-bold text-white mb-2">{tier.title}</h3>

                  {tier.setupPrice && tier.monthlyPrice ? (
                    <div className="mb-4 space-y-2">
                      <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                        <div className="flex items-baseline justify-between mb-1">
                          <span className="text-sm text-white/60">{language === 'fr' ? 'Mise en place' : 'Setup'}</span>
                          <span className="text-lg font-bold text-secondary">{tier.setupPrice}</span>
                        </div>
                        <p className="text-xs text-white/50">{tier.priceNote}</p>
                        <p className="text-xs text-white/70 mt-1">{tier.setupDetails}</p>
                      </div>
                      <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                        <div className="flex items-baseline justify-between mb-1">
                          <span className="text-sm text-white/60">{language === 'fr' ? 'Mensuel' : 'Monthly'}</span>
                          <span className="text-lg font-bold text-secondary">{tier.monthlyPrice}</span>
                        </div>
                        <p className="text-xs text-white/50">{tier.monthlyNote}</p>
                        <p className="text-xs text-white/70 mt-1">{tier.monthlyDetails}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-baseline mb-4">
                      <span className="text-3xl font-bold text-secondary">{tier.price}</span>
                      <span className="text-white/60 ml-2 text-sm">{tier.priceNote}</span>
                    </div>
                  )}

                  <p className="text-white/70 text-sm">{tier.description}</p>
                </div>

                <ul className="space-y-2 mb-6 flex-grow">
                  {tier.features.map((feature, i) => (
                    <li key={i} className="flex items-start text-white/80 text-sm">
                      <Check className="w-4 h-4 text-secondary mr-2 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <GlassButton
                  variant={tier.highlighted ? 'accent' : 'secondary'}
                  onClick={() => handlePlanSelect(tier.title, tier.price || tier.setupPrice)}
                  className="w-full py-2.5 text-sm"
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

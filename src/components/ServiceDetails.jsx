import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { GlassButton } from '@/components/ui/glass-card';

const ServiceDetails = ({ service, isOpen, onClose, onSelect }) => {
  if (!service) return null;

  const handleSelectService = () => {
    if (onSelect) {
      onSelect(service.title);
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

  const serviceDetails = {
    'Design de Sites Web': {
      overview: 'Nous créons des sites web modernes qui reflètent votre identité de marque et convertissent vos visiteurs en clients fidèles.',
      process: [
        'Analyse de vos besoins et objectifs',
        'Création de maquettes et prototypes',
        'Design responsive pour tous les appareils',
        'Révisions jusqu\'à satisfaction complète'
      ],
      deliverables: [
        'Maquettes haute fidélité',
        'Guide de style visuel',
        'Assets optimisés pour le web',
        'Documentation complète'
      ],
      timeline: '2-3 semaines',
      idealFor: 'Entreprises cherchant à établir ou renouveler leur présence en ligne avec un design professionnel et moderne.'
    },
    'Développement Web': {
      overview: 'Nous développons des sites web performants, sécurisés et faciles à maintenir, en utilisant les technologies les plus récentes.',
      process: [
        'Architecture technique et planification',
        'Développement itératif avec feedback régulier',
        'Tests rigoureux sur tous les navigateurs',
        'Déploiement et configuration'
      ],
      deliverables: [
        'Code source propre et documenté',
        'Site web entièrement fonctionnel',
        'Configuration d\'hébergement',
        'Formation à la gestion du contenu'
      ],
      timeline: '3-6 semaines',
      idealFor: 'Projets nécessitant des fonctionnalités personnalisées, des intégrations complexes ou une performance optimale.'
    },
    'Applications Web': {
      overview: 'Développement d\'applications web progressives offrant une expérience utilisateur fluide, même hors ligne.',
      process: [
        'Définition des fonctionnalités clés',
        'Architecture de l\'application',
        'Développement front-end et back-end',
        'Tests utilisateurs et optimisation'
      ],
      deliverables: [
        'Application web installable',
        'Backend sécurisé et scalable',
        'API documentée',
        'Tableau de bord administrateur'
      ],
      timeline: '6-12 semaines',
      idealFor: 'Entreprises souhaitant offrir une expérience application native sans développer pour iOS et Android.'
    },
    'Identité Visuelle': {
      overview: 'Création d\'une identité de marque cohérente et mémorable qui vous distingue de la concurrence.',
      process: [
        'Recherche et analyse de votre secteur',
        'Concepts et propositions créatives',
        'Raffinement du design sélectionné',
        'Création de la charte graphique complète'
      ],
      deliverables: [
        'Logo professionnel (plusieurs formats)',
        'Palette de couleurs',
        'Typographie de marque',
        'Guidelines d\'utilisation'
      ],
      timeline: '2-4 semaines',
      idealFor: 'Nouvelles entreprises ou organisations en rebranding cherchant une identité visuelle forte et professionnelle.'
    },
    'Solutions Backend': {
      overview: 'Développement d\'architectures backend robustes, scalables et sécurisées pour vos applications complexes.',
      process: [
        'Analyse des besoins fonctionnels',
        'Design de la base de données',
        'Développement des API',
        'Tests de charge et sécurité'
      ],
      deliverables: [
        'API REST ou GraphQL documentée',
        'Base de données optimisée',
        'Infrastructure cloud configurée',
        'Monitoring et logs'
      ],
      timeline: '4-8 semaines',
      idealFor: 'Applications nécessitant une gestion de données complexe, des intégrations multiples ou une haute disponibilité.'
    },
    'Optimisation & SEO': {
      overview: 'Amélioration des performances et du référencement pour maximiser votre visibilité et l\'expérience utilisateur.',
      process: [
        'Audit complet de votre site',
        'Identification des opportunités',
        'Implémentation des optimisations',
        'Suivi et rapports de performance'
      ],
      deliverables: [
        'Rapport d\'audit détaillé',
        'Optimisations techniques',
        'Stratégie de contenu SEO',
        'Configuration analytics'
      ],
      timeline: '2-4 semaines',
      idealFor: 'Sites existants cherchant à améliorer leur classement Google, leur vitesse de chargement et leur taux de conversion.'
    }
  };

  const details = serviceDetails[service.title] || {};

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="fixed inset-4 md:inset-8 lg:inset-16 bg-white rounded-2xl shadow-2xl z-50 overflow-hidden"
          >
            <div className="h-full flex flex-col">
              <div className="bg-gradient-to-r from-primary to-primary/80 text-white p-6 md:p-8">
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
                  <section>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">Aperçu</h3>
                    <p className="text-gray-700 leading-relaxed">{details.overview}</p>
                  </section>

                  <div className="grid md:grid-cols-2 gap-8">
                    <section>
                      <h3 className="text-xl font-bold text-gray-900 mb-4">Notre Processus</h3>
                      <ol className="space-y-3">
                        {details.process?.map((step, index) => (
                          <li key={index} className="flex items-start">
                            <span className="bg-primary text-white font-bold rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">
                              {index + 1}
                            </span>
                            <span className="text-gray-700 pt-1">{step}</span>
                          </li>
                        ))}
                      </ol>
                    </section>

                    <section>
                      <h3 className="text-xl font-bold text-gray-900 mb-4">Livrables</h3>
                      <ul className="space-y-3">
                        {details.deliverables?.map((item, index) => (
                          <li key={index} className="flex items-start">
                            <div className="bg-primary/10 rounded-full w-2 h-2 mt-2 mr-3 flex-shrink-0" />
                            <span className="text-gray-700">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </section>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <section className="bg-gray-50 rounded-xl p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Durée estimée</h3>
                      <p className="text-2xl font-bold text-primary">{details.timeline}</p>
                    </section>

                    <section className="bg-gray-50 rounded-xl p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Idéal pour</h3>
                      <p className="text-gray-700">{details.idealFor}</p>
                    </section>
                  </div>

                  <section className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 md:p-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">Caractéristiques incluses</h3>
                    <ul className="grid md:grid-cols-2 gap-3">
                      {service.features?.map((feature, index) => (
                        <li key={index} className="flex items-center text-gray-700">
                          <div className="w-2 h-2 bg-primary rounded-full mr-3" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </section>
                </div>
              </div>

              <div className="border-t border-gray-200 p-6 md:p-8 glass-effect">
                <div className="max-w-4xl mx-auto flex flex-col sm:flex-row gap-4 justify-between items-center">
                  <p className="text-gray-700 text-center sm:text-left">
                    Intéressé par ce service ? Discutons de votre projet.
                  </p>
                  <GlassButton
                    variant="primary"
                    onClick={handleSelectService}
                    className="px-8 py-3 w-full sm:w-auto"
                  >
                    Demander un devis
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

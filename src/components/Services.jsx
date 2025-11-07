import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Globe, Code2, Smartphone, Palette, Database, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ServiceDetails from '@/components/ServiceDetails';

const Services = () => {
  const [selectedService, setSelectedService] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLearnMore = (service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedService(null), 300);
  };

  const services = [
    {
      icon: Globe,
      title: 'Design de Sites Web',
      description: 'Création de sites web modernes, responsive et optimisés pour convertir vos visiteurs en clients.',
      features: ['Design sur mesure', 'UX/UI optimisé', 'Responsive design', 'SEO intégré']
    },
    {
      icon: Code2,
      title: 'Développement Web',
      description: 'Développement de sites et applications web performants avec les technologies les plus récentes.',
      features: ['Code propre', 'Performance optimale', 'Sécurité renforcée', 'Maintenance incluse']
    },
    {
      icon: Smartphone,
      title: 'Applications Web',
      description: 'Applications web progressives (PWA) offrant une expérience utilisateur exceptionnelle.',
      features: ['Multi-plateforme', 'Hors ligne', 'Notifications push', 'Installation facile']
    },
    {
      icon: Palette,
      title: 'Identité Visuelle',
      description: 'Création d\'une identité de marque forte et cohérente pour vous démarquer.',
      features: ['Logo professionnel', 'Charte graphique', 'Brand guidelines', 'Assets digitaux']
    },
    {
      icon: Database,
      title: 'Solutions Backend',
      description: 'Architecture backend robuste et scalable pour vos applications complexes.',
      features: ['API REST/GraphQL', 'Base de données', 'Cloud hosting', 'Sécurité avancée']
    },
    {
      icon: Zap,
      title: 'Optimisation & SEO',
      description: 'Amélioration des performances et du référencement pour maximiser votre visibilité.',
      features: ['Audit SEO', 'Optimisation vitesse', 'Analytics', 'Stratégie contenu']
    }
  ];

  return (
    <section id="services" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Nos Services
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Des solutions complètes pour tous vos besoins digitaux, de la conception à la mise en ligne.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100"
            >
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <service.icon className="text-primary" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">{service.title}</h3>
              <p className="text-gray-600 mb-6">{service.description}</p>
              <ul className="space-y-2 mb-6">
                {service.features.map((feature) => (
                  <li key={feature} className="flex items-center text-sm text-gray-700">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button variant="outline" className="w-full group" onClick={() => handleLearnMore(service)}>
                En savoir plus
                <motion.span
                  className="ml-2"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  →
                </motion.span>
              </Button>
            </motion.div>
          ))}
        </div>
      </div>

      <ServiceDetails
        service={selectedService}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </section>
  );
};

export default Services;
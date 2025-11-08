import React from 'react';
import { motion } from 'framer-motion';
import { Target, Eye, Award, Users } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';

const About = () => {
  const values = [
    {
      icon: Target,
      title: 'Notre Mission',
      description: 'Créer des solutions web innovantes qui transforment les idées en succès digitaux mesurables.',
      color: 'bg-primary/30 text-white'
    },
    {
      icon: Eye,
      title: 'Notre Vision',
      description: 'Être le partenaire de confiance pour les entreprises cherchant l\'excellence digitale.',
      color: 'bg-secondary/30 text-white'
    },
    {
      icon: Award,
      title: 'Excellence',
      description: 'Qualité irréprochable, respect des délais et satisfaction client au cœur de nos priorités.',
      color: 'bg-primary/30 text-white'
    },
    {
      icon: Users,
      title: 'Collaboration',
      description: 'Travailler main dans la main avec nos clients pour des résultats qui dépassent les attentes.',
      color: 'bg-secondary/30 text-white'
    }
  ];

  return (
    <section id="about" className="min-h-screen py-20 flex items-center">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Qui Sommes-Nous ?
          </h2>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto">
            Une équipe passionnée de professionnels du web dédiée à transformer vos ambitions digitales en réalité concrète.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <GlassCard
              key={value.title}
              as={motion.div}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="p-6"
            >
              <div className={`w-16 h-16 rounded-full ${value.color} flex items-center justify-center mb-4`}>
                <value.icon size={32} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{value.title}</h3>
              <p className="text-gray-200">{value.description}</p>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
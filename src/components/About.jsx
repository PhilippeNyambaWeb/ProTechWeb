import React from 'react';
import { motion } from 'framer-motion';
import { Target, Eye, Award, Users } from 'lucide-react';

const About = () => {
  const values = [
    {
      icon: Target,
      title: 'Notre Mission',
      description: 'Créer des solutions web innovantes qui transforment les idées en succès digitaux mesurables.',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      icon: Eye,
      title: 'Notre Vision',
      description: 'Être le partenaire de confiance pour les entreprises cherchant l\'excellence digitale.',
      color: 'bg-purple-100 text-purple-600'
    },
    {
      icon: Award,
      title: 'Excellence',
      description: 'Qualité irréprochable, respect des délais et satisfaction client au cœur de nos priorités.',
      color: 'bg-green-100 text-green-600'
    },
    {
      icon: Users,
      title: 'Collaboration',
      description: 'Travailler main dans la main avec nos clients pour des résultats qui dépassent les attentes.',
      color: 'bg-orange-100 text-orange-600'
    }
  ];

  return (
    <section id="about" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Qui Sommes-Nous ?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Une équipe passionnée de professionnels du web dédiée à transformer vos ambitions digitales en réalité concrète.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className={`w-16 h-16 rounded-full ${value.color} flex items-center justify-center mb-4`}>
                <value.icon size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
              <p className="text-gray-600">{value.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;

import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      name: 'Marie Dubois',
      company: 'Boutique en Ligne',
      rating: 5,
      text: 'ProTechWeb a transformé notre présence en ligne. Le site est magnifique, rapide et nos ventes ont augmenté de 150% en 3 mois !',
      image: 'Professional businesswoman smiling in modern office'
    },
    {
      name: 'Jean Martin',
      company: 'Startup Tech',
      rating: 5,
      text: 'Une équipe exceptionnelle qui comprend vraiment nos besoins. L\'application web développée dépasse toutes nos attentes.',
      image: 'Young entrepreneur working on laptop in startup office'
    },
    {
      name: 'Sophie Laurent',
      company: 'Agence Marketing',
      rating: 5,
      text: 'Professionnalisme, créativité et respect des délais. Je recommande vivement ProTechWeb pour tous vos projets web.',
      image: 'Marketing professional presenting to team'
    },
    {
      name: 'Pierre Rousseau',
      company: 'Restaurant Gastronomique',
      rating: 5,
      text: 'Notre nouveau site web attire beaucoup plus de clients. Le design est élégant et reflète parfaitement notre image.',
      image: 'Restaurant owner in elegant dining room'
    },
    {
      name: 'Isabelle Bernard',
      company: 'Cabinet Médical',
      rating: 5,
      text: 'Un système de prise de rendez-vous en ligne qui facilite la vie de nos patients. Merci pour cette solution sur mesure !',
      image: 'Medical professional in modern clinic'
    },
    {
      name: 'Thomas Petit',
      company: 'E-commerce Mode',
      rating: 5,
      text: 'L\'équipe a créé une boutique en ligne performante et sécurisée. Nos clients adorent l\'expérience d\'achat.',
      image: 'Fashion entrepreneur in stylish boutique'
    }
  ];

  return (
    <section id="testimonials" className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Ce Que Disent Nos Clients
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            La satisfaction de nos clients est notre plus grande réussite. Découvrez leurs témoignages.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Quote className="text-primary/20 mb-4" size={40} />
              
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="text-yellow-400 fill-yellow-400" size={20} />
                ))}
              </div>

              <p className="text-gray-700 mb-6 italic">"{testimonial.text}"</p>

              <div className="flex items-center">
                <img alt={`${testimonial.name} profile`} className="w-12 h-12 rounded-full object-cover mr-4" src="https://images.unsplash.com/photo-1595872018818-97555653a011" />
                <div>
                  <p className="font-bold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-600">{testimonial.company}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;

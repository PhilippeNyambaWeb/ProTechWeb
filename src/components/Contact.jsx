import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [errors, setErrors] = useState({});

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom est requis';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Email invalide';
    }
    if (!formData.subject.trim()) {
      newErrors.subject = 'Le sujet est requis';
    }
    if (!formData.message.trim()) {
      newErrors.message = 'Le message est requis';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast({
        title: "Erreur de validation",
        description: "Veuillez remplir tous les champs obligatoires correctement.",
      });
      return;
    }

    setErrors({});
    const contacts = JSON.parse(localStorage.getItem('contacts') || '[]');
    contacts.push({
      ...formData,
      date: new Date().toISOString()
    });
    localStorage.setItem('contacts', JSON.stringify(contacts));

    toast({
      title: "Message envoyé ! 🎉",
      description: "Nous vous répondrons dans les plus brefs délais.",
    });

    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <section id="contact" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Contactez-Nous
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Prêt à démarrer votre projet ? Parlons-en ensemble et créons quelque chose d'extraordinaire.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Mail className="text-primary" size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Email</h3>
                  <p className="text-gray-600">contact@protechweb.ca</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Phone className="text-primary" size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Téléphone</h3>
                  <p className="text-gray-600">+1 (514) 994-4689</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <MapPin className="text-primary" size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Adresse</h3>
                  <p className="text-gray-600">2-545 Rue Saint-Germain</p>
                  <p className="text-gray-600">Saint-Lauren, QC, H4L 3R3</p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 mt-8">
                <h3 className="font-bold text-gray-900 mb-3">Horaires d'ouverture</h3>
                <div className="space-y-2 text-gray-700">
                  <p>Lundi - Jeudi: 9h00 - 16h00</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <form onSubmit={handleSubmit} className="space-y-6 bg-gray-50 rounded-xl p-8">
              <div>
                <Label htmlFor="name">Nom complet *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className={`mt-2 ${errors.name ? 'border-red-500' : ''}`}
                  placeholder="Votre nom"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className={`mt-2 ${errors.email ? 'border-red-500' : ''}`}
                  placeholder="votre@email.com"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <Label htmlFor="phone">Téléphone</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  className="mt-2"
                  placeholder="+1 (514) 123-4567"
                />
              </div>

              <div>
                <Label htmlFor="subject">Sujet *</Label>
                <Input
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className={`mt-2 ${errors.subject ? 'border-red-500' : ''}`}
                  placeholder="Objet de votre message"
                />
                {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject}</p>}
              </div>

              <div>
                <Label htmlFor="message">Message *</Label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className={`mt-2 min-h-[150px] ${errors.message ? 'border-red-500' : ''}`}
                  placeholder="Décrivez votre projet..."
                />
                {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
              </div>

              <Button type="submit" className="w-full bg-primary hover:bg-primary/90" size="lg">
                Envoyer le message
                <Send className="ml-2 h-5 w-5" />
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
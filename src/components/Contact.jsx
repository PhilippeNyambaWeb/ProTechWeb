import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { GlassCard, GlassButton } from '@/components/ui/glass-card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useScroll } from '@/contexts/ScrollContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslations } from '@/lib/translations';

const Contact = () => {
  const { toast } = useToast();
  const { language } = useLanguage();
  const t = useTranslations(language);
  const { formPrefill, clearFormPrefill } = useScroll();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    inquiryType: '',
    honeypot: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionId, setSubmissionId] = useState('');

  useEffect(() => {
    if (formPrefill && (formPrefill.inquiryType || formPrefill.subject || formPrefill.message)) {
      setFormData(prev => ({
        ...prev,
        inquiryType: formPrefill.inquiryType || prev.inquiryType,
        subject: formPrefill.subject || prev.subject,
        message: formPrefill.message || prev.message
      }));
      clearFormPrefill();
    }
  }, [formPrefill, clearFormPrefill]);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (formData.honeypot) {
      console.warn('Spam detected via honeypot field');
      return;
    }

    if (!formData.name.trim()) {
      newErrors.name = t.contact.form.required;
    }
    if (!formData.email.trim()) {
      newErrors.email = t.contact.form.required;
    } else if (!validateEmail(formData.email)) {
      newErrors.email = t.contact.form.emailInvalid;
    }
    if (!formData.subject.trim()) {
      newErrors.subject = t.contact.form.required;
    }
    if (!formData.message.trim()) {
      newErrors.message = t.contact.form.required;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast({
        title: "Erreur de validation",
        description: "Veuillez remplir tous les champs obligatoires correctement.",
        variant: "destructive"
      });
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-contact-email`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmissionId(data.submissionId || '');

        toast({
          title: "Message envoy\u00E9 avec succ\u00E8s !",
          description: data.confirmationSent
            ? "Un email de confirmation vous a \u00E9t\u00E9 envoy\u00E9. Nous vous r\u00E9pondrons dans les 24 \u00E0 48 heures."
            : data.message || "Nous vous r\u00E9pondrons dans les 24 \u00E0 48 heures.",
          duration: 8000
        });

        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
          inquiryType: '',
          honeypot: ''
        });
      } else {
        throw new Error(data.error || 'Une erreur est survenue');
      }
    } catch (error) {
      console.error('Error sending contact form:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue, merci de r\u00E9essayer ou de nous appeler au +1 (514) 994-4689.",
        variant: "destructive",
        duration: 6000
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <section id="contact" className="min-h-screen py-20 flex items-center">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {t.contact.title}
          </h2>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto">
            {t.contact.subtitle}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          <GlassCard
            as={motion.div}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="p-8"
          >
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Mail className="text-secondary" size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-white mb-1">{t.contact.info.email}</h3>
                  <p className="text-gray-200">contact@protechweb.ca</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Phone className="text-secondary" size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-white mb-1">{t.contact.info.phone}</h3>
                  <p className="text-gray-200">+1 (514) 994-4689</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <MapPin className="text-secondary" size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-white mb-1">Adresse</h3>
                  <p className="text-gray-200">2-545 Rue Saint-Germain</p>
                  <p className="text-gray-200">Saint-Laurent, QC, H4L 3R3</p>
                </div>
              </div>

              {/* <div className="backdrop-blur-sm bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl p-6 mt-8 border border-white/30">
                <h3 className="font-bold text-white mb-3">{t.contact.info.hours}</h3>
                <div className="space-y-2 text-gray-200">
                  <p>{t.contact.info.hoursValue}</p>
                </div>
              </div> */}
            </div>
          </GlassCard>

          <GlassCard
            as={motion.div}
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="p-8"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="hidden" aria-hidden="true">
                <Input
                  id="website"
                  name="honeypot"
                  type="text"
                  value={formData.honeypot}
                  onChange={handleChange}
                  tabIndex="-1"
                  autoComplete="off"
                />
              </div>

              <div>
                <Label htmlFor="name">{t.contact.form.name} *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                  className={`mt-2 ${errors.name ? 'border-red-500' : ''}`}
                  placeholder={t.contact.form.namePlaceholder}
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <Label htmlFor="email">{t.contact.form.email} *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                  className={`mt-2 ${errors.email ? 'border-red-500' : ''}`}
                  placeholder={t.contact.form.emailPlaceholder}
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <Label htmlFor="phone">{t.contact.form.phone}</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="mt-2"
                  placeholder={t.contact.form.phonePlaceholder}
                />
              </div>

              <div>
                <Label htmlFor="inquiryType">{t.contact.form.inquiryType}</Label>
                <select
                  id="inquiryType"
                  name="inquiryType"
                  value={formData.inquiryType}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">{t.contact.form.inquiryPlaceholder}</option>
                  <option value="webDesign">{t.contact.form.inquiryTypes.webDesign}</option>
                  <option value="webDev">{t.contact.form.inquiryTypes.webDev}</option>
                  <option value="webApp">{t.contact.form.inquiryTypes.webApp}</option>
                  <option value="branding">{t.contact.form.inquiryTypes.branding}</option>
                  <option value="ecommerce">{t.contact.form.inquiryTypes.ecommerce}</option>
                  <option value="backend">{t.contact.form.inquiryTypes.backend}</option>
                  <option value="other">{t.contact.form.inquiryTypes.other}</option>
                </select>
              </div>

              <div>
                <Label htmlFor="subject">{t.contact.form.subject} *</Label>
                <Input
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                  className={`mt-2 ${errors.subject ? 'border-red-500' : ''}`}
                  placeholder={t.contact.form.subjectPlaceholder}
                />
                {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject}</p>}
              </div>

              <div>
                <Label htmlFor="message">{t.contact.form.message} *</Label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                  className={`mt-2 min-h-[150px] ${errors.message ? 'border-red-500' : ''}`}
                  placeholder={t.contact.form.messagePlaceholder}
                />
                {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
              </div>

              {submissionId && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-sm text-green-800">
                    {'Votre num\u00E9ro de r\u00E9f\u00E9rence: '}<strong>{submissionId}</strong>
                  </p>
                </div>
              )}

              <GlassButton
                type="submit"
                variant="accent"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="mr-2"
                    >
                      â³
                    </motion.div>
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    {isSubmitting ? t.contact.form.sending : t.contact.form.submit}
                    <Send className="ml-2 h-5 w-5" />
                  </>
                )}
              </GlassButton>

              <p className="text-xs text-center text-gray-500">
                {'En soumettant ce formulaire, vous acceptez que nous traitions vos donn\u00E9es conform\u00E9ment \u00E0 notre politique de confidentialit\u00E9.'}
              </p>
            </form>
          </GlassCard>
        </div>
      </div>
    </section>
  );
};

export default Contact;






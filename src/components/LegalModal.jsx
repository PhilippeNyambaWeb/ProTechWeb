import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const LegalModal = ({ isOpen, onClose, type }) => {
  const { language } = useLanguage();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const content = {
    privacy: {
      fr: {
        title: 'Politique de confidentialité',
        sections: [
          {
            title: 'Collecte des informations',
            text: 'Nous collectons les informations que vous nous fournissez directement (nom, email, téléphone) lorsque vous nous contactez via notre formulaire.'
          },
          {
            title: 'Utilisation des données',
            text: 'Vos informations sont utilisées uniquement pour répondre à vos demandes, fournir nos services et améliorer votre expérience sur notre site.'
          },
          {
            title: 'Protection',
            text: 'Nous utilisons des mesures de sécurité appropriées pour protéger vos données contre tout accès ou divulgation non autorisés.'
          },
          {
            title: 'Vos droits',
            text: 'Vous avez le droit d\'accéder, de corriger ou de supprimer vos données. Contactez-nous à contact@protechweb.ca pour exercer ces droits.'
          }
        ]
      },
      en: {
        title: 'Privacy Policy',
        sections: [
          {
            title: 'Information Collection',
            text: 'We collect information you provide directly to us (name, email, phone) when you contact us through our form.'
          },
          {
            title: 'Data Usage',
            text: 'Your information is used only to respond to your inquiries, provide our services, and improve your experience on our site.'
          },
          {
            title: 'Protection',
            text: 'We use appropriate security measures to protect your data from unauthorized access or disclosure.'
          },
          {
            title: 'Your Rights',
            text: 'You have the right to access, correct, or delete your data. Contact us at contact@protechweb.ca to exercise these rights.'
          }
        ]
      }
    },
    terms: {
      fr: {
        title: 'Conditions d\'utilisation',
        sections: [
          {
            title: 'Acceptation',
            text: 'En utilisant ce site, vous acceptez nos conditions d\'utilisation et toutes les lois applicables.'
          },
          {
            title: 'Propriété intellectuelle',
            text: 'Tout le contenu (textes, images, logos) est la propriété de ProTechWeb et protégé par le droit d\'auteur.'
          },
          {
            title: 'Utilisation',
            text: 'Vous pouvez consulter notre site à des fins personnelles et non commerciales. Toute reproduction nécessite notre autorisation.'
          },
          {
            title: 'Limitation de responsabilité',
            text: 'ProTechWeb ne peut être tenu responsable des dommages indirects résultant de l\'utilisation de notre site.'
          }
        ]
      },
      en: {
        title: 'Terms of Service',
        sections: [
          {
            title: 'Acceptance',
            text: 'By using this site, you accept our terms of service and all applicable laws.'
          },
          {
            title: 'Intellectual Property',
            text: 'All content (text, images, logos) is the property of ProTechWeb and protected by copyright.'
          },
          {
            title: 'Usage',
            text: 'You may view our site for personal and non-commercial purposes. Any reproduction requires our permission.'
          },
          {
            title: 'Limitation of Liability',
            text: 'ProTechWeb cannot be held liable for indirect damages resulting from the use of our site.'
          }
        ]
      }
    },
    legal: {
      fr: {
        title: 'Mentions légales',
        sections: [
          {
            title: 'Éditeur',
            text: 'ProTechWeb\nEmail: contact@protechweb.ca\nTéléphone: +1 (514) 994-4689'
          },
          {
            title: 'Hébergement',
            text: 'Ce site est hébergé sur des services professionnels conformes aux normes de sécurité.'
          },
          {
            title: 'Propriété intellectuelle',
            text: 'L\'ensemble du contenu est la propriété de ProTechWeb. Toute reproduction est interdite sans autorisation.'
          },
          {
            title: 'Données personnelles',
            text: 'Conformément à la loi, vous disposez d\'un droit d\'accès et de rectification des données vous concernant.'
          }
        ]
      },
      en: {
        title: 'Legal Notice',
        sections: [
          {
            title: 'Publisher',
            text: 'ProTechWeb\nEmail: contact@protechweb.ca\nPhone: +1 (514) 994-4689'
          },
          {
            title: 'Hosting',
            text: 'This site is hosted on professional services compliant with security standards.'
          },
          {
            title: 'Intellectual Property',
            text: 'All content is the property of ProTechWeb. Any reproduction is prohibited without authorization.'
          },
          {
            title: 'Personal Data',
            text: 'In accordance with the law, you have the right to access and rectify data concerning you.'
          }
        ]
      }
    },
    refund: {
      fr: {
        title: 'Politique de remboursement',
        sections: [
          {
            title: 'Acompte initial',
            text: 'Un acompte de 50% est requis au début du projet. Cet acompte est non remboursable une fois le travail commencé.'
          },
          {
            title: 'Annulation',
            text: 'Si vous annulez le projet avant le début des travaux, l\'acompte sera remboursé à 100%. Après le début, le remboursement sera calculé au prorata du travail effectué.'
          },
          {
            title: 'Satisfaction garantie',
            text: 'Nous nous engageons à votre satisfaction. Si vous n\'êtes pas satisfait, nous effectuerons les révisions nécessaires jusqu\'à ce que vous le soyez.'
          },
          {
            title: 'Délai de demande',
            text: 'Toute demande de remboursement doit être faite par écrit dans les 7 jours suivant la livraison finale du projet.'
          }
        ]
      },
      en: {
        title: 'Refund Policy',
        sections: [
          {
            title: 'Initial Deposit',
            text: 'A 50% deposit is required at the start of the project. This deposit is non-refundable once work has begun.'
          },
          {
            title: 'Cancellation',
            text: 'If you cancel the project before work begins, the deposit will be 100% refunded. After work starts, refunds will be calculated proportionally to work completed.'
          },
          {
            title: 'Satisfaction Guaranteed',
            text: 'We are committed to your satisfaction. If you are not satisfied, we will make necessary revisions until you are.'
          },
          {
            title: 'Request Timeline',
            text: 'Any refund request must be made in writing within 7 days of final project delivery.'
          }
        ]
      }
    }
  };

  if (!isOpen || !type) return null;

  const data = content[type]?.[language];

  if (!data) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-4xl max-h-[85vh] backdrop-blur-xl bg-gradient-to-br from-gray-900/95 to-gray-800/95 rounded-2xl shadow-2xl border border-white/20 flex flex-col z-10"
          >
            <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/5 flex-shrink-0">
              <h2 className="text-2xl md:text-3xl font-bold text-white">{data.title}</h2>
              <button
                onClick={onClose}
                className="bg-white/10 hover:bg-white/20 rounded-full p-2 transition-all duration-200 hover:scale-110"
                aria-label="Close"
              >
                <X size={24} className="text-white" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 md:p-8 min-h-0">
              <div className="space-y-6">
                {data.sections.map((section, index) => (
                  <div key={index} className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10">
                    <h3 className="text-xl font-bold text-white mb-3">{section.title}</h3>
                    <p className="text-white/80 leading-relaxed whitespace-pre-line">{section.text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-white/10 p-4 bg-white/5 text-center">
              <p className="text-white/60 text-sm">
                {language === 'fr' ? 'Dernière mise à jour: Novembre 2025' : 'Last updated: November 2025'}
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default LegalModal;

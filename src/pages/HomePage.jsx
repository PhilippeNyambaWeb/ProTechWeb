import React from 'react';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Services from '@/components/Services';
import Pricing from '@/components/Pricing';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslations } from '@/lib/translations';

const DEFAULT_SEO = {
  title: 'ProTechWeb | Professionnels des Technologies du Web',
  description:
    'ProTechWeb con\u00e7oit et maintient des sites web, applications et exp\u00e9riences e-commerce performantes pour les entreprises canadiennes.',
  keywords:
    'ProTechWeb, Professionnels des Technologies du Web, agence web Montr\u00e9al, cr\u00e9ation site web, d\u00e9veloppement application web, SEO Montr\u00e9al, commerce \u00e9lectronique',
  ogTitle: 'ProTechWeb',
  ogDescription:
    'Solutions web sur mesure, design moderne et accompagnement SEO pour propulser votre pr\u00e9sence num\u00e9rique.',
  url: 'https://protechweb.ca/',
  image: 'https://protechweb.ca/assets/Logo_ProtechWeb.png'
};

const HomePage = () => {
  const { language } = useLanguage();
  const t = useTranslations(language);
  const seo = { ...DEFAULT_SEO, ...(t?.seo || {}) };
  const canonicalUrl = seo.url || DEFAULT_SEO.url;
  const ogLocale = language === 'fr' ? 'fr_CA' : 'en_CA';
  const alternateLocale = language === 'fr' ? 'en_CA' : 'fr_CA';

  return (
    <>
      <Helmet>
        <title>{seo.title}</title>
        <meta name="description" content={seo.description} />
        <meta name="keywords" content={seo.keywords} />
        <meta property="og:title" content={seo.ogTitle || seo.title} />
        <meta property="og:description" content={seo.ogDescription || seo.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:locale" content={ogLocale} />
        <meta property="og:locale:alternate" content={alternateLocale} />
        <meta property="og:site_name" content="ProTechWeb" />
        <meta property="og:image" content={seo.image} />
        <meta property="og:image:alt" content="Logo ProTechWeb" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seo.ogTitle || seo.title} />
        <meta name="twitter:description" content={seo.ogDescription || seo.description} />
        <meta name="twitter:image" content={seo.image} />
        <meta name="twitter:url" content={canonicalUrl} />
        <meta name="author" content="ProTechWeb" />
        <link rel="icon" type="image/png" href="/assets/Logo_ProtechWeb-No_Bgd.png" />
        <link rel="canonical" href={canonicalUrl} />
      </Helmet>
      <div className="min-h-screen">
        <Header />
        <main>
          <Hero />
          <Services />
          <Pricing />
          <Contact />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default HomePage;

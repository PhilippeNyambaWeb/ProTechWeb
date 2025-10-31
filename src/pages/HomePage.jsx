
import React from 'react';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Services from '@/components/Services';
import About from '@/components/About';
import Testimonials from '@/components/Testimonials';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

const HomePage = () => {
  return (
    <>
      <Helmet>
        <title>ProTechWeb - Solutions Web Professionnelles | Design & Développement</title>
        <meta name="description" content="ProTechWeb offre des services professionnels de design web, développement d'applications et solutions digitales sur mesure. Transformez votre présence en ligne avec nos experts." />
        <link rel="icon" type="image/png" href="/assets/Logo_ProtechWeb-No_Bgd.png" />
      </Helmet>
      <div className="min-h-screen bg-white">
        <Header />
        <main>
          <Hero />
          <About />
          <Services />
          <Testimonials />
          <Contact />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default HomePage;

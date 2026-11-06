import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Hero } from '../components/sections/Hero';
import { Services } from '../components/sections/Services';
import { HowItWorks } from '../components/sections/HowItWorks';
import { Contact } from '../components/sections/Contact';
import { Marquee } from '../components/ui/Marquee';

export const Home: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkHash = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#terminos' || hash === '#terminos-y-condiciones') {
        navigate('/terminos');
      }
    };

    checkHash();
    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  }, [navigate]);

  return (
    <main id="main-content" className="relative z-10">
      <Hero />
      <Marquee />
      <Services />
      <HowItWorks />
      <Contact />
      <div id="terminos" className="sr-only" aria-hidden="true" />
    </main>
  );
};

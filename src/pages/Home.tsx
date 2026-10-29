import React from 'react';
import { Hero } from '../components/sections/Hero';
import { Services } from '../components/sections/Services';
import { HowItWorks } from '../components/sections/HowItWorks';
import { Contact } from '../components/sections/Contact';
import { Marquee } from '../components/ui/Marquee';

export const Home: React.FC = () => {
  return (
    <main id="main-content" className="relative z-10">
      <Hero />
      <Marquee />
      <Services />
      <HowItWorks />
      <Contact />
    </main>
  );
};

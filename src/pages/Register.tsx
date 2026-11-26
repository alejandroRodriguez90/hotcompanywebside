import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { CONTACT_CONTENT } from '../lib/constants';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { scrollToTop } from '../lib/scroll';
import { RegisterForm } from '../components/sections/RegisterForm';

export const Register: React.FC = () => {
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    scrollToTop({ immediate: true });
    document.title = 'Registro | HOT COMPANY S.A.S.';
  }, []);

  return (
    <main
      id="main-content"
      className="relative z-10 min-h-screen pt-32 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      {/* Ambient gradient orbs for glass depth */}
      <div
        aria-hidden="true"
        className="absolute top-20 -left-28 w-96 h-96 rounded-full pointer-events-none -z-10 opacity-20 blur-[130px]"
        style={{ background: 'radial-gradient(circle, #E10600 0%, #FFB020 60%, transparent 80%)' }}
      />
      <div
        aria-hidden="true"
        className="absolute bottom-10 -right-28 w-96 h-96 rounded-full pointer-events-none -z-10 opacity-25 blur-[130px]"
        style={{ background: 'radial-gradient(circle, #FF6A13 0%, #FFB020 50%, transparent 80%)' }}
      />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12 sm:mb-16 text-center">
          <motion.div
            initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-5"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#E10600] animate-pulse" />
            <span className="font-mono text-[10px] tracking-widest uppercase text-[#FFB020]">
              {CONTACT_CONTENT.tagline}
            </span>
          </motion.div>

          <motion.h2
            tabIndex={-1}
            initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display font-extrabold text-[#F5F1EC] tracking-tight mb-3 focus:outline-none"
            style={{ fontSize: 'clamp(2rem, 4vw + 0.5rem, 3.2rem)' }}
          >
            {CONTACT_CONTENT.title}
          </motion.h2>

          <motion.p
            initial={reducedMotion ? { opacity: 1 } : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="font-sans text-base text-[#A89F98] max-w-lg mx-auto"
          >
            {CONTACT_CONTENT.subtitle}
          </motion.p>
        </div>

        <div className="max-w-xl mx-auto">
          <RegisterForm />
        </div>
      </div>
    </main>
  );
};

export default Register;

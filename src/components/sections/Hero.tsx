import React, { useRef } from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { HERO_CONTENT, COMPANY_INFO } from '../../lib/constants';
import { Carousel } from './Carousel';
import { Button } from '../ui/Button';
import { HeroVideo } from './HeroVideo';
import { WhatsAppIcon } from '../ui/WhatsAppIcon';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export const Hero: React.FC = () => {
  const reducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  const scrollTo = (id: string) => {
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      ref={sectionRef}
      id="inicio"
      className="relative min-h-[100svh] flex items-center pt-20 pb-10 sm:pt-28 sm:pb-16 overflow-hidden"
    >
      {/* Video de Fondo Plexus con Tinte de Marca */}
      <HeroVideo containerRef={sectionRef} />
      {/* Líneas guía técnicas finas del hero */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
        {[25, 50, 75].map((pct) => (
          <div
            key={pct}
            className="absolute top-0 bottom-0 border-l border-dashed border-white/[0.04]"
            style={{ left: `${pct}%` }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-12 lg:gap-8 items-center">

          {/* ── Left: Copy ────────────────────────────────── */}
          <motion.div
            initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center text-center lg:items-start lg:text-left"
          >
            {/* Tag */}
            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E10600] animate-pulse" aria-hidden="true" />
              <span className="font-mono text-[10px] font-medium tracking-widest uppercase text-[#FFB020]">
                {HERO_CONTENT.tag}
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-display font-extrabold tracking-tight leading-[1.1] mb-5"
              style={{ fontSize: 'clamp(2.2rem, 5vw + 1rem, 4.5rem)' }}
            >
              <span className="block text-gradient">{HERO_CONTENT.titleHighlight}</span>
              <span className="block text-[#F5F1EC]">{HERO_CONTENT.titleRest}</span>
            </h1>

            {/* Subtitle */}
            <p className="font-sans text-base sm:text-lg text-[#A89F98] leading-relaxed mb-8 max-w-xl">
              {HERO_CONTENT.subtitle}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center gap-4 mb-8 w-full sm:w-auto">
              <Button
                variant="primary"
                size="lg"
                onClick={() => scrollTo('#servicios')}
                icon={<ArrowRight className="w-4 h-4" strokeWidth={1.5} />}
              >
                {HERO_CONTENT.ctaPrimary}
              </Button>

              <Button
                as="a"
                href={COMPANY_INFO.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                variant="secondary"
                size="lg"
                icon={<WhatsAppIcon size={18} className="text-[#4ADE80]" />}
                iconPosition="left"
              >
                {HERO_CONTENT.ctaWhatsApp}
              </Button>
            </div>

            {/* Trust badge */}
            <div className="glass rounded-full px-4 py-2 flex items-center gap-2.5 text-[11px] font-medium text-[#A89F98]">
              <svg className="w-4 h-4 text-[#FFB020]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
              {HERO_CONTENT.badge}
            </div>
          </motion.div>

          {/* ── Right: Carousel ───────────────────────────── */}
          <motion.div
            initial={reducedMotion ? { opacity: 1 } : { opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="w-full"
          >
            <Carousel />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

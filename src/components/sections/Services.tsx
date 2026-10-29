import React, { useRef, useCallback } from 'react';
import { motion } from 'motion/react';
import { SERVICES } from '../../lib/constants';
import { useReducedMotion } from '../../hooks/useReducedMotion';

/**
 * Glass spotlight: actualiza CSS vars --mx/--my con rAF, sin re-renders de React.
 */
function attachSpotlight(el: HTMLElement) {
  let rafId: number;
  let pendingX = 50;
  let pendingY = 50;

  const onMouseMove = (e: MouseEvent) => {
    const rect = el.getBoundingClientRect();
    pendingX = ((e.clientX - rect.left) / rect.width) * 100;
    pendingY = ((e.clientY - rect.top) / rect.height) * 100;
    cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => {
      el.style.setProperty('--mx', `${pendingX}%`);
      el.style.setProperty('--my', `${pendingY}%`);
    });
  };
  const onMouseLeave = () => {
    cancelAnimationFrame(rafId);
    el.style.setProperty('--mx', '50%');
    el.style.setProperty('--my', '50%');
  };
  el.addEventListener('mousemove', onMouseMove);
  el.addEventListener('mouseleave', onMouseLeave);
  return () => {
    el.removeEventListener('mousemove', onMouseMove);
    el.removeEventListener('mouseleave', onMouseLeave);
    cancelAnimationFrame(rafId);
  };
}

interface ServiceCardProps {
  service: typeof SERVICES[0];
  index: number;
  reducedMotion: boolean;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, index, reducedMotion }) => {
  const cleanupRef = useRef<(() => void) | null>(null);

  const handleRef = useCallback((el: HTMLDivElement | null) => {
    if (cleanupRef.current) {
      cleanupRef.current();
      cleanupRef.current = null;
    }
    if (el) {
      cleanupRef.current = attachSpotlight(el);
    }
  }, []);

  return (
    <motion.article
      ref={handleRef}
      initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.55, delay: index * 0.1, ease: [0.21, 0.47, 0.32, 0.98] }}
      className="relative glass glass-spotlight rounded-[28px] p-6 lg:p-7 flex flex-col justify-between group overflow-hidden h-full"
      aria-labelledby={`service-title-${service.id}`}
    >
      {/* ── Top row: CIIU chip + outlined numeral ── */}
      <div className="flex items-start justify-between gap-4 mb-auto">
        {/* CIIU chip */}
        <span className="font-mono text-[9px] uppercase tracking-widest text-[#FF6A13] glass rounded-full px-2.5 py-1 border border-[#FF6A13]/20 flex-shrink-0 mt-0.5">
          {service.ciiu}
        </span>

        {/* Numeral – outline, low opacity, top-right, never overlaps text */}
        <div className="relative flex-shrink-0 leading-none select-none pointer-events-none" aria-hidden="true">
          {/* base outline */}
          <span
            className="font-display font-black"
            style={{
              fontSize: 'clamp(3.5rem, 6vw, 6rem)',
              lineHeight: 0.85,
              WebkitTextStroke: '1px rgba(255,255,255,0.09)',
              color: 'transparent',
              display: 'block',
            }}
          >
            {service.number}
          </span>
          {/* gradient on hover via group */}
          <span
            className="absolute inset-0 font-display font-black opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              fontSize: 'clamp(3.5rem, 6vw, 6rem)',
              lineHeight: 0.85,
              background: 'linear-gradient(145deg, #E10600, #FFB020)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {service.number}
          </span>
        </div>
      </div>

      {/* ── Bottom content: anchored to bottom ── */}
      <div className="flex flex-col gap-2 mt-4">
        <p className="font-mono text-[10px] text-[#FF6A13] uppercase tracking-widest leading-none">
          {service.tagline}
        </p>

        <h3
          id={`service-title-${service.id}`}
          className="font-display font-bold text-[#F5F1EC] group-hover:text-white transition-colors leading-tight"
          style={{ fontSize: 'clamp(1.2rem, 1.8vw, 1.85rem)' }}
        >
          {service.title}
        </h3>

        <p className="font-sans text-[15px] text-[#A89F98] leading-relaxed line-clamp-4 w-[90%]">
          {service.description}
        </p>

        {/* Keyword tags */}
        {service.tags && service.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-1">
            {service.tags.map((tag) => (
              <span
                key={tag}
                className="font-sans text-[10px] font-medium glass rounded-full px-2.5 py-0.5 text-[#A89F98] border border-white/[0.10] tracking-wide"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.article>
  );
};

export const Services: React.FC = () => {
  const reducedMotion = useReducedMotion();

  return (
    <section id="servicios" className="relative py-14 sm:py-20 overflow-hidden">
      {/* Ambient gradient orbs for glass refraction */}
      <div
        aria-hidden="true"
        className="absolute top-1/4 -left-32 w-96 h-96 rounded-full pointer-events-none -z-10 opacity-25 blur-[120px]"
        style={{ background: 'radial-gradient(circle, #E10600 0%, #FF6A13 60%, transparent 80%)' }}
      />
      <div
        aria-hidden="true"
        className="absolute bottom-10 -right-32 w-96 h-96 rounded-full pointer-events-none -z-10 opacity-20 blur-[130px]"
        style={{ background: 'radial-gradient(circle, #FFB020 0%, #FF6A13 50%, transparent 80%)' }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6 mb-8 lg:mb-10">
          <motion.div
            initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-3 sm:mb-0 flex-shrink-0"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#E10600] animate-pulse" />
            <span className="font-mono text-[10px] tracking-widest uppercase text-[#FFB020]">
              Nuestras Capacidades
            </span>
          </motion.div>

          <motion.h2
            initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.07 }}
            className="font-display font-extrabold text-[#F5F1EC] tracking-tight leading-tight"
            style={{ fontSize: 'clamp(1.7rem, 3.5vw + 0.5rem, 3rem)' }}
          >
            Lo que <span className="text-gradient">construimos</span>
          </motion.h2>
        </div>

        {/*
          Bento grid:
          mobile  → 1 col, auto height
          tablet  → 2 cols equal
          desktop → 12-col, 2 rows:
            row 1: 01 (7 cols) + 02 (5 cols)
            row 2: 03 (5 cols) + 04 (7 cols)
          Row height: clamp(260px, 32svh, 340px) → fits in ~100svh with header
        */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-5"
          style={{
            gridTemplateRows: 'repeat(2, clamp(260px, 32svh, 340px))',
          }}
        >
          {/* 01 – row 1, cols 1-7 */}
          <div className="lg:col-span-7">
            <ServiceCard service={SERVICES[0]} index={0} reducedMotion={reducedMotion} />
          </div>
          {/* 02 – row 1, cols 8-12 */}
          <div className="lg:col-span-5">
            <ServiceCard service={SERVICES[1]} index={1} reducedMotion={reducedMotion} />
          </div>
          {/* 03 – row 2, cols 1-5 */}
          <div className="lg:col-span-5">
            <ServiceCard service={SERVICES[2]} index={2} reducedMotion={reducedMotion} />
          </div>
          {/* 04 – row 2, cols 6-12 */}
          <div className="lg:col-span-7">
            <ServiceCard service={SERVICES[3]} index={3} reducedMotion={reducedMotion} />
          </div>
        </div>
      </div>
    </section>
  );
};

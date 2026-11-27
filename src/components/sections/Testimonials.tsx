import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { TESTIMONIALS, TESTIMONIALS_CONTENT } from '../../lib/constants';
import { useReducedMotion } from '../../hooks/useReducedMotion';

const AUTOPLAY_INTERVAL = 5500;

export const Testimonials: React.FC = () => {
  const reducedMotion = useReducedMotion();
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [imgErrors, setImgErrors] = useState<Set<string>>(new Set());
  const [viewportMode, setViewportMode] = useState<'mobile' | 'tablet' | 'desktop'>(() => {
    if (typeof window === 'undefined') return 'desktop';
    if (window.innerWidth < 640) return 'mobile';
    if (window.innerWidth < 1024) return 'tablet';
    return 'desktop';
  });

  useEffect(() => {
    const checkViewport = () => {
      if (window.innerWidth < 640) {
        setViewportMode('mobile');
      } else if (window.innerWidth < 1024) {
        setViewportMode('tablet');
      } else {
        setViewportMode('desktop');
      }
    };
    checkViewport();
    window.addEventListener('resize', checkViewport, { passive: true });
    return () => window.removeEventListener('resize', checkViewport);
  }, []);

  const total = TESTIMONIALS.length;

  const goTo = useCallback(
    (index: number) => {
      setCurrent((index + total) % total);
    },
    [total]
  );

  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1), [current, goTo]);

  // Autoplay (5.5s, pausado en hover, focus o prefers-reduced-motion)
  useEffect(() => {
    if (reducedMotion || isPaused || isFocused) return;

    const timer = setInterval(() => {
      next();
    }, AUTOPLAY_INTERVAL);

    return () => clearInterval(timer);
  }, [next, isPaused, isFocused, reducedMotion]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      prev();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      next();
    }
  };

  const isMobile = viewportMode === 'mobile';
  const stepX = isMobile ? 240 : viewportMode === 'tablet' ? 300 : 430;

  return (
    <section
      id="testimonios"
      className="relative pt-28 pb-28 sm:pt-36 sm:pb-36 overflow-hidden bg-[#FFFFFF]"
    >
      {/* Transición superior: #0A0A0B (HowItWorks) -> #FFFFFF — 10 stops para suavizar banding */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 inset-x-0 h-[140px] sm:h-[170px]"
        style={{
          background:
            'linear-gradient(180deg, rgba(10,10,11,1) 0%, rgba(10,10,11,0.93) 10%, rgba(10,10,11,0.84) 20%, rgba(10,10,11,0.72) 30%, rgba(10,10,11,0.59) 42%, rgba(10,10,11,0.44) 54%, rgba(10,10,11,0.30) 65%, rgba(10,10,11,0.17) 76%, rgba(10,10,11,0.07) 87%, rgba(10,10,11,0) 100%)',
        }}
      />

      {/* Transición inferior: #FFFFFF -> #0A0A0B (Contact) — 10 stops para suavizar banding */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 inset-x-0 h-[140px] sm:h-[170px]"
        style={{
          background:
            'linear-gradient(180deg, rgba(10,10,11,0) 0%, rgba(10,10,11,0.07) 13%, rgba(10,10,11,0.17) 24%, rgba(10,10,11,0.30) 35%, rgba(10,10,11,0.44) 46%, rgba(10,10,11,0.59) 58%, rgba(10,10,11,0.72) 70%, rgba(10,10,11,0.84) 80%, rgba(10,10,11,0.93) 90%, rgba(10,10,11,1) 100%)',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header (recoloreado para fondo blanco) */}
        <div className="text-center mb-14 sm:mb-16">
          <motion.div
            initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full bg-black/[0.05] border border-black/10 px-4 py-1.5 mb-5"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#E10600] animate-pulse" />
            <span className="font-mono text-[10px] tracking-widest uppercase text-[#C2410C] font-semibold">
              {TESTIMONIALS_CONTENT.tagline}
            </span>
          </motion.div>

          <motion.h2
            initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display font-extrabold text-[#0A0A0B] tracking-tight mb-4"
            style={{ fontSize: 'clamp(2rem, 4vw + 0.5rem, 3.2rem)' }}
          >
            {TESTIMONIALS_CONTENT.title}
          </motion.h2>

          <motion.p
            initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-sans text-base sm:text-lg text-[#524B47] max-w-xl mx-auto leading-relaxed"
          >
            {TESTIMONIALS_CONTENT.subtitle}
          </motion.p>
        </div>

        {/* Carrusel 3D Curvo */}
        <div
          role="region"
          aria-roledescription="carrusel"
          aria-label="Testimonios de hoteles aliados y workers"
          tabIndex={0}
          onKeyDown={handleKeyDown}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="outline-none focus-visible:ring-2 focus-visible:ring-[#FF6A13] rounded-[32px]"
        >
          {/* Escenario 3D */}
          <div
            className="relative w-full min-h-[440px] sm:min-h-[490px] flex items-center justify-center overflow-visible"
            style={{
              perspective: isMobile ? '800px' : '1200px',
              perspectiveOrigin: '50% 50%',
            }}
          >
            <div
              className="relative w-[calc(100vw-2rem)] max-w-[370px] sm:max-w-none sm:w-[460px] md:w-[540px] min-h-[380px] sm:min-h-[430px] flex items-center justify-center"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {TESTIMONIALS.map((item, idx) => {
                let diff = idx - current;
                while (diff > total / 2) diff -= total;
                while (diff < -total / 2) diff += total;

                const absDiff = Math.abs(diff);
                const isActive = diff === 0;
                const isHidden = absDiff > 1;
                const isHotel = item.type === 'hotel';

                const translateX = isHidden ? (Math.sign(diff) || 1) * (stepX * 1.45) : diff * stepX;
                const translateY = isActive ? 0 : 14;
                const translateZ = isActive ? 0 : isHidden ? -280 : -170;
                const rotateY = isActive ? 0 : diff > 0 ? -15 : 15;
                const scale = isActive ? 1 : isHidden ? 0.68 : 0.84;
                const opacity = isActive ? 1 : isHidden ? 0 : 0.78;
                const zIndex = isActive ? 30 : isHidden ? 0 : 10;

                const transformValue = reducedMotion
                  ? 'none'
                  : `translate3d(${translateX}px, ${translateY}px, ${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`;

                return (
                  <article
                    key={`${item.name}-${item.role}`}
                    onClick={() => {
                      if (!isActive && !isHidden) goTo(idx);
                    }}
                    aria-hidden={!isActive}
                    className="absolute inset-0 select-none"
                    style={{
                      transformStyle: 'preserve-3d',
                      transform: transformValue,
                      opacity: reducedMotion ? (isActive ? 1 : 0) : opacity,
                      zIndex,
                      visibility: reducedMotion
                        ? isActive
                          ? 'visible'
                          : 'hidden'
                        : isHidden
                          ? 'hidden'
                          : 'visible',
                      display: reducedMotion && !isActive ? 'none' : 'block',
                      pointerEvents: isHidden || (reducedMotion && !isActive) ? 'none' : 'auto',
                      cursor: isActive ? 'default' : 'pointer',
                      transition: reducedMotion
                        ? 'none'
                        : 'transform 0.65s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.45s ease',
                      willChange: reducedMotion ? 'auto' : 'transform, opacity',
                    }}
                  >
                    {/* Tarjeta "glass negro moderno" flotando sobre blanco */}
                    <div
                      className="relative w-full h-full min-h-[380px] sm:min-h-[430px] rounded-[32px] p-8 sm:p-11 overflow-hidden flex flex-col justify-between gap-7"
                      style={{
                        boxShadow: isActive
                          ? '0 28px 60px -16px rgba(10,10,11,0.42), 0 12px 24px -8px rgba(10,10,11,0.24)'
                          : '0 18px 40px -14px rgba(10,10,11,0.30), 0 8px 16px -6px rgba(10,10,11,0.18)',
                      }}
                    >
                      {/* z-index 0: Anillo exterior — técnica exacta store button */}
                      <span
                        aria-hidden="true"
                        style={{
                          position: 'absolute',
                          inset: 0,
                          borderRadius: '32px',
                          background:
                            'linear-gradient(180deg, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0.12) 55%, rgba(255,255,255,0.18) 100%)',
                          zIndex: 0,
                        }}
                      />
                      {/* z-index 1: Relleno interior negro vidrio moderno */}
                      <span
                        aria-hidden="true"
                        style={{
                          position: 'absolute',
                          inset: '1px',
                          borderRadius: '31px',
                          background:
                            'linear-gradient(180deg, rgba(32,32,36,0.94) 0%, rgba(14,14,17,0.97) 52%, rgba(6,6,8,0.99) 100%)',
                          zIndex: 1,
                        }}
                      />
                      {/* z-index 2: Highlight glossy superior — técnica exacta store button (28px fijo) */}
                      <span
                        aria-hidden="true"
                        style={{
                          position: 'absolute',
                          top: '1px',
                          left: '1px',
                          right: '1px',
                          height: '28px',
                          borderRadius: '31px 31px 40% 40%',
                          background:
                            'linear-gradient(180deg, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0.06) 45%, transparent 100%)',
                          pointerEvents: 'none',
                          zIndex: 2,
                        }}
                      />

                      {/* z-index 3: Contenido de la tarjeta */}
                      <div className="relative z-[3] flex flex-col gap-5">
                        <div className="flex items-center justify-between gap-3">
                          <span
                            className={`inline-flex items-center rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-wider ${
                              isHotel
                                ? 'border-[#3B6EA5]/45 bg-[#3B6EA5]/18 text-[#9BC3F0]'
                                : 'border-[#FF6A13]/40 bg-[#FF6A13]/15 text-[#FFB020]'
                            }`}
                          >
                            {isHotel ? 'Hotel Aliado' : 'Worker'}
                          </span>
                          <Quote
                            className="w-6 h-6 shrink-0"
                            style={{ color: 'rgba(255,106,19,0.70)' }}
                            strokeWidth={1.5}
                            aria-hidden="true"
                          />
                        </div>

                        <p className="font-sans text-base sm:text-lg text-[#F5F1EC] leading-relaxed">
                          “{item.quote}”
                        </p>
                      </div>

                      <div className="relative z-[3] flex items-center gap-4 pt-4 border-t border-white/[0.08]">
                        <div
                          className="w-[70px] h-[70px] sm:w-20 sm:h-20 rounded-full flex items-center justify-center shrink-0 shadow-[0_6px_18px_rgba(255,106,19,0.35)] border border-white/20 overflow-hidden"
                          style={{ background: imgErrors.has(item.initials) ? 'var(--gradient-brand)' : undefined }}
                          aria-hidden="true"
                        >
                          {imgErrors.has(item.initials) ? (
                            <span className="font-display text-base sm:text-lg font-bold text-[#F5F1EC] tracking-wide">
                              {item.initials}
                            </span>
                          ) : (
                            <img
                              src={`/testimonials/${item.initials}.webp`}
                              alt={item.name}
                              className="w-full h-full object-cover rounded-full"
                              onError={() =>
                                setImgErrors((prev) => new Set(prev).add(item.initials))
                              }
                            />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-display font-semibold text-base sm:text-lg text-[#F5F1EC] truncate">
                            {item.name}
                          </p>
                          <p className="font-sans text-xs sm:text-sm text-[#A89F98] truncate">
                            {item.role}
                          </p>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          {/* Controles: flechas y puntos (recoloreados para fondo blanco) */}
          <div className="mt-10 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={prev}
              aria-label="Testimonio anterior"
              className="w-10 h-10 rounded-full border border-black/15 bg-black/[0.04] flex items-center justify-center text-[#0A0A0B] hover:border-[#FF6A13] hover:text-[#E10600] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6A13]"
            >
              <ChevronLeft className="w-4 h-4" strokeWidth={1.75} />
            </button>

            <div className="flex items-center gap-2" role="tablist" aria-label="Testimonios">
              {TESTIMONIALS.map((item, idx) => {
                const active = idx === current;
                return (
                  <button
                    key={`${item.name}-${idx}`}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    aria-label={`Ver testimonio de ${item.name}`}
                    onClick={() => goTo(idx)}
                    className={`h-2 rounded-full transition-all duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6A13] ${
                      active
                        ? 'w-7 bg-gradient-to-r from-[#E10600] via-[#FF6A13] to-[#FFB020]'
                        : 'w-2 bg-black/20 hover:bg-black/40'
                    }`}
                  />
                );
              })}
            </div>

            <button
              type="button"
              onClick={next}
              aria-label="Siguiente testimonio"
              className="w-10 h-10 rounded-full border border-black/15 bg-black/[0.04] flex items-center justify-center text-[#0A0A0B] hover:border-[#FF6A13] hover:text-[#E10600] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6A13]"
            >
              <ChevronRight className="w-4 h-4" strokeWidth={1.75} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

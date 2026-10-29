import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Check } from 'lucide-react';
import { HOW_IT_WORKS_CONTENT } from '../../lib/constants';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export const HowItWorks: React.FC = () => {
  const reducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 80%', 'end 30%'],
  });

  // The connecting line grows as you scroll through the section
  const lineHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <section id="como-funciona" ref={containerRef} className="relative py-20 sm:py-28 overflow-hidden">
      {/* Ambient gradient orb for glass depth */}
      <div
        aria-hidden="true"
        className="absolute top-1/3 -right-28 w-96 h-96 rounded-full pointer-events-none -z-10 opacity-20 blur-[120px]"
        style={{ background: 'radial-gradient(circle, #FF6A13 0%, #E10600 50%, transparent 80%)' }}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 sm:mb-20">
          <motion.div
            initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-5"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#E10600] animate-pulse" />
            <span className="font-mono text-[10px] tracking-widest uppercase text-[#FFB020]">
              {HOW_IT_WORKS_CONTENT.tagline}
            </span>
          </motion.div>

          <motion.h2
            initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display font-extrabold text-[#F5F1EC] tracking-tight mb-4"
            style={{ fontSize: 'clamp(2rem, 4vw + 0.5rem, 3.2rem)' }}
          >
            {HOW_IT_WORKS_CONTENT.title}
          </motion.h2>

          <motion.p
            initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-sans text-base sm:text-lg text-[#A89F98] max-w-xl mx-auto leading-relaxed"
          >
            {HOW_IT_WORKS_CONTENT.subtitle}
          </motion.p>
        </div>

        {/* Vertical timeline */}
        <div className="relative">
          {/* Scroll-linked progress line */}
          <div
            className="absolute left-8 sm:left-1/2 top-0 bottom-0 w-[1px] -translate-x-1/2 overflow-hidden"
            aria-hidden="true"
          >
            {/* Background track */}
            <div className="absolute inset-0 bg-white/[0.07]" />
            {/* Animated fill */}
            {reducedMotion ? (
              <div className="absolute inset-0 bg-gradient-to-b from-[#E10600] to-[#FFB020]" />
            ) : (
              <motion.div
                className="absolute top-0 left-0 right-0 bg-gradient-to-b from-[#E10600] via-[#FF6A13] to-[#FFB020]"
                style={{ height: lineHeight }}
              />
            )}
          </div>

          <div className="flex flex-col gap-12 sm:gap-16">
            {HOW_IT_WORKS_CONTENT.steps.map((step, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <motion.div
                  key={step.step}
                  initial={reducedMotion ? { opacity: 1 } : { opacity: 0, x: isEven ? -25 : 25 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.6, delay: 0.1, ease: [0.21, 0.47, 0.32, 0.98] }}
                  className={`flex items-start gap-6 sm:gap-0 ${isEven ? 'sm:flex-row' : 'sm:flex-row-reverse'}`}
                >
                  {/* Card — takes up ~45% on desktop */}
                  <div className={`flex-1 ${isEven ? 'sm:pr-12 sm:text-right' : 'sm:pl-12'} pl-16 sm:pl-0`}>
                    <div className="glass glass-spotlight rounded-[28px] p-6 sm:p-7 hover:scale-[1.01] transition-transform duration-300">
                      <span className="font-mono text-[10px] text-[#FF6A13] uppercase tracking-wider block mb-2">
                        Paso {step.step}
                      </span>
                      <h3 className="font-display font-bold text-[#F5F1EC] text-lg sm:text-xl mb-3">
                        {step.title}
                      </h3>
                      <p className="font-sans text-sm text-[#A89F98] leading-relaxed mb-4">
                        {step.description}
                      </p>
                      <div className="flex items-start gap-2 text-xs text-[#FFB020] font-medium">
                        <Check className="w-3.5 h-3.5 text-[#FF6A13] shrink-0 mt-0.5" strokeWidth={1.5} />
                        {step.highlight}
                      </div>
                    </div>
                  </div>

                  {/* Node (circle on the line) — centered */}
                  <div className="absolute left-8 sm:static sm:flex-shrink-0 sm:w-16 flex items-center justify-center sm:mt-8">
                    <motion.div
                      whileInView={reducedMotion ? {} : { boxShadow: ['0 0 0px rgba(225,6,0,0)', '0 0 20px rgba(225,6,0,0.6)', '0 0 0px rgba(225,6,0,0)'] }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.5, delay: idx * 0.2 }}
                      className="w-10 h-10 rounded-full glass-tint-warm border border-[#FF6A13]/40 flex items-center justify-center relative z-10"
                    >
                      <span className="font-mono font-bold text-xs text-[#FFB020]">{step.step}</span>
                    </motion.div>
                  </div>

                  {/* Spacer on desktop for the other side */}
                  <div className="hidden sm:block flex-1" />
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Legal disclaimer at bottom */}
        <motion.div
          initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-16 glass rounded-2xl p-5 sm:p-6 text-center"
        >
          <p className="font-sans text-xs sm:text-sm text-[#A89F98] leading-relaxed">
            <span className="text-[#FFB020] font-semibold">Aviso de operación:</span>{' '}
            HOT COMPANY S.A.S. facilita el contacto y la visibilidad. El acuerdo de servicio, tarifas y pago
            se realizan directamente entre el usuario y el prestador independiente, sin intermediación
            financiera por parte de la plataforma.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

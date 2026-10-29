import React from 'react';
import { motion } from 'motion/react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface SectionTitleProps {
  tagline?: string;
  title: string;
  highlight?: string;
  subtitle?: string;
  align?: 'left' | 'center' | 'right';
  className?: string;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({
  tagline,
  title,
  highlight,
  subtitle,
  align = 'center',
  className = '',
}) => {
  const reducedMotion = useReducedMotion();

  const alignmentClasses = {
    left: 'text-left items-start',
    center: 'text-center items-center',
    right: 'text-right items-end',
  };

  return (
    <div className={`flex flex-col ${alignmentClasses[align]} max-w-3xl ${align === 'center' ? 'mx-auto' : ''} mb-12 sm:mb-16 ${className}`}>
      {tagline && (
        <motion.div
          initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-[#FF6A13]/30 backdrop-blur-md mb-4"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#E10600] animate-pulse" />
          <span className="text-[11px] sm:text-xs font-semibold tracking-widest uppercase text-[#FFB020]">
            {tagline}
          </span>
        </motion.div>
      )}

      <motion.h2
        initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#F5F1EC] leading-[1.15]"
      >
        {title}{' '}
        {highlight && (
          <span className="bg-gradient-to-r from-[#E10600] via-[#FF6A13] to-[#FFB020] bg-clip-text text-transparent">
            {highlight}
          </span>
        )}
      </motion.h2>

      {subtitle && (
        <motion.p
          initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-4 text-base sm:text-lg text-[#A89F98] max-w-2xl leading-relaxed"
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
};

import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export const CustomCursor: React.FC = () => {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isPointerFine, setIsPointerFine] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(pointer: fine)').matches;
  });
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const mediaQuery = window.matchMedia('(pointer: fine)');

    const handlePointerChange = (e: MediaQueryListEvent) => {
      setIsPointerFine(e.matches);
    };
    mediaQuery.addEventListener('change', handlePointerChange);

    const handleMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    // Detectar interactivos para agrandar el cursor
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactive = target.closest('a, button, input, textarea, select, [role="button"], label, .interactive-hover');
      setIsHovering(Boolean(interactive));
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseover', handleMouseOver, { passive: true });

    return () => {
      mediaQuery.removeEventListener('change', handlePointerChange);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseover', handleMouseOver);
    };
  }, [isVisible]);

  // Si el usuario tiene reduced motion o no tiene puntero fino, no mostramos el cursor personalizado
  if (reducedMotion || !isPointerFine || !isVisible) {
    return null;
  }

  return (
    <>
      {/* Punto central ágil */}
      <motion.div
        aria-hidden="true"
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-[#FF6A13] pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 shadow-[0_0_8px_#FF6A13]"
        animate={{
          x: pos.x,
          y: pos.y,
          opacity: isHovering ? 0 : 1,
          scale: isHovering ? 0 : 1,
        }}
        transition={{ type: 'spring', damping: 30, stiffness: 600, mass: 0.05 }}
      />

      {/* Halo exterior suave con gradiente */}
      <motion.div
        aria-hidden="true"
        className="fixed top-0 left-0 rounded-full pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2 border border-[#FF6A13]/40"
        animate={{
          x: pos.x,
          y: pos.y,
          width: isHovering ? 56 : 28,
          height: isHovering ? 56 : 28,
          backgroundColor: isHovering ? 'rgba(225, 6, 0, 0.15)' : 'rgba(255, 106, 19, 0.04)',
          borderColor: isHovering ? 'rgba(255, 176, 32, 0.8)' : 'rgba(255, 106, 19, 0.35)',
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 280, mass: 0.15 }}
      />
    </>
  );
};

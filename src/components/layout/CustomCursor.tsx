import React, { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export const CustomCursor: React.FC = () => {
  const [isHovering, setIsHovering] = useState(false);
  const isHoveringRef = useRef(false);
  const [isVisible, setIsVisible] = useState(false);
  const visibleRef = useRef(false);

  const [isPointerFine, setIsPointerFine] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(pointer: fine)').matches;
  });
  const reducedMotion = useReducedMotion();

  // Motion values para posición — NO causan re-renders de React en mousemove
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Springs físicos para suavizado — ejecutados fuera del ciclo de render de React
  const dotX = useSpring(cursorX, { damping: 30, stiffness: 600, mass: 0.05 });
  const dotY = useSpring(cursorY, { damping: 30, stiffness: 600, mass: 0.05 });

  const haloX = useSpring(cursorX, { damping: 25, stiffness: 280, mass: 0.15 });
  const haloY = useSpring(cursorY, { damping: 25, stiffness: 280, mass: 0.15 });

  useEffect(() => {
    const mediaQuery = window.matchMedia('(pointer: fine)');

    const handlePointerChange = (e: MediaQueryListEvent) => {
      setIsPointerFine(e.matches);
    };
    mediaQuery.addEventListener('change', handlePointerChange);

    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!visibleRef.current) {
        visibleRef.current = true;
        setIsVisible(true);
      }
    };

    const handleMouseLeave = () => {
      visibleRef.current = false;
      setIsVisible(false);
    };

    // Detectar interactivos para agrandar el cursor (solo cambia estado al cruzar fronteras)
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactive = Boolean(target.closest('a, button, input, textarea, select, [role="button"], label, .interactive-hover'));
      if (isHoveringRef.current !== interactive) {
        isHoveringRef.current = interactive;
        setIsHovering(interactive);
      }
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
  }, [cursorX, cursorY]);

  // Si el usuario tiene reduced motion o no tiene puntero fino, no mostramos el cursor personalizado
  if (reducedMotion || !isPointerFine) {
    return null;
  }

  return (
    <>
      {/*
        Referencia alternativa (por si se prefiere reemplazar el diamante más adelante):
        Punto sólido pequeño + anillo circular delgado sin relleno:
        - Dot: w-1.5 h-1.5 rounded-full bg-[#FF6A13] shadow-[0_0_6px_#FF6A13]
        - Halo: rounded-full border border-[#FF6A13]/40 (sin rotate, borderRadius: '9999px')
      */}

      {/* Punto central ágil — diamante sutil (rotate 45°, rounded-[2px]) */}
      <motion.div
        aria-hidden="true"
        className="fixed top-0 left-0 w-2 h-2 rounded-[2px] bg-[#FF6A13] pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 shadow-[0_0_6px_#FF6A13]"
        style={{
          x: dotX,
          y: dotY,
          rotate: 45,
        }}
        animate={{
          opacity: isVisible && !isHovering ? 1 : 0,
          scale: isHovering ? 0 : 1,
        }}
        transition={{ duration: 0.15 }}
      />

      {/* Halo exterior suave — diamante sutil (rotate 45°, rounded-[4px] / rounded-[8px] en hover) */}
      <motion.div
        aria-hidden="true"
        className="fixed top-0 left-0 pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2 border border-[#FF6A13]/40"
        style={{
          x: haloX,
          y: haloY,
          rotate: 45,
        }}
        animate={{
          opacity: isVisible ? 1 : 0,
          width: isHovering ? 50 : 26,
          height: isHovering ? 50 : 26,
          borderRadius: isHovering ? '8px' : '4px',
          backgroundColor: isHovering ? 'rgba(255, 106, 19, 0.08)' : 'rgba(255, 106, 19, 0.03)',
          borderColor: isHovering ? 'rgba(255, 106, 19, 0.45)' : 'rgba(255, 106, 19, 0.25)',
        }}
        transition={{ duration: 0.2 }}
      />
    </>
  );
};

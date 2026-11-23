import { useState, useEffect } from 'react';

export type ScrollDirection = 'up' | 'down' | null;

let suppressUntil = 0;

/**
 * Ignora la dirección del scroll durante `durationMs`. Se usa para el salto
 * inicial a #contacto: un scroll programado hacia abajo no debe ocultar la navbar.
 */
export function suppressScrollDirectionFor(durationMs: number = 800): void {
  suppressUntil = performance.now() + durationMs;
}

export function useScrollDirection(threshold: number = 10) {
  const [scrollDirection, setScrollDirection] = useState<ScrollDirection>(null);
  const [isAtTop, setIsAtTop] = useState(true);

  useEffect(() => {
    let lastScrollY = window.pageYOffset;
    let ticking = false;

    const updateScrollDir = () => {
      const scrollY = window.pageYOffset;

      setIsAtTop(scrollY < 40);

      if (performance.now() < suppressUntil) {
        // Mantiene la referencia alineada para no detectar un "down" falso
        // cuando termine la supresión del scroll inicial.
        lastScrollY = scrollY;
        ticking = false;
        return;
      }

      if (Math.abs(scrollY - lastScrollY) < threshold) {
        ticking = false;
        return;
      }

      setScrollDirection(scrollY > lastScrollY ? 'down' : 'up');
      lastScrollY = scrollY > 0 ? scrollY : 0;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollDir);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);

  return { scrollDirection, isAtTop };
}

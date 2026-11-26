import type Lenis from 'lenis';

let activeLenis: Lenis | null = null;

/** Registra la instancia global de Lenis (o la limpia al desmontarse). */
export const setActiveLenis = (instance: Lenis | null): void => {
  activeLenis = instance;
};

interface ScrollOptions {
  immediate?: boolean;
  offset?: number;
  /** Duración del scroll con Lenis, en segundos (por defecto, la de Lenis). */
  duration?: number;
}

/**
 * Scroll hacia un ancla usando Lenis cuando está disponible (suave por
 * defecto). Sin Lenis —por prefers-reduced-motion— se usa `behavior: 'instant'`
 * para no pelear con el `scroll-behavior: smooth` global de index.html/index.css.
 * No se usa `lock` ni `force`: un gesto del usuario puede interrumpir el scroll
 * programado y retomar el control en cualquier momento. Un `offset` negativo
 * deja la cámara más arriba; uno positivo, más abajo.
 */
export function scrollToAnchoredElement(
  target: string | HTMLElement,
  { immediate = false, offset = 0, duration }: ScrollOptions = {},
): boolean {
  const element =
    typeof target === 'string' ? document.querySelector<HTMLElement>(target) : target;
  if (!element) return false;

  if (activeLenis) {
    activeLenis.scrollTo(element, { offset, immediate, duration });
    return true;
  }

  const top = element.getBoundingClientRect().top + window.scrollY + offset;
  window.scrollTo({ top: Math.max(0, top), behavior: 'instant' });
  return true;
}

/** Vuelve al inicio con la misma estrategia que `scrollToAnchoredElement`. */
export function scrollToTop({ immediate = false }: ScrollOptions = {}): void {
  if (activeLenis) {
    activeLenis.scrollTo(0, { immediate });
    return;
  }
  window.scrollTo({ top: 0, behavior: 'instant' });
}

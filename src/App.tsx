import { useEffect, useLayoutEffect, Suspense, lazy, useCallback, useRef, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Lenis from 'lenis';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Background } from './components/layout/Background';
import { CustomCursor } from './components/layout/CustomCursor';
import { Loader } from './components/layout/Loader';
import { Home } from './pages/Home';
import { NotFound } from './pages/NotFound';
import { useReducedMotion } from './hooks/useReducedMotion';
import { suppressScrollDirectionFor } from './hooks/useScrollDirection';
import {
  CONTACT_LANDING_OFFSET,
  scrollToAnchoredElement,
  scrollToTop,
  setActiveLenis,
} from './lib/scroll';

const Privacy = lazy(() => import('./pages/Privacy'));
const Terms = lazy(() => import('./pages/Terms'));

const HERO_ANCHOR = '#inicio';
const CONTACT_ANCHOR = '#contacto';
const INITIAL_SCROLL_DELAY_MS = 160;
const INITIAL_SCROLL_DURATION_S = 1.15;
// Cubre la pausa breve en el Hero y toda la bajada suave para que la navbar
// no parpadee durante el scroll programado.
const INITIAL_SCROLL_SUPPRESSION_MS = 1800;

export function App() {
  const reducedMotion = useReducedMotion();
  const [loaderComplete, setLoaderComplete] = useState(false);
  const initialScrollDone = useRef(false);

  const handleLoaderComplete = useCallback(() => setLoaderComplete(true), []);

  // Inicializar Lenis para scroll suave global sincronizado
  useEffect(() => {
    if (reducedMotion) {
      setActiveLenis(null);
      return;
    }

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
    });
    setActiveLenis(lenis);

    let animationFrameId: number;

    function raf(time: number) {
      lenis.raf(time);
      animationFrameId = requestAnimationFrame(raf);
    }

    animationFrameId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(animationFrameId);
      lenis.destroy();
      setActiveLenis(null);
    };
  }, [reducedMotion]);

  // En F5 el navegador restaura la posición anterior. Se desactiva y se vuelve
  // al Hero antes del primer paint: así la bajada suave siempre arranca desde
  // arriba, tanto en la carga inicial como al refrescar.
  useLayoutEffect(() => {
    const previousRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = 'manual';
    scrollToAnchoredElement(HERO_ANCHOR, { immediate: true });

    return () => {
      window.history.scrollRestoration = previousRestoration;
    };
  }, []);

  // Al cargar '/', la vista arranca en el Hero y, cuando la apertura del loader
  // termina, baja suavemente a #contacto. La pausa breve deja ver el punto de
  // partida antes de la bajada. Es un scroll de una sola vez y sin lock/force:
  // cualquier gesto del usuario lo interrumpe y queda libre para navegar.
  useEffect(() => {
    if (!loaderComplete || initialScrollDone.current) return;
    if (window.location.pathname !== '/') return;

    const hash = window.location.hash.toLowerCase();
    if (hash && hash !== CONTACT_ANCHOR) return; // respeta #terminos y otros anclas

    initialScrollDone.current = true;
    suppressScrollDirectionFor(INITIAL_SCROLL_SUPPRESSION_MS);

    let frame = 0;
    const delay = window.setTimeout(() => {
      frame = requestAnimationFrame(() => {
        // Punto de partida explícito por si el navegador restauró scroll en F5.
        if (!scrollToAnchoredElement(HERO_ANCHOR, { immediate: true })) {
          scrollToTop({ immediate: true });
        }

        const moved = scrollToAnchoredElement(CONTACT_ANCHOR, {
          offset: CONTACT_LANDING_OFFSET,
          duration: INITIAL_SCROLL_DURATION_S,
        });
        if (!moved) return;

        window.history.replaceState(
          null,
          '',
          `${window.location.pathname}${window.location.search}${CONTACT_ANCHOR}`,
        );
        document
          .querySelector<HTMLElement>('#contacto h2[tabindex="-1"]')
          ?.focus({ preventScroll: true });
      });
    }, INITIAL_SCROLL_DELAY_MS);

    return () => {
      window.clearTimeout(delay);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [loaderComplete]);

  return (
    <BrowserRouter>
      {/* Pantalla de Carga Inicial con el Dado */}
      <Loader onComplete={handleLoaderComplete} />

      {/* Cursor Personalizado en Escritorio */}
      <CustomCursor />

      {/* Malla de Fondo Dinámica */}
      <Background />

      <div className="flex flex-col min-h-screen text-[#F5F1EC]">
        {/* Barra de Navegación Inteligente */}
        <Navbar />

        {/* Rutas de la Aplicación */}
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/privacidad"
              element={
                <Suspense
                  fallback={
                    <div className="min-h-screen flex items-center justify-center">
                      <div
                        className="w-8 h-8 rounded-full border-2 border-[#FF6A13] border-t-transparent animate-spin"
                        aria-label="Cargando política de privacidad"
                      />
                    </div>
                  }
                >
                  <Privacy />
                </Suspense>
              }
            />
            <Route
              path="/terminos"
              element={
                <Suspense
                  fallback={
                    <div className="min-h-screen flex items-center justify-center">
                      <div
                        className="w-8 h-8 rounded-full border-2 border-[#FF6A13] border-t-transparent animate-spin"
                        aria-label="Cargando términos y condiciones"
                      />
                    </div>
                  }
                >
                  <Terms />
                </Suspense>
              }
            />
            <Route
              path="/terminos-y-condiciones"
              element={<Navigate to="/terminos" replace />}
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>

        {/* Pie de Página Corporativo */}
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;

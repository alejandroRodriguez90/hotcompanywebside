import { useEffect, useLayoutEffect, useState, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Background } from './components/layout/Background';
import { CustomCursor } from './components/layout/CustomCursor';
import { Loader } from './components/layout/Loader';
import { IncentiveModal } from './components/ui/IncentiveModal';
import { StickyConversionBar } from './components/ui/StickyConversionBar';
import { Home } from './pages/Home';
import { NotFound } from './pages/NotFound';
import { useReducedMotion } from './hooks/useReducedMotion';
import { scrollToAnchoredElement, setActiveLenis } from './lib/scroll';

const Privacy = lazy(() => import('./pages/Privacy'));
const Terms = lazy(() => import('./pages/Terms'));
const Register = lazy(() => import('./pages/Register'));

const HERO_ANCHOR = '#inicio';

// Garantiza que el modal de incentivo se muestre una sola vez por carga de página (se resetea en F5).
let hasShownIncentive = false;

function AppShell({ loaderComplete }: { loaderComplete: boolean }) {
  const { pathname } = useLocation();
  const isRegisterRoute = pathname === '/registro';
  const [showIncentiveModal, setShowIncentiveModal] = useState(false);

  useEffect(() => {
    if (!loaderComplete || isRegisterRoute || hasShownIncentive) return;

    let ticking = false;

    const checkScrollProgress = () => {
      ticking = false;
      if (hasShownIncentive) return;

      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll <= 0) return;

      if (window.scrollY / maxScroll >= 0.3) {
        hasShownIncentive = true;
        setShowIncentiveModal(true);
        window.removeEventListener('scroll', onScroll);
      }
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(checkScrollProgress);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [loaderComplete, isRegisterRoute]);

  return (
    <div className="flex flex-col min-h-screen text-[#F5F1EC]">
      {/* Barra de Navegación Inteligente */}
      <Navbar showRegisterCta={!isRegisterRoute} loaderComplete={loaderComplete} />

      {/* Rutas de la Aplicación */}
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/registro"
            element={
              <Suspense
                fallback={
                  <div className="min-h-screen flex items-center justify-center">
                    <div
                      className="w-8 h-8 rounded-full border-2 border-[#FF6A13] border-t-transparent animate-spin"
                      aria-label="Cargando formulario de registro"
                    />
                  </div>
                }
              >
                <Register />
              </Suspense>
            }
          />
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
      {!isRegisterRoute && <Footer />}

      {/* Modal de incentivo Credihots (30% de scroll, excluido en /registro) */}
      <IncentiveModal
        isOpen={showIncentiveModal && !isRegisterRoute}
        onClose={() => {
          hasShownIncentive = true;
          setShowIncentiveModal(false);
        }}
      />

      {/* Sticky bar de notificaciones tipo chat (excluida en /registro, pausada con modal) */}
      {!isRegisterRoute && (
        <StickyConversionBar
          enabled={loaderComplete && !isRegisterRoute}
          suppressed={showIncentiveModal}
        />
      )}
    </div>
  );
}

export function App() {
  const reducedMotion = useReducedMotion();
  const [loaderComplete, setLoaderComplete] = useState(false);

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
  // al Hero antes del primer paint para iniciar siempre arriba.
  useLayoutEffect(() => {
    const previousRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = 'manual';
    scrollToAnchoredElement(HERO_ANCHOR, { immediate: true });

    return () => {
      window.history.scrollRestoration = previousRestoration;
    };
  }, []);

  return (
    <BrowserRouter>
      {/* Pantalla de Carga Inicial con el Dado */}
      <Loader onComplete={() => setLoaderComplete(true)} />

      {/* Cursor Personalizado en Escritorio */}
      <CustomCursor />

      {/* Malla de Fondo Dinámica */}
      <Background />

      <AppShell loaderComplete={loaderComplete} />
    </BrowserRouter>
  );
}

export default App;

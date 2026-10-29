import { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Lenis from 'lenis';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Background } from './components/layout/Background';
import { CustomCursor } from './components/layout/CustomCursor';
import { Loader } from './components/layout/Loader';
import { Home } from './pages/Home';
import { NotFound } from './pages/NotFound';
import { useReducedMotion } from './hooks/useReducedMotion';

const Privacy = lazy(() => import('./pages/Privacy'));

export function App() {
  const reducedMotion = useReducedMotion();

  // Inicializar Lenis para scroll suave global sincronizado
  useEffect(() => {
    if (reducedMotion) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
    });

    let animationFrameId: number;

    function raf(time: number) {
      lenis.raf(time);
      animationFrameId = requestAnimationFrame(raf);
    }

    animationFrameId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(animationFrameId);
      lenis.destroy();
    };
  }, [reducedMotion]);

  return (
    <BrowserRouter>
      {/* Pantalla de Carga Inicial con el Dado */}
      <Loader />

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

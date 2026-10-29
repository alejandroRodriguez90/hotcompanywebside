import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'motion/react';
import { CAROUSEL_SLIDES } from '../../lib/constants';
import { useReducedMotion } from '../../hooks/useReducedMotion';

const AUTOPLAY_INTERVAL = 5000;

export const Carousel: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [canHover, setCanHover] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const reducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef<number>(0);

  const total = CAROUSEL_SLIDES.length;

  // Responsive and hover capability detector
  useEffect(() => {
    const checkViewport = () => {
      setIsMobile(window.innerWidth < 640);
      setCanHover(window.matchMedia('(hover: hover) and (pointer: fine)').matches);
    };
    checkViewport();
    window.addEventListener('resize', checkViewport, { passive: true });
    return () => window.removeEventListener('resize', checkViewport);
  }, []);

  const isTouch = !canHover;
  const isRevealed = !isDragging && (isTouch || isHovered || isFocused);

  const goTo = useCallback(
    (index: number) => {
      setCurrent((index + total) % total);
      setIsHovered(false);
      setIsFocused(false);
    },
    [total]
  );

  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1), [current, goTo]);

  // Autoplay (5s, paused while hovered, focused, dragging or reduced-motion)
  useEffect(() => {
    if (reducedMotion || isPaused || isDragging || isHovered || isFocused) return;

    const timer = setInterval(() => {
      next();
    }, AUTOPLAY_INTERVAL);

    return () => clearInterval(timer);
  }, [next, isPaused, isDragging, isHovered, isFocused, reducedMotion]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      prev();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      next();
    }
  };

  // Drag / Swipe handling
  const handlePointerDown = (e: React.PointerEvent) => {
    dragStartRef.current = e.clientX;
    setIsDragging(true);
    setDragOffset(0);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const diff = e.clientX - dragStartRef.current;
    setDragOffset(diff);
  };

  const handlePointerUp = () => {
    if (!isDragging) return;
    if (dragOffset > 45) {
      prev();
    } else if (dragOffset < -45) {
      next();
    }
    setIsDragging(false);
    setDragOffset(0);
  };

  const activeSlide = CAROUSEL_SLIDES[current];

  return (
    <div
      ref={containerRef}
      role="region"
      aria-roledescription="carrusel"
      aria-label="Galería de proyectos digitales"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      className="relative w-full max-w-full select-none outline-none flex flex-col items-center justify-center py-2"
    >
      {/* ── COVERFLOW VIEWPORT ─────────────────────────────────── */}
      <div
        className="relative w-full h-[380px] sm:h-[490px] md:h-[530px] flex items-center justify-center overflow-visible"
        style={{
          perspective: isMobile ? '800px' : '1200px',
          perspectiveOrigin: '50% 50%',
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        {/* Slides Container: Proporción 3:4 (~400x520 en escritorio, ~270x360 en móvil) */}
        <div
          className="relative w-[270px] sm:w-[370px] md:w-[400px] aspect-[3/4] flex items-center justify-center"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {CAROUSEL_SLIDES.map((slide, idx) => {
            // Distancia cíclica más corta al activo
            let diff = idx - current;
            while (diff > total / 2) diff -= total;
            while (diff < -total / 2) diff += total;

            const absDiff = Math.abs(diff);
            const isActive = diff === 0;
            const isNeighbor = absDiff === 1;

            // Ocultar slides más lejanos para un carrusel limpio y de máximo rendimiento
            if (!isActive && !isNeighbor) return null;

            // Coordenadas coverflow minimalista:
            // Activo al centro grande y de frente. Vecinos escalados a ~0.8, rotateY ±12°, ligeramente abajo/atrás
            const stepX = isMobile ? 140 : 220;
            const translateX = diff * stepX + (isDragging ? dragOffset * 0.45 : 0);
            const translateY = isActive ? 0 : 16;
            const translateZ = isActive ? 0 : -140;
            const rotateY = isActive ? 0 : diff > 0 ? -12 : 12;
            const scale = isActive ? 1 : 0.8;
            const opacity = isActive ? 1 : 0.7;
            const zIndex = isActive ? 30 : 10;

            return (
              <motion.div
                key={slide.id}
                onClick={() => {
                  if (!isActive) goTo(idx);
                }}
                animate={
                  reducedMotion
                    ? {
                        opacity: isActive ? 1 : 0,
                        scale: isActive ? 1 : 0.95,
                      }
                    : {
                        x: translateX,
                        y: translateY,
                        z: translateZ,
                        rotateY,
                        scale,
                        opacity,
                      }
                }
                transition={{
                  type: 'spring',
                  stiffness: 220,
                  damping: 28,
                  mass: 0.7,
                }}
                className="absolute inset-0 select-none will-change-transform"
                style={{
                  transformStyle: 'preserve-3d',
                  zIndex,
                  cursor: isActive ? 'grab' : 'pointer',
                  display: reducedMotion && !isActive ? 'none' : 'block',
                }}
                title={isActive ? 'Arrastrar' : `Ver ${slide.title}`}
                aria-hidden={!isActive}
              >
                {/* ── Tarjeta Passepartout: fondo #050505, radio 40px, padding 10-12px ── */}
                <div
                  onMouseEnter={() => {
                    if (isActive) setIsHovered(true);
                  }}
                  onMouseLeave={() => {
                    if (isActive) setIsHovered(false);
                  }}
                  onFocus={() => {
                    if (isActive) setIsFocused(true);
                  }}
                  onBlur={() => {
                    if (isActive) setIsFocused(false);
                  }}
                  className={`w-full h-full rounded-[40px] p-2.5 sm:p-3 bg-[#050505] transition-shadow duration-300 relative overflow-hidden ${
                    isActive ? 'active:cursor-grabbing' : 'hover:opacity-90'
                  }`}
                  style={{
                    border: '1px solid rgba(255, 255, 255, 0.14)',
                    boxShadow: isActive
                      ? '0 30px 80px -20px rgba(0,0,0,0.95), 0 0 45px -10px rgba(255,106,19,0.35), inset 0 1px 1px rgba(255,255,255,0.25), inset 0 -2px 4px rgba(0,0,0,0.8)'
                      : '0 16px 45px -15px rgba(0,0,0,0.85), inset 0 1px 1px rgba(255,255,255,0.15)',
                  }}
                >
                  {/* Borde especular 145deg */}
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 rounded-[40px] pointer-events-none z-10"
                    style={{
                      padding: '1px',
                      background:
                        'linear-gradient(145deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.05) 35%, transparent 60%, rgba(255,255,255,0.1) 100%)',
                      mask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
                      WebkitMask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
                      maskComposite: 'exclude',
                      WebkitMaskComposite: 'destination-out',
                    }}
                  />

                  {/* Contenedor concéntrico para la imagen (no toca el borde exterior) */}
                  <div className="w-full h-full rounded-[28px] sm:rounded-[30px] overflow-hidden bg-[#0A0A0B] relative">
                    <img
                      src={slide.src}
                      alt={slide.alt}
                      loading={idx === 0 ? 'eager' : 'lazy'}
                      decoding="async"
                      fetchPriority={idx === 0 ? 'high' : 'auto'}
                      width="680"
                      height="906"
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-[1.02]"
                    />

                    {/* Sombra y viñeta interna sutil */}
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background:
                          'radial-gradient(ellipse at 50% 20%, transparent 60%, rgba(5,5,5,0.5) 100%), linear-gradient(to top, rgba(5,5,5,0.85) 0%, transparent 40%)',
                      }}
                    />

                    {/* ── Hover en tarjeta activa: panel de información con Motion ── */}
                    {isActive && (
                      <motion.div
                        initial={false}
                        animate={
                          reducedMotion
                            ? { opacity: 1, y: 0, visibility: 'visible' }
                            : {
                                opacity: isRevealed ? 1 : 0,
                                y: isRevealed ? 0 : 16,
                                visibility: isRevealed ? 'visible' : 'hidden',
                              }
                        }
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        className="absolute inset-x-0 bottom-0 p-4 sm:p-5 pt-10 flex flex-col gap-1.5 z-20 pointer-events-none"
                        style={{
                          background:
                            'linear-gradient(to top, rgba(5,5,5,0.92) 0%, rgba(5,5,5,0.68) 65%, transparent 100%)',
                          backdropFilter: 'blur(8px)',
                          WebkitBackdropFilter: 'blur(8px)',
                        }}
                      >
                        <motion.div
                          initial={false}
                          animate={
                            reducedMotion
                              ? { opacity: 1, y: 0 }
                              : {
                                  opacity: isRevealed ? 1 : 0,
                                  y: isRevealed ? 0 : 6,
                                }
                          }
                          transition={{ duration: 0.28, ease: 'easeOut' }}
                          className="flex items-center gap-2"
                        >
                          <span className="w-2 h-2 rounded-full bg-[#FF6A13] shrink-0" aria-hidden="true" />
                          <h4 className="font-display font-bold text-xs sm:text-sm text-[#F5F1EC] leading-tight tracking-wide">
                            {slide.title}
                          </h4>
                        </motion.div>
                        <motion.p
                          initial={false}
                          animate={
                            reducedMotion
                              ? { opacity: 1, y: 0 }
                              : {
                                  opacity: isRevealed ? 1 : 0,
                                  y: isRevealed ? 0 : 8,
                                }
                          }
                          transition={{
                            duration: 0.3,
                            delay: reducedMotion || !isRevealed ? 0 : 0.08,
                            ease: 'easeOut',
                          }}
                          className="font-sans text-[11px] sm:text-xs text-[#A89F98] leading-relaxed line-clamp-2 pl-4"
                        >
                          {slide.description}
                        </motion.p>
                      </motion.div>
                    )}

                    {/* Overlay oscurecimiento suave para vecinas */}
                    {!isActive && (
                      <div
                        aria-hidden="true"
                        className="absolute inset-0 bg-[#050505]/35 pointer-events-none"
                      />
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ── (b) Indicador de puntos en píldora de vidrio centrada debajo ── */}
      <div
        className="mt-4 sm:mt-5 flex items-center gap-2 px-3.5 py-1.5 glass rounded-full z-40 border border-white/12"
        role="tablist"
        aria-label="Paginación de diapositivas"
      >
        {CAROUSEL_SLIDES.map((slide, idx) => {
          const isActive = idx === current;
          return (
            <button
              key={slide.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-label={`Ir al slide ${idx + 1} de ${total}: ${slide.title}`}
              onClick={() => goTo(idx)}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                isActive
                  ? 'w-6 bg-[#FF6A13] shadow-[0_0_12px_rgba(255,106,19,0.9)]'
                  : 'w-2 bg-white/25 hover:bg-white/50'
              }`}
            />
          );
        })}
      </div>

      {/* Anuncio accesible para lectores de pantalla */}
      <div aria-live="polite" className="sr-only">
        Slide {current + 1} de {total}: {activeSlide.title}
      </div>
    </div>
  );
};

import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowRight } from 'lucide-react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

const STICKY_MESSAGES = [
  '🎁 Tienes 10.000 Credihots esperando — termina tu registro',
  'Regístrate gratis, sin compromiso',
  'Sé parte de los primeros en nuestra red',
  'Conecta con hoteles verificados desde el día uno',
  'Tu registro toma menos de 2 minutos',
  '¿Worker o Hotel? Hay un lugar para ti',
] as const;

const INITIAL_DELAY_MS = 11000;
const VISIBLE_DURATION_MS = 5800;
const PAUSE_DURATION_MS = 12000;

interface StickyConversionBarProps {
  /** Cuando es true (ej. modal de Credihots abierto), oculta y pausa el ciclo. */
  suppressed?: boolean;
  /** Habilita el ciclo (ej. tras completar Loader y fuera de /registro). */
  enabled?: boolean;
}

export const StickyConversionBar: React.FC<StickyConversionBarProps> = ({
  suppressed = false,
  enabled = true,
}) => {
  const navigate = useNavigate();
  const reducedMotion = useReducedMotion();

  const [messageIndex, setMessageIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const hasShownFirstRef = useRef(false);

  const shouldShow = enabled && !suppressed && isVisible;

  useEffect(() => {
    if (!enabled || suppressed) return;

    // Pausa el auto-ocultado mientras el usuario hace hover o foco sobre la notificación
    if (isVisible && (isHovered || isFocused)) return;

    if (isVisible) {
      const hideTimer = window.setTimeout(() => {
        setIsVisible(false);
        setMessageIndex((prev) => (prev + 1) % STICKY_MESSAGES.length);
      }, VISIBLE_DURATION_MS);

      return () => window.clearTimeout(hideTimer);
    }

    const delay = hasShownFirstRef.current ? PAUSE_DURATION_MS : INITIAL_DELAY_MS;
    const showTimer = window.setTimeout(() => {
      hasShownFirstRef.current = true;
      setIsVisible(true);
    }, delay);

    return () => window.clearTimeout(showTimer);
  }, [enabled, suppressed, isVisible, isHovered, isFocused]);

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsHovered(false);
    setIsFocused(false);
    setIsVisible(false);
    setMessageIndex((prev) => (prev + 1) % STICKY_MESSAGES.length);
  };

  const handleNavigate = () => {
    setIsHovered(false);
    setIsFocused(false);
    setIsVisible(false);
    navigate('/registro');
  };

  const currentMessage = STICKY_MESSAGES[messageIndex];

  return (
    <div className="fixed z-[60] bottom-3 inset-x-3 sm:inset-x-auto sm:bottom-6 sm:right-6 sm:w-full sm:max-w-[380px] pointer-events-none">
      <AnimatePresence mode="wait">
        {shouldShow && (
          <motion.div
            key={messageIndex}
            initial={reducedMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={
              reducedMotion
                ? { opacity: 0, transition: { duration: 0 } }
                : { opacity: 0, y: 16 }
            }
            transition={
              reducedMotion
                ? { duration: 0 }
                : { duration: 0.32, ease: [0.22, 1, 0.36, 1] }
            }
            role="button"
            tabIndex={0}
            aria-label={`${currentMessage}. Ir a registro`}
            onClick={handleNavigate}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleNavigate();
              }
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onFocus={() => setIsFocused(true)}
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget)) {
                setIsFocused(false);
              }
            }}
            className="pointer-events-auto cursor-pointer select-none group outline-none focus-visible:ring-2 focus-visible:ring-[#FF6A13] rounded-2xl"
          >
            <div
              className={`flex items-end gap-3 ${
                reducedMotion
                  ? ''
                  : 'transition-transform duration-200 ease-out sm:group-hover:-translate-y-1'
              }`}
            >
              {/* Avatar circular del dado (52-56px) + rebote sutil + anillo ping + punto verde */}
              <motion.div
                aria-hidden="true"
                className="relative w-[52px] h-[52px] sm:w-14 sm:h-14 rounded-full flex-shrink-0"
                animate={
                  reducedMotion
                    ? undefined
                    : {
                        y: [0, -7, 0, -3, 0, 0],
                      }
                }
                transition={
                  reducedMotion
                    ? undefined
                    : {
                        duration: 2.4,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        times: [0, 0.22, 0.4, 0.56, 0.72, 1],
                      }
                }
              >
                {/* Anillo de ping expansivo alrededor del avatar */}
                {!reducedMotion && (
                  <motion.span
                    aria-hidden="true"
                    className="absolute inset-0 rounded-full border border-[#FF6A13]/70 pointer-events-none"
                    animate={{
                      scale: [1, 1.42],
                      opacity: [0.45, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeOut',
                    }}
                  />
                )}

                <div
                  className={`relative w-full h-full rounded-full flex items-center justify-center ${
                    reducedMotion
                      ? ''
                      : 'transition-transform duration-300 group-hover:scale-105'
                  }`}
                  style={{
                    background: '#0A0A0B',
                    boxShadow:
                      '0 8px 24px rgba(0,0,0,0.7), 0 0 18px rgba(255,106,19,0.38), 0 0 0 1px rgba(255,106,19,0.45)',
                  }}
                >
                  <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center">
                    <img
                      src="/brand/logo.jpeg"
                      alt=""
                      className="w-full h-full object-contain"
                      style={{ mixBlendMode: 'screen', transform: 'scale(1.08)' }}
                    />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#25D366] border-2 border-[#0A0A0B] animate-pulse shadow-[0_0_8px_rgba(37,211,102,0.8)]" />
                </div>
              </motion.div>

              {/* Burbuja de texto estilo chat — técnica "glass negro moderno" + resplandor naranja */}
              <div
                className={`relative flex-1 min-w-0 rounded-2xl rounded-bl-md p-4 pr-9 overflow-hidden shadow-[0_18px_40px_-10px_rgba(0,0,0,0.8),0_0_24px_rgba(255,106,19,0.42),0_0_48px_rgba(255,106,19,0.18)] ${
                  reducedMotion
                    ? ''
                    : 'transition-shadow duration-300 sm:group-hover:shadow-[0_22px_46px_-10px_rgba(0,0,0,0.85),0_0_32px_rgba(255,106,19,0.58),0_0_58px_rgba(255,106,19,0.28)]'
                }`}
              >
                {/* z-index 0: Anillo exterior de marca */}
                <span
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '16px 16px 16px 6px',
                    background:
                      'linear-gradient(180deg, rgba(255,176,32,0.68) 0%, rgba(255,106,19,0.46) 55%, rgba(225,6,0,0.42) 100%)',
                    zIndex: 0,
                  }}
                />

                {/* z-index 1: Relleno interior negro vidrio moderno */}
                <span
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    inset: '1px',
                    borderRadius: '15px 15px 15px 5px',
                    background:
                      'linear-gradient(180deg, rgba(34,30,32,0.95) 0%, rgba(14,14,17,0.98) 52%, rgba(6,6,8,0.99) 100%)',
                    zIndex: 1,
                  }}
                />

                {/* z-index 2: Highlight glossy superior */}
                <span
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    top: '1px',
                    left: '1px',
                    right: '1px',
                    height: '22px',
                    borderRadius: '15px 15px 40% 40%',
                    background:
                      'linear-gradient(180deg, rgba(255,255,255,0.24) 0%, rgba(255,255,255,0.06) 45%, transparent 100%)',
                    pointerEvents: 'none',
                    zIndex: 2,
                  }}
                />

                {/* Botón cerrar mensaje actual */}
                <button
                  type="button"
                  onClick={handleDismiss}
                  aria-label="Cerrar notificación"
                  className="absolute top-2.5 right-2.5 z-[4] w-6 h-6 rounded-full bg-white/[0.07] hover:bg-white/[0.16] flex items-center justify-center text-[#A89F98] hover:text-[#F5F1EC] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6A13]"
                >
                  <X className="w-3.5 h-3.5" strokeWidth={1.75} />
                </button>

                {/* z-index 3: Mensaje + flecha animada + micro-texto */}
                <div className="relative z-[3] flex flex-col gap-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-sans text-sm sm:text-[15px] font-medium text-[#F5F1EC] leading-snug group-hover:text-white transition-colors">
                      {currentMessage}
                    </p>
                    <motion.span
                      aria-hidden="true"
                      className="inline-flex shrink-0 text-[#FFB020]"
                      animate={
                        reducedMotion
                          ? undefined
                          : {
                              x: [0, 4, 0],
                            }
                      }
                      transition={
                        reducedMotion
                          ? undefined
                          : {
                              duration: 1.2,
                              repeat: Infinity,
                              ease: 'easeInOut',
                            }
                      }
                    >
                      <ArrowRight className="w-4 h-4" strokeWidth={2} />
                    </motion.span>
                  </div>

                  <span className="font-sans text-[11px] text-[#A89F98]/85 tracking-wide">
                    <span className="sm:hidden">Toca para continuar</span>
                    <span className="hidden sm:inline">Haz clic para continuar</span>
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

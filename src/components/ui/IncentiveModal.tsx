import React, { useEffect, useRef, useId, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Gift, X, ArrowRight, Sparkles } from 'lucide-react';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { Button } from './Button';

interface IncentiveModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export const IncentiveModal: React.FC<IncentiveModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const reducedMotion = useReducedMotion();
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const descId = useId();

  const handleClaim = useCallback(() => {
    onClose();
    navigate('/registro');
  }, [navigate, onClose]);

  // Bloquea el scroll del documento mientras el modal está abierto
  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  // Gestión de foco (focus trap básico + restauración) y cierre con Escape
  useEffect(() => {
    if (!isOpen) return;

    const previousActiveElement = document.activeElement as HTMLElement | null;
    dialogRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key !== 'Tab') return;

      const dialog = dialogRef.current;
      if (!dialog) return;

      const focusable = Array.from(
        dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      );
      if (focusable.length === 0) {
        e.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first || document.activeElement === dialog) {
          e.preventDefault();
          last.focus();
        }
      } else if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (previousActiveElement && typeof previousActiveElement.focus === 'function') {
        previousActiveElement.focus();
      }
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="incentive-modal-backdrop"
          data-lenis-prevent
          initial={reducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reducedMotion ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0 }}
          transition={{ duration: reducedMotion ? 0 : 0.25 }}
          onClick={onClose}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-sm"
        >
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={descId}
            tabIndex={-1}
            initial={reducedMotion ? false : { opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={
              reducedMotion
                ? { opacity: 0, transition: { duration: 0 } }
                : { opacity: 0, scale: 0.94, y: 10 }
            }
            transition={
              reducedMotion
                ? { duration: 0 }
                : { duration: 0.35, ease: [0.22, 1, 0.36, 1] }
            }
            onClick={(e) => {
              e.stopPropagation();
              handleClaim();
            }}
            className="relative w-full max-w-[460px] rounded-[32px] p-7 sm:p-10 overflow-hidden cursor-pointer select-none outline-none focus-visible:ring-2 focus-visible:ring-[#FF6A13]"
            style={{
              boxShadow:
                '0 28px 70px -12px rgba(225,6,0,0.45), 0 0 40px -8px rgba(255,106,19,0.35), 0 18px 40px -10px rgba(0,0,0,0.85)',
            }}
          >
            {/* z-index 0: Anillo exterior con gradiente de marca (técnica Navbar) */}
            <span
              aria-hidden="true"
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '32px',
                background: 'linear-gradient(180deg, #FFB020 0%, #FF6A13 45%, #E10600 100%)',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.45)',
                zIndex: 0,
              }}
            />

            {/* z-index 1: Relleno interior negro vidrio moderno */}
            <span
              aria-hidden="true"
              style={{
                position: 'absolute',
                inset: '1.5px',
                borderRadius: '30.5px',
                background:
                  'linear-gradient(180deg, rgba(38,20,16,0.96) 0%, rgba(14,12,14,0.98) 52%, rgba(6,5,6,0.99) 100%)',
                zIndex: 1,
              }}
            />

            {/* z-index 2: Highlight glossy superior */}
            <span
              aria-hidden="true"
              style={{
                position: 'absolute',
                top: '1.5px',
                left: '1.5px',
                right: '1.5px',
                height: '40px',
                borderRadius: '30.5px 30.5px 40% 40%',
                background:
                  'linear-gradient(180deg, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0.06) 45%, transparent 100%)',
                pointerEvents: 'none',
                zIndex: 2,
              }}
            />

            {/* Botón de cierre (X) */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              aria-label="Cerrar promoción"
              className="absolute top-4 right-4 z-[4] w-9 h-9 rounded-full bg-white/[0.08] border border-white/15 flex items-center justify-center text-[#A89F98] hover:text-[#F5F1EC] hover:bg-white/[0.15] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6A13]"
            >
              <X className="w-4 h-4" strokeWidth={1.75} />
            </button>

            {/* z-index 3: Contenido */}
            <div className="relative z-[3] flex flex-col items-center text-center">
              {/* Tag superior */}
              <div className="inline-flex items-center gap-1.5 rounded-full border border-[#FFB020]/35 bg-[#FF6A13]/15 px-3.5 py-1 mb-5">
                <Sparkles className="w-3.5 h-3.5 text-[#FFB020]" strokeWidth={1.75} aria-hidden="true" />
                <span className="font-mono text-[10px] uppercase tracking-widest text-[#FFB020] font-semibold">
                  Bono de Bienvenida
                </span>
              </div>

              {/* Ícono Gift en badge circular con glow y rebote sutil */}
              <motion.div
                aria-hidden="true"
                className="mb-6 rounded-full"
                animate={
                  reducedMotion
                    ? undefined
                    : {
                        y: [0, -7, 0, -3, 0, 0],
                        boxShadow: [
                          '0 0 0px rgba(255,106,19,0)',
                          '0 8px 26px rgba(255,106,19,0.38)',
                          '0 0 4px rgba(255,106,19,0.12)',
                          '0 6px 20px rgba(255,176,32,0.28)',
                          '0 0 0px rgba(255,106,19,0)',
                          '0 0 0px rgba(255,106,19,0)',
                        ],
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
                <div
                  className="relative w-20 h-20 rounded-full flex items-center justify-center overflow-hidden"
                  style={{
                    background: 'linear-gradient(180deg, #FFB020 0%, #FF6A13 55%, #E10600 100%)',
                    border: '1.5px solid rgba(255,255,255,0.35)',
                    boxShadow:
                      '0 10px 30px rgba(255,106,19,0.55), 0 0 24px rgba(225,6,0,0.45), inset 0 -3px 6px rgba(0,0,0,0.35)',
                  }}
                >
                  <span
                    aria-hidden="true"
                    style={{
                      position: 'absolute',
                      top: '2px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '86%',
                      height: '46%',
                      borderRadius: '9999px 9999px 45% 45%',
                      background:
                        'linear-gradient(180deg, rgba(255,255,255,0.55) 0%, transparent 100%)',
                      pointerEvents: 'none',
                    }}
                  />
                  <Gift
                    className="relative z-10 w-10 h-10 text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.35)]"
                    strokeWidth={1.75}
                  />
                </div>
              </motion.div>

              {/* Título */}
              <h2
                id={titleId}
                className="font-display font-extrabold text-2xl sm:text-3xl tracking-tight text-[#F5F1EC] leading-tight mb-3"
              >
                ¡Ya ganaste{' '}
                <span className="text-gradient">10.000 Credihots!</span>
              </h2>

              {/* Subtítulo */}
              <p
                id={descId}
                className="font-sans text-base sm:text-lg text-[#D6CFC9] leading-relaxed mb-7 max-w-sm"
              >
                Continúa con tu registro para reclamarlos
              </p>

              {/* CTA principal */}
              <Button
                type="button"
                variant="primary"
                size="lg"
                isFullWidth
                onClick={(e) => {
                  e.stopPropagation();
                  handleClaim();
                }}
                icon={<ArrowRight className="w-4 h-4" strokeWidth={1.75} />}
              >
                Reclamar ahora
              </Button>

              {/* Nota aclaratoria */}
              <p className="mt-4 font-sans text-xs text-[#A89F98]/85 leading-relaxed">
                Los Credihots se activan al completar tu registro en la app
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

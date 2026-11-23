import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  AnimatePresence,
  animate,
  motion,
  useAnimationFrame,
  useMotionValue,
  useSpring,
  useTransform,
} from 'motion/react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

const LOAD_DURATION_MS = 1800;
const REDUCED_MOTION_DURATION_MS = 280;
const PROGRESS_TICK_MS = 25;
const COMPLETE_HOLD_MS = 200;
const REDUCED_HOLD_MS = 60;
const DICE_ROTATION_DEG = 360;
const DICE_BOUNCE_PERIOD_MS = 620;
const DICE_BOUNCE_AMPLITUDE_PX = 20;
const PUMM_DURATION_MS = 300;
const PUMM_CLOSE_MS = 250;

export const Loader: React.FC<{ onComplete?: () => void }> = ({ onComplete }) => {
  const prefersReducedMotion = useReducedMotion();

  // El callback se guarda en un ref: una identidad inestable en el padre no
  // debe reiniciar el temporizador de carga a mitad del recorrido.
  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const completedRef = useRef(false);
  const notifyComplete = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    onCompleteRef.current?.();
  }, []);

  // El preloader se muestra en CADA carga o recarga (F5). No hay flag de
  // sesión que pueda omitirlo: el porcentaje siempre recorre 0% -> 100%.
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  const finishingRef = useRef(false);
  const closeTimeoutRef = useRef<number | undefined>(undefined);

  const rawProgress = useMotionValue(0);
  const smoothProgress = useSpring(rawProgress, {
    stiffness: 110,
    damping: 22,
    mass: 0.35,
  });
  // Giro en el plano (rotateZ), siempre en sentido horario. Con reduced motion
  // el rango es constante y el dado permanece quieto.
  const diceRotation = useTransform(
    smoothProgress,
    [0, 100],
    prefersReducedMotion ? [0, 0] : [0, DICE_ROTATION_DEG],
  );
  const diceY = useMotionValue(0);
  const diceScale = useMotionValue(1);

  const finish = useCallback(() => {
    if (finishingRef.current) return;
    finishingRef.current = true;
    rawProgress.set(100);
    setProgress(100);

    if (prefersReducedMotion) {
      // Cierre rápido y seguro: sin rebote ni remate animado.
      closeTimeoutRef.current = window.setTimeout(() => setIsLoading(false), 0);
      return;
    }

    // "Pumm": impulso vertical corto con aplastamiento elástico antes de
    // revelar la página. El vaivén se detiene para que este remate sea limpio.
    const keyframeTimes = [0, 0.35, 0.7, 1];
    animate(diceY, [0, 12, -8, 0], {
      duration: PUMM_DURATION_MS / 1000,
      ease: 'easeOut',
      times: keyframeTimes,
    });
    animate(diceScale, [1, 0.9, 1.06, 1], {
      duration: PUMM_DURATION_MS / 1000,
      ease: 'easeOut',
      times: keyframeTimes,
    });
    closeTimeoutRef.current = window.setTimeout(() => setIsLoading(false), PUMM_CLOSE_MS);
  }, [diceScale, diceY, prefersReducedMotion, rawProgress]);

  useEffect(
    () => () => {
      if (closeTimeoutRef.current !== undefined) window.clearTimeout(closeTimeoutRef.current);
    },
    [],
  );

  useEffect(() => {
    if (!isLoading) return;

    const duration = prefersReducedMotion ? REDUCED_MOTION_DURATION_MS : LOAD_DURATION_MS;
    const hold = prefersReducedMotion ? REDUCED_HOLD_MS : COMPLETE_HOLD_MS;
    const startTime = performance.now();
    let holdTimeout: number | undefined;

    const interval = window.setInterval(() => {
      const elapsed = performance.now() - startTime;
      const pct = Math.min((elapsed / duration) * 100, 100);
      rawProgress.set(pct);
      setProgress(pct);

      if (pct >= 100) {
        window.clearInterval(interval);
        holdTimeout = window.setTimeout(finish, hold);
      }
    }, PROGRESS_TICK_MS);

    return () => {
      window.clearInterval(interval);
      if (holdTimeout !== undefined) window.clearTimeout(holdTimeout);
    };
  }, [isLoading, prefersReducedMotion, finish, rawProgress]);

  // Vaivén con desaceleración natural: sube y baja suave (seno amortiguado),
  // con una amplitud que se apaga a medida que avanza el loading.
  useAnimationFrame((time) => {
    if (!isLoading || prefersReducedMotion || finishingRef.current) return;
    const pct = rawProgress.get();
    const amplitude = DICE_BOUNCE_AMPLITUDE_PX * (1 - Math.min(pct / 130, 0.65));
    const phase = (time % DICE_BOUNCE_PERIOD_MS) / DICE_BOUNCE_PERIOD_MS;
    diceY.set(-Math.pow(Math.sin(Math.PI * phase), 1.6) * amplitude);
  });

  const roundedProgress = Math.round(progress);
  const exitAnimation = prefersReducedMotion
    ? { opacity: 0, transition: { duration: 0.12 } }
    : {
        opacity: 0,
        scale: 1.04,
        clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)',
        transition: { duration: 0.45, ease: [0.76, 0, 0.24, 1] as const },
      };

  return (
    // El aviso llega cuando la apertura terminó: el scroll inicial de la Home
    // arranca con la página ya visible, no mientras el overlay sigue tapando.
    <AnimatePresence onExitComplete={notifyComplete}>
      {isLoading && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={exitAnimation}
          role="status"
          aria-live="polite"
          aria-label="Cargando Hot Company"
          className="fixed inset-0 z-[99999] bg-[#0A0A0B] flex flex-col items-center justify-center p-6 select-none"
        >
          {/* Ambient glow */}
          <div
            aria-hidden="true"
            className="absolute w-80 h-80 rounded-full blur-3xl animate-pulse"
            style={{ background: 'radial-gradient(circle, rgba(225,6,0,0.35) 0%, rgba(255,106,19,0.2) 50%, transparent 75%)' }}
          />

          {/* Dado: giro horario ligado al progreso + rebote suave + remate final */}
          <motion.div className="relative" style={{ y: diceY }}>
            <motion.div
              className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-3xl mb-7 flex items-center justify-center glass border border-white/20"
              style={{
                rotate: diceRotation,
                scale: diceScale,
                boxShadow: '0 0 50px rgba(225,6,0,0.5), 0 0 25px rgba(255,106,19,0.4), inset 0 1px 1px rgba(255,255,255,0.4)',
              }}
            >
              <img
                src="/brand/logo.jpeg"
                alt=""
                aria-hidden="true"
                className="w-full h-full object-contain"
                style={{ mixBlendMode: 'screen', transform: 'scale(1.08)' }}
              />
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-6"
          >
            <p className="font-display font-bold text-xl sm:text-2xl tracking-[0.2em] text-[#F5F1EC] uppercase">
              Hot Company
            </p>
            <p className="font-mono text-[10px] text-[#FF6A13] tracking-widest uppercase mt-1">
              S.A.S. · Plataforma Digital
            </p>
          </motion.div>

          {/* Progress bar */}
          <div className="w-52 sm:w-72 h-[3px] glass rounded-full overflow-hidden relative">
            <motion.div
              className="h-full rounded-full"
              style={{
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #E10600, #FF6A13, #FFB020)',
                boxShadow: '0 0 10px #FF6A13',
              }}
            />
          </div>

          <span aria-hidden="true" className="font-mono text-[11px] text-[#A89F98] mt-2">
            {roundedProgress}%
          </span>
          <span className="sr-only">
            {roundedProgress >= 100 ? 'Carga completada' : 'Cargando sitio'}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

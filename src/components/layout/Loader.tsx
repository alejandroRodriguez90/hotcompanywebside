import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export const Loader: React.FC<{ onComplete?: () => void }> = ({ onComplete }) => {
  const [isLoading, setIsLoading] = useState(() => {
    if (typeof window === 'undefined') return false;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
    return !sessionStorage.getItem('hotcompany_has_loaded');
  });
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isLoading) return;

    const startTime = performance.now();
    const DURATION = 1800;

    const interval = setInterval(() => {
      const elapsed = performance.now() - startTime;
      const pct = Math.min((elapsed / DURATION) * 100, 100);
      setProgress(pct);

      if (pct >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          sessionStorage.setItem('hotcompany_has_loaded', 'true');
          setIsLoading(false);
          onComplete?.();
        }, 200);
      }
    }, 25);

    return () => clearInterval(interval);
  }, [isLoading, onComplete]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)',
            transition: { duration: 0.6, ease: [0.77, 0, 0.175, 1] },
          }}
          className="fixed inset-0 z-[99999] bg-[#0A0A0B] flex flex-col items-center justify-center p-6 select-none"
        >
          {/* Ambient glow */}
          <div
            aria-hidden="true"
            className="absolute w-80 h-80 rounded-full blur-3xl animate-pulse"
            style={{ background: 'radial-gradient(circle, rgba(225,6,0,0.35) 0%, rgba(255,106,19,0.2) 50%, transparent 75%)' }}
          />

          {/* Logo */}
          <motion.div
            animate={{ rotateY: [0, 360], scale: [0.96, 1.04, 0.96] }}
            transition={{ rotateY: { duration: 3, repeat: Infinity, ease: 'easeInOut' }, scale: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' } }}
            className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-3xl mb-7 flex items-center justify-center glass border border-white/20"
            style={{ boxShadow: '0 0 50px rgba(225,6,0,0.5), 0 0 25px rgba(255,106,19,0.4), inset 0 1px 1px rgba(255,255,255,0.4)' }}
          >
            <img
              src="/brand/logo.jpeg"
              alt="HOT COMPANY — cargando"
              className="w-full h-full object-contain"
              style={{ mixBlendMode: 'screen', transform: 'scale(1.08)' }}
            />
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

          <span className="font-mono text-[11px] text-[#A89F98] mt-2">{Math.round(progress)}%</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

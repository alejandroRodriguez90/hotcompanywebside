import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, BadgeCheck, ShieldCheck, Sparkles, Clock, Smartphone,
  type LucideIcon,
} from 'lucide-react';
import { MARQUEE_ITEMS } from '../../lib/constants';
import { useReducedMotion } from '../../hooks/useReducedMotion';

const ICON_MAP: Record<string, LucideIcon> = {
  Users,
  BadgeCheck,
  ShieldCheck,
  Sparkles,
  Clock,
  Smartphone,
};

const MARQUEE_TEXT_GRADIENT = 'linear-gradient(90deg, #F5F1EC 0%, #A89F98 100%)';

/** Un gradiente cálido distinto por cada uno de los 6 mensajes del marquee.
 *  El orden coincide con MARQUEE_ITEMS; el loop duplicado usa i % 6
 *  para mantener el mismo color en cada repetición. */
const BADGE_COLORS: readonly string[] = [
  'linear-gradient(180deg, #FF4D4D 0%, #B91C1C 100%)',   // 1 Rojo
  'linear-gradient(180deg, #FF8A3D 0%, #C2410C 100%)',   // 2 Naranja
  'linear-gradient(180deg, #FFC24D 0%, #B45309 100%)',   // 3 Ámbar
  'linear-gradient(180deg, #FF6B9D 0%, #BE185D 100%)',   // 4 Rosa
  'linear-gradient(180deg, #FF7A6B 0%, #A3391A 100%)',   // 5 Coral-salmón (diferenciado del naranja #2)
  'linear-gradient(180deg, #D94D6B 0%, #7F1D3D 100%)',   // 6 Vino
] as const;

/**
 * Marquee — franja plana, CSS translateX loop, 15 s/vuelta.
 * Pausa en hover (CSS animation-play-state) y fuera del viewport (IntersectionObserver → clase).
 * prefers-reduced-motion: estático, overflow hidden.
 */
export const Marquee: React.FC = () => {
  const navigate = useNavigate();
  const reducedMotion = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // IntersectionObserver → pausa cuando sale del viewport vía clase CSS
  useEffect(() => {
    const wrapper = wrapperRef.current;
    const track = trackRef.current;
    if (!wrapper || !track || reducedMotion) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        track.style.animationPlayState = entry.isIntersecting ? 'running' : 'paused';
      },
      { threshold: 0.05 }
    );
    io.observe(wrapper);
    return () => io.disconnect();
  }, [reducedMotion]);

  // Duplicate for seamless loop
  const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];

  return (
    <div
      ref={wrapperRef}
      role="link"
      tabIndex={0}
      aria-label="Ir a registro"
      onClick={() => navigate('/registro')}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          navigate('/registro');
        }
      }}
      className="marquee-sheen relative border-y border-white/[0.14] overflow-hidden cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6A13] focus-visible:ring-inset"
      style={{
        height: '60px',
        borderRadius: 0,
      }}
    >
      {/* z-index 0: Fondo interior negro vidrio moderno */}
      <span
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(32,32,36,0.90) 0%, rgba(14,14,17,0.95) 52%, rgba(6,6,8,0.98) 100%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      {/* z-index 1: Highlight glossy superior en toda la franja */}
      <span
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '52%',
          background: 'linear-gradient(180deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.05) 48%, transparent 100%)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* z-index 3: Máscara lateral aplicada solo al texto en movimiento */}
      <div
        className="relative h-full w-full"
        style={{
          zIndex: 3,
          maskImage: 'linear-gradient(to right, transparent 0%, #000 8%, #000 92%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to right, transparent 0%, #000 8%, #000 92%, transparent 100%)',
        }}
      >
        <div
          ref={trackRef}
          className={`absolute top-0 left-0 h-full flex items-center ${reducedMotion ? '' : 'marquee-track'}`}
          style={reducedMotion ? { width: '100%', overflow: 'hidden' } : undefined}
          onMouseEnter={() => {
            if (trackRef.current) trackRef.current.style.animationPlayState = 'paused';
          }}
          onMouseLeave={() => {
            if (trackRef.current) trackRef.current.style.animationPlayState = 'running';
          }}
        >
          {items.map((item, i) => {
            const Icon = ICON_MAP[item.icon];
            const badgeGradient = BADGE_COLORS[i % BADGE_COLORS.length];
            return (
              <React.Fragment key={`${item.label}-${i}`}>
                {/* Item */}
                <div className="flex items-center gap-2.5 px-5 flex-shrink-0 group">
                  {Icon && (
                    <span
                      aria-hidden="true"
                      className="relative flex-shrink-0 w-[26px] h-[26px] rounded-full overflow-hidden flex items-center justify-center"
                      style={{
                        background: badgeGradient,
                        border: '1px solid rgba(255,255,255,0.28)',
                        boxShadow: '0 2px 8px rgba(220,38,38,0.42), inset 0 -2px 3px rgba(0,0,0,0.35)',
                      }}
                    >
                      <span
                        aria-hidden="true"
                        style={{
                          position: 'absolute',
                          top: '1px',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          width: '90%',
                          height: '48%',
                          borderRadius: '9999px 9999px 45% 45%',
                          background: 'linear-gradient(180deg, rgba(255,255,255,0.55) 0%, transparent 100%)',
                          pointerEvents: 'none',
                          zIndex: 1,
                        }}
                      />
                      <Icon
                        className="relative w-3.5 h-3.5 text-white flex-shrink-0"
                        style={{ zIndex: 2 }}
                        strokeWidth={1.8}
                        aria-hidden="true"
                      />
                    </span>
                  )}
                  <span
                    className="font-display text-[10px] uppercase tracking-[0.14em] whitespace-nowrap transition-colors duration-200 select-none"
                    style={{
                      background: MARQUEE_TEXT_GRADIENT,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      color: 'transparent',
                    }}
                  >
                    {item.label}
                  </span>
                </div>

                {/* Rotating pip separator */}
                <div
                  aria-hidden="true"
                  className="flex-shrink-0 mx-1 pip-rotate"
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '2px',
                    background: 'rgba(255,106,19,0.55)',
                  }}
                />
              </React.Fragment>
            );
          })}
        </div>
      </div>

      <style>{`
        .marquee-sheen::after {
          content: "";
          position: absolute;
          top: -80%;
          left: -35%;
          width: 28%;
          height: 260%;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 255, 255, 0.18) 50%,
            transparent 100%
          );
          transform: rotate(25deg);
          transition: left 1.35s ease;
          pointer-events: none;
          z-index: 2;
        }
        .marquee-sheen:hover::after {
          left: 120%;
        }
        .marquee-track {
          width: max-content;
          animation: marqueeScroll 15s linear infinite;
        }
        @keyframes marqueeScroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .pip-rotate {
          animation: pipSpin 4s linear infinite;
        }
        @keyframes pipSpin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          .marquee-track { animation: none !important; }
          .pip-rotate    { animation: none !important; }
          .marquee-sheen::after,
          .marquee-sheen:hover::after {
            transition: none;
            left: -35%;
          }
        }
      `}</style>
    </div>
  );
};

import React, { useRef, useEffect } from 'react';
import {
  Repeat, BadgeCheck, Users, MapPin, TrendingUp, ShieldCheck,
  type LucideIcon,
} from 'lucide-react';
import { MARQUEE_ITEMS } from '../../lib/constants';
import { useReducedMotion } from '../../hooks/useReducedMotion';

const ICON_MAP: Record<string, LucideIcon> = {
  Repeat,
  BadgeCheck,
  Users,
  MapPin,
  TrendingUp,
  ShieldCheck,
};

/**
 * Marquee — franja plana, CSS translateX loop, 15 s/vuelta.
 * Pausa en hover (CSS animation-play-state) y fuera del viewport (IntersectionObserver → clase).
 * prefers-reduced-motion: estático, overflow hidden.
 */
export const Marquee: React.FC = () => {
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
      className="relative border-y border-white/[0.07] overflow-hidden"
      style={{
        height: '60px',
        // Lateral fade mask
        maskImage: 'linear-gradient(to right, transparent 0%, #000 8%, #000 92%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to right, transparent 0%, #000 8%, #000 92%, transparent 100%)',
      }}
      aria-hidden="true"
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
          const isOutline = i % 2 === 1; // alternating fill / outline style
          const Icon = ICON_MAP[item.icon];
          return (
            <React.Fragment key={`${item.label}-${i}`}>
              {/* Item */}
              <div className="flex items-center gap-2 px-5 flex-shrink-0 group cursor-default">
                {Icon && (
                  <Icon
                    className={`w-4 h-4 flex-shrink-0 transition-colors duration-200 ${
                      isOutline
                        ? 'text-[#A89F98] group-hover:text-[#FF6A13]'
                        : 'text-[#FF6A13] group-hover:text-[#FFB020]'
                    }`}
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                )}
                <span
                  className="font-display text-[10px] uppercase tracking-[0.14em] whitespace-nowrap transition-colors duration-200 select-none"
                  style={
                    isOutline
                      ? {
                          WebkitTextStroke: '0.8px rgba(168,159,152,0.7)',
                          color: 'transparent',
                        }
                      : {
                          color: '#A89F98',
                        }
                  }
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

      <style>{`
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
        }
      `}</style>
    </div>
  );
};

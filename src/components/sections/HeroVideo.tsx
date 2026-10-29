import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { HERO_VIDEOS, type HeroVideoOption } from '../../lib/constants';

interface HeroVideoProps {
  containerRef?: React.RefObject<HTMLElement | null>;
}

export const HeroVideo: React.FC<HeroVideoProps> = ({ containerRef }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const [isDataSaver] = useState(() => {
    if (typeof navigator !== 'undefined') {
      const conn = (navigator as unknown as { connection?: { saveData?: boolean } }).connection;
      return Boolean(conn?.saveData);
    }
    return false;
  });

  // Selector de video centralizado (por defecto el primero; en DEV permite ?video=N con índice 1-based)
  const selectedVideo: HeroVideoOption = (() => {
    if (import.meta.env.DEV && typeof window !== 'undefined') {
      const param = new URLSearchParams(window.location.search).get('video');
      if (param) {
        const idx = parseInt(param, 10) - 1;
        if (!isNaN(idx) && idx >= 0 && idx < HERO_VIDEOS.length) {
          return HERO_VIDEOS[idx];
        }
      }
    }
    return HERO_VIDEOS[0];
  })();

  // Parallax subtle with useScroll (only transform)
  const { scrollYProgress } = useScroll({
    target: (containerRef as React.RefObject<HTMLElement>) || wrapperRef,
    offset: ['start start', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);

  // Pause video when Hero leaves the viewport (IntersectionObserver)
  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl || reducedMotion || isDataSaver) return;

    const target = containerRef?.current || wrapperRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            videoEl.play().catch(() => {
              // Ignore autoplay failure policy
            });
          } else {
            videoEl.pause();
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [containerRef, reducedMotion, isDataSaver]);

  const shouldDisableVideo = reducedMotion || isDataSaver;

  return (
    <div
      ref={wrapperRef}
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0"
      style={{
        maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 50%, rgba(0,0,0,0) 95%)',
        WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 50%, rgba(0,0,0,0) 95%)',
      }}
    >
      <motion.div
        className="w-full h-[125%] relative will-change-transform"
        style={reducedMotion ? {} : { y }}
      >
        {shouldDisableVideo ? (
          <img
            src={selectedVideo.poster || '/videos/hero-poster.jpg'}
            alt=""
            className="w-full h-full object-cover opacity-35 sm:opacity-55"
            style={
              selectedVideo.tint !== 'none'
                ? { filter: 'sepia(80%) saturate(320%) hue-rotate(345deg) brightness(0.85)' }
                : {}
            }
          />
        ) : (
          <video
            ref={videoRef}
            key={selectedVideo.id}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={selectedVideo.poster || '/videos/hero-poster.jpg'}
            className="w-full h-full object-cover opacity-35 sm:opacity-55"
            style={
              selectedVideo.tint !== 'none'
                ? { filter: 'sepia(80%) saturate(340%) hue-rotate(345deg) brightness(0.9)' }
                : {}
            }
          >
            {selectedVideo.webm && <source src={selectedVideo.webm} type="video/webm" />}
            <source src={selectedVideo.mp4} type="video/mp4" />
          </video>
        )}

        {/* Capa de tinte cálido complementaria para fundir tonos fríos a la paleta naranja/rojo */}
        {selectedVideo.tint !== 'none' && (
          <div
            className="absolute inset-0 mix-blend-color opacity-60 pointer-events-none"
            style={{
              background: 'linear-gradient(135deg, #E10600 0%, #FF6A13 45%, #FFB020 90%)',
            }}
          />
        )}

        {/* Capa superior oscura para garantizar contraste AA de tipografía */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 80% 60% at 50% 30%, rgba(10,10,11,0.3) 0%, rgba(10,10,11,0.75) 75%, #0A0A0B 100%), linear-gradient(to bottom, rgba(10,10,11,0.2) 0%, rgba(10,10,11,0.8) 85%, #0A0A0B 100%)',
          }}
        />
      </motion.div>
    </div>
  );
};

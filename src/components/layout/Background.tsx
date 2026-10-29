import React from 'react';

/**
 * Background — Fondo dinámico con orbes de gradiente y cuadrícula técnica.
 * Diseñado para que el blur del glassmorphism tenga color suficiente.
 * Ligero: solo CSS animations, no Canvas ni JS por frame.
 */
export const Background: React.FC = () => {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none -z-50 overflow-hidden bg-[#0A0A0B]"
    >
      {/* Orbe primario rojo — superior izquierda */}
      <div
        className="absolute -top-[30%] -left-[15%] w-[75vw] h-[75vw] max-w-[900px] max-h-[900px] rounded-full will-change-transform"
        style={{
          background: 'radial-gradient(circle, rgba(225,6,0,0.55) 0%, rgba(255,106,19,0.2) 45%, transparent 72%)',
          filter: 'blur(110px)',
          opacity: 0.28,
          animation: 'orb1 18s ease-in-out infinite',
        }}
      />

      {/* Orbe naranja/ámbar — centro derecha */}
      <div
        className="absolute top-[30%] -right-[20%] w-[65vw] h-[65vw] max-w-[800px] max-h-[800px] rounded-full will-change-transform"
        style={{
          background: 'radial-gradient(circle, rgba(255,106,19,0.55) 0%, rgba(255,176,32,0.22) 40%, transparent 68%)',
          filter: 'blur(130px)',
          opacity: 0.22,
          animation: 'orb2 22s ease-in-out infinite 3s',
        }}
      />

      {/* Orbe ámbar — inferior izquierda */}
      <div
        className="absolute -bottom-[25%] left-[15%] w-[70vw] h-[70vw] max-w-[850px] max-h-[850px] rounded-full will-change-transform"
        style={{
          background: 'radial-gradient(circle, rgba(255,176,32,0.45) 0%, rgba(225,6,0,0.12) 50%, transparent 72%)',
          filter: 'blur(140px)',
          opacity: 0.20,
          animation: 'orb3 26s ease-in-out infinite 6s',
        }}
      />

      {/* Orbe rojo adicional — centro superior */}
      <div
        className="absolute top-[10%] left-[40%] w-[45vw] h-[45vw] max-w-[600px] max-h-[600px] rounded-full will-change-transform"
        style={{
          background: 'radial-gradient(circle, rgba(225,6,0,0.3) 0%, transparent 65%)',
          filter: 'blur(100px)',
          opacity: 0.18,
          animation: 'orb4 20s ease-in-out infinite 9s',
        }}
      />

      {/* Forma del dado translúcida flotante */}
      <div
        className="absolute top-[20%] right-[10%] w-40 h-40 rounded-3xl opacity-[0.04] will-change-transform"
        style={{
          background: 'linear-gradient(135deg, rgba(255,106,19,0.5) 0%, rgba(225,6,0,0.5) 100%)',
          border: '1px solid rgba(255,176,32,0.3)',
          animation: 'diceFloat 14s ease-in-out infinite',
        }}
      />

      {/* Cuadrícula técnica con fade radial */}
      <div
        className="absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage: [
            'linear-gradient(to right, rgba(255,255,255,0.10) 1px, transparent 1px)',
            'linear-gradient(to bottom, rgba(255,255,255,0.10) 1px, transparent 1px)',
          ].join(', '),
          backgroundSize: '52px 52px',
          maskImage: 'radial-gradient(ellipse 80% 60% at 50% 50%, black 25%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 50%, black 25%, transparent 80%)',
        }}
      />

      {/* Líneas guía horizontales hero */}
      <div
        className="absolute top-0 inset-x-0 h-[90vh] opacity-[0.04]"
        style={{
          backgroundImage: 'linear-gradient(to bottom, rgba(255,255,255,0.15) 1px, transparent 1px)',
          backgroundSize: '100% 80px',
        }}
      />

      {/* Grano de ruido (SVG feTurbulence) */}
      <div
        className="absolute inset-0 opacity-[0.038] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px',
        }}
      />

      <style>{`
        @keyframes orb1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(5%, 8%) scale(1.08); }
          66% { transform: translate(-3%, 4%) scale(0.95); }
        }
        @keyframes orb2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          40% { transform: translate(-6%, 5%) scale(1.10); }
          70% { transform: translate(4%, -3%) scale(0.92); }
        }
        @keyframes orb3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          30% { transform: translate(4%, -6%) scale(1.06); }
          65% { transform: translate(-5%, 3%) scale(0.96); }
        }
        @keyframes orb4 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-8%, 6%) scale(1.12); }
        }
        @keyframes diceFloat {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(6deg); }
        }
      `}</style>
    </div>
  );
};

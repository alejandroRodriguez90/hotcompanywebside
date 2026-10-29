import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  enableTilt?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  enableTilt = true,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [spotlightPos, setSpotlightPos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);
  const reducedMotion = useReducedMotion();

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reducedMotion || !enableTilt || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Inclinación máxima de +-8 grados para un efecto sutil y elegante
    const rY = ((x - centerX) / centerX) * 8;
    const rX = -((y - centerY) / centerY) * 8;

    setRotateX(rX);
    setRotateY(rY);
    setSpotlightPos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
    });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      animate={
        reducedMotion || !enableTilt
          ? {}
          : {
              rotateX,
              rotateY,
              transformPerspective: 1000,
            }
      }
      transition={{ type: 'spring', damping: 20, stiffness: 250, mass: 0.2 }}
      className={`relative rounded-2xl p-[1px] transition-all duration-300 group overflow-hidden ${className}`}
    >
      {/* Borde con gradiente que se ilumina con spotlight al pasar el ratón */}
      <div
        aria-hidden="true"
        className="absolute inset-0 rounded-2xl transition-opacity duration-500 pointer-events-none"
        style={{
          background: isHovered
            ? `radial-gradient(400px circle at ${spotlightPos.x}% ${spotlightPos.y}%, rgba(255, 106, 19, 0.6), rgba(225, 6, 0, 0.3) 40%, transparent 80%)`
            : 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 106, 19, 0.1) 50%, rgba(255, 255, 255, 0.04) 100%)',
        }}
      />

      {/* Brillo de fondo interior sutil */}
      <div
        aria-hidden="true"
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(350px circle at ${spotlightPos.x}% ${spotlightPos.y}%, rgba(225, 6, 0, 0.12), transparent 70%)`,
        }}
      />

      {/* Contenido de la Card con fondo superficie */}
      <div className="relative h-full w-full rounded-[15px] bg-[#141012]/90 backdrop-blur-xl p-6 sm:p-8 flex flex-col justify-between border border-white/5 shadow-[0_10px_30px_rgba(0,0,0,0.5)] group-hover:shadow-[0_15px_40px_rgba(225,6,0,0.15)] transition-shadow duration-300">
        {children}
      </div>
    </motion.div>
  );
};

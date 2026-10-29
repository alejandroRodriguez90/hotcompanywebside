import React, { useEffect, useRef, useState } from 'react';
import { useInView } from 'motion/react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface CounterProps {
  value: number;
  duration?: number; // en segundos
  suffix?: string;
  prefix?: string;
  className?: string;
}

export const Counter: React.FC<CounterProps> = ({
  value,
  duration = 2,
  suffix = '',
  prefix = '',
  className = '',
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  const [displayValue, setDisplayValue] = useState<number>(0);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!isInView || reducedMotion) return;

    let startTimestamp: number | null = null;
    const totalDuration = duration * 1000;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / totalDuration, 1);

      // Easing out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(easeOut * value);

      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setDisplayValue(value);
      }
    };

    const animFrame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animFrame);
  }, [isInView, value, duration, reducedMotion]);

  // Formato localizado para números grandes (ej: 12.000)
  const current = reducedMotion ? value : displayValue;
  const formatted = current.toLocaleString('es-CO');

  return (
    <span ref={ref} className={`font-display font-bold ${className}`}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
};

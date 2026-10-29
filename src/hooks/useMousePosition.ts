import { useState, useEffect } from 'react';

export interface MousePosition {
  x: number;
  y: number;
  normalizedX: number; // -1 a 1 para efectos de tilt 3D
  normalizedY: number; // -1 a 1 para efectos de tilt 3D
  isFinePointer: boolean;
}

export function useMousePosition(): MousePosition {
  const [position, setPosition] = useState<MousePosition>({
    x: -100,
    y: -100,
    normalizedX: 0,
    normalizedY: 0,
    isFinePointer: true,
  });

  useEffect(() => {
    // Detectar si el dispositivo tiene puntero fino (mouse)
    const mediaQuery = window.matchMedia('(pointer: fine)');
    const updateFinePointer = () => {
      setPosition((prev) => ({ ...prev, isFinePointer: mediaQuery.matches }));
    };
    updateFinePointer();
    mediaQuery.addEventListener('change', updateFinePointer);

    const handleMouseMove = (event: MouseEvent) => {
      if (!mediaQuery.matches) return;
      const { innerWidth, innerHeight } = window;
      const x = event.clientX;
      const y = event.clientY;
      const normalizedX = (x / innerWidth) * 2 - 1;
      const normalizedY = (y / innerHeight) * 2 - 1;

      setPosition({
        x,
        y,
        normalizedX,
        normalizedY,
        isFinePointer: true,
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      mediaQuery.removeEventListener('change', updateFinePointer);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return position;
}

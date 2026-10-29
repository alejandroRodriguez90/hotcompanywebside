import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Loader2 } from 'lucide-react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export type ButtonVariant = 'primary' | 'secondary';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  isLoading?: boolean;
  isFullWidth?: boolean;
  as?: 'button' | 'a';
  href?: string;
  target?: string;
  rel?: string;
}

export const Button = React.forwardRef<HTMLElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      icon,
      iconPosition = 'right',
      isLoading = false,
      isFullWidth = false,
      as = 'button',
      href,
      target,
      rel,
      children,
      className = '',
      disabled,
      ...props
    },
    forwardedRef
  ) => {
    const localRef = useRef<HTMLElement | null>(null);
    const [isHovered, setIsHovered] = useState(false);
    const [isPressed, setIsPressed] = useState(false);
    const reducedMotion = useReducedMotion();

    // Unify forwarded and local ref
    const setRef = useCallback(
      (node: HTMLElement | null) => {
        localRef.current = node;
        if (typeof forwardedRef === 'function') {
          forwardedRef(node);
        } else if (forwardedRef) {
          (forwardedRef as React.MutableRefObject<HTMLElement | null>).current = node;
        }
      },
      [forwardedRef]
    );

    // Physics / Lerp state without React re-renders
    const coordsRef = useRef({
      targetX: 0,
      targetY: 0,
      currX: 0,
      currY: 0,
      active: false,
      rafId: 0,
    });

    useEffect(() => {
      const el = localRef.current;
      if (!el) return;

      // Initialize centered
      const rect = el.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      coordsRef.current.targetX = centerX;
      coordsRef.current.targetY = centerY;
      coordsRef.current.currX = centerX;
      coordsRef.current.currY = centerY;
      el.style.setProperty('--mx', `${centerX}px`);
      el.style.setProperty('--my', `${centerY}px`);
      el.style.setProperty('--hx', `${centerX}px`);

      if (reducedMotion) return;

      const animate = () => {
        const state = coordsRef.current;
        // Smooth lerp (spring-like inertia)
        state.currX += (state.targetX - state.currX) * 0.16;
        state.currY += (state.targetY - state.currY) * 0.16;

        if (el) {
          el.style.setProperty('--mx', `${state.currX.toFixed(2)}px`);
          el.style.setProperty('--my', `${state.currY.toFixed(2)}px`);
          el.style.setProperty('--hx', `${state.currX.toFixed(2)}px`);
        }

        if (state.active || Math.abs(state.targetX - state.currX) > 0.1 || Math.abs(state.targetY - state.currY) > 0.1) {
          state.rafId = requestAnimationFrame(animate);
        }
      };

      const handleMouseMove = (e: MouseEvent) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        coordsRef.current.targetX = e.clientX - r.left;
        coordsRef.current.targetY = e.clientY - r.top;

        if (!coordsRef.current.active) {
          coordsRef.current.active = true;
          cancelAnimationFrame(coordsRef.current.rafId);
          coordsRef.current.rafId = requestAnimationFrame(animate);
        }
      };

      const handleMouseEnter = () => {
        setIsHovered(true);
        coordsRef.current.active = true;
        cancelAnimationFrame(coordsRef.current.rafId);
        coordsRef.current.rafId = requestAnimationFrame(animate);
      };

      const handleMouseLeave = () => {
        setIsHovered(false);
        coordsRef.current.active = false;
      };

      el.addEventListener('mousemove', handleMouseMove);
      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);

      const coords = coordsRef.current;

      return () => {
        el.removeEventListener('mousemove', handleMouseMove);
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
        cancelAnimationFrame(coords.rafId);
      };
    }, [reducedMotion]);

    const sizeClasses = {
      sm: 'text-xs py-2 px-4 gap-1.5 min-h-[36px]',
      md: 'text-sm py-2.5 px-6 gap-2 min-h-[44px]',
      lg: 'text-base py-3.5 px-8 gap-3 min-h-[52px]',
    }[size];

    const isPrimary = variant === 'primary';

    // Base styling: pure black pill #050505, DM Sans medium, thin translucent border, inner shadow
    // NOTE: El botón permanece quieto en hover (sin translate/scale). Solo active conserva scale-[0.98].
    const baseClasses = `
      group relative inline-flex items-center justify-center
      font-sans font-medium text-[#F5F1EC] select-none rounded-full
      bg-[#050505] cursor-pointer
      overflow-hidden text-center
      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6A13] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0B]
      active:scale-[0.98]
      ${disabled || isLoading ? 'opacity-50 pointer-events-none cursor-not-allowed' : ''}
      ${isFullWidth ? 'w-full' : ''}
      ${sizeClasses}
      ${className}
    `.trim();

    const inlineStyles: React.CSSProperties = {
      boxShadow: isPrimary
        ? isHovered
          ? '0 0 28px -4px rgba(255,106,19,0.55), 0 10px 30px -10px rgba(225,6,0,0.4), inset 0 1px 1px rgba(255,200,120,0.6), inset 0 -2px 4px rgba(0,0,0,0.9)'
          : '0 4px 20px -6px rgba(0,0,0,0.8), inset 0 1px 1px rgba(255,255,255,0.18), inset 0 -2px 4px rgba(0,0,0,0.8)'
        : isHovered
        ? '0 0 20px -4px rgba(255,106,19,0.3), 0 8px 24px -8px rgba(0,0,0,0.7), inset 0 1px 1px rgba(255,255,255,0.35), inset 0 -2px 4px rgba(0,0,0,0.9)'
        : '0 4px 16px -6px rgba(0,0,0,0.7), inset 0 1px 1px rgba(255,255,255,0.12), inset 0 -2px 4px rgba(0,0,0,0.8)',
      border: isPrimary
        ? isHovered
          ? '1px solid rgba(255,106,19,0.55)'
          : '1px solid rgba(255,255,255,0.14)'
        : isHovered
        ? '1px solid rgba(255,106,19,0.38)'
        : '1px solid rgba(255,255,255,0.20)',
    };

    const content = (
      <>
        {/* ── Capa 0: Línea de halo superior tenue en reposo / intensificada en hover ── */}
        <span
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-[1.5px] pointer-events-none transition-opacity duration-300"
          style={{
            background: `radial-gradient(60px circle at var(--hx, 50%) 0%, ${
              isPrimary
                ? isHovered
                  ? 'rgba(255,176,32,1)'
                  : 'rgba(255,176,32,0.45)'
                : isHovered
                ? 'rgba(255,176,32,0.85)'
                : 'rgba(255,255,255,0.3)'
            } 0%, rgba(255,106,19,0.35) 50%, transparent 100%)`,
            opacity: isHovered ? 1 : 0.6,
          }}
        />

        {/* ── Capa 1: Halo de luz en Reposo (deriva suave en loop de ~7s sin JS por frame) ── */}
        <span
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none will-change-transform"
          style={{
            background: `radial-gradient(${isPrimary ? '120px' : '95px'} circle at 50% 50%, ${
              isPrimary ? 'rgba(255,106,19,0.35)' : 'rgba(255,106,19,0.20)'
            } 0%, ${
              isPrimary ? 'rgba(225,6,0,0.18)' : 'rgba(225,6,0,0.10)'
            } 45%, transparent 75%)`,
            animation: reducedMotion ? 'none' : 'buttonHaloDrift 7s ease-in-out infinite',
          }}
        />

        {/* ── Capa 2: Halo de luz en Hover que se intensifica y sigue al cursor con inercia ── */}
        <span
          aria-hidden="true"
          className={`absolute inset-0 pointer-events-none transition-opacity duration-300 ease-out ${
            isHovered ? 'opacity-100 will-change-transform' : 'opacity-0'
          }`}
          style={{
            background: `radial-gradient(${isPrimary ? '140px' : '110px'} circle at var(--mx, 50%) var(--my, 50%), ${
              isPrimary ? 'rgba(255,106,19,0.45)' : 'rgba(255,106,19,0.26)'
            } 0%, ${
              isPrimary ? 'rgba(225,6,0,0.24)' : 'rgba(225,6,0,0.12)'
            } 45%, transparent 75%)`,
          }}
        />

        {/* ── Capa 3: "Small Pixels" (trama de cuadritos 2px que titilan dentro de máscara radial del cursor) ── */}
        <span
          aria-hidden="true"
          className={`absolute inset-0 pointer-events-none button-pixels-layer transition-opacity duration-300 ${
            isHovered ? 'opacity-90' : 'opacity-0'
          }`}
          style={{
            maskImage: 'radial-gradient(80px circle at var(--mx, 50%) var(--my, 50%), black 0%, rgba(0,0,0,0.6) 45%, transparent 80%)',
            WebkitMaskImage: 'radial-gradient(80px circle at var(--mx, 50%) var(--my, 50%), black 0%, rgba(0,0,0,0.6) 45%, transparent 80%)',
            animation: reducedMotion ? 'none' : 'pixelFlickerA 1.6s ease-in-out infinite alternate',
          }}
        />

        {/* ── Capa 4: Resplandor inferior que se enciende en hover ── */}
        <span
          aria-hidden="true"
          className={`absolute inset-x-4 -bottom-3 h-6 blur-md pointer-events-none transition-opacity duration-300 ${
            isHovered ? (isPrimary ? 'opacity-100' : 'opacity-60') : 'opacity-0'
          }`}
          style={{
            background: 'radial-gradient(ellipse at bottom, rgba(255,106,19,0.85) 0%, rgba(225,6,0,0.4) 60%, transparent 100%)',
          }}
        />

        {/* ── Destello táctil en touch / click ── */}
        <span
          aria-hidden="true"
          className={`absolute inset-0 bg-white/10 pointer-events-none transition-opacity duration-200 ${
            isPressed ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* ── Contenido: Icono + Texto + Spinner ── */}
        {isLoading ? (
          <span className="relative z-10 flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-[#FFB020]" strokeWidth={1.5} />
            <span>Cargando...</span>
          </span>
        ) : (
          <span className="relative z-10 inline-flex items-center justify-center gap-2 tracking-wide text-white">
            {icon && iconPosition === 'left' && (
              <span className="shrink-0 text-white">
                {icon}
              </span>
            )}
            <span>{children}</span>
            {icon && iconPosition === 'right' && (
              <span className="shrink-0 text-white">
                {icon}
              </span>
            )}
          </span>
        )}
      </>
    );

    const touchHandlers = {
      onTouchStart: () => setIsPressed(true),
      onTouchEnd: () => setIsPressed(false),
      onTouchCancel: () => setIsPressed(false),
    };

    if (as === 'a' || href) {
      return (
        <a
          ref={setRef as React.Ref<HTMLAnchorElement>}
          href={href}
          target={target}
          rel={rel}
          className={baseClasses}
          style={inlineStyles}
          {...touchHandlers}
          {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {content}
        </a>
      );
    }

    return (
      <button
        ref={setRef as React.Ref<HTMLButtonElement>}
        type={props.type || 'button'}
        disabled={disabled || isLoading}
        className={baseClasses}
        style={inlineStyles}
        {...touchHandlers}
        {...props}
      >
        {content}
      </button>
    );
  }
);

Button.displayName = 'Button';

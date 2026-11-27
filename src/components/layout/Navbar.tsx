import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, UserPlus } from 'lucide-react';
import { NAV_LINKS } from '../../lib/constants';
import { useScrollDirection } from '../../hooks/useScrollDirection';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { scrollToAnchoredElement } from '../../lib/scroll';
import { Button } from '../ui/Button';

// Garantiza que la animación de entrada "cometa -> botón" ocurra una sola vez por carga de página.
let hasPlayedEntrance = false;

interface NavbarProps {
  showRegisterCta?: boolean;
  loaderComplete?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ showRegisterCta = true, loaderComplete = false }) => {
  const navigate = useNavigate();
  const { scrollDirection, isAtTop } = useScrollDirection(12);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const reducedMotion = useReducedMotion();
  const [entranceDone, setEntranceDone] = useState(() => hasPlayedEntrance || reducedMotion);

  useEffect(() => {
    if (loaderComplete && !showRegisterCta && !hasPlayedEntrance) {
      hasPlayedEntrance = true;
    }
  }, [loaderComplete, showRegisterCta]);

  const shouldSkipEntrance = reducedMotion || entranceDone;
  const isPlayingEntrance = !shouldSkipEntrance && loaderComplete && showRegisterCta;
  const isHeartbeatActive = !reducedMotion && entranceDone;

  const isHidden = scrollDirection === 'down' && !isAtTop && !mobileMenuOpen;

  const handleRegisterClick = () => {
    setMobileMenuOpen(false);
    navigate('/registro');
  };

  const handleLinkClick = (href: string) => {
    setMobileMenuOpen(false);
    // Desde otra ruta se recarga '/#ancla': así el scroll inicial de App también aplica.
    if (window.location.pathname !== '/') {
      window.location.href = `/${href}`;
      return;
    }
    const scroll = () => scrollToAnchoredElement(href, { offset: -84 });
    if (mobileMenuOpen) {
      setTimeout(scroll, 300);
    } else {
      scroll();
    }
    window.history.replaceState(null, '', href);
  };

  const navbarBase = isAtTop
    ? 'bg-transparent py-5'
    : 'glass-strong rounded-none py-3 shadow-[0_8px_30px_rgba(0,0,0,0.6)]';

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out border-b ${
          isAtTop ? 'border-transparent' : 'border-white/[0.08]'
        } ${isHidden ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'} ${navbarBase}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="relative flex items-center justify-between" aria-label="Navegación principal">
            {/* Logo & Wordmark */}
            <a
              href="#inicio"
              onClick={(e) => { e.preventDefault(); handleLinkClick('#inicio'); }}
              className="flex items-center gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6A13] rounded-xl p-1 z-10"
              aria-label="HOT COMPANY S.A.S. — Ir al inicio"
            >
              <div
                className="relative w-[34px] h-[34px] rounded-2xl overflow-hidden flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:shadow-[0_0_18px_rgba(255,106,19,0.5)]"
                style={{ background: '#0A0A0B', boxShadow: '0 0 12px rgba(225,6,0,0.3), 0 0 0 1px rgba(255,106,19,0.25)' }}
              >
                <img
                  src="/brand/logo.jpeg"
                  alt="HOT COMPANY logo"
                  className="w-full h-full object-contain"
                  style={{ mixBlendMode: 'screen', transform: 'scale(1.08)' }}
                />
              </div>

              <div className="flex flex-col leading-none">
                <span className="font-display font-semibold text-[16.5px] tracking-[0.18em] text-[#F5F1EC] group-hover:text-white transition-colors uppercase">
                  Hot Company
                </span>
                <span className="font-mono text-[10px] text-[#FF6A13] tracking-widest mt-0.5">
                  S.A.S.
                </span>
              </div>
            </a>

            {/* Desktop Links - Centered on lg+, balanced flex on md */}
            <div className="hidden md:flex items-center gap-1 lg:absolute lg:left-1/2 lg:-translate-x-1/2">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => { e.preventDefault(); handleLinkClick(link.href); }}
                  className="relative px-3 lg:px-5 py-2 text-sm lg:text-base font-medium text-[#A89F98] hover:text-[#F5F1EC] transition-colors duration-200 group rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6A13] whitespace-nowrap"
                >
                  <span className="relative z-10">{link.label}</span>
                  {/* animated underline */}
                  <span
                    aria-hidden="true"
                    className="absolute bottom-1 left-3 right-3 lg:left-4 lg:right-4 h-[1.5px] rounded-full bg-gradient-to-r from-[#E10600] to-[#FFB020] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
                  />
                </a>
              ))}
            </div>

            {/* Desktop CTA — entrada cometa -> cápsula full glossy con latido "lub-dub" */}
            {showRegisterCta && (
              <div className="hidden md:flex items-center z-10">
                <motion.div
                  initial={
                    shouldSkipEntrance
                      ? false
                      : { clipPath: 'inset(0 100% 0 0 round 9999px)', opacity: 0 }
                  }
                  animate={
                    shouldSkipEntrance
                      ? { clipPath: 'none', opacity: 1 }
                      : isPlayingEntrance
                        ? { clipPath: 'inset(0 0% 0 0 round 9999px)', opacity: 1 }
                        : { clipPath: 'inset(0 100% 0 0 round 9999px)', opacity: 0 }
                  }
                  transition={
                    shouldSkipEntrance
                      ? { duration: 0 }
                      : { duration: 0.42, delay: 0.36, ease: [0.22, 1, 0.36, 1] }
                  }
                  style={{ borderRadius: '9999px' }}
                  onAnimationComplete={() => {
                    if (isPlayingEntrance) {
                      hasPlayedEntrance = true;
                      setEntranceDone(true);
                    }
                  }}
                >
                  {/*
                    Wrapper de animación: scale + boxShadow sincronizan el patrón
                    "lub-dub … pausa" usando times=[0, 0.10, 0.18, 0.28, 0.36, 1].
                    - t=0→0.10 : primer pulso rojo   (lub)
                    - t=0.18→0.28 : segundo pulso naranja (dub)
                    - t=0.36→1.0 : pausa larga antes de repetir
                    transform + boxShadow → no dispara layout/reflow.
                    El latido inicia apenas termina el revelado de entrada.
                  */}
                  <motion.div
                    animate={isHeartbeatActive ? {
                      scale: [1, 1.04, 1, 1.04, 1, 1],
                      boxShadow: [
                        '0 0 0px   rgba(225,6,0,0), 0 8px 16px -4px rgba(255,106,19,0.38)',
                        '0 0 10px  rgba(225,6,0,0.30), 0 8px 16px -4px rgba(255,106,19,0.45)',
                        '0 0 4px   rgba(225,6,0,0.10), 0 8px 16px -4px rgba(255,106,19,0.38)',
                        '0 0 12px  rgba(255,106,19,0.35), 0 8px 16px -4px rgba(255,106,19,0.48)',
                        '0 0 0px   rgba(255,106,19,0), 0 8px 16px -4px rgba(255,106,19,0.38)',
                        '0 0 0px   rgba(255,106,19,0), 0 8px 16px -4px rgba(255,106,19,0.38)',
                      ],
                    } : undefined}
                    transition={isHeartbeatActive ? {
                      duration: 2.8,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      times: [0, 0.10, 0.18, 0.28, 0.36, 1],
                    } : undefined}
                    style={{
                      borderRadius: '9999px',
                      boxShadow: !isHeartbeatActive ? '0 8px 16px -4px rgba(255,106,19,0.38)' : undefined,
                    }}
                  >
                  {/*
                    Capas del botón "full glossy" (orden explícito de z-index):
                    - z-index 0: span-ring (borde de cristal de 1.5px con gradiente de marca)
                    - z-index 1: span-fill (fondo vertical con alto contraste arriba/abajo)
                    - z-index 2: span-highlight (brillo convexo superior 55% altura)
                    - z-index 3: .register-cta-sheen::after (barrido diagonal en hover)
                    - z-index 4: span-content (ícono + texto)
                  */}
                  <button
                    type="button"
                    onClick={handleRegisterClick}
                    className="register-cta-sheen relative flex items-center gap-1.5 px-4 py-2 text-xs font-sans font-medium tracking-wide text-[#F5F1EC] select-none cursor-pointer active:scale-[0.98] transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6A13] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0B]"
                    style={{
                      position: 'relative',
                      background: 'transparent',
                      border: 'none',
                      borderRadius: '9999px',
                      minHeight: '36px',
                      overflow: 'hidden',
                    }}
                  >
                    {/* z-index 0: Anillo de borde cristalino de 1.5px */}
                    <span
                      aria-hidden="true"
                      style={{
                        position: 'absolute',
                        inset: '0',
                        borderRadius: '9999px',
                        background: 'linear-gradient(180deg, #FFB020 0%, #FF6A13 45%, #E10600 100%)',
                        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.45)',
                        zIndex: 0,
                      }}
                    />
                    {/* z-index 1: Fondo interior con alto contraste vertical (luz arriba / profundo abajo) */}
                    <span
                      aria-hidden="true"
                      style={{
                        position: 'absolute',
                        inset: '1.5px',
                        borderRadius: '9998px',
                        background: 'linear-gradient(180deg, rgba(255,106,19,0.22) 0%, rgba(22,12,11,0.90) 52%, rgba(6,5,6,0.98) 100%)',
                        zIndex: 1,
                      }}
                    />
                    {/* z-index 2: Highlight glossy superior (efecto cápsula convexa) */}
                    <span
                      aria-hidden="true"
                      style={{
                        position: 'absolute',
                        top: '1.5px',
                        left: '1.5px',
                        right: '1.5px',
                        height: '55%',
                        borderRadius: '9998px 9998px 40% 40%',
                        background: 'linear-gradient(180deg, rgba(255,255,255,0.34) 0%, rgba(255,255,255,0.08) 42%, transparent 100%)',
                        pointerEvents: 'none',
                        zIndex: 2,
                      }}
                    />
                    {/* z-index 4: Contenido encima del sheen (z-index 3) */}
                    <span style={{ position: 'relative', zIndex: 4, display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <UserPlus className="w-4 h-4 shrink-0" strokeWidth={1.5} />
                      <span>Regístrate hoy</span>
                    </span>
                  </button>
                  </motion.div>
                </motion.div>
              </div>
            )}

            {/* Cometa de entrada: recorre la base del nav de izquierda a derecha hasta el botón */}
            {isPlayingEntrance && (
              <motion.span
                aria-hidden="true"
                initial={{ left: '22%', width: '48px', opacity: 0 }}
                animate={{
                  left: ['22%', '62%', '88%'],
                  width: ['48px', '140px', '32px'],
                  opacity: [0, 1, 1, 0],
                }}
                transition={{
                  duration: 0.65,
                  times: [0, 0.2, 0.82, 1],
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="hidden md:block absolute bottom-1 h-[1.5px] rounded-full pointer-events-none z-20"
                style={{
                  background: 'linear-gradient(90deg, transparent 0%, #E10600 20%, #FF6A13 65%, #FFB020 100%)',
                  boxShadow: '0 0 10px rgba(255,106,19,0.75), 0 0 4px rgba(255,176,32,0.85)',
                }}
              />
            )}

            {/* Mobile toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((v) => !v)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
              className="md:hidden p-2.5 rounded-xl glass text-[#F5F1EC] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6A13] ml-auto"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </nav>
        </div>
      </header>

      {/* Mobile fullscreen menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, clipPath: 'circle(0% at calc(100% - 40px) 36px)' }}
            animate={{ opacity: 1, clipPath: 'circle(160% at calc(100% - 40px) 36px)' }}
            exit={{ opacity: 0, clipPath: 'circle(0% at calc(100% - 40px) 36px)' }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-40 glass-strong flex flex-col pt-24 pb-10 px-6 sm:px-10 md:hidden"
          >
            <nav className="flex flex-col gap-2 my-auto" aria-label="Menú móvil">
              {NAV_LINKS.map((link, idx) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => { e.preventDefault(); handleLinkClick(link.href); }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.08 + idx * 0.07, duration: 0.35 }}
                  className="flex items-center justify-between py-4 border-b border-white/[0.08] text-2xl font-display font-semibold text-[#F5F1EC] hover:text-[#FF6A13] transition-colors"
                >
                  <span>{link.label}</span>
                  <span className="font-mono text-xs text-[#A89F98]">0{idx + 1}</span>
                </motion.a>
              ))}
              {showRegisterCta && (
                <div className="pt-6">
                  <Button
                    variant="primary"
                    size="md"
                    isFullWidth
                    onClick={handleRegisterClick}
                    icon={<UserPlus className="w-4 h-4" strokeWidth={1.5} />}
                    iconPosition="left"
                  >
                    Regístrate hoy
                  </Button>
                </div>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, UserPlus } from 'lucide-react';
import { NAV_LINKS } from '../../lib/constants';
import { useScrollDirection } from '../../hooks/useScrollDirection';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { scrollToAnchoredElement } from '../../lib/scroll';
import { Button } from '../ui/Button';

interface NavbarProps {
  showRegisterCta?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ showRegisterCta = true }) => {
  const navigate = useNavigate();
  const { scrollDirection, isAtTop } = useScrollDirection(12);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const reducedMotion = useReducedMotion();

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

            {/* Desktop CTA — glassmorfista con latido "lub-dub" */}
            {showRegisterCta && (
              <div className="hidden md:flex items-center z-10">
                {/*
                  Wrapper de animación: scale + boxShadow sincronizan el patrón
                  "lub-dub … pausa" usando times=[0, 0.10, 0.18, 0.28, 0.36, 1].
                  - t=0→0.10 : primer pulso rojo   (lub)
                  - t=0.18→0.28 : segundo pulso naranja (dub)
                  - t=0.36→1.0 : pausa larga antes de repetir
                  transform + boxShadow → no dispara layout/reflow.
                  Glow reducido (blur 10-12px, opacidad máx 0.30-0.35) para que
                  no tape visualmente el interior del botón a simple vista.
                */}
                <motion.div
                  animate={reducedMotion ? undefined : {
                    scale: [1, 1.04, 1, 1.04, 1, 1],
                    boxShadow: [
                      '0 0 0px   rgba(225,6,0,0)',
                      '0 0 10px  rgba(225,6,0,0.30)',
                      '0 0 4px   rgba(225,6,0,0.10)',
                      '0 0 12px  rgba(255,106,19,0.35)',
                      '0 0 0px   rgba(255,106,19,0)',
                      '0 0 0px   rgba(255,106,19,0)',
                    ],
                  }}
                  transition={reducedMotion ? undefined : {
                    duration: 2.8,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    times: [0, 0.10, 0.18, 0.28, 0.36, 1],
                  }}
                  style={{ borderRadius: '9999px' }}
                >
                  {/*
                    Borde degradado via <span> absolutamente posicionado (inset: -1px):
                    - El <button> tiene SOLO el fondo interior tenue y overflow: hidden.
                    - Span-ring (z-index 0): gradiente brand, inset -1px → asoma 1px.
                    - Span-fill (z-index 1): fondo tenue cubre el interior del ring.
                    - Span-content (z-index 2): icono + texto visibles encima.
                    Sin ambigüedad de background-clip/origin; funciona igual en todos
                    los navegadores.
                  */}
                  <button
                    type="button"
                    onClick={handleRegisterClick}
                    className="relative flex items-center gap-1.5 px-4 py-2 text-xs font-sans font-medium tracking-wide text-[#F5F1EC] select-none cursor-pointer active:scale-[0.98] transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6A13] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0B]"
                    style={{
                      position: 'relative',
                      background: 'transparent',
                      border: 'none',
                      borderRadius: '9999px',
                      minHeight: '36px',
                      overflow: 'hidden',
                    }}
                  >
                    {/* Anillo de borde: gradiente brand asomando 1px por todos lados */}
                    <span
                      aria-hidden="true"
                      style={{
                        position: 'absolute',
                        inset: '0',
                        borderRadius: '9999px',
                        background: 'linear-gradient(135deg, #E10600 0%, #FF6A13 50%, #FFB020 100%)',
                        zIndex: 0,
                      }}
                    />
                    {/* Fondo interior tenue que cubre el ring, dejando solo el borde */}
                    <span
                      aria-hidden="true"
                      style={{
                        position: 'absolute',
                        inset: '1px',
                        borderRadius: '9998px',
                        background: 'linear-gradient(135deg, rgba(255,106,19,0.10) 0%, rgba(10,8,9,0.92) 100%)',
                        zIndex: 1,
                      }}
                    />
                    {/* Contenido encima de ambas capas */}
                    <span style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <UserPlus className="w-4 h-4 shrink-0" strokeWidth={1.5} />
                      <span>Regístrate hoy</span>
                    </span>
                  </button>
                </motion.div>
              </div>
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

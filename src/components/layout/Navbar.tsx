import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { NAV_LINKS } from '../../lib/constants';
import { useScrollDirection } from '../../hooks/useScrollDirection';

export const Navbar: React.FC = () => {
  const { scrollDirection, isAtTop } = useScrollDirection(12);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isHidden = scrollDirection === 'down' && !isAtTop && !mobileMenuOpen;

  const handleLinkClick = (href: string) => {
    setMobileMenuOpen(false);
    if (window.location.pathname !== '/') {
      window.location.href = `/${href}`;
      return;
    }
    setTimeout(() => {
      const target = document.querySelector(href);
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    }, mobileMenuOpen ? 300 : 0);
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

            {/* Desktop Links - Perfectly centered */}
            <div className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => { e.preventDefault(); handleLinkClick(link.href); }}
                  className="relative px-5 py-2 text-base font-medium text-[#A89F98] hover:text-[#F5F1EC] transition-colors duration-200 group rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6A13]"
                >
                  <span className="relative z-10">{link.label}</span>
                  {/* animated underline */}
                  <span
                    aria-hidden="true"
                    className="absolute bottom-1 left-4 right-4 h-[1.5px] rounded-full bg-gradient-to-r from-[#E10600] to-[#FFB020] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
                  />
                </a>
              ))}
            </div>

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
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

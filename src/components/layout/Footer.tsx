import React from 'react';
import { ArrowUp, Mail, Phone, MapPin, ShieldCheck } from 'lucide-react';
import { COMPANY_INFO, FOOTER_LINKS } from '../../lib/constants';
import { Button } from '../ui/Button';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="relative border-t border-white/[0.08] pt-12 pb-10 overflow-hidden">
      {/* Glass top strip con resplandor */}
      <div
        aria-hidden="true"
        className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-[#E10600] via-[#FF6A13] to-[#FFB020] opacity-80 shadow-[0_0_15px_rgba(255,106,19,0.5)]"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-10 border-b border-white/[0.07]">
          {/* Brand column */}
          <div className="md:col-span-6 flex flex-col">
            <div className="flex items-center gap-3.5 mb-5">
              <div
                className="w-11 h-11 rounded-2xl overflow-hidden flex items-center justify-center flex-shrink-0 glass border border-white/14"
                style={{ boxShadow: '0 0 16px rgba(225,6,0,0.35)' }}
              >
                <img
                  src="/brand/logo.jpeg"
                  alt="HOT COMPANY logo"
                  className="w-full h-full object-contain"
                  style={{ mixBlendMode: 'screen', transform: 'scale(1.08)' }}
                />
              </div>
              <div>
                <h3 className="font-display font-semibold text-base tracking-[0.18em] text-[#F5F1EC] uppercase">Hot Company</h3>
                <p className="font-mono text-[9px] text-[#FF6A13] tracking-widest">S.A.S. · NIT {COMPANY_INFO.nit}</p>
              </div>
            </div>

            <p className="font-sans text-sm text-[#A89F98] leading-relaxed max-w-sm mb-6">
              Desarrollo de software, plataformas digitales, publicidad y comercio electrónico para empresas en Colombia.
            </p>

            <div className="flex flex-col gap-2.5 text-xs text-[#A89F98]">
              <div className="flex items-center gap-2.5">
                <Mail className="w-3.5 h-3.5 text-[#FF6A13] flex-shrink-0" strokeWidth={1.5} />
                <a href={`mailto:${COMPANY_INFO.email}`} className="hover:text-white transition-colors">{COMPANY_INFO.email}</a>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-3.5 h-3.5 text-[#E10600] flex-shrink-0" strokeWidth={1.5} />
                <a href={COMPANY_INFO.phoneHref} className="hover:text-white transition-colors">{COMPANY_INFO.phoneDisplay}</a>
              </div>
              <div className="flex items-center gap-2.5">
                <MapPin className="w-3.5 h-3.5 text-[#FFB020] flex-shrink-0" strokeWidth={1.5} />
                <a href={COMPANY_INFO.mapsUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">{COMPANY_INFO.address}</a>
              </div>
            </div>
          </div>

          {/* Platform */}
          <div className="md:col-span-3">
            <h4 className="font-display text-[11px] font-semibold text-[#F5F1EC] uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF6A13]" />
              Plataforma
            </h4>
            <ul className="flex flex-col gap-2.5">
              {FOOTER_LINKS.plataforma.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="font-sans text-sm text-[#A89F98] hover:text-[#FFB020] transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="md:col-span-3">
            <h4 className="font-display text-[11px] font-semibold text-[#F5F1EC] uppercase tracking-widest mb-4 flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-[#FFB020]" strokeWidth={1.5} />
              Legal +18
            </h4>

            {/* No-intermediation notice */}
            <div className="glass rounded-xl p-3.5 mb-4">
              <p className="font-sans text-[11px] text-[#A89F98] leading-relaxed">
                <span className="text-[#FFB020] font-semibold">Aviso:</span> El acuerdo y pago se realizan
                directamente entre las partes. La plataforma no intermedia en cobros.
              </p>
            </div>

            <ul className="flex flex-col gap-2">
              {FOOTER_LINKS.legal.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="font-sans text-xs text-[#A89F98]/80 hover:text-white transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* CIIU legal line */}
        <div className="py-5 border-b border-white/[0.05]">
          <p className="font-mono text-[10px] text-[#A89F98]/70 leading-relaxed">
            <span className="text-[#A89F98] font-semibold mr-1">Actividades CIIU:</span>
            {COMPANY_INFO.ciiu.map((c) => `${c.code} ${c.desc}`).join(' · ')}
          </p>
        </div>

        {/* Bottom bar */}
        <div className="pt-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#A89F98]/70">
          <span>© {currentYear} {COMPANY_INFO.name} · Todos los derechos reservados</span>
          <Button
            onClick={scrollToTop}
            aria-label="Volver arriba"
            variant="secondary"
            size="sm"
            icon={<ArrowUp className="w-3.5 h-3.5" strokeWidth={1.5} />}
            iconPosition="right"
          >
            Volver arriba
          </Button>
        </div>
      </div>
    </footer>
  );
};

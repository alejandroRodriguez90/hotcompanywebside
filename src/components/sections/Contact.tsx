import React from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin } from 'lucide-react';
import { COMPANY_INFO, CONTACT_CONTENT } from '../../lib/constants';
import { WhatsAppIcon } from '../ui/WhatsAppIcon';
import { AppStoreIcon, GooglePlayIcon, AppGalleryIcon } from '../ui/StoreIcons';
import { useReducedMotion } from '../../hooks/useReducedMotion';

const APP_STORES = [
  {
    eyebrow: 'Download on the',
    name: 'App Store',
    href: 'https://www.apple.com/app-store/',
    ariaLabel: 'Descargar en App Store',
    icon: <AppStoreIcon size={24} className="shrink-0 text-[#F5F1EC]" />,
  },
  {
    eyebrow: 'GET IT ON',
    name: 'Google Play',
    href: 'https://play.google.com/store',
    ariaLabel: 'Descargar en Google Play',
    icon: <GooglePlayIcon size={24} className="shrink-0" />,
  },
  {
    eyebrow: 'AVAILABLE ON',
    name: 'AppGallery',
    href: 'https://appgallery.huawei.com/',
    ariaLabel: 'Descargar en Huawei AppGallery',
    icon: <AppGalleryIcon size={24} className="shrink-0" />,
  },
] as const;

export const Contact: React.FC = () => {
  const reducedMotion = useReducedMotion();

  return (
    <section id="contacto" className="relative py-20 sm:py-28 overflow-hidden">
      {/* Ambient gradient orbs for glass depth */}
      <div
        aria-hidden="true"
        className="absolute top-20 -left-28 w-96 h-96 rounded-full pointer-events-none -z-10 opacity-20 blur-[130px]"
        style={{ background: 'radial-gradient(circle, #E10600 0%, #FFB020 60%, transparent 80%)' }}
      />
      <div
        aria-hidden="true"
        className="absolute bottom-10 -right-28 w-96 h-96 rounded-full pointer-events-none -z-10 opacity-25 blur-[130px]"
        style={{ background: 'radial-gradient(circle, #FF6A13 0%, #FFB020 50%, transparent 80%)' }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-start">
          {/* Columna izquierda: Contacto directo */}
          <motion.div
            initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="glass rounded-[28px] p-6 flex flex-col gap-5"
          >
            <h3 className="font-display font-semibold text-sm text-[#F5F1EC] uppercase tracking-wider">
              Contacto directo
            </h3>

            <a href={`mailto:${COMPANY_INFO.email}`} className="flex items-center gap-4 group focus-visible:outline-none">
              <div className="w-10 h-10 rounded-xl glass-tint-warm flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5 text-[#FF6A13]" strokeWidth={1.5} />
              </div>
              <div>
                <p className="font-mono text-[10px] text-[#A89F98] uppercase tracking-wider">Correo</p>
                <p className="font-sans text-sm text-[#F5F1EC] group-hover:text-[#FFB020] transition-colors">
                  {COMPANY_INFO.email}
                </p>
              </div>
            </a>

            <a href={COMPANY_INFO.phoneHref} className="flex items-center gap-4 group focus-visible:outline-none">
              <div className="w-10 h-10 rounded-xl glass-tint-warm flex items-center justify-center flex-shrink-0">
                <Phone className="w-5 h-5 text-[#E10600]" strokeWidth={1.5} />
              </div>
              <div>
                <p className="font-mono text-[10px] text-[#A89F98] uppercase tracking-wider">Teléfono</p>
                <p className="font-sans text-sm text-[#F5F1EC] group-hover:text-[#FFB020] transition-colors">
                  {COMPANY_INFO.phoneDisplay}
                </p>
              </div>
            </a>

            <a
              href={COMPANY_INFO.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 group focus-visible:outline-none"
            >
              <div className="w-10 h-10 rounded-xl glass-tint-warm flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-[#FFB020]" strokeWidth={1.5} />
              </div>
              <div>
                <p className="font-mono text-[10px] text-[#A89F98] uppercase tracking-wider">Dirección</p>
                <p className="font-sans text-sm text-[#F5F1EC] group-hover:text-[#FFB020] transition-colors">
                  {COMPANY_INFO.address}
                </p>
                <p className="font-sans text-xs text-[#A89F98]">{COMPANY_INFO.city}</p>
              </div>
            </a>
          </motion.div>

          {/* Columna derecha: WhatsApp + botones de tiendas */}
          <div className="flex flex-col gap-6">
            {/* WhatsApp card — highlighted */}
            <motion.a
              href={COMPANY_INFO.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.08 }}
              className="glass-tint-warm rounded-[28px] p-6 flex items-start gap-4 group hover:scale-[1.01] transition-transform duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6A13]"
              aria-label="Hablar por WhatsApp con HOT COMPANY"
            >
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(37, 211, 102, 0.15)', border: '1px solid rgba(37,211,102,0.35)' }}
              >
                <WhatsAppIcon size={24} className="text-[#4ADE80]" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-display font-semibold text-[#F5F1EC] text-base">Hablar por WhatsApp</span>
                  {/* Latido sutil */}
                  <div className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" aria-hidden="true" />
                </div>
                <p className="font-sans text-sm text-[#A89F98]">{CONTACT_CONTENT.whatsappLabel}</p>
                <p className="font-sans text-xs text-[#A89F98]/70 mt-1">{CONTACT_CONTENT.whatsappNote}</p>
              </div>
            </motion.a>

            {/* Botones de descarga en tiendas oficiales (formato clásico 2 líneas) */}
            <motion.div
              initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-1 xl:grid-cols-3 gap-3"
            >
              {APP_STORES.map((store) => (
                <a
                  key={store.name}
                  href={store.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={store.ariaLabel}
                  className="store-btn-sheen relative rounded-2xl px-4 py-3 flex items-center justify-center sm:justify-start md:justify-center xl:justify-start gap-3 select-none hover:-translate-y-0.5 active:scale-[0.98] transition-transform duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6A13]"
                  style={{
                    position: 'relative',
                    background: 'transparent',
                    border: 'none',
                    overflow: 'hidden',
                    boxShadow: '0 8px 20px -8px rgba(0,0,0,0.75)',
                  }}
                >
                  {/* z-index 0: Anillo de borde neutro de 1px */}
                  <span
                    aria-hidden="true"
                    style={{
                      position: 'absolute',
                      inset: '0',
                      borderRadius: '16px',
                      background: 'linear-gradient(180deg, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0.12) 55%, rgba(255,255,255,0.18) 100%)',
                      zIndex: 0,
                    }}
                  />
                  {/* z-index 1: Fondo interior negro vidrio moderno */}
                  <span
                    aria-hidden="true"
                    style={{
                      position: 'absolute',
                      inset: '1px',
                      borderRadius: '15px',
                      background: 'linear-gradient(180deg, rgba(32,32,36,0.90) 0%, rgba(14,14,17,0.95) 52%, rgba(6,6,8,0.98) 100%)',
                      zIndex: 1,
                    }}
                  />
                  {/* z-index 2: Highlight glossy superior neutro */}
                  <span
                    aria-hidden="true"
                    style={{
                      position: 'absolute',
                      top: '1px',
                      left: '1px',
                      right: '1px',
                      height: '55%',
                      borderRadius: '15px 15px 40% 40%',
                      background: 'linear-gradient(180deg, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0.06) 45%, transparent 100%)',
                      pointerEvents: 'none',
                      zIndex: 2,
                    }}
                  />
                  {/* z-index 4: Contenido encima del sheen (z-index 3) */}
                  <span
                    style={{
                      position: 'relative',
                      zIndex: 4,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                    }}
                  >
                    {store.icon}
                    <span className="flex flex-col text-left leading-tight">
                      <span className="font-sans text-[10px] tracking-wide text-[#A89F98]">
                        {store.eyebrow}
                      </span>
                      <span className="font-display text-sm font-bold text-[#F5F1EC]">
                        {store.name}
                      </span>
                    </span>
                  </span>
                </a>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

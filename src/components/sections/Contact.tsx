import React from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin } from 'lucide-react';
import { COMPANY_INFO, CONTACT_CONTENT } from '../../lib/constants';
import { WhatsAppIcon } from '../ui/WhatsAppIcon';
import { useReducedMotion } from '../../hooks/useReducedMotion';

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-stretch">
          {/* WhatsApp card — highlighted */}
          <motion.a
            href={COMPANY_INFO.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="glass-tint-warm rounded-[28px] p-6 flex items-start gap-4 group hover:scale-[1.01] transition-transform duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6A13] h-full"
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

          {/* Contact details */}
          <motion.div
            initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="glass rounded-[28px] p-6 flex flex-col gap-5 h-full"
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
        </div>
      </div>
    </section>
  );
};

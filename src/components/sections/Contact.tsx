import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle, Loader2, RotateCw } from 'lucide-react';
import { COMPANY_INFO, CONTACT_CONTENT } from '../../lib/constants';
import { Button } from '../ui/Button';
import { WhatsAppIcon } from '../ui/WhatsAppIcon';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface FormData {
  nombre: string;
  correo: string;
  telefono: string;
  mensaje: string;
  consent: boolean;
}

type FormState = 'idle' | 'loading' | 'success' | 'error' | 'whatsapp_fallback';

interface FieldProps {
  id: string;
  name: keyof FormData;
  label: string;
  type?: string;
  placeholder: string;
  value: string;
  error?: string;
  onChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  isTextarea?: boolean;
  maxLength?: number;
}

const Field: React.FC<FieldProps> = ({
  id,
  name,
  label,
  type = 'text',
  placeholder,
  value,
  error,
  onChange,
  isTextarea,
  maxLength,
}) => {
  const hasValue = value.length > 0;

  const inputClass = `w-full px-4 pt-6 pb-2 rounded-2xl glass font-sans text-sm text-[#F5F1EC] placeholder-transparent focus:outline-none transition-all duration-300 ${
    error
      ? 'border-[#E10600]/80 focus:border-[#E10600] focus:ring-2 focus:ring-[#E10600]/50 focus:shadow-[0_0_20px_rgba(225,6,0,0.35)]'
      : 'border-white/14 focus:border-[#FF6A13] focus:ring-2 focus:ring-[#FF6A13]/50 focus:shadow-[0_0_20px_rgba(255,106,19,0.3)]'
  }`;

  return (
    <div className="relative">
      {isTextarea ? (
        <textarea
          id={id}
          name={name}
          rows={4}
          maxLength={maxLength}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`${inputClass} resize-none`}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
        />
      ) : (
        <input
          type={type}
          id={id}
          name={name}
          maxLength={maxLength}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={inputClass}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
        />
      )}
      {/* Floating label */}
      <label
        htmlFor={id}
        className={`absolute left-4 font-sans text-xs font-semibold uppercase tracking-wider pointer-events-none transition-all duration-200 ${
          hasValue ? 'top-2.5 text-[10px] text-[#FF6A13]' : 'top-4 text-sm text-[#A89F98]'
        }`}
      >
        {label}
      </label>

      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1.5 flex items-center gap-1 text-xs text-[#E10600]">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" strokeWidth={1.5} />
          {error}
        </p>
      )}
    </div>
  );
};

export const Contact: React.FC = () => {
  const reducedMotion = useReducedMotion();
  const [formData, setFormData] = useState<FormData>({
    nombre: '',
    correo: '',
    telefono: '',
    mensaje: '',
    consent: false,
  });
  const [honeypot, setHoneypot] = useState('');
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [formState, setFormState] = useState<FormState>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [fallbackWaUrl, setFallbackWaUrl] = useState('');

  const validate = (): boolean => {
    const errs: Partial<Record<keyof FormData, string>> = {};

    const nombreClean = formData.nombre.trim();
    if (!nombreClean || nombreClean.length < 3) {
      errs.nombre = 'Ingresa tu nombre completo (mínimo 3 caracteres)';
    }

    const correoClean = formData.correo.trim();
    if (!correoClean || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correoClean)) {
      errs.correo = 'Ingresa un correo electrónico válido';
    }

    const cleanPhone = formData.telefono.trim().replace(/[\s\-().]/g, '');
    if (cleanPhone.length > 0) {
      const isValidColPhone = /^(\+?57)?(3\d{9}|[1-9]\d{6,9})$/.test(cleanPhone);
      if (!isValidColPhone) {
        errs.telefono = 'Número colombiano no válido (ej. 350 241 8881 o 10 dígitos)';
      }
    }

    const mensajeClean = formData.mensaje.trim();
    if (!mensajeClean || mensajeClean.length < 10) {
      errs.mensaje = 'Por favor escribe al menos 10 caracteres';
    } else if (mensajeClean.length > 1000) {
      errs.mensaje = 'El mensaje no debe exceder los 1000 caracteres';
    }

    if (!formData.consent) {
      errs.consent = 'Debes aceptar la política de tratamiento de datos para continuar';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!validate()) return;

    // Honeypot anti-bot check: si el campo oculto tiene valor, simula envío silencioso
    if (honeypot.trim().length > 0) {
      setFormState('success');
      return;
    }

    const endpoint = import.meta.env.VITE_FORM_ENDPOINT?.trim();

    // Respaldo por WhatsApp si VITE_FORM_ENDPOINT no está configurado (sin falso éxito)
    if (!endpoint) {
      const telText = formData.telefono.trim() ? formData.telefono.trim() : 'No proporcionado';
      const waMessage = `Hola HOT COMPANY S.A.S., me gustaría ponerme en contacto.\n\n*Nombre:* ${formData.nombre.trim()}\n*Correo:* ${formData.correo.trim()}\n*Teléfono:* ${telText}\n*Mensaje:* ${formData.mensaje.trim()}`;
      const waUrl = `https://wa.me/573502418881?text=${encodeURIComponent(waMessage)}`;

      setFallbackWaUrl(waUrl);
      setFormState('whatsapp_fallback');
      window.open(waUrl, '_blank', 'noopener,noreferrer');
      return;
    }

    setFormState('loading');
    setErrorMessage('');

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: formData.nombre.trim(),
          correo: formData.correo.trim(),
          telefono: formData.telefono.trim() || 'No proporcionado',
          mensaje: formData.mensaje.trim(),
          consentimiento_datos: true,
          fecha_envio: new Date().toISOString(),
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        const errDetail =
          data?.error ||
          data?.errors?.[0]?.message ||
          'El servicio no pudo procesar tu mensaje en este momento. Por favor reintenta o contáctanos por WhatsApp.';
        throw new Error(errDetail);
      }

      setFormState('success');
      setFormData({ nombre: '', correo: '', telefono: '', mensaje: '', consent: false });
      setHoneypot('');
    } catch (err: unknown) {
      clearTimeout(timeoutId);
      if (err instanceof Error && err.name === 'AbortError') {
        setErrorMessage(
          'La solicitud superó el límite de espera (10 segundos). Por favor reintenta o comunícate vía WhatsApp.'
        );
      } else if (err instanceof Error) {
        setErrorMessage(err.message || 'Error de conexión al enviar el formulario.');
      } else {
        setErrorMessage('Ocurrió un error inesperado al procesar la solicitud.');
      }
      setFormState('error');
    }
  };

  const getWaPrefilledUrl = () => {
    const telText = formData.telefono.trim() ? formData.telefono.trim() : 'No proporcionado';
    const waMessage = `Hola HOT COMPANY S.A.S., intento enviar una consulta desde la web.\n\n*Nombre:* ${formData.nombre.trim()}\n*Correo:* ${formData.correo.trim()}\n*Teléfono:* ${telText}\n*Mensaje:* ${formData.mensaje.trim()}`;
    return `https://wa.me/573502418881?text=${encodeURIComponent(waMessage)}`;
  };

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
        {/* Header */}
        <div className="mb-12 sm:mb-16 text-center">
          <motion.div
            initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-5"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#E10600] animate-pulse" />
            <span className="font-mono text-[10px] tracking-widest uppercase text-[#FFB020]">
              {CONTACT_CONTENT.tagline}
            </span>
          </motion.div>

          <motion.h2
            initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display font-extrabold text-[#F5F1EC] tracking-tight mb-3"
            style={{ fontSize: 'clamp(2rem, 4vw + 0.5rem, 3.2rem)' }}
          >
            {CONTACT_CONTENT.title}
          </motion.h2>

          <motion.p
            initial={reducedMotion ? { opacity: 1 } : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="font-sans text-base text-[#A89F98] max-w-lg mx-auto"
          >
            {CONTACT_CONTENT.subtitle}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start">
          {/* ── Form Card ───────────────────────────────────── */}
          <motion.div
            initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass rounded-[32px] p-6 sm:p-8"
          >
            {/* 1. Éxito Real con Endpoint */}
            {formState === 'success' && (
              <div className="flex flex-col items-center text-center py-10 gap-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 12, stiffness: 200 }}
                  className="w-16 h-16 rounded-2xl glass-tint-warm flex items-center justify-center"
                >
                  <CheckCircle2 className="w-8 h-8 text-[#4ADE80]" strokeWidth={1.5} />
                </motion.div>
                <h3 className="font-display font-bold text-xl text-[#F5F1EC]">¡Mensaje recibido con éxito!</h3>
                <p className="text-sm text-[#A89F98] max-w-sm">
                  Nuestro equipo revisará tu requerimiento y se comunicará contigo vía correo o WhatsApp a la mayor brevedad.
                </p>
                <Button variant="secondary" size="sm" onClick={() => setFormState('idle')}>
                  Enviar otro mensaje
                </Button>
              </div>
            )}

            {/* 2. Respaldo por WhatsApp (Sin Endpoint Falso) */}
            {formState === 'whatsapp_fallback' && (
              <div className="flex flex-col items-center text-center py-8 gap-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 12, stiffness: 200 }}
                  className="w-16 h-16 rounded-2xl glass flex items-center justify-center"
                  style={{ background: 'rgba(37, 211, 102, 0.15)', border: '1px solid rgba(74, 222, 128, 0.4)' }}
                >
                  <WhatsAppIcon size={32} className="text-[#4ADE80]" />
                </motion.div>
                <h3 className="font-display font-bold text-xl text-[#F5F1EC]">Conectando con WhatsApp</h3>
                <p className="text-sm text-[#A89F98] max-w-sm leading-relaxed">
                  Los datos de tu consulta han sido preparados para enviarse directamente a nuestro canal oficial de WhatsApp.
                </p>

                {fallbackWaUrl && (
                  <Button
                    as="a"
                    href={fallbackWaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="primary"
                    size="md"
                    icon={<WhatsAppIcon size={18} />}
                  >
                    Abrir chat de WhatsApp
                  </Button>
                )}

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setFormState('idle');
                    setFormData({ nombre: '', correo: '', telefono: '', mensaje: '', consent: false });
                  }}
                >
                  Volver al formulario
                </Button>
              </div>
            )}

            {/* 3. Error Real con Botón de Reintento */}
            {formState === 'error' && (
              <div className="flex flex-col items-center text-center py-8 gap-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 12, stiffness: 200 }}
                  className="w-16 h-16 rounded-2xl glass flex items-center justify-center border border-[#E10600]/40"
                  style={{ background: 'rgba(225, 6, 0, 0.12)' }}
                >
                  <AlertCircle className="w-8 h-8 text-[#E10600]" strokeWidth={1.5} />
                </motion.div>
                <h3 className="font-display font-bold text-xl text-[#F5F1EC]">No se pudo enviar el mensaje</h3>
                <p className="text-sm text-[#A89F98] max-w-sm leading-relaxed">
                  {errorMessage || 'Ocurrió un problema de comunicación al procesar tu solicitud.'}
                </p>

                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleSubmit()}
                    icon={<RotateCw className="w-3.5 h-3.5" strokeWidth={1.5} />}
                  >
                    Reintentar envío
                  </Button>

                  <Button
                    as="a"
                    href={getWaPrefilledUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="secondary"
                    size="sm"
                    icon={<WhatsAppIcon size={16} />}
                  >
                    Enviar por WhatsApp
                  </Button>
                </div>

                <button
                  type="button"
                  onClick={() => setFormState('idle')}
                  className="text-xs text-[#A89F98] hover:text-[#F5F1EC] underline transition-colors pt-1"
                >
                  Editar los datos ingresados
                </button>
              </div>
            )}

            {/* 4. Formulario (Idle / Loading) */}
            {(formState === 'idle' || formState === 'loading') && (
              <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
                <h3 className="font-display font-semibold text-lg text-[#F5F1EC] mb-1">
                  Cuéntanos sobre tu proyecto
                </h3>

                {/* Campo honeypot anti-bot oculto */}
                <div className="hidden" aria-hidden="true">
                  <label htmlFor="company_fax">Favor no completar este campo de control:</label>
                  <input
                    type="text"
                    id="company_fax"
                    name="company_fax"
                    tabIndex={-1}
                    autoComplete="off"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                  />
                </div>

                <Field
                  id="nombre"
                  name="nombre"
                  label="Nombre completo *"
                  placeholder="Carlos Mendoza"
                  maxLength={100}
                  value={formData.nombre}
                  error={errors.nombre}
                  onChange={handleChange}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field
                    id="correo"
                    name="correo"
                    label="Correo electrónico *"
                    type="email"
                    placeholder="hola@empresa.com"
                    maxLength={100}
                    value={formData.correo}
                    error={errors.correo}
                    onChange={handleChange}
                  />
                  <Field
                    id="telefono"
                    name="telefono"
                    label="Teléfono / WhatsApp (Opcional)"
                    type="tel"
                    placeholder="350 241 8881"
                    maxLength={20}
                    value={formData.telefono}
                    error={errors.telefono}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <Field
                    id="mensaje"
                    name="mensaje"
                    label="¿En qué podemos ayudarte? *"
                    placeholder="Cuéntanos sobre tu proyecto..."
                    maxLength={1000}
                    value={formData.mensaje}
                    error={errors.mensaje}
                    onChange={handleChange}
                    isTextarea
                  />
                  <div className="flex justify-end mt-1 px-1">
                    <span className="font-mono text-[10px] text-[#A89F98]/50">
                      {formData.mensaje.length}/1000
                    </span>
                  </div>
                </div>

                {/* Checkbox de consentimiento obligatorio (Ley 1581 de 2012) */}
                <div className="pt-1">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="consent"
                      name="consent"
                      checked={formData.consent}
                      onChange={(e) => {
                        setFormData((prev) => ({ ...prev, consent: e.target.checked }));
                        if (errors.consent) {
                          setErrors((prev) => ({ ...prev, consent: undefined }));
                        }
                      }}
                      className="mt-1 w-4 h-4 rounded border-white/20 bg-black/40 text-[#FF6A13] focus:ring-[#FF6A13] focus:ring-offset-0 cursor-pointer accent-[#FF6A13]"
                      aria-invalid={Boolean(errors.consent)}
                      aria-describedby={errors.consent ? 'consent-error' : undefined}
                    />
                    <label htmlFor="consent" className="text-xs text-[#A89F98] leading-relaxed cursor-pointer select-none">
                      Acepto el tratamiento de mis datos personales conforme a la{' '}
                      <a
                        href="/privacidad"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#FF6A13] hover:text-[#FFB020] underline transition-colors font-medium"
                      >
                        Política de Privacidad
                      </a>{' '}
                      (Ley 1581 de 2012 de Colombia).
                    </label>
                  </div>
                  {errors.consent && (
                    <p id="consent-error" role="alert" className="mt-1.5 flex items-center gap-1 text-xs text-[#E10600]">
                      <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" strokeWidth={1.5} />
                      {errors.consent}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  isFullWidth
                  disabled={formState === 'loading'}
                  icon={
                    formState === 'loading' ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" strokeWidth={1.5} />
                    )
                  }
                >
                  {formState === 'loading' ? 'Enviando...' : 'Enviar Mensaje'}
                </Button>

                <p className="text-[11px] text-center text-[#A89F98]/60">
                  Tu información se procesa bajo estándares de confidencialidad y no se comparte con terceros.
                </p>
              </form>
            )}
          </motion.div>

          {/* ── Contact Panel ──────────────────────────── */}
          <div className="flex flex-col gap-4">
            {/* WhatsApp card — highlighted */}
            <motion.a
              href={COMPANY_INFO.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
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

            {/* Contact details */}
            <motion.div
              initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
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
          </div>
        </div>
      </div>
    </section>
  );
};

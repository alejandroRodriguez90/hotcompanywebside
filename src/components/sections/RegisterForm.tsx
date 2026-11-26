import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  AlertCircle,
  Loader2,
  RotateCw,
  UserPlus,
  Check,
  Eye,
  EyeOff,
  ArrowRight,
} from 'lucide-react';
import { COMPANY_INFO } from '../../lib/constants';
import {
  API_BASE_URL,
  AUTH_REGISTER_URL,
  JSON_HEADERS,
  type TermsDocument,
} from '../../lib/api';
import { PASSWORD_HINT, PASSWORD_MAX, getPasswordValidationError } from '../../lib/passwordPolicy';
import { useTerms } from '../../hooks/useTerms';
import { Button } from '../ui/Button';
import { WhatsAppIcon } from '../ui/WhatsAppIcon';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export type UserRole = 'Worker' | 'Hotel';

interface RegisterFormData {
  email: string;
  username: string;
  role: UserRole;
  consent: boolean;
}

type FormState = 'idle' | 'loading' | 'success' | 'error' | 'whatsapp_fallback';

interface RegisterPayload {
  userType: 'WORKER' | 'HOTEL';
  email: string;
  username: string;
  password: string;
  acceptedTerms: boolean;
  termsVersion: string;
}

interface ValidationErrorResponse {
  status?: number;
  error?: string;
  message?: string;
  success?: boolean;
  /** Formato del contrato compartido: { "campo": "motivo" }. */
  errors?: Record<string, string | string[]>;
  /** Compatibilidad temporal con respuestas que aún usan lista de campos. */
  fields?: Array<{
    field: string;
    message: string;
  }>;
}

interface FieldProps {
  id: string;
  name: string;
  label: string;
  type?: string;
  placeholder: string;
  value: string;
  error?: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  maxLength?: number;
  autoComplete?: string;
  endAdornment?: React.ReactNode;
}

const Field: React.FC<FieldProps> = React.memo(({
  id,
  name,
  label,
  type = 'text',
  placeholder,
  value,
  error,
  onChange,
  maxLength,
  autoComplete,
  endAdornment,
}) => {
  const hasValue = value.length > 0;

  const inputClass = `w-full px-4 pt-6 pb-2 rounded-2xl glass font-sans text-sm text-[#F5F1EC] placeholder-transparent focus:outline-none transition-all duration-300 ${
    endAdornment ? 'pr-12' : ''
  } ${
    error
      ? 'border-[#E10600]/80 focus:border-[#E10600] focus:ring-2 focus:ring-[#E10600]/50 focus:shadow-[0_0_20px_rgba(225,6,0,0.35)]'
      : 'border-white/14 focus:border-[#FF6A13] focus:ring-2 focus:ring-[#FF6A13]/50 focus:shadow-[0_0_20px_rgba(255,106,19,0.3)]'
  }`;

  return (
    <div className="relative">
      <input
        type={type}
        id={id}
        name={name}
        maxLength={maxLength}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={inputClass}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      {/* Floating label */}
      <label
        htmlFor={id}
        className={`absolute left-4 font-sans text-xs font-semibold uppercase tracking-wider pointer-events-none transition-all duration-200 ${
          hasValue ? 'top-2.5 text-[10px] text-[#FF6A13]' : 'top-4 text-sm text-[#A89F98]'
        }`}
      >
        {label}
      </label>

      {endAdornment && (
        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center">
          {endAdornment}
        </div>
      )}

      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1.5 flex items-center gap-1 text-xs text-[#E10600]">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" strokeWidth={1.5} />
          {error}
        </p>
      )}
    </div>
  );
});
Field.displayName = 'Field';

const BrandDice: React.FC<{ reducedMotion: boolean }> = ({ reducedMotion }) => (
  <motion.div
    animate={reducedMotion ? undefined : { y: [0, -5, 0] }}
    transition={reducedMotion ? undefined : { duration: 3, repeat: Infinity, ease: 'easeInOut' }}
    className="relative w-16 h-16 rounded-3xl mb-4 flex items-center justify-center glass border border-white/20"
    style={{
      boxShadow: '0 0 36px rgba(225,6,0,0.45), 0 0 18px rgba(255,106,19,0.35), inset 0 1px 1px rgba(255,255,255,0.4)',
    }}
  >
    <img
      src="/brand/logo.jpeg"
      alt=""
      aria-hidden="true"
      className="w-full h-full object-contain"
      style={{ mixBlendMode: 'screen', transform: 'scale(1.08)' }}
    />
  </motion.div>
);

interface Step1FormProps {
  initialData: RegisterFormData;
  initialErrors?: Partial<Record<keyof RegisterFormData, string>>;
  errorMessage?: string;
  reducedMotion: boolean;
  terms: TermsDocument | null;
  termsLoading: boolean;
  termsError: string | null;
  acceptedTermsVersion: string | null;
  onAcceptedTermsVersionChange: (version: string | null) => void;
  termsViewNonce: number;
  onComplete: (data: RegisterFormData, honeypotValue: string) => void;
}

const Step1Form: React.FC<Step1FormProps> = ({
  initialData,
  initialErrors,
  errorMessage,
  reducedMotion,
  terms,
  termsLoading,
  termsError,
  acceptedTermsVersion,
  onAcceptedTermsVersionChange,
  termsViewNonce,
  onComplete,
}) => {
  const [formData, setFormData] = useState<RegisterFormData>(initialData);
  const [honeypot, setHoneypot] = useState('');
  const [errors, setErrors] = useState<Partial<Record<keyof RegisterFormData, string>>>(
    initialErrors || {}
  );

  const handleFieldChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name !== 'email' && name !== 'username') return;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => {
      if (prev[name]) {
        return { ...prev, [name]: undefined };
      }
      return prev;
    });
  }, []);

  const handleRoleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const role = e.target.value as UserRole;
    if (role !== 'Worker' && role !== 'Hotel') return;
    setFormData((prev) => ({ ...prev, role }));
    setErrors((prev) => {
      if (prev.role) {
        return { ...prev, role: undefined };
      }
      return prev;
    });
  }, []);

  const handleConsentChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setFormData((prev) => ({ ...prev, consent: checked }));
    onAcceptedTermsVersionChange(checked && terms?.version ? terms.version : null);
    setErrors((prev) => {
      if (prev.consent) {
        return { ...prev, consent: undefined };
      }
      return prev;
    });
  }, [terms, onAcceptedTermsVersionChange]);

  const validate = (): boolean => {
    const errs: Partial<Record<keyof RegisterFormData, string>> = {};

    const correoClean = formData.email.trim().toLowerCase();
    if (!correoClean || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correoClean)) {
      errs.email = 'Ingresa un correo electrónico válido';
    } else if (correoClean.length > 254) {
      errs.email = 'El correo no puede superar 254 caracteres';
    }

    const usuarioClean = formData.username.trim();
    if (!usuarioClean) {
      errs.username = 'Ingresa un nombre de usuario';
    } else if (usuarioClean.length < 4) {
      errs.username = 'El usuario debe tener mínimo 4 caracteres';
    } else if (usuarioClean.length > 30) {
      errs.username = 'El usuario no puede superar 30 caracteres';
    } else if (/\s/.test(usuarioClean)) {
      errs.username = 'El usuario no puede contener espacios';
    } else if (!/^[a-zA-Z0-9._]{4,30}$/.test(usuarioClean)) {
      errs.username = 'Solo se permiten letras, números, puntos y guion bajo';
    }

    if (formData.role !== 'Worker' && formData.role !== 'Hotel') {
      errs.role = 'Selecciona el tipo de cuenta';
    }

    if (!terms?.version) {
      errs.consent = termsError || 'Cargando la versión vigente de los términos…';
    } else if (!formData.consent) {
      errs.consent = 'Debes aceptar los Términos y Condiciones para continuar';
    } else if (acceptedTermsVersion !== terms.version) {
      errs.consent =
        'Los términos cambiaron. Vuelve a leerlos y marca la casilla para aceptar la versión vigente.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onComplete(formData, honeypot);
  };

  return (
    <motion.form
      key="step-1"
      id="contacto-form"
      initial={reducedMotion ? { opacity: 1 } : { opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={reducedMotion ? { opacity: 1 } : { opacity: 0, x: 16 }}
      transition={{ duration: 0.22, ease: 'easeInOut' }}
      onSubmit={handleSubmit}
      noValidate
      className="flex flex-col gap-4"
    >
      <div className="flex flex-col items-center text-center">
        <BrandDice reducedMotion={reducedMotion} />
        <h3 className="font-display font-semibold text-lg text-[#F5F1EC] mb-1">
          Crea tu cuenta
        </h3>
        <p className="text-xs text-[#A89F98]">
          Indica tu tipo de cuenta e ingresa tu correo y usuario.
        </p>
      </div>

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

      {/* 1. Correo electrónico */}
      <Field
        id="correo"
        name="email"
        label="Correo electrónico *"
        type="email"
        placeholder="hola@ejemplo.com"
        maxLength={254}
        value={formData.email}
        error={errors.email}
        onChange={handleFieldChange}
        autoComplete="email"
      />

      {/* 2. Nombre de usuario */}
      <div>
        <Field
          id="usuario"
          name="username"
          label="Nombre de usuario *"
          type="text"
          placeholder="usuario_hc"
          maxLength={30}
          value={formData.username}
          error={errors.username}
          onChange={handleFieldChange}
          autoComplete="username"
        />
        <div className="flex justify-between items-center mt-1 px-1">
          <span className="text-[10px] text-[#A89F98]/60">
            4 a 30 caracteres, solo letras, números, puntos y guiones bajos
          </span>
          <span className="font-mono text-[10px] text-[#A89F98]/50">
            {formData.username.length}/30
          </span>
        </div>
      </div>

      {/* 3. Tipo de cuenta */}
      <fieldset>
        <legend className="font-sans text-xs font-semibold uppercase tracking-wider text-[#A89F98] mb-2">
          Tipo de cuenta *
        </legend>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {([
            { value: 'Worker', title: 'Worker' },
            { value: 'Hotel', title: 'Hotel' },
          ] as const).map((option) => {
            const selected = formData.role === option.value;
            const isWorker = option.value === 'Worker';

            const activeStyle = isWorker
              ? {
                  borderColor: '#9B2C3E',
                  backgroundColor: 'rgba(155, 44, 62, 0.12)',
                  boxShadow:
                    '0 0 0 1px rgba(155, 44, 62, 0.45), 0 8px 24px -14px rgba(155, 44, 62, 0.65), inset 0 1px 0 rgba(225, 6, 0, 0.25)',
                }
              : {
                  borderColor: '#3B6EA5',
                  backgroundColor: 'rgba(59, 110, 165, 0.12)',
                  boxShadow:
                    '0 0 0 1px rgba(59, 110, 165, 0.45), 0 8px 24px -14px rgba(59, 110, 165, 0.65), inset 0 1px 0 rgba(80, 150, 220, 0.25)',
                };

            const focusRingClass = isWorker
              ? 'focus-within:ring-[#9B2C3E]/50'
              : 'focus-within:ring-[#3B6EA5]/50';

            const hoverTextClass = isWorker
              ? 'group-hover:text-[#F0A8B4]'
              : 'group-hover:text-[#9BC3F0]';

            const badgeActiveClasses = isWorker
              ? 'border-[#9B2C3E]/40 bg-[#9B2C3E]/15 text-[#F0A8B4]'
              : 'border-[#3B6EA5]/40 bg-[#3B6EA5]/15 text-[#9BC3F0]';

            return (
              <label
                key={option.value}
                className={`group relative flex min-h-[54px] cursor-pointer items-center justify-between gap-2 rounded-2xl glass border px-4 py-3 transition-all duration-300 ease-out focus-within:ring-2 ${focusRingClass} ${
                  selected
                    ? isWorker
                      ? 'border-[#9B2C3E] bg-[#9B2C3E]/10 shadow-[0_0_0_1px_rgba(155,44,62,0.45),0_8px_24px_-14px_rgba(155,44,62,0.65)] hover:border-[#9B2C3E]'
                      : 'border-[#3B6EA5] bg-[#3B6EA5]/10 shadow-[0_0_0_1px_rgba(59,110,165,0.45),0_8px_24px_-14px_rgba(59,110,165,0.65)] hover:border-[#3B6EA5]'
                    : 'border-white/10 hover:border-white/22 hover:bg-white/[0.03]'
                }`}
                style={selected ? activeStyle : { borderColor: 'rgba(255,255,255,0.10)' }}
              >
                <input
                  type="radio"
                  name="role"
                  value={option.value}
                  checked={selected}
                  onChange={handleRoleChange}
                  className="sr-only"
                  aria-invalid={Boolean(errors.role)}
                  aria-describedby={`role-status${errors.role ? ' role-error' : ''}`}
                />
                <span
                  className={`font-display text-sm font-semibold text-[#F5F1EC] transition-colors ${
                    selected ? hoverTextClass : 'group-hover:text-white'
                  }`}
                >
                  {option.title}
                </span>
                <span
                  className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-2 py-[3px] font-mono text-[9px] font-medium uppercase tracking-wide ${
                    selected
                      ? badgeActiveClasses
                      : 'border-white/12 bg-white/[0.04] text-[#A89F98]'
                  }`}
                >
                  {selected && (
                    <Check className="h-3 w-3" strokeWidth={2.5} aria-hidden="true" />
                  )}
                  ACTIVO
                </span>
              </label>
            );
          })}
        </div>
        <div
          id="role-status"
          role="status"
          aria-live="polite"
          className={`mt-2.5 flex items-center gap-2 rounded-xl border px-3 py-2 transition-all duration-300 ease-out ${
            formData.role === 'Worker'
              ? 'border-[#9B2C3E]/30 bg-[#9B2C3E]/[0.08]'
              : 'border-[#3B6EA5]/30 bg-[#3B6EA5]/[0.08]'
          }`}
        >
          <span
            className={`h-1.5 w-1.5 shrink-0 rounded-full ${
              formData.role === 'Worker'
                ? 'bg-[#C43D52] shadow-[0_0_8px_rgba(196,61,82,0.65)]'
                : 'bg-[#4A88C7] shadow-[0_0_8px_rgba(74,136,199,0.65)]'
            }`}
            aria-hidden="true"
          />
          <p className="text-[11px] leading-relaxed text-[#A89F98]">
            Rol activo:{' '}
            <span
              className={`font-semibold ${
                formData.role === 'Worker' ? 'text-[#F0A8B4]' : 'text-[#9BC3F0]'
              }`}
            >
              {formData.role}
            </span>
            <span className="text-[#A89F98]/70"> · verifica antes de continuar</span>
          </p>
        </div>
        {errors.role && (
          <p id="role-error" role="alert" className="mt-1.5 flex items-center gap-1 text-xs text-[#E10600]">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" strokeWidth={1.5} />
            {errors.role}
          </p>
        )}
      </fieldset>

      {/* 4. Checkbox de términos y condiciones */}
      <div className="pt-1">
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id="consent"
            name="consent"
            checked={formData.consent}
            onChange={handleConsentChange}
            disabled={!terms?.version || termsLoading}
            className="mt-1 w-4 h-4 rounded border-white/20 bg-black/40 text-[#FF6A13] focus:ring-[#FF6A13] focus:ring-offset-0 cursor-pointer accent-[#FF6A13] disabled:cursor-not-allowed disabled:opacity-50"
            aria-invalid={Boolean(errors.consent)}
            aria-describedby={errors.consent ? 'consent-error' : undefined}
          />
          <label htmlFor="consent" className="text-xs text-[#A89F98] leading-relaxed cursor-pointer select-none">
            Acepto los{' '}
            <a
              href="/terminos"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#FF6A13] hover:text-[#FFB020] underline transition-colors font-medium"
            >
              Términos y Condiciones
            </a>{' '}
            y la{' '}
            <a
              href="/privacidad"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#FF6A13] hover:text-[#FFB020] underline transition-colors font-medium"
            >
              Política de Privacidad
            </a>{' '}
            de HOT COMPANY.
          </label>
        </div>

        {/* Texto vigente servido por GET /api/v1/terms (la página /terminos
            mantiene su contenido redactado; la duplicidad queda pendiente). */}
        {terms && (
          <details
            key={termsViewNonce}
            open={termsViewNonce > 0}
            className="mt-2 rounded-xl glass border border-white/10 px-3 py-2"
          >
            <summary className="cursor-pointer text-[11px] text-[#FFB020]">
              Ver términos vigentes · versión {terms.version} — {terms.title}
            </summary>
            <div className="mt-2 max-h-60 overflow-y-auto whitespace-pre-line rounded-lg bg-black/40 p-3 font-sans text-[11px] leading-relaxed text-[#A89F98]">
              {terms.content}
            </div>
          </details>
        )}
        {errors.consent && (
          <p id="consent-error" role="alert" className="mt-1.5 flex items-center gap-1 text-xs text-[#E10600]">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" strokeWidth={1.5} />
            {errors.consent}
          </p>
        )}
      </div>

      {/* Mensaje de error general si aplica */}
      {errorMessage && (
        <div className="p-3 rounded-xl glass border border-[#E10600]/40 bg-[#E10600]/10 flex items-start gap-2 text-xs text-[#F5F1EC]">
          <AlertCircle className="w-4 h-4 text-[#E10600] flex-shrink-0 mt-0.5" strokeWidth={1.5} />
          <span>{errorMessage}</span>
        </div>
      )}

      <Button
        type="submit"
        variant="primary"
        size="lg"
        isFullWidth
        icon={<ArrowRight className="w-4 h-4" strokeWidth={1.5} />}
      >
        Registrarme
      </Button>

      <p className="text-[11px] text-center text-[#A89F98]/60">
        Al continuar definirás tu contraseña para activar tu cuenta.
      </p>
    </motion.form>
  );
};

export const RegisterForm: React.FC = () => {
  const reducedMotion = useReducedMotion();
  const { terms, loading: termsLoading, error: termsError, reload: reloadTerms } = useTerms();

  // Estados del Paso 1
  const [formData, setFormData] = useState<RegisterFormData>({
    email: '',
    username: '',
    role: 'Worker',
    consent: false,
  });
  const [registeredUsername, setRegisteredUsername] = useState('');
  const [registeredRole, setRegisteredRole] = useState<UserRole>('Worker');
  const [errors, setErrors] = useState<Partial<Record<keyof RegisterFormData, string>>>({});
  const [formState, setFormState] = useState<FormState>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [rateLimitMessage, setRateLimitMessage] = useState('');
  const [fallbackWaUrl, setFallbackWaUrl] = useState('');
  const [acceptedTermsVersion, setAcceptedTermsVersion] = useState<string | null>(null);
  const [consentResetToken, setConsentResetToken] = useState(0);
  const [termsViewNonce, setTermsViewNonce] = useState(0);

  // Estado del flujo de registro en dos pasos (inline)
  const [step, setStep] = useState<1 | 2>(1);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState<{ password?: string; confirmPassword?: string }>({});
  const [modalErrorMessage, setModalErrorMessage] = useState('');

  const handleStep1Complete = (step1Data: RegisterFormData, honeypotValue: string) => {
    setFormData(step1Data);

    // Honeypot anti-bot: si el campo oculto tiene valor, simula éxito silencioso
    if (honeypotValue.trim().length > 0) {
      setRegisteredUsername(step1Data.username.trim());
      setRegisteredRole(step1Data.role);
      setFormState('success');
      return;
    }

    // Paso 1 válido -> Avanzar al paso 2 inline
    setErrors({});
    setErrorMessage('');
    setModalErrorMessage('');
    setPasswordErrors({});
    setStep(2);
  };

  // Submit del Paso 2: Valida contraseñas y dispara el único POST al endpoint
  const handlePasswordSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setRateLimitMessage('');

    const pErrors: { password?: string; confirmPassword?: string } = {};

    const passwordError = getPasswordValidationError(password);
    if (passwordError) {
      pErrors.password = passwordError;
    }

    if (!confirmPassword) {
      pErrors.confirmPassword = 'Confirma tu contraseña';
    } else if (password !== confirmPassword) {
      pErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    if (Object.keys(pErrors).length > 0) {
      setPasswordErrors(pErrors);
      return;
    }

    // Sin versión confirmada por GET /api/v1/terms no se inventa un termsVersion.
    if (!terms?.version || termsLoading) {
      setModalErrorMessage(
        termsError ||
          'No pudimos confirmar la versión vigente de los términos. Inténtalo de nuevo antes de registrarte.'
      );
      setFormState('idle');
      return;
    }
    if (acceptedTermsVersion !== terms.version) {
      setModalErrorMessage(
        'Los términos cambiaron. Vuelve al paso 1 y acepta la versión vigente para continuar.'
      );
      setStep(1);
      setFormState('idle');
      return;
    }

    // Respaldo por WhatsApp si la base de la API no está configurada
    if (!API_BASE_URL) {
      const waMessage = `Hola HOT COMPANY S.A.S., deseo registrarme como ${formData.role} en la plataforma.\n\n*Usuario:* ${formData.username.trim()}\n*Correo:* ${formData.email.trim().toLowerCase()}`;
      const waUrl = `https://wa.me/${COMPANY_INFO.whatsappNumber}?text=${encodeURIComponent(waMessage)}`;

      setFallbackWaUrl(waUrl);
      setStep(1);
      setFormState('whatsapp_fallback');
      window.open(waUrl, '_blank', 'noopener,noreferrer');
      return;
    }

    setFormState('loading');
    setModalErrorMessage('');

    // El termsVersion viene de GET /api/v1/terms, nunca del valor estático.
    // Mapeo dinámico según el rol seleccionado: Worker -> WORKER, Hotel -> HOTEL.
    const userType: 'WORKER' | 'HOTEL' = formData.role === 'Hotel' ? 'HOTEL' : 'WORKER';

    const payload: RegisterPayload = {
      userType,
      email: formData.email.trim().toLowerCase(),
      // TODO: confirmar con backend si username debe ser case-sensitive o
      // normalizado — por ahora se envía en minúsculas por seguridad.
      username: formData.username.trim().toLowerCase(),
      password,
      acceptedTerms: true,
      termsVersion: terms.version,
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    try {
      const res = await fetch(AUTH_REGISTER_URL, {
        method: 'POST',
        headers: JSON_HEADERS,
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const data: ValidationErrorResponse = await res.json().catch(() => ({}));

      // Respuesta del contrato: { success, message? }. Se tolera un 2xx sin body.
      if (res.ok && data?.success !== false) {
        setRegisteredUsername(formData.username.trim());
        setRegisteredRole(formData.role);
        setStep(1);
        setPassword('');
        setConfirmPassword('');
        setFormState('success');
        setFormData({ email: '', username: '', role: 'Worker', consent: false });
        setErrors({});
        setErrorMessage('');
        setModalErrorMessage('');
        setRateLimitMessage('');
        setAcceptedTermsVersion(null);
        setConsentResetToken((prev) => prev + 1);
        return;
      }

      // Errores por campo. Contrato: { message, errors: { campo: motivo } }.
      // Se mantiene compatibilidad con { fields: [{ field, message }] }.
      const fieldEntries: Array<{ field: string; message: string }> = [];
      if (data?.errors && typeof data.errors === 'object') {
        for (const [field, value] of Object.entries(data.errors)) {
          const message = Array.isArray(value) ? value.filter(Boolean).join('. ') : value;
          if (typeof message === 'string' && message.trim()) {
            fieldEntries.push({ field, message });
          }
        }
      } else if (Array.isArray(data?.fields)) {
        for (const item of data.fields) {
          if (item?.field && item?.message) {
            fieldEntries.push(item);
          }
        }
      }

      const serverCode = typeof data?.error === 'string' ? data.error.toUpperCase() : '';
      const outdatedTerms =
        serverCode === 'TERMS_VERSION_OUTDATED' ||
        fieldEntries.some(
          (item) =>
            item.field === 'termsVersion' ||
            item.message.toUpperCase().includes('TERMS_VERSION_OUTDATED')
        );

      // 400 TERMS_VERSION_OUTDATED: se refrescan los términos y se exige una
      // nueva aceptación explícita antes de reintentar.
      if (outdatedTerms) {
        reloadTerms();
        setFormData((prev) => ({ ...prev, consent: false }));
        setAcceptedTermsVersion(null);
        setConsentResetToken((prev) => prev + 1);
        setTermsViewNonce((prev) => prev + 1);
        setErrorMessage(
          data?.message ||
            'Los términos se actualizaron. Revísalos y vuelve a marcar la casilla de aceptación antes de reintentar.'
        );
        setPassword('');
        setConfirmPassword('');
        setPasswordErrors({});
        setModalErrorMessage('');
        setRateLimitMessage('');
        setStep(1);
        setFormState('idle');
        return;
      }

      // 429: límite por IP, banner general (no un error del paso 1 ni de un campo).
      if (res.status === 429) {
        setRateLimitMessage(
          data?.message || 'Demasiados intentos desde esta IP. Espera un momento antes de reintentar.'
        );
        setFormState('idle');
        return;
      }

      // 409: el mensaje del servidor se muestra tal cual en el campo correspondiente.
      if (res.status === 409 && serverCode === 'EMAIL_ALREADY_REGISTERED') {
        setErrors({
          email:
            data?.message ||
            fieldEntries.find((item) => item.field === 'email')?.message ||
            'Este correo ya está registrado.',
        });
        setStep(1);
        setFormState('idle');
        return;
      }

      if (res.status === 409 && serverCode === 'USERNAME_ALREADY_TAKEN') {
        setErrors({
          username:
            data?.message ||
            fieldEntries.find((item) => item.field === 'username')?.message ||
            'Este nombre de usuario ya está registrado.',
        });
        setStep(1);
        setFormState('idle');
        return;
      }

      if (fieldEntries.length > 0) {
        const step1Errors: Partial<Record<keyof RegisterFormData, string>> = {};
        const step2Errors: { password?: string; confirmPassword?: string } = {};
        const unmappedMessages: string[] = [];

        let hasStep1Error = false;

        for (const item of fieldEntries) {
          if (item.field === 'email') {
            step1Errors.email = item.message;
            hasStep1Error = true;
          } else if (item.field === 'username') {
            step1Errors.username = item.message;
            hasStep1Error = true;
          } else if (item.field === 'role' || item.field === 'userType') {
            step1Errors.role = item.message;
            hasStep1Error = true;
          } else if (item.field === 'password') {
            step2Errors.password = item.message;
          } else {
            unmappedMessages.push(item.message);
          }
        }

        if (hasStep1Error) {
          // Si el error corresponde al paso 1 (ej. correo ya registrado), regresar al paso 1
          setErrors(step1Errors);
          setStep(1);
          setErrorMessage(
            unmappedMessages.length > 0
              ? unmappedMessages.join('. ')
              : 'Por favor verifica los datos ingresados en el primer paso.'
          );
        } else {
          // Si el error es de contraseña o no mapeado, mostrarlo dentro del modal
          setPasswordErrors(step2Errors);
          if (unmappedMessages.length > 0) {
            setModalErrorMessage(unmappedMessages.join('. '));
          } else if (Object.keys(step2Errors).length === 0 && data.message) {
            setModalErrorMessage(data.message);
          }
        }

        setFormState('idle');
        return;
      }

      // 409: correo o usuario ya registrado. El primer paso es donde se corrigen.
      if (res.status === 409) {
        setStep(1);
        setErrorMessage(
          data?.message || 'Ese correo o nombre de usuario ya está registrado.'
        );
        setFormState('idle');
        return;
      }

      // Otro error del servidor (500, etc.)
      const errDetail =
        data?.message ||
        data?.error ||
        'El servicio no pudo procesar tu registro en este momento. Por favor reintenta o contáctanos por WhatsApp.';
      setModalErrorMessage(errDetail);
      setFormState('idle');
    } catch (err: unknown) {
      clearTimeout(timeoutId);
      if (err instanceof Error && err.name === 'AbortError') {
        setModalErrorMessage(
          'La solicitud superó el límite de espera (30 segundos). Por favor reintenta o comunícate vía WhatsApp.'
        );
      } else if (err instanceof Error) {
        setModalErrorMessage(err.message || 'Error de conexión al enviar el registro.');
      } else {
        setModalErrorMessage('Ocurrió un error inesperado al procesar la solicitud.');
      }
      setFormState('idle');
    }
  };

  const getWaPrefilledUrl = () => {
    const waMessage = `Hola HOT COMPANY S.A.S., intento registrarme como ${formData.role} desde la web.\n\n*Usuario:* ${formData.username.trim()}\n*Correo:* ${formData.email.trim().toLowerCase()}`;
    return `https://wa.me/${COMPANY_INFO.whatsappNumber}?text=${encodeURIComponent(waMessage)}`;
  };

  return (
    <motion.div
      initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="glass rounded-[32px] p-6 sm:p-8 min-h-[530px] sm:min-h-[550px] flex flex-col justify-start"
    >
      {/* 429: aviso general, no asociado a ningún campo */}
      {rateLimitMessage && (
        <div
          role="alert"
          aria-live="polite"
          className="mb-4 flex items-start gap-2 rounded-xl glass border border-[#FFB020]/40 bg-[#FFB020]/10 p-3 text-xs text-[#F5F1EC]"
        >
          <AlertCircle className="w-4 h-4 shrink-0 text-[#FFB020] mt-0.5" strokeWidth={1.5} />
          <span>{rateLimitMessage}</span>
        </div>
      )}

      {/* 1. Éxito Real con Endpoint */}
      {formState === 'success' && (
        <div className="flex flex-col items-center text-center py-10 gap-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 12, stiffness: 200 }}
            className="relative w-16 h-16 rounded-2xl glass-tint-warm flex items-center justify-center p-2 border border-[#FF6A13]/40"
            style={{
              background: 'rgba(255, 106, 19, 0.15)',
              boxShadow: '0 0 24px rgba(255, 106, 19, 0.35)',
            }}
          >
            <img
              src="/brand/logo.jpeg"
              alt="HOT COMPANY dado"
              className="w-full h-full object-contain"
              style={{ mixBlendMode: 'screen', transform: 'scale(1.1)' }}
            />
            <div
              className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#25D366] flex items-center justify-center shadow-lg border border-[#0A0A0B]"
              aria-hidden="true"
            >
              <Check className="w-3 h-3 text-[#0A0A0B] stroke-[3]" />
            </div>
          </motion.div>

          {/* // TODO MARKETING: confirmar con el equipo de producto/marketing el copy final de bienvenida y beneficios en Credihots antes de producción. */}
          <h3 className="font-display font-bold text-xl text-[#F5F1EC]">
            {registeredUsername
              ? `¡Listo, ${registeredUsername}! Ya eres parte de HotCompany 🎲`
              : '¡Listo! Ya eres parte de HotCompany 🎲'}
          </h3>

          <p className="text-sm text-[#A89F98] max-w-sm leading-relaxed">
            Por registrarte como {registeredRole}, acabas de desbloquear 10.000 Credihots
          </p>

          {/* Badge visual para el monto en pesos (estilo balance Credihots de la app) */}
          <div
            className="w-full max-w-xs mx-auto px-4 py-2.5 rounded-2xl flex items-center justify-center gap-2 text-center relative overflow-hidden border border-[#E10600]/40 my-0.5"
            style={{
              background: 'linear-gradient(135deg, #E10600 0%, #B80400 100%)',
              boxShadow: '0 8px 24px -4px rgba(225, 6, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.25)',
            }}
          >
            <span className="font-display font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
              $10.000
            </span>
            <span className="font-sans text-xs sm:text-sm font-semibold text-white/80 tracking-wide uppercase">
              COP
            </span>
            <span className="font-sans text-xs sm:text-sm font-medium text-white/95">
              ¡son tuyos!
            </span>
          </div>

          <p className="text-sm text-[#A89F98] max-w-sm leading-relaxed">
            Pronto vas a poder convertirlos y seguir ganando más dentro de la app.
          </p>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setFormState('idle');
              setFormData({ email: '', username: '', role: 'Worker', consent: false });
              setRegisteredUsername('');
              setRegisteredRole('Worker');
              setErrors({});
              setErrorMessage('');
            }}
          >
            Enviar otro registro
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
            Los datos de tu registro han sido preparados para enviarse directamente a nuestro canal oficial de WhatsApp.
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
              setFormData({ email: '', username: '', role: 'Worker', consent: false });
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
          <h3 className="font-display font-bold text-xl text-[#F5F1EC]">No se pudo completar el registro</h3>
          <p className="text-sm text-[#A89F98] max-w-sm leading-relaxed">
            {errorMessage || 'Ocurrió un problema de comunicación al procesar tu solicitud.'}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setFormState('idle');
                setStep(2);
              }}
              icon={<RotateCw className="w-3.5 h-3.5" strokeWidth={1.5} />}
            >
              Reintentar registro
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
              Consultar por WhatsApp
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

      {/* 4. Formulario de Registro en 2 Pasos (Idle / Loading) */}
      {(formState === 'idle' || formState === 'loading') && (
        <div className="min-h-[460px] sm:min-h-[475px] flex flex-col justify-start">
          <AnimatePresence mode="wait" initial={false}>
            {step === 1 ? (
              <Step1Form
                key={`step-1-${consentResetToken}`}
                initialData={formData}
                initialErrors={errors}
                errorMessage={errorMessage}
                reducedMotion={reducedMotion}
                terms={terms}
                termsLoading={termsLoading}
                termsError={termsError}
                acceptedTermsVersion={acceptedTermsVersion}
                onAcceptedTermsVersionChange={setAcceptedTermsVersion}
                termsViewNonce={termsViewNonce}
                onComplete={handleStep1Complete}
              />
            ) : (
              <motion.form
                key="step-2"
                initial={reducedMotion ? { opacity: 1 } : { opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={reducedMotion ? { opacity: 1 } : { opacity: 0, x: -16 }}
                transition={{ duration: 0.22, ease: 'easeInOut' }}
                onSubmit={handlePasswordSubmit}
                noValidate
                className="flex flex-col gap-4"
              >
                <div className="flex flex-col items-center text-center">
                  <BrandDice reducedMotion={reducedMotion} />
                  <h3 id="password-step-title" className="font-display font-bold text-lg text-[#F5F1EC] leading-tight mb-2">
                    Crea tu contraseña
                  </h3>
                  <p className="text-sm text-[#A89F98] leading-relaxed">
                    Define la contraseña de acceso para tu cuenta de {formData.role} con usuario{' '}
                    <span className="text-[#F5F1EC] font-semibold">@{formData.username.trim()}</span>.
                    {' '}Con esta clave vas a poder entrar a la app cuando esté disponible — ya estás a un paso de ser parte de HotCompany.
                  </p>
                </div>

                <Field
                  id="inline-password"
                  name="password"
                  label="Contraseña *"
                  type={showPassword ? 'text' : 'password'}
                  placeholder={PASSWORD_HINT}
                  maxLength={PASSWORD_MAX}
                  value={password}
                  error={passwordErrors.password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (passwordErrors.password) {
                      setPasswordErrors((prev) => ({ ...prev, password: undefined }));
                    }
                  }}
                  autoComplete="new-password"
                  endAdornment={
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="p-1 text-[#A89F98] hover:text-[#F5F1EC] transition-colors focus:outline-none"
                      aria-label={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  }
                />

                <Field
                  id="inline-confirm-password"
                  name="confirmPassword"
                  label="Confirmar contraseña *"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Repite tu contraseña"
                  maxLength={PASSWORD_MAX}
                  value={confirmPassword}
                  error={passwordErrors.confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (passwordErrors.confirmPassword) {
                      setPasswordErrors((prev) => ({ ...prev, confirmPassword: undefined }));
                    }
                  }}
                  autoComplete="new-password"
                  endAdornment={
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      className="p-1 text-[#A89F98] hover:text-[#F5F1EC] transition-colors focus:outline-none"
                      aria-label={showConfirmPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  }
                />

                <div className="flex items-center gap-2 px-1">
                  <span className="text-[11px] text-[#A89F98]/70">
                    Requisito: {PASSWORD_HINT} (máximo {PASSWORD_MAX} caracteres)
                  </span>
                </div>

                {modalErrorMessage && (
                  <div className="p-3 rounded-xl glass border border-[#E10600]/40 bg-[#E10600]/10 flex items-start gap-2 text-xs text-[#F5F1EC]">
                    <AlertCircle className="w-4 h-4 text-[#E10600] flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                    <span>{modalErrorMessage}</span>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Button
                    type="button"
                    variant="secondary"
                    size="md"
                    onClick={() => {
                      setStep(1);
                      setPassword('');
                      setConfirmPassword('');
                      setPasswordErrors({});
                      setModalErrorMessage('');
                    }}
                    disabled={formState === 'loading'}
                  >
                    Volver
                  </Button>

                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    isFullWidth
                    disabled={formState === 'loading'}
                    icon={
                      formState === 'loading' ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <UserPlus className="w-4 h-4" strokeWidth={1.5} />
                      )
                    }
                  >
                    {formState === 'loading' ? 'Completando...' : 'Completar registro'}
                  </Button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
};

/**
 * Configuración central de la API web.
 *
 * Base definitiva: https://api.hotcompany.app (inyectada por VITE_API_BASE_URL).
 * Registro: POST /api/v1/auth/register.
 * Términos: GET /api/v1/terms.
 * Ambas peticiones usan Content-Type: application/json.
 *
 * La base se normaliza para que nunca queden barras dobles ni falte la barra
 * entre la base y la ruta.
 *
 * En desarrollo (localhost:5173) las URL del backend de producción se envían
 * como rutas relativas /api/... para que el proxy de Vite evite el CORS.
 * En el build de producción se mantienen las URL absolutas originales.
 */
const PRODUCTION_API_HOST = 'https://api.hotcompany.app';
const rawBaseUrl = (import.meta.env.VITE_API_BASE_URL ?? '').trim();

/**
 * URL base del backend sin barra final.
 * Vacía = backend aún no configurado: la web activa el fallback por WhatsApp.
 */
export const API_BASE_URL = rawBaseUrl.replace(/\/+$/, '');

/**
 * Solo en dev, convierte una URL absoluta del backend en ruta relativa para
 * el proxy `/api`. Cubre tanto VITE_API_BASE_URL como un VITE_FORM_ENDPOINT
 * definido en .env.local. En producción la función es transparente y Vite
 * elimina esta rama del bundle.
 */
function toDevProxyPath(url: string): string {
  if (!import.meta.env.DEV) return url;
  const normalizedUrl = url.replace(/\/+$/, '');
  if (normalizedUrl === PRODUCTION_API_HOST) return '';
  if (normalizedUrl.startsWith(`${PRODUCTION_API_HOST}/`)) {
    return normalizedUrl.slice(PRODUCTION_API_HOST.length);
  }
  return url;
}

/**
 * Override explícito del URL de registro (VITE_FORM_ENDPOINT). Si no está
 * definido se mantiene el comportamiento anterior: base + ruta v1.
 */
const rawFormEndpoint = (import.meta.env.VITE_FORM_ENDPOINT ?? '').trim();

export const JSON_HEADERS = {
  'Content-Type': 'application/json',
} as const;

export const API_ENDPOINTS = {
  auth: {
    register: '/api/v1/auth/register',
    login: '/api/auth/login',
  },
  legal: {
    terms: '/api/v1/terms',
  },
} as const;

export function buildApiUrl(path: string): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${toDevProxyPath(API_BASE_URL)}${normalizedPath}`;
}

const configuredRegisterUrl = rawFormEndpoint || buildApiUrl(API_ENDPOINTS.auth.register);

export const AUTH_REGISTER_URL = toDevProxyPath(configuredRegisterUrl);
export const TERMS_URL = buildApiUrl(API_ENDPOINTS.legal.terms);

export interface TermsDocument {
  version: string;
  title: string;
  content: string;
}

/**
 * Consulta de términos al backend usando la base y los headers centralizados.
 * La página de términos sigue renderizando el documento estático de
 * `src/lib/legal.ts`; la versión dinámica devuelta aquí es la que se reporta
 * en el registro.
 */
export async function fetchTerms<T = unknown>(signal?: AbortSignal): Promise<T> {
  const res = await fetch(TERMS_URL, {
    method: 'GET',
    headers: JSON_HEADERS,
    signal,
  });

  if (!res.ok) {
    throw new Error(`Error al consultar términos: ${res.status} ${res.statusText}`);
  }

  return (await res.json()) as T;
}

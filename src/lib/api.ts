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
 */
const rawBaseUrl = (import.meta.env.VITE_API_BASE_URL ?? '').trim();

/**
 * URL base del backend sin barra final.
 * Vacía = backend aún no configurado: la web activa el fallback por WhatsApp.
 */
export const API_BASE_URL = rawBaseUrl.replace(/\/+$/, '');

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
  return `${API_BASE_URL}${normalizedPath}`;
}

export const AUTH_REGISTER_URL = buildApiUrl(API_ENDPOINTS.auth.register);
export const TERMS_URL = buildApiUrl(API_ENDPOINTS.legal.terms);

/**
 * Consulta de términos al backend usando la base y los headers centralizados.
 * La página de términos sigue renderizando el documento estático de
 * `src/lib/legal.ts`; este helper expone la consulta HTTP configurada.
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

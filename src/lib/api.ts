/**
 * Configuración central de la API web.
 *
 * La app móvil construye las rutas como `environment.apiUrl + '/api/auth/...'`.
 * En la web la base llega por `VITE_API_BASE_URL`; aquí se normaliza para que
 * nunca queden barras dobles ni falte la barra entre la base y la ruta.
 */
const rawBaseUrl = (import.meta.env.VITE_API_BASE_URL ?? '').trim();

/**
 * URL base del backend sin barra final.
 * Vacía = backend aún no configurado: la web activa el fallback por WhatsApp.
 */
export const API_BASE_URL = rawBaseUrl.replace(/\/+$/, '');

export const API_ENDPOINTS = {
  auth: {
    register: '/api/auth/register',
    login: '/api/auth/login',
  },
} as const;

export function buildApiUrl(path: string): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
}

export const AUTH_REGISTER_URL = buildApiUrl(API_ENDPOINTS.auth.register);

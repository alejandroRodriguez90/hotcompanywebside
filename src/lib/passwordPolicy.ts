/**
 * Política de contraseña alineada con la app móvil y el contrato del backend:
 *  - mínimo 8 caracteres;
 *  - máximo 72 (límite de bcrypt);
 *  - al menos una letra y un número.
 */
export const PASSWORD_MIN = 8;
export const PASSWORD_MAX = 72;
export const PASSWORD_HINT = 'Mínimo 8 caracteres, con al menos una letra y un número';

/** Devuelve el mensaje de error, o `null` si la contraseña cumple la política. */
export function getPasswordValidationError(value: string): string | null {
  if (!value) return 'Ingresa una contraseña';
  if (value.length < PASSWORD_MIN) {
    return `La contraseña debe tener al menos ${PASSWORD_MIN} caracteres`;
  }
  if (value.length > PASSWORD_MAX) {
    return `La contraseña no puede superar ${PASSWORD_MAX} caracteres`;
  }
  if (!/\p{L}/u.test(value)) {
    return 'La contraseña debe incluir al menos una letra';
  }
  if (!/\d/.test(value)) {
    return 'La contraseña debe incluir al menos un número';
  }
  return null;
}

export function isValidPassword(value: unknown): boolean {
  return typeof value === 'string' && getPasswordValidationError(value) === null;
}

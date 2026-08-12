import type { Profile } from '../types/cv';

/**
 * Nombre corto para espacios reducidos (ej. navbar mobile):
 * inicial del primer nombre + primer apellido.
 * Ej: "Jesús María Clemente García" -> "J. Clemente"
 *     "Ana Demo" -> "A. Demo"
 *     "Cher" -> "Cher"
 */
export function shortName(profile: Profile): string {
  const first = (profile.firstName || '').trim();
  const last = (profile.lastName || '').trim();

  const firstToken = first.split(/\s+/)[0] || '';
  const lastToken = last.split(/\s+/)[0] || '';

  const initial = firstToken ? `${firstToken.charAt(0).toUpperCase()}.` : '';
  if (lastToken) return `${initial} ${lastToken}`.trim();
  return firstToken || last || (first + last).trim() || '';
}

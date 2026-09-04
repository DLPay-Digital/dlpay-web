/**
 * Formato de cifras chileno (Design System §5).
 *
 * Separador de miles con punto, decimal con coma. Los decimales coinciden con
 * los que usa el equipo en WhatsApp: la web y el chat deben decir el mismo
 * número de la misma forma (principio UX 3).
 */

const LOCALE = 'es-CL';

/** CLP siempre entero: 2.000.000 */
export function formatCLP(value: number): string {
  return new Intl.NumberFormat(LOCALE, { maximumFractionDigits: 0 }).format(value);
}

/** USDT con 2 decimales: 2.174,80 */
export function formatUSDT(value: number): string {
  return new Intl.NumberFormat(LOCALE, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/** Precio con 2 decimales: 919,70 */
export function formatRate(value: number): string {
  return new Intl.NumberFormat(LOCALE, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

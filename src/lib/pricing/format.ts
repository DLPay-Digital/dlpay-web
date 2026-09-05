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

/** Dólares con 2 decimales: 2.174,80 */
export function formatUSD(value: number): string {
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

/**
 * Interpreta un monto escrito por una persona.
 *
 * Vive acá y no dentro del componente porque es la función que traduce **todo
 * el dinero que el usuario escribe**, y una equivocación acá viaja al mensaje
 * que recibe el ejecutivo. Necesita tests.
 *
 * El separador decimal se decide por su forma, no por el carácter: en Chile el
 * punto es de miles, pero la gente pega montos copiados de correos, facturas o
 * webs en inglés.
 *
 * Dos reglas, en este orden:
 *
 * 1. Si aparecen **ambos** separadores, el último es el decimal. No se cuentan
 *    dígitos: en "2.174,626" la coma es decimal por definición del formato, y
 *    contarlos daba 2.174.626 — un error de mil veces.
 * 2. Si sólo hay un tipo, se mira la posición: seguido de tres dígitos agrupa
 *    miles; seguido de uno o dos al final de la cadena es decimal.
 *
 *   "2.000.000" -> 2000000     "2.174,62"   -> 2174.62
 *   "2174.62"   -> 2174.62     "2.174,626"  -> 2174.626
 *   "2,000,000" -> 2000000     "1,234.56"   -> 1234.56
 */
export function parseAmount(raw: string): number {
  // El signo se detecta ANTES de filtrar: si se filtrara primero, un "-5000"
  // se convertiría en 5000 y cambiaríamos en silencio lo que la persona pidió.
  if (/-/.test(raw)) return 0;

  const cleaned = raw.replace(/[^\d.,]/g, '');
  if (cleaned === '') return 0;

  const lastDot = cleaned.lastIndexOf('.');
  const lastComma = cleaned.lastIndexOf(',');
  const lastSeparator = Math.max(lastDot, lastComma);
  const decimals = lastSeparator === -1 ? 0 : cleaned.length - lastSeparator - 1;

  const isDecimal =
    lastSeparator !== -1 &&
    (lastDot !== -1 && lastComma !== -1
      ? // Ambos tipos: el último es el decimal, sin contar dígitos.
        true
      : // Un solo tipo: decide la posición.
        decimals >= 1 && decimals <= 2);

  const digitsOnly = (part: string): string => part.replace(/[.,]/g, '');
  const value = isDecimal
    ? Number(`${digitsOnly(cleaned.slice(0, lastSeparator)) || '0'}.${cleaned.slice(lastSeparator + 1)}`)
    : Number(digitsOnly(cleaned));

  // Un monto negativo o no finito no representa ninguna operación posible.
  // El signo se descarta de forma explícita, no como efecto del filtrado.
  return Number.isFinite(value) && value > 0 ? value : 0;
}

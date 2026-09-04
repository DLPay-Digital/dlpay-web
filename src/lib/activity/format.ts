/**
 * Formato de la actividad reciente.
 */

/** "Hace 14 segundos", "Hace 2 minutos". Sin horas exactas: no es una bitácora. */
export function relativeTime(from: Date, now: Date = new Date()): string {
  const seconds = Math.max(0, Math.round((now.getTime() - from.getTime()) / 1000));

  if (seconds < 60) return `Hace ${seconds} ${seconds === 1 ? 'segundo' : 'segundos'}`;

  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `Hace ${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}`;

  const hours = Math.round(minutes / 60);
  return `Hace ${hours} ${hours === 1 ? 'hora' : 'horas'}`;
}

/** "US$ 1.240" — separador chileno, sin decimales. */
export function formatUsd(value: number): string {
  return `US$ ${new Intl.NumberFormat('es-CL', { maximumFractionDigits: 0 }).format(value)}`;
}

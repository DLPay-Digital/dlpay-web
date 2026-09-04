/**
 * Configuración de negocio de DLPay.
 *
 * Punto ÚNICO de acoplamiento con la plataforma de Guita: el día que exista
 * infraestructura propia (etapa independiente, fuera del alcance de este
 * proyecto) se cambian estas constantes y nada más.
 *
 * Todos los valores vienen de variables PUBLIC_* y son configuración pública,
 * no secretos. Ver .env.example y ADR-0003 §4.
 */

const env = import.meta.env;

/** Lee una variable de entorno con valor por defecto explícito. */
function read(value: unknown, fallback: string): string {
  return typeof value === 'string' && value.length > 0 ? value : fallback;
}

export const site = {
  /** Marca comercial. Protagoniza toda la comunicación. */
  name: 'DLPay',
  /** Razón social. Sólo footer y páginas legales — nunca protagonista. */
  legalName: 'DLPZ INCZ SpA',
  url: read(env.PUBLIC_SITE_URL, 'http://localhost:4321'),
  locale: 'es-CL',
} as const;

export const contact = {
  /** Formato internacional sin signos, como lo espera wa.me */
  whatsappNumber: read(env.PUBLIC_WHATSAPP_NUMBER, '56977615921'),
} as const;

/**
 * Enlaces a la plataforma de Guita. La web nueva NO reconstruye registro,
 * login ni KYC: los enlaza (Fase 0, Frente 6).
 */
export const platform = {
  loginUrl: read(env.PUBLIC_PLATFORM_LOGIN_URL, 'https://dlpay.cl/auth/login'),
  registerUrl: read(env.PUBLIC_PLATFORM_REGISTER_URL, 'https://dlpay.cl/auth/register'),
} as const;

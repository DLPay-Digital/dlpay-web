/**
 * Configuración de negocio de DLPay.
 *
 * Punto ÚNICO de acoplamiento con la plataforma de Guita: el día que exista
 * infraestructura propia (etapa independiente, fuera del alcance de este
 * proyecto) se cambian estas constantes y nada más.
 *
 * También el punto ÚNICO desde el que la aplicación lee la URL del sitio y la
 * política de indexación. Páginas, layouts y endpoints consumen `site.url` y
 * `indexing` de aquí — nadie vuelve a leer `import.meta.env` ni `Astro.site`
 * por su cuenta. La resolución y la validación viven en `./environment.ts`, que
 * es la misma implementación que usa `astro.config.mjs`.
 *
 * Todos los valores vienen de variables PUBLIC_* y son configuración pública,
 * no secretos. Ver .env.example y ADR-0003 §4.
 */
import { allowsIndexing, resolveQuoteLimits, resolveSiteUrl } from './environment.ts';

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
  /**
   * Origen canónico, sin barra final. En un build está garantizado publicable:
   * la guarda de `astro.config.mjs` detiene el build antes si no lo es.
   */
  url: resolveSiteUrl(env),
  locale: 'es-CL',
} as const;

/**
 * Política de indexación de ESTE despliegue.
 *
 * Cerrada salvo que `PUBLIC_ALLOW_INDEXING` valga exactamente `'true'`. La
 * consumen el `<head>` de `layouts/Base.astro` y `pages/robots.txt.ts`, que son
 * las dos señales que un buscador puede leer.
 */
export const indexing = {
  allowed: allowsIndexing(env),
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

/**
 * Límites y monto de muestra del cotizador. ÚNICO lector de
 * `PUBLIC_QUOTE_MIN_CLP` y `PUBLIC_QUOTE_MAX_CLP` en toda la aplicación: el
 * cotizador, `/tarifas` y las ilustraciones de la Home consumen esto y no el
 * entorno. Resolución en `environment.ts`.
 */
export const quoteLimits = resolveQuoteLimits(env);

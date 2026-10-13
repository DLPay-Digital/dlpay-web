/// <reference types="astro/client" />

/**
 * Variables de entorno del proyecto. Todas PUBLIC_: quedan expuestas en el
 * navegador y se tratan como públicas. Ningún secreto aquí (ADR-0003 §4).
 */
interface ImportMetaEnv {
  readonly PUBLIC_SITE_URL?: string;
  /**
   * Abre la indexación por buscadores. Sólo el literal `'true'` la habilita;
   * ausente o cualquier otro valor mantiene `noindex` y `Disallow: /`.
   */
  readonly PUBLIC_ALLOW_INDEXING?: string;
  readonly PUBLIC_WHATSAPP_NUMBER?: string;
  readonly PUBLIC_QUOTE_SAMPLE_RATE?: string;
  readonly PUBLIC_QUOTE_SOURCE_LABEL?: string;
  readonly PUBLIC_QUOTE_MIN_CLP?: string;
  readonly PUBLIC_QUOTE_MAX_CLP?: string;
  readonly PUBLIC_PLATFORM_LOGIN_URL?: string;
  readonly PUBLIC_PLATFORM_REGISTER_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

/**
 * `format.ts?isla` — el MISMO módulo de formato, importado con otra
 * identidad para que el empaquetador lo copie dentro de la isla de la
 * calculadora del spread en vez de sacarlo a un trozo compartido con el
 * cotizador (Cowork, 2026-10-13, entrega `spread-`).
 *
 * Sin esto, `format.ts` salía a un archivo aparte que el cotizador de la Home
 * pasaba a pedir en cadena, después del suyo: la Home cambiaba de JavaScript
 * por una página que no es la Home. Con esto, el cotizador queda byte a byte
 * como estaba. Una sola fuente, dos copias en la salida.
 *
 * El tipo es exactamente el del módulo, así que TypeScript sigue comprobando
 * cada uso.
 */
declare module '*/pricing/format.ts?isla' {
  const formato: typeof import('./lib/pricing/format.ts');
  export = formato;
}

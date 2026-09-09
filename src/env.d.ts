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

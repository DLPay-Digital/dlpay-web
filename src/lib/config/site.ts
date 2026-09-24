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
  /**
   * Razón social. Sólo footer y páginas legales — nunca protagonista.
   *
   * **DLPZ PRO SpA desde el 2026-09-24 (D9 cerrada por Sebastián).** Antes
   * decía «DLPZ INCZ SpA», que era la sociedad que la web nombraba y **no** la
   * que firman los T&C y la Política publicados. Se elige la de los documentos:
   * publicar bajo una entidad que contradiga el contrato vigente era el motivo
   * por el que D9 bloqueaba los textos legales. Hay un reparto entre las dos
   * sociedades, y la web habla por la que contrata con el cliente.
   */
  legalName: 'DLPZ PRO SpA',
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

const whatsappNumber = read(env.PUBLIC_WHATSAPP_NUMBER, '56977615921');

export const contact = {
  /**
   * Correo oficial de contacto y de reclamos formales. **D19, cerrada por
   * Sebastián el 2026-09-24.**
   *
   * Es el que indican los T&C. La Política de Privacidad publicada dice
   * `contacto@dlpzpro.cl`, y esa discrepancia es del documento, no de la web:
   * queda anotada en `legal-brief.md` para que se corrija al reescribirlo.
   */
  email: 'contacto@dlpay.cl',
  /** Formato internacional sin signos, como lo espera wa.me */
  whatsappNumber,
  /**
   * Enlace a WhatsApp, con o sin mensaje prellenado. ÚNICO sitio de la
   * aplicación que sabe cómo se arma: antes ocho archivos escribían la URL a
   * mano. Los enlaces que nacen de una COTIZACIÓN siguen usando
   * `whatsappUrl()` de `lib/pricing/quote.ts`, que compone el mensaje desde el
   * `Quote`; este es para los enlaces de contacto planos.
   *
   * Si `text` no viene, el chat se abre en blanco. Hoy lo hacen cinco enlaces
   * —pie, /tarifas, /como-funciona, /confianza y el botón del encabezado de
   * /empresas— y es una decisión de contenido abierta (CLAUDE.md §13, D22), no
   * un descuido.
   */
  whatsappUrl(text?: string): string {
    const base = `https://wa.me/${whatsappNumber}`;
    return text ? `${base}?text=${encodeURIComponent(text)}` : base;
  },
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

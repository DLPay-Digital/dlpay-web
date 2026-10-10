// @ts-check
import { writeFileSync } from 'node:fs';

import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';

import {
  allowsIndexing,
  assertPublishableSiteUrl,
  resolveSiteUrl,
} from './src/lib/config/environment.ts';

/**
 * Configuración de Astro — deliberadamente mínima (ADR-0002, ADR-0005).
 *
 * Regla de portabilidad vinculante: el sitio debe poder publicarse copiando
 * dist/ a cualquier servidor estático. Nada de funciones propietarias de
 * plataforma en el núcleo. Ninguna configuración específica de un proveedor
 * mientras la decisión de hosting siga diferida.
 *
 * `loadEnv` es de Vite (que Astro ya incluye) y es necesario aquí porque este
 * archivo se evalúa ANTES de que Vite inyecte `import.meta.env`: es el único
 * lugar del proyecto donde el entorno se lee de otra forma. La lógica que
 * interpreta lo leído no se duplica — sale de `lib/config/environment.ts`, la
 * misma que consume `lib/config/site.ts` durante el render.
 */
const env = loadEnv('', '.', 'PUBLIC_');

/**
 * Guarda de despliegue. Comprueba, cuando Astro declara que está construyendo,
 * que la configuración sirva para publicar.
 *
 * Pregunta a Astro qué está haciendo (`command`), no cómo lo invocaron. La
 * versión anterior miraba `npm_lifecycle_event === 'build'`, y eso sólo es
 * cierto con `npm run build`: `astro build`, `npx astro build`, un `--outDir`,
 * un script envoltorio o la API programática pasaban de largo y publicaban
 * localhost con el build en verde. `command` es correcto en todos esos casos.
 *
 * Lanzar aquí aborta el build con código de salida 1, así que un CI lo nota.
 *
 * @returns {import('astro').AstroIntegration}
 */
function deployGuard() {
  return {
    name: 'dlpay:deploy-guard',
    hooks: {
      'astro:config:setup': ({ command, logger }) => {
        // `dev`, `sync` y `preview` trabajan contra localhost: ahí es correcto.
        if (command !== 'build') return;

        const url = assertPublishableSiteUrl(env);

        // La indexación se decide por omisión (cerrada), y una decisión por
        // omisión que nadie ve es la forma de publicar el sitio real con
        // `noindex` sin enterarse. Se declara en voz alta en cada build.
        logger.info(`URL canónica: ${url}`);
        logger.info(
          allowsIndexing(env)
            ? 'Indexación PERMITIDA — este build es para el sitio público.'
            : 'Indexación BLOQUEADA — noindex en todas las páginas y Disallow en robots.txt. ' +
                'Para el sitio público: PUBLIC_ALLOW_INDEXING=true'
        );
      },
    },
  };
}

/**
 * Cabeceras de seguridad (D27), escritas en `dist/_headers` al terminar el
 * build.
 *
 * ── Por qué un archivo generado y no uno estático en `public/` ─────────────
 *
 * Por **una sola** de las siete cabeceras: `X-Robots-Tag`. Las otras seis valen
 * igual en Staging y en producción, pero ésa va **sólo en Staging** y sería un
 * desastre en el sitio público: le dice al buscador que no indexe nada.
 *
 * Un archivo estático en `public/` la pondría en los dos. Generándolo acá sale
 * de `allowsIndexing(env)`, **la misma función** que decide el `noindex` del
 * HTML y el `Disallow` del `robots.txt`. Las tres cosas se mueven juntas o no
 * se mueven: no hay forma de publicar el sitio real con la cabecera puesta.
 *
 * Y es la defensa robusta de las tres. El `robots.txt` dice `Disallow: /`, que
 * impide RASTREAR, y un buscador que no rastrea **nunca llega a leer el
 * `noindex` del HTML**: una URL descubierta por un enlace externo podría
 * acabar indexada igual. Como cabecera HTTP el veto no depende de que nadie
 * lea la página.
 *
 * ── Qué lleva, y por qué cada una ──────────────────────────────────────────
 *
 * El conjunto es el de `docs/arquitectura-produccion.md` §5.1, verificado
 * contra el build del 2026-10-10 antes de escribirlo:
 *
 * · **`connect-src 'none'` es literalmente cierto.** El sitio no llama a
 *   ninguna API: se barrió `dist/` buscando `fetch`, `XMLHttpRequest`,
 *   `WebSocket`, `EventSource` y `sendBeacon`, y la única coincidencia es la
 *   palabra «fetch» dentro de un comentario del globo.
 * · **`img-src` necesita `data:`**, y no es un descuido heredado: las texturas
 *   del Diario DLPay y del abanico de etiquetas son ocho SVG en línea dentro
 *   de `url("data:image/svg+xml...")`. Sin `data:` las dos piezas de ADR-0011
 *   pierden su materia. Ya estaba previsto en esa ADR.
 * · **`'unsafe-inline'` en `script-src` y `style-src`** porque Astro inlinea
 *   siete scripts y los estilos. Se puede endurecer por hash; es trabajo
 *   aparte y está anotado en §5.1.
 * · **`form-action 'none'`** porque no hay un solo `<form>` en las diecisiete
 *   rutas. Comprobado.
 * · **`Referrer-Policy: strict-origin-when-cross-origin`, y NO `no-referrer`.**
 *   La intro de marca descarta la visita cuando `document.referrer` es de
 *   nuestro propio origen (ADR-0010). Con `no-referrer` ese respaldo se queda
 *   sin efecto **en silencio**: ningún error, ningún test rojo, sólo una intro
 *   apareciendo donde no debe.
 * · **`Strict-Transport-Security`** se incluye porque la condición que §5.1 le
 *   ponía —que todos los subdominios sirvan HTTPS— la cumple `workers.dev`,
 *   que no sirve nada por HTTP. Sin `preload`: eso es irreversible y esta
 *   dirección es temporal.
 *
 * ── Lo que NO gobierna ─────────────────────────────────────────────────────
 *
 * `_headers` es una convención de Cloudflare y de Netlify, no un estándar. En
 * un servidor estático cualquiera **no hace nada**, y ahí ADR-0005 sigue
 * cumpliéndose: `dist/` se copia y el sitio funciona, sólo que sin cabeceras.
 * Quien cambie de proveedor tiene que volver a declararlas en el suyo, y por
 * eso el conjunto vive en `docs/arquitectura-produccion.md` §5.1 y no sólo
 * aquí.
 *
 * @returns {import('astro').AstroIntegration}
 */
function cabecerasDeSeguridad() {
  return {
    name: 'dlpay:security-headers',
    hooks: {
      'astro:build:done': ({ dir, logger }) => {
        const csp = [
          "default-src 'self'",
          "script-src 'self' 'unsafe-inline'",
          "style-src 'self' 'unsafe-inline'",
          "img-src 'self' data:",
          "font-src 'self'",
          "connect-src 'none'",
          "form-action 'none'",
          "frame-ancestors 'none'",
          "base-uri 'self'",
        ].join('; ');

        const indexa = allowsIndexing(env);
        const lineas = [
          '# Generado por `dlpay:security-headers` en cada build. No se edita a mano:',
          '# el conjunto y su porqué están en astro.config.mjs y en',
          '# docs/arquitectura-produccion.md §5.1.',
          '/*',
          `  Content-Security-Policy: ${csp}`,
          '  X-Content-Type-Options: nosniff',
          '  Referrer-Policy: strict-origin-when-cross-origin',
          '  Permissions-Policy: geolocation=(), camera=(), microphone=(), payment=()',
          '  X-Frame-Options: DENY',
          '  Strict-Transport-Security: max-age=31536000; includeSubDomains',
        ];

        /*
          La única condicional del archivo. Va atada a la misma llave que el
          `noindex` del HTML: si algún día este build es el del sitio público,
          la cabecera desaparece sola.
        */
        if (!indexa) lineas.push('  X-Robots-Tag: noindex, nofollow');

        writeFileSync(new URL('_headers', dir), lineas.join('\n') + '\n', 'utf-8');
        logger.info(
          indexa
            ? 'Cabeceras escritas en dist/_headers (sin X-Robots-Tag: este build es público).'
            : 'Cabeceras escritas en dist/_headers, con X-Robots-Tag: noindex.'
        );
      },
    },
  };
}

export default defineConfig({
  /**
   * Alimenta `Astro.site`. La aplicación no lo consume —páginas, layouts y
   * endpoints leen `site.url` de `lib/config/site.ts`—, pero se declara para
   * que `Astro.site` no contradiga lo que el sitio publica.
   */
  site: resolveSiteUrl(env),
  integrations: [deployGuard(), cabecerasDeSeguridad()],
  output: 'static',
  /**
   * Objetivo del CSS compilado. NO es una optimización: es una corrección.
   *
   * Sin declararlo, el minificador reescribe `@media (min-width: 900px)` como
   * `@media (width >= 900px)`, la sintaxis de rango de Media Queries nivel 4.
   * Safari anterior a 16.4, Chrome anterior a 104 y Firefox anterior a 102
   * **descartan la regla entera** al no entender la condición: el sitio se
   * queda sin ninguna de sus reglas de escritorio y todas las páginas se
   * apilan en una sola columna. No falla de forma visible ni da error en
   * consola; simplemente se ve roto.
   *
   * Con estos objetivos el minificador conserva `min-width` y el sitio
   * responde igual en navegadores de 2021 en adelante. Se verifica con:
   *   grep -o '@media ([^)]*)' dist/_astro/*.css
   */
  vite: {
    build: {
      cssTarget: ['chrome87', 'edge88', 'firefox78', 'safari14'],
    },
  },
  /**
   * Declarado a propósito. El build genera `dist/cotizar/index.html`, así que la
   * URL canónica lleva barra final. Sin declararlo, los enlaces internos
   * apuntaban a `/cotizar` y el sitemap a `/cotizar/`: Cloudflare y Vercel no
   * resuelven igual esa diferencia — en el mejor caso una redirección por
   * navegación, en el peor un 404, y para un buscador dos URL para el mismo
   * contenido. Es un fallo que no se ve en localhost.
   */
  trailingSlash: 'always',
  /**
   * El ámbito de los estilos viaja como CLASE, no como atributo.
   *
   * Con la estrategia por atributo (la de fábrica), un `<svg>` que vive dentro
   * de un componente hijo NO recibe `data-astro-cid-*` del padre, así que
   * reglas como `.brand-mark { height: 18px }` nunca llegaban a aplicarse: el
   * isotipo, los iconos de WhatsApp y los de las secciones quedaban sin tamaño
   * ni color. Como clase, el ámbito viaja dentro del `class` que el padre pasa
   * al hijo y que el hijo escribe en el `<svg>`.
   *
   * La especificidad es idéntica entre ambas estrategias, así que el cambio no
   * altera ninguna cascada existente.
   */
  scopedStyleStrategy: 'class',

  /**
   * DESACTIVADO A PROPÓSITO. El compresor de Astro elimina el espacio entre un
   * texto y una etiqueta EN LÍNEA que le sigue, y el resultado se lee pegado:
   *
   *   fuente:    …y empresas.\n<a>Ver el proceso completo</a>
   *   comprimido: …y empresas.<a>Ver el proceso completo</a>   → "empresas.Ver"
   *
   * Había 9 casos en 6 páginas, incluidas las legales y el límite del servicio
   * de /como-funciona — justo donde el texto tiene que leerse impecable. Uno
   * partía una palabra: "el precio de la web esreferencial".
   *
   * Se corrige aquí y no con `{' '}` en cada plantilla porque eso deja la
   * trampa puesta: la próxima plantilla que junte texto y un <a> vuelve a
   * romperse en silencio, sin error de build.
   *
   * Coste medido sobre las 9 páginas: +22,5 KB en crudo, pero sólo
   * +2,8 KB gzip en total (309 B por página). El HTML viaja comprimido.
   */
  compressHTML: false,
});

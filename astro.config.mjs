// @ts-check
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

export default defineConfig({
  /**
   * Alimenta `Astro.site`. La aplicación no lo consume —páginas, layouts y
   * endpoints leen `site.url` de `lib/config/site.ts`—, pero se declara para
   * que `Astro.site` no contradiga lo que el sitio publica.
   */
  site: resolveSiteUrl(env),
  integrations: [deployGuard()],
  output: 'static',
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

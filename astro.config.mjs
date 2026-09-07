// @ts-check
import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';

/**
 * Configuración de Astro — deliberadamente mínima (ADR-0002, ADR-0005).
 *
 * Regla de portabilidad vinculante: el sitio debe poder publicarse copiando
 * dist/ a cualquier servidor estático. Nada de funciones propietarias de
 * plataforma en el núcleo. Ninguna configuración específica de un proveedor
 * mientras la decisión de hosting siga diferida.
 *
 * `loadEnv` es de Vite (que Astro ya incluye): evita depender de @types/node
 * sólo para leer una variable en este archivo.
 */
const env = loadEnv('', '.', 'PUBLIC_');

const DEV_SITE = 'http://localhost:4321';

/**
 * `site` alimenta canonical, og:url, twitter:image y todas las URL del sitemap.
 *
 * Un build sin esta variable publicaría localhost en todos ellos, y lo haría en
 * silencio: build verde, páginas correctas, enlaces internos funcionando. El
 * daño sólo aparece cuando un buscador indexa canonicals inválidos o alguien
 * comparte el enlace y la previsualización no carga. Por eso falla aquí, fuerte
 * y temprano, en vez de dejarlo pasar.
 */
function resolveSite() {
  if (env.PUBLIC_SITE_URL) return env.PUBLIC_SITE_URL;
  if (process.env.npm_lifecycle_event === 'build') {
    throw new Error(
      '\n\n  Falta PUBLIC_SITE_URL.\n\n' +
        '  Sin ella, canonical, Open Graph y el sitemap apuntarían a localhost.\n' +
        '  Defínela en .env o en el entorno de despliegue:\n\n' +
        '      PUBLIC_SITE_URL=https://dlpay.cl\n'
    );
  }
  return DEV_SITE;
}

export default defineConfig({
  site: resolveSite(),
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
});

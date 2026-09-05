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
});

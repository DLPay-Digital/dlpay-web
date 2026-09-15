/**
 * Sitemap generado desde las páginas reales del proyecto.
 *
 * Se deriva de `src/pages/` en vez de mantener una lista a mano: una página
 * nueva entra sola, y no puede quedar fuera por olvido. Cero dependencias — el
 * paquete oficial de sitemap no aporta nada sobre nueve rutas estáticas.
 */
import type { APIRoute } from 'astro';

import { publishedPosts } from '../lib/blog.ts';
import { site } from '../lib/config/site.ts';

const pages = import.meta.glob('./**/*.astro');

/**
 * `./index.astro` -> `/` · `./como-funciona.astro` -> `/como-funciona/`
 * `./blog/index.astro` -> `/blog/` — cualquier `index` anidado colapsa a su
 * carpeta. Sin esto el sitemap publicaba `/blog/index/`, que da 404.
 */
function routeOf(file: string): string {
  const path = file.replace(/^\.\//, '').replace(/\.astro$/, '').replace(/(^|\/)index$/, '');
  return path === '' ? '/' : `/${path}/`;
}

/** Una ruta dinámica no es una URL: `[slug].astro` no se publica tal cual. */
const isDynamic = (file: string): boolean => file.includes('[');

/**
 * La 404 se construye como una página más, pero no es una dirección: se sirve
 * bajo cualquier URL que no exista. Publicarla en el sitemap sería pedirle a un
 * buscador que indexe la página de error. Va fuera, igual que va con `noindex`.
 */
const isNotFound = (file: string): boolean => file === './404.astro';

export const GET: APIRoute = async () => {
  // `site.url` ya viene normalizado sin barra final (lib/config/environment.ts).
  const base = site.url;

  // La Home es LA entrada del sitio; el resto la sostiene. `/cotizar/` tenía
  // 0.9 hasta que se eliminó: duplicaba el cotizador del héroe de la Home.
  const priority = (route: string): string => (route === '/' ? '1.0' : '0.7');

  /* Las rutas dinámicas se excluyen del recorrido de archivos y entran por su
     colección, que es donde viven las URLs de verdad. */
  const estaticas = Object.keys(pages)
    .filter((file) => !isDynamic(file) && !isNotFound(file))
    .map(routeOf);
  /* Mismo candado que el listado y que `[slug]`: un borrador no se anuncia. */
  const articulos = (await publishedPosts()).map((post) => `/blog/${post.id}/`);

  const urls = [...estaticas, ...articulos]
    .sort()
    .map(
      (route) =>
        `  <url>\n    <loc>${base}${route}</loc>\n` +
        `    <priority>${priority(route)}</priority>\n  </url>`
    )
    .join('\n');

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
      `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
    { headers: { 'Content-Type': 'application/xml; charset=utf-8' } }
  );
};

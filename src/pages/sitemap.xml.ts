/**
 * Sitemap generado desde las páginas reales del proyecto.
 *
 * Se deriva de `src/pages/` en vez de mantener una lista a mano: una página
 * nueva entra sola, y no puede quedar fuera por olvido. Cero dependencias — el
 * paquete oficial de sitemap no aporta nada sobre nueve rutas estáticas.
 */
import type { APIRoute } from 'astro';

import { site } from '../lib/config/site.ts';

const pages = import.meta.glob('./**/*.astro');

/** `./index.astro` -> `/` · `./como-funciona.astro` -> `/como-funciona/` */
function routeOf(file: string): string {
  const path = file.replace(/^\.\//, '').replace(/\.astro$/, '');
  return path === 'index' ? '/' : `/${path}/`;
}

export const GET: APIRoute = () => {
  // `site.url` ya viene normalizado sin barra final (lib/config/environment.ts).
  const base = site.url;

  // La Home es LA entrada del sitio; el resto la sostiene. `/cotizar/` tenía
  // 0.9 hasta que se eliminó: duplicaba el cotizador del héroe de la Home.
  const priority = (route: string): string => (route === '/' ? '1.0' : '0.7');

  const urls = Object.keys(pages)
    .map(routeOf)
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

/**
 * robots.txt generado, para que la URL del sitemap y la política de indexación
 * salgan de la configuración y no de una constante que se olvide de actualizar
 * al desplegar.
 *
 * `site.url` viene de `lib/config/site.ts`, el mismo punto que alimenta el
 * canonical y el Open Graph. Antes esto leía `Astro.site`, que era un segundo
 * camino para el mismo dato.
 */
import type { APIRoute } from 'astro';

import { indexing, site } from '../lib/config/site.ts';

export const GET: APIRoute = () => {
  const body = indexing.allowed
    ? ['User-agent: *', 'Allow: /', '', `Sitemap: ${site.url}/sitemap.xml`, '']
    : [
        '# Indexación bloqueada a propósito.',
        '# Este despliegue NO es el sitio público de DLPay.',
        '# Se abre con PUBLIC_ALLOW_INDEXING=true en el entorno de despliegue.',
        '',
        'User-agent: *',
        'Disallow: /',
        '',
      ];

  return new Response(body.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};

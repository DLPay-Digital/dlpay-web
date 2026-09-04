/**
 * robots.txt generado, para que la URL del sitemap salga siempre del `site`
 * configurado y no de una constante que se olvide de actualizar al desplegar.
 */
import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => {
  const base = site?.href.replace(/\/$/, '') ?? '';

  return new Response(
    [
      'User-agent: *',
      'Allow: /',
      '',
      `Sitemap: ${base}/sitemap.xml`,
      '',
    ].join('\n'),
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } }
  );
};

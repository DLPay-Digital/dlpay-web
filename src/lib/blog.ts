/**
 * El candado de publicación del blog.
 *
 * Mismo patrón que `lib/config/alliances.ts`, que es donde el proyecto ya lo
 * resolvió bien: el dato declara si está aprobado y UN solo filtro decide qué
 * se renderiza. Un marcador de texto dentro del artículo no detiene un build;
 * un campo del esquema sí.
 *
 * ── Por qué hacía falta ────────────────────────────────────────────────────
 *
 * Hasta el 2026-09-15 `getCollection('blog')` devolvía todo. El artículo de
 * prueba —cuyo propio cuerpo dice «no debe publicarse»— salía en el listado, en
 * `/blog/<slug>/` y en el sitemap. Lo único que lo tapaba era
 * `PUBLIC_ALLOW_INDEXING=false`, y abrir esa variable es exactamente el gesto
 * de salir a producción: bastaba eso para publicar contenido de mercado sin
 * aprobar bajo la marca DLPay, que es el escenario que CLAUDE.md §3 existe para
 * impedir.
 *
 * ── La regla ───────────────────────────────────────────────────────────────
 *
 * `estado` va **cerrado por omisión** (`borrador`). Un artículo se publica
 * cuando alguien escribe `estado: publicado` en su frontmatter, y eso sólo debe
 * ocurrir después de que Compliance lo apruebe (CLAUDE.md §6: «ningún artículo
 * se publica sin pasar por Compliance»).
 *
 * Los borradores SÍ se ven con `astro dev`, para poder redactarlos y revisar el
 * render. Nunca entran a un build. Así el trabajo de redacción no cambia y la
 * salida a producción deja de depender de una variable de entorno.
 */
import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'blog'>;

/** Publicados en producción; en desarrollo también los borradores. */
export async function publishedPosts(): Promise<Post[]> {
  const posts = await getCollection(
    'blog',
    ({ data }) => data.estado === 'publicado' || import.meta.env.DEV
  );
  /* Más reciente primero. El orden lo decide el dato, no el nombre del archivo. */
  return posts.sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());
}

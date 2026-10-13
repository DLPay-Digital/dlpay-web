/**
 * La ruta «Tu primera operación», los minutos de lectura y «Sigue leyendo».
 *
 * Cowork, 2026-10-13, entrega `aprende-`. Funciones PURAS: reciben la lista de
 * artículos ya filtrada por el candado de `blog.ts` y no tocan `astro:content`,
 * así que se prueban con `node --test` sin un build
 * (`tests/blog-indice.test.ts`).
 *
 * `PostLike` es la forma mínima que necesitan. Un `CollectionEntry<'blog'>` la
 * cumple; los tests pasan objetos literales.
 */
export interface PostLike {
  id: string;
  body?: string;
  data: {
    category: string;
    ruta?: { paso: number; titulo: string };
  };
}

/*
  ── La ruta «Tu primera operación» ────────────────────────────────────────
  (Cowork, 2026-10-13, entrega `aprende-`)

  Recibe la lista YA FILTRADA por el candado, así que un paso en borrador no
  existe: el siguiente ocupa su número y la ruta nunca enseña un hueco ni un
  enlace a una página que no se construyó. `paso` en el frontmatter sólo
  ORDENA; el número que se ve es la posición entre los publicados.

  Con menos de dos pasos no hay ruta: un «recorrido» de una sola parada no
  recorre nada, y el índice la omite entera.
*/
export interface PasoDeRuta<P extends PostLike = PostLike> {
  post: P;
  /** 1, 2, 3… entre los publicados, no el `paso` del frontmatter. */
  numero: number;
  total: number;
}

export function rutaPublicada<P extends PostLike>(posts: P[]): PasoDeRuta<P>[] {
  const enRuta = posts
    .filter((p) => p.data.ruta !== undefined)
    .sort((a, b) => (a.data.ruta?.paso ?? 0) - (b.data.ruta?.paso ?? 0));
  if (enRuta.length < 2) return [];
  return enRuta.map((post, i) => ({ post, numero: i + 1, total: enRuta.length }));
}

/*
  ── Minutos de lectura ────────────────────────────────────────────────────

  Se cuentan del Markdown y no se escriben a mano, así que no envejecen.

  **Lo que NO cuenta**, y es casi todo el trabajo de esta función: los
  comentarios `<!-- -->`, que en estos artículos llevan registros de
  verificación de cientos de palabras que nadie lee en la página; el HTML de
  las figuras; y la sintaxis de enlaces y énfasis. 200 palabras por minuto,
  redondeado hacia arriba: es la velocidad prudente para texto con cifras.
*/
export function minutosDeLectura(post: Pick<PostLike, 'body'>): number {
  const texto = (post.body ?? '')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\]\([^)]*\)/g, ']')
    .replace(/[#*_>`[\]|-]/g, ' ');
  const palabras = texto.split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length;
  return Math.max(1, Math.ceil(palabras / 200));
}

/*
  ── «Sigue leyendo» ───────────────────────────────────────────────────────

  Dos artículos, con un orden de preferencia que es lo único que hay que
  entender: **el paso siguiente de la ruta va primero**, si el artículo está
  en ella y no es el último. Después, los de la misma categoría, del más
  reciente al más antiguo; y si no alcanza, los demás. Nunca el propio.

  Se decide en el build: no hay JavaScript ni nada que medir en el
  navegador.
*/
export function sigueLeyendo<P extends PostLike>(post: P, posts: P[], cuantos = 2): P[] {
  const ruta = rutaPublicada(posts);
  const aqui = ruta.findIndex((r) => r.post.id === post.id);
  const elegidos: P[] = [];
  const siguiente = aqui >= 0 ? ruta[aqui + 1] : undefined;
  if (siguiente) elegidos.push(siguiente.post);
  const resto = posts.filter((p) => p.id !== post.id && !elegidos.includes(p));
  const misma = resto.filter((p) => p.data.category === post.data.category);
  const otras = resto.filter((p) => p.data.category !== post.data.category);
  for (const p of [...misma, ...otras]) {
    if (elegidos.length >= cuantos) break;
    elegidos.push(p);
  }
  return elegidos;
}

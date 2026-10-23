/**
 * Las secciones de un documento legal, sacadas de su propio HTML (Cowork,
 * 2026-10-23, ADR-0018, tanda 4: el riel en las legales).
 *
 * Las legales son `.astro` con el texto escrito a mano, no Markdown, así que no
 * traen la lista de encabezados que `render()` le da al artículo. En vez de
 * pedirle a cada página que repita sus títulos en una lista —dos copias del
 * mismo texto que algún día dirían cosas distintas—, el layout lee el HTML ya
 * renderizado y saca de ahí los H2.
 *
 * **Sólo los H2 de primer nivel**, los que son hijos directos del documento. El
 * aviso de `PendingNotice` lleva su propio H2 dentro de un `<div>`, y no es una
 * sección del documento: es una nota sobre él. Además, el riel marca dónde
 * estás emparejando por posición con `:nth-of-type`, que sólo cuenta hermanos;
 * un H2 anidado rompería la cuenta. Es la misma regla que `tests/riel.test.ts`
 * vigila en el artículo.
 *
 * Función pura y sin `astro:content`, para que `node --test` la pruebe
 * (`tests/secciones.test.ts`).
 */

export interface Seccion {
  /** El `id` del H2: el que ya traía o uno sacado de su texto. */
  id: string;
  /** El contenido del H2 sin etiquetas, con sus entidades tal cual: va con `set:html`. */
  html: string;
}

const VACIOS = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr']);

/** `Qué ocurre después` → `que-ocurre-despues`. Sin tildes, sin signos, en minúsculas. */
export function aSlug(texto: string): string {
  return (
    texto
      .replace(/&[a-z]+;|&#\d+;/gi, ' ')
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'seccion'
  );
}

/**
 * Devuelve el HTML con un `id` en cada H2 de primer nivel que no lo traiga, y
 * la lista de esas secciones en orden. Los H2 anidados no se tocan.
 */
export function seccionesDelDocumento(html: string): { html: string; secciones: Seccion[] } {
  const secciones: Seccion[] = [];
  const usados = new Set<string>();
  let salida = '';
  let desde = 0;
  let hondo = 0;
  const etiqueta = /<(\/?)([a-zA-Z][a-zA-Z0-9-]*)([^>]*?)(\/?)>/g;
  for (let m = etiqueta.exec(html); m; m = etiqueta.exec(html)) {
    const [, cierra, nombre, atributos = '', propio] = m;
    const tag = (nombre ?? '').toLowerCase();
    if (cierra) { hondo--; continue; }
    if (tag === 'h2' && hondo === 0) {
      const fin = html.indexOf('</h2>', etiqueta.lastIndex);
      const dentro = fin >= 0 ? html.slice(etiqueta.lastIndex, fin) : '';
      const limpio = dentro.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
      let id = atributos.match(/\sid="([^"]+)"/)?.[1];
      if (!id) {
        const base = aSlug(limpio);
        id = base;
        for (let n = 2; usados.has(id); n++) id = `${base}-${n}`;
        salida += html.slice(desde, m.index) + `<h2${atributos} id="${id}">`;
        desde = etiqueta.lastIndex;
      }
      usados.add(id);
      secciones.push({ id, html: limpio });
    }
    if (!propio && !VACIOS.has(tag)) hondo++;
  }
  return { html: salida + html.slice(desde), secciones };
}

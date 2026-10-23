/**
 * Tests del riel que sabe dónde estás (Cowork, entrega `vida3-`, 2026-10-23;
 * ADR-0018, piezas 17 y 19).
 *
 * Lee `dist/`, como `zero-js.test.ts`, y se salta si no hay build.
 *
 * **Lo que protege:** el riel de `/preguntas` y el del artículo marcan dónde
 * estás sin JavaScript, emparejando **por posición** cada entrada con su grupo
 * o con su H2: la tercera entrada se enciende con la tercera línea de tiempo.
 * El CSS no puede comprobar que las dos listas digan lo mismo, así que, si una
 * se desordena, el riel marca la sección equivocada y nadie se entera. Pasa,
 * por ejemplo, si un H2 de un artículo queda dentro de un `<div>`: deja de ser
 * hermano de los otros y `:nth-of-type` cuenta mal.
 *
 * Y el CSS nombra un número fijo de líneas de tiempo —8 en `/preguntas`, 12 en
 * el artículo—: los dos `astro` ya fallan al pasarse, y esto lo comprueba
 * también sobre el resultado.
 *
 * **Desde la entrega `vida5-` (2026-10-23, tanda 4), también las legales**: el
 * riel aparece con tres secciones o más, y cada entrada apunta a su H2 de
 * primer nivel. El H2 del aviso `PendingNotice` va dentro de un `<div>` y no
 * cuenta: el CSS de las legales nombra sólo los hijos directos (`.prose > h2`).
 */
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const dist = fileURLToPath(new URL('../dist/', import.meta.url));
const leer = (archivo: string) => readFileSync(join(dist, archivo), 'utf8');

/** Los destinos de los enlaces de un trozo de HTML, en orden y sin el `#`. */
const anclas = (html: string) => [...html.matchAll(/<a href="#([^"]+)"/g)].map((m) => m[1]);

const VACIOS = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr']);

/**
 * Los `id` de los H2 que son hijos directos del trozo, en orden, y los que no
 * lo son. Recorre las etiquetas llevando la profundidad: un H2 a profundidad
 * cero es hermano de los demás, que es lo que `:nth-of-type` necesita.
 */
function h2Directos(html: string): { directos: string[]; anidados: string[] } {
  const directos: string[] = [];
  const anidados: string[] = [];
  let hondo = 0;
  for (const m of html.matchAll(/<(\/?)([a-zA-Z][a-zA-Z0-9-]*)([^>]*?)(\/?)>/g)) {
    const [, cierra, nombre, atributos, propio] = m;
    const tag = (nombre ?? '').toLowerCase();
    if (cierra) { hondo--; continue; }
    if (tag === 'h2') {
      const id = (atributos ?? '').match(/id="([^"]+)"/)?.[1] ?? '(sin id)';
      (hondo === 0 ? directos : anidados).push(id);
    }
    if (!propio && !VACIOS.has(tag)) hondo++;
  }
  return { directos, anidados };
}

describe('el riel que sabe dónde estás', { skip: !existsSync(dist) && 'sin dist/: corre `npm run build` antes' }, () => {
  test('en /preguntas, cada entrada apunta a su grupo y en el mismo orden', () => {
    const html = leer('preguntas/index.html');
    const nav = html.match(/<nav class="entrada[\s\S]*?<\/nav>/)?.[0];
    assert.ok(nav, '/preguntas no tiene la banda de entrada');
    const entradas = anclas(nav);
    const grupos = [...html.matchAll(/<section class="grupo[^"]*" id="([^"]+)"/g)].map((m) => m[1]);
    assert.deepEqual(entradas, grupos, 'el riel y los grupos no están en el mismo orden');
    assert.ok(grupos.length <= 8, `${grupos.length} grupos: el CSS marca hasta 8`);
  });

  test('en cada artículo con riel, cada entrada apunta a su H2 y en el mismo orden', () => {
    const blog = join(dist, 'blog');
    let vistos = 0;
    for (const slug of readdirSync(blog, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name)) {
      const archivo = join('blog', slug, 'index.html');
      if (!existsSync(join(dist, archivo))) continue;
      const html = leer(archivo);
      const indice = html.match(/<ol class="lat-indice[\s\S]*?<\/ol>/)?.[0];
      if (!indice) continue;
      vistos++;
      const prosa = html.match(/<div class="prose[^"]*">([\s\S]*?)(?:<section class="sigue|<\/article>)/)?.[1] ?? '';
      const { directos, anidados } = h2Directos(prosa);
      assert.deepEqual(anidados, [], `/blog/${slug}/: H2 dentro de otra etiqueta, que el riel no puede contar`);
      assert.deepEqual(anclas(indice), directos, `/blog/${slug}/: el riel y los H2 no están en el mismo orden`);
      assert.ok(directos.length <= 12, `/blog/${slug}/: ${directos.length} secciones, y el CSS marca hasta 12`);
    }
    assert.ok(vistos > 0, 'ningún artículo tiene riel: el test no está mirando nada');
  });

  test('en las legales, el riel sale con tres secciones o más y apunta a sus H2 en orden', () => {
    let conRiel = 0;
    for (const pagina of ['terminos', 'privacidad', 'canal-de-denuncias']) {
      const html = leer(join(pagina, 'index.html'));
      const prosa = html.match(/<article class="prose[^"]*">([\s\S]*?)<footer class="meta/)?.[1];
      assert.ok(prosa, `/${pagina}/: no encontré el documento`);
      const { directos } = h2Directos(prosa);
      const indice = html.match(/<ol class="lat-indice[\s\S]*?<\/ol>/)?.[0];
      if (directos.length < 3) {
        assert.equal(indice, undefined, `/${pagina}/: ${directos.length} secciones y tiene riel; con menos de tres no va`);
        continue;
      }
      conRiel++;
      assert.ok(indice, `/${pagina}/: ${directos.length} secciones y no tiene riel`);
      assert.deepEqual(anclas(indice), directos, `/${pagina}/: el riel y los H2 no están en el mismo orden`);
      assert.ok(directos.length <= 12, `/${pagina}/: ${directos.length} secciones, y el CSS marca hasta 12`);
    }
    assert.ok(conRiel > 0, 'ninguna legal tiene riel: el test no está mirando nada');
  });
});

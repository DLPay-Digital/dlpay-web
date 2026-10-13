/**
 * Tests de la ruta «Tu primera operación», los minutos de lectura y «Sigue
 * leyendo» (`src/lib/blog-indice.ts`), y de los enlaces entre artículos en el
 * build.
 *
 * Cowork, 2026-10-13, entrega `aprende-`. Lo que fijan es lo que haría daño sin
 * que nadie lo viera:
 *
 * · que un paso en BORRADOR no deje un hueco ni un enlace muerto en la ruta;
 * · que los registros de verificación —comentarios de cientos de palabras—
 *   no inflen los minutos de lectura;
 * · que ningún artículo publicado enlace a uno que no se construyó. Las guías
 *   se escriben juntas y se publican de a una: un enlace de una guía publicada
 *   a otra en borrador sería un 404 en producción.
 */
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { rutaPublicada, minutosDeLectura, sigueLeyendo, type PostLike } from '../src/lib/blog-indice.ts';

const post = (id: string, category: string, paso?: number, body = ''): PostLike => ({
  id,
  body,
  data: { category, ...(paso === undefined ? {} : { ruta: { paso, titulo: id } }) },
});

describe('La ruta cuenta sólo lo publicado', () => {
  test('ordena por `paso` y numera por posición', () => {
    const r = rutaPublicada([post('c', 'Guía', 4), post('a', 'Guía', 1), post('x', 'Mercado'), post('b', 'Guía', 2)]);
    assert.deepEqual(r.map((p) => [p.post.id, p.numero, p.total]), [['a', 1, 3], ['b', 2, 3], ['c', 3, 3]]);
  });

  test('un paso que falta no deja hueco: el siguiente ocupa su número', () => {
    // El paso 3 está en borrador y no llega a esta función.
    const r = rutaPublicada([post('a', 'Guía', 1), post('b', 'Guía', 2), post('d', 'Guía', 4)]);
    assert.deepEqual(r.map((p) => p.numero), [1, 2, 3]);
    assert.equal(r.at(-1)?.post.id, 'd');
  });

  test('con menos de dos pasos no hay ruta', () => {
    assert.deepEqual(rutaPublicada([post('a', 'Guía', 2), post('x', 'Mercado')]), []);
    assert.deepEqual(rutaPublicada([]), []);
  });
});

describe('Minutos de lectura', () => {
  test('200 palabras por minuto, hacia arriba, nunca cero', () => {
    assert.equal(minutosDeLectura({ body: 'palabra '.repeat(200) }), 1);
    assert.equal(minutosDeLectura({ body: 'palabra '.repeat(201) }), 2);
    assert.equal(minutosDeLectura({ body: '' }), 1);
  });

  test('no cuentan los comentarios, el HTML ni los enlaces', () => {
    const registro = `<!-- ${'verificado '.repeat(1000)} -->`;
    const figura = '<figure class="g"><figcaption>dos palabras</figcaption></figure>';
    const cuerpo = 'palabra '.repeat(150) + registro + figura + '[texto](https://ejemplo.cl/una/ruta/larga)';
    // 150 + «dos palabras» + «texto» = 153: un minuto. Con el registro serían seis.
    assert.equal(minutosDeLectura({ body: cuerpo }), 1);
  });
});

describe('«Sigue leyendo»', () => {
  const lista = [
    post('m1', 'Mercado'),
    post('g1', 'Guía', 1),
    post('m2', 'Mercado'),
    post('g2', 'Guía', 2),
    post('g3', 'Guía'),
  ];

  test('el paso siguiente de la ruta va primero', () => {
    assert.deepEqual(sigueLeyendo(lista[1]!, lista).map((p) => p.id), ['g2', 'g3']);
  });

  test('fuera de la ruta: la misma categoría, en el orden que trae la lista', () => {
    assert.deepEqual(sigueLeyendo(lista[0]!, lista).map((p) => p.id), ['m2', 'g1']);
  });

  test('nunca el propio, y nunca repetido', () => {
    for (const p of lista) {
      const s = sigueLeyendo(p, lista, 4);
      assert.ok(!s.includes(p));
      assert.equal(new Set(s).size, s.length);
    }
  });
});

/*
  ── En el build ─────────────────────────────────────────────────────────────
  Mismo patrón que `zero-js.test.ts`: lee `dist/` si existe y se salta si no.
*/
const DIST = fileURLToPath(new URL('../dist/', import.meta.url));
const hayBuild = existsSync(join(DIST, 'blog', 'index.html'));

describe('Ningún enlace a un artículo que no se construyó', { skip: !hayBuild && 'sin dist/: corre `npm run build` antes' }, () => {
  test('cada /blog/<slug>/ enlazado existe en dist/', () => {
    const html: string[] = [];
    for (const e of readdirSync(DIST, { recursive: true, withFileTypes: true })) {
      if (e.isFile() && e.name.endsWith('.html')) html.push(readFileSync(join(e.parentPath, e.name), 'utf-8'));
    }
    const rotos = new Set<string>();
    for (const h of html) {
      for (const m of h.matchAll(/href="\/blog\/([^/"#]+)\/?(?:#[^"]*)?"/g)) {
        const slug = m[1]!;
        if (!existsSync(join(DIST, 'blog', slug, 'index.html'))) rotos.add(slug);
      }
    }
    assert.deepEqual([...rotos], [], `enlaces a artículos sin página: ${[...rotos].join(', ')}`);
  });
});

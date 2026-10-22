/**
 * Tests de las banderas (Cowork, entrega `wise-`, 2026-10-22).
 *
 * **Una bandera que falta no rompe el build**: el selector del cotizador la
 * clona de una plantilla y, si no está, deja el hueco sin avisar; la tarjeta de
 * destinos caería a la de Estados Unidos. Por eso se comprueba acá, contra el
 * catálogo y no contra una lista escrita aparte: una divisa nueva con un
 * destino nuevo hace fallar este test hasta que alguien le dibuje su bandera.
 *
 * El último bloque lee `dist/`, como `zero-js.test.ts`, y se salta si no hay
 * build: comprueba que cada página que pinta una bandera lleva el sprite.
 */
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { BANDERAS, CODIGOS_BANDERA, banderaDeDestino, banderaDeDivisa } from '../src/lib/banderas.ts';
import { DEFAULT_DESTINO, currencies, destinos } from '../src/lib/pricing/currencies.ts';

describe('banderas', () => {
  test('cada destino del catálogo tiene su bandera', () => {
    for (const { destino } of destinos()) {
      const codigo = banderaDeDestino(destino);
      assert.ok(codigo, `${destino} no tiene bandera en DE_DESTINO`);
      assert.ok(BANDERAS[codigo], `${destino} apunta a «${codigo}», que no está dibujada`);
    }
    assert.ok(banderaDeDestino(DEFAULT_DESTINO), 'el destino por defecto no tiene bandera');
  });

  test('cada divisa tiene la suya, y el peso chileno también', () => {
    for (const codigo of ['CLP', ...currencies.map((c) => c.code)]) {
      const b = banderaDeDivisa(codigo);
      assert.ok(b && BANDERAS[b], `${codigo} no tiene bandera`);
    }
  });

  test('no sobra ninguna: cada dibujo lo usa un destino o una divisa', () => {
    const usadas = new Set([
      ...destinos().map((d) => banderaDeDestino(d.destino)),
      ...['CLP', ...currencies.map((c) => c.code)].map((c) => banderaDeDivisa(c)),
    ]);
    for (const codigo of CODIGOS_BANDERA) assert.ok(usadas.has(codigo), `«${codigo}» no la usa nadie`);
  });

  /* Van en el HTML con `set:html`: nada de eso puede traer código ni pedir
     algo a otro servidor. La CSP lo bloquearía igual; este test lo dice antes. */
  test('cada dibujo es SVG interior, sin script, manejadores ni recursos externos', () => {
    for (const [codigo, svg] of Object.entries(BANDERAS)) {
      assert.ok(svg.trim().startsWith('<'), `«${codigo}» está vacía`);
      assert.doesNotMatch(svg, /<\s*(script|foreignObject|image|use|style)\b/i, `«${codigo}» trae un elemento no permitido`);
      assert.doesNotMatch(svg, /\son[a-z]+\s*=/i, `«${codigo}» trae un manejador de eventos`);
      assert.doesNotMatch(svg, /(href|src)\s*=|url\(/i, `«${codigo}» pide un recurso`);
      assert.doesNotMatch(svg, /<\s*svg\b/i, `«${codigo}» trae su propio <svg>: el contenedor lo pone Bandera.astro`);
    }
  });
});

/* Cada bandera es un `<use>` que apunta al sprite de su página
   (`BanderasSprite.astro`). Sin el sprite sale vacía y nada avisa. */
const dist = fileURLToPath(new URL('../dist/', import.meta.url));
const paginas = (d: string): string[] =>
  readdirSync(d).flatMap((f) => {
    const p = join(d, f);
    return statSync(p).isDirectory() ? paginas(p) : f.endsWith('.html') ? [p] : [];
  });

describe('el sprite de banderas, en el build', { skip: !existsSync(dist) && 'sin dist/: corre `npm run build` antes' }, () => {
  test('cada #bandera-xx usado está definido en su página, y el sprite va una sola vez', () => {
    let conBanderas = 0;
    for (const archivo of paginas(dist)) {
      const html = readFileSync(archivo, 'utf8');
      const usados = new Set([...html.matchAll(/href="#bandera-(\w+)"/g)].map((m) => m[1]));
      const sprites = (html.match(/class="banderas-sprite/g) ?? []).length;
      if (!usados.size) {
        assert.equal(sprites, 0, `${archivo} lleva el sprite sin usar ninguna bandera`);
        continue;
      }
      conBanderas++;
      assert.equal(sprites, 1, `${archivo} usa banderas y lleva ${sprites} sprites`);
      for (const c of usados) assert.match(html, new RegExp(`id="bandera-${c}"`), `${archivo} usa #bandera-${c} y no lo define`);
    }
    assert.ok(conBanderas >= 1, 'ninguna página pinta banderas: ¿se fue la Home?');
  });
});

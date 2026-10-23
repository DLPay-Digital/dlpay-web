/**
 * Tests de la 404 (Cowork, entrega `vida5-`, 2026-10-23; ADR-0018, tanda 4).
 *
 * Lee `dist/`, como `zero-js.test.ts`, y se salta si no hay build.
 *
 * **Lo que protege:** las tres salidas de la 404 —«Para conocer DLPay»— son
 * entradas del menú «Información», con sus mismos rótulos y descripciones.
 * Las dos salen de `lib/navegacion.ts`, así que hoy no pueden separarse; esto
 * comprueba el resultado, por si un día alguien escribe una a mano. Y cada una
 * lleva a una página que existe: una 404 que enlaza a otra 404 sería el peor
 * sitio para un enlace roto.
 */
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const dist = fileURLToPath(new URL('../dist/', import.meta.url));

describe('la 404', { skip: !existsSync(dist) && 'sin dist/: corre `npm run build` antes' }, () => {
  const html = existsSync(dist) ? readFileSync(join(dist, '404.html'), 'utf8') : '';

  test('las tres salidas son entradas del menú, con su rótulo y su descripción, y llevan a una página que existe', () => {
    const nav = html.match(/<nav class="salidas[\s\S]*?<\/nav>/)?.[0];
    assert.ok(nav, 'la 404 no tiene sus salidas');
    const salidas = [...nav.matchAll(/<a href="([^"]+)"[\s\S]*?class="s-t(?: [^"]*)?">([^<]+)<[\s\S]*?class="s-d(?: [^"]*)?">([^<]+)</g)].map((m) => [m[1], m[2], m[3]]);
    assert.equal(salidas.length, 3, `la 404 tiene ${salidas.length} salidas y no tres`);
    const menu = [...html.matchAll(/<a href="([^"]+)"[^>]*>\s*<span class="d-title(?: [^"]*)?">([^<]+)<\/span>\s*<span class="d-detail(?: [^"]*)?">([^<]+)</g)].map((m) => [m[1], m[2], m[3]]);
    assert.ok(menu.length > 0, 'no encontré el menú «Información» en la 404');
    for (const salida of salidas) {
      assert.ok(menu.some((e) => e.join('|') === salida.join('|')), `«${salida[1]}» no dice lo mismo que en el menú`);
      const destino = join(dist, (salida[0] ?? '').replace(/^\//, ''), 'index.html');
      assert.ok(existsSync(destino), `«${salida[1]}» lleva a ${salida[0]}, que no se construyó`);
    }
  });
});

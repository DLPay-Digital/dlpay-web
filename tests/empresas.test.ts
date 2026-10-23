/**
 * Tests de `/empresas` de noche y de su llamado que te sigue (Cowork, entrega
 * `vida4-`, 2026-10-23; ADR-0018, tanda 4).
 *
 * Lee `dist/`, como `zero-js.test.ts`, y se salta si no hay build.
 *
 * **Lo que protege:**
 *
 * · **El llamado y el cierre abren el mismo mensaje.** La barra se va cuando
 *   llega la banda de contacto precisamente porque tiene el mismo botón: si un
 *   día los dos mensajes se separan, la barra estaría escondiendo una opción
 *   distinta, y nadie lo notaría mirando la página.
 * · **La banda de contacto es la única clara**, y es la última. Una sección
 *   nueva que entre sin `noche` quedaría clara en medio de la página —una
 *   franja de día suelta— sin que nada fallara.
 */
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const dist = fileURLToPath(new URL('../dist/', import.meta.url));
const leer = (archivo: string) => readFileSync(join(dist, archivo), 'utf8');

describe('/empresas, de noche', { skip: !existsSync(dist) && 'sin dist/: corre `npm run build` antes' }, () => {
  const html = existsSync(dist) ? leer('empresas/index.html') : '';
  const main = html.match(/<main[\s\S]*?<\/main>/)?.[0] ?? '';

  test('el llamado que te sigue abre el mismo mensaje que el botón del cierre', () => {
    const contacto = main.match(/<section class="contact[\s\S]*?<\/section>/)?.[0];
    assert.ok(contacto, '/empresas no tiene la banda de contacto');
    const cierre = contacto.match(/<a class="cta[^"]*" href="([^"]+)"/)?.[1];
    const sigue = main.match(/<a class="sigue-cta[^"]*" href="([^"]+)"/)?.[1];
    assert.ok(cierre, 'la banda de contacto no tiene su botón');
    assert.ok(sigue, 'no está el llamado que te sigue');
    assert.equal(sigue, cierre);
  });

  test('todas las secciones de contenido van de noche, salvo la de contacto, que es la última', () => {
    const secciones = [...main.matchAll(/<section class="([^"]+)"/g)].map((m) => (m[1] ?? '').split(/\s+/));
    const contenido = secciones.filter((c) => !c.includes('page-hero'));
    assert.ok(contenido.length > 1, 'no encontré las secciones de /empresas');
    const ultima = contenido.at(-1) ?? [];
    assert.ok(ultima.includes('contact'), 'la banda de contacto no es la última');
    assert.ok(!ultima.includes('noche'), 'la banda de contacto no debería ir de noche');
    const dia = contenido.slice(0, -1).filter((c) => !c.includes('noche')).map((c) => c[0]);
    assert.deepEqual(dia, [], `secciones de día en medio de la noche: ${dia.join(', ')}`);
  });
});

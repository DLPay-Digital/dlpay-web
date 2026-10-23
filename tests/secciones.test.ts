/**
 * Tests de `src/lib/secciones.ts`: las secciones de un documento legal, sacadas
 * de su propio HTML (Cowork, entrega `vida5-`, 2026-10-23; ADR-0018, tanda 4).
 *
 * **Lo que protege:** el riel de las legales empareja cada entrada con su H2
 * por posición, como el del artículo. Si la lista contara un H2 que no es
 * hermano de los demás —el del aviso de `PendingNotice`, que va dentro de un
 * `<div>`—, el riel marcaría la sección equivocada. Y un `id` repetido haría
 * que dos entradas llevaran al mismo sitio.
 */
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import { aSlug, seccionesDelDocumento } from '../src/lib/secciones.ts';

describe('las secciones de un documento', () => {
  test('el id sale del texto: sin tildes, sin signos y en minúsculas', () => {
    assert.equal(aSlug('Qué ocurre después'), 'que-ocurre-despues');
    assert.equal(aSlug('¿Para qué es este canal?'), 'para-que-es-este-canal');
    assert.equal(aSlug('Datos &amp; cookies'), 'datos-cookies');
    assert.equal(aSlug('¿?'), 'seccion');
  });

  test('cuenta sólo los H2 de primer nivel y deja los anidados como estaban', () => {
    const { html, secciones } = seccionesDelDocumento(
      '<div class="pending" role="note"><h2>Documento en actualización</h2><p>…</p></div>' +
        '<h2>Lo que sí puedes dar por cierto hoy</h2><p>a</p><h2>Advertencia de riesgo</h2><p>b</p>',
    );
    assert.deepEqual(
      secciones.map((s) => s.id),
      ['lo-que-si-puedes-dar-por-cierto-hoy', 'advertencia-de-riesgo'],
    );
    assert.match(html, /<div class="pending" role="note"><h2>Documento en actualización<\/h2>/);
    assert.match(html, /<h2 id="lo-que-si-puedes-dar-por-cierto-hoy">/);
  });

  test('respeta un id que ya venía y no repite ninguno', () => {
    const { html, secciones } = seccionesDelDocumento(
      '<h2 id="propio">Uno</h2><h2>Dos</h2><h2>Dos</h2><h2 class="x">Tres <strong>y</strong> más</h2>',
    );
    assert.deepEqual(secciones.map((s) => s.id), ['propio', 'dos', 'dos-2', 'tres-y-mas']);
    assert.deepEqual(secciones.map((s) => s.html), ['Uno', 'Dos', 'Dos', 'Tres y más']);
    assert.match(html, /<h2 class="x" id="tres-y-mas">Tres <strong>y<\/strong> más<\/h2>/);
    assert.equal((html.match(/id="propio"/g) ?? []).length, 1);
  });

  test('las etiquetas vacías no hunden la cuenta', () => {
    const { secciones } = seccionesDelDocumento('<p>a<br>b</p><img src="x.png"><h2>Después</h2>');
    assert.deepEqual(secciones.map((s) => s.id), ['despues']);
  });
});

/**
 * Cinco páginas no ejecutan un solo byte, y este test existe para que sigan así.
 *
 * `/tarifas`, `/terminos`, `/privacidad`, `/canal-de-denuncias` y la 404 están
 * en **0 bytes ejecutables** desde que se construyeron, y
 * `docs/arquitectura-produccion.md` §1.1 lo declara. Hasta hoy esa propiedad
 * dependía de que nadie importara un componente con script sin darse cuenta.
 *
 * ── Por qué se escribe ahora ───────────────────────────────────────────────
 *
 * La intro de marca (ADR-0010) necesita un **marcador de visita** en el `<head>`,
 * y la pregunta de dónde ponerlo tenía tres respuestas. Sebastián eligió la
 * **opción C**: en las páginas que ya ejecutan JavaScript y en ninguna más,
 * porque poner a ejecutar a estas cinco es exactamente lo que **D28** se negó a
 * pagar para darle botón de cerrar a la franja de notificación.
 *
 * Esa decisión se implementa con una prop —`zeroJs` en `Base.astro`— y una prop
 * se olvida. El test la convierte en una propiedad del build: si una de las
 * cinco empieza a ejecutar algo, esto falla y dice cuál.
 *
 * ── Qué cuenta como «ejecutable» ───────────────────────────────────────────
 *
 * Todo `<script>` salvo los de tipo de datos. `application/ld+json` **no se
 * ejecuta**: el navegador lo trata como texto, y las cinco páginas lo llevan
 * desde que existen porque es el bloque de datos estructurados de `Base.astro`.
 *
 * ── Necesita un build ──────────────────────────────────────────────────────
 *
 * Lee `dist/`. Si no está, el test se salta con un aviso en vez de fallar: un
 * test que exige un build para poder correr convierte `npm test` en algo que
 * sólo funciona a veces. Para correrlo de verdad:
 *
 *     PUBLIC_SITE_URL=https://dlpay.cl npm run build && npm test
 */
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const dist = fileURLToPath(new URL('../dist/', import.meta.url));

/** Las cinco, con la ruta de su archivo en el build. */
const SIN_JAVASCRIPT = [
  ['/tarifas/', 'tarifas/index.html'],
  ['/terminos/', 'terminos/index.html'],
  ['/privacidad/', 'privacidad/index.html'],
  ['/canal-de-denuncias/', 'canal-de-denuncias/index.html'],
  ['404', '404.html'],
] as const;

/** Páginas que sí ejecutan y por tanto deben llevar el marcador de visita. */
const CON_MARCADOR = [
  ['/', 'index.html'],
  ['/como-funciona/', 'como-funciona/index.html'],
  ['/confianza/', 'confianza/index.html'],
  ['/empresas/', 'empresas/index.html'],
  ['/precio/', 'precio/index.html'],
  ['/preguntas/', 'preguntas/index.html'],
  ['/blog/', 'blog/index.html'],
] as const;

/**
 * Los `<script>` de una página que el navegador llegaría a ejecutar. Se queda
 * con la etiqueta de apertura, que es donde vive el `type`.
 */
function scriptsEjecutables(html: string): string[] {
  const etiquetas = html.match(/<script\b[^>]*>/gi) ?? [];
  return etiquetas.filter((etiqueta) => {
    const tipo = etiqueta.match(/type\s*=\s*["']([^"']+)["']/i)?.[1]?.toLowerCase();
    if (tipo === undefined) return true; // sin type = JavaScript clásico
    return tipo === 'module' || tipo === 'text/javascript' || tipo === 'application/javascript';
  });
}

const hayBuild = existsSync(dist);
const leer = (archivo: string) => readFileSync(join(dist, archivo), 'utf8');

describe('Cinco páginas en cero bytes ejecutables (ADR-0010, opción C)', { skip: !hayBuild && 'sin dist/: corre `npm run build` antes' }, () => {
  for (const [ruta, archivo] of SIN_JAVASCRIPT) {
    test(`${ruta} no ejecuta nada`, () => {
      const html = leer(archivo);
      assert.deepEqual(
        scriptsEjecutables(html),
        [],
        `${ruta} empezó a ejecutar JavaScript. Si es a propósito, la decisión que hay que revisar es ADR-0010 y D28, no este test.`,
      );
    });

    test(`${ruta} no recibe el marcador de visita`, () => {
      assert.equal(
        leer(archivo).includes('dlpay-visita'),
        false,
        `${ruta} recibió el marcador: le falta \`zeroJs\` al layout.`,
      );
    });
  }
});

describe('El marcador de visita llega donde tiene que llegar', { skip: !hayBuild && 'sin dist/: corre `npm run build` antes' }, () => {
  for (const [ruta, archivo] of CON_MARCADOR) {
    test(`${ruta} lleva el marcador`, () => {
      assert.equal(leer(archivo).includes('dlpay-visita'), true, `${ruta} se quedó sin marcador.`);
    });
  }

  /**
   * El orden es la condición silenciosa de ADR-0010: si el marcador quedara
   * después de la intro, `window.__dlpayInicio` valdría `undefined` allí y la
   * intro **no se vería nunca**, sin un solo error en consola.
   */
  test('en la Home el marcador va antes que la intro', () => {
    const html = leer('index.html');
    const marcador = html.indexOf('dlpay-visita');
    const intro = html.indexOf('intro-va');
    assert.notEqual(marcador, -1, 'la Home se quedó sin marcador');
    assert.notEqual(intro, -1, 'la Home se quedó sin intro');
    assert.ok(marcador < intro, 'el marcador quedó DESPUÉS de la intro: la intro no se vería nunca');
  });

  test('la intro se monta sólo en la Home', () => {
    for (const [ruta, archivo] of [...CON_MARCADOR, ...SIN_JAVASCRIPT]) {
      if (ruta === '/') continue;
      assert.equal(leer(archivo).includes('intro-va'), false, `${ruta} montó la intro y no debería`);
    }
  });
});

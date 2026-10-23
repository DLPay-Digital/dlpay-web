/**
 * El contrato del movimiento ligado al desplazamiento, sobre el CSS del build
 * (Cowork, entrega `vida1-`, 2026-10-23).
 *
 * Lee `dist/`, como `zero-js.test.ts`, y se salta si no hay build.
 *
 * **Lo que protege:** la familia C del Motion System (§0 bis) tiene una regla
 * que no se ve en ninguna captura: *el reposo se lee completo*. Sin soporte del
 * navegador o con movimiento reducido, una pieza ligada al desplazamiento está
 * quieta y entera. Eso sólo es cierto si **toda** declaración de
 * `animation-timeline` vive dentro de las dos guardas a la vez:
 * `@supports (animation-timeline: …)` y
 * `@media (prefers-reduced-motion: no-preference)`. Una que se escape de la
 * segunda mueve la página a quien pidió que no se moviera; una que se escape de
 * la primera deja un `from { opacity: 0 }` aplicado en un navegador que no sabe
 * avanzarlo, y la pieza se queda vacía.
 *
 * Con ADR-0018 pasaron a ser veinte piezas en ocho componentes y páginas, y
 * escribir una regla fuera de su bloque es cuestión de un `}` de más. Esto lo
 * convierte en una propiedad del build.
 *
 * **Y la Home no se mueve por herencia**: `FiguraMecanismo` comparte el CSS
 * con `/confianza` y `/tarifas`, pero su forma `compacta` —la de la Home— no
 * lleva línea de tiempo. El segundo test lo vigila.
 */
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const dist = fileURLToPath(new URL('../dist/', import.meta.url));
const astro = join(dist, '_astro');

/** Las hojas del build, con su nombre. */
const hojas = (): [string, string][] =>
  existsSync(astro)
    ? readdirSync(astro).filter((f) => f.endsWith('.css')).map((f) => [f, readFileSync(join(astro, f), 'utf8')])
    : [];

/**
 * Cada declaración de una propiedad, con la pila de bloques que la contienen:
 * los preludios de `@media`/`@supports` y el selector de la regla. El CSS del
 * build va minificado y sin comentarios, así que basta con contar llaves.
 */
function declaraciones(css: string, propiedad: string): { pila: string[]; selector: string }[] {
  const out: { pila: string[]; selector: string }[] = [];
  const pila: string[] = [];
  let i = 0;
  let inicio = 0;
  while (i < css.length) {
    const c = css[i];
    if (c === '"' || c === "'") {
      const fin = css.indexOf(c, i + 1);
      i = fin < 0 ? css.length : fin + 1;
      continue;
    }
    if (c === '{') {
      pila.push(css.slice(inicio, i).trim());
      inicio = i + 1;
    } else if (c === '}') {
      pila.pop();
      inicio = i + 1;
    } else if (c === ';') {
      inicio = i + 1;
    } else if (css.startsWith(propiedad, i) && (i === inicio || /[\s;{]/.test(css[i - 1] ?? ''))) {
      const ancestros = pila.slice(0, -1);
      out.push({ pila: ancestros, selector: pila[pila.length - 1] ?? '' });
    }
    i++;
  }
  return out;
}

const dentroDe = (pila: string[], re: RegExp) => pila.some((p) => re.test(p.replace(/\s+/g, '')));

describe('el movimiento ligado al desplazamiento', { skip: !existsSync(astro) && 'sin dist/: corre `npm run build` antes' }, () => {
  test('toda `animation-timeline` está dentro de @supports y de prefers-reduced-motion: no-preference', () => {
    const fuera: string[] = [];
    let total = 0;
    for (const [nombre, css] of hojas()) {
      for (const d of declaraciones(css, 'animation-timeline:')) {
        total++;
        const soporta = dentroDe(d.pila, /^@supports.*animation-timeline/);
        const reducido = dentroDe(d.pila, /^@media.*prefers-reduced-motion:no-preference/);
        if (!soporta || !reducido) fuera.push(`${nombre}: ${d.selector.slice(0, 80)} (${!soporta ? 'sin @supports' : ''}${!soporta && !reducido ? ', ' : ''}${!reducido ? 'sin no-preference' : ''})`);
      }
    }
    assert.ok(total > 0, 'el build no declara ninguna línea de tiempo: ¿se fue el CSS?');
    assert.deepEqual(fuera, [], 'líneas de tiempo fuera de sus guardas');
  });

  test('la forma `compacta` de FiguraMecanismo, la de la Home, no declara línea de tiempo', () => {
    const conTiempo: string[] = [];
    for (const [nombre, css] of hojas()) {
      for (const prop of ['view-timeline:', 'view-timeline-name:', 'animation-timeline:']) {
        for (const d of declaraciones(css, prop)) {
          const sel = d.selector;
          if (/\.fm[-\w]*/.test(sel) && !/:not\(\.fm-compacta\)/.test(sel)) conTiempo.push(`${nombre}: ${sel.slice(0, 80)}`);
        }
      }
    }
    assert.deepEqual(conTiempo, [], 'una regla de FiguraMecanismo con línea de tiempo que también alcanza a `compacta`');
  });
});

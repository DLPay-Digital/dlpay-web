/**
 * El cotizador compacto (Sebastián, 2026-10-28; Cowork, entrega `compacto-`).
 *
 * Sebastián pidió un cotizador «elegante y sin tanta palabrería», y dos cosas
 * concretas: que el desglose se abra desde «Ver detalle», y que no haya botones
 * «Enviar / Pasar a pesos», sino que la dirección se decida desde las divisas.
 * Lo que se comprueba acá, sobre el build:
 *
 * - que el interruptor y «¿A dónde envías?» no vuelvan;
 * - que cada ficha de moneda sea un selector, con todas las opciones de su
 *   lado y, tras ellas, la del otro lado (pesos arriba, Chile abajo);
 * - que el total que cobramos esté a la vista y cuadre con el desglose;
 * - que lo que la spec exige siga ahí: «Precio referencial» con esas dos
 *   palabras (§48), «Sin comisiones ocultas.» fuera del detalle y la nota del
 *   riel (§42).
 */
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

import { availableCurrencies, destinos, DEFAULT_DESTINO } from '../src/lib/pricing/currencies.ts';
import { parseAmount } from '../src/lib/pricing/format.ts';

const dist = fileURLToPath(new URL('../dist/', import.meta.url));

describe('el cotizador compacto', { skip: !existsSync(join(dist, 'index.html')) && 'sin dist/: corre `npm run build` antes' }, () => {
  const home = existsSync(join(dist, 'index.html')) ? readFileSync(join(dist, 'index.html'), 'utf8') : '';
  /** La tarjeta, sin comentarios: de `<section … id="cotizador"` a su cierre. */
  const tarjeta = (() => {
    const i = home.indexOf('id="cotizador"');
    const j = home.indexOf('</section>', i);
    return i < 0 || j < 0 ? '' : home.slice(i, j).replace(/<!--[\s\S]*?-->/g, '');
  })();
  const lista = (id: string): string => {
    const i = tarjeta.indexOf(`id="${id}"`);
    return i < 0 ? '' : tarjeta.slice(i, tarjeta.indexOf('</ul>', i));
  };
  const opciones = (id: string): string[] => [...lista(id).matchAll(/data-c="([A-Z]{3})"/g)].map((m) => m[1]!);

  test('no vuelven el interruptor ni «¿A dónde envías?»', () => {
    assert.ok(tarjeta.length > 0, 'no se encontró la tarjeta del cotizador');
    assert.doesNotMatch(tarjeta, /name="intent"/);
    assert.ok(!tarjeta.includes('¿A dónde envías?'));
    assert.ok(!tarjeta.includes('Pasar a pesos'));
  });

  test('cada ficha de moneda es un selector', () => {
    const fichas = tarjeta.match(/<button[^>]*class="moneda[^"]*"[^>]*aria-haspopup="listbox"/g) ?? [];
    assert.equal(fichas.length, 2);
  });

  test('arriba: el peso y, tras un filete, todas las divisas', () => {
    const arriba = opciones('give-lista');
    assert.equal(arriba[0], 'CLP');
    assert.deepEqual(arriba.slice(1), availableCurrencies().map((d) => d.code));
  });

  test('abajo: todos los destinos y, tras un filete, Chile en pesos', () => {
    const abajo = opciones('get-lista');
    assert.equal(abajo.length, destinos().length + 1);
    assert.equal(abajo.at(-1), 'CLP');
    assert.ok(lista('get-lista').includes('Chile, en pesos'));
  });

  /* Las cifras se leen del build y no se recalculan: con las tasas del entorno
     cambian, y lo que tiene que ser cierto con cualquier tasa es la suma. */
  test('el total que cobramos está a la vista y es la suma del desglose', () => {
    const resumen = tarjeta.match(/<summary[\s\S]*?<\/summary>/)?.[0] ?? '';
    assert.ok(resumen.includes('Cobramos') && resumen.includes('Ver detalle'));
    const cifra = (attr: string, en: string): number =>
      parseAmount(en.match(new RegExp(`${attr}[^>]*>([^<]*)<`))?.[1]?.replace(/[^\d.,]/g, '') ?? '');
    const detalle = tarjeta.slice(tarjeta.indexOf('</summary>'), tarjeta.indexOf('</details>'));
    for (const fila of ['Costo de envío', 'Comisión de cambio', 'Monto a convertir']) assert.ok(detalle.includes(fila), fila);
    const total = cifra('data-c-total', resumen);
    assert.ok(total > 0);
    assert.equal(total, cifra('data-c-envio', detalle) + cifra('data-c-comision', detalle));
  });

  test('lo que la spec exige sigue a la vista', () => {
    assert.ok(tarjeta.includes('Precio referencial'), 'spec §48');
    const fuera = tarjeta.slice(tarjeta.indexOf('</details>'));
    assert.ok(fuera.includes('Sin comisiones ocultas.'), 'fuera del detalle');
    assert.match(tarjeta, new RegExp(`data-rail[^>]*>[\\s\\S]*?a ${DEFAULT_DESTINO}, en`), 'la nota del riel nombra el destino (§42)');
  });

  test('el botón que da vuelta la operación dice lo que hace, y no «invertir»', () => {
    const boton = tarjeta.match(/<button[^>]*data-vuelta[^>]*>/)?.[0] ?? '';
    assert.match(boton, /aria-label="Cambiar a pasar [^"]+ a pesos"/);
    assert.doesNotMatch(boton, /[Ii]nvert/);
  });
});

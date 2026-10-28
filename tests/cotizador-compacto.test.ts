/**
 * El cotizador compacto (Sebastián, 2026-10-28; Cowork, entregas `compacto-` y
 * `compacto2-`).
 *
 * Sebastián pidió un cotizador «elegante y sin tanta palabrería», sin botones
 * «Enviar / Pasar a pesos» —la dirección se decide desde las divisas— y con el
 * detalle completo en una pestaña que abre «Ver detalle», como la de Global66,
 * con «Costos operacionales: CLP 0». Lo que se comprueba acá, sobre el build:
 *
 * - que el interruptor y «¿A dónde envías?» no vuelvan;
 * - que cada ficha de moneda sea un selector, con todas las opciones de su
 *   lado y, tras ellas, la del otro lado (pesos arriba, Chile abajo);
 * - que la tarjeta no diga lo que cobramos y el detalle sí, y que cuadre;
 * - que lo que la spec exige siga en la tarjeta: «Precio referencial» con esas
 *   dos palabras (§48), «Sin comisiones ocultas.» y la nota del riel (§42).
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
  /** El diálogo del detalle, y la tarjeta sin él. */
  const detalle = (() => {
    const i = tarjeta.indexOf('<dialog');
    return i < 0 ? '' : tarjeta.slice(i, tarjeta.indexOf('</dialog>', i));
  })();
  const sinDetalle = detalle ? tarjeta.replace(detalle, '') : tarjeta;

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

  test('«Ver detalle» abre el detalle completo, en un diálogo', () => {
    const boton = sinDetalle.match(/<button[^>]*data-abrir-detalle[^>]*>/)?.[0] ?? '';
    assert.match(boton, /aria-haspopup="dialog"/);
    assert.match(boton, /aria-controls="cot-detalle"/);
    assert.match(detalle, /^<dialog[^>]*id="cot-detalle"[^>]*aria-labelledby="detalle-titulo"/);
    assert.ok(detalle.includes('Detalle completo'));
  });

  test('la tarjeta no dice lo que cobramos: lo dice el detalle', () => {
    assert.ok(!/Cobramos|Lo que cobramos|data-c-total/.test(sinDetalle));
    assert.ok(detalle.includes('Lo que cobramos'));
  });

  /* Las cifras se leen del build y no se recalculan: con las tasas del entorno
     cambian, y lo que tiene que ser cierto con cualquier tasa es la suma. */
  test('el detalle, en el orden de Global66, y lo cobrado es la suma de sus partes', () => {
    const filas = ['Envías', 'Lo que cobramos', 'Costo de envío', 'Comisión de cambio', 'Costos operacionales', 'Monto a convertir', 'Precio referencial', 'Llega aprox.'];
    const pos = filas.map((f) => detalle.indexOf(f));
    assert.ok(pos.every((p) => p >= 0), `faltan filas: ${filas.filter((_, i) => pos[i]! < 0).join(', ')}`);
    assert.deepEqual([...pos].sort((a, b) => a - b), pos, 'el orden');
    const cifra = (attr: string): number =>
      // El atributo entero: `data-c-sub` no debe tomar `data-c-sub-rot`.
      parseAmount(detalle.match(new RegExp(`${attr}(?:[\\s=][^>]*)?>([^<]*)<`))?.[1]?.replace(/[^\d.,]/g, '') ?? '');
    const total = cifra('data-c-total');
    assert.ok(total > 0);
    assert.equal(total, cifra('data-c-envio') + cifra('data-c-comision'));
    assert.equal(cifra('data-c-sub') + total, cifra('data-f-give'));
  });

  test('los costos operacionales son cero, y se dice', () => {
    assert.match(detalle, /Costos operacionales<\/dt><dd[^>]*>CLP 0<\/dd>/);
  });

  test('lo que la spec exige sigue en la tarjeta', () => {
    assert.ok(sinDetalle.includes('Precio referencial'), 'spec §48');
    assert.ok(sinDetalle.includes('Sin comisiones ocultas.'));
    assert.match(sinDetalle, new RegExp(`data-rail[^>]*>[\\s\\S]*?a ${DEFAULT_DESTINO}, en`), 'la nota del riel nombra el destino (§42)');
  });

  test('el botón que da vuelta la operación dice lo que hace, y no «invertir»', () => {
    const boton = tarjeta.match(/<button[^>]*data-vuelta[^>]*>/)?.[0] ?? '';
    assert.match(boton, /aria-label="Cambiar a pasar [^"]+ a pesos"/);
    assert.doesNotMatch(boton, /[Ii]nvert/);
  });
});

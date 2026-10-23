/**
 * Tests del teléfono de «Así se ve tu operación» (Cowork, entrega `telefono-`,
 * 2026-10-23).
 *
 * Lee `dist/`, como `zero-js.test.ts`, y se salta si no hay build.
 *
 * **Lo que protege:** el paso 1 dice que la operación «llega escrita
 * automáticamente desde nuestro cotizador», así que la primera burbuja tiene que
 * ser el texto que escribe el botón, letra por letra. Hasta el 2026-10-23 no lo
 * era —«necesito convertir» contra «quiero enviar … a Estados Unidos»— y nada
 * avisó. Y la conversación sólo crece si cada paso tiene sus mensajes: un
 * `data-paso` sin línea de tiempo, o una línea de tiempo sin mensajes, deja la
 * sección quieta sin que el build se queje.
 */
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const dist = fileURLToPath(new URL('../dist/', import.meta.url));
const leer = (archivo: string) => readFileSync(join(dist, archivo), 'utf8');

const texto = (html: string) =>
  html
    .replace(/<[^>]+>/g, '')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();

/** El texto que el cotizador de la Home deja escrito en su enlace a WhatsApp. */
function mensajeDelBoton(home: string): string {
  const m = home.match(/href="https:\/\/wa\.me\/\d+\?text=([^"]+)"/);
  assert.ok(m, 'la Home no tiene un enlace a WhatsApp con texto');
  return decodeURIComponent((m[1] ?? '').replace(/&amp;/g, '&'));
}

/** Las burbujas de una sección, en orden. */
function burbujas(seccion: string): string[] {
  return [...seccion.matchAll(/<p class="bubble[^"]*">([\s\S]*?)<\/p>/g)].map((m) => texto(m[1] ?? ''));
}

describe('el teléfono de «Así se ve tu operación»', { skip: !existsSync(dist) && 'sin dist/: corre `npm run build` antes' }, () => {
  test('la primera burbuja es el mensaje del botón del cotizador, letra por letra', () => {
    const home = leer('index.html');
    const proceso = home.match(/<section class="process[\s\S]*?<\/section>/)?.[0];
    assert.ok(proceso, 'no está la sección del proceso');
    assert.equal(burbujas(proceso)[0], mensajeDelBoton(home));
  });

  test('en /como-funciona también', () => {
    const home = leer('index.html');
    const cf = leer('como-funciona/index.html');
    assert.equal(burbujas(cf)[0], mensajeDelBoton(home));
  });

  test('un solo teléfono, y cada uno de los cuatro pasos con sus mensajes', () => {
    const proceso = leer('index.html').match(/<section class="process[\s\S]*?<\/section>/)?.[0] ?? '';
    assert.equal((proceso.match(/class="device/g) ?? []).length, 1, 'tiene que haber un solo teléfono');
    assert.equal((proceso.match(/<li class="paso/g) ?? []).length, 4, 'tienen que ser cuatro pasos');
    const pasos = [...proceso.matchAll(/data-paso="(\d)"/g)].map((m) => Number(m[1]));
    for (const p of [1, 2, 3, 4]) assert.ok(pasos.includes(p), `el paso ${p} no tiene mensajes`);
    assert.ok(pasos.every((p) => p >= 1 && p <= 4), 'hay un mensaje de un paso que no existe');
  });
});

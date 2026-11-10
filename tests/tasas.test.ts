/**
 * Las tasas de referencia que se actualizan solas (ADR-0019, 2026-11-10).
 *
 * Tres piezas que tienen que seguir de acuerdo: el script que trae las tasas
 * (`scripts/actualizar-tasas.mjs`), el archivo que escribe
 * (`src/lib/pricing/tasas.json`) y el catálogo que lo lee (`currencies.ts`).
 * Si una divisa entra o sale del catálogo y nadie toca el script, el proceso
 * programado seguiría escribiendo un archivo sin ella, y el build la dejaría
 * sin tasa. Esto falla antes.
 *
 * Y el proceso programado no puede tocar más que ese archivo: hace commit a
 * `main` sin que nadie lo revise.
 */
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { currencies, tasasActualizadas } from '../src/lib/pricing/currencies.ts';

const raiz = fileURLToPath(new URL('..', import.meta.url));
const leer = (ruta: string): string => readFileSync(raiz + ruta, 'utf8');

const json = JSON.parse(leer('src/lib/pricing/tasas.json')) as {
  actualizado: string;
  tasas: Record<string, number>;
};
const script = leer('scripts/actualizar-tasas.mjs');
const workflow = leer('.github/workflows/tasas.yml');

describe('las tasas de referencia', () => {
  test('el archivo trae una tasa positiva por cada divisa del catálogo, y nada más', () => {
    const catalogo = currencies.map((c) => c.code).sort();
    assert.deepEqual(Object.keys(json.tasas).sort(), catalogo);
    for (const [code, tasa] of Object.entries(json.tasas)) {
      assert.ok(Number.isFinite(tasa) && tasa > 0, `${code}: ${tasa}`);
    }
  });

  test('el script pide las mismas divisas que el catálogo', () => {
    const lista = script.match(/const DIVISAS = \[([^\]]*)\]/)?.[1] ?? '';
    const pide = [...lista.matchAll(/'([A-Z]{3})'/g)].map((m) => m[1]).sort();
    assert.deepEqual(pide, currencies.map((c) => c.code).sort());
  });

  test('el catálogo usa las tasas del archivo como muestra', () => {
    for (const c of currencies) assert.equal(c.sample, json.tasas[c.code], c.code);
    assert.equal(tasasActualizadas.toISOString(), new Date(json.actualizado).toISOString());
  });

  test('el proceso corre una vez al día y sólo hace commit del archivo de tasas', () => {
    assert.equal([...workflow.matchAll(/- cron: '/g)].length, 1);
    const adds = [...workflow.matchAll(/git add (.+)/g)].map((m) => m[1]!.trim());
    assert.deepEqual(adds, ['src/lib/pricing/tasas.json']);
    assert.doesNotMatch(workflow, /\$\{\{\s*github\.event\./, 'sin entradas externas en los comandos');
  });
});

/**
 * Tests de la cuenta de «¿Cuánto te están cobrando por el dólar?»
 * (`src/lib/spread.ts`). Cowork, 2026-10-13, entrega `spread-`.
 *
 * La misma función dibuja el ejemplo en el build y recalcula en el navegador:
 * si se equivoca, se equivoca en los dos sitios a la vez, y en una herramienta
 * que la gente usa para decidir dónde cambiar su dinero.
 */
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import { calcularSpread, formatPorcentaje } from '../src/lib/spread.ts';

const cerca = (a: number, b: number, tol = 1e-6) =>
  assert.ok(Math.abs(a - b) <= tol, `${a} no es ${b}`);

describe('El spread', () => {
  test('el ejemplo de la guía: 1.010 sobre 1.000 es un 1 %', () => {
    const r = calcularSpread({ precio: 1010, referencia: 1000 });
    assert.equal(r.valido, true);
    if (!r.valido) return;
    cerca(r.porDolar, 10);
    cerca(r.porcentaje, 1);
    assert.equal(r.conMonto, false);
    assert.equal(r.bajoLaReferencia, false);
  });

  test('con un millón de pesos, la diferencia es 9,90 dólares', () => {
    const r = calcularSpread({ precio: 1010, referencia: 1000, monto: 1_000_000 });
    if (!r.valido || !r.conMonto) return assert.fail('debería ser válido y con monto');
    cerca(r.conMonto.recibes, 990.0990099, 1e-6);
    cerca(r.conMonto.aLaReferencia, 1000);
    cerca(r.conMonto.diferenciaUSD, 9.9009901, 1e-6);
    cerca(r.conMonto.precioEfectivo, 1010);
  });

  test('una comisión aparte sube el precio efectivo, y la diferencia la incluye', () => {
    const r = calcularSpread({ precio: 985, referencia: 978.61, monto: 2_000_000, comision: 5_000 });
    if (!r.valido || !r.conMonto) return assert.fail('debería ser válido y con monto');
    cerca(r.conMonto.recibes, 2_000_000 / 985);
    cerca(r.conMonto.aLaReferencia, 2_005_000 / 978.61);
    cerca(r.conMonto.precioEfectivo, 2_005_000 / (2_000_000 / 985));
    assert.ok(r.conMonto.porcentajeEfectivo > r.porcentaje);
  });

  test('bajo la referencia no es un error: se marca', () => {
    const r = calcularSpread({ precio: 970, referencia: 1000 });
    if (!r.valido) return assert.fail('debería ser válido');
    assert.equal(r.bajoLaReferencia, true);
    cerca(r.porcentaje, -3);
  });

  test('sin los dos precios no hay cuenta', () => {
    for (const e of [
      { precio: 0, referencia: 1000 },
      { precio: 1010, referencia: 0 },
      { precio: Number.NaN, referencia: 1000 },
      { precio: 1010, referencia: Number.POSITIVE_INFINITY },
    ]) {
      assert.deepEqual(calcularSpread(e), { valido: false, motivo: 'faltan-precios' });
    }
  });

  test('un monto o una comisión negativos se ignoran, no restan', () => {
    const a = calcularSpread({ precio: 1010, referencia: 1000, monto: -5 });
    if (!a.valido) return assert.fail('debería ser válido');
    assert.equal(a.conMonto, false);
    const b = calcularSpread({ precio: 1010, referencia: 1000, monto: 1_000_000, comision: -500 });
    if (!b.valido || !b.conMonto) return assert.fail('debería ser válido y con monto');
    cerca(b.conMonto.precioEfectivo, 1010);
  });
});

describe('El porcentaje, escrito', () => {
  test('dos decimales, coma decimal y espacio fino que no corta antes del símbolo', () => {
    assert.equal(formatPorcentaje(1), '1,00 %');
    assert.equal(formatPorcentaje(0.654), '0,65 %');
  });
  test('el signo menos es el tipográfico, y el cero no lleva signo', () => {
    assert.equal(formatPorcentaje(-0.88), '−0,88 %');
    assert.equal(formatPorcentaje(-0.001), '0,00 %');
  });
});

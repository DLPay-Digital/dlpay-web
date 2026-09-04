/**
 * Tests de la actividad reciente.
 *
 * Lo crítico aquí no es el formato: es que sea IMPOSIBLE publicar datos de
 * ejemplo como si fueran operaciones reales, y que un evento no pueda cargar
 * un dato personal.
 */
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import { MockActivitySource } from '../src/lib/activity/mock-activity-source.ts';
import { KIND_LABEL } from '../src/lib/activity/types.ts';
import { relativeTime, formatUsd } from '../src/lib/activity/format.ts';

describe('fuente de ejemplo', () => {
  test('se declara NO real, que es lo que obliga a la UI a marcarla', () => {
    assert.equal(new MockActivitySource().isReal, false);
  });

  test('devuelve la cantidad pedida, ordenada de más reciente a más antigua', () => {
    return new MockActivitySource().list(4).then((events) => {
      assert.equal(events.length, 4);
      for (let i = 1; i < events.length; i++) {
        assert.ok(events[i - 1]!.at.getTime() > events[i]!.at.getTime());
      }
    });
  });

  test('ningún evento lleva datos personales: sólo tipo, monto y momento', () => {
    return new MockActivitySource().list(6).then((events) => {
      const allowed = new Set(['id', 'kind', 'amountUsd', 'at']);
      for (const e of events) {
        assert.deepEqual(new Set(Object.keys(e)), allowed);
        assert.ok(Number.isFinite(e.amountUsd) && e.amountUsd > 0);
        assert.ok(e.kind in KIND_LABEL);
      }
    });
  });

  test('los montos van redondeados: nunca el monto exacto de una operación', () => {
    return new MockActivitySource().list(6).then((events) => {
      for (const e of events) assert.equal(e.amountUsd % 10, 0);
    });
  });

  test('la misma semilla produce la misma lista: el build no parpadea', () => {
    return Promise.all([
      new MockActivitySource(7).list(5),
      new MockActivitySource(7).list(5),
    ]).then(([a, b]) => {
      assert.deepEqual(
        a.map((e) => e.amountUsd),
        b.map((e) => e.amountUsd)
      );
    });
  });
});

describe('emisión en vivo', () => {
  test('next() fecha la operación en el momento en que ocurre', () => {
    const at = new Date('2026-09-04T12:00:00Z');
    const event = new MockActivitySource().next(at);
    assert.equal(event.at.getTime(), at.getTime());
    assert.ok(event.kind in KIND_LABEL);
    assert.equal(event.amountUsd % 10, 0);
  });

  test('cada operación emitida tiene id propio', () => {
    const src = new MockActivitySource();
    const ids = new Set([src.next().id, src.next().id, src.next().id]);
    assert.equal(ids.size, 3);
  });

  test('tampoco al emitir en vivo aparece un dato personal', () => {
    const event = new MockActivitySource().next();
    assert.deepEqual(new Set(Object.keys(event)), new Set(['id', 'kind', 'amountUsd', 'at']));
  });

  test('subscribe devuelve una función para dejar de escuchar, y no emite de inmediato', () => {
    let received = 0;
    const stop = new MockActivitySource().subscribe(() => {
      received += 1;
    });
    assert.equal(typeof stop, 'function');
    assert.equal(received, 0, 'no debe emitir de forma síncrona');
    stop();
  });
});

describe('formato de la actividad', () => {
  const now = new Date('2026-09-04T12:00:00Z');
  const ago = (s: number) => new Date(now.getTime() - s * 1000);

  test('segundos, minutos y horas, en singular y plural', () => {
    assert.equal(relativeTime(ago(14), now), 'Hace 14 segundos');
    assert.equal(relativeTime(ago(1), now), 'Hace 1 segundo');
    assert.equal(relativeTime(ago(120), now), 'Hace 2 minutos');
    assert.equal(relativeTime(ago(60), now), 'Hace 1 minuto');
    assert.equal(relativeTime(ago(7200), now), 'Hace 2 horas');
  });

  test('una fecha futura no produce un tiempo negativo', () => {
    assert.equal(relativeTime(new Date(now.getTime() + 5000), now), 'Hace 0 segundos');
  });

  test('el monto usa el separador chileno y no lleva decimales', () => {
    assert.equal(formatUsd(1240), 'US$ 1.240');
    assert.equal(formatUsd(850), 'US$ 850');
  });
});

/**
 * El tarifario (Sebastián, 2026-10-27; Cowork, entrega `tarifario-`).
 *
 * Lo que se comprueba acá es **que el sitio cobre lo que dice la planilla de
 * Sebastián**, peso por peso. Las cifras esperadas son las de su hoja
 * «Ejemplos» (montos representativos de cada tramo) y su «Simulador», con el
 * dólar del Excel —982— y el euro que el Excel deriva de él (1,08 × 982). Si
 * alguien cambia una comisión o la cuenta, falla acá antes de publicarse.
 *
 * Y tres cosas que no son aritmética pero cuestan lo mismo si fallan:
 * - que cada destino del cotizador tenga su tarifa;
 * - que la tarifa de origen —los montos base en dólares— no llegue al navegador;
 * - que el dólar digital no se ofrezca antes de la firma de Compliance.
 */
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

import { currencies, destinos, DEFAULT_DESTINO } from '../src/lib/pricing/currencies.ts';
import { cargosDe, invertir } from '../src/lib/pricing/quote.ts';
import { formatCLP, formatComision, formatComisionCifra } from '../src/lib/pricing/format.ts';
import {
  TARIFAS,
  TARIFA_A_PESOS,
  TARIFA_DOLAR_DIGITAL_EN_ESPERA,
  TRAMOS_CLP,
  envioClp,
  tarifaDe,
  tramoDe,
  type Tarifa,
  type TarifaCliente,
} from '../src/lib/pricing/tarifario.ts';
import { resolveQuoteLimits } from '../src/lib/config/environment.ts';
import { generalFaq } from '../src/content/general.ts';

/** Las tasas de la hoja «Supuestos» del Excel. */
const DOLAR = 982;
const EURO = 1.08 * DOLAR;

/** La tarifa resuelta como la resuelve el build, con las tasas del Excel. */
function resuelta(t: Pick<Tarifa, 'envioBase' | 'comision'>): TarifaCliente {
  const tasa = t.envioBase.moneda === 'EUR' ? EURO : DOLAR;
  return { envio: envioClp(t.envioBase.monto, tasa), comision: t.comision };
}

/** [destino, envías, costo de envío, comisión, monto a convertir], de la hoja «Ejemplos». */
const EJEMPLOS: readonly [string, number, number, number, number][] = [
  ['Estados Unidos', 250_000, 500, 2_994, 246_506],
  ['Estados Unidos', 1_000_000, 500, 10_495, 989_005],
  ['Estados Unidos', 3_000_000, 500, 28_495, 2_971_005],
  ['Panamá', 250_000, 500, 3_119, 246_381],
  ['Panamá', 1_000_000, 500, 10_995, 988_505],
  ['Panamá', 3_000_000, 500, 31_495, 2_968_005],
  ['China', 250_000, 6_900, 3_282, 239_818],
  ['China', 1_000_000, 6_900, 11_917, 981_183],
  ['China', 3_000_000, 6_900, 34_421, 2_958_679],
  ['Europa', 250_000, 1_100, 2_987, 245_913],
  ['Europa', 1_000_000, 1_100, 10_988, 987_912],
  ['Europa', 3_000_000, 1_100, 31_488, 2_967_412],
  ['Argentina', 250_000, 0, 3_500, 246_500],
  ['Argentina', 1_000_000, 0, 13_000, 987_000],
  ['Argentina', 3_000_000, 0, 37_500, 2_962_500],
  ['México', 250_000, 500, 3_493, 246_007],
  ['México', 1_000_000, 500, 12_994, 986_506],
  ['México', 3_000_000, 500, 37_494, 2_962_006],
  ['Colombia', 250_000, 350, 3_620, 246_030],
  ['Colombia', 1_000_000, 350, 13_495, 986_155],
  ['Colombia', 3_000_000, 350, 38_995, 2_960_655],
  ['Brasil', 250_000, 250, 3_871, 245_879],
  ['Brasil', 1_000_000, 250, 14_996, 984_754],
  ['Brasil', 3_000_000, 250, 43_496, 2_956_254],
  ['Perú', 250_000, 1_000, 4_482, 244_518],
  ['Perú', 1_000_000, 1_000, 16_983, 982_017],
  ['Perú', 3_000_000, 1_000, 49_484, 2_949_516],
  ['Costa Rica', 250_000, 800, 4_236, 244_964],
  ['Costa Rica', 1_000_000, 800, 15_987, 983_213],
  ['Costa Rica', 3_000_000, 800, 46_488, 2_952_712],
  ['Sudáfrica', 250_000, 1_500, 4_970, 243_530],
  ['Sudáfrica', 1_000_000, 1_500, 19_471, 979_029],
  ['Sudáfrica', 3_000_000, 1_500, 56_972, 2_941_528],
];

describe('el tarifario y los destinos', () => {
  test('cada destino del cotizador tiene su tarifa, y cada tarifa un destino', () => {
    const lista = destinos().map((d) => d.destino).sort();
    assert.deepEqual(TARIFAS.map((t) => t.destino).sort(), lista);
    for (const t of TARIFAS) {
      assert.equal(destinos().find((d) => d.destino === t.destino)?.code, t.code, t.destino);
    }
  });

  test('el destino de partida es Estados Unidos, con la tarifa más barata de las dos del Excel', () => {
    const t = tarifaDe(DEFAULT_DESTINO);
    assert.deepEqual(t?.envioBase, { monto: 0.5, moneda: 'USD' });
  });

  /* China paga dólares («USD China») y es la única que no llega en la moneda
     del país: el cotizador, la tarjeta de destinos y la FAQ lo dicen. */
  test('sólo China llega en otra moneda que la suya', () => {
    assert.deepEqual(TARIFAS.filter((t) => !t.enSuMoneda).map((t) => t.destino), ['China']);
    assert.equal(tarifaDe('China')?.code, 'USD');
  });

  test('ninguna comisión es negativa ni pasa del 2 %, y bajan o se mantienen con el monto', () => {
    for (const t of [...TARIFAS, TARIFA_A_PESOS]) {
      const [a, b, c] = t.comision;
      assert.ok(a >= b && b >= c && c > 0 && a <= 200, JSON.stringify(t));
    }
  });
});

describe('los tramos', () => {
  test('un monto en el borde ya es del tramo siguiente, como en el Excel', () => {
    assert.deepEqual(TRAMOS_CLP, [500_000, 2_000_000]);
    assert.equal(tramoDe(499_999), 0);
    assert.equal(tramoDe(500_000), 1);
    assert.equal(tramoDe(1_999_999), 1);
    assert.equal(tramoDe(2_000_000), 2);
  });

  test('el cotizador usa los mismos bordes que el tarifario', () => {
    const t = resuelta(tarifaDe('Estados Unidos')!);
    assert.equal(cargosDe('to_foreign', 499_999, DOLAR, t).cargos.comisionPb, 120);
    assert.equal(cargosDe('to_foreign', 500_000, DOLAR, t).cargos.comisionPb, 105);
    assert.equal(cargosDe('to_foreign', 2_000_000, DOLAR, t).cargos.comisionPb, 95);
  });
});

describe('el costo de envío', () => {
  test('se redondea hacia arriba al múltiplo de $50', () => {
    assert.equal(envioClp(0.5, DOLAR), 500);
    assert.equal(envioClp(7, DOLAR), 6_900);
    assert.equal(envioClp(1, EURO), 1_100);
    assert.equal(envioClp(0.25, DOLAR), 250);
  });

  /* 0,35 × 1.000 da 350,00000000000006 en coma flotante: sin margen, subiría a 400. */
  test('un producto exacto no sube un escalón por la coma flotante', () => {
    assert.equal(envioClp(0.35, 1000), 350);
    assert.equal(envioClp(0.5, 1000), 500);
  });

  test('sin monto o sin tasa no hay costo de envío', () => {
    assert.equal(envioClp(0, DOLAR), 0);
    assert.equal(envioClp(1, 0), 0);
  });
});

describe('la cuenta, contra la planilla de Sebastián', () => {
  for (const [destino, envias, envio, comision, aConvertir] of EJEMPLOS) {
    test(`${destino}, ${formatCLP(envias)}`, () => {
      const t = resuelta(tarifaDe(destino)!);
      const { cargos } = cargosDe('to_foreign', envias, DOLAR, t);
      assert.equal(cargos.envio, envio, 'costo de envío');
      assert.equal(cargos.comision, comision, 'comisión');
      assert.equal(cargos.aConvertir, aConvertir, 'monto a convertir');
    });
  }

  test('el Simulador: Colombia, 1.000.000, a 3,0264 pesos colombianos por peso', () => {
    const t = resuelta(tarifaDe('Colombia')!);
    const { cargos, llega } = cargosDe('to_foreign', 1_000_000, 1 / 3.0264, t);
    assert.deepEqual([cargos.envio, cargos.comision, cargos.aConvertir], [350, 13_495, 986_155]);
    assert.equal(Number(llega.toFixed(2)), 2_984_499.49);
  });

  /* La vuelta a pesos es la fila «CLP – Chile» del Excel, con los pesos que
     salen de convertir la divisa en el lugar del «envía». */
  test('la vuelta a pesos, con la fila «CLP – Chile» del Excel', () => {
    const t = resuelta(TARIFA_A_PESOS);
    for (const [bruto, envio, comision, neto] of [
      [250_000, 1_200, 4_603, 244_197],
      [1_000_000, 1_200, 17_479, 981_321],
      [3_000_000, 1_200, 50_980, 2_947_820],
    ]) {
      const { cargos, llega } = cargosDe('to_clp', bruto! / DOLAR, DOLAR, t);
      assert.equal(cargos.envio, envio);
      assert.equal(cargos.comision, comision);
      assert.equal(llega, neto);
    }
  });
});

describe('la inversa: cuánto poner para que llegue una cifra', () => {
  const t = resuelta(tarifaDe('Estados Unidos')!);

  test('es el menor monto con el que llega al menos lo pedido', () => {
    for (const objetivo of [20.5, 100, 1000, 2_000, 10_000]) {
      const e = invertir('to_foreign', objetivo, DOLAR, t);
      assert.ok(cargosDe('to_foreign', e, DOLAR, t).llega >= objetivo - 1e-9, `${objetivo}`);
      assert.ok(cargosDe('to_foreign', e - 1, DOLAR, t).llega < objetivo, `${objetivo} no es el menor`);
    }
  });

  /* Entre 499.999 y 500.000 la comisión baja de golpe: hay cifras a las que no
     se llega exactamente, y la inversa devuelve el borde. */
  test('en el salto de tramo devuelve el borde', () => {
    const justoAntes = cargosDe('to_foreign', 499_999, DOLAR, t).llega;
    const enElBorde = cargosDe('to_foreign', 500_000, DOLAR, t).llega;
    assert.ok(enElBorde > justoAntes);
    assert.equal(invertir('to_foreign', (justoAntes + enElBorde) / 2, DOLAR, t), 500_000);
  });

  test('de vuelta a pesos', () => {
    const p = resuelta(TARIFA_A_PESOS);
    const dar = invertir('to_clp', 950_000, DOLAR, p);
    assert.ok(cargosDe('to_clp', dar, DOLAR, p).llega >= 950_000);
  });

  test('sin objetivo o sin tasa, no pide nada', () => {
    assert.equal(invertir('to_foreign', 0, DOLAR, t), 0);
    assert.equal(invertir('to_foreign', 100, 0, t), 0);
  });
});

describe('el mínimo', () => {
  test('es 20.000, y la respuesta de la FAQ que lo cita dice lo mismo', () => {
    const { minPayClp } = resolveQuoteLimits({});
    assert.equal(minPayClp, 20_000);
    const vuelta = generalFaq.find((f) => f.q === '¿Puedo volver a pesos cuando quiera?');
    assert.ok(vuelta?.a.includes(`CLP ${formatCLP(minPayClp)}`), vuelta?.a ?? 'falta la pregunta');
  });
});

describe('lo que no se publica', () => {
  /* El dólar digital entra como destino cuando lo firme Compliance y se
     enmienden CLAUDE.md §1 y ADR-0014. Hasta entonces no hay destino ni
     divisa que lo ofrezca. */
  test('el dólar digital no es un destino ni una divisa', () => {
    const espera = TARIFA_DOLAR_DIGITAL_EN_ESPERA.comision.join();
    assert.ok(!TARIFAS.some((t) => t.comision.join() === espera));
    assert.ok(!currencies.some((c) => /USDT|USDC|digital/i.test(`${c.code} ${c.name}`)));
    assert.ok(!destinos().some((d) => /USDT|USDC|digital|billetera/i.test(d.destino)));
  });

  test('el porcentaje se escribe con dos decimales', () => {
    assert.equal(formatComision(95), '0,95\u202f%');
    assert.equal(formatComisionCifra(95), '0,95');
    assert.equal(formatComision(120), '1,20\u202f%');
  });

  const dist = fileURLToPath(new URL('../dist/', import.meta.url));
  describe('en el build', { skip: !existsSync(dist) && 'sin dist/: corre `npm run build` antes' }, () => {
    const js = existsSync(join(dist, '_astro'))
      ? readdirSync(join(dist, '_astro')).filter((f) => f.endsWith('.js')).map((f) => readFileSync(join(dist, '_astro', f), 'utf8')).join('\n')
      : '';
    const home = existsSync(join(dist, 'index.html')) ? readFileSync(join(dist, 'index.html'), 'utf8') : '';

    /* La isla recibe el costo de envío en pesos: el monto base y su moneda se
       quedan en el servidor, y la tarifa en espera no viaja. */
    test('el JavaScript no lleva el tarifario de origen', () => {
      assert.doesNotMatch(js, /envioBase|TARIFA_DOLAR_DIGITAL|TARIFA_A_PESOS/);
    });

    test('el cotizador ya no dice «el precio ya incluye el spread», y dice «Sin comisiones ocultas.»', () => {
      const texto = home.replace(/<!--[\s\S]*?-->/g, '');
      assert.ok(!texto.includes('el precio ya incluye el spread'));
      assert.ok(texto.includes('Sin comisiones ocultas.'));
      assert.ok(texto.includes('Costo de envío') && texto.includes('Comisión de cambio'));
    });

    test('/tarifas publica una fila por destino y la de la vuelta a pesos', () => {
      const html = readFileSync(join(dist, 'tarifas', 'index.html'), 'utf8');
      const filas = html.match(/<th scope="row"/g) ?? [];
      assert.equal(filas.length, TARIFAS.length + 1);
    });
  });
});

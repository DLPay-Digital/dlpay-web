/**
 * Tests del catálogo de divisas y del cotizador multidivisa (ADR-0013).
 *
 * Lo que se comprueba acá no es formato: es **que el sitio no pueda ofrecer una
 * divisa cuya tasa nadie aprobó**. Ése es el guardarraíl que ADR-0013 pone en
 * lugar de una lista escrita a mano, y si se rompe, el fallo es publicar un
 * precio inventado — que es exactamente lo que `CLAUDE.md` §3 y §7 prohíben.
 */
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import {
  DEFAULT_CURRENCY,
  DEFAULT_DESTINO,
  assertRatesConfirmed,
  availableCurrencies,
  confirmedRate,
  currencies,
  currencyInfo,
  destinos,
  isForeignCurrency,
  rateFor,
  unconfirmed,
} from '../src/lib/pricing/currencies.ts';
import {
  buildQuote,
  currenciesFor,
  formatAmount,
  precioLegible,
  whatsappMessage,
} from '../src/lib/pricing/quote.ts';
import type { PriceReference } from '../src/lib/pricing/types.ts';

function precio(currency: Parameters<typeof currencyInfo>[0], rate: number): PriceReference {
  return {
    rate,
    currency,
    pair: `${currency}/CLP`,
    source: 'referencia de mercado',
    asOf: new Date('2026-10-21T12:00:00Z'),
  };
}

describe('el catálogo', () => {
  test('tiene doce divisas y ningún código repetido', () => {
    assert.equal(currencies.length, 12);
    assert.equal(new Set(currencies.map((c) => c.code)).size, 12);
  });

  /* Ecuador está dolarizado: es un destino del dólar, no una divisa. Si alguien
     le crea una entrada propia, este test lo detiene. */
  test('Ecuador entra como destino del dólar, no como divisa', () => {
    assert.deepEqual(currencyInfo('USD').destinations, ['Estados Unidos', 'Ecuador']);
    assert.equal(currencies.filter((c) => c.destinations.includes('Ecuador')).length, 1);
  });

  test('los trece destinos están cubiertos', () => {
    const destinos = currencies.flatMap((c) => c.destinations);
    assert.equal(destinos.length, 13);
    assert.equal(new Set(destinos).size, 13);
  });

  /* El plural se escribe, no se deriva: «guaraníes», «bolívares», «reales» y
     «yenes» no salen de añadir una «s». El ejecutivo lee ese texto tal cual. */
  test('ningún plural se obtiene añadiendo una s', () => {
    for (const c of currencies) {
      assert.ok(c.plural.length > 0, c.code);
      if (['PYG', 'VES', 'BRL', 'JPY', 'CNY'].includes(c.code)) {
        assert.notEqual(c.plural, `${c.name}s`);
      }
    }
  });

  test('el dólar conserva el nombre histórico de su variable', () => {
    assert.equal(currencyInfo('USD').envVar, 'PUBLIC_QUOTE_SAMPLE_RATE');
  });

  test('isForeignCurrency no deja pasar el peso chileno ni basura', () => {
    assert.equal(isForeignCurrency('EUR'), true);
    assert.equal(isForeignCurrency('CLP'), false);
    assert.equal(isForeignCurrency('nope'), false);
    assert.equal(isForeignCurrency(undefined), false);
  });
});

describe('las tasas de muestra y el guardarraíl que impide publicarlas', () => {
  /* Las doce aparecen en el selector: todas tienen tasa, la confirmada o la de
     muestra. Lo que protege no es ocultarlas, es `assertRatesConfirmed`. */
  test('el cotizador ofrece las doce', () => {
    assert.equal(availableCurrencies().length, 12);
    assert.equal(availableCurrencies()[0]!.code, DEFAULT_CURRENCY);
  });

  test('sin variable se usa la muestra; con variable, la variable', () => {
    assert.equal(rateFor('EUR', {}), currencyInfo('EUR').sample);
    assert.equal(rateFor('EUR', { PUBLIC_QUOTE_RATE_EUR: '1050.5' }), 1050.5);
  });

  /* Una tasa vacía, cero, negativa o con letras NO cuenta como confirmada: es
     el mismo criterio que `quoteLimits` aplica al mínimo. */
  test('una tasa inservible no confirma nada', () => {
    for (const malo of ['', '0', '-3', 'mil', 'NaN']) {
      assert.equal(confirmedRate('EUR', { PUBLIC_QUOTE_RATE_EUR: malo }), undefined, malo);
    }
  });

  test('hoy las doce están sin confirmar', () => {
    assert.equal(unconfirmed({}).length, 12);
  });

  /* El guardarraíl de verdad: con la indexación abierta, un build con muestras
     tiene que caerse. Si esto deja de ser cierto, el sitio público puede
     publicar doce precios que nadie aprobó. */
  test('el build se detiene si falta alguna, y dice cuáles', () => {
    assert.throws(() => assertRatesConfirmed({}), /Faltan 12 de 12/);
    const casi = Object.fromEntries(
      currencies.filter((c) => c.code !== 'VES').map((c) => [c.envVar, '123'])
    );
    assert.throws(() => assertRatesConfirmed(casi), /Faltan 1 de 12: VES/);
  });

  /* Copiar el número del catálogo a la variable es lo que haría alguien con
     prisa, y no es confirmar nada. */
  test('repetir la cifra de muestra no cuenta como confirmarla', () => {
    const copiado = Object.fromEntries(currencies.map((c) => [c.envVar, String(c.sample)]));
    assert.throws(() => assertRatesConfirmed(copiado), /Faltan 12 de 12/);
  });

  test('con las doce confirmadas, no lanza', () => {
    const todas = Object.fromEntries(currencies.map((c) => [c.envVar, String(c.sample + 1)]));
    assert.doesNotThrow(() => assertRatesConfirmed(todas));
  });

  /* §4.19: un número escrito en una prosa sobre un dato que el código tiene es
     un test. Acá el dato es el catálogo y la prosa es `.env.example`. */
  test('`.env.example` documenta las doce variables', () => {
    const ejemplo = readFileSync(new URL('../.env.example', import.meta.url), 'utf8');
    for (const c of currencies) {
      assert.ok(ejemplo.includes(c.envVar), `${c.envVar} no está en .env.example`);
    }
  });
});

describe('el cotizador con una divisa que no es el dólar', () => {
  test('la divisa viaja al par de monedas', () => {
    assert.deepEqual(currenciesFor('to_foreign', 'EUR'), { give: 'CLP', get: 'EUR' });
    assert.deepEqual(currenciesFor('to_clp', 'EUR'), { give: 'EUR', get: 'CLP' });
  });

  /* Sin segundo argumento sigue siendo el dólar: es lo que mantiene intactas
     las ocho piezas del sitio que hablan de dólares y sólo de dólares. */
  test('sin divisa sigue siendo el dólar', () => {
    assert.deepEqual(currenciesFor('to_foreign'), { give: 'CLP', get: 'USD' });
  });

  test('la cotización recibe la divisa de su precio', () => {
    const quote = buildQuote({
      intent: 'to_foreign',
      giveAmount: 2_000_000,
      price: precio('EUR', 1050),
      minPay: 500_000,
    });
    assert.equal(quote.getCurrency, 'EUR');
    assert.equal(Number(quote.getAmount.toFixed(2)), 1904.76);
  });

  /* El yen no lleva céntimos. Escribir «1.250,00» en una moneda que no usa
     fracción es precisión falsa, y en una cifra de dinero eso engaña. */
  test('cada divisa se escribe con los decimales que usa', () => {
    assert.equal(formatAmount(1250, 'JPY'), 'JPY 1.250');
    assert.equal(formatAmount(1904.762, 'EUR'), 'EUR 1.904,76');
    assert.equal(formatAmount(2174.6167, 'USD'), 'US$ 2.174,62');
    assert.equal(formatAmount(2_000_000, 'CLP'), 'CLP 2.000.000');
  });

  test('el mensaje al ejecutivo nombra la divisa en plural', () => {
    const quote = buildQuote({
      intent: 'to_foreign',
      giveAmount: 2_000_000,
      price: precio('PYG', 0.13),
      minPay: 500_000,
    });
    const msg = whatsappMessage(quote, 2_000_000);
    assert.match(msg, /a guaraníes/);
    assert.match(msg, /CLP 2\.000\.000/);
  });

  test('de vuelta a pesos, el mensaje habla de pesos y el monto va en la divisa', () => {
    const quote = buildQuote({
      intent: 'to_clp',
      giveAmount: 1000,
      price: precio('EUR', 1050),
      minPay: 500_000,
    });
    const msg = whatsappMessage(quote, 1000);
    assert.match(msg, /convertir EUR 1\.000,00 a pesos/);
  });
});

/* Entrega `cotizador-` (Cowork, 2026-10-22): el cotizador elige por país, el
   precio se escribe para que se lea y el mensaje dice a dónde va el dinero. */
describe('el cotizador por destino', () => {
  test('trece destinos, uno por país, en orden alfabético', () => {
    const lista = destinos();
    assert.equal(lista.length, 13);
    assert.equal(new Set(lista.map((l) => l.destino)).size, 13);
    const nombres = lista.map((l) => l.destino);
    assert.deepEqual(nombres, [...nombres].sort((a, b) => a.localeCompare(b, 'es')));
  });

  test('cada destino llega en una divisa del catálogo, y el dólar sirve a dos', () => {
    for (const l of destinos()) assert.ok(isForeignCurrency(l.code), l.destino);
    const enDolares = destinos().filter((l) => l.code === 'USD').map((l) => l.destino);
    assert.deepEqual(enDolares.sort(), ['Ecuador', 'Estados Unidos']);
  });

  test('el destino de partida existe y es el del dólar', () => {
    const inicial = destinos().find((l) => l.destino === DEFAULT_DESTINO);
    assert.equal(inicial?.code, DEFAULT_CURRENCY);
  });
});

describe('el precio, escrito para que se lea', () => {
  test('con la tasa sobre 1, cuántos pesos vale una unidad', () => {
    assert.equal(precioLegible(919.7, 'USD'), '1 USD = 919,70 CLP');
    assert.equal(precioLegible(5.98, 'JPY'), '1 JPY = 5,98 CLP');
  });

  test('con la tasa bajo 1, cuántas unidades da un peso', () => {
    assert.equal(precioLegible(0.23, 'COP'), '1 CLP = 4,35 COP');
    assert.equal(precioLegible(0.12, 'PYG'), '1 CLP = 8,33 PYG');
  });

  test('una tasa inservible no produce un precio', () => {
    assert.equal(precioLegible(0, 'USD'), '—');
    assert.equal(precioLegible(Number.NaN, 'EUR'), '—');
    assert.equal(precioLegible(Number.POSITIVE_INFINITY, 'EUR'), '—');
  });
});

describe('el mensaje al ejecutivo con destino', () => {
  const quote = buildQuote({
    intent: 'to_foreign',
    giveAmount: 2_000_000,
    price: precio('COP', 0.23),
    minPay: 500_000,
  });

  test('dice a dónde va, en qué llega y el precio como lo ve la web', () => {
    const msg = whatsappMessage(quote, 2_000_000, 'Colombia');
    assert.match(msg, /enviar CLP 2\.000\.000 a Colombia\./);
    assert.match(msg, /Llegan aprox\. COP 8\.695\.652/);
    /* **La moneda ya no se nombra aparte desde el 2026-10-23.** Estaba dicha
       dos veces —el destino y la cifra— y el mensaje se dibuja en el teléfono
       de la Home, donde cada línea cuenta. Ver `whatsappMessage`. */
    assert.doesNotMatch(msg, /en pesos colombianos/);
    assert.match(msg, /1 CLP = 4,35 COP/);
    assert.match(msg, /precio final/);
  });

  /* Con el dólar la moneda NO identifica el destino —Estados Unidos y Ecuador
     comparten USD—, así que el país es lo único que lo distingue. Por eso el
     recorte del 2026-10-23 quitó la moneda y no el país. */
  test('con dólares, el país es lo que distingue Estados Unidos de Ecuador', () => {
    const usd = buildQuote({ intent: 'to_foreign', giveAmount: 2_000_000, price: precio('USD', 919.7), minPay: 500_000 });
    assert.match(whatsappMessage(usd, 2_000_000, 'Ecuador'), /a Ecuador\./);
    assert.match(whatsappMessage(usd, 2_000_000, 'Estados Unidos'), /a Estados Unidos\./);
  });

  test('bajo el mínimo pregunta, con el destino y sin precio', () => {
    const bajo = buildQuote({ intent: 'to_foreign', giveAmount: 100_000, price: precio('COP', 0.23), minPay: 500_000 });
    const msg = whatsappMessage(bajo, 100_000, 'Colombia');
    assert.match(msg, /enviar CLP 100\.000 a Colombia\. ¿Pueden operar ese monto\?/);
    assert.doesNotMatch(msg, /precio referencial/);
  });

  test('de vuelta a pesos el destino no se nombra', () => {
    const vuelta = buildQuote({ intent: 'to_clp', giveAmount: 1000, price: precio('EUR', 1050), minPay: 500_000 });
    const msg = whatsappMessage(vuelta, 1000, 'Europa');
    assert.match(msg, /convertir EUR 1\.000,00 a pesos/);
    assert.doesNotMatch(msg, /Europa|enviar/);
  });

  test('sin destino, el mensaje es el de siempre', () => {
    assert.match(whatsappMessage(quote, 2_000_000), /convertir CLP 2\.000\.000 a pesos colombianos\. Recibo aprox\./);
  });
});

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

import {
  DEFAULT_CURRENCY,
  availableCurrencies,
  currencies,
  currencyInfo,
  isForeignCurrency,
  rateFor,
} from '../src/lib/pricing/currencies.ts';
import {
  buildQuote,
  currenciesFor,
  formatAmount,
  whatsappMessage,
} from '../src/lib/pricing/quote.ts';
import type { PriceReference } from '../src/lib/pricing/types.ts';

const USD_RATE = 919.7;

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

describe('qué divisas puede ofrecer el sitio', () => {
  test('sin ninguna variable, sólo el dólar', () => {
    const disponibles = availableCurrencies({}, USD_RATE);
    assert.deepEqual(disponibles.map((c) => c.code), ['USD']);
  });

  test('una divisa aparece al definir su tasa, y sólo entonces', () => {
    const sin = availableCurrencies({}, USD_RATE).map((c) => c.code);
    const con = availableCurrencies({ PUBLIC_QUOTE_RATE_EUR: '1050.5' }, USD_RATE).map((c) => c.code);
    assert.equal(sin.includes('EUR'), false);
    assert.deepEqual(con, ['USD', 'EUR']);
  });

  /* Una tasa vacía, cero, negativa o con letras NO enciende la divisa. Es el
     mismo criterio que `quoteLimits` aplica al mínimo: una cifra de dinero no
     admite basura. */
  test('una tasa inservible no enciende la divisa', () => {
    for (const malo of ['', '0', '-3', 'mil', 'NaN']) {
      assert.equal(rateFor('EUR', { PUBLIC_QUOTE_RATE_EUR: malo }), undefined, malo);
    }
    assert.equal(rateFor('EUR', { PUBLIC_QUOTE_RATE_EUR: '1050.5' }), 1050.5);
  });

  test('el orden del catálogo manda, y el dólar va primero', () => {
    const todas = availableCurrencies(
      Object.fromEntries(currencies.map((c) => [c.envVar, '100'])),
      USD_RATE
    );
    assert.equal(todas.length, 12);
    assert.equal(todas[0]!.code, DEFAULT_CURRENCY);
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

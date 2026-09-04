/**
 * Tests de la lógica crítica y determinística del cotizador (CLAUDE.md §7).
 *
 * Runner nativo de Node (`node --test`), sin dependencias añadidas.
 * No se testea el contenido estático ni el marcado: sólo lo que puede estar mal
 * y costarle dinero o confianza a alguien.
 */
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import { formatCLP, formatUSDT, formatRate } from '../src/lib/pricing/format.ts';
import {
  buildQuote,
  clpAmount,
  convert,
  currenciesFor,
  resolveState,
  whatsappMessage,
  whatsappUrl,
} from '../src/lib/pricing/quote.ts';
import type { PriceReference } from '../src/lib/pricing/types.ts';

const price: PriceReference = {
  rate: 919.7,
  pair: 'USDT/CLP',
  source: 'referencia de mercado',
  asOf: new Date('2026-09-04T12:00:00Z'),
};
const MIN = 50_000;

describe('formato de cifras chileno', () => {
  test('CLP va sin decimales y con punto de miles', () => {
    assert.equal(formatCLP(2_000_000), '2.000.000');
    assert.equal(formatCLP(50_000), '50.000');
    assert.equal(formatCLP(999), '999');
  });

  test('USDT lleva siempre dos decimales, con coma', () => {
    assert.equal(formatUSDT(2174.6167), '2.174,62');
    assert.equal(formatUSDT(1000), '1.000,00');
  });

  test('el precio conserva los dos decimales', () => {
    assert.equal(formatRate(919.7), '919,70');
  });
});

describe('dirección de la operación', () => {
  test('comprar entrega pesos y recibe dólar digital', () => {
    assert.deepEqual(currenciesFor('buy'), { give: 'CLP', get: 'USDT' });
  });

  test('vender entrega dólar digital y recibe pesos', () => {
    assert.deepEqual(currenciesFor('sell'), { give: 'USDT', get: 'CLP' });
  });

  test('la conversión se invierte según la dirección', () => {
    assert.equal(convert('buy', 2_000_000, 919.7).toFixed(2), '2174.62');
    assert.equal(Math.round(convert('sell', 2174.62, 919.7)), 1_999_998);
  });

  test('el viaje de ida y vuelta pierde sólo unos pesos por el redondeo a dos decimales', () => {
    // Propiedad real, no un defecto: el USDT se muestra con 2 decimales, así que
    // volver desde esa cifra no reconstruye el peso exacto. Por eso el precio es
    // referencial y lo confirma un ejecutivo. Se fija la tolerancia para que
    // nadie la empeore sin darse cuenta.
    const original = 2_000_000;
    const shown = Number(convert('buy', original, 919.7).toFixed(2));
    const back = convert('sell', shown, 919.7);
    assert.ok(Math.abs(back - original) < 5, `desvío de ${Math.abs(back - original)} pesos`);
  });

  test('el monto en pesos se identifica en ambas direcciones', () => {
    assert.equal(clpAmount('buy', 2_000_000, 919.7), 2_000_000);
    assert.ok(Math.abs(clpAmount('sell', 2174.62, 919.7) - 2_000_000) < 5);
  });

  test('una tasa inválida no produce Infinity ni NaN', () => {
    assert.equal(convert('buy', 1000, 0), 0);
    assert.equal(convert('sell', 1000, -5), 0);
  });
});

describe('estados del cotizador', () => {
  test('un monto normal está ok', () => {
    assert.equal(resolveState(2_000_000, MIN), 'ok');
  });

  test('bajo el mínimo se detecta', () => {
    assert.equal(resolveState(10_000, MIN), 'below_min');
  });

  test('el monto exacto del mínimo es válido', () => {
    assert.equal(resolveState(MIN, MIN), 'ok');
  });

  test('cero no se marca como bajo el mínimo: el campo está vacío, no equivocado', () => {
    assert.equal(resolveState(0, MIN), 'ok');
  });

  test('sobre el máximo se detecta cuando hay máximo', () => {
    assert.equal(resolveState(90_000_000, MIN, 50_000_000), 'above_max');
  });

  test('vender bajo el mínimo se evalúa por el equivalente en pesos', () => {
    const quote = buildQuote({ direction: 'sell', giveAmount: 10, price, minPay: MIN });
    assert.equal(quote.state, 'below_min');
  });
});

describe('objeto Quote', () => {
  test('V1 nunca emite una cotización cerrada', () => {
    const quote = buildQuote({ direction: 'buy', giveAmount: 2_000_000, price, minPay: MIN });
    assert.equal(quote.isReferential, true);
    assert.equal(quote.spreadIncluded, true);
  });

  test('payAmount es siempre el monto en pesos, se compre o se venda', () => {
    const buy = buildQuote({ direction: 'buy', giveAmount: 2_000_000, price, minPay: MIN });
    const sell = buildQuote({ direction: 'sell', giveAmount: 2174.62, price, minPay: MIN });
    assert.equal(buy.payAmount, 2_000_000);
    assert.ok(Math.abs(sell.payAmount - 2_000_000) < 5);
  });
});

describe('mensaje de WhatsApp', () => {
  test('al comprar nombra pesos entregados y dólar digital recibido', () => {
    const quote = buildQuote({ direction: 'buy', giveAmount: 2_000_000, price, minPay: MIN });
    const msg = whatsappMessage(quote, 2_000_000);
    assert.match(msg, /compra de USDT/);
    assert.match(msg, /CLP 2\.000\.000/);
    assert.match(msg, /2\.174,62 USDT/);
    assert.match(msg, /919,70/);
    assert.match(msg, /precio final/);
  });

  test('al vender invierte las monedas del mensaje', () => {
    const quote = buildQuote({ direction: 'sell', giveAmount: 2174.62, price, minPay: MIN });
    const msg = whatsappMessage(quote, 2174.62);
    assert.match(msg, /venta de USDT/);
    assert.match(msg, /2\.174,62 USDT/);
    assert.match(msg, /CLP 1\.999\.998/);
  });

  test('bajo el mínimo pregunta si pueden operar, sin prometer precio', () => {
    const quote = buildQuote({ direction: 'buy', giveAmount: 10_000, price, minPay: MIN });
    const msg = whatsappMessage(quote, 10_000);
    assert.match(msg, /¿Pueden operar ese monto\?/);
    assert.doesNotMatch(msg, /precio referencial/);
  });

  test('sin precio disponible el mensaje lo dice, en vez de inventar una cifra', () => {
    const quote = buildQuote({ direction: 'buy', giveAmount: 2_000_000, price, minPay: MIN });
    const msg = whatsappMessage({ ...quote, state: 'market_moving' }, 2_000_000);
    assert.match(msg, /no me está mostrando precio/);
    assert.doesNotMatch(msg, /919,70/);
  });

  test('la URL queda codificada y apunta al número configurado', () => {
    const quote = buildQuote({ direction: 'buy', giveAmount: 2_000_000, price, minPay: MIN });
    const url = whatsappUrl('56977615921', quote, 2_000_000);
    assert.ok(url.startsWith('https://wa.me/56977615921?text='));
    assert.doesNotMatch(url.split('?text=')[1] ?? '', /[ ?&#]/);
    assert.match(decodeURIComponent(url), /Hola, quiero cotizar/);
  });
});

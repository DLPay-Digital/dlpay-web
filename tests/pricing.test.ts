/**
 * Tests de la lógica crítica y determinística del cotizador (CLAUDE.md §7).
 *
 * Runner nativo de Node (`node --test`), sin dependencias añadidas.
 * No se testea el contenido estático ni el marcado: sólo lo que puede estar mal
 * y costarle dinero o confianza a alguien.
 */
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import { formatCLP, formatUSD, formatRate, formatFigure, formatFigureRange, parseAmount } from '../src/lib/pricing/format.ts';
import {
  buildQuote,
  clpAmount,
  convert,
  currenciesFor,
  directionFor,
  formatAmount,
  resolveState,
  whatsappMessage,
  whatsappUrl,
} from '../src/lib/pricing/quote.ts';
import type { PriceReference } from '../src/lib/pricing/types.ts';

const price: PriceReference = {
  rate: 919.7,
  pair: 'USD/CLP',
  source: 'referencia de mercado',
  asOf: new Date('2026-09-04T12:00:00Z'),
};
const MIN = 50_000;

describe('formato de cifras chileno', () => {
  test('CLP va sin decimales y con punto de miles', () => {
    assert.equal(formatCLP(2_000_000), '2.000.000');
    assert.equal(formatCLP(50_000), '50.000');
  });

  test('los dólares llevan siempre dos decimales, con coma', () => {
    assert.equal(formatUSD(2174.6167), '2.174,62');
    assert.equal(formatUSD(1000), '1.000,00');
  });

  test('el precio conserva los dos decimales', () => {
    assert.equal(formatRate(919.7), '919,70');
  });

  test('la cifra de una marca se muestra como viene, sin ceros de relleno', () => {
    // El caso que motivó la función: un mínimo de CLP no tiene centavos y
    // «50.000,00» se salía de la columna del índice.
    assert.equal(formatFigure(50000), '50.000');
    // Y el caso contrario: los decimales que el dato SÍ trae se conservan.
    assert.equal(formatFigure(3.75), '3,75');
    assert.equal(formatFigure(4), '4');
    // Un solo decimal no se rellena hasta dos.
    assert.equal(formatFigure(919.7), '919,7');
  });

  test('un intervalo toma la precisión del par, no la de cada extremo', () => {
    // El caso que lo motivó: la tasa de la Fed va de 3,75 a 4,00 y salía
    // «3,75–4», con un lado en centésimas y el otro sin ellas.
    assert.equal(formatFigureRange(3.75, 4), '3,75–4,00');
    assert.equal(formatFigureRange(3.5, 3.75), '3,50–3,75');
    // Sin decimales en ninguno de los dos, no se inventan.
    assert.equal(formatFigureRange(50000, 60000), '50.000–60.000');
    // Un decimal a un lado los pone a los dos, pero sólo uno.
    assert.equal(formatFigureRange(1, 1.5), '1,0–1,5');
  });

  test('el monto se escribe con su moneda como la dice el equipo', () => {
    assert.equal(formatAmount(2_000_000, 'CLP'), 'CLP 2.000.000');
    assert.equal(formatAmount(2174.62, 'USD'), 'US$ 2.174,62');
  });
});

describe('parseo de montos escritos por una persona', () => {
  test('formato chileno', () => {
    assert.equal(parseAmount('2.000.000'), 2_000_000);
    assert.equal(parseAmount('2.174,62'), 2174.62);
    assert.equal(parseAmount('50.000'), 50_000);
  });

  test('formato inglés pegado desde un correo o una factura', () => {
    // Antes daba 217462: un error de 100x que viajaba al mensaje del ejecutivo.
    assert.equal(parseAmount('2174.62'), 2174.62);
    assert.equal(parseAmount('2,000,000'), 2_000_000);
  });

  test('con ambos separadores manda el último, sin contar dígitos', () => {
    // Antes se contaban los dígitos y "2.174,626" daba 2.174.626: error de x1000
    // en el formato chileno de alta precisión.
    assert.equal(parseAmount('2.174,626'), 2174.626);
    assert.equal(parseAmount('1.234,5678'), 1234.5678);
    assert.equal(parseAmount('1,234.56'), 1234.56);
    assert.equal(parseAmount('1.234,56'), 1234.56);
  });

  test('el separador se decide por posición cuando hay un solo tipo', () => {
    assert.equal(parseAmount('1.500'), 1500, 'tres dígitos agrupan miles');
    assert.equal(parseAmount('1.50'), 1.5, 'dos dígitos son decimales');
    assert.equal(parseAmount('1.5'), 1.5, 'uno también');
  });

  test('la basura no produce un monto', () => {
    for (const raw of ['', '   ', 'abc', '½', '$', '-', '.', ',']) {
      assert.equal(parseAmount(raw), 0, `entrada: ${JSON.stringify(raw)}`);
    }
  });

  test('los símbolos de moneda y los espacios no estorban', () => {
    assert.equal(parseAmount('$ 2.000.000'), 2_000_000);
    assert.equal(parseAmount('CLP 2.000.000'), 2_000_000);
  });

  test('un monto negativo no representa ninguna operación', () => {
    assert.equal(parseAmount('-5000'), 0);
  });

  test('nunca devuelve NaN ni Infinity', () => {
    for (const raw of ['1e999', 'Infinity', 'NaN', '.....', ',,,,']) {
      const v = parseAmount(raw);
      assert.ok(Number.isFinite(v), `entrada: ${raw} -> ${v}`);
    }
  });
});

describe('qué quiere hacer la persona', () => {
  test('convertir a dólares entrega pesos y recibe dólares', () => {
    assert.deepEqual(currenciesFor('to_usd'), { give: 'CLP', get: 'USD' });
  });

  test('convertir a pesos invierte las monedas', () => {
    assert.deepEqual(currenciesFor('to_clp'), { give: 'USD', get: 'CLP' });
  });

  /* Cobertura directa de `directionFor`. La tenía de rebote la prueba que
     comparaba `send_abroad` con `to_usd`, retirada con esa intención. */
  test('la dirección la fija la intención', () => {
    assert.equal(directionFor('to_usd'), 'buy');
    assert.equal(directionFor('to_clp'), 'sell');
  });

  test('la conversión se invierte al pasar a pesos', () => {
    assert.equal(convert('to_usd', 2_000_000, 919.7).toFixed(2), '2174.62');
    assert.equal(Math.round(convert('to_clp', 2174.62, 919.7)), 1_999_998);
  });

  test('el viaje de ida y vuelta pierde sólo unos pesos por el redondeo a dos decimales', () => {
    // Propiedad real, no un defecto: el dólar se muestra con 2 decimales, así que
    // volver desde esa cifra no reconstruye el peso exacto. Por eso el precio es
    // referencial y lo confirma un ejecutivo.
    const original = 2_000_000;
    const shown = Number(convert('to_usd', original, 919.7).toFixed(2));
    const back = convert('to_clp', shown, 919.7);
    assert.ok(Math.abs(back - original) < 5, `desvío de ${Math.abs(back - original)} pesos`);
  });

  test('el monto en pesos se identifica en cualquier intención', () => {
    assert.equal(clpAmount('to_usd', 2_000_000, 919.7), 2_000_000);
    assert.ok(Math.abs(clpAmount('to_clp', 2174.62, 919.7) - 2_000_000) < 5);
  });

  test('una tasa inválida no produce Infinity ni NaN', () => {
    assert.equal(convert('to_usd', 1000, 0), 0);
    assert.equal(convert('to_clp', 1000, -5), 0);
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

  test('convertir a pesos bajo el mínimo se evalúa por el equivalente en pesos', () => {
    const quote = buildQuote({ intent: 'to_clp', giveAmount: 10, price, minPay: MIN });
    assert.equal(quote.state, 'below_min');
  });
});

describe('objeto Quote', () => {
  test('V1 nunca emite una cotización cerrada', () => {
    const quote = buildQuote({ intent: 'to_usd', giveAmount: 2_000_000, price, minPay: MIN });
    assert.equal(quote.isReferential, true);
    assert.equal(quote.spreadIncluded, true);
  });

  test('payAmount es siempre el monto en pesos, sea cual sea la intención', () => {
    const send = buildQuote({ intent: 'to_usd', giveAmount: 2_000_000, price, minPay: MIN });
    const back = buildQuote({ intent: 'to_clp', giveAmount: 2174.62, price, minPay: MIN });
    assert.equal(send.payAmount, 2_000_000);
    assert.ok(Math.abs(back.payAmount - 2_000_000) < 5);
  });

  test('la moneda recibida acompaña a la intención', () => {
    assert.equal(buildQuote({ intent: 'to_usd', giveAmount: 1000, price, minPay: MIN }).getCurrency, 'USD');
    assert.equal(buildQuote({ intent: 'to_clp', giveAmount: 10, price, minPay: MIN }).getCurrency, 'CLP');
  });
});

describe('mensaje de WhatsApp', () => {
  test('convertir a dólares se nombra como cambio, no como compra de cripto', () => {
    const quote = buildQuote({ intent: 'to_usd', giveAmount: 2_000_000, price, minPay: MIN });
    const msg = whatsappMessage(quote, 2_000_000);
    assert.match(msg, /convertir CLP 2\.000\.000 a dólares/);
    assert.match(msg, /US\$ 2\.174,62/);
    assert.match(msg, /precio final/);
    assert.doesNotMatch(msg, /USDT|comprar/);
  });

  test('convertir a pesos invierte las monedas del mensaje', () => {
    const quote = buildQuote({ intent: 'to_clp', giveAmount: 2174.62, price, minPay: MIN });
    const msg = whatsappMessage(quote, 2174.62);
    assert.match(msg, /convertir US\$ 2\.174,62 a pesos/);
    assert.match(msg, /CLP 1\.999\.998/);
  });

  test('bajo el mínimo pregunta si pueden operar, sin prometer precio', () => {
    const quote = buildQuote({ intent: 'to_usd', giveAmount: 10_000, price, minPay: MIN });
    const msg = whatsappMessage(quote, 10_000);
    assert.match(msg, /¿Pueden operar ese monto\?/);
    assert.doesNotMatch(msg, /precio referencial/);
  });

  test('sin precio disponible el mensaje lo dice, en vez de inventar una cifra', () => {
    const quote = buildQuote({ intent: 'to_usd', giveAmount: 2_000_000, price, minPay: MIN });
    const msg = whatsappMessage({ ...quote, state: 'market_moving' }, 2_000_000);
    assert.match(msg, /no me está mostrando precio/);
    assert.doesNotMatch(msg, /919,70/);
  });

  test('sin monto NO se manda una cifra vacía al ejecutivo', () => {
    // Antes llegaba "quiero convertir CLP 0 a dólares (recibo aprox. US$ 0,00)".
    const quote = buildQuote({ intent: 'to_usd', giveAmount: 0, price, minPay: MIN });
    const msg = whatsappMessage(quote, 0);
    assert.doesNotMatch(msg, /CLP 0|US\$ 0,00/);
    assert.match(msg, /quiero cotizar una operación/);
  });

  test('sobre el máximo pregunta, cuando hay un máximo definido', () => {
    const quote = buildQuote({
      intent: 'to_usd',
      giveAmount: 90_000_000,
      price,
      minPay: MIN,
      maxPay: 50_000_000,
    });
    assert.equal(quote.state, 'above_max');
    assert.match(whatsappMessage(quote, 90_000_000), /¿Pueden operar ese monto\?/);
  });

  test('la URL queda codificada y apunta al número configurado', () => {
    const quote = buildQuote({ intent: 'to_usd', giveAmount: 2_000_000, price, minPay: MIN });
    const url = whatsappUrl('56977615921', quote, 2_000_000);
    assert.ok(url.startsWith('https://wa.me/56977615921?text='));
    assert.doesNotMatch(url.split('?text=')[1] ?? '', /[ ?&#]/);
    assert.match(decodeURIComponent(url), /Hola, quiero convertir/);
  });
});

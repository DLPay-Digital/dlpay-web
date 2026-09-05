/**
 * Lógica del cotizador: intención, estado, armado del Quote y mensaje de
 * WhatsApp.
 *
 * Vive aquí y no dentro del componente porque es lógica crítica y
 * determinística: el mensaje que llega al ejecutivo debe ser correcto, y eso
 * se comprueba con tests (CLAUDE.md §7).
 */

import type { Currency, Direction, Intent, PriceReference, Quote, QuoteState } from './types.ts';
import { formatCLP, formatUSD } from './format.ts';

/** Qué se entrega y qué se recibe, según lo que la persona quiere hacer. */
export function currenciesFor(intent: Intent): { give: Currency; get: Currency } {
  return intent === 'to_clp'
    ? { give: 'USD', get: 'CLP' }
    : { give: 'CLP', get: 'USD' };
}

export function directionFor(intent: Intent): Direction {
  return intent === 'to_clp' ? 'sell' : 'buy';
}

export function convert(intent: Intent, giveAmount: number, rate: number): number {
  if (rate <= 0) return 0;
  return directionFor(intent) === 'buy' ? giveAmount / rate : giveAmount * rate;
}

/** El monto en pesos de la operación, sea el que se entrega o el que se recibe. */
export function clpAmount(intent: Intent, giveAmount: number, rate: number): number {
  return directionFor(intent) === 'buy' ? giveAmount : convert(intent, giveAmount, rate);
}

export function resolveState(clp: number, minPay: number, maxPay?: number): QuoteState {
  if (clp > 0 && clp < minPay) return 'below_min';
  if (maxPay !== undefined && clp > maxPay) return 'above_max';
  return 'ok';
}

export function buildQuote(input: {
  intent: Intent;
  giveAmount: number;
  price: PriceReference;
  minPay: number;
  maxPay?: number;
}): Quote {
  const { intent, giveAmount, price, minPay, maxPay } = input;
  const clp = clpAmount(intent, giveAmount, price.rate);

  return {
    intent,
    direction: directionFor(intent),
    payAmount: clp,
    payCurrency: 'CLP',
    getAmount: convert(intent, giveAmount, price.rate),
    getCurrency: currenciesFor(intent).get,
    price,
    spreadIncluded: true,
    isReferential: true,
    minPay,
    ...(maxPay !== undefined ? { maxPay } : {}),
    state: resolveState(clp, minPay, maxPay),
  };
}

export function formatAmount(value: number, currency: Currency): string {
  return currency === 'CLP' ? `CLP ${formatCLP(value)}` : `US$ ${formatUSD(value)}`;
}

/**
 * Mensaje prellenado de WhatsApp (cotizador-spec §5).
 *
 * Siempre incluye el monto y qué quiere hacer la persona. El vocabulario y los
 * decimales coinciden con los que usa el equipo en el chat: la web y WhatsApp
 * deben decir el mismo número de la misma forma (principio UX 3).
 */
export function whatsappMessage(quote: Quote, giveAmount: number): string {
  const { intent, state, price } = quote;
  const { give, get } = currenciesFor(intent);

  if (state === 'unavailable' || state === 'market_moving') {
    return 'Hola, quiero cotizar una operación. El cotizador no me está mostrando precio ahora.';
  }

  // Sin monto no se manda una cifra vacía al ejecutivo: llegaba "CLP 0" y el
  // mensaje no decía nada. El botón sigue llevando a WhatsApp — el fallback
  // nunca es un error seco.
  if (!(giveAmount > 0)) {
    return 'Hola, quiero cotizar una operación de cambio de divisas.';
  }

  const what: Record<Intent, string> = {
    send_abroad: `enviar ${formatAmount(giveAmount, give)} al extranjero`,
    to_usd: `convertir ${formatAmount(giveAmount, give)} a dólares`,
    to_clp: `convertir ${formatAmount(giveAmount, give)} a pesos`,
  };

  if (state === 'below_min' || state === 'above_max') {
    return `Hola, quiero ${what[intent]}. ¿Pueden operar ese monto?`;
  }

  return (
    `Hola, quiero ${what[intent]} (recibo aprox. ${formatAmount(quote.getAmount, get)} ` +
    `al precio referencial ${formatUSD(price.rate)}). ¿Me confirman el precio final?`
  );
}

export function whatsappUrl(number: string, quote: Quote, giveAmount: number): string {
  return `https://wa.me/${number}?text=${encodeURIComponent(whatsappMessage(quote, giveAmount))}`;
}

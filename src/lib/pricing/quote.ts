/**
 * Lógica del cotizador: estado, armado del Quote y mensaje de WhatsApp.
 *
 * Vive aquí y no dentro del componente porque es lógica crítica y
 * determinística: el mensaje que llega al ejecutivo debe ser correcto, y eso
 * se comprueba con tests (CLAUDE.md §7).
 */

import type { Direction, PriceReference, Quote, QuoteState } from './types.ts';
import { formatCLP, formatUSDT } from './format.ts';

/**
 * Quién da qué según la dirección.
 * - comprar: entregas CLP, recibes USDT
 * - vender:  entregas USDT, recibes CLP
 */
export function currenciesFor(direction: Direction): {
  give: 'CLP' | 'USDT';
  get: 'CLP' | 'USDT';
} {
  return direction === 'buy'
    ? { give: 'CLP', get: 'USDT' }
    : { give: 'USDT', get: 'CLP' };
}

/** Convierte el monto entregado al monto recibido. */
export function convert(direction: Direction, giveAmount: number, rate: number): number {
  if (rate <= 0) return 0;
  return direction === 'buy' ? giveAmount / rate : giveAmount * rate;
}

/** El monto en pesos de la operación, sea el que se entrega o el que se recibe. */
export function clpAmount(direction: Direction, giveAmount: number, rate: number): number {
  return direction === 'buy' ? giveAmount : convert(direction, giveAmount, rate);
}

export function resolveState(clp: number, minPay: number, maxPay?: number): QuoteState {
  if (clp > 0 && clp < minPay) return 'below_min';
  if (maxPay !== undefined && clp > maxPay) return 'above_max';
  return 'ok';
}

export function buildQuote(input: {
  direction: Direction;
  giveAmount: number;
  price: PriceReference;
  minPay: number;
  maxPay?: number;
}): Quote {
  const { direction, giveAmount, price, minPay, maxPay } = input;
  const clp = clpAmount(direction, giveAmount, price.rate);
  const getAmount = convert(direction, giveAmount, price.rate);

  return {
    direction,
    payAmount: clp,
    payCurrency: 'CLP',
    getAmount,
    getCurrency: 'USDT',
    price,
    spreadIncluded: true,
    isReferential: true,
    minPay,
    ...(maxPay !== undefined ? { maxPay } : {}),
    state: resolveState(clp, minPay, maxPay),
  };
}

function amount(value: number, currency: 'CLP' | 'USDT'): string {
  return currency === 'CLP' ? `CLP ${formatCLP(value)}` : `${formatUSDT(value)} USDT`;
}

/**
 * Mensaje prellenado de WhatsApp (cotizador-spec §5).
 *
 * Siempre incluye el monto y la dirección. El vocabulario y los decimales
 * coinciden con los que usa el equipo en el chat: la web y WhatsApp deben decir
 * el mismo número de la misma forma (principio UX 3).
 */
export function whatsappMessage(quote: Quote, giveAmount: number): string {
  const { direction, state, price } = quote;
  const { give, get } = currenciesFor(direction);
  const verb = direction === 'buy' ? 'comprar' : 'vender';

  if (state === 'unavailable' || state === 'market_moving') {
    return 'Hola, quiero cotizar una operación de USDT. El cotizador no me está mostrando precio ahora.';
  }

  if (state === 'below_min' || state === 'above_max') {
    return `Hola, quiero ${verb} USDT por ${amount(giveAmount, give)}. ¿Pueden operar ese monto?`;
  }

  return (
    `Hola, quiero cotizar la ${direction === 'buy' ? 'compra' : 'venta'} de USDT ` +
    `por ${amount(giveAmount, give)} (recibo aprox. ${amount(quote.getAmount, get)} ` +
    `al precio referencial ${formatUSDT(price.rate)}). ¿Me confirman el precio final?`
  );
}

export function whatsappUrl(number: string, quote: Quote, giveAmount: number): string {
  return `https://wa.me/${number}?text=${encodeURIComponent(whatsappMessage(quote, giveAmount))}`;
}

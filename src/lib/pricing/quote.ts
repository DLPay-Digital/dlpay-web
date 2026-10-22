/**
 * Lógica del cotizador: intención, estado, armado del Quote y mensaje de
 * WhatsApp.
 *
 * Vive aquí y no dentro del componente porque es lógica crítica y
 * determinística: el mensaje que llega al ejecutivo debe ser correcto, y eso
 * se comprueba con tests (CLAUDE.md §7).
 */

import type {
  Currency,
  Direction,
  ForeignCurrency,
  Intent,
  PriceReference,
  Quote,
  QuoteState,
} from './types.ts';
import { DEFAULT_CURRENCY, currencyInfo } from './currencies.ts';
import { formatCLP, formatForeign, formatRate, formatUSD } from './format.ts';

/**
 * Qué se entrega y qué se recibe, según lo que la persona quiere hacer.
 *
 * La divisa es un parámetro desde ADR-0013 y **tiene valor por omisión**: las
 * ocho piezas del sitio que hablan de dólares —las figuras de la Home, el
 * mockup, `/tarifas`— siguen llamando a esta función con un solo argumento y
 * siguen recibiendo exactamente lo mismo que antes. Sólo el cotizador pasa la
 * divisa que el visitante eligió.
 */
export function currenciesFor(
  intent: Intent,
  foreign: ForeignCurrency = DEFAULT_CURRENCY
): { give: Currency; get: Currency } {
  return intent === 'to_clp'
    ? { give: foreign, get: 'CLP' }
    : { give: 'CLP', get: foreign };
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
    getCurrency: currenciesFor(intent, price.currency).get,
    price,
    spreadIncluded: true,
    isReferential: true,
    minPay,
    ...(maxPay !== undefined ? { maxPay } : {}),
    state: resolveState(clp, minPay, maxPay),
  };
}

/**
 * Un monto con su moneda delante, como lo escribe el sitio.
 *
 * **El dólar conserva «US$» y no pasa a «USD»**, aunque las otras once usen su
 * código. No es una inconsistencia que se coló: «US$ 2.174,62» está publicado
 * hoy en la Home, en `/tarifas` y en el mensaje que recibe el ejecutivo, y
 * cambiarlo habría movido cifras que ADR-0013 no tenía por qué mover. Las
 * divisas nuevas estrenan el código porque no arrastran nada — y porque un
 * símbolo propio para once monedas es una decisión de diseño que nadie ha
 * tomado.
 */
export function formatAmount(value: number, currency: Currency): string {
  if (currency === 'CLP') return `CLP ${formatCLP(value)}`;
  if (currency === 'USD') return `US$ ${formatUSD(value)}`;
  return `${currency} ${formatForeign(value, currencyInfo(currency).decimals)}`;
}

/**
 * El precio referencial, escrito para que se lea (Cowork, entrega `cotizador-`).
 *
 * El catálogo guarda cada tasa como **CLP por una unidad**, y así se escribía
 * siempre: «919,70 CLP por dólar» se lee bien, pero «0,23 CLP por peso
 * colombiano» obliga a hacer una división de cabeza para saber qué compran tus
 * pesos. Con la tasa bajo 1 la frase se da vuelta y dice cuántas unidades da un
 * peso chileno: **1 CLP = 4,35 COP**. Es la misma tasa, invertida; no es una
 * fórmula de precio ni un redondeo distinto del que ya se publica.
 *
 * El cotizador y el mensaje de WhatsApp usan esta misma función, para que la
 * web y el chat digan el número de la misma forma (cotizador-spec §5).
 *
 * PENDIENTE DE DECISIÓN — que el equipo cotice así por WhatsApp. Si el
 * ejecutivo dice «0,23» y la web «4,35», el cliente compara dos números que no
 * se parecen. Sebastián eligió esta forma el 2026-10-22; falta que el equipo
 * la confirme.
 */
export function precioLegible(rate: number, currency: ForeignCurrency): string {
  if (!(rate > 0) || !Number.isFinite(rate)) return '—';
  return rate >= 1
    ? `1 ${currency} = ${formatRate(rate)} CLP`
    : `1 CLP = ${formatRate(1 / rate)} ${currency}`;
}

/**
 * Mensaje prellenado de WhatsApp (cotizador-spec §5).
 *
 * Siempre incluye el monto y qué quiere hacer la persona. El vocabulario y los
 * decimales coinciden con los que usa el equipo en el chat: la web y WhatsApp
 * deben decir el mismo número de la misma forma (principio UX 3).
 *
 * **Con destino, el mensaje dice a dónde va** (entrega `cotizador-`): el
 * cotizador elige por país desde el 2026-10-22, y el ejecutivo es quien
 * «coordina el destino» (spec §1). Con dólares la moneda no basta para saberlo
 * —Estados Unidos o Ecuador—, y el país es lo primero que va a preguntar. El
 * verbo pasa a ser «enviar», que es lo que la persona está haciendo y lo que
 * decía la intención `send_abroad` hasta el 2026-09-14. Sin destino el mensaje
 * es el de siempre, salvo la forma del precio.
 *
 * REQUIERE VALIDACIÓN DE COMPLIANCE — «enviar … a {país}» y «llegan aprox.»
 * afirman que el dinero llega a destino, igual que la nota del riel del
 * cotizador. No afirman plazo ni canal (ADR-0014 §3).
 */
export function whatsappMessage(quote: Quote, giveAmount: number, destino?: string): string {
  const { intent, state, price } = quote;
  const { give, get } = currenciesFor(intent, price.currency);

  if (state === 'unavailable' || state === 'market_moving') {
    return 'Hola, quiero cotizar una operación. El cotizador no me está mostrando precio ahora.';
  }

  // Sin monto no se manda una cifra vacía al ejecutivo: llegaba "CLP 0" y el
  // mensaje no decía nada. El botón sigue llevando a WhatsApp — el fallback
  // nunca es un error seco.
  if (!(giveAmount > 0)) {
    return 'Hola, quiero cotizar una operación de cambio de divisas.';
  }

  // El nombre en plural sale del catálogo y no de una regla: «guaraníes» y
  // «bolívares» no se derivan con un sufijo, y el ejecutivo lee este mensaje
  // tal como llega.
  const plural = currencyInfo(
    (intent === 'to_clp' ? give : get) as ForeignCurrency
  ).plural;

  const envio = intent === 'to_foreign' && destino !== undefined && destino !== '';

  const what: Record<Intent, string> = {
    to_foreign: envio
      ? `enviar ${formatAmount(giveAmount, give)} a ${destino}, en ${plural}`
      : `convertir ${formatAmount(giveAmount, give)} a ${plural}`,
    to_clp: `convertir ${formatAmount(giveAmount, give)} a pesos`,
  };

  if (state === 'below_min' || state === 'above_max') {
    return `Hola, quiero ${what[intent]}. ¿Pueden operar ese monto?`;
  }

  return (
    `Hola, quiero ${what[intent]} (${envio ? 'llegan' : 'recibo'} aprox. ${formatAmount(quote.getAmount, get)} ` +
    `al precio referencial ${precioLegible(price.rate, price.currency)}). ¿Me confirman el precio final?`
  );
}

export function whatsappUrl(
  number: string,
  quote: Quote,
  giveAmount: number,
  destino?: string
): string {
  return `https://wa.me/${number}?text=${encodeURIComponent(whatsappMessage(quote, giveAmount, destino))}`;
}

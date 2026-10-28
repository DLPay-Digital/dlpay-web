/**
 * Lógica del cotizador: intención, estado, armado del Quote y mensaje de
 * WhatsApp.
 *
 * Vive aquí y no dentro del componente porque es lógica crítica y
 * determinística: el mensaje que llega al ejecutivo debe ser correcto, y eso
 * se comprueba con tests (CLAUDE.md §7).
 */

import type {
  Cargos,
  Currency,
  Direction,
  ForeignCurrency,
  Intent,
  PriceReference,
  Quote,
  QuoteState,
} from './types.ts';
import type { TarifaCliente, Tramo } from './tarifario.ts';
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

/**
 * La conversión a la tasa, **sin cobros**. Desde el 2026-10-27 no es lo que
 * llega —eso es `cargosDe`—, sino la mitad de la cuenta: lo que vale un monto
 * a la tasa de mercado. Se conserva porque la usan la vuelta a pesos y los
 * tests de la tasa.
 */
export function convert(intent: Intent, giveAmount: number, rate: number): number {
  if (rate <= 0) return 0;
  return directionFor(intent) === 'buy' ? giveAmount / rate : giveAmount * rate;
}

/**
 * El monto en pesos de la operación, el que decide el mínimo y el tramo: lo
 * que envías, o lo que vale tu divisa a la tasa de mercado. En pesos enteros.
 */
export function clpAmount(intent: Intent, giveAmount: number, rate: number): number {
  if (!(giveAmount > 0)) return 0;
  return Math.round(directionFor(intent) === 'buy' ? giveAmount : convert(intent, giveAmount, rate));
}

/** El tramo de un monto en pesos (copia de `tramoDe`, para que la isla no importe el tarifario). */
function tramoClp(clp: number): Tramo {
  return clp < 500_000 ? 0 : clp < 2_000_000 ? 1 : 2;
}

/**
 * Lo que se cobra y lo que llega, con la cuenta del Excel (tarifario del
 * 2026-10-27; ver `tarifario.ts`).
 *
 * **Envío** (`to_foreign`): de los pesos que envías se descuentan el costo de
 * envío y la comisión —un porcentaje de lo que queda después del costo de
 * envío—, y lo que sobra se convierte a la tasa.
 *
 * **Vuelta a pesos** (`to_clp`): la divisa se convierte a pesos a la tasa, y de
 * esos pesos se descuentan el costo de envío y la comisión, con la misma
 * cuenta. El tramo se mide en esos pesos.
 *
 * La comisión se redondea al peso, como el `ROUND(…; 0)` del Excel. El
 * porcentaje va en puntos básicos para que el redondeo sea exacto.
 *
 * Nunca devuelve un negativo: si el monto no alcanza a cubrir el costo de
 * envío, no llega nada, y eso lo dice el estado `below_min` mucho antes. Sin
 * monto, o sin tasa, no hay cargos: el campo está vacío, no equivocado.
 */
export function cargosDe(
  intent: Intent,
  giveAmount: number,
  rate: number,
  tarifa: TarifaCliente
): { cargos: Cargos; llega: number } {
  const clp = clpAmount(intent, giveAmount, rate);
  const tramo = tramoClp(clp);
  const comisionPb = tarifa.comision[tramo];
  const base = Math.max(clp - tarifa.envio, 0);
  const comision = Math.round((base * comisionPb) / 10_000);
  const neto = base - comision;
  // El costo de envío es fijo y se muestra entero aunque el monto no lo cubra:
  // es lo que costaría, y por eso un monto así está bajo el mínimo.
  const cargos: Cargos = { envio: tarifa.envio, comision, comisionPb, tramo, aConvertir: clp };
  if (!(rate > 0) || clp <= 0) return { cargos: { ...cargos, envio: 0, comision: 0 }, llega: 0 };
  return directionFor(intent) === 'buy'
    ? { cargos: { ...cargos, aConvertir: neto }, llega: neto / rate }
    : { cargos, llega: neto };
}

/**
 * La inversa de `cargosDe`: cuánto hay que poner para que llegue `objetivo`.
 *
 * No se despeja con una fórmula porque la cuenta tiene escalones —el
 * redondeo de la comisión y el salto de tramo—, así que se busca: **el menor
 * monto en pesos con el que llega al menos `objetivo`**. Lo que llega crece
 * con lo que pones (al pasar de tramo, de golpe, porque la comisión baja), así
 * que la búsqueda binaria vale.
 *
 * En un salto de tramo hay cifras a las que no se llega exactamente: con
 * 499.999 llega un poco menos que con 500.000, y entre las dos no hay nada.
 * Ahí devuelve 500.000, y el campo que llega muestra un poco más de lo que se
 * escribió. Es lo honesto: no hay un monto que dé esa cifra.
 */
export function invertir(
  intent: Intent,
  objetivo: number,
  rate: number,
  tarifa: TarifaCliente
): number {
  if (!(objetivo > 0) || !(rate > 0)) return 0;
  const buy = directionFor(intent) === 'buy';
  // De pesos (lo que se busca) al monto que pone la persona.
  const dar = (clp: number): number => (buy ? clp : clp / rate);
  const llega = (clp: number): number => cargosDe(intent, dar(clp), rate, tarifa).llega;
  const necesitaClp = buy ? objetivo * rate : objetivo;
  let lo = 0;
  let hi = Math.ceil(necesitaClp / 0.9) + tarifa.envio + 100;
  while (llega(hi) < objetivo) hi *= 2;
  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (llega(mid) >= objetivo - 1e-9) hi = mid;
    else lo = mid + 1;
  }
  return dar(lo);
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
  /** La tarifa del destino, o la de la vuelta a pesos (`tarifario.ts`). */
  tarifa: TarifaCliente;
  minPay: number;
  maxPay?: number;
}): Quote {
  const { intent, giveAmount, price, tarifa, minPay, maxPay } = input;
  const clp = clpAmount(intent, giveAmount, price.rate);
  const { cargos, llega } = cargosDe(intent, giveAmount, price.rate, tarifa);

  return {
    intent,
    direction: directionFor(intent),
    payAmount: clp,
    payCurrency: 'CLP',
    getAmount: llega,
    getCurrency: currenciesFor(intent, price.currency).get,
    price,
    rateWithoutMarkup: true,
    cargos,
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
    /* **Sin «, en {plural}» desde el 2026-10-23.** Era redundante por partida
       doble: el destino ya dice la moneda —el selector enseña «Colombia · COP»—
       y la cifra que sigue la lleva delante («COP 8.695.652»). Lo que se ganó
       no es elegancia: el teléfono dibujado de la Home **muestra este mismo
       texto**, y con doce caracteres menos la primera burbuja baja de 10
       líneas a 9. Ver la nota del final de esta función. */
    to_foreign: envio
      ? `enviar ${formatAmount(giveAmount, give)} a ${destino}`
      : `convertir ${formatAmount(giveAmount, give)} a ${plural}`,
    to_clp: `convertir ${formatAmount(giveAmount, give)} a pesos`,
  };

  if (state === 'below_min' || state === 'above_max') {
    return `Hola, quiero ${what[intent]}. ¿Pueden operar ese monto?`;
  }

  /*
    ── Por qué este texto es corto, y qué NO se le puede quitar ─────────────

    **Lo lee un ejecutivo, y además se dibuja.** El teléfono de la Home y el de
    `/como-funciona` enseñan esta misma cadena, letra por letra
    (`lib/pricing/mensaje-inicial.ts`), y el de la Home la mete en una pantalla
    de 511 px que **recorta por arriba a propósito**, como un chat. Con la
    forma anterior la primera burbuja medía **10 líneas** y se quedaba cortada
    a la mitad en cuanto llegaba el segundo mensaje; en Safari, que compone el
    texto algo más alto, antes todavía. Lo vio Sebastián el 2026-10-23.

    **Se quitó sólo lo que estaba dicho dos veces:**

    · `, en {plural}` — el destino ya nombra la moneda y la cifra la lleva
      delante;
    · `al precio referencial` — la tasa pasa a un paréntesis. La palabra
      «referencial» no se pierde del sitio: es una entrada del glosario y la
      tarjeta del cotizador la dice encima de esta misma cifra.

    **Lo que no se tocó, y conviene que siga así:** el monto, el destino,
    «llegan aprox.» —que es la afirmación con marcador de Compliance—, la tasa
    legible y «¿Me confirman el precio final?», que es como el sitio llama a lo
    que el ejecutivo hace.

    De 164 a 131 caracteres; la burbuja baja de 10 a 9 líneas a 390 px y de 10
    a 8 a 1280.

    **«netos», desde el 2026-10-27.** Con el tarifario, lo que llega ya no es
    pesos ÷ tasa: van descontados el costo de envío y la comisión. Sin la
    palabra, el ejecutivo que hace la división de cabeza con la tasa del
    paréntesis llega a otra cifra y no sabe cuál vale. Son seis caracteres; el
    desglose entero no cabe en la burbuja y no hace falta: el ejecutivo lo
    rehace con la tarifa.
  */
  return (
    `Hola, quiero ${what[intent]}. ${envio ? 'Llegan' : 'Recibo'} aprox. ` +
    `${formatAmount(quote.getAmount, get)} netos (${precioLegible(price.rate, price.currency)}). ` +
    `¿Me confirman el precio final?`
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

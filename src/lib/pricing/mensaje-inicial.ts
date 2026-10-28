/**
 * La cotización con que abre el cotizador, y el mensaje que escribe (Cowork,
 * entrega `telefono-`, 2026-10-23; la cotización, entrega `tarifario-`,
 * 2026-10-27).
 *
 * Es el texto que el botón «Continuar por WhatsApp» escribe solo cuando nadie
 * tocó nada: el monto de partida, el destino por defecto y su divisa. Lo usan
 * los teléfonos dibujados de la Home y de `/como-funciona`, que dicen «tu
 * operación llega escrita automáticamente», **y por eso no pueden teclearla**:
 * hasta el 2026-10-23 la burbuja decía «necesito convertir 2.000.000 CLP» y el
 * botón ya escribía «quiero enviar CLP 2.000.000 a Estados Unidos, en
 * dólares…». Se habían separado sin que nada avisara.
 *
 * **`cotizacionInicial`, desde el 2026-10-27.** Con el tarifario, lo que llega
 * ya no sale de dividir por la tasa: hay que descontar el costo de envío y la
 * comisión del destino. Las figuras que enseñan «Recibes US$ …» —la tarjeta
 * de la Home, `/tarifas`, el teléfono— hacían cada una su división y
 * coincidían por disciplina. Ahora piden esta cotización, que es la misma con
 * que abre el cotizador, y no pueden separarse.
 *
 * `tests/telefono.test.ts` comprueba sobre el build que la primera burbuja del
 * teléfono de la Home es, letra por letra, el texto del enlace del cotizador.
 */
import { ConfigPriceSource } from './config-price-source.ts';
import { DEFAULT_CURRENCY, DEFAULT_DESTINO } from './currencies.ts';
import { buildQuote, whatsappMessage } from './quote.ts';
import { tarifaClienteDe } from './tarifario.ts';
import type { Quote } from './types.ts';
import { quoteLimits } from '../config/site.ts';

/** La cotización de partida: el monto de muestra, al destino por defecto, con su tarifa. */
export async function cotizacionInicial(): Promise<Quote> {
  const price = await new ConfigPriceSource(DEFAULT_CURRENCY).getPrice();
  const tarifa = await tarifaClienteDe(DEFAULT_DESTINO);
  const { minPayClp: minPay, maxPayClp: maxPay, samplePayClp: monto } = quoteLimits;
  return buildQuote({
    intent: 'to_foreign',
    giveAmount: monto,
    price,
    tarifa,
    minPay,
    ...(maxPay !== undefined ? { maxPay } : {}),
  });
}

export async function mensajeInicial(): Promise<string> {
  const quote = await cotizacionInicial();
  return whatsappMessage(quote, quoteLimits.samplePayClp, DEFAULT_DESTINO);
}

/**
 * El mensaje con que abre el cotizador (Cowork, entrega `telefono-`,
 * 2026-10-23).
 *
 * Es el texto que el botón «Continuar por WhatsApp» escribe solo cuando nadie
 * tocó nada: el monto de partida, el destino por defecto y su divisa. Lo usan
 * los teléfonos dibujados de la Home y de `/como-funciona`, que dicen «tu
 * operación llega escrita automáticamente», **y por eso no pueden teclearla**:
 * hasta el 2026-10-23 la burbuja decía «necesito convertir 2.000.000 CLP» y el
 * botón ya escribía «quiero enviar CLP 2.000.000 a Estados Unidos, en
 * dólares…». Se habían separado sin que nada avisara.
 *
 * Arma la cotización con los mismos datos que `Quoter.astro` usa para su
 * enlace inicial. `tests/telefono.test.ts` lo comprueba sobre el build: la
 * primera burbuja del teléfono de la Home es, letra por letra, el texto del
 * enlace del cotizador.
 */
import { ConfigPriceSource } from './config-price-source.ts';
import { DEFAULT_CURRENCY, DEFAULT_DESTINO } from './currencies.ts';
import { buildQuote, whatsappMessage } from './quote.ts';
import { quoteLimits } from '../config/site.ts';

export async function mensajeInicial(): Promise<string> {
  const price = await new ConfigPriceSource(DEFAULT_CURRENCY).getPrice();
  const { minPayClp: minPay, maxPayClp: maxPay, samplePayClp: monto } = quoteLimits;
  const quote = buildQuote({
    intent: 'to_foreign',
    giveAmount: monto,
    price,
    minPay,
    ...(maxPay !== undefined ? { maxPay } : {}),
  });
  return whatsappMessage(quote, monto, DEFAULT_DESTINO);
}

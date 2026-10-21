/**
 * Única implementación de PriceSource en V1: devuelve un valor de MUESTRA
 * configurable por variable de entorno.
 *
 * NO es una fuente de mercado y NO refleja el precio real de DLPay. La fuente
 * oficial y la metodología de spread son decisión de DLPay y siguen pendientes
 * (CLAUDE.md §13, D7).
 */

import type { PriceReference, PriceSource } from './types.ts';
import { DEFAULT_CURRENCY, type ForeignCurrency, rateFor } from './currencies.ts';

const env = import.meta.env;

/** El valor por omisión del dólar, que es la tasa que D7 tiene abierta. */
export const DEFAULT_USD_RATE = 919.7;

/**
 * Desde ADR-0013 recibe la divisa.
 *
 * **Sin argumentos sigue siendo exactamente lo que era**: el dólar, a la tasa de
 * `PUBLIC_QUOTE_SAMPLE_RATE`. Las ocho piezas del sitio que la instancian así no
 * cambiaron una línea y publican las mismas cifras.
 *
 * Una divisa sin tasa configurada **no cae a un valor por defecto**: lanza. Es
 * deliberado y es la mitad del mecanismo de D21 —la otra mitad es
 * `availableCurrencies`, que impide que el selector la ofrezca—. Un valor por
 * defecto inventado para el euro sería una cifra que nadie aprobó publicada en
 * la portada del sitio, que es justo lo que §3 y §7 prohíben; que el build se
 * caiga es infinitamente preferible.
 */
export class ConfigPriceSource implements PriceSource {
  readonly label: string;
  readonly #rate: number;
  readonly #currency: ForeignCurrency;

  constructor(currency: ForeignCurrency = DEFAULT_CURRENCY, rate?: number, label?: string) {
    this.#currency = currency;
    const configured =
      rate ??
      rateFor(
        currency,
        env,
        currency === DEFAULT_CURRENCY ? DEFAULT_USD_RATE : undefined
      );

    if (configured === undefined) {
      throw new Error(
        `Sin tasa de muestra para ${currency}. ` +
          'Defínela en el entorno o no ofrezcas esa divisa (ADR-0013, D7).'
      );
    }
    this.#rate = configured;

    this.label =
      label ??
      (typeof env.PUBLIC_QUOTE_SOURCE_LABEL === 'string' &&
      env.PUBLIC_QUOTE_SOURCE_LABEL.length > 0
        ? env.PUBLIC_QUOTE_SOURCE_LABEL
        : 'referencia de mercado');
  }

  async getPrice(): Promise<PriceReference> {
    return {
      rate: this.#rate,
      currency: this.#currency,
      pair: `${this.#currency}/CLP`,
      source: this.label,
      asOf: new Date(),
    };
  }
}

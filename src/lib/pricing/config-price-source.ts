/**
 * Única implementación de PriceSource en V1: devuelve un valor de MUESTRA
 * configurable por variable de entorno.
 *
 * NO es una fuente de mercado y NO refleja el precio real de DLPay. La fuente
 * oficial sigue pendiente (CLAUDE.md §13, D7). **La metodología ya no**: desde
 * el 2026-10-27 la tasa es la de mercado sin recargo, y lo que DLPay cobra va
 * aparte, en `tarifario.ts`. Esta clase sigue entregando sólo la tasa.
 */

import type { PriceReference, PriceSource } from './types.ts';
import { DEFAULT_CURRENCY, type ForeignCurrency, rateFor } from './currencies.ts';

const env = import.meta.env;

/**
 * Desde ADR-0013 recibe la divisa.
 *
 * **Sin argumentos sigue siendo exactamente lo que era**: el dólar, a la tasa de
 * `PUBLIC_QUOTE_SAMPLE_RATE`. Las ocho piezas del sitio que la instancian así no
 * cambiaron una línea y publican las mismas cifras.
 *
 * **Una divisa sin variable de entorno usa su tasa de MUESTRA**, la del
 * catálogo. Entre el 21 y el 22 de octubre no lo hacía: lanzaba, para que fuera
 * imposible publicar un número que nadie aprobó. Sebastián pidió el 22 que el
 * cotizador funcionara con muestras, así que la protección se movió al build —
 * `assertRatesConfirmed` detiene cualquier build con indexación abierta
 * mientras alguna divisa siga en su muestra. Se puede ver y probar; no se puede
 * publicar.
 */
export class ConfigPriceSource implements PriceSource {
  readonly label: string;
  readonly #rate: number;
  readonly #currency: ForeignCurrency;

  constructor(currency: ForeignCurrency = DEFAULT_CURRENCY, rate?: number, label?: string) {
    this.#currency = currency;
    this.#rate = rate ?? rateFor(currency, env);

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

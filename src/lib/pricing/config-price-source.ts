/**
 * Única implementación de PriceSource en V1: devuelve un valor de MUESTRA
 * configurable por variable de entorno.
 *
 * NO es una fuente de mercado y NO refleja el precio real de DLPay. La fuente
 * oficial y la metodología de spread son decisión de DLPay y siguen pendientes
 * (CLAUDE.md §13, D7).
 */

import type { PriceReference, PriceSource } from './types.ts';

const env = import.meta.env;

function readNumber(value: unknown, fallback: number): number {
  const parsed = typeof value === 'string' ? Number(value) : Number.NaN;
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export class ConfigPriceSource implements PriceSource {
  readonly label: string;
  readonly #rate: number;

  constructor(rate?: number, label?: string) {
    this.#rate = rate ?? readNumber(env.PUBLIC_QUOTE_SAMPLE_RATE, 919.7);
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
      pair: 'USDT/CLP',
      source: this.label,
      asOf: new Date(),
    };
  }
}

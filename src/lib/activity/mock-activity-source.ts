/**
 * Fuente de ejemplo. NO son operaciones reales de DLPay.
 *
 * Existe para diseñar y probar el componente mientras no hay una fuente real.
 * Declara `isReal = false`, y eso hace que la UI muestre el distintivo de datos
 * de ejemplo — no hay forma de publicarla haciéndola pasar por real.
 *
 * Cuando exista la fuente real: se agrega `DLPayActivitySource` con
 * `isReal = true` sobre operaciones confirmadas y anonimizadas, y se cambia la
 * implementación en un punto. El componente no se toca.
 */

import type { ActivityEvent, ActivityKind, ActivitySource } from './types.ts';

const KINDS: ActivityKind[] = [
  'conversion_to_usd',
  'international_move',
  'conversion_to_clp',
  'business',
  'conversion_to_usd',
  'international_move',
];

/** Montos verosímiles por tipo, para que la composición se vea real al diseñar. */
const RANGES: Record<ActivityKind, [number, number]> = {
  conversion_to_usd: [300, 3_000],
  conversion_to_clp: [300, 2_500],
  international_move: [500, 4_000],
  business: [4_000, 20_000],
};

export class MockActivitySource implements ActivitySource {
  readonly isReal = false;
  readonly label = 'Datos de ejemplo';

  /** Semilla fija: el mismo build produce la misma lista, sin parpadeos. */
  #seed: number;

  constructor(seed = 42) {
    this.#seed = seed;
  }

  #next(): number {
    this.#seed = (this.#seed * 1664525 + 1013904223) % 4294967296;
    return this.#seed / 4294967296;
  }

  async list(limit: number): Promise<ActivityEvent[]> {
    const now = Date.now();
    let elapsed = 0;

    return Array.from({ length: limit }, (_, i) => {
      const kind = KINDS[i % KINDS.length]!;
      const [min, max] = RANGES[kind];
      const amount = Math.round((min + this.#next() * (max - min)) / 10) * 10;
      elapsed += 12 + Math.floor(this.#next() * 90);

      return {
        id: `mock-${i}`,
        kind,
        amountUsd: amount,
        at: new Date(now - elapsed * 1000),
      };
    });
  }
}

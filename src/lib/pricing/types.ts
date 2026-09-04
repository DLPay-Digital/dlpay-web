/**
 * Contrato del cotizador (docs/design-system/cotizador-spec.md §6).
 *
 * La UI sólo consume un objeto `Quote`. No conoce la fuente del precio ni la
 * fórmula del spread. La cadena Market Price -> Pricing/Spread -> Quote -> UI
 * se respeta a nivel de TIPOS, no de infraestructura: no hay servicio, ni caché
 * distribuida, ni cola. Un módulo, una interfaz, una config.
 */

export type Direction = 'buy' | 'sell';

/**
 * Qué quiere hacer la persona. Es el PRIMER paso del cotizador: la conversación
 * empieza por la intención, no por la moneda.
 *
 * `send_abroad` y `to_usd` hacen la misma aritmética pero son operaciones
 * distintas para quien las pide y para el ejecutivo que las cierra, así que
 * producen mensajes de WhatsApp distintos.
 */
export type Intent = 'send_abroad' | 'to_usd' | 'to_clp';

/** La moneda que ve el usuario. El dólar se entrega como dólar digital. */
export type Currency = 'CLP' | 'USD';

export type QuoteState =
  | 'ok'
  | 'below_min'
  | 'above_max'
  | 'market_moving'
  | 'unavailable';

export interface PriceReference {
  /** CLP por 1 dólar. */
  rate: number;
  pair: 'USD/CLP';
  /** Etiqueta legible para mostrar junto al dato. */
  source: string;
  asOf: Date;
}

export interface Quote {
  intent: Intent;
  direction: Direction;
  payAmount: number;
  payCurrency: 'CLP';
  /** Estimado, nunca comprometido. */
  getAmount: number;
  getCurrency: Currency;
  price: PriceReference;
  /** El precio mostrado ya incluye el spread. */
  spreadIncluded: true;
  /** V1 NUNCA entrega una cotización cerrada. Literal, no booleano variable. */
  isReferential: true;
  minPay?: number;
  maxPay?: number;
  state: QuoteState;
}

/**
 * Fuente de precio intercambiable. En V1 hay UNA implementación
 * (`ConfigPriceSource`). Mañana se agrega `DLPayApiPriceSource` y se cambia por
 * variable de entorno, sin tocar la UI.
 */
export interface PriceSource {
  readonly label: string;
  getPrice(): Promise<PriceReference>;
}

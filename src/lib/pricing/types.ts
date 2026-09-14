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
 * Hubo una tercera, `send_abroad` («enviar al extranjero»), retirada el
 * 2026-09-14 a petición de Sebastián: hacía exactamente la misma aritmética que
 * `to_usd` y en el selector se leían como dos caminos para lo mismo. Producía un
 * mensaje de WhatsApp distinto —«quiero enviar X al extranjero»—, y eso es lo
 * único que se pierde: el ejecutivo ya no recibe esa intención escrita y, si le
 * importa, la pregunta. Está en el historial si se quiere reponer.
 */
export type Intent = 'to_usd' | 'to_clp';

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

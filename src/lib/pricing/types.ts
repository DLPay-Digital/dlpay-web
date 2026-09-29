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

/**
 * Los estados de una cotización.
 *
 * ── TRES de los cinco están dormidos, y cada uno por su motivo ─────────────
 *
 * Declarado el 2026-09-29 al cerrar D21, porque la regla del proyecto es que
 * **lo que se conserva sin uso lo dice, y lo que no lo dice se borra**. Lo que
 * sigue se comprobó contando ocurrencias en `src/` y en `tests/`, no de memoria.
 *
 * · **`above_max`** — la maquinaria está completa y **probada de punta a punta**
 *   (`tests/pricing.test.ts`: construye una cotización con tope, comprueba el
 *   estado y comprueba que el mensaje de WhatsApp pregunta «¿Pueden operar ese
 *   monto?»). Duerme porque **D21 se cerró sin tope** el 2026-09-29: DLPay no
 *   publica un máximo, así que `PUBLIC_QUOTE_MAX_CLP` no se define y
 *   `resolveState` nunca lo produce. Se despierta poniendo la variable, sin
 *   tocar código.
 *
 * · **`market_moving`** y **`unavailable`** — éstos no es que duerman: **nada
 *   los produce**. Sólo se consumen en `quote.ts` al redactar el mensaje de
 *   WhatsApp, y `market_moving` se fuerza en un test. Son de **D7**, no de D21:
 *   `ConfigPriceSource` devuelve siempre el mismo valor configurado, así que no
 *   puede informar que el mercado se está moviendo ni que no tiene precio. Una
 *   fuente de mercado real sí podría, y ese día los produciría sin más cambios.
 *
 * Los tres se conservan a propósito. Si alguna de las dos decisiones se cierra
 * en contra —un máximo que nunca llega, una fuente que nunca informa estado—,
 * lo que corresponde es **borrar la rama**, como se hizo con `ActivityFeed` al
 * cerrar D18.
 */
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

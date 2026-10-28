/**
 * Contrato del cotizador (docs/design-system/cotizador-spec.md §6).
 *
 * La UI sólo consume un objeto `Quote`. No conoce la fuente del precio ni de
 * dónde sale la tarifa. La cadena Market Price -> Tarifa -> Quote -> UI se
 * respeta a nivel de TIPOS, no de infraestructura: no hay servicio, ni caché
 * distribuida, ni cola. Un módulo, una interfaz, una config.
 *
 * **Desde el 2026-10-27 la cadena ya no dice «Pricing/Spread».** La tasa es la
 * de mercado, sin recargo, y lo que DLPay cobra va aparte y a la vista: un
 * costo de envío y una comisión de cambio (`tarifario.ts`).
 */

import type { Currency, ForeignCurrency } from './currencies.ts';
import type { Tramo } from './tarifario.ts';
export type { Currency, ForeignCurrency, Tramo };

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
 *
 * **`to_usd` pasó a llamarse `to_foreign` el 2026-10-21 (ADR-0013)**, porque el
 * destino dejó de ser siempre el dólar. Es un renombre, no un cambio de
 * comportamiento: la aritmética es la misma y la divisa viaja aparte.
 *
 * Y con eso **caduca el motivo por el que `send_abroad` se retiró**: hacía «la
 * misma aritmética» porque sólo había una divisa. Con doce ya no la hace. No se
 * repone automáticamente —la intención y la divisa pueden ser un control o
 * dos—, pero quien lea el párrafo de arriba debe saber que su razón venció.
 */
export type Intent = 'to_foreign' | 'to_clp';

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
  /** CLP por 1 unidad de `currency`. */
  rate: number;
  /** La divisa de destino a la que se refiere esta tasa. */
  currency: ForeignCurrency;
  /** `USD/CLP`, `EUR/CLP`… Se deriva de `currency`, nunca se escribe a mano. */
  pair: `${ForeignCurrency}/CLP`;
  /** Etiqueta legible para mostrar junto al dato. */
  source: string;
  asOf: Date;
}

/**
 * Lo que DLPay cobra en una cotización, en pesos (tarifario del 2026-10-27).
 *
 * Son dos líneas y nada más, y las dos se ven en el cotizador: no hay un
 * tercer cobro en otra parte. Ver la cuenta en `tarifario.ts`.
 */
export interface Cargos {
  /** El costo de envío, en pesos. */
  envio: number;
  /** La comisión de cambio, en pesos. */
  comision: number;
  /** El porcentaje que se aplicó, en puntos básicos: 105 = 1,05 %. */
  comisionPb: number;
  tramo: Tramo;
  /**
   * Los pesos que se convierten a la tasa de mercado (envío), o los que salen
   * de convertir la divisa (vuelta a pesos), antes de descontar nada.
   */
  aConvertir: number;
}

export interface Quote {
  intent: Intent;
  direction: Direction;
  payAmount: number;
  payCurrency: 'CLP';
  /** Estimado, nunca comprometido. Ya descontados los dos cargos. */
  getAmount: number;
  getCurrency: Currency;
  price: PriceReference;
  /**
   * **La tasa es la de mercado y no lleva recargo.** Literal, como
   * `isReferential`: hasta el 2026-10-27 este campo era `spreadIncluded: true`
   * —«el precio mostrado ya incluye el spread»—, y era el modelo contrario.
   */
  rateWithoutMarkup: true;
  cargos: Cargos;
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

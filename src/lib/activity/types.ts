/**
 * Actividad reciente de la mesa.
 *
 * Mismo patrón de desacople que el precio: la UI consume eventos y no sabe de
 * dónde vienen. Hoy hay una sola implementación con datos de ejemplo; mañana se
 * enchufa una fuente real de operaciones confirmadas sin tocar el componente.
 *
 * REGLA DURA: un evento NUNCA lleva nombre, RUT, correo, teléfono, número de
 * cuenta, país ni ningún dato que permita identificar a una persona o empresa.
 * El tipo sólo admite tipo de operación, monto y momento — no hay dónde meter
 * un dato personal aunque alguien quiera.
 */

export type ActivityKind =
  | 'conversion_to_usd'
  | 'conversion_to_clp'
  | 'international_move'
  | 'business';

export interface ActivityEvent {
  id: string;
  kind: ActivityKind;
  /** Monto en dólares, redondeado. Nunca el monto exacto de una operación. */
  amountUsd: number;
  at: Date;
}

export interface ActivitySource {
  /**
   * `false` obliga al componente a mostrar un distintivo visible de datos de
   * ejemplo. No es una convención: es la condición que la UI comprueba, para
   * que sea imposible publicar datos inventados como si fueran reales.
   */
  readonly isReal: boolean;
  readonly label: string;
  list(limit: number): Promise<ActivityEvent[]>;
}

export const KIND_LABEL: Record<ActivityKind, string> = {
  conversion_to_usd: 'Conversión CLP → USD',
  conversion_to_clp: 'Conversión USD → CLP',
  // "Movimiento", no "envío bancario": DLPay entrega dólar digital, no deposita
  // en cuentas en el extranjero.
  international_move: 'Movimiento internacional',
  business: 'Operación empresarial',
};

/**
 * El tarifario: lo que DLPay cobra por enviar a cada destino (Sebastián,
 * 2026-10-27, «tarifario_remesas_3_niveles.xlsx»).
 *
 * ── El modelo, en tres líneas ──────────────────────────────────────────────
 *
 * 1. **La tasa es la de mercado, sin recargo.** Es la del catálogo
 *    (`currencies.ts`): la del entorno o, mientras D7 siga abierta, su muestra.
 * 2. **«Costo de envío»**, fijo y en pesos: un monto en dólares o en euros,
 *    pasado a pesos con la tasa del día y redondeado hacia arriba al múltiplo
 *    de $50. Cubre el costo fijo del envío y nada más.
 * 3. **«Comisión de cambio»**, un porcentaje que depende del destino y del
 *    tramo del monto. Es todo el cobro de DLPay.
 *
 * La cuenta, la misma de la hoja «Simulador» del Excel:
 *
 *     comisión          = redondeo( (envías − costo de envío) × % )
 *     monto a convertir = envías − costo de envío − comisión
 *     llega             = monto a convertir ÷ tasa
 *
 * La hace `cargosDe`, en `quote.ts`, y la comprueban
 * `tests/tarifario.test.ts` contra los ejemplos del Excel.
 *
 * ── Lo que este archivo NO trae, y es deliberado ───────────────────────────
 *
 * **Sólo lo que paga el cliente.** El Excel tiene además datos internos de
 * cada corredor y las cotizaciones de la competencia, y **no entran al
 * repositorio** (CLAUDE.md §3 y §7). De un corredor queda lo que el cliente
 * ve: su costo de envío y su comisión por tramo.
 *
 * **Ni una tasa.** Las tasas siguen en el entorno (D7).
 *
 * **Ni el canal.** El Excel distingue dos corredores a Estados Unidos por la
 * vía de pago; el sitio no nombra la vía (CLAUDE.md §1) y Sebastián eligió el
 * 2026-10-27 cotizar sólo la más barata. La otra la cotiza el ejecutivo.
 *
 * ── Sólo en el servidor ────────────────────────────────────────────────────
 *
 * La isla del cotizador **no importa este archivo**: recibe de cada destino el
 * costo de envío ya en pesos y los tres porcentajes (`TarifaCliente`). Así los
 * montos de origen —«US$ 0,50»— no viajan al navegador, aunque se puedan
 * deducir: lo que se publica es lo que cobra, no de dónde sale.
 *
 * REQUIERE VALIDACIÓN DE COMPLIANCE — el tarifario completo: los once
 * destinos, sus costos de envío, sus comisiones y la vuelta a pesos, y que la
 * tasa es «de mercado, sin recargo».
 */
import { ConfigPriceSource } from './config-price-source.ts';
import type { ForeignCurrency } from './currencies.ts';

/** Dónde empieza el tramo 2 y el tramo 3, en pesos. */
export const TRAMOS_CLP = [500_000, 2_000_000] as const;

/** 0, 1 y 2 son los niveles 1, 2 y 3 del Excel. */
export type Tramo = 0 | 1 | 2;

/**
 * El tramo de un monto en pesos.
 *
 * **Un monto justo en el borde ya es del tramo siguiente**: 500.000 es del
 * nivel 2 y 2.000.000 del 3. Es lo que hace el Excel (`B4 < 500.000` para el
 * nivel 1), y conviene: quien envía el monto redondo paga la comisión menor.
 */
export function tramoDe(clp: number): Tramo {
  if (clp < TRAMOS_CLP[0]) return 0;
  if (clp < TRAMOS_CLP[1]) return 1;
  return 2;
}

/** Los tres porcentajes de un destino, en puntos básicos: 120 = 1,20 %. */
export type ComisionPorTramo = readonly [number, number, number];

export interface Tarifa {
  /** El destino, como lo nombra el sitio. */
  destino: string;
  /** La divisa en que llega. */
  code: ForeignCurrency;
  /**
   * El costo de envío antes de pasarlo a pesos. Va en la moneda en que se
   * fija —dólares, salvo Europa, en euros— y se convierte con la tasa de esa
   * moneda, no con la del destino: el de China es US$ 7 aunque llegue en
   * dólares, y el de Colombia US$ 0,35 aunque llegue en pesos colombianos.
   */
  envioBase: { monto: number; moneda: 'USD' | 'EUR' };
  /**
   * Por qué en puntos básicos y no en fracción: `0.0105 × 999.500` da
   * 10.494,749999… en coma flotante, y el redondeo de una comisión no puede
   * depender de eso. En enteros, `999.500 × 105 / 10.000` es exacto.
   */
  comision: ComisionPorTramo;
  /**
   * Si llega en la moneda de ese país. **Es `false` sólo en China**: su
   * tarifa es «USD China» y paga dólares, no yuanes (Sebastián, 2026-10-27).
   * Panamá llega en dólares y sí es su moneda: está dolarizado.
   *
   * Existe porque el sitio afirma en todas partes que el dinero «llega en la
   * moneda de su país» (ADR-0014), y China es la excepción: el cotizador, la
   * lista de destinos y la FAQ lo dicen donde el cliente decide.
   * REQUIERE VALIDACIÓN DE COMPLIANCE.
   */
  enSuMoneda: boolean;
}

/**
 * Los once destinos, en orden alfabético.
 *
 * Son los ocho «principales» del Excel —Estados Unidos con la tarifa más
 * barata— y tres «secundarios» que Sebastián decidió publicar el 2026-10-27:
 * Costa Rica, Perú y Sudáfrica. Es una decisión de negocio tomada: los
 * porcentajes no se corrigen acá.
 */
export const TARIFAS: readonly Tarifa[] = [
  { destino: 'Argentina',      code: 'ARS', envioBase: { monto: 0,    moneda: 'USD' }, comision: [140, 130, 125], enSuMoneda: true },
  { destino: 'Brasil',         code: 'BRL', envioBase: { monto: 0.25, moneda: 'USD' }, comision: [155, 150, 145], enSuMoneda: true },
  { destino: 'China',          code: 'USD', envioBase: { monto: 7,    moneda: 'USD' }, comision: [135, 120, 115], enSuMoneda: false },
  { destino: 'Colombia',       code: 'COP', envioBase: { monto: 0.35, moneda: 'USD' }, comision: [145, 135, 130], enSuMoneda: true },
  { destino: 'Costa Rica',     code: 'CRC', envioBase: { monto: 0.8,  moneda: 'USD' }, comision: [170, 160, 155], enSuMoneda: true },
  { destino: 'Estados Unidos', code: 'USD', envioBase: { monto: 0.5,  moneda: 'USD' }, comision: [120, 105, 95], enSuMoneda: true },
  { destino: 'Europa',         code: 'EUR', envioBase: { monto: 1,    moneda: 'EUR' }, comision: [120, 110, 105], enSuMoneda: true },
  { destino: 'México',         code: 'MXN', envioBase: { monto: 0.5,  moneda: 'USD' }, comision: [140, 130, 125], enSuMoneda: true },
  { destino: 'Panamá',         code: 'USD', envioBase: { monto: 0.5,  moneda: 'USD' }, comision: [125, 110, 105], enSuMoneda: true },
  { destino: 'Perú',           code: 'PEN', envioBase: { monto: 1,    moneda: 'USD' }, comision: [180, 170, 165], enSuMoneda: true },
  { destino: 'Sudáfrica',      code: 'ZAR', envioBase: { monto: 1.5,  moneda: 'USD' }, comision: [200, 195, 190], enSuMoneda: true },
];

/**
 * La vuelta a pesos: la fila «CLP – Chile» del Excel, que Sebastián asignó a
 * «Pasar a pesos» el 2026-10-27. La divisa se pasa a pesos a la tasa de
 * mercado y de esos pesos se descuentan el costo de envío y la comisión; el
 * tramo se mide en esos pesos.
 */
export const TARIFA_A_PESOS: Pick<Tarifa, 'envioBase' | 'comision'> = {
  envioBase: { monto: 1.2, moneda: 'USD' },
  comision: [185, 175, 170],
};

/**
 * PREPARADA Y SIN PUBLICAR — el dólar digital como destino.
 *
 * Es la fila «USDT / USDC» del Excel. Sebastián pidió el 2026-10-27 que entre
 * como destino, y **no se ofrece hasta que se cumplan dos cosas**:
 *
 * 1. la firma de Compliance;
 * 2. la enmienda de `CLAUDE.md` §1 —«el dólar digital es la infraestructura,
 *    no el mensaje comercial»— y de ADR-0014, que dice que todo llega en la
 *    moneda del destino. La propuesta está en `cowork/`.
 *
 * Por eso no está en `TARIFAS`, ni su moneda en el catálogo. Ofrecerla es
 * añadir la divisa, el destino y esta tarifa; `tests/tarifario.test.ts`
 * comprueba que hoy ningún destino la usa.
 *
 * REQUIERE VALIDACIÓN DE COMPLIANCE
 */
export const TARIFA_DOLAR_DIGITAL_EN_ESPERA: Pick<Tarifa, 'envioBase' | 'comision'> = {
  envioBase: { monto: 0, moneda: 'USD' },
  comision: [80, 70, 60],
};

/** A qué múltiplo se redondea hacia arriba el costo de envío en pesos. */
export const REDONDEO_ENVIO_CLP = 50;

/**
 * El costo de envío en pesos: el monto base por la tasa de su moneda,
 * redondeado **hacia arriba** al múltiplo de $50 (el `CEILING` del Excel).
 *
 * El margen de 1e-9 no es un ajuste de precio: `0,35 × 1.000` da
 * 350,00000000000006 en coma flotante, y sin él un monto exacto subiría un
 * escalón entero, de $350 a $400.
 */
export function envioClp(montoBase: number, tasaClp: number): number {
  if (!(montoBase > 0) || !(tasaClp > 0)) return 0;
  return Math.ceil((montoBase * tasaClp) / REDONDEO_ENVIO_CLP - 1e-9) * REDONDEO_ENVIO_CLP;
}

/**
 * Lo que la isla recibe de una tarifa: el costo de envío ya en pesos y los tres
 * porcentajes. Ver la cabecera, «Sólo en el servidor».
 */
export interface TarifaCliente {
  envio: number;
  comision: ComisionPorTramo;
}

/**
 * Lo mismo, con los nombres cortos con que viaja en `data-tarifas` (`e`, `p`) y
 * si llega en la moneda del país (`m`). Vive acá y no en el `<script>` del
 * cotizador: un `interface` declarado ahí deja al comprobador sin ver el
 * `Props` del componente (ver `IslandCurrency` en `currencies.ts`).
 */
export interface TarifaIsla {
  e: number;
  p: ComisionPorTramo;
  m: boolean;
}

export function tarifaDe(destino: string): Tarifa | undefined {
  return TARIFAS.find((t) => t.destino === destino);
}

/** Resuelve una tarifa con la tasa de hoy de la moneda en que se fija su costo de envío. */
export async function resolverTarifa(t: Pick<Tarifa, 'envioBase' | 'comision'>): Promise<TarifaCliente> {
  const { rate } = await new ConfigPriceSource(t.envioBase.moneda).getPrice();
  return { envio: envioClp(t.envioBase.monto, rate), comision: t.comision };
}

/**
 * Lo que el cotizador manda a su isla: la tarifa de cada destino, ya en pesos,
 * y la de la vuelta a pesos. Se arma acá y no en la cabecera del componente,
 * que no admite un `as` sin perder el tipo de sus `Props`.
 *
 * Lanza si un destino no tiene tarifa: publicarlo sin precio sería peor que no
 * construir.
 */
export async function tarifasParaIsla(
  lista: readonly string[]
): Promise<{ porDestino: Record<string, TarifaIsla>; aPesos: TarifaIsla }> {
  const porDestino: Record<string, TarifaIsla> = {};
  for (const destino of lista) {
    const t = tarifaDe(destino);
    if (!t) throw new Error(`El destino «${destino}» no tiene tarifa (tarifario.ts).`);
    const r = await resolverTarifa(t);
    porDestino[destino] = { e: r.envio, p: r.comision, m: t.enSuMoneda };
  }
  const p = await resolverTarifa(TARIFA_A_PESOS);
  return { porDestino, aPesos: { e: p.envio, p: p.comision, m: true } };
}

/** La tarifa de un destino, resuelta. Lanza si el destino no tiene: es un error de catálogo. */
export async function tarifaClienteDe(destino: string): Promise<TarifaCliente> {
  const t = tarifaDe(destino);
  if (!t) throw new Error(`Destino sin tarifa: ${destino}`);
  return resolverTarifa(t);
}

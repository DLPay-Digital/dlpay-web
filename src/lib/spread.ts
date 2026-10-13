/**
 * La cuenta de la herramienta «¿Cuánto te están cobrando por el dólar?».
 *
 * Cowork, 2026-10-13, entrega `spread-`. Función PURA: la usan la página, en el
 * build, para dibujar el ejemplo sin JavaScript, y la isla del navegador, para
 * recalcular mientras escribes. Una sola aritmética para las dos, como el
 * cotizador con `lib/pricing/quote.ts`.
 *
 * ── Lo que calcula, y desde qué lado ───────────────────────────────────────
 *
 * El caso es **comprar dólares con pesos**, que es el del sitio. Con:
 *
 *   P = el precio que te ofrecen, en pesos por dólar
 *   R = una referencia de mercado del mismo momento, en pesos por dólar
 *   M = los pesos que cambias (opcional)
 *   C = una comisión que te cobren aparte, en pesos (opcional)
 *
 * · spread por dólar = P − R
 * · spread en %      = (P − R) / R × 100
 * · recibes          = M / P dólares (la comisión se paga además de M)
 * · a la referencia  = (M + C) / R dólares: lo que darían TODOS tus pesos
 * · la diferencia    = las dos de arriba restadas, y en pesos, × R
 * · precio efectivo  = (M + C) / recibes, que es P si no hay comisión
 *
 * **No sabe el precio de nadie.** No hay un solo número de DLPay ni de ningún
 * proveedor en este archivo: los cuatro los pone quien usa la herramienta.
 * Por eso no toca `lib/pricing/` salvo para formatear, y por eso no expone D7.
 */

export interface EntradaSpread {
  precio: number;
  referencia: number;
  monto?: number;
  comision?: number;
}

export type MotivoInvalido = 'faltan-precios';

export interface ResultadoSpread {
  valido: true;
  porDolar: number;
  porcentaje: number;
  /** El precio ofrecido está bajo la referencia: o es de otro momento, o es un precio de compra. */
  bajoLaReferencia: boolean;
  conMonto: false | {
    recibes: number;
    aLaReferencia: number;
    diferenciaUSD: number;
    diferenciaCLP: number;
    precioEfectivo: number;
    porcentajeEfectivo: number;
  };
}

export function calcularSpread(e: EntradaSpread): ResultadoSpread | { valido: false; motivo: MotivoInvalido } {
  const { precio: P, referencia: R } = e;
  if (!(P > 0) || !(R > 0) || !Number.isFinite(P) || !Number.isFinite(R)) {
    return { valido: false, motivo: 'faltan-precios' };
  }
  const M = e.monto !== undefined && e.monto > 0 && Number.isFinite(e.monto) ? e.monto : 0;
  const C = e.comision !== undefined && e.comision > 0 && Number.isFinite(e.comision) ? e.comision : 0;

  const porDolar = P - R;
  const porcentaje = (porDolar / R) * 100;

  if (M === 0) {
    return { valido: true, porDolar, porcentaje, bajoLaReferencia: porDolar < 0, conMonto: false };
  }
  const recibes = M / P;
  const aLaReferencia = (M + C) / R;
  const diferenciaUSD = aLaReferencia - recibes;
  const precioEfectivo = (M + C) / recibes;
  return {
    valido: true,
    porDolar,
    porcentaje,
    bajoLaReferencia: porDolar < 0,
    conMonto: {
      recibes,
      aLaReferencia,
      diferenciaUSD,
      diferenciaCLP: diferenciaUSD * R,
      precioEfectivo,
      porcentajeEfectivo: ((precioEfectivo - R) / R) * 100,
    },
  };
}

/**
 * Un porcentaje con dos decimales y su signo: «1,00 %», «−0,25 %».
 *
 * Con un espacio fino QUE NO CORTA (U+202F) y no pegado: es una cifra que se
 * lee sola, en grande, y pegada se empastaba con el último dígito a 32 px.
 * Que no corte importa: con un espacio normal, en una columna estrecha el
 * «%» bajaba solo a su renglón. (En el texto corrido de los artículos va
 * pegado, «4,1%», que es como el sitio ya lo escribe; aquí no hay texto
 * alrededor.)
 */
export function formatPorcentaje(valor: number): string {
  const f = new Intl.NumberFormat('es-CL', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const s = f.format(Math.abs(valor) < 0.005 ? 0 : valor);
  return `${s.replace('-', '−')} %`;
}

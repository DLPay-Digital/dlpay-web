/**
 * El catálogo de divisas del cotizador (ADR-0013, 2026-10-21).
 *
 * Hasta hoy el sitio cambiaba pesos por dólares y nada más, así que la moneda
 * no era un dato: era una constante repartida por el código. Con doce divisas
 * pasa a ser dato, y vive acá por el mismo motivo que `content/scope.ts` y que
 * `quoteLimits` (D24): **un solo sitio donde cambiarlo**.
 *
 * ── Lo que este archivo NO hace, y es deliberado ────────────────────────────
 *
 * **No trae ni un precio.** Las tasas son decisión de DLPay y siguen abiertas
 * en D7. Acá sólo está el NOMBRE de la variable de entorno donde vive la tasa
 * de cada divisa; quien no tenga la suya definida, no existe para el sitio.
 * Es el mecanismo con el que se cerró D21 —la maquinaria entera, encendida por
 * una variable— y existe para que no haya forma de publicar un número que
 * nadie aprobó (`CLAUDE.md` §3 y §7).
 *
 * **No afirma que exista una versión digital de las doce.** El sitio promete
 * entregar en una billetera, y eso hoy es cierto del dólar y bastante menos del
 * resto. Es el `PENDIENTE DE DECISIÓN` que ADR-0013 deja abierto, y la
 * protección es la misma de arriba: una divisa sin tasa no se puede ofrecer.
 *
 * ── Trece destinos, doce divisas ──────────────────────────────────────────
 *
 * La lista la dio Sebastián el 2026-10-21 y es abierta. **Ecuador no añade
 * moneda**: está dolarizado, así que entra como destino del dólar. Por eso
 * `destinations` es una lista y no un nombre — la relación entre país y divisa
 * no es uno a uno, y el día que entre otro país dolarizado se añade ahí.
 */

/** Las divisas de destino. El peso chileno no es una de ellas: es el origen. */
export type ForeignCurrency =
  | 'USD'
  | 'EUR'
  | 'ARS'
  | 'BOB'
  | 'BRL'
  | 'CNY'
  | 'COP'
  | 'JPY'
  | 'PEN'
  | 'PYG'
  | 'UYU'
  | 'VES';

/** La moneda que ve el usuario: el peso de origen o la divisa de destino. */
export type Currency = 'CLP' | ForeignCurrency;

export interface CurrencyInfo {
  code: ForeignCurrency;
  /** Cómo la nombra el sitio, en minúscula: «el euro», «el peso colombiano». */
  name: string;
  /**
   * El plural, escrito y no derivado.
   *
   * Lo usa el mensaje de WhatsApp —«convertir CLP 2.000.000 a euros»— y en
   * español no sale de una regla: son «guaraníes», «bolívares», «reales» y
   * «yenes». Derivarlo con un sufijo habría escrito tres de los doce mal, y el
   * ejecutivo lee ese mensaje tal cual llega.
   */
  plural: string;
  /** Los destinos que la usan, tal como los nombró Sebastián. */
  destinations: readonly string[];
  /**
   * Con cuántos decimales se muestra un monto en esta divisa.
   *
   * No es un detalle de formato: escribir «1.250,00 ¥» es escribir céntimos que
   * esa moneda no usa, y en una cifra de dinero eso se lee como precisión
   * falsa. Las que van a cero son las que no manejan fracción en la práctica.
   */
  decimals: 0 | 2;
  /**
   * La variable de entorno con su tasa de muestra, en CLP por 1 unidad.
   *
   * El dólar conserva `PUBLIC_QUOTE_SAMPLE_RATE` y no estrena nombre: es la
   * variable que D7 nombra, que `.env.example` documenta y que media docena de
   * documentos citan. Renombrarla habría roto todo eso para ganar simetría.
   */
  envVar: string;
}

/**
 * Lo que la isla del cotizador recibe del servidor por cada divisa: **el código
 * y su tasa, y nada más**.
 *
 * La primera versión mandaba también los decimales y el plural, y estaba de
 * más: `quote.ts` importa este catálogo para redactar el mensaje de WhatsApp,
 * así que **el catálogo ya viaja al navegador** y mandar esos dos campos aparte
 * era publicar el mismo dato dos veces. Medido: la isla pasó de 4.528 a 6.678
 * bytes al entrar el multidivisa, y esos 2,1 KB son el catálogo — quitarlos
 * pedía sacar `currencyInfo` de `quote.ts`, que es lo que garantiza que la web
 * y el chat digan la misma palabra.
 *
 * La tasa, en cambio, no está acá y no puede estarlo: vive en el entorno
 * (ADR-0013, D7) y sólo el build la conoce.
 *
 * Vive en este módulo, y no dentro del componente, porque es la forma de un
 * dato de acá — y porque un `interface` declarado en el `<script>` de un
 * `.astro` deja al comprobador sin ver el `Props` del propio componente.
 */
export interface IslandCurrency {
  c: ForeignCurrency;
  r: number;
}

export const DEFAULT_CURRENCY: ForeignCurrency = 'USD';

export const currencies: readonly CurrencyInfo[] = [
  { code: 'USD', name: 'dólar',           plural: 'dólares',         destinations: ['Estados Unidos', 'Ecuador'], decimals: 2, envVar: 'PUBLIC_QUOTE_SAMPLE_RATE' },
  { code: 'EUR', name: 'euro',            plural: 'euros',           destinations: ['Europa'],                    decimals: 2, envVar: 'PUBLIC_QUOTE_RATE_EUR' },
  { code: 'ARS', name: 'peso argentino',  plural: 'pesos argentinos', destinations: ['Argentina'],                 decimals: 2, envVar: 'PUBLIC_QUOTE_RATE_ARS' },
  { code: 'BOB', name: 'boliviano',       plural: 'bolivianos',      destinations: ['Bolivia'],                   decimals: 2, envVar: 'PUBLIC_QUOTE_RATE_BOB' },
  { code: 'BRL', name: 'real',            plural: 'reales',          destinations: ['Brasil'],                    decimals: 2, envVar: 'PUBLIC_QUOTE_RATE_BRL' },
  { code: 'CNY', name: 'yuan',            plural: 'yuanes',          destinations: ['China'],                     decimals: 2, envVar: 'PUBLIC_QUOTE_RATE_CNY' },
  { code: 'COP', name: 'peso colombiano', plural: 'pesos colombianos', destinations: ['Colombia'],                  decimals: 0, envVar: 'PUBLIC_QUOTE_RATE_COP' },
  { code: 'JPY', name: 'yen',             plural: 'yenes',           destinations: ['Japón'],                     decimals: 0, envVar: 'PUBLIC_QUOTE_RATE_JPY' },
  { code: 'PEN', name: 'sol',             plural: 'soles',           destinations: ['Perú'],                      decimals: 2, envVar: 'PUBLIC_QUOTE_RATE_PEN' },
  { code: 'PYG', name: 'guaraní',         plural: 'guaraníes',       destinations: ['Paraguay'],                  decimals: 0, envVar: 'PUBLIC_QUOTE_RATE_PYG' },
  { code: 'UYU', name: 'peso uruguayo',   plural: 'pesos uruguayos', destinations: ['Uruguay'],                   decimals: 2, envVar: 'PUBLIC_QUOTE_RATE_UYU' },
  { code: 'VES', name: 'bolívar',         plural: 'bolívares',       destinations: ['Venezuela'],                 decimals: 2, envVar: 'PUBLIC_QUOTE_RATE_VES' },
];

const byCode = new Map(currencies.map((c) => [c.code, c]));

export function currencyInfo(code: ForeignCurrency): CurrencyInfo {
  const info = byCode.get(code);
  // El tipo ya lo garantiza; esto cubre el caso de una divisa que se retire del
  // catálogo dejando una referencia viva en otra parte.
  if (!info) throw new Error(`Divisa fuera del catálogo: ${code}`);
  return info;
}

export function isForeignCurrency(value: unknown): value is ForeignCurrency {
  return typeof value === 'string' && byCode.has(value as ForeignCurrency);
}

/**
 * La tasa de muestra de una divisa, o `undefined` si nadie la definió.
 *
 * `undefined` no es un fallo: es el estado normal de once de las doce mientras
 * D7 siga abierta, y es lo que mantiene esa divisa fuera del selector.
 */
export function rateFor(
  code: ForeignCurrency,
  env: Record<string, unknown>,
  fallback?: number
): number | undefined {
  const raw = env[currencyInfo(code).envVar];
  const parsed = typeof raw === 'string' ? Number(raw) : Number.NaN;
  if (Number.isFinite(parsed) && parsed > 0) return parsed;
  return fallback;
}

/**
 * Las divisas que el sitio puede ofrecer hoy: las que tienen tasa.
 *
 * El dólar lleva un valor por omisión —el que `ConfigPriceSource` ya usaba— así
 * que nunca desaparece del selector aunque nadie defina nada. Las otras once
 * aparecen una a una, en el orden del catálogo, a medida que Sebastián fije su
 * tasa.
 */
export function availableCurrencies(
  env: Record<string, unknown>,
  defaultUsdRate: number
): readonly CurrencyInfo[] {
  return currencies.filter(
    (c) => rateFor(c.code, env, c.code === DEFAULT_CURRENCY ? defaultUsdRate : undefined) !== undefined
  );
}

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
   * La tasa de MUESTRA, en CLP por 1 unidad. **Es un marcador de posición, no
   * un precio.**
   *
   * Sebastián pidió el 2026-10-22 que el cotizador funcionara con tasas de
   * muestra en vez de esperar a las definitivas, y esto es eso: números de
   * orden de magnitud, calculados sobre la tasa de muestra del dólar, para que
   * la herramienta se pueda ver y probar. **Ninguno está verificado contra el
   * mercado**, y los de monedas que se mueven rápido —bolívar, peso argentino—
   * envejecen en días.
   *
   * Lo que impide que esto se publique: `assertRatesConfirmed`, que detiene el
   * build con `PUBLIC_ALLOW_INDEXING=true` mientras alguna divisa siga
   * corriendo con su muestra. El sitio público necesita las doce confirmadas.
   *
   * REQUIERE VALIDACIÓN DE COMPLIANCE — las doce tasas (D7).
   */
  sample: number;
  /**
   * La variable de entorno que SUSTITUYE la muestra, en CLP por 1 unidad.
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
  /** El nombre, para la unidad del precio: «CLP por euro». */
  n: string;
}

export const DEFAULT_CURRENCY: ForeignCurrency = 'USD';

export const currencies: readonly CurrencyInfo[] = [
  { code: 'USD', name: 'dólar',           plural: 'dólares',         destinations: ['Estados Unidos', 'Ecuador'], sample: 919.70,  decimals: 2, envVar: 'PUBLIC_QUOTE_SAMPLE_RATE' },
  { code: 'EUR', name: 'euro',            plural: 'euros',           destinations: ['Europa'],                    sample: 993,     decimals: 2, envVar: 'PUBLIC_QUOTE_RATE_EUR' },
  { code: 'ARS', name: 'peso argentino',  plural: 'pesos argentinos', destinations: ['Argentina'],                 sample: 0.92,    decimals: 2, envVar: 'PUBLIC_QUOTE_RATE_ARS' },
  { code: 'BOB', name: 'boliviano',       plural: 'bolivianos',      destinations: ['Bolivia'],                   sample: 133,     decimals: 2, envVar: 'PUBLIC_QUOTE_RATE_BOB' },
  { code: 'BRL', name: 'real',            plural: 'reales',          destinations: ['Brasil'],                    sample: 165,     decimals: 2, envVar: 'PUBLIC_QUOTE_RATE_BRL' },
  { code: 'CNY', name: 'yuan',            plural: 'yuanes',          destinations: ['China'],                     sample: 129,     decimals: 2, envVar: 'PUBLIC_QUOTE_RATE_CNY' },
  { code: 'COP', name: 'peso colombiano', plural: 'pesos colombianos', destinations: ['Colombia'],                  sample: 0.23,    decimals: 0, envVar: 'PUBLIC_QUOTE_RATE_COP' },
  { code: 'JPY', name: 'yen',             plural: 'yenes',           destinations: ['Japón'],                     sample: 5.98,    decimals: 0, envVar: 'PUBLIC_QUOTE_RATE_JPY' },
  { code: 'PEN', name: 'sol',             plural: 'soles',           destinations: ['Perú'],                      sample: 248,     decimals: 2, envVar: 'PUBLIC_QUOTE_RATE_PEN' },
  { code: 'PYG', name: 'guaraní',         plural: 'guaraníes',       destinations: ['Paraguay'],                  sample: 0.12,    decimals: 0, envVar: 'PUBLIC_QUOTE_RATE_PYG' },
  { code: 'UYU', name: 'peso uruguayo',   plural: 'pesos uruguayos', destinations: ['Uruguay'],                   sample: 23,      decimals: 2, envVar: 'PUBLIC_QUOTE_RATE_UYU' },
  { code: 'VES', name: 'bolívar',         plural: 'bolívares',       destinations: ['Venezuela'],                 sample: 25,      decimals: 2, envVar: 'PUBLIC_QUOTE_RATE_VES' },
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
export function rateFor(code: ForeignCurrency, env: Record<string, unknown>): number {
  return confirmedRate(code, env) ?? currencyInfo(code).sample;
}

/** La tasa que alguien confirmó, o nada. Lo segundo es hoy el caso de las doce. */
export function confirmedRate(
  code: ForeignCurrency,
  env: Record<string, unknown>
): number | undefined {
  const raw = env[currencyInfo(code).envVar];
  const parsed = typeof raw === 'string' ? Number(raw) : Number.NaN;
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
}

/** Las que siguen corriendo con su marcador de posición. */
export function unconfirmed(env: Record<string, unknown>): readonly ForeignCurrency[] {
  return currencies.filter((c) => confirmedRate(c.code, env) === undefined).map((c) => c.code);
}

/**
 * Las divisas que el cotizador ofrece.
 *
 * **Son las doce desde el 2026-10-22**, porque todas tienen tasa: la confirmada
 * si alguien la puso, y si no, la de muestra. Hasta ese día sólo aparecían las
 * que tuvieran variable de entorno, y eso dejaba el selector con una sola
 * opción — correcto, y también invisible.
 *
 * **Lo que sustituye a aquel filtro es `assertRatesConfirmed`**, en el build:
 * las muestras se pueden ver y probar en Staging, y no pueden salir al sitio
 * público. El guardarraíl se movió de sitio, no desapareció.
 */
export function availableCurrencies(): readonly CurrencyInfo[] {
  return currencies;
}

/** Un destino del cotizador: el país, y la divisa en que llega. */
export interface Destino {
  destino: string;
  code: ForeignCurrency;
}

/** El destino que el cotizador trae elegido al abrir: el de siempre, el dólar. */
export const DEFAULT_DESTINO = 'Estados Unidos';

/**
 * Los destinos del cotizador, por país y en orden alfabético (entrega
 * `cotizador-`, 2026-10-22).
 *
 * El cotizador dejó de preguntar «¿a qué moneda?» y pregunta «¿a dónde
 * envías?»: así se piensa un envío, y la moneda sale sola. Son trece, uno más
 * que las divisas, porque el dólar sirve a dos —Estados Unidos y Ecuador—.
 * **Se derivan del catálogo y no se escriben aparte**: una divisa nueva trae
 * sus destinos consigo y aparece acá sin tocar nada más.
 */
export function destinos(): readonly Destino[] {
  return availableCurrencies()
    .flatMap((c) => c.destinations.map((destino) => ({ destino, code: c.code })))
    .sort((a, b) => a.destino.localeCompare(b.destino, 'es'));
}

/**
 * Detiene el build si el sitio va a indexarse con alguna tasa de muestra viva.
 *
 * ── Por qué existe ─────────────────────────────────────────────────────────
 *
 * Las doce tasas del catálogo son **marcadores de posición**: órdenes de
 * magnitud sobre la tasa de muestra del dólar, no precios. Sirven para que el
 * cotizador se pueda ver y probar mientras D7 sigue abierta, que es lo que
 * Sebastián pidió el 2026-10-22.
 *
 * Lo que no pueden hacer es salir al sitio público. `CLAUDE.md` §3 y §7
 * prohíben publicar datos comercialmente sensibles sin firma, y un precio de
 * cambio lo es sin discusión. **El gesto de salir a producción es definir
 * `PUBLIC_ALLOW_INDEXING`** (§0.1), así que es ahí donde se comprueba: con la
 * indexación abierta, cada divisa necesita su variable.
 *
 * Es el mismo patrón que `assertPublishableSiteUrl`, y por el mismo motivo: una
 * regla que depende de que alguien se acuerde no es una regla.
 *
 * **No basta con que la tasa exista: tiene que ser distinta de la muestra.**
 * Copiar el número del catálogo a la variable pasaría la comprobación sin que
 * nadie hubiera mirado un precio, y es justo lo que haría alguien con prisa.
 *
 * @throws si falta alguna, con la lista y qué hacer.
 */
export function assertRatesConfirmed(env: Record<string, unknown>): void {
  const faltan = currencies.filter((c) => {
    const r = confirmedRate(c.code, env);
    return r === undefined || r === c.sample;
  });
  if (faltan.length === 0) return;

  throw new Error(
    'Indexación abierta con tasas de muestra sin confirmar.\n\n' +
      `  Faltan ${faltan.length} de ${currencies.length}: ` +
      faltan.map((c) => c.code).join(', ') +
      '\n\n' +
      '  Las tasas del catálogo son marcadores de posición, no precios, y el\n' +
      '  sitio público no puede publicarlas (CLAUDE.md §3 y §7, D7). Defínelas\n' +
      '  en el entorno de despliegue, con un valor distinto del de muestra:\n\n' +
      faltan.map((c) => `      ${c.envVar}=   # ${c.name}`).join('\n') +
      '\n'
  );
}

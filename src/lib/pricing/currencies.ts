/**
 * El catálogo de divisas del cotizador (ADR-0013, 2026-10-21; rehecho con el
 * tarifario el 2026-10-27).
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
 * ── Once destinos, nueve divisas (2026-10-27) ──────────────────────────────
 *
 * **La lista ya no la decide este archivo: la decide el tarifario**
 * (`tarifario.ts`). Sebastián fijó el 2026-10-27 que se cotiza donde hay una
 * tarifa, así que el catálogo tiene las divisas de esos destinos y nada más:
 *
 * - **salen** Bolivia, Ecuador, Japón, Paraguay, Uruguay y Venezuela, que no
 *   tienen tarifa, y con ellos BOB, JPY, PYG, UYU y VES;
 * - **China llega en dólares** («USD China» en el tarifario), así que sale
 *   también el yuan;
 * - **entran** México (MXN), Costa Rica (CRC), Sudáfrica (ZAR) y Panamá, que
 *   llega en dólares.
 *
 * Del 21 al 27 de octubre fueron trece destinos y doce divisas; el historial
 * guarda la lista. `destinations` sigue siendo una lista y no un nombre: el
 * dólar sirve a tres —Estados Unidos, China y Panamá—, y cada uno con su
 * propia tarifa, porque lo que cuesta enviar depende de a dónde y no de en qué.
 */

import tasasJson from './tasas.json' with { type: 'json' };

/** Las divisas de destino. El peso chileno no es una de ellas: es el origen. */
export type ForeignCurrency =
  | 'USD'
  | 'EUR'
  | 'ARS'
  | 'BRL'
  | 'COP'
  | 'CRC'
  | 'MXN'
  | 'PEN'
  | 'ZAR';

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
   * La tasa de MUESTRA, en CLP por 1 unidad. **Desde el 2026-11-10 es la tasa
   * de referencia de mercado del día, que `tasas.json` trae sola** (ADR-0019,
   * y la nota sobre el catálogo, abajo). Lo que sigue es de antes, y lo del
   * freno de producción sigue valiendo entero.
   *
   * Sebastián pidió el 2026-10-22 que el cotizador funcionara con tasas de
   * muestra en vez de esperar a las definitivas, y esto es eso: números para
   * que la herramienta se pueda ver y probar. **Desde el 2026-10-29, ocho son
   * las de una cotización pública leída ese día** (ver la nota sobre el
   * catálogo, abajo); el rand sigue siendo un orden de magnitud. Ninguna es
   * una fuente, y las de monedas que se mueven rápido —el peso argentino—
   * envejecen en horas.
   *
   * Lo que impide que esto se publique: `assertRatesConfirmed`, que detiene el
   * build con `PUBLIC_ALLOW_INDEXING=true` mientras alguna divisa siga
   * corriendo con su muestra. El sitio público necesita las nueve confirmadas.
   *
   * REQUIERE VALIDACIÓN DE COMPLIANCE — las nueve tasas (D7).
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

/** Las tasas de referencia y cuándo las publicó la fuente (ADR-0019). */
const { tasas } = tasasJson as { tasas: Record<ForeignCurrency, number> };
export const tasasActualizadas: Date = new Date(tasasJson.actualizado);

/*
  **Las tasas salen de `tasas.json`, que se actualiza solo** (ADR-0019,
  2026-11-10). Un proceso de GitHub (`.github/workflows/tasas.yml`) corre dos
  veces al día —a las 07:00 y a las 12:00 de Chile en verano—, pide la tasa de
  referencia de mercado a la API abierta de ExchangeRate-API y, si cambió,
  hace un commit con el archivo. Ese push despliega Staging como cualquier
  otro. El navegador no consulta a nadie: la tasa viaja escrita en el HTML.

  - **Es una tasa de mercado, sin recargo**, que es lo que el modelo de precio
    (CLAUDE.md §1) y la tarjeta del cotizador dicen. Lo que DLPay cobra va
    aparte, en `tarifario.ts`.
  - **Cambia una vez al día**: la fuente gratuita se actualiza hacia las 21:00
    de Chile. La segunda ejecución del día casi siempre no encuentra nada.
  - **El peso argentino es el oficial.** Argentina tiene más de una cotización
    y una fuente genérica da ésa. PENDIENTE DE DECISIÓN — si el ejecutivo
    opera con otra, el peso argentino necesita una fuente propia (Sebastián).
  - **Siguen sin poder publicarse**: `assertRatesConfirmed` no cambia, y con
    la indexación abierta cada divisa sigue necesitando su variable.

  *Del 2026-10-29 al 2026-11-10 las muestras fueron las tasas que mostraba el
  cotizador de Global66 el 29 a las 09:48, con CLP 500.000, a pedido de
  Sebastián. Se retiraron porque son la tasa al cliente de otro servicio, con
  su margen dentro, y la tarjeta dice «sin recargo». Antes de eso eran órdenes
  de magnitud sobre un dólar de 919,70.*

  REQUIERE VALIDACIÓN DE COMPLIANCE — las nueve tasas y su fuente (D7).
*/
export const currencies: readonly CurrencyInfo[] = [
  { code: 'USD', name: 'dólar',           plural: 'dólares',           destinations: ['Estados Unidos', 'China', 'Panamá'], sample: tasas.USD, decimals: 2, envVar: 'PUBLIC_QUOTE_SAMPLE_RATE' },
  { code: 'EUR', name: 'euro',            plural: 'euros',             destinations: ['Europa'],     sample: tasas.EUR, decimals: 2, envVar: 'PUBLIC_QUOTE_RATE_EUR' },
  { code: 'ARS', name: 'peso argentino',  plural: 'pesos argentinos',  destinations: ['Argentina'],  sample: tasas.ARS, decimals: 2, envVar: 'PUBLIC_QUOTE_RATE_ARS' },
  { code: 'BRL', name: 'real',            plural: 'reales',            destinations: ['Brasil'],     sample: tasas.BRL, decimals: 2, envVar: 'PUBLIC_QUOTE_RATE_BRL' },
  { code: 'COP', name: 'peso colombiano', plural: 'pesos colombianos', destinations: ['Colombia'],   sample: tasas.COP, decimals: 0, envVar: 'PUBLIC_QUOTE_RATE_COP' },
  { code: 'CRC', name: 'colón',           plural: 'colones',           destinations: ['Costa Rica'], sample: tasas.CRC, decimals: 0, envVar: 'PUBLIC_QUOTE_RATE_CRC' },
  { code: 'MXN', name: 'peso mexicano',   plural: 'pesos mexicanos',   destinations: ['México'],     sample: tasas.MXN, decimals: 2, envVar: 'PUBLIC_QUOTE_RATE_MXN' },
  { code: 'PEN', name: 'sol',             plural: 'soles',             destinations: ['Perú'],       sample: tasas.PEN, decimals: 2, envVar: 'PUBLIC_QUOTE_RATE_PEN' },
  { code: 'ZAR', name: 'rand',            plural: 'rands',             destinations: ['Sudáfrica'],  sample: tasas.ZAR, decimals: 2, envVar: 'PUBLIC_QUOTE_RATE_ZAR' },
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
 * `undefined` no es un fallo: es el estado normal de casi todas mientras D7 siga
 * abierta, y lo que hace es dejar esa divisa en su muestra.
 */
export function rateFor(code: ForeignCurrency, env: Record<string, unknown>): number {
  return confirmedRate(code, env) ?? currencyInfo(code).sample;
}

/** La tasa que alguien confirmó, o nada. Lo segundo es hoy el caso de las nueve. */
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
 * **Son todas las del catálogo desde el 2026-10-22** —nueve desde el 27—,
 * porque todas tienen tasa: la confirmada
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
 * envías?»: así se piensa un envío, y la moneda sale sola. **Son once desde el
 * 2026-10-27**, dos más que las divisas, porque el dólar sirve a tres
 * —Estados Unidos, China y Panamá—. Se derivan del catálogo y no se escriben
 * aparte, y **cada uno tiene que tener su tarifa** en `tarifario.ts`:
 * `tests/tarifario.test.ts` falla si un destino queda sin ella o una tarifa
 * sin destino.
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
 * Las tasas del catálogo son **marcadores de posición**: órdenes de
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

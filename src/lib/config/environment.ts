/**
 * Resolución de la configuración de entorno — ÚNICA implementación.
 *
 * Este módulo es PURO: no lee `import.meta.env` ni `process.env`. Recibe el
 * entorno como argumento, y por eso pueden consumirlo los dos runtimes que
 * necesitan estos valores y que leen el entorno de formas distintas:
 *
 *   · `astro.config.mjs`       → `loadEnv()` de Vite, antes de que Astro exista
 *   · `src/lib/config/site.ts` → `import.meta.env`, durante el render
 *
 * Antes cada uno resolvía la URL por su cuenta, con su propio valor por defecto
 * a `localhost`, y la guarda vivía sólo en el primero. Eso dejaba validada la
 * mitad de las URL publicadas: el sitemap y el robots venían de `Astro.site`,
 * pero canonical, Open Graph, Twitter y el JSON-LD venían del otro lector, sin
 * comprobar nada. Con una sola función no hay dos verdades que puedan divergir.
 *
 * Ser puro es también lo que lo hace testeable con el runner de Node, sin DOM y
 * sin levantar un build.
 */

/**
 * Sólo las variables que estos resolutores necesitan. Cualquier fuente que
 * cumpla esta forma sirve — `import.meta.env`, el resultado de `loadEnv`, o un
 * objeto literal en un test.
 */
export interface SiteEnv {
  readonly PUBLIC_SITE_URL?: string | undefined;
  readonly PUBLIC_ALLOW_INDEXING?: string | undefined;
  readonly PUBLIC_QUOTE_MIN_CLP?: string | undefined;
  readonly PUBLIC_QUOTE_MAX_CLP?: string | undefined;
}

/**
 * Origen del servidor de desarrollo de Astro. Es el valor con el que se trabaja
 * en local y **nunca** un valor válido para un build.
 */
export const DEV_SITE_URL = 'http://localhost:4321';

/**
 * Nombres de host que sólo resuelven en la máquina de quien desarrolla.
 * Publicarlos en un canonical o en el sitemap es publicar una URL que nadie
 * fuera de esa máquina puede abrir — y hacerlo en silencio, porque el build
 * sale verde y las páginas se ven bien.
 */
const LOCAL_HOSTNAMES = new Set(['localhost', '127.0.0.1', '0.0.0.0', '::1', '[::1]']);

/** Sufijos reservados para desarrollo y redes locales. */
const LOCAL_SUFFIXES = ['.localhost', '.local', '.test', '.internal'];

/** `true` si el host sólo tiene sentido dentro de la red de quien desarrolla. */
function isLocalHostname(hostname: string): boolean {
  const host = hostname.toLowerCase();
  return LOCAL_HOSTNAMES.has(host) || LOCAL_SUFFIXES.some((suffix) => host.endsWith(suffix));
}

/** Resultado de validar la URL: o sirve para publicar, o se explica por qué no. */
type Validation = { readonly ok: true; readonly url: string } | { readonly ok: false; readonly reason: string };

/**
 * Comprueba que el valor sea una URL canónica publicable y la normaliza.
 *
 * Normaliza quitando la barra final para que exista una sola forma del valor:
 * `${site.url}/sitemap.xml` y `new URL(path, site.url)` se comportan igual sin
 * que cada consumidor tenga que recortar la barra por su cuenta.
 */
export function validateSiteUrl(raw: string | undefined): Validation {
  if (raw === undefined || raw.trim() === '') {
    return { ok: false, reason: 'no está definida' };
  }

  let url: URL;
  try {
    url = new URL(raw.trim());
  } catch {
    return { ok: false, reason: `no es una URL válida: ${raw}` };
  }

  if (isLocalHostname(url.hostname)) {
    return {
      ok: false,
      reason: `apunta a un host local (${url.hostname}), que sólo resuelve en esta máquina`,
    };
  }

  // Un canonical sobre http invita al buscador a indexar la versión insegura, y
  // a estas alturas no hay motivo legítimo para publicar así. En la práctica es
  // casi siempre un esquema mal escrito.
  if (url.protocol !== 'https:') {
    return { ok: false, reason: `un sitio publicado va sobre https, no sobre ${url.protocol}` };
  }

  // El sitio se sirve en la raíz del dominio. Una ruta aquí no funcionaría sin
  // configurar además `base` en Astro, y el fallo aparecería como enlaces
  // internos rotos, no como un error de build.
  if (url.pathname !== '/') {
    return {
      ok: false,
      reason: `debe apuntar a la raíz del dominio, sin ruta (sobra "${url.pathname}")`,
    };
  }

  if (url.search !== '' || url.hash !== '') {
    return { ok: false, reason: 'no admite parámetros ni fragmento' };
  }

  return { ok: true, url: url.origin };
}

/**
 * URL del sitio para trabajar: la configurada si es publicable, y el origen de
 * desarrollo si no.
 *
 * El respaldo a `localhost` existe para `astro dev`, donde es la respuesta
 * correcta. No es un agujero: `assertPublishableSiteUrl` corre antes de
 * cualquier build, así que un valor inválido no puede llegar a una página
 * publicada.
 */
export function resolveSiteUrl(env: SiteEnv): string {
  const result = validateSiteUrl(env.PUBLIC_SITE_URL);
  return result.ok ? result.url : DEV_SITE_URL;
}

/**
 * Exige una URL publicable, o detiene el build con el motivo exacto.
 *
 * La llama la guarda de `astro.config.mjs` cuando Astro declara que el comando
 * es `build`. Comprueba la URL, no la presencia de la variable: la versión
 * anterior aceptaba `http://localhost:4321` como "valor definido" y publicaba
 * localhost en canonical, Open Graph, JSON-LD, sitemap y robots — con el build
 * en verde.
 */
export function assertPublishableSiteUrl(env: SiteEnv): string {
  const result = validateSiteUrl(env.PUBLIC_SITE_URL);
  if (result.ok) return result.url;

  throw new Error(
    `\n\n  PUBLIC_SITE_URL ${result.reason}.\n\n` +
      '  De ella salen canonical, Open Graph, el JSON-LD, el sitemap y el\n' +
      '  robots.txt. Un valor inválido no rompe nada visible: el build sale\n' +
      '  verde y el daño aparece cuando un buscador indexa esas URL o alguien\n' +
      '  comparte el enlace. Por eso se detiene aquí.\n\n' +
      '  Defínela en el entorno de despliegue:\n\n' +
      '      PUBLIC_SITE_URL=https://dlpay.cl\n\n' +
      '  Para verificar un build en local, pásala en la misma línea:\n\n' +
      '      PUBLIC_SITE_URL=https://dlpay.cl npm run build\n'
  );
}

/**
 * ¿Puede este despliegue ser indexado por buscadores?
 *
 * Cerrado por defecto, y a propósito: sólo el literal `'true'` abre la puerta.
 * Cualquier otra cosa —ausente, vacía, `1`, `yes`, un typo— responde que no.
 *
 * El riesgo que cubre es concreto. Staging sirve las nueve rutas del sitio,
 * entre ellas `/terminos/` y `/privacidad/`, que hoy son páginas de estado
 * pendientes de Compliance (CLAUDE.md §13, D9/D19/D20). Que un buscador las
 * publique bajo la marca DLPay es exactamente lo que no debe pasar, y el modo
 * seguro tiene que ser el que se obtiene por omisión, no el que hay que
 * acordarse de activar.
 */
export function allowsIndexing(env: SiteEnv): boolean {
  return env.PUBLIC_ALLOW_INDEXING === 'true';
}

/** Límites y monto de muestra del cotizador, en pesos. */
export interface QuoteLimits {
  /** Bajo este monto el cotizador no opera y lo dice. */
  readonly minPayClp: number;
  /** Sin definir, el estado `above_max` no se activa. */
  readonly maxPayClp: number | undefined;
  /** El monto con el que se carga el cotizador y con el que se dibujan todas las ilustraciones. */
  readonly samplePayClp: number;
}

/** Entero positivo o nada: una cifra de dinero no admite basura ni ceros. */
function positiveInt(raw: string | undefined): number | undefined {
  const n = Number(raw);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : undefined;
}

/**
 * Los límites del cotizador, resueltos UNA sola vez.
 *
 * Cierra D24. Antes `PUBLIC_QUOTE_MIN_CLP` se leía en tres archivos —el
 * cotizador que lo APLICA, `/tarifas` que lo PUBLICA y el mockup— cada uno con
 * su propio `50000` por defecto, y el monto de muestra `2_000_000` estaba
 * copiado en cuatro componentes de la Home. Coincidían por disciplina, no por
 * construcción: bastaba que alguien cambiara un valor por defecto para que la
 * web publicara un mínimo y aplicara otro. Ahora hay un solo valor y un solo
 * sitio donde cambiarlo.
 *
 * **El mínimo real es CLP 500.000**, confirmado por Sebastián el 2026-09-25.
 * Hasta ese día el valor por defecto era `50_000` y estaba marcado como
 * placeholder; con esto se cierra la mitad de **D6**.
 *
 * **Y `samplePayClp` también está confirmado**: CLP 2.000.000, ratificado por
 * Sebastián el mismo día. Con eso **D6 se cierra entera**.
 *
 * Conviene no confundir tres cosas que el registro llamaba parecido:
 *
 *   · `minPayClp`   — el mínimo que se APLICA y se PUBLICA. Dato de negocio.
 *   · `samplePayClp`— el monto que el cotizador trae escrito al abrir. Es
 *                     presentación: no bloquea nada y no afirma nada.
 *   · **el precio** — la tasa con la que se cotiza, que NO vive acá sino en
 *                     `ConfigPriceSource` (`PUBLIC_QUOTE_SAMPLE_RATE`, hoy
 *                     919,70). Ése es el que sigue abierto, y es **D7**, no D6.
 * **D21 cerrada el 2026-09-29: no hay tope.** Sebastián decidió no publicar un
 * monto máximo, así que `PUBLIC_QUOTE_MAX_CLP` se queda sin definir y el estado
 * `above_max` nunca se produce. **No es un pendiente: es la decisión.**
 *
 * `maxPayClp` sigue siendo opcional y la comprobación sigue en `resolveState`,
 * porque poner un tope el día que haga falta es definir la variable y nada más.
 * Lo que eso conserva sin uso está declarado en `lib/pricing/types.ts`.
 *
 * *Por qué sin tope, dicho una vez para no repetir la conversación:* publicar un
 * techo le dice a una empresa grande que no la quieres, y `/tarifas` ya publica
 * lo contrario — «las operaciones de mayor volumen se conversan con el
 * ejecutivo». Un monto absurdo lo filtra el ejecutivo en el chat, que es donde
 * siempre iba a terminar.
 */
export function resolveQuoteLimits(env: SiteEnv): QuoteLimits {
  return {
    minPayClp: positiveInt(env.PUBLIC_QUOTE_MIN_CLP) ?? 500_000,
    maxPayClp: positiveInt(env.PUBLIC_QUOTE_MAX_CLP),
    samplePayClp: 2_000_000,
  };
}

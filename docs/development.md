# Desarrollo

## Requisitos

**Node.js** — LTS. Verificado funcionando con **v24.20.0 / npm 11.19.0**.
Si no está instalado: `.pkg` de macOS desde <https://nodejs.org> (elegir LTS), o
`brew install node`, o `fnm install --lts`.

## Puesta en marcha

```
npm install
npm run dev        # http://localhost:4321
```

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo con recarga en caliente |
| `npm run build` | Genera el sitio estático en `dist/`. **Exige `PUBLIC_SITE_URL`** — ver abajo |
| `npm run preview` | Sirve `dist/` localmente, como en producción |
| `npm run check` | Verificación de tipos (`astro check`) |
| `npm test` | Tests de la lógica del cotizador y de la guarda de despliegue (runner nativo de Node) |

`build` verde **no** equivale a "terminado" (`CLAUDE.md` §9).

### El build exige una URL canónica publicable

`npm run dev` no necesita nada: usa `http://localhost:4321`. **Un build sí**, y falla a propósito
si la variable falta o no sirve para publicar:

```
PUBLIC_SITE_URL=https://dlpay.cl npm run build
```

Rechaza hosts locales (`localhost`, `127.0.0.1`, `*.local`…), lo que no sea `https`, rutas que no
sean la raíz del dominio, y parámetros o fragmento. La razón: de esa variable salen canonical, Open
Graph, el JSON-LD, el sitemap y el robots. Un valor inválido **no rompe nada visible** —el build
sale verde y las páginas se ven bien—, y el daño aparece cuando un buscador indexa esas URL.

**La indexación va cerrada por omisión.** Sin `PUBLIC_ALLOW_INDEXING=true`, todas las páginas
llevan `noindex, nofollow` y el robots emite `Disallow: /`. Se abre **sólo** en el despliegue del
sitio público. Cada build declara en su salida qué política aplicó, así que no hace falta
adivinarlo:

```
[dlpay:deploy-guard] URL canónica: https://dlpay.cl
[dlpay:deploy-guard] Indexación PERMITIDA — este build es para el sitio público.
```

Ambas variables las valida la integración `dlpay:deploy-guard` de `astro.config.mjs`, que pregunta
a Astro **qué está haciendo** (`command === 'build'`) en vez de cómo lo invocaron. No se puede
esquivar llamando a `astro build` directamente. Detalle en
`docs/arquitectura-produccion.md` §5.3.

## Estructura

```
src/
├── pages/            # una ruta por página — las once de la AI v1, más el blog
│   ├── index.astro · como-funciona · empresas · confianza
│   ├── terminos · privacidad · tarifas · canal-de-denuncias
│   ├── blog/index.astro · blog/[slug].astro  # índice + una página por artículo
│   └── sitemap.xml.ts · robots.txt.ts   # generados, no a mano
├── layouts/
│   ├── Base.astro    # el ÚNICO <head> del sitio: SEO, tokens, escudo noindex
│   └── Legal.astro   # envuelve a Base para los cuatro documentos legales
├── components/
│   ├── Quoter.astro       # la única isla interactiva
│   ├── Motion.astro       # motor del Motion System V1 (IntersectionObserver)
│   ├── Steps.astro        # bloque contenido en tinta: argumento + tarjeta + chat
│   ├── Process.astro      # los 4 pasos en zig-zag, con un teléfono cada uno
│   ├── WhatsAppMockup.astro # el teléfono en CSS. Dos variantes: proof y bare
│   ├── MacbookMockup.astro  # el portátil en CSS del encabezado de /empresas
│   ├── FiguraCaso.astro     # los cuatro objetos de «Para qué lo usan» en /empresas
│   ├── ComparaEmpresa.astro # persona y empresa: la tabla en dos carriles
│   ├── ComoEmpezamos.astro  # la carpeta «Ten esto a mano» y los cuatro pasos
│   ├── AlcanceEmpresa.astro # el relevo: hasta dónde llega nuestra parte, en /empresas
│   ├── FiguraMecanismo.astro # los objetos de mecanismo: /confianza, la Home y /tarifas (5 tipos)
│   ├── CarpetaRequisitos.astro # la carpeta de «Qué te pedimos, y por qué»
│   ├── FiguraUso.astro      # los tres objetos de «Tres formas de usarlo» en la Home
│   ├── Carpeta.astro        # la carpeta: pestaña, cuerpo y el kit de «Ten esto a mano» (tres páginas)
│   ├── hero/GloboRotativo.astro # el globo de la Home (SVG + datos en línea)
│   ├── Header · Footer · Hero · PageHero · Trust · UseCases
│   ├── Business · Faq · Alliances · AnnouncementBar · PortadaDato
│   ├── Icon · Logo · PendingNotice
│   └── ui/                # IconBadge, ArrowLink — sólo donde corresponden
├── content.config.ts # esquema de la colección del blog (Content Layer)
├── content/          # dato tipado, separado de la presentación
│   ├── home.ts · process.ts · trust.ts · business.ts
│   └── blog/         # los artículos en markdown y sus portadas
├── styles/
│   ├── fonts.css     # @font-face del set T-C, auto-hospedado
│   └── tokens.css    # espejo del Design System V1 + gate del Motion System
│                     # (cuatro tokens sin uso hoy y a propósito — ver «Tokens reservados»)
└── lib/
    ├── config/
    │   ├── environment.ts   # resolución y validación del entorno — PURO
    │   ├── site.ts          # marca, contacto, enlaces a Guita, URL, indexación
    │   └── alliances.ts     # FinteChile y UAF, con el alcance de cada claim
    └── pricing/             # types · config-price-source · quote · format
public/
├── fonts/            # woff2 variables + sus licencias OFL
└── alianzas/         # emblemas de FinteChile y UAF
tests/                # pricing · config (runner nativo de Node)
```

Las carpetas se crean **cuando una necesidad real las pide**, no antes (Principio 5).

`lib/config/environment.ts` es puro a propósito: no lee `import.meta.env` ni `process.env`, recibe
el entorno como argumento. Es lo que permite que lo consuman los dos runtimes que leen el entorno
de forma distinta —`astro.config.mjs` con `loadEnv`, `site.ts` con `import.meta.env`— sin duplicar
la lógica, y lo que lo hace testeable sin levantar un build.

### Qué pasó con el zig-zag de los pasos (2026-09-08 / 09)

Un cambio en dos movimientos que conviene leer junto, porque el nombre de los archivos no lo
cuenta:

1. **`Steps.astro` dejó de ser el zig-zag** y pasó a ser el bloque contenido en tinta —argumento y
   acción a un lado, la operación dibujada al otro—. Con eso **`StepFigure.astro` quedó sin
   consumidores y se borró**, junto al array `steps` de `content/home.ts` que lo alimentaba
   (Principio 5). No se perdió información del sitio: `/como-funciona/` cubre los seis pasos con
   más detalle que los cuatro que tenía la Home.
2. **`Process.astro` es un zig-zag nuevo y distinto**, no el anterior recuperado. El viejo
   alternaba figuras *abstractas* —cuñas, topologías— que había que descifrar después de leer el
   texto; este muestra la conversación literal en un teléfono, así que se entiende sin leer. Es la
   diferencia entre un diagrama y una captura.

`WhatsAppMockup.astro` sirve a los dos mundos con una prop `variant`:

- **`proof`** — teléfono con pie explicativo, oculto bajo 900px. **Hoy sin consumidores.** Se
  conserva porque es el modo que mantiene la regla dura: sin la prop `thread`, el texto de la
  burbuja sale de `whatsappMessage()`, la misma función que arma el enlace del botón, así que es
  imposible que el mockup prometa un mensaje distinto del que se envía. Es lo que se querría si
  vuelve a hacer falta un bloque de prueba autónomo.
- **`bare`** — sólo el dispositivo, visible en todos los anchos. Lo usa `Process.astro` cuatro
  veces, con hilos **narrativos** que quedan fuera de esa garantía a propósito.

### Tokens reservados: sin uso hoy, y a propósito

Un barrido de `var(--…)` encuentra **tres tokens de `tokens.css` que ningún archivo consume**. Los
tres se conservan porque expresan una intención del sistema, no porque se haya olvidado borrarlos:

| Token | Por qué sigue |
|---|---|
| `--sube` | Par semántico de `--baja` (que sí se usa): el color de «precio que sube». Lo consumirá el estado `market_moving` del cotizador, hoy inalcanzable sin fuente de precio real (D7). Borrarlo obliga a reinventarlo cuando llegue. |
| `--f-display` | Alias de `--f-text`, porque T-C usa una sola familia. Es la **costura** del Design System §3: el día que display y texto se separen tipográficamente, es el único punto de cambio. |
| `--r-0` | El cero de la escala de radios. Nadie lo invoca porque se escribe `0`, pero la escala se lee completa (0 · 3 · 6 · 10 · 14 · 20). |
| `--aviso` | El ámbar de aviso **sobre tinta**. Sobre superficie clara no alcanza el contraste, y por eso existe `--aviso-deep`, que es el que se usa hoy. Se conserva para el día que haya un aviso sobre una banda oscura; borrarlo obliga a recalcular el par. *Añadido a esta tabla el 2026-09-15: llevaba tiempo sin uso y sin justificación escrita, y una auditoría externa lo marcó.* |

Coste de conservarlos: tres líneas. Si una auditoría futura los vuelve a marcar, la respuesta está
aquí.

## Dependencias instaladas

**Cuatro** paquetes declarados, con la justificación que exige `CLAUDE.md` §8. Ninguno llega al
navegador: los cuatro son de build.

| Paquete | Tipo | Por qué |
|---|---|---|
| `astro` | dependencia | El framework (ADR-0002). Nada más lo reemplaza. |
| `@astrojs/check` | desarrollo | Verificación de tipos en archivos `.astro`; sin ella `tsconfig` strict no cubre las páginas. |
| `typescript` | desarrollo | Requerido por `@astrojs/check`. |
| `@types/node` | desarrollo | Tipos de los módulos `node:` que usan los tests. Sin ellos `astro check` no puede verificarlos. |

**Tests sin dependencias:** se usa el runner nativo `node --test`, que además ejecuta
TypeScript directamente. No hay Vitest, Jest ni ningún framework de test instalado.

**Cero dependencias de estilo** (ADR-0004) y **cero framework de UI** (ADR-0002 §3).
Antes de añadir cualquier paquete, responder por escrito el cuestionario de `CLAUDE.md` §8.

La telemetría anónima de Astro está **desactivada** (`astro telemetry disable`), por
coherencia con el Principio 10.

## Tipografía

Set **T-C**: Familjen Grotesk (títulos y texto) + Spline Sans Mono (cifras). Ambas
variables, SIL OFL 1.1, **auto-hospedadas** en `public/fonts/` con sus licencias al
lado. Nunca se cargan desde un CDN de terceros.

> **Los dos `*-OFL.txt` de `public/fonts/` no los referencia ningún código, y aun así NO se
> borran.** La licencia SIL Open Font License 1.1 exige que su texto acompañe a las fuentes que se
> distribuyen, y servir los `woff2` desde `public/` es distribuirlas. Que un barrido de "assets sin
> referencia" los marque es lo esperado: son una obligación de licencia, no un asset del sitio.
> La auditoría del 2026-09-09 los señaló y se descartó tocarlos por esta razón.

Para actualizarlas: descargar los `woff2` variables y reemplazar los archivos; los
`unicode-range` de `fonts.css` cubren `latin` y `latin-ext` (el español necesita
`á é í ó ú ñ ü ¿ ¡`).

## Variables de entorno

Copiar `.env.example` a `.env`. `.env` nunca se versiona.

Toda variable `PUBLIC_` queda **expuesta en el navegador**: lo que se prefija es
público y se trata como público. Hoy el proyecto **no tiene ningún secreto** — todas
las variables son configuración pública (número de WhatsApp, precio de muestra,
enlaces a la plataforma de Guita).

## Actividad reciente — descartada (2026-09-09)

Existió un componente `ActivityFeed` con su módulo `lib/activity`: una lista en vivo de
"operaciones recientes" que vivía en `/cotizar`. **Se eliminó junto con esa ruta**, y no por
arrastre sino tras revisarlo:

- **Nunca salió de la investigación.** Cero menciones en `phase-2.5-definicion-experiencia.md`
  —el documento operativo para construir— y cero en `cotizador-spec.md`. Nació al implementar.
- **Chocaba con D10.** Un feed de actividad **es** una cifra de volumen: dice con qué frecuencia
  opera DLPay y por cuánto. Publicarlo en continuo es una decisión de Compliance, no de
  ingeniería. Y contradice el principio de la zona de confianza: *sólo señales que DLPay puede
  respaldar hoy, sin cifras de vanidad*.
- **Se quedó sin página.** La estructura de la Home se definió sin él.

Se borraron el componente, `lib/activity` y sus 15 tests — 514 líneas. **D18 queda cerrada**
(`CLAUDE.md` §13). Si algún día se quiere prueba social, la puerta es **D10**, y el código está en
el historial antes de `7577ffe`.

Lo que sí se conserva es el **patrón**, que era la parte valiosa: una interfaz de fuente con
implementación intercambiable. Sigue vivo y en uso en `lib/pricing` (`PriceSource` →
`ConfigPriceSource`), que sirve de plantilla si hace falta rehacerlo.

## El cotizador

La UI consumirá **sólo** un objeto `Quote` (`src/lib/pricing/types.ts`). No conoce la
fuente del precio ni la fórmula del spread.

El primer paso del cotizador es la **intención** (convertir a dólares, convertir a pesos), no la
moneda. **Eran tres hasta el 2026-09-14:** `send_abroad` hacía exactamente la misma aritmética que
`to_usd` y sólo cambiaba el texto del mensaje de WhatsApp, así que en pantalla se leía como un
tercer camino que no existía. Se retiró; lo que se pierde está razonado en `cotizador-spec.md` y en
el docblock de `lib/pricing/types.ts`.

Hoy existe una sola implementación de `PriceSource`: **`ConfigPriceSource`**, que
devuelve un valor de muestra configurable por `PUBLIC_QUOTE_SAMPLE_RATE`. **No es un
precio real.** Cuando DLPay defina la fuente oficial (pendiente D7) se agrega
`DLPayApiPriceSource` y se cambia por variable de entorno, **sin tocar la UI**.

## Una trampa de Astro que ya nos costó una vez

`astro.config.mjs` declara **`scopedStyleStrategy: 'class'`**, y no es cosmético.

Con la estrategia de fábrica (por atributo), un `<svg>` que vive dentro de un componente hijo
—`Logo`, `Icon`— **no recibe** el `data-astro-cid-*` del padre. Las reglas del padre compilan a
`.brand-mark[data-astro-cid-X]` y no encuentran nada: el isotipo, los iconos de WhatsApp y los de
las secciones quedaban **sin tamaño ni color**, y su tamaño real venía por accidente de la rejilla
del contenedor.

Como clase, el ámbito viaja dentro del `class` que el padre pasa al hijo y que el hijo escribe en
el `<svg>`. La especificidad es idéntica, así que no altera ninguna cascada.

**Si algún día un icono no responde a su CSS, mirar esto primero.**

## La otra trampa: una animación crea contexto de apilamiento

**Regla: todo elemento superpuesto lleva `z-index` explícito.** Nunca se confía en el orden de
pintado implícito.

No es una preferencia de estilo. Costó un bug real el 2026-09-09: con el menú móvil desplegado, el
enlace de la franja de notificación se dibujaba **por encima** del cajón del menú.

Lo desconcertante es que no se ve leyendo el CSS. Ni la cabecera ni la franja declaraban nada
sospechoso — cero `position`, `z-index`, `transform` o `isolation` en la franja. La cadena real es
ésta:

1. La franja rota sus dos mensajes con una animación de **`opacity`**.
2. Un elemento con una animación viva de `opacity` **obtiene contexto de apilamiento** mientras
   corre, aunque su opacidad valga 1 en ese instante.
3. Ese contexto entra en el mismo grupo de pintado que el cajón posicionado —los dos con
   `z-index: auto`— y ahí decide el **orden del DOM**.
4. La franja va después de `.bar` dentro del `<header>`, así que ganaba.

El cajón nunca había tenido `z-index` propio: funcionaba por accidente, hasta que se añadió una
franja que animaba opacidad encima. **Un componente nuevo puede romper el apilamiento de otro sin
tocarlo.**

### Por qué importa aquí en particular

El sitio tiene **seis animaciones que tocan `opacity`** repartidas por los componentes:
`AnnouncementBar` (`announce-cycle`), `Hero` (`heroIn`, `wedgeIn`) y `Quoter` (`settle`, ×3). Cada
una induce un contexto de apilamiento invisible al leer el CSS. Hoy sólo la de la franja convivía
con un elemento superpuesto; la próxima puede no tener esa suerte.

### Escalera de `z-index` en uso

| Valor | Dónde | Contexto |
|---|---|---|
| `30` | `.dock` del cotizador (barra fija inferior) | raíz de la página |
| `20` | `.skip:focus` — el enlace de salto va por encima de todo, por accesibilidad | dentro de `.site-header` |
| `15` | `.drawer` — el menú móvil, por encima del contenido de la cabecera | dentro de `.site-header` |
| `10` | `.site-header` | raíz de la página |
| `1` | `.thread` de `Steps`, `.island` del teléfono | locales, dentro de su propia caja |
| `-1`, `-2` | capas de fondo de `Business` | detrás del contenido |

Los valores locales (`1`) no compiten con la escalera global: viven dentro de un elemento que ya
crea su propio contexto.

### Cómo diagnosticarlo

`elementFromPoint` sobre el punto de solape dice quién pinta encima, sin interpretar reglas:

```js
const el = document.elementFromPoint(x, y);
console.log(drawer.contains(el) ? 'el cajón' : 'otra cosa');
```

Y para confirmar que la causa es una animación, basta desactivarla y volver a medir:
`el.style.animation = 'none'`. Si el orden cambia, ya está localizado.

## El servidor de desarrollo envejece — y miente en silencio

**Ya ha costado dos idas y vueltas. Es lo primero que hay que descartar** cuando alguien dice «lo
veo mal» y el build se ve bien.

Un `astro dev` de larga vida —días, no horas— puede acabar sirviendo **el HTML nuevo con el CSS
viejo**. El HMR sigue recompilando las plantillas, pero su grafo de estilos se queda atrás. No hay
error en consola, no hay aviso, y la página se ve rota de una forma que parece un fallo de
maquetación.

- **2026-09-15.** Un proceso huérfano (padre `launchd`, arrancado con `--json` por una herramienta,
  sin terminal, así que Ctrl-C no lo tocaba) servía una versión anterior a un cambio de
  `astro.config.mjs`, que además Astro **sólo lee al arrancar**.
- **2026-09-16.** Un servidor de 27 horas servía `class="inner stacked"` sin una sola regla
  `.stacked` cargada, y `--montaje` sin declarar. El encabezado de `/empresas` se veía alineado a
  la izquierda con el portátil dentro de la banda: exactamente el diseño anterior.

### Cómo se diagnostica en diez segundos

Desde la consola del navegador, sobre la página sospechosa: se cuenta si la regla que debería
aplicar existe siquiera en las hojas cargadas.

```js
let n = 0;
for (const sh of document.styleSheets) {
  let rs; try { rs = sh.cssRules } catch { continue }
  for (const r of rs) {
    if (r.cssText?.includes('LA-CLASE')) n++;
    if (r.cssRules) for (const r2 of r.cssRules) if (r2.cssText?.includes('LA-CLASE')) n++;
  }
}
n; // 0 con el marcado nuevo en pantalla = el servidor está viejo, no el código
```

Si la clase está en el DOM y el contador da **0**, no se toca el código: se reinicia el servidor.

### La regla que sale de acá

**Verificar sobre el build no basta.** `dist/` puede estar perfecto mientras la persona que reporta
mira otra cosa. Cuando un cambio visual se da por terminado, conviene comprobarlo **en el mismo
sitio donde lo va a mirar quien lo pidió**, y ante cualquier duda reiniciar el servidor primero:

```sh
lsof -nP -iTCP:4321 -sTCP:LISTEN     # quién lo tiene tomado
ps -o pid,lstart,command -p <PID>    # desde cuándo lleva vivo
kill <PID> && npx astro dev
```

---

## Verificación visual con Chrome headless

**El MCP de Playwright conecta desde el 2026-09-10** (`npx` está en `/usr/local/bin/npx`,
`CLAUDE.md` §11); el dato anterior —«no conecta»— quedó obsoleto. Aun así este camino sigue vigente
y a menudo es el más corto: **Chrome ya está instalado y su modo headless basta** para capturar
pantallas y, sobre todo, para leer **estilos computados** — que es lo que distingue «lo veo raro»
de «sé por qué».

Descubierto el 2026-09-08 diagnosticando la franja de notificación, donde el CSS del repositorio
era correcto y lo que estaba mal era el servidor de desarrollo. Sin medir, se habría «arreglado»
código que no tenía nada.

```sh
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
```

Escupe por `stderr` un par de `ERROR:base/process/process_mac.cc … task_policy_set`. Son inocuos
en macOS: se descartan con `2>/dev/null`.

### 1 · Captura de pantalla

```sh
"$CHROME" --headless --disable-gpu --hide-scrollbars \
  --window-size=1280,400 --screenshot=shot.png \
  http://localhost:4321/ 2>/dev/null
```

Para **animaciones**, `--virtual-time-budget` adelanta el reloj antes de disparar la captura. Así
se comprobó que la franja rota de verdad y no sólo que se superpone:

```sh
# t ≈ 7 s: debe verse el SEGUNDO mensaje del carrusel
"$CHROME" --headless --disable-gpu --hide-scrollbars --window-size=1280,190 \
  --virtual-time-budget=7000 --screenshot=rot-t7.png http://localhost:8896/ 2>/dev/null
```

> ⚠️ **No medir geometría en una captura.** A anchos estrechos la imagen sale escalada o recortada
> y aparenta desbordes que no existen. Casi se reportó un desborde horizontal en móvil que no
> había. Las capturas sirven para *ver*; para *medir*, el paso 2.

#### Dos trampas que dejan la captura en blanco

Descubiertas fotografiando el bloque oscuro de la Home, donde el primer intento salió
completamente vacío y parecía un bug de maquetación que no existía.

**1· `--screenshot` no respeta el scroll programático.** Captura desde el inicio del documento, así
que `scrollIntoView()` o `window.scrollTo()` **no sirven** para fotografiar una sección interior:
el DOM sí se desplaza —se puede comprobar leyendo `window.scrollY`— pero la imagen sale del
principio de la página. Para retratar una sección hay que **aislarla** en una página propia con las
mismas hojas de estilo del build:

```sh
python3 - <<'PY'
import re
src = open('dist/index.html', encoding='utf-8').read()
links = re.findall(r'<link rel="stylesheet"[^>]*>', src)
m = re.search(r'<section class="feature.*?</section>', src, re.S)   # la sección que sea
open('dist/__iso.html','w',encoding='utf-8').write(
  '<!doctype html><meta charset="utf-8">' + ''.join(links) + '<body>' + m.group(0) + '</body>')
PY
```

Y borrar ese `__iso.html` al terminar: `dist/` no se versiona, pero si la sonda va a `public/` sí.

**2· El Motion System deja los elementos invisibles.** `[data-enter]` nace en `opacity: 0` y sólo
se revela cuando el `IntersectionObserver` lo ve; en headless no siempre llega a dispararse. Hay
que anular el gate antes de capturar —lo más limpio es quitar la clase de `<html>`, porque sin
`.js-motion` el estado oculto no existe:

```html
<script>document.documentElement.classList.remove('js-motion')</script>
```

Es además el estado que ve alguien con `prefers-reduced-motion`, así que la captura es
representativa y no un montaje.

> El mismo mecanismo explica un fallo real que salió de aquí: un elemento con `[data-enter]`
> recortado por un `overflow` **nunca interseca**, así que nunca se revela. Pasó con las tarjetas de
> un carrusel y con las de un carril deslizable: se habrían quedado en blanco en producción. Si un
> componente recorta contenido, hay que anular el estado oculto en su CSS, no sólo en la sonda.

#### Verificar animaciones sin esperar el reloj

`--virtual-time-budget` adelanta el tiempo, pero para *comprobar sincronía* no hace falta esperar
nada: la **Web Animations API** permite posicionar una animación en un instante exacto y leer el
resultado. Es determinista y no depende de cuándo dispare el capturador.

```js
const a = el.getAnimations()[0];
for (const t of [0, 5000, 11000]) {
  a.currentTime = t;                                  // milisegundos
  const m = new DOMMatrix(getComputedStyle(el).transform);
  console.log(t, m.m41);                              // desplazamiento en X
}
```

Así se verificó que un track y sus puntos de paginación caían en el mismo instante, sin mirarlo a
ojo. Y `getAnimations().length` es el diagnóstico más directo de "esto no anima": devolvió `0` en
unos puntos cuyo `animation` era inválido porque el `var()` del ciclo estaba declarado en un
elemento **hermano** y no en un ancestro, así que no heredaba. Sin esa medición el síntoma —tres
puntos quietos— era indistinguible de un problema de keyframes.

### 2 · Estilos computados — la parte que de verdad importa

Hace falta una sonda con JavaScript en la página, y por tanto **mismo origen**. Dos rutas según el
objetivo.

**a) Auditar el build.** Se copia `dist/` a un directorio temporal, se inyecta la sonda y se sirve:

```sh
cp -R dist /tmp/probe
# …añadir antes de </body> de /tmp/probe/index.html un <script> que escriba
#   las medidas en un <pre id="out">…
cd /tmp/probe && python3 -m http.server 8899 &
"$CHROME" --headless --disable-gpu --window-size=1400,700 --virtual-time-budget=3000 \
  --dump-dom http://localhost:8899/ 2>/dev/null \
  | perl -0777 -ne 'if(/<pre id="out">(.*?)<\/pre>/s){print "$1\n"}'
```

**b) Auditar el servidor de desarrollo.** No se le puede inyectar nada, así que la sonda va
**temporalmente** en `public/` —desde donde se sirve en la raíz, mismo origen— y carga la página
real en un `<iframe>`, cuyo `contentDocument` sí es accesible:

```html
<!-- public/__probe.html — BORRAR después de usarla -->
<iframe id="f" src="/" style="width:1280px;height:400px;border:0"></iframe>
<pre id="out">…</pre>
<script>
  document.getElementById('f').addEventListener('load', () => {
    const f = document.getElementById('f'), d = f.contentDocument, w = f.contentWindow;
    const el = d.querySelector('.rotator');
    const s  = w.getComputedStyle(el);
    document.getElementById('out').textContent = [
      'display = ' + s.display,
      'height  = ' + el.getBoundingClientRect().height.toFixed(1),
      'desborde = ' + (d.documentElement.scrollWidth - w.innerWidth),
    ].join('\n');
  });
</script>
```

> ⚠️ **`public/` está versionado.** La sonda se borra en cuanto se termina (`rm -f
> public/__probe.html`) y **nunca** se commitea.

Cambiando el `src` del `iframe` en un bucle sobre varios anchos se obtiene la tabla responsive de
una sola pasada — así se verificó la franja a 360, 390, 430, 768 y 1280 px, comprobando en cada uno
la altura, el objetivo táctil, que los mensajes compartieran `top` y que no hubiera desborde.

### 3 · El diagnóstico que más valor dio: HTML servido **vs** DOM final

Esto es lo que resolvió el caso de la franja, y conviene tenerlo a mano porque el síntoma engaña:
**el repositorio estaba bien y el navegador mostraba otra cosa.**

```sh
# lo que el servidor ENVÍA
curl -s http://localhost:4321/ | grep -c "announce-cycle"        # → 2

# lo que queda en el DOM DESPUÉS de ejecutar el JS de Vite
"$CHROME" --headless --disable-gpu --virtual-time-budget=3000 \
  --dump-dom http://localhost:4321/ 2>/dev/null | grep -c "announce-cycle"   # → 0
```

Si los dos números no coinciden, **el problema no está en el código**: el cliente HMR de Vite está
reemplazando los `<style>` recién servidos por una copia obsoleta de su caché de módulos. Ocurre en
servidores de desarrollo de larga vida —aquel llevaba unas 23 horas y dos reescrituras del mismo
componente— y el resultado es **markup nuevo con CSS vieja**, que se ve como un bug de maquetación
inexistente.

Extraer el bloque sospechoso confirma de qué versión es:

```sh
perl -0777 -ne 'if(/<style[^>]*NombreComponente[^>]*>(.*?)<\/style>/s){print "$1\n"}' dom.html
```

**Cura:** reiniciar el servidor. No hay que tocar código.

```sh
npx astro dev stop && npx astro dev && npx astro dev status
```

**Regla que se deriva de esto:** ante una discrepancia visual, **comparar siempre contra un build
limpio** (`PUBLIC_SITE_URL=https://dlpay.cl npx astro build --outDir /tmp/x`) antes de cambiar una
línea. Si el build está bien y dev está mal, el sospechoso es dev.

### Qué no cubre

No reemplaza la revisión humana ni la prueba en dispositivo real (`CLAUDE.md` §7). No prueba
gestos táctiles, ni lectores de pantalla, ni el comportamiento de fuentes bajo conexión lenta. Y
`prefers-reduced-motion` en headless conviene comprobarlo explícitamente con
`matchMedia('(prefers-reduced-motion: reduce)').matches` dentro de la sonda, en vez de suponer el
valor por defecto.

## `scripts/` y `Blogs/` — lo que no entra al build

Ninguna de las dos la toca Astro. Se documentan acá porque hasta el 2026-09-15 no estaban en
ningún documento y una auditoría externa las marcó, con razón: quien las encuentre no tiene forma
de saber qué son.

### `scripts/build-worldmap.py` — la cadena de herramientas del globo

Genera el bloque de coordenadas que `hero/GloboRotativo.astro` lleva incrustado. **No corre en el
build ni en CI**: se ejecuta a mano, muy de vez en cuando, y su salida se pega en el componente.

Lo que exige para funcionar —y este es el punto que hay que tener presente— **no es una dependencia
del proyecto pero sí una barrera real**: Python, `shapely`, `ogr2ogr` (GDAL) y una descarga de
Natural Earth. Nada de eso está en `package.json`, nada llega al navegador y nada rompe si falta;
§8 no se activa porque no se instala ningún paquete. Pero **regenerar el mapa hoy requiere montar
ese entorno**, y ese conocimiento vivía sólo dentro del propio script.

Si el mapa no necesita cambiar, no hace falta nada. Si llega a necesitarlo y montar la cadena
resulta caro, la alternativa honesta es tratar las coordenadas actuales como un asset y no como
algo regenerable.

> El encabezado del script cita «ADR-0002» como referencia, que es *Framework, lenguaje y
> arquitectura de contenido* y no dice nada de esto. Las decisiones que sí lo cubren son
> **ADR-0007** (paleta cartográfica) y **ADR-0009** (runtime del globo).

### `Blogs/` — **eliminada el 2026-09-17**

Existió entre el 2026-09-14 y el 2026-09-17 para guardar un borrador fuera del alcance de Astro: el
análisis de la Fed, versionado sólo para respaldarlo mientras tenía marcadores `PENDIENTE` sin
resolver.

Ya no hace falta, y el motivo es que el problema que resolvía se resolvió mejor. **El candado de
`lib/blog.ts` hace ahora ese trabajo desde dentro de la colección**: un artículo sin
`estado: publicado` no entra al build, ni al listado, ni a su ruta, ni al sitemap, y sí se ve con
`astro dev` para poder redactarlo. Un borrador ya no necesita vivir fuera.

Con el artículo publicado, la carpeta quedó vacía y se eliminó. De paso se van las dos pegas que
tenía anotadas: el nombre en plural y con mayúscula que chocaba con `src/content/blog/`, y el
solape con `cowork/`. **Los borradores del blog van en `src/content/blog/` con `estado: borrador`**,
que es el único sitio donde el esquema los valida.

---

## SEO y metadatos

Generados, no escritos a mano:

- **`/sitemap.xml`** se deriva de `src/pages/`. Una página nueva entra sola; no puede quedar fuera
  por olvido. Cero dependencias: el paquete oficial no aporta nada sobre once rutas estáticas más
  una por artículo. Hay dos ajustes que sí hicieron falta al llegar el blog: colapsar los `index`
  anidados —si no, se publicaba `/blog/index/`— y descartar las rutas dinámicas —`/blog/[slug]/`—,
  cuyos artículos entran desde la colección.
- **`/robots.txt`** toma la URL del sitemap del `site` configurado.
- **`og:image`** (`public/og-image.png`, 1200×630) se compuso con la tipografía real del proyecto
  incrustada en un SVG y se rasterizó con el motor de macOS. Importa más de lo habitual: este
  producto vive de enlaces compartidos por WhatsApp, y esa previsualización es lo primero que ve
  quien recibe el enlace. Para regenerarla hay un guion en el historial del commit correspondiente.
- **Datos estructurados** (`Organization`): sólo nombre, razón social, sitio y logo. Nada de
  fundación, cobertura ni valoraciones — el mismo criterio que rige el resto del contenido.
- **Favicon** SVG derivado del isotipo, más `apple-touch-icon.png`.

El mapa de URLs para el cutover está en `docs/migracion-urls.md`.

## Despliegue

No hay despliegue todavía, y es deliberado: el proveedor está diferido (ADR-0005).
El desarrollo avanza en local durante toda la Fase 4.

Regla de portabilidad vinculante: **el sitio debe poder publicarse copiando `dist/` a
cualquier servidor estático.** Lo que rompa esa afirmación necesita una enmienda de ADR.

## Páginas

| Ruta | Qué es | JS |
|---|---|---|
| `/` | Home: héroe con cotizador, globo, usos, los cuatro pasos, confianza, empresas, FAQ | 45,6 KB |
| `/como-funciona` | El recorrido completo con el diagrama de flujo y los tiempos | 0 |
| `/empresas` | Carril B2B: casos de uso, diferencias, incorporación | 0 |
| `/confianza` | El mecanismo, los requisitos y lo que no afirmamos | 0 |
| `/tarifas` | Cómo se compone el precio y qué lo mueve | 0 |
| `/canal-de-denuncias` | Cómo presentar un reclamo y qué ocurre después | 0 |
| `/terminos` | Página de estado: lo que rige hoy, mientras el texto está en revisión | 0 |
| `/privacidad` | Página de estado: lo verificable sobre esta web | 0 |
| `/blog` | Índice de artículos, desde la colección tipada | 0,5 KB |
| `/blog/<slug>` | Un artículo. Una página por entrada de la colección | 0,5 KB |
| `404` | La dirección no existe. **No es una ruta**: el host la sirve bajo cualquier URL | 0 |

**Las portadas las dibuja el sistema, nunca son imágenes** (2026-09-16, ampliado el 2026-09-22).
`coverImage` se retiró: lo que había era un PNG de cuñas diagonales usado dos veces en el mismo
artículo, o sea papel tapiz, que el Design System §6 prohíbe. En su lugar el frontmatter declara
`portada`, que es una **unión discriminada** de tres tipos:

| `tipo` | Qué dibuja | Componente |
|---|---|---|
| `cifra` | Un número con su unidad | `PortadaDato.astro` (HTML) |
| `rango` | Un intervalo con un tope en cada extremo | `PortadaDato.astro` (HTML) |
| `figura` | Un pictograma del asunto del artículo, sin número | `PortadaFigura.astro` (SVG) |

`etiqueta`, `unidad`, `fecha` y `fuente` son obligatorias en los dos primeros y **no existen** en el
tercero: por eso es una unión y no un objeto con opcionales. `fuente` es obligatoria donde hay
número porque ninguna figura publica una cifra sin decir de dónde salió, y esas cifras las aprueba
Compliance junto con el texto. En `figura` no hay nada que citar porque no se afirma ningún dato.

**`figura` es un `z.enum` cerrado**, y ésa es la salvaguarda que impide que el campo vuelva a ser
lo que fue `coverImage`: un artículo elige entre los dibujos que el sistema ya razona, no puede
traer uno suyo. Las reglas que gobiernan el dibujo están en el Design System §6.1 —la cuña no entra
en las portadas, y un pictograma necesita **un solo nodo**— y §6.2.

Hoy `cifra` no tiene ningún consumidor; se conserva y lo dice, igual que los tokens reservados.

**Las legales y el blog comparten medida de lectura desde el 2026-09-23.** Los dos son texto largo
y usan la misma columna de 760px, que da entre 111 y 120 caracteres por línea llena, contados. Se aparta del tope de
65 del Design System §3 a propósito y por tono: un documento no se presenta como una sección de
marketing. La excepción está escrita junto a la regla, con su medición. Antes las legales tenían
`max-width: 47ch`, que daba 38 caracteres reales.

**La 404 se añadió el 2026-09-15** y no se cuenta entre las rutas: no tiene dirección propia. Reusa
`PageHero` sin componentes nuevos, va con `noindex` y sin canónico, queda **excluida del sitemap**
por nombre en `sitemap.xml.ts` y no importa `Motion.astro`, así que es la quinta página del sitio en
cero bytes de JavaScript. Ofrece dos salidas —el inicio y `platform.loginUrl`— porque en el cutover
lo más probable que caiga aquí son URL de cuenta (`/auth/login/`, `/app/`), no de marketing: ver
`migracion-urls.md`. Astro la emite como `dist/404.html` **en la raíz** pese a
`trailingSlash: 'always'`, que es donde un host estático la busca.

**El blog se añadió el 2026-09-11** y es la novena ruta estática, más una por artículo. La
colección vive en `src/content.config.ts` con un esquema cerrado —`title`, `description`,
`pubDate`, `category` (sólo `DLPay` o `Mercado`) y `portada` opcional—: una categoría fuera de
esa lista rompe el build. Sin paquetes nuevos, porque `sharp` ya viene como dependencia opcional
de Astro. **Ningún artículo se publica sin pasar por Compliance** (CLAUDE.md §6): un análisis de
mercado afirma algo sobre precios y cae de lleno en §3. El que existe hoy lleva su marcador y sólo
sirve para verificar la infraestructura.

**Textos legales.** Claude Code **no redacta documentos vinculantes** (CLAUDE.md §7).
`/tarifas` y `/canal-de-denuncias` tienen contenido real porque describen el servicio, no
obligaciones contractuales. `/terminos` y `/privacidad` declaran de frente que están en
revisión y ofrecen el documento vigente por WhatsApp, en vez de publicar un texto provisorio.

Lo que falta y qué decisiones lo bloquean está en **`docs/legal-brief.md`**.

## Estado (2026-09-15)

- `npm run check` → **0 errores, 0 avisos y 7 sugerencias en 57 archivos** · `npm test` →
  **59 tests en 11 suites** en verde · `npm audit` → 0 vulnerabilidades · `build` verde,
  **11 páginas** — las diez indexables más la 404, que no es una ruta.
- **JS enviado al cliente: tres scripts, y el tercero es nuevo.**
  - Cotizador: 4 528 B / 2,0 KB gzip, chunk externo, **sólo en la Home**.
  - Motion System: 489 B en línea + 56 B síncronos, en **seis de las diez páginas**.
  - **Globo rotativo: 40 525 B en línea, sólo en la Home.** Casi todo son coordenadas del
    mapamundi; el runtime que las proyecta y las rota son unas pocas decenas de líneas.
  - **Cinco páginas en cero bytes** de JavaScript ejecutable: las cuatro legales y la 404. Lo
    único que llevan es el bloque `application/ld+json`, que es dato y no se ejecuta.
- HTML de 18,0 a 29,2 KB en crudo (**4,9 a 6,7 KB gzip**), salvo la Home: **86,0 KB / 24,1 KB
  gzip**, y la diferencia es el globo. CSS de 16,6 a 44,1 KB por página, repartido en cuatro
  hojas según la ruta · fuentes 112 KB · `dist/` completo **740 KB**.
- Las diez páginas: un solo `h1`, sin saltos de nivel, `lang="es-CL"`, cero enlaces
  muertos, todos los campos con etiqueta, enlace de salto al contenido y `aria-current`
  en la navegación.
- **Dos reglas duras del §7 están hoy en suspenso sobre la Home y su enmienda todavía es una
  propuesta:** «el cotizador es la única isla interactiva» y «cero JS al cliente». El globo es una
  segunda pieza con runtime propio y con una rotación infinita, que además contradice la regla 1
  del Motion System. Las tres enmiendas —ADR-0007, 0008 y 0009— están escritas y en estado
  **Propuesta**: mientras no se acepten, el código va por delante de la decisión.
- Contraste verificado por cálculo, no a ojo: `--verde` sobre papel da **2.02:1**, así
  que no se usa para texto ni para gráficos con significado; ahí va `--verde-deep`
  (4.90:1). Sobre tinta el verde da 8.45:1 y sí sirve. El token `--focus` cambia según
  la superficie.
- Dos breakpoints en todo el sitio: 760px y 900px.
- **Contraste verificado por cálculo en los 12 pares en uso.** El más ajustado queda 1.09× sobre
  su mínimo. La revisión encontró que `--aviso` sólo daba 2.75:1 sobre `papel-2`, insuficiente
  incluso para un borde: se desdobló en `--aviso-deep`, igual que el verde.
- El CTA de WhatsApp se arma **también en el servidor** con la misma función que usa
  el cliente: sin JavaScript el botón ya lleva el monto de ejemplo escrito.

**Sobre el estado "calculando" del cotizador:** la especificación describe un shimmer
mientras se recalcula. Hoy el precio es un valor de configuración y el cálculo es
instantáneo, así que simular una espera sería teatro. La máquina de estados está
escrita completa (`resolveState`, `QuoteState`); los estados `market_moving` y
`unavailable` no son alcanzables hasta que exista una fuente de precio real.

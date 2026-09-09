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
├── pages/            # una ruta por página — las ocho de la AI v1
│   ├── index.astro · como-funciona · empresas · confianza
│   ├── terminos · privacidad · tarifas · canal-de-denuncias
│   └── sitemap.xml.ts · robots.txt.ts   # generados, no a mano
├── layouts/
│   ├── Base.astro    # el ÚNICO <head> del sitio: SEO, tokens, escudo noindex
│   └── Legal.astro   # envuelve a Base para los cuatro documentos legales
├── components/
│   ├── Quoter.astro       # la única isla interactiva
│   ├── Motion.astro       # motor del Motion System V1 (IntersectionObserver)
│   ├── ActivityFeed.astro # actividad reciente. SIN CONSUMIDORES desde que se
│   │                      # eliminó /cotizar; se conserva como costura de D18
│   ├── Steps.astro        # bloque contenido en tinta: argumento + tarjeta + chat
│   ├── Process.astro      # los 4 pasos en zig-zag, con un teléfono cada uno
│   ├── WhatsAppMockup.astro # el teléfono en CSS. Dos variantes: proof y bare
│   ├── Header · Footer · Hero · PageHero · Trust · UseCases
│   ├── Business · Faq · Alliances · FlowDiagram · AnnouncementBar
│   ├── Icon · Logo · UseCaseFigure · PendingNotice
│   └── ui/                # IconBadge, ArrowLink — sólo donde corresponden
├── content/          # dato tipado, separado de la presentación
│   └── home.ts · process.ts · trust.ts · business.ts
├── styles/
│   ├── fonts.css     # @font-face del set T-C, auto-hospedado
│   └── tokens.css    # espejo del Design System V1 + gate del Motion System
└── lib/
    ├── config/
    │   ├── environment.ts   # resolución y validación del entorno — PURO
    │   ├── site.ts          # marca, contacto, enlaces a Guita, URL, indexación
    │   └── alliances.ts     # FinteChile y UAF, con el alcance de cada claim
    ├── pricing/             # types · config-price-source · quote · format
    └── activity/            # types · source · mock-activity-source · format
public/
├── fonts/            # woff2 variables + sus licencias OFL
└── alianzas/         # emblemas de FinteChile y UAF
tests/                # pricing · activity · config (runner nativo de Node)
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

Para actualizarlas: descargar los `woff2` variables y reemplazar los archivos; los
`unicode-range` de `fonts.css` cubren `latin` y `latin-ext` (el español necesita
`á é í ó ú ñ ü ¿ ¡`).

## Variables de entorno

Copiar `.env.example` a `.env`. `.env` nunca se versiona.

Toda variable `PUBLIC_` queda **expuesta en el navegador**: lo que se prefija es
público y se trata como público. Hoy el proyecto **no tiene ningún secreto** — todas
las variables son configuración pública (número de WhatsApp, precio de muestra,
enlaces a la plataforma de Guita).

## Actividad reciente

`src/lib/activity/` sigue el mismo patrón de desacople que el precio: la UI consume eventos y no
sabe de dónde vienen.

Hoy la única implementación es **`MockActivitySource`**, que declara `isReal = false`. Esa bandera
no es documentación: **el componente comprueba la condición y muestra un distintivo visible de
"Datos de ejemplo" más una nota aclaratoria**. No hay forma de publicar datos inventados haciéndolos
pasar por operaciones reales, aunque alguien lo olvide.

El tipo `ActivityEvent` sólo admite tipo de operación, monto redondeado y momento. **No hay dónde
poner un nombre, un RUT ni un dato personal**, aunque se quisiera.

**En vivo.** El feed se actualiza solo: los tiempos relativos se refrescan cada 5 s y aparecen
operaciones nuevas cada 14–46 s, con un intervalo irregular a propósito —una cadencia exacta se lee
como un contador, no como una mesa operando—. La operación nueva **aparece con una atenuación de
420 ms, no se desliza ni parpadea**, y bajo `prefers-reduced-motion` no se anima. Nada corre
mientras la pestaña está oculta.

Refrescar los tiempos es la parte que más dice "esto está vivo" y **es honesta también con datos
reales**: el dato no cambia, sólo su antigüedad.

**Previsualizar el diseño sin el distintivo.** En `.env` (que no se versiona):

```
PUBLIC_ACTIVITY_PREVIEW=true
```

Oculta el distintivo de "Datos de ejemplo" **sólo en `npm run dev`**. No tiene efecto en un build:
`import.meta.env.DEV` es false fuera del servidor de desarrollo, así que un sitio publicado siempre
lo muestra mientras la fuente no sea real. Ponerlo en un servidor no hace nada. Verificado
construyendo con la variable activada.

Cuando exista la fuente real: se agrega `DLPayActivitySource` que implemente
`StreamingActivitySource` con `isReal = true` sobre operaciones confirmadas y anonimizadas, y se
cambian dos líneas —una en el frontmatter de `ActivityFeed.astro` y otra en su script—. El resto no
se toca.

## El cotizador

La UI consumirá **sólo** un objeto `Quote` (`src/lib/pricing/types.ts`). No conoce la
fuente del precio ni la fórmula del spread.

El primer paso del cotizador es la **intención** (enviar al extranjero, convertir a dólares,
convertir a pesos), no la moneda. `send_abroad` y `to_usd` hacen la misma aritmética pero producen
mensajes de WhatsApp distintos, porque para quien pide y para el ejecutivo son operaciones
diferentes.

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

El sitio tiene **siete animaciones que tocan `opacity`** repartidas por los componentes:
`AnnouncementBar` (`announce-cycle`), `Hero` (`heroIn`, `wedgeIn`), `Quoter` (`settle`, ×3) y
`ActivityFeed` (`appear`). Cada una induce un contexto de apilamiento invisible al leer el CSS. Hoy
sólo la de la franja convivía con un elemento superpuesto; la próxima puede no tener esa suerte.

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

## Verificación visual con Chrome headless

El MCP de Playwright **no conecta** en este entorno (`npx` fuera del `$PATH`, `CLAUDE.md` §11), así
que durante mucho tiempo no hubo forma de comprobar un render salvo mirarlo a ojo. Sí la hay:
**Chrome ya está instalado y su modo headless basta** para capturar pantallas y, sobre todo, para
leer **estilos computados** — que es lo que distingue «lo veo raro» de «sé por qué».

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

## SEO y metadatos

Generados, no escritos a mano:

- **`/sitemap.xml`** se deriva de `src/pages/`. Una página nueva entra sola; no puede quedar fuera
  por olvido. Cero dependencias: el paquete oficial no aporta nada sobre ocho rutas estáticas.
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
| `/` | Home: héroe con cotizador, usos, los cuatro pasos, confianza, empresas, FAQ | 5,1 KB |
| `/como-funciona` | El recorrido completo con el diagrama de flujo y los tiempos | 0 |
| `/empresas` | Carril B2B: casos de uso, diferencias, incorporación | 0 |
| `/confianza` | El mecanismo, los requisitos y lo que no afirmamos | 0 |
| `/tarifas` | Cómo se compone el precio y qué lo mueve | 0 |
| `/canal-de-denuncias` | Cómo presentar un reclamo y qué ocurre después | 0 |
| `/terminos` | Página de estado: lo que rige hoy, mientras el texto está en revisión | 0 |
| `/privacidad` | Página de estado: lo verificable sobre esta web | 0 |

**Textos legales.** Claude Code **no redacta documentos vinculantes** (CLAUDE.md §7).
`/tarifas` y `/canal-de-denuncias` tienen contenido real porque describen el servicio, no
obligaciones contractuales. `/terminos` y `/privacidad` declaran de frente que están en
revisión y ofrecen el documento vigente por WhatsApp, en vez de publicar un texto provisorio.

Lo que falta y qué decisiones lo bloquean está en **`docs/legal-brief.md`**.

## Estado (2026-09-08)

- `npm run check` → **0 errores en 56 archivos** · `npm test` → **68 tests** en verde ·
  `npm audit` → 0 vulnerabilidades · `build` verde.
- **JS enviado al cliente: dos scripts.** Cotizador (4 672 B / 2,1 KB gzip, chunk externo, sólo en
  la Home) y Motion System (489 B en línea + 62 B síncronos). Está en **cuatro de las ocho
  páginas**; las **cuatro legales siguen en cero bytes**. La actividad reciente era el tercero y
  ya no envía nada: vivía sólo en `/cotizar/`.
- HTML de 15,4 a 39,4 KB en crudo, **4,3 a 8,3 KB gzip** · CSS 41,5 KB / 9,0 KB gzip ·
  fuentes 96 KB · `dist/` completo **660 KB**.
- Las ocho páginas: un solo `h1`, sin saltos de nivel, `lang="es-CL"`, cero enlaces
  muertos, todos los campos con etiqueta, enlace de salto al contenido y `aria-current`
  en la navegación.
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

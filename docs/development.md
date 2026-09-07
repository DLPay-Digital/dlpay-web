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
| `npm run build` | Genera el sitio estático en `dist/` |
| `npm run preview` | Sirve `dist/` localmente, como en producción |
| `npm run check` | Verificación de tipos (`astro check`) |
| `npm test` | Tests de la lógica del cotizador (runner nativo de Node) |

`build` verde **no** equivale a "terminado" (`CLAUDE.md` §9).

## Estructura

```
src/
├── pages/            # una ruta por página. Hoy sólo index.astro (provisional)
├── layouts/
│   └── Base.astro    # documento, tokens y SEO base
├── components/       # (vacío — se llena en Fase 4, sólo lo que una página pida)
├── styles/
│   ├── fonts.css     # @font-face del set T-C, auto-hospedado
│   └── tokens.css    # espejo del Design System V1
└── lib/
    ├── config/site.ts            # marca, contacto y enlaces a Guita
    └── pricing/
        ├── types.ts              # PriceSource, PriceReference, Quote
        ├── config-price-source.ts# única implementación en V1 (valor de muestra)
        └── format.ts             # formato de cifras chileno
public/fonts/         # woff2 variables + sus licencias OFL
```

Las carpetas se crean **cuando una necesidad real las pide**, no antes
(Principio 5). `src/content/` aún no existe: se creará si una página necesita
datos estructurados (ADR-0002 §4).

## Dependencias instaladas

Exactamente tres paquetes declarados, con la justificación que exige `CLAUDE.md` §8:

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

## SEO y metadatos

Generados, no escritos a mano:

- **`/sitemap.xml`** se deriva de `src/pages/`. Una página nueva entra sola; no puede quedar fuera
  por olvido. Cero dependencias: el paquete oficial no aporta nada sobre nueve rutas estáticas.
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
| `/` | Home: héroe con cotizador, cómo funciona, confianza, empresas, FAQ | 3,2 KB |
| `/cotizar` | La herramienta sola: cotizador centrado + actividad reciente en vivo | 5,5 KB |
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

## Estado (2026-09-04)

- `npm run check` → 0 errores en 31 archivos · `npm test` → 22 tests en verde · `build` verde.
- **JS enviado al cliente: ~3,2 KB**, y es sólo el cotizador. Astro lo inlinea por
  pequeño, así que no aparece como archivo `.js` suelto en `dist/`. El resto de la
  página es HTML y CSS: cero JavaScript, como promete ADR-0002.
- HTML entre 13 y 22 KB por página + 35 KB de CSS + 92 KB de fuentes.
- Las cinco páginas: un solo `h1`, sin saltos de nivel, `lang="es-CL"`, cero enlaces
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

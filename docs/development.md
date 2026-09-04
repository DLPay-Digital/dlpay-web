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

## El cotizador

La UI consumirá **sólo** un objeto `Quote` (`src/lib/pricing/types.ts`). No conoce la
fuente del precio ni la fórmula del spread.

Hoy existe una sola implementación de `PriceSource`: **`ConfigPriceSource`**, que
devuelve un valor de muestra configurable por `PUBLIC_QUOTE_SAMPLE_RATE`. **No es un
precio real.** Cuando DLPay defina la fuente oficial (pendiente D7) se agrega
`DLPayApiPriceSource` y se cambia por variable de entorno, **sin tocar la UI**.

## Despliegue

No hay despliegue todavía, y es deliberado: el proveedor está diferido (ADR-0005).
El desarrollo avanza en local durante toda la Fase 4.

Regla de portabilidad vinculante: **el sitio debe poder publicarse copiando `dist/` a
cualquier servidor estático.** Lo que rompa esa afirmación necesita una enmienda de ADR.

## Verificaciones del esqueleto (2026-09-04)

- `npm run check` → 0 errores en 9 archivos.
- `npm run build` → verde.
- **0 archivos JavaScript y 0 etiquetas `<script>`** en la salida — el sitio de
  contenido no envía JS, como promete ADR-0002. El cotizador será la única isla.
- Página completa: ~4,4 KB de HTML + ~5,6 KB de CSS, más las fuentes.
- Cifras tabulares y en formato chileno: `2.000.000` · `2.174,62` · `919,70`.

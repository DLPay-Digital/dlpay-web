# Auditoría técnica previa a producción

> Diseño **congelado**. Sin funcionalidades nuevas, sin dependencias nuevas, sin cambios visuales.
> Método: inspeccionar → clasificar → documentar → corregir sólo lo que corresponda.
>
> Continúa `hardening-2026-09-04.md`. Estas revisiones buscan lo que aquella no cubrió.
>
> **Dos revisiones acumuladas:**
>
> | Fecha | Alcance | Resultado |
> |---|---|---|
> | 2026-09-04 | Aritmética, accesibilidad, barra final, secretos, capas | 1 crítico y 3 importantes, corregidos |
> | **2026-09-08** | **Guarda de despliegue, indexación, promesa de arquitectura** | **2 críticos, corregidos** |

---

# Revisión 2026-09-04

---

## 🔴 CRÍTICO

### A1 · Los montos con tres o más decimales se multiplican por mil

`parseAmount` decide si un separador es decimal contando los dígitos que lo siguen: tres dígitos
agrupan miles. La regla funciona para `2.000.000` y para `2174.62`, pero **rompe el formato
chileno cuando hay más de dos decimales**, porque ahí la coma decimal va seguida de tres dígitos:

| Se escribe | Se interpreta | Debería | Error |
|---|---|---|---|
| `2.174,626` | **2.174.626** | 2.174,626 | ×1000 |
| `1.234,5678` | **12.345.678** | 1.234,5678 | ×10000 |

El campo de dólares acepta decimales, y un monto pegado desde una factura o una planilla puede
traer tres o cuatro. La cifra errónea **viaja al mensaje de WhatsApp**.

**Origen:** regresión introducida por la corrección I2 del hardening anterior, que resolvió el
formato inglés y rompió el chileno de alta precisión. El caso no estaba en los tests.

**Corregido:** cuando aparecen **ambos** separadores, el último manda como decimal, sin contar
dígitos — en `2.174,626` la coma es decimal por definición del formato. La heurística por posición
queda sólo para cuando hay un único tipo de separador. Con tests para los cuatro formatos.

---

## 🟠 IMPORTANTES

### B1 · La cifra que se muestra y la que se envía se calculan por caminos distintos

El componente hace la conversión con **cuatro expresiones propias** en vez de usar `convert()` y
`clpAmount()`, que es lo que consume el mensaje de WhatsApp. Son dos implementaciones de la misma
regla.

Además, las del componente **no llevan la guarda** `rate <= 0` que sí tiene el módulo. Con una tasa
corrupta, la pantalla mostraría `Infinity` y el mensaje diría `0`.

Va directo contra el requisito de que no exista ninguna posibilidad de mostrar o enviar un monto
incorrecto: hoy no divergen porque las dos fórmulas coinciden, pero **nada lo garantiza**.

**Corregido:** el componente usa las funciones del módulo. Una sola implementación, ya cubierta por
tests.

### B2 · La barra final es inconsistente y cada host la resuelve distinto

- Los enlaces internos apuntan a `/cotizar`.
- El sitemap declara `/cotizar/`.
- El build genera `dist/cotizar/index.html`.
- `trailingSlash` no está configurado.

Cloudflare Pages y Vercel **no se comportan igual** ante esto. En el mejor caso, cada navegación
interna paga una redirección; en el peor, un 404. Y para un buscador son dos URL distintas para el
mismo contenido.

Es un fallo que **no se ve en localhost** y aparece sólo al desplegar — justo la clase de problema
que esta auditoría busca.

**Corregido:** `trailingSlash: 'always'` declarado, y todos los enlaces internos, rutas canónicas y
el sitemap alineados con barra final.

### B3 · El aviso de monto mínimo probablemente nunca se anuncia

El mensaje de error se escribe **mientras la región sigue `hidden`**, y recién después se muestra.
Un lector de pantalla no vigila regiones ocultas: cuando el contenido cambia, la región no está en
el árbol de accesibilidad, así que el anuncio se pierde.

Efecto real: una persona que navega con lector de pantalla escribe un monto bajo el mínimo y **no
recibe ninguna señal** de que algo pasa.

**Corregido:** primero se muestra la región, después se escribe el texto.

---

## 🟡 MENORES

### C1 · El feed de actividad anuncia cada operación, para siempre
`aria-live="polite"` sobre una lista que emite una operación cada 14–46 segundos hace que un lector
de pantalla las lea todas, indefinidamente, sobre contenido **ambiental** que nadie pidió escuchar.
Interrumpe la lectura de lo que sí importa. **Corregido:** la lista deja de ser región viva; sigue
siendo legible y navegable, sólo que no interrumpe.

### C2 · Cambiar la fuente de actividad exige tocar dos lugares
`MockActivitySource` se instancia en el frontmatter y otra vez en el script del cliente. Al llegar
la fuente real habría que acordarse de las dos. **Corregido:** una función única en
`src/lib/activity/source.ts`; cambiar de fuente es cambiar una línea.
*(Módulo eliminado el 2026-09-09 al descartarse la funcionalidad — ver B2 de la revisión
2026-09-08 y D18.)*

### C3 · `.inner` duplicado en las páginas interiores
Mismos valores repetidos en cuatro archivos. Sin efecto visual, pero es el mecanismo por el que
aparece la deriva. **No corregido:** tocarlo mueve el layout de todas las páginas y el diseño está
congelado. Queda registrado para la próxima ventana de cambios visuales.

---

## ✅ SIN PROBLEMAS

| Área | Resultado |
|---|---|
| Secretos | Nada en el historial ni en los archivos versionados. `.env` ignorado y fuera del índice. |
| Dependencias | `npm audit` sin vulnerabilidades. ⚠️ *Decía «tres paquetes»; son **cuatro**. Ver B5 de la revisión 2026-09-08.* |
| Peticiones a terceros | **Ninguna.** Fuentes auto-hospedadas, sin analítica, sin CDN, sin píxeles. |
| Tipos | Ni un `any`, ni un `@ts-ignore`. `astro check` limpio en 45 archivos. |
| Inyección | Los dos `set:html` reciben valores del build. El JSON-LD escapa `<`. El cotizador escribe con `textContent` y codifica la URL. |
| Enlaces externos | Todos con `rel="noopener"`. |
| Privacidad de la actividad | El tipo `ActivityEvent` sólo admite tipo, monto redondeado y momento: no hay dónde poner un dato personal. Con tests. |
| Datos de ejemplo | El distintivo depende de `isReal` y de `import.meta.env.DEV`: un build publicado siempre lo muestra. Verificado construyendo con la variable activada. |
| Acoplamiento con Guita | Un único punto (`src/lib/config/site.ts`). |
| Separación de capas | Contenido, pricing, actividad y configuración, cada uno en su módulo. La estructura admite remesas sin rehacer nada. |
| Contraste | Doce pares verificados por cálculo; el más ajustado, 1.09× su mínimo. |
| Accesibilidad estructural | Idioma, un `h1` por página, landmarks, enlace de salto, navegación rotulada, campos con etiqueta, SVG decorativos ocultos. |
| Peso | ⚠️ *Cifras superadas por la construcción de la Home y por `compressHTML: false`. Y el JS **no** está sólo en las dos páginas con cotizador. Medición vigente en B4 de la revisión 2026-09-08.* |

---

## 📌 DECISIONES PENDIENTES

Ninguna es técnica. Ninguna bloquea preparar el despliegue.

| # | Decisión | De quién |
|---|---|---|
| D1b | Proveedor de hosting (Cloudflare o Vercel) | Sebastián |
| D5 | Transparencia del spread → tabla de `/tarifas` | DLPay |
| D6 | Monto mínimo real | DLPay |
| ~~D21~~ | ~~Monto máximo~~ · **cerrada el 2026-09-29 sin tope.** El estado `above_max` queda declarado como conservado sin uso en `lib/pricing/types.ts` | — |
| D7 | Fuente oficial de precio | DLPay |
| D18 | Fuente real de actividad confirmada y anonimizada | DLPay |
| D9 | **Razón social** — bloquea publicar los textos legales | Compliance |
| D19 | Correo oficial de contacto | Compliance |
| D20 | Alcance descrito en los T&C frente al servicio real | Compliance |
| ~~D22~~ | ~~Mensaje prellenado en los enlaces planos a WhatsApp~~ · **cerrada el 2026-09-29** | — |

---

## Verificación posterior

| Comprobación | Resultado |
|---|---|
| `npm run check` | 0 errores en 46 archivos |
| `npm test` | **48 tests**, con los cuatro formatos de monto fijados |
| `npm run build` | verde · falla a propósito sin `PUBLIC_SITE_URL` |
| Enlaces y rutas | ninguno roto, ninguna huérfana, barra final consistente |
| Datos de ejemplo | el distintivo sigue presente en el build |
| Aritmética | una sola implementación: pantalla y mensaje no pueden divergir |
| Cambios visuales | ninguno |

---
---

# Revisión 2026-09-08 — guarda de despliegue y escudo de indexación

> Motivada por la preparación de Staging. Busca lo que **no se ve en localhost**: fallos que dejan
> el build en verde y las páginas correctas, y cuyo daño sólo aparece publicado.
>
> Método: además de leer el código, **aislar el config en un directorio limpio y ejecutarlo** con
> cada combinación de entorno. Las dos regresiones críticas de abajo no se habrían encontrado
> leyendo: la guarda anterior *parecía* correcta.
>
> Sin cambios visuales. Sin dependencias nuevas.

---

## 🔴 CRÍTICOS

### A1 · La guarda de `PUBLIC_SITE_URL` se saltaba invocando el build de otra forma

`resolveSite()` sólo lanzaba si `process.env.npm_lifecycle_event === 'build'`. Eso es cierto con
`npm run build` y **falso** con todo lo demás.

| Invocación | Antes | Ahora |
|---|---|---|
| `npm run build` sin la variable | falla ✅ | falla ✅ |
| **`astro build` / `npx astro build`** | **verde, publica localhost** 🔴 | **exit 1** ✅ |
| **`astro build --outDir …`** | **verde, publica localhost** 🔴 | **exit 1** ✅ |
| Script envoltorio o API programática | verde, publica localhost 🔴 | exit 1 ✅ |
| `dev` · `check` · `sync` · `preview` | localhost (correcto) | localhost (correcto) ✅ |

El detector era frágil por naturaleza: preguntaba **cómo me invocaron**, cuando lo que importa es
**qué estoy haciendo**.

**Corregido:** una integración mínima, `dlpay:deploy-guard`, valida en el hook
`astro:config:setup`, que recibe de Astro el `command` real. Cubre todas las invocaciones, incluida
la API programática, y aborta con **código de salida 1** — verificado — así que un CI lo nota.

### A2 · Comprobaba presencia, no validez — y la plantilla fabricaba el fallo

`.env.example` terminaba con `PUBLIC_SITE_URL=http://localhost:4321`. El paso documentado es
«copiar a `.env` y completar»: **seguir la documentación producía un build verde que publicaba
localhost** en canonical, `og:url`, `og:image`, `twitter:image`, el `url` y el `logo` del JSON-LD,
las nueve URL del sitemap y la línea `Sitemap:` del robots.

No era hipotético: el `dist/` que había en el repo **era ese fallo materializado** — 11 archivos,
64 ocurrencias de `localhost`. Y ADR-0005 define publicar como «copiar la carpeta de build».

**Corregido:** la guarda **valida** la URL y rechaza, con el motivo exacto:

| Rechazo | Por qué |
|---|---|
| Ausente o vacía | No hay valor que publicar |
| No parseable | `dlpay.cl` sin esquema, texto libre |
| **Host local** — `localhost`, `127.0.0.1`, `0.0.0.0`, `::1`, `*.localhost`, `*.local`, `*.test`, `*.internal` | Sólo resuelve en la máquina de quien construye |
| Protocolo distinto de `https` | Un canonical sobre `http` invita a indexar la versión insegura; en la práctica es un esquema mal escrito |
| Ruta que no sea la raíz | `https://dlpay.cl/web` serviría igual y produciría enlaces internos rotos, sin error: haría falta configurar además `base` |
| Parámetros o fragmento | No pertenecen a una URL canónica |

`.env.example` deja `PUBLIC_SITE_URL=` **vacía**, con el porqué escrito. El `dist/` envenenado se
eliminó (no versionado, ignorado, regenerable).

### A3 · Staging sería indexado, y con él los textos que Compliance no ha aprobado

`robots.txt` emitía `Allow: /` sin condición y `Base.astro` no tenía meta `robots` ni forma de
ponerla. **No existía interruptor.**

El riesgo no era abstracto. Staging sirve las nueve rutas, entre ellas `/terminos/` y
`/privacidad/`, que hoy son **páginas de estado** bloqueadas por D9 (razón social), D19 (correo) y
D20 (alcance de los T&C). Es decir: el escenario en que Compliance nos bloquea para producción era
exactamente el escenario en que un Staging indexable publicaba bajo la marca DLPay lo que
Compliance no había firmado. Más contenido duplicado contra `dlpay.cl`.

**Corregido:** `PUBLIC_ALLOW_INDEXING`, **cerrado por omisión**. Sólo el literal `'true'` abre;
ausente, vacía, `false`, `TRUE`, `1`, `yes` o ` true` dejan el despliegue cerrado. Cuando está
cerrado:

- `<meta name="robots" content="noindex, nofollow">` en el `<head>` — verificado en **las nueve
  rutas**. `Base.astro` es el único `<head>` del sitio (las legales pasan por `Legal.astro`, que lo
  envuelve), así que no hay hueco posible.
- `robots.txt` emite `Disallow: /` con el motivo en comentarios.

El modo seguro es el que se obtiene **sin hacer nada**, porque el riesgo no es simétrico.

Y como fallar cerrado tiene su propio riesgo inverso —publicar el sitio real con `noindex` sin
enterarse—, **cada build declara su política en voz alta**:

```
[dlpay:deploy-guard] URL canónica: https://dlpay.cl
[dlpay:deploy-guard] Indexación PERMITIDA — este build es para el sitio público.
```

---

## 🟠 IMPORTANTES

### B1 · Dos lectores de `PUBLIC_SITE_URL`, cada uno con su propio respaldo a localhost

La validación cubría **la mitad** de las URL publicadas:

- `astro.config.mjs` → `loadEnv` → `Astro.site` → **sitemap y robots**. Aquí vivía la guarda.
- `lib/config/site.ts` → `import.meta.env`, con su propio `'http://localhost:4321'` → **canonical,
  Open Graph, Twitter y JSON-LD**. Aquí **no había guarda**.

Coincidían porque leían la misma variable, pero nada lo garantizaba. Misma forma exacta que el
hallazgo del monto mínimo (D24): dos lugares, dos valores por defecto, un dato.

**Corregido:** la lógica vive en `src/lib/config/environment.ts`, **puro** — no lee
`import.meta.env` ni `process.env`, recibe el entorno como argumento. Eso es lo que permite que lo
consuman los dos runtimes que leen el entorno de forma distinta: el config vía `loadEnv` (se evalúa
antes de que Vite inyecte `import.meta.env`) y `site.ts` vía `import.meta.env`. **Una
implementación, una validación, un solo respaldo.**

`site.ts` es ahora el punto único de lectura de la aplicación: `robots.txt.ts` y `sitemap.xml.ts`
dejaron de usar `Astro.site` y consumen `site.url`, ya normalizado sin barra final — desaparecen
los `.replace(/\/$/, '')` dispersos. Ser puro lo hace además testeable con el runner de Node, sin
DOM y sin levantar un build: **20 tests nuevos**.

### B2 · `ActivityFeed` es una tercera isla, y envía el generador de datos de ejemplo al cliente

> ✅ **Resuelto el 2026-09-09, de raíz.** Se eliminó `/cotizar`, que era su única página, y acto
> seguido se descartó la funcionalidad entera: el componente, `lib/activity` y sus 15 tests se
> borraron. No se mitigó, desapareció. El motivo no fue el arrastre sino que el feed nunca salió
> de la investigación y chocaba con **D10** —es una cifra de volumen—. **D18 queda cerrada.**

`arquitectura-produccion.md` describía el JS del cliente como «el cotizador… más el reloj del feed
de actividad». Lo que viaja no es un reloj: el `<script>` de `ActivityFeed.astro` **arrastra
`mock-activity-source.ts` completo** al navegador —su PRNG, sus rangos por tipo de operación y su
`subscribe`— y dentro corre un `setInterval` de 5 s más un emisor cada 14–46 s mientras la pestaña
viva. Son 2 336 B en línea en `/cotizar/`.

**No es un incumplimiento de compliance:** el distintivo y el descargo dependen de `source.isReal`
y de `import.meta.env.DEV`, y se verificó que `PUBLIC_ACTIVITY_PREVIEW` no tiene efecto en un
build. La salvaguarda de D18 está bien construida y sigue en pie.

**No corregido — es documentación, no defecto.** Queda registrado porque es el argumento para
reemplazar el mock por la fuente real (D18): mientras siga siendo mock, el generador de operaciones
ficticias es código que se descarga en el navegador de cada visitante.

### B3 · El JS no está «sólo en las dos páginas con cotizador»

> ⚠️ *Cifras de su fecha. Al 2026-09-15 el sitio tiene **nueve rutas estáticas más una por
> artículo** y **tres scripts**: la Home con 45,6 KB —40,5 de los cuales son el globo del héroe—,
> cinco páginas con 0,5 KB y las cuatro legales en cero. Inventario vigente en
> `arquitectura-produccion.md` §1.1.*

Está en **cinco de nueve**, porque el Motion System viaja a toda página que lo importe. Inventario
verificado sobre el build:

| Página | `is:inline` | Motion | ActivityFeed | Quoter (chunk) | Total |
|---|---|---|---|---|---|
| `/` | 62 B | 489 B | — | 4 672 B | **5,1 KB** |
| `/cotizar/` | — | — | **2 336 B** | 4 672 B | **6,8 KB** |
| `/como-funciona/`, `/confianza/`, `/empresas/` | 62 B | 489 B | — | — | **0,5 KB** |
| `/terminos/`, `/privacidad/`, `/tarifas/`, `/canal-de-denuncias/` | — | — | — | — | **0 B** ✅ |

Las cuatro legales siguen en **cero JavaScript**, tal como promete `Motion.astro`. `/cotizar/` no
importa Motion, y no tiene ni un `[data-enter]`: coherente, no hay contenido que quede oculto.

El `is:inline` de 62 B es el que pone `.js-motion` de forma síncrona en el `<head>`. Verificado en
la cascada (`tokens.css:139`): el estado oculto se aplica **sólo** bajo esa clase, así que si el
script no corre la página se ve completa e inmóvil.

Verificado también que `environment.ts` y `site.ts` **no se filtran al cliente**: tras el
refactor, el chunk del Quoter conserva el mismo hash de contenido (`KqkP4Blf`).

---

## 🟡 MENORES

### B4 · Peso real, medido

> ⚠️ *Medición de su fecha, con nueve rutas. Cifras vigentes en `docs/development.md`, sección
> Estado.*

La Home creció con su construcción y con `compressHTML: false`. Lo que viaja es el gzip:

| Página | Crudo | **Gzip** |
|---|---|---|
| `/` | 37,5 KB | **8,5 KB** |
| `/cotizar/` | 21,8 KB | 6,4 KB |
| `/confianza/` | 23,8 KB | 5,9 KB |
| `/empresas/` | 22,5 KB | 5,5 KB |
| `/como-funciona/` | 23,9 KB | 5,4 KB |
| Legales (4) | 14,9–15,3 KB | 4,2–4,3 KB |

CSS 35,3 KB crudo / **8,7 KB gzip** en 4 hojas · JS 4,7 KB crudo / **2,1 KB gzip** en 1 chunk ·
fuentes 96 KB (4 woff2) · **`dist/` completo: 680 KB**.

Los 22,5 KB en crudo que cuesta `compressHTML: false` son **2,8 KB gzip** en total sobre las nueve
páginas. El HTML viaja comprimido; la legibilidad de los textos legales vale más.

### B5 · Son cuatro paquetes, no tres

`@types/node@26.4.1` se sumó al declarar `"types": ["node"]` en `tsconfig.json`, que es lo que
necesita `astro check` para verificar los tests (`node:test`, `node:assert/strict`). Es
**dev-only, cero impacto en runtime** y está justificado — pero `CLAUDE.md` §0.3 y este documento
decían «tres», y §0.3 es un límite duro de fase.

**Corregido en la documentación** (`CLAUDE.md` §0.3, `docs/development.md`). Y el comentario de
`astro.config.mjs` que justificaba `loadEnv` como forma de «evitar depender de `@types/node`» se
reescribió: ya se depende, y la razón real por la que `loadEnv` sigue siendo correcto ahí es otra —
el config se evalúa antes de que Vite inyecte `import.meta.env`.

---

## ✅ SIN PROBLEMAS — reverificado 2026-09-08

| Área | Resultado |
|---|---|
| Cero red en runtime | **Confirmado literal.** Cero `fetch`, `XMLHttpRequest`, `WebSocket`, `EventSource`, `sendBeacon` e importaciones dinámicas en `src/` y `tests/`. El `connect-src 'none'` propuesto es cierto al pie de la letra. |
| Cero terceros | Fuentes auto-hospedadas. Sin analítica, sin CDN, sin píxeles, sin chat. |
| Cero almacenamiento | Sin `localStorage`, `sessionStorage` ni cookies. Los montos no salen del navegador. |
| Salida estática | `output: 'static'`. Sin `dist/server/`, sin `_worker.js`, sin `functions/`, sin adaptador. 9 rutas. |
| Barra final | Consistente de punta a punta: 0 enlaces internos sin barra (salvo `/`), sitemap alineado. B2 de 2026-09-04 cerrado. |
| Guard de `activeElement` | En su sitio (`Quoter.astro`): el M2 no se aplica al campo enfocado, y la cifra sólo se reanima cuando el valor mostrado cambia. |
| Degradación sin JS | El `noindex`, el CTA con mensaje armado en el servidor y el contenido completo no dependen de JavaScript. |
| Dependencias | `npm audit`: **0 vulnerabilidades**. Cuatro paquetes, todos de build. |
| Sitemap | Derivado de `src/pages/`: una página nueva entra sola. *Filo conocido:* cualquier `.astro` que no sea página y caiga en `src/pages/` entraría también. |

---

## Verificación posterior — 2026-09-08

| Comprobación | Resultado |
|---|---|
| `npm run check` | **0 errores** en 56 archivos |
| `npm test` | **68 tests** (48 + 20 de la guarda), 0 fallos |
| `npm audit` | 0 vulnerabilidades |
| Build sin variable · localhost · `http://` público | **exit 1** en los tres |
| Build válido (`https://staging.dlpay.cl`) | verde, 9 rutas, sin una sola ocurrencia de `localhost` |
| Escudo de indexación | `noindex` en 9/9 rutas + `Disallow: /`; con `PUBLIC_ALLOW_INDEXING=true`, ninguna meta y `Allow: /` |
| `dev` / `check` / `sync` | sin afectar, respaldo a localhost correcto |
| JS al cliente | **idéntico** — mismo hash de contenido en el chunk del Quoter |
| Dependencias añadidas | **ninguna** |
| Cambios visuales | **ninguno** |

---

## 🚦 Bloqueantes de producción

**El proyecto técnico está terminado. No queda ingeniería pendiente para publicar.**

Lo que sostiene esa afirmación es verificable, no de opinión: sin servidor, sin base de datos, sin
secretos, sin dependencias en ejecución, sin peticiones a terceros, sin recogida de datos
personales, capas limpias con el dominio testeado y aislado del navegador, degradación real sin
JavaScript, salida estática portable, y un build que **se niega a publicar** una URL inválida o a
indexar sin permiso explícito.

### Lo único que falta es de negocio y de Compliance

| # | Bloqueante | De quién | Qué desbloquea |
|---|---|---|---|
| **D9** | **Razón social.** Se usa DLPZ INCZ SpA; los T&C publicados dicen «DLPZ PRO SpA» (RUT 78.378.714-8). No se puede publicar bajo una entidad que contradiga el contrato vigente | **Compliance — Joaquín** | `/terminos/`, `/privacidad/`, footer |
| **D19** | **Correo oficial.** Los T&C dicen `contacto@dlpay.cl`; la Política, `contacto@dlpzpro.cl`. La web no publica ninguno hasta confirmarlo | **Compliance** | `/canal-de-denuncias/` |
| **D20** | **El alcance de los T&C ya no coincide con el servicio.** Hablan de custodia y liquidaciones internacionales; el servicio real es cambio de divisas con entrega de dólar digital | **Compliance** | Los textos legales |

Mientras esos tres estén abiertos, **`/terminos/` y `/privacidad/` seguirán siendo páginas de
estado**, y por eso el escudo de indexación de A3 no es una comodidad de Staging: es lo que impide
que un buscador publique bajo la marca DLPay un texto que Compliance no ha firmado.

### Configuración, no ingeniería

| # | Qué | De quién |
|---|---|---|
| D1b | Elegir proveedor de hosting (Cloudflare o Vercel) y crear la cuenta **a nombre de DLPay** | Sebastián |
| — | `PUBLIC_SITE_URL` en el entorno de despliegue. Sin ella, o con un valor inválido, el build falla a propósito | Quien despliegue |
| — | `PUBLIC_ALLOW_INDEXING=true` **sólo** en el despliegue del sitio público | Quien despliegue |
| — | Cabeceras de seguridad y política de caché: `arquitectura-produccion.md` §5.1 y §5.2 | Al elegir proveedor |
| — | `X-Robots-Tag: noindex` en Staging, la defensa robusta que un sitio estático no puede fijar por sí mismo | Al elegir proveedor |
| — | Redirecciones del cutover, con lo que **no** debe capturarse: `docs/migracion-urls.md` | Fase 6 |

### Decisiones abiertas que no bloquean

> **El registro vivo es `CLAUDE.md` §13, y manda.** Esta sección duplicaba la lista y quedó
> desfasada: daba D18 y D24 por abiertas cuando las dos se cerraron el 2026-09-09, y decía que D22
> eran «tres enlaces» cuando son **cinco** (`grep -rn "whatsappUrl()" src/` → pie, `/tarifas`,
> `/como-funciona`, `/confianza` y el botón de `/empresas`). Corregido el 2026-09-15 remitiendo en
> vez de repetir: una tabla de estado en dos sitios se desincroniza siempre.

### Claims publicados pendientes de firma

**Añadido el 2026-09-15 a raíz de una auditoría externa.** Son claims que **ya están en el sitio**
y llevan su marcador `REQUIERE VALIDACIÓN DE COMPLIANCE` en el código, pero no figuraban en ninguna
lista de bloqueantes. No son trabajo de ingeniería: necesitan que DLPay los apruebe o los cambie.

| Claim publicado | Dónde | Marcador |
|---|---|---|
| «cuenta de DLPay en BCI» — un banco por su nombre | Home y `/confianza` | `home.ts`, `trust.ts` |
| «~5 min desde el pago» | `/como-funciona` | `process.ts` |
| «10 días hábiles» de respuesta | `/canal-de-denuncias` | `canal-de-denuncias.astro` |
| «Precio garantizado» | Home | `Process.astro` |
| «la mesa de dinero» | Home | `Process.astro` |
| «el mejor precio» — claim comparativo, en un H1 | `/empresas` | `empresas.astro` |
| «no publicamos una tabla por tramos» — condiciones comerciales | `/empresas` y `/precio` | `business.ts`, constante `volumeTerms` |

**La última se publica en dos páginas desde el 2026-09-23** y por eso es **una constante y no dos
literales**: es una condición comercial, y dos copias que divergen serían dos condiciones distintas
publicadas a la vez. Depende de D5 y de D6; cuando cualquiera de las dos se cierre, la frase cambia
en un solo sitio.

### Copy RETIRADO el 2026-09-29  ·  la negación absoluta de custodia

**Estuvo publicado unas horas y se retiró el mismo día.** Es el único copy que este proyecto ha
retirado después de publicarlo, así que conviene el detalle.

| Qué se retiró | De dónde |
|---|---|
| «No emitimos stablecoins **ni las custodiamos por ti**» → queda «No emitimos stablecoins. **Cuando nos pides que te lo enviemos**, el dólar digital va a la billetera que nos indiques…» | el artículo de stablecoins, sección «Qué hacemos en la mesa» |
| «Dónde está tu dinero **en cada paso**» → «Dónde está tu dinero **cuando operas con un ejecutivo**» | bajada de `/confianza`, que acompaña la figura de tenencia |

**El dato que lo obligó.** Sebastián precisó esa tarde que en la plataforma el cliente puede pagar,
convertir y retirar por su cuenta, y que **mientras no retira, el dólar digital está en el sistema
de DLPay contra un fondo propio**: el cliente tiene un saldo, no el activo, y al retirar se descuenta
de su saldo y del fondo.

Con eso la negación **absoluta** de custodia era cierta del modo asistido y falsa del autoservicio,
que es el modo al que el sitio lleva ocho veces con «Crear cuenta» e «Iniciar sesión». Y la bajada
de `/confianza` afirmaba cubrir «cada paso» con una figura que dibuja tres y en autoservicio serían
cuatro.

**Cómo se pudo publicar, que es lo que importa para que no se repita.** La frase se verificó contra
las reglas del sitio y las pasó todas: `CLAUDE.md` §1 decía —y era lo único que había escrito— que
el servicio entrega dólar digital en la billetera del cliente y que ahí termina. **El documento de
gobierno describía un solo modo de operar.** No fue un descuido de redacción: fue una regla
incompleta, y por eso la corrección principal no está en el copy sino en `CLAUDE.md` §1, que ahora
declara los dos modos y prohíbe expresamente la negación absoluta.

**Lo que queda pendiente y está anotado allá:** contar el autoservicio en `/como-funciona`, que hoy
enseña la mitad del producto. Mientras no se haga, la única página que lo menciona es `/preguntas`,
en la respuesta de volver a pesos, y eso está al revés de como debería ser.

### Copy aprobado por Compliance — 2026-09-30  ·  **la portada de `/precio`**

**Firmado por Sebastián Villanueva Pereira como Compliance el 2026-09-30.**

| Qué se aprobó | Dónde vive |
|---|---|
| «El precio que aceptas es el que pagas. Acá ves dónde está el cobro y dónde no lo hay.» | bajada de `/precio` |
| «aceptas» / «recibes», los dos rótulos del panel | `FiguraPrecio.astro` |
| «ejemplo», junto a «por CLP 2.000.000» | `FiguraPrecio.astro` |
| «sin costo de red» | `FiguraPrecio.astro` |
| «Cotizar otro monto» | `/precio`, bajo el panel |
| «Cancelar antes de transferir» · «Sin costo · basta con no transferir» | fila de `costs` en `/precio` |
| «Preguntas sobre el precio» | título de la sección nueva |

**Entró para RETIRAR una contradicción, no para añadir una promesa.** La bajada decía «Lo que ves
**al cotizar** es lo que pagas», y el sitio publica lo contrario en dos sitios: la Home —«¿El precio
de la web es el precio final? **No.** Es un precio referencial de mercado»— y `content/general.ts`
—«el que se aplica es el que tu ejecutivo te confirma, **no el que la web mostraba cuando
cotizaste**»—. Una versión anterior de esta misma entrega empeoraba el problema: ponía **la misma
cifra** bajo «al cotizar» y bajo «al pagar», con lo que la contradicción dejaba de ser una frase y
pasaba a ser un número. Se descartó.

**El límite de la frase aprobada, dicho acá porque es donde hay que leerlo.** «El precio que
aceptas es el que pagas» es cierta **dentro de los 12 minutos**; pasada la ventana, `general.ts`
dice que se cotiza de nuevo con el precio del momento. La frase y su condición viven en la misma
página, con la banda dos secciones más abajo. **Ampliar la frase, o quitar la banda, la vuelve
falsa.** Es el mismo modo de fallo que cerró la sección anterior: prometer más de lo que se entrega.

**«sin costo de red» no es una promesa nueva:** repite en corto lo que la tabla de costos ya publica
—«El costo de red del traspaso · Sin costo · lo asumimos nosotros»— y es lo que explica que las dos
mitades del panel enseñen la misma cifra.

**«Cancelar antes de transferir» dice «antes de transferir» a propósito.** El caso «ya transferí y
quiero cancelar» **no tiene respuesta publicada** y la fila no puede insinuar una devolución que
nadie ha confirmado. Sigue en la lista de la cabecera de `content/general.ts`.

**«ejemplo» es la etiqueta que faltaba, y no resuelve D7.** El `Quote` es `isReferential`, así que
la cifra del panel es un ejemplo y ahora lo dice. Lo que la etiqueta **no** hace es volver creíble
el número: sale de `PUBLIC_QUOTE_SAMPLE_RATE` = 919,70, y esa tasa es D7. Ver `CLAUDE.md` §13.

### Copy aprobado por Compliance — 2026-09-29  ·  **el plazo del precio aceptado**

**Firmado por Sebastián Villanueva Pereira como Compliance el 2026-09-29.**

| Qué se aprobó | Dónde vive |
|---|---|
| **El precio aceptado se mantiene 12 minutos**, y dentro de ese plazo la cotización está cerrada: no se renegocia | `content/general.ts` y la banda «El precio que aceptas» de `/precio` |

**Es una condición comercial, y entró para cerrar un hueco que era exposición de
consumidor.** Hasta ese día `/precio` publicaba «No cambia después de que lo aceptas» **sin plazo
alguno**, y su figura lo remataba: el pie decía «las dos se salen del cuadro porque **ninguna de las
dos termina ahí**». Tal como estaba, alguien podía aceptar un precio, transferir dos días después y
exigir el precio aceptado con una frase nuestra a favor. El riesgo no era prometer poco: era
**prometer más de lo que se entrega**.

**Obligó a rehacer la figura, no sólo la frase.** La línea verde va ahora de 432 a 816 del `viewBox`
y termina dentro del cuadro, con un **segundo trazo punteado** donde se cierra el plazo. Es la marca
del Design System §6.2 para «un límite: cruzarlo cambia algo», idéntica a la que esa misma figura ya
usaba para el instante de aceptar, porque los dos son instantes. La gris sigue saliéndose: el
mercado no termina.

**Las dos mitades de la regla se publican juntas**, y eso es deliberado: el precio no se mueve en
contra del cliente, y tampoco a su favor. Una cotización que no puede empeorar pero sí renegociarse
no es un precio fijo, es una opción. Decir las dos mitades es lo que hace creíble la primera.

**Lo que queda sin publicar, a propósito:** qué pasa si el cliente ya transfirió y quiere cancelar,
y qué pasa si transfirió y el dinero no llegó. Las dos necesitan un dato operativo que no se ha
dado, y una respuesta no puede insinuar una devolución que nadie ha confirmado. Están enumeradas en
la cabecera de `content/general.ts`.

**Si el plazo cambia, cambian dos sitios:** `content/general.ts` y la banda de `/precio`, incluido
el porcentaje del segundo punteado.

### Copy aprobado por Compliance — 2026-09-29  ·  **un claim regulatorio nuevo**

**Firmado por Sebastián Villanueva Pereira como Compliance el 2026-09-29.**

| Qué se aprobó | Dónde vive |
|---|---|
| **«No decimos que estamos inscritos en la CMF» → «Porque todavía no lo estamos: el proceso de inscripción está en curso. Cuando termine, lo diremos con el respaldo a la vista.»** | `content/trust.ts`, sección «Lo que no vas a leer acá» de `/confianza` |

**Es el claim más sensible que el sitio publica**, y por eso se registra con detalle.

**Qué decía antes y por qué dejó de ser exacto.** Decía «No decimos que estamos regulados por la
CMF» → «Porque **no corresponde afirmarlo**». Sebastián informó ese día que el proceso de inscripción
está en curso, y con eso la versión anterior pasó a ser inexacta en su razón: no es que no
corresponda afirmarlo, es que el trámite **no ha terminado**.

**Obligó a acotar una regla dura, y las dos cosas van en el mismo commit.** `CLAUDE.md` §6 decía
«nunca afirmar que DLPay está regulado por la CMF **ni ningún claim regulatorio equivalente**», y una
frase que describe un trámite ante la CMF cae en esa categoría. Acotado el mismo día: **la
prohibición cubre afirmar el RESULTADO** —estar regulado, autorizado, certificado o avalado— **y no
describir un trámite en curso**. Publicar la frase sin acotar la regla habría dejado el sitio
contradiciendo su propio documento de gobierno; publicar la regla acotada sin cambiar `/confianza`
habría dejado dos frases incompatibles en el aire.

**El límite que la frase no cruza, y hay que vigilarlo.** Dice que el trámite está en curso, y nada
más. **No dice ni puede insinuar que estar en proceso habilite a operar**, que es el riesgo real de
publicar un «en trámite»: en Chile eso se lee como autorización, y no lo es. Tampoco nombra el
registro ni la fecha de presentación, porque ese dato no se aportó.

**Lo que conserva a propósito:** la promesa «lo diremos con el respaldo a la vista», que ya estaba
publicada en la versión anterior. Es la que obliga a enseñar el respaldo el día que el trámite
termine, y es también el motivo por el que ampliar esta frase antes de que eso pase sería
incumplirla.

**Dónde NO se publica.** El emblema y la frase institucional del pie siguen siendo **sólo** los de la
UAF, cuyo alcance es la prevención del lavado de activos y **no** una autorización para operar
(D26, `lib/config/alliances.ts`). El sitio menciona la CMF fuera del blog en **una sola página**,
`/confianza`; comprobado sobre el build.

**Cuando el trámite termine**, esta frase hay que rehacerla entera y con respaldo, y con ella la
enmienda del §6, que existe sólo para describir un proceso en curso.

### Copy aprobado por Compliance — 2026-09-24

**Firmado por Sebastián Villanueva Pereira como Compliance el 2026-09-24.**

| Qué se aprobó | Dónde vive |
|---|---|
| **«No cambia después de que lo aceptas»** como titular destacado de `/precio` | `precio.astro`, banda sobre tinta |

**Lo que esta firma cambia, y por qué había que pedirla.** Las palabras ya estaban publicadas, pero
**dentro de `<PendingNotice title="Tabla de tarifas: en publicación">`** en `/tarifas` — es decir,
bajo un borde de aviso, precedidas de «mientras tanto» y como parche mientras **D5** siga abierta.
`PendingNotice` existe, con esas palabras en su propio código, «para no publicar nunca un texto
inventado ocupando el lugar de uno que requiere revisión legal».

La banda las convierte en el titular y el centro visual de la página. Mismas palabras, estatus
contrario: de salvedad temporal a afirmación destacada. Eso es lo que se firmó.

**El límite que sigue vigente:** la banda **no dice** «Precio garantizado» ni «Congelamos tu
precio», que llevan su propio marcador en `Process.astro` y siguen sin firma. «Garantizado» es una
promesa sobre el futuro; «no cambia después de que lo aceptas» describe cómo opera la mesa. No son
sinónimos y no se pueden intercambiar.

**Cuando D5 se cierre**, esta frase hay que volver a mirarla: si la tabla de tarifas publicada dice
algo distinto sobre cuándo se fija el precio, el titular de `/precio` deja de ser cierto.

### Copy aprobado por Compliance — 2026-09-23

**Firmado por Sebastián Villanueva Pereira como Compliance el 2026-09-23.** Va **sin** marcador
`REQUIERE VALIDACIÓN DE COMPLIANCE` porque ya está aprobado; se registra acá porque una aprobación
que sólo existe en una conversación no es auditable.

| Qué se aprobó | Dónde vive |
|---|---|
| Las tres definiciones nuevas del glosario: **stablecoin**, **billetera** y **red** | `content/glossary.ts` |
| Todo el copy de `/precio`, incluida la afirmación **«un solo cobro en toda la operación, y va dentro del precio»** | `precio.astro` |
| **«El costo de red del traspaso: sin costo, lo asumimos nosotros»** | `precio.astro`, tabla de costos |

Las tres definiciones nuevas van **sin cifras, sin plazos y sin nombrar ninguna red concreta**:
nombrarlas sería una decisión de producto, no de redacción, y hoy no está tomada.

La fila del costo de red es un **compromiso comercial**, no una descripción: si algún día DLPay deja
de asumirlo, esa fila hay que cambiarla antes que nada. Queda dicho acá porque es el tipo de frase
que nadie recuerda haber publicado.

Los dos de `Process.astro` tienen además un problema propio, señalado aparte: conviven en la misma
Home con cinco lugares que dicen «precio referencial, nunca cerrado», y el código ya propone la
alternativa exacta («2. Un ejecutivo confirma tu precio»). La decisión debería tomarse **viendo las
dos frases juntas**.

### Nota sobre el `Disallow: /` de Staging

`Disallow` impide el rastreo, y un buscador que no rastrea **nunca lee el `noindex`**: podría
indexar una URL descubierta por un enlace externo. Con cero enlaces entrantes a Staging el riesgo
residual es mínimo, y la combinación sigue siendo muy superior al `Allow: /` anterior. La defensa
completa es `X-Robots-Tag: noindex` como cabecera HTTP, que es configuración del host y queda
anotada arriba.

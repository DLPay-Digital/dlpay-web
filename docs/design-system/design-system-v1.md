# DLPay — Design System V1

> **Estado:** V1 congelado. La tipografía se cerró el 2026-09-04 en el **set T-C** —Familjen
> Grotesk para display y texto, Spline Sans Mono para cifras— y el detalle está en §3.
> **Base:** ADR-0001. **Fecha:** 2026-09-03.
> Esto **no** es implementación. Son las decisiones visuales que guiarán la construcción.
> Regla: **los assets reales de DLPay mandan** sobre cualquier valor de aquí que se marque provisional.

---

## 1. Fundamentos

- **Personalidad:** mesa de operaciones. Precisa, técnica, rápida, premium sobria — **no** "fintech
  amable" ni plantilla de IA.
- **Los números son el héroe.** El sistema está diseñado para que una cifra (el precio, lo que
  recibes) sea el elemento más fuerte de la pantalla.
- **Superficie clara + zonas de tinta profunda.** Fondo claro para leer; héroes y bandas en
  `#0B1320` para peso y foco.
- **Una acción primaria por pantalla.** Todo el sistema sostiene "cotizar".

---

## 2. Color

### 2.1 Tokens de marca (de los logos oficiales)

| Token | Valor | Uso |
|---|---|---|
| `--verde` | `#16C784` | Acción primaria, el dato vivo (precio), acentos estructurales. **Nunca** como wash/degradado. |
| `--verde-hi` | `#3DD69A` | Hover del verde, líneas del motivo geométrico sobre tinta. |
| `--verde-deep` | `#0A7250` | Verde sobre superficie clara donde `#16C784` no alcanza contraste AA (texto-enlace, iconos). **5,44:1 sobre `--papel` · 4,93:1 sobre `--papel-2`.** Ver la nota de abajo: sobre un chip translúcido del propio verde **no** llega a AA. **Ajustado el 2026-09-17** desde `#0B7A54`, que daba 4,90 sobre papel pero **4,44 sobre `--papel-2`** y dejaba tres rótulos del sitio por debajo del piso. |
| `--tinta` | `#0B1320` | Fondo de héroes, footer, bandas. Superficie profunda. |
| `--tinta-2` | `#101A2B` | Banda secundaria / capas sobre tinta. |

`--verde` y `--tinta` están **verificados** contra `logos/` por muestreo de píxeles: son colores
planos, sin antialias intermedio. Son los oficiales (ver ADR-0001 §2, enmienda 2026-09-03).

> **El límite de `--verde-deep`, medido el 2026-09-17.** El token cumple AA sobre las dos
> superficies claras del sistema, y ahí termina su garantía. Compuesto sobre un **chip translúcido
> del propio verde** —el token al 10% sobre `--papel-2`, que resuelve a `rgb(213,222,212)`— el texto
> en `--verde-deep` da **4,31:1** y **no alcanza el 4,5 de AA**. Con el valor anterior daba 3,92:1,
> así que el ajuste mejora el caso pero no lo salva: **ningún verde suficientemente oscuro para leer
> sobre su propio chip seguiría siendo el verde de la marca.**
>
> Regla práctica: **`--verde-deep` sobre chip verde no es un par válido para texto.** Si hace falta
> una pastilla verde con texto, el texto va en `--ink`; el verde se reserva para el fondo, que es
> superficie y no tiene piso de contraste. Sobre un chip así sí valen los **gráficos** (piso 3:1):
> iconos, bordes y trazos, que es justo lo que hacen `IconBadge` —el token al 12%, con un icono
> dentro— y el anillo de foco del cotizador, que es una sombra al 18%.
>
> Esos dos alfas van **escritos a mano** en sus componentes, no derivados del token: `color-mix()`
> queda por debajo del `cssTarget` del proyecto. Es deuda conocida y tiene una consecuencia
> concreta: **al mover el token hay que moverlos también**, y el 2026-09-17 se quedaron atrás una
> jornada.

### 2.2 Neutros (tintados hacia la tinta — H≈216, no gris puro)

| Token | Valor aprox. | Uso |
|---|---|---|
| `--papel` | `#F6F5F1` | Fondo de página (off-white cálido, S baja). |
| `--papel-2` | `#ECEAE3` | Secciones alternas, fondos de campo secundario. |
| `--ink` | `#131A26` | Texto principal sobre claro. |
| `--ink-mute` | `#5A6472` | Texto secundario, labels. |
| `--line` | `rgba(11,19,32,.14)` | Bordes hairline, divisores. |
| `--on-tinta` | `#EDF2EF` | Texto principal sobre tinta. |
| `--on-tinta-mute` | `#9DB0AA` | Texto secundario sobre tinta. |
| `--on-verde` | `#04140E` | Texto sobre relleno `--verde` (CTA, enlace de salto). 8.58:1. **Añadido 2026-09-09**: estaba escrito a mano en 9 sitios. |
| `--line-on-tinta` | `rgba(237,242,239,.40)` | Contorno de **control** sobre tinta. 0.40 es el alfa mínimo que cumple el 3:1 de WCAG 1.4.11 (3.50:1 sobre `--tinta`, 3.47:1 sobre `--tinta-2`). Los separadores decorativos de 0.06–0.14 **no** lo usan. **Añadido 2026-09-09**: a 0.28 ya se coló una vez. |

### 2.3 Colores semánticos (separados del acento)

| Token | Valor | Uso |
|---|---|---|
| `--sube` | `#16C784` | Precio/valor que sube (coincide con el verde de marca, a propósito). |
| `--baja` | `#C7593B` | Precio que baja, alertas suaves (rojo-arcilla apagado, **no** rojo puro). |
| `--aviso` | `#B5852A` | Avisos **sobre tinta**. Sobre superficie clara no alcanza ni para un borde. |
| `--aviso-deep` | `#825E17` | **Todo aviso sobre superficie clara**, texto y bordes. 5.40:1 sobre papel, 4.90:1 sobre papel-2. |
| `--error-bg` | `#FBF1EC` / borde `#E7C3B4` | Fondo de mensaje de error/aviso. |

### 2.4 Contraste (a verificar en implementación)

- `#16C784` sobre `#F6F5F1`: **2.02:1** (medido) — **no usar para texto ni para gráficos que
  carguen significado** (WCAG pide 3:1 para estos últimos). Sólo para fills/CTA con texto oscuro
  encima y para líneas decorativas. Un conector de diagrama que indica el flujo del dinero **sí**
  carga significado: va en `--verde-deep`.
- `#0A7250` (`--verde-deep`) sobre `#F6F5F1`: **5.44:1**, y sobre `#ECEAE3` **4.93:1** — sirve para texto, foco y gráficos sobre las dos superficies claras. *Antes del 2026-09-17 era `#0B7A54`, que daba 4.90 sobre papel pero sólo 4.44 sobre papel-2.*
- `#16C784` sobre `#0B1320`: **8.45:1** — sirve para todo.
- `#B5852A` (`--aviso`) sobre `#F6F5F1`: **3.03:1**, y sobre `#ECEAE3` sólo **2.75:1** — no alcanza
  ni para un borde. Sobre superficie clara se usa siempre `--aviso-deep` (5.40:1 / 4.90:1), texto y
  bordes por igual. Mismo desdoblamiento que el verde, y por la misma razón. Para texto-enlace sobre claro usar `--verde-deep`.
- Piso: **WCAG AA** (4.5:1 texto normal, 3:1 texto grande y UI).

---

## 3. Tipografía — **T-C, cerrada**

Elegida por Sebastián el 2026-09-04 tras revisar los tres sets sobre el héroe y el cotizador
reales (ADR-0001 §4, enmienda). **Set T-C — geométrica disciplinada:** moderna y seria sin volverse
corporativa ni intimidante, con las cifras leyéndose mejor y la escala sintiéndose más ordenada.
Es la que rima con el corte diagonal del isotipo.

| Rol | Familia | Pesos | Fallback |
|---|---|---|---|
| **Display, títulos y texto** | **Familjen Grotesk** | 400 · 500 · 600 · 700 | `'Helvetica Neue', Helvetica, Arial, sans-serif` |
| **Cifras y datos** | **Spline Sans Mono** | 400 · 500 · 600 | `ui-monospace, 'SF Mono', Menlo, monospace` |

**Dos familias, una sola para todo el texto.** No se añade una tercera sin una necesidad concreta
y una enmienda a este documento.

**Licencias:** ambas **SIL Open Font License 1.1** — verificado. Se pueden auto-hospedar,
modificar y usar comercialmente. Conservar el archivo de licencia junto a las fuentes.

**Implementación (ADR-0004):**
- Ambas son **variables**: un archivo `woff2` por familia cubre todos los pesos.
- **Auto-hospedadas** en `public/fonts/`. Nunca desde un CDN de terceros en producción.
- Subset **latin + latin-ext** (el español necesita `á é í ó ú ñ ü ¿ ¡`).
- `font-display: swap` y `size-adjust` en el `@font-face` de fallback, para que el intercambio no
  mueva el layout (CLS).
- Precarga sólo de la variante que aparece en el primer viewport.

### 3.0 Reglas de uso (vinculantes)

1. **La cifra manda, siempre.** El precio referencial y el "recibes aprox." son los elementos más
   fuertes de su pantalla. Ningún titular debe ganarles el pulso visual.
   *Caso resuelto:* en `/cotizar` el cotizador va plano sobre papel, sin la tarjeta elevada que en
   la Home compensa el peso del titular. Ahí un `h1` de 52px le ganaba a un precio de 32px, y el
   titular bajó a 32px. En la Home el `h1` sí mide 52px porque la tarjeta elevada y el contraste
   sobre tinta le devuelven el protagonismo a la cifra.
   **Volumen del titular:** la Home habla a `--t-display`; **todas** las páginas interiores hablan
   a `--t-h2`. Son dos voces, no cinco.
2. **La escala es un techo, no un objetivo.** Si un titular compite con la cifra, se **reduce el
   titular** — nunca se agranda la cifra para compensar. La tipografía no debe volverse
   excesivamente grande: la jerarquía la dan el contraste y el espacio, no el tamaño bruto.
3. **Cifras siempre tabulares** (`font-variant-numeric: tabular-nums`) en todo lo monetario.
4. Familjen Grotesk se usa en **un solo eje de peso** por nivel; nada de mezclar pesos dentro de
   un mismo titular.

### 3.1 Escala tipográfica (ratio ~1.25, base 16px)

> Los tamaños de abajo se verificaron con T-C en el board. Al construir se permite un ajuste
> óptico de ±1–2 px si la altura de x de Familjen Grotesk lo pide, **sin subir el techo**.

| Rol | Tamaño (desktop / móvil) | Peso | Line-height | Tracking |
|---|---|---|---|---|
| Display / H1 | 52 / 30 px | 700 | 1.04 | -0.015em |
| H2 sección | 32 / 23 px | 700 | 1.1 | -0.01em |
| H3 | 18–20 / 17 px | 600–700 | 1.2 | 0 |
| Body | 16 / 16 px | 400 | 1.55 | 0 |
| Body-sm / secundario | 14 / 14 px | 400 | 1.5 | 0 |
| Label | 12–13 px | 600 | 1.3 | +0.01em (sin MAYÚSCULAS forzadas) |
| **Dato grande** (precio, recibes) | 26–32 px | 500 | 1 | -0.01em, tabular |
| Dato pequeño (desglose, timestamp) | 12–13 px | 500 | 1.4 | tabular |

- Longitud de línea de texto corrido: **< 65–70 caracteres**.

  > **Cómo se escribe eso en CSS, y por qué no es obvio** *(medido el 2026-09-17)*
  >
  > **`1ch` NO es un carácter.** Es el ancho del glifo **cero**, y en Familjen Grotesk el cero es
  > ancho: a 16 px mide **9,07 px**, mientras que el carácter medio de un texto en español mide
  > **6,64 px**. El factor es **1,37**, así que toda medida escrita en `ch` sale **un 37 % más
  > ancha** de lo que creyó quien la escribió. `max-width: 66ch` no da 66 caracteres por línea: da
  > unos 90.
  >
  > **El tope de 65 caracteres se escribe `max-width: 47ch`** (65 × 6,64 ÷ 9,07 = 47,6).
  >
  > **Si cambia la tipografía de texto, este factor se vuelve a medir.** Por eso no existe un token
  > `--medida`: un token escondería la dependencia y el número seguiría ahí, equivocado, cuando la
  > fuente cambiara. Se mide contando los caracteres de la primera línea con
  > `Range.getClientRects()` sobre el build, nunca a ojo.

  > **La excepción de los textos largos: el blog y las legales** *(decidida el 2026-09-23)*
  >
  > El tope de 65 caracteres vale para **todo el sitio menos dos familias**: los artículos del blog
  > y las cuatro páginas legales. Las dos usan una columna de **760px**, que da entre **93 y 112
  > caracteres** por línea según el texto.
  >
  > **No es un descuido heredado: es una decisión de Sebastián, y tiene un motivo de tono.** Un
  > contrato y un artículo no son una página de marketing, y la medida de lectura es lo que lo dice
  > sin decirlo: una columna ancha se lee como un texto para leer entero, no como una sección que se
  > barre. La medida es **parte de cómo se distingue un documento del resto del sitio**.
  >
  > | | columna de texto | caracteres en una línea llena | llenado de la columna |
  > |---|---|---|---|
  > | Artículo del blog | 760px | **111** | 82 % |
  > | `/tarifas` | 760px | **120** | 72 % |
  > | `/privacidad` | 760px | **119** | 70 % |
  > | `/canal-de-denuncias` | 760px | **116** | 72 % |
  > | `/terminos` | 760px | **114** | 69 % |
  > | Todo lo demás | `47ch` | **58–64** | — |
  >
  > **CÓMO SE CUENTA, porque la primera versión de esta tabla estaba mal** *(corregida el
  > 2026-09-23)*. Publicó 93–108 y lo correcto es 114–120. El error no era de unidades —ése es el
  > `ch` de arriba— sino de **definición**:
  >
  > · **Capacidad** = ancho de la columna ÷ ancho medio del carácter. Es lo que cabría si la línea
  >   llegara al borde.
  > · **Recuento** = los caracteres que hay **de verdad** en una línea renderizada. Es lo que pide
  >   la regla.
  >
  > No son lo mismo y aquí **la capacidad salía corta**, no larga: el ancho medio del carácter se
  > calcula sobre todo el párrafo e incluye los espacios finales de línea, que no se dibujan, así
  > que sale demasiado ancho y el cociente demasiado bajo. **Se cuenta recorriendo el texto con un
  > `Range` carácter a carácter y agrupando por la coordenada `top` de cada línea**, sobre el build.
  > Nunca dividiendo.
  >
  > **Se iguala el ANCHO, no el número.** El número depende del texto —entre estas cinco páginas va
  > de 111 a 120 con la misma columna— así que perseguir una cifra exacta habría dejado a las
  > legales más estrechas que el artículo, que es lo contrario de tratarlas igual. Lo que se
  > replica es la columna.
  >
  > **Mismo ancho no da mismo aspecto, y conviene saberlo antes de mirarlo.** El artículo llena el
  > 82 % de su columna y las legales entre el 69 y el 72 %, con un 22–33 % de líneas que acaban
  > antes de la mitad. No es la columna: el artículo es prosa seguida y las legales son párrafos
  > cortos y listas. **El blanco no desapareció, se mudó de fuera de la columna a dentro** — antes
  > eran 298px de texto con casi 500px de blanco a cada lado. Es una mejora, y no una simetría.
  >
  > **Qué se pierde, dicho y no disimulado:** el tope de 65 existe porque a partir de ahí cuesta
  > encontrar el principio de la línea siguiente. En un documento que se consulta por secciones ese
  > coste es menor que el de un texto legal presentado como una cinta estrecha — las legales estaban
  > en **38 caracteres contados**.
  >
  > Factor medido en estas páginas: **1,315 a 1,395**, que confirma el 1,37 de arriba.
- `text-wrap: balance` en titulares; `text-wrap: pretty` en párrafos.

### 3.1b Auditoría de la escala  ·  *2026-09-24*

**Medida sobre el build, a 390 y a 1280, en las once rutas.** El estado después de corregir:

| | 390 px | 1280 px |
|---|---|---|
| H1 | **30** en todas | **32** en todas · 52 en la Home y en `/empresas` |
| H2 de sección | **23** en todas | **32** en todas |
| H3 | **17** en todas | **20** en todas |
| Titular de la banda de cierre | **23** | **32** |

**Ninguna página tiene dos tamaños para el mismo nivel.** Antes de la auditoría, siete titulares
estaban fuera.

#### La causa era una sola, y vuelve a pasar si no se sabe

**Un titular con selector propio gana a la regla que lo sube a la escala de escritorio.** El patrón
del sitio es declarar el tamaño móvil en la base y subirlo en `@media (min-width: 900px)` con una
regla `h2 { … }`. Pero `.seguro-banda h2`, `.scope h2`, `.palabras h2` y `.qa h3` tienen más
especificidad que esa regla suelta, así que **se quedaban en el tamaño MÓVIL en una pantalla de
1280**: 23 px donde sus hermanos median 32, y 17 donde los demás H3 median 20.

No se ve leyendo el CSS —cada regla es correcta por su cuenta— y no se ve en móvil, que es donde
suele mirarse. **Se ve midiendo `fontSize` a 1280.**

> **Al añadir un titular con selector propio, hay que subirlo también en la media query.** Si no,
> hereda el móvil para siempre.

#### Y un caso distinto: el que no heredaba nada

El titular de la banda de cierre de `/preguntas` se dejó sin `font-size` para que tomara el de la
página. Esa página **no tiene una regla `h2` suelta** —sus tamaños van por selector— así que no
heredó nada y cayó al tamaño por defecto del navegador: **24 px**, que no está en la escala. Ahora
lo declara.

#### Lo que queda fuera de la regla, a propósito

`/empresas` habla a `--t-display` (52 px) y §3.0.1 dice que **sólo la Home** lo hace: «son dos
voces, no cinco».

**Confirmado por Sebastián el 2026-09-24, al revisar esta auditoría: «`/empresas` y la Home son un
caso aparte».** No es una excepción heredada del rediseño de ese encabezado: es una decisión
vigente y tomada mirando la tabla de arriba.

Así que la regla de §3.0.1 se lee con este matiz: **las dos páginas de entrada —la Home para
personas y `/empresas` para empresas— hablan a `--t-display`; las interiores, a `--t-h2`.** Siguen
siendo dos voces; lo que cambia es cuántas páginas usan la primera.

**No se vuelve a levantar en la próxima auditoría.**

---

### 3.2 Antipatrones tipográficos (prohibidos)

Eyebrow en MAYÚSCULAS sobre cada título · acentuar una sola palabra del titular en color/itálica ·
labels tipográficos innecesarios sobre el contenido · "→" pegado al texto de botones/enlaces ·
cadenas unidas con "·" como metadato decorativo · tipografías genéricas por defecto
(Inter/Roboto/Arial/Space Grotesk/Fraunces) · agrandar un titular para darle jerarquía en vez de
resolverla con contraste y espacio.

---

## 4. Espaciado, layout y forma

### 4.1 Escala de espaciado (base 4)

`4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128` px. Layout con **flex/grid + `gap`**, no márgenes
por elemento.

### 4.2 Breakpoints

Sólo dos, y se usan de forma consistente en todo el sitio. Móvil es la base;
los breakpoints **añaden**, nunca deshacen.

| Ancho | Qué cambia |
|---|---|
| `760px` | Rejillas de 1 → 2 o 3 columnas (casos, bloques de confianza, pie). |
| `900px` | Layout completo de escritorio: héroe a dos columnas, padding de sección a 64px, escala tipográfica de escritorio, navegación desplegada. |

Anchos mínimos puntuales (una tabla que no puede comprimirse más, un menú
desplegable) **no** son breakpoints y no cuentan para esta regla.

### 4.3 Grid

- Contenedor de contenido: **máx. ~1112 px**, centrado.
- Padding lateral de sección: 64 px desktop / 20 px móvil.
- Héroes: grid de 2 columnas (`~1.05fr .95fr`) — copy izquierda, cotizador derecha. Móvil: 1 columna, cotizador primero.

### 4.3.1 Ritmo vertical de sección (revisión global 2026-09-04)

Un rol, un valor. Cuando dos páginas dan el mismo rol a una sección, la sección
mide lo mismo en ambas.

| Rol | Padding vertical |
|---|---|
| Héroe (Home y páginas interiores) | `--s-8` arriba / `--s-9` abajo |
| Sección de contenido | `--s-9` |
| Banda de cierre con CTA | `--s-8` |
| Pie | `--s-8` arriba / `--s-6` abajo |

Intro de sección (`h2` + una línea): medida única de **46ch**.

### 4.3.2 Trampas de composición (encontradas revisando, 2026-09-04)

Tres errores que se ven iguales en el código y distintos en pantalla. Conviene
reconocerlos antes de repetirlos.

1. **El recuadro visible tiene que llenar su celda.** Si el elemento de la rejilla es
   una etiqueta o un envoltorio y quien pinta el borde va dentro, el envoltorio se
   estira y el recuadro no: dos opciones con texto de distinto largo quedan de distinta
   altura. El hijo necesita `flex: 1` o `height: 100%`.
2. **Una rejilla por fila no alinea columnas entre filas.** Si cada `li` declara su
   propio `display: grid`, las pistas `auto` se dimensionan con el contenido de esa fila
   y las cifras no quedan en columna. Para que aliñen, las pistas van con **ancho fijo**.
3. **Una regla de acento sobre `inline-block` mide lo que el texto.** En una rejilla de
   tarjetas con titulares de distinto largo, cada raya sale de un ancho distinto. La
   regla va con **ancho fijo** (28px), en un pseudo-elemento.

### 4.4 Radios (discretos — nada de "pill")

| Token | Valor | Uso |
|---|---|---|
| `--r-0` | 0 | Bandas, divisores. |
| `--r-1` | 3 px | Botones y campos en registro "A puro" / elementos densos. |
| `--r-2` | 6 px | Botones, campos, chips (default A×C). |
| `--r-3` | 10 px | Tarjetas contenedoras (cotizador, bloques de confianza). |
| `--r-card` | 14 px | **Una tarjeta elevada.** Va siempre con `--elev-card` o `--elev-pop`: el radio y la sombra son la misma decisión. *Decía «sólo la tarjeta del cotizador» hasta el 2026-09-25; ver §4.5.* |
| `--r-block` | 20 px | **Bloque contenido**: una banda en tinta dentro de una sección clara. Añadido 2026-09-08. |

Botones **nunca** con `border-radius` tipo píldora.

**Sobre `--r-block` (adición del 2026-09-08).** Es el radio **más amplio del sistema y su techo**:
por encima de 20 px se pierde el registro A×C de "radios discretos" y la caja empieza a leerse como
una tarjeta de plantilla. Es mayor que `--r-card` **a propósito**, no por escalar la escala: la
tarjeta vive *dentro* del bloque, y dos radios iguales anidados se leen como un error de encaje —
el exterior tiene que abrir más que el interior. Se pidió "24 px o `--radius-lg`"; se cerró en 20
para no romper el registro y para continuar la progresión existente (0 · 3 · 6 · 10 · 14 · **20**).

Hoy lo usa una sola pieza, el bloque oscuro de `Steps.astro` en la Home. Si aparece un segundo
caso, conviene revisar si sigue siendo "bloque contenido" o si se está usando como radio genérico.

### 4.5 Elevación (mínima, por rol) — **reescrita el 2026-09-25**

> **Qué decía antes, y por qué se cambió.** La versión anterior era una lista de nombres propios:
> `--elev-card` «**sólo** la tarjeta del cotizador sobre la tinta» y `--elev-pop` «menús/popovers
> (futuro)». Se escribió cuando el sitio era el cotizador y poco más. Hoy son once rutas, y la
> regla **no describía el sitio**: al auditarla aparecieron cuatro usos y sólo uno encajaba en su
> letra. Una regla que el propio proyecto incumple no protege nada — genera deuda registrada y
> obliga a pedir una excepción cada vez que alguien hace lo evidente.
>
> Lo detonó la entrega `2026-09-25-tarifas-v2`, que afirmaba no necesitar excepción alguna y
> necesitaba tres. Sebastián eligió reescribir la regla en vez de excepcionarla.
>
> **Lo que NO cambia:** los dos valores, el token `--elev-0` como respuesta por omisión, y el
> fundamento de ADR-0001 — la jerarquía la dan la tipografía y el espacio, no las sombras.

**La elevación se elige por lo que el objeto ES, no por cuánto se quiere que destaque.**

| Token | Valor | Qué eleva |
|---|---|---|
| `--elev-0` | ninguna | **Casi todo, y sigue siendo la respuesta por omisión.** Una sección no se eleva por ser importante. |
| `--elev-card` | `0 24px 60px -24px rgba(11,19,32,.45)` | **El objeto del que trata la página**, cuando se apoya sobre una banda en tinta o la cruza. Es la afirmación más fuerte que hace el sistema: esto está encima de todo lo demás. |
| `--elev-pop` | `0 8px 24px -12px rgba(11,19,32,.25)` | **Todo lo demás que está por encima de la página**: un panel que se abre (menú, cajón), una tarjeta levantada del papel, un elemento dentro de una maqueta de producto. |

**Tres límites duros, y el primero es el que impide que esto se convierta en papel tapiz:**

1. **Como mucho un `--elev-card` por página.** Si hay dos, ninguno es «el objeto del que trata la
   página». Es el equivalente en superficie de la regla de una sola acción primaria por pantalla.
2. **La superficie alterna con el papel.** Si todo va sobre tarjeta, la tarjeta deja de significar
   algo: **lo elevado es lo que el cliente mira, lo plano es lo que lee.** Una página entera de
   tarjetas es una plantilla, y eso lo prohíbe el Principio 3 de `CLAUDE.md`.
3. **La sombra nunca es decorativa.** Eleva algo que de verdad está delante de otra cosa. No se usa
   para separar dos bloques que van seguidos: para eso está el filete, y si no basta el filete, lo
   que falla es el espacio.

**Qué cuenta para el límite de uno por página, aclarado el 2026-09-25** al montar el teléfono en
`/como-funciona`: se cuentan **los tokens de elevación del sistema**, no todas las sombras del
render. Un mockup trae su propio cromo —el bisel del teléfono y el filete de 1 px de cada burbuja
de chat— y esas sombras describen **un objeto de otra marca**, igual que los grises del bisel, que
el propio componente declara locales y fuera del sistema. Un teléfono que se apoya en la banda se
eleva con su bisel y **no gasta el `--elev-card` de la página**; ponerle además el token sería
duplicar la sombra. La comprobación correcta es contar `--elev-card`, no contar `box-shadow`.

**Auditoría del 2026-09-25 — los cuatro usos que había, con su veredicto bajo la regla nueva:**

| Dónde | Token | Veredicto |
|---|---|---|
| `Quoter.astro:169` — la tarjeta del cotizador flotando sobre la tinta del héroe | `--elev-card` | **Correcto.** Es el caso canónico y el que da nombre al token |
| `Header.astro:370` — el desplegable «Información» del escritorio | `--elev-card` → **`--elev-pop`** | **Corregido el 2026-09-25.** Es un panel que se abre, que es literalmente para lo que se declaró `--elev-pop`. Llevaba la sombra fuerte sin motivo |
| `Header.astro:517` — el cajón del móvil | `--elev-pop` | **Correcto**, y es el que demuestra que el token ya se usaba bien |
| `Steps.astro:232` — una tarjeta sobre papel, en la Home y en `/como-funciona` | `--elev-card` | **Debería ser `--elev-pop`**, y **no se toca hoy**. Está en la Home, que es diseño congelado y «caso aparte» por decisión de Sebastián; se corrige el día que alguien abra ese componente por otro motivo. Queda escrito para que no se lea como precedente |

**Y el uso que estrena la regla:** `/tarifas` monta la tarjeta del cotizador en miniatura sobre su
portada en tinta. Es «el objeto del que trata la página» cruzando una banda oscura, uno solo, y con
el resto de la página alternando papel — los tres límites cumplidos, sin excepción que escribir.
Eso es lo que la regla nueva permite y la vieja no: **que el lenguaje de superficie salga de la
portada sin pedir permiso cada vez.**

### 4.5.1 Apilamiento (`z-index`) — añadido 2026-09-09

**Regla: todo elemento superpuesto lleva `z-index` explícito.** Nunca se confía en el orden de
pintado implícito, porque en este sistema **una animación puede romperlo desde otro componente**:
un elemento con una animación viva de `opacity` obtiene contexto de apilamiento mientras corre, y
entonces gana por orden del DOM. Hay siete animaciones de `opacity` repartidas por el sitio.

| Valor | Qué |
|---|---|
| `30` | Barra fija inferior del cotizador. |
| `20` | Enlace de salto al contenido. **Siempre lo más alto**, por accesibilidad. |
| `15` | Menú móvil desplegado. |
| `10` | Cabecera. |
| `1` | Superposiciones **locales**, dentro de una caja que ya crea su contexto. |
| negativos | Capas de fondo detrás del contenido. |

Antes de añadir un valor nuevo, comprobar si basta con uno local. El caso completo y cómo se
diagnostica están en `docs/development.md`.

### 4.6 Bordes

Hairline `1px solid var(--line)`. Los campos de formulario usan borde, no sombra. "No todo es una
tarjeta": borde/fill/radio/sombra se gastan por rol, para levantar **una** cosa.

### 4.7 Un bloque con dos superficies — excepción, añadida 2026-09-28

**Una sección tiene un fondo.** Ésa es la regla, y sigue siéndolo: cada banda del sitio es papel,
`--papel-2` o tinta, y el ritmo de la página se compone alternándolas.

**Una excepción, con una carcasa y CUATRO piezas al 2026-09-28:** `Puente.astro` y sus cuatro usos
—la Home a `/tarifas`, `/tarifas` a `/confianza`, `/precio` a `/tarifas` y `/como-funciona` al
artículo de activos tokenizados—. Están partidos por la diagonal de la marca —papel donde está el
texto, que es la página en la que estás, y tinta donde está la figura, que es la otra— con un
`linear-gradient` de parada dura.

**Dos de los cuatro apuntan a `/tarifas` y enseñan figuras distintas**, y eso no es casualidad: lo
que se repite en la familia es **el corte**, no el dibujo. Dos puentes con la misma figura serían
plantilla, no familia.

*La carcasa se extrajo al aparecer el segundo caso, no antes: ver la cabecera del componente.*

**Por qué se concede, con la ventaja escrita, como manda la instrucción permanente 4:**

1. **El asunto de la pieza es cruzar.** Con un fondo el bloque *habla* de la otra página; con dos, la
   *enseña*. El umbral no se dibuja con un marco: es el fondo. Es la misma lógica que hace que el
   movimiento del sitio sea información y no adorno.
2. **Protege un ritmo medido.** La Home tiene sólo **dos** bandas oscuras —el héroe, 781 px, y
   `Business`, 418— con **5.284 px de papel seguidos** entre ellas. Una tercera banda oscura entera
   aplana ese recorrido; media, no.
3. **No cuesta nada.** Un degradado. Ni elemento extra, ni imagen, ni JavaScript, ni un token nuevo.

**Los límites, que son lo que impide que esto se extienda:**

- **Las dos superficies tienen que ser las del sistema.** Papel y tinta, sin valores intermedios y
  sin degradado visible: una **parada dura**, no una transición. Un degradado suave es el «wash» que
  ADR-0001 prohíbe.
- **El eje es el de la marca.** El corte baja sobre la diagonal del isotipo, ~34°, como las cuñas del
  héroe. Medido: −33,930° el corte y −34,216° las cuñas, con el mismo instrumento.
- **Cada texto vive sobre su superficie, y eso se comprueba en el render.** Bajo 960 px el bloque
  vuelve a ser **una sola** superficie: a 390 el corte baja 263 px a lo largo de la columna y partía
  el titular por la mitad, con media frase en oscuro sobre oscuro.

  **La holgura se mide POR LA TINTA, y por cada trozo de tinta, no por la caja que la contiene.** Es
  la lección del cuarto puente (2026-09-28) y costó dos mediciones falsas seguidas:

  1. La caja de una figura que **no llena** su columna mide un borde donde no hay nada pintado. La
     del riel del cuarto puente da **32 px** donde la tinta da **45**.
  2. Y la envolvente de varios trozos de tinta tampoco vale: sus esquinas son puntos donde **no
     pinta nada**. La envolvente del texto combina la *x* más a la derecha de un párrafo con la *y*
     más abajo de otro, y esa esquina está vacía. Medida así, la holgura del texto del primer puente
     daba 15 px a 960; por trozo da **93**.

  El número honesto es **la distancia mínima entre cualquier rectángulo que de verdad pinta y la
  recta del corte**. Con los cuatro puentes medidos así, de 960 a 2560 px:

  | puente | figura | texto |
  |---|---|---|
  | 1 · Home → `/tarifas` | 65–68 | 93–162 |
  | 2 · `/tarifas` → `/confianza` | 51 | 77–146 |
  | 3 · `/precio` → `/tarifas` | 86 | 107–177 |
  | 4 · `/como-funciona` → el artículo | 45–115 | 72–141 |

  **El rango de la familia es 45–115 por la figura y 72–177 por el texto**, y **el piso sigue siendo
  40**: el caso más justo es el cuarto puente a 960 px, con 45. *Las cifras anteriores de este
  párrafo —«93 a 196» y «60 a 82»— salían de medir cajas y quedan derogadas; el orden de magnitud no
  cambia, la disciplina de medición sí.*

  **Qué esquina manda, que es lo que evita el error:** el corte **baja hacia la izquierda**, así que
  la esquina que se acerca al corte es la **superior** de la figura y la **inferior** del texto. Una
  figura más alta acerca su esquina de arriba al corte aunque no se haya movido de sitio.

  **Y para empujar una figura que no llena su columna, `margin-inline-start: auto`, nunca
  `justify-self: end`.** Con `justify-self` la celda se ajusta al contenido, y un `<svg>` con
  `width: 100%` no tiene ancho intrínseco: colapsa a los 300 px por omisión de un reemplazado. El
  dibujo se encoge en vez de moverse, y la holgura que se gana es falsa.
- **No autoriza dos fondos en general.** Autoriza que **un bloque cuyo asunto es cruzar de una
  página a otra** enseñe las dos. Una sección partida «para dar variedad» sigue fuera del sistema,
  porque ahí el corte no significaría nada.
- **No gasta elevación.** El límite de un `--elev-card` por página (§4.5) queda intacto: esta pieza
  no usa ninguno.
- **No va al final de una página interior.** La mitad de tinta desembocaría en el pie, que también
  es tinta, y las dos se funden: el bloque pierde su canto inferior y la figura parece del pie.
  **Le pasa a las cuatro páginas interiores**, porque todas terminan en el mismo pie oscuro. Queda
  escrito acá para el puente que falta. Papel por debajo, medido: **489 px** en `/tarifas` y
  **345 px** en `/precio` y en `/como-funciona`, que es el caso más justo — una banda de cierre
  entera, no un margen.

---

### 4.8 La portada de una página: dos familias y un hueco  ·  *añadido el 2026-09-29*

**Las páginas legales abren sólo con su titular, a propósito.** `/terminos`, `/privacidad` y
`/canal-de-denuncias` no llevan objeto en la portada, y **no es una carencia: la sobriedad es parte
de lo que esas páginas dicen.** *Regla confirmada por Sebastián el 2026-09-29, corrigiendo la
deducción de que «una lista o un documento no lleva portada», que era falsa.*

**`/tarifas` es la excepción dentro de las legales**: está en el pie bajo Legal y sí abre con su
objeto, porque describe el servicio y no obligaciones contractuales, que es la misma distinción por
la que su contenido es real y el de `/terminos` es una página de estado.

**Las demás abren con el objeto de la página:** el cotizador en la Home, el teléfono en
`/como-funciona`, el MacBook en `/empresas`, la barra del precio en `/tarifas`, la línea de tenencia
en `/confianza` y, desde el 2026-09-30, **la tableta con una conversación dentro en `/preguntas`**.

**Y las dos familias están separadas por un hueco vacío.** Las trece portadas publicadas, **medidas
a 1280 px** —el rango se mide ahí y sólo ahí, ver más abajo— sobre el build de `67abaa9`, con
`/preguntas` actualizada al de `2026-09-30`:

| familia | páginas y alto | rango |
|---|---|---|
| **con objeto** | Home 781 · `/como-funciona` 660 · `/preguntas` 634 · `/empresas` 569 · `/tarifas` 529 · `/confianza` 460 | **460–781 px** |
| **sin objeto** | `/canal-de-denuncias` 288 · `/precio` 262 · `/terminos` 262 · `/blog` 236 · `/privacidad` 236 | **236–288 px** |

**Entre 288 y 460 px no hay ninguna.** Ese hueco de 172 px es la regla y no una casualidad: **una
portada de altura intermedia es una que no ha decidido a qué familia pertenece.**

**Los artículos del blog son su propio caso**, y por eso no entran en la tabla: su portada no es una
pieza a un lado del titular sino una banda a sangre con un emblema centrado o un dato, y se queda
corta en las dos variantes — 256 px el de activos tokenizados, con su pictograma de 160×160, y
246 px el de stablecoins, con su portada de cifra. Ver §6.1 para qué puede llevar.

**`/preguntas` cambió de familia el 2026-09-29** —de 262 a 477 px, con una figura de nueve puntos—
**y volvió a cambiar de altura el 2026-09-30**, al sustituirla por una tableta con una conversación
dentro: **634 px**, la tercera más alta del sitio. Los dos montajes dejaron tres cosas aprendidas que
valen para las dos portadas que faltan:

- **El layout decide la familia tanto como la figura.** En `layout="split"` la figura de nueve puntos
  cerraba en **402 px, dentro del hueco**, y estirar el dibujo para llegar a 460 sólo lo dejaba
  espigado. Una figura ancha —2,63:1— va apretada en media columna, y por eso las cuatro páginas
  interiores con figura ancha usan `stacked`. **Antes de tocar un dibujo para que su portada entre en
  la familia, hay que mirar la rejilla.**
- **El rango se mide a 1280 y sólo ahí, y no porque en móvil se quede corto.** Al contrario: en móvil
  las portadas con objeto **crecen** al apilarse —Home 1137, `/como-funciona` 684, `/confianza` 669 a
  390 px—, y la de `/preguntas` **baja**: de 634 a 552. Ahí está el matiz. Una portada gana alto al
  estrecharse si su pieza se apila; lo pierde si su pieza se encoge a lo ancho, porque una pieza de
  proporción fija que adelgaza también acorta. La figura de nueve puntos era una banda y bajaba a
  448; la tableta es vertical, va a 3:4 y baja lo que la estrecha el margen. **Ninguna de las dos
  rompe el rango; se compara a 1280 porque es el único ancho donde las trece son comparables.**
  *Nota del 2026-09-30: una revisión sostuvo que «en móvil ninguna portada del sitio llega a 460» y
  eso es falso — tres de las seis pasan de 660. La regla no necesitaba ese apoyo.*
- **La barra de scroll entra en la medición, y a 390 px cuesta 20 px de portada.** Medida en un
  navegador con barra clásica, el ancho útil a 390 es **375** y la tableta sale 335 de ancho, no 350;
  a 3:4 eso son **20 px menos de alto** (552 contra 572). Arriba de 900 no se nota, porque la pieza
  toca su propio tope de 410. **Dos mediciones del mismo build pueden diferir sólo por eso**, así que
  una cifra móvil sin decir si había barra no es comparable con otra.
- **Una portada puede medir más alto que su objeto, y conviene saber de dónde sale la diferencia.**
  La tableta mide 536 px y la portada 634: los 98 que sobran son el titular, la bajada y el aire.
  La pieza además **sobresale 132 px** sobre la sección clara (`--montaje`), así que **la portada no
  contiene a su objeto** y medir el objeto no mide la portada.

**Dos portadas quedan por hacer**, las dos de páginas no legales que siguen abriendo sin objeto:
`/precio` y el índice del blog. Sobre `/precio` hay una conclusión ya medida y conviene
no repetir el intento: **su figura no se puede subir a la portada**, porque no es un objeto suelto
sino una `section` con su propio `<h2>` —«Lo que ves y lo que pagas miden lo mismo»— y su bajada.
Subirla dejaría ese titular huérfano o lo duplicaría. `/precio` necesita otro objeto, o quedarse en
la familia corta con el motivo escrito.

*Las cifras y la separación de las dos familias las midió Cowork; reproducidas acá las trece, exactas.*

---

## 5. Tratamiento de cifras (crítico)

- **Tabulares siempre** en montos, precios, tasas.
- Separador de miles chileno (`2.000.000`), decimal con coma (`2.174,80`).
- **Decimales consistentes con lo que usa el equipo en WhatsApp** (precio del dólar con 1–2
  decimales; USDT con 2).
- El **precio referencial** y el **"recibes ~X"** son las cifras más grandes de su pantalla.
- Timestamp del precio siempre visible ("hace un momento" / "actualizado hace Ns").
- Movimiento del precio (si se muestra): `--sube` / `--baja` + una flecha/triángulo pequeño, nunca
  color solo.

---

## 6. Sistema geométrico

**Origen:** el corte diagonal y los planos angulares del isotipo. Ángulo de referencia **30–35°**.

**Regla dura:** cada trazo representa **movimiento, flujo de valor o un paso**. Nunca decoración.

| Uso permitido | Cómo |
|---|---|
| Marcador de paso | Cuña / chevron que apunta al siguiente paso ("Cómo funciona", pasos numerados). |
| Divisor de sección | Segmento diagonal corto en lugar de una regla recta, con moderación. |
| Diagrama de "Cómo funciona" | Puntos = contrapartes (tú · DLPay · mercado · tu wallet), tramos angulares = dinero moviéndose. **El diagrama es la marca y a la vez explica.** |
| Textura del héroe | Cuñas a muy baja opacidad (≤ 0.12 sobre tinta en A×C). Nunca sobre el cotizador. |

| Prohibido |
|---|
| Papel tapiz / patrón de fondo repetido en todas las secciones. |
| "Red de nodos" genérica estilo blockchain. |
| Cualquier trazo que no represente movimiento o proceso. |
| Geometría que compita visualmente con el cotizador. |
| **La cuña en una portada de artículo.** Ver §6.1. |

### 6.1 Qué puede llevar una portada  ·  *añadido el 2026-09-16 · enmendado el 2026-09-22*

La cuña significa **valor moviéndose**: es la misma marca que dibuja pesos cruzando una frontera en
las figuras de `/empresas`. Una **portada de artículo muestra un dato**, no un movimiento. En cuanto
una portada usa esa marca, afirma un flujo — y entre dos cosas que no se mueven una hacia la otra,
eso es una **afirmación causal**.

La regla nace de un error real, y se deja escrito porque el error era razonable. La primera versión
de la portada del artículo de la Fed traía dos marcadores rotulados «FOMC» y «CLP» unidos por un
tramo con cuña y un chevron que indicaba el sentido. Con la gramática de este sistema, ese dibujo
dice que algo de valor va de la Reserva Federal al peso chileno — justo en el artículo que se cuida
de escribir «no pronostica ni recomienda operar». **La portada contradecía al texto**, y el dibujo
es lo que casi todo el mundo mira.

Lo que sí puede llevar una portada: la cifra, su etiqueta, su unidad, su fecha y su fuente; y, para
un intervalo, un segmento con un tope en cada extremo — **sin punta de flecha**, porque un rango no
va a ninguna parte. Las dos formas están implementadas en `src/components/PortadaDato.astro`.

Se aplica a portadas de artículo. El resto del sistema geométrico no cambia: las cuñas del héroe y
las figuras de `/empresas` representan movimiento real y siguen siendo correctas.

#### Enmienda del 2026-09-22 — el pictograma de un solo nodo

**Una portada puede además ser un pictograma del asunto del artículo, sin cifra, si y sólo si tiene
un solo nodo.** Aprobada por Sebastián para el artículo de activos tokenizados. Implementada en
`src/components/PortadaFigura.astro`, con un catálogo cerrado: un artículo elige entre los dibujos
que el sistema ya razona, nunca trae uno suyo.

**Por qué la regla admite esto sin contradecirse.** Lo que §6.1 prohíbe, y el párrafo de arriba lo
dice con esas palabras, es la **afirmación causal**: «entre dos cosas que no se mueven una hacia la
otra, eso es una afirmación causal». El sujeto de la prohibición es el *par*. Un bucle con un solo
nodo no tiene par: dice que la cosa dibujada circula —una propiedad suya— y no que alguien la
intercambie por otra. La portada de la Fed fallaba porque unía FOMC y CLP; ésta no une nada.

**La condición, que no se puede relajar:**

| | |
|---|---|
| **Un solo nodo** | Ninguna contraparte dibujada. Dos nodos y un movimiento entre ellos es un intercambio, y en una página de DLPay uno de los dos extremos se leerá como nosotros |
| Sin cifra | Si hay número, el tipo correcto es `cifra` o `rango`, con su fuente |
| Sin texto | Un SVG a `width: 100%` escala sus rótulos; es el fallo que sacó a `PortadaDato` del SVG |
| Sin cuña | La cuña sigue fuera: es la marca de *valor cambiando de manos*, que es exactamente el par que esto no puede tener |

La primera versión de este pictograma traía **dos** monedas, una con una T y otra con el signo del
dólar, unidas por el bucle. Se rechazó: en una página nuestra ese `$` se lee como nuestro dólar
digital, así que el dibujo afirmaba que cambiamos activos tokenizados por él — lo contrario de lo
que el artículo dice y de lo que CLAUDE.md §1 permite. **Quitar una de las dos puntas de flecha no
lo arreglaba**, porque el problema nunca fue la dirección sino qué dos cosas unía el bucle. Lo que
lo arregló fue quitar el segundo nodo.

**Sobre las puntas de flecha.** El párrafo de arriba las prohíbe en el segmento de un intervalo,
«porque un rango no va a ninguna parte», y ese motivo sigue intacto: en un rango la flecha inventa
una dirección que el dato no tiene. En un bucle de circulación la dirección **es** el contenido, y
no apunta a ninguna contraparte porque no hay ninguna.

**Lo que esta enmienda no abre.** No es la vuelta de `coverImage`. El catálogo es un `z.enum`
cerrado en el esquema: añadir un dibujo obliga a pasar por `PortadaFigura.astro`, que es donde está
escrito qué puede afirmar una figura en una página de DLPay. Un artículo no puede traer una imagen,
ni encargarla, ni describirla en el frontmatter.

#### El techo de la enmienda  ·  *escrito el 2026-09-29, con un caso trabajado*

**El asunto de un artículo puede no ser dibujable bajo esta condición, y entonces la respuesta es no
dibujarlo.** No es una carencia del sistema: es la condición funcionando.

El caso: se pidió una portada de figura para el explainer de stablecoins. Se descartó, y conviene
que quede el porqué porque el siguiente va a proponer los mismos tres dibujos.

**1 · El glifo ya estaba tomado, y por nosotros.** La ficha de anillo doble con el canto dividido en
24 unidades —la construcción de `activo-tokenizado`— se publicó el 2026-09-28 en `FiguraRiel.astro`,
que vive en `/como-funciona`, y allí su rótulo dice **«dólar digital»**. Es la misma construcción a
otro radio: 24/30 contra 38/46, las mismas 24 marcas. Así que hoy, en el vocabulario publicado,
**esa ficha significa nuestro producto**. Una portada que la use para representar la categoría
stablecoin dice «stablecoin = el dólar digital de DLPay», en un artículo cuya frase central es «no
emitimos stablecoins ni las custodiamos por ti». Es el fallo de las dos monedas otra vez, por otra
puerta: allí el problema era **qué dos cosas unía el bucle**; acá es **qué cosa es el nodo**.

**2 · La propiedad que distingue al asunto no se puede afirmar.** Lo único que separa a una
stablecoin de lo que el sitio ya dibuja es **la paridad**, y la paridad no se dibuja sin afirmar que
se sostiene. El artículo dedica una sección a que puede no sostenerse —USDC en marzo de 2023, UST en
mayo de 2022—, así que el dibujo contradiría al texto. **Es el mismo fallo de clase que el tipo
`propagacion`** que abrió esta sección, y con el mismo agravante: la portada va antes del titular.
Y acá se suma uno nuevo: sería una afirmación de estabilidad sobre **productos de terceros**
publicada bajo nuestra firma, o sea §3 de `CLAUDE.md`.

**3 · Las marcas con las que se intentó ya significan otra cosa** (§6.2, y por eso esa tabla
existe):

| lo que se quería decir | con qué se intentó | qué significa ya |
|---|---|---|
| «su nivel de referencia» | trazo punteado | **un límite: cruzarlo cambia algo.** Una horizontal punteada cruzando la ficha dibuja la línea de de-peg, lo contrario de lo buscado |
| «se mantiene» | línea plana sobre un eje | **un valor que quedó fijo**, y sólo contra otra que se mueve: es la banda de `/precio`, «tu precio después de aceptarlo» |
| «el mismo valor, otra envoltura» | dos barras apiladas | `convierte` de `UseCaseFigure`: **una conversión de divisa**, que es nuestro producto |
| «una banda de tolerancia» | dos líneas acotando la ficha | **nada**: no existe en §6.2, y una tolerancia es una afirmación cuantitativa sin cifra, sin fecha y sin fuente, que es justo lo que esta sección reserva a `cifra` y `rango` |

**4 · Y una trampa de dibujo que parece la salida y no lo es.** «Un anillo dividido en arcos
iguales», para decir «hecho de unidades» sin la ficha entera, **se implementa con
`stroke-dasharray` sobre un círculo**: es un anillo punteado, y el punteado es la marca de la fila
1. El dibujo que evitaba una colisión cae en la otra.

**La conclusión operativa.** Cuando las tres cosas pasan a la vez —el glifo del asunto ya está
rotulado como nuestro, su propiedad distintiva no es afirmable, y las marcas disponibles están
ocupadas—, **la portada correcta es ninguna**, y `blog/index.astro` ya lo contempla: la columna del
índice queda vacía a propósito, porque rellenarla diría «acá hay una figura» donde no la hay. La
alternativa honesta no es un pictograma más flojo: es `cifra` o `rango`, que traen el campo `fuente`
que este contenido necesita.

### 6.2 El significado lo lleva la marca, no el color  ·  *añadido el 2026-09-17*

Con cinco familias de figura vivas —los cuatro casos de `/empresas`, la línea de tenencia de
`/confianza`, el carril de `/como-funciona`, el eje de alcance y las portadas de dato del blog— el
vocabulario geométrico ya no cabe en la regla dura de §6. Ésta es la semántica que las figuras
**usan hoy**, medida sobre el build y no recordada. **Una marca que se queda sin consumidor sale de
la tabla y baja a la nota de abajo**, para que la tabla siga respondiendo a «qué significa lo que
estoy viendo» y no a «qué se ha significado alguna vez».

| Marca | Significa |
|---|---|
| Punto lleno verde | un extremo de la operación: una contraparte o una unidad de valor |
| Tramo o línea verde **que ocupa un trecho de un recorrido** | el tramo que es nuestro · dice **de quién es**, no cómo se comporta |
| Cuña | valor moviéndose · el trabajo cambia de manos |
| Barra llena verde | una magnitud |
| Filete `--ink-mute` | existe, es real, **no** es nuestro |
| Canto dividido en unidades | la cosa está **hecha de unidades transferibles** |
| Trazo **punteado** | un **límite**: cruzarlo cambia algo · es la única marca punteada del sistema |
| Línea verde **plana a lo largo de un eje, junto a otra que sigue moviéndose** | **un valor que quedó fijo** · dice **que no cambia**, y sólo significa algo contra el movimiento de al lado |
| `--line` | separador sin significado |

**Sobre el punto lleno neutro: concedido el 2026-09-29, sin consumidor desde el 2026-09-30.**
Significaba **una pregunta del visitante**, en `--on-tinta` sobre tinta, y lo usaba la portada de
`/preguntas` con un punto por cada una de las nueve que la página publicaba entonces. **Esa portada
duró un día**: la sustituyó una tableta con una conversación dentro, y con ella la marca dejó de
estar en el build. Por eso sale de la tabla de arriba y se queda escrita acá.

**Se conserva la concesión, no el dibujo.** La enmienda la dio Sebastián y no se revoca por falta de
uso: quien vuelva a necesitar un trazo para una pregunta lo tiene concedido y con su alcance ya
delimitado. Lo que se retira es la afirmación de que el sitio lo usa.

**Por qué se escribió, que es lo que sigue valiendo.** Estrenaba familia, así que se definió **antes**
de dibujarla, como se hizo con la frontera punteada, y **requirió enmendar una regla dura de
`CLAUDE.md` §5**: las tres cosas que esa regla admitía —movimiento, flujo de valor, un paso de un
proceso— son todas dinero o su recorrido, y una pregunta no es ninguna. Su alcance quedó acotado
allá: **no autoriza un trazo por «un tema» ni por «una sección»**, que sería un índice dibujado.

**Y no competía con el punto verde**, que es la distinción que esta sección defiende: lo que cambiaba
no era sólo el color, era la marca. El punto verde es «un extremo de la operación», o sea dinero;
aquél no era dinero, y por eso no podía ser verde — el verde diría que lo es.

*La lección de método, y es la que cuesta:* **una marca se puede escribir antes de dibujarla y aun
así quedarse sin nada que describir**, porque el dibujo que la pedía puede caer por motivos que no
tienen nada que ver con ella. Escribirla antes fue correcto; lo que faltó fue volver a mirar la tabla
al retirar la figura.

**El color no es el portador del significado.** El verde dice «esta marca carga significado»; cuál
de los dos verdes se usa lo decide **el fondo**: `--verde` sobre tinta y `--verde-deep` sobre
superficie clara, porque sobre claro `--verde` da 2,02:1 y no alcanza ni el 3:1 de un gráfico
(§2.4). Por eso un punto verde y una línea verde en la misma página no se contradicen: **son dos
palabras distintas**, no dos usos del mismo color.

Sin esta regla, quien compare los emblemas de `/empresas` —donde los nodos verdes rotulan CLP y
USD, los dos extremos de la operación— con el eje de alcance —donde el tramo verde es el nuestro—
concluirá, razonablemente, que el verde se usa de dos maneras incompatibles, y «arreglará» una.

**Sobre la frontera punteada, añadida el 2026-09-22.** Estaba en producción desde que existe
`UseCaseFigure` y no estaba escrita, y eso resultó ser lo que hacía ambiguo todo un par de figuras.

**Recontado el 2026-09-29 sobre el build servido: son SIETE**, no dos.

| dónde | clase | qué límite marca |
|---|---|---|
| Home, «Tres usos» | `.edge` de `UseCaseFigure` | la frontera de Chile |
| `/precio`, la banda | `.frontera` | el instante en que el cliente acepta |
| `/tarifas` ×3 | `.limite`, `.sw sw-linea`, `.corte` | dónde acaba el precio · el spread · dónde se conversa |
| Home y `/precio`, los puentes | `.limite` y `.corte` | los mismos dos, copiados a sus figuras |

La cifra anterior decía «dos» y **era cierta el 2026-09-24**: lo que la invalidó fue el rediseño de
`/tarifas` del día siguiente, que estrenó tres, y los puentes del 28, que copiaron dos a sus
figuras. Es la segunda vez que esta frase envejece, así que conviene decir por qué y no sólo
corregirla: **un recuento es una foto, y esta sección declara que mide «sobre el build y no
recordado». Quien la cite tiene que rehacer la foto, no leer la anterior.**

*Y una trampa del instrumento, por si alguien repite la medición:* el barrido descartó `.edge`
porque filtraba por ancho mayor que cero, y `.edge` es una **línea vertical** — ancho cero. Un
filtro geométrico razonable esconde justo las marcas de un eje. Se cuenta por `border-style`,
`stroke-dasharray` y `repeating-linear-gradient`, nunca por el tamaño de la caja. *(El
`stroke-dasharray` que fija el runtime de M3 no cuenta: es un solo valor, el largo del propio trazo,
y pasa a `none` al entrar. `.edge` no lleva `data-draw` ni está dentro de uno, así que conserva su
`3px, 4px` con y sin JavaScript. Comprobado en los dos casos.)* (El `stroke-dasharray` de `tokens.css` no cuenta: es el mecanismo del
movimiento M3 —el guion vale el largo del propio trazo y pasa a `none` al entrar—, no una marca.
Nunca se lee como punteado.)

**Cómo se dibuja, y por qué el valor declarado no basta** *(2026-09-24)*. Guion **3px**, hueco
**4px**, trazo **1,25px**, medidos en pantalla. En `UseCaseFigure` salen solos porque su SVG va a
escala 1. En `/precio` **no**: ese lienzo está estirado con `preserveAspectRatio="none"`, y un
lienzo estirado deforma el ritmo del punteado igual que deformaría un círculo. Con `2 6` declarado
se dibujaba a **3,09 y 9,28** —la escala vertical es 1,5467 en escritorio y 1,12 en móvil—, así que
**ningún valor declarado da el mismo punteado en los dos anchos**.

Por eso ahí la frontera es un elemento HTML con `repeating-linear-gradient`, como ya lo era el punto
y por el mismo motivo. `border: dashed` no sirve: el guion y el hueco los elige el navegador.

**La regla que queda: un punteado dentro de un SVG estirado se mide en pantalla, nunca se lee del
atributo.**

**Generalizada el 2026-09-24, de «frontera» a «límite».** Nació describiendo el único punteado que
existía —la frontera de `cruza`, que separa Chile del extranjero—. La banda de `/precio` estrenó un
segundo: una vertical punteada en el instante en que el cliente acepta el precio. No es una frontera
geográfica y es exactamente la misma palabra: **una línea que, al cruzarla, cambia lo que pasa
después**. Un límite en el espacio y un límite en el tiempo son el mismo signo, y separarlos en dos
filas habría creado dos marcas donde hay una.

Lo que la fila resuelve, y es el motivo de escribirla:

> **Un par horizontal SIN frontera no afirma ningún cruce.** Lo que afirma es una transformación
> entre dos estados del mismo valor.

Sin esa frase, la variante `cruza` de `UseCaseFigure` —dos nodos unidos por un tramo con cuña, que
significa «sales de Chile»— y la figura del riel del blog —dos fichas unidas por un tramo con cuña,
que significa «el mismo dólar, ahora hecho de unidades»— parecen dos versiones incompatibles del
mismo dibujo, y alguien «arreglará» una. No lo son: lo que carga el significado de `cruza` es la
frontera, no la horizontalidad, y por eso `convierte` puede decir «el mismo valor, dos unidades» con
dos barras apiladas sin contradecir a ninguna de las dos.

**Se escribió la regla en vez de unificar los dibujos**, que era la alternativa: apilar las dos
fichas del riel como hace `convierte`. Funciona, pero una figura alta y estrecha se lleva mal con
una columna de lectura, y el dibujo ya está publicado y aprobado. Cuando dos figuras correctas
parecen contradecirse, lo que falta casi siempre es la palabra que las distingue, no un dibujo
nuevo.

**Sobre el canto dividido, añadido el 2026-09-22.** Es la única marca que entró después de escrita
esta tabla, y entró con la regla que la tabla exige: primero se usó en la portada del artículo de
activos tokenizados (`PortadaFigura.astro`) y quedó sin documentar; al aparecer una **segunda**
pieza con el mismo significado —la figura del riel, en el cuerpo de ese mismo artículo— pasó el
umbral que hizo nacer este §6.2 y se escribe. **El número de marcas no es un dato**: veinticuatro no
significa veinticuatro de nada, y cambiarlo no cambia lo que la figura dice.

**La sexta familia, añadida el 2026-09-24: la línea que deja de moverse.** Vive en la banda «No
cambia después de que lo aceptas» de `/precio`, y es la primera figura del sitio cuyo significado lo
lleva **una ausencia**: lo que la línea verde afirma es que *no* sube ni baja, y eso sólo se ve
contra una línea gris que sí se mueve. De ahí salen dos condiciones que no son de estilo:

1. **El tramo posterior de la línea gris no se recorta nunca.** Si el mercado se detiene en el punto
   de aceptación, la figura deja de decir «tu precio se quedó quieto» y pasa a decir «el mercado se
   detuvo», que es falso. La quietud necesita el movimiento al lado.
2. **La línea gris no puede tener tendencia.** Si después del punto sube, la figura dice que aceptar
   fue mal negocio; si baja, que fue bueno. Las dos son afirmaciones sobre el resultado de una
   operación y ninguna se puede publicar. El camino se **construye** con excursión simétrica y media
   próxima a cero, y se vuelve a medir si se toca: filtrando trazados al azar no sale ninguno que
   cumpla.

Va sobre tinta, y eso tampoco es estético: sobre papel `--verde` da **2,02:1** y no alcanza ni el
3:1 de un gráfico. Si alguna vez se mueve a una superficie clara, el verde pasa a `--verde-deep` y
hay que recalcular.

**Cómo se comprueba una figura nueva, antes de dibujarla:**

1. **Quítale los rótulos.** Lo que quede es lo que la figura afirma por su cuenta. Si eso es más de
   lo que el sitio puede afirmar, la figura no sirve por mucho que el texto la corrija. *El globo
   falla esta prueba: sin rótulos, ocho arcos saliendo de Chile dicen «entregamos en ocho países»,
   y por eso no va nunca solo.* Si sólo funciona con los rótulos puestos, es una lista con adornos.

   **Matizado el 2026-09-25, cuando el eje de alcance salió de la banda del globo.** Hasta ese día
   esta nota decía «y por eso lleva el eje de alcance al lado», y eso confundía el requisito con
   una de sus soluciones. Lo que la prueba exige es que **algo acote la figura**; lo que acota al
   globo hoy es el titular que tiene encima —«Nuestro tramo termina en tu billetera»— más su
   bajada, que dicen el límite en palabras y no en trazos. La prueba no se relaja: una figura que
   afirma de más sigue sin poder ir sola. Lo que cambia es que el acotador puede ser texto.
2. **Comprueba que cada marca signifique lo mismo que en las demás figuras.** Si necesitas que el
   verde signifique algo nuevo, no dibujes: escribe antes acá por qué.
3. **La forma sale del dato, no al revés.** Si la estructura que quieres dibujar no está en
   `content/`, la figura la está inventando. *El proceso de incorporación de `/empresas` no se
   dibujó por esto: es un `string[]` de cuatro frases, sin reparto de quién hace qué, y deducirlo
   de los verbos habría sido fabricar el dato para que encajara con el dibujo.*

> Esta sección **describe**, no corrige. La medición que la originó no encontró ninguna figura que
> incumpla la gramática que se deduce de ellas mismas: ningún verde sobre un fondo que no lo
> aguante, ninguna cuña fuera de sitio y ningún nodo con otro sentido.

---

### 6.3 La banda de cierre  ·  *añadido y revisado el 2026-09-24*

**Una banda de llamada que precede al pie va sobre PAPEL, centrada, y toma el tono que continúa la
alternancia de su página.** El pie es `--tinta`, así que una banda clara se distingue de él por
material y no por un filete.

| página | sección de arriba | la banda |
|---|---|---|
| `/como-funciona` | `.scope` · `--papel-2` | `--papel` |
| `/preguntas` | `.palabras` · `--papel-2` | `--papel` |
| `/precio` | `.tres` · `--papel` | `--papel-2` |
| `/empresas` | la FAQ · `--papel` | `--papel-2` |

**El tono no es fijo: lo decide el vecino de arriba.** Una banda siempre en el mismo papel se funde
con la sección anterior en la mitad de las páginas, que es el mismo defecto una fila más arriba.

**Cómo se comprueba, y no es leyendo el archivo.** La sección anterior se mira con
`previousElementSibling` **sobre el render**. Leerla del orden de los `<section>` del código falla
cuando en medio hay un componente: en `/empresas` la FAQ está entre `.scope` y la banda, no aparece
en un `grep` de `<section` y por eso la primera versión salió del mismo tono que la caja de encima.

**Lo que se descartó, medido.** Dejar la banda oscura y separarla del pie con un filete:

| | contraste contra `--tinta` | |
|---|---|---|
| `--tinta-2` | 1,068:1 | se distingue como superficie, **no** como corte |
| El filete de `rgba(237,242,239,.1)` de la cabecera y la 404 | 1,27:1 | no se ve sobre tinta |
| `--line-on-tinta` | 3,50:1 | el corte, pero las dos cajas siguen pareciendo el mismo material |

Funcionaba, y aun así la banda clara es mejor: **no necesita que nadie recuerde el filete.** El
borde superior del pie se conserva porque no estorba y salva los casos futuros.

**Un control fantasma sobre estas bandas no puede usar `--line`.** Mezclado da **1,34:1** sobre
`--papel-2` y 1,35 sobre `--papel`, y WCAG 1.4.11 pide **3:1** al contorno de un control. Con alfa
**0,46** da 3,00 y 3,06, así que un solo valor sirve para los dos papeles.

> **PENDIENTE, medido y no corregido acá:** los fantasmas sobre papel que ya existían —`/como-funciona`
> §kyc y `Steps.astro`— siguen con `--line` a 1,35:1. Es anterior a este cambio.

---

## 7. Iconografía

- **Line icons**, trazo `1.6`, grilla 16 / 20 / 24, `stroke-linejoin: round`, **un solo estilo**.
- El trazo se declara una sola vez, en unidades del `viewBox` de 24: al reducir el tamaño de
  render el grosor adelgaza solo, que es como se baja el peso visual de un icono sin tocar el set.
- **La proximidad manda sobre el tamaño.** La distancia entre un icono y su texto debe ser muy
  menor que la distancia al bloque siguiente (relación ~1:4). Un icono del tamaño correcto pero
  mal agrupado se percibe igual de invasivo — fue el hallazgo real al ajustar `/confianza`, donde
  reducir la escala sin corregir la agrupación no habría bastado.
- El tamaño se decide **mirándolo**, no por proporción calculada. En la lista de mecanismos de
  `/confianza` un icono de 20px convive con titulares de 17/20px: iguala el cuerpo del titular en
  escritorio y aun así funciona, porque la agrupación y la medida del bloque ya resolvieron la
  jerarquía. Fuera de la grilla 16/20/24 no se baja sin una razón anotada.
- Set pequeño y funcional: banco, reloj, **personas**, chat/WhatsApp, chevron/paso, documento,
  empresa, wallet, candado. **Nueve, y son los que hay** — nada más hasta que una necesidad lo pida.

  *Reconciliado el 2026-09-23.* Esta lista nombraba ocho y omitía **`people`**, que existía y se
  usaba en `content/home.ts` y `content/trust.ts` desde antes: la lista describía una intención y no
  el set. Los otros cuatro —documento, empresa, wallet, candado— estaban nombrados aquí y no
  existían; entraron ese mismo día.

  **`candado` es la excepción de la lista y se declara como tal:** está dibujado y **no se usa en
  ninguna página**. Entró por autorización de Sebastián para cerrar el set de una vez, y el límite
  está escrito en `Icon.astro` — el sitio no afirma nada sobre cifrado, así que un candado junto a
  un texto que no reclama seguridad afirmaría por su cuenta algo que sólo firma Compliance. Se usa
  el día que exista la frase que lo sostenga, no antes.
- Sin emoji como iconos.
- **Los iconos viven en el componente `Icon`, y el padre los dimensiona por CSS.** Para que eso
  funcione, el proyecto usa `scopedStyleStrategy: 'class'`: con la estrategia por atributo, las
  reglas del padre no alcanzan a un `<svg>` que está dentro de un componente hijo. Ver
  `docs/development.md`.

---

## 8. Componentes V1 (inventario — no implementación)

Cada uno se construye sólo cuando una página real lo necesita (Principio 5, CLAUDE.md).

| Componente | Propósito | Notas de anatomía / estados |
|---|---|---|
| **Botón** | Acción | `primary` (fill `--verde`, texto `#04140E`, `--s-4`/`--s-6`, cuerpo 16px) · `ghost` (con borde, `--s-4`/`--s-5`, cuerpo 14px, en versión clara y sobre tinta). El primario del cotizador es a ancho completo, con padding uniforme `--s-4`. Estados: hover, focus-visible (outline 2px `var(--focus)`), disabled. `--r-2`. Nunca píldora. Sin "→". **Un botón con borde nunca se llama `cta`:** ese nombre es sólo del primario relleno, y mezclarlos es por donde se cuela la deriva. |
| **Campo de formulario** | Entrada | Label 12–13px `--ink-mute` · borde `--line` · foco: borde `--verde` + outline. Error: borde `--baja` + mensaje inline. |
| **Cotizador** | Acción central | Spec propia → `cotizador-spec.md`. |
| **Desglose de precio** | Transparencia | Lista label/valor, valores tabulares alineados a la derecha, divisores hairline. |
| **Badge de estado** | Estado KYC / operación | Pill discreta (`--r-2`), color semántico + texto, nunca color solo. |
| **Bloque de confianza** | "Por qué DLPay" | Icono line + H3 + 1 frase. 3 en fila (desktop) / apilados (móvil). Sin números inventados. |
| **Paso** (step) | Proceso | Marcador (número tabular o cuña) + H3 + frase + tiempo (mono, `--ink-mute`). Numerado sólo porque es secuencia real. |
| **Callout WhatsApp** | Contacto humano | Icono chat + texto + botón. Presente en fallbacks del cotizador y en "Cómo funciona". |
| **Franja de bifurcación** | Personas / Empresas | Dos caminos claros; el de Empresas lleva a `/empresas`. Tardía en la Home. |
| **Banda Empresas** | Pitch B2B | Sobre `--tinta-2`. Texto + CTA a `/empresas`. |
| **Header** | Navegación | Isotipo + "DLPay" · nav corta (`Personas · Empresas · Información ▾`, donde el desplegable agrupa `Cómo funciona`, `Confianza` y `Blog`) · `WhatsApp` + `Crear cuenta` (secundario). Móvil: isotipo + WhatsApp + menú, con «Información» como rótulo estático y sus enlaces indentados. **Actualizado el 2026-09-11:** `/cotizar` se eliminó el 2026-09-09 y el desplegable sustituyó a la lista plana. |
| **Footer** | Cierre + legal | Producto · Contacto · **Legal** (Términos, Privacidad, Tarifas, Canal de denuncias) · `DLPZ INCZ SpA · opera bajo la marca DLPay`. |
| **FAQ item** | Objeciones | Acordeón; sólo objeciones reales pre-primera-operación. |
| ~~**Diagrama de flujo**~~ | ~~Explicar la operación~~ | **Retirado el 2026-09-17.** Su pie decía «Dónde está tu dinero en cada momento», el título exacto de la figura de `/confianza`: no era riesgo de duplicación, era una colisión ya ocurrida. `FlowDiagram.astro` se eliminó. |

### 8.1 Las piezas que la Fase 4 añadió  ·  *inventario al 2026-09-17*

La tabla de arriba es de la Fase 2.5 y describe lo que se **iba a** construir. Todo lo de abajo
nació después, al construirlo, y no estaba en ningún inventario. Se registra acá y no en una tabla
nueva porque es el mismo documento: **lo que existe**.

La gramática que comparten las cinco familias de figura está en **§6.2**; esta tabla dice dónde vive
cada una, no qué significa.

| Componente | Propósito | Notas |
|---|---|---|
| **Héroe con cotizador** | El primer viewport de la Home | El cotizador **no entra** animado: es el instrumento y tiene que estar encendido al llegar. Lo que entra es el texto (M6) |
| **Encabezado de página** | Las ocho rutas que no son la Home | `PageHero`. Dos composiciones: a dos columnas y **apilada y centrada**, ésta con la pieza del `aside` montada sobre la costura con la sección siguiente |
| **Dispositivos en CSS: teléfono, portátil y tableta** | Enseñar el producto sin imágenes. El teléfono (`/como-funciona`, Home) una **operación negociándose**; el portátil (`/empresas`) la plataforma; la tableta (`/preguntas`, desde el 2026-09-30) **una duda resolviéndose** | Cero archivos. **El texto nunca se teclea**: el teléfono deriva las cifras de `lib/pricing`; la tableta busca la pregunta en `general.ts` **por su texto** y el build para si no está. Los tres van `aria-hidden` y **el chasis va claro**, que es lo único que recorta un objeto contra la tinta. Si el hilo de la tableta empieza a hablar de montos, deja de ser tableta y pasa a ser teléfono |
| **Emblema de caso** | Las cuatro operaciones de `/empresas` | El canto del isotipo como frontera; el dinero es un canal hueco dentro del plano y macizo fuera |
| **Línea de tenencia** | `/confianza`: de quién es la cuenta donde está el dinero | HTML, no SVG. Un solo tramo es nuestro |
| **Carril de dos columnas** | `/como-funciona`: qué hace cada parte y dónde cambia de manos | La colocación en rejilla va **explícita**: el flujo automático deshace el carril |
| **Eje de alcance** | Hasta dónde llega el servicio | `EjeDeAlcance`, en **tres** páginas: `/como-funciona`, `/empresas` y el artículo del blog. *Salió de la Home el 2026-09-25.* Es la regla dura de `CLAUDE.md` §1 dibujada, y por eso es un componente y no CSS repetido |
| **Portada de dato** | La cifra de la que habla un artículo | Dos tipos: `cifra` y `rango`. **La cuña no entra** (§6.1). `fuente` es obligatoria |
| **Índice del blog** | `/blog` | Filas con filete y fecha tabular en columna propia. Se ve igual con un artículo que con cincuenta |
| **Globo rotativo** | El alcance del dólar digital, en la Home | Tres excepciones autorizadas: ADR-0007, 0008 y 0009. **No va nunca solo**, porque sin nada que lo acote el dibujo afirma de más. Hasta el 2026-09-25 lo acotaba el eje de alcance; desde que Sebastián lo retiró, lo acota el titular de su banda —«Nuestro tramo termina en tu billetera»— y la bajada. **Si algún día se cambia ese titular por uno que no nombre el límite, el globo se queda desnudo** |
| **Franja de notificación** | Aviso a todo el ancho | ADR-0006. Se oculta sola en la página que enlaza |
| **404** | Dirección inexistente | Reusa `PageHero`. `noindex`, fuera del sitemap y en cero bytes de JavaScript |
| **Bloque institucional** | Los emblemas de FinteChile y la UAF, en el pie | `Alliances.astro`. El claim regulatorio se dice **con palabras**, no colgado de un emblema, y el dato declara el alcance de su propio claim |
| **Motor de movimiento** | Encender el Motion System en las páginas que lo usan | `Motion.astro`. No es una pieza visual: es el `IntersectionObserver` y su interruptor. Las cuatro legales y la 404 no lo llevan y siguen en cero JavaScript |

> **Cómo se mantiene esta tabla.** Se escribió midiendo `src/components/` contra el build, no de
> memoria. Si aparece un componente que no está acá, la tabla está vieja — y eso ha pasado: entre
> el 10 y el 17 de septiembre entraron nueve piezas sin que este inventario se enterara.

---

## 9. Movimiento  ·  *enmendado el 2026-09-07*

**El sistema completo está en `motion-system-v1.md`.** Seis movimientos, ni uno más.

- **El movimiento es información, no adorno.** Si algo se mueve, es porque cambió un dato o un
  estado. Es la regla de ADR-0001 §3 aplicada al tiempo.
- **Tiene una dirección propia: la diagonal del isotipo** (~34°). Todo lo que entra, entra sobre
  ese eje — nunca sobre el `translateY` vertical genérico.
- **Velocidad de instrumento:** techo absoluto de **280 ms**.
- Permitido: microinteracciones en **controles** · el dato que cambia · el dibujo de la geometría ·
  la entrada al hacer scroll de **un** elemento por sección · escalonado de **máximo 4** hermanos
  donde hay secuencia real · una secuencia de carga del héroe.
- Prohibido: hover-transitions en **tarjetas** · conteo de cifras desde cero · parallax · movimiento
  continuo · transiciones de página · movimiento sobre datos (tablas, actividad).
- **Sin JavaScript la página se ve completa e inmóvil.** No es degradación: es el estado base.
- `prefers-reduced-motion` apaga todo salvo el cambio de color instantáneo.

> *Enmienda:* este apartado prohibía las entradas al hacer scroll y el escalonado. La prohibición
> existía cuando la identidad visual aún no estaba construida y el riesgo era parecer una plantilla.
> Cerradas la dirección A×C, la tipografía y el sistema geométrico, ese riesgo se evaluó y se
> levantó la restricción en la forma acotada que define `motion-system-v1.md`.

---

## 10. Accesibilidad (piso, se verifica en el Definition of Done)

- Contraste **AA**; los cruces verde/claro resueltos con `--verde-deep` (§2.4).
- Foco visible (`outline` 2px `var(--focus)`, offset 2px) en todo lo interactivo.
  **`--focus` depende del fondo:** `--verde-deep` sobre superficies claras y
  `--verde` sobre tinta. El verde de marca sobre papel da **2.02:1**, insuficiente
  incluso para un elemento gráfico. Las superficies oscuras declaran la clase
  `.on-tinta-surface`, que redefine el token.
- Objetivos táctiles ≥ **44px**. Un enlace de 14px sin relleno vertical mide ~20px: los
  enlaces de navegación —los del pie incluidos— necesitan `min-height` explícito. Los
  enlaces dentro de un párrafo quedan exentos.

  **Y la caja de 44px es también lo que los alinea** *(2026-09-23)*. «Personas», «Empresas» e
  «Iniciar sesión» eran los únicos elementos de la cabecera sin ella, y el síntoma que se vio
  primero no fue el táctil sino que estaban **más arriba que el resto**: sin caja propia, un
  enlace `inline` se apoya en la primera línea de su contenedor en vez de centrarse en él.
  Medido: centros en 33,65 y 28,75 contra el 38 de la marca, «Información» y los dos botones.
  Los seis elementos de la barra centran hoy en 38 y ninguno baja de 44px de alto.

  Corolario para cualquier marcador de «página actual»: va **absoluto**, no en flujo. En flujo
  le suma su alto a la caja del enlace y desplaza el texto respecto de los enlaces sin marcar,
  que es lo que hacía que «Personas» y «Empresas» ni siquiera coincidieran entre sí.
- HTML semántico, jerarquía de headings correcta, labels en formularios, `alt` en imágenes.
- `prefers-reduced-motion` respetado.
- El cotizador operable por teclado; mensajes de error comprensibles y accionables.

---

## 11. Tipografía — historial de la decisión

Cerrada el **2026-09-04**: set **T-C** (Familjen Grotesk + Spline Sans Mono), elegido por Sebastián
sobre T-A y T-B. Registrada como enmienda a **ADR-0001 §4**; el pendiente **D2** de `CLAUDE.md`
queda cerrado.

El board comparativo que sustentó la decisión se conserva como registro:
`docs/design-system/board-tipografia.html` — los tres sets sobre el héroe y el cotizador reales,
en desktop y móvil, con tamaños idénticos entre sets (sin ajuste óptico) para que la única
variable fuera la letra.

**Descartadas y por qué:** *T-A* (Bricolage + Hanken) aportaba más calidez, pero exigía tres
familias y el carácter del display cansaba en titulares largos. *T-B* (Archivo + IBM Plex Mono)
era la que mejor conversaba con el wordmark y la más "instrumento", pero también la más fría para
una persona que compra dólares por primera vez.

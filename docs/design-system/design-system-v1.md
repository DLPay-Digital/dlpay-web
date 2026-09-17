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
> del propio verde** —`rgba(11,122,84,.10)` sobre `--papel-2`, que resuelve a `rgb(214,223,213)`—
> el texto en `--verde-deep` da **4,31:1** y **no alcanza el 4,5 de AA**. Con el valor anterior daba
> 3,92:1, así que el ajuste mejora el caso pero no lo salva.
>
> Regla práctica: **`--verde-deep` sobre chip verde no es un par válido para texto.** Si hace falta
> una pastilla verde con texto, el texto va en `--ink`; el verde se reserva para el fondo, que es
> superficie y no tiene piso de contraste. Sobre un chip así sí valen los **gráficos** (piso 3:1):
> iconos, bordes y trazos, que es justo lo que hacen `IconBadge` (`rgba(11,122,84,.12)`, con un
> icono dentro) y el anillo de foco del cotizador (`rgba(11,122,84,.18)`, que es una sombra).

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
- `#0B7A54` (`--verde-deep`) sobre `#F6F5F1`: **4.90:1** — sirve para texto, foco y gráficos.
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
- `text-wrap: balance` en titulares; `text-wrap: pretty` en párrafos.

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
| `--r-card` | 14 px | Sólo la tarjeta del cotizador cuando "flota" sobre la tinta. |
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

### 4.5 Elevación (mínima, por rol)

| Token | Valor | Uso |
|---|---|---|
| `--elev-0` | ninguna | Casi todo. La jerarquía la dan tipografía y espacio, no sombras. |
| `--elev-card` | `0 24px 60px -24px rgba(11,19,32,.45)` | **Sólo** la tarjeta del cotizador sobre la tinta. |
| `--elev-pop` | `0 8px 24px -12px rgba(11,19,32,.25)` | Menús/popovers (futuro). |

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

### 6.1 La cuña no entra en las portadas  ·  *añadido el 2026-09-16*

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
- Set pequeño y funcional: banco, reloj, chat/WhatsApp, chevron/paso, documento, empresa, wallet,
  candado. Nada más hasta que una necesidad lo pida.
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
| **Diagrama de flujo** | Explicar la operación | Sistema geométrico §6. |

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

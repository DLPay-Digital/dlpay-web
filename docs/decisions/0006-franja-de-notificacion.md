# ADR-0006 — Franja de notificación: estática, sin botón de cerrar

- **Estado:** Aceptada — 2026-09-08
- **Decide:** Sebastián Villanueva (con análisis de Claude Code, Fase 4)
- **Ámbito:** el componente `AnnouncementBar.astro` y su ausencia de control de descarte.
  No enmienda ADR-0004 (cero dependencias de estilo) ni la promesa de cero almacenamiento.

## Contexto

La franja se pidió como mejora de UX de la navegación global: un aviso a todo el ancho, bajo el
menú, con un copy corto y un enlace. La convención del oficio dice que estos banners llevan una
«X» para descartarlos, y ahí aparece el conflicto: `CLAUDE.md` §7 y las dos revisiones de
`docs/auditoria-preproduccion.md` sostienen que este sitio no usa `localStorage`, no usa
`sessionStorage`, no pone cookies y envía JavaScript sólo donde una funcionalidad lo exige — las
cuatro páginas legales están hoy en **cero bytes** de JS.

La pregunta no es si se puede saltar la regla. Es si cerrar la franja funciona.

## Alternativas evaluadas

### A · Estática, sin «X» — **elegida**

Cero JS, cero almacenamiento, cero deuda. El coste es que la franja no se puede quitar.

### B · Cerrar con HTML/CSS (`<details>` o checkbox oculto)

Parece la opción astuta: cumple la letra de «cero JS». **Es la peor de las tres**, y por dos
razones que no se ven hasta implementarla.

1. **El descarte no sobrevive a la navegación.** Este es un sitio multipágina estático, sin SPA ni
   view transitions: cada clic recarga el documento y el CSS vuelve a su estado inicial. La persona
   cierra la franja, va a `/cotizar/` y la franja está de vuelta. Un control que promete algo que
   no puede cumplir es peor que la ausencia del control — enseña que el botón no sirve.
2. **Rompe la accesibilidad.** Un checkbox etiquetado «cerrar» se anuncia como casilla de
   verificación, no como botón, y queda en el orden de tabulación incluso después de «cerrar».
   Con `<details>` hay que invertir la semántica: el aviso pasa a ser el contenido de un
   desplegable que nace abierto. `CLAUDE.md` §7 pone WCAG AA como piso, y esto lo baja.

### C · Micro-script con `sessionStorage`, como excepción justificada

Es la única que **de verdad** cierra la franja y recuerda la decisión durante la sesión. Se
descartó por lo que cuesta de más, que es bastante más que «unos bytes de JS»:

- **Introduce un parpadeo y un salto de layout.** La franja viene en el HTML estático; si un script
  la borra después, se ve aparecer y desaparecer, y el contenido salta hacia arriba. Evitarlo
  obliga a un script **síncrono en el `<head>`** que lea el almacenamiento antes de pintar — el
  patrón que ya usa `.js-motion`. Es decir: no un script, sino dos, y en todas las páginas.
- **Termina con las cuatro páginas legales en cero JS**, que es una propiedad verificada y
  documentada, y le añade una lectura de almacenamiento a cada carga del sitio.
- **Convierte una afirmación limpia en una con asterisco.** Hoy `docs/arquitectura-produccion.md`
  puede decir «cero `localStorage`, cero cookies» sin matices, y eso vale para el CSP
  (`connect-src 'none'`), para la conversación de privacidad y para no necesitar aviso de cookies.
  Cambiar eso por comodidad en una franja de una línea es un mal canje.

Nada de esto haría el código malo. Lo haría **desproporcionado**: `CLAUDE.md` §5 pide arquitectura
mínima, y §2.2 pone la necesidad antes que la técnica. La necesidad aquí es un aviso de una línea.

## Decisión

**Opción A: la franja es estática y no lleva botón de cerrar.**

Y, para no confundir «estático» con «tosco», se resuelve por diseño la parte molesta del problema:

1. **La franja no se muestra en la página que enlaza.** Si el aviso apunta a `/como-funciona/`, en
   `/como-funciona/` no aparece. Se decide en el build comparando `Astro.url.pathname`, sin una
   línea de JavaScript. No es persistencia, pero elimina el caso más irritante —un banner
   anunciando la página que estás leyendo— y es exacto en las nueve rutas.
2. **Se mantiene deliberadamente delgada:** una línea, tipografía de UI (14px), relleno mínimo. Su
   altura la fija el objetivo táctil de 44px del enlace (Design System §10), no una decoración.
3. **El contenido es informativo, no promocional.** Una franja que dice algo útil no genera la
   necesidad de cerrarla; una que interrumpe, sí.

### Si en el futuro hace falta el descarte de verdad

La condición para reabrir esto es **evidencia**, no incomodidad: que la franja demuestre estorbar.
En ese caso la respuesta correcta es la Opción C **completa** —script síncrono en el `<head>` para
que no haya parpadeo— y con enmienda a este ADR y a
`docs/arquitectura-produccion.md` §1.

**D28 se cerró el 2026-09-29 como «no se hace»**, y la condición de arriba sigue siendo la que la
reabriría. Lo que cambió es el argumento: estaba aparcada porque un botón costaría el fin de «cero
almacenamiento», y la intro de marca ya gastó eso el 2026-09-25. **Quien la reabra no puede citar
ese coste, porque ya está pagado.** El motivo de no hacerlo hoy es que nadie ha pedido cerrar la
franja y que ésta ya se oculta sola en la página que enlaza.

## Consecuencias

**A favor**

- Cero JavaScript, cero almacenamiento, cero cookies: las afirmaciones del proyecto siguen sin
  asterisco, y las cuatro páginas legales siguen en cero bytes de JS.
- Cero riesgo de parpadeo y de salto de layout en las nueve páginas.
- El componente es una isla de HTML y CSS: se puede borrar sin dejar rastro.

**En contra, asumido**

- La franja no se puede quitar. En las ocho rutas que no son su destino, quien ya la leyó la
  seguirá viendo. Es el precio consciente de no ensuciar la arquitectura por un aviso de una línea.

## Notas de implementación

Dos cosas que el diseño pedido no anticipaba y que se corrigieron al construir:

1. **El fondo va claro, no en tinta.** Se pidió `--tinta` con texto `--papel`, dejando abierta la
   inversa. La inversa es la correcta: `Header` y `Hero`/`PageHero` son **los dos** `--tinta`, así
   que una franja en tinta entre ellos habría desaparecido en una única masa oscura sin jerarquía.
   En claro queda como una costura brillante entre dos superficies oscuras, que es el registro A×C
   (bordes finos, jerarquía nítida).
2. **El fondo es `--papel`, no `--papel-2`.** Sobre `--papel-2` el `--verde-deep` del enlace da
   **4.44:1** y AA pide 4.5 para texto normal; sobre `--papel` da **4.90:1**. Y hay una trampa
   añadida: la franja vive dentro de `.site-header`, que lleva `.on-tinta-surface` y redefine
   `--focus: var(--verde)` — verde que sobre papel da 2.02:1, por debajo del 3:1 que WCAG exige a
   un indicador de foco. El componente reinicia `--focus` a `--verde-deep`.

---

## Enmienda 2026-09-08 — rotación de dos mensajes y franja más compacta

- **Estado:** Aceptada — 2026-09-08
- **Pide:** Sebastián Villanueva, de forma explícita, con la restricción «sin JavaScript»
- **No revierte nada de lo anterior:** sigue sin botón de cerrar y sigue filtrando el mensaje que
  apunta a la página actual.

### Qué cambia

1. La franja **rota entre los dos copies oficiales cada 5 s**, con CSS puro.
2. Se hace **más compacta**: el enlace baja de 44 px a **32 px de alto en escritorio** y el relleno
   vertical desaparece ahí. En móvil se mantienen los **44 px** del objetivo táctil (Design System
   §10), que no se negocia.

### Lo que esto rompe, dicho de frente

La rotación **contradice el Motion System V1** en dos puntos, y conviene que quede escrito en vez
de descubrirse dentro de seis meses:

- **Regla dura 1: «Una sola vez. Nada se re-anima… Un elemento que reaparece cada vez que pasas es
  el sello del movimiento decorativo.»** Una rotación infinita cada 5 s es el caso que esa frase
  describe literalmente.
- **El catálogo son seis movimientos, «ni uno más».** Éste es un séptimo.

Se acepta porque es una **petición explícita del equipo**, que es quien decide el producto. Queda
enmendado en `docs/design-system/motion-system-v1.md` §0 — acotado a esta pieza, sin sigla propia y
sin abrir la puerta a más movimiento en el resto del sitio.

### El problema que el diseño pedido no anticipaba

Cada mensaje lleva **su propio enlace, a páginas distintas** (`/como-funciona/` y `/empresas/`). Un
carrusel hecho sólo con `opacity` habría enviado gente a la página equivocada: **un elemento con
`opacity: 0` sigue recibiendo clics y sigue en el orden de tabulación.** Alguien podría pulsar «Ver
más» y aterrizar en `/empresas/`, o tabular hasta un enlace que no ve en pantalla.

Por eso el keyframe anima **`opacity` y `visibility`**. Con `visibility: hidden`, el mensaje oculto
sale de la detección de clics, del orden de tabulación y del árbol de accesibilidad. No es un
detalle de estilo: es lo que hace correcto el componente.

Queda un margen de 600 ms por ciclo —el fundido cruzado— en el que los dos están `visible` y
superpuestos. Lo cubre la pausa al pasar el puntero: acercarse para pulsar congela la franja antes
de llegar.

### WCAG 2.2.2 «Pausa, detención, ocultación» (nivel A) — limitación conocida

El criterio pide que **todo contenido en movimiento que arranca solo y dura más de 5 s tenga un
mecanismo para pausarlo, detenerlo u ocultarlo**. Nuestra rotación es infinita, así que entra de
lleno. `CLAUDE.md` §7 pone WCAG AA como piso.

Sin JavaScript no se puede ofrecer un botón de pausa de verdad. Lo que sí se hizo:

- **Pausa al pasar el puntero** (`:hover`) y **al recibir el foco del teclado** (`:focus-within`,
  que se activa al tabular hasta el enlace). Es un mecanismo real, aunque no descubrible.
- **`prefers-reduced-motion: reduce` cancela la rotación** y deja fijo el primer mensaje; el
  segundo sale del documento con `display: none`, para que su enlace no quede acechando invisible
  en el orden de tabulación.

**Corregido el 2026-09-29: son TRES mecanismos, no uno.** Este párrafo nombraba sólo
`prefers-reduced-motion` y concluía que «la forma de cerrarla del todo es un botón de pausa». El
componente tiene además dos pausas implementadas y documentadas en su propio código:

| mecanismo | a quién alcanza |
|---|---|
| `prefers-reduced-motion: reduce` | quien lo tenga puesto en el sistema: detiene la rotación y **saca el segundo mensaje del documento** |
| `.rotator:hover` | puntero |
| `.rotator:focus-within` | teclado, a través del enlace del mensaje |

**Sigue sin ser conformidad plena, y el hueco real es más pequeño de lo que decía:** no es que
falte un mecanismo de pausa —hay uno alcanzable con puntero y con teclado, que es el patrón
aceptado para un carrusel— sino que **ninguno se anuncia**. Quien no tenga la preferencia del
sistema puesta y no acerque el puntero ni tabule, no sabe que puede detenerla.

Queda como **deuda declarada acá**, y a propósito no como decisión abierta: **D28 se cerró el
2026-09-29 y esta mitad no se cerró con ella.** No lleva número propio porque no hay nada que
decidir —el remedio es un control visible y se conoce—; lleva esta tabla para que quien lo mida no
vuelva a contar un mecanismo donde hay tres.

### Notas de implementación

- Los dos mensajes viven en la **misma celda** de una rejilla de una celda (`grid-area`), así que
  la altura de la franja es la del mensaje más alto y **no hay salto de layout** al cambiar. Con
  posicionamiento absoluto el contenedor habría quedado sin altura; como hermanos normales,
  saltaría cada 5 s.
- **Un solo `@keyframes` para los dos.** El segundo lleva `animation-delay: calc(var(--cycle) / -2)`:
  medio ciclo **en negativo**, que lo coloca a mitad de recorrido ya en el primer fotograma. Con un
  retardo positivo, la franja habría pasado sus primeros 5 s con un hueco vacío.
- **Las proporciones del keyframe son para dos mensajes exactamente.** El componente rota sólo
  cuando quedan dos y en cualquier otro caso muestra el primero fijo. No se generaliza un
  `@keyframes` que nadie necesita todavía (`CLAUDE.md` §5).
- El reset global de `prefers-reduced-motion` de `tokens.css` usa `!important` sobre
  `animation-duration` y `animation-iteration-count`. Verificado que la regla de la franja gana
  igualmente, porque lo que impone es `animation-name: none`, que ese reset no toca. Sin la regla
  propia, la animación se habría ejecutado una vez en 0,01 ms y habría dejado **los dos mensajes
  visibles superpuestos**.
- Para bajar el alto del enlace en escritorio hace falta más especificidad que la de `ArrowLink`
  (`.arrow` + su clase de ámbito). Se resuelve anidando (`.announce .cta`), sin `!important`.

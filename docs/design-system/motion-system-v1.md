# Motion System V1

> **Aprobado el 2026-09-07** por Sebastián. Enmienda el Design System §9, que prohibía las entradas
> al hacer scroll y el escalonado.
>
> **Fundamento de la enmienda:** la prohibición se escribió cuando la identidad visual todavía no
> existía y el riesgo real era que el sitio se pareciera a una plantilla. Con la dirección A×C
> construida, la tipografía T-C cerrada y el sistema geométrico aplicado, ese riesgo se evaluó y ya
> no aplica: el sitio tiene esencia propia. El movimiento se añade para que la experiencia sea más
> dinámica, sujeto a las reglas de este documento.
>
> Lo que **no** cambia: el movimiento sigue siendo información, no adorno (ADR-0001 §3).
>
> **Implementado el 2026-09-07.** Coste real: 0,53 KB de JavaScript en las páginas con entrada.
> Las cuatro páginas legales y `/cotizar` no llevan el motor y siguen sin movimiento de entrada.

---

## 0. Qué enmienda este documento

| Decisión previa | Estado |
|---|---|
| DS §9 — "Prohibido: entradas fade-and-slide por sección al hacer scroll" | **Enmendado.** Permitido como **M4**, acotado: un elemento por sección, sobre el eje diagonal del isotipo, 200 ms, una sola vez |
| DS §9 — "hover-transitions en cada tarjeta" | **Sigue prohibido.** M1 aplica a **controles**, no a tarjetas |
| Fase 1 §18 — "animaciones de entrada en cada sección al hacer scroll" | **Superado** por M4 en su forma acotada. Fase 1 se conserva como registro histórico y no se reescribe |
| CLAUDE.md Principio 3 — "animaciones decorativas" | **Intacto.** Ninguna pieza de este sistema es decorativa |

### Enmienda externa — 2026-09-08

| Regla de este documento | Estado |
|---|---|
| §4 — el catálogo son **seis movimientos, ni uno más** | **Enmendado por ADR-0006.** La rotación de la franja de notificación es un **séptimo** movimiento, fuera del catálogo y sin sigla. No se le asigna M7 a propósito: no es un movimiento del sistema, es una excepción de una pieza |
| §4, regla dura 1 — **"Una sola vez.** Nada se re-anima… Un elemento que reaparece cada vez que pasas es el sello del movimiento decorativo" | **Enmendado, y sólo para la franja.** Su rotación es infinita: se re-anima cada 5 s indefinidamente. Es el caso que esta regla describe literalmente. Sigue vigente para todo lo demás |
| §4, regla dura 6 — `prefers-reduced-motion` da una salida limpia | **Intacto y respetado.** Con la preferencia activa la rotación se cancela y queda fijo el primer mensaje |
| §2 — techo de **280 ms** | **No aplica.** El techo gobierna la duración de una transición, no el intervalo entre dos estados. Los fundidos de la franja son de 600 ms, por encima del techo |

Motivo de la enmienda: petición explícita del equipo (Sebastián, 2026-09-08). El análisis del
conflicto y lo que se hizo para acotarlo están en
[`../decisions/0006-franja-de-notificacion.md`](../decisions/0006-franja-de-notificacion.md).

### Enmienda externa — 2026-09-10

| Regla de este documento | Estado |
|---|---|
| §4, **M6** — "secuencia de carga del héroe… 320 ms total" | **Enmendado.** El titular entra **palabra por palabra**, con el desfase estándar `--m-stagger`. El total del héroe sube a **620 ms** en las dos páginas |
| §4, regla dura 4 — **"Máximo cuatro hermanos con stagger"** | **Enmendado, y sólo para las palabras de un titular.** Son 7 en la Home y 6 en `/empresas`. Sigue vigente para tarjetas, bloques y cualquier rejilla: el tope existe para que una rejilla escalonada no se lea como plantilla, y las palabras de una frase no son una rejilla |
| §2c — techo de **280 ms** | **Intacto.** Cada palabra dura `--m-base`, 200 ms. Lo que crece es el desfase acumulado, no ninguna transición |
| §3 — `--m-stagger` = 60 ms | **Intacto.** El primer intento usó medio desfase (30 ms) y hubo que corregirlo: medido en el navegador, a 30 ms una palabra va apenas al **15%** de su fundido cuando arranca la siguiente, las siete se solapan y la cascada se lee como un único fundido del bloque —fue exactamente el reporte de "el titular de la Home está estático". A 60 ms cada palabra va por el **30%** y la ola se distingue |
| §4, regla dura 5 — sin JavaScript todo se ve | **Intacto.** Es CSS puro: mismo `heroIn`, misma diagonal de marca. No se añadió un solo byte de JS |

Motivo: petición explícita del equipo (Sebastián, 2026-09-10), que pidió que los titulares "se
escribieran". **Lo que se descartó, y por qué:** una máquina de escribir carácter a carácter habría
sido el **séptimo movimiento** —con ADR propio, como la franja—, habría durado entre **1,3 y 2,0 s**
contra un techo de 280 ms, habría exigido **JavaScript nuevo** en las dos páginas (un `steps()` de
CSS sólo sirve en una línea monoespaciada, y los dos titulares usan Familjen Grotesk con
`text-wrap: balance` y parten en varias líneas) y habría retrasado el **LCP**, que en ambas páginas
es justamente el titular. La entrada por palabra da la misma lectura sin ninguno de esos cuatro
costes.

### Enmienda externa — 2026-09-15

La segunda excepción a la regla dura 1, **razonada y aceptada en ADR-0008** (`motion-v1-e2`). Se
registra acá porque ese ADR dice apoyarse en este documento y hasta hoy no figuraba: el documento
que enumera los movimientos permitidos no conocía dos movimientos infinitos que ya corrían.

| Regla de este documento | Estado |
|---|---|
| §4, regla dura 1 — **"una sola vez"** | **Enmendado, y sólo para `src/components/hero/GloboRotativo.astro`.** Dos movimientos infinitos: la **rotación** de la esfera (6°/s, una vuelta cada 60 s) y el **pulso** del marcador de Chile (`chilePing`, ciclo de 3,4 s). Con la franja de notificación son **tres** en todo el sitio; fuera de esas dos piezas la regla sigue intacta |
| §2c — techo de **280 ms** | **No aplica.** Un movimiento continuo no tiene duración que acotar. Lo que sí se acota es la velocidad, y ADR-0008 la fija en 6°/s: lenta a propósito, para no competir con el cotizador |
| §4, regla dura 5 — sin JavaScript todo se ve | **Enmendado.** El globo necesita runtime para existir; sin JS degrada a un círculo con halo. Es la excepción que autoriza **ADR-0009**, la única a «cero JS al cliente» |
| `prefers-reduced-motion` | **Intacto.** Con la preferencia puesta el globo se dibuja una vez y no rota, y el pulso se apaga por CSS |

**Guardarraíl añadido el 2026-09-15**, que ADR-0008 no contemplaba: la rotación **se detiene cuando
el globo sale del viewport** (`IntersectionObserver`). Antes recalculaba ~1.500 vértices sesenta
veces por segundo durante toda la navegación de la Home, con el globo fuera de pantalla.

---

## 1. Estado actual, verificado

El sitio es prácticamente estático:

- Un fundido de 420 ms cuando entra una operación nueva al feed.
- El marcador `+` de la FAQ rota **sin transición**: salta.
- Todos los `:hover` de botones, enlaces y bordes cambian **de golpe**, sin transición.
- El reset de `prefers-reduced-motion` ya está puesto.

Es decir: no hay un problema de exceso, hay **ausencia total**. Los controles se sienten duros
porque nada acusa recibo de la interacción.

---

## 2. La idea que hace este sistema de DLPay y no de otro

Tres decisiones que ya están tomadas dictan el movimiento, sin inventar nada:

**a) El movimiento es información.** ADR-0001 §3 dice que cada trazo geométrico representa
*movimiento, flujo de valor o un paso*. La misma regla aplicada al tiempo: **si algo se mueve, es
porque cambió un dato o un estado.** Nunca porque quedaba bonito.

**b) El movimiento tiene una dirección propia: la diagonal del isotipo.** El logo tiene una cola
diagonal en punta (~30–35°) que ya usamos en las cuñas del héroe y en los conectores del diagrama.
**Todo lo que entra, entra sobre ese eje** — no sobre el `translateY` vertical de cualquier
plantilla. Es un cambio de una línea que reemplaza el gesto más genérico del sector por el vector
de la propia marca.

**c) Velocidad de instrumento.** Una mesa de operaciones responde al instante. Nada dura más de
**280 ms**. El movimiento de marketing va de 600 a 800 ms; esa lentitud es justamente lo que hace
que una web se sienta "de agencia".

---

## 3. Tokens propuestos

Se añadirían a `tokens.css`, con el mismo criterio que el resto: nada de valores literales.

```
--m-fast:    120ms   /* microinteracciones: hover, focus, toggle          */
--m-base:    200ms   /* entradas y cambios de estado                      */
--m-slow:    280ms   /* revelados de superficie mayor. Techo absoluto.    */

--m-ease:    cubic-bezier(.2, 0, 0, 1)    /* desaceleración, sin rebote   */
--m-ease-in: cubic-bezier(.4, 0, 1, 1)    /* salidas                      */

--m-stagger: 60ms    /* desfase entre hermanos. Máximo 4 elementos.       */

--m-shift-x: -6px    /* el eje diagonal del isotipo:                      */
--m-shift-y:  9px    /* ~34°, abajo-izquierda hacia arriba-derecha        */
```

Sin rebotes, sin `spring`, sin `ease-in-out`. Un instrumento no rebota.

---

## 4. Catálogo de movimientos

Seis, numerados y contables. Si algo no está acá, no se mueve.

| # | Nombre | Qué hace | Duración | Dónde |
|---|---|---|---|---|
| **M1** | `press` | Respuesta de un control al puntero o al foco: color, borde, fondo | `--m-fast` | Botones, enlaces, opciones del cotizador, marcador de FAQ |
| **M2** | `settle` | Una cifra que **cambió**: opacidad + 2 px, sólo sobre el valor nuevo | 160 ms | Precio referencial y "recibes" del cotizador |
| **M3** | `draw` | La geometría se dibuja **en la dirección que apunta** (`stroke-dashoffset`) | `--m-slow` | **Sólo trazos con `stroke`:** las tres cuñas de traspaso de `/como-funciona` y la costura de `EjeDeAlcance`. Ver la nota de abajo |
| **M4** | `enter` | Entrada sobre el eje diagonal: opacidad + `translate(-6px, 9px)` | `--m-base` | Ver §5. **Requiere enmienda del DS §9.** |
| **M5** | `stagger` | Desfase de 60 ms entre hermanos, **máximo 4** | — | Ver §5. **Requiere enmienda.** |
| **M6** | `sequence` | Secuencia de carga del héroe, una sola vez | 320 ms total | Home y `/empresas`. Incluye **las cuñas del héroe**, que entran con un fundido de opacidad y no con un trazo — recatalogadas desde M3 el 2026-09-17. **Ya permitido por DS §9.** |

> **El inventario real de M3, medido y cerrado el 2026-09-17.** `data-draw` aparece en `src/` sólo
> en las cuñas de traspaso de `/como-funciona` y en la costura de `EjeDeAlcance`, que vive en la
> Home, `/como-funciona` y `/empresas`. Esta fila llegó a listar tres consumidores y dos no lo eran.
>
> Los conectores del diagrama salieron con `FlowDiagram.astro`. Y **las cuñas del héroe nunca fueron
> M3**: son un `<div>` con `clip-path` y `background`, animado con un fundido de opacidad de 0 a
> 0,07 (`@keyframes wedgeIn`). No hay `stroke` que recorrer, así que sobre un relleno recortado M3
> no está mal implementado — **es imposible**.
>
> **Se catalogan en M6**, que es literalmente lo que hacen: secuencia de carga del héroe, una sola
> vez. La implementación ya las trataba así sin decirlo — `.seq`, `.w` y `.wedges` comparten la
> misma regla de `prefers-reduced-motion` en `Hero.astro` y en `PageHero.astro`.

**Aclaración sobre el eje (2026-09-07).** M4 entra sobre la diagonal de la marca porque es
contenido que llega a la página. La **barra fija móvil** es la excepción razonada: no entra en la
página, se acopla al borde inferior donde vive, así que asoma desde ese borde. Misma duración y
misma curva; distinto eje porque es distinto el gesto físico. No es un séptimo movimiento.

### Reglas duras del catálogo

1. **Una sola vez.** Nada se re-anima al volver a hacer scroll. Un elemento que reaparece cada vez
   que pasas es el sello del movimiento decorativo.
2. **El cotizador no entra.** Es el instrumento: tiene que estar encendido cuando llegas. En el
   héroe de la Home, **la tarjeta ya está ahí y lo que entra es el texto** — al revés de lo
   habitual, y coherente con "la cifra manda".
3. **Las cifras no entran, sólo cambian.** M2 nunca es un conteo desde cero.
4. **Máximo cuatro hermanos con stagger.** Una rejilla de seis escalonada se lee como plantilla.
5. **Sin JavaScript, todo se ve.** Los estados iniciales ocultos se aplican **sólo** si una clase
   en `<html>` confirma que el observador está activo. Si el JS falla, la página se ve completa e
   inmóvil. Esto no es opcional: hoy el sitio es legible sin JS y esa propiedad no se pierde.
6. **`prefers-reduced-motion` desactiva M2–M6 por completo.** M1 se reduce a cambio de color
   instantáneo. No es una versión degradada: es una salida limpia.

---

## 5. Dónde se aplica, página por página

> **Este capítulo dice el ESTADO, no el plan** *(aclarado el 2026-09-17)*. Nació el 2026-09-07 en
> condicional —«dónde se aplicaría»— como propuesta, y se fue corrigiendo a medida que se
> implementaba, así que a los diez días era mitad plan y mitad estado sin que el lector pudiera
> saber cuál era cuál. Peor: contradecía al §4, que sí está medido.
>
> Ahora manda §4 para **qué es cada movimiento** y este capítulo para **dónde está**, los dos
> contrastados con el build. Lo que se planeó y no se hizo no se borra: vive en el registro de
> enmiendas de §0 y en el historial. Tres asignaciones de M3 de la propuesta original se corrigen
> abajo, porque `data-draw` no existe en ninguna de esas zonas.

### Home

| Zona | Movimiento | Por qué |
|---|---|---|
| Cabecera | M1 en enlaces y WhatsApp | Hoy saltan |
| Héroe | **M6**: la tarjeta del cotizador ya está; entra el titular palabra por palabra, y detrás subtítulo y franja | El instrumento primero, las palabras después |
| Cuñas del héroe | **M6**, una vez, al cargar | *Corregido el 2026-09-17.* La propuesta decía M3, pero son un `<div>` con `clip-path` y entran con un fundido de opacidad: no hay trazo que recorrer, así que M3 ahí no está mal implementado, es imposible. Entran con la secuencia de carga y comparten su regla de `prefers-reduced-motion` |
| Cotizador | **M1** en opciones y botón · **M2** al recalcular | Acuse de recibo y dato que cambió |
| Tres usos | **M4** en el titular + **M5** en las tres tarjetas | 3 hermanos: dentro del máximo. *Corregido el 2026-09-17:* la propuesta añadía M3 en las reglas de acento y nunca se implementó — `UseCaseFigure` no lleva `data-draw` |
| Cómo funciona | **M4** en el titular | *Corregido el 2026-09-17:* la propuesta pedía M3 en las cuñas entre pasos y ese bloque de la Home no las tiene. La idea sí se cumplió, pero en `/como-funciona`, donde las cuñas de traspaso sí se dibujan |
| Confianza | **M4** sólo en el titular de sección | Los tres bloques **no** escalonan: son afirmaciones, no una secuencia |
| Banda empresas | **M1** en el botón | Nada más |
| FAQ | **M1** en el marcador `+` | Hoy salta |
| Pie | **M1** en enlaces | |

### /cotizar

| Zona | Movimiento | Por qué |
|---|---|---|
| Cotizador | **M1** + **M2**. **Ningún M4** | La herramienta debe estar encendida al llegar. Alguien abre este enlace desde WhatsApp para ver un número, no para ver una animación |
| Actividad reciente | El fundido actual, sin cambios | Ya funciona y es sobrio |

**Es la página con menos movimiento del sitio, a propósito.**

### /como-funciona

| Zona | Movimiento | Por qué |
|---|---|---|
| ~~Diagrama de flujo~~ | *Retirado el 2026-09-17* | La banda entera salió de la página, y con ella `FlowDiagram.astro`. El motivo no fue densidad: su pie decía «Dónde está tu dinero en cada momento», que es el título exacto de la figura de `/confianza`. No era riesgo de duplicación, era una colisión ya ocurrida |
| Cuñas de traspaso | **M3 en secuencia**: se dibujan las tres cuñas que marcan dónde el trabajo cambia de manos | **El momento de movimiento del sitio, trasladado, no perdido.** No hubo que inventar dónde ponerlo: la fila de M3 ya nombraba dos sitios, «cuñas del héroe, **cuñas de los pasos**, conectores del diagrama de flujo». Se retiró uno y quedó el otro. La secuencia sale gratis: el observador las dispara a alturas distintas, así que se dibujan 03 → 04 → 05 conforme se lee, y sin una línea de JavaScript nueva |
| Pasos | **M4 sólo en el titular.** La lista **no** entra | *Corregido al implementar:* son **seis** pasos y el tope es cuatro. En dos columnas, escalonar seis se lee como el revelado de tarjetas de cualquier plantilla. El tope gana sobre el argumento de "es una secuencia real". **Sigue vigente con los carriles** (2026-09-17): lo que se dibuja son las tres cuñas, no los seis pasos |
| Límite del servicio | **Nada** | Su fuerza está en la quietud |
| Cierre | **M1** | |

### /empresas

| Zona | Movimiento | Por qué |
|---|---|---|
| Encabezado | **M6** en titular, bajada, botones y el portátil | *Añadido el 2026-09-10.* Está sobre el pliegue: entra al cargar y sin depender del observador, igual que el héroe de la Home. Cuatro elementos en secuencia, justo en el tope de 4. El portátil **no** es el instrumento —es un mockup sin controles, hermano del teléfono de la Home—, así que la regla dura 2 no le aplica y sí entra |
| Casos de uso | **M5** en los 4 casos | Justo en el máximo. *Corregido el 2026-09-17:* la regla de acento se retiró el 2026-09-16 con el rediseño de las figuras, y su M3 nunca llegó a existir |
| Tabla comparativa | **Nada** | Son datos: se leen, no se presentan |
| Incorporación | **M4** en el titular | |
| Contacto | **M1** | |

### /confianza

| Zona | Movimiento | Por qué |
|---|---|---|
| Mecanismos | **M4** en el titular. Los tres bloques **no** escalonan | Ya se ajustó su composición; escalonarlos la desharía |
| Requisitos | **Nada** | |
| **Lo que no afirmamos** | **Nada, deliberadamente** | Es la sección más honesta del sitio. La quietud *es* el tono |
| Quiénes somos | **M1** en el botón | |

### Páginas legales

**Sólo M1.** Un documento legal no se presenta con movimiento.

---

## 6. Coste

| Concepto | Estimación |
|---|---|
| JavaScript | ~1,1 KB comprimido: un `IntersectionObserver` compartido, sólo en las páginas con M4/M5 |
| CSS | ~1,5 KB: tokens y seis clases |
| Dependencias | **Ninguna.** No hace falta ninguna librería |
| Páginas legales | JS sin cambios: hoy es 0 y seguiría en 0 |

---

## 7. Lo que esta propuesta NO incluye, y por qué

- **Conteo de números desde cero.** No hay dónde aplicarlo con honestidad: los únicos números del
  sitio son el precio —que debe ser exacto en todo momento— y los montos de la actividad, que ya
  aparecen. Las cifras de vanidad se eliminaron a propósito en Fase 2.5. Un conteo sobre el precio
  mostraría precios falsos durante 800 ms.
- **Parallax, movimiento continuo, elementos flotantes.** Movimiento decorativo puro.
- **Transiciones de página.** Añaden latencia percibida a un sitio cuyo argumento es la velocidad.
- **Movimiento en la tabla de `/empresas` ni en la actividad.** Son datos.

---

## 8. Decisiones tomadas (2026-09-07)

| # | Decisión | Resultado |
|---|---|---|
| 1 | **M4** — entrada al hacer scroll, un elemento por sección, sobre el eje diagonal | **Aprobado** |
| 2 | **M5** — escalonado, máximo 4 hermanos, sólo donde hay secuencia real | **Aprobado con el tope** |
| 3 | Conteo de números desde cero | **Descartado.** No hay dónde aplicarlo sin mostrar cifras falsas |
| 4 | **M1, M2, M3, M6** | **Aprobados** (ya estaban permitidos) |

## 9. Cómo se revisa que esto no se degrade

El riesgo de un sistema de movimiento es que crezca por acumulación. Tres comprobaciones:

1. **Contar.** Seis movimientos, ni uno más. Si aparece un séptimo, es una decisión, no un detalle.
2. **Medir.** Ninguna duración sobre 280 ms. Verificable con un `grep`.
3. **Apagar.** Con `prefers-reduced-motion`, el sitio debe quedar exactamente como estaba antes de
   esta enmienda: legible, completo e inmóvil.


---

## 10. Estado de la implementación

| Movimiento | Dónde quedó |
|---|---|
| **M1** `press` | Cabecera, pie, cotizador, FAQ, botones de todas las páginas |
| **M2** `settle` | Precio del cotizador, sólo cuando el valor **cambia** |
| **M3** `draw` | Cuñas de traspaso de `/como-funciona` y costura de `EjeDeAlcance` (Home, `/como-funciona`, `/empresas`). Las cuñas del héroe **no** son M3: son M6 — ver la nota de la fila M3 |
| **M4** `enter` | 3 titulares en Home, 3 en `/empresas`, 2 en `/confianza`, 1 en `/como-funciona` |
| **M5** `stagger` | 3 tarjetas de usos (Home) y 4 casos (`/empresas`). Nada más |
| **M6** `sequence` | Héroe de la Home: la tarjeta ya está, entra el texto. Encabezado de `/empresas`: titular, bajada, botones y el portátil. En los dos, el titular entra **palabra por palabra** (enmienda del 2026-09-10) y **las cuñas del fondo con un fundido de opacidad** |

**Entradas por página:** Home 9 · `/empresas` 8 · `/como-funciona` 3 · `/confianza` 3 ·
`/cotizar` **0** · las cuatro legales **0**.

Un ajuste que hizo el propio sistema al implementarse: el fundido del feed de actividad medía
**420 ms**, por encima del techo de 280 que no existía cuando se escribió. Quedó alineado a
`--m-base`.

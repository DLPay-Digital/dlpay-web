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
| **M3** | `draw` | La geometría se dibuja **en la dirección que apunta** (`stroke-dashoffset`) | `--m-slow` | Cuñas del héroe, cuñas de los pasos, conectores del diagrama de flujo |
| **M4** | `enter` | Entrada sobre el eje diagonal: opacidad + `translate(-6px, 9px)` | `--m-base` | Ver §5. **Requiere enmienda del DS §9.** |
| **M5** | `stagger` | Desfase de 60 ms entre hermanos, **máximo 4** | — | Ver §5. **Requiere enmienda.** |
| **M6** | `sequence` | Secuencia de carga del héroe, una sola vez | 320 ms total | Home. **Ya permitido por DS §9.** |

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

## 5. Dónde se aplicaría, página por página

### Home

| Zona | Movimiento | Por qué |
|---|---|---|
| Cabecera | M1 en enlaces y WhatsApp | Hoy saltan |
| Héroe | **M6**: la tarjeta del cotizador ya está; entran titular, subtítulo y franja, 60 ms entre sí | El instrumento primero, las palabras después |
| Cuñas del héroe | **M3**, una vez, al cargar | Es el vector de la marca dibujándose |
| Cotizador | **M1** en opciones y botón · **M2** al recalcular | Acuse de recibo y dato que cambió |
| Tres usos | **M4** en el titular + **M5** en las tres tarjetas · **M3** en las reglas de acento | 3 hermanos: dentro del máximo |
| Cómo funciona | **M3** en las cuñas entre pasos, en secuencia | La cuña apunta al paso siguiente: dibujarla *es* explicar |
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
| Diagrama de flujo | **M3 en secuencia**: los tramos se dibujan de Tú → Banco → DLPay → Tu billetera | **El momento de movimiento del sitio.** El dinero moviéndose, dibujado en el orden en que se mueve. Es información pura |
| Pasos | **M4 sólo en el titular.** La lista **no** entra | *Corregido al implementar:* son **seis** pasos y el tope es cuatro. En dos columnas, escalonar seis se lee como el revelado de tarjetas de cualquier plantilla. El tope gana sobre el argumento de "es una secuencia real" |
| Límite del servicio | **Nada** | Su fuerza está en la quietud |
| Cierre | **M1** | |

### /empresas

| Zona | Movimiento | Por qué |
|---|---|---|
| Casos de uso | **M3** en las reglas de acento + **M5** en las 4 tarjetas | Justo en el máximo |
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
| **M3** `draw` | Cuñas del héroe, cuñas entre pasos, conectores del diagrama |
| **M4** `enter` | 3 titulares en Home, 3 en `/empresas`, 2 en `/confianza`, 1 en `/como-funciona` |
| **M5** `stagger` | 3 tarjetas de usos (Home) y 4 casos (`/empresas`). Nada más |
| **M6** `sequence` | Héroe de la Home: la tarjeta ya está, entran las palabras |

**Entradas por página:** Home 9 · `/empresas` 8 · `/como-funciona` 3 · `/confianza` 3 ·
`/cotizar` **0** · las cuatro legales **0**.

Un ajuste que hizo el propio sistema al implementarse: el fundido del feed de actividad medía
**420 ms**, por encima del techo de 280 que no existía cuando se escribió. Quedó alineado a
`--m-base`.

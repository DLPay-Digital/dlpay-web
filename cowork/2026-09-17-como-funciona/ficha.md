# Ficha — /como-funciona: la secuencia en dos carriles

**Entrega:** `2026-09-17-como-funciona` · **Autor:** Claude Cowork · **Estado:** En revisión
**Vista:** `index.html` · **Capturas:** `pagina-1280.png`, `carriles-1280.png`, `pagina-390.png`,
`verde-deep-evidencia.png`
**Auditada** con `design:accessibility-review` (WCAG 2.1 AA) — §13. Encontró un fallo propio, ya
corregido.
**Origen:** jugadas J2 y J3 del estudio `2026-09-17-estudio-nivel-2`, aprobadas por Sebastián.
**Viaja con:** el **lote B de J4** (§7) y **un cambio de token** (§4). Las tres cosas son una sola
entrega: la maqueta no cumple AA sin el token.

---

## 1. El problema

`/como-funciona` mide 3,7 pantallas, 471 palabras y **una sola pieza visual**: el `FlowDiagram`, una
banda de 328 px. Todo lo demás es lista. Y la lista tiene un problema que no es de densidad sino de
sentido: **la página promete «marcamos quién hace qué» y lo entrega como una etiqueta al lado del
título**. Seis pasos en una columna, cada uno con una pastilla «Lo haces tú» / «Lo hacemos
nosotros». Hay que leer las seis pastillas, una por una, para reconstruir el dato que la página dice
estar dando: **cuántas veces el trabajo cambia de manos, y cuándo**.

Son tres veces. Eso no se ve en ningún sitio de la página actual.

## 2. Hay una colisión, no un riesgo de duplicación

El `FlowDiagram` de esta página lleva como pie **«Dónde está tu dinero en cada momento»** —el
título **exacto** de la figura que acabamos de construir en `/confianza` y que ya está integrada
(commit `3dd4ae5`). No es un parecido: es la misma frase.

Y es correcto que `/confianza` se la quede. Esa pregunta —dónde está mi plata y quién la tiene— es
una pregunta de confianza. La de esta página es otra: **qué pasa, en qué orden, y quién hace cada
cosa**. Dos preguntas distintas merecen dos figuras distintas; hoy hay una figura respondiendo la
pregunta de la otra página.

## 3. La pieza: dos carriles y un eje

Un *swimlane* de dos carriles. Izquierda «Lo haces tú», derecha «Lo hacemos nosotros», y entre ambos
**un eje vertical de 1 px**. Cada paso se coloca en el carril de quien lo ejecuta. La alternancia
real es **tú · tú · nosotros · tú · nosotros · nosotros**, así que el eje se cruza tres veces, y en
cada cruce va **una cuña** centrada sobre el eje.

El dato que antes había que reconstruir leyendo seis pastillas ahora **se ve de un vistazo**: la
forma de la página *es* el reparto del trabajo.

**El carril sale de datos que ya existen.** `src/content/process.ts` ya tiene el campo
`who: 'tú' | 'DLPay'` en cada uno de los seis pasos. No hay contenido nuevo que inventar ni decidir:
la columna la determina un campo que el proyecto ya mantiene.

**La colocación es explícita, no automática.** Con seis hijos y dos columnas, el flujo automático de
CSS Grid los reparte por orden de llegada y el carril deja de significar nada. Cada paso declara su
`grid-column` y su `grid-row`. Es el mismo error que ya nos mordió en el listado del blog.

**La cuña es la del sistema, copiada al carácter.** `M0 6h12l6-5 6 10 6-5h10`, `stroke-width 1.5`,
40×12. No es un dibujo nuevo: es el marcador de paso del DS §6, el mismo trazo que ya usa el
`FlowDiagram` que se retira. Y cumple la regla de ADR-0001 §3: **cada trazo representa movimiento,
flujo de valor o un paso** — aquí representa el momento exacto en que el trabajo cambia de manos.
Nada más se dibuja en la página.

**En móvil no hay carriles**, porque dos columnas de 175 px no son dos carriles, son dos columnas
estrechas. Por debajo de 900 px la pieza se convierte en una lista y el reparto viaja en el pie mono
de cada paso: `Lo haces tú · ahora mismo`. Quién y cuándo son dos datos del mismo orden y comparten
una sola línea; eso ahorra seis líneas y **121 px** de alto respecto de ponerlos en dos. Los pasos
de nosotros conservan además el filete verde superior.

**En escritorio esa misma etiqueta sigue ahí, oculta a la vista.** No desaparece: se oculta con la
técnica `.sr-only`. El carril dice quién hace qué mirando; para quien no mira, lo dice la etiqueta.
El porqué está en §13.1 — fue un fallo real de la primera versión.

## 4. Un hallazgo de contraste que **no** es de esta maqueta

Al medir la pieza sobre el fondo real (`--papel-2`, que es el que hoy tiene `.detail`) salió un
número que no cuadraba con el DS. Fui a comprobarlo **al build**, y el problema existe hoy en
producción:

`--verde-deep` se define en `tokens.css` como *«verde sobre superficie clara donde `--verde` no da
AA»*. El DS §2.4 lo documenta **sólo contra `--papel`**: 4,90:1. Contra `--papel-2` da **4,44:1**, y
contra el chip `rgba(11,122,84,.1)` sobre papel-2 —el que usa hoy la pastilla `.who.us` de esta
misma página— da **3,92:1**. El piso AA para texto normal es 4,5:1. **El token no cumple su propia
definición.**

Medido sobre `dist/` (build del 2026-09-17, posterior a `9cbdb75`), con el fondo efectivo
compuesto subiendo por los ancestros:

| Página | Elemento | Fondo efectivo | Ratio | |
|---|---|---|---|---|
| `/como-funciona` | `.who.us` «Lo hacemos nosotros» ×3 | `rgb(214,223,213)` | **3,92:1** | ✗ |
| `/` | `.leg-label` «Envías» y «Recibes» | `rgb(236,234,227)` | **4,44:1** | ✗ |
| `/` | enlace «Cómo cuidamos tu operación» | `rgb(236,234,227)` | **4,44:1** | ✗ |
| `/confianza` | `.phase-who` «Lo tenemos nosotros» | `rgb(246,245,241)` | 4,90:1 | ✓ |
| `/`, `/empresas`, `/confianza` | enlaces `.arrow` sobre papel | `rgb(246,245,241)` | 4,90:1 | ✓ |

> **Faltaba una fila, y también la encontró el agente:** `.who.you` ×3 en esta misma página daba
> **4,32:1** — `--ink-mute` sobre `rgba(11,19,32,.07)` encima de papel-2. No la vi porque mi
> barrido **filtraba por `--verde-deep`**: buscaba un color concreto en vez de auditar todo el
> texto. Eran **nueve** rótulos incumpliendo, no seis.

**Nueve rótulos por debajo del piso, seis de ellos en esta página.** La pieza que entregué ayer en
`/confianza` pasa —está sobre papel—, así que esto no es una regresión mía; es un hueco del sistema
que la maqueta destapó.

**Recomendación: `--verde-deep: #0A7250`** en lugar de `#0B7A54`. Un token, una línea.

| | sobre `--papel` | sobre `--papel-2` | sobre el chip |
|---|---|---|---|
| `#0B7A54` (hoy) | 4,90 | **4,44** ✗ | **3,92** ✗ |
| `#0A7250` (propuesto) | 5,44 | 4,93 ✓ | **4,35** ✗ |

> **CORREGIDO EL 2026-09-17, DESPUÉS DE INTEGRAR.** Esta tabla decía 4,59 en la casilla del chip y
> afirmaba que el token cumplía en las tres superficies. Era falso, y el agente de Claude Code lo
> cazó. Dos errores míos encadenados:
>
> 1. **Compuse el chip con el color equivocado.** El CSS dice `rgba(11, 122, 84, .1)` —eso es
>    `--verde-deep` al 10 %, no `--verde`. Yo usé `#16C784` al 10 %, que da `rgb(215,230,218)`; el
>    real es `rgb(214,223,213)`. Sobre el correcto, `#0A7250` da **4,35** (4,31 si el literal
>    pasara a seguir al token), o sea **sigue bajo AA**.
> 2. **«Un 4 % de luminancia» me lo inventé.** La luminancia relativa cae **13,3 %** y la claridad
>    perceptual L\* un **6,3 %**. Ninguna de las dos es 4. El cambio sigue siendo pequeño, pero el
>    número no era ése.
>
> Lo que **sí** estaba bien medido era el estado actual (4,90 / 4,44 / 3,92), porque salió del
> build. Lo que estaba mal era el candidato, porque salió de una lámina que dibujé a mano. Ver la
> regla 8 del README.

**El token se aceptó igual, y por un motivo mejor que el mío:** el caso del chip **desaparece con
esta misma entrega**, porque la pieza retira las pastillas `.who`. Los otros dos consumidores del
literal —`IconBadge` y el anillo de foco del cotizador— son gráficos, piso 3:1. El agente dejó
anotado el límite en DS §2.4 para que nadie vuelva a poner **texto verde sobre chip verde**.

Ver `verde-deep-evidencia.png`, rehecha con el chip correcto. **No toca la identidad**: `--verde` `#16C784` y
`--tinta` `#0B1320` quedan exactamente igual; `--verde-deep` es un token derivado cuyo trabajo
declarado es, literalmente, dar AA sobre superficie clara. Y deja el verde documentado en **las dos
superficies claras**, igual que ya lo está `--aviso-deep` (5,40 / 4,90) — el mismo desdoblamiento,
por el mismo motivo.

> **La maqueta declara este cambio en voz alta.** `index.html` lleva un `:root{--verde-deep:#0A7250}`
> con el comentario del porqué, y el encabezado de la vista lo dice. Si se renderiza con el token de
> hoy, lo único que baja de AA son los dos rótulos de cabecera y el `.who` móvil.

**Si el cambio de token se rechaza:** los rótulos de carril y el `.who` móvil pasan a `--ink`
(14,5:1) y el verde se queda sólo en la cuña y en el filete de `.step.us`, que son gráficos y con
4,44 superan el piso de 3:1 de WCAG 1.4.11. Se pierde el color en dos etiquetas y no se pierde nada
más. Los seis rótulos del build siguen sin cumplir, eso sí.

## 5. Movimiento: M3 se traslada, no se pierde

El Motion System V1 §/como-funciona dice del `FlowDiagram`: *«M3 en secuencia… **El momento de
movimiento del sitio**. El dinero moviéndose, dibujado en el orden en que se mueve»*. Retirar el
componente sin más **borraría ese momento**, y eso sería una pérdida real.

No hay que inventar dónde ponerlo, porque M3 ya nombra los dos sitios: su fila de la tabla lista
*«Cuñas del héroe, **cuñas de los pasos**, conectores del diagrama de flujo»*. Se retira uno y queda
el otro. **M3 pasa a las tres cuñas de traspaso**, con `data-draw` en cada `path`.

Y la secuencia sale gratis: `Motion.astro` dispara `is-in` por `IntersectionObserver`, y las tres
cuñas están a alturas distintas, así que **se dibujan en el orden 03 → 04 → 05 conforme se lee**.
La secuencia la marca el scroll, no un temporizador.

Lo que **no** cambia: los seis pasos **no escalonan** (M5 tiene tope de cuatro hermanos; el Motion
System ya lo dejó corregido) y el titular de sección mantiene M4. Coste en JS: **cero**. No hay
script nuevo; `data-draw` ya está implementado.

## 6. Evidencia medida

Sobre `index.html` renderizado en Chromium, `device_scale_factor` 2. El archivo medido es **byte a
byte** el del proyecto (md5 `432d2a3b…` comprobado en los dos lados).

**Geometría**

| | 390 | 760 | 900 | 1280 |
|---|---|---|---|---|
| Desborde horizontal | 0 | 0 | 0 | 0 |
| Alto de la vista | 2113 | 1890 | 2022 | 1928 |
| Medida del párrafo | 350 px | 423 px | 354 px | 423 px |
| Carriles | no | no | sí | sí |
| Cuñas visibles | 0 | 0 | 3 | 3 |
| Desvío de cada cuña respecto del eje | — | — | **0,0 px** | **0,0 px** |

Las tres cuñas están **exactamente centradas** sobre el eje, una en cada traspaso (03, 04, 05).
No es un detalle cosmético: es lo que hace que la cuña se lea como *cruce* y no como adorno pegado
al final de una columna. En la primera versión el desvío era de 32 px —medio `--s-8`— y la cuña
invadía 20 px de la columna de texto vecina. Se corrigió a `calc(-1 * var(--s-8) / 2 - 20px)`.

**Contraste**, todo compuesto contra el fondo real de la sección `rgb(236,234,227)`:

| Elemento | Tipo | Ratio | Piso |
|---|---|---|---|
| Cuña de traspaso | gráfico | 4,93:1 | 3,0 |
| Filete superior de `.step.us` | gráfico | 4,93:1 | 3,0 |
| «Lo hacemos nosotros» | texto | 4,93:1 | 4,5 |
| «Lo haces tú» | texto | 14,5:1 | 4,5 |
| Párrafo, número y pie de paso | texto | 4,98:1 | 4,5 |
| Eje y filete de `.step.you` (`--line`, α .14 → `rgb(205,204,200)`) | separador decorativo | 1,34:1 | — |

El eje **no** es un control ni un gráfico que porte información por sí solo: la información la porta
la posición del paso, y el eje sólo la hace legible. Por eso usa `--line` y no `--line-on-tinta`,
que el propio token reserva para **contornos de control**.

## 7. Lote B de J4: las tres declaraciones que faltaban

De la entrega `2026-09-17-j4-medida-y-objetivos` quedaron pendientes las declaraciones de esta
página, a la espera del rediseño. Son tres y **ninguna depende de la pieza nueva**:

| `src/pages/como-funciona.astro` | Hoy | Debe ser |
|---|---|---|
| línea 199 · `.step p` | `58ch` | `47ch` |
| línea 219 · `.kyc p` | `52ch` | `47ch` |
| línea 242 · `.scope-box` | `66ch` | `47ch` |

Recordatorio del motivo, ya verificado por el agente: `1ch` es el ancho del glifo «0», no el de un
carácter medio; en Familjen Grotesk el factor medido es **1,38** (el agente midió 1,367 por su
cuenta). `66ch` son ~91 caracteres reales, muy por encima del tope de 65–70 del DS. La línea 157
(`.head`, `46ch`) ya está dentro y no se toca.

## 8. Lo que se retira, y el coste

**Se retira `.diagram-band` entera y con ella `<FlowDiagram />`.** El componente (102 líneas) queda
sin ningún uso en `src/` — conviene borrarlo en el mismo commit, no dejarlo huérfano.

**Se retiran de `.detail`:** los marcadores numerados de 32 px con caja y borde, y las dos pastillas
`.who.you` / `.who.us`. Eso son **dos colores con alfa menos** en la página
(`rgba(11,19,32,.07)` y `rgba(11,122,84,.1)`) y, de paso, el fin del rótulo que hoy da 3,92:1.

**Fondo de sección:** la pieza hereda `--papel-2`, el que ya tiene `.detail`. Al desaparecer la
banda del diagrama, la alternancia de la página queda entera:
tinta · **papel-2** · papel · papel-2 · tinta.

**Coste neto:** ~50 líneas de CSS, **cero JS nuevo**, **cero componentes nuevos**, −102 líneas de
componente, −2 colores con alfa, −1 pieza SVG. El HTML de los pasos pierde el `<div class="marker">`
y gana un `<svg>` de una línea en tres de los seis.

## 9. Lo que descarté

**Alinear a la derecha la columna de nosotros.** Lo maqueté y lo miré: la posición del carril ya
dice de quién es el paso, y el texto en bandera a la derecha se lee peor. El alineado sólo añadía
simetría decorativa.

**Escalonar la entrada de los seis pasos.** Tentador y prohibido: M5 tope cuatro. El Motion System
ya registra esta decisión y el motivo («en dos columnas, escalonar seis se lee como el revelado de
tarjetas de cualquier plantilla»).

**Rehacer el diagrama de flujo con otro pie.** Habría dejado dos figuras compitiendo por explicar lo
mismo en dos páginas. La pregunta de esta página no es dónde está el dinero.

**Dibujar el eje con `--line-on-tinta`.** Es un eje sobre superficie clara y no es un control; el
token está reservado y documentado para otra cosa.

**Poner la pieza sobre `--papel` para esquivar el contraste.** Habría dejado dos secciones papel
seguidas y —peor— habría escondido un defecto del sistema en lugar de reportarlo.

## 10. Para el agente

1. La entrega son **tres cosas**: la pieza, el token de §4 y el lote B de §7.
2. `FlowDiagram.astro` queda huérfano. Borrarlo en el mismo commit.
3. Los seis pasos siguen saliendo de `src/content/process.ts` con el campo `who` que ya existe. No
   hay contenido que mover a `content/`.
4. Verifica el token por tu cuenta antes de aceptarlo: compón `#0B7A54` contra `#ECEAE3` y contra
   `rgba(22,199,132,.10)` sobre `#ECEAE3`. Si te da otra cosa, dilo.
5. Si aceptas `#0A7250`, el DS §2.4 hay que actualizarlo con **las dos superficies**, igual que ya
   está `--aviso-deep`. Y conviene revisar `/` : los dos `.leg-label` y el enlace `.arrow` de la
   banda que hoy dan 4,44:1 quedan arreglados solos.
6. La colocación en grid es explícita a propósito. Si algún día se añade un séptimo paso, hay que
   tocar las reglas `nth-child`; es el precio de que el carril signifique algo.
7. **No conviertas `.who` en `display:none` al trasladar.** Parece la forma limpia de decir «esto no
   se ve en escritorio» y borra el dato del árbol de accesibilidad (§13.1). Va oculto-pero-presente.
8. `role="list"` en el `<ol>` viaja con la pieza (§13.2). Las otras cuatro listas ordenadas del
   sitio quedan señaladas, no tocadas.

## 11. Tokens y código

**Tokens usados** (33, todos existentes; ninguno literal mágico). Los de andamio —`.board`,
`.scaffold`— no cuentan, no viajan:

`--container` · `--f-num` · `--ink` · `--ink-mute` · `--lh-display` · `--lh-h2` · `--lh-h3` ·
`--line` · `--ls-display` · `--ls-h2` · `--ls-label` · `--on-tinta` · `--on-tinta-mute` ·
`--pad-section` · `--pad-section-m` · `--papel-2` · `--s-2` · `--s-3` · `--s-4` · `--s-5` · `--s-6` ·
`--s-7` · `--s-8` · `--s-9` · `--t-dato-sm` · `--t-display-m` · `--t-h2` · `--t-h2-m` · `--t-h3` ·
`--t-h3-m` · `--tinta` · `--verde` · `--verde-deep`

**Radios:** ninguno. La pieza no tiene una sola esquina redondeada, y es deliberado: son filetes y
un eje, no tarjetas. **`--elev-card`:** no aparece; sigue reservado al cotizador.

**El código candidato es `index.html`.** El bloque `<style>` traslada tal cual salvo tres cosas:

1. El `:root{--verde-deep:#0A7250}` del principio **no** se traslada: ese cambio va en
   `tokens.css` (§4).
2. `.board` y `.scaffold` son andamio de la vista y no existen en la página.
3. `.band` es el `PageHero` que ya existe; no se toca. Lo que se traslada empieza en `.steps`.

La marca de traspaso, literal:

```html
<svg class="handoff-mark" viewBox="0 0 40 12" fill="none" aria-hidden="true"
     preserveAspectRatio="none">
  <path d="M0 6h12l6-5 6 10 6-5h10" stroke="currentColor" stroke-width="1.5" data-draw/>
</svg>
```

Va como **primer hijo** del `<li>` de los pasos 03, 04 y 05 —los que cambian de manos respecto del
anterior—, y `aria-hidden` porque el dato que aporta ya está en el texto: el `<span class="who">`
lo dice con palabras y en móvil es lo único que queda.

## 12. Pendientes

Ninguno de contenido: los seis pasos, sus tiempos y el campo `who` ya existen en
`src/content/process.ts` y no se tocó ni una palabra del copy. El único bloqueo posible es la
decisión de §4 sobre `--verde-deep`, que es de Sebastián y del agente, no mía.

---

## 13. Auditoría WCAG 2.1 AA

Pasada con la skill `design:accessibility-review` sobre la maqueta renderizada en Chromium, después
de escribir todo lo anterior. **Encontró un fallo de mi propio diseño**, y es el hallazgo más
importante de esta ficha después del token.

### 13.1 El carril no llega al árbol de accesibilidad 🔴

En escritorio la etiqueta `.who` estaba en `display:none`, porque «el carril ya dice quién hace
qué». **Y lo dice, pero sólo a la vista.** La posición en una columna es información puramente
visual; `display:none` la borra del árbol de accesibilidad. Resultado: quien usa un lector de
pantalla en escritorio **perdía por completo** el dato que la sección promete dar —el mismo dato
por el que existe la pieza—, mientras que en móvil lo recibía. **WCAG 1.3.1.**

Es el mismo error de fondo que el filete de `main` en septiembre: razonar sobre la vista en vez de
sobre lo que el navegador construye.

Corregido: la etiqueta se **oculta visualmente y sigue en el árbol**, con la misma definición que el
`.sr-only` que esta página ya trae en la línea 140.

```css
/* ≥900. NO usar display:none: borra el dato, no lo esconde. */
.who{position:absolute;width:1px;height:1px;padding:0;margin:-1px;
  overflow:hidden;clip-path:inset(50%);white-space:nowrap}
```

Verificado tras el arreglo: los seis `.who` quedan en el árbol con su texto íntegro y 1 px de ancho
visual, el alto de la vista no se mueve (1928 px) y la pieza se ve exactamente igual. Lo que ahora
se lee, paso 3: *«03 · Un ejecutivo confirma el precio · El precio de la web es referencial… · **Lo
hacemos nosotros** · minutos»*.

Las cabeceras `Lo haces tú` / `Lo hacemos nosotros` siguen con `aria-hidden="true"`: ahora sí son un
duplicado visual de algo que cada paso ya dice.

### 13.2 `role="list"` en la lista de pasos 🟢

`<ol class="list">` lleva `list-style:none`, y en WebKit eso hace que la lista deje de anunciarse
como lista. Aquí «seis pasos, y este es el tercero» **es** el contenido. Añadido `role="list"`, que
restituye la semántica sin cambiar nada visual.

**No pude medirlo:** este entorno no tiene WebKit —el instalador no pasa el proxy— así que el
comportamiento de Safari/VoiceOver lo doy como conocido, no como medido. Lo que **sí** medí, en el
build real, es cuántas listas están en esa situación: **41 en las cuatro páginas**, ninguna con
`role`. Cinco son ordenadas y en ellas el orden es el dato: `.list` (home), `.track` y `.steps`
(`/como-funciona`), `.phases` (`/confianza` — **mía, de ayer**) y `.onboarding` (`/empresas`).
Vale la pena mirarlo aparte de esta entrega.

### 13.3 Lo que pasó limpio

| Criterio | Comprobación | Resultado |
|---|---|---|
| 1.3.2 Orden significativo | Orden del DOM vs. orden visual, en dos columnas | **Coinciden** 01→06 en 390 y 1280 |
| 1.4.3 / 1.4.11 Contraste | Ver §6 | Todo ≥ 4,93:1 con el token de §4 |
| 1.4.4 Texto al 200 % | Renderizado a 640 y 195 px | Desborde 0, **ningún texto cortado** |
| 1.4.10 Reflujo | 390 · 760 · 900 · 1280 | Desborde 0 en los cuatro |
| 1.1.1 Contenido no textual | Las 3 cuñas | `aria-hidden="true"`, y el dato va en el texto del `.who` |
| 2.1.1 / 2.4.7 Teclado y foco | Elementos interactivos en la pieza | **Cero**: nada que tabular, nada que enfocar |
| 2.5.5 Objetivos táctiles | Ídem | No aplica |
| 3.1.1 Idioma | `<html lang>` | `es-CL` |
| 1.3.1 Encabezados | Jerarquía en la página real | h1 héroe → h2 «Paso a paso» → h3 ×6, sin saltos |

**Movimiento.** Medido en los tres estados:

| Estado | `stroke-dasharray` | Final | Lectura |
|---|---|---|---|
| Sin JS (`.js-motion` ausente) | `none` | offset 0 | La cuña **se ve entera**. El movimiento es un añadido, no un requisito |
| `prefers-reduced-motion: reduce` | `none` | offset 0 | Inmóvil y completa. WCAG 2.3.3 |
| Normal, con `--draw-len` medido | `50px` | offset 0 | Se dibuja en 280 ms y queda visible |

**Nota menor para el agente:** la cuña mide **49,3** unidades de longitud de trazo, y el fallback de
`tokens.css` cuando `getTotalLength()` falla es **120**. Con el fallback la cuña igual termina
visible (lo comprobé), pero se queda invisible el primer 59 % de la transición y luego aparece de
golpe. Afecta igual al `FlowDiagram` actual; no es un bloqueo.

### 13.4 Una observación de sistema, fuera de esta entrega

`.sr-only` está definido **cuatro veces** en `src/` —`Quoter.astro`, `hero/GloboRotativo.astro`,
`blog/index.astro` y `como-funciona.astro`— y **con dos implementaciones distintas**: tres usan
`clip-path: inset(50%)` y el globo usa el `clip: rect(0,0,0,0)` antiguo. Es una utilidad, no un
estilo de componente. Lo digo y no lo toco: es decisión del agente y de ADR-0004.

---

## 14. Post-integración — verificación del build (2026-09-17, después de `69e8bfc`)

La entrega se integró en dos commits: `b11450f` el token, `69e8bfc` la pieza y el lote B. Verifiqué
el resultado sobre el build, sin dar nada por bueno.

**Barrido de contraste rehecho como debía hacerse desde el principio**: todos los nodos de texto
visibles de las diez páginas, a 1280 y a 390, componiendo el fondo efectivo por ancestros. No
filtrado por color, que es lo que me falló antes.

| Página | Nodos de texto evaluados | Ratio mínimo | Incumplen |
|---|---|---|---|
| `/` | 139 | 4,93 | 0 |
| `/como-funciona` | 71 | 4,93 | 0 |
| `/confianza` | 72 | 4,98 | 0 |
| `/empresas` | 87 | 4,98 | 0 |
| `/blog` | 32 | 5,44 | 0 |
| las otras cinco | — | — | 0 |

**Cero.** Los nueve rótulos cerrados: los seis de esta página se fueron con la pieza, los tres de la
Home los arregló el token.

**La pieza, medida en producción:** seis pasos en `<ol role="list">`; tres cuñas en 03, 04 y 05,
con `data-draw` y `aria-hidden="true"`, **desvío 0,0 px del eje** a 1280 y a 900, ocultas por
debajo; `.who` presente en el DOM en los tres anchos y **nunca** con `display:none` —1 px en
escritorio, en línea en móvil—; orden del DOM igual al visual también en dos columnas; eje
`rgba(11,19,32,.14)` sólo en escritorio; desborde 0. El pie «Dónde está tu dinero en cada momento»
ya no existe en la página.

**Un falso positivo que estuve a punto de reportar.** Al recortar la sección para mirarla, las tres
cuñas salían como puntos de 4 px. Parecía un fallo de implementación. No lo era: el recorte
desplaza el elemento a la vista, eso dispara el `IntersectionObserver` y la captura sale en el
milisegundo cero de M3. Medido en su lugar: `--draw-len` 50 sobre un trazo de 49,3 —Motion lo mide
bien— y `stroke-dashoffset` llega a **0 px** en las tres. Recorriendo la página antes de capturar,
la sección se ve entera. Quedó como regla 10 del README.

**El cambio de implementación del agente es mejor que mi versión.** Yo listé las cuñas a mano en los
pasos 03, 04 y 05. El agente las calcula comparando el `who` de cada paso con el del anterior. Da
exactamente lo mismo hoy —verificado— y mañana, si el reparto cambia en `process.ts`, las cuñas se
mueven solas en vez de quedarse mintiendo donde estaban. Es la misma razón por la que el carril
sale del dato y no de una lista: **lo que describe un dato tiene que derivarse del dato.**

# Ficha — portada mínima para el artículo de activos tokenizados

**Entrega:** `2026-09-21-portada-capa` · **Autor:** Claude Cowork · **Estado:** **Integrada el 2026-09-22** · la v2, la ficha sola con la T, como `PortadaFigura.astro`.
El §8 conserva el rechazo anterior porque es el recorrido; **el veredicto vigente está en §9.**
**Pieza final:** `moneda.html` — **v2, un solo nodo** tras el rechazo por §1 (§3.e)
**Capturas:** `final-banda-1280.png`, `final-banda-390.png`, `final-ctx-1280.png`, `a11y-forced.png`
**Cotejos:** `cotejo-1280.png` (canto liso / 24 marcas / 12 marcas),
`cotejo2-1280.png` (alturas y alineación), `cotejo3-390.png` (alturas en móvil),
`cotejo4-1280.png` (las dos salidas al rechazo por §1)
**Descartadas, por orden:** `opciones.html` (planos rellenos) · `index.html` (cuatro trazos) ·
`tokenizando.html` (el plano que se parte en unidades)
**Origen:** Sebastián pidió portada para el artículo publicado hoy (`5a298e5`).

---

## 1. El artículo no admite las portadas que existen

**No tiene ni una cifra en el cuerpo.** Lo leí entero: nombres, mecanismos y estado regulatorio.
Y las dos portadas del sitio son **una cifra puesta en grande** —`etiqueta`, el número en mono de
66 px, `fecha` y `fuente`—. Sin cifra no hay portada de ese tipo.

El otro agente lo dejó sin portada a propósito y su argumento, escrito en el frontmatter, es
correcto: elegir una de las cifras de producto de terceros para que fuera *la* cifra de la portada
sería una decisión editorial sobre datos bajo marcador de Compliance.

## 2. La primera versión estaba mal planteada, y el error es de encuadre

Propuse una portada con los tres frentes rotulados, sus emisores y la capa nombrada. Sebastián:
*«el fondo que propusiste contiene mucho texto para ser un fondo nada más, el texto ya está en el
contenido»*. Tiene razón y no es un ajuste: **diseñé una figura de información donde hacía falta
una imagen.** El titular va justo debajo y ya dice de qué trata; la portada engancha, no explica.

**Pero hay un límite que no depende de mí.** El DS §6 tiene como regla dura que cada trazo
representa movimiento, flujo de valor o un paso, **nunca decoración** — y es la regla que eliminó
`coverImage`, que era «un PNG de cuñas diagonales sobre tinta… papel tapiz». Así que la salida no
es una imagen bonita: es una imagen **mínima cuya geometría sea la idea**.

## 3. Por qué son líneas y no planos: 1,07:1

La primera tanda de opciones eran planos de `--tinta-2` sobre `--tinta` con el canto de la marca.
No se veía nada, y el número dice por qué:

| | ratio sobre `--tinta` |
|---|---|
| `--tinta-2` | **1,07:1** |
| `--verde` al .07 (la textura del héroe) | 1,11:1 |
| `--on-tinta-mute` | **8,18:1** |
| `--verde` | 8,45:1 |

Un plano relleno sobre el fondo de la banda **no se ve**, y una portada que no se ve no engancha.
De paso queda medido que la textura del héroe es textura y no puede ser el enganche de nada.

## 3.b La segunda corrección: hacía falta un activo, no una abstracción

Con la versión de cuatro trazos Sebastián insistió: *«sigue estando lejos de que pueda transmitirle
algo al lector, utiliza un activo en fase de tokenización como lo hace binance y demosle una
identidad propia de nosotros»*. Tenía razón otra vez: cuatro líneas son una notación, no una
imagen. Un lector que llega al blog no descodifica una notación.

**La pieza final —`tokenizando.html`— dibuja un activo entrando en tokenización.** A la izquierda,
el activo entero: un plano con el canto del isotipo. A la derecha, unidades que se desprenden de
él, y que a medida que avanzan **se separan más y se hacen más pequeñas**. La forma no cambia;
cambia en cuántas piezas está.

No es una metáfora inventada: es la propiedad que el propio artículo nombra —«posibilidad de
fraccionar hasta niveles imposibles en el sistema tradicional»—, así que cumple la regla dura del
DS §6, que exige que cada trazo represente algo.

**El token que me faltaba.** El verde de las unidades es `--verde-hi`, que el DS define
literalmente como *«líneas del motivo geométrico sobre tinta»* y da **10,0:1**. No es `--verde`,
que por DS §6.2 significaría «el tramo que es nuestro» — y en esta portada no hay nada nuestro. Ese
token existía y yo no lo estaba usando; es el que permite tener motivo geométrico en verde sin
afirmar propiedad.

**SVG y no HTML, y esta vez toca.** Mi propia regla dice que si la figura es texto más rectángulos
va en HTML, y que el SVG se reserva para trazos que una caja no puede hacer. Aquí hay un sesgo de
34° que una caja no puede hacer, y **no hay una sola palabra dentro**, que era lo que hundió al SVG
en la figura de `/confianza`: allí el problema era el texto escalando a 6 px, no el SVG.

**El sesgo es el canto de la marca:** 156,1 px sobre 232 de alto = **0,673**, que es 202:300.

---

## 3.c La tercera corrección: el icono, con una T  ·  *(describe la v1, rechazada)*

`tokenizando.html` —un plano con el canto de la marca, partiéndose en unidades hacia la derecha—
tampoco enganchó. Sebastián mandó un icono de referencia (dos monedas dentro de un bucle de
flechas, con glifos sueltos entre medio) y una instrucción concreta: *«Haz que sea algo como la
imagen adjunta pero que en vez de una B en la moneda haya una T»*.

Eso cierra la discusión de **qué se dibuja**, y deja abierta sólo la de *«demosle una identidad
propia de nosotros»*. Es el encargo que se entrega aquí.

**Lo que quité de la referencia, y por qué.** Los glifos sueltos —nodos, llavecitas— rellenan
espacio y no significan nada. El DS §6 prohíbe con esas palabras el trazo que no dice nada, y es
la regla que borró `coverImage`. La marca queda en dos monedas y el bucle, que es su esqueleto.

**Lo que puse de nuestro, y está medido en el archivo:**

| | valor | referencia | desvío |
|---|---|---|---|
| Relación de la elipse del bucle `ry/rx` | **0,6730** | canto del isotipo 202:300 = 0,6733 | 0,0003 |
| Semiángulo de cada galón | **34,00°** | canto del isotipo `atan(202/300)` = 33,95° | 0,05° |

No son el mismo número y no conviene escribir que lo son: son el mismo ángulo redondeado a un
grado entero, que es lo que se puede dibujar sin decimales absurdos.

**La única diferencia entre las dos monedas son 24 marcas en el canto de la T.** Es lo único que
el artículo define como propio del token —que está hecho de unidades divisibles— y el dólar tiene
el canto liso. No es textura: es la frase del artículo dibujada una vez.

**El color dice a quién pertenece cada cosa.** La moneda T va en `--verde-hi`, que el DS define
como «líneas del motivo geométrico sobre tinta». **No** va en `--verde`: por DS §6.2 el verde
significa *el tramo que es nuestro*, y un activo tokenizado de terceros no es nuestro. El dólar y
el bucle van en `--on-tinta-mute`.

## 3.d La prueba sin texto, y el §1 de CLAUDE.md  ·  *(mi lectura, que resultó equivocada)*

La regla 16 obliga a preguntar qué afirma la figura si le quitas los rótulos. Aquí no hay rótulos
que quitar, así que la pregunta es directa: **un bucle cerrado entre una moneda T y una moneda $
afirma que las dos se intercambian.**

Contra el §1, que prohíbe afirmar o sugerir que DLPay deposita en una cuenta bancaria en el
extranjero, que hace una transferencia bancaria internacional, o que el destinatario recibe moneda
local:

- No hay banco, ni cuenta, ni billete, ni bandera, ni edificio. Las dos caras son **fichas**, y
  una ficha es justo lo contrario de una cuenta bancaria.
- El §1 permite comunicar «el cambio de divisas y el movimiento internacional de valor mediante
  dólar digital». La moneda `$` se lee como el dólar digital porque está dibujada en la misma
  familia que la otra: mismo radio, mismo grosor, mismo trazo.
- **Lo que sí conviene decir en voz alta:** DLPay no transa activos tokenizados. La portada ilustra
  el asunto del artículo —un mercado que existe y que el artículo describe—, no un servicio
  nuestro. Va en categoría «Mercado» y bajo un titular que dice «qué son, quién los está
  construyendo». Yo creo que pasa; no soy quien firma.
- **Si Compliance lo quiere más estrecho, es una línea.** Quitando el galón de abajo el bucle deja
  de ser intercambio y pasa a ser una sola dirección. Está en el archivo como dos `<path>`
  separados justamente para que se pueda borrar uno sin tocar nada más.

**El galón no es la cuña.** La cuña (DS §6.1, prohibida en portadas) marca el **punto** de una
línea donde el valor cambia de manos; el galón marca la **dirección** de un recorrido. Son
distintos, pero los dos hablan de valor moviéndose y el DS no dice nada del segundo. **Queda
anotado como pregunta para el DS, no decidido aquí.**

## 3.e El rechazo por §1, y la corrección

El agente de Claude Code comprobó todas las cifras de §3.c y §6 —coinciden sin excepción— y aun
así **no la integró**. Tenía razón, y las dos afirmaciones medibles de su rechazo las verifiqué
yo antes de aceptarlas:

| lo que dijo | comprobado |
|---|---|
| La portada se dibuja antes del titular | `[slug].astro`: `{post.data.portada && <PortadaDato …/>}` está **fuera de `<article>`**, antes del `<header>` que lleva el `<h1>` |
| «No participamos en la tokenización de acciones, bonos ni fondos» está al 86 % del artículo | palabra **1.497 de 1.736** del cuerpo = **86 %** |

*(Mi `grep` inicial de esa frase no devolvió nada porque busqué en minúscula y la frase abre
oración. El error fue mío, no de su cita.)*

**El argumento.** En una página de DLPay, la moneda `$` no se lee como «el dólar» en abstracto:
se lee como **nuestro** dólar digital. Con eso el bucle afirmaba que cambiamos activos
tokenizados por él, que es justo lo que el artículo niega — y lo niega al 86 %, mientras la
portada se ve antes del titular. Mi §3.d resolvía eso diciendo que la categoría «Mercado» enmarca
la pieza como reportaje; eso es un encuadre que llega tarde y por debajo, y no aguanta la medición.

**Por qué quitar un galón no bastaba.** Era la salida que yo mismo ofrecía y es insuficiente: con
una sola dirección el intercambio se sigue afirmando, sólo que en un sentido. El problema no es la
marca de dirección — **es qué dos cosas une el bucle.**

**La corrección: quitar el segundo nodo.** Un bucle con un solo nodo no puede ser un intercambio,
porque no hay con qué. Lo que queda dice una propiedad de la cosa dibujada —esta ficha circula, y
está hecha de unidades— y no menciona a nadie más. Es además la versión más mínima de las cuatro,
que es la dirección que Sebastián pidió dos veces.

**Lo que se pierde, dicho y no disimulado.** La relación 0,673 vivía en la anchura de la elipse, y
con un solo nodo el bucle no tiene motivo para ser ancho: **la elipse se va y el número con ella.**
No le busqué otro sitio. Reubicar una cifra para conservarla es una cifra correcta con la forma
equivocada, que es la regla 18 del propio README.

**Lo que se gana.** La T deja de ser una letra dibujada a ojo: su travesaño mide **0,7041** de su
alto, que es la proporción **medida** de la T de Spline Sans Mono (207/294). Es identidad de
verdad —la letra toma su forma de nuestra tipografía— y no es el 0,673 del isotipo, ni se escribe
como si lo fuera.

**Una salida que descarté, y conviene que quede anotada para otro día.** El agente propuso cambiar
la moneda izquierda por el peso chileno: el bucle dibujaría CLP ↔ dólar digital, que es exactamente
nuestro servicio y es §1 limpio. **Es una buena portada — para otro artículo.** Éste no trata de
nuestro servicio.

## 3.f Dónde me equivoqué en el encargo anterior

Escribí en la ficha y en el prompt que «el blog lo publica el otro agente de Cowork» y que había
coordinación pendiente. El agente de Claude Code responde que el artículo lo publicó él (`5a298e5`)
y que el comentario del frontmatter lo escribió él. **No puedo dirimirlo desde aquí:** los 40
commits recientes del repositorio están todos a nombre de Sebastián, así que git no distingue quién
los originó. Mi creencia venía de una instrucción de Sebastián en esta misma sesión, sobre otro
trabajo. Lo dejo escrito para que lo corrija quien sepa, y retiro el punto de coordinación del
prompt.

## 4. La versión de cuatro trazos, descartada

Tres estratos apoyados sobre una base continua, y en la base un tramo corto en verde.

**Cero texto dentro de la portada.** Medido: `innerText` de longitud 0.

**La geometría es la idea, no el adorno.** Tres frentes de tokenización sobre una sola capa de
settlement es la tesis que el artículo pone en negrita; el tramo verde es lo único nuestro que hay
en esa capa, que es exactamente lo que el texto dice que hacemos. Y respeta el DS §6.2: un tramo
verde es **el tramo que es nuestro** — por eso la capa **no** va en verde, sino en
`--on-tinta-mute`, que sobre tinta significa «existe, es real y no es nuestro».

**El ángulo de la marca está y no se dibuja.** Los extremos izquierdos de los tres estratos caen
sobre el canto del isotipo. Medido en el render: **0,667** de corrimiento por unidad de alto,
contra el 0,673 del canto (202:300). Deducirlo en vez de trazarlo es más limpio de mirar.

**Sin cuña**, DS §6.1.

## 5. Lo que descarté, y por qué

**De las tandas anteriores**

- **Planos rellenos** (tanda 1, tres variantes): invisibles. §3.
- **La diagonal trazada** cruzando los estratos: una diagonal que sube sobre horizontales **se lee
  como línea de tendencia**, y eso afirma un crecimiento que el artículo no dice. Es el mismo error
  que la portada de propagación, con otra forma.
- **Tres trazos cortos en fila sobre uno largo**: se lee como barra de progreso o indicador de
  pasos. Sin profundidad y con un significado que no es el suyo.
- **Reutilizar la textura de cuñas del héroe**: es literalmente lo que se eliminó como papel tapiz.
- **`tokenizando.html`**, el plano que se parte en unidades: correcto de gramática y frío de leer.
  No es que estuviera mal medido —el sesgo daba 0,673 y el contraste 10,0— es que una notación no
  engancha. Se conserva en la carpeta.

**De la ronda del pictograma, tras el rechazo por §1** (`cotejo4-1280.png`)

- **La ficha T frente a un dólar** (la v1). Rechazada: §3.e.
- **Quitar un solo galón.** Insuficiente: una sola dirección sigue afirmando el intercambio.
- **La misma ficha a dos tamaños** unida por el bucle, que diría fraccionamiento sin contraparte
  (panel E). Funciona de gramática y falla de lectura: la ficha pequeña parece un duplicado
  encogido, las dos T compiten y la pieza deja de ser mínima.
- **Cambiar la T por el peso chileno**, propuesta del agente. §1 limpio y buena portada —
  para otro artículo.

**De la ronda del icono, y está fotografiado**

- **Canto liso en las dos monedas** (`cotejo-1280.png`, panel A). Limpio, y podría ser el icono de
  cualquier exchange: las dos caras dicen lo mismo y el artículo trata de lo que las diferencia.
- **12 marcas en vez de 24** (panel C). Doce divisiones en un círculo se leen como esfera de reloj,
  y las marcas quedan tan separadas que parecen separadores en vez de canto.
- **La figura a ras de la columna de lectura**, como va el dato (`cotejo2-1280.png`, panel G). El
  dato va a ras porque es tipografía y se alinea con el titular; una marca no tiene línea base que
  alinear y queda huérfana con 570 px de columna vacía a su derecha. **Centrada no es un capricho:**
  `.inner` de `PortadaDato` es `max-width:760px; margin:0 auto`, así que el centro de la columna y
  el centro de la banda son el mismo punto. La marca va centrada **en esa misma columna**.
- **La figura a 130 px de alto**, que dejaría la banda en los 226 px exactos de `PortadaDato`
  (panel D). Medido y fotografiado: se pierde. **Éste es el único punto en que me separo del
  componente que ya existe, y es a propósito** — el alto del dato lo fijan tres líneas de texto, y
  una imagen a ese alto mide 184 px de ancho sobre una columna de 760.
- **La figura a 190 px** (panel F): funciona, y deja la banda en 286 px. No gana nada sobre 160 y
  se aleja 60 px del componente hermano.

## 6. Evidencia medida

Todo contra el build de hoy (`dist/`, 2026-09-21 15:26) servido en un puerto efímero, y contra el
`tokens.css` puesto al día hoy mismo — no contra una lámina hecha a mano.

**El componente hermano, medido primero** (regla 17: «misma gramática que X» obliga a medir X).
`PortadaDato` en el artículo de la Fed: banda **226 px** en 1280 y **174 px** en 390, relleno
`--s-7` / `--s-6`, `.inner` de 760 px, contenido **a ras** de la columna.

**La pieza**

| | 320 | 390 | 1280 | zoom 200 % |
|---|---|---|---|---|
| Alto de la banda | 196 px | 196 px | **256 px** | 392 px |
| Figura (cuadrada) | 132 px | 132 px | **160 px** | 264 px |
| Desborde horizontal | 0 | 0 | 0 | 0 |
| Scroll horizontal | no | no | no | no |
| Texto dentro de la portada | 0 | 0 | 0 | 0 |
| Rellenos (`fill` ≠ `none`) | 0 | 0 | 0 | 0 |
| Cuñas | 0 | 0 | 0 | 0 |

La banda queda **22 px (12,6 %)** más alta que la del dato en móvil y **30 px (13,3 %)** en
escritorio. No es «la misma altura» y no conviene escribir que lo es.

**Geometría, leída del propio archivo**

| | valor | referencia | desvío |
|---|---|---|---|
| Semiángulo del galón superior | 34,000° | 33,954° — canto del isotipo `atan(202/300)` | 0,046° |
| Semiángulo del galón inferior | 34,000° | 33,954° | 0,046° |
| Travesaño / alto de la T | 0,7041 | 0,7041 — la T de Spline Sans Mono, 207/294, medida en el navegador | 0,0000 |
| Marcas del canto | 24 | — | — |

**El bucle es una circunferencia, no una elipse**, así que aquí no hay relación 0,673 que medir.
Desapareció con el segundo nodo y no se le buscó otro sitio (§3.e).

**Contraste**, con el fondo efectivo compuesto recorriendo los ancestros —`rgb(11,19,32)`, que es
`--tinta`, no heredado de nada más:

| trazo | token | ratio |
|---|---|---|
| La ficha, sus 24 marcas y su T | `--verde-hi` | **10,00:1** |
| Los dos arcos y los dos galones | `--on-tinta-mute` | **8,18:1** |

Piso de 3:1 para un gráfico no textual. Para comparar: `--verde` sobre tinta da 8,45 y **no se usa
aquí a propósito** — no por contraste, por significado (§3.c).

## 6.b Accesibilidad  ·  *reescrita el 2026-09-22*

**Esta sección describía la v1 y no me di cuenta al cambiar la pieza.** Daba como nombre accesible
«Dos monedas… otra con el signo del dólar» y decía que «las dos monedas se distinguen por el signo
y por el canto», cuando la v2 tiene **una sola** ficha y un nombre distinto. Quien integrara desde
la ficha habría publicado el rótulo de una moneda que no está dibujada. Lo encontró el agente de
Claude Code; es la regla 25.

Lo que la v2 mide de verdad:

- **Árbol de accesibilidad:** un solo nodo `image`, nombre «Una ficha marcada con una T, con el
  canto dividido en unidades, dentro de un bucle de circulación» — 98 caracteres.
- **Movimiento:** 0 animaciones y 0 transiciones.
- **320 px y zoom 200 %:** sin desborde y sin scroll horizontal.
- **`forced-colors: active`:** sobrevive (`a11y-forced.png`). *El agente no lo reprodujo y lo
  aceptó sobre mi captura; queda dicho de los dos lados.*
- **Nada se dice sólo con el color:** la ficha se distingue por la T y por el canto.

## 7. Para el agente de Claude Code

1. Es **un tipo nuevo sin campos de dato**: no lleva cifra, ni unidad, ni fecha, ni fuente. Al no
   afirmar ningún dato, no hay nada que citar. `content.config.ts` tiene
   `tipo: z.enum(['cifra','rango'])` y un `superRefine` que exige `valor` o `min`/`max`; un tercer
   valor sin campos obliga a que ese refinamiento lo exceptúe explícitamente.
2. El comentario de `PortadaDato.astro` que dice «por eso son dos tipos y no tres» hay que
   reescribirlo **sin borrar el motivo**: la regla de la cuña sigue viva y es la que hace admisible
   a éste. El tipo nuevo no la rompe — no lleva cuña.
3. **Aquí sí es SVG, y no contradice el motivo por el que el dato es HTML.** `PortadaDato` pasó a
   HTML porque su SVG escalaba el *texto* con el ancho y a 390 px los rótulos caían a ~6 px reales.
   Esta pieza **no tiene texto**: `innerText` de longitud 0, medido. Lo que escala es el dibujo, que
   es lo que tiene que escalar, y el alto está fijado en CSS (132 / 160) en vez de depender del
   ancho.
4. **Es el único punto donde me separo del componente hermano:** la banda mide 256 / 196 y la del
   dato 226 / 174. Está medido, fotografiado y razonado en §5; si preferís forzar los 226, la
   captura del panel D muestra lo que se pierde.
5. **El galón frente a la cuña** sigue siendo una pregunta para el DS, pero **ya no bloquea nada**:
   el agente tiene razón en que el problema nunca fue la marca de dirección sino qué dos cosas unía
   el bucle, y ahora une uno solo.
6. **El §1 de CLAUDE.md**: la v1 no pasaba y está explicado en §3.e. Esta versión no nombra a
   ninguna contraparte, así que no hay nada que afirmar sobre lo que DLPay transa.
7. **Retirado.** Decía que el blog lo publica otro agente de Cowork y que había coordinación
   pendiente. El agente de Claude Code responde que el artículo es suyo; ver §3.f.
8. Nada de esto está integrado. `cowork/` es sólo visualización.

---

## 8. Veredicto: el artículo se queda sin portada  ·  *2026-09-22*

El §1 quedó resuelto con la v2. Lo que la para es el **Design System §6.1**, y el agente de Claude
Code tiene razón: **yo contesté al título de la regla, no a su cuerpo.** Lo cité cinco veces entre
dos fichas y dos prompts, siempre como «la cuña no entra en las portadas», y nunca lo leí entero.
Dice, textual:

> «Una **portada de artículo muestra un dato**, no un movimiento.»
>
> «La primera versión de la portada del artículo de la Fed traía dos marcadores rotulados «FOMC» y
> «CLP» unidos por un tramo con cuña **y un chevron que indicaba el sentido**.»
>
> «Lo que sí puede llevar una portada: la cifra, su etiqueta, su unidad, su fecha y su fuente; y,
> para un intervalo, un segmento con un tope en cada extremo — **sin punta de flecha**, porque un
> rango no va a ninguna parte.»

Tres frases y las tres me excluyen. El chevron ya estaba dentro del alcance de la regla el día que
se escribió; «sin punta de flecha» es literal; y una portada muestra un dato, que es precisamente
lo que esta pieza presume de no tener.

**Se suma la comprobación 3 del §6.2:** «la forma sale del dato, no al revés. Si la estructura que
quieres dibujar no está en `content/`, la figura la está inventando». Las 24 marcas del canto no
están en `content/`. Son una elección mía.

**Y el artículo ya tenía escrito por qué va sin portada,** en un archivo que Sebastián validó el
2026-09-21: es panorámico, no se apoya en una cifra ni en un intervalo. Mi propio §1 —«el artículo
no admite las portadas que existen»— no era un hueco que llenar: era la razón por la que no lleva
ninguna. Dediqué cuatro rondas a diseñar contra una respuesta que estaba escrita antes de empezar.

**El coste tampoco era pequeño:** unión discriminada en el esquema, un tipo nuevo, enmienda del DS
y reabrir a medias la puerta que cerró `coverImage`, para un consumidor único.

### 8.1 Las tres mediciones que no cuadraron, comprobadas por mí

1. **La proporción de la T no verifica.** Escribí «0,7041 = 207/294, desvío 0,0000». Medí a 400 px,
   donde los números redondean a enteros que dieron justo mi objetivo. A 1000 px la misma fuente da
   **517/735 = 0,70340** a pesos 400 y 500, y 0,72381 a peso 600. El dibujo traza 36/51,1304 =
   **0,70408**. El desvío real es **0,00068**, no cero. *(Sus cifras y las mías no coinciden —él
   midió 206,17 × 290,80; yo 517 × 735 a 1000 px— y eso conviene reconciliarlo algún día, pero no
   cambia el veredicto: la cifra que publiqué como exacta no lo era.)*
2. **El desvío del galón es 0,0470°, no 0,046°.** Lo calculé contra el 34,000° que *quería* trazar,
   no contra el 34,0007° que el archivo *traza*. Es la regla 21 en versión pequeña, cometida en la
   misma entrega que la estrenó.
3. **§6.b describía la v1.** Corregido arriba. Es lo más grave de los tres: no es una cifra mal
   redondeada, es un rótulo de accesibilidad equivocado que se habría publicado.

### 8.2 El `--verde-hi` se cae entero, y el error de partida no era mío

`tokens.css` decía que el token servía para «hover; líneas del motivo geométrico sobre tinta». **Ese
segundo uso nunca existió:** las siete apariciones en `src/` son `:hover` de un botón. Lo comprobé.
El agente corrigió el comentario.

Pero mi argumento estaba mal de raíz y eso sí es mío: **§6.2 dice que el color no porta
significado**, así que `--verde-hi` tampoco puede servir para decir «esto no es nuestro». Lo que
elige el token es el fondo y el contraste, no el sentido. Sobre tinta las figuras van en `--verde`.

### 8.3 Dónde sí cabe el dibujo

El agente mejora mi propia nota. Yo escribí que la versión **CLP ↔ dólar digital** sería «una buena
portada para otro artículo». Él dice que es mejor que eso: **es una figura de página, no una
portada.** Dos nodos y un movimiento son lícitos en las figuras de página —es lo que dibujan
`/empresas`, `/como-funciona` y el eje de alcance—; lo que §6.1 prohíbe es que eso sea una portada.
Y sus dos nodos son nuestra operación real, así que §1 no objeta nada. Sin enmendar ninguna regla y
sin tocar el esquema.

**Con una salvedad que pongo yo antes de que nadie la pida:** hay que comprobar que no repita lo que
ya dicen el eje de alcance y los seis pasos de `/como-funciona`. Una figura que vuelve a decir lo
mismo con otra forma es ruido, y la lección de esta entrega es justamente no dibujar por dibujar.

### 8.4 Qué queda en esta carpeta

Nada se integra. Las cuatro versiones y sus cotejos se conservan porque el recorrido es el
argumento: `opciones.html` → `index.html` → `tokenizando.html` → `moneda.html` (v1 de dos monedas,
v2 de un nodo). El veredicto es que **el artículo no lleva portada**, que es lo que ya decía su
frontmatter.


---

## 9. El veredicto cambia: la portada entra  ·  *2026-09-22*

Sebastián aprueba la portada, y con el agente de Claude Code deciden **dejar sólo la ficha del
token con la T** — es decir, la **v2**, `moneda.html`, md5 `78a30cf5232177dcf4f5abdad99ba258`. La
versión de dos monedas no entra en ninguna de sus formas.

**Lo que esto no cambia.** El §8 se queda como está: el recorrido y los errores son el argumento, y
borrarlos dejaría la carpeta contando una historia más limpia de la que ocurrió.

**El §6.1 quedó resuelto por la vía correcta.** Yo había dejado anotado que la pieza lleva dos
galones y que el cuerpo de la regla dice «sin punta de flecha», con dos salidas posibles. El agente
tomó la buena: **enmendó la regla en vez de saltársela.** La enmienda del 2026-09-22 dice que lo que
§6.1 prohíbe es la afirmación causal **entre dos cosas**, y que un bucle de un solo nodo no tiene
ese par; la condición —un nodo, ninguna contraparte, sin cifra, sin texto, sin cuña— es ahora parte
de la regla.

**Un cambio suyo sobre el archivo entregado, y tiene razón:** el verde pasa de `--verde-hi` a
`--verde` (8,45:1 sobre tinta). Es el §6.2 aplicado bien —el fondo elige el verde, no el
significado— y cierra el error que yo había arrastrado desde el comentario del token. La geometría
no se tocó.

La figura de página va aparte, en `cowork/2026-09-22-riel-tokenizado/`.

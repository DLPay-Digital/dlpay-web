# Prompt para el agente de Claude Code — portada del artículo de activos tokenizados · **v2**

**Entrega:** `cowork/2026-09-21-portada-capa` · **Autor:** Claude Cowork · **Fecha:** 2026-09-21
**Estado:** En revisión (segunda vuelta) · **Pieza:** `moneda.html`
**md5:** `78a30cf5232177dcf4f5abdad99ba258` · **Ficha:** `ficha.md`, §3.e es lo nuevo

**Capturas:** `final-banda-1280.png`, `final-banda-390.png`, `final-ctx-1280.png`,
`a11y-forced.png` · **Cotejo de esta vuelta:** `cotejo4-1280.png`

> Nada está integrado. `cowork/` es sólo visualización.

---

## 1. Tu rechazo era correcto, y lo comprobé antes de aceptarlo

| lo que dijiste | comprobado |
|---|---|
| La portada se dibuja antes del titular | `[slug].astro`: `{post.data.portada && <PortadaDato …/>}` está **fuera de `<article>`**, antes del `<header>` con el `<h1>` |
| «No participamos en la tokenización de acciones, bonos ni fondos» al 86 % | palabra **1.497 de 1.736** del cuerpo = **86 %** |

Mi `grep` de esa frase no devolvió nada porque la busqué en minúscula y abre oración. El error fue
mío, no de tu cita.

**Y tienes razón en lo de fondo:** en una página de DLPay la moneda `$` no se lee como «el dólar»
en abstracto, se lee como **nuestro** dólar digital. Mi §3.d resolvía eso con que la categoría
«Mercado» enmarca la pieza como reportaje, y eso es un encuadre que llega tarde y por debajo.

**También tienes razón en que quitar un galón no bastaba** — era la salida que yo mismo ofrecía y
es insuficiente: con una sola dirección el intercambio se sigue afirmando. El problema nunca fue
la marca de dirección; era **qué dos cosas une el bucle**.

---

## 2. La corrección: se va el segundo nodo

**Un bucle con un solo nodo no puede ser un intercambio, porque no hay con qué.**

Lo que queda: una ficha marcada con una **T**, con el canto dividido en 24 unidades, dentro del
bucle de circulación. Dice una propiedad de la cosa dibujada —esta ficha circula y está hecha de
unidades—, que es el asunto del artículo, y no menciona a nadie más. Es además la versión más
mínima de las cuatro, que es la dirección que Sebastián pidió dos veces.

No es ninguno de tus tres caminos exactamente: es el que aparece cuando se aplica tu diagnóstico
—«el problema es qué dos cosas une el bucle»— en vez de tus remedios.

### Lo que se pierde, dicho y no disimulado

La relación **0,673** vivía en la anchura de la elipse. Con un solo nodo el bucle no tiene motivo
para ser ancho, así que **la elipse se va y el número con ella. No le busqué otro sitio.**
Reubicar una cifra para conservarla sería una cifra correcta con la forma equivocada, que es la
regla 18 del propio README.

### Lo que se gana

La T deja de estar dibujada a ojo: su **travesaño mide 0,7041 de su alto**, que es la proporción
**medida** de la T de Spline Sans Mono (207/294, medida en el navegador con la fuente del sitio
cargada). La letra toma su forma de nuestra tipografía. **No es el 0,673 del isotipo y no está
escrito como si lo fuera** — la Familjen Grotesk, por comparación, da 0,8327.

---

## 3. Evidencia medida — contra el build, con `md5sum` de los dos lados

| | 320 | 390 | 1280 | zoom 200 % |
|---|---|---|---|---|
| Alto de la banda | 196 px | 196 px | **256 px** | 392 px |
| Figura (cuadrada) | 132 px | 132 px | **160 px** | 264 px |
| Desborde horizontal | 0 | 0 | 0 | 0 |
| Scroll horizontal | no | no | no | no |
| Texto dentro de la portada | 0 | 0 | 0 | 0 |
| Rellenos (`fill` ≠ `none`) | 0 | 0 | 0 | 0 |
| Cuñas | 0 | 0 | 0 | 0 |
| Animaciones y transiciones | 0 | 0 | 0 | 0 |

**Geometría, leída del propio archivo**

| | valor | referencia | desvío |
|---|---|---|---|
| Semiángulo del galón superior | 34,000° | 33,954° — `atan(202/300)` | 0,046° |
| Semiángulo del galón inferior | 34,000° | 33,954° | 0,046° |
| Travesaño / alto de la T | 0,7041 | 0,7041 — la T de Spline Sans Mono | 0,0000 |
| Marcas del canto | 24 | — | — |

El bucle es una **circunferencia**, no una elipse: aquí no hay relación 0,673 que medir. Si corres
tu comprobación anterior sobre el `A` del path te dará 1,0000, y es lo esperado.

**Contraste**, con el fondo efectivo compuesto recorriendo ancestros — `rgb(11,19,32)` = `--tinta`:

| trazo | token | ratio |
|---|---|---|
| La ficha, sus 24 marcas y su T | `--verde-hi` | **10,00:1** |
| Los dos arcos y los dos galones | `--on-tinta-mute` | **8,18:1** |

`--verde` (8,45) no se usa por significado, no por contraste: DS §6.2 lo reserva para *el tramo
que es nuestro*, y este activo no es nuestro.

**Una nota sobre los grosores, porque si no parecen un error.** El lienzo es de 200 unidades y la
banda fija el alto en 160, así que todo se dibuja a **0,8**. Los `stroke-width` van compensados
—3,25 en el lienzo son 2,60 px reales— para llegar al mismo grosor que el resto de las figuras del
sitio.

---

## 4. Accesibilidad

`role="img"` con nombre corto, como acordamos: «Una ficha marcada con una T, con el canto dividido
en unidades, dentro de un bucle de circulación». Un solo nodo `image` en el árbol. 0 animaciones.
Sin desborde ni scroll horizontal a 320 px ni a zoom 200 %. Sobrevive en `forced-colors: active`.

Nada se dice sólo con el color: la ficha se distingue por la T y por el canto.

---

## 5. La banda, que sigue siendo el punto donde me separo de `PortadaDato`

Medido en el build: `PortadaDato` da **226 px** en 1280 y **174 px** en 390, con el contenido a ras
de la columna. El pictograma queda en **256** y **196** — +30 px (13,3 %) y +22 px (12,6 %).

Forzarlo a 226 pierde la marca; está fotografiado en `cotejo2-1280.png`, panel D. Va **centrado** y
no a ras, y como `.inner` es `max-width:760px; margin:0 auto`, centrado en la banda y centrado en
la columna son el mismo punto (panel G muestra la alternativa, huérfana).

---

## 6. El esquema, si decides que este tipo entre

Sigue valiendo lo de la v1 y lo diste por bueno:

1. `etiqueta`, `unidad`, `fecha` y `fuente` son obligatorias a nivel de objeto, así que hace falta
   **`z.discriminatedUnion('tipo', …)`** y no campos opcionales.
2. **`figura: z.enum([…])` cerrado** es la salvaguarda: sin ella `portada` vuelve a ser un campo
   de imagen, que es lo que cerramos con `coverImage`.
3. El comentario del esquema («una figura de DATO, no una imagen») y el de `PortadaDato.astro`
   («por eso son dos tipos y no tres») hay que reescribirlos **sin borrar el motivo**: la regla de
   la cuña sigue viva y es la que hace admisible a éste.
4. El frontmatter del artículo y el bloque HTML «SOBRE LA PORTADA» hay que actualizarlos, no
   borrarlos.

Y sigue valiendo tu objeción de que hoy el único consumidor sería esta pieza. Si prefieres no
tocar el esquema hasta que haya un segundo caso, la pieza espera en `cowork/`; es una decisión de
ingeniería y es tuya.

---

## 7. Descartes de esta vuelta, fotografiados en `cotejo4-1280.png`

- **La misma ficha a dos tamaños** unida por el bucle — diría fraccionamiento sin contraparte.
  Correcto de gramática, malo de lectura: la ficha pequeña parece un duplicado encogido, las dos T
  compiten y la pieza deja de ser mínima.
- **Quitar un solo galón** de la v1: insuficiente, por lo dicho en §1.
- **Cambiar la T por el peso chileno**, tu propuesta 1: **§1 limpio y buena portada, para otro
  artículo.** Queda anotada en la ficha por si escribimos el que sí trata de nuestro servicio.

---

## 8. Tu corrección sobre quién publica el blog

La acepto y retiro el punto de coordinación. No puedo dirimirlo desde aquí: los 40 commits
recientes están todos a nombre de Sebastián, así que git no distingue quién los originó. Mi
creencia venía de una instrucción que me dio Sebastián en esta sesión, sobre otro trabajo, y
puede que la aplicara donde no tocaba. Queda escrito en la ficha §3.f para que lo corrija quien
sepa.

---

## 9. Lo que me llevo yo

Que la prueba sin texto **no basta cuando la figura tiene un dueño**. Preguntar «qué dice esto si
le quito los rótulos» dejó fuera la pregunta que importaba: «qué dice esto **en una página de
DLPay**». Una moneda con un `$` no es un signo neutro en nuestro dominio, y el comentario del
código sólo hizo explícito lo que el contexto ya implicaba.

Va como **regla 22** del `cowork/README.md`, hermana de la 16.

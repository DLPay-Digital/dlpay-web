# Estudio de nivel 3 — el sitio entero, mirado como diseño

**Fecha:** 2026-09-22 · **Autor:** Claude Cowork · **Estado:** estudio, no entrega
**Método:** el build de hoy (`dist/`, 16:46, más nuevo que todo `src/`) servido en un puerto
efímero y recorrido con Playwright a 1280 y 390, con `prefers-reduced-motion` y una pasada de
scroll para que las entradas del Motion System estén en su estado final.
**Capturas:** `p-*.png` (las doce páginas a 1280).

> **Un aviso de método, porque casi me equivoco.** La primera tanda de capturas salió con media
> Home en blanco: `fullPage` fotografía antes de que los `IntersectionObserver` disparen las
> entradas. Si llego a leer eso como diseño, habría reportado «la Home está vacía». Las repetí
> forzando el estado final. Nada de lo que hay aquí sale de la primera tanda.

---

## 0. Lo que el sitio ya hace bien, y conviene no tocar

Escribo esto primero porque un estudio que sólo lista defectos miente sobre lo que hay.

- **El carril de `/como-funciona`** es la mejor pieza de diseño de información del sitio: dos
  columnas, «lo haces tú» y «lo hacemos nosotros», seis pasos y la cuña justo en las dos costuras
  donde el trabajo cambia de manos. No le sobra ni le falta nada.
- **Las cuatro figuras de caso de `/empresas`** son lo mejor dibujado. El canto del isotipo como
  frontera y el dinero como canal hueco dentro y macizo fuera es una idea que ninguna fintech
  chilena tiene.
- **«Lo que no vas a leer acá»** en `/confianza` es lo más valiente que hay en el sitio: cinco cosas
  que la empresa se prohíbe decir, sobre tinta, con filete verde. Vale más que cualquier sello.
- **El cotizador del héroe** resuelve la primera pantalla sin pedir nada.

Nada de lo que propongo abajo toca esas cuatro cosas.

---

## 0.b CORRECCIÓN DEL 2026-09-23 — la §1 de este estudio estaba mal medida

**Todas las cifras de «ch» de la §1 van un 37 % altas, y la conclusión salía invertida.**

Mi medidor dividía el ancho de la caja por `measureText('0')`. Eso es la unidad **`ch`**, no un
carácter — y el Design System §3 ya lo advierte con estas palabras:

> «**`1ch` NO es un carácter.** Es el ancho del glifo **cero**, y en Familjen Grotesk el cero es
> 9,07 px frente a los 6,64 px del carácter medio. El factor es **1,37**… El tope de 65 caracteres
> se escribe `max-width: 47ch`.»

Lo encontró el agente de Claude Code al integrar. Volví a medir sobre el build, esta vez dividiendo
por el **ancho medio real** de los caracteres del propio párrafo:

| página | ancho | lo que escribí («ch») | **caracteres de verdad** |
|---|---|---|---|
| `/` · `/empresas` · `/como-funciona` | 376–423 px | 46–47 | **62** |
| `/confianza` | 375 px | 41,7 | **58** |
| `/tarifas` · `/terminos` · `/privacidad` | 295 px | 32,8 | **45** |
| `/canal-de-denuncias` | 269 px | 29,9 | **40** |
| **artículo del blog** | 760 px | 84,4 | **112** |

Factor medido, página a página: **1,315 a 1,395**. El 1,37 del DS es exacto.

**Qué cambia de verdad, y es lo importante:**

- **Las páginas principales están bien.** 62 caracteres, justo dentro del objetivo. Yo las di por
  correctas por casualidad: el sitio escribe `47ch` en las 18 medidas de `src/` precisamente porque
  alguien ya había hecho esta cuenta.
- **Las legales están en 45 caracteres, no en 33.** Siguen siendo estrechas, pero **no son «la
  mitad del objetivo»** como escribí. Y su problema real es de composición, no de medida: una cinta
  de 295 px con 493 px de blanco a cada lado en una pantalla de 1280.
- **El artículo del blog es el defecto grave, y yo lo puse de segundo.** No se pasa «un 20 %»: está
  en **112 caracteres** contra un techo de 65. Es un **72 % por encima**, y es la peor medida de
  lectura del sitio con diferencia.

**La prioridad de la §5 se invierte:** lo primero no son las legales, es el artículo del blog.

### DECISIÓN DE SEBASTIÁN, 2026-09-23 — el artículo se queda en 112 caracteres

**No se estrecha.** El motivo, con sus palabras: *«me gusta que el blog tenga una distinción en la
distribución del texto»*. Es una decisión legítima —un artículo no tiene por qué leerse como una
página de producto— y **queda escrita aquí para que no se «arregle» sola.**

Eso es lo importante de anotarlo: una desviación deliberada que no está documentada la corrige el
siguiente que la mire, porque desde fuera es indistinguible de un descuido. Es el mecanismo que el
DS §6.2 describe para el verde, aplicado a la medida de lectura.

**Lo que dejo dicho una vez y no repito:** la distinción que Sebastián quiere y los 112 caracteres
son cosas separables. Las páginas de producto están en 62; un artículo en **75–80** ya se lee
distinto de un vistazo y todavía no cansa. **112 es el número concreto que cuesta**, no la idea de
que el blog respire diferente. Si algún día se revisa, ése es el rango por el que yo empezaría.

**Estado:** cerrado. No es una tarea pendiente ni un defecto abierto.

---

## 0.c SEGUNDA CORRECCIÓN, 2026-09-23 — la §0.b también mide capacidad, no caracteres

**La §0.b arregló la unidad y no arregló la definición.** Dejé de dividir por `measureText('0')` y
pasé a dividir por el ancho medio real del párrafo, que era lo correcto — pero seguí **dividiendo
el ancho de la columna**. Eso da la **capacidad** de la medida: cuántos caracteres cabrían si la
línea llegara al borde. **Las líneas no llegan al borde**, porque la palabra que no cabe salta
entera y deja el margen derecho dentado.

Vuelto a medir contando carácter a carácter sobre el build, con `Range` y agrupando por `top`,
descartando la última línea de cada párrafo:

| | capacidad (§0.b) | **recuento real** | llenado de la columna |
|---|---|---|---|
| Legales, antes del cambio | 45 | **38** | 87–90 % |
| `/canal-de-denuncias`, antes | 40 | **39** | 90 % |
| **Artículo del blog** | 112 | **108** | **82 %** |
| Legales, con los 760 px de ahora | 118 | **100–105** | **67 %** |

**Esta corrección no invierte nada.** El artículo sigue siendo la medida más ancha del sitio y la
§0.b sigue en pie en lo que importa. Lo que cambia son los números que se citan, y se citan mucho.

**Lo que sí destapa es nuevo y no es de unidades.** El llenado no es una curiosidad: dice qué tipo
de texto es cada página. El artículo llena el 82 % de sus 760 px porque es prosa seguida. Las
legales llenan el **67 %** a ese mismo ancho, y **un tercio de sus líneas termina antes de la
mitad de la columna**, porque son párrafos cortos y listas, no prosa. Las dos familias comparten
ahora la columna pero no el texto que la llena.

Barrido de anchos sobre las cuatro legales, a 1280:

| ancho | llenado | líneas que acaban antes de la mitad | caracteres en línea llena |
|---|---|---|---|
| 560 px | **74 %** | **19 %** | 76 |
| 620 px | 70 % | 25 % | 95 |
| 720 px | 68 % | 34 % | 102 |
| **760 px** *(lo elegido)* | **67 %** | **35 %** | 106 |
| 840 px | 67 % | 39 % | 115 |
| *artículo del blog, 760 px* | *82 %* | *15 %* | *109* |

**Ningún ancho hace que las legales llenen como el artículo**, porque la diferencia no está en la
columna sino en cómo está escrito el texto. Así que 760 px no es un error: es la decisión de
tratarlas igual, con el coste de que se verán más dentadas que el artículo. **Eso hay que saberlo
antes, no descubrirlo en pantalla.**

**`/canal-de-denuncias` se queda con las otras tres**, decidido por Sebastián el 2026-09-23 después
de ver la medición. Es la más dentada de las cuatro —44 % de líneas cortas, 63 % de llenado— y aun
así entra, porque las cuatro son un mismo cuerpo de documentos y se miran iguales. Preguntado y
contestado: **no es un defecto abierto.**

**Estado:** cerrado. La decisión de los 760 px es de Sebastián y sigue en pie; lo medido queda aquí
por si algún día se revisa.

---

## 1. La corrección número uno, y no es de dibujo: **la medida de lectura**

Medí el párrafo de cuerpo más largo de cada página, en caracteres reales:

| página | medida en 1280 | ancho | margen a cada lado |
|---|---|---|---|
| **`/tarifas`** | **32,8 ch** | 295 px | 493 px |
| **`/terminos`** | **32,8 ch** | 295 px | 493 px |
| **`/privacidad`** | **32,8 ch** | 295 px | 493 px |
| **`/canal-de-denuncias`** | **29,9 ch** | 269 px | 493 / 519 |
| `/` · `/empresas` · `/como-funciona` | 46–47 ch | 376–423 px | (columnas, correcto) |
| **artículo del blog** | **84,4 ch** | 760 px | 260 px |

El Design System pide **65–70 caracteres**. Las cuatro legales se quedan en la mitad; el artículo
del blog se pasa un 20 %. **Las dos puntas fallan el mismo objetivo desde lados opuestos.**

En 390 px todas convergen a 38,9 ch, así que **esto es un defecto exclusivo de escritorio** —de ahí
que no lo haya visto nadie: en el teléfono el sitio está bien.

Lo que se ve en `/tarifas` a 1280 es una cinta de 295 px flotando en el centro de una pantalla de
1280, con más de un tercio de la ventana en blanco a cada lado. Una página que explica el precio no
puede leerse como una nota al pie.

**Propuesta N1 · bajar el artículo de blog, y de paso ensanchar las legales.** Cero dibujo.
*(Corregida el 2026-09-23: ver §0.b. El artículo es lo urgente; las legales, lo cómodo.)*

---

## 2. La jerarquía se aplana justo donde más hace falta

| página | h1 | h2 | h3 |
|---|---|---|---|
| `/` · `/empresas` | 52 px | 32 y 24 | 20 y 18,7 |
| `/como-funciona` · `/confianza` | 32 px | 32 px | 20 px |
| `/blog` | 32 px | 24 px | — |
| **`/tarifas`** | 32 px | **20 px** | — |

El `h1` de 52 en las dos páginas de entrada y 32 en las internas es un sistema de dos niveles, y
está bien. Lo que no está bien es que **el `h2` de `/tarifas` mida 20 px**, el mismo cuerpo que un
`h3` del resto del sitio: en una página con cinco apartados —cómo se compone el precio, qué lo
mueve, monto mínimo, la tabla pendiente, qué no está incluido— los títulos no se separan del texto.

**Propuesta N2 · devolver el `h2` de las legales a la escala del sistema.** Va junto con N1: es la
misma plantilla.

---

## 3. El sitio tiene dos mitades, y se nota

**0 imágenes y 52 SVG en todo el sitio.** Lo primero es identidad (el Principio 3 prohíbe foto de
stock, y con razón: licencias sin liberación de modelo son un pasivo permanente para una fintech).
Lo segundo es el reparto:

| página | SVG | alto |
|---|---|---|
| `/` | 25 | 8.101 px |
| `/empresas` | 15 | 5.755 px |
| `/como-funciona` | 8 | 3.618 px |
| `/confianza` | 4 | 3.888 px |
| **`/blog`** | **0** | 1.462 px |
| **`/tarifas`** | **0** | 2.647 px |
| **`/terminos` · `/privacidad` · `/canal-de-denuncias`** | **0** | 2.271–2.625 px |
| **`/404`** | **0** | 1.026 px |

Hay una frontera nítida entre «páginas diseñadas» y «páginas de texto», y cae justo donde el
usuario va cuando desconfía: tarifas y legales.

---

## 4. Página por página

### `/` — 8.101 px · la Home pesa demasiado en dos bloques

| bloque | alto | % de la página |
|---|---|---|
| Héroe + cotizador | 868 px | 11 % |
| Eje de alcance **+ globo** | **1.247 px** | **15 %** |
| Tres formas de usarlo | 468 px | 6 % |
| MacBook «de la cotización al dinero» | 958 px | 12 % |
| **«Así se ve tu operación, paso a paso»** | **2.313 px** | **29 %** |
| Confianza · empresas · FAQ | 1.572 px | 19 % |

**El 44 % de la Home son dos bloques**: el del globo y el de los cuatro teléfonos. El segundo
cuenta, con cuatro maquetas de iPhone alternadas izquierda-derecha, lo mismo que `/como-funciona`
cuenta mejor en 1.367 px con el carril.

- **El globo se queda como está** —es instrucción permanente y además es la pieza que más se
  recuerda—. Lo que propongo no es tocarlo sino **quitarle aire**: la banda mide 1.247 px y el
  contenedor interior 1.055. *(Cuánto se puede recortar sin que la esfera se apriete hay que
  maquetarlo y medirlo: no pongo un número que no he comprobado.)*
- **Los cuatro teléfonos**: en escritorio la alternancia vertical obliga a 2.313 px de scroll para
  cuatro frases. Una fila de cuatro en escritorio, **manteniendo la alternancia en móvil**, es el
  mismo contenido en una fracción del alto. Es la propuesta que más scroll devuelve, y también la
  que más hay que probar antes de afirmar nada.

**Propuesta N3 · densificar la Home sin quitar ninguna pieza.** Maqueta + medición antes de
cualquier cifra.

### `/empresas` — 5.755 px · la página más redonda, con un hueco

Las cuatro figuras de caso sostienen la página entera. El único momento en que el sistema visual
desaparece es **«Qué cambia respecto de una persona»**: 624 px de tabla de texto, cuatro filas,
dos columnas, cero dibujo.

Y esa tabla tiene exactamente la topología que el sitio ya sabe dibujar: **dos carriles** —persona
y empresa— sobre cuatro asuntos —verificación, atención, condiciones, cotización—. Es el carril de
`/como-funciona` con otro contenido.

**Propuesta N4 · llevar esa tabla a la gramática de carriles.** No inventa vocabulario, une dos
páginas y le devuelve a `/empresas` su único tramo mudo.

### `/como-funciona` — 3.618 px · nada que añadir

La página más eficiente del sitio: 433 palabras, 8 SVG, y todo lo que hay significa algo. Si
alguna vez hay que enseñar el sistema a alguien, se enseña con esta página.

### `/confianza` — 3.888 px · un final flojo para la mejor página

«Lo que no vas a leer acá» deja el listón muy alto, y entonces **«Quiénes somos» cierra con 383 px:
dos párrafos y una tarjeta de WhatsApp.** Es justo la pregunta que se hace quien llegó a esa página
desconfiando.

Sin fotos del equipo —D11 está bloqueado, y no lo empujo—. Pero los datos que **sí** existen y
están verificados hoy viven repartidos: la razón social en un párrafo, el registro UAF en el pie,
FinteChile en el pie, el marco legal chileno en otro párrafo.

**Propuesta N5 · una ficha de identidad en la propia sección**, con lo que ya está verificado y
nada más. No es contenido nuevo: es dejar de obligar al lector a reunirlo él.

### `/blog` — 1.462 px · la página más pobre del sitio

Dos entradas, **0 SVG**, y el pie de página ocupa más alto que el contenido. El `h2` «Artículos» ni
siquiera se ve.

Y es una pena que sea así, porque **los dos artículos tienen portada** —una de dato y una de
figura— y **el índice no muestra ninguna**. El sitio construyó dos tipos de portada y luego las
escondió.

**Propuesta N6 · que el índice muestre la portada de cada artículo, en miniatura.** Dibujo nuevo:
ninguno. Es reusar `PortadaDato` y `PortadaFigura` a escala reducida. Es la propuesta con mejor
relación entre lo que cambia y lo que cuesta.

### `/tarifas` — 2.647 px · la página más delicada, y la menos diseñada

Explica el precio, que es el asunto donde una mesa de cambio se juega la credibilidad, y lo hace
con **0 figuras y una columna de 33 caracteres**.

El texto dice algo perfectamente dibujable: *«DLPay toma una referencia de mercado y le aplica su
spread. El resultado es el precio que ves en el cotizador: un solo número, con el spread ya
incorporado… no hay una comisión aparte que se sume al final.»*

En la gramática del sitio, **una barra llena es una magnitud** (§6.2). La figura correcta es **una
sola barra con su tramo interior marcado** — no dos barras sumándose, porque sumar dibuja
justamente lo que el texto niega.

**Y la clave de que esto se pueda hacer hoy: la figura no lleva cifras.** Los tramos de spread son
dato bloqueado (D5, «ninguna por ahora»). La figura muestra **la estructura**, no la magnitud, y
por eso no depende de ninguna decisión pendiente.

**Propuesta N7 · la composición del precio, como una sola barra.** Es mi favorita de todo el
estudio: la página que más lo necesita, la figura más simple, y cero datos bloqueados.

### `/terminos` · `/privacidad` · `/canal-de-denuncias` — texto puro

Correcto que sean sobrias. Con N1 y N2 quedan bien sin añadirles nada. **No propongo dibujo aquí:**
una página legal con figuras parece que intenta convencer, y estas tienen que parecer que informan.

### `/404` — 1.026 px · 34 palabras sobre tinta

Es la única página del sitio donde el motivo geométrico podría aparecer **sin tener que significar
nada**, porque no hay ninguna afirmación que hacer. Es también la menos importante.

**Propuesta N8 · dejarla para el final**, y sólo si sobra tiempo.

---

## 5. Por dónde empezaría, en orden

| | propuesta | qué cuesta | qué devuelve |
|---|---|---|---|
| **1** | **N1 · la medida de lectura** (4 legales + artículo) | un `max-width` | cinco páginas cambian de carácter |
| **2** | **N2 · el `h2` de las legales** | la misma plantilla que N1 | jerarquía legible |
| **3** | **N7 · la composición del precio en `/tarifas`** | una figura, sin cifras | la página más delicada deja de ser texto suelto |
| **4** | **N6 · portadas en el índice del blog** | cero dibujo nuevo | la página más pobre pasa a ser una de las mejores |
| **5** | **N4 · la tabla de `/empresas` a carriles** | una figura, vocabulario existente | cierra el único tramo mudo de la página |
| **6** | **N5 · la ficha de identidad en `/confianza`** | composición, sin datos nuevos | el cierre a la altura de la página |
| **7** | **N3 · densificar la Home** | maqueta y medición | menos scroll sin perder ninguna pieza |
| **8** | **N8 · la 404** | poco | poco |

Los tres primeros no necesitan que yo dibuje nada nuevo salvo N7, y N7 es una barra.

---

## 6. Lo que no propongo, y por qué

- **Fotos, de stock o de equipo.** Principio 3 y D11. Además, el sitio ya demostró que no las
  necesita.
- **Color nuevo.** La identidad está congelada y el problema del sitio no es de color.
- **Movimiento nuevo.** El Motion System ya lleva tres excepciones infinitas autorizadas; una
  cuarta habría que pagarla con un argumento que no tengo.
- **Tocar el globo, el carril, las figuras de caso o «Lo que no vas a leer acá».** Funcionan.
- **Añadir figuras a las tres legales.** Explicado arriba: parecerían un argumento de venta.

---

## 7. Lo que hay que decidir antes de que yo dibuje

1. **Cuáles de las ocho entran**, y en qué orden.
2. **N1 toca cinco páginas a la vez.** Es la de mejor relación coste/efecto de todo el estudio,
   pero también la única que cambia páginas que Compliance ya leyó. Conviene que lo sepa aunque no
   cambie ni una palabra.
3. **N7 y N4 son figuras nuevas**, así que pasan por la comprobación 2 del DS §6.2 antes de
   dibujarse: si una marca significa algo nuevo, se escribe antes por qué.

Nada de esto está construido. `cowork/` es sólo visualización.

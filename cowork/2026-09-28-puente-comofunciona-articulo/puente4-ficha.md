# Puente 4 de 5 · Cómo funciona → el artículo

**Fecha:** 2026-09-28 · **Autor:** Claude Cowork
**Maqueta:** `puente4-maqueta.html` · **md5** `c898096ef9b8dd229993e7f420447d35`
**Medido sobre el build de `e699dba`.** **No escribí nada en el repositorio.**

---

## 0. Antes: verifiqué los dos puentes integrados

Reconstruí el sitio con `Puente.astro`, `FiguraTarifas.astro` y `FiguraTenencia.astro` dentro y medí
las dos piezas en vivo.

| | Home | /tarifas |
|---|---|---|
| alturas 320 / 390 / 768 / 960 / 1280 / 2560 | 534 · 529 · 529 · 490 · 490 · 490 | 644 · 624 · 564 · 525 · 525 · 525 |
| desborde horizontal | 0 en los seis | 0 en los seis |
| texto más pequeño · recortado | 13 px · 0 | 13 px · 0 |
| holgura por tinta, texto / figura | 120–197 / 78–82 | 103–179 / **61** |

**Clavadas contra mis tablas, las doce.** Y sobre la discrepancia del §4.7: el agente midió **60** por
el lado de la figura y yo mido **61**. Es muestreo sub-píxel —él y yo tomamos el borde a alturas
distintas—, y **su 60 es el número prudente**, así que el §4.7 está bien como está.

**Un hallazgo que importa para la familia** —corregido después de que el agente me pillara la frase—:
las páginas sin `js-motion` en el build son **cinco**: `/tarifas`, `/terminos`, `/privacidad`,
`/canal-de-denuncias` y la 404. Lo que sí es cierto es que **`/tarifas` es la única página CON un
puente que no lo carga**. Así que ahí el puente 2 **no entra animado**:
sale completo y quieto, porque el CSS está condicionado a `.js-motion` y esa clase nunca se añade.
Es correcto —protege los cero bytes ejecutables de esa página— pero conviene saberlo: **de los cinco
puentes, el de `/tarifas` va a ser el único inmóvil**, y no es un fallo.

**El puente 3 (Precio → Tarifas) todavía no está integrado**; lo entregué después del commit de
veredictos.

---

## 1. El puente 4

`/como-funciona` usa «dólar digital» **4 veces** y no lo explica ni una. Su casa está escrita en
`content/glossary.ts`: el artículo de activos tokenizados, con el rótulo «En el blog». Y la página
termina, literalmente, entregándotelo: «Recibes el dólar digital… **Ahí termina nuestra operación:
desde ese punto decides tú**».

**Y el enlace de vuelta ya existe:** el artículo dice «Para entender el recorrido completo de una
operación… está la página de cómo funciona una operación». Este puente cierra ese circuito.

---

## 2. Qué se ve al otro lado

**El riel del artículo** —lo tienes en `puente4-origen-riel.png`—: la moneda lisa, el tramo con la
cuña del sistema, y **la moneda dentada**. El dentado es la marca: una está tokenizada y la otra no.

Copiado con su construcción exacta: trazos **1,5 / 1,9 / 1,1**, la cuña a escala 1,2 con
`stroke-linejoin: miter`, y **los rótulos fuera del SVG**, que es la nota del propio artículo — dentro
escalarían con el ancho y a 320 px caerían a 9,6 px.

**Descarté la portada del artículo** (la moneda con la T y dos flechas girando): es la marca de
*Tether*, no la del dólar digital, y el puente habla de lo segundo.

---

## 3. El texto: **cero cadenas nuevas de riesgo**

| en el puente | origen |
|---|---|
| «desde ese punto decides tú» | literal del cierre de `/como-funciona` |
| **«El peso no está tokenizado; el dólar digital sí»** | literal del artículo — y **ya la firmaste como Compliance el 2026-09-22**, junto con la figura. Está marcada como tal en el propio `.md` |
| «Es el mismo dólar existiendo como unidades sobre una red.» | literal, la frase que la sigue |
| «pesos» · «dólar digital» | literales de los rótulos del riel |
| **«Leer el artículo»** | **nueva** — la etiqueta del botón |

Es el único de los cuatro cuyo **titular ya tiene firma**. Lo nuevo es una etiqueta de botón.

---

## 4. Dónde va

**En `/como-funciona`, después de «Ahí termina nuestra operación» y antes de la banda «¿Listo para
ver tu precio?».** Montado en `puente4-en-como-funciona-1280.png`.

Encima queda `--papel-2` y debajo papel: ni oscuro contra oscuro ni el pie cerca. Es el mismo sitio
relativo que el puente 3 en `/precio` — **el penúltimo bloque, justo antes de la llamada**.

**Lo mismo que allá, y lo repito porque ya son dos:** quedan dos botones verdes a unos 400 px. Uno
invita a leer y el otro a cotizar, y se distinguen por superficie y por alineación, pero si en algún
momento te chirría, el de la banda tiene sitio para bajar a `ghost`.

---

## 5. Medido

| | 320 | 390 | 768 | 960 | 1280 | 2560 |
|---|---|---|---|---|---|---|
| alto | 574 | 596 | 600 | 500 | 500 | 500 |
| desborde | 0 | 0 | 0 | 0 | 0 | 0 |
| texto más pequeño | 13 | 13 | 13 | 13 | 13 | 13 |
| texto recortado | 0 | 0 | 0 | 0 | 0 | 0 |

Botón 199×57. Holgura por tinta: **97–173** el texto, **63–139** la figura. Sin JavaScript se ve
completa e inmóvil; `prefers-reduced-motion` la deja quieta. Un `data-enter` — M4, sin escalonado.

**Un fallo que sólo aparece midiendo, y me costó dos correcciones.** La columna de la figura mide
**460 px a 1280 y 384 a 960** —no 556, que fue mi error: `--container ÷ 2` con el relleno y el `gap`
olvidados—. Con el riel topado a 420 su esquina superior quedaba a **33 px del corte**, por debajo del
piso de 40 del §4.7, y a 960 no hay holgura ninguna que ganar porque el dibujo se come la columna.

Mi primer arreglo, `justify-self: end`, **no movía el dibujo: lo encogía**. La celda pasa a ajustarse
al contenido y un `<svg>` con `width:100%` no tiene ancho intrínseco, así que colapsaba a 300 px. Los
«136–212» que publiqué eran 160 px de encogimiento disfrazados de holgura.

Lo correcto es `margin-inline-start: auto` en el dibujo —la celda sigue llenando la columna— y bajar
el tope a **360 px**, que es el primer valor que pasa el piso en los dos extremos: **63 a 960 y 139 de
1280 en adelante**. El artículo usa 420 como tope y ya se dibuja más pequeño en pantallas estrechas.

El motivo de fondo es geométrico y merece estar escrito: **el corte baja hacia la izquierda, así que
manda la esquina SUPERIOR de la figura y la INFERIOR del texto.** Los otros tres puentes no tenían el
problema porque sus figuras ocupan la columna entera.

**Y esto le toca al §4.7**, en dos frases: que la holgura se mide **por la tinta y no por la celda**
—la mía medía 39 donde había 63—, y que la esquina que manda es la **superior** de la figura y la
**inferior** del texto. Con los cuatro puentes medidos con el instrumento corregido, el rango de la
familia es **61–139** por la figura y **97–205** por el texto.

---

## 6. Queda una, y sigue sin resolverse sola

**Empresas → ?** Sobre el build de hoy: «ejecutivo» ×6 —el más alto del sitio— con casa en
`/confianza`; «dólar digital» ×9, con casa en el artículo; «spread» ×2. Las tres salidas siguen en pie
y la decisión es tuya:

1. **Otra cara de `/confianza`** para no repetir la línea de tenencia.
2. **Al artículo**, como `/como-funciona` — pero entonces dos puentes enseñarían el mismo riel.
3. **No hacerla.** `/empresas` es la única página con banda de contacto propia al cierre.

Mi lectura, con los cuatro construidos delante: **la 3**. Las cuatro parejas que salieron bien lo
hicieron porque la página de origen **dejaba una frase colgando** que la de destino remata.
`/empresas` no deja ninguna: termina invitando a hablar con alguien, que es lo que quiere que pases.
Forzarle un quinto puente sería exactamente lo que me pediste no hacer en el primer encargo.

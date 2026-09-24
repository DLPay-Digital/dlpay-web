# Ficha — el índice del blog

**Entrega:** `2026-09-24-indice-del-blog` · **Autor:** Claude Cowork · **Estado:** En revisión
**Pieza:** `indice.html` · **md5:** `0a06576bc27dbc53c39a277f1f7dac57`
**Capturas:** `indice-hoy.png` (lo que hay), `indice-real-1280.png` (los dos artículos de verdad),
`indice-con-ocho-1280.png` (con seis simulados, para ver si aguanta), `indice-390.png`
**Dónde va:** `src/pages/blog/index.astro`.

> **No hay ni un dibujo nuevo en esta entrega.** La marca de cada fila **es la portada del propio
> artículo**, que ya existe y hoy sólo se ve dentro del artículo. Lo único que se hace es mostrarla
> donde la gente elige qué leer.

---

## 1. El problema, medido

| | hoy | con la propuesta (8 entradas) |
|---|---|---|
| Alto de `main` | **788 px** | 1.615 px |
| Anclas visuales | **0** | 3 *(ver la nota)* |
| Tramo más largo sin nada | **788 px — el 100 %** | 474 px |

Quien pulsa «Blog» hoy ve **dos líneas de texto y una raya**, y el sitio parece vacío. Y las dos
portadas —la moneda con la T y el intervalo de la tasa— están dibujadas, aprobadas y a un clic de
distancia, invisibles en el sitio donde se decide si entrar.

> **El «3» de anclas engaña y lo digo yo:** mi medidor sólo cuenta `svg`, `img` y `canvas`, y **las
> marcas de dato son HTML**, no SVG. Hay 3 pictogramas y 4 cifras entre las ocho filas. Es la misma
> limitación que ya anoté con el carril de `/como-funciona`.

---

## 2. La decisión de forma, que es lo caro de esta entrega

El índice **funciona con dos artículos y no funcionará con veinte**, y ésta es la decisión que
conviene tomar antes del tercero, no después. Lo probé con ocho.

**Sigue siendo una lista, no una rejilla de tarjetas.** Una tarjeta obliga a recortar el titular; una
fila lo deja respirar, y en este blog el titular **es** el argumento. Además el propio
`blog/index.astro` ya razona que la paginación sería «infraestructura para un problema que todavía
no existe»; lo mismo vale para filtros y categorías con dos artículos.

**Lo que cambia es que cada fila gana una marca a la izquierda**, en columna fija, y que la
categoría y la fecha suben a una sola línea sobre el titular en vez de ocupar su propia columna. Eso
libera ancho para el titular y deja el ojo bajando por una sola columna de texto.

---

## 3. Qué marca lleva cada fila, y por qué ésa

| tipo de portada | marca en el índice |
|---|---|
| `figura` | **el pictograma**, el mismo que abre el artículo |
| `cifra` / `rango` | **la cifra en mono**, con su unidad y su etiqueta |
| sin portada | nada — la columna se queda vacía |

**La marca dice de qué clase es la pieza antes de leer el titular.** Un número anuncia que el
artículo se apoya en un dato; un pictograma, que explica un concepto. Eso no es decoración: es
información que hoy no está en ninguna parte del índice.

**El tamaño lo decide el dibujo, no la costumbre del pulgar.** El pictograma tiene 24 marcas de
canto y dos aros; reducido a 56 px sus trazos caerían a 0,9 px y se empastarían. A **112 px** los
trazos reales miden **1,82 / 1,43 / 2,18 px**, que es donde aún se leen. Podría haber dibujado una
versión simplificada, y no lo hice a propósito: **las marcas de canto significan «hecho de
unidades» y los arcos significan «circula»**, así que quitarlas cambiaría lo que la portada dice. Se
muestra entera o no se muestra.

---

## 4. Tres límites que prefiero decir yo

**a) El pictograma se repite.** El `z.enum` de `figura` tiene **exactamente un valor**,
`activo-tokenizado`. Así que hoy todos los artículos de tipo `figura` llevarían la misma marca —en
la prueba de ocho se ve tres veces—. **Para esos artículos la marca dice «pieza de concepto», no
«esta pieza».** No es un defecto de esta entrega: es que el catálogo de pictogramas tiene un solo
elemento y tendrá que crecer con los artículos. Conviene saberlo antes de que haya cinco.

**b) Un artículo sin portada deja la columna vacía.** El esquema lo permite a propósito —«un
artículo sin portada arranca por el titular y la página funciona»— y en la fila se ve como un hueco.
Elegí **mantener la alineación** en vez de que ese título empiece más a la izquierda: una lista con
el borde izquierdo dentado se lee como rota, y la columna vacía se lee como «éste no trae figura»,
que además es verdad.

**c) La marca repite lo que se verá al entrar.** Es deliberado: el índice y la cabecera del artículo
comparten identidad, así que la marca funciona como reconocimiento al volver.

---

## 5. Dos defectos que encontré mirando la maqueta, no el código

**`50.000,00 CLP` se salía de su columna y chocaba con el titular.** Un mínimo de CLP 50.000 no
tiene centavos: **los decimales se ponen sólo si el número los trae**. Y aun así la cifra baja de
cuerpo cuando la cadena es larga, porque manda la columna.

**A 390 px, `3,50–3,75` volvía a chocar.** Tiene 9 caracteres y mi umbral de «larga» estaba en más
de 9, así que no disparaba — con una columna de 72 px. Umbral a 7 y columna de móvil a 88 px.
Comprobado después: **cero choques a 320, 390 y 1280**, y sin scroll horizontal en ninguno.

---

## 6. Evidencia medida

| | 320 | 390 | 1280 |
|---|---|---|---|
| Choques marca / titular | **0** | **0** | **0** |
| Scroll horizontal | no | no | no |
| Lado del pictograma | 72 px | 72 px | **112 px** |
| Trazo real de las marcas de canto | — | — | **1,43 px** |
| Alto de una fila con pictograma | — | — | 212 px |

---

## 7. Lo que falta decidir

1. **Si la fila sin portada se queda con la columna vacía** (§4.b) o el texto se corre a la
   izquierda. Yo mantengo la alineación.
2. **El catálogo de pictogramas** (§4.a). No es de esta entrega, pero el tercer artículo de tipo
   `figura` lo va a pedir.
3. **Categorías y filtros: no.** Con dos artículos —y con ocho— es infraestructura para un problema
   que no existe, y lo dice el propio archivo del índice.

Nada de esto está integrado. `cowork/` es sólo visualización.

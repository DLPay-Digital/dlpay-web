# Prompt para el agente de Claude Code — `2026-09-24-indice-del-blog`

**Fecha:** 2026-09-24 · **Autor:** Claude Cowork
**Maqueta:** `indice.html` · **md5:** `0a06576bc27dbc53c39a277f1f7dac57`
**Ficha:** `ficha.md` · **Toca:** `src/pages/blog/index.astro`

> **No hay ningún dibujo nuevo.** La marca de cada fila es la portada del propio artículo, que ya
> existe en `content.config.ts` y hoy sólo se ve dentro del artículo. Esto es mostrar lo que ya está
> hecho donde la gente elige qué leer.

---

## 1. Por qué

Medido sobre el build: el índice tiene **788 px de `main`, cero anclas visuales, el 100 % de la
página sin nada**. Quien pulsa «Blog» ve dos líneas de texto y parece un sitio vacío — mientras las
dos portadas están dibujadas, aprobadas y a un clic.

Y es la decisión que conviene tomar **antes del tercer artículo**: la forma del índice es barata
ahora y cara después. La probé con ocho entradas (`indice-con-ocho-1280.png`).

---

## 2. Qué cambia en la fila

Sigue siendo una `<ul>` de filas, **no una rejilla de tarjetas**: una tarjeta obliga a recortar el
titular y aquí el titular es el argumento. Lo que cambia:

- Una **columna fija a la izquierda** con la marca: 132 px en escritorio, 88 px bajo 760.
- **Categoría y fecha suben a una línea sobre el titular** en vez de ocupar su propia columna. Eso
  libera ancho para el titular y deja una sola columna de texto.

| `post.data.portada.tipo` | marca |
|---|---|
| `figura` | el pictograma de `PortadaFigura`, **entero** |
| `cifra` / `rango` | la cifra en mono con su unidad, un filete `--verde-deep` y la etiqueta |
| ausente | la columna se queda vacía |

**Reutiliza los componentes, no copies el SVG de mi maqueta.** Yo pegué el trazado a mano porque la
maqueta es una página suelta; en `src/` el pictograma ya vive en `PortadaFigura.astro` y la cifra en
`PortadaDato.astro`. Lo correcto es sacar de ahí una variante pequeña —o extraer el trazado a algo
compartido— y **no tener dos copias del mismo dibujo**, que es el problema que `content/scope.ts` y
`glossary.ts` existen para evitar.

---

## 3. Tres cosas que no son detalles

**a) El pictograma va entero, a 112 px.** No lo simplifiques para que quepa más pequeño: sus 24
marcas de canto significan «hecho de unidades» y los arcos significan «circula», así que una versión
reducida diría menos. A 112 px los trazos reales miden 1,82 / 1,43 / 2,18 px y se leen; a 56 px
caerían a 0,9 px y se empastan.

**b) Los decimales sólo si el número los trae.** `50.000,00` se salía de la columna y chocaba con el
titular; un mínimo de CLP 50.000 no tiene centavos. Y la cifra **baja de cuerpo cuando la cadena
pasa de 7 caracteres**, porque manda la columna. Comprueba con un rango de dos decimales a los dos
lados —`3,50–3,75`—, que es el caso que a mí se me escapó a 390.

**c) La columna vacía de un artículo sin portada se queda vacía.** Es decisión, no olvido: una lista
con el borde izquierdo dentado se lee como rota, y el hueco se lee como «éste no trae figura», que
es verdad. Si Sebastián prefiere lo contrario, está en la ficha §7.1.

---

## 4. Lo que hoy tiene el índice y hay que conservar

`data-enter` en cada `<li>` con el escalonado que **sólo retrasa del 2.º al 4.º hermano**, y la fecha
tabular `dd-mm-aaaa` con `timeZone: 'UTC'`. Las dos cosas están razonadas en la cabecera del archivo
y ninguna la toca esta entrega. Con la lista más alta, la regla dura 4 del Motion System importa
más, no menos.

**Nada de categorías, filtros ni paginación.** Con dos artículos y con ocho es infraestructura para
un problema que no existe, y lo dice el propio archivo.

---

## 5. Qué comprobar

1. **Cero choques entre la marca y el titular a 320, 390 y 1280** — es el fallo que tuvo la maqueta
   dos veces, y sólo se ve midiendo el `getBoundingClientRect()` de los dos, no leyendo el CSS.
2. Sin scroll horizontal en los tres anchos.
3. El pictograma mide 112 px en escritorio y 72 en móvil, y **es el mismo** que abre el artículo.
4. Las entradas siguen entrando una sola vez y con el escalonado limitado a cuatro hermanos.
5. La fila sin portada no rompe la alineación de las demás.

---

## 6. Lo de siempre

`cowork/` no toca `src/`. La maqueta es sólo visualización.

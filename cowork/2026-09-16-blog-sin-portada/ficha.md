# Ficha — el blog sin portadas: texto primero

**Entrega:** `2026-09-16-blog-sin-portada` · **Autor:** Claude Cowork · **Estado:** En revisión
**Vista:** `index.html` · **Capturas:** `listado-1280.png`, `articulo-1280.png`, `listado-390.png`

---

## 1. Qué encontré

**Los dos bloques del artículo son la misma imagen, puesta dos veces.**
`src/content/blog/ejemplo-portada.png` se usa como `coverImage` y otra vez dentro del cuerpo. Es
una lámina de 1200×630 con cuñas diagonales y una línea verde sobre tinta: **papel tapiz**, que el
Design System §6 prohíbe con esas mismas palabras —«papel tapiz / patrón de fondo repetido» y
«cualquier trazo que no represente movimiento o proceso»—. No faltan imágenes: sobran dos
marcadores de posición que el propio sistema no habría aceptado.

**El artículo no está publicado.** El candado de `lib/blog.ts` (commit `b87fc94`) lo deja fuera del
build: en `dist/blog/` sólo existe el índice y `/blog/ejemplo/` no se genera. Se ve con
`astro dev`, que muestra los borradores a propósito. Nada de esto es público hoy.

## 2. La decisión

**Texto primero** (Sebastián, 2026-09-16). El sitio no tiene una sola fotografía y todo su sistema
visual es CSS y SVG; comprar stock sería la primera grieta del Principio 3. La imagen entra el día
que lleve información —una figura de dato para un artículo de Mercado—, y eso depende de una fuente
de precio aprobada (D7) y del visto bueno de Compliance por artículo.

El objetivo de esta entrega no es «quitar las imágenes»: es que el listado y el artículo se vean
**diseñados para texto**, no degradados por falta de imagen.

## 3. El listado deja de ser una rejilla de tarjetas

Hoy son tarjetas en `--tinta-2` a tres columnas desde 900 px. Con uno o dos artículos —que es
exactamente donde está el blog— una rejilla de tres columnas deja **una tarjeta sola en el primer
tercio** y dos huecos. Sin portada, además, la tarjeta es una caja oscura con texto dentro.

Pasa a ser un **índice**: filas separadas por filete, con la categoría y la fecha en columna propia
y el titular llevando el peso.

| | Antes | Ahora |
|---|---|---|
| Estructura | Rejilla de 1 → 2 → 3 columnas | Lista de filas a ancho completo |
| Escala | Se ve rota con 1, 2, 4, 5 artículos | Igual de bien con 1 que con 50 |
| Superficie | Tarjeta `--tinta-2` con borde y radio | Papel con filete `--line`, sin caja |
| Fecha | Texto largo, 11 px | **Tabular en `--f-num`**, columna propia |
| Estado vacío | Ya existía y se conserva | Igual |

**La fecha cambia de forma según dónde esté**, y es deliberado: en el índice es `17-09-2026`
—una columna de datos, alineada, que nunca parte en dos líneas— y en el artículo es «11 de
septiembre de 2026», que ahí es prosa. Es la misma regla que el resto del sitio aplica a las
cifras.

## 4. El artículo gana una banda y pierde la portada

La portada se va y en su lugar entra una **banda en tinta** con categoría, fecha, titular y bajada.
Dos razones:

1. **La superficie hace de imagen.** Es el recurso que el sistema ya tiene para dar peso sin
   ilustrar, y no cuesta ni un archivo.
2. **Consistencia.** Hoy el artículo es la **única página del sitio que abre directamente sobre
   papel**, sin banda. Las nueve rutas restantes abren con héroe o con `PageHero`.

La banda se estrecha a 760 px para alinear exactamente con la columna de lectura; la del listado va
al ancho del contenedor, como `PageHero` en el resto del sitio.

## 5. Medidas y contraste

Desborde horizontal **0** a 390 y a 1280. Alto de página: 2 351 px en escritorio con dos artículos.

| Par | Ratio |
|---|---|
| `--ink` sobre papel (titulares del índice) | 16,00:1 |
| `--ink-mute` sobre papel (bajadas, fechas) | 5,50:1 |
| `--verde-deep` sobre papel (categoría, hover del titular) | 4,90:1 |
| `--on-tinta` sobre tinta (titular de la banda) | 16,44:1 |
| `--on-tinta-mute` sobre tinta (bajada y fecha de la banda) | 8,18:1 |
| `--verde` sobre tinta (categoría en la banda) | 8,45:1 |

Movimiento: sólo **M1**, el cambio de color del titular al pasar el puntero. Nada entra, nada se
mueve. Las filas pueden conservar su `data-enter` si se quiere, pero no lo necesitan.

## 6. Qué se borra y qué se decide

- `src/content/blog/ejemplo-portada.png` — el asset del papel tapiz.
- La línea `![...](./ejemplo-portada.png)` del cuerpo de `ejemplo.md` y su `coverImage` del
  frontmatter.
- **Decisión pendiente para Claude Code:** el campo `coverImage` del esquema y las dos ramas
  condicionales de las plantillas se quedan sin consumidor. El precedente del proyecto es borrar
  lo que no se usa —`ActivityFeed` se eliminó entero, 514 líneas, en vez de quedarse como código
  muerto—, así que **recomiendo quitarlo**; cuando llegue la figura de dato será un componente, no
  un campo de imagen. Si prefiere conservarlo, que quede documentado como reservado, igual que los
  tres tokens de `tokens.css`.

## 7. Para el traslado

1. `src/pages/blog/index.astro` — la rejilla de tarjetas pasa a lista. El HTML de la fila son tres
   `span` dentro del `<a>`; en escritorio la colocación en la rejilla es **explícita**
   (`grid-row: 1 / span 2` para la meta), porque con tres hijos y dos columnas el flujo automático
   manda la bajada a la columna de la fecha. Me pasó al montarlo.
2. `src/pages/blog/[slug].astro` — sale el bloque `cover-wrap`, entra la banda. Se puede resolver
   con CSS propio de la página (como está en la vista) o añadiendo una ranura `meta` a `PageHero`,
   que es un componente compartido: tu criterio, igual que con el par de botones.
3. La banda del artículo repite las cuñas de `PageHero`. Si se hace con CSS propio, sería la
   segunda copia de ese `clip-path` — otro argumento para la ranura.
4. El `<time datetime>` conserva la fecha ISO en los dos sitios, aunque el texto visible cambie.

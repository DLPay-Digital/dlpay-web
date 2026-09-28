# Prompt para el agente — `2026-09-28-puente-comofunciona-articulo`

**Fecha:** 2026-09-28 · **Autor:** Claude Cowork
**Maqueta:** `puente4-maqueta.html` · **md5** `c898096ef9b8dd229993e7f420447d35`
**Ficha:** `puente4-ficha.md` · **Lee antes `puente4-correcciones.md`:** dos afirmaciones de la primera versión de
este prompt eran falsas y están rectificadas ahí, con un tercer fallo que apareció al comprobarlas.
**Medido sobre el build de `e699dba`.**

---

## 1. Qué es

El cuarto puente, **de `/como-funciona` al artículo de activos tokenizados**. `Puente.astro` tal
cual; entra una figura nueva, **`FiguraRiel.astro`**.

`/como-funciona` usa «dólar digital» **×4** y no lo explica ni una vez. Su casa está escrita en
`content/glossary.ts` → `/blog/activos-tokenizados-que-son-y-quien-los-construye/`. Y **el enlace de
vuelta ya existe**: el artículo manda a `/como-funciona`. Esto cierra el circuito.

## 2. Qué se ve al otro lado

**El riel del artículo**, copiado de
`content/blog/activos-tokenizados-que-son-y-quien-los-construye.md`: la moneda lisa, el tramo con la
cuña del sistema y **la moneda dentada**. El dentado es la marca — una está tokenizada y la otra no.

Tres cosas que no son detalles:

- **Los rótulos van FUERA del SVG.** Es la nota del propio artículo: dentro escalarían con el ancho y
  a 320 px caerían a 9,6 px.
- **Trazos 1,5 / 1,9 / 1,1** y la cuña a escala 1,2 con `stroke-linejoin: miter`, igual que allá.
- Sobre tinta todo en `--verde`; en el artículo es `--verde-deep` porque está sobre papel.

**Descarté la portada del artículo** —la moneda con la T y dos flechas— porque es la marca de
*Tether*, no el dibujo del dólar digital.

**Un solo `data-enter`**: M4, sin escalonado. *(Si alguna vez quieres que el tramo se trace, `.link`
es un `path` con `stroke` y M3 le aplica sin enmienda — pero eso amplía el inventario de M3, que está
cerrado desde el 2026-09-17 con dos entradas. No lo propongo hoy.)*

## 3. Dónde va

**En `/como-funciona`, después de «Ahí termina nuestra operación» (`.scope`) y antes de la banda
«¿Listo para ver tu precio?» (`.close`).** Encima queda `--papel-2` y debajo papel. Las dos son
secciones de primer nivel: no hay que partir nada.

## 4. El texto

| en el puente | origen |
|---|---|
| «desde ese punto decides tú» | literal del cierre de `/como-funciona` |
| **«El peso no está tokenizado; el dólar digital sí»** | literal del artículo, y **ya firmada por Sebastián como Compliance el 2026-09-22**, marcada como tal en el `.md` |
| «Es el mismo dólar existiendo como unidades sobre una red.» | literal, la frase que la sigue |
| «pesos» · «dólar digital» | literales de los rótulos del riel |
| **«Leer el artículo»** | **nueva** — la etiqueta del botón |

Es el único de los cuatro cuyo **titular ya tiene firma**. Lo nuevo es una etiqueta de botón.

## 5. El tope del riel, y la enmienda al §4.7

```css
.riel { max-width: 360px; margin-inline-start: auto }   /* y NADA de justify-self */
```

**No es cosmética, y la primera versión de este prompt lo tenía mal.** La columna de la figura mide
**460 px a 1280 y 384 a 960**. Con el riel a 420 su esquina superior queda a **33 px del corte**, bajo
el piso de 40 del §4.7, y a 960 no hay holgura que ganar porque el dibujo llena la columna. Barrido:
420 → 33/65 · 390 → 33/102 · **360 → 63/139** · 330 → 99/175. **360 es el primero que pasa el piso en
los dos extremos.**

`justify-self: end` **no vale**: la celda se ajusta al contenido y un `<svg>` con `width:100%` no
tiene ancho intrínseco, así que el dibujo colapsa a 300 px. Lo que se empuja a la derecha es el
dibujo, con `margin-inline-start: auto`; la celda sigue llenando la columna.

**Dos frases para el §4.7**, porque son las que me habrían ahorrado el fallo:
1. La holgura se mide **por la tinta, no por la celda** — la celda de esta figura mide 39 donde la
   tinta mide 63.
2. **El corte baja hacia la izquierda, así que manda la esquina SUPERIOR de la figura y la INFERIOR
   del texto.**

Con los cuatro puentes remedidos con el instrumento corregido, el rango de la familia es **61–139**
por la figura y **97–205** por el texto.

## 6. Lo que hay que reproducir

| | 320 | 390 | 768 | 960 | 1280 | 2560 |
|---|---|---|---|---|---|---|
| alto | 574 | 596 | 600 | 500 | 500 | 500 |
| desborde | 0 | 0 | 0 | 0 | 0 | 0 |
| texto más pequeño | 13 | 13 | 13 | 13 | 13 | 13 |
| texto recortado | 0 | 0 | 0 | 0 | 0 | 0 |

*(A 768 el bloque es más alto que a 390: el riel está topado, así que a 768 se dibuja a su tope y a
390 sólo a 350 px de ancho. No es un fallo.)*

Botón 199×57. Holgura por tinta: 97–173 el texto, 63–139 la figura. Sin JavaScript, completa e
inmóvil; `prefers-reduced-motion`, quieta. `/como-funciona` **sí** carga `Motion.astro`.

## 7. Y una cosa que verifiqué y conviene que esté escrita

**`/tarifas` es la única página CON un puente que no carga `Motion.astro`.** (Sin él hay cinco:
`/tarifas`, `/terminos`, `/privacidad`, `/canal-de-denuncias` y la 404 — mi primera versión decía
«la única del sitio» y era falsa.) Así que el puente 2 es y será **el único inmóvil de la familia**: sale completo y quieto porque el CSS depende
de `.js-motion` y esa clase nunca se añade ahí. Está bien así, protege sus cero bytes ejecutables,
pero merece una línea en las notas de la familia para que nadie lo reporte como fallo.

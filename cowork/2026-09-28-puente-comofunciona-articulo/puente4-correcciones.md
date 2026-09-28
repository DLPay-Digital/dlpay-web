# Correcciones al prompt del puente 4 — para el agente

**Fecha:** 2026-09-28 · **Autor:** Claude Cowork
**Las dos objeciones son correctas. Las dos.** Y al comprobar la segunda apareció un tercer fallo,
más grave, que era mío y que ninguno de los dos había visto.

**Maqueta corregida:** `puente4-maqueta.html` · **md5 nuevo**
`c898096ef9b8dd229993e7f420447d35` — el `cd7a23f8…` del prompt queda anulado.

---

## 1. «`/tarifas` es la única página sin `Motion.astro`» — falso, y así se corrige

Lo medí sobre el build contando `js-motion` en **todas** las páginas servidas, no en las seis que
había mirado:

| con `js-motion` | sin `js-motion` |
|---|---|
| Home · `/precio` · `/como-funciona` · `/confianza` · `/empresas` · `/preguntas` · el blog y sus dos artículos | **`/tarifas` · `/terminos` · `/privacidad` · `/canal-de-denuncias` · la 404** |

Son **cinco**, no una. Mi frase salió de una muestra de seis páginas y la extendí a las catorce —
que es exactamente lo que el proyecto ya tiene escrito como regla: **no se afirma la ausencia de algo
desde una copia incompleta.** La reincidí.

**La frase que va al documento es la tuya:** «`/tarifas` es la única página **con un puente** que no
carga `Motion.astro`, así que su puente es el único inmóvil de la familia». Añádele la lista de
arriba si quieres que quede comprobable.

---

## 2. «Una columna de 556» — falso: son 460 a 1280 y 384 a 960

Medido en el puente 2, que ya vive, y en la maqueta: `grid-template-columns` da **460px 460px** a
1280 y a 2560, y **384px 384px** a 960, con `gap: 64px`. Tu número es el correcto.

Mi 556 era `--container ÷ 2` con el relleno y el `gap` olvidados. Aritmética, no medición: **derivé
en vez de medir**, y tenía el navegador abierto al lado.

---

## 3. El fallo que apareció al comprobar tu objeción, y es el que importa

Tenías razón en que había que volver a medir montado. Lo hice, y el resultado es peor que «el margen
es menor del que creen»: **`justify-self: end` no movía el dibujo, lo encogía.**

Con `justify-self: end` la celda pasa a ajustarse al contenido, y el contenido es un `<svg>` con
`width:100%; height:auto` — que **no tiene ancho intrínseco**. La celda colapsaba al ancho por
omisión de un reemplazado: **300 px**. El dibujo pasaba de 460 a 300 sin que yo lo pidiera.

Y mis «136–212» salieron de ahí: no eran 40 px de desplazamiento, eran **160 px de encogimiento**.
Tenía las dos capturas delante y no las comparé.

**Lo corregido, y esta vez medido de las dos formas:**

```css
.riel { max-width: 360px; margin-inline-start: auto }   /* y NADA de justify-self */
```

La celda sigue ocupando la columna entera; lo que se empuja a la derecha es el dibujo. Y el tope baja
a 360 porque con 420 **no hay holgura que ganar a 960**: la columna mide 384 y el dibujo se come
todo. Barrido completo:

| tope del riel | holgura a 960 | de 1280 en adelante |
|---|---|---|
| 420 px | **33** ✗ | 65 |
| 390 px | **33** ✗ | 102 |
| **360 px** | **63** ✓ | **139** |
| 330 px | 99 | 175 |

360 es el primer valor que pasa el piso de 40 del §4.7 **en los dos extremos**. El artículo usa 420
como **tope** y ya se dibuja más pequeño en pantallas estrechas, así que es el mismo dibujo a otro
tamaño, no otro dibujo.

---

## 4. Y por qué mi instrumento no lo cazó: medía la celda, no la tinta

Mi batería medía la holgura desde `figure.getBoundingClientRect()`. En los puentes 1, 2 y 3 la figura
**llena** su columna, así que caja y tinta coinciden y el número salía bien. En el 4 no llena, y la
caja mide un borde donde no hay nada pintado: **39 px** contra los **63** reales.

Es la tercera vez esta semana que la caja me engaña: en la holgura del texto, en el ancho de la
columna, y ahora en la figura. **Corregí el instrumento**: ahora toma la unión de los rectángulos de
lo que de verdad pinta dentro de `<figure>`, y remedí los cuatro puentes con él.

| puente | holgura de la figura (tinta) | (celda) |
|---|---|---|
| 1 · Home → Tarifas | 78–82 | 78–82 |
| 2 · Tarifas → Confianza | 61 | 61 |
| 3 · Precio → Tarifas | 87 | 87 |
| 4 · Cómo funciona → el artículo | **63–139** | 39 |

**El rango real de la familia es 61–139 por la figura y 97–205 por el texto.** El §4.7 dice hoy
«60 a 82»; con los cuatro dentro pasa a **60–139**.

---

## 5. Lo que sigue siendo válido del prompt

Todo lo demás: la premisa, los textos literales, el titular con su firma del 22 de septiembre, la
construcción del riel (trazos 1,5 / 1,9 / 1,1, cuña a 1,2 con `miter`, rótulos fuera del SVG), la
posición entre `.scope` y `.close`, y el único `data-enter` con M4.

**Y la regla geométrica del §5 sigue en pie y ahora con más motivo:** el corte baja hacia la
izquierda, así que manda la **esquina superior de la figura** y la **inferior del texto**. Si esa
frase hubiera estado escrita, yo habría mirado la esquina correcta y habría visto el encogimiento.

**Alturas corregidas** (el riel más pequeño baja el bloque a 768): 574 · 596 · **600** · 500 · 500 ·
500, a 320 / 390 / 768 / 960 / 1280 / 2560. Desborde 0, texto mínimo 13 px, nada recortado, botón
199×57, quieto sin JavaScript y con `prefers-reduced-motion`.

---

## 6. Los archivos

No llegaron al repositorio y yo no puedo escribir ahí. Están en la conversación con Sebastián:
`puente4-maqueta.html` (md5 nuevo), `puente4-ficha.md`, `puente4-prompt-agente.md`, `puente4-correcciones.md`
y cuatro capturas. Lo mismo con el puente 3, que tampoco está: `puente3-maqueta.html`
(md5 `3cfd2388d1e3e5f7ae4a265995b7ffec`), su ficha y su prompt.

# Prompt para el agente de Claude Code — portada del artículo de activos tokenizados

**Entrega:** `cowork/2026-09-21-portada-capa` · **Autor:** Claude Cowork · **Fecha:** 2026-09-21
**Estado:** En revisión · **Pieza:** `moneda.html` (md5 `e957cdeed8cd6c08f9a81c95daae4d05`)
**Ficha completa:** `cowork/2026-09-21-portada-capa/ficha.md`

**Capturas:** `final-banda-1280.png`, `final-banda-390.png`, `final-ctx-1280.png`,
`a11y-forced.png` · **Cotejos de descarte:** `cotejo-1280.png`, `cotejo2-1280.png`,
`cotejo3-390.png`

> Nada de esto está integrado. `cowork/` es sólo visualización: la entrega la trasladas tú.

---

## 1. Qué es

Un **pictograma**: dos monedas dentro de un bucle de circulación. La de la izquierda lleva una
**T** y el canto dividido en 24 marcas; la de la derecha lleva el signo del **dólar** y el canto
liso. Sin cifra, sin rótulos, sin texto de ninguna clase dentro del SVG.

Es un encargo directo de Sebastián: mandó un icono de referencia y pidió cambiar la ₿ por una T,
y darle identidad propia nuestra.

## 2. Por qué este artículo no podía usar `PortadaDato`

**No tiene ni una cifra en el cuerpo**, y los dos tipos existentes son una cifra puesta en grande.

El otro agente de Cowork lo dejó sin portada a propósito y su argumento, escrito en el
frontmatter, es correcto: elegir una de las cifras de producto de terceros para que fuera *la*
cifra de la portada sería una decisión editorial sobre datos bajo marcador de Compliance.

**Este tipo no toca ese problema porque no afirma ningún dato.**

---

## 3. Lo que hay que tocar en `src/`

### 3.1 `content.config.ts` — el esquema

`tipo: z.enum(['cifra','rango'])` gana un tercer valor. Propongo `'pictograma'`; el nombre es tuyo.

El problema real no es el enum: **`etiqueta`, `unidad`, `fecha` y `fuente` son obligatorias a
nivel de objeto** y este tipo no lleva ninguna.

- Un `z.discriminatedUnion('tipo', [...])` lo expresa bien, y el `superRefine` de `cifra`/`rango`
  se conserva tal cual dentro de su rama.
- Hacerlas opcionales y ampliar el refinamiento también funciona, pero deja el esquema mintiendo
  sobre sí mismo.

Tu decisión.

### 3.2 El campo que nombra el dibujo — **la salvaguarda importante**

El componente no puede dibujar algo distinto por artículo sin que el frontmatter diga cuál.

```ts
figura: z.enum(['moneda-tokenizada'])
```

**Un enum cerrado, no un `string`.** Con eso, añadir un dibujo obliga a pasar por diseño y por el
esquema, y rompe el build si no existe — el mismo criterio que `category` y que `tipo`.

Sin eso, `portada` vuelve a ser un campo de imagen, que es exactamente lo que se cerró el
2026-09-16 con `coverImage`.

El `aria-label` viaja con el dibujo, no con el frontmatter: describe el dibujo.

### 3.3 El comentario del esquema

La primera línea dice «La portada del artículo: una figura de DATO, no una imagen» y deja de ser
cierta.

**Reescribirla sin borrar el párrafo de `coverImage`:** el motivo por el que se retiró sigue
vigente y es lo que hace legítimo a este tipo. La diferencia que conviene dejar escrita:

- no es un archivo — se dibuja con los tokens del sitio, sin PNG y sin pregunta de licencia;
- no se repite dos veces en el mismo artículo;
- no lleva cuña;
- el enum de `figura` la mantiene cerrada.

### 3.4 `PortadaDato.astro` — «por eso son dos tipos y no tres»

Mismo criterio: **reescribir sin borrar el motivo.** La regla de la cuña sigue viva y es la que
hace admisible a éste — el pictograma no lleva cuña.

Si el componente pasa a dibujar algo que no es un dato, probablemente el nombre del archivo
también deje de ser exacto. Eso lo dejo a tu juicio.

### 3.5 El frontmatter del artículo

`activos-tokenizados-que-son-y-quien-los-construye.md` lleva hoy un comentario de seis líneas
explicando por qué va sin portada, y el bloque HTML de abajo repite el punto bajo el título
«SOBRE LA PORTADA». **Los dos hay que actualizarlos, no borrarlos.**

---

## 4. Aquí sí es SVG, y no contradice por qué el dato es HTML

`PortadaDato` pasó a HTML porque su SVG escalaba el **texto** con el ancho: a 390 px los rótulos
caían a ~6 px reales, el mismo fallo que la auditoría externa encontró en el globo.

Esta pieza **no tiene texto**: `innerText` de longitud 0, medido. Lo que escala es el dibujo, que
es lo que debe escalar, y el alto está fijado en CSS (132 / 160) en vez de depender del ancho.

---

## 5. Accesibilidad — **cambia respecto de la ficha anterior**

La versión de cuatro trazos iba con `aria-hidden`. **Ésta no.**

Va con `role="img"` y nombre accesible, porque es la portada del artículo y quien usa lector de
pantalla debe saber que existe y qué muestra, como el `alt` de cualquier imagen de cabecera.

El nombre se dejó **corto a propósito**: la primera versión tenía 154 caracteres y explicaba de
más.

Si no lo compartes, discutámoslo antes de integrar.

Lo demás de la pasada: 0 animaciones y 0 transiciones · sin desborde ni scroll horizontal a 320 px
y a zoom 200 % · sobrevive en `forced-colors: active` · nada se dice sólo con el color (las dos
monedas se distinguen por el signo y por el canto, no por ser verde y gris).

---

## 6. El punto donde me separo del componente hermano, dicho de frente

Medí `PortadaDato` en el build de hoy (`dist/`, 2026-09-21 15:26), artículo de la Fed:

| | 390 | 1280 |
|---|---|---|
| Banda de `PortadaDato` | **174 px** | **226 px** |
| Banda del pictograma | **196 px** | **256 px** |
| Diferencia | +22 px (12,6 %) | +30 px (13,3 %) |

Forcé los 226 exactos y **la marca se pierde**; está fotografiado en `cotejo2-1280.png`, panel D.
El alto del dato lo fijan tres líneas de texto, y una imagen a ese alto mide 184 px de ancho sobre
una columna de 760.

Además va **centrada** y no a ras. El dato se alinea con el titular porque es tipografía; una
marca no tiene línea base que alinear, y a ras queda huérfana con 570 px de columna vacía
(`cotejo2-1280.png`, panel G). Como `.inner` es `max-width:760px; margin:0 auto`, **centrada en la
banda y centrada en la columna son el mismo punto.**

---

## 7. Dos cosas que no decido yo

### 7.1 CLAUDE.md §1

Un bucle cerrado entre una moneda T y una moneda `$` **afirma que las dos se intercambian**. Es la
prueba sin texto (regla 16) aplicada a una figura que no tiene rótulos que quitar.

Mi lectura es que pasa:

- no hay banco, ni cuenta, ni billete, ni bandera, ni moneda local — las dos caras son **fichas**,
  y una ficha es lo contrario de una cuenta bancaria;
- el §1 permite comunicar «el cambio de divisas y el movimiento internacional de valor mediante
  dólar digital», y la moneda `$` se lee como el dólar digital porque está dibujada en la misma
  familia que la otra: mismo radio, mismo grosor, mismo trazo;
- **pero DLPay no transa activos tokenizados.** La portada ilustra el asunto del artículo —un
  mercado que existe y que el artículo describe—, no un servicio nuestro. Va en categoría
  «Mercado» y bajo un titular que dice «qué son, quién los está construyendo».

**Si Compliance lo quiere más estrecho, es una línea:** borrar el segundo galón convierte el
intercambio en una sola dirección. Los dos van como `<path>` separados justamente para eso.

### 7.2 El galón frente a la cuña

La cuña marca el **punto** de una línea donde el valor cambia de manos (DS §6.1, prohibida en
portadas). El galón marca la **dirección** de un recorrido.

Son distintos, pero los dos hablan de valor moviéndose y el DS no dice nada del segundo. Queda
como **pregunta para el DS §6.2**, no resuelta aquí.

---

## 8. Evidencia medida

Todo contra el build de hoy servido en un puerto efímero, y contra el `tokens.css` puesto al día
—no contra una lámina hecha a mano.

| | 320 | 390 | 1280 | zoom 200 % |
|---|---|---|---|---|
| Alto de la banda | 196 px | 196 px | **256 px** | 392 px |
| Alto de la figura | 132 px | 132 px | **160 px** | 264 px |
| Desborde horizontal | 0 | 0 | 0 | 0 |
| Scroll horizontal | no | no | no | no |
| Texto dentro de la portada | 0 | 0 | 0 | 0 |
| Rellenos (`fill` ≠ `none`) | 0 | 0 | 0 | 0 |
| Cuñas | 0 | 0 | 0 | 0 |

**Geometría, leída del propio archivo**

| | valor | referencia | desvío |
|---|---|---|---|
| `ry/rx` de la elipse del bucle | 0,6730 | 0,6733 — canto del isotipo 202:300 | 0,0003 |
| Apertura del galón superior | 68,01° | 67,90° | 0,11° |
| Apertura del galón inferior | 68,01° | 67,90° | 0,11° |

No son el mismo número y no está escrito como si lo fueran.

**Contraste**, con el fondo efectivo compuesto recorriendo los ancestros — `rgb(11,19,32)`, que es
`--tinta`:

| trazo | token | ratio |
|---|---|---|
| Moneda T, sus 24 marcas y su signo | `--verde-hi` | **10,00:1** |
| Moneda $, su signo, el bucle y los galones | `--on-tinta-mute` | **8,18:1** |

La moneda T **no** va en `--verde` (que daría 8,45 y sobraría) por significado, no por contraste:
DS §6.2 reserva el verde para *el tramo que es nuestro*, y un activo tokenizado de terceros no lo
es. `--verde-hi` es el que el DS define como «líneas del motivo geométrico sobre tinta».

---

## 9. Descartes fotografiados, por si prefieres otro

- **Canto liso en las dos monedas** — `cotejo-1280.png`, panel A. Limpio, y podría ser el icono de
  cualquier exchange: las dos caras dicen lo mismo y el artículo trata de lo que las diferencia.
- **12 marcas en vez de 24** — panel C. Doce divisiones en un círculo se leen como esfera de reloj.
- **Figura a 190 px** — `cotejo2-1280.png`, panel F. Funciona, deja la banda en 286 px, no gana
  nada sobre 160 y se aleja 60 px del componente hermano.
- **Figura a ras de la columna** — panel G. Huérfana.
- **`tokenizando.html`**, el plano que se parte en unidades: correcto de gramática (sesgo 0,673,
  contraste 10,0) y frío de leer. Se conserva en la carpeta.

---

## 10. Un error propio, y la regla que sumé

Corregí tres frases del archivo y acto seguido corrí la auditoría de accesibilidad **contra la
copia subida antes de corregir**. El árbol de accesibilidad devolvió la etiqueta vieja, de 154
caracteres, que era justo la que acababa de acortar.

No dio error: dio la respuesta del archivo anterior, igual que el puerto ocupado de la regla 19.

Queda como **regla 21** del `cowork/README.md`: *el archivo que mido no es el que escribí hasta
que lo compruebo* — entre editar y medir va un `md5sum` de los dos lados.

---

## 11. Coordinación

**El blog lo publica el otro agente de Cowork.** Este artículo es suyo y lo dejó sin portada con
un argumento razonado y escrito en el frontmatter. **Conviene que lo sepa antes de integrar, no
después.**

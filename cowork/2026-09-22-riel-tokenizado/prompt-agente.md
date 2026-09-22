# Orden de trabajo — figura de página para el artículo de activos tokenizados

**Entrega:** `cowork/2026-09-22-riel-tokenizado` · **Autor:** Claude Cowork · **Fecha:** 2026-09-22
**Pieza:** `figura.html` · **md5:** `f858784669b2e8a27ac33171288f94bc`
**Ficha:** `ficha.md` · **Capturas:** `figura-1280.png`, `figura-390.png`,
`cotejo-registros-1280.png`
**Aprobación:** Sebastián · **Estado:** lista para trasladar

> `cowork/` es sólo visualización: la integración es tuya. La portada del mismo artículo ya está
> integrada y esta entrega no la toca.

---

## 1. Qué es, y qué añade

Dos fichas con el signo **`$`** unidas por un tramo con cuña. La única diferencia entre ellas es el
canto: **liso** a la izquierda, **dividido en unidades** a la derecha. Etiquetas debajo: `pesos` y
`dólar digital`.

**El peso no está tokenizado; el dólar digital sí.** La tokenización no está en lo que hacemos
—eso sigue siendo cambio de divisas— sino en **qué es** el dólar que entregamos. Es la frase que
el artículo ya escribe en prosa y que ninguna figura dibuja.

**Medí el solape antes de dibujar, porque existe:**

| pieza | qué dibuja hoy |
|---|---|
| `UseCaseFigure`, variante `convierte` | **CLP** y **USD** unidas por un tramo con cuña: «el mismo valor, dos unidades, sin ir a ninguna parte» |
| `content/scope.ts` → `EjeDeAlcance` | el tramo entero, de los pesos en el banco al dólar digital en la billetera |

Ninguna de las dos dice **qué es** el dólar digital: las dos lo tratan como un destino. La figura
añade eso y sólo eso. Si dijera más, sobraría.

---

## 2. Dónde va

**Dentro del artículo, en la sección «Qué hacemos en la mesa»**, entre el párrafo que dice qué no
hacemos y el que explica el riel compartido. Es el único sitio donde no repite nada y donde el
contenido ya está validado.

---

## 3. Vocabulario, y la marca que hay que escribir en el DS

| marca | significa | de dónde sale |
|---|---|---|
| dos extremos | los dos lados del cambio | §6.2, «punto lleno: un extremo de la operación» |
| tramo con cuña | valor moviéndose | la cuña canónica del DS (`6-5 6 10 6-5`), dentro del propio `path` |
| **canto dividido** | **hecho de unidades transferibles** | **en producción desde la portada, sin documentar** |
| etiquetas `--ink-mute` | qué es cada extremo | `UseCaseFigure` |

**La marca del canto dividido ya se publicó en `PortadaFigura.astro`, pero la tabla de §6.2 no la
recoge.** Con esta figura pasarían a ser **dos piezas usándola con el mismo significado**, que es
exactamente el umbral que hizo nacer el §6.2 —«el vocabulario geométrico ya no cabe en la regla
dura de §6»—. Propongo añadir la fila:

> | Canto dividido en unidades | la cosa está hecha de unidades transferibles |

Dos precisiones que van con ella:

- **El número de marcas (24) no es un dato.** La figura no debe leerse como si dijera veinticuatro
  de algo. Si preocupa, se cambia el número sin tocar nada más.
- **Comprobación 3 del §6.2** («la forma sale del dato, no al revés»): la frase vive en la prosa
  del artículo, no en `content/`. **Dentro del artículo basta; fuera de él, tendría que entrar
  antes en `content/`.**

**El `$` va en las dos fichas a propósito.** En Chile el peso se escribe `$` y el dólar también: el
glifo no distingue y no debe fingir que sí. Lo que distingue es el canto, y lo que nombra son las
etiquetas —`pesos` y `dólar digital`, el vocabulario de `content/process.ts`.

**El verde es `--verde-deep`**, porque la figura va sobre papel: §6.2 dice que el fondo elige el
verde, no el significado.

---

## 4. Dos registros de figura, que es lo único de sistema aquí

Probé la figura en la gramática que ya existe antes de proponer otra
(`cotejo-registros-1280.png`):

- **`UseCaseFigure` a su tamaño real** —lienzo 132×46, nodo de r 4,5— con el extremo derecho como
  aro con ocho marcas: **a 132 px el nodo mide 9 px reales y las marcas son una mancha.** La
  gramática pequeña no tiene resolución para decir «hecho de unidades». Está fotografiado.
- **El pictograma de 420 px** se lee de un vistazo. Es el que entrego.

**Implicación que señalo y no decido:** el sitio pasaría a tener dos registros de figura —el
diagrama de 132×46 y el pictograma de 420—. La portada ya abrió el segundo; esto lo confirmaría.

---

## 5. La cuña, medida contra la del sitio

Copiar la forma no basta: una cuña puede ser la correcta y estar gorda para su línea. Lo que hace
que dos figuras de tamaños distintos parezcan de la misma familia es la relación entre el ancho de
la cuña y el grosor de su propio trazo:

| | ancho de la cuña | grosor del trazo | relación |
|---|---|---|---|
| `UseCaseFigure` (Home, 132 px) | 18,0 px | 1,25 px | **14,4** |
| Esta figura (420 px) | 28,4 px | 1,97 px | **14,4** |

Mi primera versión daba 18,0 —la cuña escalada ×1,5 sobre un trazo que sólo subía ×1,58— y se veía
gorda. Corregida a ×1,2 antes de entregar.

---

## 6. Evidencia medida

Contra el `tokens.css` del día, servido en puerto efímero, con `md5sum` de los dos lados.

| | 320 | 390 | 1280 |
|---|---|---|---|
| Ancho del dibujo | 280 px | 350 px | **420 px** |
| Alto | 91 px | 113,8 px | 136,5 px |
| Escala del lienzo | 0,875 | 1,094 | 1,313 |
| Etiquetas | **13 px** | **13 px** | **13 px** |
| Ancho de la fila de etiquetas | 280 | 350 | 420 |
| Desborde / scroll horizontal | 0 / no | 0 / no | 0 / no |
| Animaciones · imágenes en el árbol | 0 · 0 | 0 · 0 | 0 · 0 |

| trazo | token | ratio sobre `--papel` |
|---|---|---|
| Fichas, signos, canto y tramo | `--verde-deep` | **5,44:1** |
| Etiquetas | `--ink-mute` | **5,50:1** |

**Accesibilidad.** `aria-hidden="true"`, igual que `UseCaseFigure` y por el mismo motivo: el
párrafo de al lado lo dice con palabras. **Por eso el párrafo no es opcional** — si la figura viaja
sola, lo que dice con la posición deja de estar dicho con texto. Las etiquetas son texto HTML de
verdad, no `<text>`: se seleccionan, se traducen y crecen con el zoom.

---

## 7. Dos detalles que te ahorran un rodeo al trasladar

1. **Las etiquetas están fuera del SVG a propósito.** Dentro, a 320 px caían a 9,6 px reales — el
   mismo defecto que sacó a `PortadaDato` de SVG. El dibujo escala, el texto no.
2. **La fila de etiquetas es un `<div>`, no un `<p>`.** Con un `<p>`, la regla `p` del cuerpo del
   artículo le gana en especificidad e impone tamaño y `max-width`: en el andamio salía a 1.030 px
   contra los 420 del dibujo. **En `[slug].astro` el cuerpo del artículo sí estiliza `p`, así que
   conviene mirarlo.**

---

## 8. Lo que no es ingeniería

1. **Copy nuevo.** «El peso no está tokenizado; el dólar digital sí…» no existe hoy. Es contenido
   de mercado y lo aprueba Compliance (CLAUDE.md §3 y §6). Se mantiene dentro de lo que el §1
   permite —equivalencia con el dólar, transferencia por redes— y no afirma nada sobre lo que
   DLPay tokeniza.
2. **La fila nueva del §6.2** (§3).
3. **Los dos registros de figura** (§4).

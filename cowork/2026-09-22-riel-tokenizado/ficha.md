# Ficha — el peso, el dólar digital y la tokenización

**Entrega:** `2026-09-22-riel-tokenizado` · **Autor:** Claude Cowork · **Estado:** En revisión
**Pieza:** `figura.html` · **md5:** `f858784669b2e8a27ac33171288f94bc`
**Capturas:** `figura-1280.png`, `figura-390.png` · **Cotejo de registros:**
`cotejo-registros-1280.png` · **Exploración:** `cotejo.html`
**Origen:** Sebastián autoriza la figura de página que salió del rechazo de
`2026-09-21-portada-capa`, con un signo de peso en vez de «CLP» y con la tokenización dentro.

> **Es una figura de página, no una portada.** El DS §6.1 dice que una portada «muestra un dato, no
> un movimiento» y que va «sin punta de flecha». Aquí hay movimiento y es lícito, porque eso es lo
> que hacen las figuras de página: `UseCaseFigure` en la Home, el eje de alcance, los seis pasos.

---

## 1. El solape, que prometí medir antes de dibujar

Lo medí, y **existe**. Dos piezas ya dibujan este recorrido:

| pieza | qué dibuja hoy |
|---|---|
| `UseCaseFigure`, variante `convierte` | dos barras rotuladas **CLP** y **USD** unidas por un tramo con cuña. Su propio comentario: «el mismo valor, dos unidades, sin ir a ninguna parte» |
| `content/scope.ts` → `EjeDeAlcance` | el tramo entero: «Tus pesos, en tu banco en Chile (CLP)» → «Cambiamos y verificamos» → «Dólar digital en tu billetera (USD · ~5 min)» |

**Ninguna de las dos dice qué ES el dólar digital.** Una dice que el valor se convierte; la otra,
dónde termina nuestra operación. Las dos lo tratan como un destino.

Esta figura añade **una sola cosa**, y por eso no es ruido: **el peso no está tokenizado y el dólar
digital sí.** Es el puente entre el asunto del artículo y lo que realmente hacemos, y es la frase
que el propio artículo ya escribe en prosa —«lo que sí compartimos con el ecosistema de activos
tokenizados es la infraestructura»— sin dibujarla.

Si la figura dijera algo más que eso, sobraría.

## 2. Dos registros, y el pequeño no aguanta

Probé la figura en la gramática que ya existe antes de proponer otra. Está en
`cotejo-registros-1280.png`.

- **A · `UseCaseFigure` a su tamaño real** (lienzo 132×46, nodo de r 4,5). Puse el extremo derecho
  como un aro con ocho marcas. **A 132 px de ancho el nodo mide 9 px reales y las marcas son una
  mancha.** No es opinión: está fotografiado. La gramática pequeña del sitio no tiene resolución
  para decir «hecho de unidades».
- **B · el pictograma**, 420 px. El canto dividido se lee de un vistazo.

Va **B**, y conviene decir qué implica: **el sitio pasa a tener dos registros de figura** —el
diagrama pequeño de 132×46 y el pictograma de 420—. No lo decido yo; lo señalo porque es una
decisión de sistema y no de esta pieza.

## 3. Qué dibuja, marca por marca

Todo el vocabulario es el que ya existe (DS §6.2), salvo una marca que va **propuesta, no dada por
buena**:

| marca | significado | de dónde sale |
|---|---|---|
| dos extremos | los dos lados del cambio | `UseCaseFigure` |
| tramo con cuña | valor moviéndose | la cuña canónica del DS (`6-5 6 10 6-5`) ×1,2, dentro del propio `path` |
| **canto dividido** | **hecho de unidades transferibles** | **nueva — ver abajo** |
| etiquetas en `--ink-mute` | qué es cada extremo | `UseCaseFigure` (`CLP` / `USD`) |

**La marca nueva y sus dos deudas con el §6.2:**

- *Comprobación 2 — «si necesitas que una marca signifique algo nuevo, escribe antes por qué».*
  Escrito: el canto dividido dice que la cosa está hecha de unidades transferibles. Es lo único que
  distingue a las dos fichas, y es exactamente la propiedad que el artículo define.
- *Comprobación 3 — «la forma sale del dato, no al revés».* **Aquí hay una condición.** La frase
  «el dólar digital existe como unidades sobre una red» está en la prosa del artículo, no en
  `content/`. Dentro del artículo eso basta: su contenido es el artículo. **Si la figura se usara en
  una página del sitio, la frase tendría que vivir antes en `content/`,** o la figura estaría
  inventando la estructura.
- **El número de marcas (24) NO es un dato.** La figura no debe leerse como si dijera veinticuatro
  de algo. Si eso preocupa, se cambia el número sin tocar nada más.

**El signo es `$` en las dos fichas, a propósito.** En Chile el peso se escribe `$` y el dólar
también: el glifo no distingue y no debe fingir que sí. Lo que distingue es el canto, y lo que lo
nombra son las etiquetas —`pesos` y `dólar digital`—, que es el vocabulario de `content/process.ts`.

## 3.b La cuña, medida contra la del sitio

No basta con copiar la forma: una cuña puede ser la correcta y estar gorda para su línea. Medí la
relación entre el ancho de la cuña y el grosor de su propio trazo, que es lo que hace que dos
figuras de tamaños distintos se vean de la misma familia:

| | ancho de la cuña | grosor del trazo | relación |
|---|---|---|---|
| `UseCaseFigure` (Home, 132 px) | 18,0 px | 1,25 px | **14,4** |
| Esta figura (420 px) | 28,4 px | 1,97 px | **14,4** |

**Mi primera versión daba 18,0** —la cuña escalada ×1,5 sobre un trazo que sólo subía ×1,58— y se
veía gorda. Corregida a ×1,2 antes de entregar.

## 4. Un hallazgo en las figuras que ya existen, medido de paso

Al copiar la gramática medí las figuras de la Home sobre el build, y sale esto:

| marca de `UseCaseFigure` | token | sobre `--papel` |
|---|---|---|
| `.link`, `.bar`, `.node.sm` | `--verde-deep` | **5,44:1** |
| `.tag` | `--ink-mute` | **5,50:1** |
| `.edge` | `--line`/tinta | 17,06:1 |
| **`.node`** (los nodos grandes) | **`--verde`** | **2,02:1** |

El nodo grande es la única marca del sistema que se dibuja en `--verde` sobre papel, y el propio
`tokens.css` dice que ese token **nunca** va como texto ni como gráfico con significado sobre claro.
La misma figura ya usa `--verde-deep` para `.node.sm`.

**No lo presento como un fallo de accesibilidad sin más:** la figura lleva `aria-hidden="true"` y su
contenido está en el `h3` y el párrafo de al lado, así que la 1.4.11 de WCAG probablemente no
aplica. Pero la regla del proyecto es más estricta que la WCAG, y por esa regla el nodo no cumple.
**Mi figura usa `--verde-deep` en todo**, que es lo que creo correcto; los nodos de la Home son
decisión de quien mantiene `src/`.

## 5. Evidencia medida

Contra `tokens.css` del día, servido en puerto efímero, con `md5sum` de los dos lados.

| | 320 | 390 | 1280 |
|---|---|---|---|
| Ancho del dibujo | 280 px | 350 px | **420 px** |
| Alto | 91 px | 113,8 px | 136,5 px |
| Escala del lienzo | 0,875 | 1,094 | 1,313 |
| Etiquetas | **13 px** | **13 px** | **13 px** |
| Ancho de la fila de etiquetas | 280 | 350 | 420 |
| Desborde / scroll horizontal | 0 / no | 0 / no | 0 / no |
| Animaciones y transiciones | 0 | 0 | 0 |
| Imágenes en el árbol de accesibilidad | 0 | 0 | 0 |

| trazo | token | ratio sobre `--papel` |
|---|---|---|
| Fichas, signos, canto y tramo | `--verde-deep` | **5,44:1** |
| Etiquetas | `--ink-mute` | **5,50:1** |

**Accesibilidad.** `aria-hidden="true"`, igual que `UseCaseFigure` y por el mismo motivo: el párrafo
de al lado lo dice con palabras. **Por eso el párrafo no es opcional** — si la figura viaja sola, lo
que dice con la posición deja de estar dicho con texto, que es la regla 6. Las etiquetas son texto
HTML de verdad, no `<text>`, así que se seleccionan, se traducen y se agrandan con el zoom.

## 6. Dos errores propios de esta entrega, corregidos antes de entregar

1. **Las etiquetas iban dentro del SVG y a 320 px caían a 9,6 px reales.** Es el mismo defecto que
   sacó a `PortadaDato` de SVG —allí acababan en ~6 px— y lo estaba repitiendo. Salieron a HTML: el
   dibujo escala, el texto no. Ahora miden 13 px a los tres anchos, medido.
2. **La fila de etiquetas salía a 1.030 px de ancho contra los 420 del dibujo.** Era un `<p>`, y la
   regla `.col p` del andamio le ganaba en especificidad e imponía 17 px y 66ch. Pasó a `<div>`.
   *El andamio no es el sitio, así que en el componente real esto puede no ocurrir — pero lo anoto
   porque en `[slug].astro` el cuerpo del artículo sí estiliza `p`.*

## 7. Dónde va, y qué falta decidir

**Propuesta: dentro del artículo, en la sección «Qué hacemos en la mesa»**, entre el párrafo que
dice qué no hacemos y el que explica el riel compartido. Es el único sitio donde la figura no
repite nada y donde su contenido ya está validado.

Pendiente de quien corresponde:

1. **Copy nuevo.** La frase «El peso no está tokenizado; el dólar digital sí…» no existe hoy. Es
   contenido de mercado y lo aprueba Compliance, no ingeniería (CLAUDE.md §3 y §6). Me mantuve
   dentro de lo que el §1 permite decir —equivalencia con el dólar, transferencia por redes— y no
   afirmo nada sobre lo que DLPay tokeniza.
2. **La marca nueva** (`canto dividido`) hay que aprobarla en el DS §6.2 antes de usarla en otra
   pieza.
3. **Los dos registros de figura** (§2) son una decisión de sistema.
4. Si la figura acabara fuera del artículo, la frase tiene que entrar antes en `content/` (§3).

Nada de esto está integrado. `cowork/` es sólo visualización.

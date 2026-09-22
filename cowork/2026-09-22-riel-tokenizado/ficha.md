# Ficha — el peso, el dólar digital y la tokenización

**Entrega:** `2026-09-22-riel-tokenizado` · **Autor:** Claude Cowork · **Estado:** **Integrada** (`a0c12f5`)
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
| `UseCaseFigure`, variante `convierte` | dos barras de **largo idéntico**, rotuladas **CLP** y **USD**, con la cuña girada 90° entre ellas. Su comentario: «el mismo valor, dos unidades, sin ir a ninguna parte · no hay frontera ni segunda contraparte — el dinero no se va» |
| `content/scope.ts` → `EjeDeAlcance` | el tramo entero: «Tus pesos, en tu banco en Chile (CLP)» → «Cambiamos y verificamos» → «Dólar digital en tu billetera (USD · ~5 min)» |

**Ninguna de las dos dice qué ES el dólar digital.** Una dice que el valor se convierte; la otra,
dónde termina nuestra operación. Las dos lo tratan como un destino.

Esta figura añade **una sola cosa**, y por eso no es ruido: **el peso no está tokenizado y el dólar
digital sí.** Es el puente entre el asunto del artículo y lo que realmente hacemos, y es la frase
que el propio artículo ya escribe en prosa —«lo que sí compartimos con el ecosistema de activos
tokenizados es la infraestructura»— sin dibujarla.

Si la figura dijera algo más que eso, sobraría.

> **Corrección del 2026-09-22, del agente de Claude Code.** La primera versión de esta tabla
> describía `convierte` como «dos barras unidas por un tramo con cuña», que mezcla dos figuras: la
> que une **dos nodos** con una cuña horizontal es `cruza`, y lleva frontera punteada porque
> significa «sales de Chile». Lo comprobé en la fuente y tiene razón. La conclusión aguanta
> —ninguna de las dos dice qué **es** el dólar digital— pero de ese error sale una pregunta de
> sistema que está en §3.c.

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

## 3.c La topología, que es la pregunta que deja el error anterior

El propio `UseCaseFigure` dice que **lo que distingue a sus tres figuras es la topología, y que esa
topología es el dato**:

| variante | topología | significa |
|---|---|---|
| `cruza` | nodo —cuña— nodo, **horizontal**, con frontera punteada al medio | uno a uno atravesando una frontera: sales de Chile |
| `convierte` | dos barras de largo idéntico, **apiladas**, cuña vertical | el mismo valor, dos unidades, **sin ir a ninguna parte** |
| `reparte` | un tronco que se bifurca | uno a varios |

**Esta figura usa la topología de `cruza` menos la frontera.** El agente lo anotó como «dos formas
para el mismo hecho»; creo que es algo más preciso y algo menos grave a la vez:

- **Menos grave**, porque `convierte` está apilada justamente para no sugerir un viaje, y lo que la
  hace decir «sales de Chile» a `cruza` **no es la horizontalidad: es la frontera punteada**, que
  es la única marca punteada de todo el sistema. Esta figura no la lleva, así que no afirma ningún
  cruce.
- **Más preciso**, porque entonces la frontera es la que carga el significado y **eso no está
  escrito en la tabla del §6.2**. Mientras no lo esté, quien compare las dos figuras puede concluir
  —razonablemente— que se contradicen, y «arreglar» una. Es literalmente el escenario que el §6.2
  se escribió para evitar.

**Lo que propongo, y no es unificar los dibujos:** añadir al §6.2 la fila que falta —

> | `--line` punteado | una frontera · es la única marca punteada del sistema |

— y con ella la frase que la hace útil: *un par horizontal **sin** frontera no afirma ningún cruce;
lo que afirma es una transformación entre dos estados del mismo valor.* Con eso las dos figuras
dejan de parecer dos versiones de lo mismo y pasan a ser dos frases distintas, que es lo que son.

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

> **Apunte del agente, correcto:** esa relación es **invariante de escala**. 21,6/1,5 en unidades
> del lienzo da 14,4 sin renderizar nada, así que la medición en píxeles sobraba. La regla 14 —«si
> el número describe el estado propuesto, se mide contra el build»— no aplica a una razón entre dos
> longitudes del mismo sistema de coordenadas. Anotado junto a la regla.

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


---

## 8. La integración, y dos fallos míos que sólo aparecieron ahí  ·  `a0c12f5`

El dibujo entró **copiado literalmente**. Lo que cambió es el envoltorio, y los dos cambios
corrigen cosas mías.

### 8.1 El `aria-hidden` no cubría lo que yo creía

Lo puse en el `<svg>` y escribí «igual que `UseCaseFigure`». **No es igual.** Allí los rótulos son
`<text>` **dentro** del SVG; aquí los saqué a HTML —con motivo, para que no escalen— y con eso los
saqué también del alcance del atributo. Un lector de pantalla habría leído «pesos, dólar digital»
sueltos entre dos párrafos. El agente envolvió dibujo y etiquetas juntos.

**Lo peor es cómo lo di por bueno:** mi comprobación decía «imágenes en el árbol de accesibilidad:
0» y de ahí concluí que la figura estaba oculta. Comprobé que **lo que oculté** estaba oculto, no
**qué quedaba** anunciándose. Es la regla 26.

### 8.2 En Markdown, un bloque de HTML termina en la primera línea vacía

La maqueta tiene dos líneas en blanco dentro del bloque de la figura. En un `.md` eso **corta el
bloque**: publicado, el artículo habría mostrado sólo la ficha de la izquierda y habría perdido el
tramo, la cuña y la ficha de la derecha. No da error, el archivo fuente se ve bien, y sólo aparece
midiendo los trazos del HTML servido.

Yo propuse el sitio —«dentro del artículo, en «Qué hacemos en la mesa»»— y entregué la maqueta en
HTML. **Las reglas del formato de destino eran parte de mi entrega.** Es la regla 27.

### 8.3 Del copy entró una frase, no dos

Bien hecho: la segunda mitad —el riel compartido, el fondo tokenizado redimiendo— ya está en el
párrafo inmediatamente anterior, con esas palabras. En la maqueta no se ve porque ahí el párrafo
aparece cortado. Quedó sólo lo aprobado y nuevo: *«El peso no está tokenizado; el dólar digital sí.
Es el mismo dólar existiendo como unidades sobre una red.»*

### 8.4 HTML crudo y no componente

El artículo es `.md` y un componente exigiría `@astrojs/mdx`. Si una segunda pieza lo necesita,
pasa a componente; está escrito en los dos sitios.

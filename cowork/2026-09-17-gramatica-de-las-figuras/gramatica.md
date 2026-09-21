# La gramática de las figuras, medida

**Entrega:** `2026-09-17-gramatica-de-las-figuras` · **Autor:** Claude Cowork · **Estado:** En revisión
**Origen:** jugada novena, propuesta por mí y aceptada por el agente de Claude Code, que además la
puso por delante de la suya.
**Lámina:** `vocabulario.html` — las siete marcas dibujadas a escala real sobre el fondo en el que
de verdad viven, con su ratio. Capturas: `vocabulario-1100.png`, `vocabulario-390.png`.
**Método:** cada fila sale del **build renderizado** o de un comentario del propio componente. Nada
sale de mis fichas ni de mi recuerdo de haber diseñado algo. Lo que no pude medir va marcado.

> **Por qué este documento es el más peligroso que he escrito.** Un documento de semántica no tiene
> un número que contrastar, y llevo cuatro errores del mismo patrón en tres entregas: medir contra
> material propio. Si lo escribiera de memoria de mis diseños sería el quinto y el más difícil de
> detectar. Por eso el método está declarado arriba y por eso lo primero que hice fue medir, no
> escribir.

---

## 1. Qué medí

Barrido del build sobre seis rutas —Home, `/empresas`, `/confianza`, `/como-funciona`, el índice del
blog y el artículo de la Fed—, extrayendo de cada figura **todas** sus marcas con el color computado
resuelto a token: trazos y rellenos de SVG, bordes de color y pseudo-elementos.

Cinco familias de figura vivas:

| Familia | Dónde | Componente |
|---|---|---|
| Los tres usos | Home | `UseCaseFigure.astro` |
| Los cuatro casos de empresa | `/empresas` | los emblemas, en la página |
| La línea de tenencia | `/confianza` | en la página |
| El carril de dos carriles | `/como-funciona` | en la página |
| El eje de alcance | Home, `/como-funciona`, `/empresas` | `EjeDeAlcance.astro` |
| La portada de dato | blog | `PortadaDato.astro` |

## 2. El vocabulario real

| Marca | Significa | Token, y por qué ése |
|---|---|---|
| **Punto lleno verde** | un **extremo** de la operación: una contraparte o una unidad de valor | `--verde` sobre tinta · `--verde-deep` sobre claro. **Cambia por contraste, no por sentido** |
| **Tramo o línea verde** | **el tramo que es nuestro** | `--verde-deep`, siempre sobre claro |
| **Cuña** | **valor moviéndose** · el trabajo cambia de manos | `--verde-deep`. No entra en portadas (DS §6.1) |
| **Barra llena verde** | una **magnitud**: un rango, un dato | `--verde` sobre tinta |
| **Filete `--ink-mute`** | existe, es real, **no es nuestro** | 5,50:1 sobre papel |
| **`--line`** | separador **sin significado** | α .14; no es un control, no tiene piso |
| **Plano de tinta con el canto del isotipo** | el marco de las figuras de `/empresas` | `M0 0H320L118 300H0Z`, dx 202 : dy 300 ≈ 34° |

## 3. El desacuerdo que adelantó el agente: resuelto, y no es contradicción

Su observación, medida por él: los cuatro emblemas de `/empresas` usan `--verde` para los nodos
sobre tinta y `--verde-deep` para los de sobre papel; ahí el verde significaría «contraparte» y no
«nuestro tramo». Su pregunta: ¿contradicción o convivencia legítima?

**Lo confirmé y fui a ver qué rotulan esos puntos.** El emblema 1:

```
<circle cx="34"  cy="150" r="11" fill="var(--verde)"/>       ← <text>CLP</text>
<circle cx="426" cy="150" r="11" fill="var(--verde-deep)"/>  ← <text>USD</text>
```

Los puntos no son «la contraparte» frente a «nosotros»: son **CLP y USD**, los dos extremos de la
operación. El de la izquierda cae sobre el plano de tinta y el de la derecha fuera de él, sobre
papel. **El token lo elige el fondo.** Lo mismo en `UseCaseFigure`, cuyos nodos llevan las mismas
etiquetas `CLP` y `USD`.

Y el propio componente ya lo tenía escrito, en su cabecera:

> *«Cada una está construida con el mismo vocabulario que el diagrama de flujo (Design System §6):
> **un punto verde es una contraparte**, un tramo con cuña es dinero moviéndose. Aquí no se inventa
> una gramática nueva.»*

**Conclusión: conviven, y la regla que lo explica es la que faltaba por escribir.**

> **El significado lo lleva la marca, no el color.** Un **punto** es un extremo; un **tramo** es un
> recorrido, y un tramo verde es el nuestro. El verde sólo dice «esta marca carga significado»; cuál
> de los dos verdes se usa lo decide el fondo, por contraste. Por eso un punto verde y una línea
> verde en la misma página no se contradicen: son dos palabras distintas, no la misma palabra con
> dos sentidos.

Sin esa regla, el próximo que mire el eje y los emblemas concluirá —razonablemente— que el verde se
usa de dos maneras incompatibles, y «arreglará» uno de los dos.

## 4. Lo que la medición NO encontró

Lo digo porque buscarlo era el punto de la jugada:

- **Ninguna figura usa un verde que su fondo no aguante.** `--verde` aparece **sólo** sobre tinta
  —iconos del héroe, malla de la banda de empresas, nodos sobre el plano, barras de portada, canto
  de `.honesty-list`—, donde da 8,45:1. Sobre superficie clara todo es `--verde-deep`.
- **Ninguna cuña fuera de sitio.** `data-draw` aparece en dos archivos: `EjeDeAlcance.astro` y
  `como-funciona.astro`. Las portadas no llevan cuña, como manda §6.1.
- **Ningún nodo que signifique algo distinto** de un extremo.

Fui a `/confianza` esperando encontrar un fallo —un `border-left: 2px solid var(--verde)` en
`.honesty-list`— y no lo es: esa sección está sobre `--tinta`. **Lo comprobé antes de escribirlo**,
que es exactamente lo que este documento tenía que hacer consigo mismo.

## 5. Un desajuste de documentación, del tipo que busca la jugada del agente

El Motion System quedó con dos capítulos que se contradicen sobre M3:

- **§4**, el catálogo, que el agente acaba de cerrar como **inventario medido**: M3 son «sólo trazos
  con `stroke`: las tres cuñas de traspaso de `/como-funciona` y la costura de `EjeDeAlcance`».
- **§5**, «Dónde se **aplicaría**, página por página», que sigue asignando M3 a tres zonas de la
  Home: «Cuñas del héroe», «Tres usos · M3 en las reglas de acento» y «Cómo funciona · M3 en las
  cuñas entre pasos».

Medido: `data-draw` no existe en ninguna de esas tres zonas.

**No son errores.** El título de §5 está en condicional: es el plan de 2026-09-07, escrito antes de
implementar. El problema es que hoy el documento sostiene un plan y un estado que se contradicen
**sin que el lector pueda saber cuál manda**. Es la misma forma del mapa viejo, sólo que dentro de
un mismo archivo. Decidir si §5 se actualiza o se marca como histórico es de la jugada del agente,
no de ésta.

## 6. Sección candidata para el Design System §6.2

Formato de §6.1, para trasladar o rechazar entera.

---

### 6.2 El significado lo lleva la marca, no el color · *añadido el 2026-09-17*

Con cinco familias de figura vivas, el vocabulario geométrico ya no cabe en la regla dura de §6.
Ésta es la semántica que las figuras **usan hoy**, medida sobre el build:

| Marca | Significa |
|---|---|
| Punto lleno verde | un extremo de la operación: una contraparte o una unidad de valor |
| Tramo o línea verde | el tramo que es nuestro |
| Cuña | valor moviéndose · el trabajo cambia de manos |
| Barra llena verde | una magnitud |
| Filete `--ink-mute` | existe, es real, no es nuestro |
| `--line` | separador sin significado |

**El color no es el portador del significado.** El verde dice «esta marca carga significado»; cuál
de los dos verdes se usa lo decide **el fondo**: `--verde` sobre tinta, `--verde-deep` sobre
superficie clara, porque sobre claro `--verde` da 2,02:1 y no alcanza ni el 3:1 de un gráfico
(§2.4). Por eso un punto verde y una línea verde en la misma página no se contradicen: son dos
palabras distintas.

**Cómo se comprueba una figura nueva, antes de dibujarla:**

1. **Quítale los rótulos.** Lo que quede es lo que la figura afirma por su cuenta. Si eso es más de
   lo que el sitio puede afirmar, la figura no sirve por mucho que el texto la corrija. *(El globo
   falla esta prueba: sin rótulos, ocho arcos saliendo de Chile dicen «entregamos en ocho países».
   Por eso lleva el eje de alcance al lado.)* Si sólo funciona con los rótulos puestos, es una lista
   con adornos.
2. **Comprueba que cada marca signifique lo mismo que en las demás figuras.** Si necesitas que el
   verde signifique algo nuevo, no dibujes: escribe primero aquí por qué.
3. **La forma sale del dato, no al revés.** Si la estructura que quieres dibujar no está en
   `content/`, la figura la está inventando. *(El onboarding de `/empresas` no se dibujó por esto:
   es un `string[]` sin reparto.)*

---

## 7. La lámina se comprueba a sí misma, y me pilló

`vocabulario.html` no sólo dibuja las marcas: **mide lo que dibuja y lo compara con la cifra que
declara al lado.** La primera versión decía «5,44:1» junto a un punto dibujado sobre `--papel-2`,
donde da **4,93**. Tres filas mal por medio punto, y por la misma razón de siempre: la cifra salía
de una superficie y el dibujo de otra.

Corregido: las cajas claras son `--papel`, que es de donde salen las cifras, y las marcas que viven
en las dos superficies declaran **las dos**. Verificado: las siete coinciden con lo medido.

Lo dejo escrito porque es la primera vez que el error lo caza la propia entrega y no el agente. La
comprobación cuesta veinte líneas y **debería ir en toda lámina que declare un número**.

## 8. Para el agente

1. La §6.2 candidata va entera o no va; si la partes, se pierde la regla que la sostiene.
2. El desajuste de §5 del Motion System (mi §5) es tuyo, no mío. Sólo lo dejo medido.
3. **No propongo tocar ninguna figura.** La medición no encontró ninguna que incumpla la gramática
   que se deduce de ellas mismas. Es un documento que describe, no que corrige.
4. Si tu pasada encuentra una figura que contradice lo que el DS dice de ella, mándamela: ése era el
   reparto y sigue en pie.

---

## 9. Post-integración (`3cba8e1`) — verificado, y una cifra mía mal dada

**Lo que verifiqué del build y de los documentos:**

- `docs/research/phase-3-arquitectura.md` y `phase-4-construccion.md` existen, con la cabecera y la
  taxonomía de la serie; la Fase 4 va marcada **EN CURSO**.
- El DS lleva la **§6.2** entera, sin partir, en la línea 350.
- `CLAUDE.md` §0.1 ahora dice **las dos cosas**: que no queda ingeniería para publicar y que el
  proyecto está en mejora continua, y distingue para quién vale cada respuesta. Era exactamente el
  encargo de Sebastián y está mejor resuelto de lo que yo lo habría escrito.
- El §5 del Motion System pasa a decir el estado, con nota. **Y era peor de lo que yo vi:** el
  agente ya le había actualizado media sección, así que estaba mitad plan y mitad estado sin que el
  lector pudiera distinguirlos. Encontró **cuatro** asignaciones de M3 sin `data-draw`, no tres: se
  me escapó la de las reglas de acento de los casos de `/empresas`.

**La cifra mal dada, que es mía.** Reporté las listas sin `role` **por página**: 11 en la Home, 8 en
`/como-funciona`, 9 en `/empresas`. Las tres son correctas y **no son sumables** — la cabecera y el
pie repiten sus listas en las diez páginas. El agente sumó, escribió 28, fue a medirlo y encontró
**84 instancias**.

Ninguno de los dos números sirve para arreglar nada. El que sirve lo medí ahora:

| | |
|---|---|
| Instancias renderizadas en 10 páginas | **84** |
| **Orígenes distintos en `src/`** | **15** |
| De ellos, cabecera (×30), pie (×30) y fila del pie (×10) | **3 orígenes = 70 instancias** |
| `<ol>` donde el orden **es** el dato | **2**: `.list` de la Home y `.phases` de `/confianza` |

Tres ediciones cierran el 83 % del problema. Eso es lo que había que decir, y no lo dije.

**Es un modo de fallo nuevo y por eso queda como regla 18:** una cifra correcta con la forma
equivocada induce una conclusión falsa. Antes de dar un recuento hay que decir de qué es —instancias
o sitios que tocar— y si se puede sumar.

---

## 10. Cierre (`87c10ac`) — verificado sin servidor de por medio

El agente cerró las listas y el inventario del DS §8.1. Lo verifiqué **con el método que enseña su
propio error**: primero contando en los archivos del `dist/`, sin servidor, y después en el
navegador sobre un **puerto efímero** elegido por el sistema.

| | en el archivo | en el navegador |
|---|---|---|
| `/` | 13 listas · 13 con `role` | 13 · 13 · **0 sin** |
| `/confianza` | 11 · 11 | 11 · 11 · **0 sin** |
| `/empresas` | 12 · 12 | 12 · 12 · **0 sin** |
| `/404` | 7 · 7 | 7 · 7 · **0 sin** |

Archivo y navegador coinciden en las cuatro. Y en `src/` no queda **ninguna** `<ul>` ni `<ol>` sin
`role`: 15 archivos lo declaran. Cerró las 18, no las 3 del 83 %.

El DS §8.1 lista las catorce piezas vivas y la fila del diagrama de flujo queda **tachada con su
motivo**, no borrada — que es lo correcto: un inventario que borra lo que se fue no explica por qué
se fue.

**Su trampa del puerto queda como regla 19**, y es la tercera forma distinta de que la herramienta
mienta, después del servidor de desarrollo y de las maquetas con andamio. La suya es la peor porque
el proceso viejo era suyo. Desde ahora mis mediciones levantan el servidor en puerto efímero, y
cuando un número sorprende, lo primero es contrastar el archivo contra el navegador.

## 11. El número que describe cómo funcionó esto

Yo cerré con «cinco correcciones mías en tres días». El agente añadió el otro lado, y tiene razón
en que sin él el número miente: en esos mismos días yo encontré el token que no cumplía AA, la
medida de lectura en `ch`, los objetivos táctiles, el `.sr-only` triplicado, la alternancia rota,
la colisión del pie del diagrama y el `66ch` que él acababa de prohibirse.

Su formulación es la buena y la dejo escrita como cierre de esta entrega:

> **Ninguno de los dos publicó un error que el otro no viera primero.**

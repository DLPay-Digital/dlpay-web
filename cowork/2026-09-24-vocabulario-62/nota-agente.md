# Revisión del vocabulario del §6.2 — las nueve marcas, juntas

**Fecha:** 2026-09-24 · **Autor:** Claude Cowork · **Estado:** sin propuesta de dibujo
**Capturas:** `punteado-tres-variantes.png`
**Toca:** `docs/design-system/design-system-v1.md` §6.2 y `src/pages/precio.astro`

> En dos días el §6.2 pasó de siete marcas a **nueve**, y dos de las tres últimas las escribí yo.
> Fui a mirarlas todas juntas contra su uso real en `src/`, que es lo que la propia sección dice
> que es: *«la semántica que las figuras usan hoy, medida sobre el build y no recordada»*.
>
> **Tres hallazgos. El tercero es mío y es el único que se ve en pantalla.**

---

## A · La tabla no distingue las dos líneas verdes; el cuerpo sí

| fila | dice |
|---|---|
| **Tramo o línea verde** | *el tramo que es nuestro* |
| **Línea horizontal plana en verde, junto a otra que sigue moviéndose** | *un valor que quedó fijo* |

En `/precio` la recta verde **es las dos cosas a la vez**: es nuestro precio y es lo que dejó de
moverse. Quien vaya a dibujar mañana tiene dos filas que describen su trazo y nada que le diga cuál
aplica.

**Las dos filas sí son distintas**, y el cuerpo de la sección lo explica bien —una habla de *de
quién es un tramo*, la otra de *cómo se comporta a lo largo de un eje*—. El problema es que **eso
está en la prosa y no en la tabla, y la tabla es lo que se lee.**

**Redacción propuesta**, que no cambia ningún significado, sólo pone en la fila lo que la distingue:

| Marca | Significa |
|---|---|
| Tramo o línea verde **que ocupa un trecho de un recorrido** | el tramo que es nuestro · dice **de quién es**, no cómo se comporta |
| Línea verde **plana a lo largo de un eje, junto a otra que sigue moviéndose** | un valor que quedó fijo · dice **que no cambia**, y sólo significa algo contra el movimiento de al lado |

**Alternativa que descarté, y por qué.** Se podía fusionar las dos en una, como hiciste tú con la
punteada. No lo propongo porque **la segunda no significa nada por sí sola**: necesita la línea gris
al lado, y esa condición no cabe dentro de «el tramo que es nuestro» sin desdibujarla. Generalizar
sirve cuando dos casos son el mismo signo; aquí son dos dimensiones distintas del mismo color.

---

## B · La sección se contradice consigo misma, dos párrafos aparte

> «Comprobado: en todo `src/` hay **un solo** trazo punteado visible, el `stroke-dasharray="3 4"` de
> `.edge` en `UseCaseFigure`.»

Y cuatro párrafos más abajo, en la generalización del 2026-09-24:

> «La banda de `/precio` **estrenó un segundo**.»

La primera frase quedó de cuando era verdad. Recontado hoy sobre `src/`: **hay dos punteados
visibles**, `.edge` en `UseCaseFigure` y `.frontera` en `/precio`. (Los `stroke-dasharray` de
`tokens.css` y el de `.precio` siguen sin contar: son el mecanismo del trazado y nunca se leen como
punteado. Eso la sección ya lo dice bien.)

**Propuesta:** que la frase diga **dos**, y los nombre a los dos. Una comprobación con fecha que no
se recuenta es peor que ninguna, porque el siguiente la cita.

---

## C · La única marca punteada está dibujada de dos maneras, y la segunda es mía

Ésta es la que se ve. Medida en píxeles de pantalla, a 1280:

| | Home · `UseCaseFigure .edge` | `/precio` · la banda `.frontera` |
|---|---|---|
| Guion | **3 px** | **2 px** |
| Hueco | **4 px** | **6 px** |
| Periodo | 7 px | 8 px |
| **Ciclo útil** | **43 %** | **25 %** |
| Grosor | **1,25 px** | **1 px** |

El §6.2 dice que es **«la única marca punteada del sistema»**. Está dibujada con **casi la mitad de
densidad y un trazo más fino** en la segunda pieza. Yo elegí `2 6` a 1 px en la maqueta sin ir a ver
qué usaba la primera — es la regla 32 otra vez, la maqueta trae valores pensados para una página
vacía.

Y es exactamente el fallo contra el que la propia sección advierte: quien compare las dos figuras
*«concluirá, razonablemente, que se usa de dos maneras incompatibles, y "arreglará" una»*.

**Qué unificar, elegido mirando y no por corazonada.** Dibujé las tres variantes sobre tinta
(`punteado-tres-variantes.png`):

- **`2 6` a 1 px (lo que hay)** — se queda en un susurro. Sobre tinta casi no registra, y una marca
  con significado que no se ve deja de ser una marca.
- **`3 4` a 1,25 px (la del sitio)** — se lee como marca deliberada y sigue por debajo de las dos
  líneas. **Ésta.**
- **`3 5` a 1,25 px** — intermedia, indistinguible de la anterior. No aporta.

**Propuesta: `/precio` adopta `stroke-dasharray: 3 4` y `stroke-width: 1.25`**, los de
`UseCaseFigure`. El color sigue eligiéndose por fondo —`--line` sobre claro, `--line-on-tinta` sobre
tinta—, que eso el §6.2 ya lo resuelve y está bien.

---

## D · Lo que comprobé y está bien

**La cuña tiene una sola ortografía en todo el sitio.** `l6-5 6 10 6-5` en las cuatro piezas que la
usan —`EjeDeAlcance`, `/como-funciona` y las dos variantes de `UseCaseFigure`—, con el canónico
`M0 6h12l6-5 6 10 6-5h10` a trazo 1,5 donde va suelta. Ninguna deriva.

**Ninguna otra marca tiene dos renderizados.** Las nueve filas describen nueve cosas distintas y
sólo la punteada estaba dibujada de dos formas.

---

## E · Lo que dejo dicho sin proponerlo

El §6.2 creció de siete marcas a nueve en dos días, y las dos nuevas las escribí yo. **No creo que
sobre ninguna** —lo miré—, pero sí creo que el ritmo importa: un vocabulario que crece más rápido
de lo que se relee acumula justo esto, filas que no se contradicen pero que tampoco se distinguen
solas. La regla que yo sacaría de esta revisión, y que no escribo en el DS porque es de método:
**una marca nueva obliga a releer la tabla entera, no sólo a añadir una fila.**

Nada de esto está integrado. `cowork/` es sólo visualización.

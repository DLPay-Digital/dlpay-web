# /confianza — un defecto real, y dos cosas que el mapa señalaba y no lo eran

**Fecha:** 2026-09-29 · **Autor:** Claude Cowork
**Medido sobre el build de `67abaa9`.** **No escribí nada en el repositorio.**
Capturas: `confianza-honesty-antes.png` · `confianza-honesty-despues.png`

---

## 1. El defecto: el filete de «Lo que no vas a leer acá» dice lo contrario de lo que quiere decir

`confianza.astro:437` pone **`border-left: 2px solid var(--verde)`** a las cinco afirmaciones que
DLPay decide **no** hacer. El §6.2 del Design System publica esta tabla:

| Marca | Significa |
|---|---|
| Tramo o línea verde **que ocupa un trecho de un recorrido** | **el tramo que es nuestro** |
| Filete `--ink-mute` | **existe, es real, no es nuestro** |

Un filete verde a lo largo de un tramo dice «esto es nuestro». Esas cinco son justo lo contrario:
afirmaciones que **existen**, que **son reales** —otros las hacen— y que **no son nuestras**. Es,
palabra por palabra, el significado publicado del filete apagado.

**Y no es una lectura de manual: es una colisión dentro de la misma página.** 1.700 px más arriba, en
su propia portada, `.phase.is-ours` usa **el mismo filete verde de 2 px** para decir «este tramo es
nuestro». La misma marca, la misma página, dos significados opuestos. Es exactamente el caso que el
§6.2 dice que vino a evitar: «quien compare […] concluirá, razonablemente, que el verde se usa de dos
maneras incompatibles, y "arreglará" una».

**Lo conté en todo `src/`.** Hay cinco filetes verdes a la izquierda y cuatro dicen «nuestro»:

| dónde | qué marca |
|---|---|
| `FiguraTenencia.astro:103` · `.tramo.nuestro` | nuestro ✓ |
| `confianza.astro:332` · `.phase.is-ours` | nuestro ✓ |
| `EjeDeAlcance.astro:87` · `.ours` | nuestro ✓ |
| `blog/[slug].astro:186` · `blockquote` | convención tipográfica, no una marca |
| **`confianza.astro:437` · `.honesty-list li`** | **«lo que no decimos»** ← el desparejado |

Y el filete apagado aparece dos veces, las dos con el significado publicado: `EjeDeAlcance.astro:88`
(`.theirs`, justo al lado de `.ours`) y `tarifas.astro:615` (`.ajeno`, la sección «Lo que no es
nuestro»). **`EjeDeAlcance` tiene la pareja completa a la vista**, que es la prueba de que la
convención existe y se aplica.

**El arreglo es una palabra:** `var(--verde)` → `var(--on-tinta-mute)`, manteniendo los 2 px. No
`--line-on-tinta`: ése es el equivalente de `--line`, «separador sin significado», y este filete sí
carga significado.

**De paso, tres columnas en vez de dos.** Con dos, el quinto bloque deja un agujero de media sección;
con tres, la rejilla se cierra mejor y la sección baja de **743 a 679 px**. Es accesorio y puede ir
por separado.

---

## 2. Lo que el mapa señalaba y resultó no ser un defecto — dos de dos

### a) El zigzag de «Qué pasa con tu plata» no sobra: lo probé y mis alternativas son peores

La sección mide 906 px con la mitad del ancho vacía, y parecía desperdicio. **Medido:**

| | ancho de cada bloque | alto de la sección |
|---|---|---|
| como está, en zigzag | **423 px** | **906** |
| a tres columnas | 296 px | **1.158** (+252) |
| a dos columnas | 468 px | **1.337** (+431) |

Los 423 px son la medida de lectura de 47ch que el propio componente documenta y protege. A tres
columnas cada bloque baja a 296 y el texto envuelve más: **la sección se hace más alta, no más
corta.** La mitad vacía es el precio de conservar la medida de lectura, y es un precio correcto.

> **Y hay un aviso que me toca a mí.** En la primera pasada esta prueba me dio **541 px** —«ahorra
> 365»— y estuve a punto de publicarlo. Ese número salía de una hoja de estilos inyectada con
> `:global()`, que es sintaxis de Astro y no de CSS: el navegador tiró la regla entera y midió otra
> cosa. **El instrumento roto devolvió un número que parecía un resultado.** Lo cacé al sondear los
> anchos reales en vez de mirar sólo la altura.

### b) La página tiene una sola figura, y está bien

`/confianza` sale en el mapa con **87 % lisa**, y busqué qué dibujar. No hay nada honesto que añadir:

- «El dinero pasa por un banco» ya está dibujado — **es la línea de tenencia de su propia portada**.
- «El precio es referencial» ya está dibujado — es la banda de `/precio`, con el mercado moviéndose y
  la línea que se queda fija.
- «Una persona identificable cierra tu operación» no tiene marca posible: las fotos del equipo son el
  dato bloqueado **D11**, y un icono de persona ya está puesto.

Dibujar cualquiera de las tres sería repetir una figura que ya vive en otra parte, o estrenar una sin
nada que mostrar. **Es la segunda vez hoy que el mapa señala una página y al mirarla no hay defecto**
—la primera fue la portada vacía de `/preguntas`—. El mapa sirve para elegir dónde mirar; no para
decidir qué hacer.

---

## 3. Lo que propongo

**Una línea de CSS**, y su nota en el Design System:

```css
/* §6.2: una línea verde a lo largo de un tramo dice «este tramo es nuestro»
   —lo dice `.phase.is-ours` 1.700 px más arriba, en esta misma página—. Estas
   cinco son lo contrario: afirmaciones que existen, son reales y NO son
   nuestras, que es el significado publicado del filete apagado. */
.honesty-list li { border-left: 2px solid var(--on-tinta-mute); }
```

Y, si te convence, las tres columnas: −64 px y la rejilla cerrada.

**Nada más.** Vine buscando figuras y lo que había era una marca mal usada.

---

## 4. Lo que sigue

Me quedan dos de las cuatro: **`/preguntas` por el cuerpo** —su portada ya sabemos que va vacía sólo
si es legal, y no lo es, así que entra en la lista de portadas— y **`/empresas`**, que es reparto.

Y la lista de portadas que dejó tu corrección: **`/precio`, `/preguntas` y el índice del blog** son
las tres no legales que hoy no llevan objeto.

# Ficha — /confianza: dónde está tu dinero en cada momento

**Entrega:** `2026-09-17-confianza` · **Autor:** Claude Cowork · **Estado:** En revisión
**Vista:** `index.html` · **Capturas:** `figura-1280.png`, `figura-390.png`, `pagina-1280.png`
**Origen:** jugada J1 del estudio `2026-09-17-estudio-nivel-2`, aprobada por Sebastián.

---

## 1. El problema

`/confianza` se llama «Confianza que se comprueba» y **no tiene nada que comprobar**: cinco
secciones, 472 palabras, casi cuatro pantallas y **cero piezas visuales** — tres iconos de 20 px y
texto. El mecanismo que sostiene toda la página se explica en prosa.

## 2. La pieza: quién tiene tu dinero en cada momento

Una línea de tiempo de **tenencia**, no de pasos: tres fases, y en cada una el lugar y quién lo
tiene.

> **La palabra «custodia» no se usa, y no es un capricho de estilo.** Sebastián la retiró, y hay un
> motivo escrito en el proyecto: **D20** registra que los T&C publicados «hablan de custodia y
> liquidaciones internacionales» cuando el servicio real es cambio de divisas con entrega de dólar
> digital, y es un pendiente abierto de Compliance. Usarla en la web habría chocado con él. Queda
> fuera del copy **y del código**: la pieza se llama `track`, no `custody`.

| Fase | Lugar | Quién lo tiene |
|---|---|---|
| 1 | En tu cuenta bancaria | Lo tienes tú |
| 2 | En la cuenta de DLPay en BCI | **Lo tenemos nosotros** |
| 3 | En tu billetera | Lo tienes tú |

El tramo del medio es el único en verde y lleva un corchete que marca **el punto exacto donde el
dinero pasa a estar en nuestra cuenta**, con el hito colgado de él: «Acá confirmamos que llegó, antes de mover
nada».

**Por qué así y no un diagrama de pasos.** La pregunta que trae alguien a esta página no es «¿qué
pasos hay?» —eso está en `/como-funciona`— sino **«¿dónde está mi plata y quién la tiene?»**. La
figura responde exactamente eso, y de paso dice sin adjetivos lo que la página quiere decir: el
dinero empieza y termina siendo tuyo, y el único tramo que es nuestro pasa por un banco chileno.

Es además la misma idea que el eje de remesas —«el tramo que sí hacemos»— aplicada a esta página.
Las dos piezas van a rimar sin haberlo forzado.

## 3. Una decisión que conviene que quede escrita: esto NO es un SVG

La primera versión la dibujé en SVG y **funcionaba mal en móvil**: el texto de un SVG escala con el
`viewBox`, así que a 390 px los rótulos de 15 px caían a **~5 px**. Ilegible. Lo comprobé
renderizando, no razonando.

Rehecha en HTML y CSS: el texto usa la escala tipográfica del sistema, en móvil las tres fases
**apilan** —que además es la lectura correcta de una secuencia— y el corchete se convierte en el
canto izquierdo del bloque. Misma función, dos formatos.

> **La regla, para no repetirlo:** si una figura es texto más rectángulos, es **HTML**. El SVG es
> para trazos que una caja no puede hacer — planos recortados, cuñas, recortes con `clip-path`,
> como las cuatro figuras de `/empresas`.

Efecto lateral bueno: la figura no necesita `aria-hidden` ni un `aria-label` que reescriba lo que
dice. **El texto es texto**, y un lector de pantalla lee la secuencia tal cual.

## 4. La mención institucional — en texto, y en su sitio

Decisión de Sebastián: **los emblemas se quedan en el pie**, y en la página va una mención escrita.

Va al final de **«Qué te pedimos, y por qué»**, y no es un sitio arbitrario: esa sección explica
por qué se piden documentos, y la supervisión de la UAF **es** la razón. Puesta ahí la mención
informa; puesta en cualquier otro sitio sería un sello disfrazado de frase.

> DLPZ INCZ SpA está registrada y supervisada por la Unidad de Análisis Financiero (UAF).
>
> Socio de FinteChile.

**Regla dura de implementación:** las dos frases **se importan de `lib/config/alliances.ts`**
—`institutionalStatement` y el `relationship` de cada alianza—, no se reescriben. Ese archivo dice
que cualquier cambio de redacción es un claim nuevo que vuelve a necesitar aprobación; si la frase
se teclea otra vez en la página, el día que Compliance cambie una palabra habrá dos verdades.

## 5. Lo que NO cambia

- El encabezado, «Lo que no vas a leer acá» y «Quiénes somos», intactos. La sección de honestidad
  es lo mejor del sitio y no se toca.
- Los tres mecanismos verificables se quedan como están, debajo de la figura.
- Cero componentes nuevos, cero tokens nuevos, cero JavaScript, cero imágenes.

## 6. Lote B de J4 — las cuatro medidas de esta página

Viajan con esta entrega, aplicadas a los bloques definitivos:

| Línea | Hoy | Queda |
|---|---|---|
| `confianza.astro:146` | 66ch | 47ch |
| `confianza.astro:187` | 52ch | 47ch |
| `confianza.astro:205` | 54ch | 47ch |
| `confianza.astro:209` | 52ch | 47ch |

## 7. Medido

Desborde horizontal **0** a 390 y a 1280.

| Par | Ratio | Mínimo |
|---|---|---|
| `--ink` sobre papel (lugares, titulares) | 16,00:1 | 4,5 |
| `--ink-mute` sobre papel (quién lo tiene, hito, pie de figura) | 5,50:1 | 4,5 |
| `--verde-deep` sobre papel (barra, «Lo tenemos nosotros», corchete) | 4,90:1 | 4,5 texto · 3,0 gráfico |

Ningún verde de marca sobre claro: la barra y el corchete llevan significado, así que van en
`--verde-deep`, como manda DS §2.4.

Movimiento: **ninguno nuevo**. La figura no entra animada — es un dato, y un dato no entra animado
(Motion System §4, regla dura 3). La sección conserva su `data-enter` en el titular.

## 8. Un copy que necesita tu visto bueno

**«Lo tenemos nosotros».** El hecho ya está publicado —`trust.ts` dice que la transferencia llega a
la cuenta de DLPay en BCI—, así que no es un claim nuevo, pero la formulación sí. Se mantiene: es
la más directa y no usa el término retirado.

Si algún día se quiere una versión que no hable de tenencia en absoluto, la alternativa es cambiar
la fila entera por **«Tu parte · Nuestra parte · Tu parte»**, que además rima con el eje de
remesas. No la propongo ahora porque la pregunta que trae alguien a esta página es justamente
quién tiene su dinero, y responderla de frente es el argumento.

## 9. Para el traslado

1. Las clases van en inglés, como manda ADR-0003: `track`, `phase`, `phase.is-ours`,
   `phase-place`, `phase-bar`, `phase-who`, `phase-note`. **Ninguna se llama `custody`.**
2. La figura es HTML dentro de `<figure>` con un `<ol>` de tres `<li>`: es una secuencia en el
   tiempo y el marcado lo dice. Los marcadores de lista se quitan por CSS.
3. Los rectángulos son `<span class="barra">` con `aria-hidden`, porque el texto de al lado ya
   dice todo: son decoración de una información que ya está escrita.
4. Las tres fases son datos, no maquetación: convendría que salieran de `content/trust.ts`, junto
   a `mechanisms`, en vez de ir escritas en la página.
5. En escritorio la rejilla es de tres columnas; bajo 900 px apila. No hace falta un breakpoint
   nuevo: usa los dos que ya existen.

# Puente 2 de 5 · Tarifas → Confianza

**Fecha:** 2026-09-28 · **Autor:** Claude Cowork
**Maqueta:** `puente-tarifas-confianza.html` · **md5** `5ae33053cdf892e57f6390eaa395f12b`
**Medido sobre el build de `3a32854`** — el tuyo de hoy, con el primer puente ya dentro.
**No escribí nada en el repositorio.**

---

## 0. Antes: verifiqué el puente 1 sobre tu build

Lo construí de cero con tus tres commits nuevos dentro y lo medí entero. **Sale todo**, y una cosa
salió mejor que la mía: la holgura.

| | lo que pedía mi prompt | lo que mide tu build |
|---|---|---|
| sitio | entre `Process` y `Trust` | ✅ ahí está |
| distancia a la última aparición del número | 1.300 px | **1.299** |
| papel seguido entre las dos bandas oscuras | 5.284 px | **5.284 exactos** |
| alto del bloque | 490 / 529 / 534 | ✅ los tres |
| desborde horizontal de 320 a 2560 | 0 | **0** |
| texto más pequeño · texto recortado | 13 px · 0 | ✅ |
| ángulo del corte | −33,930° | **−33,948°** |
| `prefers-reduced-motion` · sin JS | quieto y completo | ✅ los dos |
| JavaScript añadido | 0 bytes | **0** — el componente no lleva `<script>` |
| contraste (medido en el navegador, no supuesto) | — | 16,44 · 8,18 · 16,00 · 5,50 · 8,58 · 8,45 |
| la figura contra su original | idéntica | ✅ llave, punteado y vacío en su sitio |

**Y una corrección que es mía, no tuya:** el agente escribió **112–196 px** de holgura y yo había
puesto 69–145. Volví a medir de las dos formas: por la **caja** del texto salen 69–145; por la
**tinta**, que es lo que se ve, salen **120–197**. El número bueno es el suyo. Yo había medido el
ancho de la columna y no dónde acaba la letra — el mismo error que él describe haber cometido y
corregido, y que yo repetí sin darme cuenta. Lo dejo escrito porque es la segunda vez esta semana.

---

## 1. La pareja, y por qué esta frase y no otra

**`/tarifas` termina apoyándose en una persona que no presenta.** Su último bloque con argumento,
«Tabla de tarifas: en publicación», cierra así:

> «Mientras tanto, el precio aplicable a tu operación te lo informa **tu ejecutivo antes de que
> transfieras**, y no cambia después de que lo aceptas.»

Eso deja dos preguntas abiertas y `/confianza` contesta las dos: quién es esa persona
—«Una persona identificable cierra tu operación»— y, sobre todo, **dónde está mi plata mientras
tanto**. El tramo del medio de su línea de tenencia está rotulado «Acá confirmamos que llegó, antes
de mover nada»: es el mismo momento, visto desde el otro lado.

Medido en el build de hoy: `/tarifas` usa «ejecutivo» **×4** y no tiene **ni un solo enlace interno**
en su cuerpo. Este puente sería el primero.

---

## 2. Qué se ve al otro lado

La **línea de tenencia** de `/confianza`, con su construcción exacta — la tienes al lado en
`origen-confianza.png`: tres tramos, barras de 20 px con `--r-1`, dos en `--line-on-tinta` y la del
medio en `--verde`, el sitio arriba en la tipografía de cifras a plena intensidad, quién lo tiene
debajo, y **el corchete verde** que marca el punto exacto en que el dinero pasa a estar en nuestra
cuenta.

**Lo que dejé fuera, y por qué no es lo mismo que la llave.** No va la nota «Acá confirmamos que
llegó, antes de mover nada»: 45 caracteres en una columna de 177 px son cuatro líneas y desarman la
miniatura. No se pierde el argumento porque **esa frase pasa al texto del bloque** — el rótulo dice
«antes de que transfieras». En el puente 1 quitar la llave sí rompía el argumento, y por eso volvió.

**Un defecto que sólo se ve renderizando:** los tres rótulos no miden lo mismo —«En la cuenta de
DLPay» ocupa dos líneas y «En tu billetera» una—, así que las tres barras salían a tres alturas
distintas y la línea de tenencia **dejaba de leerse como una línea**. Se arregla con `subgrid`: las
tres columnas comparten filas.

---

## 3. La carcasa es la misma, sin tocar una línea

Corte al 50 % en `123.954deg`, texto arriba-izquierda sobre papel, figura abajo-derecha sobre tinta,
una sola superficie bajo 960 px, figura primero en móvil, M4+M5 con `data-enter`, cero JavaScript.
**Lo que se repite es el corte; lo que cambia es lo que hay al otro lado.**

---

## 4. Dónde va — y acá sí hay una decisión

**Va dentro de `/tarifas`, justo después de «Tabla de tarifas: en publicación» y antes de «Qué no
está incluido acá».** No al final, y eso lo descubrí al montarlo:

**`descartada-al-final.png` es el motivo.** Puesto al cierre de la página, la mitad de tinta del
puente **desemboca en el pie, que también es tinta**, y las dos se funden en una sola mancha: el
bloque pierde su canto inferior y la figura parece del pie. **Le pasa a las cuatro páginas
interiores**, porque todas terminan en el mismo pie oscuro. Es el mismo «oscuro contra oscuro» que
evité en la Home, sólo que en la Home no aparecía porque allí el puente tiene `Trust` debajo.

En el sitio elegido queda: la frase del ejecutivo → el puente → «Qué no está incluido acá» (265 px
de papel) → el pie. Lo tienes en `en-tarifas-1280.png`.

**La decisión que no es mía:** el puente es una banda a todo el ancho y el cuerpo de `/tarifas` es
un contenedor con padding, así que hay dos formas de meterlo ahí.

| | qué cuesta | qué arriesga |
|---|---|---|
| **a) Sección de primer nivel** (recomendada) — `cuerpo` se parte en dos y el puente queda hermano suyo, igual que en la Home | un cambio de estructura en la página | nada: es exactamente lo que ya está integrado en la Home |
| b) Sangrar desde dentro con `margin-inline: calc(50% - 50vw)` | ninguno | con barra de desplazamiento clásica, `50vw` incluye la barra y puede abrir scroll lateral |

La **b** tiene precedente en el sitio: `pages/precio.astro:355` ya usa `margin-right: calc(50% - 50vw)`.
Y **no pude comprobar el riesgo**: este navegador sin cabeza usa barras superpuestas y siempre mide
desborde 0, así que no sé si el problema existe en tu Chrome. Lo digo en vez de darlo por bueno.
Recomiendo la **a** porque deja las dos piezas de la familia construidas igual.

---

## 5. Medido

| | 320 | 390 | 768 | 960 | 1280 | 2560 |
|---|---|---|---|---|---|---|
| alto | 644 | 624 | 564 | 525 | 525 | 525 |
| desborde | 0 | 0 | 0 | 0 | 0 | 0 |
| texto más pequeño | 13 | 13 | 13 | 13 | 13 | 13 |
| texto recortado | 0 | 0 | 0 | 0 | 0 | 0 |

Botón 194×57. Holgura por tinta: **103–179 px** el texto, **61–82** la figura — la de la figura baja
respecto del puente 1 porque la línea de tenencia es más ancha, así que si esto entra, el §4.7 del
Design System tiene que ampliar su rango a **61–82**. Sin JavaScript se ve completa e inmóvil;
`prefers-reduced-motion` la deja quieta.

---

## 6. El texto, y qué necesita tu firma

| en el puente | origen |
|---|---|
| «antes de que transfieras» | literal del último bloque de **`/tarifas`** |
| «Dónde está tu dinero en cada paso» | recorte de la bajada publicada de `/confianza`: «Dónde está tu dinero en cada paso, y cuál de esos pasos es nuestro» |
| «Y cuál de esos pasos es nuestro. Tres cosas que puedes verificar tú mismo en tu próxima operación.» | **empalme** de la segunda mitad de esa bajada con la entradilla publicada de «Qué pasa con tu plata» |
| «En tu cuenta bancaria» · «Lo tienes tú» · «En la cuenta de DLPay» · «Lo tenemos nosotros» · «En tu billetera» | literales de `content/trust.ts` |
| **«Ver Confianza»** | **nueva** — la etiqueta del botón |

Una cadena nueva y un empalme, el mismo caso que el puente 1. Y **el empalme importa más acá**: junta
una frase sobre dónde está el dinero con otra que invita a verificar. Ninguna de las dos afirma nada
que la página no afirme ya, pero juntas suenan a promesa de verificación. **Tú firmas, no yo.**

---

## 7. Lo siguiente

Quedan tres: **Precio → Tarifas**, **Empresas → ?** y **Cómo funciona → el artículo**.

Y una que quiero replantear antes de construirla: mi lista original mandaba **Empresas → Confianza**
con la misma línea de tenencia. Serían **dos puentes con el mismo dibujo**, y aunque nunca coincidan
en la misma página, eso es plantilla y no familia. En el build de hoy `/empresas` usa «ejecutivo» ×6
—no ×7, la copia cambió— y «spread» ×3. Cuando llegue a ella lo mido otra vez y decido el destino con
el dato delante, no con la lista de la semana pasada.

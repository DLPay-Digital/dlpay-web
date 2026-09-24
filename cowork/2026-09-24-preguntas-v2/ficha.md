# Ficha — `/preguntas`, rehecha

**Entrega:** `2026-09-24-preguntas-v2` · **Autor:** Claude Cowork · **Estado:** En revisión
**Pieza:** `preguntas.html` · **md5:** `804633656f183f907811ebeb90413a47`
**Capturas:** `preguntas-hoy.png`, `preguntas-1280.png`, `preguntas-390.png`
**Las mismas nueve preguntas y los mismos ocho términos.** Ni una palabra nueva.

> **La crítica de Sebastián era correcta y la acepto entera.** La página que entregué el 2026-09-23
> importaba las preguntas de sus páginas de origen sin duplicar texto —que era el requisito— y ahí
> se detuvo. Yo escribí en su ficha *«sin figura, y es una decisión, no un olvido»*. La decisión de
> no meter una figura era defendible; **no diseñar nada en su lugar no lo era.** El resultado son
> 2.982 px sin un solo ancla y dos acordeones cerrados: parece que nadie la miró.

---

## 1. La estructura sale del contenido, no de mí

Las nueve preguntas venían agrupadas **por público** —cinco de la Home, cuatro de `/empresas`—
porque así venían de sus páginas de origen. Pero quien llega a esta página con una duda no llega
pensando «soy una empresa»: llega pensando en el precio, en el tiempo o en dónde queda su plata.

Agrupadas **por preocupación**, las nueve caen en cinco grupos sin que sobre ni falte ninguna:

| | preocupación | quién la hace |
|---|---|---|
| 01 | Qué recibo, y cuándo | persona · persona |
| 02 | Cuánto cuesta | **persona · empresa** |
| 03 | Hasta dónde llegamos | **persona · empresa** |
| 04 | Qué te pedimos | **persona · empresa** |
| 05 | Quién te atiende | empresa |

**Tres de las cinco emparejan una pregunta de persona con una de empresa, una a una.** No es un
arreglo mío: es que una persona y una empresa se preocupan de lo mismo y lo preguntan con otras
palabras. La página de ayer partía por público y escondía justo eso.

**Y las dos asimetrías también informan:** las dos preguntas sobre qué recibo las hace sólo una
persona, y la de quién atiende mi cuenta la hace sólo una empresa. Por eso cada grupo declara en su
cabecera quién lo pregunta, en vez de dejar que el desajuste parezca un error de maquetación.

---

## 2. Cinco decisiones de diseño, con su porqué

**a) Las respuestas van abiertas.** Un acordeón sirve a quien ya sabe qué busca; a esta página se
llega **para** las respuestas. Y el sitio entero dice las cosas de frente —`/confianza` tiene una
sección llamada «Lo que no vas a leer acá»—: esconder nueve respuestas detrás de nueve clics es lo
contrario. En la Home el acordeón sigue bien, porque ahí el bloque es secundario y se está ojeando.

**Coste, medido:** la página pasa de 2.982 px a **4.023 px** en escritorio. Es lo que cuesta no
esconder nada, y es lo que obliga a lo siguiente.

**b) Un índice pegajoso.** Con 4.023 px hay que poder saltar. Cinco enlaces más el glosario, pegados
al margen mientras se baja. **Cero JavaScript**: son anclas y `position: sticky`. Sin estado activo,
que sí necesitaría JS y no vale lo que cuesta.

**c) La cabecera dice la forma de la página antes de leerla:** 05 preocupaciones · 09 preguntas ·
08 palabras. Tres cifras en mono, que es como el sitio escribe los datos.

**d) Cada pregunta lleva su lado en mono —persona o empresa—**, y se oculta cuando el grupo es de un
solo lado, porque entonces la cabecera ya lo dijo. Se oculta a la vista, no al lector de pantalla.

**e) El glosario deja de ser una retícula y pasa a ser una lista de definiciones de verdad**, con el
término a la izquierda y la definición al lado. Sigue siendo `<dl>`/`<dt>`/`<dd>` —8 y 8, medido— y
**«Red» sigue marcando su ausencia**: «el sitio todavía no lo explica en ninguna parte», ahora con
un filete que la hace visible en vez de dejarla como el único término sin enlace.

---

## 3. Lo que NO hice, y por qué

**Ninguna figura, y esta vez con una alternativa.** Sigo pensando que un dibujo grande aquí sería
decoración: esta página es el mapa del vocabulario y de las dudas, y el §6 prohíbe el trazo que no
dice nada. Lo que cambió es que **antes eso me sirvió de excusa para no diseñar**. La página se
ordena con estructura, jerarquía y ritmo, que es lo que el resto del sitio hace en las legales y en
el carril.

**Ningún icono en el glosario.** El término está escrito al lado; un icono no añadiría nada.

**Ni una palabra nueva.** Las nueve preguntas, las nueve respuestas y los ocho términos son
exactamente los que ya están en `content/`. Lo único escrito por mí son los cinco títulos de
preocupación, la frase que explica la agrupación y el cierre.

---

## 4. Evidencia medida

| | hoy | rehecha |
|---|---|---|
| Alto a 1280 | 2.982 px | **4.023 px** |
| Respuestas visibles sin hacer clic | **0** | **9** |
| Elementos `<details>` | 2 bloques × 9 | **0** |
| Formas de saltar a una sección | **0** | **6** |
| `<dl>` / `<dt>` / `<dd>` | 1 / 8 / 8 | 1 / 8 / 8 |
| Anclas del índice rotas | — | **0** |
| Scroll horizontal a 390 | no | **no** |

**Un fallo que el alto delató.** Al ocultar el rótulo repetido lo saqué del flujo con
`position: absolute`, y la rejilla dejó el contenido metido en la columna de 96 px: la página creció
de 4.023 a **5.451 px**. No se veía en el CSS; **se vio en el número**. Corregido con una sola
columna cuando el grupo es de un lado. Es la regla 21 otra vez — lo que mido no es lo que escribí
hasta que lo compruebo.

---

## 5. Lo que falta decidir

1. **Si el acordeón se va de esta página pero se queda en la Home.** Yo lo haría: son dos contextos
   distintos. Implica que `/preguntas` deja de usar `Faq.astro` y necesita su propia presentación,
   aunque siga importando las preguntas del mismo `content/`.
2. **Los cinco títulos de preocupación** son copy nuevo —cinco frases de tres palabras— y aunque no
   afirman nada, es una página que ordena el discurso. Los mira Compliance.
3. **El cierre** —«¿Te quedó una duda que no está acá?» con el botón de WhatsApp— reemplaza a la
   banda de «Cotizar ahora». En una página de dudas, escribir es la acción correcta; cotizar es la
   de una página de precio.

Nada de esto está integrado. `cowork/` es sólo visualización.

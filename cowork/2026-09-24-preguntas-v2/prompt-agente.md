# Prompt para el agente de Claude Code — `2026-09-24-preguntas-v2`

**Fecha:** 2026-09-24 · **Autor:** Claude Cowork
**Maqueta:** `preguntas.html` · **md5:** `804633656f183f907811ebeb90413a47`
**Ficha:** `ficha.md` — léela entera.
**Toca:** `src/pages/preguntas.astro`, `src/content/home.ts`, `src/content/business.ts`

> **Ni una palabra nueva del contenido.** Las nueve preguntas, las nueve respuestas y los ocho
> términos son exactamente los de `content/`. Lo único escrito por mí son los cinco títulos de
> preocupación, la frase que explica la agrupación y el cierre. Lo que cambia es **la forma**.

---

## 0. Por qué

Sebastián dijo que la página era copiar y pegar y que parecía que nadie la había mirado. Tenía
razón: **2.982 px sin un solo ancla y dos acordeones cerrados**, importando bien el contenido y sin
diseñar nada encima. La ficha §1 explica de dónde sale la estructura nueva; no es un arreglo mío,
sale del propio contenido.

---

## 1. La decisión de ingeniería que hay que tomar primero

Las nueve preguntas se agrupan en **cinco preocupaciones**, y tres de ellas emparejan una pregunta
de persona con una de empresa. La pregunta es **dónde vive esa agrupación**.

**Lo que NO hay que hacer:** cinco listas de textos de pregunta dentro de `preguntas.astro`. Si
alguien reescribe una pregunta en `home.ts`, deja de coincidir y **desaparece de su grupo sin que
nada falle**. Es el mismo fallo silencioso que ya arreglamos con el `id` de `Faq.astro`.

**Lo que propongo:** un campo `concern` en cada ítem de `faq`, en `home.ts` y en `business.ts`,
tipado como unión cerrada de los cinco valores. El dato viaja con la pregunta —igual que `icon` en
`trust.ts`— y una preocupación mal escrita **rompe el build**, igual que `category`.

| preocupación | preguntas |
|---|---|
| `recibo` · «Qué recibo, y cuándo» | ¿Por qué es más rápido que un banco? · ¿Qué es el "dólar digital" que recibo? |
| `precio` · «Cuánto cuesta» | ¿El precio de la web es el precio final? · ¿Desde qué volumen conviene? |
| `alcance` · «Hasta dónde llegamos» | ¿DLPay deposita el dinero en una cuenta bancaria en el extranjero? · ¿Qué pasa si mi proveedor sólo recibe por banco? |
| `requisitos` · «Qué te pedimos» | ¿Necesito registrarme? · ¿Qué documentos necesito? |
| `atencion` · «Quién te atiende» | ¿Quién atiende mi cuenta? |

Los cinco títulos visibles viven donde tú decidas —yo los pondría en `preguntas.astro`, porque son
de esa página y de ninguna otra— pero **la pertenencia de cada pregunta viaja con la pregunta**.

Y el lado —persona o empresa— **no hay que declararlo**: sale de qué archivo viene, `home.ts` o
`business.ts`. No lo dupliques en un campo.

---

## 2. `/preguntas` deja de usar `Faq.astro`

Las respuestas van **abiertas**, así que no hay `<details>`. La página necesita su propia
presentación, **pero sigue importando las preguntas del mismo `content/`** — eso no cambia y es lo
único que la primera versión hizo bien.

**`Faq.astro` se queda como está** y la Home y `/empresas` lo siguen usando con acordeón: ahí el
bloque es secundario y se está ojeando, que es para lo que sirve un acordeón. Acá se llega **para**
las respuestas. No unifiques las dos cosas.

---

## 3. El índice

Cinco enlaces más el glosario, pegados al margen mientras se baja. **Cero JavaScript**: son anclas
y `position: sticky`. Sin estado activo — eso sí necesitaría JS y no vale lo que cuesta.

En móvil se queda estático arriba, como lista de saltos: con 4.967 px de página, poder ver las cinco
preocupaciones antes de bajar es la mitad del valor de la entrega.

Las cinco secciones necesitan `id` y `scroll-margin-top`. **Comprobado en la maqueta: 6 enlaces, 0
anclas rotas.** Verifícalo tú también: un ancla rota no falla, sólo no hace nada.

---

## 4. Dos trampas que me comí

**a) El rótulo repetido y la rejilla que se cae.** Cuando un grupo es de un solo lado, la cabecera
ya dice quién pregunta y el rótulo por pregunta sobra a la vista. Lo oculté con
`position: absolute` y **la página creció de 4.023 a 5.451 px**: al salir del flujo, el contenido se
metió en la columna de 96 px. No se ve leyendo el CSS — **se vio en el alto**. La rejilla tiene que
pasar a una sola columna cuando el rótulo se oculta. Y se oculta a la vista, **no al lector de
pantalla**.

**b) Las capturas de esta página son enormes** —8.000 px a DPR 2— y dos no se pudieron ni subir. Si
mides, mide números; no intentes juzgarla de una sola captura.

---

## 5. El glosario

Deja de ser retícula de dos columnas y pasa a pliego: término a la izquierda, definición al lado.
**Sigue siendo `<dl>`/`<dt>`/`<dd>`** —1 / 8 / 8, medido— por lo mismo que la primera vez: un lector
de pantalla anuncia «lista de descripción, 8 elementos» y permite saltar de término en término.

**«Red» sigue marcando su ausencia**, ahora visible: «el sitio todavía no lo explica en ninguna
parte», con filete. Que el hueco se vea es parte de la información, y `glossary.ts` ya lo dice en su
cabecera.

---

## 6. Lo que firma Compliance

**Los cinco títulos de preocupación** y el cierre. No afirman nada —son cinco frases de tres
palabras y una invitación a escribir— pero **ordenan el discurso de una página entera**, y eso es
contenido.

El cierre cambia de «Cotizar ahora» a **escribir por WhatsApp**: en una página de dudas la acción
correcta es preguntar, no cotizar. Si eso te parece una decisión de producto y no de diseño, dilo y
que la tome Sebastián.

---

## 7. Qué comprobar

1. Las nueve preguntas aparecen, **cada una en su grupo**, y ninguna se queda fuera. Si el
   emparejamiento vive en un campo tipado, esto lo comprueba el compilador.
2. **Cero `<details>`** en la página, y las nueve respuestas visibles sin hacer clic.
3. Seis anclas, **cero rotas**, y las secciones con `scroll-margin-top`.
4. `<dl>` / `<dt>` / `<dd>` = 1 / 8 / 8.
5. Sin scroll horizontal a 320, 390 y 1280.
6. El alto no se dispara: **~4.023 px a 1280**. Si sale mucho más, es la trampa del §4.a.
7. La Home y `/empresas` siguen con su acordeón intacto.

---

## 8. Lo de siempre

`cowork/` no toca `src/`. La maqueta es sólo visualización.

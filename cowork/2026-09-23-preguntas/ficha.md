# Ficha — `/preguntas`, el hub de preguntas y el glosario

**Entrega:** `2026-09-23-preguntas` · **Autor:** Claude Cowork · **Estado:** En revisión
**Pieza:** `preguntas.html` · **md5:** `06630f13d67fd0c97e102a45070f823e`
**Capturas:** `preguntas-1280.png`, `preguntas-390.png`
**Origen:** propuesta 1 de `2026-09-23-oportunidades`, elegida por Sebastián.
**Dónde va:** dentro del menú **Información**, que hoy tiene tres entradas —Cómo funciona,
Confianza, Blog— y pasaría a cuatro.

---

## 1. Las tres decisiones que la gobiernan

| decisión | de Sebastián |
|---|---|
| Las preguntas ya publicadas | **se quedan donde están** y la página las reúne desde la misma fuente |
| `/tarifas` | **no se mueve** del pie |
| `/precio` | maqueta ahora, integración cuando D7 esté |

De la primera sale lo importante: **cero duplicación de texto.** Las nueve preguntas viven en
`content/home.ts` (cinco) y `content/business.ts` (cuatro). La página las importa de ahí. Si mañana
cambia una respuesta, cambia en los dos sitios a la vez, que es justo lo que `content/scope.ts`
existe para garantizar.

---

## 2. Lo único nuevo de la página es el glosario

Las preguntas son material existente recolocado. El glosario son ocho términos, y **cinco de ellos
están definidos con palabras que el sitio ya publica**:

| término | de dónde sale la definición | estado |
|---|---|---|
| Dólar digital | `home.ts`, respuesta a «¿Qué es el "dólar digital"?» | ya publicado |
| Precio referencial | `home.ts`, respuesta a «¿El precio de la web es el precio final?» | ya publicado |
| Spread | `/tarifas`, «Cómo se compone el precio» | ya publicado |
| Verificación de identidad | `/confianza`, «Qué te pedimos, y por qué» | ya publicado |
| Ejecutivo | `/confianza`, «Una persona identificable cierra tu operación» | ya publicado |
| **Stablecoin** | — | **copy nuevo** |
| **Billetera** | — | **copy nuevo** |
| **Red** | — | **copy nuevo** |

**Los tres nuevos son los que hay que firmar.** Son términos que el sitio **usa en todas las
páginas y no define en ninguna**, que es exactamente el hueco que el glosario viene a tapar. Van
escritos sin cifras, sin plazos y sin nombrar ninguna red concreta, así que no tocan ningún dato
bloqueado; pero son contenido de mercado y los aprueba Compliance, no ingeniería (CLAUDE.md §3).

Mis tres borradores:

> **Stablecoin** — Una moneda digital diseñada para mantener su valor pegado al de otra moneda. La
> que usamos está pegada al dólar.
>
> **Billetera** — La aplicación o cuenta digital donde recibes y guardas el dólar digital. Es tuya,
> tú la controlas, y es donde termina nuestra operación.
>
> **Red** — El canal por el que viaja el dólar digital. Hay varias, y la que se usa cambia el
> tiempo y el costo del traspaso, no el valor de lo que recibes.

El de «Billetera» dice de paso dónde termina el servicio, que es la frase que `scope.ts` repite en
tres páginas. El de «Red» evita nombrar ninguna: nombrarlas sería una decisión de producto.

---

## 3. Decisiones de diseño, y por qué

**El glosario es una lista de definiciones de verdad** — `<dl>`, `<dt>`, `<dd>`— y no una retícula
de `<div>`. No es purismo: un lector de pantalla anuncia «lista de descripción, 8 elementos» y
permite saltar de término en término. Medido: 1 `<dl>`, 8 `<dt>`, 8 `<dd>`.

**Sin acordeón en el glosario.** Las preguntas ya lo son. Un glosario se lee barriendo, no
abriendo, y esconder ocho definiciones de dos líneas detrás de ocho clics es trabajo para el
lector sin ninguna ganancia.

**Sin figura, y es una decisión, no un olvido.** Esta página es el mapa del vocabulario del sitio.
Un dibujo aquí competiría con el texto sin decir nada que el texto no diga, y el DS §6 prohíbe con
esas palabras el trazo que no dice nada.

**Los dos grupos alternan `--papel` y `--papel-2`.** `Faq.astro` trae `padding: var(--s-9) 0` y
fondo `--papel`: dos seguidos dejan **192 px** entre el último desplegable de un grupo y el título
del siguiente, sobre el mismo fondo, y los dos bloques se leen como uno solo mal espaciado.
Alternar es el ritmo que el sitio ya usa entre secciones en todas las páginas —lo medí: los fondos
van alternando `246,245,241` y `236,234,227`—, así que no inventa nada.

**El enlace de cada término nombra su destino.** La primera versión decía «Dónde se explica» siete
veces y la columna se convertía en una retahíla verde que no informaba de nada. Ahora dice
**→ Tarifas**, **→ Confianza**, **→ Cómo funciona**, **→ En el blog**. Con eso el glosario deja de
ser una lista y pasa a ser el índice del sitio. **«Red» no lleva enlace porque el sitio no lo
explica en ninguna parte** — y que eso se vea es parte de la información.

---

## 4. Un fallo que encontré en `Faq.astro` y que esta página destapa

El componente trae el `id` **escrito a mano**:

```astro
<section class="faq" aria-labelledby="faq-title">
  <h2 id="faq-title">{title}</h2>
```

Hoy no molesta porque ninguna página lo usa dos veces. **`/preguntas` lo usa dos veces**, y dos
elementos con el mismo `id` son HTML inválido: el `aria-labelledby` del segundo bloque apunta al
título del primero, así que un lector de pantalla anunciaría las preguntas de empresa como
«Preguntas frecuentes».

En la maqueta lo resolví con dos `id` distintos —`faq-personas` y `faq-empresas`— y está
comprobado: **0 ids duplicados**. En el componente hay que generarlo, por prop o derivándolo del
título.

---

## 5. Evidencia medida

Con los nueve desplegables abiertos, contra el `tokens.css` del día, `md5sum` de los dos lados.

| | 390 | 1280 |
|---|---|---|
| Alto de la página | 4.802 px | 3.791 px |
| Medida de una respuesta | 38,9 ch | **66 ch** |
| Medida de una definición | 38,9 ch | **54,2 ch** |
| Ids duplicados | 0 | 0 |
| Scroll horizontal | no | no |
| `<dl>` / `<dt>` / `<dd>` | 1 / 8 / 8 | 1 / 8 / 8 |

Las respuestas quedan en **66 ch**, dentro del 65–70 que pide el Design System. Las definiciones en
54 ch porque van a dos columnas desde 900 px, y para dos líneas es la medida cómoda.

Enlace **→ destino** en `--verde-deep` sobre `--papel`: **5,44:1**.

---

## 6. Lo que falta decidir

1. **Los tres términos nuevos**, que firma Compliance (§2).
2. **La etiqueta del menú y la ruta.** Propongo `Preguntas` y `/preguntas/`, y en el desplegable
   de Información el `detail` que acompaña a las otras tres entradas.
3. **En qué posición del menú.** Yo la pondría **última**, después de Blog: es la página a la que
   se va con una duda concreta, no la que se explora.
4. **El `id` de `Faq.astro`** (§4) es de ingeniería y es del agente.

La orden de trabajo para el agente cubre esta página y `/precio` juntas, y está en
`cowork/2026-09-23-precio/prompt-agente.md`.

Nada de esto está integrado. `cowork/` es sólo visualización.

# Dos reglas nuevas, y el mapa medido sobre el build de hoy

**Fecha:** 2026-09-25 · **Autor:** Claude Cowork
**Medido sobre:** `dist/` del 25 a las 19:44, leído del repositorio en vivo — no de una copia.

---

## 1. Las dos reglas que deja el veredicto de `tarifas-v2`

La ficha y el prompt afirmaban, con esas palabras, «no es una excepción a ninguna regla». Eran
tres. No las vi porque mi copia de `src/` eran dos archivos. De ahí salen éstas:

> **35 · No se afirma la ausencia de una regla desde una copia incompleta.**
> Que yo no encuentre la regla no es que no exista: puede ser que no tenga el archivo donde está.
> La frase honesta cuando la copia no alcanza es «no encontré ninguna regla que lo impida **y mi
> copia no da para afirmarlo**», que obliga al agente a comprobarlo. «No es una excepción a
> ninguna regla» es una afirmación sobre todo el repositorio y sólo puede hacerla quien lo tiene
> entero. El caso: `2026-09-25-tarifas-v2` necesitaba tres excepciones y decía no necesitar
> ninguna — el DS §4.5 acotaba `--elev-card` a «sólo la tarjeta del cotizador sobre la tinta»,
> `--elev-pop` a «menús/popovers (futuro)», y `tokens.css` repetía el límite para `--r-card`.

> **36 · Un `grep` por hoja de estilo no ve lo que entra por un componente compartido.**
> «Las páginas interiores no usan esos tokens» salió de mirar las hojas por página. Es falso: los
> usan **todas**, a través de `Header.astro`. Lo que una página usa de verdad se cuenta **sobre el
> render** —recorriendo los elementos y leyendo su estilo calculado—, no sobre el CSS que le toca.
> Vale para cualquier «esta página no tiene X».

**Y una que no es nueva, que es peor por eso:** volví a meter `<text>` dentro de un SVG que escala,
en la tarjeta «El monto», en la misma entrega cuya ficha fija esa regla en su §4. Tercera vez en la
sesión. No hace falta escribirla otra vez; hace falta que yo la compruebe antes de entregar en vez
de que la cace el agente.

---

## 2. El mapa, con el método corregido

Ancla = cualquier elemento de más de 24×24 px dentro de `main`. Superficies elevadas = contadas
**sobre el render**, leyendo `box-shadow` calculado, que es lo que la regla 36 obliga.

| página | `main` | anclas | tramo más largo sin ninguna | elevadas en `main` |
|---|---|---|---|---|
| **preguntas** | 4.479 px | 0 | **4.479 px (100 %)** | 0 |
| blog · artículo | 4.856 px | 2 | 3.599 px (74 %) | 0 |
| **como funciona** | 3.007 px | 0 | **3.007 px (100 %)** | 0 |
| empresas | 5.168 px | 5 | 2.784 px (54 %) | 1 |
| confianza | 3.238 px | 1 | 2.425 px (75 %) | 0 |
| precio | 3.092 px | 2 | 1.197 px (39 %) | 0 |
| home | 7.115 px | 8 | 1.193 px (17 %) | 14 |
| tarifas | 2.464 px | 2 | 1.178 px (48 %) | 4 |
| blog · índice | 844 px | 1 | 367 px (44 %) | 0 |

`/tarifas` da 2.464 px, el mismo número que el veredicto. Los dos aparatos de medida coinciden.

---

## 3. Una comprobación que devuelvo, por si sirve

El veredicto dice que `Steps.astro:232` es «una tarjeta sobre papel, **en la Home y en
`/como-funciona`**». Lo comprobé sobre el `src/` de hoy y sobre el render:
`como-funciona.astro` **no importa `Steps.astro`** — importa `detailedSteps` de
`content/process.ts` y dibuja los pasos en la propia página. Lo compartido es el contenido, no el
componente. Por eso `/como-funciona` mide **cero superficies elevadas en su `main`**.

No cambia el veredicto sobre el token, que sigue siendo el mismo. Lo digo porque si algún día se
corrige `Steps.astro`, `/como-funciona` no se arregla sola.

---

## 4. Lo que propongo mirar ahora: `/como-funciona`

Es, con `/preguntas`, la más plana del sitio —3.007 px sin una sola ancla— y es la página cuyo
trabajo entero es enseñar un recorrido, que es justo lo que los cinco sitios de referencia dibujan.

**Lo que ya tiene y está bien** (esto no se toca): la escalera de dos columnas «Lo haces tú / Lo
hacemos nosotros», los seis pasos numerados alternando lado, el riel vertical con las marcas verdes
en los traspasos, y los tiempos en monoespaciada — «ahora mismo», «un toque», «minutos», «según tu
banco», «al acreditarse», «~5 min desde el pago».

**Lo que le falta, y son las tres cosas de los sitios de referencia:**

- **El producto no aparece.** Los pasos 2 y 6 son literalmente WhatsApp, y `WhatsAppMockup.astro`
  existe y hoy sólo se usa en `Process.astro` y en `MacbookMockup.astro`. La página que explica la
  conversación no enseña la conversación.
- **Los tiempos son lo mejor que tiene y son lo más pequeño de la página.** Son el argumento
  —cuánto tarda cada paso y quién lo hace— puestos en el tamaño de una nota al pie.
- **3.007 px de un solo tono.** Nada separa lo que el cliente hace de lo que hacemos nosotros salvo
  la columna.

**Y con el §4.5 nuevo delante, no al revés:** un solo `--elev-card`, y sólo para «el objeto del que
trata la página» apoyado en una banda de tinta; todo lo demás que se levante del papel es
`--elev-pop`; y la superficie alterna con el papel, porque lo elevado es lo que el cliente mira y lo
plano lo que lee.

---

## 5. Basura mía que hay que borrar

Dejé `cowork/_tmp-dist.tar.gz` (356 KB) para poder medir el build desde el contenedor. No puedo
borrarlo yo: esta sesión no tiene permiso de borrado en la carpeta. **Bórralo.**

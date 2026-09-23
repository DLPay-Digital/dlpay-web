# Respuesta — la medida del cuerpo de los artículos

**Fecha:** 2026-09-23 · **Autor:** Claude Cowork

## La respuesta: opción 1, y con una precisión

**Sí, estrechar sólo el texto** — pero cap a los **párrafos y las listas**, no a los encabezados.

No es opinión: **las 18 medidas de `47ch` que ya hay en `src/` se aplican todas a cuerpo de texto**
y **ninguna a un encabezado**. `Faq.astro` capa la respuesta y deja correr el `h2` y el `summary`;
`Steps.astro` capa el `p` y el `.foot`; `Business.astro` capa el `.copy`. El patrón ya existe en
todo el sitio y ya se ve bien en `/confianza`, `/como-funciona` y `/empresas`.

Si además capas los `h2`, cada uno pasa a su propio `47ch` —que a 32 px son **611 px**, no 423,
porque `ch` escala con el cuerpo— y el titular largo de este artículo se parte en dos líneas sin
necesidad.

## Lo que medí sobre el build, con las tres variantes inyectadas

| | cuerpo | caracteres | `h1` | alto de la página |
|---|---|---|---|---|
| **Actual** | 760 px | **112** | 2 líneas | 5.531 px |
| **A · todo a 47ch, titular incluido** | 423 px | 62 | **4 líneas** | 7.782 px |
| **B · todos los hijos de `.prose`** | 423 px | 62 | 2 líneas | 7.639 px |
| **C · sólo párrafos** ← **ésta** | 423 px | **62** | 2 líneas | 7.589 px |

**A queda descartada**: el titular pasa de dos líneas a cuatro y no gana nada.

**El precio del cambio es scroll: la página crece un 37 %**, de 5.531 a 7.589 px. Es lo que cuesta
que una línea tenga 62 caracteres en vez de 112, y lo digo para que nadie se sorprenda después.

## Y una cosa que el cambio destapa, que es una oportunidad

Al estrechar el texto quedan **337 px de columna vacía** a la derecha, y el artículo no tiene nada
que poner ahí. No es un defecto del cambio: es que la plantilla de artículo no tiene más que texto.

**La salida elegante es dejar que las figuras se salgan de la columna del texto.** Hoy la figura
del riel mide 420 px dentro de una columna de 423: encaja por 1,5 px a cada lado, lo cual no es un
margen, es una casualidad. Si el texto va a 423 y las figuras pueden llegar a 760, la anchura
sobrante deja de ser un hueco y pasa a ser el ritmo del artículo — texto estrecho, figura ancha.

**No hace falta hacerlo ahora** y no lo pido como parte de este cambio. Lo dejo escrito porque es
la decisión que conviene tomar antes del tercer artículo, no después.

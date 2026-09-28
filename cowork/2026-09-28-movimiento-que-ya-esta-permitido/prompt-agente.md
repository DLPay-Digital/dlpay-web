# Prompt para el agente de Claude Code — `2026-09-28-movimiento-que-ya-esta-permitido`

**Fecha:** 2026-09-28 · **Autor:** Claude Cowork · **Aprobado por Sebastián.**
**Demo:** `demo-dato-y-controles.html` · **md5** `546facc2aeecb64b278782e02bef0528` — **ábrela y
teclea**; trae un interruptor para comparar con lo de hoy. **Ficha:** `ficha.md`.
**Medido sobre:** un build que hice yo del `main` de hoy (`9ce2684`). Comprueba igual lo que uses
para decidir.

> **Esto no pide ninguna excepción.** Iba a pedirte tres y ninguna hace falta: el **§9 del Design
> System ya permite las tres cosas** por su nombre. Lo que falta es aplicarlas.
>
> > **Permitido:** microinteracciones en **controles** · **el dato que cambia** · **el dibujo de la
> > geometría** · …
> > **Prohibido:** hover-transitions en **tarjetas** · **conteo de cifras desde cero** · parallax ·
> > movimiento continuo · transiciones de página · movimiento sobre datos.

---

## 1. El estado, medido sobre las ocho páginas

| lo que el §9 permite | lo que el sitio hace hoy |
|---|---|
| microinteracciones en controles | **303 interactivos, 72 sin ninguna transición** |
| el dato que cambia | el cotizador salta de un valor al otro **en un paso, 49 ms tras teclear** |
| el dibujo de la geometría | **5 usos de `data-draw` en todo el sitio**; cero en la Home |

---

## 2. A · El dato que cambia (el cotizador)

**El resultado recorre la distancia en 240 ms** —bajo el techo de 280— con salida suave, y
**nunca arranca de cero: sale del valor anterior.** En la demo son 17 pasos intermedios de
2.174,62 a 21.746,22 al teclear un dígito.

**Tres cosas que no se pueden relajar, y la primera la descubrí tarde:**

**a) `#get-input` es un `<input>` editable, no un texto.** Tiene su propio oyente en
`Quoter.astro:626` y escribir en él recalcula `#give-input`. **La transición se aplica sólo al
campo que el usuario NO está editando.** Animar el campo donde alguien está tecleando le pelea las
teclas. En la práctica: el que tiene el foco se escribe directo; el otro se anima.

**b) Con el campo vacío no se anima hacia cero.** La salida pasa a su estado vacío de golpe. Un
recorrido hasta cero **es** el «conteo de cifras desde cero» que el §9 prohíbe, y además la
ausencia de dato no es un dato. Medido en la demo: un solo paso, 9 ms.

**c) Al cargar la página no hay animación.** El valor inicial se pinta, no se recorre. Es la misma
regla: el dato no ha cambiado, ha aparecido.

Sitios donde `Quoter.astro` escribe un valor y hay que decidir cuál es cuál: líneas **619, 623,
631, 635 y 646**.

Sin JavaScript no hay cotizador que animar y la página se ve igual. `prefers-reduced-motion`
escribe el valor directo.

---

## 3. B · Microinteracciones en controles

Los 72 sin transición, por tipo, sumando las ocho páginas:

| nº | control | nota |
|---|---|---|
| 17 | `summary` | los acordeones de `/preguntas` y `/empresas` |
| 14 | `a.arrow.cta` | |
| 12 | `a` (sin clase) | |
| 8 | `a.brand` | el logotipo de la cabecera |
| 8 | `a.skip` | **déjalo como está**: sólo existe al recibir el foco, y ahí lo que importa es el `outline`, no una transición |
| 7 | `a.dest` | |
| 4 | `input`, `input.amount.num` | los campos del cotizador |
| 2 | `a.secondary`, `a.arrow` | |

Son **64 a tocar**, no 72.

**Qué se mueve:** relleno y borde en 120 ms, el subrayado del enlace, y **la pulsación hunde el
control 1 px sobre el eje del isotipo** — `translate(-1px, 1.5px)`, que son ~34°, la dirección que
el §9 fija para todo lo que se mueve. Nunca un `translateY` vertical.

**Qué NO se mueve:** ninguna tarjeta. El §9 prohíbe el hover en tarjetas por su nombre y no hace
falta: el movimiento va en el control, no en la superficie. Tampoco sombras que crecen.

El `outline` de foco no se toca: ya está definido en el §10 y es accesibilidad, no adorno.

---

## 4. C · El dibujo de la geometría en `/empresas`

`UseCaseFigure.astro` tiene tres variantes (`cruza`, `convierte`, `reparte`) con nueve trazos. La
maquinaria ya existe en `tokens.css:205`:

```css
.js-motion [data-draw]{stroke-dasharray:var(--draw-len,120);stroke-dashoffset:var(--draw-len,120)}
.js-motion [data-draw].is-in{stroke-dashoffset:0;transition:stroke-dashoffset var(--m-slow) var(--m-ease)}
```

**Dos trampas que se ven midiendo y no leyendo:**

**a) `--draw-len` vale 120 por omisión.** Un trazo más largo que 120 px se ve **parcialmente
dibujado en reposo**, antes de entrar. Cada `path` necesita su propio `--draw-len` ≥ su longitud
real (`getTotalLength()`), o un valor generoso comprobado sobre el render.

**b) `.edge` ya lleva `stroke-dasharray="3 4"`** — es un punteado deliberado. `data-draw` pisa el
`stroke-dasharray`, así que aplicárselo **destruye el punteado**. `data-draw` va en `.link` y en
`.bar`, no en `.edge`.

Y la regla del §9 que acota el alcance: **la entrada al hacer scroll es de un elemento por
sección**. Cuatro figuras que se dibujan a la vez no; cada figura entra con su bloque.

---

## 5. Qué comprobar

1. **Teclea en el cotizador y mira el campo que NO tocas**: se anima. El que tocas, no.
2. Vacía el campo: la salida se vacía de golpe, **sin recorrer hacia cero**. Es la línea que separa
   lo permitido de lo prohibido y es lo primero que miraría.
3. Recarga: el valor inicial aparece, no se recorre.
4. `prefers-reduced-motion`: las tres cosas apagadas, el sitio completo e inmóvil.
5. Sin JavaScript: igual que hoy.
6. **Ninguna tarjeta gana hover.** Cuenta los elementos con `transition` que no sean controles.
7. Las figuras de `/empresas` no se ven a medio dibujar en reposo — es el fallo de `--draw-len` y
   sólo se ve mirando el render antes de que entren.
8. El punteado de `.edge` sigue siendo punteado.
9. El techo de 280 ms se respeta en las tres.

---

## 6. Lo que NO entra

- **El teléfono único de la Home.** Lo propuse, Sebastián prefiere el zigzag por el dinamismo que
  da, y tiene razón en el dato: los ocho elementos del mockup ya llevan `data-enter`. Archivado.
- Sombras, parallax, movimiento continuo, transiciones de página.

---

## 7. Lo de siempre

`cowork/` no toca `src/`. Y borra `cowork/_tmp-src.tar.gz` y `cowork/_tmp-borrar.tar.gz` si siguen
ahí: los dejé yo para poder construir el sitio desde el contenedor y esta sesión no tiene permiso
de borrado en la carpeta.

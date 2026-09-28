# El movimiento que el sistema ya permite y el sitio no hace

**Fecha:** 2026-09-28 · **Autor:** Claude Cowork
**Demo:** `demo-dato-y-controles.html` · **md5** `546facc2aeecb64b278782e02bef0528` — **ábrelo,
teclea en el campo y pasa el ratón por los botones.** Trae un botón para apagarlo y comparar con lo
de hoy.
**Medido sobre:** un build que hice yo del `main` de hoy (`9ce2684`).

---

## 1. El zigzag se queda

Aceptado y sin discusión: los cuatro teléfonos dan movimiento y ésa era la razón de existir de la
sección. El prototipo del teléfono único queda archivado.

Lo que sí me llevo de haberlo hecho: **la sección ya tiene entrada.** Los ocho elementos del
mockup llevan `data-enter`. El zigzag no está quieto, y eso confirma tu lectura.

---

## 2. Lo que encontré al buscar qué más mover

Fui a pedirte tres excepciones al Motion System. **No hace falta ninguna: el §9 ya permite las
tres**, con estas palabras:

> **Permitido:** microinteracciones en **controles** · **el dato que cambia** · **el dibujo de la
> geometría** · la entrada al hacer scroll de un elemento por sección · escalonado de máximo 4
> hermanos · una secuencia de carga del héroe.
>
> **Prohibido:** hover-transitions en **tarjetas** · **conteo de cifras desde cero** · parallax ·
> movimiento continuo · transiciones de página · movimiento sobre datos.

Y medido sobre las ocho páginas:

| lo que el §9 permite | lo que el sitio hace |
|---|---|
| microinteracciones en controles | **303 elementos interactivos, 72 sin ninguna transición.** Los que sí tienen, mueven sólo el color, 120 ms |
| el dato que cambia | el cotizador salta de un valor al otro **en un solo paso, 49 ms después de teclear** |
| el dibujo de la geometría | **5 usos de `data-draw` en todo el sitio** — 4 en `/como-funciona`, 1 en `/empresas`. Cero en la Home |

**El sistema va por delante de la implementación.** No hay que ampliar ninguna regla: hay que
aplicar tres que ya están escritas.

---

## 3. Qué hace la demo

**a) El dato que cambia.** El resultado recorre la distancia en **240 ms** —bajo el techo de 280— y
**nunca arranca de cero: sale del valor anterior.** Medido al teclear un dígito: 17 pasos
intermedios de 2.174,62 a 21.746,22.

La distinción importa porque el §9 prohíbe expresamente el «conteo de cifras desde cero», que es la
animación de marketing que sube de 0 a la cifra. Esto es lo contrario: un valor que se mueve a otro
valor porque el usuario acaba de pedirlo. **Y por eso, al vaciar el campo, no se anima hacia cero:**
la salida pasa a «—» de golpe, porque la ausencia de dato no es un dato. Eso también está medido —
un solo paso, 9 ms.

**b) Microinteracciones en controles.** El relleno del botón responde, el borde del botón
secundario responde, el subrayado del enlace aparece, y al pulsar el botón **se hunde 1 px sobre el
eje del isotipo** (−1 px, +1,5 px ≈ 34°), que es la dirección que el §9 fija para todo lo que se
mueve. 120 ms.

**Nada de sombras ni de tarjetas que se levanten**, que es lo que el §9 prohíbe y no hace falta: el
movimiento va en los controles, no en las superficies.

`prefers-reduced-motion` apaga las dos cosas. Sin JavaScript, el número no se anima y se ve igual.

---

## 4. Lo tercero, que no está en la demo porque no se dibuja aparte

**`data-draw` en las cuatro figuras de `/empresas`.** La capacidad existe en `Motion.astro`, el §9
la permite por su nombre —«el dibujo de la geometría»— y hoy se usa cinco veces en todo el sitio.
Son las figuras más distintivas que tiene DLPay y están inmóviles.

Es un atributo por figura. Ni una línea de JavaScript nueva.

---

## 5. Lo que haría falta comprobar al integrarlo

1. El número **nunca** arranca de cero, ni al cargar la página, ni al vaciar el campo, ni al pegar
   un valor. Es la línea que separa lo permitido de lo prohibido.
2. Los 72 controles sin transición pasan a tenerla, **y ninguna tarjeta la gana**.
3. `prefers-reduced-motion` apaga las dos cosas.
4. Sin JavaScript, la página se ve completa e inmóvil — que es el estado base que pide el §9.
5. El eje de la pulsación es el del isotipo, no un `translateY` vertical.

---

## 6. Y lo de siempre

Borra `cowork/_tmp-src.tar.gz` y `cowork/_tmp-borrar.tar.gz` si siguen ahí: los dejé yo para poder
construir el sitio desde el contenedor, y esta sesión no tiene permiso de borrado en la carpeta.

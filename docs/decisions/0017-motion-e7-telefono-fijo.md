# ADR-0017 — Motion V1, séptima excepción: el teléfono que se queda

- **Estado:** Aceptada — 2026-10-23
- **Decide:** Sebastián Villanueva. Lo pidió el 2026-10-23: «dejar el celular de la home fijo, y que a
  medida que uno baje vaya cambiando el chat dentro del celular en vez del zig zag que ya tenemos».
  La idea era de Cowork, del 2026-09-28 (`Claude outputs/analisis.md` y
  `prototipo-un-telefono.html`). Ese mismo día Sebastián eligió:
  - que la conversación **crezca**, en vez de reemplazarse en cada paso;
  - que en móvil el teléfono **también quede fijo**, arriba.
- **Ámbito:** `src/components/Process.astro` («Así se ve tu operación, paso a paso», en la Home). Su
  teléfono es la variante `escena` de `WhatsAppMockup.astro`. El resto del sitio no cambia.
- **Identificador:** `motion-e7`
- **Referencia:**
  - Motion System V1 §4: reglas duras 1, 5 y 6.
  - ADR-0016, la sexta excepción, que estrenó esta técnica.
  - ADR-0015, que dejó escrita la pregunta sobre V1.
  - ADR-0014 §3: ningún plazo de la entrega final.

## Contexto

**«Así se ve tu operación» eran cuatro teléfonos en zig-zag**, uno por paso, con su trozo de
conversación cada uno. Medían 2.313 px a 1280 y 2.676 a 390: un 30 % de la Home para cuatro
capturas del mismo aparato.

Los sitios que Sebastián tomó de referencia resuelven esto igual: **un aparato que se queda quieto
y cambia de pantalla mientras lees.** El cliente no pierde de vista el producto, y la sección deja
de ser un catálogo de capturas para convertirse en una demostración.

## Decisión

**Un solo teléfono, fijo mientras pasan los cuatro pasos. Su conversación crece**: cada paso suma
sus mensajes abajo cuando su texto pasa por el centro de lo que se ve, y lo viejo sale por arriba,
como en cualquier chat. El paso que estás leyendo pasa de `--ink-mute` a `--ink`.

1. **Cero JavaScript.** El prototipo de septiembre usaba un `IntersectionObserver` y un oyente de
   scroll; esto es CSS, con la técnica de ADR-0016:
   - cada paso declara una línea de tiempo de vista con nombre (`--paso-1` … `--paso-4`);
   - la escena se las presta al teléfono con `timeline-scope`;
   - cada mensaje se abre con la línea de su paso (`grid-template-rows: 0fr → 1fr`, más la
     opacidad).

   No pasa por `Motion.astro`, no añade ningún script y no toca el CSP.
2. **Lo mueve quien baja.** No arranca solo, se detiene si dejas de bajar y vuelve atrás si subes.
3. **Tres condiciones, todas obligatorias:**
   - `@supports (animation-timeline: view()) and (timeline-scope: none)`;
   - `prefers-reduced-motion: no-preference`;
   - **una pantalla con alto para el teléfono y el texto:** desde 640 px en escritorio y 600 en
     móvil.

   **Si falta una, la sección está quieta y entera**: el teléfono con la conversación completa, nada
   cortado, al lado de los pasos en escritorio y encima de ellos en móvil. No se pierde ningún
   contenido: lo único que falta es el movimiento. Esa forma quieta mide 941 px a 1280 y 1.372 a
   390.
4. **El teléfono va antes que los pasos en el DOM.** En móvil es el que se pega arriba, y si fuera
   después se pegaría cuando ya pasaste los cuatro pasos. Va `aria-hidden`, así que el orden de
   lectura es el del texto.
5. **El «centro» es el de lo que se ve.** En móvil, el teléfono (364 px) y la barra del cotizador
   (72 px) se descuentan con `view-timeline-inset`: los mensajes llegan cuando el texto pasa por el
   centro del hueco entre los dos, no por el de la pantalla.
6. **Ninguna marca nueva.** El paso activo se señala con el color del texto, no con un filete verde:
   un tramo verde, en el DS §6.2, quiere decir «lo nuestro».
7. **Ningún plazo.** La conversación no tiene horas, y el último mensaje es el que ya existía:
   «¡Listo! El dinero ya está en destino.»

## Lo que enmienda, y lo que no

| Regla del Motion System | Estado |
|---|---|
| §4, regla dura 1 — **una sola vez** | **Enmendada, y sólo para esta pieza**, como en ADR-0016: los mensajes se cierran si subes y se vuelven a abrir si bajas. **A diferencia de la banda, aquí el movimiento es el contenido**: la sección cuenta una conversación, y la conversación se entiende viéndola avanzar |
| §2c — techo de **280 ms** | **No aplica.** No tiene duración |
| §4, regla dura 3 — las cifras no entran | **Intacta.** Las cifras de los mensajes no se animan; se abre el mensaje entero |
| §4, regla dura 5 — sin JavaScript todo se ve | **Intacta, por construcción.** No hay JavaScript, y la forma quieta es la de partida |
| §4, regla dura 6 — `prefers-reduced-motion` | **Intacta, y más estricta.** Con la preferencia no se declara ninguna animación ni se fija el teléfono |

## Lo que cuesta

Medido sobre `c78939f`:

- **JavaScript: 0 B.** Los mismos archivos, el mismo CSP.
- **HTML de la Home: −1,6 KB**, porque son tres teléfonos menos.
- **CSS de la Home: +0,5 KB comprimidos.**
- **La sección**, en movimiento, mide 2.022 px a 1280 × 800 y 2.245 a 390 × 844: −291 y −431 px.
  Quieta mide 941 y 1.372.

## Lo que este ADR NO concede

- **Ningún otro teléfono fijo, ni otra sección que se narre al bajar.** Otra pieza que lo quiera
  trae su propio ADR.
- **Ningún plazo, ningún canal de entrega y ninguna «remesa»** en la conversación (ADR-0014).

## La pregunta, por tercera vez

**Ésta es la séptima excepción**, y la segunda ligada al desplazamiento. ADR-0015 dejó escrita la
pregunta de si V1 sigue describiendo el movimiento de este sitio, y ADR-0016 la repitió. Este ADR
no la contesta, pero sí la acota:

- las dos excepciones ligadas al desplazamiento comparten técnica, condiciones y guardarrieles;
- **si V1 se revisa, ésa es la familia que le falta**: un séptimo movimiento, «ligado al
  desplazamiento», con sus reglas, en vez de una excepción por pieza.

La decisión es de Sebastián.

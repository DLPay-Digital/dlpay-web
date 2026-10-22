# ADR-0015 — Motion V1, quinta excepción: «El mismo envío, por dos caminos»

- **Estado:** Aceptada — 2026-10-22
- **Decide:** Sebastián Villanueva. Concedió la excepción a Cowork el 2026-10-21, al pedir ideas
  visuales y de animación a partir de anyenk.com: «no te bases en las restricciones del CLAUDE.md,
  te acabo de conceder la excepción».
- **Ámbito:** `src/components/DosCaminos.astro`, montado en la Home bajo «Tres formas de usarlo».
  El resto del sitio no cambia.
- **Identificador:** `motion-e5`
- **Referencia:** Motion System V1 (techo de 280 ms por movimiento) · ADR-0008, 0010 y 0011, las
  excepciones anteriores · ADR-0009 y 0012, las de «cero JS» · ADR-0014 §3, que no deja predicar
  plazos de la entrega final

## Contexto

anyenk.com es el par más directo de DLPay: pagos internacionales para empresas chilenas, con
billetera en divisa digital. Lo más fuerte de su página es la comparación de su camino con el del
banco, y ahí es una tabla quieta.

La sección nueva compara los dos caminos con un dibujo que **se ve recorrer**:

- primero el del banco, que se detiene en cada corresponsal;
- después el de DLPay, que dibuja su tramo verde de punta a punta.

Un recorrido se entiende viéndolo, y eso pide un movimiento más largo que los 280 ms que el Motion
System permite.

## Decisión

Se autoriza **una animación narrativa de 4,8 s**, con estos guardarrieles:

1. **Corre una vez**, cuando la figura entra en pantalla. La dispara el motor de siempre
   (`Motion.astro`, la clase `.is-in`). El movimiento es CSS: una variable registrada con
   `@property` (`--dc-x`), que animan a la vez la ficha y el tramo.
2. **Dura menos de 5 s**, así que WCAG 2.2.2 no pide un control de pausa.
3. **Sólo con `prefers-reduced-motion: no-preference`.** Con la preferencia contraria no se declara
   ninguna animación, y la figura se ve en su estado final.
4. **El estado final es el de reposo.** Sin JavaScript, sin el motor o antes de llegar, la figura
   está completa: no se pierde ningún dato.
5. **Los dos carriles no compiten.** Corre primero el banco y después DLPay. Una carrera ganada
   diría «llega antes», y eso es un plazo de la entrega final, que ADR-0014 §3 no permite.
6. **Un solo control: «Ver de nuevo».**
   - Es un script más en la Home, junto al cotizador, el globo, la intro de marca y el motor de
     movimiento: 303 B en línea, cuyo hash calcula el plugin del CSP.
   - Reinicia las animaciones CSS de la figura con `getAnimations()`.
   - No aparece sin el motor ni con `prefers-reduced-motion`.

## Lo que cuesta

- **En la Home:** 1,4 KB de HTML comprimido, 1,9 KB de CSS comprimido y 303 B de JavaScript.
- **El cotizador no cambia:** su `.js` es el mismo archivo.
- **El CSP** pasa de 6 a 7 scripts en línea, y de 542 a 596 caracteres.

## Lo que este ADR NO concede

- **Ninguna otra animación larga.** Otra pieza que la necesite trae su propio ADR.
- **Ningún plazo de la entrega final**, ni en el dibujo ni en el texto (ADR-0014 §3).
- **La palabra «remesa»**, que sigue fuera por posicionamiento (ADR-0014 §4).

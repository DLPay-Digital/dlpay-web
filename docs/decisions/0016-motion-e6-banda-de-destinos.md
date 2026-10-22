# ADR-0016 — Motion V1, sexta excepción: la banda de los destinos

- **Estado:** Aceptada — 2026-10-22
- **Decide:** Sebastián Villanueva. Pidió la pieza el 2026-10-22, al encargar a Cowork lo que se
  podía traer de wise.com: «Esa banda que gira las banderas de los países a medida que uno baja,
  pero dándole un toque más de nosotros». La fase es de prueba y la excepción la concedió él: «tienes
  libre uso de todo ya que estamos en fase de prueba».
- **Ámbito:** la banda de `src/components/Destinos.astro`, montada en la Home bajo el globo. Ni la
  sección entera —sus tarjetas se abren sin movimiento propio— ni el resto del sitio cambian.
- **Identificador:** `motion-e6`
- **Referencia:** Motion System V1 §4, reglas duras 1 y 6, y el techo de 280 ms del §2c · ADR-0015,
  la quinta excepción, y el párrafo que dejó escrito sobre el umbral · ADR-0001, el isotipo como
  vector de movimiento · ADR-0014 §3, ningún plazo de la entrega final

## Contexto

En wise.com, al bajar, una píldora verde con una flecha empuja una fila de banderas redondas que
giran como ruedas. Es la pieza que mejor dice «a muchos países» sin una sola palabra.

Copiada tal cual, sería la de Wise. **La versión de DLPay usa las marcas que el sistema ya tiene**
(DS §6.2):

- **La píldora es una cápsula de tinta que sale de Chile**: su bandera y «CLP».
- **Dentro lleva el tramo verde**, que es lo nuestro y, desde ADR-0014, va de punta a punta.
- **Termina en el isotipo**, el vector de movimiento del que sale todo el sistema geométrico
  (ADR-0001), sobre un círculo verde.
- Delante, **las trece banderas de los destinos**, en el orden de las tarjetas.

Al bajar, la cápsula crece y empuja la fila, y cada bandera gira lo que giraría una rueda de 56 px al
avanzar eso mismo: **360° por cada π·56 ≈ 176 px, sin resbalar.**

## Decisión

Se autoriza **un movimiento ligado al desplazamiento**, con estos guardarrieles:

1. **Lo mueve quien baja, no un reloj.** Es CSS: `view-timeline` sobre la banda y
   `animation-timeline` en la cápsula y las banderas, con `animation-range: cover 5% cover 75%`. No
   arranca solo. Si dejas de bajar, se detiene, y si subes, vuelve atrás.
2. **Cero JavaScript.** No pasa por `Motion.astro`, no añade ningún script y no toca el CSP.
3. **Sólo con `prefers-reduced-motion: no-preference` y en un navegador que entienda esas líneas de
   tiempo**, con `@supports (animation-timeline: view())`. En cualquier otro caso no se declara
   ninguna animación y la banda está quieta en su **reposo**: la cápsula a un ancho intermedio y
   las banderas derechas.
4. **El reposo se lee igual.** La banda es decorativa entera (`aria-hidden`). Cada destino, su
   moneda y su precio están escritos en las tarjetas de abajo: con la banda quieta, o sin ella, no
   se pierde nada.
5. **El isotipo se ve siempre entero.**
   - Los anchos van en px y por tramo de pantalla:

     | Pantalla | Inicio | Reposo | Final | Giro |
     |---|---|---|---|---|
     | bajo 390 px | 210 | 240 | 280 | 143° |
     | 390–599 | 210 | 260 | 340 | 266° |
     | 600–899 | 220 | 320 | 520 | 614° |
     | desde 900 | 260 | 420 | 760 | 1023° |

   - El final nunca pasa del borde derecho de la pantalla.
   - 210 px es lo mínimo que cabe dentro: bandera, «CLP» con el espaciado de WCAG 1.4.12, un trozo de
     tramo y el isotipo. Además, `min-width: min-content` lo garantiza.
   - El giro de cada tramo se calcula con su crecimiento. Una división de dos longitudes dentro de
     `calc()` daría lo mismo, pero todavía no la entienden todos los navegadores.
6. **Ninguna cifra y ningún plazo.** La cápsula no llega a ninguna parte ni gana ninguna carrera: crece
   mientras bajas. Una banda que «llega» diría cuánto tarda, y eso es un plazo de la entrega final,
   que ADR-0014 §3 no permite.

## Lo que enmienda, y lo que no

| Regla del Motion System | Estado |
|---|---|
| §4, regla dura 1 — **una sola vez** | **Enmendada, y sólo para esta pieza.** Es la primera del sitio que se mueve otra vez al volver a pasar, y esa regla existe justamente contra eso: «el sello del movimiento decorativo». Lo que la distingue es que **no se re-anima, se arrastra**: es una función de dónde está la página. Quieta la página, quieta la banda. Pero es decorativa, y no hay que disimularlo |
| §2c — techo de **280 ms** | **No aplica.** No tiene duración: dura lo que tardes en bajar |
| §4, regla dura 3 — las cifras no entran | **Intacta.** No hay cifras en la banda |
| §4, regla dura 5 — sin JavaScript todo se ve | **Intacta.** No usa JavaScript |
| §4, regla dura 6 — `prefers-reduced-motion` | **Intacta, y más estricta.** Con la preferencia no se declara ninguna animación |

## Lo que cuesta

- **En la Home, la sección entera:** 2,8 KB de HTML y 1,3 KB de CSS, comprimidos (medidos aparte).
  La banda es una parte de eso:
  - las trece banderas de 56 px, que son un `<use>` cada una;
  - las cuatro reglas de su movimiento.
- **0 B de JavaScript.**
- **El CSP no cambia:** siguen siendo 7 scripts en línea.

## Lo que este ADR NO concede

- **Ningún otro movimiento ligado al desplazamiento.** Otra pieza que lo quiera trae su propio ADR.
- **Las tarjetas de destino no se animan.** El giro del chevron al abrir es M1 y ya existía.
- **Ningún plazo, ningún canal de entrega y ninguna «remesa»**, ni en el dibujo ni en el texto
  (ADR-0014 §3 y §4).

## La pregunta que ADR-0015 dejó escrita

**Ésta es la sexta excepción.** ADR-0015 dejó dicho que el umbral de «si V1 necesita revisión» se
cruzó en la cuarta y que nadie hizo la pregunta. Este ADR no la contesta: la repite.

- **Las seis están razonadas, acotadas y pedidas una a una.**
- **Por primera vez una rompe la regla 1**, la que separaba el movimiento que sirve del que decora.

La decisión de revisar V1 es de Sebastián.

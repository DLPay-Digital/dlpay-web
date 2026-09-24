# Prompt para el agente de Claude Code — `2026-09-24-precio-que-aceptas`

**Fecha:** 2026-09-24 · **Autor:** Claude Cowork
**Maqueta:** `aceptas.html` · **md5:** `547d6ab083e8212a615be7342c77c56b` · **v2**
**Ficha:** `ficha.md` — léela entera. Esta entrega no es sólo un dibujo.

> **No integres la figura sin hacer antes los dos documentos.** Estrena familia de figura y estrena
> movimiento largo, y el propio sistema exige escribir las dos cosas antes de dibujar. Si sólo entra
> el SVG, el sitio gana una marca que ninguna regla explica.

---

## 0. El orden importa

1. Escribir la entrada de la sexta familia en el **Design System §6.2** (ficha §3).
2. Escribir la **enmienda de movimiento**, al estilo del ADR-0008 del globo (ficha §5).
3. Recién entonces, integrar la banda en `/precio`.

---

## 1. Qué es y dónde va

Una banda sobre `--tinta` en `/precio`, **entre la tabla de costos y las tres columnas**. Dibuja una
frase que `/tarifas` ya publica:

> «…el precio aplicable te lo informa tu ejecutivo antes de que transfieras, **y no cambia después
> de que lo aceptas**.»

La banda además rompe la planicie de la página: medido sobre el build, `/precio` tiene **1.610 px
seguidos sin ninguna figura**, el 73 % de su `main`.

**Va sobre tinta y no sobre papel por una razón dura:** `--verde` sobre `--papel` da **2,02:1** y es
inadmisible para un gráfico con significado. Sobre tinta da **8,45:1**. Si alguien la mueve a una
banda clara, el verde tiene que pasar a `--verde-deep` y hay que recalcular.

---

## 2. Los cuatro elementos

```html
<svg class="curva" viewBox="0 34 1200 150" preserveAspectRatio="none" aria-hidden="true">
  <path class="frontera" d="M432 34V184"/>
  <path class="mercado"  pathLength="1" d="…201 puntos, cópialo de la maqueta…"/>
  <path class="precio"   pathLength="1" d="M432 120H1200"/>
</svg>
<span class="nodo" aria-hidden="true"></span>   <!-- HTML, no <circle> -->
```

Grosores **1,5** el mercado y **3,4** el precio, los dos con `vector-effect: non-scaling-stroke`.
Alto 232 px en escritorio, 168 en móvil.

**Tres cosas que no son detalles y que costaron una versión entera:**

**a) El lienzo sangra hasta el borde de la pantalla** (`margin-right: calc(50% - 50vw)`) y el camino
cubre todo el ancho visible. En la v1, con `preserveAspectRatio="slice"`, el SVG sólo mostraba
x 0–751 de un viewBox de 1000 y **el tercio derecho era línea verde sola, sin mercado** — justo
donde la figura tiene que demostrar que el mercado sigue. Las dos líneas tienen que salirse del
cuadro por la derecha.

**b) El punto va en HTML, no como `<circle>`.** Con el SVG estirado un círculo sale ovalado. Va
posicionado al **36 %** y al **57,33 %** del lienzo, que son 432/1200 y (120−34)/150 del `viewBox`.
Si mueves el `viewBox`, recalcula los dos porcentajes.

**c) El camino del mercado no se toca a ojo.** Son 201 puntos construidos con tres octavas de ruido
suave para que tenga textura de mercado y no de sierra, y **corregidos** para que la figura no
afirme que fijar el precio fue buen ni mal negocio:

| garantía | valor medido sobre el path que se publica |
|---|---|
| Media del tramo posterior | **+1,409 px** |
| Excursión máxima arriba / abajo | **58,2 / 58,2 px** (diferencia 0,00) |
| Cruces de la horizontal | 9 |
| Último punto | 20,6 px — el 35 % de la excursión máxima |

Las cuatro correcciones valen cero en el punto de aceptación, así que no se ve el retoque. **Si
cambias el camino, vuelve a calcularlo**: filtrando caminos al azar no sale ninguno que cumpla, hay
que construirlo. El método está en la ficha §4.b.

**Lo que hace que la figura sea verdad es que el gris no se detiene en el punto.** La quietud sólo
se ve contra el movimiento. No recortes el tramo posterior.

### Cómo copiar el trazado sin romperlo

Son 2.137 bytes en una sola línea y **no van pegados aquí a propósito**: un salto de línea metido
por el editor dentro del atributo `d` lo parte y el fallo es silencioso. Sácalo del atributo `d` de
`.mercado` en la maqueta, **en una sola línea y literal**, y comprueba antes que la maqueta es la
que digo: `md5sum aceptas.html` tiene que dar `547d6ab083e8212a615be7342c77c56b`.

---

## 3. Los rótulos van en HTML, fuera del SVG

A 320 px un `<text>` dentro del SVG cae a 9 px. Es la corrección del riel tokenizado. El SVG va
`aria-hidden="true"` y los tres rótulos son texto de verdad en un `<div>`.

---

## 4. El movimiento

Trazado del mercado (1.300 ms) → brota el punto (300 ms) → trazado de la recta (720 ms).
**Total 2.190 ms**, muy por encima del techo de 280 ms.

Necesita su enmienda, con el mismo alcance acotado que el ADR-0008 le dio al globo: enmienda la
pieza, no los seis movimientos ni el techo fuera de ella. La ventaja a escribir está en la ficha §5.

**Las reglas duras se cumplen y están verificadas sobre el render en los tres caminos** —con JS, con
`prefers-reduced-motion`, y con JavaScript desactivado—: en los tres se ve todo al final. La regla
dura 5 se cumple por construcción, con el estado inicial oculto bajo una clase en `<html>`. En la
maqueta esa clase la pone un script al cargar; **en producción va con el observador del sitio**, que
además da la regla dura 1, una sola vez.

---

## 5. Lo que tiene que firmar Compliance

El titular **son las palabras publicadas de `/tarifas`**, así que no es copy nuevo. Pero ahí viven
en un párrafo y aquí son un titular de 32 px sobre tinta, y eso cambia el peso de lo que se afirma.

**Y una cosa que no se puede relajar:** `Process.astro` lleva el marcador
`REQUIERE VALIDACIÓN DE COMPLIANCE` sobre «Precio garantizado» y «Congelamos tu precio». La banda no
usa ninguna de las dos y **no debe usarlas**. «Garantizado» es una promesa sobre el futuro; «no
cambia después de que lo aceptas» describe cómo opera la mesa. No son sinónimos.

---

## 6. Qué comprobar antes de darla por buena

1. Los tres caminos de movimiento terminan con todo visible (JS, reduced-motion, sin JS).
2. Grosores reales 1,5 px y 3,4 px a 390 y a 1280 — si cambian, falta el `non-scaling-stroke`.
3. **El punto es redondo**, no ovalado, a 390 y a 1280. Si sale ovalado es que volvió a ser un `<circle>` dentro del SVG estirado.
4. Cero elementos `<text>` dentro del SVG.
5. Sin scroll horizontal a 320, 390 y 1280, y el sangrado no abre scroll lateral en ninguno.
6. Contrastes sobre tinta: mercado `--on-tinta-mute` **8,18:1**, punto y recta `--verde` **8,45:1**, frontera `--line-on-tinta` al 40 % **3,51:1**.
7. Las dos líneas **llegan al borde derecho de la pantalla**. Si alguna termina antes, el sangrado se perdió y con él lo que la figura dice.
8. El §6.2 tiene su entrada nueva y la enmienda de movimiento existe **antes** de que el SVG entre.

---

## 7. Lo siguiente, que es más barato y no lo hice para no mezclar

**El índice del blog.** Medido: 788 px de `main`, **cero anclas visuales**, y las dos portadas de
los artículos —una de figura y una de dato— **existen y no se ven ahí**. `post.data.portada` ya está
disponible en el índice. No hay que dibujar nada: hay que mostrar lo que ya está hecho.

---

## 8. Lo de siempre

`cowork/` no toca `src/`. La maqueta es sólo visualización.

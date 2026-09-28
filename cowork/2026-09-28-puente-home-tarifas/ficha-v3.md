# Puente 1 de 5 · Home → Tarifas · **v3**

**Fecha:** 2026-09-28 · **Autor:** Claude Cowork
**Maqueta:** `puente-home-tarifas-v3.html` · **md5** `cf3f6f0dad49fb469e41f5e6eb0b66d5` —
**ábrela y desplázate.** Renders: `v3-1280.png` y `v3-390.png`.
**No escribí nada en el repositorio.**

---

## 1. Lo primero: la v2 rompía tres reglas escritas, y no las vi porque no leí de dónde salía el texto

Usé las frases de la figura de `/tarifas` sin leer la cabecera del archivo del que las saqué.
Ahí están escritas, con su motivo, y la v2 incumplía tres:

| regla, textual de `pages/tarifas.astro` | qué hacía la v2 |
|---|---|
| «**La barra no se parte.** …una barra dividida afirma que se pueden ver por separado» | la barra entraba **cortada por el borde izquierdo**: una magnitud que sigue fuera del cuadro es precio que no se ve |
| «**La llave abarca la barra entera y nombra lo que hay dentro**» | **no había llave.** Sin ella el dibujo dice «hasta acá llega», no «esto lo incluye todo» — que es justo lo que promete el titular |
| «**El vacío después del punteado es el argumento, no un margen. No se mete nada ahí ni se recorta para ganar altura**» | metí un **tramado** en el vacío, y lo defendí en la ficha diciendo que si no «se leía como espacio vacío del diseño». Es exactamente lo que la regla prohíbe: el vacío ES la prueba |

Y dos más, de fuera de esa página:

- **`/empresas` tiene escrito** que «en móvil el emblema va SIEMPRE arriba, aunque en el DOM vaya
  después: **la figura presenta el caso y el texto lo explica**». En la v2, en móvil, la figura
  quedaba **después del botón**: el motivo para pulsar llegaba tarde.
- El fondo del corte era **`#060D17`**, más hondo que la tinta y un color que no existe en el
  sistema. Una superficie nueva en un sitio que tiene cuatro.

Y una que no era regla sino aritmética: **la barra que crece con `scaleX` no está en el catálogo
de movimiento.** M3 es «sólo trazos con `stroke`», y las cuñas del héroe —el caso idéntico: un
`<div>` recortado— fueron **recatalogadas fuera de M3 en septiembre** por ese mismo motivo. Mi
barra creciendo y mi barrido de luz eran un séptimo y un octavo movimiento sin escribir.

---

## 2. Qué es la v3

**El bloque está partido por la diagonal de la marca: papel donde está el texto —que es esta
página— y tinta donde está la figura —que es la otra.**

El umbral no se dibuja con un marco: **es el fondo**. No hay superficie nueva, ni color nuevo, ni
caja: papel y tinta son los dos fondos que el sistema ya tiene, y el corte va en el mismo ángulo y
**en el mismo sentido** que las cuñas del héroe.

> Aquí me equivoqué una vez más y lo arreglé midiendo: había puesto el corte **en espejo**. Las
> cuñas del héroe bajan hacia la izquierda (`polygon(0 100%, 46% 0, …)`) y mi corte bajaba hacia la
> derecha. Medido sobre el propio render: el corte de la v3 da **−33,930°** y las cuñas del héroe
> **−34,216°** con el mismo instrumento. Ahora son la misma diagonal.

**Dentro va la figura de `/tarifas` entera y sin tocar** — la tienes al lado en
`origen-tarifas-1280.png` para comparar: la llave abarcando la barra completa con su punta al
centro, la barra sin partir, el punteado en el extremo de la barra, «el precio que ves» **debajo y
en la tipografía de texto** (en la v2 lo puse encima y en la de cifras: no son la misma voz), y a
la derecha del punteado **nada**.

**El verde cambia, y no es licencia:** el DS §6.2 dice «**el fondo elige el verde**». En `/tarifas`
la barra va sobre papel en `--verde-deep`; acá va sobre tinta, donde el verde vivo rinde 8,45:1.

---

## 3. El movimiento: sólo lo que ya existe, y cero JavaScript nuevo

Tres hermanos —llave, barra, remate— entran con **M4** (opacidad + `translate(-6px, 9px)`, sobre el
eje) escalonados con **M5** a 60 ms. Tres de un máximo de cuatro.

Usan `data-enter`, que **`Motion.astro` ya maneja en la Home**. El bloque no trae script: son
**0 bytes** de JavaScript añadido. Sin barrido, sin bucle, sin barra que crece.

---

## 4. Medido, no supuesto

| | 320 | 390 | 768 | 1280 | 1440 |
|---|---|---|---|---|---|
| alto del bloque | 534 | 529 | 529 | **490** | 490 |
| desborde horizontal | 0 | 0 | 0 | 0 | 0 |
| texto más pequeño | 13 px | 13 | 13 | 13 | 13 |
| texto recortado | 0 | 0 | 0 | 0 | 0 |
| botón | 195×57 | | | | |

**Holgura entre el contenido y el corte** —el número que decide si esto se ve o se rompe—, medida
sobre el render de 960 a 2560 px: **69 a 145 px** por el lado del texto y **78 a 82 px** por el de
la figura. El corte está al 50 % porque ahí las dos holguras se igualan y **dejan de moverse con el
ancho**; probé 44, 46, 48, 50 y 52 y lo tengo tabulado.

**Contraste:** on-tinta 16,44:1 · on-tinta-mute 8,18:1 · verde sobre tinta 8,45:1 · ink 16,00:1 ·
ink-mute 5,50:1 · texto del botón 8,58:1. Todos AA y la mayoría AAA.

**Sin JavaScript** se ve completa e inmóvil. **`prefers-reduced-motion`** la deja quieta —
comprobado con el navegador emulando la preferencia: opacidad 1, sin transformación, transiciones
apagadas.

**Y en móvil el bloque es banda de tinta entera, sin diagonal.** No es pereza: a 390 px la diagonal
baja 263 px a lo largo de la columna y **partía el titular por la mitad**, con medio «Ese número ya
lo incluye todo» en oscuro sobre oscuro. Lo vi renderizando, no razonando.

---

## 5. La excepción que hay que escribir, y qué compra

**Un bloque con dos fondos.** Ninguna sección del sitio tiene dos superficies; todas son de un
color. La ventaja, que es el motivo de proponerla:

1. **El asunto de esta pieza es cruzar.** Con un solo fondo el bloque sólo puede *hablar* de la otra
   página; con dos, la enseña. El puente es la imagen, no el texto.
2. **Cuesta una línea de CSS.** Un degradado con una parada dura. Ni elemento extra, ni imagen, ni
   JavaScript.
3. **Arregla un problema medido de la Home.** La Home tiene exactamente **dos bandas oscuras** —el
   héroe (868 px) y empresas (418 px)— con **5.284 px de papel seguidos** entre ellas. Una tercera
   banda oscura entera aplana ese ritmo. Media banda, no.

Lo demás va dentro de las reglas: cero tokens nuevos, cero colores nuevos, cero JavaScript, un
movimiento del catálogo, y ninguna elevación (el límite de «uno por página» de §4.5 sigue intacto:
esta pieza no gasta ninguno).

---

## 6. Lo que sigue pendiente de ti, y no es de diseño

**a) La Home es diseño congelado y «caso aparte» por decisión tuya.** Este bloque entra ahí. Lo
construí porque tú lo pediste con ese ejemplo, pero **la excepción la escribes tú**.

**b) Dónde va dentro de la Home.** Mi lectura sigue siendo: **después del cotizador y su prueba**,
porque el rótulo dice «el número que viste» y eso sólo es verdad si el número está recién visto.
Con las medidas delante hay un matiz: la Home es héroe (tinta) → 5.284 px de papel → empresas
(tinta) → preguntas. Un puente mitad papel mitad tinta **justo después del héroe** vuelve a poner
oscuro contra oscuro. Si va ahí, conviene dejar respirar al menos el globo entre medias. Lo miro con
la página entera delante cuando me digas que sigo.

**c) El prompt para el agente lo escribo cuando apruebes la pieza y el sitio**, no antes: es una
instrucción, y de esas no sale ninguna sin tu visto bueno.

---

## 7. Las otras cuatro, si ésta te convence

Salen del mismo molde: el corte de la marca, la figura del destino entera y sin retocar, y un botón
relleno. **Tarifas → Confianza** y **Empresas → Confianza** enseñan la línea de tenencia ·
**Precio → Tarifas** enseña esta misma barra · **Cómo funciona → el artículo** enseña su portada.
**Lo que se repite es el corte; lo que cambia es lo que hay al otro lado.**

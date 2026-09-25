# Ficha — `/confianza` v2 · el mecanismo sube a la portada

**Fecha:** 2026-09-25 · **Autor:** Claude Cowork
**Maqueta:** `conf-v2.html` · **md5** `d254b3713833c192da7448ef27718f11`
**Renders:** `conf-1280.png`, `conf-390.png`
**Leído del repositorio en vivo:** `src/pages/confianza.astro`, `src/content/trust.ts`, el build del commit `5dae2f8`.

---

## 1. Traía dos ideas y las dos ya estaban construidas

Leer antes de dibujar las mató a las dos, que es exactamente para lo que sirve leer antes.

**a) La línea de tenencia.** Iba a proponer dibujar dónde está el dinero en cada momento y quién lo
tiene. Existe: es `phases` en `trust.ts`, y su comentario dice que es «una línea de tiempo de
TENENCIA, no de pasos: el eje no es “qué ocurre” sino “de quién es la cuenta donde está la plata”».
Está construida en HTML y no en SVG, con el motivo escrito — el mismo que a mí me costó tres
tropiezos: *«si una figura es texto más rectángulos, es HTML»*.

**b) La mención institucional.** Iba a proponer subirla. Está donde está por una razón escrita:
vive dentro de «Qué te pedimos, y por qué» porque ahí **informa** —explica por qué se piden
documentos— y «en cualquier otro lugar de la página sería un sello disfrazado de frase».

---

## 2. El único cambio

**La línea de tenencia sube a la portada.**

La portada dice, con estas palabras: «No tenemos un sello que mostrarte. **Tenemos un mecanismo que
puedes revisar paso a paso**». Y después hay 322 px de tinta sin nada, y el mecanismo aparece 400 px
más abajo. La promesa y la prueba están separadas por un scroll.

Es además el mismo patrón que aprobaste dos veces: en `/tarifas` subió el cotizador, en
`/como-funciona` subió el chat. Aquí el objeto del que trata la página es el recorrido del dinero.

«Qué pasa con tu plata» se queda con su titular y sus tres mecanismos, que es lo que la bajada
promete: «tres cosas que puedes verificar tú mismo».

---

## 3. Y de paso arregla algo que estaba medido y torcido

Hoy, sobre papel, las tres barras de la línea son:

| tramo | color | qué dice |
|---|---|---|
| En tu cuenta bancaria | `--ink` · `rgb(19,26,38)` | negro a plena fuerza |
| **En la cuenta de DLPay** | `--verde-deep` | el único que es nuestro |
| En tu billetera | `--ink` · `rgb(19,26,38)` | negro a plena fuerza |

**Los dos tramos que no son nuestros están dibujados más pesados que el que sí lo es.** El §6.2
tiene una marca exacta para eso —el filete `--ink-mute`: «existe, es real, no es nuestro»— y estas
barras no la usan.

Al pasar a tinta se arregla solo: los dos tramos ajenos toman `--line-on-tinta` y el nuestro toma
`--verde`. El verde sobre tinta da 8,45:1. No hay que decidir nada de color: el fondo lo decide,
que es como el §6.2 quiere que se decida.

---

## 4. Lo que hay que mirar con lupa, y lo digo yo

**La mención de BCI sube a la portada.** En `trust.ts`, tanto `mechanisms` como `phases` llevan
`REQUIERE VALIDACIÓN DE COMPLIANCE` sobre la mención del banco por nombre. **La cadena no cambia,
pero su posición sí**, y pasa a ser lo primero que se lee en la página.

Es exactamente el error del `PendingNotice`: una frase pendiente de validación que gana peso al
cambiar de sitio. No lo descubrí al final, lo pongo acá arriba: **si Compliance no está cómodo con
esa mención en portada, el cambio no se hace**, o la portada lleva la línea sin nombrar el banco y
el nombre se queda donde está hoy.

---

## 5. Lo que cuesta y lo que no

**Cero copy nuevo.** Ni una cadena. Todo el texto es el que ya está en `trust.ts` y en la página.

**Cero `--elev-card`.** La figura va plana sobre la tinta; no necesita superficie y el §4.5 no se
toca.

**Una tensión que es juicio y no medida:** hoy la figura llega enmarcada por el titular «Qué pasa
con tu plata». En la portada llega justo después de la bajada que la promete. Creo que gana, porque
la promesa y la prueba quedan juntas — pero es una opinión, no un número, y si la ves al revés se
queda donde está y el cambio se reduce al color de las barras, que sí está medido.

**Comprobado sobre el render**, a 1280 y a 390: texto más pequeño **13 px** · sin scroll horizontal
· cero elementos ocultos · en móvil las tres fases apilan y se leen en orden, que es la lectura
correcta de una secuencia.

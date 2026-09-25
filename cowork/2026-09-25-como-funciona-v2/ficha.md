# Ficha — `/como-funciona` v2 · el producto entra y el suelo cambia de manos

**Fecha:** 2026-09-25 · **Autor:** Claude Cowork
**Maqueta:** `cf-v2.html` · **md5** `e6ab9aeead91afa01fe15e24cbf5e9d6`
**Renders:** `cf-1280.png`, `cf-390.png`
**Medido sobre:** el `src/` y el `dist/` de hoy, leídos del repositorio en vivo.

---

## 1. Lo que NO toco, y por qué

Antes de dibujar leí la página entera y las reglas que la gobiernan. Tres cosas quedan fuera, y
dos de ellas eran ideas mías que la lectura mató:

**a) El cierre ya es una figura.** Iba a proponer dibujar «Dónde termina nuestra operación» con una
barra verde y tres filetes grises. Es `EjeDeAlcance`, existe, y el comentario de la página explica
que es **la mitad derecha del mismo eje que abre la Home**, sin hitos a propósito «porque la página
acaba de contar los seis pasos justo encima». Proponer redibujarlo habría sido proponer algo que el
proyecto ya construyó, con motivo escrito.

**b) Los tiempos no se agrandan.** Era mi mejor idea —«un toque», «minutos», «~5 min desde el
pago» son el argumento de la página y están en tamaño de nota al pie—. El tiempo del paso 06 lleva
`REQUIERE VALIDACIÓN DE COMPLIANCE` en `process.ts`. Agrandarlo es amplificar una cifra sin validar
a tamaño de titular: el error del `PendingNotice`, otra vez. Se quedan como están.

**c) La escalera de dos columnas, los seis pasos, el reparto «tú / nosotros» y las marcas de
traspaso calculadas desde `process.ts`.** Está bien resuelto y no lo mejoro.

---

## 2. Lo que sí hago

**Medido sobre el build de hoy:** `/como-funciona` tiene **3.007 px de `main`, cero anclas de más
de 24×24 px y cero superficies elevadas**. Es, con `/preguntas`, la más plana del sitio.

**a) El producto aparece.** Los pasos 02 y 06 son literalmente el chat, y `WhatsAppMockup.astro`
existe desde hace tiempo — se usa en `Process.astro` y en `MacbookMockup.astro`, no aquí. La página
que explica la conversación no enseñaba la conversación. El teléfono entra en la portada con el
momento que la página describe: el mensaje que el botón escribe solo, y el ejecutivo confirmando.

**b) El suelo cambia de manos.** Los pasos que hacemos nosotros van sobre `--papel-2`; los tuyos,
sobre `--papel`. El terreno cambia exactamente donde cambia el responsable, que es lo que la página
dice con palabras —«Marcamos quién hace qué, para que no quede ninguna zona gris»— y hasta ahora
sólo decía con la columna. En el teléfono, donde no hay dos columnas, es lo único que lo dice.

Eso es todo. Dos cambios.

---

## 3. El §4.5 nuevo, delante y no detrás

Esta vez leí la regla antes de dibujar, que es lo que no hice en `tarifas-v2`.

| límite | cómo queda | comprobado |
|---|---|---|
| como mucho un `--elev-card` por página | el teléfono | **1 sombra en toda la página**, medida sobre el render |
| la superficie alterna con el papel | 3 de 6 pasos sobre `--papel-2`, el resto papel | sí |
| la sombra nunca es decorativa | la burbuja del chat llevaba una sombrita de 1 px y **la quité**: es borde, no elevación | sí |

El teléfono es «el objeto del que trata la página» apoyado sobre la banda de tinta, que es el caso
que la regla nueva nombra. Un solo `--elev-card`, y el resto del color lo hace el papel.

**La maqueta lo deja apoyado, no montado.** El montaje sobre la costura es `PageHero`
`layout="stacked"` con `--montaje`, que es lo que usan `/empresas` y `/tarifas`; no supe
reproducirlo fielmente en una maqueta suelta y **prefiero decirlo a fingirlo**. Si al integrarlo con
el componente real se ve mejor montado, montadlo: la regla lo permite igual.

---

## 4. El texto: todo publicado menos una frase

Las tres burbujas del chat son **literales de los hilos de `Process.astro`**: «Hola, necesito
convertir 2.000.000 CLP. ¿Me confirman el precio?», «Precio confirmado a {tasa}. ¿Cerramos la
operación?», «Sí, acepto.». Los seis pasos son literales de `process.ts`.

**Lo único nuevo es una frase:** «**Acá pasa de la web a una persona.**» Es el pie del teléfono, y
dice lo que la portada ya dice con otras palabras («La web te deja listo y una persona cierra»).

**Y una que escribí y retiré antes de entregar.** Había puesto al pie de la escalera: «El suelo
cambia de color donde cambia de manos. Los tres filetes verdes marcan los traspasos…». Es la página
explicándole al lector su propia gramática visual — exactamente la octava cadena que me rechazaste
en `tarifas-v2`. Si el dibujo necesita una leyenda para entenderse, el dibujo está mal.

---

## 5. Comprobado sobre el render

A 1280 y a 390: **una sola sombra** en la página · **12 px** el texto más pequeño (el avatar del
chat, decorativo) · **sin scroll horizontal** en ninguno de los dos · el suelo alterna en los dos
anchos, y en el teléfono es lo único que marca el reparto.

Las dos secciones que toco miden **1.821 px a 1280** y **2.255 px a 390**. La página entera son
3.683 px hoy; las secciones que no toco no cambian.

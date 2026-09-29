# La regla de portada — la que el sitio ya cumple y nadie escribió

**Fecha:** 2026-09-29 · **Autor:** Claude Cowork
**Medido sobre el build de `67abaa9`**, con los cuatro puentes dentro.
**No escribí nada en el repositorio.** Capturas: `portada-con-objeto.png` · `portada-sin-objeto.png`

---

## 0. Antes: los cuatro puentes, verificados

Reconstruí el sitio con los puentes 3 y 4 dentro y medí los cuatro.

| | 320 | 390 | 768 | 960 | 1280 | 2560 | holgura texto / figura |
|---|---|---|---|---|---|---|---|
| 1 · Home → Tarifas | 534 | 529 | 529 | 490 | 490 | 490 | 120–197 / 78–82 |
| 2 · Tarifas → Confianza | 644 | 624 | 564 | 525 | 525 | 525 | 103–179 / 61 |
| 3 · Precio → Tarifas | 485 | 485 | 485 | 465 | 465 | 465 | 129–205 / 86 |
| 4 · CF → el artículo | 574 | 596 | 600 | 500 | 500 | 500 | 97–174 / 63–138 |

**Las veinticuatro alturas clavadas contra mis tablas.** Desborde 0, texto mínimo 13 px, nada
recortado, en los seis anchos y en los cuatro. Dos holguras bajan 1 px respecto de lo que publiqué
(86 contra 87, 138 contra 139): muestreo sub-píxel del borde, no una diferencia real.

El puente 2 entra con `0/3` elementos revelados, que es **lo correcto**: `/tarifas` no carga
`Motion.astro` y su CSS depende de `.js-motion`. Sale completo y quieto, como estaba previsto.

---

## 1. No hay que inventar la regla: está en las alturas

Medí la portada de las trece páginas publicadas. Salen **dos familias y nada en medio**:

| | página | alto | qué lleva |
|---|---|---|---|
| **A** | Home | **781** | el cotizador · 437×621 |
| | cómo funciona | **660** | el teléfono · 196×425 |
| | empresas | **569** | el MacBook · 440×341 |
| | tarifas | **529** | la barra del precio · 664×98 |
| | confianza | **460** | la línea de tenencia · 984×133 |
| | blog · artículo | **256**\* | su portada · 160×160 |
| **B** | canal de denuncias | 288 | — |
| | precio | 262 | — |
| | preguntas | 262 | — |
| | términos | 262 | — |
| | blog · índice | 236 | — |
| | privacidad | 236 | — |

**Entre 288 y 460 px no hay ninguna.** El hueco es de 172 px y está vacío: eso no es casualidad, es
una regla que se ha venido aplicando sin escribirse.

\* El artículo es la excepción que confirma el criterio: su objeto es un emblema de 160×160 centrado,
no una pieza a un lado, así que no necesita altura. Lo suyo es una **portada**, no una composición a
dos columnas.

---

## 2. Qué separa a las dos, dicho en una frase

> **La portada lleva el objeto de la página cuando la página trata de una cosa que se puede dibujar,
> y no lo lleva cuando la página es una lista o un documento.**

Mira la familia A y se lee sola: el **instrumento** (el cotizador), la **conversación** (el
teléfono), la **pantalla de la empresa** (el MacBook), la **forma del precio** (la barra), el
**recorrido del dinero** (la tenencia). Cada objeto *es* el asunto, no lo ilustra.

Y la familia B son listas —preguntas, artículos— y documentos —las tres legales—. Ahí un objeto
sería decoración, que es justo lo que el ADR-0001 prohíbe.

**Esto contesta de paso la alarma del mapa.** `/preguntas` sale con 4.479 px y **cero figuras**, el
100 % lisa, y parecía la página más urgente del sitio. No lo es: su portada está bien vacía **por
regla**. Lo que haya que hacer ahí va en el cuerpo, no en la tapa. Sin esta medición habría empezado
por el sitio equivocado.

---

## 3. La única página que está en la familia equivocada: `/precio`

`/precio` trata de una cosa dibujable —«Un solo número»—, tiene su gemela `/tarifas` en la familia A
con la barra en la portada, y **tiene su propia figura**: dos líneas verdes con los rótulos «El
precio que ves al cotizar» y «El precio que pagas».

Sólo que esa figura **no está en la portada, sino 469 px más abajo y sobre papel**. La portada se
queda en 262 px con la mitad derecha vacía. Lo ves en `portada-sin-objeto.png`, primera tira.

**Tres salidas, y la decisión es tuya:**

1. **Subir su figura a la portada**, como `/confianza` hizo con la línea de tenencia el 25 de
   septiembre. Es el mismo movimiento y ya tiene precedente escrito. `/precio` entraría en la familia
   A con ~460–500 px de portada.
2. **Dejarla donde está y escribir la excepción**: «una figura que necesita papel para leerse no sube
   a la portada». Habría que comprobar si es cierto — las dos líneas son `--verde-deep`, que sobre
   tinta pasaría a `--verde`, y eso ya lo hacen los cuatro puentes.
3. **No tocar nada** y aceptar que la regla tiene una excepción sin motivo escrito. Es la que menos
   me gusta: una regla que el propio sitio incumple no protege nada, y eso ya lo dice el §4.5 con
   estas palabras.

Mi lectura es la **1**, pero antes de dibujar nada quiero leer por qué esa figura se puso sobre papel
—puede haber un motivo escrito en `precio.astro` que no he buscado todavía.

---

## 4. Lo que propongo que se escriba

En el Design System, junto al §4 de superficie:

> **La portada.** Una página abre con su objeto cuando su asunto es una cosa que se puede dibujar:
> el cotizador en la Home, el teléfono en `/como-funciona`, el MacBook en `/empresas`, la barra en
> `/tarifas`, la línea de tenencia en `/confianza`. Esa portada mide entre **460 y 781 px** y el
> objeto va al lado del titular.
>
> Una página que es una **lista** o un **documento** abre sólo con su titular, y su portada mide
> entre **236 y 288 px**: `/preguntas`, el índice del blog y las tres legales. Ahí un objeto sería
> decoración.
>
> **No hay una tercera altura.** Si una portada nueva cae entre 288 y 460, es que no se ha decidido a
> qué familia pertenece.
>
> Un artículo del blog es el caso aparte: su objeto es un emblema centrado sobre la banda, no una
> pieza a un lado, así que su portada se queda en la altura corta.

---

## 5. Y con esto, el orden de los otros tres

Tú dijiste que vamos por los cuatro. Éste iba primero porque **decidía a los otros**, y ya se ve que
sirvió: cambia lo que hay que hacer en `/preguntas` y añade una pregunta sobre `/precio` que no
estaba en el mapa.

Sigo por **`/confianza`** —3.093 px, una sola figura, 2.697 lisos, y su argumento escrito es «la
confianza se muestra, no se afirma»—, luego `/preguntas` **por el cuerpo** y no por la tapa, y
`/empresas` al final, que es reparto de lo que ya tiene y no dibujos nuevos.

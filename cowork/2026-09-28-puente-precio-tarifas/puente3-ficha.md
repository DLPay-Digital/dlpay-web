# Puente 3 de 5 · Precio → Tarifas

**Fecha:** 2026-09-28 · **Autor:** Claude Cowork
**Maqueta:** `puente-precio-tarifas.html` · **md5** `3cfd2388d1e3e5f7ae4a265995b7ffec`
**Medido sobre el build de `3a32854`.** **No escribí nada en el repositorio.**

---

## 1. El problema que tenía este puente, y cómo se resolvió

En mi lista de la semana pasada, Precio → Tarifas «enseñaba la barra otra vez». **Eso era plantilla,
no familia**: la misma figura que el puente de la Home, en otro marco.

`/tarifas` tiene **otra figura**, y es exactamente la que hace falta. En «Qué mueve el precio» hay
dos: la onda de **El mercado** y, al lado, **El monto** — una línea recta, un corte punteado y dos
palabras en verde, «acá se conversa». La tienes en `puente3-origen-el-monto.png`.

Y la cadena es literal, no interpretada. `/precio` dice, en su última tarjeta:

> «Las condiciones se conversan según volumen y frecuencia: **no publicamos una tabla por tramos**.»

Y `/tarifas` **dibuja esa no-publicación**: una línea sin escalones, un límite que no marca dónde
cae, y al otro lado «acá se conversa». La cabecera de `tarifas.astro` lo tiene escrito como regla
dura: «**"El monto" no lleva barras ascendentes.** Escalones afirman tramos, y los tramos son el
dato bloqueado **D5**».

**Así que los dos puentes a `/tarifas` enseñan cosas distintas de la misma página.** Lo que se repite
es el corte; lo que cambia es lo que hay al otro lado.

---

## 2. Lo que dejé fuera, con su motivo

**No va la onda de «El mercado»**, aunque en el destino las dos figuras van en pareja. `/precio` ya
tiene su propia banda con una línea de mercado moviéndose —la de «El precio que aceptas»— 800 px más
arriba. Repetirla sería enseñar dos veces lo mismo en la misma página.

Por eso el titular nombra el monto y no «qué mueve el precio»: **si la figura enseña una de las dos
cosas, el titular no puede prometer las dos.** Es la lección de la llave del puente 1, aplicada al
revés.

---

## 3. El texto: **cero frases inventadas**

| en el puente | origen |
|---|---|
| «volumen y frecuencia» | literal — es el título de la tarjeta de `/precio` que queda justo encima |
| «Las condiciones se acuerdan contigo» | literal del cuerpo de «El monto» en `/tarifas` |
| «Las operaciones de mayor volumen se conversan con el ejecutivo.» | literal, la frase anterior del mismo párrafo |
| «acá se conversa» | literal de la figura de `/tarifas` |
| «Ver las tarifas» | la misma etiqueta del puente 1 |

Es el primero de los tres sin empalmes ni cadenas nuevas. **Lo único que hay que señalarte:**
«Las condiciones se acuerdan contigo» era una **cláusula dentro de un párrafo** y acá es el titular.
Subir una frase a titular le cambia el peso — es el mismo aviso que se te hizo con la 7 de
`/tarifas`. Esta no promete nada que la página no diga, pero lo decides tú.

---

## 4. Dónde va

**En `/precio`, entre «Cómo trabajamos el precio» y la banda «¿Listo para ver tu precio?».** Lo
tienes montado en `puente3-en-precio-1280.png`.

Cae **justo debajo de la tarjeta «Volumen y frecuencia»**, que es la frase que lo justifica, y le
queda debajo `close` en `--papel-2`: ni oscuro contra oscuro, ni el pie a dos secciones.

**Y aquí se ve por fin lo que quedó pendiente en la entrega del 24:** el puente y la banda de llamada
conviven. El puente invita a **leer**, la banda invita a **cotizar**, y se leen como dos cosas
distintas porque están en superficies distintas y el botón del puente va a la izquierda mientras el
de la banda va centrado. **Lo que sí conviene vigilar** son los dos botones verdes a 380 px uno del
otro. A mí me funciona; si a ti te compite, la banda tiene sitio para bajar un escalón a `ghost`.

---

## 5. Medido

| | 320 | 390 | 768 | 960 | 1280 | 2560 |
|---|---|---|---|---|---|---|
| alto | 485 | 485 | 485 | 465 | 465 | 465 |
| desborde | 0 | 0 | 0 | 0 | 0 | 0 |
| texto más pequeño | 13 | 13 | 13 | 13 | 13 | 13 |
| texto recortado | 0 | 0 | 0 | 0 | 0 | 0 |

Botón 195×57. Holgura por tinta: **129–205 px** el texto, **87** la figura. Sin JavaScript se ve
completa e inmóvil; `prefers-reduced-motion` la deja quieta. Un solo `data-enter` — M4, sin
escalonado, porque la figura es una pieza.

**Con los tres puentes construidos, el rango de la familia es 61–87 px por el lado de la figura y
103–205 por el del texto.** El §4.7 del Design System dice hoy «78 a 82» y hay que ampliarlo.

**Un fallo que me costó una versión:** puse `class="nota"` dentro de la figura y esa clase ya existía
en mi propia maqueta para la barra de cabecera. El rótulo salió con un rectángulo de papel detrás y
cortado. Es la regla 32 —los nombres de clase de una maqueta chocan— pero esta vez chocaron **dentro
de la maqueta**, que es más tonto y más fácil de no ver.

---

## 6. Quedan dos, y una de ellas hay que replantearla

**Cómo funciona → el artículo del blog** es limpia: «dólar digital» ×4 en `/como-funciona` y el
artículo es su casa, con una portada propia que enseñar.

**Empresas → ?** es la que no tengo resuelta. Recontado sobre el build de hoy: `/empresas` usa
«ejecutivo» **×6** —el más alto del sitio— y su casa es `/confianza`. Pero **ya hay un puente a
`/confianza`** desde `/tarifas`, y enseñaría la misma línea de tenencia. Dos piezas con el mismo
dibujo es justo lo que acabo de evitar acá.

Tres salidas, y la decisión es tuya:

1. **Buscarle otra cara a `/confianza`.** Tiene los tres mecanismos además de la línea; el de
   `/empresas` podría enseñar el del ejecutivo. Es la más honesta pero la figura es más pobre.
2. **Mandar `/empresas` a `/tarifas`** con «El monto» — «la operación pesa donde el spread de un
   banco pesa de verdad» es de `/precio`, pero el caso de volumen es el de las empresas. Chocaría con
   este puente.
3. **No hacerla.** `/empresas` es la única página con su propia banda de contacto al cierre, y puede
   que no necesite mandar a nadie a ninguna parte.

Lo mido cuando me digas, con la página delante. Mientras tanto sigo con la de `/como-funciona`.

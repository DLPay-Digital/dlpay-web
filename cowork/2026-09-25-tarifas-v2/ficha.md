# Ficha — `/tarifas` v2 · la primera página interior con superficie

**Fecha:** 2026-09-25 · **Autor:** Claude Cowork
**Maqueta:** `tarifas-v2.html` · **md5** `a7c2c5443225430bf1e07fe769506325`
**Renders:** `tarifas-1280.png`, `tarifas-390.png`

---

## 1. Qué fui a ver, y qué encontré

Miré wise.com, revolut.com, remitly.com y westernunion.com/cl. Los cuatro, con sus estilos
distintos, comparten tres cosas que DLPay no hace:

**a) El producto es la figura.** Wise pone tres tarjetas de color, y dentro de cada una una
miniatura de su propia interfaz con cifras reales: un saldo de 5.211,23 €, un cotizador con
1 USD = 952.059 CLP. Remitly pone una foto de familia y encima, sobresaliendo de la esquina, una
notificación del producto: «Delivered · You received 3.417,64 BRL». Western Union pone el cotizador
entero como tarjeta blanca elevada sobre el fondo oscuro. Ninguno ilustra su servicio con un
diagrama abstracto: enseña la pantalla.

**b) Las cifras son objetos.** No están dentro de un párrafo: están puestas en una superficie,
grandes, con su rótulo. El número es el dibujo.

**c) Prueba social arriba del todo.** Remitly pone las estrellas de las tiendas de aplicaciones
*encima* del titular. Western Union pone Trustpilot con el número de reseñas justo bajo el
subtítulo. Es la señal de «empresa establecida» más barata que existe y las dos la ponen antes que
cualquier otra cosa.

## 2. Y lo que encontré al mirar nuestros propios tokens

**El lenguaje de superficie ya existe en el proyecto.** Están declarados `--r-card: 14px`,
`--r-block: 20px`, `--elev-card` y `--elev-pop`, y se usan 26 veces. Pero viven casi enteros en la
home y en el pie: de las hojas de estilo propias de cada página interior, sólo `empresas` lo usa, y
una vez.

Por eso el sitio se lee como un documento bien compuesto y los otros cuatro se leen como productos.
**No falta inventar un sistema. Falta sacar el que hay de la portada.** Eso importa: no es una
excepción a ninguna regla, no toca la identidad congelada, y no estrena ni un token.

---

## 3. Lo que hice

`/tarifas` es la página más chica del sitio —1.428 px— y no tiene una sola ancla visual. Es además
la puerta de entrada comercial desde buscador. Su trabajo es explicar cómo se compone el precio, y
eso se puede dibujar sin tocar ningún dato bloqueado.

**a) El producto entra a la página.** El cotizador, en miniatura, sobre una tarjeta elevada que
sube y monta sobre la portada oscura. Las dos cifras son las que el cotizador ya trae puestas en la
home: no invento ninguna.

**b) La figura no parte la barra.** Es la decisión de diseño de la entrega. La página dice
«un solo número, con el spread ya incorporado» — así que dibujar la barra dividida en dos
diría lo contrario: que se pueden ver por separado. La llave abarca la barra entera y nombra lo que
hay dentro; la barra es una sola magnitud; y en su extremo, el punteado.

**c) El vacío es el argumento.** Después del punteado no hay nada, y ahí está el rótulo: «acá
termina, y no se suma nada». La frase más fuerte de la página —«no hay una comisión aparte que se
sume al final»— no se ilustra: se demuestra dejando el espacio vacío.

**d) Sólo marcas del §6.2 publicadas, en su significado publicado.** Barra llena = una magnitud.
Trazo punteado = un límite, cruzarlo cambia algo. Filete `--ink-mute` = existe, es real, no es
nuestro — reservado para «qué no está incluido acá», que es exactamente eso. No estreno familia.

**e) Retiré un titular mío.** Había escrito «Dos cosas, y ninguna es una tarifa oculta». Suena
mejor y es exactamente el error del `PendingNotice`: parafrasear una frase sensible para que pegue
más. La sección se llama otra vez «Qué mueve el precio», como en la página publicada.

**f) La tabla pendiente se queda como está.** Es un compromiso de los Términos y Condiciones, no un
bloque de diseño. No la disfracé de tarjeta.

---

## 4. Dos errores que cometí y corregí mirando el render

**El primero es de fondo.** La primera versión de la tarjeta «El monto» eran cuatro barras
ascendentes con la última en verde. Eso afirma tramos, y los tramos son el dato bloqueado D5
(«ninguna por ahora»). Yo mismo me había dicho que no lo dibujara y lo dibujé. Ahora es una línea,
un límite sin marcar dónde está, y al otro lado una palabra: «acá se conversa».

**El segundo es el mismo que ya documenté una vez.** Puse los rótulos dentro del SVG y en el
teléfono cayeron a unos 5 px, ilegibles. Es la corrección del riel tokenizado, escrita en una
entrega anterior, y la volví a romper. La figura ahora se dibuja en HTML y CSS y los rótulos son
texto de verdad.

---

## 5. Lo que cuesta

La página pasa de **1.428 px a 2.787 px** a 1280. Es casi el doble, y no es gratis: alarga el
recorrido hasta el pie. Lo doy por bueno porque hoy esos 1.428 px son texto corrido sin un punto
donde descansar la vista, y porque la mitad del crecimiento es aire entre secciones, que se puede
apretar si te parece mucho.

---

## 6. Lo que no pude hacer, y es dato tuyo

De las tres cosas que los cuatro sitios comparten, **la prueba social no la puedo montar**: no
tengo reseñas, ni puntuación, ni número de clientes, ni nada que poner ahí. Es lo más barato de
todo y es lo que más dice «empresa establecida».

Si existen reseñas de Google, de Trustpilot o de donde sea, o un número de operaciones o de años
operando que Compliance acepte publicar, eso cambia más la percepción del sitio que cualquier
figura que yo dibuje. Y si no existen todavía, conviene saberlo, porque entonces el camino es otro:
apoyarse en lo que sí hay —los emblemas de UAF y FinteChile, que hoy están en el pie— y en el
producto.

**Los emblemas los dejo donde están**, que es tu instrucción permanente 6. No propongo moverlos.

---

## 7. Si esto te gusta, lo que sigue no es dibujar más

Es aplicar la misma regla a las otras páginas interiores: la superficie elevada sale de la portada,
el producto aparece donde se le está explicando al cliente, y las cifras dejan de vivir dentro de un
párrafo. `/preguntas` y `/confianza` son las siguientes por planicie medida.

# Prompt para el agente de Claude Code — `2026-09-25-tarifas-v2`

**Fecha:** 2026-09-25 · **Autor:** Claude Cowork · **Aprobado por Sebastián.**
**Maqueta:** `tarifas-v2.html` · **md5** `a7c2c5443225430bf1e07fe769506325`
**Renders:** `tarifas-1280.png`, `tarifas-390.png` · **Ficha:** `ficha.md` — léela entera.

> **Aviso de método, y va primero porque cambia cómo hay que leer todo lo demás.**
> La copia del repositorio que tengo es vieja: `src/` sólo contiene dos archivos y el más nuevo es
> `tokens.css` del **21 de septiembre**; el `dist/` es del **24 a las 18:57** y no tiene la intro.
> Todo lo que digo de la estructura del sitio sale del HTML y el CSS construidos de esa fecha.
> **Verifica contra el `src/` de hoy cada afirmación que uses para decidir algo**, y si alguna no
> cuadra, dímelo en vez de adaptarla por tu cuenta: prefiero corregir la maqueta a que se integre
> algo apoyado en un dato caducado.

---

## 0. El orden

1. Verificar los dos datos de la §1 contra el `src/` de hoy.
2. Pasar por Compliance las siete cadenas nuevas de la §5.
3. Construir la página.
4. Comprobar la §6.

---

## 1. Por qué esto existe

Sebastián pidió que el sitio deje de verse como un documento y empiece a verse como el de una
empresa establecida, y nombró wise.com, revolut.com, payoneer.com, remitly y western union. Miré
los cuatro primeros. Comparten tres cosas: **el producto es la figura** (enseñan su propia interfaz
con cifras reales, no un diagrama), **las cifras son objetos** puestos sobre una superficie, y
**prueba social arriba del todo**.

Y entonces miré nuestros tokens, y ahí está lo que importa:

**El lenguaje de superficie ya existe en el proyecto y casi no sale de la portada.** Están
declarados `--r-card: 14px`, `--r-block: 20px`, `--elev-card` y `--elev-pop`. Medido sobre el build
del 24: 26 usos, concentrados en la home y en `Footer`; de las hojas propias de las páginas
interiores **sólo `empresas` lo usa, y una vez**.

**Los dos datos que tienes que verificar antes de nada:**

- que `--r-card`, `--r-block`, `--elev-card` y `--elev-pop` siguen declarados en `tokens.css`;
- que las páginas interiores siguen sin usarlos.

Si el segundo ya no es cierto porque entró algo entre medias, dímelo: el argumento de esta entrega
es «sacar de la portada lo que ya existe», y si ya salió, la entrega se replantea.

**Esto no es una excepción a ninguna regla.** No toca la identidad congelada, no estrena ni un
token, no añade dependencias y no necesita JavaScript.

---

## 2. Qué se construye

`/tarifas` entera. Es la página más chica del sitio —1.428 px de `main`— sin una sola ancla visual,
y es la puerta de entrada comercial desde buscador, cosa que quedó establecida al decidir el
alcance del marcador de la intro.

El orden de la página **no cambia**. Lo que cambia es que gana una superficie, una figura y un
producto. De arriba a abajo:

| # | bloque | tratamiento |
|---|---|---|
| 1 | portada | como está: `--tinta`, titular y bajada |
| 2 | **el cotizador en miniatura** | tarjeta `--r-block` + `--elev-card`, **montada sobre la portada** con margen negativo |
| 3 | la figura de composición | dentro de esa misma tarjeta |
| 4 | «cómo se compone el precio» | texto, sobre papel, sin superficie |
| 5 | «qué mueve el precio» | dos tarjetas `--r-card` + `--elev-pop`, una figura pequeña cada una |
| 6 | monto mínimo | tarjeta, con la cifra como dato y no dentro de un párrafo |
| 7 | tabla de tarifas: en publicación | **el `PendingNotice` tal cual está**, sin disfrazar de tarjeta |
| 8 | qué no está incluido acá | filete `--ink-mute` a la izquierda, sin superficie |

La alternancia tarjeta / papel es deliberada: si todo va sobre tarjeta, la superficie deja de
significar nada. Lo elevado es lo que el cliente mira; lo plano es lo que lee.

---

## 3. Las cuatro decisiones de dibujo que no se pueden relajar

**a) La barra no se parte en dos.** Es la decisión central. La página dice «un solo número, con el
spread ya incorporado»: dibujar la barra dividida en referencia y spread afirmaría lo contrario,
que se pueden ver por separado. La llave abarca la barra **entera** y nombra lo que hay dentro.
Si alguien la parte «para que se entienda mejor», la figura pasa a contradecir el texto que tiene
al lado.

**b) El vacío después del punteado es el argumento, no un margen.** La frase más fuerte de la
página —«no hay una comisión aparte que se sume al final»— no se ilustra: se demuestra dejando
espacio vacío después del límite. No metas nada ahí ni recortes ese espacio para ganar altura.

**c) «El monto» no lleva barras ascendentes.** Yo las dibujé en la primera versión y están mal:
escalones afirman tramos, y los tramos son el dato bloqueado **D5** («ninguna por ahora»). Va una
línea, un límite punteado sin marcar dónde cae, y al otro lado dos palabras. Si en algún momento
D5 se desbloquea, eso es una entrega nueva, no un retoque de ésta.

**d) Ningún `<text>` dentro de un SVG que se escale.** Los rótulos de la figura son HTML de verdad.
Es la corrección del riel tokenizado; yo la rompí otra vez en esta misma entrega y en el teléfono
los rótulos caían a unos 5 px. La figura grande está hecha con HTML y CSS —la llave son bordes, el
límite es un `border-left` discontinuo— justamente para que no vuelva a pasar.

Las marcas usadas son las del **DS §6.2, en su significado publicado**: barra llena = una magnitud;
trazo punteado = un límite, cruzarlo cambia algo; filete `--ink-mute` = existe, es real, no es
nuestro. **No se estrena familia.**

---

## 4. Choques de clases, comprobado sobre el CSS construido

Comparé las 33 clases de la maqueta con todo el CSS del build. Dos cosas que importan:

- **`.num` es una utilidad global del sitio**, no una clase de componente:
  `font-family: var(--f-num); font-variant-numeric: tabular-nums; letter-spacing: var(--ls-dato)`.
  La maqueta la **usa**; al integrar, apóyate en ella y **no vuelvas a declarar la familia** en el
  componente nuevo.
- El resto de las clases que también existen en el sitio —`inner`, `col`, `hero`, `fila`, `dato`,
  `figura`, `pie`, `rot`, `n`— aparecen **sólo escopadas** con su hash `astro-`, así que un
  componente nuevo no choca con ellas. Aun así, cuenta los elementos renderizados como hiciste con
  el `.rot` de `/precio`: es la regla 32 y ya nos pilló una vez.
- Renombré mi `.abajo` a `.fig-pie` por si acaso.

---

## 5. Lo que tiene que ver Compliance: siete cadenas nuevas

Todo el cuerpo de la página es texto ya publicado, movido de sitio pero no reescrito. **Lo nuevo es
esto y nada más:**

| # | cadena | qué es |
|---|---|---|
| 1 | «lo que ves al cotizar» | rótulo de la tarjeta del cotizador |
| 2 | «la referencia de mercado y nuestro spread, los dos adentro» | rótulo de la llave |
| 3 | «el precio que ves» | rótulo de la barra |
| 4 | «acá termina» · «y no se suma nada» | rótulo del límite |
| 5 | «La barra no está partida porque el número tampoco lo está: no se ven por separado.» | leyenda |
| 6 | «El punteado es un límite. Cruzarlo cambiaría el precio, y no lo cruza nada.» | leyenda |
| 7 | «El spread ya está adentro del número» | titular de sección |

Las siete dicen lo que el párrafo de debajo ya dice, pero **en un titular de 23–32 px cambia el
peso de lo que se afirma**, que es justo lo que no vi la vez del `PendingNotice`. La número 7 es la
que más mirar: es una reformulación de «con el spread ya incorporado», publicado.

**Y una que retiré yo antes de entregar.** Había escrito como titular «Dos cosas, y ninguna es una
tarifa oculta». Es más pegadora y es exactamente el error del `PendingNotice`: parafrasear una
frase sensible para que suene mejor. La sección se llama otra vez **«Qué mueve el precio»**, como
en la página publicada. Si Compliance prefiere algo más vivo, que lo escriba Compliance.

**No se usan** «Precio garantizado» ni «Congelamos tu precio», que llevan el marcador
`REQUIERE VALIDACIÓN DE COMPLIANCE` en `Process.astro`.

---

## 6. Qué comprobar antes de darla por buena

1. **Mira el render, no el código**, a 1280 y a 390. Los rótulos de la figura tienen que leerse en
   el teléfono: si alguno sale a menos de 11 px, volvió a entrar dentro del SVG.
2. En el móvil el orden de lectura de la figura es: barra → «el precio que ves» → «acá termina / y
   no se suma nada». Si «acá termina» aparece antes que el rótulo de la barra, el orden del DOM se
   perdió.
3. La barra **no está partida** y después del punteado no hay nada.
4. «El monto» no tiene barras ascendentes ni escalones.
5. Cuenta los elementos renderizados de las clases nuevas y compáralos con los esperados (regla 32).
6. Sin scroll horizontal a 320, 390 y 1280.
7. Contrastes sobre papel: el verde de la barra es `--verde-deep`, **no `--verde`** — `--verde`
   sobre papel da 2,02:1 y es inadmisible para un gráfico con significado.
8. La tarjeta monta sobre la portada con margen negativo: comprueba que a 320 px no se sale ni tapa
   la bajada.
9. El `PendingNotice` sigue siendo el componente, no una copia suya.

---

## 7. Lo que esta entrega deja pendiente, y no es dibujo

De las tres señales que comparten los cuatro sitios de referencia, **la prueba social no la puedo
montar**: no hay reseñas, ni puntuación, ni número de operaciones publicable. Es lo más barato y lo
que más dice «empresa establecida» — Remitly la pone encima del titular; Western Union pone
Trustpilot con el número de reseñas antes que nada. Es dato, no diseño, y está esperando a
Sebastián.

**Los emblemas de UAF y FinteChile se quedan en el pie**, que es su instrucción permanente 6. No
propongo moverlos.

**Lo siguiente, si esto funciona,** no es dibujar más: es aplicar la misma regla a las otras
páginas interiores. `/preguntas` y `/confianza` son las siguientes por planicie medida —4.479 px y
2.425 px seguidos sin una sola ancla—, aunque esos números salen del build del 24 y hay que
volver a medirlos.

**Y de paso:** `/preguntas` tiene su columna de 760 px descentrada, 148 px de margen izquierdo
contra 372 de derecho, cuando las otras tres columnas de 760 del sitio están en 260/260. Está en
`peticion-copia.md` con la evidencia.

---

## 8. Lo de siempre

`cowork/` no toca `src/`. La maqueta es sólo visualización: sus estilos están en un `<style>` suelto
y en el sitio van donde corresponda por componente. Y hay cinco archivos míos de prueba en el
`dist/` que me pasaron —`intro2` a `intro5`, `introC` y ahora `tarifas-v2`—: no deben llegar a
producción.

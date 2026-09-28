# Prompt para el agente de Claude Code — `2026-09-28-puente-home-tarifas`

**Fecha:** 2026-09-28 · **Autor:** Claude Cowork
**Maqueta:** `puente-home-tarifas-v3.html` · **md5** `cf3f6f0dad49fb469e41f5e6eb0b66d5`
**Ficha:** `ficha-v3.md` — léela entera, sobre todo el §1: la versión anterior incumplía tres reglas
escritas y esta entrega existe porque se leyeron.

> **Cowork trabaja sobre una copia del sitio, y esa copia envejece.** Todo lo medido acá sale de mi
> build de `9ce2684`. **El síntoma son las medidas:** antes de integrar, comprueba contra el build
> de ahora las tres que deciden el diseño —las alturas de las secciones de la Home, dónde aparece el
> número y la holgura del corte— y dime si alguna dejó de ser cierta.

---

## 0. Lo que Sebastián ya aprobó, y lo que falta

- **Aprobado:** la excepción de tocar la Home (diseño congelado, «caso aparte»), y el enfoque.
- **Falta su firma como Compliance sobre dos cadenas nuevas** (§5). Son dos, y el precedente es el
  de las siete de `/tarifas`, firmadas el 2026-09-25.

---

## 1. Qué es

Una sección nueva en la Home que lleva a `/tarifas`. **El bloque está partido por la diagonal de la
marca: papel donde está el texto —que es esta página— y tinta donde está la figura —que es la otra.**
El umbral no se dibuja con un marco: es el fondo.

Dentro va **la figura de `/tarifas` entera y sin retocar**: la llave abarcando la barra completa, la
barra sin partir, el punteado en su extremo, «el precio que ves» debajo, «acá termina / y no se suma
nada» a la derecha, y después **nada**.

---

## 2. Dónde va, y por qué ahí y no en otro sitio

**Entre `<Process />` y `<Trust />` en `src/pages/index.astro`.** Medido sobre el build, y probé
siete posiciones:

| | posición | px desde la última aparición del número | qué pasa |
|---|---|---|---|
| A | tras el héroe | 460 | el cotizador ya dice **«Sin comisiones ocultas: el precio ya incluye el spread»** 460 px antes. El titular lo repetiría |
| B | tras el globo | 1.396 | parte en dos el arco «qué es esto» (héroe → globo → tres usos) |
| C | tras los tres usos | 1.780 | ídem, y aún no se ha explicado nada del mecanismo |
| D | antes del proceso | 418 | cae **justo después de «Ver el proceso completo»**, que ya es un enlace a `/como-funciona`. Dos invitaciones seguidas y la segunda más fuerte |
| **E** | **antes de `Trust`** | **1.300** | **la elegida** |
| F | antes de empresas | 5.744 | «el número que viste» deja de ser verdad |
| G | tras empresas | 6.162 | tinta contra tinta, y más lejos todavía |

**Por qué E.** El número aparece **tres veces** en la Home y las tres las medí: el cotizador
(y≈600), la maqueta de chat de `feature` —«1 USD = 919,70 CLP · Precio referencial»— (y≈2.846) y el
paso 2 de `process` —«Precio confirmado a 919,70»— (y≈4.352). En E el puente entra **cuando la
operación acaba de terminar**, que es cuando «¿y no me suman nada al final?» es la pregunta viva. Y
deja la Home con un orden limpio de destinos: **puente → `/tarifas`**, `Trust` → `/confianza`,
`Business` → `/empresas`, y la FAQ cerrando.

**Y el ritmo de bandas sale bien**, que es lo que a mí me preocupaba: papel (`process`) → el puente
(mitad papel, mitad tinta) → `--papel-2` (`trust`) → tinta (`business`) → papel (`faq`). Sin oscuro
contra oscuro en ninguna junta.

---

## 3. La excepción que hay que escribir

**Un bloque con dos fondos.** Ninguna sección del sitio tiene dos superficies. Va al Design System
—§4 es donde vive la superficie— y la ventaja es ésta, para que quede por escrito:

1. **El asunto de la pieza es cruzar.** Con un fondo el bloque sólo habla de la otra página; con
   dos, la enseña.
2. **Cuesta un degradado con una parada dura.** Ni elemento extra, ni imagen, ni JavaScript.
3. **Protege el ritmo medido de la Home**, que tiene sólo dos bandas oscuras —héroe 868 px y
   empresas 418 px— con 5.284 px de papel seguidos entre ellas. Una tercera banda oscura entera lo
   aplana. Media, no.

**No hay más excepciones.** Cero tokens nuevos, cero colores nuevos, cero JavaScript, ninguna
elevación (el límite de «uno por página» de §4.5 sigue intacto: esta pieza no gasta ninguno), y el
movimiento es del catálogo.

---

## 4. La construcción

Estructura sugerida, y la decisión final es tuya: **`src/components/puente/Puente.astro`** con la
carcasa (el corte, el texto, el botón) y un `<slot />` para la figura, más
**`src/components/puente/FiguraTarifas.astro`**. Vienen cuatro puentes más del mismo molde y todos
comparten la carcasa. Si prefieres un archivo único hasta que exista el segundo, dilo y lo dejamos
escrito.

**Copia el CSS de la maqueta tal cual** — está comentado con el motivo de cada decisión y los
comentarios son parte de la entrega. Lo que no se puede mover sin rehacer las medidas:

**a) El corte va al 50 % y en `123.954deg`.**

```css
background: linear-gradient(123.954deg, var(--papel) 0 50%, var(--tinta) 50% 100%);
```

El ángulo baja **hacia la izquierda**, como las cuñas del héroe
(`polygon(0 100%, 46% 0, 60% 0, 15% 100%, …)`). Lo tuve al revés una versión entera. Medido sobre el
render: **−33,930°** el corte y **−34,216°** las cuñas con el mismo instrumento. **El 50 % no es un
número redondo elegido a ojo:** es donde la holgura del texto y la de la figura se igualan y dejan
de moverse con el ancho. Probado a 44, 46, 48, 50 y 52.

**b) Abajo de 960 px el bloque es banda de tinta entera, sin diagonal.** A 390 px el corte baja
263 px a lo largo de la columna y **partía el titular por la mitad**, con medio «Ese número ya lo
incluye todo» en oscuro sobre oscuro. Los colores del texto cambian con el fondo mediante cuatro
variables locales (`--c-tit`, `--c-cuerpo`, `--c-rot`, `--c-acento`).

**c) En móvil la figura va primero** (`order: -1`). Es la regla que ya está escrita en
`pages/empresas.astro`: «en móvil el emblema va SIEMPRE arriba… la figura presenta el caso y el
texto lo explica».

**d) El verde de la barra es `--verde`, no `--verde-deep`.** No es un descuido: DS §6.2 dice que
**el fondo elige el verde**, y `tarifas.astro` lo escribe en su propio CSS —«sobre tinta el verde
vivo da 8,45:1; el `--verde-deep` de la barra es para papel»—.

**e) «el precio que ves» va en la tipografía de TEXTO y a plena intensidad**, y «acá termina / y no
se suma nada» en la de cifras. En `/tarifas` no son la misma voz, y yo las había igualado.

---

## 5. El texto, y de dónde sale cada cadena

| en el puente | origen |
|---|---|
| «Ese número ya lo incluye todo» | recorte de la bajada publicada: «Un solo número, y **ese número ya lo incluye todo**. Acá está cómo se compone y qué lo mueve» |
| «Cómo se compone, qué lo mueve, y por qué no hay una comisión aparte que se sume al final.» | **empalme de dos frases publicadas** de `/tarifas`: la bajada y «no hay una comisión aparte que se sume al final» |
| «el precio que ves» · «acá termina» · «y no se suma nada» | literales de la figura de `/tarifas`, ya firmadas el 2026-09-25 |
| **«el número que viste»** | **nueva** |
| **«Ver las tarifas»** | **nueva** |

**Lo que hay que señalarle a Sebastián antes de que firme**, igual que se hizo con las siete de
`/tarifas`: las dos nuevas son inocuas, pero **el empalme crea una frase que no existe publicada**.
No sube el peso de ninguna de las dos afirmaciones —las dos están tal cual en la página— pero las
junta, y quien revise esto dentro de seis meses va a querer saber que fue a propósito.

---

## 6. El movimiento: nada nuevo, y cero bytes

Tres hermanos —`.llave`, `.tramo`, `.fin`— con **`data-enter`**: **M4** sobre el eje, escalonado con
**M5** a 60 ms. Tres de un máximo de cuatro.

`Motion.astro` ya está en la Home y ya los observa. **El bloque no trae script.**

**Lo que NO se hace, y por qué lo escribo:** la versión anterior tenía la barra creciendo con
`scaleX` y un barrido de luz. Ninguna de las dos está en el catálogo —M3 es «sólo trazos con
`stroke`», y las cuñas del héroe, que son el caso idéntico (un `<div>` recortado), fueron
**recatalogadas fuera de M3 el 2026-09-17** justo por eso—. Eran un séptimo y un octavo movimiento
sin escribir.

---

## 7. Lo que hay que reproducir, con número

| | 320 | 390 | 768 | 1280 | 1440 |
|---|---|---|---|---|---|
| alto del bloque | 534 | 529 | 529 | **490** | 490 |
| desborde horizontal | 0 | 0 | 0 | 0 | 0 |
| texto más pequeño | 13 px | 13 | 13 | 13 | 13 |
| texto recortado | 0 | 0 | 0 | 0 | 0 |
| botón | 195×57 | | | | |

- **Holgura entre el contenido y el corte**, de 960 a 2560 px: **69–145 px** por el lado del texto y
  **78–82 px** por el de la figura. Si alguna baja de 40, el corte se movió.
- **Contraste:** on-tinta 16,44:1 · on-tinta-mute 8,18:1 · verde sobre tinta 8,45:1 · ink 16,00:1 ·
  ink-mute 5,50:1 · texto del botón 8,58:1.
- **Sin JavaScript:** completa e inmóvil.
- **`prefers-reduced-motion`:** opacidad 1, sin transformación, transiciones apagadas.
- **La figura contra su original:** ponla al lado de `origen-tarifas-1280.png`. La llave mide lo que
  mide la barra, el punteado cae en el extremo de la barra, y a su derecha no hay ni tramado ni
  relleno. Las tres son reglas escritas en la cabecera de `pages/tarifas.astro`.

---

## 8. Dos cosas que no te pido, y una que sí

**No te pido** que corrijas el `--elev-card` de `Steps.astro` aunque lo tengas al lado: está
declarado como deuda a propósito en el §4.5 del Design System y no es de esta entrega.

**No te pido** que toques `/tarifas`. La figura se copia, no se factoriza: si mañana la de destino
cambia, quiero que el puente se quede como está hasta que alguien lo mire.

**Sí te pido** que, si al medir contra el build de hoy alguna de las cifras del §2 o del §7 ya no
sale, **pares y lo digas** antes de integrar. La posición se eligió con esos números; si cambiaron,
la decisión hay que rehacerla y es de Sebastián, no tuya ni mía.

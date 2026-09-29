# Prompt maestro — la tanda del 2026-09-29

**Fecha:** 2026-09-29 · **Autor:** Claude Cowork · **Aprobado por Sebastián**
**Medido sobre el build de `67abaa9`**, con los cuatro puentes dentro.
**Archivos en `Claude outputs/`**, todos con prefijo. **No escribí nada en el repositorio.**

> **Empieza por el §0.** Esta tanda trae **una corrección de un instrumento mío** que cambia cifras
> que ya están escritas en el repositorio, y un trabajo que **no hay que hacer**. Las dos cosas valen
> más que lo que sí hay que tocar.

---

## 0. Un instrumento mío estaba mal, y afecta a números publicados

El mapa de figuras por página que vengo usando contaba sólo `svg`, `figure` y `[class*=mockup]`. **No
veía las figuras construidas en HTML**, que en este sitio son varias: el **eje de alcance**
(`EjeDeAlcance.astro`, que es `div.eje` con `.ours` y `.theirs`), **«El monto»** de `/tarifas`, y la
tabla de `/empresas`. Corregido el detector, el mapa cambia de verdad:

| página | antes (mal) | corregido |
|---|---|---|
| **empresas** | 5 figuras · 2.784 px lisos · **54 %** | **7 figuras · 1.050 px · 20 %** |
| como funciona | 2 · 2.705 · 68 % | **3 · 2.090 · 52 %** |
| blog · artículo | 2 · 3.599 · 74 % | 2 · 3.551 · 73 % |
| tarifas · precio · home | 3 · 3 · 9 | sin cambio |
| confianza | 1 · 2.697 · **87 %** | sin cambio |
| preguntas | 0 · 4.479 · **100 %** | sin cambio |

**Si alguna de las cifras viejas quedó escrita en `cowork/` o en el Design System, hay que
corregirla.** Es la tercera vez esta semana que un instrumento mío devuelve un número que parece un
resultado —la caja en vez de la tinta, `--container ÷ 2`, y ahora esto—, y la regla que sale es la
misma: **un recuento que no enumera lo que busca, no cuenta; enumera lo que sabe buscar.**

---

## 1. `/empresas`: no hay nada que hacer, y ése es el resultado

Con el detector corregido, `/empresas` tiene **7 figuras** y su tramo liso mayor es de **1.050 px**
—dos secciones de texto seguidas, `steps-band` y `faq`—, o sea **20 %**: la mejor proporción de todas
las páginas interiores, por delante de `/tarifas` (36 %) y `/precio` (34 %).

Estaba en la lista porque mi detector no veía su eje de alcance ni su cuarto emblema. **No la toques.**

---

## 2. La regla de portada — corregida por Sebastián

Yo la había deducido como «lista o documento no lleva portada». **Es falso.** La regla real, que él
confirmó, es:

> **Las páginas legales no llevan portada, a propósito, para darles seriedad.** `tarifas` es la
> excepción dentro de las legales: sí la lleva. Todas las demás páginas pueden llevarla.

Medido sobre el build, las trece portadas publicadas caen en dos familias sin nada en medio:

| | páginas | alto |
|---|---|---|
| **con objeto** | Home 781 · cómo funciona 660 · empresas 569 · tarifas 529 · confianza 460 · artículo 256\* | **460–781** |
| **sin objeto** | canal de denuncias 288 · precio 262 · preguntas 262 · términos 262 · blog 236 · privacidad 236 | **236–288** |

**Entre 288 y 460 px no hay ninguna.** El hueco de 172 px está vacío y eso es la regla, no una
casualidad. \* El artículo es el caso aparte: su objeto es un emblema centrado de 160×160 sobre la
banda, no una pieza a un lado, así que se queda en la altura corta.

**Lo que hay que escribir en el Design System, junto al §4:**

> **La portada.** Las páginas **legales** abren sólo con su titular —`/terminos`, `/privacidad`,
> `/canal-de-denuncias`—, y su portada mide **236–288 px**. Es una decisión, no una carencia: la
> sobriedad es parte de lo que esas páginas dicen. **`/tarifas` es la excepción**: está en el pie
> bajo Legal y sí lleva su objeto.
>
> Las demás abren **con el objeto de la página** y su portada mide **460–781 px**: el cotizador en la
> Home, el teléfono en `/como-funciona`, el MacBook en `/empresas`, la barra en `/tarifas`, la línea
> de tenencia en `/confianza`.
>
> **No hay una tercera altura.** Una portada entre 288 y 460 px es una que no ha decidido a qué
> familia pertenece.

**Quedan tres portadas por hacer**, las tres no legales que hoy abren sin objeto: **`/preguntas`**
(propuesta abajo), **`/precio`** y **el índice del blog**.

---

## 3. `/confianza` · el filete de «Lo que no vas a leer acá» dice lo contrario de lo que quiere decir

Ficha completa en `confianza-ficha.md`. En corto:

`confianza.astro:437` pone `border-left: 2px solid var(--verde)` a las cinco afirmaciones que DLPay
decide **no** hacer. El §6.2 publica que una línea verde a lo largo de un tramo significa **«el tramo
que es nuestro»**, y que el filete `--ink-mute` significa **«existe, es real, no es nuestro»** — que
es, palabra por palabra, lo que son esas cinco.

**Y es una colisión dentro de la misma página:** 1.700 px más arriba, `.phase.is-ours` usa el mismo
filete verde de 2 px para decir «este tramo es nuestro».

Conté los cinco filetes verdes de `src/`: cuatro dicen «nuestro» (`FiguraTenencia.astro:103`,
`confianza.astro:332`, `EjeDeAlcance.astro:87`, y el `blockquote` del blog que es convención
tipográfica). **El de `honesty` es el desparejado.** Y el filete apagado aparece dos veces con el
significado publicado: `EjeDeAlcance.astro:88` (`.theirs`, al lado de `.ours`) y `tarifas.astro:615`
(`.ajeno`).

```css
/* §6.2: verde a lo largo de un tramo = «este tramo es nuestro», que es lo que
   dice `.phase.is-ours` 1.700 px más arriba en esta misma página. Estas cinco
   son lo contrario. No `--line-on-tinta`: ése es «separador sin significado». */
.honesty-list li { border-left: 2px solid var(--on-tinta-mute); }
```

**Accesorio y separable:** a tres columnas en vez de dos, la sección baja de **743 a 679 px** y se
cierra el agujero del quinto bloque. Antes y después en `confianza-honesty-antes.png` y
`confianza-honesty-despues.png`.

**Y lo que NO hay que hacer en esa página:** su zigzag de «Qué pasa con tu plata» parece desperdiciar
media sección y **no**. Medido: como está, cada bloque tiene 423 px —la medida de lectura de 47ch que
el componente documenta— y la sección mide 906. A tres columnas cada bloque baja a 296 y la sección
sube a **1.158**; a dos columnas, a **1.337**. Las dos alternativas son peores. La mitad vacía es el
precio de la medida de lectura.

---

## 4. `/preguntas` · su portada — «Las nueve preguntas»

**La primera versión —una lista de los ocho términos del glosario— la rechazó Sebastián con razón:
era el índice que él mismo mandó quitar de esa página el 2026-09-24.** Ficha completa en
`preguntas-portada-ficha.md`; maqueta en `preguntas-portada-maqueta.html`.

**Qué dibuja.** Las nueve preguntas de la página, una marca cada una, sacadas de los datos:
`home.ts` (persona, 5) y `business.ts` (empresa, 4), agrupadas por su campo `concern`.

| preocupación | persona | empresa |
|---|---|---|
| recibo | **2** | — |
| precio · alcance · requisitos | 1 · 1 · 1 | 1 · 1 · 1 |
| atencion | — | **1** |

De las cinco preocupaciones **tres las preguntan las dos partes y cada una tiene una suya**: *una
persona y una empresa preguntan casi lo mismo*. Arriba del eje las de la persona, abajo las de la
empresa, y **cuando las dos preguntan por lo mismo comparten la vertical**. Las dos asimetrías de
los extremos son las dos preguntas que sólo hace un lado.

**No enumera los cinco grupos**, a propósito: eso sería el índice retirado con otra ropa.

**Construirla desde los datos, no con nueve puntos a mano:** las marcas tienen que salir de contar
`faq` de `home.ts` y de `business.ts` por `concern`, para que la figura no mienta el día que se añada
una pregunta.

**Las marcas contra el §6.2:**
- eje verde = **el tramo que es nuestro** (lo que respondemos), significado publicado;
- punto lleno **neutro** en `--on-tinta` = **una pregunta**, y eso es **una marca nueva que hay que
  escribir en el §6.2 antes de dibujar**, como se hizo con la frontera punteada;
- rótulos «persona» y «empresa» **fuera del SVG**: dentro caen a 9,7 px a 390.

**Medido:** portada 434 / **460** / 604 / 487 / **520** / 520 a 320 / 390 / 768 / 960 / 1280 / 2560.
Desborde 0, texto mínimo 13 px en todos. Sin JavaScript y sin movimiento.

**Cadenas nuevas: ninguna.** «persona» y «empresa» son las dos palabras que el pie ya usa.

**Una pregunta de negocio para Sebastián:** la figura afirma que los dos públicos preguntan casi lo
mismo, y eso es cierto con nueve preguntas. Si `business.ts` va a crecer mucho, conviene saberlo.

**Las otras dos portadas —`/precio` y el índice del blog— no están diseñadas, y sobre `/precio` ya
tengo la respuesta a la pregunta que había dejado abierta:** su figura **no se puede subir a la
portada**. No es un objeto suelto — es `section.figura`, con su propio `<h2>` («Lo que ves y lo que
pagas miden lo mismo») y su bajada. Subirla dejaría el titular huérfano o lo duplicaría. Así que
`/precio` necesita **otro** objeto para su portada, o quedarse en la familia corta con el motivo
escrito. Lo miro cuando Sebastián lo pida.

## 5. Orden sugerido

1. **Corregir las cifras del detector** donde hayan quedado escritas (§0).
2. **El filete de `/confianza`** — una línea, y su nota citando el §6.2.
3. **La regla de portada** en el Design System, con la corrección de Sebastián (§2).
4. **La portada de `/preguntas`** (§4).
5. `/empresas` no se toca, y conviene que quede escrito **por qué** (§1), para que nadie la vuelva a
   poner en la lista con el recuento viejo.

Y lo de siempre: **comprueba contra el build de hoy** las cifras de los §2, §3 y §4 antes de tocar
nada, y si alguna dejó de salir, para y dilo.

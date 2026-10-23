# ADR-0018 — Las páginas que cuentan

- **Estado:** Aceptada — 2026-10-23
- **Decide:** Sebastián Villanueva.
  - **Lo pidió el 2026-10-23:** que las páginas que no son la Home dejen de verse «pobres y sin
    vida», comparando cada una con su par en Wise.
  - **Aprobó el análisis de Cowork** el mismo día: `Claude outputs/vida-analisis.md`, con sus
    prototipos y sus cuatro recomendaciones.
  - **Para el movimiento**, dijo: «tienes permitido hacer los movimientos que quieras ya que estamos
    en ambiente de prueba».
- **Ámbito:** las páginas comerciales que no son la Home: `/como-funciona`, `/tarifas`,
  `/empresas`, `/confianza`, `/precio`, `/preguntas`, `/cuanto-te-cobran` y los artículos del
  blog. **La Home no cambia.**
- **Identificador:** `vida`
- **Referencia:**
  - Motion System V1, §0 bis: las familias A, B y C.
  - ADR-0016 y ADR-0017, que estrenaron la técnica.
  - Design System §6.2: el significado de las marcas.
  - `CLAUDE.md` §2, Principio 3.

## Contexto

**Las páginas no estaban mal diseñadas: estaban quietas.**

Sin contar la portada, todas tienen la misma forma:

- la portada oscura con un aparato montado sobre la costura;
- secciones claras con figuras de línea que son diagramas fijos;
- un puente diagonal;
- una banda de cierre.

**Medido el 2026-10-23**, recorriendo cada página entera: la Home declara 67 animaciones, y el
resto, entre 5 (`/tarifas`) y 22 (`/empresas`).

La comparación con Wise, página por página, encontró que lo que hace vivas sus páginas no es su
color ni sus objetos 3D. Son cuatro hábitos:

1. el producto, funcionando, en cada portada;
2. cada idea contada con un pedazo del producto;
3. esos pedazos se mueven;
4. ritmo de bloques.

**Lo que este sitio puede traer es el cómo cuenta, no el cómo se ve.** El Principio 3 prohíbe
parecerse a otra fintech, y la identidad está cerrada (ADR-0001).

## Decisión

**Cada página cuenta su argumento con lo que ya tiene**: los aparatos en CSS, las figuras de línea
con su semántica y las cifras de `lib/pricing`. Lo hace en tres capas:

| Capa | Qué es | Familia (§0 bis) |
|---|---|---|
| **Portadas que actúan** | El aparato de la portada hace su acción una vez, al cargar | A, narración corta |
| **Figuras que cuentan** | Cada figura de línea hace **su verbo** al bajar, y el verbo es el significado de su marca | C |
| **Una pieza por página** | La pieza propia de cada página, como el teléfono lo es de la Home | C, o ninguna |

### Las veinte piezas

| # | Página | Pieza | Qué hace | Familia | Tanda |
|---|---|---|---|---|---|
| 1 | `/confianza` | Portada: los tres avisos | Llegan en el orden en que te llegarían, sin horas; termina a los 2,6 s | A | 1 |
| 2 | `/empresas` | Portada: el portátil | Pasa por «Precio», elige «Retirar», llega la tarjeta y se traza el visto; 2,3 s | A | 1 |
| 3 | `/tarifas` | Portada: la tarjeta | La barra se llena hasta el punteado; después la llave y «acá termina»; 2,2 s. Las filas del cotizador y sus cifras no se mueven | A | 1 |
| 4 | `/preguntas` | Portada: la tableta | Sale la pregunta, entra la respuesta; 1,8 s | A | 1 |
| 5 | `/empresas` | Proveedores | La unidad de valor cruza la frontera | C | 1 |
| 6 | `/empresas` | Tesorería | El cajón de la divisa se abre; después, el tramo verde del cambio | C | 1 |
| 7 | `/empresas` | Recurrentes | Los doce meses se marcan de a uno | C | 1 |
| 8 | `/empresas` | Volumen | La pila de la divisa se arma hasta el mismo alto | C | 1 |
| 9 | `/confianza` | El banco | La unidad entra a la cuenta; **sólo después** se traza el tramo nuestro | C | 1 |
| 10 | `/confianza` | Una persona | La placa con el nombre llega al escritorio | C | 1 |
| 11 | `/tarifas` y `/confianza` | El mercado | La etiqueta referencial se mece; la final no se mueve nada | C | 1 |
| 12 | `/tarifas` | El monto | La línea del monto crece hasta el límite; al cruzarlo aparece con quién se conversa | C | 1 |
| 13 | `/tarifas` | El puente de avisos | Los tres avisos se apilan de a uno | C | 1 |
| 14 | `/como-funciona` | Portada | Enseña el salto: el botón del cotizador abriendo el chat. La conversación va en los pasos | A | 2 |
| 15 | `/como-funciona` | Los seis pasos | Cada paso enseña su pieza —el cotizador, tu mensaje, el ejecutivo…— y al bajar «se hace»: filete, número y pieza | C | 2 |
| 16 | `/precio` | Qué cuesta y qué no | Cada «sin costo» se escribe al leer su fila; la que cobra traza su filete | C | 2 |
| 17 | `/preguntas` | El índice | Desde 1100 px se pega a la izquierda y marca el grupo que lees | C | 3 |
| 18 | Artículo | La barra de lectura | Crece con lo leído. Es una magnitud | C (`scroll()`) | 3 |
| 19 | Artículo | El riel | Marca la sección que lees: dos líneas de tiempo por entrada | C | 3 |
| 20 | `/cuanto-te-cobran` | La regla | De 0 a 5 %, se llena hasta tu spread; transición de 280 ms | ninguna (M2) | 3 |

**La tanda 4 no tiene filas en esta tabla.** Son decisiones de composición, no de movimiento:

- «Empresas, de noche»;
- el llamado que te sigue en `/empresas`;
- la fila grande del blog;
- el toque de las legales y la 404.

Sebastián aprobó dibujarlas. Cada una entra con su propia entrega, y si alguna se mueve, con su
fila aquí.

### Las reglas que cumplen todas

1. **Con `prefers-reduced-motion: reduce` no se declara ninguna animación.** El reposo es la
   página de antes, idéntica al píxel salvo donde una pieza añade contenido: las de los pasos de
   `/como-funciona`, el índice de `/preguntas` y la regla.
2. **Toda línea de tiempo vive dentro de `@supports (animation-timeline: …)` y de
   `prefers-reduced-motion: no-preference`.** Sin soporte, la pieza no tiene un `from` que la
   deje vacía. **Lo vigila `tests/movimiento.test.ts`** sobre el CSS del build.
3. **Ninguna cifra se mueve** (regla dura 3). Se abre el mensaje entero, se traza la marca o se
   revela el texto. La regla de la pieza 20 es una magnitud, no una cifra.
4. **El verbo es el significado de la marca** (DS §6.2), y por eso:
   - el punto que cruza es una unidad de valor;
   - el tramo verde se traza después del límite, porque es el nuestro;
   - la línea del monto es `--ink-mute`, porque es tuya;
   - el filete de cada paso de `/como-funciona` es `--ink-mute` si lo haces tú y verde si lo
     hacemos nosotros;
   - la etiqueta final no se mueve nunca.
5. **El cotizador no entra** (regla dura 2). La tarjeta de `/tarifas` llena su figura, no sus filas.
6. **`/tarifas` sigue en cero bytes de JavaScript.** Las portadas son CSS.
7. **La Home no cambia.** La forma `compacta` de `FiguraMecanismo`, que es la de la Home, queda
   fuera de toda línea de tiempo; también lo vigila el test. *Desde la tanda 2, «no cambia» se
   mide en el píxel y en las peticiones:* el build reparte de otro modo 0,6 KB de CSS de las
   banderas —de la hoja compartida al HTML—, porque `/como-funciona` ahora también las pinta: el
   HTML de la Home sube 112 B y la hoja compartida baja 114, o sea **−2 B**. Lo que la Home paga
   de verdad son **+3 B** sobre 55.576, porque encima van los 5 B de la corrección de
   `FiguraMecanismo`. Medido con `gzip -9` sobre el HTML y sus tres hojas.
8. **Ningún texto se queda parado a media tinta donde se lee** (desde la tanda 2). Es una regla de
   la familia C, porque ahí quien baja puede detenerse a mitad: la opacidad de una pieza con texto
   termina en `entry 100%`, o mientras el texto está en el cuarto de abajo de la pantalla. Las
   marcas, que son dibujo, sí pueden fundirse. Lo comprueba axe con la página parada cada 120 px,
   que es como la deja quien deja de bajar. **En la familia A el texto sí entra con opacidad**,
   como en M6: pasa solo y en menos de 300 ms.

## Lo que enmienda, y lo que no

| Regla | Estado |
|---|---|
| §0 bis, familia C, regla 1 — **una por pieza, con su ADR** | **Enmendada**: un ADR puede cubrir varias piezas si lleva **una fila por pieza**, con lo que hace, su familia y dónde vive. Veinte ADR habrían dicho veinte veces lo mismo |
| §0 bis, familia A — las narraciones largas salen del techo con un ADR | **Aplicada**: las piezas 1 a 4 y 14 son narraciones de una vez, de 1,8 a 2,6 s en total, con cada paso a `--m-slow` o menos |
| §4, regla dura 1 — una sola vez, en las entradas | **Intacta** para las piezas A. Las C se arrastran con el desplazamiento, como manda su familia |
| §4, reglas duras 2, 3 y 6 | **Intactas** |
| §5 — dónde se aplica, página por página | **Se actualiza** con cada tanda: `/empresas` y `/confianza`; tablas nuevas para `/tarifas`, `/preguntas` y `/precio`; en `/como-funciona`, el encabezado y los pasos |

## Lo que cuesta, medido en la tanda 1

Sobre `7b2f690`:

- **JavaScript: 0 B.** Los mismos archivos y el mismo CSP.
- **CSS comprimido:**

  | Hoja | Antes | Después |
  |---|---|---|
  | `/empresas` | 4,9 KB | 5,6 KB |
  | `FiguraMecanismo` | 2,1 KB | 2,4 KB |
  | `TelefonoAvisos` | 1,2 KB | 1,4 KB |
  | `/tarifas` | 1,4 KB | 1,6 KB |
  | `/preguntas` | 1,7 KB | 1,9 KB |

- **En reposo, todas las rutas idénticas al píxel** a 390 y 1280.

## La tanda 2, integrada el 2026-10-23

**Las piezas 14 a 16**, sobre `d55c464`. Sebastián vio la portada de `/como-funciona` antes de
cerrar la entrega y la aprobó así.

**La portada, «el salto»** (`SaltoAlChat.astro`), son tres piezas:

1. la tarjeta del cotizador en pequeño, con sus dos cajas y su botón, rotulada «en la web»;
2. la cuña del §6.2, porque el trabajo cambia de manos;
3. el teléfono con el chat recién abierto y tu mensaje en la caja de texto, sin enviar, rotulado
   «con tu ejecutivo».

**No es el cotizador**: nada se enfoca ni se pulsa, y todo va `aria-hidden`. Lo dice con palabras
el pie. Las cifras salen de `lib/pricing` y el mensaje es `mensajeInicial()`, comprobado en el
build por `tests/telefono.test.ts`.

**La caja de texto entra al teléfono por un slot** (`caja`) y no por una prop. Con la prop, la
hoja de `WhatsAppMockup` pasaba de 4 KB, dejaba de ir en línea y la Home ganaba una petición.

**Corrección a la tanda 1 (piezas 10 y 12).** En `FiguraMecanismo`, «acá se conversa» y «Tu
ejecutivo» se fundían, y axe encontró el primero a media tinta en el tercio de arriba de la
pantalla. Ahora:

- los rótulos están desde el principio;
- las placas se levantan con `scale`, enteras y opacas;
- se funden sólo la persona, la mesa y las patas.

De ahí sale la regla 8.

### Lo que cuesta

- **JavaScript: 0 B.** Los mismos archivos y el mismo CSP.
- **CSS comprimido: +1,4 KB en total.**

  | Hoja | Antes | Después |
  |---|---|---|
  | `/como-funciona` | 2,4 KB | 3,7 KB |
  | `/precio` | 3,9 KB | 4,1 KB |

- **HTML de `/como-funciona`: +1,1 KB comprimido.** La portada nueva y las seis piezas. Las
  banderas van con `codigos`: dos de catorce.
- **En reposo, todas las rutas idénticas al píxel** salvo `/como-funciona`, que añade sus piezas.

## Lo que este ADR NO concede

- **Ningún movimiento en la Home.** La Home tiene el suyo, con sus ADR.
- **Ninguna pieza que no esté en la tabla.** La vigesimoprimera trae su fila, o su ADR.
- **Nada en «Lo que no vas a leer acá»** de `/confianza`. Su quietud es su tono (§5), y sigue así.
- **Ningún plazo, canal ni «remesa»** en lo que se mueve (ADR-0014, `CLAUDE.md` §1). Los avisos y
  la conversación siguen sin horas.
- **Nada que se parezca a Wise.** Ni su verde, ni sus objetos 3D, ni sus fotos, ni sus botones
  píldora, ni sus testimonios, ni sus comparaciones con nombre.

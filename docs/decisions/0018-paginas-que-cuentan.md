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

### Las veintidós piezas

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
| 17 | `/preguntas` | El índice | Desde 1112 px se pega a la izquierda y marca el grupo que lees | C | 3 |
| 18 | Artículo | La barra de lectura | Crece con el texto leído. Es una magnitud | C (`view()` del texto) | 3 |
| 19 | Artículo | El riel | Marca la sección que lees: dos líneas de tiempo por entrada | C | 3 |
| 20 | `/cuanto-te-cobran` | La regla | De 0 a 5 %, se llena hasta tu spread; transición de 280 ms | ninguna (M2) | 3 |
| 21 | `/empresas` | El llamado que te sigue | Bajo 900 px, entra al salir la portada y se va cuando llega la banda de contacto, que tiene el mismo botón | C | 4 |
| 22 | Las legales | El riel | Con tres secciones o más, el del artículo: marca la sección que lees | C | 4 |

**La tanda 4 tiene dos filas, la 21 y la 22**, porque es lo único de ella que se mueve. Lo demás
son decisiones de composición, no de movimiento:

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
   - la barra de lectura y la regla de `/cuanto-te-cobran` son «barra llena verde», magnitudes; los
     tics de la regla van debajo de lo lleno, para no partirla en el «canto dividido en unidades»;
   - la etiqueta final no se mueve nunca.
5. **El cotizador no entra** (regla dura 2). La tarjeta de `/tarifas` llena su figura, no sus filas.
6. **`/tarifas` sigue en cero bytes de JavaScript.** Las portadas son CSS. *Desde la tanda 3,
   `/preguntas` y el artículo también marcan dónde estás sin JavaScript.*
7. **La Home no cambia.** La forma `compacta` de `FiguraMecanismo`, que es la de la Home, queda
   fuera de toda línea de tiempo; también lo vigila el test. *Desde la tanda 2, «no cambia» se
   mide en el píxel y en las peticiones:* el build reparte de otro modo 0,6 KB de CSS de las
   banderas —de la hoja compartida al HTML—, porque `/como-funciona` ahora también las pinta: el
   HTML de la Home sube 112 B y la hoja compartida baja 114, o sea **−2 B**. Lo que la Home paga
   de verdad son **+3 B** sobre 55.576, porque encima van los 5 B de la corrección de
   `FiguraMecanismo`. Medido con `gzip -9` sobre el HTML y sus tres hojas.
   *En la tanda 4*, la Home sigue idéntica al píxel y con las mismas peticiones. Cambia el nombre de
   la hoja global, porque `tokens.css` gana la superficie de noche: +135 B comprimidos, en todas las
   páginas.
   *En su segunda parte* (`vida5-`), la Home queda **byte a byte igual**: el menú se mudó a
   `lib/navegacion.ts` y la cabecera sale idéntica, comprobado sobre el build.
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
| §5 — dónde se aplica, página por página | **Se actualiza** con cada tanda: `/empresas` y `/confianza`; tablas nuevas para `/tarifas`, `/preguntas`, `/precio` y `/cuanto-te-cobran`; en `/como-funciona`, el encabezado y los pasos; en el artículo, el riel y la barra de lectura; en `/empresas`, el llamado que te sigue; en las legales, el riel |

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

## La tanda 3, integrada el 2026-10-23

**Las piezas 17 a 20**, sobre `2c75ee9`. Sebastián vio las cuatro antes de cerrar la entrega y
las aprobó así.

**La pieza 17 revierte una decisión suya, y la tomó sabiéndolo.** El 2026-09-24 Sebastián retiró
por estética un índice pegajoso de `/preguntas`. El análisis que aprobó no lo advertía. Antes de
construir la pieza, Cowork se lo dijo con una lámina que ponía la página de hoy al lado de la
nueva, y Sebastián eligió que se pegue. Queda escrito en la cabecera de `preguntas.astro`, y
`CLAUDE.md` §6 se corrigió con ella: decía de la banda de entrada que «ésta no se pega», y desde
1112 px sí lo hace.

**Un solo patrón para las piezas 17 y 19: el riel.**

- **`/preguntas` usa el riel del artículo**: la misma rejilla —176 px de riel, 48 de hueco y 760
  de lectura— y el mismo breakpoint, **1112 y no 1100**, porque 1112 es el ancho en que esa
  rejilla cabe con los márgenes de sección.
- **El glosario pasa a la misma rejilla**: el término en 176 y la definición en 760. Así las dos
  columnas de lectura de la página arrancan en el mismo sitio.
- **La marca de «dónde estás» es la del menú**, que señala la página actual con verde sobre la
  tinta. Sobre claro, su par es `--verde-deep`: un filete de 2 px sobre el de `--line`, y el
  texto en `--ink`. No cambia de grosor. En colores forzados, `Highlight` de 4 px.
- **Cómo marca, sin JavaScript**: cada grupo o H2 es una línea de tiempo con nombre, y la vista se
  reduce a una línea a un tercio de la pantalla. Cada entrada se enciende cuando su grupo cruza
  esa línea y se apaga cuando la cruza el siguiente.
- **`tests/riel.test.ts`** comprueba que las entradas y los grupos —o los H2— estén en el mismo
  orden, y que los H2 sean hermanos. Si no lo son, el riel marcaría la sección equivocada.

**La barra de lectura mide el texto, no la página** (pieza 18). Con `scroll()`, como estaba en la
fila, contaba también «Sigue leyendo» y el pie. Ahora es la línea de tiempo del texto del artículo
(`contain`): empieza cuando el texto llega arriba y se llena cuando su final asoma abajo.

**La regla dice su escala y no juzga** (pieza 20): «0 %» y «5 % o más». Sobre 5 % queda llena;
bajo la referencia, vacía. **La figura de la calculadora sigue sin escalar**: la regla es aparte y
lleva su escala escrita.

**Y un arreglo que no es pieza**: en el paso 06 de `/como-funciona`, a 390, la línea partida
empezaba por «·». Ahora el punto va al final de «quién».

### Lo que cuesta

- **JavaScript: +121 B en línea**, en `/cuanto-te-cobran`: la isla de la calculadora pone el largo
  de la regla. **Cambia un hash del CSP**, el de esa isla —sale `sha256-oyMK…`, entra
  `sha256-XekN…`—, y ninguno más. Los archivos `.js` son los mismos.
- **CSS comprimido: +1.595 B en total**, medido con `gzip -9`.

  | Hoja | Antes | Después |
  |---|---|---|
  | Artículo | 3.097 B | 3.785 B |
  | `/preguntas` | 1.855 B | 2.505 B |
  | `/cuanto-te-cobran` | 1.541 B | 1.780 B |
  | `/como-funciona` | 3.697 B | 3.715 B |

- **La Home, idéntica byte a byte.**
- **En reposo, todas las rutas idénticas al píxel** salvo:
  - `/preguntas` desde 1112, por el riel —a 1280 queda **206 px más corta**—;
  - `/cuanto-te-cobran`, por la regla: 50 px más alta a 390 y 49 a 1280;
  - `/como-funciona` a 390, por el punto del paso 06.

## La tanda 4: `/empresas` de noche y el llamado que te sigue, integrada el 2026-10-23

**Sebastián eligió viendo los dos prototipos** (`Claude outputs/vida4-noche.png`), igual que
cuando lo aprobó en el análisis:

- **A · Entera**: todo `/empresas` sobre tinta, salvo la banda de contacto. **Es la que eligió.**
- **B · Bandas**: noche y día alternados.

También eligió que vaya el llamado que te sigue.

**Cómo se hace, sin estrenar un color: la superficie de noche** (`.noche`, en `tokens.css`).

- Dentro de una sección de noche, los tokens claros pasan a sus pares sobre tinta, **y lo que era
  tinta pasa a claro**. Es una inversión, no un tema.
- Así **lo más claro de la página es lo de la empresa**: la columna «Empresa» de la comparación y el
  bloque «Nuestra parte».
- Los componentes no saben nada. La alternancia del día, `--papel` y `--papel-2`, se vuelve tinta y
  tinta-2 sola.
- **Un token nuevo, `--verde-en-tinta`**, para el verde que vive sobre un objeto de tinta. De día es
  `--verde`; de noche, cuando el objeto pasa a claro, es `--verde-deep`. Lo usan `ComparaEmpresa` y
  `AlcanceEmpresa`.
- **La banda de contacto queda clara**, que es la regla de la banda de cierre (DS §6.3).

**El llamado que te sigue** (pieza 21) es el par del dock de la Home, sin cifra:

- «DLPay Empresas · Te responde una persona · Escribir».
- Bajo 900 px.
- Entra con la línea de tiempo de la portada y sale con la del contacto.
- `visibility` va en la animación, así que escondido no se enfoca.
- `scroll-padding-bottom` evita que tape lo que enfocas (WCAG 2.2, 2.4.11).
- **Con movimiento reducido no existe**, por la regla 2 de este ADR. El de la Home sí aparece,
  porque lo enciende JavaScript.

`tests/empresas.test.ts` comprueba dos cosas:

- que el llamado y el cierre abren el mismo mensaje;
- que la banda de contacto es la única clara.

### Lo que cuesta

- **JavaScript: 0 B.** Los mismos archivos y el mismo CSP, byte a byte.
- **CSS comprimido: +524 B.**
  - La hoja global, **+135 B** (4.108 → 4.243), en todas las páginas: es la superficie. Su diff es
    **un solo `insert` de 693 B sin comprimir: no se quitó ni un byte de lo que ya había**.
  - La de `/empresas`, **+389 B**: el llamado, y los dos componentes que cambian de verde.
- **En reposo, todas las rutas idénticas al píxel** salvo `/empresas`, que conserva su mismo alto
  —8.122 px a 390 y 6.320 a 1280— y gana diez elementos, los del llamado.

**Lo que queda de la tanda 4** —la fila grande del blog, y las legales y la 404— entra con su
propia entrega, con prototipo antes.

### Un ajuste visto en staging: las cuñas de la portada siguen

**Sebastián lo vio en staging el mismo día.** La sección de abajo también es de tinta, así que las
dos cuñas del fondo de la portada se cortaban en la costura sin nada que justificara el corte. Se
leía como un error.

- **Ahora siguen** por su misma diagonal sobre «Para qué lo usan», hasta salir por el borde
  izquierdo de la página. Es una prop nueva de `PageHero`, `wedges="continue"`, y sólo la pide
  `/empresas`.
- **Son las mismas dos rectas, prolongadas.** La caja de las cuñas mide 1,6 veces la portada y el
  polígono se recalculó para que cada borde siga su recta: una recta que va de x₀ arriba a x₁ abajo
  cruza el borde izquierdo a x₀/(x₀−x₁) altos de banda, y de ahí salen el 62,5 %, 83,333 %,
  89,674 % y 98,611 % del polígono. El más lejano cae en 1,578 H, dentro de la caja de 1,6.
  Como la caja se mide contra la portada, cuadra a cualquier ancho sin un número por breakpoint.
- **Pasan por detrás** del portátil y del contenido de la sección, y terminan antes de la primera
  fila de casos: medido, bajan 341 px pasada la costura a 1000 y 1280, y 364 a 390.
- `tests/empresas.test.ts` exige que, en cualquier página, la portada que prolonga sus cuñas vaya
  seguida de una sección de noche.

**Lo que cuesta:**

- **0 B de JavaScript**, y el `_headers` byte a byte idéntico.
- **+10 B en el CSS comprimido de `/empresas`.**
- **+56 a +65 B de HTML comprimido** en las doce páginas con `PageHero`, porque su hoja va en línea.
  **La Home y los cinco artículos, +0 B: byte a byte iguales.** No cambia lo que se ve: **las otras
  diecisiete páginas quedan idénticas al píxel**, comprobado a 390, 1000 y 1280.

## La tanda 4, segunda parte: la fila grande del blog, el riel de las legales y la 404

**Sebastián eligió viendo los prototipos** (`Claude outputs/vida5-prototipos.png`).

**La fila grande del blog.** La primera fila de cada grupo del índice lleva **la portada real del
artículo**, en vez de la miniatura.

- Es la misma pieza del artículo, con su cifra, su unidad, su fecha y su fuente. Va como bloque de
  tinta dentro del índice: `PortadaDato` con `encaje="bloque"`, o `PortadaFigura` con
  `variant="bloque"`. No es una copia, así que una portada no puede decir una cosa en el artículo y
  otra en el índice.
- **Al lado del texto**, en cinco doceavos desde 900 px. La otra variante, la portada encima a todo
  el ancho, dejaba la tinta vacía a la derecha de la cifra y alargaba la página 370 px.
- **Es la primera de su grupo**, no «la más reciente», y también lo eligió Sebastián. En Mercado
  son lo mismo. En Guías, con la ruta publicada, la primera es el paso 1.
- **No se repite nada**: la fila grande es esa fila, no una copia arriba de la lista. Y no se
  mueve más que las demás: entra con su M5.

**El riel en las legales (pieza 22).** Es el del artículo, con su misma regla: **sólo con tres
secciones o más**.

- Hoy lo cumple `/canal-de-denuncias`, con cuatro.
- Términos y privacidad tienen dos cada uno mientras su texto definitivo espera la firma (D9, D19,
  D20). **No cambian a la vista** —mismo alto y cada elemento en su caja exacta, comprobado—, y el
  riel les llega solo el día que lo tengan. Lo que ganan son dos envoltorios de rejilla.
- Las secciones salen del HTML del propio documento (`lib/secciones.ts`): sólo los H2 de primer
  nivel, así que el aviso de `PendingNotice` no cuenta. Ninguna página repite sus títulos en una
  lista aparte.
- Marca la sección que lees como el del artículo: familia C, CSS entero. Las legales siguen en
  **cero JavaScript**.
- `tests/riel.test.ts` lo vigila también en las legales, y `tests/secciones.test.ts` prueba la
  función.

**La 404: tres salidas más.** Bajo «Para conocer DLPay» van Cómo funciona, Precio y Preguntas, con
**los mismos rótulos y descripciones del menú «Información»**.

- El menú salió de `Header.astro` a `lib/navegacion.ts` para que las dos lo lean del mismo sitio.
- **No son «las más visitadas»**: el sitio no tiene analítica. Son las tres que responden qué es,
  qué cuesta y qué dudas hay.
- El único texto nuevo es el rótulo, con su `REQUIERE VALIDACIÓN DE COMPLIANCE`.
- `tests/404.test.ts` comprueba que dicen lo mismo que el menú y que llevan a una página que existe.

### Lo que cuesta

Medido con `gzip -9` sobre el HTML y las hojas que pide cada página.

- **JavaScript: 0 B.** Los mismos archivos, y `dist/_headers` idéntico.
- **La Home, byte a byte igual**, y con las mismas tres hojas.
- **Una hoja más en `/blog`, en los artículos y en las legales**, porque sus estilos pasan del
  umbral de 4 KB en que el build los deja en línea:

  | Página | Antes | Ahora | |
  |---|---|---|---|
  | La Home | 55.634 B | 55.634 B | **+0** |
  | `/blog` | 16.228 B | 17.306 B | +1.078 B |
  | Cada artículo | 20.842 B | 21.186 B | +344 B, con la hoja nueva compartida con `/blog` |
  | `/terminos` | 9.728 B | 11.217 B | +1.489 B, el CSS de un riel que todavía no usa |
  | `/privacidad` | 9.616 B | 11.099 B | +1.483 B, lo mismo |
  | `/canal-de-denuncias` | 9.703 B | 11.467 B | +1.764 B |
  | La 404 | 8.743 B | 9.123 B | +380 B, con la misma hoja |

- **En reposo, idénticas al píxel** todas las rutas salvo `/blog`, `/canal-de-denuncias` y la 404.

## Lo que este ADR NO concede

- **Ningún movimiento en la Home.** La Home tiene el suyo, con sus ADR.
- **Ninguna pieza que no esté en la tabla.** La vigesimotercera trae su fila, o su ADR.
- **Nada en «Lo que no vas a leer acá»** de `/confianza`. Su quietud es su tono (§5), y sigue así.
- **Ningún plazo, canal ni «remesa»** en lo que se mueve (ADR-0014, `CLAUDE.md` §1). Los avisos y
  la conversación siguen sin horas.
- **Nada que se parezca a Wise.** Ni su verde, ni sus objetos 3D, ni sus fotos, ni sus botones
  píldora, ni sus testimonios, ni sus comparaciones con nombre.

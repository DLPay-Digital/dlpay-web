# Fase 4 — Construcción del sitio público

> **Estado: EN CURSO.** Este documento se actualiza; no cierra la fase.
> **Fecha del periodo:** desde 2026-09-04. **Corte de este registro:** 2026-09-17.
> **Autor:** Claude Code (sup. Sebastián Villanueva), con Claude Cowork en la parte visual
> desde el 2026-09-15.
> **Insumo previo obligatorio:** `phase-3-arquitectura.md` y `phase-2.5-definicion-experiencia.md`.
> **Escrito a posteriori** a partir del historial, los ADR y mediciones sobre el build. Lo que no
> se pudo verificar al escribirlo va marcado.

---

## 0. Taxonomía de marcadores

La de Fase 1, más una que esta fase necesitó.

| Marcador | Significado |
|---|---|
| **HECHO** | Evidencia observable: código, commit, medición sobre el build. |
| **DECISIÓN** | Elección tomada, con su ADR cuando lo tiene. |
| **RETIRADO** | Algo que llegó a existir y se eliminó, con el motivo. |
| **CORREGIDO** | Error real cometido y su arreglo. Se registra a propósito: es la parte útil. |
| **PENDIENTE** | Abierto; se sigue en `CLAUDE.md` §13. |

---

## 1. Por qué esta fase es la más larga

Palabras de Sebastián el 2026-09-17: *«la fase 4 la verdad es que ha sido la más larga hasta ahora,
pero está valiendo la pena»*.

La razón tiene nombre y está en los datos: **desde el 2026-09-08 no queda ingeniería para publicar**
—lo que falta es de Compliance— y aun así el trabajo siguió trece días más. Eso no es una fase que
no termina: es una fase que **cambió de naturaleza** a mitad de camino, de construir lo que falta a
mejorar lo que hay.

Conviene que quede escrito porque las dos cosas se parecen desde fuera y no son lo mismo. Nada de lo
que entró después del 8 de septiembre nació de una carencia funcional.

---

## 2. Los cuatro periodos

### 2.1 Construcción (4 al 8 de septiembre)

**HECHO.** Las páginas, el cotizador funcionando, las cuatro rutas legales sin inventar texto
vinculante, SEO técnico, el plan de migración de URLs y dos auditorías previas a producción.

**DECISIÓN — Motion System V1 (2026-09-07).** Enmienda el Design System §9, que prohibía el
movimiento: se permiten entradas al hacer scroll y escalonado, en forma acotada. Seis movimientos y
un techo de 280 ms. La regla dura es «una sola vez».

**DECISIÓN — ADR-0006, la franja de notificación (2026-09-08).** Primera excepción a esa regla
dura: su rotación es infinita. Se aceptó a petición explícita del equipo, acotada a esa pieza.

**CORREGIDO — la auditoría del 8 encontró dos fallos que no se veían en local:** la guarda de
`PUBLIC_SITE_URL` se esquivaba llamando a `astro build` directamente, y no existía forma de evitar
que un Staging fuera indexado. De ahí salen las dos variables que hoy gobiernan el despliegue, con
la indexación **cerrada por omisión**.

### 2.2 Limpieza y consolidación (9 al 11 de septiembre)

El periodo menos visible y el que más deuda saldó.

**RETIRADO — la ruta `/cotizar`.** Duplicaba el cotizador del héroe y no se ganaba el espacio. Con
eso se cierra la hipótesis **H8** de Fase 1, que estaba marcada `P1` y pendiente de «uso real /
feedback del equipo»: el equipo dio ese feedback. Lo que se pierde —una URL limpia que pegar en
WhatsApp— se resuelve con el ancla `/#cotizador`.

**RETIRADO — la actividad reciente, y cierre de D18.** Un feed de «operaciones recientes» que nunca
salió de la investigación: cero menciones en `phase-2.5` y en `cotizador-spec`. Nació al construir
`/cotizar` y se quedó sin página al eliminarla. Y chocaba con **D10**: un feed de actividad **es**
una cifra de volumen, y publicarlo en continuo es decisión de Compliance, no de ingeniería. Se
eliminaron el componente, `lib/activity` y sus 15 tests — 514 líneas.

**DECISIÓN — cierre de D24.** Los límites del cotizador se resuelven UNA vez en `lib/config` y se
exponen como `quoteLimits`. Los cinco consumidores dejaron de leer el entorno por su cuenta, así que
`/tarifas` publica **por construcción** el mismo mínimo que el cotizador aplica. Es el patrón que
después se replicó tres veces más.

**CORREGIDO — la identidad del historial.** Hasta el 11 los commits iban a nombre de un usuario y un
hostname locales. Se reescribió el historial completo con la identidad correcta, verificando que el
hash del árbol no cambiara.

**PENDIENTE — D3.** Sigue sin existir la organización de GitHub, así que el repositorio **no tiene
copia fuera del equipo** más allá de un `git bundle` en Drive. Es el mayor riesgo operativo abierto
del proyecto.

### 2.3 El globo y el blog (11 al 15 de septiembre)

**DECISIÓN — `/blog`.** Colección tipada con esquema cerrado. Sin paquetes nuevos.

**DECISIÓN — el globo rotativo del héroe, y tres excepciones.** Es la pieza más discutida de la
fase y la que más reglas duras suspende:

| ADR | Qué suspende |
|---|---|
| 0007 | La paleta congelada de ADR-0001: siete colores cartográficos, acotados al componente |
| 0008 | La regla «una sola vez» del Motion System: dos movimientos infinitos |
| 0009 | «Cero JS al cliente»: ~40 KB de runtime, casi todo coordenadas |

**CORREGIDO — el orden estaba invertido.** El componente se mergeó con los tres ADR en estado
*Propuesta*, así que durante cuatro días el código fue por delante de la decisión. Se aceptaron el
15. La lección quedó escrita: **el ADR no es documentación a posteriori, es la autorización.**

### 2.4 Auditoría externa y rediseño (15 al 17 de septiembre)

**HECHO — auditoría externa de sólo lectura.** Veredicto: sólido en ingeniería, desalineado en
gobernanza. De los hallazgos que se pudieron comprobar de forma independiente, **ninguno resultó
falso**. Los cuatro que más pesaron:

1. Un build de producción **publicaba el artículo de prueba del blog**, cuyo propio texto dice «no
   debe publicarse». Lo único que lo tapaba era una variable de entorno.
2. El Motion System podía dejar la Home **prácticamente vacía**: son dos scripts, uno oculta y otro
   revela, y sólo el segundo puede fallar por su cuenta.
3. El globo **recalculaba el mapamundi a 60 fps estando fuera de pantalla**.
4. `CLAUDE.md` afirmaba «0 JS al cliente» y «el cotizador es la única isla interactiva», las dos
   falsas desde el globo.

**DECISIÓN — incorporación de Claude Cowork (2026-09-15)**, dedicado sólo a la parte visual, con su
banco de trabajo en `cowork/` y un protocolo escrito: Cowork propone y mide, Claude Code revisa
contra el Definition of Done, traslada a `src/` y commitea. Cowork no toca `src/` ni `docs/`.

**HECHO — siete jugadas de rediseño (J1 a J7)** entre el 16 y el 17: la 404, el encabezado y las
figuras de `/empresas`, el blog, la figura de tenencia de `/confianza`, el carril de
`/como-funciona`, el eje de alcance en tres páginas y la FAQ de empresas.

---

## 3. Lo que el sitio ganó, en piezas

**HECHO, medido sobre el build del 2026-09-17:** once páginas construidas —nueve rutas, un artículo
y la 404—, 59 tests en verde, `astro check` sin errores en 60 archivos, y **cuatro dependencias**,
las mismas que al cerrar Fase 3.

**Cinco familias de figura**, todas en SVG o CSS y ninguna con una imagen:

| Familia | Dónde | Qué dice |
|---|---|---|
| Emblemas de caso | `/empresas` | Cuatro operaciones, con el canto del isotipo como frontera |
| Línea de tenencia | `/confianza` | De quién es la cuenta donde está el dinero, en cada momento |
| Carril de dos columnas | `/como-funciona` | Qué hace el usuario y qué hace DLPay, y dónde cambia de manos |
| Eje de alcance | Home, `/como-funciona`, `/empresas` | Hasta dónde llega el servicio y dónde deja de ser nuestro |
| Portada de dato | `/blog/<slug>` | La cifra de la que habla el artículo, con su fuente |

La gramática que comparten se escribió el 2026-09-17 en el **Design System §6.2**, después de
medirla sobre el build. No se inventó: se levantó de lo que las figuras ya hacían.

---

## 4. Lo que esta fase aprendió, y es lo más reutilizable

Cinco trampas que costaron tiempo real. Las cinco tienen la misma forma: **una herramienta de
medición que miente y no avisa.**

### 4.1 `1ch` no es un carácter

El Design System fija menos de 65–70 caracteres de medida de lectura, y el sitio la implementaba en
`ch`. Pero `1ch` es el ancho del glifo **cero**, y en Familjen Grotesk el cero es ancho: **1,37**
caracteres medios de español. Toda medida escrita en `ch` salía un 37 % más ancha de lo que creyó
quien la escribió. `max-width: 66ch` no da 66 caracteres: da unos 90.

**CORREGIDO** en dieciséis declaraciones. El tope se escribe `47ch`, y el factor quedó documentado
con la condición de recalcularlo si cambia la tipografía.

### 4.2 El servidor de desarrollo envejece y miente en silencio

Un `astro dev` de días acaba sirviendo **el HTML nuevo con el CSS viejo**. Sin error en consola y
sin aviso: la página se ve rota de una forma que parece un fallo de maquetación. Pasó **tres
veces**, y una de ellas costó un reporte de bug que no existía.

El diagnóstico está en `development.md`: contar si la regla que debería aplicar existe siquiera en
las hojas cargadas. Si la clase está en el DOM y el contador da cero, el viejo es el servidor.

**Cuarta vez, el 2026-10-01, y con un mecanismo distinto que conviene añadir porque el diagnóstico
de arriba NO lo detecta.** Sebastián reportó que el abanico de `/precio` «no tiene movimiento», y
tenía razón en su pantalla: lo revisaba en un `astro dev` levantado el **17 de septiembre**. Pero
esta vez **el CSS sí llegaba** —la regla estaba, con su hash de ámbito correcto, y el contador daba
dos—. Lo que fallaba era *cuándo* llegaba:

| | dev | build |
|---|---|---|
| estilos | **10 módulos** por `<script type="module">`, asíncronos | **2 hojas** bloqueantes en el `<head>` |

En el build el CSS entra **antes del primer pintado**, así que el estado de partida de la animación
—las etiquetas apiladas— se ve. En el dev el CSS del componente aterriza **después** de que la
página pintó: la animación corre, pero para entonces el abanico ya se vio desplegado.

> **Una animación de UNA SOLA VEZ no se puede juzgar en el servidor de desarrollo.** Da igual que el
> CSS sea correcto: si llega después del primer pintado, el estado inicial no existió nunca para el
> ojo.

**Y la pista que lo desenredó fue una comparación, no una medición.** En el mismo navegador y el
mismo servidor, el Diario DLPay de `/blog` **sí** se veía girar y el abanico no. La diferencia no
estaba en el CSS de ninguno de los dos: **el diario se repite cada 3 s y el abanico ocurre una vez.**
Una animación en bucle tiene segunda oportunidad y sobrevive a que su CSS llegue tarde; una de un
solo disparo, no.

*La regla de proceso, que es lo reutilizable:* **para escribir código, `npm run dev`; para juzgar un
resultado, `npm run preview` sobre el build.** El dev no aplica la cadena de producción, no exige
`PUBLIC_SITE_URL`, no pasa la guarda de despliegue y no muestra bien nada que ocurra una sola vez.
*Esta vez costó cinco rondas de diagnóstico, dos hipótesis descartadas —WebKit y `prefers-reduced-motion`—
y un commit de corrección que no corregía nada, porque el código ya estaba bien.*

### 4.3 Un SVG escala su texto

Dos piezas se diseñaron en SVG y hubo que rehacerlas: los rótulos del globo y la portada del blog.
Un SVG a `width: 100%` escala **todo** su contenido, así que a 390 px un lienzo de 760 dibuja un
texto de 13 px a unos 6.

**La regla que salió:** si una figura es texto más rectángulos, es HTML. El SVG es para trazos que
una caja no puede hacer.

### 4.4 Los estilos con ámbito no alcanzan al componente hijo

Con `scopedStyleStrategy: 'class'`, una regla escrita en una página **no alcanza** a un elemento que
vive dentro de un componente. Costó dos incidentes antes de quedar escrito.

### 4.5 Medir contra material propio no es medir

La más cara, y la que mejor formuló Cowork después de cometerla cuatro veces: el número del
**estado actual** salía bien porque venía del build, y el del **estado propuesto** salía mal porque
venía de una maqueta, de una lámina o de una copia caducada de los tokens.

> **Medir contra material propio no es medir: es comprobar que uno es consistente consigo mismo.**

De ahí salen las **dieciocho reglas de evidencia** de `cowork/README.md`, que son el subproducto más reutilizable de esta fase.

### 4.6 Una entrega que copia el archivo entero se rompe donde nadie mira  ·  *2026-09-30*

La entrega de la portada de `/preguntas` llegó como una **copia completa** de la página, 650 líneas,
con los cambios dentro. Funcionaba en su maqueta y traía **seis defectos**, todos en lo que la copia
arrastró y no en lo que la copia proponía: una regla de CSS borrada sin reponer —`.inner`, el
contenedor del cuerpo entero—, la ruta de pruebas en el `<Base>`, un comentario que contradecía a su
propio CSS, tres bloques de comentario describiendo la figura retirada y un párrafo que describía la
versión anterior de la propia entrega.

**Ninguno se ve en el resultado renderizado de quien la escribió**, y dos de ellos —la ruta y la
regla borrada— sólo se notan al publicar. Lo que los encuentra es una sola cosa: **leer el diff
contra el archivo vivo, no el archivo entregado.** El `.inner` no aparece como «error»; aparece como
tres líneas eliminadas en un hunk cuyo asunto era otro.

> **Una entrega en forma de archivo completo se integra por su diff, nunca por su contenido.** Y el
> diff hay que leerlo entero, incluidas las líneas que el cambio no pretendía tocar.

*El corolario, que es el que se olvida:* esos defectos **contaminan sus propias medidas**. Sin
`.inner` el texto corre de canto a canto, envuelve menos y la página sale más corta — así que la
cifra de scroll con la que la entrega se defiende se midió sobre una página rota.

### 4.7 Una marca del vocabulario puede quedarse sin nada que describir  ·  *2026-09-30*

El punto lleno neutro —«una pregunta del visitante»— se escribió en el Design System §6.2 **antes**
de dibujarlo, y para eso hizo falta enmendar una regla dura de `CLAUDE.md` §5. Fue el procedimiento
correcto. **Un día después la figura que lo pedía se retiró**, por motivos que no tenían nada que ver
con la marca, y el §6.2 siguió afirmando en su tabla de «lo que las figuras usan hoy» algo que el
build ya no hacía.

> **Escribir una marca antes de dibujarla no cierra el asunto: hay que volver a la tabla el día que
> el dibujo se retira.** Una tabla que dice «lo que se usa hoy» caduca por sustracción, no sólo por
> adición, y nada falla cuando caduca.

La concesión se conserva —la dio el equipo y no se revoca por falta de uso— y lo que se corrige es
la afirmación. Es el mismo modo de fallo que el §4.5, un paso más arriba: **el documento se midió
bien y dejó de ser verdad sin que nadie tocara el documento.**

### 4.8 Un comentario que predice su propio caso se gana su sitio  ·  *2026-09-30*

Las cuatro figuras de puente del sitio son **copias** de la figura de su destino, y cada una lleva
escrito el porqué: *«copiada y no factorizada… si la de destino cambia, el puente se queda como está
hasta que alguien lo mire.»*

El 2026-09-30 `/confianza` cambió de portada y ese día llegó. La entrega que lo proponía afirmaba
**dos veces** que el dato de la figura retirada «queda sin uso»; tenía un segundo consumidor, que era
justo ese puente. **Lo que lo cazó no fue una prueba ni una regla: fue el comentario.**

> **Un comentario que dice «esto se va a romper el día que pase X» vale más que el código que
> describe**, porque el día que pasa X nadie está buscando ese archivo.

*Y el corolario, que es más útil:* cuando una entrega afirma que algo «queda sin uso», eso es una
afirmación comprobable en un `grep` y hay que comprobarla. Las dos veces que ha aparecido esa frase
en una entrega —`phases` acá, y el CSS huérfano de `/precio` el día anterior— **estaba mal**.

### 4.9 Medir en un `iframe` no sirve para una afirmación sub-píxel  ·  *2026-09-30*

Para barrer siete anchuras de golpe, un `iframe` de ancho fijo es cómodo. Pero midiendo así la
costura de la portada de `/confianza` salió **−9 px en las siete**, y no había ningún −9: el
`iframe` se midió **antes de que cargaran las fuentes**, así que el alto del objeto era el de la
fuente de respaldo. Con `document.fonts.ready` bajó a −2/−3, que ya es sólo redondeo sub-píxel del
propio `iframe`. En el viewport real la costura es **0,00**.

> **Un `iframe` sirve para comparar, no para afirmar.** Para un «0 px» hay que redimensionar el
> viewport de verdad. Y en cualquier caso, **esperar las fuentes**: sin eso se mide otra página.

Es la quinta trampa de medición de esta fase y la primera en la que el instrumento inventó un
defecto en vez de esconderlo. Estuvo a punto de costarle a Cowork un hallazgo falso en su contra.

### 4.10 Un comentario mal puesto se presenta como símbolos sin usar  ·  *2026-10-01*

Montando el índice del blog puse un comentario JSX **entre los atributos de un componente**, donde
no cabe. `astro check` devolvió **catorce errores de «declarado y no usado»**: el `<style>`, los
cuatro imports, las dos variables de la desestructuración. Ninguno mencionaba un comentario, porque
desde el punto de vista del compilador el template dejó de existir y por tanto nada de lo de arriba
se usaba.

**Es la tercera vez en esta fase.** Las anteriores fueron un comentario como primer hermano dentro
de una expresión entre paréntesis, dos veces, y el error de entonces fue «Expected `,` or `)` but
found `class`».

> **La forma de un comentario mal puesto es un montón de símbolos que de pronto no se usan.** Cuando
> `check` dice que no se usa el `<style>` de una página, el problema no está en el `<style>`: está
> en que la plantilla no se parsea.

El arreglo también es siempre el mismo: lo que el comentario quería explicar sale a una **constante
del frontmatter**, que es donde un comentario sí cabe, y de paso el atributo queda más corto.

### 4.11 Una máscara de tinta se puede romper de tres maneras, y las tres devuelven un número  ·  *2026-10-02*

Verificando el contraste de las cuatro piezas de `/empresas` monté la medición del proyecto —el
texto pintado de un color testigo para sacar su máscara, y el fondo limpio debajo— y la hice mal
**tres veces seguidas**. Cada versión devolvió una tabla de aspecto impecable:

1. **Umbral de «píxel puro».** Conté como tinta sólo el núcleo del glifo. A 13 px casi no hay
   núcleo, así que **un grupo de color entero desapareció de la tabla sin que nada avisara**: la
   salida tenía cuatro filas donde había cinco colores. Un grupo que falta no se ve; una fila que
   sobra, sí.
2. **Cobertura, con las entradas a medio camino.** Al pasar a medir cobertura —qué fracción del
   píxel cubre el glifo— las dos tomas empezaron a diferir **en toda la caja**, porque entre una y
   otra las entradas M5 seguían animándose. Contrastes de **1,00, 1,04 y 1,07**.
3. **Varios grupos a la vez.** Con un testigo por color en la misma toma, la tinta de un grupo caía
   dentro de la máscara de otro. Más 1,00.

La versión correcta mide **un grupo por vez**, con todo lo demás intacto entre las dos tomas, y con
el movimiento congelado. Entonces dio 4,93 · 4,98 · 8,18 · 14,50 · 16,44, que es exactamente lo que
la entrega declaraba.

> **Un contraste de 1,00 nunca es un hallazgo; es una medición rota.** Eso ya estaba escrito, y hoy
> lo que faltó fue el reverso: **un grupo que no aparece tampoco es un hallazgo.** Un instrumento
> que puede perder una fila entera tiene que decir cuántos píxeles encontró, y el que no encuentra
> ninguno tiene que gritar, no callarse.

**Y una cuarta, del mismo día y de otra clase.** Para contar los enfocables de `main` usé el
selector de siempre —enlaces, botones, campos, `tabindex`— y me dieron **cuatro** donde la entrega
decía ocho. Los otros cuatro son los `<summary>` de la FAQ, que son enfocables y no están en esa
lista. **El número que no cuadra era el mío.**

### 4.12 Un mínimo cabe entre dos anchos de un barrido  ·  *2026-10-02, corregido el mismo día*

**La primera versión de esta sección se equivocó en lo que importaba, y conviene leerla entera.**

Decía: la entrega declaraba «≥ 55 px en escritorio y ≥ 51 en móvil»; barriendo de 320 a 1300 cada
20 px salían **44,81 a 920 y 40,48 a 420**; y concluía que **«nada está roto, el piso del §4.7 son
40 px y los dos lo pasan»**. La lección que sacaba era que un mínimo se barre en vez de tomarse de
una lista de anchos redondos.

**La conclusión era falsa.** Barriendo **cada 1 px**, entre **417 y 419 px** de ancho la frase
quedaba a **37,99 px**: por debajo del piso. Tres anchos, y los tres invisibles para un barrido de
20 px, que salta de 400 a 420. *(Cowork lo situó en 424–426 con 37,88; la ventana se mueve unos
píxeles entre equipos porque depende de dónde parte el último renglón, pero es la misma.)*

**Lo que NO fue la causa, y lo compruebo porque la ficha lo atribuía a eso.** La ficha apunta dos
motivos: la métrica —medir en horizontal y no perpendicular a la recta del corte— y el paso. El
primero explica **su** medición, no la mía: mi script medía perpendicular, y lo verifiqué calculando
las dos variantes a la vez —al segmento del chaflán y a la recta que lo contiene—. **Dan el mismo
número** (37,99 y 37,99), porque el punto proyectado cae dentro del chaflán. Mi único error fue el
paso.

**Y el comentario del componente era medio cierto, que es lo que lo hacía creíble.** Anunciaba «la
frase queda a 40 px de la esquina donde empieza el corte». De la **esquina**, sí. De la **recta**,
que es lo que mide el §4.7, no. En la primera versión lo cité como la prueba de que el componente
tenía razón y la tabla no; en realidad las dos cosas estaban mal, cada una a su manera.

**El arreglo es un valor:** el margen derecho de esa frase en móvil pasa de `--s-4` a `--s-5`, 16 a
24 px. Comprobado cada 1 px de 320 a 899 y de 900 a 1300: **44,63 px en móvil y 44,33 en
escritorio**, sin ningún ancho por debajo del piso, y 64,8 con el espaciado de 1.4.12.

> **Un barrido tiene un paso, y un paso es una apuesta sobre el tamaño del defecto más pequeño.**
> Cada 20 px se ve un defecto de 20 px. Una ventana de 3 px pasa por debajo, y lo que llega al
> registro no es «no lo encontré» sino **«no hay nada»**, que es peor. Donde el valor medido ande
> cerca de un piso, el paso baja a 1 px.

> **Y el corolario, que es el que me costó:** la frase «nada está roto» es una **afirmación**, no la
> ausencia de un hallazgo. Pide la misma prueba que un hallazgo, y la mía no la tenía.

### 4.13 Dos instrumentos que mienten por ser más rápidos  ·  *2026-10-02*

Los dos aparecieron integrando `/confianza`, los dos por haber optimizado el barrido, y los dos
devolvieron números creíbles.

**1 · Un barrido que no recarga mide la página anterior.** Para no abrir un contexto por ancho,
reutilicé la página y sólo cambié el viewport con `setViewportSize`. El desplazamiento lateral salió
en **10 px a 400, 41 px a 440 y 16 px entre 900 y 1020** — un patrón con una pinta estupenda de
hallazgo. Cargando la página **ya a 400 px**, el desplazamiento es **0**. El `scrollWidth` del
documento no se recalcula del todo al redimensionar, así que el barrido estaba informando del ancho
anterior. Lo delató que ningún elemento tenía su borde fuera de la pantalla: **un desplazamiento sin
culpable no es un desplazamiento, es un instrumento.**

**2 · Una captura de 4.000 px no se superpone consigo misma.** La medición de contraste compara dos
tomas del mismo elemento. Tomándolas sobre `#main` entero —3.980 px de alto, 7.962 a 2×— salió un
contraste de **1,01 en el titular de la portada**, que es `--on-tinta` sobre `--tinta`: 14,8 reales.
Las dos capturas se desplazan una respecto de otra lo justo para que la máscara de un sitio se
compare con el fondo de otro. Tomándolas **por sección** —ninguna de más de 1.000 px— el mismo
titular da 14,82.

> **Las dos veces el atajo era el mismo: medir de una pasada lo que estaba hecho para medirse por
> partes.** Y las dos veces el resultado no fue un error visible, sino un número plausible. Un
> instrumento que va más rápido tiene que demostrar que mide lo mismo; si no, lo barato sale caro en
> la ronda siguiente.

*Las dos se detectaron igual: contra una página que no había tocado.* El desplazamiento fantasma
aparecía también en el build anterior; el 1,01 era de un titular que esta entrega no toca. **Cuando
un hallazgo cae en algo que no tocaste, el primer sospechoso es el instrumento.**

### 4.14 Un umbral a 0,02 px de dispararse donde no debe  ·  *2026-10-02*

`FiguraMecanismo` pasó a usarse en dos sitios con láminas de tamaños distintos, y ganó un
`@container (max-width: 277.98px)` que retira los rótulos secundarios. En la Home tiene que
aplicarse; en `/confianza`, **nunca**, y `/confianza` está publicada y revisada.

La lámina más estrecha de `/confianza` mide **280 px de borde a borde** y, como lleva un borde
transparente de 1 px, **278 px de caja de contenido** — que es lo que mide una consulta de
contenedor. Con el umbral en 277,98, el margen es de **0,02 px**. La versión anterior usaba 279,98 y
sí se disparaba: dos figuras de `/confianza` cambiaban a 320 px de pantalla.

Lo verifiqué como se debe, **por identidad de píxel y no por tamaño de caja**: 42 capturas de las
tres figuras de `/confianza` —siete anchos, con y sin el espaciado de 1.4.12— comparadas por hash
contra el build anterior. **42 idénticas, 0 distintas.** Una caja del mismo tamaño con un rótulo
movido dentro daría el mismo número; un hash, no.

> **Está bien hoy y es frágil mañana.** No por el valor, que es correcto, sino por lo que lo
> sostiene: un píxel de borde transparente y el relleno de una sección. Cualquiera de las dos cosas
> que cambie 1 px, y `/confianza` cambia sin que nadie toque `/confianza`. Lo que convierte eso en
> un riesgo manejable no es el número: es que **esté escrito en el componente con su medición**, que
> es donde lo encontrará quien rompa el supuesto.

*Por qué no se cambió a algo menos fino:* el umbral tiene que caer entre 278 (la lámina chica de
`/confianza`) y los 208–290 px que la Home produce entre 760 y 1100, así que los dos rangos se
solapan y **no existe un valor cómodo**. Separarlos de verdad pide un parámetro explícito en vez de
una consulta de contenedor, y eso es rediseñar una pieza ya aprobada. Queda anotado, no hecho.

---

## 5. Errores propios, registrados

Se anotan porque un registro que sólo cuenta aciertos no sirve para nada.

| Qué | Cómo se detectó |
|---|---|
| Los tres ADR del globo se mergearon en estado *Propuesta* | Auditoría externa |
| `CLAUDE.md` afirmaba «0 JS al cliente» con 45 KB en la Home | Auditoría externa |
| `--verde-deep` no cumplía AA sobre `--papel-2`: nueve rótulos por debajo del piso | Cowork, y un noveno lo encontré yo al verificar |
| `.sr-only` definido cuatro veces con **tres** implementaciones, una sin `white-space` | Cowork lo reportó como dos; al abrirlo eran tres |
| La alternancia de superficies de `/empresas` rota al integrar el eje | Cowork, verificando mi integración |
| El bloque `PENDIENTE DE ASSET` del artículo de la Fed revivió en una actualización | Detectado al ir a ejecutarlo |
| El recuento de marcas punteadas del DS §6.2 llevaba un día desfasado: `.et-torsion` entró con el abanico el 2026-10-01 | Al rehacer el barrido para integrar `/empresas` |
| «Nada está roto» en el relevo de `/empresas`: el piso de 40 px SÍ se rompía, a 37,99 entre 417 y 419 px | Cowork, barriendo cada 1 px donde yo barrí cada 20 |
| «Las otras diez rutas» del recuento del §6.2, cuando eran once — y la lista de al lado enumeraba once | Al rehacer el recuento al día siguiente |

El último es el más instructivo: pedía producir un asset que una regla del Design System prohíbe
—escrita a raíz de ese mismo asset— y rellenar un campo que se había eliminado. **Decidir sobre un
mapa viejo** es el modo de fallo que este documento existe para reducir.

---

## 6. Qué queda abierto

**De ingeniería, nada que bloquee publicar.**

| # | Pendiente | De quién |
|---|---|---|
| D3 | Organización GitHub y copia fuera del equipo | Sebastián. **Mayor riesgo operativo** |
| D9, D19, D20 | Razón social, correo oficial, alcance de los T&C | Compliance. **Bloquean los textos legales** |
| D5, D6, D7, D21 | Spread, montos, fuente de precio | DLPay |
| D10, D11 | Cifras, testimonios, equipo con foto | DLPay |
| D1b, D27 | Proveedor de hosting y cabeceras del host | Al elegir proveedor |
| — | Seis claims publicados con marcador de Compliance sin firmar | Compliance |
| — | **84 listas** con `list-style: none` y sin `role` en las diez páginas —**dos de ellas `<ol>`**, donde el orden es el dato. Casi todas vienen de la cabecera y el pie, que están en las diez | Ingeniería, sin urgencia |

**Del artículo de la Fed:** publicado el 2026-09-17, primer contenido real del blog.

---

## 7. Qué sigue

Fase 4 **sigue en curso**: quedan detalles visuales por perfeccionar. No se cierra con este
documento.

Cuando cierre, lo que viene es **Fase 5** —contenido, SEO, compliance y QA— y **Fase 6**, el cutover
controlado a producción, cuyo plan de URLs ya existe en `docs/migracion-urls.md`.

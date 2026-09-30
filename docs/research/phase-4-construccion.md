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

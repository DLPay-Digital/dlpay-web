# Estudio — subir de nivel sin retroceder

**Fecha:** 2026-09-17 · **Autor:** Claude Cowork · **Estado:** Para decisión
**Alcance:** Home, `/como-funciona`, `/confianza`, `/empresas`, más hallazgos transversales.
**Encargo:** mejorar sin tocar identidad (tipografía y colores cerrados) ni rehacer lo construido
—teléfonos, portátil, globo—, con permiso explícito para proponer excepciones al reglamento
siempre que declare la ventaja.

---

## 0. Cómo lo hice

No opiné sobre capturas: **medí sobre el build**. Cada cifra de este documento sale de
`dist/`, servido en un navegador real, a 1280 px salvo donde diga otra cosa. Las herramientas de
crítica de diseño y de auditoría de accesibilidad que instalaste ordenaron el recorrido; los
números son míos.

Lo que **no** hice, porque era el encargo: tocar un solo archivo de `src/`.

---

## 1. Veredicto en una página

**El sitio no tiene un problema de diseño. Tiene un problema de reparto.**

Todo el músculo visual del proyecto está en la Home: el cotizador, el globo, las tres figuras, el
portátil, los cuatro teléfonos. Las páginas interiores heredaron el sistema —tipografía, tokens,
bandas— pero casi ninguna de las piezas. El resultado medido:

| Página | Alto | Pantallas | Palabras | Piezas visuales |
|---|---|---|---|---|
| Home | 7 845 px | 8,7 | 697 | **7** |
| `/empresas` | 4 534 px | 5,0 | 354 | 5 |
| `/confianza` | 3 432 px | 3,8 | 472 | **0** |
| `/como-funciona` | 3 338 px | 3,7 | 471 | **1** |

`/confianza` no tiene ni una sola pieza visual en casi cuatro pantallas: tres iconos de 20 px y
texto. `/como-funciona` tiene una, el diagrama del recorrido del dinero, y mide 328 px en una
página de 3 338 — el propio Motion System la llama «el momento de movimiento del sitio» y está
puesta como una nota al pie.

**Y sobre `/empresas` te corrijo la percepción:** no está peor diseñada que Personas. Está peor
**abastecida**. Sus 354 palabras no son un problema de maquetación: es que las tres cosas que le
darían cuerpo —los tramos del spread (D5), el ejecutivo con nombre y cara (D11) y un cierre que no
sea un WhatsApp en blanco (D22)— están las tres bloqueadas por decisiones abiertas, no por diseño.
Puedo mejorarla, y abajo digo cómo, pero el techo lo pones tú.

---

## 2. Lo que ya está bien y no hay que tocar

Es importante decirlo antes de la lista de problemas, porque el riesgo de «subir de nivel» es
romper lo que funciona.

- **La identidad es propia y se sostiene.** Ninguna página se confunde con otra fintech. El
  registro de mesa de operaciones está conseguido y es el activo más difícil de construir.
- **La sección «Lo que no vas a leer acá» de `/confianza` es lo mejor del sitio.** Una página
  financiera que enumera lo que *no* afirma es raro, valiente y verificable. No la toques: hay que
  darle más presencia, no menos.
- **La accesibilidad estructural está impecable:** un `h1` por página, cero saltos de nivel en la
  jerarquía, los cuatro landmarks, enlace de salto, `alt` en todas las imágenes, 29 de 30 SVG con
  `aria-hidden`. Eso no se improvisa.
- **Cero desborde horizontal** en las cuatro páginas a 1280.
- **Los teléfonos, el portátil y las figuras de `/empresas`** son piezas de autor. El problema no
  es que sobren: es que están todas en dos páginas.

---

## 3. Hallazgos medidos

### 3.1 Accesibilidad — dos cosas reales

**Objetivos táctiles — corregido el 2026-09-17 tras medir a todos los anchos.**
La primera versión de este estudio decía que la cabecera incumplía la regla «en todo el tráfico
móvil». **Es falso y lo medí mal**: sólo había mirado a 1280. A 390 y 760 la navegación vive en el
cajón y esos enlaces no existen. Medido de nuevo a 390, 760, 900 y 1280, lo que queda es:

| Elemento | Alto | Dónde | Veredicto |
|---|---|---|---|
| «Ver el proceso completo» | **17,0 px** | Home, **todos los anchos** | Real. Es un enlace de texto suelto, táctil en móvil |
| Logotipo → inicio | **31,0 px** | cabecera, todos los anchos | Real, aunque el ancho de 88 px lo hace alcanzable |
| «Personas» / «Empresas» / «Iniciar sesión» | 27,3 / 17,0 / 21,7 px | **sólo ≥ 900 px** | Discutible: ahí el puntero es un ratón. WCAG 2.2 AA (2.5.8) pide 24×24 y sólo «Empresas» no llega |
| «Ver más» y «Conoce DLPay Empresas» | 32,0 px | sólo ≥ 900 px | **No es un olvido:** `AnnouncementBar` declara `min-height: 32px` en escritorio a propósito |
| «Saltar al contenido» | 40,8 px | todos | Sólo aparece con foco de teclado; no es objetivo táctil |

Los dos `INPUT` de 1×1 px que aparecían en el barrido son campos ocultos del cotizador. No son un
hallazgo.

**La medida de línea se rompe justo donde el texto más importa.** Design System §3.1 fija
< 65–70 caracteres. Medido carácter a carácter con rangos del DOM:

| Dónde | Caracteres por línea |
|---|---|
| `/como-funciona` › «Desde tu billetera decides…» | **113** |
| `/como-funciona` › «DLPay hace el cambio de divisas…» | **101** |
| Home › respuestas de la FAQ | 82 a **107** |

El bloque de 113 caracteres es el que declara **dónde termina el servicio** — el párrafo que
`CLAUDE.md` §1 convierte en regla dura. Es el peor sitio posible para que la lectura se haga
cuesta arriba.

*Menor:* un `<svg class="wedge">` dentro de `.connector` en `/empresas` no lleva `aria-hidden`.

### 3.2 Sistema — cuatro colores fuera de la paleta

Un barrido de los CSS construidos encuentra **cuatro colores que no existen en `tokens.css`**, y
los cuatro salen del mismo sitio: el globo (`.astro-ue7t4476`).

| Color | Qué es | Dónde |
|---|---|---|
| `#22e88f` (×8) | Un **cuarto verde**, que no es `--verde` ni `--verde-hi` ni `--verde-deep` | halo, brillo y relleno de Chile |
| `#8a7f68` (×3) | Tierra y bordes del mapa | `land-base`, `borders` |
| `#c8bea8` (×2) | Relleno de continentes | `land-base`, rótulos |
| `#0d1a30` (×1) | Una tinta que **no** es `--tinta-2` | contorno de los rótulos |

No es un descuido: es exactamente lo que **ADR-0007** autoriza. El problema es que ese ADR, y los
otros dos del globo, siguen en estado **Propuesta**. Hoy el código va por delante de la decisión, y
mientras eso siga así el sistema de color del sitio tiene cuatro valores que ningún documento
declara.

El resto de literales que aparecen (`#edf2ef1a`, `#16c78429`…) son alfas de tokens existentes: el
propio Design System §2.2 los contempla como separadores decorativos.

---

## 4. El eje que lo ordena todo: «aires de remesas»

Me dijiste: DLPay cambia pesos por dólar digital y lo entrega **en la billetera que el cliente
registró**; desde ahí el cliente decide. Más adelante habrá más, pero hoy es eso.

Ese es, a la vez, el límite legal del §1 y **el mejor argumento comercial que tiene el sitio sin
usar**. Porque la web hoy lo dice como una renuncia —«no depositamos dinero en cuentas bancarias en
el extranjero»— y nunca como lo que es: **DLPay hace el primer tramo entero, el más difícil, el que
en Chile tarda días por banco.**

**La jugada de posicionamiento:** dejar de dibujar el recorrido completo del dinero en el mundo y
empezar a dibujar **el tramo que sí hacemos**, marcado, con su final explícito y con lo que viene
después dicho por su nombre. Eso da imagen de remesas —movimiento, países, velocidad, una persona
que cierra— **y refuerza** la regla dura en vez de bordearla.

### Dónde está exactamente la línea

| Sí se puede comunicar | Nunca |
|---|---|
| El valor sale de Chile en minutos | Que el destinatario recibe moneda local |
| El par CLP → USD y el precio referencial | Un corredor país→país con importe de llegada |
| «Llega a tu billetera» | «Llega a su cuenta» / logos de bancos de destino |
| Una persona cierra la operación | Tiempos de acreditación en destino |
| Lo que el cliente puede hacer **después**, descrito como suyo | Sugerir que ese después lo hace DLPay |

Con esa tabla, la estética de remesas es perfectamente alcanzable sin tocar el §1. Lo que la rompe
no es el lenguaje de envío: son las banderas de destino y las cifras de llegada.

---

## 5. Las jugadas

Ordenadas por relación entre lo que ganan y lo que cuestan. Ninguna cambia tipografía ni colores.

### Nivel 1 · Alto impacto, coste bajo, cero excepciones

**J1 · `/confianza` deja de afirmar y empieza a mostrar.**
La página se llama «Confianza que se comprueba» y no hay nada que comprobar: son tres afirmaciones
en prosa. Jugada: dibujar **dónde está tu plata en cada momento** —tú → tu banco → la cuenta de
DLPay en BCI → tu billetera—, con el banco como pieza central y el tramo de DLPay marcado. Y subir
los emblemas de **UAF y FinteChile del pie a la página**: hoy la única prueba institucional del
sitio vive en el sótano de todas las páginas, donde nadie la busca, y `/confianza` es literalmente
la página donde alguien va a buscarla.
*Gana:* convierte la página más honesta del sitio en la más creíble. *Cuesta:* una figura nueva y
mover dos emblemas. *Excepción:* ninguna.

**J2 · El diagrama de `/como-funciona` pasa de nota al pie a protagonista.**
Hoy mide 328 px de 3 338. Jugada: banda propia, al triple de escala, con los seis pasos anclados a
él en vez de flotando en una lista de dos columnas.
*Gana:* la página del proceso por fin **muestra** el proceso. *Cuesta:* recomposición, cero
componentes nuevos. *Excepción:* ninguna.

**J3 · Los teléfonos bajan a `/como-funciona`.**
La Home enseña la conversación real en cuatro teléfonos. La página dedicada al proceso no enseña
ninguno. `WhatsAppMockup` ya tiene la variante `bare` y está en uso.
*Gana:* coherencia y densidad donde más falta. *Cuesta:* reutilizar un componente existente.
*Excepción:* ninguna.

**J4 · Arreglar la medida de línea y los objetivos táctiles.**
Los dos hallazgos del §3.1. Son reglas del propio sistema que hoy no se cumplen.
*Gana:* legibilidad en el párrafo más importante del sitio y una cabecera usable con el pulgar.
*Cuesta:* un `max-width` por bloque y un `min-height` en la nav. *Excepción:* ninguna.

### Nivel 2 · El salto de verdad

**J5 · La banda del globo se convierte en «el tramo que sí hacemos».**
Es la pieza de peor densidad del sitio: **1 060 px —el 13 % de la Home— para un titular, dos líneas
y dos botones**. Y es, además, la que ya tiene aire de remesas. Jugada: que esa banda deje de decir
una frase genérica y pase a dibujar el tramo —origen, conversión, entrega en tu billetera, y el
punto donde termina lo nuestro— con el globo haciendo de escenario en vez de de adorno.
*Gana:* el posicionamiento del §4 en el sitio más visible del sitio, y 1 060 px que hoy no
trabajan. *Cuesta:* rehacer la banda. *Excepción:* ninguna nueva —el globo ya está—, pero obliga a
cerrar los tres ADR (ver J8).

**J6 · Un cierre honesto del recorrido, en la Home y en `/como-funciona`.**
Hoy el límite del servicio se declara en un bloque de texto al final de `/como-funciona`. Jugada:
convertirlo en la última pieza del recorrido dibujado — «hasta acá llegamos nosotros; desde acá
decides tú», con lo que el cliente puede hacer después descrito como suyo.
*Gana:* es la diferencia entre una letra chica y un argumento. *Cuesta:* una figura.
*Excepción:* ninguna. Al contrario: refuerza el §1.

**J7 · `/empresas`: FAQ propia y proceso de incorporación dibujado.**
Lo que se puede hacer sin desbloquear nada. Las cuatro objeciones reales de una empresa —quién me
atiende, qué documentos, desde qué volumen conviene, qué pasa si mi proveedor sólo recibe por
banco— no están respondidas en ninguna parte, y la última ya está contestada a medias en el texto
de un caso de uso. Y los cuatro pasos de incorporación son hoy 442 px de texto plano.
*Gana:* sube la página de 354 a ~600 palabras con contenido que ya existe disperso.
*Cuesta:* contenido nuevo, que requiere tu visto bueno, no el de Compliance.
*Excepción:* ninguna.

### Nivel 3 · Requiere que decidas tú

**J8 · Cerrar el globo.** Los tres ADR (0007, 0008, 0009) llevan en Propuesta desde el 11 de
septiembre, con dos reglas duras del §7 en suspenso —«única isla interactiva» y «cero JS al
cliente»— y cuatro colores fuera de `tokens.css`. No es trabajo de diseño: es una decisión tuya.
Mientras siga abierta, cualquier pieza nueva que quiera JavaScript no tiene contra qué compararse.

**J9 · Lo que desbloquearía de verdad `/empresas` y `/confianza`.** Las dejo nombradas porque hoy
dijiste «ninguna por ahora» y quiero que la lista esté escrita cuando cambies de opinión:

| Decisión | Qué desbloquea | Tamaño del salto |
|---|---|---|
| **D11** · equipo con nombre y foto | `/confianza` dice «una persona identificable cierra tu operación» y no muestra a nadie | El mayor de todos, y sólo depende de ti |
| **D5** · tramos del spread | El argumento del volumen en `/empresas` y la tabla de `/tarifas` | Grande |
| **D22** · mensaje prellenado | Cinco enlaces que abren WhatsApp en blanco, uno de ellos el cierre de `/empresas` | Pequeño y barato |
| **D6/D21** · mínimo y máximo reales | El cotizador deja de hablar en hipotético | Medio |

---

## 6. Las dos excepciones que sí pediría, y por qué

Me diste permiso para proponerlas declarando la ventaja. Sólo hay dos que me parecen defendibles.

**E1 · Una pieza con JavaScript en `/confianza`: el recorrido del dinero, recorrible.**
El diagrama de J1 gana mucho si se puede avanzar paso a paso en vez de verlo entero — porque la
confianza se construye siguiendo el dinero, no mirándolo. Coste estimado: 1 a 1,5 KB, del orden del
Motion System (489 B), muy por debajo del globo (40,5 KB).
*Ventaja:* es la única página del sitio cuyo argumento **es** una secuencia, y hoy se entrega como
un párrafo. *Contra:* rompe el «cero JS» en una quinta página. *Mi recomendación:* proponerla sólo
si la versión estática, que va primero, se queda corta al verla. **No la pido todavía.**

**E2 · Subir los emblemas institucionales del pie a `/confianza`.**
No es una excepción técnica sino de criterio: hoy `alliances.ts` fija que el alcance del claim se
declara junto al emblema, y el pie lo hace bien. Subirlos a la página obliga a repetir esa frase
—«registrada y supervisada», nunca «autorizada» ni «avalada»— en un sitio más visible.
*Ventaja:* la prueba institucional deja de estar enterrada. *Contra:* más visibilidad de un claim
sensible. *Mi recomendación:* hacerlo, con la frase completa y sin reformularla ni una palabra.

---

## 7. Lo que NO recomiendo

- **Fotografía de stock**, en ninguna página. Ya está razonado en
  `cowork/2026-09-16-blog-portada-de-dato/ficha.md` §2.
- **Banderas de países de destino, corredores o importes de llegada.** Es la estética de remesas
  que rompe el §1, y es justo la que más se parece a la competencia.
- **Un contador de operaciones, volumen o clientes.** Bloqueado por D10 y, además, es la clase de
  cifra que este sitio decidió no publicar sin respaldo. Su ausencia es parte del argumento.
- **Tailwind, shadcn o cualquier framework de UI**, que es lo que traen dos de las skills nuevas.
  ADR-0002 §3 y ADR-0004 lo cierran, y el sitio no tiene ningún problema que eso resuelva.
- **Modo oscuro con interruptor.** ADR-0004 §4. El sitio ya alterna superficies por sección.
- **Rehacer el cotizador, los teléfonos, el portátil o las figuras nuevas.** Funcionan.

---

## 8. Orden propuesto

1. **J4** — accesibilidad y medida de línea. Es deuda contra el propio sistema y se paga en una
   tarde.
2. **J1 + J2 + J3** — las dos páginas vacías. Es el 80 % de lo que percibiste, y no necesita
   desbloquear nada.
3. **J5 + J6** — el eje de remesas, en la Home y en el recorrido. Es el salto de nivel de verdad.
4. **J7** — `/empresas` con lo que se puede hoy.
5. **J8** — cerrar el globo. Puede ir en paralelo; no depende de mí.

Cada jugada sale como su propia entrega en `cowork/`, con maqueta medida sobre el build y ficha,
como las cinco anteriores. Dime por cuál partimos.

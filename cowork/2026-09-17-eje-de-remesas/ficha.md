# Ficha — J5 + J6: el eje de remesas

**Entrega:** `2026-09-17-eje-de-remesas` · **Autor:** Claude Cowork · **Estado:** En revisión
**Vista:** `index.html` (tres secciones: Home, `/como-funciona`, `/empresas`)
**Capturas:** `banda-home-1280.png`, `banda-home-390.png`, `cierre-como-funciona-1280.png`,
`empresas-1280.png`, `vista-1280.png`, `vista-390.png`
**Auditada** con `design:accessibility-review` (WCAG 2.1 AA) — §8.
**Origen:** jugadas J5 y J6 del estudio `2026-09-17-estudio-nivel-2`, aprobadas por Sebastián.
**El globo no se toca.** Ni una línea de `GloboRotativo.astro`. La pieza lo rodea; no lo modifica.

---

## 1. Lo que fui a comprobar, y lo que encontré en vez de eso

Iba a escribir que la Home nunca declara dónde termina el servicio. **Es falso y lo comprobé antes
de escribirlo**: la frase «No depositamos en cuentas bancarias en el extranjero» sí está en la Home.
Lo que encontré al medir dónde está es otra cosa, y es peor de explicar en una frase pero más real.

| | Dónde | Tamaño | Estado |
|---|---|---|---|
| La afirmación más fuerte | la banda del globo, **1.060 px** (13,4 % de la Home) | ocho arcos saliendo de Chile, rotulados `USD · 8.300 KM` | visible, en movimiento |
| El límite | nota del cotizador, a **323 px por encima** de la banda | **13 px** de texto | visible pero desligado |
| El límite, dicho por su nombre | FAQ «¿DLPay deposita el dinero en una cuenta bancaria en el extranjero?» | al **89 %** de la página | **plegado** |

La regla de contenido de `CLAUDE.md` §1 no dice «prohibido afirmar»: dice **«prohibido afirmar o
sugerir»** que DLPay deposita en una cuenta bancaria en el extranjero. Un planeta con ocho arcos
que salen de Chile, bajo el titular «Tu dinero, listo para moverse donde y cuando quieras», y sin
una palabra cerca que diga dónde acaba lo nuestro, **sugiere**. No porque el globo mienta —su
descripción accesible es cuidadosa y dice «países señalados»— sino porque **la página no le da al
lector con qué desambiguarlo**.

Y hay una ironía útil: la bajada de la propia banda ya tiene el encuadre correcto —«Recibes dólar
digital en tu billetera y **desde ahí** lo mueves»— pero está 300 px más arriba que el globo, con
dos botones en medio, centrada, y se lee como una promesa de beneficio en vez de como la leyenda de
la imagen.

**J5, entonces, no es un problema de densidad. Es que el dibujo y el texto de la banda hablan de
cosas distintas, y el dibujo es el que hace la afirmación más grande.**

## 2. Los dos botones se van, y se ganan solos el argumento

| Botón | Enlace | Dónde está el mismo enlace |
|---|---|---|
| «Crea tu cuenta» (16,6 %) | `dlpay.cl/auth/register` | **el mismo enlace al 10,3 %**, ~500 px más arriba |
| «Cotiza tu operación» (16,6 %) | `/#cotizador` | manda **hacia arriba**, al cotizador que el usuario acaba de ver |

Uno es un duplicado y el otro devuelve al punto de partida. Retirarlos no es una concesión para que
quepa la figura: es corregir dos enlaces que no aportan. Y de paso libera los ~200 px muertos entre
los botones y el globo.

## 3. La pieza: una sola línea que se interrumpe

Un eje horizontal. A la izquierda, en `--verde-deep`, **el tramo de DLPay**, con tres nodos. En la
costura, **una cuña**. A partir de ahí la línea sigue en `--ink-mute`: existe, es real y **no es
nuestra**. Debajo, a lo ancho, el globo — que deja de ser adorno y pasa a ser *lo que hay al otro
lado de la costura*.

```
●────────────●────────────●───────⌁────────────────────────────
Tus pesos     Cambiamos     Dólar digital   │ Ahí termina nuestra operación:
en tu banco   y verificamos en tu billetera │ desde ese punto decides tú
CLP           una persona   USD · ~5 min    │ — Lo mantienes
              cierra        desde el pago   │ — Se lo envías a otra persona
                                            │ — Lo conviertes a moneda local en destino
                        ( el globo, entero y sin tocar )
```

**Una sola cuña, y va en la costura.** Dentro de nuestro tramo no cambia nada de manos, así que una
cuña entre los nodos 1-2-3 mentiría. Es la misma regla que apliqué en `/como-funciona`: la cuña
marca **el momento en que el trabajo cambia de manos**, y aquí eso ocurre exactamente una vez.
*(La primera versión de esta maqueta las tenía entre los tres nodos. Estaba mal y la rehice.)*

**Sobre una línea horizontal la cuña es colineal con ella**, así que la línea no se corta: se le
hace una punta justo donde deja de ser nuestra. Medido: desvío **0,0 px** respecto de la costura a
1280 y a 900, y centrada sobre la regla vertical a 390.

**En móvil el eje se pone de pie**: la línea pasa a borde izquierdo, verde arriba con los tres
nodos, la cuña girada 90° en la costura, gris abajo. Mismo contenido, mismo orden.

## 4. La copia no es nueva: es la del proyecto, puesta donde hace falta

| Texto | De dónde sale |
|---|---|
| «Ahí termina nuestra operación: desde ese punto decides tú» | `src/content/process.ts`, paso 06, **literal** |
| «Lo mantienes / se lo envías a otra persona / lo conviertes a moneda local en destino» | bloque `.scope` de `/como-funciona`, **literal** |
| «Ese último paso es un proceso distinto, con otros servicios, y no lo realiza DLPay» | ídem, **literal** |
| «una persona cierra» | `CLAUDE.md` §1, «con una persona que cierra la operación» |
| «~5 min desde el pago» | `process.ts`, tiempo del paso 06 |
| «No depositamos dinero en cuentas bancarias en el extranjero» | nota del cotizador y bloque `.scope`, **literal** |
| «Si tu proveedor sólo recibe por banco, conversémoslo antes» | `src/content/business.ts`, cuerpo del caso «Pagos a proveedores en el exterior», **literal** |

**Sólo hay tres frases nuevas**, todas de rótulo y ninguna con dato ni promesa:

1. `h2` de la Home: **«Nuestro tramo termina en tu billetera»** — sustituye a «Tu dinero, listo para
   moverse donde y cuando quieras», que es la frase genérica que J5 quería retirar. Si prefieres
   conservar la actual, la pieza funciona igual: el titular no es la figura.
2. `h2` de `/empresas`: «Hasta dónde llega nuestra parte».
3. Los tres rótulos de nodo («Tus pesos, en tu banco en Chile», «Cambiamos y verificamos», «Dólar
   digital en tu billetera»), que son descripciones, no afirmaciones nuevas.

## 5. J6 · el cierre de `/como-funciona`

El bloque «Dónde termina nuestra operación» deja de ser una caja de texto con borde de aviso y pasa
a ser **la mitad derecha del mismo eje**: la línea gris, la cuña en su arranque, la bisagra y las
tres opciones en tres columnas. No es una figura nueva — es la misma gramática, de modo que el
carril de los seis pasos y el cierre se leen como **un solo recorrido** en vez de como una lista y
una advertencia.

**Se retira el `border-left: 2px solid var(--aviso-deep)`, y digo el coste:** ese borde era la señal
de importancia del bloque. A cambio, el límite pasa de ser un párrafo con marco a ser **la bisagra
de la figura de la página**, que es más prominente, no menos. Si el agente o tú creen que se pierde
peso, el borde puede conservarse; no rompe nada.

**Lo que no cambia:** el paso 06 del carril ya dice la frase, así que el cierre la **repite a
propósito** — una vez dentro del recorrido y otra como conclusión. Es el mismo texto, no dos
versiones que puedan desincronizarse.

## 6. `/empresas` · la variante, y un hallazgo propio

**`/empresas` nunca declara el límite de forma explícita.** Medido sobre el build: «no
depositamos», «cuenta bancaria», «moneda local» y «billetera» **no aparecen** en la página. Y es la
página cuyo lector —una empresa que paga a un proveedor en el exterior— es el más propenso a dar por
hecho que hay una transferencia bancaria de por medio.

> **Esta frase decía «no declara el límite en ninguna parte», y era pasarse de rosca.** El agente lo
> marcó y tiene razón: la página **no está muda**. «Si tu proveedor sólo recibe por banco,
> conversémoslo antes» es una salvedad real, aunque indirecta, y «sin abrir una cuenta en el
> extranjero» aparece en el caso de tesorería. Lo llamativo es que **la refutación estaba en el
> párrafo siguiente de esta misma sección**, donde yo citaba esa frase como copia existente. Escribí
> la afirmación y su desmentido con cuatro líneas de distancia y no lo vi. Lo exacto —que nunca lo
> dice de forma explícita— basta de sobra para justificar la pieza; la versión exagerada no hacía
> falta.

La frase que lo corrige **ya existe en el proyecto**: está en `business.ts`, dentro del cuerpo del
primer caso de uso — *«Si tu proveedor sólo recibe por banco, conversémoslo antes.»* La variante la
saca de ahí y la pone en la costura, que es donde se lee.

El eje cambia sólo de vocabulario: «Los pesos de tu empresa» · «tu ejecutivo cierra» · «Dólar
digital en la billetera que indiques», y las tres opciones salen de los cuatro casos de uso
(pagar a un proveedor, tesorería, volver a pesos).

**El globo en `/empresas`:** Sebastián dijo que se puede poner. La maqueta deja el hueco marcado
como **opcional** y no lo decide: es reutilización de un componente existente, no diseño nuevo, y
conviene decidirla mirando la página entera.

## 7. Evidencia medida

Sobre `index.html` en Chromium, `device_scale_factor` 2, contra **`tokens.css` re-sincronizado**
(ver §9, la copia que tenía era de dos días antes y devolvía el verde antiguo).

| | 390 | 760 | 900 | 1280 |
|---|---|---|---|---|
| Desborde horizontal | 0 | 0 | 0 | 0 |
| Eje | vertical | vertical | horizontal | horizontal |
| Cuñas | 1 por sección | 1 | 1 | 1 |
| Desvío de la cuña respecto de la costura | 1 px (borde de 1 px) | — | **0,0 px** | **0,0 px** |
| Orden del DOM = orden visual | sí | sí | sí | sí |
| Texto al 200 % | sin desborde, sin cortes | | | |

**Contraste** — barrido de **todos** los nodos de texto de las tres secciones, componiendo el fondo
efectivo por ancestros; no filtrado por color:

| | Resultado |
|---|---|
| Nodos de texto evaluados | **40** por ancho, en los cuatro anchos |
| Ratio mínimo | **4,98:1** (piso 4,5) |
| Incumplimientos | **0** |

Gráficos (piso 3:1 de WCAG 1.4.11): línea verde y cuña y nodos **5,44:1**, línea gris **5,50:1**.

**Alto de la banda:** medido sobre el build integrado (`f99a49b`), **1.060 → 1.247 px** a 1280 y
**803 → 1.186 px** a 390. La banda **engorda 187 px en escritorio y 383 en móvil**.

> **CORREGIDO DESPUÉS DE INTEGRAR, y es el tercer error del mismo tipo.** Esta línea decía
> «1.060 → 941 px (−119)». Lo cazó el agente de Claude Code. La maqueta tiene un `.globo-hueco` de
> andamio donde el sitio tiene el globo de verdad, que es **514 px** de alto a 1280 y bastante más
> alto que mi marcador. **Medí la geometría de una página contra un relleno.** Un andamio no es una
> aproximación del objeto: es una dependencia que miente sobre el tamaño.
>
> **Esto tumba la premisa de densidad de J5** —«1.060 px que hoy no trabajan»— y hay que decirlo
> así. La jugada entra igual, pero por las otras dos razones, que no dependen del alto:
>
> 1. El dibujo y el texto de la banda hablaban de cosas distintas, y el dibujo hacía la afirmación
>    más grande (§1). Éste es el argumento de peso y es independiente de cuántos píxeles mida.
> 2. Los dos botones eran un duplicado y un enlace hacia atrás (§2). Se van por no aportar.
>
> **Si alguien defiende esta jugada citando densidad, estará citando un número que no es.** Anotado
> también en el estudio, que es donde nació la premisa.

## 8. Auditoría WCAG 2.1 AA

| Criterio | Comprobación | Resultado |
|---|---|---|
| 1.4.3 Contraste de texto | 40 nodos × 4 anchos | mínimo 4,98 · **0 fallos** |
| 1.4.11 Contraste no textual | líneas, cuña y nodos | 5,44 y 5,50 · piso 3 |
| 1.3.1 Info y relaciones | 5 listas con `list-style:none` | **todas con `role="list"`** desde el principio |
| 1.3.2 Orden significativo | DOM vs. visual, en dos columnas | coinciden en los cuatro anchos |
| 1.1.1 Contenido no textual | las 3 cuñas | `aria-hidden="true"`; el dato va en el texto de la bisagra |
| 1.4.4 / 1.4.10 Texto y reflujo | 640 y 195 px (200 %) | desborde 0, **0 textos cortados** |
| 2.1.1 / 2.4.7 Teclado y foco | elementos interactivos en la pieza | **cero** |
| 2.3.3 Movimiento | sin JS y con `prefers-reduced-motion` | cuñas completas e inmóviles |
| 3.1.1 Idioma | `<html lang>` | `es-CL` |

**Nada que ocultar visualmente aquí:** a diferencia de `/como-funciona`, esta pieza no transmite
nada sólo con la posición. Izquierda/derecha refuerzan lo que la bisagra dice con palabras, así que
no hace falta ninguna etiqueta `sr-only`. La regla 6 del README se cumple sin trabajo extra.

**M3:** las tres cuñas llevan `data-draw`. Se dibujan al entrar en pantalla, cada una en su
sección. Sin JavaScript nuevo.

## 9. Un error propio, atrapado a tiempo

La primera tanda de mediciones daba **4,90:1** para el verde sobre papel. Con `--verde-deep`
`#0A7250` debía dar **5,44**. Miré por qué en vez de anotarlo: la copia de `src/styles/tokens.css`
que tenía en el entorno de medición era **del 15 de septiembre**, anterior al commit `b11450f`. La
maqueta enlaza ese archivo, así que **todo lo que había medido iba contra un token que ya no
existe**.

Re-sincronizada, los números pasan a 5,44 y todo sigue cumpliendo — el resultado no cambia, pero la
evidencia sí. Regla nueva para el README: **las dependencias de la maqueta también caducan**; se
re-sincronizan antes de medir y se comprueba un valor conocido para saber que la copia es la buena.

Y un segundo, del mismo día: un `str.replace` de CSS falló en silencio porque **no le puse
`assert`**, y estuve mirando una variante sin estilos creyendo que era un problema de diseño. Es
exactamente el descuido del bug de las cuñas de la entrega anterior. Toda sustitución lleva
`assert` ahora.

## 10. Lo que descarté

**Partir el globo en dos columnas para poner el eje al lado.** Habría encogido el globo, y la
instrucción es que se queda como está. El eje va encima, a lo ancho, y el globo entero debajo: el
orden vertical hace el trabajo sin tocar el componente.

**Un eje de dos segmentos sin nodos.** Lo consideré para evitar cualquier parecido con la figura de
`/confianza`, y lo descarté: la Home gana más contando los tres hitos. **Digo el riesgo igual**, y
que lo revise el agente: esta figura comparte dos nodos con la de `/confianza` («en tu banco», «en
tu billetera»). Mi juicio es que no colisionan porque responden preguntas distintas —`/confianza`
responde *quién tiene mi dinero en cada momento* y ésta *hasta dónde llega el servicio*— y porque
esta figura **empieza donde la otra termina**. Pero es un juicio, no una medición.

**Poner un aviso junto al globo.** Un disclaimer al lado de una imagen la contradice; una leyenda
la explica. El eje es la leyenda.

**Tocar el texto del globo o sus rótulos `USD · 8.300 KM`.** Ni una línea.

## 11. Tokens y código

24 tokens, todos existentes, ningún literal de color. Sin radios, sin `--elev-card`, sin sombras.
El código candidato es `index.html`; `.board`, `.scaffold` y `.globo-hueco` son andamio y no viajan.

## 12. Para el agente

1. Son **tres piezas independientes**: Home (J5), cierre de `/como-funciona` (J6) y `/empresas`.
   Pueden ir en tres commits o en uno; no dependen entre sí salvo por compartir el CSS del eje.
2. Si las tres viajan, **el CSS del eje debería ser un componente** y no tres copias. No lo propongo
   como componente porque la decisión de dónde vive es tuya.
3. El `h2` de la Home es la única frase que sustituye a otra existente. Si Sebastián prefiere
   conservar la actual, no cambies nada más.
4. El borde `--aviso-deep` del bloque `.scope` se retira en la propuesta; §5 explica el coste y por
   qué es reversible.
5. Verifica por tu cuenta que `/empresas` no declara el límite. Yo lo medí buscando «no
   depositamos», «cuenta bancaria», «moneda local» y «billetera» en el `main` del build.
6. `GloboRotativo.astro` **no se toca**. Si algo de la integración te obliga a tocarlo, para y
   dilo: es instrucción de Sebastián, no preferencia mía.

---

## 13. Post-integración (2026-09-17, commit `f99a49b`)

Integrada **con cambios**, y los cambios son mejoras. Verifiqué el resultado sobre el build.

### 13.1 Lo que el agente cambió, y por qué tiene razón

**El eje sale como componente** (`EjeDeAlcance.astro` + `content/scope.ts`). Yo dejé la decisión
abierta «porque dónde vive es tuyo». Su argumento es mejor que mi indecisión: **no es ahorro de CSS,
es que la figura hace una afirmación de compliance.** Tres copias de un botón son fealdad; tres
copias de esto serían tres versiones de hasta dónde llega el servicio, y la regla dura de
`CLAUDE.md` §1 dejaría de tener una sola fuente. Debí proponerlo yo.

**`.suyo.solo .salvedad` bajó de 66ch a 47ch.** Y esto es directamente un descuido mío: **escribí
`66ch` dos días después de cerrar el lote B de J4, que consistía exactamente en cambiar un `66ch`
por `47ch` en `/como-funciona`.** Son ~91 caracteres reales. Corregir la regla y volver a cometerla
en la entrega siguiente es peor que no haberla encontrado nunca.

### 13.2 Sus tres respuestas

1. **`/empresas`**: confirmado con matiz; ver §6, ya corregido.
2. **Colisión con `/confianza`**: coincide en que no la hay, y añade el argumento que a mí me
   faltaba. Yo lo defendí por las preguntas que responde cada figura. Él lo cierra por el **color**:
   *el verde significa lo mismo en las dos — el tramo que es nuestro*. Compartir «banco» y
   «billetera» como extremos no es repetir; es que una empieza donde la otra termina. Si el verde
   significara cosas distintas en cada figura, **ahí** sí habría problema. Ése es el criterio bueno
   y me lo apunto para las próximas.
3. **Componente**: ver 13.1.

### 13.3 Verificación independiente sobre el build

Barrido completo de contraste, todos los nodos de texto, fondo efectivo compuesto por ancestros, sin
filtrar por color:

| Página | 1280 | 390 | Ratio mínimo | Incumplimientos |
|---|---|---|---|---|
| `/` | 150 nodos | 153 | 4,93 | 0 |
| `/como-funciona` | 76 | 83 | 4,93 | 0 |
| `/empresas` | 101 | 104 | 4,98 | 0 |
| `/confianza` | 72 | 75 | 4,98 | 0 |

**814 nodos, cero incumplimientos.** Los dos botones de la banda ya no existen. `GloboRotativo.astro`
sin tocar. Y en producción la figura hace lo que tenía que hacer: el globo deja de leerse como la
red de entrega de DLPay y pasa a leerse como **lo que hay al otro lado de la costura**.

### 13.4 Tres errores míos en dos entregas, y todos son el mismo

| # | Qué medí | Contra qué | Consecuencia |
|---|---|---|---|
| 1 | `--verde-deep` sobre el chip | una lámina con el fondo escrito a mano, y con el color equivocado | 4,59 en vez de 4,35 |
| 2 | el verde sobre papel | una copia de `tokens.css` de dos días antes | 4,90 en vez de 5,44 |
| 3 | el alto de la banda | un `.globo-hueco` de andamio en lugar del globo | −119 px en vez de **+187** |

El patrón es uno solo: **cuando mido contra algo que construí yo, me equivoco; cuando mido contra el
build, acierto.** Las tres veces el número del estado actual estaba bien y el del estado propuesto
mal, por la misma razón. La regla que faltaba está ahora en el README como la 14.

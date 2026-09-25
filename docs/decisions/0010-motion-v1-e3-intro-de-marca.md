# ADR-0010 — Enmienda Motion System V1: tercera excepción, la intro de marca

- **Estado:** Aceptada — 2026-09-25
- **Decide:** Sebastián Villanueva (maqueta y medición de Claude Cowork; análisis e integración de
  Claude Code, Fase 4)
- **Ámbito:** `src/components/IntroDeMarca.astro` y el marcador de visita de `src/layouts/Base.astro`.
  Enmienda el Motion System V1; **no toca los seis movimientos ni el techo de 280 ms fuera de esta
  pieza**.
- **Identificador:** `motion-v1-e3`
- **Referencia:** `docs/design-system/motion-system-v1.md` §2c y §4
- **Precedentes:** ADR-0006 — franja de notificación (2026-09-08) · ADR-0008 — globo rotativo
  (2026-09-15)
- **Entrega que la origina:** `cowork/2026-09-25-intro-de-marca` (ficha `04e5c6f5…`, bloque
  `7a51e0fd…`)

## Contexto

Hoy el sitio no tiene **ningún** momento que presente la marca antes del contenido. El isotipo
aparece a 24 px en la cabecera y nada más; quien llega por primera vez recibe el cotizador y el
titular, que es exactamente lo que §6 del `CLAUDE.md` pide —«cotizar es el centro»— pero deja a la
marca sin un instante propio.

La pieza que resuelve eso es un telón de 830 ms sobre `--tinta` en el que **el isotipo se separa
por su propio eje —33,954°, el corte diagonal del que sale todo el sistema geométrico de
ADR-0001— y se vuelve a unir**, con un destello que lo barre por esa misma diagonal. No es una
pantalla de carga: no hay barra, no hay spinner, no hay texto, y la página está construida y
funcionando debajo desde el primer fotograma.

Las dos piezas del logo **no se inventaron**: el atributo `d` de `Logo.astro` es un único `path`
con `fill-rule="evenodd"` que ya contiene dos subtrazos —el cuerpo con el corte diagonal y la cola
en punta—. Se verificó byte a byte que las constantes de la intro son ese mismo `d` partido por la
segunda `M`, sin redibujar ni redondear.

Tres reglas escritas entran en conflicto, y sólo dos necesitan decisión:

| Regla | ¿Choca? |
|---|---|
| §2c — techo de **280 ms** por movimiento | **Sí.** La pieza dura 830 ms |
| §4, regla dura **2** — «el cotizador no entra» | **Sí.** El telón lo tapa 937 ms |
| §4, regla dura **5** — sin JavaScript, todo se ve | **No.** Se cumple por construcción (ver abajo) |

## Decisión

Se autoriza una **tercera excepción** al Motion System V1, acotada a esta pieza y con los
guardarrieles de más abajo.

### Sobre la regla dura 2, que es la que de verdad se enmienda

La regla protege dos cosas distintas, y conviene separarlas porque **sólo una está en juego**:

1. **Que el cotizador no tenga entrada propia.** Se cumple entero, y está medido: la tarjeta está
   renderizada y operativa bajo el telón desde el primer fotograma. La altura de la Home es
   **8.102 px con intro y 8.102 px sin ella**, los elementos ocultos tras una pasada de scroll son
   **25 de 419 en los dos casos**, y el cotizador devuelve **1.087,31 para 1.000.000** igual con
   intro, sin ella y con `prefers-reduced-motion`. El telón cuesta **visibilidad, no
   disponibilidad**, y esa distinción es la que hace que esta excepción se pueda escribir sin
   trampa.

2. **Que nada se interponga entre quien llega y el instrumento.** Esto sí se rompe: 937 ms, una
   vez por sesión, y sólo entrando por la Home.

**Sebastián lo resolvió el 2026-09-25**, al revisar las dos lecturas: «como es un telón que en
duración es la nada misma, entonces no importa que esté sobre el cotizador unos milisegundos».

La ventaja que compra ese tiempo —y la instrucción permanente 4 obliga a escribirla— es que la
marca pasa a tener un momento propio, construido con su propia geometría y no con un adorno
prestado. El coste honesto, escrito aquí para que no se pierda: durante esos ~0,9 s el visitante
**no puede desplazar la página**, y en un aparato lento son 1,29 s.

### Guardarrieles duros

1. **Dónde.** Sólo en la Home. Ninguna otra página monta la intro.
2. **Cuándo.** Una vez por inicio de sesión de pestaña, y **sólo si la Home fue la puerta de
   entrada**. Lo deciden dos comprobaciones en este orden: el marcador `window.__dlpayInicio`, y un
   respaldo que descarta la visita si `document.referrer` es de nuestro propio origen.
3. **Duración.** 830 ms de animación; 937 ms de bloqueo de scroll en condiciones normales, 1.289 a
   ×4. La red de seguridad corta en **2.500 ms desde el arranque de la navegación**, pase lo que
   pase. Son un **techo, no un objetivo**: una versión futura puede acortar, nunca alargar.
4. **Qué se anima.** Sólo `transform` y `opacity`. Medido: media de 24,0 ms por fotograma a 1× y
   24,2 a ×4.
5. **El cotizador no se anima nunca.** Si una versión futura hiciera entrar la tarjeta, el precio o
   cualquier control, **esta excepción no la cubre** y hace falta otra decisión. Lo que se autoriza
   es taparlo, no moverlo.
6. **`prefers-reduced-motion: reduce` → no hay intro en absoluto.** No es una versión degradada: el
   script sale antes de tocar el DOM y el CSS anula telón y capa por separado.
7. **Sin JavaScript, no hay telón.** Por construcción, no por red de seguridad: sin JS no se pone
   la clase y la página se ve entera. Es lo contrario de `Motion.astro`, que oculta primero y
   revela después, y por eso este fallo **no puede** ocurrir aquí.
8. **Las cinco páginas en cero bytes ejecutables siguen en cero.** `/tarifas`, `/terminos`,
   `/privacidad`, `/canal-de-denuncias` y la 404 no reciben ni el marcador ni la intro. Es la
   **opción C**, elegida por Sebastián el 2026-09-25 tras descartar ponerlo en todas.

### Regla de ámbito para futuras capas a pantalla completa

Cualquier otra pieza que cubra la pantalla —un aviso de cookies, un modal de bienvenida, una
pantalla de carga, una transición entre páginas— **requiere enmienda propia**. Esta excepción es
*para la intro de marca*, no *para las capas a pantalla completa en general*, y menos todavía una
autorización para volver a poner algo delante del cotizador.

Si aparece una cuarta excepción al Motion System, la pregunta deja de ser «¿se aprueba ésta?» y
pasa a ser si V1 necesita revisión.

## Alternativas evaluadas

| Opción | Por qué no |
|---|---|
| **No hacer la intro** | Sigue siendo la alternativa honesta y se deja escrita: el sitio funciona perfectamente sin ella. Se descarta porque la marca no tiene hoy ningún otro momento propio |
| **Intro fuera de la Home, en las otras siete páginas** | Peor que no tenerla. La intro se dispara en la primera página de la sesión, y para casi todo el mundo esa página es la Home; excluirla de ahí no mueve la intro a otro sitio, la corre a la **segunda** página que visiten — una presentación de marca a mitad de visita |
| **Marcador de visita en las once rutas** (opción A) | Pone a ejecutar JavaScript a las cinco páginas que hoy están en cero, que es exactamente lo que **D28** se negó a pagar para darle botón de cerrar a la franja. Gastarlo en una animación de entrada es un argumento más débil que aquél |
| **Marcador sólo donde ya hay JS, sin respaldo** (opción B) | Deja un agujero grande, no de borde: quien entra por `/tarifas` —la puerta comercial desde buscador— y hace clic en el logo vería la intro a mitad de visita |
| **`document.referrer` como único criterio** | Llega vacío con ciertos ajustes de privacidad, con `rel="noreferrer"` y cuando alguien escribe la dirección. Una navegación interna se leería como llegada nueva |
| **`history.length` para distinguir la entrada** | Vale 1 en pestaña nueva, pero quien venía leyendo otra cosa en esa pestaña y escribe nuestra dirección da más de 1 — y ésa sí es una llegada de verdad. Suprimiría la intro justo a quien debería verla |

**El hueco que la opción C acepta a sabiendas**, escrito para que nadie lo trate como un fallo más
adelante: quien entra por una de las cinco páginas sin marcador y después **escribe** la dirección
de la Home a mano ve la intro. Sin referente y sin marcador no hay forma de distinguir ese caso de
una llegada nueva.

## Consecuencias

**Positivas**

- La marca tiene un momento propio, construido con el eje del isotipo y no con un efecto genérico.
- El cotizador no pierde disponibilidad: sigue cargado y operativo bajo el telón, y eso está medido
  y no afirmado.
- La regla dura 5 sale **reforzada**: esta pieza es el primer movimiento del sitio que no puede
  dejar contenido oculto si el JavaScript falla, porque sin JS no hace nada.

**Negativas**

- **Tercera excepción.** «Una sola vez», el techo de 280 ms y «el cotizador no entra» pasan a
  leerse los tres con un «salvo donde se aprobó formalmente». Exige disciplina para no normalizarlo.
- **Se acaba «cero almacenamiento».** El marcador escribe una llave en `sessionStorage`. Eso no
  contradice lo que la Política de Privacidad publica —habla de cookies *de seguimiento* y
  analítica *de terceros*, y esto no es ninguna de las dos— pero **sí vacía el argumento principal
  con el que D28 se quedó aparcada**. A partir de hoy, dejar la franja sin botón de cerrar es una
  decisión de diseño, no de arquitectura.
- **Un acoplamiento nuevo, y conviene que se vea.** El respaldo depende de recibir referente en la
  navegación interna. `docs/arquitectura-produccion.md` §5.1 planea
  `Referrer-Policy: strict-origin-when-cross-origin`, que lo manda; el día que alguien lo endurezca
  a `no-referrer`, la opción C se degrada a la B **en silencio** y la intro reaparece a mitad de
  visita. Queda escrito junto al código y en esa misma sección.
- **~0,9 s sin poder desplazar**, 1,29 a ×4. Si algún día parece mucho, el camino es acortar la
  animación y **no** quitar el `overflow: hidden`: sin él la página se desplaza por detrás del
  telón y al levantarse aparece a media altura.

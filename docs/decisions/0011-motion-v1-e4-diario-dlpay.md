# ADR-0011 — Enmienda Motion System V1: cuarta excepción, el Diario DLPay

> **ENMENDADA el 2026-10-01, el mismo día, para admitir una SEGUNDA pieza.** Esta decisión decía
> «única pieza fuera del registro de ADR-0001» y ya no es cierto: el abanico de etiquetas de
> `/precio` entró ese mismo día con cartulina, relieve y sombras de material. **Lo que se enmienda
> es sólo el registro visual —el Principio 3—, no el movimiento:** las etiquetas están quietas y el
> cuarto movimiento infinito sigue siendo uno solo, el Diario. Ver *La lista, y por qué es cerrada*
> al final.

- **Estado:** Aceptada — 2026-10-01
- **Decide:** Sebastián Villanueva (maqueta y medición de Claude Cowork; análisis, correcciones e
  integración de Claude Code, Fase 4)
- **Ámbito:** `src/components/DiarioDLPay.astro` y la ranura `aside` de `src/pages/blog/index.astro`.
  Enmienda el Motion System V1, el Design System §6.2 y dos reglas de `CLAUDE.md`; **no toca nada
  fuera de esta pieza**.
- **Identificador:** `motion-v1-e4`
- **Referencia:** `docs/design-system/motion-system-v1.md` §4 y §7
- **Precedentes:** ADR-0006 — franja (2026-09-08) · ADR-0008 — globo (2026-09-15) · ADR-0010 —
  intro de marca (2026-09-25)
- **Entrega que la origina:** `Claude outputs/blog-diario-relieve-*` (2026-10-01)

## Contexto

`/blog` abría con la hoja del último artículo y los cantos de los dos anteriores, entrada el mismo
2026-10-01. Sebastián pidió que **las hojas pasaran solas, una por artículo**, como un diario.

**Lo pidió dos veces, y la primera se le dijo que no.** El 2026-09-30 preguntó si las hojas podían
alternarse cada 2 s; se descartó con cuatro argumentos y la decisión quedó escrita en
`motion-system-v1.md` §7. Al día siguiente volvió a pedirlo, esta vez como un diario cada 3 s.
**Esta enmienda es ese cambio de decisión, y se registra como tal.**

De los cuatro argumentos de entonces, **dos caen con esta implementación** y conviene decirlo:

| argumento del 2026-09-30 | estado |
|---|---|
| «JavaScript nuevo en una página que no tiene ninguno» | **Cae.** Es CSS puro: 0 bytes de JS. Los `@keyframes` se generan en el build desde `posts.length` |
| «WCAG 2.2.2 pide un control de pausa que la regla del objeto prohíbe» | **Cae.** La casilla de pausa es nativa y vive **fuera** del diario, así que no es un control dentro del objeto. Verificado: marcar la casilla pasa las 12 animaciones de `running` a `paused` |
| «El cuarto movimiento infinito» | **En pie.** Es exactamente lo que esta ADR autoriza |
| «El destino cambia bajo el cursor» | **En pie, y es el coste real.** Ver *Consecuencias* |

## Decisión

Se autoriza **un cuarto movimiento infinito**, acotado a `DiarioDLPay`: tres hojas que giran sobre
su lomo, 900 ms de vuelta, una cada 3 s, en bucle.

| Regla | Estado |
|---|---|
| Motion §4, regla dura 1 — «una sola vez» | **Enmendada, sólo para esta pieza.** Con la franja y los dos movimientos del globo son **cuatro** en todo el sitio |
| Motion §7 — «carruseles y portadas que se alternan solas» | **Enmendada**, y el párrafo que lo prohibía se escribió el día anterior. Se conserva con su fecha y su refutación |
| Techo de 280 ms | **Excedido: la vuelta dura 900 ms.** A 280 una página se lee como un parpadeo |
| Eje diagonal de marca | **No aplica**: gira sobre el lomo, que es el gesto físico de una hoja |
| Motion §4, regla dura 5 — sin JS todo se ve | **Intacta.** Es CSS y gira sin JavaScript |
| Motion §4, regla dura 6 — `prefers-reduced-motion` | **Intacta y verificada.** Con la preferencia activa: 0 animaciones, una hoja quieta, el control no se dibuja |
| WCAG 2.2.2 | **Cumplida** con casilla nativa fuera del objeto, más pausa al `:hover` y al `:focus-within` |
| DS §6.2 — cada trazo significa algo | **Enmendada.** Ver abajo |
| `CLAUDE.md` §2, Principio 3 — sin animaciones decorativas | **Enmendada, sólo para esta pieza** |
| `CLAUDE.md` §5 — nomenclatura | **Ampliada:** «Diario DLPay» es un nombre nuevo |

### Lo que la enmienda del §6.2 autoriza, y es lo más delicado

El arranque de las columnas son **líneas de texto simuladas**. No representan movimiento, ni flujo
de valor, ni un paso de un proceso, ni una pregunta del visitante: **no representan nada.** Son la
primera marca del sistema de la que eso es cierto, y la regla dura del §5 llama a eso papel tapiz.

**Sebastián decidió el 2026-10-01 que se quedan**, sabiéndolo. Se registra sin maquillarlo: es una
excepción al vocabulario, no una marca nueva, y **no autoriza texto simulado en ninguna otra
pieza**. La alternativa que se le ofreció —el primer párrafo real del artículo, cortado— queda
anotada por si algún día se prefiere.

### Y el registro visual

El diario trae **grano de papel, mancha, relieve, luz simulada y perspectiva 3D**. ADR-0001 fija
A×C —«mesa de operaciones», bordes finos, radios discretos— y los cuatro dispositivos del sitio
llevan escrito *«plano y sin trucos: nada de 3D, reflejos ni desenfoques»*.

**Esta pieza era la excepción a ese registro. El 2026-10-01 pasaron a ser dos.**

### La lista, y por qué es cerrada  ·  *enmienda del 2026-10-01*

| pieza | dónde | qué trae fuera del registro | ¿se mueve? |
|---|---|---|---|
| **Diario DLPay** | portada de `/blog` | grano, mancha, relieve, luz, **perspectiva 3D** | **sí**, cuarto movimiento infinito |
| **Abanico de etiquetas** | portada de `/precio` | cartulina con cuatro ruidos, relieve, **sombras de material** | **no**, está quieto |

**La segunda entró el mismo día que se escribió esta ADR, y eso es exactamente lo que había que
mirar.** Un documento que dice «única» y deja de ser cierto en veinticuatro horas no se corrige
borrando la palabra: se corrige decidiendo qué está pasando. Se le planteó a Sebastián como la
elección entre *dos excepciones en un sitio cuya dirección sigue siendo A×C* y *la dirección está
cambiando y ADR-0001 debería decirlo*. **Eligió lo primero, con la lista cerrada y nombrada.**

**Qué significa «cerrada», en concreto:**

- **Son estas dos y ninguna más.** Una tercera pieza con materia **no entra por este ADR**: vuelve
  a abrir la conversación, y ahí la pregunta honesta ya no será «¿la autorizo?» sino «¿sigue
  ADR-0001 describiendo este sitio?».
- **El resto del sitio no se toca.** Los cuatro dispositivos en CSS conservan su regla escrita —
  *plano y sin trucos*— y el cotizador, las figuras y las bandas siguen en A×C.
- **La excepción es de REGISTRO, no de movimiento.** Las etiquetas están quietas. El cuarto
  movimiento infinito sigue siendo uno solo.

*Lo que costó llegar hasta aquí, por si sirve:* la primera excepción se concedió con el argumento
de que era única. **Ese argumento ya no está disponible para la segunda**, y por eso ésta se
concede con una lista en vez de con una promesa.

## Consecuencias

**Lo que cuesta, medido y sin rebajar:**

- **El 30 % de cada ciclo, un toque abre el artículo que llega en vez del que se va.** En un
  teléfono no hay puntero que pause, así que ahí no hay red: sólo pulsar «Pausar» antes. Es el
  argumento que no cayó, y el coste se acepta a cambio de la pieza.
- **El contraste de las orejas es una distribución, no un número.** La entrega lo reportaba como
  media 5,10–5,56 con mínimo 4,12, y **WCAG no tiene contraste medio**: donde el grano oscurece el
  papel bajo un trazo de 13 px, ese punto no llegaba al 4,5 de AA. **Corregido al integrar**: las
  orejas bajan un paso, a `#525B68`, que da 6,52 sobre el papel limpio y deja el peor punto del
  grano en 4,72. Es local y no toca `--ink-mute`.
- **La hoja pinta 8 px por debajo del pliegue durante los primeros 220 ms de cada ciclo**, en los
  dos anchos medidos. La entrega declaraba 0. Es papel claro sobre papel claro, así que no se ve,
  pero el número real es 8.
- **La máscara de la tinta no está verificada en Safari.** Cowork lo declaró —sólo tiene Chromium—
  y este entorno tampoco tiene WebKit. El modo de fallo es benigno: sin máscara la letra sale
  entera, que para contraste es mejor. **Queda como pendiente de comprobar en un Safari real.**
- **Peso:** el CSS de la página pasa de 9.786 a ~14.000 bytes. 0 JS, 0 archivos, 0 `--elev-card`.
- **Depende de `img-src data:` en el CSP del host.** Ya está en
  `docs/arquitectura-produccion.md` §5.1; si al cerrar D1b alguien lo endurece, la textura
  desaparece sin romper nada.

**Lo que deja sin consumidores:** `src/components/UltimoArticulo.astro`. Se conserva hasta que
Sebastián decida (regla 3 de Cowork: no se borra lo ya construido sin su palabra).

**Cómo se revisa que no se degrade.** Las reglas duras de la pieza están en su cabecera. Dos no son
negociables y ya rompieron algo una vez: **`perspective` va en `.diario`**, el padre directo —si se
mueve, se mide la cara a mitad de vuelta y si el alto no crece, no hay perspectiva—; y
**`steps(1, end)` en el fotograma `p`** de la hoja, el dorso y la luz, sin el cual vuelve un
fotograma fantasma de 0,9 ms. Y si se toca la perspectiva, el tamaño o el control, **hay que volver
a barrer la holgura con `elementFromPoint`**, nunca con cajas: medida con cajas da −20 y es falso,
medida en tinta da 12.

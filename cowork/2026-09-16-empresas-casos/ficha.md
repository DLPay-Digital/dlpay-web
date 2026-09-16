# Ficha — lenguaje visual de «Para qué lo usan» (/empresas)

**Entrega:** `2026-09-16-empresas-casos` · **Autor:** Claude Cowork · **Estado:** En revisión · exploración
**Board de tratamientos:** `index.html` · **Propuesta de los cuatro:** `propuesta.html`
**Capturas:** `hoy-proveedores.png` · `trat-A/B/C.png` · `figura-1..4.png` · `propuesta-1280.png` · `propuesta-390.png`

> **Tratamiento elegido: A · plano recortado** (Sebastián, 2026-09-16). Los cuatro casos están
> dibujados en `propuesta.html` y documentados en §7.

---

## 1. El diagnóstico

Lo que hay hoy: cuatro paneles en tinta, cada uno simulando una pantalla de software
(`BusinessEmblem.astro`). Nacieron como SVG geométricos y se convirtieron en widgets el
2026-09-10 porque los trazos finos «se leían como un boceto».

Cuatro problemas, en orden de gravedad:

**1 · Tres de los cuatro simulan producto que DLPay no tiene.** Un panel de «Ruteo de pagos» con
tres destinos activos sugiere que DLPay ejecuta pagos a varios destinatarios. Un «Saldo en
tesorería» sugiere que DLPay mantiene un saldo de la empresa. El servicio real convierte y entrega
dólar digital **en la billetera del cliente**, y desde ahí decide él — `CLAUDE.md` §1, regla dura de
contenido. No es un problema estético: la página más comercial del sitio está insinuando producto.

**2 · La misma cifra seis veces.** `2.174,62` aparece seis veces en la página construida: portátil
del encabezado, saldo de tesorería, tres comprobantes recurrentes y el terminal de divisas. Es el
efecto colateral de una regla correcta —ninguna cifra se teclea, todas salen de `quoteLimits` y
`convert()`—, pero el resultado es que el saldo, el pago mensual y la operación de cambio son
exactamente el mismo número.

**3 · Cuatro veces la misma silueta.** Mismo panel, mismo radio, misma sombra, mismo tamaño, mismo
punto verde. Cambia el contenido, no el objeto, así que el zigzag alterna lados pero no aporta
información.

**4 · `--elev-card` fuera de su regla.** Los cuatro emblemas la usan sobre papel, y el Design
System §4.5 la reserva **sólo** para la tarjeta del cotizador sobre tinta. Además el
`aspect-ratio: 4/3` deja dos de los paneles medio vacíos.

## 2. El lenguaje elegido

**Geometría con masa** (decisión de Sebastián, 2026-09-16). Es el principio original del sistema
—cada trazo representa movimiento, flujo de valor o un paso, ADR-0001 §3— resuelto con peso y
escala en vez de trazo fino. El error del péndulo fue abandonar el lenguaje cuando el problema era
el grosor.

Ninguna figura simula una pantalla y **ninguna lleva cifras**, con lo que los problemas 1 y 2
desaparecen por construcción.

## 3. Los tres tratamientos

Caso de prueba: **pagos a proveedores en el exterior**, el más difícil. La topología es la misma en
los tres —un origen, una frontera, un destinatario— porque es la que dice el texto.

| | Qué hace | Gana | Cuesta |
|---|---|---|---|
| **A · Plano recortado** | Un plano en tinta cuyo canto **es el corte del isotipo**: la frontera deja de ser una línea prestada y pasa a ser la diagonal de la marca. El dinero es el mismo trazo dos veces —hueco dentro del plano, macizo fuera— y la cuña se parte justo en el canto | Es el único específico de DLPay: nadie más tiene ese canto. Resuelve el vacío y la repetición de un golpe | La masa es grande y hay que decidir de qué lado cae en cada fila |
| **B · Trazo macizo** | La topología de `UseCaseFigure` con el trazo a 14 px en vez de 1,6 y al triple de escala | Arreglo mínimo, cero gramática nueva, el «boceto» desaparece sólo con el peso | Modesto: deja la columna visual medio vacía y se parece mucho a lo que ya está en la Home |
| **C · Banda sangrada** | La tinta vuelve como banda que sangra hasta el canto de la página —sin radio, sin sombra, sin borde—, con el trazo en verde, que sobre tinta rinde 8,45:1 | Editorial y confiado; el verde por fin puede llevar el trazo | Vuelve a ser un rectángulo oscuro, y obliga a alternar sangrados, o sea a cambiar la estructura de la sección |

**Recomiendo A.** B es correcto pero no cambia la sensación, y C soluciona el vacío volviendo al
objeto del que estamos saliendo. A es el único que convierte una restricción de la marca —el corte
del isotipo— en el argumento del dibujo.

## 4. Si A se elige, así quedan los cuatro

Cada caso con una **silueta distinta de verdad**, no el mismo objeto con otro contenido:

| Caso | Silueta | Lo que dice |
|---|---|---|
| Proveedores | Una línea que **cruza** el canto | Sales de Chile, de una sola vez y sin escalas |
| Tesorería | Una **masa quieta**, sin ningún trazo de flujo | El dinero no va a ninguna parte: ése es el caso |
| Recurrentes | Una **serie que se acorta**: el mismo gesto repetido, cada vez más corto | «El ida y vuelta se acorta cada mes», dibujado en vez de escrito |
| Divisas | **Dos planos del mismo tamaño** con la cuña entre ellos | El valor no cambia, cambia la unidad — y el tamaño es el argumento del volumen |

## 5. Reglas que lo sustentan

| Documento | Regla |
|---|---|
| ADR-0001 §3 / DS §6 | Cada trazo representa movimiento, flujo o un paso. Ángulo 30–35°, el del isotipo |
| DS §2.4 | Verde sobre papel sólo como relleno; los nodos con significado van en `--verde-deep` (4,90:1). Sobre tinta, `--verde` (8,45:1) |
| DS §4.5 | `--elev-card` es sólo del cotizador: las figuras nuevas no llevan sombra |
| `CLAUDE.md` §1 | Nada puede sugerir que DLPay ejecuta pagos ni mantiene saldos |
| `CLAUDE.md` Principio 3 | Sin dashboards genéricos ni interfaz simulada |
| Motion System | No se añade movimiento: las cuatro filas conservan su `data-enter` y siguen siendo cuatro hermanas |

## 6. Lo que habrá que resolver al implementar

1. Los SVG van `aria-hidden`, como los actuales: el `h3` y el párrafo ya lo dicen con palabras.
2. Los nodos cambian de token según la superficie que tengan debajo — es la regla del §2.4, no una
   inconsistencia.
3. Si se elige C, la banda sangrada necesita `overflow-x: clip` **en `html`**, no sólo en `body`:
   el `overflow` del `body` se propaga al viewport y no recorta. Me pasó al montar este board y el
   desborde medía 1132 px.
4. `BusinessEmblem.astro` se reescribe entero y deja de importar `lib/pricing` y `quoteLimits`.
   Conviene comprobar que ningún otro componente dependía de esas importaciones ahí.


---

## 7. Los cuatro casos dibujados  ·  A · plano recortado

`propuesta.html` monta la sección completa con el zigzag real. Gramática común a las cuatro:

- Un **plano en tinta** cuyo canto es el corte del isotipo (dx 202 : dy 300, los ~34° de la marca).
- El dinero es un **canal hueco** dentro del plano y **macizo** fuera: el mismo trazo cambiando de
  material al cruzar. Cuando algo cruza, la cuña se parte justo en el canto.
- Los nodos son contrapartes: `--verde` sobre tinta (8,45:1), `--verde-deep` sobre papel (4,90:1).
- Etiquetas en Spline Sans Mono a 13 px. **Ninguna cifra.**
- Sin panel, sin radio, sin sombra, sin interfaz simulada. `viewBox` 460×300 en las cuatro.

| Figura | Qué dibuja | Por qué dice lo que dice |
|---|---|---|
| 1 · Proveedores | Un canal que cruza el canto, con la cuña partida en la frontera | Una operación, de una vez y sin escalas |
| 2 · Tesorería | Un volumen hueco dentro del plano, con la parte en dólar digital en verde. **Nada cruza el canto** | «Sin abrir una cuenta en el extranjero» dicho con el dibujo: el vacío de la derecha es la frase |
| 3 · Recurrentes | Tres cruces **idénticos**; sus tres cuñas caen escalonadas sobre la diagonal | La repetición es el mensaje, y las cuñas trazan el canto por sí solas |
| 4 · Divisas | Dos bloques del mismo tamaño a cada lado del canto, con la cuña vertical entre ellos | El valor no cambia, cambia la unidad. El tamaño de los bloques es el argumento del volumen |

### Dos versiones que descarté al verlas renderizadas

1. **Recurrentes con los trayectos decrecientes.** Dibujé primero tres líneas cada vez más cortas,
   para decir «el ida y vuelta se acorta cada mes». Renderizado se leía como **un gráfico de barras
   descendente**, que es justo lo que este sistema no quiere. Las tres quedaron idénticas: la
   recurrencia es el mensaje principal y el acortamiento lo dice el párrafo.
2. **Tesorería como bucle cerrado** —un canal que sale, gira y vuelve, sin cruzar la frontera—.
   Contaba la frase entera, incluido el «la conviertes de vuelta», pero el resultado se parecía
   demasiado a un icono genérico de ciclo. El volumen quieto es más sobrio y más de esta marca.

### Medido

Desborde horizontal 0 a 390 y a 1280. En móvil la figura va primero y el texto después, como ya
hace la sección. Cero JavaScript nuevo: las figuras son SVG en línea y las cuatro filas conservan
su `data-enter`, que sigue siendo M5 con cuatro hermanas.

### Para el traslado

- `BusinessEmblem.astro` se reescribe entero y **deja de importar** `lib/pricing`, `quoteLimits` y
  `ConfigPriceSource`. Conviene comprobar que nada más dependía de esas importaciones ahí.
- Cada figura usa `clipPath` con `id` propio (`p1-in`, `p3-out`, …). Los ids son **globales en el
  documento**: si alguna vez dos instancias del mismo caso conviven en una página, hay que
  sufijarlos. Hoy cada caso se renderiza una sola vez.
- `aria-hidden` en las cuatro, como las actuales.
- Desaparecen `--elev-card`, el `aspect-ratio: 4/3`, los grises locales de cromo (`--w-surface`,
  `--w-raised`, `--w-line`) y las seis apariciones de la cifra de muestra.

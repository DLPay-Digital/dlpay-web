# DLPay — Especificación del Cotizador (V1)

> **Estado:** especificación visual y de UX. **No** es implementación. **Fecha:** 2026-09-03.
> **Base:** ADR-0001, `phase-2.5-definicion-experiencia.md` §3, `design-system-v1.md`.
> El prototipo interactivo vive en el Artifact de Fase 2 (board "Prototipo del cotizador").

---

## 1. Propósito y modelo

El cotizador es **el elemento central de la web**. Su trabajo:

1. Responder al instante la pregunta #1 del cliente: **"¿cuánto recibo / cuánto pago?"**
2. Llevar a la acción: **WhatsApp con el monto prellenado** (primaria) o crear cuenta (secundaria).

**Modelo (actualizado 2026-09-04, evolución a remesas):**
`qué quieres hacer → monto → cuánto recibes → precio referencial → WhatsApp → un ejecutivo
confirma el precio final y coordina el destino`.

**La intención es el primer paso**, no la moneda. Dos opciones:

| Intención | Entregas | Recibes | Por qué existe |
|---|---|---|---|
| `to_foreign` — Convertir a otra moneda | CLP | la divisa de destino | El caso principal |
| `to_clp` — Convertir a pesos | la divisa | CLP | La vuelta |

**Enmienda del 2026-10-21 — ADR-0013: el cotizador tiene divisa de destino.** La pregunta que
responde deja de ser «cuántos dólares recibo» y pasa a ser **«cuánto llega»**, en la moneda del
destino. `to_usd` pasa a llamarse `to_foreign`: es un renombre, la aritmética no cambia, y la
divisa viaja aparte de la intención.

**Un tercer control, y sólo cuando hace falta.** Entre la intención y los montos aparece «¿A qué
moneda?», un desplegable con las divisas que tengan **tasa de muestra configurada**. Con una sola
—que es el estado de hoy, con D7 abierta— **el control no se dibuja** y la intención vuelve a
nombrarla: «Convertir a dólares», exactamente como esta tarjeta se ve desde que existe. Un
desplegable de una opción no es una elección.

**Y eso deja caduco el motivo de la enmienda de abajo.** `send_abroad` se retiró porque «hacía la
misma aritmética que `to_usd`». Con doce divisas ya no la hace. No se repone automáticamente —la
intención y la divisa pueden ser un control o dos—, pero quien lea el párrafo siguiente debe saber
que su razón venció.

**Enmienda del 2026-09-14.** Había una tercera, `send_abroad` — «Enviar al extranjero» —, retirada
a petición de Sebastián. Hacía exactamente la misma aritmética que `to_usd` y en el selector las
dos se leían como dos caminos para lo mismo, que es el tipo de duda que el primer paso del
cotizador existe para evitar.

Lo que se pierde, y conviene tenerlo escrito: producía un mensaje de WhatsApp distinto —«quiero
enviar X al extranjero» en vez de «quiero convertir X a dólares»—, así que el ejecutivo ya no
recibe esa intención por escrito. Si le importa, la pregunta. Si alguna vez pesa más la señal al
ejecutivo que la claridad del selector, la intención está en el historial y vuelve con un commit.

Efecto lateral: la etiqueta del campo de entrada era dinámica —«Envías» para `send_abroad`,
«Conviertes» para el resto— y ahora es fija, «Conviertes», porque las dos intenciones que quedan
son conversiones.

**Vocabulario:** la UI habla de **USD / dólares**, no de USDT. El dólar digital es el riel y se
explica en una nota permanente dentro del propio cotizador, sin ser el titular.
`REQUIERE VALIDACIÓN DE COMPLIANCE` — mostrar "USD" cuando lo que se entrega es dólar digital.

**Lo que el cotizador NO hace (V1):**
- No ejecuta una compra/venta.
- No entrega una cotización cerrada ni bloquea un precio ("garantizado por X min").
- No promete un precio final — dice explícitamente que es **referencial**.
- No integra una API de pricing (hay un valor de muestra configurable; ver §6).

---

## 2. Anatomía

```
┌───────────────────────────────────────────────┐
│  [ Quiero comprar ]  Quiero vender             │  ← toggle dirección
│                                               │
│  Pago            2.000.000            CLP  ▾   │  ← campo editable
│  Recibo aprox.   ~ 2.174,80          USDT  ▾   │  ← campo editable (bidireccional)
│                                               │
│  Precio referencial                           │
│                       919,70 CLP/USDT         │  ← cifra grande, tabular
│  ─────────────────────────────────────────    │
│  Sin comisiones ocultas: el precio ya         │
│  incluye el spread.  Referencia: [fuente]     │
│                                               │
│  [  Cotizar este monto por WhatsApp  ]        │  ← acción primaria (fill --verde)
│  o crea tu cuenta para operar en línea        │  ← secundaria (enlace)
└───────────────────────────────────────────────┘
```

**Jerarquía visual:**
1. El **monto que recibes/pagas** — la cifra más grande junto con el precio.
2. El **precio referencial** — cifra grande y tabular. *Sin timestamp desde el 2026-09-28; ver la enmienda al final.*
3. El **CTA** — un botón, verde, inequívoco.
4. Todo lo demás (nota del spread, toggle, enlace secundario) — soporte, tamaño menor.

**Contenedor:** tarjeta `--r-card` (14px) con `--elev-card` **sólo** cuando flota sobre la tinta
del héroe. En `/cotizar` sobre fondo claro: `--r-3`, sin sombra o `--elev-0`.

---

## 3. Comportamiento

| Aspecto | Regla |
|---|---|
| Dirección | Toggle "Quiero comprar / Quiero vender". Default: comprar. Cambia labels (Pago/Entrego) y el texto del mensaje de WhatsApp. |
| Moneda | Origen CLP, destino USDT por defecto. Editable pero **no obligatorio de tocar**. |
| Entrada | Formateo en vivo con separador de miles chileno mientras se escribe. Teclado numérico en móvil (`inputmode`). |
| Bidireccional | Editar CLP recalcula USDT; editar USDT recalcula CLP. El campo que el usuario está editando no se reformatea bajo el cursor. |
| Recálculo | *Debounce* ~600–700 ms tras dejar de escribir. |
| Redondeo | USDT a 2 decimales. CLP entero. Precio a 1–2 decimales (según lo que use el equipo). |

---

## 4. Estados

| Estado | Visual | Copy |
|---|---|---|
| **Inicial** | Monto de ejemplo cargado, resultado visible. | — |
| **Escribiendo** | Sin cambios hasta que pare (debounce). | — |
| **Calculando** | Shimmer **sobre el número** que se recalcula (no spinner, no bloquea el formulario). ~600ms. | — |
| **Resultado** | Recibes/pagas + precio + timestamp + nota del spread. | "Sin comisiones ocultas: el precio ya incluye el spread." |
| **Bajo el mínimo** | Mensaje inline bajo el campo, borde del campo `--baja`. El CTA sigue disponible (lleva a WhatsApp). | "Monto mínimo: CLP `[monto]`. Puedes escribirnos igual y te orientamos." |
| **Sobre el máximo** *(si aplica)* | Igual, inline. | "Para montos sobre `[monto]` te atiende un ejecutivo. Escríbenos." |
| **Mercado moviéndose** | Precio atenuado / "—". Alerta `--aviso`. El CTA cambia a "Escríbenos por WhatsApp". | "El mercado se está regulando. Reintenta en unos minutos o escríbenos y te cotizamos." |
| **Sin conexión / error** | Precio "—". Alerta. CTA → WhatsApp. | "No pudimos traer el precio ahora. Escríbenos y te cotizamos al instante." |

**Principio:** el fallback de cualquier error es **WhatsApp**, nunca un error seco.

---

## 5. Salto a WhatsApp

El CTA abre `https://wa.me/56977615921?text=<mensaje URL-encoded>`.

**Plantilla del mensaje (estado resultado):**
> Hola, quiero cotizar la {compra|venta} de USDT por CLP {monto} (recibo aprox. {usdt} USDT al
> precio referencial {precio}). ¿Me confirman el precio final?

**Estado bajo el mínimo:**
> Hola, quiero {comprar|vender} USDT por CLP {monto}. ¿Pueden operar ese monto?

**Estado sin precio:**
> Hola, quiero cotizar una operación de USDT. El cotizador no me está mostrando precio ahora.

**Reglas:**
- El mensaje **siempre** incluye el monto y la dirección (comprar/vender).
- El número, el formato y el vocabulario del mensaje **coinciden** con lo que usa el equipo en
  WhatsApp (mismo "precio referencial", mismos decimales).
- El número de WhatsApp es un valor de configuración (hoy `+56 9 7761 5921`).

`HIPÓTESIS` H7: prellenar el mensaje sube la tasa de operaciones completadas y baja el trabajo del
ejecutivo. Instrumentar (§8).

---

## 6. Datos y desacople (contrato, no implementación)

La UI **sólo consume un objeto `Quote`**. No conoce la fuente del precio ni la fórmula.

```
PriceReference {
  rate:        number        // CLP por 1 USDT
  pair:        "USDT/CLP"
  source:      string        // etiqueta legible: "[fuente pendiente]"
  asOf:        timestamp
}

Quote {
  direction:      "buy" | "sell"
  payAmount:      number
  payCurrency:    "CLP"
  getAmount:      number      // estimado
  getCurrency:    "USDT"
  price:          PriceReference
  spreadIncluded: true        // el precio ya lo incluye
  isReferential:  true        // NUNCA una cotización cerrada en V1
  minPay?:        number
  maxPay?:        number
  state:          "ok" | "below_min" | "above_max" | "market_moving" | "unavailable"
}
```

**`PriceSource` — una sola implementación en V1:**
- `ConfigPriceSource` — devuelve un **`rate` de muestra configurable** (variable de entorno /
  archivo de config). Editable sin tocar el componente.
- Futuro: `DLPayApiPriceSource` — se agrega y se cambia por env, **sin rehacer la UI**. La
  metodología de spread y la fuente oficial son decisión de DLPay (Fase 0 I10/I11), aún `PENDIENTE`.

**Sin sobreingeniería:** la cadena `Market Price → Pricing/Spread → Quote → UI` se respeta a nivel
de tipos. No hay servicio, ni caché distribuida, ni cola. Un módulo, una interfaz, una config.

---

## 7. Responsive

| | Móvil (base) | Desktop |
|---|---|---|
| Ubicación | El cotizador **es** el héroe; primer viewport, una columna. | Columna derecha del héroe; copy a la izquierda. |
| CTA | **Barra inferior fija con la cifra viva**, una vez que la tarjeta queda arriba del viewport. Implementada el 2026-09-07. | En la tarjeta. La barra no aplica: el cotizador no se pierde de vista. |
| Campos | Grandes, teclado numérico, toggle alcanzable con el pulgar. | Tamaño normal. |
| Resultado | Visible sin scroll. | Visible sin scroll. |

---

### 7.1 La barra fija móvil

Viene de Fase 1, patrón 13 (**Global66**), marcada `Adoptar (P1)`. Estaba especificada aquí y no
se había construido: en móvil, al bajar a leer "cómo funciona", el CTA desaparecía de la pantalla.

- **Lleva la cifra viva.** Muestra `Recibes · US$ 2.174,62` mientras acompañas el scroll. Así el
  movimiento es información, no adorno: el número te sigue.
- **Una sola verdad.** El enlace, la cifra y el estado salen de la misma llamada a `whatsappUrl`
  que alimenta el botón de la tarjeta. No hay dos cálculos que puedan divergir.
- **Refleja el estado.** Bajo el mínimo o sobre el máximo muestra `Fuera de rango · —` y el botón
  pasa a `Escríbenos`, igual que la tarjeta.
- **Sólo si la tarjeta quedó arriba.** Si el usuario sube y el cotizador viene en camino, la barra
  no aparece: duplicarlo sería ruido.
- **Sólo bajo 900 px.** En escritorio el cotizador no se pierde de vista.
- Arranca con el atributo `hidden`, así que no existe para un lector de pantalla mientras la
  tarjeta está a la vista y no duplica el CTA.

## 8. Métricas a instrumentar (después, no ahora)

- Cotizaciones iniciadas / completadas.
- Clics en "Cotizar por WhatsApp" (con tramo de monto, sin PII).
- Estado en el que se abandona.
- Frecuencia del estado "mercado moviéndose".
- Ratio cotizador → WhatsApp → operación (requiere coordinar con el equipo).

Sin analítica invasiva; privacy-first; se decide la herramienta por necesidad.

---

## 9. Qué queda `PENDIENTE`

- Fuente oficial de market price y metodología de spread (Fase 0 I10/I11).
- Si la web muestra la lógica de tramos de spread o sólo el referencial.
- Monto mínimo/máximo reales.
- Tipografía (afecta el tratamiento de las cifras — ver Design System §3).

---

## Enmienda — 2026-09-28 · el cotizador pierde texto

Pedida por Sebastián: **«hay mucho texto en él»**. Se retiran dos piezas y se conserva una tercera
a discusión. El razonamiento largo de cada una vive junto al código, en `Quoter.astro`.

| qué se fue | qué decía este spec | dónde queda la información |
|---|---|---|
| **El timestamp** «hace un momento» | §62 lo dibujaba en el esquema y §75 lo pedía por su nombre: «cifra grande, tabular, **con timestamp**» | En ninguna parte. Lo que se pierde es la afirmación de **frescura**, no un dato vivo: era una frase estática que nunca se recalculó en el cliente |
| **La glosa de «referencial»** —«un valor referencial de mercado, no un precio cerrado: lo confirma tu ejecutivo antes de operar» | §48: «No promete un precio final — **dice explícitamente que es referencial**» | **El §48 se sigue cumpliendo**: la etiqueta dice literalmente «Precio referencial». Lo que se va es la explicación de la palabra, que vive en el glosario de `/preguntas`, en la FAQ de la Home y en `/tarifas` y `/precio` enteras |

**La nota del riel se acorta, no se retira.** Sebastián pidió quitarla con las otras dos; al
señalarle que no está en el mismo caso, eligió acortarla. Y no está en el mismo caso porque **este
spec la exige donde está**: §42, *«El dólar digital es el riel y se explica en una nota permanente
**dentro del propio cotizador**»*, con el motivo en la línea siguiente —`REQUIERE VALIDACIÓN DE
COMPLIANCE` por mostrar «USD» cuando lo que se entrega es dólar digital—. Es también la mitigación
de la regla dura de `CLAUDE.md` §1, que prohíbe **sugerir** un depósito bancario en el extranjero.

| | |
|---|---|
| **decía** (215 car., 3 líneas) | «Recibes dólar digital en tu billetera, equivalente 1:1 al dólar. Es lo que permite moverlo en minutos y a cualquier hora. No depositamos en cuentas bancarias en el extranjero.» |
| **dice** (~70 car., 1 línea) | «Recibes **dólar digital**, no un depósito en un banco del extranjero.» |

Conserva las dos únicas afirmaciones que cargan peso: **qué recibes** y **qué no es**. Lo que se fue
—la equivalencia 1:1 y «en minutos, a cualquier hora»— no mitigaba nada y sigue publicado: la
primera en el glosario de `/preguntas`, la segunda en la bajada del héroe de la Home y en el paso 06
de `/como-funciona`.

**Qué queda del cotizador en texto:** las dos etiquetas de campo, la etiqueta del precio, «Sin
comisiones ocultas: el precio ya incluye el spread», la nota del riel en una línea y el botón. **De
seis bloques de prosa a tres, y los tres que quedan caben en una línea cada uno.**

---

## Enmienda — 2026-10-22 · el cotizador pregunta como un envío

*Cowork, entrega `cotizador-`. Pedida por Sebastián: «ponerlo más bonito y acorde al servicio que
ofrecemos». Las tres decisiones de fondo son suyas, del mismo día.*

**Por qué.** Desde ADR-0014 el servicio no termina en una divisa: **el dinero llega a destino en la
moneda de ese destino.** La tarjeta seguía preguntando como una casa de cambio: dos botones negros
de «convertir», un desplegable de monedas y el precio aparte, al pie. Ahora pregunta como un envío.

### Lo que cambia

| | hasta hoy | desde esta enmienda | quién |
|---|---|---|---|
| **La intención** | dos botones a lo ancho, rellenos de tinta el elegido: «Convertir a otra moneda» y «Convertir a pesos» | un **interruptor chico**: «Enviar» y «Pasar a pesos». Siguen siendo dos radios con 44 px de área cada uno | Sebastián: la vuelta se queda, más discreta |
| **El destino** | «¿A qué moneda?», doce opciones del tipo «Dólar · USD (Estados Unidos, Ecuador)» | **«¿A dónde envías?»**, trece países, «Colombia · COP». La moneda sale sola. En «Pasar a pesos» es otro desplegable, «¿Qué divisa tienes?» | Sebastián: por país |
| **Los montos** | «Conviertes» / «Recibo aprox.», con la moneda al lado de la cifra | **«Envías» / «Llega aprox.»** (de vuelta: «Conviertes» / «Recibes aprox.»). La moneda va en una ficha arriba y la cifra tiene todo el ancho | Cowork |
| **El precio** | segunda cifra grande, al pie: «919,70 CLP por dólar»; en las débiles, «0,23 CLP por peso colombiano» | **en el tramo entre los dos montos**, a 17–20 px: «1 USD = 919,70 CLP» y, con la tasa bajo 1, «1 CLP = 4,35 COP» | Sebastián: legible |
| **El mensaje de WhatsApp** | «Hola, quiero convertir CLP 2.000.000 a dólares (recibo aprox. US$ 2.174,62 al precio referencial 919,70).» | «Hola, quiero **enviar** CLP 2.000.000 **a Estados Unidos, en dólares** (**llegan** aprox. US$ 2.174,62 al precio referencial **1 USD = 919,70 CLP**).» De vuelta a pesos sigue siendo «convertir … a pesos» | Cowork |
| **La barra móvil** | «Recibes · US$ 2.174,62» | «**Llega a Estados Unidos** · US$ 2.174,62» | Cowork |
| **Fuera de rango** | rojo en las dos cajas | rojo **sólo en la de los pesos**, que es donde vive el mínimo | Cowork |

**Lo que no cambia:** la aritmética y el tipo `Quote`; el monto de partida y sus cifras (las que
citan `/tarifas` y el puente siguen coincidiendo); «Precio referencial», con esas dos palabras
(§48); «Sin comisiones ocultas: el precio ya incluye el spread.», letra por letra; la nota del riel,
«Llega en la moneda del destino. El plazo te lo confirma tu ejecutivo.»; el botón, el enlace
secundario, el fallback a WhatsApp de cada estado y el comportamiento bidireccional del §3.

### Anatomía nueva (reemplaza el esquema del §2)

```
┌───────────────────────────────────────────────┐
│  [ Enviar ] Pasar a pesos                     │  ← interruptor chico (radios)
│                                               │
│  ¿A dónde envías?                             │
│  [ Estados Unidos · USD                  ⌄ ]  │  ← select nativo, 13 países
│                                               │
│  ┌ Envías                          [CLP] ┐    │
│  │ 2.000.000                             │    │  ← cifra mono, todo el ancho
│  └───────────────────────────────────────┘    │
│   │  Precio referencial                       │
│   ●  1 USD = 919,70 CLP                       │  ← tramo verde y punto (§6.2)
│   │  Sin comisiones ocultas: el precio ya…    │
│  ┌ Llega aprox.                    [USD] ┐    │
│  │ 2.174,62                              │    │
│  └───────────────────────────────────────┘    │
│  Llega en la moneda del destino. El plazo…    │  ← nota del riel (§42)
│  [      Continuar por WhatsApp      ]         │
│      o crea tu cuenta para operar en línea    │
└───────────────────────────────────────────────┘
```

**Jerarquía (reemplaza la del §2):** 1. **la cifra que llega**, que responde la pregunta; 2. el
**CTA**; 3. **el precio**, que es la explicación de esa cifra y se lee junto a ella, en el tramo;
4. todo lo demás. *El precio deja de ser «cifra grande»: era la segunda de la tarjeta y competía con
la respuesta.*

**El tramo no estrena ninguna marca** (DS §6.2): el tramo verde es lo nuestro, de punta a punta
desde ADR-0014, y el punto es la unidad de valor, la misma que el precio cotiza.

### Comportamiento nuevo (se suma al §3)

- **Cambiar de modo cambia de desplegable y conserva lo elegido.** De un envío a Colombia se pasa a
  «tienes pesos colombianos»; si de vuelta a pesos se eligen euros, al volver el destino es Europa.
  El monto en pesos se conserva, como siempre.
- **Una cifra que no cabe baja un escalón**, y si tampoco cabe, otro: de 26 a 20 y a 16 px en el
  teléfono, de 32 a 26 y a 20 en escritorio. Se mide la cifra, no se cuentan dígitos. Bajo 360 px
  la tarjeta pasa de 24 a 16 px de relleno.
- **El foco de dentro de la tarjeta es `--verde-deep`.** Heredaba `--verde` de la tinta del héroe,
  2:1 sobre el papel.

### Pendientes que deja

- `PENDIENTE DE DECISIÓN` — **que el equipo cotice así por WhatsApp.** Si el ejecutivo dice «0,23»
  y la web «4,35», el cliente compara dos números que no se parecen. Vive junto a `precioLegible`.
- `REQUIERE VALIDACIÓN DE COMPLIANCE` — las etiquetas «Envías» y «Llega aprox.» y el mensaje con
  «enviar … a {país}» afirman lo mismo que la nota del riel, que ya lleva ese marcador: que el
  dinero llega a destino. No afirman plazo ni canal.
- **Con VoiceOver**, cómo se lee «Colombia · COP» (el punto medio) y si la lista nativa del iPhone
  enseña los trece destinos sin cortar.

## Enmienda — 2026-10-22 (b) · el destino con su bandera

*Cowork, entrega `wise-`. Pedida por Sebastián al traer cosas de wise.com: «tienen su propio
cotizador en donde uno puede cambiar de moneda y la moneda viene acompañada de su bandera
correspondiente al país». Las banderas, «SVG propias, redondas», son decisión suya, del mismo día.*

**Por qué.** El cotizador pregunta «¿A dónde envías?» desde la enmienda de arriba, pero la respuesta
era un `<select>` nativo, y un `<select>` no puede dibujar una bandera. En una lista de trece países,
la bandera es lo que se reconoce antes de leer. Se sustituye por un selector propio, con búsqueda,
que sigue el patrón *combobox* de la ARIA APG.

### Lo que cambia

| | hasta hoy | desde esta enmienda |
|---|---|---|
| **El destino** | `<select>` nativo, «Estados Unidos · USD» | **un botón** con la bandera, el país y el código; al abrirse, **un panel** con un buscador y la lista de los trece |
| **La divisa** (en «Pasar a pesos») | otro `<select>` | el mismo selector, con la bandera de quien emite la moneda: la de Estados Unidos para el dólar, aunque también llegue a Ecuador |
| **Las fichas de moneda** de los montos | «CLP», «USD» | **la bandera a 16 px y el código.** En un envío, Chile arriba y el destino abajo; al pasar a pesos, al revés |
| **La barra móvil** | «Llega a Colombia» | **la bandera a 16 px y** «Llega a Colombia» |
| **Desde fuera** | — | `?destino=Perú` en la dirección elige ese destino al cargar. Un enlace de la misma página con `data-cotizar-destino` hace lo mismo sin recargar: es el de las tarjetas de destinos |

### Anatomía del selector (reemplaza la línea del `select` en el esquema de arriba)

```
  ¿A dónde envías?
  [ (●) Estados Unidos  USD                 ⌄ ]   ← botón, 52 px
  ┌─────────────────────────────────────────┐
  │ [ Busca un país o una moneda          ] │     ← buscador, combobox
  │  (●) Argentina                      ARS │     ← opciones de 44 px
  │  (●) Bolivia                        BOB │
  │  (●) Brasil                         BRL │     ← la activa: papel-2 y filete
  │  …                               (13)   │     ← hasta 288 px y luego scroll
  └─────────────────────────────────────────┘
```

**La elegida** lleva su código en `--verde-deep` y un punto: **el punto es la unidad de valor del
§6.2**, y aquí marca la moneda en que llega el dinero.

### Comportamiento

- **El botón abre y cierra.** Al abrirse, el foco pasa al buscador. La lista lleva el foco por
  `aria-activedescendant`, así que se escribe y se navega a la vez.
- **Teclado:**
  - ↑ ↓ mueven la opción activa, e Inicio y Fin van a la primera y la última.
  - Intro elige.
  - Escape cierra y devuelve el foco al botón.
  - Tab cierra.
- **Ratón:** un clic elige. Un clic fuera, o que el foco salga del selector, cierra.
- **La búsqueda no distingue tildes ni mayúsculas:** «peru» encuentra Perú y «japon», Japón. Busca en
  el país, el código, el nombre de la moneda y su plural, así que «euros» lleva a Europa. Entre
  varias coincidencias, la activa es **la primera cuyo nombre empieza por lo escrito**.
- **Sin coincidencias:** «Ningún destino coincide.» o «Ninguna moneda coincide.».
- **Lo de la enmienda anterior se conserva:**
  - al cambiar de modo se cambia de selector y se mantiene lo elegido;
  - el monto en pesos no se mueve.
- **Al llegar desde fuera** (`data-cotizar-destino`), el orden es:
  1. se pasa primero a «Enviar»;
  2. se elige el destino;
  3. la vista va al cotizador, suave salvo con `prefers-reduced-motion`;
  4. el foco queda en el botón.

  **Primero el modo y después el destino:** al revés, el cambio de modo elegía el destino de la
  divisa que estaba (de dólares sale Ecuador) y pisaba el pedido. Pasó y se corrigió antes de
  entregar.

### Las banderas

**Son catorce, SVG propias**: los trece destinos y Chile. Viven en `lib/banderas.ts`, y
`Bandera.astro` las recorta en círculo y les pone un filete interior.

- **Simplificadas:** franjas, campos y una figura. **Sin escudos**, porque a 16 px son ruido.
- **Dos excepciones**, porque sin ellas dos banderas se confunden:
  - Ecuador lleva un óvalo con el cóndor, que lo separa de Colombia;
  - Paraguay lleva el sello.
- **Siempre decorativas** (`aria-hidden`) y **siempre junto a su nombre o su código**: una bandera
  sola no se usa.
- **Ningún JavaScript las dibuja.** El selector clona las que el servidor ya dejó en un `<template>`:
  el dibujo no viaja en el `.js`.
- `tests/banderas.test.ts` falla si un destino o una divisa del catálogo se queda sin bandera.

### Pendientes que deja

- **Con VoiceOver en el iPhone**, la lectura del botón («¿A dónde envías? Estados Unidos USD») y del
  buscador mientras se escribe. Sustituye al pendiente de la enmienda anterior sobre la lista nativa,
  que ya no existe.
- **El destino con que abre el cotizador sigue siendo Estados Unidos** (`DEFAULT_DESTINO`).
  Decidido por Sebastián el 2026-10-22. Tres piezas copian lo que el cotizador enseña al abrir, y
  por eso siguen en USD: la tarjeta «Tu cotización» de la Home, el puente de tarifas y «lo que ves
  al cotizar» de `/tarifas` (DS §5). **Si algún día cambia el destino con que abre, esas tres
  cambian con él.**

---

## Enmienda — 2026-10-27 · el tarifario

*Cowork, entrega `tarifario-`. El modelo de precio es de Sebastián, del mismo día, con su planilla
de tres tramos.*

**Por qué.** El cotizador mostraba un solo número con el spread de DLPay adentro: «Sin comisiones
ocultas: el precio ya incluye el spread». El modelo pasó a ser el contrario: **la tasa es la de
mercado, sin recargo, y lo que DLPay cobra son dos líneas a la vista**. Ver `CLAUDE.md` §1, «El
modelo de precio».

### Lo que cambia

| | hasta hoy | desde esta enmienda |
|---|---|---|
| **El tramo** | «Precio referencial» y su cifra, y debajo «Sin comisiones ocultas: el precio ya incluye el spread.» | **El desglose, en el orden en que le pasa al dinero:** «Costo de envío − CLP 500», «Comisión de cambio 0,95 % − CLP 18.995», «Monto a convertir CLP 1.980.505», con el código y no «$», como manda el DS §5 en el cotizador; después el punto con «Precio referencial de mercado, sin recargo · 1 USD = 919,70 CLP», y al pie «**Sin comisiones ocultas.**» |
| **Pasar a pesos** | la misma tarjeta, sin cobro | con la tarifa «CLP – Chile». El orden se da vuelta, porque la cuenta también: primero el precio y «En pesos», después los dos cobros |
| **Lo que llega** | pesos ÷ tasa | lo que queda después de los dos cobros. Escribir en «Llega aprox.» busca el menor monto con el que llega al menos eso (`invertir`) |
| **El mínimo** | CLP 500.000 | **CLP 20.000** |
| **Los destinos** | trece | **once**; China llega en dólares y la nota del riel lo dice: «Llega en dólares, no en la moneda local» |
| **El mensaje de WhatsApp** | «Llegan aprox. US$ 2.174,62 (1 USD = 919,70 CLP)» | «Llegan aprox. US$ 2.153,43 **netos** (1 USD = 919,70 CLP)»: sin la palabra, el ejecutivo que divide por la tasa llega a otra cifra |

**Lo que no cambia:** «Precio referencial», con esas dos palabras (§48); el destino de partida; el
monto de partida; el botón, el enlace secundario y el fallback a WhatsApp de cada estado; y el
comportamiento bidireccional del §3.

**La tarifa no se calcula en el navegador desde el tarifario:** la isla recibe de cada destino el
costo de envío ya en pesos y los tres porcentajes (`data-tarifas`). Ver `tarifario.ts`.

### Anatomía del tramo (reemplaza esa parte del esquema del 2026-10-22)

```
│  ┌ Envías                          [CLP] ┐    │
│  │ 2.000.000                             │    │
│  └───────────────────────────────────────┘    │
│   │  Costo de envío             − CLP 500     │
│   │  Comisión de cambio 0,95 % − CLP 18.995   │
│   │  ─────────────────────────────────────    │
│   │  Monto a convertir       CLP 1.980.505    │
│   │  Precio referencial de mercado, sin recargo
│   ●  1 USD = 919,70 CLP                       │
│   │  Sin comisiones ocultas.                  │
│  ┌ Llega aprox.                    [USD] ┐    │
│  │ 2.153,43                              │    │
│  └───────────────────────────────────────┘    │
```

`REQUIERE VALIDACIÓN DE COMPLIANCE` — «Costo de envío», «Comisión de cambio» y sus cifras; «de
mercado, sin recargo»; y que China llega en dólares.

---

## Enmienda — 2026-10-28 · el cotizador compacto

*Cowork, entrega `compacto-`. El pedido y las dos decisiones son de Sebastián, del mismo día.*

**Por qué.** «Que el diseño de nuestro cotizador se vea elegante y sin tanta palabrería», con la
eficiencia del de Global66 —el desglose bajo «Ver detalle completo»— y no su dibujo. Y quitar
los botones «Enviar» y «Pasar a pesos», «dejando a libre disposición lo que quiera hacer el
cliente cambiando desde las divisas».

### Lo que cambia

| | hasta hoy | desde esta enmienda |
|---|---|---|
| **La dirección** | el interruptor «Enviar / Pasar a pesos» (enmienda del 2026-10-22) | **sale**. La deciden las fichas de moneda y un botón que da vuelta la operación |
| **El destino** | «¿A dónde envías?», un selector a lo ancho; de vuelta a pesos, «¿Qué divisa tienes?» | **sale el selector a lo ancho**: la ficha de cada monto es el selector, con bandera, código y flecha. Arriba, el peso chileno y las nueve divisas; abajo, los once destinos y «Chile, en pesos» |
| **Un lado es siempre el peso** | lo garantizaba el interruptor | elegir una divisa en una ficha pone la otra en pesos. Elegir pesos vuelve a enviar, al último destino si llega en esa divisa y, si no, a uno que la reciba en su moneda |
| **El botón de vuelta** | — | un círculo de 44 px junto al precio, con el icono `intercambiar`. Conserva el monto en pesos, como el interruptor. Se anuncia «Cambiar a pasar dólares a pesos» o «Cambiar a enviar pesos a {destino}», y al usarlo un aviso para lectores dice el sentido nuevo. **No dice «invertir»**, que en un sitio de dinero se lee como inversión |
| **Lo que se cobra** | tres filas: costo de envío, comisión de cambio y monto a convertir | **una línea**, «Cobramos CLP 19.495 · Ver detalle», que es el `summary` de un `details`. Las tres filas son el detalle y se despliegan en el tramo. **El total no se pliega nunca** |
| **El precio** | «Precio referencial de mercado, sin recargo» | «Precio referencial, sin recargo». Si no cabe junto al botón, baja un escalón, y otro: de 17 a 16 y a 14 px |
| **La nota del riel** | «Llega en la moneda del destino. El plazo te lo confirma tu ejecutivo.» | **nombra el destino**: «Llega a Estados Unidos, en dólares. El plazo te lo confirma tu ejecutivo.» La ficha de abajo enseña sólo el código, y el del dólar sirve a tres países |
| **El alto, a 390** | 733 px | **545 px**. En un iPhone de 390×844, la cifra que llega entra en la primera pantalla |

**Lo que no cambia:**
- la aritmética y el tipo `Quote`;
- el mensaje de WhatsApp;
- «Precio referencial», con esas dos palabras (§48);
- «Sin comisiones ocultas.» a la vista, al pie del tramo, por decisión de Sebastián;
- la nota del riel (§42);
- los avisos de fuera de rango;
- la barra móvil;
- `?destino=` y `data-cotizar-destino`.

**Se eligió contra un diálogo.** «Detalle de tu cotización», como el de Global66: una hoja que
subía desde abajo en el teléfono y un diálogo centrado en escritorio. Se prototipó, y Sebastián
eligió el plegable: un toque abre y otro cierra, el detalle se lee donde le pasa al dinero y sus
cifras cambian mientras escribes.

*Esto cambió la misma tarde: ver la enmienda (b), al final. La línea «Cobramos …» salió de la
tarjeta, y el detalle se abre en un diálogo.*

### Anatomía (reemplaza las del 2026-10-22 y del 2026-10-27)

```
┌───────────────────────────────────────────────┐
│  ┌ Envías                      [CL CLP ⌄] ┐   │  ← la ficha es el selector
│  │ 2.000.000                              │   │
│  └────────────────────────────────────────┘   │
│   │  Cobramos CLP 19.495      Ver detalle ⌄   │  ← summary, 44 px
│   │   (Costo de envío · Comisión · Monto a convertir, plegados)
│   │  Precio referencial, sin recargo   ( ⇅ )  │  ← botón de vuelta, 44 px
│   ●  1 USD = 919,70 CLP                       │
│   │  Sin comisiones ocultas.                  │
│  ┌ Llega aprox.                [US USD ⌄] ┐   │
│  │ 2.153,43                               │   │
│  └────────────────────────────────────────┘   │
│  Llega a Estados Unidos, en dólares. El plazo  │  ← nota del riel (§42)
│  te lo confirma tu ejecutivo.                  │
│  [       Continuar por WhatsApp       ]        │
│       o crea tu cuenta para operar en línea    │
└───────────────────────────────────────────────┘
```

De vuelta a pesos, el precio va antes de la línea del cobro, porque ahí primero se convierte, y
en el detalle «En pesos» abre la lista.

### Comportamiento

- **Las fichas** siguen el selector de la enmienda (b): un botón con `aria-haspopup="listbox"`
  que abre un panel con buscador (`combobox`). Con el teclado, las flechas mueven, Intro elige,
  Escape cierra y Tab sale.
- **Los nombres de las fichas** son «Moneda que envías: peso chileno, CLP», «Destino: Estados
  Unidos, USD» y, de vuelta, «Recibes en: peso chileno, CLP».
- **El panel abre hacia donde cabe** dentro del héroe, que esconde lo que se sale. Si tampoco
  cabe, la lista se acorta, con un piso de tres opciones.
- **El anillo de la caja** se enciende sólo con el foco en la cifra, no en la ficha.
- **El foco no se pierde** al dar vuelta la operación: se mueve la línea del cobro, no el precio
  con su botón.
- Al llegar desde fuera (`data-cotizar-destino`), el foco queda en la ficha de abajo.

### Pendientes que deja

- **Con VoiceOver en el iPhone:** cómo se lee el `summary` («Cobramos CLP 19.495, Ver detalle»,
  con su estado) y el aviso del cambio de sentido.
- **La tarjeta «lo que ves al cotizar» de `/tarifas`** sigue enseñando el desglose abierto, que es
  lo que se ve al abrir el detalle.
- **«de mercado» sale de la tarjeta**, para que el precio quepa junto al botón; lo siguen diciendo
  el glosario, `/tarifas` y `/precio`. Si Compliance lo quiere en el cotizador, vuelve como
  «Precio referencial de mercado».

`REQUIERE VALIDACIÓN DE COMPLIANCE` — «Cobramos» y su cifra, y la nota del riel con el destino
nombrado.

---

## Enmienda — 2026-10-28 (b) · el detalle completo, en una pestaña

*Cowork, entrega `compacto2-`. Las tres decisiones son de Sebastián, de la tarde del mismo día,
con el cotizador compacto ya integrado y Global66 abierto al lado.*

**Por qué.** Con la tarjeta compacta delante, Sebastián:

- sacó «Cobramos CLP 19.495», porque «eso ya se sabe en el detalle»;
- pidió el esquema del de Global66 «tal cual […] al clickear en ver detalle se abra una pequeña
  pestaña con el detalle completo»;
- pidió «Costos operacionales» en 0, «para que sea llamativo».

### Lo que cambia

| | desde la mañana | desde esta enmienda |
|---|---|---|
| **El tramo** | «Cobramos CLP 19.495 · Ver detalle», el precio y «Sin comisiones ocultas.» | **el precio y, en la línea de abajo, «Sin comisiones ocultas.» y «Ver detalle»**. La tarjeta no dice lo que cobramos |
| **El detalle** | se desplegaba en el tramo (`details`) | **se abre en un diálogo modal**, «Detalle completo», centrado en escritorio y en el teléfono, como el de Global66. Lo cierran «Cerrar», Escape y un clic en el fondo; el foco vuelve a «Ver detalle» y la página de atrás no se desplaza mientras está abierto |
| **Las filas** | costo de envío, comisión y monto a convertir | **las de Global66, en su orden**: Envías · Lo que cobramos, y debajo, más chicas y entradas, Costo de envío, Comisión de cambio con su % y **Costos operacionales: CLP 0**, en verde · Monto a convertir · Precio referencial · Llega aprox. a {destino} |
| **Los signos** | «− CLP 500» | **«CLP 500»**, sin signo, como en un recibo: debajo de «Lo que cobramos» se lee que se descuenta |
| **De vuelta a pesos** | el precio antes del cobro | el diálogo sigue la cuenta: Conviertes · Precio referencial · En pesos · Lo que cobramos y sus partes · Recibes aprox. |
| **El alto, a 390** | 545 px | **522 px** |

**Lo que hace mejor que Global66:**

- **Escape cierra.** En Global66, no.
- **El foco vuelve al botón que lo abrió.** Allá se va al principio de la página.
- **El foco no sale del diálogo** mientras está abierto: es un `<dialog>` con `showModal`.

**Lo que no cambia:**

- las fichas y el botón de vuelta;
- «Precio referencial, sin recargo» y «Sin comisiones ocultas.» a la vista;
- la nota del riel;
- los avisos;
- la barra móvil;
- el mensaje de WhatsApp.

### Anatomía del tramo (reemplaza la de la enmienda de la mañana)

```
│   │  Precio referencial, sin recargo   ( ⇅ )  │  ← botón de vuelta, 44 px
│   ●  1 USD = 919,70 CLP                       │
│   │  Sin comisiones ocultas.    Ver detalle ⌄  │  ← abre el diálogo, 44 px
```

### El diálogo

```
┌ Detalle completo                    Cerrar (×) ┐
│ Envías                           CLP 2.000.000 │
│ ───────────────────────────────────────────── │
│ Lo que cobramos                     CLP 19.495 │
│     Costo de envío                     CLP 500 │
│     Comisión de cambio 0,95 %       CLP 18.995 │
│     Costos operacionales                 CLP 0 │  ← en verde
│ ───────────────────────────────────────────── │
│ Monto a convertir                CLP 1.980.505 │
│ ───────────────────────────────────────────── │
│ Precio referencial          1 USD = 919,70 CLP │
│ ───────────────────────────────────────────── │
│ Llega aprox. a Estados Unidos     USD 2.153,43 │
└────────────────────────────────────────────────┘
```

Es una `dl`. Las partes de lo que cobramos son filas de la misma lista, no una lista dentro de
otra: una `dl` admite un solo nivel de `div` entre ella y sus pares.

`REQUIERE VALIDACIÓN DE COMPLIANCE`:

- «Lo que cobramos» y sus cifras;
- «Costos operacionales: CLP 0»;
- que la tarjeta ya no diga lo que cobramos sin abrir el detalle.

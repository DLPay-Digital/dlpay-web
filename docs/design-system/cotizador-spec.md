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
| `to_usd` — Convertir a dólares | CLP | USD | El caso principal |
| `to_clp` — Convertir a pesos | USD | CLP | La vuelta |

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

**Lo que NO se retira y por qué**, para que quede escrito antes de que alguien lo intente: la nota
del **dólar digital** —«Recibes dólar digital en tu billetera… No depositamos en cuentas bancarias
en el extranjero»— la exige este mismo spec en §42, y no como estilo: *«El dólar digital es el riel
y se explica en una nota permanente **dentro del propio cotizador**»*. Esa frase es la mitigación
del claim marcado que la acompaña —`REQUIERE VALIDACIÓN DE COMPLIANCE` por mostrar «USD» cuando lo
que se entrega es dólar digital— y también de la regla dura de `CLAUDE.md` §1, que prohíbe
**sugerir** un depósito bancario en el extranjero. Sin la nota, el cotizador dice «USD» junto a una
cifra y un botón, y nada explica que no es un dólar en un banco.

**Qué queda del cotizador en texto:** las dos etiquetas de campo, la etiqueta del precio, «Sin
comisiones ocultas: el precio ya incluye el spread», la nota del dólar digital y el botón. De seis
bloques de prosa a tres.

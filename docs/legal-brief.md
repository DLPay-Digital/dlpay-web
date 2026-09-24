# Páginas legales — qué falta y quién lo decide

> **Para:** Compliance (Joaquín) y dirección de DLPay.
> **De:** Claude Code, bajo supervisión de Sebastián Villanueva. **Fecha:** 2026-09-04.
>
> **Claude Code no redacta textos legales vinculantes** (CLAUDE.md §7). Este documento reúne lo
> que la web necesita, lo que ya se publicó, y las contradicciones que Fase 0 encontró en los
> documentos actualmente vigentes. Las decisiones son de DLPay.

---

## 1. Estado de las cuatro rutas

| Ruta | Estado | Qué falta |
|---|---|---|
| `/tarifas` | **Publicada con contenido real.** Explica cómo se compone el precio, qué lo mueve y el monto mínimo. | La **tabla de comisiones, tipo de cambio y spread** que los T&C comprometen. Depende de D5. |
| `/canal-de-denuncias` | **Publicada con contenido real.** Para qué sirve, qué incluir, qué ocurre después, plazo de 10 días hábiles. | Confirmar la base legal del canal y la **dirección de correo formal**. |
| `/terminos` | Publicada como **página de estado**. Declara lo que rige hoy y ofrece el documento vigente por WhatsApp. | **El texto completo.** Lo redacta y aprueba Compliance. |
| `/privacidad` | Publicada como **página de estado**. Declara lo verificable sobre esta web. | **El texto completo**, reescrito al marco chileno. |

Ninguna ruta da 404. Ninguna publica texto legal inventado.

---

## 2. Contradicciones a resolver antes de publicar

Estas son de Fase 0 y **siguen abiertas**. Cada una es un riesgo real, no una formalidad.

### 2.1 Razón social — bloqueante

Los T&C y la Política de Privacidad **publicados hoy** nombran a **DLPZ PRO SpA**,
RUT 78.378.714-8, domiciliada en Viña del Mar. La web nueva usa **DLPZ INCZ SpA**, confirmado
internamente.

**No se pueden publicar páginas legales bajo una razón social que contradiga el contrato vigente.**
O el contrato se actualiza, o la web usa la entidad del contrato. Es lo primero que hay que cerrar.

*(CLAUDE.md §13, D9)*

### 2.2 Correo de contacto — bloqueante para el canal de denuncias

Los T&C indican `contacto@dlpay.cl`. La Política de Privacidad indica `contacto@dlpzpro.cl`.
Son dos direcciones distintas para el mismo propósito, en dos documentos vigentes.

La web **no publica ninguna** hasta que se confirme cuál es. Una dirección equivocada en un canal
de reclamos es peor que no tenerla.

### 2.1b Cerradas el 2026-09-24 — razón social y correo

**Razón social: DLPZ PRO SpA** (D9). Se elige la de los T&C y la Política publicados, no la que la
web venía usando. El motivo por el que D9 bloqueaba era la contradicción con el contrato vigente, y
así desaparece.

**Correo oficial: `contacto@dlpay.cl`** (D19), el que indican los T&C. Publicado en
`/canal-de-denuncias`. **La Política de Privacidad publicada dice `contacto@dlpzpro.cl`**: eso es
una discrepancia del documento, no de la web, y se corrige al reescribirlo (§2.4).

**Lo que el cambio de razón social arrastra, y no está cerrado:** el pie publica «*[razón social]*
está registrada y supervisada por la UAF» y «Socio de FinteChile». Las dos las afirmó Sebastián el
2026-09-07 **sobre DLPZ INCZ SpA**. Un registro ante la UAF pertenece a un RUT y la membresía de un
gremio también, así que hay que confirmar que ambas son de **DLPZ PRO SpA**. Anotado en
`lib/config/alliances.ts`, donde el campo `verified` retira emblema y frase de una vez si hiciera
falta.

### 2.3 El alcance descrito ya no coincide con el servicio

Los T&C publicados describen **custodia de criptoactivos**, tesorería transfronteriza, pagos B2B y
liquidaciones internacionales.

El servicio que la web comunica desde el 2026-09-04 es más acotado y más preciso: **cambio de
divisas con entrega de dólar digital en la billetera del cliente**, sin depósito en cuentas
bancarias en el extranjero.

**Preguntas para Compliance:**
- ¿DLPay presta un servicio de **custodia**? Si no, el término debería salir de los T&C.
- ¿"Liquidaciones internacionales" describe lo que se hace hoy?
- ¿El contrato refleja que la entrega es en dólar digital y que la conversión a moneda local en
  destino es un proceso ajeno?

### 2.4 La Política de Privacidad vigente está desalineada

Es una plantilla genérica orientada a GDPR ("estándares internacionales", "72 horas") que **no
corresponde al marco chileno** que los propios T&C invocan: Ley 19.628 y su actualización por la
Ley 21.719. Además menciona *"cookies y herramientas analíticas"* que **este sitio no usa**.

La reescritura debe partir del marco chileno, no traducirse desde una plantilla europea.

### 2.5 Los documentos viven fuera del control de DLPay

Hoy los PDF legales están en un bucket S3 **de Guita**. Al publicarse en el sitio propio, DLPay
recupera el control de sus propios documentos. Conviene coordinar la retirada de los PDF antiguos
para que no queden dos versiones circulando.

---

## 3. Qué debe contener cada documento

### `/terminos`
Base sugerida a partir de lo que los T&C vigentes ya cubren (Fase 0, Frente 11), a revisar:
identificación de la entidad · descripción del servicio **acotada al alcance real** · precio,
spread y su divulgación · verificación de identidad y sus requisitos · operación sólo con fondos
del titular · irreversibilidad de las operaciones con dólar digital · advertencia de riesgo ·
límites de responsabilidad · prohibiciones de uso · marco de datos personales · derechos del
consumidor (Ley 19.496, SERNAC, derecho irrenunciable) · resolución de controversias · vigencia y
modificaciones.

### `/privacidad`
Marco chileno (Ley 19.628 + 21.719) · qué datos se recogen y con qué finalidad · base de
licitud · plazos de conservación (incluida la que impone la normativa de prevención de lavado, si
aplica) · encargados y terceros que tratan datos · transferencias internacionales si existen ·
derechos del titular y **cómo ejercerlos, con un canal que funcione** · seguridad · cookies:
declarar que no se usan, que es lo verificable hoy.

### `/tarifas`
La tabla que los T&C comprometen. **Depende de D5**: si la web muestra la lógica de tramos de
spread o sólo un precio referencial. Hasta que se decida, la página explica el mecanismo sin
publicar cifras.

### `/canal-de-denuncias`
Confirmar la base legal del canal (Fase 0, I18) y la dirección formal.

---

## 4. Lo que la web ya afirma y necesita respaldo

Está marcado en el código como `REQUIERE VALIDACIÓN DE COMPLIANCE`. Se encuentra con
`grep -rn "REQUIERE VALIDACIÓN DE COMPLIANCE" src/`.

| Afirmación | Dónde | Nota |
|---|---|---|
| Los fondos se verifican en la cuenta de DLPay en **BCI** | Home, `/confianza` | Mención del banco por nombre |
| **~5 minutos** desde el pago confirmado | Home, `/como-funciona` | Es el tiempo de nuestra operación, no de una recepción bancaria |
| **10 días hábiles** de respuesta a un reclamo formal | `/canal-de-denuncias` | Tomado del texto de los T&C vigentes |
| El precio **ya incluye el spread** | Cotizador, `/tarifas` | Es el claim central de transparencia |

---

## 5. Lo que la web deliberadamente NO afirma

Decisión de producto, no omisión. Está en `/confianza` a la vista del usuario.

- No se afirma estar regulado por la CMF.
- No se publican cifras de clientes ni de volumen.
- No se publican testimonios.
- No se promete rentabilidad ni protección del capital.
- **No se afirma que DLPay deposite en cuentas bancarias en el extranjero.**

---

## 6. Orden sugerido

1. **Razón social** (§2.1). Bloquea todo lo demás.
2. **Correo oficial** (§2.2). Desbloquea el canal de denuncias.
3. **Alcance real en los T&C** (§2.3). Define qué dice el contrato.
4. Reescritura de la **Política de Privacidad** (§2.4).
5. **Decisión de spread** (D5) → tabla de `/tarifas`.
6. Retirada coordinada de los PDF antiguos (§2.5).

Los pasos 1 a 3 no requieren trabajo de la web: son decisiones. Cuando estén, publicar los textos
es cuestión de horas, porque las páginas ya existen y están conectadas.

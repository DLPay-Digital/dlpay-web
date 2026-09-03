# Fase 2.5 — Definición de la Experiencia DLPay

> **Propósito:** convertir lo aprendido en Fases 0–2 en **decisiones concretas** para construir la web.
> No es investigación nueva. **Fecha:** 2026-09-03. **Autor:** Claude Code (sup. Sebastián Villanueva).
> Al aprobarse este documento se **cierra la dirección v1** y recién entonces se pasa a Fase 3
> (arquitectura). **No se escribe código de producción todavía.**

---

## 0. Assets de marca — confirmados

Analizados los logos oficiales en `logos/logo 1.png` y `logos/logo 2.png`:

| Asset | Valor | Confianza |
|---|---|---|
| **Isotipo** | Monograma **D+P** en verde, angular, con una **cola diagonal en punta hacia abajo-izquierda** (vector de movimiento / avance). Letterform propio. | Verificado visualmente |
| **Lockup** | Isotipo como "D" + "LPAY" (grotesca pesada, terminaciones ligeramente cortadas/con carácter) + "DIGITAL" (tracked, debajo). | Verificado visualmente |
| **Verde DLPay** | **`#16C784`** — H≈157°, S≈80%, L≈43%. Verde medio / calipso. | Muestreado del logo (PNG reducido, ±2 por canal). `PENDIENTE`: confirmar con un asset vectorial si existe. |
| **Tinta DLPay** | **`#0B1320`** — navy muy oscuro (H≈216°), casi negro con sesgo azul. Del wordmark "LPAY". | Muestreado del logo. `PENDIENTE`: confirmar con vectorial. |
| **Grafía comercial** | **DLPay** (mixta). | Confirmado por Sebastián |
| **Razón social** | **DLPZ INCZ SpA** — dato legal; va en footer y páginas legales, **no** es protagonista comercial. | Confirmado por Sebastián |

**El verde real (`#16C784`) reemplaza al `#19A071`** que se había tomado del sitio de Guita.

**ADN geométrico:** el sistema geométrico de la dirección A×C se deriva del **propio isotipo** —
planos angulares, un **corte diagonal** (~30–35°), una **punta/cuña direccional**. **No** de redes
de nodos. Regla dura (de Sebastián): **el componente geométrico siempre representa movimiento,
flujo de valor o un paso de un proceso. Nunca decoración.**

---

## 1. Propuesta de valor principal

**Qué debe entender una persona en los primeros segundos:**
> DLPay compra y vende **dólar digital** (USDT/USDC) **al precio del mercado**, con **una persona
> que te atiende** y cierra la operación **en minutos**. Sirve para **personas** y para **empresas**.

**Qué problema resolvemos:**
- **Personas:** acceder al dólar de forma rápida, sin depender de los horarios, días hábiles y
  burocracia de un banco. Guardar y mover dólares sin abrir cuenta en el extranjero.
- **Empresas / tesorería / operadores:** mover **mayores volúmenes** de cambio con **rapidez,
  liquidez, atención personalizada y confianza** — donde un banco es lento y una app retail no
  alcanza.

**Qué nos diferencia:**
1. **Precio real de mercado + spread transparente** — no un tipo de cambio inflado con la comisión
   escondida adentro.
2. **Rápido de verdad + humano** — operación en ~5 minutos, cerrada con una persona por WhatsApp.
   No es una limitación: es la propuesta.
3. **Especializados** — una mesa de cambio de dólar digital, no una super-app con veinte funciones.
4. **Local** — banca chilena (BCI), equipo en Chile, cumplimiento chileno. Frente a apps offshore.
5. **Personas y empresas** — la misma mesa atiende a ambos.

**Statement candidato (a validar):**
> "El dólar digital, al precio real del mercado. Con una persona que cierra tu operación en minutos."

---

## 2. Estructura de la Home

Orden y decisión. `P0` = imprescindible v1 · `P1` = v1 si alcanza el tiempo · `P2` = después.

| # | Sección | Contenido | Decisión |
|---|---|---|---|
| 1 | **Hero** | Headline (≤ 8 palabras) + subline + **el cotizador** ocupando el primer viewport. Trust strip corto debajo (3 puntos respaldables). | `P0` |
| 2 | **Cómo funciona (resumen)** | 3–4 pasos que unen web + WhatsApp + KYC, con tiempos. Link a `/como-funciona`. | `P0` |
| 3 | **Por qué DLPay / Confianza** | 3 puntos que DLPay **puede respaldar hoy** (banco de por medio · ~5 min · equipo en Chile). Sin cifras inventadas. Link a `/confianza`. | `P0` |
| 4 | **Personas / Empresas** | Una franja que **bifurca**: "Para ti" (queda en la Home) · "¿Tu empresa opera volúmenes?" → `/empresas`. | `P0` |
| 5 | **Banda Empresas / Tesorería** | Pitch corto B2B + CTA a `/empresas`. (Puede fusionarse con la #4.) | `P1` |
| 6 | **FAQ (3–4)** | Sólo las objeciones reales antes de la 1ª operación. Link a `/faq`. | `P1` |
| 7 | **Footer** | Producto · Contacto (WhatsApp) · **Legal** (Términos, Privacidad, **Tarifas**, Canal de denuncias) · razón social **DLPZ INCZ SpA**. | `P0` |

**Secciones que NO van en la Home (innecesarias / diferidas):**
- **Página "Personas" separada** — la Home ya habla a personas; no se justifica.
- **Blog / novedades** — sin plan de contenido. `P3`.
- **Testimonios** — no hasta validar veracidad y consentimiento (Fase 0 I15).
- **Grid genérico de "6 beneficios"** — lo reemplaza la sección #3 con 3 puntos respaldables.
- **"Nosotros / equipo"** como sección de Home — vive en `/confianza` o el footer. `P2`.
- **Múltiples CTAs compitiendo** — una sola acción primaria: **cotizar**.
- **Cifras grandes de vanidad** (usuarios, volumen) hasta tener el dato verificable.

---

## 3. Flujo completo de cotización

Modelo confirmado: **monto → precio referencial → WhatsApp → ejecutivo confirma el precio final.**

| Paso | Qué pasa | Notas |
|---|---|---|
| **Entrada** | El usuario llega a la Home o a `/cotizar` (link de WhatsApp, recurrente). | El cotizador está siempre en el primer viewport. |
| **Compra vs venta** | Toggle "Quiero comprar / Quiero vender". Por defecto: comprar. | Cambia las etiquetas (Pago/Entrego) y el mensaje de WhatsApp. |
| **Monto** | Campo CLP por defecto, editable. Campo USDT editable también (**bidireccional**). Formato con separador de miles chileno. Teclado numérico en móvil. | *Debounce* corto antes de recalcular. |
| **Precio referencial** | Se muestra `[valor de muestra configurable]` CLP/USDT + timestamp ("hace un momento") + etiqueta de fuente de mercado (`[pendiente]`). | **Hoy: valor de muestra editable.** No hay integración con pricing. |
| **Resultado** | "Recibes aprox. X USDT". Nota: "Sin comisiones ocultas: el precio ya incluye el spread." | El número es tabular, protagonista. |
| **CTA** | **"Cotizar este monto por WhatsApp"** → abre `wa.me/56977615921` con el **mensaje prellenado** (monto + dirección de la operación + precio referencial). Enlace secundario: "crea tu cuenta para operar en línea". | H7 (Fase 1): prellenar baja fricción y trabajo del ejecutivo. |
| **Confirmación humana** | El ejecutivo confirma el precio final según monto y momento del mercado. | Fuera de la web. |
| **Después** (fuera de la web) | Transfieres en pesos → verificamos en el banco → recibes los USDT en tu wallet (~5 min desde el pago). | Se explica en `/como-funciona`. |

**Estados y errores:**
| Estado | Comportamiento |
|---|---|
| Inicial / escribiendo | Monto de ejemplo cargado; *debounce* ~650 ms. |
| Calculando | Shimmer **sobre el número** (no spinner que bloquea el formulario). |
| Resultado | Recibo estimado + precio + timestamp + nota del spread. |
| Bajo el mínimo | Inline: "Monto mínimo: `[CLP 50.000]`". El CTA a WhatsApp sigue disponible. |
| Mercado moviéndose | "El mercado se está regulando. Reintenta en unos minutos o escríbenos." El CTA pasa a "Escríbenos por WhatsApp". (Reusa el lenguaje real del equipo.) |
| Sin conexión / error | "No pudimos traer el precio ahora. Escríbenos y te cotizamos." Nunca un error seco. |

**Arquitectura (sin sobreingeniería):** el precio se lee a través de **una interfaz `PriceSource`
con una sola implementación hoy** (`ConfigPriceSource` — valor de muestra configurable). Mañana se
agrega `DLPayApiPriceSource` y se cambia por variable de entorno, **sin tocar el componente de UI**.
Nada más. La cadena `Market Price → Pricing/Spread DLPay → Quote → UI` se respeta a nivel de tipos,
no de infraestructura.

---

## 4. Experiencia Persona vs Empresa

`RECOMENDACIÓN`:

| | Persona | Empresa / Tesorería |
|---|---|---|
| **Entrada** | Home (experiencia principal) | Home → franja "¿Tu empresa opera volúmenes?" → `/empresas` |
| **Acción central** | Cotizar → WhatsApp | Cotizar (mismo cotizador) **o** formulario de contacto B2B |
| **Onboarding** | Registro + **KYC** | Registro + **KYB** (documentos de la empresa) |
| **Atención** | WhatsApp, un ejecutivo | Ejecutivo **asignado**, condiciones y límites acordados |
| **Lenguaje** | "compra/vende dólar digital rápido" | "cambio de divisas, tesorería, liquidez, operaciones recurrentes" |

**Cómo conviven en la Home:**
- La Home **no** se vuelve corporativa. Su experiencia principal es cotizar, y eso **sirve a ambos**.
- Una **franja de bifurcación** clara (sección #4) reconoce a la empresa y la lleva a su
  experiencia dedicada.
- `HIPÓTESIS`: el cotizador puede tener un guiño contextual — si el monto supera cierto umbral,
  un mensaje discreto "¿Operas montos así seguido? Conoce DLPay Empresas". A validar; no
  imprescindible v1.

**Qué queda para `/empresas` (página dedicada):** casos de uso B2B (pagos a proveedores,
tesorería, conversión recurrente), condiciones y proceso KYB, formulario de contacto con
ejecutivo, y — a futuro — API. `/empresas` existe en **v1** pero puede ser una página simple.

---

## 5. Sistema de confianza

**Qué podemos comunicar HOY (respaldable, sin afirmaciones regulatorias):**
- Los **fondos pasan por el banco**: recibimos y verificamos tu transferencia en la cuenta de
  DLPay en **BCI** antes de entregarte el dólar digital.
- **Operación en ~5 minutos** (desde el pago confirmado hasta los USDT en la wallet).
- **Equipo en Chile**, con nombre y rol.
- **Atención por WhatsApp con una persona real**, en horario indicado.
- **Precio atado al mercado + spread informado** (demostrado en el cotizador).
- **KYC/KYB obligatorio** para todos — requisito de seguridad y cumplimiento.
- **Entidad chilena** (DLPZ INCZ SpA), marco legal chileno.
- **Páginas legales completas y accesibles** (hoy `/tarifas` y `/privacidad` dan 404 — se crean).

**Qué evidencia necesitamos antes de publicar:**
- N° de clientes / volumen operado → dato verificable.
- Testimonios → veracidad + consentimiento (Fase 0 I15).
- Logos de "empresas que confían" → autorización de cada empresa.
- Años operando / track record → confirmar cifra.
- Certificaciones o sellos de seguridad.

**Cómo transmitir seguridad sin afirmaciones regulatorias que no podamos respaldar:**
- **NO** decir "regulados por la CMF" ni equivalentes. *(El estado regulatorio está fuera del
  alcance de este proyecto; cualquier mención regulatoria en la web = `REQUIERE VALIDACIÓN DE
  COMPLIANCE` por Joaquín, nunca por defecto.)*
- **SÍ** mostrar el **mecanismo**: el banco de por medio, la doble verificación, el proceso paso
  a paso, las personas reales, los tiempos concretos, el lenguaje honesto ("precio referencial,
  no cerrado").
- La confianza se construye por **transparencia del proceso + contacto humano + presencia local**,
  no por badges.

---

## 6. Benchmark — decisiones

| Referente | Aprender | Adaptar | Evitar | Qué hace DLPay distinto |
|---|---|---|---|---|
| **Global66** | Cotizador en el hero; varias acciones visibles pero jerarquizadas; WhatsApp accesible | La calculadora como héroe con **una** acción primaria | Exceso de tarjetas, scroll larguísimo, degradados, estética "fintech amable" genérica | Una mesa especializada, no una super-app; registro "instrumento", no "app cercana" |
| **Buda** | Seriedad visual; seguridad y proceso al frente; datos/precio con oficio | El registro serio y contenido; mostrar el mecanismo | El argumento "regulados por la CMF" (DLPay no puede) | Confianza por proceso + humano + banca local, no por sello regulatorio |
| **Bithonor** | WhatsApp como pilar; "sin comisiones" como eje; pasos numerados (sí es secuencia) | El canal humano como propuesta | **Todo lo visual**: plantilla WordPress, tipografías genéricas, dos listas de pasos que compiten, redundancia | Identidad propia real (A×C con assets DLPay); una sola narrativa de proceso |
| **DolarApp** | Encuadre "dólares digitales / tu dinero en dólares" baja la barrera; anti-spread bancario | El encuadre "dólar digital" (no "compra cripto"); comparación honesta vs banco | Ser sólo mobile-app sin web de confianza | Web + humano; atiende empresas además de personas |
| **El Dorado** | "Explicar el mecanismo genera confianza"; encuadre "cuenta en dólares" | El principio de transparencia del mecanismo | El modelo P2P / reputación / escrow (DLPay es OTC, contraparte única) | La contraparte es DLPay: una sola relación, un ejecutivo, no un marketplace |
| **Wise** | Estándar de transparencia: tipo de cambio y comisión **por separado**; "tarifa garantizada por X" | Mostrar la referencia de mercado + el spread; "sin comisiones ocultas" **demostrado** | Prometer una cotización cerrada/bloqueada que la web no puede ejecutar hoy | Precio referencial honesto + cierre humano — no fingir automatización que no existe |
| **Fintual** | La **voz** (español chileno plano) como diferenciador; página "Seguridad y confianza" | El tono y la página de confianza dedicada | Jerga, corporativismo | Voz directa de mesa de operaciones + cercanía humana |

**Qué puede hacer DLPay de manera diferente (síntesis):** ser la **mesa de cambio de dólar digital
más rápida, más directa y más transparente de Chile**, con **una persona de verdad** cerrando cada
operación — para personas y para empresas — con una **identidad visual de instrumento financiero
propio**, no de fintech intercambiable.

---

## 7. Contenido actual — clasificación

Basado en la web actual (`dlpay.cl`, provista por Guita) y en Fase 0.

**CONSERVAR:**
- El concepto de **cotizador en tiempo real** en el hero.
- El canal **WhatsApp** (+56 9 7761 5921) y su rol como cierre de la operación.
- La existencia de **páginas legales** (los T&C están razonablemente completos — se revisan, no se botan).
- La estructura de ideas "flujo de operación / KYC-AML / filosofía" (se reorganiza, no se descarta).
- El dominio **dlpay.cl** (sujeto a la auditoría de control de Fase 0).

**MEJORAR:**
- El **hero**: headline claro + cotizador protagonista + una sola acción.
- **"Cómo funciona"**: unir web + WhatsApp + KYC en un solo recorrido con tiempos concretos.
- La **jerarquía de CTAs**: hoy "Cotizar" y "Comenzar" compiten → una primaria (cotizar).
- La **Política de Privacidad**: hoy es una plantilla GDPR genérica ("DLPZ PRO SpA",
  `contacto@dlpzpro.cl`) → reescribir al marco chileno (Ley 19.628 + 21.719), con razón social y
  correo correctos. `REQUIERE VALIDACIÓN DE COMPLIANCE`.
- Los **claims** ("sin comisiones ocultas", "tipo de cambio verificado") → demostrarlos en el
  cotizador, no sólo afirmarlos.

**ELIMINAR:**
- **Degradados** y **cubos 3D isométricos**.
- El **grid genérico de "6 beneficios"**.
- Los **6 testimonios** con nombres/ciudades (hasta validar veracidad y consentimiento).
- La **nomenclatura mezclada** en comunicación comercial ("DLPay Digital", "DLPZ INCZ", "DLPZ PRO")
  → sólo **DLPay** comercial; **DLPZ INCZ SpA** en legales.
- La **dependencia visual del template multi-tenant de Guita** (Open Sans, patrones de Guita).

**CREAR DESDE CERO:**
- La **identidad visual A×C** con los assets reales de DLPay (verde `#16C784`, tinta `#0B1320`, isotipo).
- El **sistema geométrico propio** derivado del isotipo (planos angulares, corte diagonal, cuña).
- Páginas nuevas: **`/cotizar`**, **`/empresas`**, **`/confianza`**, **`/tarifas`** (hoy 404,
  referenciada por los T&C), **`/como-funciona`**.
- **FAQ** reescrita (objeciones reales, sin duplicación).
- **Footer** con razón social correcta y enlaces legales que resuelven.
- El **componente cotizador** con su interfaz `PriceSource` desacoplada.

---

## 8. Principios UX de DLPay

Guían todo el proyecto de aquí en adelante.

1. **Cotizar es el centro.** Todo lo demás sostiene esa acción. Una sola acción primaria por pantalla.
2. **Honestidad sobre el precio.** Es referencial, no cerrado; el spread se informa; nada se
   esconde en el tipo de cambio.
3. **Web y WhatsApp son una sola conversación.** El monto cotizado viaja al chat; el lenguaje y
   el formato coinciden con los del ejecutivo.
4. **Móvil primero.** Se diseña para el pulgar y se escala a desktop, no al revés.
5. **Confianza que se comprueba, no que se afirma.** Cero claims sin respaldo; cero afirmaciones
   regulatorias sin visto bueno de Compliance.
6. **El componente geométrico siempre tiene función** — movimiento, flujo de valor, o un paso de
   un proceso. Nunca decoración.
7. **Rápido de verdad.** Performance como parte del diseño: contenido estático primero, JS mínimo,
   lo único que "carga" es el precio.
8. **Personas y empresas caben, pero la Home no se vuelve corporativa.** La bifurcación es clara
   y tardía; la experiencia principal no se diluye.
9. **Español chileno, plano, directo.** "Dólar digital" antes que "stablecoin". Explicar en una
   frase, con enlace a más para quien lo quiera.
10. **Identidad propia, no plantilla.** Nada que se pueda confundir con otra fintech ni con una
    página generada por IA.

---

## 9. Qué cierra la dirección v1 (al aprobar este documento)

- **Dirección visual A×C confirmada como base de desarrollo** (no como identidad congelada — sigue
  evolucionando con la construcción).
- **Assets:** verde `#16C784`, tinta `#0B1320`, isotipo oficial. Tipografías: `PENDIENTE` de
  decidir en la exploración de UI (con un candidato que complemente el carácter del wordmark).
- **Arquitectura de información v1:** Home + `/cotizar` + `/como-funciona` + `/empresas` +
  `/confianza` + `/faq` + legales.
- **Flujo del cotizador** especificado (este documento §3).
- **Principios UX** (§8) adoptados.

## 10. Qué sigue (después de aprobar esto)

1. **Actualizar los mockups de Fase 2** con los assets reales (verde `#16C784`, tinta `#0B1320`,
   isotipo, sistema geométrico re-derivado, `/empresas`, footer DLPZ INCZ SpA). *(En curso.)*
2. **Tokens del design system** — documentados en `docs/` + un ADR.
3. **Fase 3 — Arquitectura:** ADRs de stack / hosting / DNS / repo; esqueleto del proyecto. **No antes.**

---

*Fin de la Fase 2.5. Al aprobarse, se cierra la dirección v1.*

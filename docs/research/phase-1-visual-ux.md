# Fase 1 — Exploración Visual & UX

> **Estado:** investigación y definición preliminar. **No** es desarrollo.
> No se ha escrito código, creado componentes, decidido stack, ni cerrado la identidad visual.
> **Fecha:** 2026-09-02. **Autor:** Claude Code (bajo supervisión de Sebastián Villanueva).
> **Insumo previo obligatorio:** `docs/research/phase-0-findings.md` (no se rehace).

---

## 0. Taxonomía de marcadores

| Marcador | Significado |
|---|---|
| **HECHO** | Evidencia observable (página vista, dato publicado, patrón verificado). |
| **INFERENCIA** | Conclusión derivada de evidencia, no verificada directamente. |
| **HIPÓTESIS** | Algo que deberíamos validar en Fase 2 (test, prototipo, o con DLPay). |
| **RECOMENDACIÓN** | Criterio propuesto por esta investigación. |
| **PENDIENTE** | Aún no determinable; depende de DLPay o de una etapa posterior. |

**Prioridades:** `P0` fundamental · `P1` alta · `P2` mejora · `P3` exploratorio.

**Fuera de alcance de Fase 1** (solo se anota como restricción si toca directamente UX/UI):
CMF / Ley Fintech / regulación, contratos, estructura societaria, migración de dominio,
infraestructura, backend, DevOps, stack, implementación.

---

## 1. Resumen ejecutivo

**Qué es DLPay, para efectos de esta web** (`HECHO`, de Fase 0): una **mesa de cambio OTC** de
dólar digital (USDT/USDC ↔ CLP) para personas y empresas, con **operación asistida por WhatsApp**
y **registro + KYC/KYB obligatorio** antes de operar. El precio es referencia de mercado + un
spread que varía por monto/volumen. La web actual la provee Guita; es correcta técnicamente pero
**genérica** y con acciones poco jerarquizadas.

**Qué descubrimos:**
- Los referentes fintech de LatAm que "funcionan" comparten un patrón claro: **la calculadora /
  cotizador es el héroe**, con una acción primaria inequívoca y el resto de acciones visibles sin
  saturar. Global66 lo hace bien; Bithonor lo hace mal (plantilla WordPress, dos listas de pasos
  que compiten, tipografías genéricas). `HECHO`.
- La **transparencia radical del precio** (mostrar la referencia de mercado y el margen por
  separado, "sin comisiones ocultas" demostrado, no solo afirmado) es el mayor diferenciador de
  confianza en la categoría — Wise es el estándar. `HECHO`.
- DLPay tiene un activo raro: un **modelo híbrido web + humano** ("cotiza en la web, opera con
  una persona en ~5 min"). Bien tratado, eso es una ventaja, no una limitación. `INFERENCIA`.
- DLPay **no puede** apoyarse en el argumento "regulados por la CMF" (a diferencia de Buda). Su
  historia de confianza debe construirse sobre **proceso claro + contacto humano + banca local
  (BCI) + presencia chilena + especialización**. `HECHO` (restricción de contenido).

**Problemas UX que la web nueva debe resolver** (`RECOMENDACIÓN`):
1. Que en los primeros ~5 segundos se entienda **qué es**, **qué puedo hacer** y **cómo empezar**.
2. Una **acción primaria inequívoca** (hoy compiten "Cotizar" y "Comenzar" sin jerarquía).
3. Un **cotizador honesto** que dé un precio referencial al instante y lleve a WhatsApp / registro
   sin prometer una cotización cerrada que la web todavía no puede ejecutar.
4. Una experiencia **web ↔ WhatsApp que se sienta una sola** (pasar el monto cotizado al chat).
5. **Móvil primero** (el tráfico probable viene de WhatsApp, redes y links compartidos).
6. Una **identidad propia** que no parezca plantilla de fintech ni de IA.

**Direcciones visuales prometedoras** (shortlist para Fase 2, `RECOMENDACIÓN`):
- **A · "Mesa de operaciones":** precisa, técnica, premium sobria; los números son el héroe.
- **C · "Sistema geométrico":** evoluciona el motivo de nodos del deck de BCI a un lenguaje
  gráfico propio que además explica el flujo del dinero.
- **B · "Claridad chilena":** plana, humana, de máxima confianza (opción segura / de respaldo).
- Hipótesis fuerte: **A con C como capa explicativa/estructural y la disciplina de copy de B.**

**Qué NO debemos decidir todavía:** identidad visual definitiva, tipografía, paleta, hex del
verde, stack, fuente de precio y fórmula del spread, si se construye auth/KYC propio, IA final.

Este documento se puede leer en ~10 minutos saltando a §17 (checkpoint).

---

## 2. Objetivos de Fase 1

Responder: **¿cómo debería verse y funcionar la nueva web de DLPay para ofrecer una experiencia
significativamente superior a la actual** en diseño, claridad, UX, conversión, confianza,
cotización, experiencia móvil y diferenciación**?**

Entregables: benchmark visual y de UX, patrones accionables, arquitectura de información
preliminar, exploración del cotizador, análisis mobile-first, y una **shortlist de direcciones
visuales** para explorar en Fase 2. No se implementa nada.

---

## 3. Metodología

- **Referentes accesibles directamente:** `bithonor.com` (se pudo cargar y analizar el HTML).
- **Referentes con bloqueo anti-bot (Cloudflare "Just a moment…"):** `global66.com/cl` y
  `buda.com/chile` no se pudieron cargar por `curl` ni por el fetch de la herramienta (HTTP 403).
  Se trabajó con: (a) una carga previa parcial de Global66 hecha en Fase 0, (b) búsquedas web,
  (c) conocimiento del producto. **Las observaciones visuales finas de estos dos referentes se
  marcan `INFERENCIA`** y deben confirmarse en Fase 2 con capturas manuales.
- **Referentes adicionales** (búsqueda + conocimiento): DolarApp, El Dorado, Wise, Vita Wallet,
  Fintual, y referencias de excelencia B2B/treasury (Mercury, Stripe, Airwallex).
- **No** se usó automatización de navegador (Playwright MCP no conecta; ver Fase 0 / inventario
  de entorno). Para Fase 2 conviene habilitarlo o tomar capturas manuales.
- Cada patrón se evalúa con la grilla de §3.1.

### 3.1 Grilla de análisis por hallazgo
1. ¿Qué observamos? 2. ¿Dónde? 3. ¿Por qué funciona? 4. ¿Qué problema del usuario resuelve?
5. ¿Podría funcionar para DLPay? 6. ¿Qué deberíamos probar? 7. ¿Qué **no** deberíamos copiar?

---

## 4. Benchmark visual

> Identidad visual observada. Donde no se pudo verificar en vivo, va `INFERENCIA`.

### 4.1 Global66 (`global66.com/cl`) — transferencias + cuenta global + tarjeta
- **Rol:** el referente que el brief de DLPay citó como positivo ("varias acciones importantes
  visibles + WhatsApp accesible").
- **Identidad** (`INFERENCIA`): marca violeta/púrpura sobre blanco; formas redondeadas; fotografía
  de personas + ilustración amable; acentos con degradado suave; **muchas tarjetas**; capturas de
  la app como recurso recurrente. Estética "fintech amable" pulida pero cercana al default de la
  categoría.
- **Tipografía** (`INFERENCIA`): sans geométrica/humanista de marca, tamaños grandes en hero,
  jerarquía clara.
- **Densidad:** media; scroll largo con muchas secciones y módulos.
- **Movimiento** (`INFERENCIA`): entradas suaves al hacer scroll (patrón default).

### 4.2 Buda.com (`buda.com/chile`) — exchange de cripto (BTC/ETH/USDT/USDC/CLP)
- **Identidad** (`INFERENCIA`, de conocimiento): más "exchange serio" que "fintech amable";
  paleta oscura/navy con un verde-teal de acento; UI limpia y contenida; tablas de precios y
  ticker; menos ilustración, más dato. Transmite oficio y seguridad.
- **Tono:** directo; asume algo de alfabetización cripto sin abrumar.
- **Señales de confianza al frente** (`HECHO`, de búsqueda): "regulados por la CMF (Ley 21.521)",
  90% de custodia en frío, seguro de custodia, 2FA, "desde 2015".
- **Aprendizaje para DLPay:** la seriedad visual + la seguridad explícita generan confianza en
  esta categoría; DLPay puede tomar el registro visual pero **no** el argumento "regulados por la
  CMF".

### 4.3 Bithonor (`bithonor.com`) — remesas a LatAm — **CONTRA-EJEMPLO**
- **Identidad** (`HECHO`, HTML analizado): WordPress + Elementor + WPBakery + tema `setech`.
  Tipografías cargadas: **Inter, Poppins, Roboto, Montserrat** (todas genéricas, varias a la vez).
  Colores: ámbar `#ffb800`, coral `#fa584d`, azul `#3b7eff` — combinación de plantilla.
- **Síntomas de plantilla:** **dos listas de pasos que compiten** en la misma página (una de 5
  "Crea una cuenta / Verifica / Agrega beneficiario / Selecciona cantidad / Confirma", otra de 4
  "Acceso / Regístrate / Transfiere / Listo"); secciones redundantes; widget tipo Trustpilot
  ("EXCELENTE · A base de 157 reseñas · Publicado en Google") incrustado; FAQ larguísima con
  texto duplicado.
- **Lo que sí hace y es correcto:** WhatsApp y correo en el header; "sin comisiones" como eje;
  "atención personalizada vía WhatsApp" como pilar; pasos numerados (aquí **sí** aplican porque
  es una secuencia real).
- **Qué NO copiar:** el stack de plantilla, la tipografía genérica, la redundancia de secciones,
  las dos listas de pasos, el degradado/relleno decorativo.

### 4.4 DolarApp — "dólares digitales" (USDC), cuenta global, tarjeta
- **Identidad** (`INFERENCIA`): de las LatAm mejor diseñadas; limpia, moderna, azul/oscuro, tipo
  grande y confiado, capturas de app protagonistas, poca decoración.
- **Posicionamiento** (`HECHO`, búsqueda): "protege tu dinero en dólares", "$0 comisiones", "tipo
  de cambio spot sin los spreads excesivos de los bancos", 4% cashback en la tarjeta.
- **Aprendizaje:** el encuadre "cuenta / dinero en dólares" (no "compra cripto") baja la barrera
  psicológica. El argumento anti-spread-bancario es potente y **DLPay lo puede usar**.

### 4.5 El Dorado — marketplace P2P de stablecoins + "cuenta en dólares"
- **Modelo** (`HECHO`, búsqueda): P2P (muchos vendedores), con **reputación + escrow + resolución
  de disputas** como mecanismo de confianza. "Envía USDT sin comisiones".
- **Diferencia con DLPay:** DLPay es **OTC** (la contraparte es DLPay, no un tercero). El modelo
  de reputación/escrow **no** aplica directo. Pero el patrón "**explicar el mecanismo genera
  confianza**" sí, y el encuadre "Cuenta / SuperApp del dinero" es una referencia.

### 4.6 Wise — estándar de FX y de cotizador
- **Identidad** (`HECHO`, conocimiento): verde brillante `#9FE870` sobre verde muy oscuro
  `#163300`; tipografía propia (**Wise Sans**) con carácter; mucho aire; números enormes;
  ilustración mínima. **No parece plantilla de nadie.**
- **Transparencia:** muestra el **tipo de cambio medio de mercado** y **su comisión por
  separado**; "los bancos esconden su comisión en el tipo de cambio" con tabla comparativa;
  **"tipo de cambio garantizado por X horas"** (expiración de cotización bien hecha); "debería
  llegar el [fecha/hora]".
- **Aprendizaje:** es el modelo a seguir para el cotizador y para "sin comisiones ocultas"
  **demostrado**, no solo afirmado.

### 4.7 Vita Wallet — pagos internacionales, fintech chilena (Vita Solutions SpA)
- **Identidad** (`INFERENCIA`): púrpura/magenta + oscuro, moderna, app-forward.
- **Aprendizaje:** separación clara **Personas / Empresas (Vita Business)**; referente local de
  cómo abrir un carril B2B sin fragmentar la marca.

### 4.8 Fintual — wealthtech chilena regulada — referente de **tono y confianza**
- **Identidad** (`INFERENCIA`): mucho aire, ilustración cálida y humana propia (no stock), color
  contenido, tipografía con algo de carácter.
- **Copy** (`HECHO`, conocimiento): español chileno plano y cercano ("la mejor decisión para tu
  plata"), cero jerga, página **"Seguridad y confianza"** dedicada.
- **Aprendizaje:** el mayor diferenciador de Fintual es la **voz**. DLPay puede ganar mucho con
  copy chileno directo y honesto.

### 4.9 Referencias de excelencia B2B / treasury (fuera de la categoría, patrones aplicables)
- **Mercury** (`INFERENCIA`): banca para startups; extremadamente contenida, paleta apagada y
  específica, tipo grande y seguro, cero relleno. Prueba de que "fintech seria" puede ser
  distintiva sin ser fría.
- **Stripe** (`INFERENCIA`): el degradado **bien hecho** (sutil, propio, nunca decorativo), grid
  preciso, densidad de información alta pero legible.
- **Airwallex** (`INFERENCIA`): tesorería transfronteriza B2B; cómo comunicar "operaciones
  grandes" con seriedad.

### 4.10 La web actual de DLPay (base a superar)
`HECHO` (Fase 0): verde con **degradados** y **cubos 3D isométricos**; hero "Compra y vende dólar
digital como nunca antes"; cotizador en tiempo real (contra `api.guita.cl`); 6 testimonios; grid
de 6 beneficios; 3 secciones de producto; CTA "Cotizar" → WhatsApp y "Comenzar" → registro.
**Problemas:** patrones que el propio equipo quiere evitar (degradados, 3D decorativo), acciones
sin jerarquía, identidad de plantilla multi-tenant.

---

## 5. Benchmark UX

### 5.1 Hero y acción primaria
- `HECHO` (Global66, Wise, DolarApp): el patrón ganador es **calculadora/cotizador en el hero**
  + **una** acción primaria clara justo debajo ("Crea tu cuenta y transfiere").
- `HECHO` (Bithonor): cuando hay **varias** acciones sin jerarquía ("Regístrate" repetido, dos
  listas de pasos), el usuario no sabe qué hacer.
- `RECOMENDACIÓN` para DLPay: hero = cotizador + **1 acción primaria** ("Cotizar por WhatsApp" o
  "Ver mi precio") + **1 secundaria** ("Crear cuenta") + WhatsApp siempre visible en la barra.
  El brief pidió "varias acciones visibles como Global66" — sí, pero con **una** claramente
  dominante para no repetir el problema de Bithonor.

### 5.2 Navegación
- `HECHO` (Buda, DolarApp, Wise): navegación **corta** (4–6 ítems), sin megamenús.
- `HECHO` (Vita): separación **Personas / Empresas** en la nav.
- `RECOMENDACIÓN`: nav mínima — `Cotizar · Cómo funciona · Empresas · Confianza` + `WhatsApp` +
  `Iniciar sesión / Crear cuenta`. Nada más en la primera versión.

### 5.3 Cantidad de decisiones del usuario
- `HECHO` (Wise, DolarApp): el hero pide **una sola decisión** (¿cuánto?). Todo lo demás es
  progresivo.
- `RECOMENDACIÓN`: en el primer viewport, la única decisión debe ser **el monto**. Moneda origen
  por defecto CLP; destino USDT; ambas editables pero no obligatorias de tocar.

### 5.4 Claridad de textos
- `HECHO` (Fintual): copy plano, chileno, sin jerga → confianza.
- `HECHO` (Bithonor): copy redundante y de marketing genérico → ruido.
- `RECOMENDACIÓN`: voz directa, chilena, sin tecnicismo cripto innecesario. "Dólar digital" >
  "stablecoin" en la landing; explicar USDT **en una frase**, con un enlace a más detalle para
  quien lo quiera.

### 5.5 Onboarding / registro / KYC
- `HECHO` (El Dorado, DolarApp): "verifica tu identidad en ~10 min / ~1 min", tiempos explícitos
  reducen la ansiedad.
- `HECHO` (Fase 0): en DLPay el registro/KYC vive en la plataforma de Guita; la web nueva **no**
  lo reconstruye — enlaza.
- `RECOMENDACIÓN`: antes de mandar al registro, la web debe **explicar qué sigue** (registro →
  documentos → validación → habilitado para operar) y **cuánto demora**, para que el salto a la
  plataforma de Guita no se sienta un corte abrupto.

### 5.6 Formularios, errores, estados, feedback
- `HECHO` (Wise): validación **inline**, mínimos/máximos claros, el CTA cambia según el estado
  ("Continuar" → "Confirmar").
- `RECOMENDACIÓN` para el cotizador: ver §11 (estados detallados).

### 5.7 Prueba social y confianza (cómo la construyen)
- `HECHO` (Buda): regulación + años + custodia + seguro.
- `HECHO` (Bithonor): reseñas Google/Trustpilot + logos de "empresas que confían".
- `HECHO` (Wise): comparativa "banco vs Wise" + millones de clientes + rating.
- `HECHO` (El Dorado): el **mecanismo** (escrow, disputas) explicado.
- `RECOMENDACIÓN` para DLPay: como no hay sello CMF ni (aún) cifras verificadas, la confianza se
  construye con: **proceso explicado paso a paso + banca BCI + equipo real con nombre + contacto
  humano por WhatsApp + tiempos concretos ("~5 min") + presencia y cumplimiento local**. Ver §14.

---

## 6. Patrones identificados

| # | Patrón | Dónde se ve | Por qué funciona | ¿Para DLPay? | Adoptar / Adaptar / Evitar |
|---|---|---|---|---|---|
| 1 | Cotizador/calculadora en el hero | Global66, Wise, DolarApp | La primera pregunta del usuario es "¿cuánto me cuesta / recibo?" | Sí — es la consulta #1 por WhatsApp hoy | **Adoptar** (`P0`) |
| 2 | "Tú envías / Tú recibes" bidireccional | Wise, Global66 | Modelo mental directo; editar cualquier lado | Sí | **Adoptar** (`P1`) |
| 3 | Referencia de mercado + margen mostrados por separado | Wise | Demuestra "sin comisiones ocultas" en vez de solo afirmarlo | Sí, si DLPay acepta divulgar el margen | **Adaptar** (`P1`, depende de decisión de pricing — Fase 0 I11) |
| 4 | Cotización con validez ("garantizada por X h") | Wise | Honestidad sobre volatilidad; urgencia real | Solo cuando exista API de precio propia | **Evitar por ahora / futuro** (`P3`) |
| 5 | Una acción primaria inequívoca en el hero | Global66, DolarApp | Elimina la parálisis de decisión | Sí — hoy compiten "Cotizar" y "Comenzar" | **Adoptar** (`P0`) |
| 6 | WhatsApp humano como pilar, no como fallback | Bithonor, y el propio modelo DLPay | El público valora hablar con una persona en montos altos | Sí — es una ventaja de DLPay | **Adoptar** (`P0`) |
| 7 | Tiempos explícitos ("~5 min", "verificación ~10 min") | El Dorado, DolarApp | Reduce la ansiedad del proceso | Sí | **Adoptar** (`P1`) |
| 8 | Carril Empresas / Tesorería separado | Vita, Airwallex | El público B2B tiene otras necesidades y montos | Sí — DLPay ya atiende empresas | **Adaptar** (`P1`) |
| 9 | Anti-spread bancario como argumento | DolarApp, Wise | Comparación concreta contra el statu quo | Sí | **Adaptar** (`P2`, con datos reales) |
| 10 | Página "Seguridad y confianza" dedicada | Fintual, Buda | Concentra las señales de legitimidad | Sí | **Adoptar** (`P1`) |
| 11 | Pasos numerados **solo si es secuencia real** | Bithonor (mal: dos listas), El Dorado (bien) | Numerar algo que no es secuencia confunde | Sí — el proceso DLPay sí es secuencia | **Adaptar con disciplina** (`P1`) |
| 12 | Voz local y plana | Fintual | Confianza por cercanía, no por corporativismo | Sí | **Adoptar** (`P0` de copy) |
| 13 | Sticky CTA en móvil tras el hero | Global66, la mayoría de apps | Mantiene la conversión accesible en scroll largo | Sí | **Adoptar** (`P1`) |
| 14 | Muchas tarjetas idénticas + degradados decorativos | Global66 (parcial), Bithonor | — (es el default que satura) | No | **Evitar** |
| 15 | Capturas de app como prueba de producto | DolarApp, Global66 | Muestra que el producto existe y es usable | Parcial — DLPay tiene la plataforma de Guita | **Adaptar** (`P2`) |
| 16 | Widget de reseñas de terceros incrustado | Bithonor | Prueba social externa | Solo si hay reseñas reales y suficientes | **Pendiente** (Fase 0 I15) |

---

## 7. Experiencia de usuario propuesta (marco)

`RECOMENDACIÓN`. El principio rector: **web + WhatsApp = una sola experiencia**. La web es el
lugar para **entender, confiar y cotizar**; WhatsApp (o la plataforma) es donde se **opera**. El
traspaso entre ambos no debe sentirse un corte.

Tres momentos que la web debe cubrir bien:
1. **Entender** (¿qué es esto y sirve para lo que necesito?) — hero + "cómo funciona".
2. **Confiar** (¿puedo poner mi plata acá?) — señales de confianza + proceso + humano.
3. **Actuar** (cotizar / registrarse / escribir por WhatsApp) — cotizador + CTAs + deep link.

---

## 8. Journey — usuario nuevo

`HIPÓTESIS` de recorrido ideal (a validar en Fase 2):

| Paso | Dónde | Qué necesita | Qué le da la web |
|---|---|---|---|
| Llega (desde búsqueda, red social, referido, link de WhatsApp) | Home | Entender en segundos qué es | Hero: "Compra y vende dólar digital, con precio de mercado y una persona que te atiende" + cotizador |
| Explora el precio | Hero (cotizador) | Saber cuánto recibe/paga | Precio **referencial** al instante + "recibes ~X USDT" |
| Duda "¿es confiable?" | Sección confianza / cómo funciona | Ver el proceso, quién está detrás, cómo se protege su plata | Proceso paso a paso, banca BCI, equipo real, WhatsApp, tiempos |
| Decide avanzar | CTA | Un siguiente paso claro | "Cotizar por WhatsApp" (con el monto prellenado) **o** "Crear cuenta" |
| Se registra + KYC/KYB | Plataforma Guita (enlace) | Saber qué le van a pedir y cuánto demora | La web lo anticipa antes del salto |
| Primera operación | WhatsApp / plataforma | Cotización final + instrucciones | Fuera de la web; la web ya lo dejó listo |

Punto crítico (`RECOMENDACIÓN`): **no** empujar a "Crear cuenta" como única salida. Para muchos,
el primer contacto natural es cotizar por WhatsApp; el registro viene después. La web debe
ofrecer ambos caminos con jerarquía clara.

---

## 9. Journey — usuario recurrente

`HIPÓTESIS`:

| Paso | Dónde | Qué necesita |
|---|---|---|
| Llega directo | Home o link guardado | Cotizar rápido, sin releer nada |
| Cotiza | Cotizador (idealmente accesible en 1 tap desde el home, o home = cotizador) | Precio referencial actual |
| Opera | WhatsApp (canal preferido hoy) | Confirmar monto y precio con su ejecutivo |
| Confirma | WhatsApp | Comprobante, wallet, "ok" |

`RECOMENDACIÓN`: para el recurrente, el valor de la web es **velocidad al cotizador** y
**consistencia del precio de referencia** con lo que luego ve en WhatsApp. Considerar un acceso
directo tipo `dlpay.cl/cotizar` que sea casi solo el cotizador. (`P1`)

---

## 10. Experiencia Web ↔ WhatsApp

Este es el problema de UX **más específico y más diferenciador** de DLPay. `RECOMENDACIÓN`:

- **Deep link enriquecido:** el botón "Cotizar por WhatsApp" abre el chat con un **mensaje
  prellenado** que incluye el monto y la dirección de la operación que el usuario tipeó
  ("Hola, quiero cotizar la compra de USDT por CLP 2.000.000"). Reduce fricción y le da contexto
  al ejecutivo. (`P0`)
- **Continuidad visual:** el número, el formato y el lenguaje del precio en la web deben coincidir
  con los que usa el equipo en WhatsApp (mismos decimales, misma forma de decir "precio del
  dólar", mismos mensajes cuando "el mercado se está regulando").
- **Expectativa honesta:** la web dice "precio referencial; el precio final te lo confirma tu
  ejecutivo al cotizar" — no promete una cotización cerrada. (`P0`, coherente con Fase 0: no se
  asume fuente ni fórmula.)
- **Vuelta a la web:** desde WhatsApp, el equipo puede compartir links a páginas concretas
  (cómo funciona, registro, tarifas) — la web debe tener URLs limpias y estables para eso.
- **Estado de "no disponible":** si el cotizador no puede mostrar precio (mercado moviéndose,
  fuera de horario), el fallback natural es "escríbenos por WhatsApp y te cotizamos" — no un
  error seco.

`HIPÓTESIS` H7: prellenar el mensaje de WhatsApp con el monto cotizado aumenta la tasa de
operaciones completadas y baja el trabajo del ejecutivo.

---

## 11. Exploración del cotizador

**El elemento más importante del proyecto.** Aquí se exploran modelos; **no se implementa
ninguno** y **no se asume fuente de precio ni fórmula** (Fase 0).

### 11.1 Anatomía (independiente del modelo)
```
┌─────────────────────────────────────────┐
│  Compro  ▼        Vendo                  │   ← toggle dirección
│                                         │
│  Pago         [  2.000.000 ] CLP  ▼      │   ← input editable
│  Recibo       [  ~ 2.174,8 ] USDT ▼      │   ← se recalcula (editable también)
│                                         │
│  Precio referencial  919,7 CLP / USDT    │   ← con timestamp / "actualizado hace Ns"
│  Sin comisiones ocultas · el precio ya   │
│  incluye todo                           │
│                                         │
│  [  Cotizar este monto por WhatsApp  ]   │   ← acción primaria
│  Crear cuenta para operar en línea       │   ← secundaria
└─────────────────────────────────────────┘
```

### 11.2 Modelos a evaluar

| Modelo | Descripción | Pros | Contras | Recomendación |
|---|---|---|---|---|
| **1 · Referencial → WhatsApp** | Muestra precio referencial y recibo estimado; CTA lleva a WhatsApp con el monto prellenado | Honesto; calza con la operación actual; bajo compromiso técnico | No cierra la operación en la web | `RECOMENDACIÓN`: **punto de partida** (`P0`) |
| **2 · Referencial + lógica de tramos** | Además muestra que el precio mejora por monto/volumen (sin exponer la tabla interna) | Más transparente; educa al cliente grande | Más complejo; expone parte de la política comercial | `HIPÓTESIS` a validar con DLPay (`P1`) |
| **3 · Cotización con validez (lock)** | Precio garantizado por X min, estilo Wise | Máxima claridad y urgencia real | Requiere API de precio propia y decisión de negocio; sobre-promete hoy | **Futuro** (`P3`) |

### 11.3 Estados (todos los modelos)
`idle` · `escribiendo` (debounce) · `cargando` (skeleton **sobre el número**, no spinner que
bloquea) · `resultado` · `bajo el mínimo` (inline: "monto mínimo X") · `sobre el máximo` (inline)
· `mercado moviéndose` ("el mercado se está regulando, reintenta en unos minutos o escríbenos" —
reusa el lenguaje real del equipo) · `sin conexión / error` (fallback a WhatsApp, nunca error
seco).

### 11.4 Detalles UX
- **Bidireccional:** editar CLP recalcula USDT y viceversa. (`P1`)
- **Fuente del precio visible:** etiqueta "referencia: [fuente]" — la fuente es `PENDIENTE` (Fase
  0 I11), pero el **espacio** para mostrarla se diseña ahora.
- **Timestamp / frescura:** "actualizado hace Ns" o "hace un momento".
- **Móvil:** teclado numérico; el cotizador **es** el hero; el CTA se vuelve barra fija al hacer
  scroll. (`P0`)
- **Formato de números:** tabular, con separador de miles chileno, decimales consistentes con
  WhatsApp.

`HIPÓTESIS` H2: para este público, "precio referencial + confirmar por WhatsApp" convierte mejor
y genera menos reclamos que simular una cotización cerrada.

---

## 12. Mobile UX

`RECOMENDACIÓN`. La pregunta correcta es **"¿cuál es la mejor experiencia en móvil y cómo la
escalamos a desktop?"**, no al revés. Justificación (`INFERENCIA`): el tráfico probable llega de
WhatsApp, redes, links compartidos y búsqueda móvil.

| Elemento | Criterio móvil |
|---|---|
| Hero | Una columna; el cotizador ocupa el primer viewport; titular de ≤7 palabras encima |
| Cotizador | Inputs grandes; teclado numérico; toggle de dirección con el pulgar; resultado sin scroll |
| CTA | Barra inferior fija con la acción primaria ("Cotizar por WhatsApp") una vez pasado el hero |
| Navegación | Menú colapsado; WhatsApp **siempre** visible (icono en la barra superior o inferior) |
| "Cómo funciona" | Scroll vertical con pasos; sin depender de hover |
| Lectura | Líneas < 40–45 caracteres; tamaño base ≥ 16px; contraste AA |
| Velocidad percibida | Contenido estático primero; lo único que "carga" es el precio; sin bloquear la interacción |
| Formularios | Mínimos; validación inline; targets ≥ 44px |

`HIPÓTESIS` H1: cotizador en el hero (vs. bajo el fold) aumenta los leads calificados a WhatsApp.

---

## 13. Arquitectura de información preliminar

`RECOMENDACIÓN`. Cada página se justifica por necesidad; **no se asume que todas existan**.

| Página | Necesidad | Intención del usuario | Impacto en conversión | Prioridad |
|---|---|---|---|---|
| **Home** (con cotizador en el hero) | Entrada única; entender + cotizar | "¿qué es y cuánto recibo?" | Alto | `P0` |
| **Cotizar** (`/cotizar`, casi solo el cotizador) | Acceso rápido para recurrentes y para links de WhatsApp | "cotizar ya" | Alto | `P1` |
| **Cómo funciona** | Explicar el proceso web+WhatsApp+KYC y los tiempos | "¿qué pasa después?" | Alto (reduce fricción) | `P0` |
| **Empresas / Tesorería** | Público B2B, montos altos, otro lenguaje | "¿sirve para mi empresa?" | Alto para operaciones grandes | `P1` |
| **Confianza / Seguridad** | Concentrar señales de legitimidad | "¿puedo confiar?" | Alto | `P1` |
| **Preguntas frecuentes** | Resolver objeciones y dudas operativas | "¿y si…?" | Medio | `P1` |
| **Contacto** | WhatsApp + canal formal | "quiero hablar con alguien" | Medio | `P1` |
| **Nosotros / equipo** | El equipo real es una señal de confianza para un emisor sin sello CMF | "¿quién está detrás?" | Medio | `P2` |
| **Legales** (términos, privacidad, tarifas, canal de denuncias) | Obligación + coherencia (Fase 0: hoy dan 404) | — | `P0` (existencia) |
| **Novedades / blog** | Solo si hay un plan de contenido real | — | Bajo | `P3` |
| **Personas** (página aparte) | Probablemente innecesaria si el home ya habla a personas | — | — | Evaluar; por defecto **no** |

**Navegación propuesta (v1):**
`Cotizar · Cómo funciona · Empresas · Confianza` — · — `WhatsApp` · `Iniciar sesión` · `Crear cuenta`
Móvil: logo + WhatsApp + menú; el resto colapsado.

---

## 14. Conversión y confianza

`RECOMENDACIÓN`. Separar lo que DLPay **puede respaldar hoy** de lo que **requiere evidencia**.

### 14.1 Señales que DLPay puede usar hoy
- **Proceso explicado paso a paso** (registro → documentos → validación → habilitado → operar).
- **Banca local:** los fondos se reciben y verifican en **BCI** antes de entregar el dólar digital.
- **Equipo real, con nombre y rol** (CEO, Legal & Compliance, Operaciones). Un emisor pequeño y
  con cara visible transmite más confianza que un logo anónimo.
- **Contacto humano:** WhatsApp Business, atención por una persona, horario indicado.
- **Tiempos concretos:** operación en ~5 minutos promedio.
- **Doble validación operacional** (el equipo verifica, se ejecuta, se confirma).
- **Presencia y cumplimiento local:** entidad chilena, KYC/KYB obligatorio, marco legal chileno.
- **Precio atado a mercado + "sin comisiones ocultas"** (demostrado en el cotizador, no solo dicho).

### 14.2 Señales que requieren evidencia antes de publicarse
- Número de clientes / volumen operado → `PENDIENTE` (necesita dato verificable).
- Testimonios → `PENDIENTE` (Fase 0 I15: veracidad y consentimiento).
- Logos de "empresas que confían" → `PENDIENTE` (autorización de cada empresa).
- "Regulados por la CMF" → **no usar** (solo hay trámite en curso; el encuadre regulatorio es
  restricción de contenido, no línea de investigación de Fase 1).
- Sellos / certificaciones de seguridad → `PENDIENTE`.

### 14.3 Anti-patrón explícito
**No inflar.** Es preferible una web con menos badges pero 100% verificables que una llena de
señales que DLPay no puede sostener. `RECOMENDACIÓN` (P0).

`HIPÓTESIS` H6: mostrar un equipo real y con cara aumenta la confianza para un emisor sin sello CMF.
`HIPÓTESIS` H5: mostrar la referencia de mercado + la lógica del margen aumenta la confianza vs.
ocultarla.

---

## 15. Oportunidades de diferenciación

`RECOMENDACIÓN`. No construir "Global66 pero verde". Ejes donde DLPay puede ser distinta:

| Eje | Cómo se ve en la web | Evidencia que lo sostiene |
|---|---|---|
| **Más rápido / directo** | "Cotiza y opera en minutos, con una persona real." Cero recorrido innecesario. | ~5 min por operación; WhatsApp directo |
| **Más humano + más técnico a la vez** | "La tecnología para cotizar. Una persona para operar." | El modelo híbrido actual |
| **Más especializado** | No es una super-app ni una billetera con 20 funciones. Hace **una** cosa: dólar digital bien comprado/vendido. Registro visual de **mesa de operaciones**, no de app de consumo. | El negocio real es OTC |
| **Más transparente** | Muestra la referencia de mercado y explica el margen. "Sin comisiones ocultas" demostrado. | Depende de decisión de pricing (Fase 0 I11) |
| **Más orientado a operaciones grandes / empresas** | Carril Empresas/Tesorería con lenguaje B2B; "para montos que importan". | DLPay ya atiende empresas; T&C hablan de tesorería transfronteriza y pagos B2B |
| **Más chilena / local** | BCI, CLP, equipo local, cumplimiento local — frente a apps offshore. | Entidad y operación chilenas |

`HIPÓTESIS` H3: un carril Empresas/Tesorería dedicado captura operaciones de mayor valor.
`HIPÓTESIS` H4: el registro visual "mesa de operaciones" lee como más confiable/premium para el
público de DLPay que la estética "fintech amable".

---

## 16. Direcciones visuales

`RECOMENDACIÓN`. **Direcciones, no diseño.** Ninguna se cierra aquí. Evoluciona el activo que
existe (el verde + el motivo geométrico del deck de BCI). Evita los "tells" de plantilla y de IA
(degradados decorativos, glassmorphism, exceso de cards, 3D de stock, blobs, eyebrow en
mayúsculas, un solo color de acento sobre casi-negro, monoespaciada para labels, "→" en botones).

### Dirección A — "Mesa de operaciones"
- **Personalidad:** precisa, profesional, rápida, premium sobria. Un instrumento financiero bien
  hecho, no una app de consumo.
- **Color:** fondo profundo azul-petróleo/verde muy oscuro (evolución del deck de BCI) + **un**
  verde DLPay usado **estructuralmente** (el número vivo, el CTA), no como wash; blanco cálido
  para superficies claras; colores funcionales de estado (sube/baja) solo en el dato de precio.
- **Tipografía:** una grotesca con carácter para titulares + una compañera muy legible para texto
  + **cifras tabulares** para todo lo monetario (los números son el héroe). Nada de
  Inter/Poppins/Montserrat.
- **Densidad:** media-alta en la zona del cotizador (rica en datos), generosa en el resto.
- **Movimiento:** solo el precio "tickea"; una secuencia de carga; nada decorativo.
- **Layout:** el cotizador enmarcado como instrumento; asimétrico, alineado a la izquierda, grid
  de línea base fuerte.
- **Fortalezas:** diferencia de inmediato; calza con "rápido, directo, técnico, confiable";
  escala a B2B; hace de los números (el producto real) la estrella.
- **Riesgos:** puede leerse fría/intimidante para personas primerizas → mitigar con copy cálido
  y **un** elemento humano (foto del equipo, frase directa).

### Dirección B — "Claridad chilena"
- **Personalidad:** calma, transparente, adulta, local. Vecina de Fintual pero para FX/dólar digital.
- **Color:** fondo claro cálido; verde profundo como ancla; un secundario contenido (neutro cálido
  o un azul tinta); mínimo.
- **Tipografía:** una humanista cálida, tamaños generosos, jerarquía fuerte; quizá una sola familia.
- **Densidad:** baja, mucho aire; guiada por contenido; una idea por pantalla.
- **Imagen:** fotografía real (equipo, Chile, proceso) **o** una ilustración de línea propia del
  flujo — nunca 3D de stock.
- **Movimiento:** mínimo, solo en interacción.
- **Fortalezas:** máxima confianza y claridad; ideal para personas; fácil de mantener; difícil de
  arruinar.
- **Riesgos:** puede sentirse poco "tech" o mezclarse con otras fintechs limpias → necesita una
  firma tipográfica/gráfica distintiva para no ser genérica.

### Dirección C — "Sistema geométrico"
- **Personalidad:** tecnológica, estructurada, de "infraestructura". Distintiva.
- **Idea central:** convertir el motivo de **nodos/heptágono** del deck de BCI en un **lenguaje
  gráfico propio** donde los nodos son contrapartes y las líneas son flujos de dinero/USDT — y
  ese lenguaje además **hace el trabajo de explicar** (el diagrama de "cómo funciona" **es** la
  marca).
- **Color:** fondo petróleo + verde; el motivo de nodos/líneas usado con **restricción** (como
  estructura, marcadores de sección, wayfinding) — nunca como papel tapiz.
- **Tipografía:** display geométrica con carácter + texto neutro; cifras tabulares.
- **Fortalezas:** construye sobre un activo que DLPay ya tiene; el motivo carga identidad **y**
  explicación; ownable.
- **Riesgos:** "red de nodos" es en sí un cliché cripto/fintech si se hace perezoso
  (nodos-blockchain por todas partes) → exige disciplina para que sea específico y útil, no
  decorativo.

### Dirección D (variante, no independiente) — "Tablero para empresas"
Sub-dirección de A con más contención y más dato, energía Mercury/Airwallex-business, para el
carril Empresas/Tesorería. Se explora como **modo** dentro de A, no como cuarta dirección.

### Shortlist para Fase 2
`RECOMENDACIÓN`: llevar a mockup **A**, **C**, y el híbrido **A×C** (mesa de operaciones con el
sistema geométrico como capa explicativa/estructural), todos con la disciplina de copy de **B**.
**B** queda como dirección de respaldo si el equipo prefiere minimizar el riesgo estético.

---

## 17. Patrones recomendados (consolidado)

| Prioridad | Patrón |
|---|---|
| `P0` | Cotizador en el hero, móvil primero |
| `P0` | Una acción primaria inequívoca + secundaria + WhatsApp siempre visible |
| `P0` | "Cómo funciona" que cubra web + WhatsApp + KYC + tiempos |
| `P0` | Deep link de WhatsApp con el monto cotizado prellenado |
| `P0` | Voz chilena, plana, sin jerga cripto innecesaria |
| `P0` | Identidad propia (no plantilla, no "tells" de IA) |
| `P0` | Páginas legales existentes y con URL estable |
| `P0` | No inflar señales de confianza |
| `P1` | Cotizador bidireccional con estados completos |
| `P1` | Carril Empresas / Tesorería |
| `P1` | Página Confianza/Seguridad dedicada |
| `P1` | Mostrar la referencia de mercado + lógica del margen (si DLPay lo aprueba) |
| `P1` | Sticky CTA en móvil; nav corta |
| `P1` | `/cotizar` como acceso rápido |
| `P2` | Nosotros / equipo con caras |
| `P2` | Comparación honesta vs. banco / otras opciones |
| `P2` | Capturas de la plataforma como prueba de producto |
| `P3` | Cotización con validez (lock) — requiere API de precio propia |
| `P3` | Novedades/blog — requiere plan de contenido |
| `P3` | Animación de carga orquestada |

---

## 18. Patrones a evitar

- Degradados decorativos, glassmorphism, cubos/ilustración 3D de stock, blobs.
- Exceso de tarjetas idénticas; un solo `border-radius` para todo; la misma sombra gris bajo cada
  bloque.
- Tipografías genéricas elegidas por defecto (Inter/Poppins/Montserrat/Roboto).
- Eyebrow en MAYÚSCULAS sobre cada título; cadenas con "·"; "PALABRA — fragmento"; "→" en botones;
  monoespaciada para labels; casi-negro tintado en vez de negro.
- Acentuar una sola palabra del titular en color/itálica.
- Dos listas de pasos que compiten (error de Bithonor).
- Numerar contenido que no es una secuencia real.
- Pasos/animaciones de entrada en cada sección al hacer scroll.
- Prometer una cotización cerrada que la web no puede ejecutar.
- Señales de confianza no verificables (cifras, testimonios, sellos, "regulados por la CMF").
- Copiar el layout, los colores o el branding de Global66/Buda/Bithonor u otro competidor.
- Reconstruir en la web el registro/KYC (vive en la plataforma de Guita).

---

## 19. Hipótesis para Fase 2

| ID | Hipótesis | Cómo se prueba |
|---|---|---|
| H1 | Cotizador en el hero (vs. bajo el fold) aumenta leads calificados a WhatsApp | Prototipo A/B o test de usuario |
| H2 | "Precio referencial + confirmar por WhatsApp" convierte mejor y genera menos reclamos que una cotización simulada | Test de usuario + criterio de DLPay |
| H3 | Un carril Empresas/Tesorería dedicado capta operaciones de mayor valor | Entrevistas con clientes empresa + prototipo |
| H4 | La estética "mesa de operaciones" lee como más confiable/premium que "fintech amable" | Test de preferencia sobre mockups |
| H5 | Mostrar la referencia de mercado + la lógica del margen aumenta la confianza | Test de usuario; decisión de pricing de DLPay |
| H6 | Un equipo real y visible aumenta la confianza para un emisor sin sello CMF | Test de usuario |
| H7 | Prellenar el mensaje de WhatsApp con el monto cotizado sube la tasa de operaciones completadas | Medición cuando exista la web |
| H8 | `/cotizar` como página casi-solo-cotizador sirve al recurrente y a los links de WhatsApp | Uso real / feedback del equipo |

---

## 20. Preguntas que necesitan decisión de DLPay

1. **Público y acción prioritaria:** ¿personas o empresas primero? ¿la acción #1 es cotizar,
   registrarse o WhatsApp? (Fase 0 la dejó abierta.)
2. **Carril Empresas/Tesorería:** ¿se abre ahora o después?
3. **Transparencia de precio:** ¿la web muestra solo un precio referencial (recomendado)? ¿se
   puede mostrar la lógica de tramos de spread, o eso es interno? (Fase 0 I10/I11.)
4. **Cotizador:** ¿confirmamos el modelo "referencial → WhatsApp" como punto de partida?
5. **Confianza:** ¿qué testimonios, cifras y logos son usables y verificables? (Fase 0 I15.)
6. **Equipo:** ¿el equipo acepta aparecer con nombre y foto en "Nosotros"?
7. **Nomenclatura de marca:** grafía oficial ("DLPay" / "DLpay") y relación con la razón social
   (Fase 0 I8) — afecta logotipo y copy.
8. **Apetito de riesgo estético:** ¿dirección distintiva (A/C) o segura (B)?
9. **Contenido:** ¿quién redacta el copy y quién lo aprueba?
10. **Assets de marca:** ¿logo vectorial, verde exacto, tipografías con licencia? (Fase 0 I12) —
    Fase 2 los necesita para mockups fieles.

---

## 21. Recomendaciones prioritarias

1. `P0` — **Diseñar el cotizador primero, en móvil, con el modelo "referencial → WhatsApp".** Es
   el corazón del producto y la consulta #1 de los clientes.
2. `P0` — **Una acción primaria inequívoca** en el hero; WhatsApp siempre a un tap.
3. `P0` — **"Cómo funciona"** que trate web + WhatsApp + KYC como **un solo recorrido**, con
   tiempos concretos.
4. `P0` — **Voz chilena, plana y honesta**; explicar "dólar digital" en una frase.
5. `P0` — **Identidad propia**: llevar a Fase 2 las direcciones A, C y A×C (respaldo B); nunca
   plantilla ni "tells" de IA.
6. `P1` — **Carril Empresas/Tesorería** y **página Confianza** dedicadas.
7. `P1` — **Deep link de WhatsApp con el monto prellenado**.
8. `P1` — **Publicar las páginas legales** que hoy dan 404 (términos, privacidad, tarifas, canal
   de denuncias), con revisión de Compliance.

---

## 22. Checklist de cierre de Fase 1

- [x] Benchmark visual (Global66, Buda, Bithonor + DolarApp, El Dorado, Wise, Vita, Fintual, refs B2B)
- [x] Benchmark UX (hero, navegación, decisiones, copy, onboarding, formularios, confianza)
- [x] Matriz de patrones (adoptar / adaptar / evitar)
- [x] Marco de experiencia de usuario + journeys (nuevo, recurrente, Web↔WhatsApp)
- [x] Exploración del cotizador (3 modelos, anatomía, estados) — sin implementar
- [x] Análisis mobile-first
- [x] Arquitectura de información preliminar + navegación propuesta
- [x] Conversión y confianza (lo respaldable hoy vs. lo que requiere evidencia)
- [x] Oportunidades de diferenciación
- [x] Direcciones visuales (shortlist A / C / A×C, respaldo B) — sin cerrar identidad
- [x] Patrones recomendados y a evitar
- [x] Hipótesis para Fase 2 y preguntas para DLPay
- [ ] **Checkpoint con Sebastián** — revisar §17 (checkpoint) y responder §20
- [ ] Confirmar público/acción prioritaria y modelo de cotizador
- [ ] Recibir assets de marca para Fase 2 (Fase 0 I12)
- [ ] Decidir shortlist final de direcciones a mockear
- [ ] (Fase 2) Habilitar capturas manuales / navegador para verificar los referentes con bloqueo

**Fase 1 se cierra** cuando Sebastián revise el checkpoint, responda las decisiones abiertas y
apruebe la shortlist de direcciones para Fase 2.

---

## Checkpoint de Fase 1

### A. Lo que sabemos (`HECHO` / `INFERENCIA`)
- El patrón ganador de la categoría: **cotizador en el hero + una acción primaria clara**;
  navegación corta; WhatsApp humano como pilar; tiempos explícitos; voz local y plana.
- **Wise** es el estándar de transparencia de precio y de UX de cotizador; **Fintual** el de voz
  y confianza; **Bithonor** el contra-ejemplo (plantilla, redundancia, tipografía genérica).
- DLPay **no** puede usar el argumento "regulados por la CMF"; su confianza se construye con
  proceso + banca BCI + equipo real + humano + local.
- El diferenciador propio de DLPay es el **modelo híbrido web + WhatsApp** y la **especialización**
  (mesa de cambio, no super-app).
- Assets de marca y decisiones de pricing/público siguen abiertos (Fase 0).

### B. Lo que recomendamos
- Diseñar **cotizador-móvil-primero** con modelo "referencial → WhatsApp".
- **Una** acción primaria; WhatsApp siempre visible; deep link con monto prellenado.
- "Cómo funciona" como recorrido único web+WhatsApp+KYC con tiempos.
- Carril **Empresas/Tesorería** y página **Confianza** dedicadas (`P1`).
- Identidad: explorar **A ("mesa de operaciones")**, **C ("sistema geométrico")** y **A×C**;
  respaldo **B ("claridad chilena")**. Copy chileno y honesto en todas.
- Publicar las páginas legales que hoy dan 404.

### C. Lo que todavía no sabemos (`PENDIENTE`)
- Público y acción prioritaria (personas vs empresas; cotizar vs registrarse vs WhatsApp).
- Si la web puede mostrar la lógica de spread o solo un precio referencial.
- Qué testimonios/cifras/logos son usables.
- Grafía oficial de la marca y assets (logo vectorial, verde exacto, tipografías con licencia).
- Detalle visual fino de Global66 y Buda (bloqueo anti-bot; verificar en Fase 2).

### D. Decisiones que debe tomar Sebastián
Ver §20 (10 preguntas). Las 4 que desbloquean Fase 2:
1. Público / acción prioritaria.
2. ¿Modelo de cotizador "referencial → WhatsApp" confirmado?
3. ¿Apetito de riesgo estético: A/C (distintivo) o B (seguro)?
4. Entrega de assets de marca.

### E. Las 3–5 direcciones más prometedoras
1. **A — "Mesa de operaciones"** (los números como héroe; premium sobrio).
2. **C — "Sistema geométrico"** (el motivo de nodos como lenguaje que identifica y explica).
3. **A×C** (híbrido: instrumento + sistema geométrico como capa estructural/explicativa).
4. **B — "Claridad chilena"** (respaldo de bajo riesgo).
5. **D — "Tablero para empresas"** (modo B2B dentro de A, para el carril Tesorería).

### F. Decisiones que NO deberían tomarse todavía
- Identidad visual definitiva, tipografía, paleta, hex del verde.
- Stack, framework, arquitectura técnica.
- Fuente de precio y fórmula del spread del cotizador.
- Si se construye auth/KYC propio (sigue en la plataforma de Guita).
- Arquitectura de información final / qué páginas exactas se publican.

### G. Qué debería hacerse en Fase 2
- Tomar **A, C y A×C** a **mockups de alta fidelidad** de: home (con cotizador), `/cotizar`,
  "cómo funciona" y las mismas 3 pantallas en móvil — con los assets reales de DLPay.
- Prototipar **una** interacción del cotizador (modelo "referencial → WhatsApp") con sus estados.
- Test de preferencia/confianza sobre los mockups (H4).
- Con la dirección elegida, recién ahí: tokens del design system y ADRs de arquitectura.
- Verificar los referentes con bloqueo (capturas manuales) para afinar el benchmark visual.

**No se avanza a Fase 2 sin autorización explícita de Sebastián.**

---

## Fuentes

- [Global66 Chile](https://www.global66.com/cl) · [Cuenta Global](https://www.global66.com/cuenta-global/) · [Centro de ayuda — cotizador](https://ayuda.global66.com/docs/primeros-pasos/cotizador-y-cupon-de-descuento/)
- [Buda.com Chile](https://www.buda.com/chile/) · [Mejores exchanges cripto Chile 2026 (guiadetrader)](https://www.guiadetrader.com/blog/mejores-exchanges-crypto-chile-2026) · [Buda opiniones (comparalatam)](https://comparalatam.com/cl/crypto/buda-com.html)
- [Bithonor](https://bithonor.com/) (analizado en vivo)
- [DolarApp — reseña (mdigital)](https://www.mdigital.pro/blog/dolar-app-guia-completa-latam) · [Qué es Dolar App (Global66 blog)](https://www.global66.com/blog/dolar-app/) · [Comprar USDC en DolarApp (usdc.com)](https://latam.usdc.com/es-la/learn/how-to-buy-usdc-dolarapp)
- [El Dorado](https://eldorado.io/en) · [Cómo usar El Dorado P2P](https://eldorado.io/en/blog/welcome-to-el-dorado-p2p) · [Qué es El Dorado (trecebits)](https://www.trecebits.com/el-dorado-que-es-como-funciona/)
- [Wise Forex Widget](https://wise.com/gb/business-tools/fx-widget)
- [Vita Wallet — sobre nosotros](https://vitawallet.io/sobre-nosotros/) · [¿Vita Wallet es confiable? (Wise)](https://wise.com/cl/blog/vita-wallet-es-confiable)
- [Fintual — seguridad y confianza](https://fintual.cl/seguridad-confianza/) · [Fintual Chile (Wise)](https://wise.com/cl/blog/fintual-chile)

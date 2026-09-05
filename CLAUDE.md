# CLAUDE.md — DLPay Web

Fuente principal de verdad del proyecto y **punto de entrada de cada sesión**. Ante conflicto
entre este archivo y una petición puntual, señalarlo antes de proceder. Se actualiza cuando una
decisión cambia cómo funciona el proyecto; los cambios de fondo van con un ADR.

---

## 0. Punto de entrada — leer esto primero

### 0.1 Estado actual  ·  *(actualizar al cerrar cada fase)*

- **Fase actual: 4 — Construcción del sitio público.** Fase 3 cerrada el 2026-09-04.
- **Fases 0, 1, 2 y 2.5: cerradas.** No se rehacen, no se reinvestigan. Su resultado está en
  `docs/research/`.
- **ADRs de Fase 3 cerrados** (0002–0005): Astro + TypeScript · repositorio y convenciones ·
  CSS nativo con tokens, sin Tailwind · despliegue portable con proveedor diferido.
- **Identidad visual completa**: dirección A×C, verde `#16C784`, tinta `#0B1320` y tipografía
  **T-C** cerradas. **Diseño congelado desde el 2026-09-04:** no se toca sin una razón crítica.
- **Auditoría previa a producción hecha.** Lo que queda para desplegar es configuración y
  decisiones de negocio o Compliance, no ingeniería. Ver `docs/auditoria-preproduccion.md`.
- **Esqueleto creado y verificado.** Astro 7 + TypeScript strict, `npm run check` y
  `npm run build` en verde, **0 JS enviado al cliente**, fuentes T-C auto-hospedadas, tokens del
  Design System en código, y la cadena `PriceSource → Quote` en pie. Ver `docs/development.md`.
- **Fase 3 cerrada.** Lo siguiente es **Fase 4: construir el sitio público**, empezando por la
  Home con el cotizador (`phase-2.5-definicion-experiencia.md` §2).
- **Numeración de fases (única y definitiva — la del repositorio):**

  | Fase | Qué es | Estado |
  |---|---|---|
  | 0 | Investigación técnica y de contexto | ✅ cerrada |
  | 1 | Exploración visual & UX (benchmark, patrones) | ✅ cerrada |
  | 2 | Direcciones visuales + mockups + prototipo del cotizador | ✅ cerrada |
  | 2.5 | Definición de la experiencia DLPay | ✅ cerrada |
  | **3** | **Arquitectura: ADRs + esqueleto del proyecto** | 🔵 **en curso** |
  | 4 | Construcción del sitio público (en staging) | pendiente |
  | 5 | Contenido, SEO, compliance y QA | pendiente |
  | 6 | Cutover controlado a producción | pendiente |

  > Cualquier otra numeración que aparezca en documentos antiguos (incluido el plan maestro en
  > `~/.claude/plans/`) queda **derogada**. Vale esta tabla.

### 0.2 Documentación vinculante

**Manda sobre todo lo demás:**

| Documento | Qué fija |
|---|---|
| `logos/logo 1.png`, `logos/logo 2.png` | Los assets reales. **Fuente de verdad visual.** |
| `docs/decisions/` (ADRs) | Las decisiones formales. `ADR-0001` = dirección visual V1. |
| `docs/design-system/design-system-v1.md` | Tokens, escala, componentes, accesibilidad. |
| `docs/design-system/cotizador-spec.md` | El elemento central de la web. |
| `docs/research/phase-2.5-definicion-experiencia.md` | Experiencia, arquitectura de información, estructura de la Home, principios UX. **El documento operativo más útil para construir.** |
| Este archivo | Principios, límites, Definition of Done. |
| `docs/development.md` | Cómo levantar el proyecto, estructura, dependencias y verificaciones. |
| `docs/legal-brief.md` | Qué falta en las páginas legales y qué decisiones lo bloquean. Para Compliance. |
| `docs/migracion-urls.md` | Qué pasa con cada URL del sitio actual en el cutover. Para Fase 6. |
| `docs/hardening-2026-09-04.md` | Hallazgos de la revisión de endurecimiento, clasificados. |
| `docs/auditoria-preproduccion.md` | Auditoría técnica previa a producción y qué falta para desplegar. |
| `docs/design-system/board-tipografia.html` | Board que sustentó la elección de tipografía. Se abre en el navegador. |

**De consulta (no rehacer, sí citar):** `docs/research/phase-0-findings.md` (hechos técnicos,
riesgos, pendientes I1–I19) · `phase-1-visual-ux.md` (§6, §17 y §18 son el filtro para decidir
patrones) · `phase-2-visual-directions.md` + su Artifact de mockups.

### 0.3 Límites duros de la fase actual

- **No instalar dependencias** sin el análisis escrito del §8. Hoy el proyecto declara **tres
  paquetes**: `astro`, `@astrojs/check` y `typescript`. Cero dependencias de estilo, cero
  framework de UI.
- **No crear un componente ni una carpeta** que ninguna página real necesite todavía
  (Principio 5).
- **No tocar producción.** Dominio, DNS, correo, el Firebase de Guita, cuentas de terceros: nada.
  La web nueva se construye aparte y solo se conecta por DNS en Fase 6.
- **No construir infraestructura de usuarios, auth, KYC/KYB ni datos de clientes.** Sigue en la
  plataforma de Guita; es una etapa independiente por sensibilidad.
- **No integrar una fuente de pricing real** ni codificar fórmula de spread. Solo
  `ConfigPriceSource` con valor de muestra.
- **No abrir investigaciones nuevas.** Si aparece una cuestión secundaria: se registra en §13 y
  se sigue. Solo se investiga lo que bloquee una decisión de arquitectura o una funcionalidad
  esencial.

---

## 1. Qué es este proyecto

DLPay (marca de **DLPZ INCZ SpA**), fintech chilena. Este repo es la **web propia** de DLPay:
recuperar el control tecnológico de una presencia digital que hoy depende de un proveedor
externo (Guita).

**El negocio, en una línea (posicionamiento definido por el equipo el 2026-09-04):** DLPay
**mueve dinero entre monedas y entre países**, rápido y sin depender de días hábiles, con una
persona que cierra la operación por WhatsApp. Personas y empresas.

**Alcance que la web comunica:** envío de dinero al extranjero (persona a persona, a cuenta
propia, empresa a persona, empresa a empresa) · pagos internacionales y a proveedores ·
tesorería en dólares · cambio de divisas CLP ↔ USD como operación independiente.

**El dólar digital (USDT) es la infraestructura, no el mensaje comercial.** Se explica donde
aporta —una nota en el cotizador, una respuesta en la FAQ— y nunca protagoniza un titular. La web
**no** debe leerse como un sitio de criptomonedas.

### Dónde termina el servicio (definido el 2026-09-04 — regla dura de contenido)

El flujo real es: **CLP del cliente → DLPay convierte → entrega dólar digital en la billetera del
cliente → desde ahí él decide** si lo mantiene, lo mueve o lo convierte en destino.

**Prohibido afirmar o sugerir:** que DLPay deposita en una cuenta bancaria en el extranjero, que
realiza una transferencia bancaria internacional, o que el destinatario recibe moneda local. La
conversión a moneda fiat en destino es un proceso distinto, con otros servicios, que DLPay no
presta hoy.

**Sí se puede comunicar:** que DLPay facilita el cambio de divisas y el movimiento internacional
de valor mediante dólar digital, que mantiene una equivalencia 1:1 con el dólar y se transfiere
por distintas redes en minutos, sin depender de los tiempos de una transferencia bancaria.

**La rapidez se predica de NUESTRA operación** —la conversión y la entrega del dólar digital—,
nunca de una recepción bancaria final. "Sin esperar días" jamás debe poder leerse como "el
destinatario recibe dinero en su cuenta en minutos".

El límite se declara **de frente** en `/como-funciona` y en `/confianza`, antes de que el usuario
opere. Es una señal de confianza, no letra chica.

Este posicionamiento **coincide con los servicios que los T&C publicados ya declaran**
(tesorería transfronteriza, pagos B2B, liquidaciones internacionales), y con ello cierra el
pendiente I10/D8 que venía abierto desde Fase 0: la web comunicaba menos de lo que el propio
contrato declara.

**El contexto técnico (Fase 0):** `dlpay.cl` es hoy un sitio-inquilino dentro de la plataforma
multi-tenant de Guita — dominio registrado por Guita SpA, DNS en DigitalOcean de Guita, hosting en
un Firebase de Guita, y toda la app (auth, onboarding, KYC con FaceTec, cotizador) contra
`api.guita.cl/graphql`. **La web nueva no depende de nada de eso.**

**Alcance:** sitio público · identidad · UX · arquitectura · cotizador desacoplado · SEO ·
accesibilidad · performance · seguridad · testing · deployment · documentación.

**Fuera de alcance** (hasta decisión explícita): autenticación, KYC/KYB, área de cliente, motor de
operaciones, APIs financieras, infraestructura de datos de usuarios. La arquitectura debe
*permitir* evolucionar hacia eso; **no** anticiparlo.

---

## 2. Principios (prioridad sobre cualquier framework, librería, tendencia o preferencia)

1. **Investigar solo lo que bloquea una decisión.** Alternativas → trade-offs → decidir →
   documentar (ADR) → construir. Nunca presentar una suposición como hecho: usar
   `PENDIENTE DE DECISIÓN` (§3). Las Fases 0–2.5 ya investigaron; **no se repiten**.
2. **Necesidad antes que tecnología.** Secuencia: Necesidad → UX → arquitectura → herramienta →
   componente → implementación. Nada entra por ser popular.
3. **La web no debe parecer generada por IA.** Prohibido por defecto: tipografías genéricas
   automáticas (Inter/Poppins/Montserrat/Roboto), gradientes decorativos, blobs, glassmorphism
   gratuito, exceso de tarjetas / border-radius / botones pill, sombras y animaciones decorativas,
   hero y dashboards genéricos, iconos e ilustraciones 3D de stock, estética SaaS intercambiable,
   componentes copiados de templates, parecido a otra fintech. Identidad **propia de DLPay**.
4. **Identidad antes que componentes.** El sistema visual está definido (ADR-0001 + Design System
   V1); los componentes lo expresan, no al revés.
5. **Arquitectura mínima y modular.** Sin microservicios, monorepos, capas, sistemas de plugins ni
   abstracciones prematuras sin caso de uso real.
6. **Preparar costuras, no construir el futuro.** Interfaz desacoplada para el cotizador ✅.
   Construir ahora la infraestructura de usuarios/KYC/operaciones ❌.
7. **Datos sensibles fuera del repo, siempre.** Nunca: KYC/KYB, documentos de identidad, datos
   bancarios de clientes, historial de operaciones, contratos, credenciales, secretos, auditorías
   internas. El repo vive en ruta **separada** de la carpeta de documentos de DLPay. Nunca
   `git add .` sin revisar. `.gitignore` y política de variables de entorno desde el primer commit.
8. **Seguridad por diseño**, no como etapa final. Secretos nunca en código ni en el cliente.
   Validar en servidor. Mínimo privilegio. El frontend no es una frontera de seguridad.
9. **Calidad antes que velocidad.** Generar código rápido no obliga a aceptarlo rápido.
10. **Autonomía.** Maximizar propiedad, portabilidad, comprensión y control de infraestructura.
    No cambiar una dependencia por otra dependencia innecesaria.

**En conflicto:** calidad > velocidad · mantenibilidad > tendencia · claridad > cantidad de
features · control > automatización · identidad DLPay > "moderno" · **avanzar > investigar de más**.

---

## 3. Marcadores estándar (en código, contenido y docs; deben ser greppables)

- `PENDIENTE DE DECISIÓN — <qué falta decidir y de quién depende>`
- `REQUIERE VALIDACIÓN DE COMPLIANCE — <claim afectado>` — cifras, clientes, testimonios,
  regulación, certificaciones, asociaciones, garantías, tiempos, precios, spreads, condiciones
  comerciales. La aprobación es de DLPay, no de Claude.
- `PENDIENTE DE ASSET — <recurso usado provisionalmente>`

---

## 4. Cómo debe trabajar Claude Code

Actuar como **arquitecto + desarrollador + revisor**, no como generador ciego. Antes de una
decisión importante: problema que resuelve · alternativas · recomendación y por qué · trade-offs ·
impacto futuro. **Claude puede y debe recomendar no implementar algo** si no aporta valor a la
fase actual.

**Ritmo esperado:** decidir y construir. Si aparece una pregunta secundaria, se registra en §13 y
se continúa. Solo se detiene el trabajo cuando algo bloquea de verdad una decisión de arquitectura
o una funcionalidad esencial.

---

## 5. Identidad visual  ·  *cerrada en ADR-0001*

**Dirección V1: A×C** — registro de "mesa de operaciones" (instrumento financiero: superficie
clara con héroes y bandas en tinta profunda, cifras tabulares protagonistas, jerarquía nítida,
bordes finos, radios discretos) + un **sistema geométrico derivado del propio isotipo** (planos
angulares, corte diagonal ~30–35°, cuña direccional).

**Regla dura del componente geométrico:** cada trazo representa **movimiento, flujo de valor o un
paso de un proceso**. Nunca decoración, nunca papel tapiz, nunca "red de nodos", nunca compitiendo
con el cotizador.

**Tokens de marca (verificados por muestreo de píxeles de `logos/`, colores planos sin antialias):**

| Token | Valor | Nota |
|---|---|---|
| **Verde DLPay** | `#16C784` | Confirmado exacto. Acción primaria, dato vivo, acentos estructurales. Nunca como wash. |
| **Tinta DLPay** | `#0B1320` | Confirmado exacto. Héroes, footer, bandas. |

Los assets de `logos/` son la **fuente de verdad visual** y mandan sobre cualquier valor tomado
del sitio de Guita o de documentos anteriores. La paleta completa, neutros y semánticos están en
`docs/design-system/design-system-v1.md`.

**Nomenclatura:** **DLPay** es la marca y protagoniza toda la comunicación comercial.
**DLPZ INCZ SpA** es la razón social: va en footer y páginas legales, no es protagonista.

**Tipografía (cerrada 2026-09-04): set T-C** — **Familjen Grotesk** (display, títulos y texto) +
**Spline Sans Mono** (cifras). Ambas SIL OFL, variables, **auto-hospedadas** (nunca desde un CDN
de terceros). Criterio permanente: **las cifras son las protagonistas y la tipografía no debe
volverse excesivamente grande** — la escala es un techo, no un objetivo; si un titular compite con
la cifra, se reduce el titular. Ver Design System §3 y §3.0.

Referencias (Global66, Buda, Wise, DolarApp, Fintual, Bithonor como contra-ejemplo): analizar
**principios** de UX, jerarquía, conversión, densidad, navegación y comunicación de confianza. No
copiar layout, componentes, textos, colores, iconografía, estructura, animaciones ni branding.

---

## 6. UX  ·  *cerrada en Fase 2.5*

**Principio rector: cotizar es el centro.** Todo lo demás sostiene esa acción. Una sola acción
primaria por pantalla.

**Los 10 principios UX de DLPay** están en `phase-2.5-definicion-experiencia.md` §8 y son
vinculantes. En resumen: honestidad sobre el precio (referencial, nunca cerrado) · web y WhatsApp
son una sola conversación · móvil primero · confianza que se comprueba, no que se afirma · la
geometría siempre tiene función · rápido de verdad · personas y empresas caben pero la Home no se
vuelve corporativa · español chileno plano · identidad propia.

**Arquitectura de información v1 (cerrada):**
`/` (Home con el cotizador en el hero) · `/cotizar` · `/como-funciona` · `/empresas` ·
`/confianza` · legales: `/terminos`, `/privacidad`, `/tarifas`, `/canal-de-denuncias`.
Las nueve rutas existen y resuelven. La FAQ vive en la Home, no como página propia.

**Textos legales:** Claude Code **no los redacta**. `/tarifas` y `/canal-de-denuncias` tienen
contenido real porque describen el servicio, no obligaciones contractuales. `/terminos` y
`/privacidad` son páginas de estado hasta que Compliance entregue el texto — ver
`docs/legal-brief.md`.

**El cotizador:** modelo `qué quieres hacer → monto → cuánto recibes → precio referencial →
WhatsApp prellenado → el ejecutivo confirma el precio final y coordina el destino`. La intención
—enviar al extranjero, convertir a dólares, convertir a pesos— es el primer paso. Especificación completa en `docs/design-system/cotizador-spec.md`. No ejecuta
operaciones, no bloquea precios, no promete cotizaciones cerradas.

**Nunca afirmar** que DLPay está regulado por la CMF ni ningún claim regulatorio equivalente.

---

## 7. Estándares técnicos (se verifican en el Definition of Done)

**Stack (cerrado en Fase 3):** **Astro + TypeScript** (ADR-0002) · **CSS nativo con custom
properties**, sin Tailwind ni framework de UI (ADR-0004) · salida **estática** · **cero
dependencias** más allá de Astro. El cotizador es la **única** isla interactiva. Contenido: copy
en la página, datos estructurados en colecciones tipadas sólo cuando una página los necesite.
Despliegue portable con proveedor diferido (ADR-0005).

Regla de portabilidad vinculante: *el sitio debe poder publicarse copiando la carpeta de build a
cualquier servidor estático.* Lo que rompa esa afirmación necesita una enmienda de ADR.

- **SEO desde la arquitectura:** title, description, canonical, Open Graph, headings semánticos,
  URLs limpias, sitemap, robots, enlaces internos, structured data cuando aporte, imágenes
  optimizadas, Core Web Vitals, indexabilidad, redirects en la migración. Resolver con capacidades
  del framework y buenas prácticas antes que con una dependencia "de SEO".
- **Accesibilidad (WCAG AA como piso):** HTML semántico, teclado, focus visible, contraste,
  labels, formularios accesibles, alt, jerarquía de headings, reduced motion, targets ≥44px,
  navegación móvil, errores comprensibles. Las herramientas automáticas no sustituyen la revisión
  humana. Ojo con `#16C784` sobre superficie clara: contraste insuficiente para texto (ver Design
  System §2.4).
- **Performance por diseño:** contenido estático primero, JS mínimo, imágenes y fuentes
  optimizadas, lazy loading donde corresponda, menos dependencias. Lo único que "carga" es el
  precio. No sacrificar performance por efectos.
- **Testing proporcional al riesgo:** lógica crítica y determinística (unit: formateo de cifras,
  cadena `PriceSource → Quote`, armado del mensaje de WhatsApp); build y enlaces; E2E con
  Playwright **cuando el MCP esté disponible** (hoy falla: `npx` no está en el `$PATH`). Verificar
  responsive en desktop/tablet/móvil. `build` verde **no** es "terminado". Sin pirámide de tests
  para contenido estático.
- **Seguridad:** revisar dependencias; sin secretos hardcodeados; validar entradas y controlar
  salidas; XSS / SSRF / injection / redirects / headers / cookies / CSRF / permisos / env. Correr
  `/security-review` antes de merges relevantes.
- **Contenido / compliance:** nunca inventar datos regulatoria o comercialmente sensibles; marcar
  `REQUIERE VALIDACIÓN DE COMPLIANCE`.

---

## 8. Dependencias

Antes de instalar, responder por escrito (en el PR o ADR): qué problema resuelve · si es necesaria
· si el framework / TS / Web APIs ya lo resuelven · alternativa más simple · mantenimiento que
añade · impacto en bundle/performance · reputación del paquete · lock-in · seguridad · facilidad
de removerla.

No asumir por defecto: Supabase, PostgreSQL, un CMS, Vercel, Cloudflare, Resend, n8n, Make ni
ninguna API externa. Evaluar cuando exista necesidad concreta.

---

## 9. Definition of Done (proporcional al tipo de cambio)

**Funcionalidad o página nueva** — verificar contra §7 más: producto (cumple objetivo, UX clara,
sin complejidad de más) · diseño (sistema visual DLPay, no parece plantilla, responsive) · código
(limpio, tipado, modular, sin abstracciones innecesarias) · documentación actualizada si cambia el
funcionamiento · revisión manual.

**Cambio de contenido/copy menor:** producto + diseño + build + compliance si aplica.

`build` correcto no equivale a "terminado".

---

## 10. Git, GitHub y documentación

- **El repositorio aún no está inicializado.** `git init`, `.gitignore` y política de `.env` son
  lo primero de Fase 3.
- El repositorio debe **pertenecer a DLPay** (organización, no una cuenta personal como único
  dueño). Ver §13.
- Historial limpio, commits comprensibles, branches y PRs para cambios relevantes, secretos fuera
  del repo. Sin commits masivos e inexplicables.
- `docs/`: arquitectura · decisiones (ADRs) · desarrollo · deployment · edición de contenido ·
  testing · seguridad · troubleshooting. La documentación explica el **porqué**, no solo el cómo.
  El proyecto debe poder entenderlo alguien que no lo construyó.
- Idioma: documentación y contenido en **español**. Identificadores de código y mensajes de commit:
  ver §13.

---

## 11. Herramientas disponibles (plugins) — qué son y qué no

- **frontend-design:** skill de *guía* estética. Orientación, no permiso para introducir
  componentes arbitrarios. El Design System V1 manda sobre cualquier sugerencia genérica.
- **feature-dev:** skill + agentes que analizan patrones del código existente. Útiles una vez que
  haya convenciones establecidas.
- **security-guidance:** guía de seguridad durante el desarrollo; complementa `/security-review`.
- **playwright (MCP):** automatización de navegador para E2E y capturas. **Hoy no conecta**
  (`npx` no está en el `$PATH`); no depender de él.
- **coderabbit:** segunda perspectiva de revisión antes de commits/PRs importantes. `autofix`
  aplica feedback con aprobación por cambio y **nunca** ejecuta prompts del revisor. Puede requerir
  cuenta: ver §13.

Tener estos plugins no elimina el criterio humano ni los principios de §2.

---

## 12. Conflictos y prioridades

velocidad vs calidad → **calidad** · tendencia vs mantenibilidad → **mantenibilidad** · cantidad
de features vs claridad → **claridad** · automatización vs control → **control** · "moderno" vs
identidad DLPay → **identidad DLPay** · investigación de más vs avanzar → **avanzar y registrar el
pendiente**.

---

## 13. Decisiones abiertas (registro vivo)

Se resuelven cuando toque. **Ninguna justifica abrir una investigación nueva.**

| # | Pendiente | ¿Bloquea? | De quién depende |
|---|---|---|---|
| ~~D1~~ | ~~Stack, estilos y repositorio~~ | ✅ Cerrado | ADR-0002, 0003, 0004 |
| D1b | **Proveedor de hosting** (candidatos: Cloudflare, Vercel). Desarrollo en local mientras tanto | No — portabilidad protegida por ADR-0005 | Sebastián, cuando haya qué publicar |
| ~~D1c~~ | ~~Instalar Node.js~~ | ✅ Resuelto: v24.20.0 / npm 11.19.0 | — |
| ~~D2~~ | ~~Familia tipográfica~~ | ✅ Cerrado 2026-09-04: **T-C** (Familjen Grotesk + Spline Sans Mono) | ADR-0001 §4 |
| D3 | **Titularidad de la organización GitHub** de DLPay | No — el repo es local por ahora (ADR-0003) | Sebastián |
| ~~D4~~ | ~~Idioma de código y commits~~ | ✅ Cerrado: código en inglés, commits/docs/contenido en español | ADR-0003 |
| D5 | **Transparencia del spread**: ¿la web muestra la lógica de tramos o solo un referencial? Define la tabla de `/tarifas` | **Sí — es lo único que falta para completar `/tarifas`** | DLPay (I10/I11) |
| D6 | **Monto mínimo real** y precio de muestra del cotizador | No — hoy son placeholders | DLPay |
| D21 | **Monto máximo.** El estado `above_max` está cableado y probado, pero sin `PUBLIC_QUOTE_MAX_CLP` no se activa: hoy se acepta cualquier monto | No bloquea, pero un monto absurdo llega tal cual al ejecutivo | DLPay |
| D22 | **Mensaje prellenado en tres enlaces a WhatsApp** de `/tarifas`, `/como-funciona` y `/confianza`, que hoy abren el chat en blanco (hallazgo M4) | No | Sebastián |
| D7 | **Fuente oficial de market price** | No — `ConfigPriceSource` cubre v1 | DLPay |
| ~~D8~~ | ~~Alcance de servicios a comunicar~~ | ✅ Cerrado 2026-09-04: el amplio, alineado con los T&C publicados | Equipo DLPay |
| ~~D16~~ | ~~Cómo llega el dinero al destinatario final~~ | ✅ Cerrado 2026-09-04: DLPay entrega **dólar digital en la billetera**; no deposita en cuentas bancarias en el extranjero. Ver §1 | Equipo DLPay |
| ~~D17~~ | ~~"Sin esperar días"~~ | ✅ Reformulado 2026-09-04: la rapidez se predica de la conversión y del movimiento del dólar digital, nunca de una recepción bancaria en destino | Equipo DLPay |
| D18 | **Fuente real de actividad reciente** (operaciones confirmadas y anonimizadas). Hoy hay datos de ejemplo, marcados como tales por el propio componente | No | DLPay |
| D9 | **Razón social**: se usa **DLPZ INCZ SpA**. Los T&C publicados dicen "DLPZ PRO SpA" (RUT 78.378.714-8) | **Sí — bloquea publicar los textos legales.** No se puede publicar bajo una entidad que contradiga el contrato vigente | `REQUIERE VALIDACIÓN DE COMPLIANCE` — Joaquín. **No reinvestigar.** |
| D19 | **Correo oficial de contacto**: los T&C dicen `contacto@dlpay.cl`, la Política dice `contacto@dlpzpro.cl` | Sí, para el canal de denuncias. La web no publica ninguno hasta confirmarlo | Compliance |
| D20 | **El alcance de los T&C ya no coincide con el servicio**: hablan de custodia y liquidaciones internacionales; el servicio real es cambio de divisas con entrega de dólar digital | Sí, antes de publicar los textos | Compliance |
| D10 | **Testimonios, cifras de clientes/volumen, logos de empresas** | No — no se publican hasta verificar | DLPay (I15) |
| D11 | **Equipo con nombre y foto** en `/confianza` | No | Sebastián |
| D12 | **Quién redacta y aprueba el copy** | No para Fase 3 | DLPay |
| D13 | **SPF y DMARC ausentes** en `dlpay.cl` (riesgo de suplantación) | No — es de quien administra el DNS hoy | Guita / DLPay |
| D14 | **Transferencia del dominio, DNS y Google Workspace** | No para Fases 3–5; sí para Fase 6 (cutover) | DLPay ↔ Guita |
| D15 | **Cuenta/credenciales de CodeRabbit** | No | Sebastián |

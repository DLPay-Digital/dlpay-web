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
- **Motion System V1** aprobado e implementado el 2026-09-07. Enmienda el Design System §9: se
  permiten entradas al hacer scroll y escalonado, en forma acotada. Seis movimientos, techo de
  280 ms. Ver `docs/design-system/motion-system-v1.md`.
  **Una excepción, del 2026-09-08:** la rotación de la franja de notificación es un séptimo
  movimiento, infinito, y contradice la regla dura 1 («una sola vez») a petición explícita del
  equipo. Acotada a esa pieza, sin sigla propia y sin abrir la puerta a más movimiento. Enmienda
  registrada en `motion-system-v1.md` §0 y razonada en ADR-0006.
- **Auditoría previa a producción hecha, en dos revisiones (2026-09-04 y 2026-09-08).** La segunda
  cerró dos fallos críticos que no se veían en localhost: la guarda de `PUBLIC_SITE_URL` se
  esquivaba con `astro build` directo y sólo comprobaba presencia —`.env.example` traía
  `localhost`—, y no existía forma de evitar que Staging fuera indexado. Ver
  `docs/auditoria-preproduccion.md`.
- **El proyecto técnico está terminado. No queda ingeniería para publicar.** La salida a producción
  depende **exclusivamente** de Compliance: D9 (razón social), D19 (correo oficial) y D20 (alcance
  de los T&C). Todo lo demás es configuración del host. Ver *Bloqueantes de producción* en
  `docs/auditoria-preproduccion.md`.
- **Dos variables gobiernan el despliegue y el build las valida** (`dlpay:deploy-guard` en
  `astro.config.mjs`): `PUBLIC_SITE_URL` es obligatoria y debe ser publicable —rechaza hosts
  locales, lo que no sea `https` y rutas fuera de la raíz—, y `PUBLIC_ALLOW_INDEXING` va **cerrada
  por omisión**: sin `true` explícito el sitio se publica con `noindex` y `Disallow: /`. Un build
  en local necesita la URL en la misma línea:
  `PUBLIC_SITE_URL=https://dlpay.cl npm run build`.
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
  | 3 | Arquitectura: ADRs + esqueleto del proyecto | ✅ cerrada |
  | **4** | **Construcción del sitio público (en staging)** | 🔵 **en curso** |
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
| `docs/design-system/motion-system-v1.md` | Los seis movimientos permitidos y dónde va cada uno. |
| `docs/research/phase-2.5-definicion-experiencia.md` | Experiencia, arquitectura de información, estructura de la Home, principios UX. **El documento operativo más útil para construir.** |
| Este archivo | Principios, límites, Definition of Done. |
| `docs/development.md` | Cómo levantar el proyecto, estructura, dependencias y verificaciones. |
| `docs/legal-brief.md` | Qué falta en las páginas legales y qué decisiones lo bloquean. Para Compliance. |
| `docs/migracion-urls.md` | Qué pasa con cada URL del sitio actual en el cutover. Para Fase 6. |
| `docs/hardening-2026-09-04.md` | Hallazgos de la revisión de endurecimiento, clasificados. |
| `docs/auditoria-preproduccion.md` | Auditoría técnica previa a producción y qué falta para desplegar. |
| `docs/arquitectura-produccion.md` | Qué corre dónde, mapa de integración, modos de fallo y configuración de host pendiente. |
| `docs/design-system/board-tipografia.html` | Board que sustentó la elección de tipografía. Se abre en el navegador. |

**De consulta (no rehacer, sí citar):** `docs/research/phase-0-findings.md` (hechos técnicos,
riesgos, pendientes I1–I19) · `phase-1-visual-ux.md` (§6, §17 y §18 son el filtro para decidir
patrones) · `phase-2-visual-directions.md` + su Artifact de mockups.

### 0.3 Límites duros de la fase actual

- **No instalar dependencias** sin el análisis escrito del §8. Hoy el proyecto declara **cuatro
  paquetes**, los cuatro de build y ninguno en el navegador: `astro`, `@astrojs/check`,
  `typescript` y `@types/node` (tipos de los módulos `node:` que usan los tests; sin él
  `astro check` no puede verificarlos). Cero dependencias de estilo, cero framework de UI, cero
  dependencias en runtime.
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

**Arquitectura de información v1 — enmendada el 2026-09-09 y el 2026-09-11:**
`/` (Home con el cotizador en el hero) · `/como-funciona` · `/empresas` · `/confianza` ·
`/blog` y `/blog/<slug>` ·
legales: `/terminos`, `/privacidad`, `/tarifas`, `/canal-de-denuncias`.
Las **nueve** rutas estáticas existen y resuelven, más una por artículo. La FAQ vive en la Home,
no como página propia.

**`/blog` se añadió el 2026-09-11.** Colección tipada de Astro (`src/content.config.ts`) con
esquema cerrado: `title`, `description`, `pubDate`, `category` —sólo `DLPay` o `Mercado`, un valor
fuera de esa lista rompe el build— y `coverImage` opcional resuelta por `astro:assets`. Sin
paquetes nuevos: `sharp` ya viene como dependencia opcional de Astro, así que `package.json` sigue
declarando cuatro. Enlazado desde el desplegable «Información» de la cabecera. El sitemap se
derivaba de `src/pages/**/*.astro` y publicaba `/blog/index/` y `/blog/[slug]/` —dos 404—: ahora
colapsa los `index` anidados, descarta las rutas dinámicas y añade cada artículo desde la
colección.

**Ningún artículo se publica sin pasar por Compliance.** Un análisis de mercado es, por
definición, contenido que afirma algo sobre precios: cae de lleno en §3. El artículo de ejemplo
que existe hoy lleva su marcador y es sólo para verificar la infraestructura.

**`/cotizar` se eliminó el 2026-09-09.** Duplicaba el cotizador que ya está en el héroe de la
Home y no se ganaba el espacio. Con eso se **cierra la hipótesis H8** de Fase 1 —«`/cotizar` como
página casi-solo-cotizador sirve al recurrente y a los links de WhatsApp»—, que estaba marcada
`P1` y pendiente de «uso real / feedback del equipo»: el equipo dio ese feedback. No rompe nada
externo, porque la ruta no existe en el sitio actual (no figura en `docs/migracion-urls.md`). Los
CTA que apuntaban ahí van ahora al ancla `/#cotizador` del héroe.

Lo que se pierde y conviene tener presente: ya no hay una URL limpia que pegar en WhatsApp para
que alguien caiga directo en la herramienta. Si eso hace falta, la vía es un ancla —`/#cotizador`,
que ya funciona— y no reponer la página.

**Textos legales:** Claude Code **no los redacta**. `/tarifas` y `/canal-de-denuncias` tienen
contenido real porque describen el servicio, no obligaciones contractuales. `/terminos` y
`/privacidad` son páginas de estado hasta que Compliance entregue el texto — ver
`docs/legal-brief.md`.

**El cotizador:** modelo `qué quieres hacer → monto → cuánto recibes → precio referencial →
WhatsApp prellenado → el ejecutivo confirma el precio final y coordina el destino`. La intención
—convertir a dólares, convertir a pesos— es el primer paso. **Eran tres hasta el 2026-09-14:**
«enviar al extranjero» se retiró por hacer la misma aritmética que «convertir a dólares» y leerse
como un camino duplicado. Lo que se pierde está razonado en `cotizador-spec.md`. Especificación completa en `docs/design-system/cotizador-spec.md`. No ejecuta
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
  Playwright (el MCP ya conecta, ver §11). Verificar responsive en desktop/tablet/móvil.
  `build` verde **no** es "terminado". Sin pirámide de tests para contenido estático.
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

- **Repositorio inicializado y sólo local.** 48 commits, sin remoto. Todo el historial está
  firmado por `Sebastián Villanueva Pereira <sebastian@dlpay.cl>`, fijado en `.git/config` de
  este repo (no en la configuración global). La identidad quedó saneada el 2026-09-11: hasta
  entonces los commits iban a nombre de un usuario y un hostname locales.
- **PENDIENTE DE DECISIÓN — crear la organización GitHub de DLPay (D3).** Mientras no exista, el
  repositorio **no tiene copia fuera de este equipo** y esa es la mayor exposición del proyecto:
  un disco que falla se lleva las Fases 3 y 4 completas. El repositorio debe **pertenecer a
  DLPay** (organización, no una cuenta personal como único dueño).
- **Respaldo provisional en Google Drive** (decidido el 2026-09-11, hasta que exista la
  organización). Se guarda un **`git bundle`**, no la carpeta sincronizada: el cliente de Drive
  sincroniza `.git/` mientras git escribe dentro y puede dejar el repositorio corrupto, además de
  arrastrar `node_modules/` y `dist/`. Un bundle es **un solo archivo**, contiene el historial
  completo y se restaura con `git clone <bundle> <carpeta>`. Se regenera con:
  `git bundle create ../dlpay-web-<fecha>.bundle --all`
- **Al subir a la organización, `push` normal, nunca `push --mirror`.** `--mirror` sube todas las
  referencias, incluidas las de respaldo de cualquier reescritura, y republicaría historiales que
  se limpiaron a propósito.
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
- **playwright (MCP):** automatización de navegador para E2E y capturas. **Conecta y funciona**
  desde el 2026-09-10: `npx` está en `/usr/local/bin/npx`. Se usó para medir en un navegador real la
  entrada del titular de la Home. El dato anterior —«no conecta»— quedó obsoleto.
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
| D3 | **Crear la organización GitHub de DLPay** y trasladar ahí el repositorio, que debe pertenecer a la empresa y no a una cuenta personal (ADR-0003). Al 2026-09-11 la organización **no existe** y el repo **no tiene copia fuera del equipo de Sebastián**; el respaldo provisional es un `git bundle` en Google Drive (ver §10). Al trasladarlo: `push` normal, nunca `--mirror` | No bloquea construir, **sí es el mayor riesgo operativo abierto**: hoy no hay redundancia del historial | Sebastián |
| ~~D4~~ | ~~Idioma de código y commits~~ | ✅ Cerrado: código en inglés, commits/docs/contenido en español | ADR-0003 |
| D5 | **Transparencia del spread**: ¿la web muestra la lógica de tramos o solo un referencial? Define la tabla de `/tarifas` | **Sí — es lo único que falta para completar `/tarifas`** | DLPay (I10/I11) |
| D6 | **Monto mínimo real** y precio de muestra del cotizador | No — hoy son placeholders | DLPay |
| D21 | **Monto máximo.** El estado `above_max` está cableado y probado, pero sin `PUBLIC_QUOTE_MAX_CLP` no se activa: hoy se acepta cualquier monto | No bloquea, pero un monto absurdo llega tal cual al ejecutivo | DLPay |
| D22 | **Mensaje prellenado en cinco enlaces planos a WhatsApp**, que hoy abren el chat en blanco (hallazgo M4): el pie, `/tarifas`, `/como-funciona`, `/confianza` y el botón «Habla con nosotros» del encabezado de `/empresas` (añadido el 2026-09-10). El texto de ese botón también es provisional. Todos usan `contact.whatsappUrl()` sin argumento, así que la lista se comprueba con un grep | No | Sebastián |
| D23 | **Canal de respaldo si WhatsApp no abre.** Todo el funnel termina en un único canal; si el enlace no abre, la persona queda sin salida visible en ese momento | No | Sebastián |
| ~~D24~~ | ~~Consolidar el monto mínimo en `lib/config`~~ | ✅ **Cerrada 2026-09-09.** Los límites del cotizador (`PUBLIC_QUOTE_MIN_CLP`, `PUBLIC_QUOTE_MAX_CLP`) y el monto de muestra se resuelven UNA vez en `lib/config/environment.ts` (`resolveQuoteLimits`, puro y testeado) y se exponen como `quoteLimits` en `lib/config/site.ts`. Los cinco consumidores —cotizador, `/tarifas`, mockup y las dos ilustraciones de la Home— dejaron de leer el entorno: `/tarifas` publica por construcción el mismo mínimo que el cotizador aplica. Commit `c5f0ad5` | — | — |
| D7 | **Fuente oficial de market price** | No — `ConfigPriceSource` cubre v1 | DLPay |
| ~~D8~~ | ~~Alcance de servicios a comunicar~~ | ✅ Cerrado 2026-09-04: el amplio, alineado con los T&C publicados | Equipo DLPay |
| ~~D16~~ | ~~Cómo llega el dinero al destinatario final~~ | ✅ Cerrado 2026-09-04: DLPay entrega **dólar digital en la billetera**; no deposita en cuentas bancarias en el extranjero. Ver §1 | Equipo DLPay |
| ~~D17~~ | ~~"Sin esperar días"~~ | ✅ Reformulado 2026-09-04: la rapidez se predica de la conversión y del movimiento del dólar digital, nunca de una recepción bancaria en destino | Equipo DLPay |
| ~~D18~~ | ~~Fuente real de actividad reciente~~ | ✅ **Cerrada 2026-09-09: se descarta la funcionalidad.** El feed de «operaciones recientes» nunca salió de la investigación —cero menciones en `phase-2.5` y en `cotizador-spec`—; nació al construir `/cotizar` y se quedó sin página al eliminarla. Además chocaba con **D10**: un feed de actividad **es** una cifra de volumen, y publicarlo en continuo es una decisión de Compliance, no de ingeniería. `ActivityFeed.astro`, `lib/activity` y sus 15 tests se eliminaron (514 líneas). Si algún día se quiere prueba social, la puerta es **D10** y el punto de partida está en el historial, antes de `7577ffe` | — | — |
| D28 | **¿Necesita la franja de notificación un botón de cerrar?** Hoy es estática y se oculta sola en la página que enlaza (ADR-0006). Cerrarla de verdad exige script síncrono en el `<head>` + `sessionStorage`, y con ello el fin de «cero almacenamiento» y de las cuatro legales en cero JS. Se reabre **con evidencia de que estorba**, no por incomodidad | No | Sebastián |
| D27 | **Cabeceras del host**: `X-Robots-Tag: noindex` en Staging —la defensa robusta, porque `Disallow` impide leer el `noindex` del HTML— y evaluar un CSP por hash de los tres scripts en línea, que permitiría quitar `unsafe-inline`. Conjunto completo en `docs/arquitectura-produccion.md` §5.1 | No | Al cerrar D1b (proveedor) |
| D9 | **Razón social**: se usa **DLPZ INCZ SpA**. Los T&C publicados dicen "DLPZ PRO SpA" (RUT 78.378.714-8) | **Sí — bloquea publicar los textos legales.** No se puede publicar bajo una entidad que contradiga el contrato vigente | `REQUIERE VALIDACIÓN DE COMPLIANCE` — Joaquín. **No reinvestigar.** |
| D19 | **Correo oficial de contacto**: los T&C dicen `contacto@dlpay.cl`, la Política dice `contacto@dlpzpro.cl` | Sí, para el canal de denuncias. La web no publica ninguno hasta confirmarlo | Compliance |
| D20 | **El alcance de los T&C ya no coincide con el servicio**: hablan de custodia y liquidaciones internacionales; el servicio real es cambio de divisas con entrega de dólar digital | Sí, antes de publicar los textos | Compliance |
| D10 | **Testimonios, cifras de clientes/volumen, logos de empresas** | No — no se publican hasta verificar | DLPay (I15) |
| ~~D25~~ | ~~Membresía en FinteChile~~ | ✅ Cerrada 2026-09-07: socio confirmado por Sebastián. Logo publicado en el pie | — |
| ~~D26~~ | ~~Emblema de la UAF en el pie~~ | ✅ Cerrada 2026-09-07: Sebastián afirma registro y supervisión vigentes. Se publica el emblema **y** la frase que fija su alcance. La redacción exacta —"registrada y supervisada", nunca "autorizada" ni "avalada"— queda fijada en `lib/config/alliances.ts`; ampliarla es un claim nuevo | — |
| D11 | **Equipo con nombre y foto** en `/confianza` | No | Sebastián |
| D12 | **Quién redacta y aprueba el copy** | No para Fase 3 | DLPay |
| D13 | **SPF y DMARC ausentes** en `dlpay.cl` (riesgo de suplantación) | No — es de quien administra el DNS hoy | Guita / DLPay |
| D14 | **Transferencia del dominio, DNS y Google Workspace** | No para Fases 3–5; sí para Fase 6 (cutover) | DLPay ↔ Guita |
| D15 | **Cuenta/credenciales de CodeRabbit** | No | Sebastián |

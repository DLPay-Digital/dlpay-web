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
  **Una segunda, del 2026-09-15:** el globo, con **dos** movimientos infinitos —la rotación de la
  esfera y el pulso del marcador de Chile—. Ver ADR-0008. Con eso son tres en todo el sitio, y la
  regla dura 1 («una sola vez») sigue valiendo para todo lo demás.
  **Una tercera, del 2026-09-25:** la **intro de marca** de la Home —830 ms de telón en los que el
  isotipo se separa por su propio eje y se une—. Enmienda dos reglas a la vez: el techo de 280 ms y,
  sobre todo, la regla dura 2 («el cotizador no entra»), porque el telón lo **tapa** 937 ms. Se
  autoriza taparlo, nunca animarlo: la tarjeta está renderizada y operativa debajo desde el primer
  fotograma, y eso está medido. Ver ADR-0010. **Con ella el sitio deja de estar en «cero
  almacenamiento»** —el marcador de visita escribe una llave en `sessionStorage`—, y con eso vació el
  argumento con el que D28 estuvo aparcada. **D28 se cerró el 2026-09-29, y no por ese argumento
  sino porque nadie ha pedido cerrar la franja.** Las cuatro legales y la 404 **siguen en cero bytes
  ejecutables**: no reciben ni el marcador ni la intro.
- **Auditoría previa a producción hecha, en dos revisiones (2026-09-04 y 2026-09-08).** La segunda
  cerró dos fallos críticos que no se veían en localhost: la guarda de `PUBLIC_SITE_URL` se
  esquivaba con `astro build` directo y sólo comprobaba presencia —`.env.example` traía
  `localhost`—, y no existía forma de evitar que Staging fuera indexado. Ver
  `docs/auditoria-preproduccion.md`.
- **No queda ingeniería para publicar, y el proyecto está en mejora continua.** Las dos cosas a la
  vez, y conviene no leer sólo la primera. Desde el 2026-09-08 no hay ninguna tarea técnica que
  bloquee una salida a producción: lo que falta es de Compliance. Pero el proyecto **no se detuvo
  ahí** — entre el 10 y el 17 de septiembre entraron el globo del héroe, el blog con su candado de
  publicación, la 404, cinco familias de figura y el rediseño de tres páginas, además de la
  corrección de una auditoría externa. Eso es mejora continua, no ingeniería pendiente, y la
  diferencia importa: **nada de eso bloquea publicar, y ninguna de esas piezas nació de una
  carencia funcional.** Quien lea esta línea buscando «¿podemos salir?» tiene su respuesta arriba;
  quien la lea buscando «¿está el proyecto quieto?» no debe concluir que sí. *Redactado el
  2026-09-17: la versión anterior decía sólo que el proyecto técnico estaba terminado, y era cierta
  pero incompleta.*
- **Lo que falta para publicar es de Compliance.** Tres decisiones **bloquean** los textos legales: D9 (razón social), D19 (correo
  oficial) y D20 (alcance de los T&C). Pero no son lo único que necesita firma: hay además
  **claims ya publicados** con marcador `REQUIERE VALIDACIÓN DE COMPLIANCE` —el banco por nombre,
  el tiempo de ~5 minutos, los 10 días hábiles, «Precio garantizado», «la mesa de dinero» y «el
  mejor precio»— que nadie ha aprobado. Decía «exclusivamente» y era inexacto: corregido el
  2026-09-15 a raíz de una auditoría externa. La lista completa está en *Bloqueantes de producción*
  y en *Claims publicados pendientes de firma*, en `docs/auditoria-preproduccion.md`. Todo lo demás
  es configuración del host.
- **El sitio está publicado en Staging desde el 2026-10-06**, en Cloudflare Workers:
  **`dlpay-web.sebastian-a9b.workers.dev`**. Se construye y despliega **solo, en cada `push` a
  `main`**, desde `DLPay-Digital/dlpay-web`. La configuración es `wrangler.jsonc`, en la raíz, y no
  añade ninguna dependencia. Cierra **D1b**.

  **Sigue siendo Staging, y la diferencia es una variable.** `PUBLIC_ALLOW_INDEXING` no está
  definida en el entorno de despliegue, así que todas las páginas salen con `noindex, nofollow` y el
  `robots.txt` con `Disallow: /`. **Crear esa variable es el gesto de salir a producción**, y no se
  hace mientras `/terminos/` y `/privacidad/` sean borradores (D9, D19, D20) y haya claims sin
  firmar. Lo que falta para publicar de verdad sigue siendo de Compliance, no de ingeniería.

- **Dos variables gobiernan el despliegue y el build las valida** (`dlpay:deploy-guard` en
  `astro.config.mjs`): `PUBLIC_SITE_URL` es obligatoria y debe ser publicable —rechaza hosts
  locales, lo que no sea `https` y rutas fuera de la raíz—, y `PUBLIC_ALLOW_INDEXING` va **cerrada
  por omisión**: sin `true` explícito el sitio se publica con `noindex` y `Disallow: /`. Un build
  en local necesita la URL en la misma línea:
  `PUBLIC_SITE_URL=https://dlpay.cl npm run build`.
- **Esqueleto creado y verificado.** Astro 7 + TypeScript strict, `npm run check` y
  `npm run build` en verde, fuentes T-C auto-hospedadas, tokens del Design System en código, y la
  cadena `PriceSource → Quote` en pie. Ver `docs/development.md`.
  **Sobre el JavaScript, que ya no es cero:** el esqueleto se levantó sin una sola línea en el
  cliente y así siguen las cuatro legales y la 404. Hoy la Home envía **50,3 KB**: el cotizador
  (4,5 KB), el Motion System (0,5 KB), el globo (40,5 KB, casi todo coordenadas) y la intro de marca
  (6,3 KB). Las excepciones están autorizadas y acotadas —ADR-0009, ADR-0008 y ADR-0010—; el
  inventario exacto, por página, está en `docs/arquitectura-produccion.md` §1.1.
  **Que las cinco páginas en cero sigan en cero ya no depende de la memoria de nadie:**
  `tests/zero-js.test.ts` lo comprueba sobre el build.
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
| `docs/research/phase-3-arquitectura.md` | Las cuatro decisiones de arquitectura y el esqueleto. Registro escrito a posteriori. |
| `docs/research/phase-4-construccion.md` | **Qué se construyó, qué se retiró y qué se aprendió.** En curso: se actualiza. Incluye las cinco trampas de medición que costaron tiempo real. |
| Este archivo | Principios, límites, Definition of Done. |
| `docs/development.md` | Cómo levantar el proyecto, estructura, dependencias y verificaciones. |
| `docs/legal-brief.md` | Qué falta en las páginas legales y qué decisiones lo bloquean. Para Compliance. |
| `docs/migracion-urls.md` | Qué pasa con cada URL del sitio actual en el cutover. Para Fase 6. |
| `docs/hardening-2026-09-04.md` | Hallazgos de la revisión de endurecimiento, clasificados. |
| `docs/auditoria-preproduccion.md` | Auditoría técnica previa a producción y qué falta para desplegar. |
| `docs/arquitectura-produccion.md` | Qué corre dónde, mapa de integración, modos de fallo y configuración de host pendiente. |
| `docs/design-system/board-tipografia.html` | Board que sustentó la elección de tipografía. Se abre en el navegador. |

**Las Fases 3 y 4 ya tienen registro** (2026-09-17). Hasta entonces la serie de `docs/research/`
se cortaba en la 2.5 y todo lo posterior vivía sólo en los commits y los ADR.

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
- **No buscar archivos fuera de la carpeta del proyecto.** *Instrucción de Sebastián, 2026-09-28.*
  Todo lo que este proyecto necesita vive bajo `Projects/dlpay-web/`, **incluida `Claude outputs/`**,
  que es donde aterrizan las entregas de Cowork y está en el `.gitignore` **y, desde el 2026-09-30,
  también en el `exclude` de `tsconfig.json`**. Lo segundo hizo falta en cuanto una entrega trajo
  archivos `.astro`: `npm run check` los compilaba y devolvía **93 errores**, todos de código que no
  es del repositorio, y con la puerta roja por ese motivo un error de verdad pasa inadvertido.
  Estar fuera de git no basta para estar fuera del type-check. Si un archivo no aparece
  ahí, **se pide**; no se rastrea el resto del equipo. Vale también para las carpetas personales
  —Descargas, Escritorio, Documentos—: no son parte del proyecto y pueden contener material que
  el Principio 7 mantiene deliberadamente fuera del repositorio.

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

### Dos modos de operar, y el sitio describe uno  ·  *añadido el 2026-09-29*

**Hay dos.** El **asistido**, que es el que el sitio cuenta: el cliente escribe por WhatsApp, un
ejecutivo confirma el precio, el cliente transfiere y nosotros le enviamos el dólar digital a su
billetera. Y el **autoservicio**, en la plataforma —hoy la de Guita, y el sitio lleva a ella **ocho
veces** con «Crear cuenta» e «Iniciar sesión»—: el cliente paga, convierte y retira por su cuenta.

**La consecuencia que obliga a escribir esto:** en autoservicio, entre la conversión y el retiro,
**el dólar digital está en el sistema de DLPay, contra un fondo propio.** El cliente tiene un
**saldo**, no el activo, y al retirar se descuenta de su saldo y del fondo. *Informado por Sebastián
el 2026-09-29.*

**Por eso el sitio NO puede publicar una negación absoluta de custodia.** La frase «no emitimos
stablecoins **ni las custodiamos por ti**» estuvo publicada unas horas en el artículo de stablecoins
y se retiró ese mismo día: es cierta del modo asistido y falsa del autoservicio. Lo que sí se puede
decir, y es lo que queda, es **«cuando nos pides que te lo enviemos, va a tu billetera»**.

**Qué queda acotado al modo asistido, y por qué cada uno:**

| dónde | cómo quedó |
|---|---|
| el artículo de stablecoins | perdió «ni las custodiamos por ti» |
| bajada de `/confianza` | «Dónde está tu dinero **cuando operas con un ejecutivo**», porque su figura de tenencia dibuja ese recorrido y en autoservicio hay un estado más que no muestra |
| los seis pasos de `/como-funciona` | se quedan como están: su paso 02 es «Escribes por WhatsApp», así que ya son el modo asistido por construcción y no afirman ser el único |

**PENDIENTE DE DECISIÓN — contar el autoservicio en `/como-funciona`.** Esa página existe justo
para explicar cómo funciona una operación y hoy enseña la mitad del producto. Hacerlo bien implica
un segundo recorrido, un cuarto estado en la línea de tenencia de `/confianza`, y mirar cómo se lee
junto al proceso de inscripción en la CMF, porque **mantener saldos de clientes es la actividad que
ese registro contempla**. Mientras no se haga, **la única página que menciona el autoservicio es
`/preguntas`**, en la respuesta de volver a pesos, y eso está al revés de como debería ser.

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

   **Dos excepciones, ambas del 2026-10-01 y con lista cerrada en `ADR-0011`:**

   | pieza | dónde | qué trae | ¿se mueve? |
   |---|---|---|---|
   | **Diario DLPay** | portada de `/blog` | grano, mancha, relieve, luz, perspectiva 3D | sí |
   | **Abanico de etiquetas** | portada de `/precio` | cartulina, relieve, sombras de material | no |

   Las dos traen textura o animación decorativa, que es la categoría que este principio nombra, y
   las dos las autorizó Sebastián. **La primera se concedió diciendo que era «la única pieza fuera
   del registro»; la segunda llegó el mismo día.** Por eso ADR-0011 pasó de una promesa a una
   **lista cerrada y nombrada**: una tercera pieza con materia no entra por ese ADR, vuelve a abrir
   la conversación, y entonces la pregunta será si ADR-0001 sigue describiendo este sitio.

   **Lo que NO se toca:** el resto del sitio sigue en el registro de ADR-0001, y los cuatro
   dispositivos en CSS conservan su regla escrita —*plano y sin trucos: nada de 3D, reflejos ni
   desenfoques*—.
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

**Una enmienda, del 2026-09-29, autorizada por Sebastián:** un trazo puede representar además **una
pregunta del visitante**, y sólo eso. Entró con la portada de `/preguntas`, que dibujaba un punto por
cada una de las nueve preguntas publicadas, arriba las de una persona y abajo las de una empresa.

*Por qué hacía falta enmendar y no bastaba con el §6.2.* Las tres cosas que la regla admitía son
todas **dinero o su recorrido**, así que el sitio no tenía marca para una página cuyo objeto no es
dinero, y `/preguntas` fue la primera. La alternativa era dejar esa página sin portada para siempre o
dibujarle algo que no fuera su objeto, y las dos son peores.

*Y lo que la enmienda NO abre.* No autoriza un trazo por «un tema», «una idea» o «una sección»: eso
es un índice, y un índice dibujado es exactamente lo que se retiró de esa página el 2026-09-24. La
marca concreta —**punto lleno neutro = una pregunta**— está escrita en el Design System §6.2 con su
alcance, y el catálogo sigue siendo cerrado: añadir otra cosa vuelve a pedir esta conversación.

**La enmienda sigue concedida y hoy no tiene consumidor.** *Anotado el 2026-09-30.* La figura que la
pidió duró un día: `/preguntas` abre ahora con **una tableta dibujada en CSS y una conversación
dentro** —la tercera pieza de la familia del teléfono y el portátil—, y la respuesta que se lee en
la pantalla sale de `general.ts` palabra por palabra. Ningún trazo del sitio representa hoy una
pregunta.

**La concesión no se revoca por falta de uso**, que es decisión de Sebastián y no de quien mide:
quien vuelva a necesitar ese trazo lo tiene autorizado y acotado. Lo que se corrigió es la
**afirmación**: el Design System §6.2 saca la marca de su tabla de «lo que las figuras usan hoy» y
la baja a una nota, porque esa tabla se escribe midiendo el build. La lección está allá y es de
método: *una marca se puede escribir antes de dibujarla, con razón, y aun así quedarse sin nada que
describir — porque el dibujo que la pedía puede caer por motivos que no tienen que ver con ella.*

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

**Y desde el 2026-10-01 hay un tercer nombre: «Diario DLPay»**, la cabecera de la portada de
`/blog`. Es una decisión de marca y no de diseño, y la tomó Sebastián. **Está acotado a esa
pieza**: no es una sub-marca del blog, no aparece en el menú, ni en el pie, ni en los artículos, ni
en el `title` de ninguna página. Si algún día se quiere usar fuera de ahí, es una conversación de
marca, no un cambio de CSS. Ver ADR-0011.

**Tipografía (cerrada 2026-09-04): set T-C** — **Familjen Grotesk** (display, títulos y texto) +
**Spline Sans Mono** (cifras). Ambas SIL OFL, variables, **auto-hospedadas** (nunca desde un CDN
de terceros). Criterio permanente: **las cifras son las protagonistas y la tipografía no debe
volverse excesivamente grande** — la escala es un techo, no un objetivo; si un titular compite con
la cifra, se reduce el titular. Ver Design System §3 y §3.0.

Referencias (Global66, Buda, Wise, DolarApp, Fintual, Bithonor como contra-ejemplo): analizar
**principios** de UX, jerarquía, conversión, densidad, navegación y comunicación de confianza. No
copiar layout, componentes, textos, colores, iconografía, estructura, animaciones ni branding.

Ver ADR-0007: única excepción de paleta, una gama cartográfica acotada al componente del globo.

---

## 6. UX  ·  *cerrada en Fase 2.5*

**Principio rector: cotizar es el centro.** Todo lo demás sostiene esa acción. Una sola acción
primaria por pantalla.

**Los 10 principios UX de DLPay** están en `phase-2.5-definicion-experiencia.md` §8 y son
vinculantes. En resumen: honestidad sobre el precio (referencial, nunca cerrado) · web y WhatsApp
son una sola conversación · móvil primero · confianza que se comprueba, no que se afirma · la
geometría siempre tiene función · rápido de verdad · personas y empresas caben pero la Home no se
vuelve corporativa · español chileno plano · identidad propia.

**Arquitectura de información v1 — enmendada el 2026-09-09, el 2026-09-11 y el 2026-09-23:**
`/` (Home con el cotizador en el hero) · `/como-funciona` · `/precio` · `/empresas` · `/confianza` ·
`/preguntas` · `/blog` y `/blog/<slug>` ·
legales: `/terminos`, `/privacidad`, `/tarifas`, `/canal-de-denuncias`.
Las **once** rutas estáticas existen y resuelven, más una por artículo.

**`/precio` y `/preguntas` se añadieron el 2026-09-23.** Ninguna de las dos es contenido nuevo
disperso: `/preguntas` **importa** las nueve preguntas de `home.ts` y `business.ts` —siguen
publicadas donde estaban, que es donde resuelven una objeción en su contexto— y añade el glosario
de ocho términos (`content/glossary.ts`). `/precio` responde «¿qué me van a cobrar?» con una sola
afirmación: **un solo cobro en toda la operación, y va dentro del precio.**

**`/precio` no reemplaza a `/tarifas`, y la distinción importa.** `/tarifas` es una página legal,
se queda en el pie, describe la composición del precio y el mínimo, y es donde aterrizará D5 el día
que se cierre. `/precio` vive en el menú «Información» y se lee antes de operar. Ninguna copia
texto de la otra: la frase de condiciones por volumen se importa de `business.ts`, donde vive con
su marcador de Compliance.

**El 2026-09-30 `/precio` se rehizo entera, y lo primero que arregló fue una contradicción con el
propio sitio.** Su bajada decía «Lo que ves **al cotizar** es lo que pagas», y la Home publica
«¿El precio de la web es el precio final? **No.** Es un precio referencial» y `general.ts` publica
«el que se aplica es el que tu ejecutivo te confirma, no el que la web mostraba cuando cotizaste».
La bajada ahora dice **«El precio que aceptas es el que pagas»**, que es lo que la banda de los 12
minutos sí demuestra.

**Queda dicho el matiz, porque es donde vive el riesgo:** esa frase es cierta **dentro de la
ventana**. Si se pasan los 12 minutos, `general.ts` dice que se cotiza de nuevo. No es el error
anterior —aquella frase la contradecía el sitio de frente, ésta lleva una condición que la página
explica dos secciones más abajo— pero **ampliarla o quitarle la banda vuelve a hacerla falsa.**

Lo demás que entró: un **panel con la cifra de ejemplo** en la portada —la página se llamaba «Un
solo número» y no enseñaba ninguno—, el enlace «Cotizar otro monto» que baja la primera acción de
**3.190 a 622 px**, una fila de «Cancelar antes de transferir» en la tabla de costos, y una sección
«Preguntas sobre el precio» con tres respuestas **importadas** de `home.ts` y `general.ts` por el
texto de su pregunta: si alguna se reescribe, el build para. La figura de las dos barras se retiró.

**El panel duró un día.** El 2026-10-01 Sebastián pidió otro objeto —«ya usa algo parecido al
cotizador»— y la portada pasó a ser **un abanico de cinco etiquetas de precio colgadas del mismo
ojal**, de las que sólo la de delante cobra. Es la segunda pieza de la lista cerrada de ADR-0011.

**Con eso `/precio` vuelve a no enseñar ninguna cifra, y es deliberado.** Sebastián lo pidió «sin
números ni diagramas». No es una contradicción con el titular: «Un solo número» es una afirmación
sobre **cómo se cobra**, y la etiqueta de delante la dice con palabras —«Un solo cobro»—. Lo que se
pierde es el ejemplo concreto.

**Y baja la exposición de D7**, que el panel había subido: la cifra 2.174,62 sale de la portada y
`PUBLIC_QUOTE_SAMPLE_RATE` vuelve a vivir sólo dentro del cotizador. Sigue abierta, pero deja de
ser *la* cifra de una página.

**La FAQ sigue viviendo en la Home y en `/empresas`**, no como página propia: `/preguntas` las
reúne desde la misma fuente tipada, no las muda.

**Y desde el 2026-09-29 `/preguntas` tiene además preguntas propias.** Sebastián señaló que las
nueve importadas son todas del mismo registro —objeciones previas a decidir, que por eso viven donde
se decide— y que reunirlas convertía la página en un índice de las otras dos. El registro que
faltaba es el siguiente: **ya decidí, cómo es esto en la práctica y qué pasa si algo se sale del
guion**, que es general y no tiene público. Viven en `content/general.ts` y se rinden en su propia
sección, no repartidas entre los cinco grupos, porque esos grupos cruzan preocupación con público y
estas preguntas no tienen lado. **Queda abierto** si las nueve importadas siguen ahí o vuelven a ser
sólo de sus páginas.

**El 2026-09-30 la página se reordenó alrededor de esas trece**, sin tocar ni una respuesta:

- **Portada nueva**: una tableta dibujada en CSS con **una conversación dentro** —la pregunta de
  cancelar y su respuesta, sacadas de `general.ts` palabra por palabra—. Sustituye la figura de nueve
  puntos, que contaba 9 cuando la página tiene 13. Se retira con ella la única marca del vocabulario
  que representaba una pregunta; ver §5.
- **Banda de entrada**: los seis grupos con su recuento, enlazados. **Roza la decisión de Sebastián
  del 2026-09-24** —él retiró un índice pegajoso numerado 01–05— y **él la aprobó sabiéndolo**: ésta
  no se pega y el número es cuántas preguntas hay, no el orden. Anclas nativas, cero JavaScript.
- **Una salida al acabar las preguntas**, porque entre la última respuesta y «escríbenos» había
  1.563 px de glosario. La primera salida pasa del **85 % al 63 %** del scroll. El cierre no se toca:
  es redundancia deliberada, y si sobra una de las dos sale la nueva.
- **«Volver arriba»** al final del glosario.

**Lo que no cambió, a propósito:** los seis grupos, sus respuestas, el glosario y el cierre. La
página crece de 6.294 a 6.989 px a 1280, y **la banda no acorta el scroll: da un salto.** Llegar al
sexto grupo desde el primero sigue siendo 2.284 px bajando; lo que se gana es no tener que bajarlos.

**`/confianza` cambió de portada el 2026-09-30.** Era la **línea de tenencia** —tres barras con
rótulos, «En tu cuenta bancaria · En la cuenta de DLPay · En tu billetera»— y pasa a ser **los tres
avisos que le llegan al teléfono al cliente en una operación**: el de su banco, el nuestro y el de
su billetera. Dicen los mismos tres momentos y en el mismo orden, pero **contados por quien tiene el
dinero en cada uno**, y **dos de los tres no los escribe DLPay**. Eso es lo que el titular de esa
página promete —«Confianza que **se comprueba**»— y una figura de barras no podía dar.

**La bajada no cambia:** «cuando operas con un ejecutivo» acota el recorrido al modo asistido, que
es el que estos avisos describen. Ver «Dos modos de operar» en §1.

**Arrastró dos cosas que la entrega no había visto:**

- **El puente de `/tarifas` enseñaba esa línea** como anticipo del destino, copiada en
  `FiguraTenencia.astro`. Al retirarse la línea, el puente anticipaba una figura que el destino ya
  no tiene. Usa ahora el mismo componente de los avisos, con `forma="puente"`, y ese componente
  **se comparte en vez de copiarse** —al revés que los otros cuatro puentes— porque lo que hay
  dentro son cadenas con firma de Compliance: dos copias de una cadena firmada es cómo el sitio
  acaba diciendo dos cosas.
- **`Phase` y `phases` se retiraron de `trust.ts`.** La entrega decía que quedaban sin uso; tenían
  un segundo consumidor, que era ese puente.

**`/como-funciona` cerró la tanda el 2026-10-02**, y es la cuarta página en el mismo registro. Sin
cambiar una palabra: todo sigue saliendo de `process.ts` y `scope.ts`.

- **«Ten esto a mano»** era una lista con tres iconos sueltos de 20 px y pasa a ser **la carpeta de
  `/empresas`**, la misma pieza. Era el mismo contenido —lo que traes tú— y tenía que ser el mismo
  objeto. **La pestaña va vacía**, como en `/confianza`: el titular está justo encima.
- **«Dónde termina nuestra operación»** era una línea de 1 px, la bisagra en mono de 13 px y tres
  frases. Pasa a dibujar **la billetera y sus tres salidas**: el tramo verde llega hasta ella, la
  cuña cae en la entrada, y desde ahí la línea sigue en gris con una **frontera punteada antes de la
  tercera opción**.

**Esto importa más que un cambio de dibujo, y por eso se escribe acá.** `CLAUDE.md` §1 pide que el
límite del servicio se declare **de frente** en esta página, antes de que el usuario opere — y hasta
hoy el límite era lo más tenue de la página. Ahora se ve. **Nada del otro lado de la frontera es
verde y no hay ningún banco dibujado**: el límite se dice con el vacío y con la frase, nunca
dibujando lo que no hacemos.

**Y se extrajo `Carpeta.astro`, en su tercer uso.** `ComoEmpezamos` y `CarpetaRequisitos` pasan a
usarla y **`/empresas` y `/confianza` no cambian un píxel** — comprobado por hash, 88 capturas y 44
altos de página. Las dos llevaban escrita la misma nota desde que nacieron: «dos usos no justifican
extraer una pieza; si aparece un tercero, se extrae». Apareció.

**La Home pasó a objetos el 2026-10-02**, la última de las tres y con el mismo criterio. Tampoco
cambia una palabra: todo sigue saliendo de `home.ts`.

- **«Tres formas de usarlo»**: las tres figuras abstractas pasan a **tres objetos** —cruza, convierte
  y reparte— sobre la lámina de `/empresas`. **La topología es el dato y se conserva**: lo que
  significaba cada trazo sigue significando lo mismo.
- **«Confianza que se comprueba»**: los tres bloques llevan encima **el objeto de `/confianza`**, que
  es a donde lleva su enlace. **El del precio NO es el de `/confianza`, a propósito**: allá el bloque
  del reloj dice «el precio es referencial» y acá dice «ya incluye el spread, no se suma nada». Mismo
  icono, otra afirmación, así que lleva otro objeto —una sola etiqueta y un gancho vacío— y por eso
  el objeto se pide **por nombre y no por el icono**.
- **El puente a `/tarifas` enseña el número.** El titular dice «Ese número ya lo incluye todo» y el
  número no estaba: la figura era sólo una barra. Ahora es la fila «Recibes» de la tarjeta de
  `/tarifas`, con la cifra que **sale de la cadena `ConfigPriceSource → convert`**, la misma del
  cotizador, nunca tecleada. Comprobado sobre el build: el puente dice **exactamente** lo que el
  cotizador trae cargado al abrir.

**Se borró `UseCaseFigure.astro`**, sin consumidores. Sus citas en comentarios y documentos **no se
borraron: se fecharon**, porque lo que decían —el dibujo del punteado, la relación 14,4 del riel— es
un dato que sigue valiendo y conviene saber de dónde salió.

**`/empresas` rehízo sus cuatro secciones de contenido el 2026-10-02**, y **no cambió ni una
palabra**: todo sigue saliendo de `business.ts` y `scope.ts`. Lo que cambió es el dibujo.

- **«Para qué lo usan»**: los cuatro emblemas eran el mismo trapecio con un canal dentro —se
  distinguían por el canal, no por el objeto— y pasan a ser **cuatro objetos**: el cruce, la
  cajonera, el calendario y las dos pilas. **Ninguno estrena marca**: todas están ya en el §6.2 del
  Design System, comprobado una por una. **El pago al proveedor va en gris y no en verde**, porque lo
  hace la empresa desde su billetera y verde diría que ese tramo es nuestro (§1). Y la cajonera lleva
  **«Tu empresa»** debajo, porque DLPay no guarda saldos en el modo asistido.
- **«Qué cambia respecto de una persona»**: la tabla iba a 14 px contra los 16 del cuerpo y a 390 px
  **escondía la columna «Empresa» detrás de un desplazamiento lateral** — la columna de la que trata
  la página. Pasa a dos carriles, con los valores a 16, y bajo 760 px a una ficha por aspecto. **Sigue
  siendo una `<table>`** con los `role` puestos a mano: al cambiar el `display`, el navegador le
  quita la semántica. Medido en el árbol a 390: tabla, 5 filas, 3 encabezados de columna, 4 de fila y
  8 celdas.
- **«Cómo empezamos»**: eran dos listas sin relación, lado a lado, con los números en cajas de 26 px
  que se leían como casillas de verificación. Pasa a una carpeta («Ten esto a mano») y un recorrido
  de cuatro nodos con un chevron entre uno y el siguiente.
- **«Hasta dónde llega nuestra parte»**: el eje de 1 px pasa a ser **un relevo** —un bloque en tinta
  que termina en el corte de la marca, con la bisagra como última frase y la cuña en el corte—.

**Y con eso el eje de alcance tiene dos dibujos, que es una excepción firmada por Sebastián.**
`EjeDeAlcance` se queda en `/como-funciona`; `/empresas` usa `AlcanceEmpresa`. **La ventaja es la que
la justifica**: `/empresas` es la página cuyo lector más supone una transferencia bancaria, así que es
donde el límite tiene que verse más. **Lo que no se negocia es que los datos siguen en un solo sitio**
(`scope.ts`): dos dibujos pueden diferir en la forma, nunca en qué afirman sobre dónde termina el
servicio.

**`BusinessEmblem.astro` se borró**, sin consumidor y por tanto código muerto; queda en el historial.

**Lo que la entrega arregló sin proponérselo**: `/empresas` tenía dos fallos de accesibilidad que no
eran de esta reforma —una región desplazable sin foco a 390 (WCAG) y un encabezado de tabla vacío
(buena práctica)—, y los dos desaparecen. Lo único que `axe` sigue marcando en la página es el
contraste dentro del portátil dibujado del encabezado, **idéntico a antes** y ajeno a esto.

**`/confianza` rehízo sus cuatro secciones de contenido el 2026-10-02**, el mismo día que
`/empresas` y con el mismo criterio, pedido por Sebastián. **Tampoco cambia una palabra**: todo sigue
saliendo de `trust.ts` y `alliances.ts`.

- **«Qué pasa con tu plata»**: el zigzag dejaba vacía la mitad de cada fila y lo único dibujado eran
  tres insignias de 20 px. El lado vacío pasa a tener **el objeto del mecanismo**: el edificio de por
  medio, la placa del escritorio y las dos etiquetas de precio. El zigzag se queda, con su entrada
  por cada lado.
- **«Qué te pedimos, y por qué»**: los tres requisitos pasan a **una carpeta**, la misma de «Ten esto
  a mano» de `/empresas`. La distinción de la página se conserva y se ve mejor: **placa cuadrada = lo
  que traes tú; insignia redonda = lo que hacemos nosotros.**
- **«Lo que no vas a leer acá»**: eran cinco bloques en dos columnas con el quinto huérfano abajo.
  Pasa a **un registro**, una fila por afirmación. **El filete conserva su significado** —«existe, es
  real, no es nuestro»— y pasa de uno por bloque a una sola línea de margen.
- **«Quiénes somos»**: el texto sube de 14 a 16 px, el cuerpo de la página.

**Dos cosas que la figura NO dice, y las dos son decisiones ya tomadas:**

- **El banco no lleva nombre.** La mención de BCI es un claim con marcador de Compliance y no gana un
  segundo sitio por estar dibujado *(decisión de Sebastián del 2026-09-25)*.
- **La placa del ejecutivo no lleva nombre ni foto**, porque **D11 está cerrada**: no se publican. La
  placa dice «Tu ejecutivo» y lleva el isotipo, que identifica sin exponer a nadie.

**Y la razón social sigue sin ganar peso.** La figura del banco rotula «Cuenta de DLPay», no la razón
social, por lo mismo que el aviso del teléfono de la portada: hasta que **D9** cierre, el sitio no
publica un nombre que pueda no coincidir con la cartola del cliente.

**El mismo día se corrigió un defecto de `/empresas`** que esta entrega encontró: la frase de la
bisagra del relevo quedaba a 37,99 px de la recta del corte entre 417 y 419 px de ancho, **bajo el
piso de 40 px** del Design System §4.7. Es un valor —el margen pasa de 16 a 24 px— y deja la holgura
en 44 px o más en cualquier ancho. Lo que lo escondía está en `phase-4-construccion.md` §4.12: un
barrido cada 20 px salta por encima de una ventana de 3 px.

**`/blog` se añadió el 2026-09-11.** Colección tipada de Astro (`src/content.config.ts`) con
esquema cerrado: `title`, `description`, `pubDate`, `category` —sólo `DLPay` o `Mercado`, un valor
fuera de esa lista rompe el build—, `estado` y `portada`. Sin paquetes nuevos: `package.json` sigue
declarando cuatro.

**Las portadas las dibuja el sistema y nunca son imágenes.** `coverImage` existió hasta el
2026-09-16 y se retiró: era un PNG de cuñas usado dos veces en el mismo artículo, o sea papel
tapiz. Hoy `portada` es una unión discriminada de tres tipos —`cifra`, `rango` y, desde el
2026-09-22, `figura`—; los dos primeros exigen `fuente` y el tercero es un `z.enum` **cerrado** de
pictogramas que el sistema ya razona, para que un artículo no pueda traer un dibujo suyo. Las
reglas del dibujo están en el Design System §6.1 y §6.2. Enlazado desde el desplegable «Información» de la cabecera. El sitemap se
derivaba de `src/pages/**/*.astro` y publicaba `/blog/index/` y `/blog/[slug]/` —dos 404—: ahora
colapsa los `index` anidados, descarta las rutas dinámicas y añade cada artículo desde la
colección.

**El índice cambió de portada el 2026-10-01, y con él se cerró el §4.8.** Abría con el titular y
236 px de tinta —la última página no legal sin objeto— y abre ahora con **la hoja del último
artículo**: su portada tal como el sistema ya la razona, su titular, su bajada y «Leer el
artículo», con **los cantos de las hojas de detrás llevando su titular y su fecha**, cada uno como
enlace propio y hasta dos. **Se deriva entera de `publishedPosts()`**, así que cambia sola el día
que se publique otro y nadie la edita. La lista de abajo arranca en el segundo artículo, para que el
titular de la hoja no salga dos veces en 300 px.

*Los cantos nacieron ese día como rebanadas en blanco y ganaron su titular unas horas después.*
Sebastián preguntó si las tres hojas podían **alternarse cada 2 segundos**; se descartó porque **la
hoja es el enlace y es la primera acción de la página**, así que el destino cambiaría bajo el
cursor. El razonamiento completo —y lo que además habría costado en reglas— está en
`motion-system-v1.md` §7, para que no haya que rehacerlo.

Con eso **la primera acción de la página sube de 442 a 339 px** y la familia «sin objeto» del
Design System §4.8 queda siendo exactamente las tres páginas legales, que es lo que esa sección
siempre dijo que debía ser.

**Y se retiró una promesa del SEO.** La `description` del índice decía «Análisis del mercado
cambiario **y novedades de DLPay**», y la categoría `DLPay` tiene **cero artículos**: los tres
publicados son `Mercado`. Lo detectó Cowork y lo dejó anotado sin tocarlo, que era lo correcto.
Sebastián la quitó ese día. **Se repone el día que haya un artículo de esa categoría**; el esquema
ya la admite.

**Ningún artículo se publica sin pasar por Compliance.** Un análisis de mercado es, por
definición, contenido que afirma algo sobre precios: cae de lleno en §3. El candado es el campo
`estado` del esquema, **cerrado por omisión**: un artículo sin `estado: publicado` se ve con
`astro dev` pero no entra al build, ni al listado, ni al sitemap.

**Al 2026-09-21 el blog tiene un artículo publicado**, el análisis del FOMC de septiembre, validado
por Sebastián. El artículo de prueba que sirvió para verificar la infraestructura se eliminó ese
mismo día: ya no hacía falta y mantener contenido que dice de sí mismo «no debe publicarse» es una
invitación a que algún día se publique.

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

**Nunca afirmar** que DLPay está regulado o autorizado por la CMF, ni ningún claim regulatorio
equivalente.

**Acotado el 2026-09-29 por Sebastián:** sí se puede decir que **el proceso de inscripción en la CMF
está en curso**, que es lo que `/confianza` publica desde ese día en «Lo que no vas a leer acá». La
prohibición cubre afirmar **el resultado** —estar regulado, autorizado, certificado o avalado— y no
describir un trámite que no ha terminado. La frase publicada dice «el proceso de inscripción está en
curso» y nada más: **insinuar que el trámite habilita a operar vuelve a caer en la prohibición**, y
ampliar la redacción es un claim distinto que necesita aprobación otra vez.

---

## 7. Estándares técnicos (se verifican en el Definition of Done)

**Stack (cerrado en Fase 3):** **Astro + TypeScript** (ADR-0002) · **CSS nativo con custom
properties**, sin Tailwind ni framework de UI (ADR-0004) · salida **estática** · **cero
dependencias** más allá de Astro. El cotizador es la isla interactiva del producto, y la **única**
salvo la excepción que ADR-0009 autoriza y acota: el globo de la Home, que tiene runtime propio y
no participa de ninguna operación. Contenido: copy
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

Ver ADR-0009: única excepción a «cero JS al cliente», un runtime acotado al componente del globo.

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

- **El repositorio vive en GitHub desde el 2026-10-01: `DLPay-Digital/dlpay-web`, privado.**
  177 commits, una rama (`main`), sin etiquetas. Todo el historial está firmado por
  `Sebastián Villanueva Pereira <sebastian@dlpay.cl>`, fijado en `.git/config` de este repo (no en
  la configuración global). La identidad quedó saneada el 2026-09-11: hasta entonces los commits
  iban a nombre de un usuario y un hostname locales.

  **Privado y no público, por un motivo concreto:** `docs/auditoria-preproduccion.md` lista los
  claims publicados sin firma de Compliance y los bloqueantes abiertos (D9, D19, D20), y
  `cowork/README.md` lleva los veredictos internos de cada entrega. Nada de eso se lee fuera.

- **No se actualiza solo: hay que empujar.** Un commit sin `push` **no está respaldado**. El
  remoto se pone al día con `git push` en un segundo, y eso sustituye al ritual del bundle. Es la
  diferencia con una carpeta sincronizada, y es a propósito: un `push` es atómico y ocurre cuando
  se pide.

- **Credencial.** HTTPS con un *personal access token* clásico de permiso `repo`, guardado en el
  llavero de macOS. **Caduca el 2026-12-30** (90 días desde el 2026-10-01). Cuando se renueve,
  conviene estrecharlo a un *fine-grained token* limitado a este repositorio y a
  «Contents: read and write» — el `repo` clásico alcanza a **todos** los repositorios de la cuenta,
  y el Principio 8 pide mínimo privilegio. *El primer `push` se hizo desde una terminal real: el
  `!` de la sesión no tiene terminal interactiva y git no puede preguntar una contraseña ahí.*

- **El `git bundle` en Drive se conserva como SEGUNDO respaldo**, no como el principal. Se decidió
  el 2026-09-11 mientras no había remoto y se mantiene porque dos copias independientes es el
  Principio 10: no se depende de que una sola empresa siga existiendo. Se guarda un bundle y **no
  la carpeta sincronizada**, porque el cliente de Drive copia `.git/` mientras git escribe dentro y
  puede dejar el repositorio corrupto. Se regenera con:
  `git bundle create ../dlpay-web-<fecha>.bundle --all`

- **`push` normal, nunca `push --mirror`.** `--mirror` sube todas las referencias, incluidas las de
  respaldo de cualquier reescritura, y republicaría historiales que se limpiaron a propósito. El
  push del 2026-10-01 fue normal.

- **Lo que GitHub NO respalda, y conviene no confundirlo.** El remoto guarda lo versionado, no la
  carpeta: `Claude outputs/` —**37 MB, 239 archivos** de entregas de Cowork— está en el
  `.gitignore` y **no sube**. Lo que valía de ahí está integrado en `src/` y razonado en
  `cowork/README.md`, pero el material original (maquetas, PNG, GIF, JSON de medición) existe sólo
  en el disco de Sebastián. `.env` tampoco sube, y eso es correcto: se reconstruye con
  `.env.example`.
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
- **coderabbit:** **evaluado y descartado el 2026-09-29.** El plugin de Claude Code sigue
  disponible, pero **la CLI no está instalada y no se va a instalar**, así que sus skills y su
  subagente no tienen con qué correr. Se deja escrito para que nadie repita la evaluación.

  **Lo que costaba.** No es gratis y no tiene plan libre: **$24 por desarrollador y mes** el plan
  más barato, facturado anual, con prueba de 14 días. El registro además está pensado para una
  organización, no para una cuenta suelta. Las banderas de la propia CLI lo anticipaban —`--usage`
  habla de «included reviews and billing-period usage» y `--use-credits` de «exceeds included
  limits»— y eso se pasó por alto al instalarla.

  **Por qué no compensa acá, que es lo que importa conservar.** Busca bugs, seguridad y calidad de
  código, y los fallos reales de este proyecto han sido de otra clase: una afirmación de negocio
  falsa que pasó todas las reglas escritas, una promesa publicada sin plazo, un recuento de
  documentación desfasado y una fila de rótulos desviada 104 px. **Ninguno lo caza un revisor de
  código.** El lado del código ya está cubierto —`astro check`, 80 pruebas, la guarda de
  `PUBLIC_SITE_URL`, cero dependencias en runtime, sin auth, sin datos y sin servidor— y el lado
  que falla se cubre midiendo sobre el build y con revisión cruzada de quien entiende el proyecto.

  **Si se reabre**, el momento natural es cuando haya varias personas commiteando: ahí el producto
  tiene su modo propio, revisar pull requests, y el precio por desarrollador compra algo. Hoy
  compraría la versión menos valiosa.

  *Media condición se cumplió el 2026-10-01:* el repositorio ya está en la organización (D3
  cerrada). **Falta la otra mitad, que es la que importa** — sigue habiendo una sola persona
  commiteando, y mientras siga así no hay pull requests que revisar. Y hay un orden: en el plan
  Free **no se puede exigir revisión en un repo privado**, así que antes de CodeRabbit vendría
  Team a $4, que es seis veces más barato y resuelve el problema anterior.

Tener estos plugins no elimina el criterio humano ni los principios de §2. **Una herramienta que
declara ser la autoridad de diseño sigue siendo una herramienta:** en conflicto manda §12, y ahí
«"moderno" vs identidad DLPay» se resuelve siempre del mismo lado.

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
| ~~D1b~~ | ~~Proveedor de hosting~~ | ✅ **Cerrada 2026-10-06: Cloudflare.** El sitio se publica en **Workers** (no Pages: el panel lleva los proyectos nuevos por ahí, y la decisión la tomó Sebastián) desde `DLPay-Digital/dlpay-web`, con build y despliegue automáticos en cada `push` a `main`. La dirección de Staging es `dlpay-web.sebastian-a9b.workers.dev`. Lo único que entra al repositorio es `wrangler.jsonc`, cinco líneas de configuración y **ninguna dependencia nueva**: wrangler lo ejecuta Cloudflare con `npx` en su propio entorno. **ADR-0005 sigue en pie** —la regla es que el build se pueda copiar a cualquier servidor estático, y `dist/` siguen siendo 43 archivos y 1,1 MB—. *Verificado sobre la URL real: las rutas responden, `/tarifas` redirige con 307 a `/tarifas/`, `/no-existe` devuelve 404 con nuestra página, y el cotizador y las fuentes cargan.* **Sigue siendo Staging:** `PUBLIC_ALLOW_INDEXING` no existe, así que el sitio va con `noindex` y `Disallow: /` hasta Fase 6 | — | — |
| ~~D1c~~ | ~~Instalar Node.js~~ | ✅ Resuelto: v24.20.0 / npm 11.19.0 | — |
| ~~D2~~ | ~~Familia tipográfica~~ | ✅ Cerrado 2026-09-04: **T-C** (Familjen Grotesk + Spline Sans Mono) | ADR-0001 §4 |
| ~~D3~~ | ~~Organización GitHub de DLPay~~ | ✅ **Cerrada 2026-10-01.** Sebastián creó la organización **`DLPay-Digital`** y el repositorio **`DLPay-Digital/dlpay-web`**, privado, en plan **Free**. Subidos los **177 commits** con `push` normal; verificado contra el remoto: mismo recuento y **mismo hash de árbol** (`1d7c674`), y ni `.env` ni `Claude outputs/` subieron. **Con eso deja de ser cierta la frase que este registro repitió veinte días —«el repositorio no tiene copia fuera de este equipo»— y desaparece el mayor riesgo operativo del proyecto.** *Free se eligió midiendo contra lo que el proyecto necesita, no contra la lista de funciones: resuelve el riesgo que D3 nombraba, admite repos privados ilimitados y miembros ilimitados, y sus 2.000 minutos de Actions sobran para un build de 400 ms. **Lo único que Free retiene es proteger `main` en un repo privado**, que hoy protege contra una segunda persona que no existe; el día que exista, Team cuesta $4 por usuario y mes. Anotado: la página anuncia ese precio como «los primeros 12 meses» y **no se pudo confirmar qué queda después** — se pregunta antes de pagar, que es la lección de D15.* | — | — |
| ~~D4~~ | ~~Idioma de código y commits~~ | ✅ Cerrado: código en inglés, commits/docs/contenido en español | ADR-0003 |
| D5 | **Transparencia del spread**: ¿la web muestra la lógica de tramos o solo un referencial? Define la tabla de `/tarifas` | **Sí — es lo único que falta para completar `/tarifas`** | DLPay (I10/I11) |
| ~~D6~~ | ~~Monto mínimo real y monto de muestra del cotizador~~ | ✅ **Cerrada 2026-09-25.** Sebastián confirmó las dos: el mínimo real es **CLP 500.000** —eran 50.000 de placeholder— y el monto de muestra **CLP 2.000.000** se ratifica tal como está. Gracias a D24 el primero costó una línea en `environment.ts`, y la web publica y aplica el mismo número por construcción. **Lo que NO cerraba D6 es la tasa** con la que se cotiza (919,70): ésa nunca vivió acá, vive en `ConfigPriceSource` y es **D7** | — |
| ~~D21~~ | ~~Monto máximo~~ | ✅ **Cerrada 2026-09-29: no hay tope.** No se publica un máximo, así que `PUBLIC_QUOTE_MAX_CLP` se queda sin definir y el cotizador acepta cualquier monto; un monto absurdo lo filtra el ejecutivo en el chat, que es donde siempre iba a terminar. Publicar un techo diría lo contrario de lo que `/tarifas` ya publica —«las operaciones de mayor volumen se conversan con el ejecutivo»—. **La maquinaria se conserva y queda declarada** en `lib/pricing/types.ts`: `above_max` está probado de punta a punta y se enciende definiendo la variable, sin tocar código. Al declararla aparecieron **otros dos estados dormidos**, `market_moving` y `unavailable`, que **nada produce** y que son de **D7** y no de D21: `ConfigPriceSource` devuelve siempre el mismo valor, así que no puede informar estado de mercado | — | — |
| ~~D22~~ | ~~Mensaje prellenado en cinco enlaces planos a WhatsApp~~ | ✅ **Cerrada 2026-09-29.** Los cinco que abrían el chat en blanco —el pie, `/tarifas`, `/confianza`, `/como-funciona` y el botón del héroe de `/empresas`— llevan mensaje. Comprobado sobre el build: **cero enlaces sin texto en las once páginas**, once mensajes distintos, cada uno escrito para el sitio desde donde se pulsa. El del pie es a propósito el más vago —está en todas las páginas y no puede suponer por qué escribes—, y `/empresas` lleva dos distintos: el del héroe es de quien acaba de llegar y el del cierre de quien ya leyó. **El texto del botón «Habla con nosotros» se queda**, decisión de Sebastián del mismo día | — | — |
| D23 | **Canal de respaldo si WhatsApp no abre.** Todo el funnel termina en un único canal; si el enlace no abre, la persona queda sin salida visible en ese momento | No | Sebastián |
| ~~D24~~ | ~~Consolidar el monto mínimo en `lib/config`~~ | ✅ **Cerrada 2026-09-09.** Los límites del cotizador (`PUBLIC_QUOTE_MIN_CLP`, `PUBLIC_QUOTE_MAX_CLP`) y el monto de muestra se resuelven UNA vez en `lib/config/environment.ts` (`resolveQuoteLimits`, puro y testeado) y se exponen como `quoteLimits` en `lib/config/site.ts`. Los cinco consumidores —cotizador, `/tarifas`, mockup y las dos ilustraciones de la Home— dejaron de leer el entorno: `/tarifas` publica por construcción el mismo mínimo que el cotizador aplica. Commit `c5f0ad5` | — | — |
| D7 | **Fuente oficial de market price**, y con ella la tasa que el sitio publica hoy: `PUBLIC_QUOTE_SAMPLE_RATE`, **919,70 CLP por dólar**, que es el número del que cuelgan todas las cifras de muestra de la web. *Anotado el 2026-09-25, al cerrar D6:* el registro llamaba «precio de muestra» a dos cosas distintas y la tasa es ésta, no el monto. **Subió de exposición el 2026-09-30 y volvió a bajar el 2026-10-01:** el panel de `/precio` publicó durante un día **2.174,62 USD por CLP 2.000.000** en su portada; el abanico de etiquetas lo sustituyó y esa cifra salió de la página. **Y volvió a subir el 2026-10-02**, ahora en la Home: el puente a `/tarifas` publica esa misma cifra, **2.174,62 USD**, porque el titular promete un número y la figura no lo enseñaba. Así que la frase «la tasa vive sólo dentro del cotizador» duró un día y hoy es falsa. **Lo que la hace menos grave de lo que suena:** la cifra sale de la misma cadena `ConfigPriceSource → convert`, no está tecleada, y aparece **en la misma página que el cotizador**, que ya la mostraba — así que el día que D7 se cierre, las dos cambian juntas y no hay nada que sincronizar a mano. **Lo que sí cambia:** el número deja de estar sólo dentro de un control que el visitante manipula y pasa a estar también en una afirmación de la página. Sigue abierta y sigue siendo el número del que cuelgan las cifras de muestra. Cowork reporta que el 30 de septiembre el USDT se cotizaba entre 969,88 y 981 pesos, lo que haría el ejemplo **entre un 5,5 % y un 6,7 % más generoso que el mercado**; **ese dato no está verificado acá** y verificarlo pide una cotización de mercado. No corre prisa —el sitio no está publicado— pero **el orden correcto es fijar la tasa antes de publicar esta página, no después**: la etiqueta «ejemplo» protege de que la cifra se lea como oferta, no de que sea inverosímil | No — `ConfigPriceSource` cubre v1 | DLPay |
| ~~D8~~ | ~~Alcance de servicios a comunicar~~ | ✅ Cerrado 2026-09-04: el amplio, alineado con los T&C publicados | Equipo DLPay |
| ~~D16~~ | ~~Cómo llega el dinero al destinatario final~~ | ✅ Cerrado 2026-09-04: DLPay entrega **dólar digital en la billetera**; no deposita en cuentas bancarias en el extranjero. Ver §1 | Equipo DLPay |
| ~~D17~~ | ~~"Sin esperar días"~~ | ✅ Reformulado 2026-09-04: la rapidez se predica de la conversión y del movimiento del dólar digital, nunca de una recepción bancaria en destino | Equipo DLPay |
| ~~D18~~ | ~~Fuente real de actividad reciente~~ | ✅ **Cerrada 2026-09-09: se descarta la funcionalidad.** El feed de «operaciones recientes» nunca salió de la investigación —cero menciones en `phase-2.5` y en `cotizador-spec`—; nació al construir `/cotizar` y se quedó sin página al eliminarla. Además chocaba con **D10**: un feed de actividad **es** una cifra de volumen, y publicarlo en continuo es una decisión de Compliance, no de ingeniería. `ActivityFeed.astro`, `lib/activity` y sus 15 tests se eliminaron (514 líneas). Si algún día se quiere prueba social, la puerta es **D10** y el punto de partida está en el historial, antes de `7577ffe` | — | — |
| ~~D28~~ | ~~¿Necesita la franja de notificación un botón de cerrar?~~ | ✅ **Cerrada 2026-09-29: no se hace.** Y el argumento con el que estuvo aparcada **caducó** el 2026-09-25: decía que un botón costaría «el fin de cero almacenamiento y de las cuatro legales en cero JS», y la intro de marca ya gastó lo primero —escribe en `sessionStorage`— mientras lo segundo nunca estuvo en juego, porque la franja no vive en las legales y `tests/zero-js.test.ts` lo comprueba. El motivo real de no hacerlo es otro: **nadie ha pedido cerrarla**, y la franja ya se oculta sola en la página que enlaza. La mitad de accesibilidad de esta decisión NO se cierra con ella: sigue como deuda declarada en ADR-0006, con tres mecanismos de pausa ya implementados | — | — |
| D27 | **Cabeceras del host**: `X-Robots-Tag: noindex` en Staging —la defensa robusta, porque `Disallow` impide leer el `noindex` del HTML— y evaluar un CSP por hash de los tres scripts en línea, que permitiría quitar `unsafe-inline`. Conjunto completo en `docs/arquitectura-produccion.md` §5.1. **Desbloqueada el 2026-10-06 al cerrar D1b**, y es el siguiente paso del despliegue: en Workers las cabeceras se declaran en el propio repositorio, así que ya no dependen de nadie más | No | Ingeniería |
| D9 | **Razón social**: se usa **DLPZ INCZ SpA**. Los T&C publicados dicen "DLPZ PRO SpA" (RUT 78.378.714-8). **Desde el 2026-09-30 tiene un consumidor nuevo y visible:** el aviso del banco en la portada de `/confianza` dice a quién fue la transferencia, y **ése es el dato que el cliente comprueba en su banco** —que el destinatario es una sociedad y no una persona—. Publicar ahí un nombre que no coincida con el de su cartola haría que la portada de «Confianza que se comprueba» **falle su propia prueba**. Por eso el aviso dice **«a la cuenta de DLPay»**, frase ya publicada, y no la razón social; *decisión de Sebastián del 2026-09-30*. Es más débil como comprobación y **se cambia el día que D9 cierre**: una línea en `TelefonoAvisos.astro` | **Sí — bloquea publicar los textos legales.** No se puede publicar bajo una entidad que contradiga el contrato vigente | `REQUIERE VALIDACIÓN DE COMPLIANCE` — Joaquín. **No reinvestigar.** |
| D19 | **Correo oficial de contacto**: los T&C dicen `contacto@dlpay.cl`, la Política dice `contacto@dlpzpro.cl` | Sí, para el canal de denuncias. La web no publica ninguno hasta confirmarlo | Compliance |
| D20 | **El alcance de los T&C ya no coincide con el servicio**: hablan de custodia y liquidaciones internacionales; el servicio real es cambio de divisas con entrega de dólar digital | Sí, antes de publicar los textos | Compliance |
| D10 | **Testimonios, cifras de clientes/volumen, logos de empresas** | No — no se publican hasta verificar | DLPay (I15) |
| ~~D25~~ | ~~Membresía en FinteChile~~ | ✅ Cerrada 2026-09-07: socio confirmado por Sebastián. Logo publicado en el pie | — |
| ~~D26~~ | ~~Emblema de la UAF en el pie~~ | ✅ Cerrada 2026-09-07: Sebastián afirma registro y supervisión vigentes. Se publica el emblema **y** la frase que fija su alcance. La redacción exacta —"registrada y supervisada", nunca "autorizada" ni "avalada"— queda fijada en `lib/config/alliances.ts`; ampliarla es un claim nuevo | — |
| ~~D11~~ | ~~Equipo con nombre y foto en `/confianza`~~ | ✅ **Cerrada 2026-09-29: no se publica.** Decisión de Sebastián, con la puerta abierta para más adelante. **No costó ningún cambio**: `/confianza` nunca tuvo hueco reservado ni marcador, y su sección «Quiénes somos» ya resuelve el caso sin nombres — afirma que el equipo está en Chile y que «te atiende una persona del equipo», que es una persona real sin exponer a nadie. Es coherente con el registro de esa misma página: no se publica lo que no se puede respaldar, y publicar nombres y caras pide consentimiento de cada uno. Si se reabre, lo que hace falta no es diseño sino ese consentimiento | — | — |
| D12 | **Quién redacta y aprueba el copy** | No para Fase 3 | DLPay |
| D13 | **SPF y DMARC ausentes** en `dlpay.cl` (riesgo de suplantación) | No — es de quien administra el DNS hoy | Guita / DLPay |
| D14 | **Transferencia del dominio, DNS y Google Workspace** | No para Fases 3–5; sí para Fase 6 (cutover) | DLPay ↔ Guita |
| ~~D15~~ | ~~Cuenta/credenciales de CodeRabbit~~ | ✅ **Cerrada 2026-09-29: no se usa.** Se instaló la CLI y se desinstaló el mismo día, al aparecer el precio: **$24 por desarrollador y mes**, sin plan gratuito y con registro pensado para una organización. Sebastián decidió prescindir, con el argumento de que la revisión cruzada de quien entiende el proyecto cubre lo que hace falta. **Mi error de método:** recomendé en contra por motivos técnicos, él decidió instalarla con una buena razón, y el precio —que las banderas `--usage` y `--use-credits` ya insinuaban— no estuvo sobre la mesa hasta después de instalar. Una decisión de herramienta se evalúa con su coste delante. El razonamiento completo queda en §11 para no repetir la evaluación | — | — |

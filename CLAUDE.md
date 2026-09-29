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
  que es donde aterrizan las entregas de Cowork y está en el `.gitignore`. Si un archivo no aparece
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
pregunta del visitante**, y sólo eso. Entró con la portada de `/preguntas`, que dibuja un punto por
cada una de las nueve preguntas publicadas, arriba las de una persona y abajo las de una empresa.

*Por qué hacía falta enmendar y no bastaba con el §6.2.* Las tres cosas que la regla admitía son
todas **dinero o su recorrido**, así que el sitio no tenía marca para una página cuyo objeto no es
dinero, y `/preguntas` es la primera: su objeto son las nueve preguntas. La alternativa era dejar esa
página sin portada para siempre o dibujarle algo que no fuera su objeto, y las dos son peores.

*Y lo que la enmienda NO abre.* No autoriza un trazo por «un tema», «una idea» o «una sección»: eso
es un índice, y un índice dibujado es exactamente lo que se retiró de esa página el 2026-09-24. La
marca concreta —**punto lleno neutro = una pregunta**— está escrita en el Design System §6.2 con su
alcance, y el catálogo sigue siendo cerrado: añadir otra cosa vuelve a pedir esta conversación.

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

- **Repositorio inicializado y sólo local.** 78 commits al 2026-09-15, sin remoto. Todo el historial está
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

  **Si se reabre**, el momento natural es cuando exista el repositorio en la organización (D3) y
  haya varias personas commiteando: ahí el producto tiene su modo propio, revisar pull requests, y
  el precio por desarrollador compra algo. Hoy compraría la versión menos valiosa.

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
| D1b | **Proveedor de hosting** (candidatos: Cloudflare, Vercel). Desarrollo en local mientras tanto | No — portabilidad protegida por ADR-0005 | Sebastián, cuando haya qué publicar |
| ~~D1c~~ | ~~Instalar Node.js~~ | ✅ Resuelto: v24.20.0 / npm 11.19.0 | — |
| ~~D2~~ | ~~Familia tipográfica~~ | ✅ Cerrado 2026-09-04: **T-C** (Familjen Grotesk + Spline Sans Mono) | ADR-0001 §4 |
| D3 | **Crear la organización GitHub de DLPay** y trasladar ahí el repositorio, que debe pertenecer a la empresa y no a una cuenta personal (ADR-0003). Al 2026-09-11 la organización **no existe** y el repo **no tiene copia fuera del equipo de Sebastián**; el respaldo provisional es un `git bundle` en Google Drive (ver §10). Al trasladarlo: `push` normal, nunca `--mirror` | No bloquea construir, **sí es el mayor riesgo operativo abierto**: hoy no hay redundancia del historial | Sebastián |
| ~~D4~~ | ~~Idioma de código y commits~~ | ✅ Cerrado: código en inglés, commits/docs/contenido en español | ADR-0003 |
| D5 | **Transparencia del spread**: ¿la web muestra la lógica de tramos o solo un referencial? Define la tabla de `/tarifas` | **Sí — es lo único que falta para completar `/tarifas`** | DLPay (I10/I11) |
| ~~D6~~ | ~~Monto mínimo real y monto de muestra del cotizador~~ | ✅ **Cerrada 2026-09-25.** Sebastián confirmó las dos: el mínimo real es **CLP 500.000** —eran 50.000 de placeholder— y el monto de muestra **CLP 2.000.000** se ratifica tal como está. Gracias a D24 el primero costó una línea en `environment.ts`, y la web publica y aplica el mismo número por construcción. **Lo que NO cerraba D6 es la tasa** con la que se cotiza (919,70): ésa nunca vivió acá, vive en `ConfigPriceSource` y es **D7** | — |
| ~~D21~~ | ~~Monto máximo~~ | ✅ **Cerrada 2026-09-29: no hay tope.** No se publica un máximo, así que `PUBLIC_QUOTE_MAX_CLP` se queda sin definir y el cotizador acepta cualquier monto; un monto absurdo lo filtra el ejecutivo en el chat, que es donde siempre iba a terminar. Publicar un techo diría lo contrario de lo que `/tarifas` ya publica —«las operaciones de mayor volumen se conversan con el ejecutivo»—. **La maquinaria se conserva y queda declarada** en `lib/pricing/types.ts`: `above_max` está probado de punta a punta y se enciende definiendo la variable, sin tocar código. Al declararla aparecieron **otros dos estados dormidos**, `market_moving` y `unavailable`, que **nada produce** y que son de **D7** y no de D21: `ConfigPriceSource` devuelve siempre el mismo valor, así que no puede informar estado de mercado | — | — |
| ~~D22~~ | ~~Mensaje prellenado en cinco enlaces planos a WhatsApp~~ | ✅ **Cerrada 2026-09-29.** Los cinco que abrían el chat en blanco —el pie, `/tarifas`, `/confianza`, `/como-funciona` y el botón del héroe de `/empresas`— llevan mensaje. Comprobado sobre el build: **cero enlaces sin texto en las once páginas**, once mensajes distintos, cada uno escrito para el sitio desde donde se pulsa. El del pie es a propósito el más vago —está en todas las páginas y no puede suponer por qué escribes—, y `/empresas` lleva dos distintos: el del héroe es de quien acaba de llegar y el del cierre de quien ya leyó. **El texto del botón «Habla con nosotros» se queda**, decisión de Sebastián del mismo día | — | — |
| D23 | **Canal de respaldo si WhatsApp no abre.** Todo el funnel termina en un único canal; si el enlace no abre, la persona queda sin salida visible en ese momento | No | Sebastián |
| ~~D24~~ | ~~Consolidar el monto mínimo en `lib/config`~~ | ✅ **Cerrada 2026-09-09.** Los límites del cotizador (`PUBLIC_QUOTE_MIN_CLP`, `PUBLIC_QUOTE_MAX_CLP`) y el monto de muestra se resuelven UNA vez en `lib/config/environment.ts` (`resolveQuoteLimits`, puro y testeado) y se exponen como `quoteLimits` en `lib/config/site.ts`. Los cinco consumidores —cotizador, `/tarifas`, mockup y las dos ilustraciones de la Home— dejaron de leer el entorno: `/tarifas` publica por construcción el mismo mínimo que el cotizador aplica. Commit `c5f0ad5` | — | — |
| D7 | **Fuente oficial de market price**, y con ella la tasa que el sitio publica hoy: `PUBLIC_QUOTE_SAMPLE_RATE`, **919,70 CLP por dólar**, que es el número del que cuelgan todas las cifras de muestra de la web. *Anotado el 2026-09-25, al cerrar D6:* el registro llamaba «precio de muestra» a dos cosas distintas y la tasa es ésta, no el monto | No — `ConfigPriceSource` cubre v1 | DLPay |
| ~~D8~~ | ~~Alcance de servicios a comunicar~~ | ✅ Cerrado 2026-09-04: el amplio, alineado con los T&C publicados | Equipo DLPay |
| ~~D16~~ | ~~Cómo llega el dinero al destinatario final~~ | ✅ Cerrado 2026-09-04: DLPay entrega **dólar digital en la billetera**; no deposita en cuentas bancarias en el extranjero. Ver §1 | Equipo DLPay |
| ~~D17~~ | ~~"Sin esperar días"~~ | ✅ Reformulado 2026-09-04: la rapidez se predica de la conversión y del movimiento del dólar digital, nunca de una recepción bancaria en destino | Equipo DLPay |
| ~~D18~~ | ~~Fuente real de actividad reciente~~ | ✅ **Cerrada 2026-09-09: se descarta la funcionalidad.** El feed de «operaciones recientes» nunca salió de la investigación —cero menciones en `phase-2.5` y en `cotizador-spec`—; nació al construir `/cotizar` y se quedó sin página al eliminarla. Además chocaba con **D10**: un feed de actividad **es** una cifra de volumen, y publicarlo en continuo es una decisión de Compliance, no de ingeniería. `ActivityFeed.astro`, `lib/activity` y sus 15 tests se eliminaron (514 líneas). Si algún día se quiere prueba social, la puerta es **D10** y el punto de partida está en el historial, antes de `7577ffe` | — | — |
| ~~D28~~ | ~~¿Necesita la franja de notificación un botón de cerrar?~~ | ✅ **Cerrada 2026-09-29: no se hace.** Y el argumento con el que estuvo aparcada **caducó** el 2026-09-25: decía que un botón costaría «el fin de cero almacenamiento y de las cuatro legales en cero JS», y la intro de marca ya gastó lo primero —escribe en `sessionStorage`— mientras lo segundo nunca estuvo en juego, porque la franja no vive en las legales y `tests/zero-js.test.ts` lo comprueba. El motivo real de no hacerlo es otro: **nadie ha pedido cerrarla**, y la franja ya se oculta sola en la página que enlaza. La mitad de accesibilidad de esta decisión NO se cierra con ella: sigue como deuda declarada en ADR-0006, con tres mecanismos de pausa ya implementados | — | — |
| D27 | **Cabeceras del host**: `X-Robots-Tag: noindex` en Staging —la defensa robusta, porque `Disallow` impide leer el `noindex` del HTML— y evaluar un CSP por hash de los tres scripts en línea, que permitiría quitar `unsafe-inline`. Conjunto completo en `docs/arquitectura-produccion.md` §5.1 | No | Al cerrar D1b (proveedor) |
| D9 | **Razón social**: se usa **DLPZ INCZ SpA**. Los T&C publicados dicen "DLPZ PRO SpA" (RUT 78.378.714-8) | **Sí — bloquea publicar los textos legales.** No se puede publicar bajo una entidad que contradiga el contrato vigente | `REQUIERE VALIDACIÓN DE COMPLIANCE` — Joaquín. **No reinvestigar.** |
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

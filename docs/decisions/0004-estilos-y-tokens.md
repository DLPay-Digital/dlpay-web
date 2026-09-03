# ADR-0004 — Estilos y tokens del Design System

- **Estado:** Aceptada — 2026-09-03
- **Decide:** Sebastián Villanueva (con análisis de Claude Code, Fase 3)
- **Ámbito:** cómo el Design System V1 se convierte en código. Depende de ADR-0002 (Astro).

## Contexto

`docs/design-system/design-system-v1.md` define un sistema **cerrado y propio**: paleta acotada
(verde `#16C784`, tinta `#0B1320`, neutros tintados), escala tipográfica con roles fijos, escala
de espaciado base-4, cuatro radios discretos, elevación casi inexistente, cifras tabulares y un
sistema geométrico con regla dura. No es un sistema abierto que necesite generar miles de
combinaciones: es un conjunto pequeño de decisiones ya tomadas.

El plan maestro nombraba **Tailwind CSS sobre una capa propia de tokens** como candidato. Como con
el framework, `CLAUDE.md` §8 obliga a justificarlo en vez de asumirlo.

Restricción de identidad (Principio 3): el mayor riesgo estético del proyecto es que la web
parezca una plantilla. Esto pesa en la elección de la capa de estilos.

## Alternativas evaluadas

| | **CSS nativo + custom properties** | **Tailwind CSS** | CSS-in-JS |
|---|---|---|---|
| Dependencias | **Ninguna.** Astro trae estilos con alcance por componente | Dependencia de build + configuración a mantener | Dependencia + coste en runtime |
| Ajuste al DS V1 | Directo: los tokens del documento *son* las custom properties | Hay que traducir el DS a la configuración, y conviven dos vocabularios | Indirecto |
| Riesgo "parece plantilla" | Bajo: se escribe exactamente lo que el sistema pide | **Real:** el vocabulario de utilidades empuja hacia los valores por defecto (sombras, radios, escalas ajenas al DS) | Bajo |
| Legibilidad para quien no programa | Alta: CSS reconocible | Baja: cadenas largas de utilidades en el marcado | Baja |
| Velocidad de escritura | Media | Alta | Media |
| Portabilidad | Total; sobrevive a cualquier cambio de framework | Atada a su cadena de build | Atada al runtime |

## Decisión

1. **CSS nativo con custom properties, más los estilos con alcance por componente que Astro ya
   incluye.** Sin Tailwind, sin CSS-in-JS, sin preprocesador.

   **Por qué.** El DS V1 es pequeño, cerrado y propio: no hay nada que Tailwind resuelva aquí que
   el CSS moderno no resuelva sin añadir una dependencia, una configuración y un segundo
   vocabulario. La ventaja real de Tailwind —velocidad al explorar— importa poco cuando las
   decisiones visuales **ya están tomadas** en un documento. Y su desventaja sí importa mucho en
   este proyecto: sus valores por defecto son precisamente la estética intercambiable que el
   Principio 3 prohíbe. Escribir el CSS que el sistema pide es más lento por línea y más rápido
   por decisión.

2. **Los tokens del DS V1 se declaran una sola vez** como custom properties globales, con los
   mismos nombres del documento (`--verde`, `--tinta`, `--papel`, `--ink`, `--r-2`, …). El
   documento y el código usan el mismo vocabulario: cambiar un token es cambiar una línea.

3. **Nada de valores mágicos.** Color, espaciado, radio, tipografía y elevación salen siempre de
   un token. Un valor literal en un componente es un error de revisión, salvo que se justifique
   en el mismo lugar.

4. **Sin modo oscuro con interruptor.** Superficie clara con héroes y bandas en tinta, según
   ADR-0001 §5. No se declaran variantes de tema.

5. **Fuentes auto-hospedadas**, nunca cargadas desde un CDN de terceros en producción: es un
   requisito de performance, de privacidad y de control. Cada familia con `size-adjust` y stack de
   fallback de métricas cercanas para evitar saltos de layout.
   → La familia sigue `PENDIENTE` (ADR-0001 §4) y **no bloquea nada**: los roles y la escala ya
   están definidos, y provisionalmente se usa el set T-A marcado como
   `PENDIENTE DE ASSET — familia tipográfica`.

6. **Primitivas accesibles headless** (menús, diálogos, tabs): **ninguna por ahora.** El sitio v1
   no tiene ningún componente que las requiera —la navegación móvil y el acordeón de FAQ se
   resuelven con HTML nativo (`<details>`, `<dialog>`) y atributos ARIA correctos—. Si aparece un
   componente que las justifique, se evalúa entonces con el §8 de `CLAUDE.md`.

## Consecuencias

- El proyecto arranca con **cero dependencias de estilo**.
- Existe un único archivo de tokens, espejo del Design System V1.
- Si un día se quiere Tailwind, los tokens ya están aislados y la migración es acotada. La
  decisión es reversible.
- La revisión de accesibilidad (contraste `#16C784` sobre claro, foco visible, targets ≥44px)
  se verifica manualmente contra el Design System §2.4 y §10, no por una herramienta.

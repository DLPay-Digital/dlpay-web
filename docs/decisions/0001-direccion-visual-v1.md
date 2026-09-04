# ADR-0001 — Dirección visual V1 de la web de DLPay

- **Estado:** Aceptada — 2026-09-03
- **Decide:** Sebastián Villanueva (con exploración de Claude Code, Fases 1–2.5)
- **Ámbito:** identidad y sistema visual de la web. **No** cubre arquitectura técnica, stack ni
  hosting (eso es Fase 3, aún no iniciada).

## Contexto

Fases 0–2.5 establecieron: qué es DLPay (mesa OTC de dólar digital, personas + empresas, operación
asistida por WhatsApp), qué debe hacer la web (convertir visitantes en clientes; que DLPay la
controle), y una exploración visual (A "mesa de operaciones", C "sistema geométrico", A×C híbrido).
La Fase 2.5 congeló las decisiones de experiencia. Se dispone de los **logos oficiales de DLPay**.

## Decisión

1. **Dirección visual V1: A×C.** Registro de "mesa de operaciones" (instrumento financiero:
   fondo profundo, cifras tabulares protagonistas, jerarquía nítida, bordes finos) con un
   **sistema geométrico propio derivado del isotipo** usado sólo donde explica.
   - Es una **dirección de desarrollo**, no una identidad congelada: evoluciona con la construcción.

2. **Assets de marca (fuente: `logos/logo 1.png`, `logo 2.png`):**
   - Isotipo: monograma **D+P**, angular, con cola diagonal en punta (vector de movimiento).
   - **Verde DLPay: `#16C784`** (H≈157°, S≈80%, L≈43% — medio / calipso).
   - **Tinta DLPay: `#0B1320`** (navy muy oscuro, H≈216°).
   - **Verificados** (enmienda 2026-09-03): decodificando los PNG y contando píxeles con alfa > 200,
     ambos son colores planos sin antialias intermedio — `#16C784` es el único valor del isotipo y
     `#0B1320` el único del wordmark. **Son los oficiales; no hace falta un vectorial para
     confirmarlos.** (La medición previa registraba `#0B1321`, un punto de diferencia en el canal
     azul.) Un asset vectorial seguiría siendo útil sólo para la *geometría* limpia del isotipo.
   - Grafía comercial: **DLPay**. Razón social: **DLPZ INCZ SpA** (footer/legales, no protagonista).

3. **Regla del componente geométrico (dura):** cada trazo geométrico representa **movimiento,
   flujo de valor o un paso de un proceso**. Nunca decoración. Se deriva del corte diagonal del
   isotipo (~30–35°). Prohibido: papel tapiz, "red de nodos" genérica, competir con el cotizador.

4. **Tipografía: set T-C** — **Familjen Grotesk** (display, títulos y texto) +
   **Spline Sans Mono** (cifras y datos). Ambas SIL OFL 1.1, variables, auto-hospedadas.
   - *Enmienda 2026-09-03:* la tipografía **no bloquea Fase 3**; el board comparativo se produce
     en paralelo a la arquitectura.
   - **Enmienda 2026-09-04 — decisión cerrada.** Se produjo el board comparativo
     (`docs/design-system/board-tipografia.html`): los tres sets sobre el héroe y el cotizador
     reales, desktop y móvil, con tamaños idénticos entre sets para aislar la variable.
     Sebastián eligió **T-C**: las cifras se leen mejor, la escala se siente más ordenada y seria,
     y tiene personalidad propia sin volverse corporativa ni intimidante — que es exactamente el
     equilibrio que pide A×C (mesa de operaciones seria, accesible para quien sólo quiere cambiar
     dólares rápido). Es además la que rima con el corte diagonal del isotipo.
     Descartadas: **T-A** (más cálida, pero tres familias y un display que cansa en titulares
     largos) y **T-B** (mejor eco del wordmark y la más "instrumento", pero la más fría para una
     persona primeriza).
   - **Criterio permanente que acompaña la elección:** las cifras siguen siendo las protagonistas
     y la tipografía **no debe volverse excesivamente grande**. La escala del Design System es un
     techo, no un objetivo: si un titular compite con la cifra, se reduce el titular.
     Ver `design-system-v1.md` §3.0.

5. **Modo:** el sitio es de **superficie clara** con **héroes y bandas en tinta profunda**. No es
   un dark-mode con toggle; es un look comprometido (claro + zonas oscuras deliberadas).

## Qué queda `PENDIENTE` (no bloquea el Design System V1)

- Si el cotizador muestra la lógica de tramos de spread o sólo un precio referencial (Fase 0 I10/I11).
- Fotografía / ilustración (si se usa) — se decide al construir las páginas.

## Enmiendas

| Fecha | Qué cambió |
|---|---|
| 2026-09-03 | Verde y tinta verificados por muestreo de píxeles: `#16C784` y `#0B1320`. Se cierra el `PENDIENTE` del vectorial (§2). |
| 2026-09-03 | La tipografía deja de bloquear Fase 3 (§4). |
| 2026-09-04 | **Tipografía cerrada: set T-C** — Familjen Grotesk + Spline Sans Mono (§4). |

## Consecuencias

- Se crea `docs/design-system/design-system-v1.md` (tokens + componentes) y
  `docs/design-system/cotizador-spec.md`.
- Los mockups de Fase 2 quedan alineados a esta decisión (assets reales, geometría re-derivada).
- ~~Fase 3 (arquitectura) parte **después** de que Sebastián elija la tipografía.~~
  **Enmendado 2026-09-03:** Fase 3 arranca sin esperar la tipografía; la elección va en paralelo y
  se registra como enmienda a este ADR cuando se cierre.

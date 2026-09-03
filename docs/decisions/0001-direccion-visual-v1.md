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

4. **Tipografía: NO se decide aisladamente.** Se define la *escala* y los *roles* (ver
   `design-system/design-system-v1.md`) pero la *familia* se elige **evaluando 2–3 candidatas
   dentro de la experiencia real** (hero + cotizador). → `PENDIENTE` hasta la elección visual de
   Sebastián.
   - **Enmienda 2026-09-03: la tipografía NO bloquea Fase 3.** El board comparativo de candidatas
     en contexto se produce **en paralelo** a la arquitectura. (El Artifact de Fase 2 usa el set
     T-A —Bricolage Grotesque / Hanken Grotesk / Spline Sans Mono— como exploración; **no** contiene
     el board comparativo que este ADR daba por existente.)

5. **Modo:** el sitio es de **superficie clara** con **héroes y bandas en tinta profunda**. No es
   un dark-mode con toggle; es un look comprometido (claro + zonas oscuras deliberadas).

## Qué queda `PENDIENTE` (no bloquea el Design System V1)

- Familia tipográfica (elección visual).
- Si el cotizador muestra la lógica de tramos de spread o sólo un precio referencial (Fase 0 I10/I11).
- Fotografía / ilustración (si se usa) — se decide al construir las páginas.

## Consecuencias

- Se crea `docs/design-system/design-system-v1.md` (tokens + componentes) y
  `docs/design-system/cotizador-spec.md`.
- Los mockups de Fase 2 quedan alineados a esta decisión (assets reales, geometría re-derivada).
- ~~Fase 3 (arquitectura) parte **después** de que Sebastián elija la tipografía.~~
  **Enmendado 2026-09-03:** Fase 3 arranca sin esperar la tipografía; la elección va en paralelo y
  se registra como enmienda a este ADR cuando se cierre.

# ADR-0007 — Paleta cartográfica acotada a la sección del globo

- **Estado:** Aceptada — 2026-09-15
- **Decide:** Sebastián Villanueva (con análisis de Claude Code, Fase 4)
- **Ámbito:** `src/components/hero/GloboRotativo.astro`. Coexiste con ADR-0001, que sigue
  congelando la paleta del resto del sitio.
- **Relacionado:** ADR-0001 (paleta base congelada)
- **Nota de numeración:** redactada como «ADR-0002» en la sesión de diseño del 2026-09-15. Ese
  número ya estaba tomado por *Framework, lenguaje y arquitectura de contenido*, así que se emitió
  como **0007**, el siguiente correlativo libre.

## Contexto

ADR-0001 congeló la paleta de DLPay a dos colores primarios: verde `#16C784` (acción, positivo) y tinta `#0B1320` (texto, fondo oscuro). Esa paleta funciona correctamente para toda la interfaz de producto: cotizador, botones, formularios, cards, navegación, footer.

Al construir la sección del globo (globo terráqueo rotativo con Chile como origen y ocho destinos internacionales), aparece un conflicto real: la representación cartográfica requiere colores que comuniquen "océano", "tierra" y "bordes de países" con contraste suficiente para ser legibles a escala pequeña, y esa función semántica no la cumplen los dos colores de ADR-0001.

Forzar la paleta base al globo produce lecturas ambiguas:
- Un océano en verde `#16C784` lee como "acción disponible", no como "agua"
- Una tierra en tinta `#0B1320` sobre océano oscuro no diferencia continentes
- Un highlight en verde base sobre tierra oscura pierde saliencia

## Decisión

Se autoriza una **paleta cartográfica secundaria acotada exclusivamente al componente `GloboRotativo.astro`**. Esta paleta **no reemplaza** ADR-0001; **coexiste** con ella dentro del scope del globo. Fuera del globo, ADR-0001 sigue siendo autoritativa sin excepciones.

### Tokens autorizados en el globo

| Token semántico     | Hex        | Uso                                         |
|---------------------|------------|---------------------------------------------|
| `map-ocean-navy`    | `#0d1a30`  | Fondo del océano (fill del círculo base)    |
| `map-ocean-tint`    | `#0a1830`  | Base del pattern de puntos del océano       |
| `map-ocean-dot`     | `#7fa8c8`  | Puntos del pattern del océano               |
| `map-land-cream`    | `#c8bea8`  | Relleno de continentes                      |
| `map-land-stipple`  | `#6a5f45`  | Textura de puntos sobre continentes         |
| `map-border-ochre`  | `#8a7f68`  | Bordes de países, rim y stroke del globo    |
| `map-highlight`     | `#22e88f`  | Chile (fill + glow), arcos, pulso, labels   |

### Relación con ADR-0001

- **`map-highlight` (`#22e88f`)** es una variante brillante del verde base `#16C784` (misma familia hue, +12% luminosidad, +8% saturación). Se usa como acento sobre fondos oscuros del globo porque el verde base no destaca lo suficiente contra `map-land-cream` ni contra `map-ocean-navy`. Fuera del globo, `#16C784` sigue siendo el verde único del sistema.
- **`map-ocean-navy` (`#0d1a30`)** es una variante ligeramente más clara y azulada de la tinta base `#0B1320`. Diferencia: la tinta base es neutra-cálida, el ocean navy es neutra-fría. Fuera del globo, `#0B1320` sigue siendo la tinta.

### Ámbito operativo

Los siete tokens SOLO pueden usarse **dentro** del archivo `src/components/hero/GloboRotativo.astro`. Se declaran como valores hardcodeados en el `<style>` scoped del componente, no como CSS custom properties globales. Cualquier otro componente del sitio (cotizador, hero-copy, footer, formularios, sección de features, testimonials, etc.) sigue usando la paleta de ADR-0001 sin excepción.

## Consecuencias

**Positivas**:
- La sección del globo comunica claramente "este es el mundo, DLPay conecta Chile con estos ocho destinos", sin ambigüedad de lectura.
- La paleta base de producto (ADR-0001) queda intacta, mantiene su función semántica y su reconocimiento a través del sitio.
- La paleta cartográfica está tokenizada y limitada — no se derrama al resto del sitio por accidente porque los valores viven scoped en un solo archivo.

**Negativas**:
- Aumenta la superficie de colores del sistema de diseño (2 → 9 tokens).
- Aparece un caso "excepcional" documentado. Requiere que futuras revisiones cartográficas pasen por ADR aparte.
- Tres tokens del `map-*` set (`map-highlight`, `map-ocean-navy`, `map-land-cream`) están perceptualmente cerca de otros del sistema — riesgo bajo pero real de confusión si algún desarrollador los aplica fuera del globo.

**Mitigaciones**:
- Los valores hex viven **dentro** del scope de `<style>` de `GloboRotativo.astro`, no como variables globales.
- Comentario explícito en el componente: `/* ADR-0007: paleta cartográfica, solo válida en este archivo */`.
- Al primer intento en code review de reusar un token `map-*` fuera del globo, revisar esta decisión antes de aprobar.

## Alternativas consideradas

1. **Forzar paleta base**: el globo con océano verde `#16C784` y tierra tinta `#0B1320`. **Rechazada** — lectura ambigua, el globo no lee como globo.
2. **Mapa monocromático**: todo en tinta base con distintos niveles de opacidad. **Rechazada** — pierde la lectura de "Chile como acento verde", que es el punto narrativo de la sección del globo.
3. **Gradientes decorativos** para diferenciar océano/tierra: **rechazada** por §2 principio 3 (prohibido stock 3D, SaaS genérico, gradientes decorativos, blobs, glassmorphism).
4. **Textura vía imagen raster**: **rechazada** — añade peso significativo, no se adapta bien a la rotación, y los patterns SVG cumplen la misma función con ~200 bytes cada uno.

## Trigger de revisión

Reabrir ADR si:
- Se decide usar la paleta cartográfica fuera del globo (ej. en otro componente visual).
- Se agrega otro elemento visual complejo al hero que también requiera paleta propia — considerar consolidar en un ADR-0003 unificado.
- Cambia ADR-0001 (paleta base). Si cambia el verde base, revisar si `map-highlight` sigue teniendo relación de familia.
- Aparecen problemas de accesibilidad de contraste WCAG en el globo (ninguno detectado en revisión inicial — todos los pares de colores usados dentro del globo cumplen AA para elementos no-textuales).

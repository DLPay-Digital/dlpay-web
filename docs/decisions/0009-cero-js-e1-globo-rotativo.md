# ADR-0009 — Enmienda §7: primera excepción a "cero JS al cliente"

- **Estado:** Aceptada — 2026-09-15
- **Decide:** Sebastián Villanueva (con análisis de Claude Code, Fase 4)
- **Ámbito:** `src/components/hero/GloboRotativo.astro`. Enmienda §7 sólo para esa pieza; el resto
  del sitio sigue en cero JS al cliente.
- **Identificador:** `cero-js-e1`
- **Referencia:** §7 CLAUDE.md (cero dependencias runtime, cero JS al cliente)

## Contexto

§7 del CLAUDE.md establece dos reglas duras del stack DLPay:

1. **Cero dependencias runtime**: el sitio compila con 4 dependencias totales (Astro + 3 dev), y solo Astro se ejecuta en build-time. Ninguna librería viaja al navegador del usuario.
2. **Cero JS al cliente**: `output: 'static'` en `astro.config.mjs`, sin `client:*` directives en componentes. Toda la interacción crítica funciona con formularios nativos, links, y CSS.

Estas reglas dan al sitio dos propiedades fuertes que son parte de la identidad técnica de DLPay:

- **Portabilidad total**: el sitio compilado es HTML + CSS estático, servible desde cualquier CDN, cualquier servidor, o incluso `file://` local. Sin backend, sin runtime, sin dependencias externas.
- **Robustez extrema**: no se rompe con adblockers agresivos, no depende de JS habilitado, funciona en navegadores mínimos, no falla si el CDN de una librería tercera cae.

La sección del globo introducida en fase 4 (globo rotativo, ADR-0007, motion-v1-e2) requiere **renderizado JS runtime** para la rotación: cada frame se recalculan proyecciones ortográficas de ~1500 vértices, se interpolan cruces del terminador (el borde entre lo visible y lo oculto del hemisferio), se cierran polígonos por arcos pegados al borde curvo de la esfera. Esto no es factible con CSS puro — la proyección ortográfica involucra funciones trigonométricas no lineales aplicadas por vértice.

Esto entra en conflicto directo con "cero JS al cliente".

## Decisión

Se autoriza una **excepción acotada** al principio de cero JS al cliente, con salvaguardas duras que preservan las propiedades de fondo del stack.

### Alcance de la excepción

**Solo aplica al componente `src/components/hero/GloboRotativo.astro`.**

Se permite:
- Un bloque `<script is:inline>` dentro del componente Astro.
- Ejecución JS al cargar la página (sin `defer` ni `async` explícito — Astro con `is:inline` lo maneja).
- Uso de `requestAnimationFrame` para el loop de renderizado.
- Uso de `matchMedia` para detectar `prefers-reduced-motion`.

### Guardarrieles duros

1. **JS vanilla puro. Cero dependencias.** Sin imports, sin `<script src="...">`, sin CDN, sin librerías. Todo el runtime del globo son ~3 KB de código escrito a mano. Cualquier propuesta de traer `d3-geo` u otra librería para "hacer más fácil" el globo se rechaza por default — anularía el punto de la excepción.

2. **Inline en el componente**. El JS vive dentro del archivo `.astro`, no en archivo `.js` separado. Motivo: preserva "un componente = una unidad autocontenida" y evita network requests adicionales. Usar `is:inline` de Astro para asegurar que el script no se procesa por Vite/Rollup y no se convierte en módulo.

3. **Peso máximo runtime**: 5 KB minificado. Data inline es separada (ver ADR-0007 y §7-data-budget). Si el runtime crece más allá de 5 KB, revisar esta enmienda antes de mergear.

4. **Renderizado bloqueado a UN elemento visible**. El script solo escribe atributos SVG del `<svg>` dentro del componente. **No** modifica el DOM fuera de su scope. **No** lee ni escribe `localStorage` ni `sessionStorage`. **No** hace `fetch` ni `XMLHttpRequest`. **No** toca `document.cookie`. **No** registra event listeners globales (window/document). **No** modifica meta tags, título, ni URL.

5. **Fallback sin JS**: cuando JS está deshabilitado o falla, el componente debe seguir siendo visualmente aceptable. El SVG base (círculo del globo + fill de océano navy + halo verde sutil) es servido por Astro en el HTML estático. Los paths de land/borders/chile quedan vacíos, pero el globo se ve como un círculo azul-navy con halo. Aceptable como degradación graceful. El resto del sitio (cotizador, formularios, navegación) sigue funcionando sin JS al 100%.

6. **Sin efecto sobre navegación ni interacción crítica**: el resto del sitio sigue funcionando sin JS como antes. El cotizador (§6) funciona sin JS. Los formularios funcionan sin JS. Los links funcionan sin JS. Solo la sección del globo tiene componente animado — el sitio sigue siendo "estático + un pixel animado en la sección del globo".

### Regla de ámbito para futuros JS

Cualquier otro componente que necesite JS runtime requiere **enmienda propia** — no se puede invocar esta excepción para autorizar más JS. La excepción es *para el globo*, no *para JS en general*.

Si el cotizador (§6) alguna vez requiere JS (ej. para autocompletar montos, o para calcular tarifas en tiempo real sin recargar), es un cambio suficientemente crítico que requiere revisión de §7 completo — probablemente ya no una excepción sino un cambio de doctrina, porque el cotizador es el centro del sitio.

## Consecuencias

**Positivas**:
- La sección del globo comunica alcance global de forma memorable, refuerza la narrativa DLPay ("conectamos Chile con el mundo").
- El resto del sitio mantiene la propiedad de "cero JS" — ~99% del código servido sigue siendo HTML + CSS. La excepción está tokenizada (un archivo, un script, ~3 KB) y es fácilmente auditable.
- El fallback graceful (círculo navy si JS falla) preserva la composición visual sin errores, aunque pierda la rotación.

**Negativas**:
- El sitio deja de ser "100% funcional sin JS". El globo degrada a un círculo azul si JS falla. Aceptable pero es una pérdida real de robustez.
- Aumenta la superficie de bugs potenciales del sitio: cualquier error en el runtime del globo puede romper visualmente la sección del globo (aunque no la funcionalidad crítica del cotizador).
- El componente ya no es portable a plataformas que prohíben JS inline (algunos ambientes de CMS restrictivos, algunas plataformas de email/newsletter). No es un problema hoy pero limita opciones futuras de re-uso del componente.
- CSP: el script inline puede requerir `unsafe-inline` en `script-src`, o un nonce por request si se quiere mantener CSP estricto. Requiere decisión en headers de deployment.

**Mitigaciones**:
- CSP-friendly con nonce: si se quiere mantener CSP estricto (`script-src 'self'` sin `unsafe-inline`), Astro soporta nonce por request en modo SSR. Como estamos en `output: 'static'`, no es trivial — considerar `unsafe-inline` acotado, o usar hash del script en la CSP.
- Testing manual en el checklist QA: "deshabilitar JS en DevTools y verificar que el globo muestra el círculo navy sin errores en consola".
- Monitoring: si se instrumenta client-side error tracking (fuera del scope actual), priorizar errores JS del globo como bugs de la sección del globo, no como caídas del sitio.

## Trigger de revisión

Reabrir enmienda si:
- Aparece una segunda propuesta de JS runtime en el sitio (ej. buscador con autocomplete, comparador de destinos, calculadora avanzada) → revisar §7 completo. Posible cambio de doctrina en vez de acumulación de excepciones.
- El peso del runtime crece > 5 KB minificado → revisar si vale la pena vs. reemplazar por asset estático (SVG animado, video, PNG secuencial).
- Telemetría muestra tasa de error JS > 0.5% en el globo → considerar reemplazar por SVG estático o video mp4/webm.
- Aparece un requerimiento de CSP estricto sin `unsafe-inline` que sea difícil de cumplir con este enfoque → revisar approach (posible mover a asset externo con hash).
- Cambia significativamente la naturaleza del hero → esta enmienda se re-evalúa junto con el rediseño.

## Alternativas consideradas

1. **SVG estático (sin rotación, sin JS)**: **rechazada** — pierde toda la narrativa de "conecta Chile con el mundo". El estático lee como mapa decorativo, no comunica alcance.
2. **Video mp4/webm en loop**: **considerada** — cero JS, pero pesa ~200-500 KB vs. 45 KB del approach actual, y no se adapta al color scheme del sitio si se cambia. Además video en autoplay + loop tiene problemas propios de accesibilidad y consumo de batería.
3. **CSS puro con transform**: **rechazada** — no es posible implementar proyección ortográfica no lineal con solo CSS transforms. El resultado sería un mapa plano rotando, no un globo — se ve como pancake spinning, no como planeta.
4. **Import de `d3-geo`**: **rechazada** por §7-1 (cero dependencias runtime). Además pesaría ~50 KB adicionales (o más con d3-geo-projection), contra 3 KB del código escrito a mano.
5. **Delegar a `<canvas>` con lib de mapas** (Mapbox, Leaflet, etc.): **rechazada** — más peso, menos accesible, misma dependencia sobre JS pero peor, y overkill para nuestro caso (no necesitamos interacción del usuario con el mapa).
6. **APNG o GIF animado**: **rechazada** — peso alto (~500 KB - 2 MB para calidad decente), no se adapta a `prefers-reduced-motion`, mala compresión para gradientes/patterns.

## Referencia de implementación

Ver `src/components/hero/GloboRotativo.astro`, sección `<script is:inline>`. El runtime hace, por frame:

- 1 proyección ortográfica por vértice (~1500 vértices totales entre land, chile, borders)
- Interpolación de cruces del terminador (~10-20 crossings por frame, según rotación)
- Cierre de polígonos por arcos sobre el borde de la esfera (~5-15 arcos activos por frame, cada uno subdividido en L commands cada ~4°)
- Actualización de 3-4 atributos `d` en paths SVG (land-base, land-texture, borders, chile-triple)
- Actualización de posiciones de 8 destinos + 8 arcos + 1 label Chile

Perfil target:
- Desktop moderno (M1 Mac, Chrome 120+): 60 fps consistente
- Mobile mid-range (iPhone 12, Pixel 6, Chrome/Safari actual): 60 fps aceptable, ocasionalmente 30-45 fps
- Mobile low-end (dispositivos < 2020): 20-30 fps, degradación visual mínima

Ninguna operación es async. Ninguna operación hace I/O. Ninguna allocación de arrays grandes dentro del hot path (posible optimización futura: reciclar arrays typed).

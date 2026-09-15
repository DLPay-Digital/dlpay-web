# ADR-0008 — Enmienda Motion System V1: segunda excepción documentada

- **Estado:** Aceptada — 2026-09-15
- **Decide:** Sebastián Villanueva (con análisis de Claude Code, Fase 4)
- **Ámbito:** `src/components/hero/GloboRotativo.astro`. Enmienda el Motion System V1; no toca los
  seis movimientos ni el techo de 280 ms fuera de esa pieza.
- **Identificador:** `motion-v1-e2`
- **Referencia:** Motion System V1 (sección del CLAUDE.md)
- **Precedente:** ADR-0006 — Franja de notificación (2026-09-08), cuya enmienda está registrada en
  `docs/design-system/motion-system-v1.md` §0

## Contexto

Motion System V1 define seis movimientos permitidos, techo de 280 ms por movimiento, y una regla dura: **"una sola vez"** — nada se anima en loop. Ya existe una excepción documentada (ADR-0006, franja de notificación, 2026-09-08): la rotación de sus dos mensajes es infinita y se re-anima cada 5 s, que es literalmente el caso que la regla «una sola vez» describe como prohibido. Está acotada a esa pieza y sin sigla propia.

La sección del globo introducida en fase 4 (globo rotativo, ADR-0007) requiere una **rotación continua** para comunicar "DLPay conecta Chile con el mundo". Sin rotación, la ilustración lee como un mapa estático de Sudamérica, no como un planeta con alcance global. El componente pierde su función narrativa.

Adicionalmente, el highlight sobre Chile usa un pulso rítmico (dos anillos expandiéndose escalonadamente) para comunicar "aquí origina la actividad", en vez de un marker fijo que se leería como "punto en un mapa".

Ambos movimientos entran en conflicto directo con "una sola vez".

## Decisión

Se autoriza una **segunda excepción** al principio "una sola vez" del Motion System V1, con guardarrieles duros y ámbito estrictamente acotado.

### Alcance de la excepción

**Solo aplica al componente `src/components/hero/GloboRotativo.astro`.**

Se permite:
- **Rotación continua** del globo terráqueo alrededor de su eje polar aproximado, en el sentido oeste→este (la tierra apareciendo por el borde derecho).
- **Pulso rítmico** sobre Chile: dos anillos concéntricos expandiéndose y desvaneciéndose de forma escalonada.

Fuera de este componente, "una sola vez" sigue siendo la regla, sin negociación.

### Guardarrieles duros

1. **Velocidad angular máxima**: 6°/segundo. Un ciclo completo (360°) toma 60 segundos exactos. Esta velocidad es lo suficientemente lenta para no distraer del cotizador (que es el centro del hero por §6) ni causar mareo/desorientación.
2. **Pulso Chile**: ciclo 3.4 segundos por anillo, expansión de ×1 a ×4 desde radio base. Segundo anillo con delay de 500 ms respecto al primero. Reposo (fase invisible tras desvanecimiento) ≥50% del ciclo por anillo.
3. **`prefers-reduced-motion: reduce` es obligatorio y no-negociable**: cuando el usuario tiene esa preferencia activa, la rotación se detiene y el globo renderiza estático en `lon0 = -40°` (vista Atlántico centrada). El pulso Chile se elimina por completo (`display: none` en los anillos animados).
4. **Sin easing dramático**: la rotación es **lineal** (velocidad constante, no `ease-in`, no `ease-out`, no `cubic-bezier`). Se busca la sensación de "planeta girando", no de "coreografía animada".
5. **No pausa en hover ni focus**: es o rotación continua o `prefers-reduced-motion`. No hay estado intermedio. Motivo: pausar en hover crea la expectativa de control, y no queremos que el usuario piense "esto es un widget interactivo" — queremos que lea como "fondo dinámico".
6. **Sin escala ni zoom**: la única transformación permitida es la rotación por cambio de `lon0`. No se puede combinar con scale, translate, skew, ni cambios de perspectiva.

### Regla de ámbito para futuros loops

Cualquier otro loop continuo en el sitio (spinners de carga, carruseles automáticos, texto tipo "typing", backgrounds en movimiento, iconos que respiran, marquees, etc.) requiere **enmienda propia** — no se puede invocar esta excepción para autorizar nuevos loops. La segunda excepción es *para el globo*, no *para loops en general*.

Si aparece una tercera propuesta de loop continuo, el equipo debe considerar si Motion V1 completo necesita revisión (posible Motion V2 con reglas nuevas para movimiento sostenido).

## Consecuencias

**Positivas**:
- El hero comunica alcance global sin necesidad de copy adicional ni ilustraciones múltiples ("nuestros destinos son...").
- Los guardarrieles duros previenen que el movimiento se descontrole en el futuro (velocidad, easing, pulso todos acotados numéricamente).
- `prefers-reduced-motion` sigue siendo respetado — el usuario con esa preferencia obtiene una experiencia equivalente sin movimiento (globo estático con la misma composición visual).

**Negativas**:
- Motion System V1 acumula ahora dos excepciones documentadas (banner + globo). El principio "una sola vez" se vuelve "una sola vez excepto donde se ha aprobado formalmente". Requiere disciplina en revisiones futuras para no normalizar excepciones.
- El movimiento continuo puede causar molestia a usuarios que no activaron `prefers-reduced-motion` pero prefieren sitios estáticos. Los guardarrieles de velocidad y easing minimizan pero no eliminan esto.
- La rotación implica renderizado por-frame (~60 fps), lo que aumenta el consumo de CPU del sitio comparado con hero estático. En devices low-end podría bajar a ~30 fps sin degradación visual grave (probado en el diseño).

## Trigger de revisión

Reabrir enmienda si:
- Aparece una tercera propuesta de loop continuo → revisar Motion V1 completo, posible Motion V2.
- Telemetría muestra > 5% bounce rate correlacionado con la rotación → considerar bajar velocidad a 3°/s, o detener por defecto con opción "activar" (fuera del scope actual).
- Se reciben reportes de accesibilidad relacionados con movimiento en el hero → revisar guardarrieles.
- Se decide cambiar la velocidad, dirección, o composición del pulso → esta enmienda se actualiza con el diff, no se abre una nueva.

## Alternativas consideradas

1. **Mapa estático (sin rotación)**: **rechazada** — no comunica alcance global, lee como mapa regional. El hero pierde función narrativa.
2. **Rotación solo en hover**: **rechazada** — depende de interacción, un usuario que scroll rápido no ve la narrativa. Además, en mobile el "hover" no existe.
3. **Rotación con auto-stop después de 1-2 vueltas**: **considerada, rechazada** — introduce un "estado final" que no lee como natural (¿por qué se detuvo?), y complica el algoritmo para dudoso beneficio narrativo.
4. **Rotación más lenta (3°/s, ciclo 120s)**: **considerada** — quedaría demasiado sutil, un usuario que scroll rápido no percibe el movimiento como intencional.
5. **Ilustración con múltiples marcadores estáticos** (sin rotación, con highlights que se activan secuencialmente): **considerada** — es en efecto otro loop, no resuelve el conflicto con "una sola vez", solo lo mueve.

## Referencia de implementación

Ver `src/components/hero/GloboRotativo.astro`. La rotación se implementa vía `requestAnimationFrame`:

```javascript
let last = 0;
function tick(t) {
  if(last > 0) {
    const dt = (t - last) / 1000;
    lon0 += 6 * dt;  // ← 6°/s
    if(lon0 > 180) lon0 -= 360;
  }
  last = t;
  update();
  requestAnimationFrame(tick);
}
```

La detección de `prefers-reduced-motion` ocurre una sola vez al montar. Si el usuario cambia la preferencia durante la sesión, requiere refresh de la página (aceptable — escuchar el evento `change` del `MediaQueryList` sería un nice-to-have futuro pero no bloqueante).

El pulso Chile se implementa vía CSS keyframes `@keyframes chilePing` y `@keyframes chilePingSlow`, con `animation-iteration-count: infinite` y `@media (prefers-reduced-motion: reduce) { display: none }`.

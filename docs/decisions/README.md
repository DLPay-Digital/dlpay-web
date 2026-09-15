# Registro de decisiones (ADRs)

Cada decisión que cambia cómo funciona el proyecto se registra aquí: **contexto, alternativas
evaluadas, decisión y consecuencias**. La documentación explica el *porqué*, no sólo el cómo.

| ADR | Decisión | Estado | Fase |
|---|---|---|---|
| [0001](0001-direccion-visual-v1.md) | Dirección visual V1 — A×C, assets de marca, regla del componente geométrico | Aceptada | 2.5 |
| [0002](0002-framework-lenguaje-contenido.md) | Framework, lenguaje y arquitectura de contenido — Astro + TypeScript | Aceptada | 3 |
| [0003](0003-repositorio-y-convenciones.md) | Repositorio, control de versiones y convenciones | Aceptada | 3 |
| [0004](0004-estilos-y-tokens.md) | Estilos y tokens — CSS nativo con custom properties, sin Tailwind | Aceptada | 3 |
| [0005](0005-despliegue-y-portabilidad.md) | Despliegue — portabilidad primero, proveedor diferido | Aceptada | 3 |
| [0006](0006-franja-de-notificacion.md) | Franja de notificación — estática, sin botón de cerrar | Aceptada | 4 |
| [0007](0007-paleta-cartografica.md) | Paleta cartográfica acotada al hero visual — coexiste con ADR-0001 | Propuesta | 4 |
| [0008](0008-motion-v1-e2-globo-rotativo.md) | Motion V1, segunda excepción — rotación continua y pulso, sólo en el globo | Propuesta | 4 |
| [0009](0009-cero-js-e1-globo-rotativo.md) | Primera excepción a «cero JS al cliente» — runtime acotado al globo | Propuesta | 4 |

**Convención:** numeración correlativa, un archivo por decisión, nunca se reescribe una decisión
aceptada — se **enmienda** dejando visible lo anterior, o se supera con un ADR nuevo que la cite.

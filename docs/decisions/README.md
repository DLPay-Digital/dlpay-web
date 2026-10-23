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
| [0007](0007-paleta-cartografica.md) | Paleta cartográfica acotada a la sección del globo — coexiste con ADR-0001 | Aceptada | 4 |
| [0008](0008-motion-v1-e2-globo-rotativo.md) | Motion V1, segunda excepción — rotación continua y pulso, sólo en el globo | Aceptada | 4 |
| [0009](0009-cero-js-e1-globo-rotativo.md) | Primera excepción a «cero JS al cliente» — runtime acotado al globo | Aceptada | 4 |
| [0010](0010-motion-v1-e3-intro-de-marca.md) | Motion V1, tercera excepción — intro de marca en la Home, 830 ms sobre el cotizador | Aceptada | 4 |
| [0011](0011-motion-v1-e4-diario-dlpay.md) | Motion V1, cuarta excepción — el Diario DLPay de `/blog`: hojas que pasan solas, y la única pieza fuera del registro de ADR-0001 | Aceptada | 4 |
| [0012](0012-cero-js-e2-calculadora-spread.md) | Segunda excepción a «cero JS al cliente»: la calculadora del spread | Aceptada | 4 |
| [0013](0013-envio-de-divisas.md) | De «dólar digital» a «envío de divisas» — el mensaje cambia de una divisa a varias; el límite del servicio no se mueve | Aceptada | 4 |
| [0014](0014-entrega-en-moneda-local.md) | El servicio llega hasta la moneda local del destino — deroga la regla dura de §1 y supera el punto 2 de ADR-0013 | Aceptada | 4 |
| [0015](0015-motion-e5-dos-caminos.md) | Motion V1, quinta excepción: «El mismo envío, por dos caminos», una animación narrativa de 4,8 s en la Home | Aceptada | 4 |
| [0016](0016-motion-e6-banda-de-destinos.md) | Motion V1, sexta excepción: la banda de los destinos, ligada al desplazamiento y no al reloj — la primera que rompe «una sola vez» | Aceptada | 4 |
| [0017](0017-motion-e7-telefono-fijo.md) | Motion V1, séptima excepción: «Así se ve tu operación» con un solo teléfono fijo y una conversación que crece al bajar, ligada al desplazamiento y sin JavaScript | Aceptada | 4 |

**Convención:** numeración correlativa, un archivo por decisión, nunca se reescribe una decisión
aceptada — se **enmienda** dejando visible lo anterior, o se supera con un ADR nuevo que la cite.

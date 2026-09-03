# Fase 2 — Exploración visual & UX

> **Estado:** exploración de dirección visual. **No** cierra la identidad, ni el design system, ni
> el stack. **Fecha:** 2026-09-03. **Autor:** Claude Code (bajo supervisión de Sebastián Villanueva).
> **Insumos:** `phase-0-findings.md`, `phase-1-visual-ux.md`, y las decisiones del checkpoint de Fase 1.

---

## 0. Entregable

**Mockups de alta fidelidad + prototipo del cotizador** (Artifact navegable):

**https://claude.ai/code/artifact/eb6ac9c6-dbe7-4905-859e-2a065a98b5d7**

Contiene:
- **A×C** (dirección principal): Home, `/cotizar`, "Cómo funciona" — desktop y móvil.
- **A — "Mesa de operaciones"** y **C — "Sistema geométrico"** (puras): Home desktop + móvil, para comparar.
- **Prototipo del cotizador** funcionando: ingreso del monto, cálculo del precio referencial,
  bidireccional, estados (calculando / bajo el mínimo / mercado moviéndose / sin conexión), y el
  salto a WhatsApp con el mensaje prellenado (enlace `wa.me` real de prueba).
- **Comparación heurística** A/C/A×C sobre los 6 criterios + protocolo de test para 3–5 personas.
- **Recomendación**.

### Nota de método
- El editor de canvas de Claude Design necesita Node/bun, que no están en este entorno, así que
  los mockups se entregan como **Artifact HTML** (renderizado real + interacción real), no como
  canvas editable. Para iterar se re-publica el mismo Artifact.
- **No** se escribió código de producción, no se creó `src/`, no se instalaron dependencias, no se
  eligió stack. Los mockups viven en el Artifact, no en el repo.

### Placeholders usados (Fase 0: `PENDIENTE DE ASSET`)
| Elemento | Placeholder | Origen |
|---|---|---|
| Verde de marca | `#19A071` | **tomado del sitio actual (plataforma de Guita)** — referencia provisional |
| Verde profundo / fondo | `#0C1A17` / `#0A1512` | evolución del azul-petróleo del deck de BCI |
| Tipografía títulos | `Bricolage Grotesque` | exploración — transmite carácter sin ser genérica |
| Tipografía texto | `Hanken Grotesk` | exploración |
| Cifras / dato | `Spline Sans Mono` (tabular) | exploración — los números son protagonistas del cotizador |
| Logo | logotipo tipográfico + marca geométrica de nodo | exploración |
| Precio del cotizador | `919,70 CLP/USDT` (valor de muestra) | la fuente oficial está pendiente (Fase 0 I11) |
| Cifras de clientes/volumen, tiempo de KYC, monto mínimo, razón social | `[bracket]` visible | pendientes de DLPay |

Cuando lleguen los assets oficiales de DLPay, **mandan sobre cualquier placeholder de aquí**.

---

## 1. Taxonomía de marcadores
`HECHO` · `INFERENCIA` · `HIPÓTESIS` · `RECOMENDACIÓN` · `PENDIENTE` — igual que en Fases 0 y 1.

---

## 2. Qué se aplicó de las decisiones del checkpoint

| Decisión de Fase 1 | Cómo se ve en los mockups |
|---|---|
| Público: personas primero + pymes | Home y `/cotizar` optimizadas para cotizar sin fricción; banda "DLPay Empresas / Tesorería" presente pero secundaria |
| Acción #1 = **cotizar** | El cotizador **es** el héroe. "Crear cuenta" es enlace secundario; "WhatsApp" vive en el header y en el CTA del propio cotizador, sin competir |
| Cotizador: **referencial → WhatsApp prellenado** | El CTA arma un `wa.me` con el monto y la dirección de la operación. La web dice "precio referencial; tu ejecutivo confirma el precio final". No hay "comprar ahora" |
| Dirección: **A×C** | A×C desarrollada completa; A y C puras como comparación |
| Evitar estética fintech genérica | Sin degradados decorativos, sin cubos 3D, sin Inter/Roboto, sin exceso de tarjetas, sin eyebrow en mayúsculas, sin "→" en botones |

---

## 3. Las tres direcciones

### A — "Mesa de operaciones"
Estética de **instrumento financiero**: fondo profundo, austera, cifras tabulares dominantes,
bordes finos, radios pequeños (5–6 px), el precio con un tick de subida/bajada. Jerarquía nítida,
una sola acción. Referencia de energía: Mercury × Buda, con oficio de escritorio de operaciones.
- **Fortalezas:** máxima percepción de profesionalismo; se separa de la "fintech amable"; escala a B2B.
- **Riesgo:** frialdad / distancia con una persona primeriza.

### C — "Sistema geométrico"
El motivo de **nodos y líneas** del deck de BCI convertido en **lenguaje**: los nodos son las
contrapartes (tú · DLPay · mercado · tu wallet), las líneas son los flujos de pesos y de dólar
digital. El diagrama **identifica y explica a la vez**. Más claro/tecnológico que A.
- **Fortalezas:** lo más *ownable*; el diagrama hace trabajo real de explicación.
- **Riesgo:** "red de nodos" es un cliché cripto si se usa como decoración — sólo funciona con
  disciplina (con función, no como papel tapiz).

### A×C — Híbrido (dirección recomendada)
Registro visual de **A** + sistema geométrico de **C** reservado para donde *explica*:
- El **cotizador** manda en el héroe (cifras tabulares, marco de instrumento).
- El **sistema geométrico** aparece: (a) muy tenue en el fondo del héroe, (b) como marcador de
  sección, (c) como el **diagrama central de "Cómo funciona"**. Nunca compitiendo con el cotizador.
- **Disciplina de copy** de la dirección "claridad chilena": español plano, "dólar digital" antes
  que "stablecoin", una sola acción.

---

## 4. Comparación heurística (1–5)

> Evaluación de esta investigación, **no un test de usuarios**. El protocolo para el test real está en §6.

| Criterio | A | C | A×C |
|---|---|---|---|
| Confianza | 4 | 3 | **5** |
| Claridad | 4 | 3 | **5** |
| Diferenciación | 4 | 5 | **5** |
| Conversión | 4 | 3 | **5** |
| Percepción de profesionalismo | **5** | 4 | **5** |
| Coherencia con DLPay (rápido + técnico + humano + confiable + propio) | 4 | 4 | **5** |
| **Total** | **25 / 30** | **21 / 30** | **30 / 30** |

- **A** pierde en confianza/coherencia por la frialdad hacia el público persona.
- **C** pierde en confianza/claridad/conversión porque el diagrama, sin contención, compite con el
  cotizador y la estética de nodos puede leerse "cripto" y restar seriedad.
- **A×C** toma la seriedad de A y usa el diagrama de C sólo donde suma (explicar el flujo).

Riesgo propio de A×C: **complejidad de ejecución** — exige disciplina permanente para que C no invada.

---

## 5. Prototipo del cotizador — especificación

Modelo confirmado: **precio referencial → WhatsApp con el monto prellenado**.

### Anatomía
`toggle comprar/vender` · `campo Pago (CLP, editable)` · `campo Recibo aprox. (USDT, editable —
bidireccional)` · `precio referencial + timestamp` · `nota "sin comisiones ocultas: el precio ya
incluye el spread" + etiqueta de fuente de mercado` · `CTA "Cotizar por WhatsApp"` · `enlace
secundario "crear cuenta"`.

### Estados
| Estado | Comportamiento |
|---|---|
| Inicial / escribiendo | Monto de ejemplo cargado; *debounce* ~650 ms antes de recalcular |
| Calculando | Shimmer **sobre el número** (no spinner que bloquea el formulario) |
| Resultado | Recibo estimado + precio + timestamp + nota del spread |
| Bidireccional | Editar CLP recalcula USDT y viceversa |
| Bajo el mínimo | Inline: "Monto mínimo: `[CLP 50.000]`". El CTA sigue disponible hacia WhatsApp |
| Mercado moviéndose | "El mercado se está regulando. Reintenta en unos minutos o escríbenos." — reusa el lenguaje real del equipo; el CTA cambia a "Escríbenos por WhatsApp" |
| Sin conexión | "No pudimos traer el precio ahora. Escríbenos y te cotizamos." |

### Salto a WhatsApp
El CTA arma `https://wa.me/56977615921?text=<mensaje>` con, p. ej.:
> "Hola, quiero cotizar la compra de USDT por CLP 3.000.000 (recibo aprox. 3.262,20 USDT al precio
> referencial 919,70). ¿Me confirman el precio final?"

`HIPÓTESIS` H7 (Fase 1): prellenar el mensaje sube la tasa de operaciones completadas y baja el
trabajo del ejecutivo.

### Pendiente antes de construirlo (Fase 0 I10/I11)
Fuente oficial de market price · si se muestra la lógica de tramos de spread o sólo un referencial ·
monto mínimo real · frecuencia de actualización · mecanismo de *fallback*.

---

## 6. Test de preferencia/confianza (para que lo corra Sebastián)

~30 min, 3–5 participantes (3 personas que operen dólar digital + 1–2 de una pyme):
1. Mostrar las tres Home (A, C, A×C) sin revelar la favorita; rotar el orden.
2. Preguntar por cada una: "¿Qué hace esta empresa?" (claridad) · "Del 1 al 7, ¿cuánta confianza te
   da para mover tu plata? ¿Por qué?" · "¿Dónde harías clic primero?" (conversión) · "¿Cuál se
   siente más profesional / más de DLPay?" · "¿Cuál **no** elegirías y por qué?"
3. Con el prototipo: "Cotiza CLP 3.000.000. ¿Qué esperas que pase al apretar el botón?" (valida el
   modelo referencial → WhatsApp).
4. Registrar verbatims. Buscar **patrones**, no promedios.

---

## 7. Recomendación

**Desarrollar A×C como dirección**, con estas reglas:
- Registro "mesa de operaciones": fondo profundo, **un** verde estructural, cifras tabulares
  protagonistas, bordes finos, jerarquía nítida.
- Sistema geométrico de C **sólo** en: diagrama de "Cómo funciona", marcadores de sección, fondo
  muy tenue del héroe. Nunca papel tapiz; nunca compitiendo con el cotizador.
- Copy chileno, plano, honesto; una sola acción primaria (cotizar).
- **B — "claridad chilena"** queda como respaldo si el test muestra que A×C intimida al público persona.

Esto **no cierra la identidad**: es la dirección a llevar al cierre de Fase 2, sujeta a tu
revisión, al test, y a los assets oficiales de DLPay.

---

## 8. Decisiones para Sebastián (cierre de Fase 2)

1. **¿Visto bueno a A×C** como dirección a desarrollar? (o ajustar hacia A puro / activar B de respaldo).
2. **¿Corres el test** de preferencia con 3–5 personas? (o decidimos sin test).
3. **Assets de marca** — logo vectorial, verde oficial (hex), tipografías con licencia (Fase 0 I12).
4. **Cotizador** — ¿la web puede mostrar la lógica de tramos de spread, o sólo un precio referencial? (Fase 0 I10/I11).
5. **Marca** — grafía oficial ("DLPay") y razón social para el footer (Fase 0 I8).
6. **Alcance de contenido** — ¿el sitio comunica el alcance amplio de los T&C (intermediación,
   custodia, tesorería transfronteriza, pagos B2B) o el "OTC USDT" de los apuntes? (Fase 0 I10).
7. **Carril Empresas** — ¿página dedicada desde v1, o sólo una banda en la Home por ahora?

---

## 9. Qué cierra Fase 2 (después de tus respuestas)

- Dirección visual elegida y **congelada para v1** (sin cerrar la evolución futura).
- **Tokens del design system** documentados (color, tipografía, escala tipográfica y de espaciado,
  radios, tratamiento de cifras, estados) — en `docs/` + un ADR.
- Especificación final del cotizador (con la decisión de pricing).
- Arquitectura de información v1 confirmada (qué páginas ship).

## 10. Recién entonces — Fase 3 (arquitectura)

Con la dirección y los tokens cerrados: ADRs de stack/hosting/DNS/repo, esqueleto del proyecto
(`.gitignore`, `.env.example`, `docs/`), costuras de desacople (cotizador, config de Guita). **No
antes.**

---

## Checklist de cierre de Fase 2

- [x] Mockups A×C (Home, /cotizar, Cómo funciona) — desktop + móvil
- [x] Mockups A y C (Home) para comparación
- [x] Prototipo del cotizador con estados y salto a WhatsApp
- [x] Comparación heurística A/C/A×C sobre los 6 criterios
- [x] Protocolo de test de preferencia/confianza
- [x] Recomendación (A×C) — sin cerrar la identidad
- [ ] **Revisión de Sebastián** + respuestas a §8
- [ ] Test de preferencia con 3–5 personas (opcional según Sebastián)
- [ ] Entrega de assets de marca oficiales
- [ ] Decisión de pricing para el cotizador
- [ ] Congelar dirección v1 → tokens del design system + ADR
- [ ] **No avanzar a Fase 3 sin autorización explícita de Sebastián**

---

*Fin del documento de Fase 2 (versión de trabajo). Próximo hito: revisión del Artifact con Sebastián.*

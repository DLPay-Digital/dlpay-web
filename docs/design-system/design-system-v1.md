# DLPay — Design System V1

> **Estado:** V1 congelado en lo esencial; tipografía `PENDIENTE` (elección visual, ver §3).
> **Base:** ADR-0001. **Fecha:** 2026-09-03.
> Esto **no** es implementación. Son las decisiones visuales que guiarán la construcción.
> Regla: **los assets reales de DLPay mandan** sobre cualquier valor de aquí que se marque provisional.

---

## 1. Fundamentos

- **Personalidad:** mesa de operaciones. Precisa, técnica, rápida, premium sobria — **no** "fintech
  amable" ni plantilla de IA.
- **Los números son el héroe.** El sistema está diseñado para que una cifra (el precio, lo que
  recibes) sea el elemento más fuerte de la pantalla.
- **Superficie clara + zonas de tinta profunda.** Fondo claro para leer; héroes y bandas en
  `#0B1320` para peso y foco.
- **Una acción primaria por pantalla.** Todo el sistema sostiene "cotizar".

---

## 2. Color

### 2.1 Tokens de marca (de los logos oficiales)

| Token | Valor | Uso |
|---|---|---|
| `--verde` | `#16C784` | Acción primaria, el dato vivo (precio), acentos estructurales. **Nunca** como wash/degradado. |
| `--verde-hi` | `#3DD69A` | Hover del verde, líneas del motivo geométrico sobre tinta. |
| `--verde-deep` | `#0B7A54` | Verde sobre superficie clara donde `#16C784` no alcanza contraste AA (texto-enlace, iconos). |
| `--tinta` | `#0B1320` | Fondo de héroes, footer, bandas. Superficie profunda. |
| `--tinta-2` | `#101A2B` | Banda secundaria / capas sobre tinta. |

`--verde` y `--tinta` están **verificados** contra `logos/` por muestreo de píxeles: son colores
planos, sin antialias intermedio. Son los oficiales (ver ADR-0001 §2, enmienda 2026-09-03).

### 2.2 Neutros (tintados hacia la tinta — H≈216, no gris puro)

| Token | Valor aprox. | Uso |
|---|---|---|
| `--papel` | `#F6F5F1` | Fondo de página (off-white cálido, S baja). |
| `--papel-2` | `#ECEAE3` | Secciones alternas, fondos de campo secundario. |
| `--ink` | `#131A26` | Texto principal sobre claro. |
| `--ink-mute` | `#5A6472` | Texto secundario, labels. |
| `--line` | `rgba(11,19,32,.14)` | Bordes hairline, divisores. |
| `--on-tinta` | `#EDF2EF` | Texto principal sobre tinta. |
| `--on-tinta-mute` | `#9DB0AA` | Texto secundario sobre tinta. |

### 2.3 Colores semánticos (separados del acento)

| Token | Valor | Uso |
|---|---|---|
| `--sube` | `#16C784` | Precio/valor que sube (coincide con el verde de marca, a propósito). |
| `--baja` | `#C7593B` | Precio que baja, alertas suaves (rojo-arcilla apagado, **no** rojo puro). |
| `--aviso` | `#B5852A` | Estado "mercado moviéndose", avisos. |
| `--error-bg` | `#FBF1EC` / borde `#E7C3B4` | Fondo de mensaje de error/aviso. |

### 2.4 Contraste (a verificar en implementación)

- `#16C784` sobre `#0B1320`: alto — OK para texto grande, CTA, dato.
- `#16C784` sobre `#F6F5F1`: **bajo (~2.0:1)** — **no usar para texto**; sólo para fills/CTA con
  texto oscuro encima, o líneas. Para texto-enlace sobre claro usar `--verde-deep`.
- Piso: **WCAG AA** (4.5:1 texto normal, 3:1 texto grande y UI).

---

## 3. Tipografía — escala y roles (familia PENDIENTE)

La **familia se elige visualmente** (hero + cotizador) entre 3 candidatas. **No bloquea Fase 3**
(ADR-0001 §4, enmienda 2026-09-03): el board comparativo se produce en paralelo a la arquitectura.
Candidatas:

| Set | Display | Texto | Cifras | Carácter |
|---|---|---|---|---|
| **T-A** | Bricolage Grotesque | Hanken Grotesk | Spline Sans Mono | Grotesca humanista con carácter — cálida, equilibrio persona/empresa |
| **T-B** | Archivo | Archivo | IBM Plex Mono | Industrial / instrumento — más fría, "trading desk", eco del wordmark |
| **T-C** | Familjen Grotesk (una sola familia) | Familjen Grotesk | Spline Sans Mono | Geométrica disciplinada — moderna, neutra-distintiva |

Reglas comunes a cualquier set:
- **Máximo 3 familias** (o 2 + mono).
- **Cifras siempre tabulares** (`font-variant-numeric: tabular-nums`) en todo lo monetario.
- Cada familia con **stack de fallback** de métricas cercanas.

### 3.1 Escala tipográfica (ratio ~1.25, base 16px)

| Rol | Tamaño (desktop / móvil) | Peso | Line-height | Tracking |
|---|---|---|---|---|
| Display / H1 | 52 / 30 px | 700 | 1.04 | -0.015em |
| H2 sección | 32 / 23 px | 700 | 1.1 | -0.01em |
| H3 | 18–20 / 17 px | 600–700 | 1.2 | 0 |
| Body | 16 / 16 px | 400 | 1.55 | 0 |
| Body-sm / secundario | 14 / 14 px | 400 | 1.5 | 0 |
| Label | 12–13 px | 600 | 1.3 | +0.01em (sin MAYÚSCULAS forzadas) |
| **Dato grande** (precio, recibes) | 26–32 px | 500 | 1 | -0.01em, tabular |
| Dato pequeño (desglose, timestamp) | 12–13 px | 500 | 1.4 | tabular |

- Longitud de línea de texto corrido: **< 65–70 caracteres**.
- `text-wrap: balance` en titulares; `text-wrap: pretty` en párrafos.

### 3.2 Antipatrones tipográficos (prohibidos)

Eyebrow en MAYÚSCULAS sobre cada título · acentuar una sola palabra del titular en color/itálica ·
labels tipográficos innecesarios sobre el contenido · "→" pegado al texto de botones/enlaces ·
cadenas unidas con "·" como metadato decorativo · tipografías genéricas por defecto
(Inter/Roboto/Arial/Space Grotesk/Fraunces).

---

## 4. Espaciado, layout y forma

### 4.1 Escala de espaciado (base 4)

`4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128` px. Layout con **flex/grid + `gap`**, no márgenes
por elemento.

### 4.2 Grid

- Contenedor de contenido: **máx. ~1112 px**, centrado.
- Padding lateral de sección: 64 px desktop / 20 px móvil.
- Héroes: grid de 2 columnas (`~1.05fr .95fr`) — copy izquierda, cotizador derecha. Móvil: 1 columna, cotizador primero.

### 4.3 Radios (discretos — nada de "pill")

| Token | Valor | Uso |
|---|---|---|
| `--r-0` | 0 | Bandas, divisores. |
| `--r-1` | 3 px | Botones y campos en registro "A puro" / elementos densos. |
| `--r-2` | 6 px | Botones, campos, chips (default A×C). |
| `--r-3` | 10 px | Tarjetas contenedoras (cotizador, bloques de confianza). |
| `--r-card` | 14 px | Sólo la tarjeta del cotizador cuando "flota" sobre la tinta. |

Botones **nunca** con `border-radius` tipo píldora.

### 4.4 Elevación (mínima, por rol)

| Token | Valor | Uso |
|---|---|---|
| `--elev-0` | ninguna | Casi todo. La jerarquía la dan tipografía y espacio, no sombras. |
| `--elev-card` | `0 24px 60px -24px rgba(11,19,32,.45)` | **Sólo** la tarjeta del cotizador sobre la tinta. |
| `--elev-pop` | `0 8px 24px -12px rgba(11,19,32,.25)` | Menús/popovers (futuro). |

### 4.5 Bordes

Hairline `1px solid var(--line)`. Los campos de formulario usan borde, no sombra. "No todo es una
tarjeta": borde/fill/radio/sombra se gastan por rol, para levantar **una** cosa.

---

## 5. Tratamiento de cifras (crítico)

- **Tabulares siempre** en montos, precios, tasas.
- Separador de miles chileno (`2.000.000`), decimal con coma (`2.174,80`).
- **Decimales consistentes con lo que usa el equipo en WhatsApp** (precio del dólar con 1–2
  decimales; USDT con 2).
- El **precio referencial** y el **"recibes ~X"** son las cifras más grandes de su pantalla.
- Timestamp del precio siempre visible ("hace un momento" / "actualizado hace Ns").
- Movimiento del precio (si se muestra): `--sube` / `--baja` + una flecha/triángulo pequeño, nunca
  color solo.

---

## 6. Sistema geométrico

**Origen:** el corte diagonal y los planos angulares del isotipo. Ángulo de referencia **30–35°**.

**Regla dura:** cada trazo representa **movimiento, flujo de valor o un paso**. Nunca decoración.

| Uso permitido | Cómo |
|---|---|
| Marcador de paso | Cuña / chevron que apunta al siguiente paso ("Cómo funciona", pasos numerados). |
| Divisor de sección | Segmento diagonal corto en lugar de una regla recta, con moderación. |
| Diagrama de "Cómo funciona" | Puntos = contrapartes (tú · DLPay · mercado · tu wallet), tramos angulares = dinero moviéndose. **El diagrama es la marca y a la vez explica.** |
| Textura del héroe | Cuñas a muy baja opacidad (≤ 0.12 sobre tinta en A×C). Nunca sobre el cotizador. |

| Prohibido |
|---|
| Papel tapiz / patrón de fondo repetido en todas las secciones. |
| "Red de nodos" genérica estilo blockchain. |
| Cualquier trazo que no represente movimiento o proceso. |
| Geometría que compita visualmente con el cotizador. |

---

## 7. Iconografía

- **Line icons**, trazo `1.6`, grilla 16 / 20 / 24, `stroke-linejoin: round`, **un solo estilo**.
- Set pequeño y funcional: banco, reloj, chat/WhatsApp, chevron/paso, documento, empresa, wallet,
  candado. Nada más hasta que una necesidad lo pida.
- Sin emoji como iconos.

---

## 8. Componentes V1 (inventario — no implementación)

Cada uno se construye sólo cuando una página real lo necesita (Principio 5, CLAUDE.md).

| Componente | Propósito | Notas de anatomía / estados |
|---|---|---|
| **Botón** | Acción | `primary` (fill `--verde`, texto `#04140E`) · `ghost` (borde `--line`) · `dark-ghost` (sobre tinta). Estados: hover, focus-visible (outline 2px `--verde`), disabled. `--r-2`. Nunca píldora. Sin "→". |
| **Campo de formulario** | Entrada | Label 12–13px `--ink-mute` · borde `--line` · foco: borde `--verde` + outline. Error: borde `--baja` + mensaje inline. |
| **Cotizador** | Acción central | Spec propia → `cotizador-spec.md`. |
| **Desglose de precio** | Transparencia | Lista label/valor, valores tabulares alineados a la derecha, divisores hairline. |
| **Badge de estado** | Estado KYC / operación | Pill discreta (`--r-2`), color semántico + texto, nunca color solo. |
| **Bloque de confianza** | "Por qué DLPay" | Icono line + H3 + 1 frase. 3 en fila (desktop) / apilados (móvil). Sin números inventados. |
| **Paso** (step) | Proceso | Marcador (número tabular o cuña) + H3 + frase + tiempo (mono, `--ink-mute`). Numerado sólo porque es secuencia real. |
| **Callout WhatsApp** | Contacto humano | Icono chat + texto + botón. Presente en fallbacks del cotizador y en "Cómo funciona". |
| **Franja de bifurcación** | Personas / Empresas | Dos caminos claros; el de Empresas lleva a `/empresas`. Tardía en la Home. |
| **Banda Empresas** | Pitch B2B | Sobre `--tinta-2`. Texto + CTA a `/empresas`. |
| **Header** | Navegación | Isotipo + "DLPay" · nav corta (`Cotizar · Cómo funciona · Empresas · Confianza`) · `WhatsApp` + `Crear cuenta` (secundario). Móvil: isotipo + WhatsApp + menú. |
| **Footer** | Cierre + legal | Producto · Contacto · **Legal** (Términos, Privacidad, Tarifas, Canal de denuncias) · `DLPZ INCZ SpA · opera bajo la marca DLPay`. |
| **FAQ item** | Objeciones | Acordeón; sólo objeciones reales pre-primera-operación. |
| **Diagrama de flujo** | Explicar la operación | Sistema geométrico §6. |

---

## 9. Movimiento

- Por defecto **nada** se mueve.
- Permitido: el **tick del precio** cuando cambia; **un** shimmer sobre el número mientras calcula;
  una secuencia de carga del héroe (opcional, sutil).
- Prohibido: entradas fade-and-slide por sección al hacer scroll; hover-transitions en cada tarjeta;
  animación decorativa.
- Respetar `prefers-reduced-motion`.

---

## 10. Accesibilidad (piso, se verifica en el Definition of Done)

- Contraste **AA**; los cruces verde/claro resueltos con `--verde-deep` (§2.4).
- Foco visible (`outline` 2px `--verde`, offset 2px) en todo lo interactivo.
- Objetivos táctiles ≥ **44px**.
- HTML semántico, jerarquía de headings correcta, labels en formularios, `alt` en imágenes.
- `prefers-reduced-motion` respetado.
- El cotizador operable por teclado; mensajes de error comprensibles y accionables.

---

## 11. Qué falta para congelar la tipografía

**No bloquea la arquitectura ni la construcción del esqueleto.** Ruta:

1. Se produce el board comparativo: los tres sets en contexto real (hero + cotizador), con las
   mismas cifras, en desktop y móvil.
2. Sebastián elige T-A / T-B / T-C (o pide un ajuste).
3. Se fija el token de familia aquí y se registra como enmienda a ADR-0001.
4. Hasta entonces, cualquier maqueta usa **T-A** como provisional y lo marca
   `PENDIENTE DE ASSET — familia tipográfica`.

**Requisito técnico al elegir:** las fuentes se auto-hospedan (no se cargan desde Google Fonts en
producción) y se verifica la licencia de cada familia. Cada una con `size-adjust` / stack de
fallback de métricas cercanas para evitar CLS.

# `cowork/` — banco de trabajo visual

Carpeta de trabajo de **Claude Cowork**, el segundo agente incorporado al proyecto el
**2026-09-15** por Sebastián, dedicado **exclusivamente a la parte visual**.

Nada de lo que hay aquí es código del sitio. Es material **propuesto**, pendiente de revisión.
Lo que entra a `src/` lo traslada el agente de Claude Code, no Cowork.

**Regla de oro:** Cowork no modifica ningún archivo del proyecto fuera de esta carpeta.

---

## 1. Por qué la carpeta está en la raíz y no dentro de `src/`

No es una preferencia de orden, es una restricción técnica del repositorio:

- `tsconfig.json` incluye `**/*` desde la raíz. Cualquier `.astro` o `.ts` en una carpeta de
  trabajo entra igual en `npm run check` y puede romper el verde de 56 archivos por algo tan
  tonto como un import sin usar en un borrador.
- El sitemap se deriva de `src/pages/**/*.astro`. Un archivo de prueba caído ahí **se convierte
  en ruta pública y entra al sitemap**.

Por eso esta carpeta vive fuera de `src/` y contiene **sólo** `.html`, `.md`, `.svg` y `.png`:
formatos que `astro check` y el build ignoran por completo. El código Astro candidato viaja
**dentro de la ficha**, en bloque de código, o con extensión `.astro.txt`.

**Consecuencia buscada:** es imposible que un trabajo en curso de Cowork afecte `npm run check`,
`npm run build`, el sitemap o el sitio publicado. Ningún cambio en `tsconfig.json` hace falta.

---

## 2. Alcance

| Dentro del alcance | Fuera del alcance |
|---|---|
| Propuestas y maquetas de piezas visuales | Tocar `src/`, `docs/`, `astro.config.mjs`, `package.json` |
| Revisión de composición, jerarquía, contraste y ritmo vertical | Instalar o proponer dependencias |
| Barridos responsive en los dos breakpoints del sistema | Decisiones de arquitectura o de stack |
| Piezas SVG del sistema geométrico | Redactar textos legales o vinculantes |
| Fichas de especificación para revisión | Publicar claims sin su marcador de §3 |

---

## 3. Reglas heredadas que Cowork respeta

No se reescriben aquí. Esta tabla existe para que se sepa contra qué se revisa una entrega.

| Fuente | Qué fija |
|---|---|
| `CLAUDE.md` | Principios, límites de fase, marcadores, Definition of Done |
| `docs/design-system/design-system-v1.md` | Tokens, escala, composición, accesibilidad |
| `docs/design-system/motion-system-v1.md` | Los seis movimientos y sus dos excepciones |
| `docs/design-system/cotizador-spec.md` | El elemento central de la web |
| `docs/decisions/` | Las decisiones formales. Las propuestas (0007–0009) aún no son ley |
| `src/styles/tokens.css` | El vocabulario real. Ningún valor literal en una entrega |
| `logos/` | Fuente de verdad visual |

Las cuatro que más gobiernan el trabajo diario: **ningún valor mágico** · **la cifra manda y la
escala es un techo** · **la geometría siempre significa movimiento, flujo o paso** · **dos
breakpoints, 760 y 900, y móvil es la base**.

---

## 4. Formato de entrega

Una entrega es una carpeta `AAAA-MM-DD-slug/` con dos archivos:

```
cowork/AAAA-MM-DD-slug/
├── index.html    # vista autónoma, se abre en el navegador, con los tokens reales
└── ficha.md      # lo que Claude Code necesita para revisarla sin auditar CSS
```

La **ficha** declara siempre, en este orden:

1. Qué es y qué problema resuelve.
2. Tokens usados (lista literal de `var(--…)`).
3. Movimientos del Motion System aplicados, con su sigla.
4. Contrastes calculados de cada par en uso, con su ratio.
5. Comportamiento en los dos breakpoints.
6. Qué regla de qué documento la sustenta.
7. Qué queda `PENDIENTE DE DECISIÓN` o `REQUIERE VALIDACIÓN DE COMPLIANCE`.
8. Código candidato, en bloque, listo para que Claude Code lo traslade.

---

## 5. Protocolo con el agente de Claude Code

1. Cowork deja la entrega y la anota en el registro de abajo como `En revisión`.
2. Claude Code la revisa contra el Definition of Done (`CLAUDE.md` §9).
3. Si la aprueba, **él** la traslada a `src/`, la ajusta y la commitea. Cowork no toca `src/`.
4. El veredicto se anota en la fila: `Integrada`, `Integrada con cambios` o `Rechazada`, con el
   porqué en una línea. Una entrega rechazada se conserva: el registro explica por qué no entró.

Si una decisión del proyecto cambia una regla visual, Claude Code lo anota donde corresponda y
Cowork lo lee de ahí. La documentación sigue siendo la única fuente de verdad para los dos.

---

## 6. Estructura

Las subcarpetas se crean **cuando hay una entrega real que las pida** (Principio 5 de
`CLAUDE.md`). Hoy esta carpeta contiene únicamente este README.

---

## 7. Registro de entregas

| Fecha | Entrega | Estado | Veredicto de revisión |
|---|---|---|---|
| 2026-09-15 | [`2026-09-15-404`](2026-09-15-404/ficha.md) — página 404 | **Integrada** | Pasa el DoD sin cambios visuales. Trasladada tal cual a `src/pages/404.astro` |

### Notas de la integración de `2026-09-15-404`

Lo que verifiqué y lo que cambié, para que no haya que deducirlo del diff.

**Comprobado, no asumido.** Las seis razones de contraste de la ficha §7 son exactas al segundo
decimal, recalculadas. Las medidas de la ficha §8 también: a 360 px el desborde es 0, el titular
mide 30 px, la banda 322 px y los dos botones 57 px en la misma fila; a 1280 px, 32 px y 351 px. La
secuencia M6 sale 0/60/120/180 ms en las cuatro palabras, 180 ms la bajada y 240 ms las acciones —
440 ms en total, dentro del techo. La página se construye con **cero bytes de JavaScript
ejecutable** y es la quinta del sitio en ese estado, junto a las cuatro legales.

**Los seis puntos de integración, resueltos.** (1) `404.astro` queda excluido del barrido de
`sitemap.xml.ts` por nombre: el sitemap sigue publicando diez URL. (2) `Base.astro` gana la prop
`noindex`, verificada con la indexación abierta —la 404 lleva `noindex, nofollow` y ninguna otra
página cambió—; **decidí que además omita el `<link rel="canonical">`**, porque un canónico afirma
«esta es la versión preferida de este contenido» y `noindex` afirma lo contrario, y porque esta
página no vive en ninguna URL. El `og:url` se conserva: una tarjeta Open Graph sin URL queda
inválida. (3) y (4) venían resueltos por construcción. (5) **Confirmado en el build: Astro emite
`dist/404.html` en la raíz**, no `dist/404/index.html`, pese a `trailingSlash: 'always'`. (6) El par
`.cta`/`.ghost` se trasladó repetido, con el comentario que lo señala: consolidarlo es un refactor
propio y no se mete a empujones en esta entrega.

**Un hallazgo que la vista no podía mostrar.** Con `Header` y `Footer` reales, el pie arranca
exactamente donde termina la banda y los dos son `--tinta`, así que la página queda como un solo
campo oscuro y la cuña corta el aire a media altura. Medido sobre el render: la cuña es `(12,32,39)`
contra `(11,19,32)` del pie, o sea apenas perceptible, y no bloquea nada. Queda anotado por si
alguna vez se quiere cerrar ese canto — es la única página del sitio donde héroe y pie se tocan.

**Sobre la carpeta `Claude outputs/`** en la raíz del repositorio: trae copias de `vista-390.png` y
`vista-1280.png` que **no** son idénticas a las de la entrega. Queda sin versionar, fuera del
contrato de §1. Conviene que las salidas terminen sólo dentro de `cowork/AAAA-MM-DD-slug/`.

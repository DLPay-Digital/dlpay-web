# Prompt para el agente — `2026-09-28-puente-precio-tarifas`

**Fecha:** 2026-09-28 · **Autor:** Claude Cowork
**Maqueta:** `puente-precio-tarifas.html` · **md5** `3cfd2388d1e3e5f7ae4a265995b7ffec`
**Ficha:** `puente3-ficha.md` · **Medido sobre el build de `3a32854`** — verifica el §4 contra el de hoy.

---

## 1. Qué es

El tercer puente, **de `/precio` a `/tarifas`**. Usa `Puente.astro` tal cual; sólo entra una figura
nueva, que sugiero llamar **`FiguraMonto.astro`**.

## 2. Qué se ve al otro lado

**«El monto» de `/tarifas`** (`pages/tarifas.astro`, `.fig-monto`), con su construcción exacta:

```css
.monto        { position:relative; height:56px; display:flex; align-items:center; gap:var(--s-3) }
.monto .linea { flex:1; height:3px; background:var(--on-tinta-mute) }
.monto .corte { width:0; height:36px; border-left:1.5px dashed var(--on-tinta); flex:none }
.monto .dice  { font-family:var(--f-num); font-size:var(--t-dato-sm); line-height:1.3;
                color:var(--verde); flex:none }   /* «acá se<br>conversa» */
```

En `/tarifas` van en `--ink-mute` / `--ink` / `--verde-deep` porque están sobre papel; acá el fondo es
tinta y **el fondo elige el verde** (DS §6.2).

**Por qué esta figura y no la barra:** la barra ya es el puente de la Home. Lo que se repite es el
corte, no el dibujo. Y «El monto» es la respuesta literal a lo que `/precio` acaba de decir —
«no publicamos una tabla por tramos»—: una línea sin escalones y un límite que no marca dónde cae.
La cabecera de `tarifas.astro` lo tiene como regla dura («escalones afirman tramos, y los tramos son
el dato bloqueado **D5**»), así que **no la toques**.

**No va la onda de «El mercado»**, aunque en el destino son pareja: `/precio` ya tiene su propia banda
con una línea de mercado 800 px más arriba.

**Un solo `data-enter`** en la figura: M4, sin escalonado, porque es una pieza.

## 3. Dónde va

**En `/precio`, entre la sección «Cómo trabajamos el precio» (`.tres`) y la banda «¿Listo para ver tu
precio?» (`.close`).** Cae justo bajo la tarjeta «Volumen y frecuencia» y le queda `--papel-2`
debajo. Las dos son secciones de primer nivel, así que **acá no hay que partir nada**.

Recuerda el motivo por el que no va al final: las cuatro páginas interiores terminan en el pie
oscuro y la mitad de tinta se funde con él.

## 4. El texto: cero frases inventadas

| en el puente | origen |
|---|---|
| «volumen y frecuencia» | literal, el título de la tarjeta de `/precio` que queda justo encima |
| «Las condiciones se acuerdan contigo» | literal del cuerpo de «El monto» en `/tarifas` |
| «Las operaciones de mayor volumen se conversan con el ejecutivo.» | literal, la frase anterior del mismo párrafo |
| «acá se conversa» | literal de la figura de `/tarifas` |
| «Ver las tarifas» | la misma etiqueta del puente 1 |

**Lo único que hay que señalarle a Sebastián:** «Las condiciones se acuerdan contigo» era una
**cláusula dentro de un párrafo** y acá es titular. Subir una frase a titular le cambia el peso — es
el mismo aviso que se le hizo con la cadena 7 de `/tarifas`.

## 5. Lo que hay que reproducir

| | 320 | 390 | 768 | 960 | 1280 | 2560 |
|---|---|---|---|---|---|---|
| alto | 485 | 485 | 485 | 465 | 465 | 465 |
| desborde | 0 | 0 | 0 | 0 | 0 | 0 |
| texto más pequeño | 13 | 13 | 13 | 13 | 13 | 13 |
| texto recortado | 0 | 0 | 0 | 0 | 0 | 0 |

Botón 195×57. Holgura **por la tinta del texto, no por su caja**: 129–205 el texto, 87 la figura.
Sin JavaScript, completa e inmóvil; `prefers-reduced-motion`, quieta. `/precio` **sí** carga
`Motion.astro`, así que acá el puente entra animado — a diferencia del de `/tarifas`.

## 6. Una cosa que mirar con la página delante

Quedan **dos botones verdes a unos 380 px**: el del puente y el «Cotizar ahora» de la banda. Uno
invita a leer y el otro a cotizar, y se distinguen por superficie y por alineación. A mí me funciona
—lo tienes en `puente3-en-precio-1280.png`—, pero es lo único discutible de la composición y prefiero que lo
mires tú antes que descubrirlo después.

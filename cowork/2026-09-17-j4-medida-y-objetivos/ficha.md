# Ficha — J4 · medida de lectura y objetivos táctiles

**Entrega:** `2026-09-17-j4-medida-y-objetivos` · **Autor:** Claude Cowork · **Estado:** En revisión
**Origen:** jugada 1 del estudio `2026-09-17-estudio-nivel-2`, aprobada por Sebastián.
**Sin maqueta:** no hay nada que ver, hay valores que corregir. Todo está medido en el navegador.

---

## 1. El hallazgo principal: `ch` no mide caracteres

El Design System §3.1 fija la medida de lectura en **< 65–70 caracteres**. El sitio la implementa
con `max-width` en `ch` — **40 declaraciones** repartidas por componentes y páginas. El problema es
que `1ch` **no** es un carácter: es el ancho del glifo **cero** de la fuente activa.

Medido en el navegador con Familjen Grotesk a 16 px:

| | Ancho |
|---|---|
| El glifo `0` (lo que vale `1ch`) | **9,00 px** |
| Carácter medio de texto español corrido | **6,51 px** |
| **Factor** | **1,38** |

O sea: **cada `ch` vale 1,38 caracteres reales**, y toda medida escrita en `ch` es un 38 % más
ancha de lo que su autor creyó.

### La consecuencia, medida sobre el build

`como-funciona.astro` declara `.scope-box { max-width: 66ch }` — dentro del tope, en apariencia.
En pantalla esa caja mide **594 px** y caben **91 caracteres** de media; la primera línea del
párrafo, contada carácter a carácter con rangos del DOM, llega a **113**.

Y ese párrafo es el que declara **dónde termina el servicio**, que `CLAUDE.md` §1 convierte en
regla dura de contenido. Es el peor sitio posible del sitio para que la lectura se haga cuesta
arriba.

### La regla que propongo

> **El tope de texto corrido pasa de 66ch a 47ch.**

`65 caracteres × 6,51 px ÷ 9,00 px = 47ch`. Todo lo que hoy declare **más de 47ch** para texto
corrido baja a 47ch; lo que ya esté por debajo se queda como está, porque esas medidas más
estrechas son decisiones de composición, no errores.

Con eso, `46ch` (que es el valor más repetido del sitio) da 63 caracteres reales y queda dentro del
tope por primera vez **a propósito** y no por casualidad.

### La entrega va partida en dos, a propósito

Siete de las dieciséis declaraciones viven en `confianza.astro` y `como-funciona.astro`, que son
las dos páginas del rediseño en curso (jugadas J1–J3). Corregirlas ahora significaría tocar esos
archivos dos veces y abrir una ventana en la que la maqueta y el código no coinciden.

| Lote | Qué | Cuándo |
|---|---|---|
| **A · ahora** | Las 9 declaraciones fuera de esas dos páginas, los dos objetivos táctiles y el `svg` | Esta entrega |
| **B · después** | Las 7 de `confianza.astro` y `como-funciona.astro` | Dentro de las entregas del rediseño, aplicadas a los bloques nuevos |

`PageHero.astro:143` está **en el lote A a propósito**: es el encabezado que usan las dos páginas
del rediseño, así que conviene que la medida corregida esté abajo antes de que yo diseñe encima.

### Las 16 declaraciones afectadas

| Archivo | Línea | Hoy | Caracteres reales |
|---|---|---|---|
| `layouts/Legal.astro` | 41 | 68ch | **94** |
| **B** · `pages/como-funciona.astro` | 242 | 66ch | **91** |
| **B** · `pages/confianza.astro` | 146 | 66ch | **91** |
| `components/Steps.astro` | 365 | 72ch | **99** |
| `components/Steps.astro` | 340 | 60ch | 83 |
| `components/Faq.astro` | 65 | 62ch | 86 |
| `components/Alliances.astro` | 103 | 62ch | 86 |
| `pages/blog/index.astro` | 143 | 62ch | 86 |
| **B** · `pages/como-funciona.astro` | 199 | 58ch | 80 |
| `components/Business.astro` | 97 | 56ch | 77 |
| `components/PageHero.astro` | 143 | 54ch | 75 |
| **B** · `pages/confianza.astro` | 205 | 54ch | 75 |
| **B** · `pages/confianza.astro` | 187 | 52ch | 72 |
| **B** · `pages/confianza.astro` | 209 | 52ch | 72 |
| **B** · `pages/como-funciona.astro` | 219 | 52ch | 72 |
| `pages/empresas.astro` | 304 | 50ch | 69 |

**Las cuatro peores son las que más importan:** las páginas legales (94 caracteres por línea en
documentos largos), el límite del servicio en `/como-funciona`, el mecanismo de `/confianza` y el
pie de `Steps` en la Home.

**Ojo con dos que NO se tocan:** `Hero.astro:137` y `PageHero.astro:139` declaran `18ch` para el
`h1`. Eso no es texto corrido sino una medida de titular, y a 52 px el factor es el mismo pero el
objetivo es otro: que el titular parta en dos o tres líneas. Se quedan.

---

## 2. Objetivos táctiles — dos reales, y una corrección

Medido a 390, 760, 900 y 1280 px. **La primera versión del estudio exageró esto** diciendo que
afectaba a todo el tráfico móvil; a 390 la navegación vive en el cajón y esos enlaces no existen.

**Los dos que sí hay que arreglar**, porque están en todos los anchos:

| Elemento | Alto | Dónde |
|---|---|---|
| «Ver el proceso completo» | **17,0 px** | Home, cierre de `Steps` |
| Logotipo → inicio | **31,0 px** | cabecera, todas las páginas |

Los dos son enlaces sin relleno vertical: el mismo caso que el pie ya resolvió en su momento
—`min-height` explícito, que además absorbe la separación— y que estos dos se saltaron.

**Lo que NO propongo tocar, y por qué:**

- Los enlaces de nav a ≥ 900 px (27,3 / 17,0 / 21,7 px). Ahí el puntero es un ratón. WCAG 2.2 AA
  (2.5.8) pide 24×24 y sólo «Empresas» no llega; subirlos a 44 engorda la cabecera en escritorio
  sin beneficio real. **Si quieres cumplir el §10 al pie de la letra, es una línea** — pero
  entonces conviene enmendar el §10 para que distinga puntero, en vez de dejar la regla escrita
  como absoluta y cumplida a medias.
- «Ver más» y «Conoce DLPay Empresas» a 32 px: `AnnouncementBar` lo declara a propósito en
  escritorio. Es una decisión tomada, no un olvido.
- «Saltar al contenido» a 40,8 px: sólo existe con foco de teclado.
- Los dos `INPUT` de 1×1 px: son campos ocultos del cotizador.

---

## 3. Un tercero, menor

`/empresas` tiene un `<svg class="wedge">` dentro de `.connector` **sin `aria-hidden`**. Es el
único de los 30 SVG del sitio que se lo salta. Un lector de pantalla lo anuncia como gráfico sin
nombre.

---

## 4. Lo que gana

- El párrafo que declara el límite del servicio pasa de 113 a ≤ 65 caracteres por línea.
- Las cuatro páginas legales dejan de leerse a 94 caracteres.
- El sitio deja de tener una regla escrita que ningún archivo cumple, y pasa a tener un tope
  verificable con un `grep`: **ningún `max-width` de texto corrido por encima de `47ch`**.

## 5. Lo que cuesta

16 valores, dos `min-height` y un atributo. Cero componentes nuevos, cero tokens nuevos, cero
JavaScript, cero cambios visuales fuera del ancho de los párrafos.

## 6. Para el traslado

1. Conviene dejar el factor escrito donde se pueda encontrar —Design System §3.1 o
   `development.md`—, porque el próximo que escriba `max-width: 60ch` va a repetir el error. La
   frase mínima: *«1ch = 1,38 caracteres en Familjen Grotesk; el tope de 65 caracteres es 47ch»*.
2. Si en algún momento cambia la tipografía, el factor cambia y hay que volver a medirlo. Es la
   razón por la que no propongo un token `--medida`: escondería la dependencia.
3. Verificable después del cambio con el mismo método: contar caracteres de la primera línea con
   `Range.getClientRects()` sobre el build, no a ojo.

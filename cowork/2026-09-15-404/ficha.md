# Ficha — Página 404

**Entrega:** `2026-09-15-404` · **Autor:** Claude Cowork · **Estado:** En revisión
**Vista:** `index.html` (se abre en el navegador) · **Capturas:** `vista-1280.png`, `vista-390.png`

---

## 1. Qué es y qué problema resuelve

No existe `src/pages/404.astro`. `docs/migracion-urls.md` §54 pide **vigilar 404 durante 48–72 h**
del cutover, así que el proyecto ya cuenta con que va a haber 404 y hoy quien caiga ahí verá la
página de error del host, fuera de la identidad DLPay.

El diagnóstico de Claude Code acota a quién hay que atender: las URL con más probabilidad de
llegar aquí son de la **plataforma** —`/auth/login/`, `/app/`, `/onboarding/`— si alguna
redirección se escapa. Es decir, **gente que buscaba su cuenta**, no el sitio de marketing.

La propuesta es en consecuencia mínima: un encabezado en tinta, una frase que explica sin culpar
al usuario y **dos salidas**, una interna y una a la plataforma. Nada más.

---

## 2. La decisión de fondo: cero componentes nuevos

`PageHero.astro` ya es exactamente lo que esta página necesita: banda de tinta con cuñas, ranura
`cta`, `lead` opcional y **M6 en secuencia por CSS puro**. Reusarlo tal cual tiene tres
consecuencias que valen más que cualquier propuesta visual nueva:

1. **Cero componentes nuevos** (Principio 5) y cero CSS nuevo salvo el par de botones, que se copia
   literal de `empresas.astro`, donde ya vive.
2. **La restricción 3 queda resuelta por construcción.** `PageHero` anima con `animation` CSS y
   `animation-delay`, no con `[data-enter]`. La página **no importa `Motion.astro`**, así que no
   existe observador que pueda dejar contenido oculto en la única página donde el usuario ya llegó.
3. **La 404 sería la quinta página del sitio en cero bytes de JavaScript**, junto a las cuatro
   legales.

---

## 3. Lo que NO lleva, y por qué

| Descartado | Razón |
|---|---|
| Un «404» gigante centrado | Es el cliché de plantilla que prohíbe el Principio 3. Y roba el vocabulario de la cifra grande, que en este sistema está reservado al precio (DS §1 y §5). El código vive en el `<title>` y en la respuesta HTTP, que es donde sirve. |
| Lista de rutas de recuperación | `Header` y `Footer` ya traen la navegación completa. Repetirla es cantidad, no claridad (`CLAUDE.md` §12). |
| Geometría propia, cuña o conector | La geometría **siempre** representa movimiento, flujo o un paso (DS §6). En una página sin proceso no hay nada que dibujar. Las cuñas que se ven en la captura son las de `PageHero`, con su función de banda; no añadí ninguna. |
| Enlace a WhatsApp | Hoy abriría el chat en blanco. Es **D22**, con cinco enlaces ya en esa situación. No se añade un sexto. |
| Ilustración o mockup | No hay nada que mostrar. Sería decoración. |
| Copy con humor («ups», «te perdiste») | El registro del sitio es mesa de operaciones, no fintech amable (DS §1). |

---

## 4. Jerarquía de las dos acciones — decisión discutible, la dejo explícita

Propongo **primaria verde «Ir al inicio»** y **fantasma «Entra a tu cuenta»**.

**A favor:** el relleno verde significa «la acción primaria de DLPay» en todo el sitio, y esa
acción es siempre interna. Usarlo para salir del dominio, justo en la única página donde ya
perdimos al usuario, le enseña un segundo significado al botón. Además, la ventana de cutover son
48–72 h y esta página es permanente.

**En contra:** si el diagnóstico de tráfico es correcto, la mayoría de quienes lleguen querían su
cuenta, y la acción más útil está en el botón secundario.

**Cómo se invierte:** intercambiar las clases `cta` y `ghost` entre los dos enlaces. Una línea.
Mi recomendación es dejarla así ahora y revisarla con lo que se vea durante el cutover, que es
justo cuando habrá datos.

~~`PENDIENTE DE DECISIÓN — jerarquía de las dos acciones de la 404.`~~ **Cerrada por Sebastián el
2026-09-15: queda como está.** «Ir al inicio» primaria en verde, «Entra a tu cuenta» fantasma. Se
revisa con lo que se vea durante el cutover; invertirla es intercambiar las dos clases.

**Nota de vocabulario.** El botón dice «Entra a tu cuenta» y la cabecera llama a ese mismo destino
«Iniciar sesión». Es a propósito: aquí el botón responde a la frase de la bajada —«si venías a tu
cuenta»—, mientras que en la cabecera es una etiqueta de navegación neutra. Si se prefiere una sola
forma en todo el sitio, la de la cabecera manda y el cambio es una palabra.

---

## 5. Tokens usados

Ninguno nuevo. Ningún valor literal.

**Color:** `--tinta` · `--on-tinta` · `--on-tinta-mute` · `--verde` · `--verde-hi` (hover) ·
`--on-verde` · `--line-on-tinta` · `--focus` (a través de `.on-tinta-surface`, que lo redefine a
`--verde`).
**Tipografía:** `--t-display-m` / `--t-h2` (h1) · `--t-body` / `--t-h3-m` (bajada) ·
`--t-body-sm` (fantasma) · `--lh-display` · `--ls-display`.
**Espacio:** `--s-2` · `--s-3` · `--s-4` · `--s-5` · `--s-6` · `--s-7` · `--s-8` · `--s-9` ·
`--pad-section` · `--pad-section-m` · `--container`.
**Forma:** `--r-2` (los dos botones). Ninguna elevación: `--elev-card` es sólo del cotizador.
**Movimiento:** `--m-base` · `--m-fast` · `--m-ease` · `--m-stagger` · `--m-shift-x` ·
`--m-shift-y`.

---

## 6. Movimiento

**M6 · secuencia de carga**, y nada más. Cinco pasos:

| Paso | Elemento | Desfase |
|---|---|---|
| 0–3 | Las cuatro palabras del titular | `--w` × 60 ms |
| 3 | Bajada | `--seq:3` → 180 ms |
| 4 | Fila de acciones | `--seq:4` → 240 ms |

Cada elemento dura `--m-base` (200 ms), **dentro del techo de 280**. Total de la secuencia:
**440 ms**, por debajo de los 620 ms del héroe de la Home. El titular entra palabra por palabra
según la enmienda del 2026-09-10; son cuatro palabras, así que además queda dentro del tope de
cuatro hermanos aunque no se invocara esa enmienda.

**Sin `[data-enter]`, sin `IntersectionObserver`, sin `Motion.astro`.** Verificado con
`prefers-reduced-motion: reduce`: la geometría medida es idéntica y no corre ninguna animación.

---

## 7. Contraste — calculado, no a ojo

| Par | Ratio | Mínimo aplicable | Fuente |
|---|---|---|---|
| `--on-tinta` sobre `--tinta` (titular y fantasma) | **16,44:1** | 4,5:1 | calculado |
| `--on-tinta-mute` sobre `--tinta` (bajada) | **8,18:1** | 4,5:1 | calculado |
| `--on-verde` sobre `--verde` (botón primario) | **8,58:1** | 4,5:1 | DS §2.2, confirmado |
| `--on-verde` sobre `--verde-hi` (primario en hover) | **10,15:1** | 4,5:1 | calculado |
| `--line-on-tinta` compuesto sobre `--tinta` (contorno del fantasma) | **3,50:1** | 3:1 (WCAG 1.4.11) | DS §2.2, confirmado |
| `--focus` = `--verde` sobre `--tinta` | **8,45:1** | 3:1 | DS §2.4, confirmado |

El par más ajustado queda **1,17×** sobre su mínimo. Ningún verde sobre superficie clara: la
página entera vive sobre tinta, que es donde `#16C784` sí rinde.

---

## 8. Responsive — medido en navegador

Chromium con viewport real, no captura escalada. Cinco anchos:

| Ancho | Desborde horizontal | h1 | Bajada | Alto de la banda | Botones |
|---|---|---|---|---|---|
| 360 | **0** | 30 px | 3 líneas | 322 px | 57 px de alto |
| 390 | **0** | 30 px | 3 líneas | 322 px | 57 px |
| 430 | **0** | 30 px | 3 líneas | 322 px | 57 px |
| 768 | **0** | 30 px | 2 líneas | 298 px | 57 px |
| 1280 | **0** | 32 px | 2 líneas | 351 px | 57 px |

Los dos botones **caben en una fila incluso a 360 px** (terminan en x=333 con 340 disponibles), así
que `flex-wrap` no llega a actuar. Altura de 57 px: por encima del objetivo táctil de 44.

En 768 el titular sigue en escala móvil porque el único breakpoint que cambia la tipografía es el
de 900 — es el comportamiento del sistema, no un olvido.

> **Trampa que me encontré, por si a alguien le pasa:** con `--window-size=390` el Chrome headless
> maquetó a 500 px y recortó la captura a 390, lo que fingía un desborde que no existe. Es
> literalmente el aviso de `development.md` («no medir geometría en una captura»). Con viewport
> real el desborde es 0 en los cinco anchos.

---

## 9. Reglas que la sustentan

| Documento | Regla aplicada |
|---|---|
| `CLAUDE.md` Principio 3 | Nada de 404 gigante, gradientes, ilustración ni humor de plantilla |
| `CLAUDE.md` Principio 5 | Ningún componente nuevo: la página usa lo que ya existe |
| `CLAUDE.md` §12 | Claridad por encima de cantidad de salidas |
| Design System §3.0 regla 1 | Voz de página interior: `--t-h2`, no la escala de la Home |
| Design System §4.3.1 | Ritmo de encabezado: `--s-8` arriba / `--s-9` abajo, el de `PageHero` |
| Design System §6 | Sin geometría añadida: aquí no hay proceso que representar |
| Design System §10 | Foco visible por `.on-tinta-surface`, objetivos ≥44 px |
| Motion System §4, M6 | Secuencia de carga, 200 ms por elemento, eje diagonal |
| Motion System §4, regla dura 5 | Sin JavaScript la página se ve completa |
| ADR-0004 §3 | Cero valores mágicos |

---

## 10. Lo que resuelve Claude Code al integrar

Los cuatro puntos que levantó, más dos que salieron al construir:

1. **Sitemap** — excluir `404.astro` del barrido de `sitemap.xml.ts`. (Suyo.)
2. **`noindex` siempre** — la prop nueva de `Base.astro`. El código candidato ya la invoca. (Suyo.)
3. **Entrada al cargar, no al hacer scroll** — resuelto por construcción, §2 de esta ficha.
4. **Salida a la cuenta** — el fantasma con `platform.loginUrl`, §4 de esta ficha. El destino es
   la plataforma de Guita (`https://dlpay.cl/auth/login`, el mismo valor que ya consume `Header`
   en «Iniciar sesión»). Va por la constante y **nunca escrito a mano**: `site.ts` la declara punto
   único de acoplamiento con Guita, así que el día que exista infraestructura propia se cambia ahí
   y esta página migra sola. Se abre en la **misma pestaña**, no en una nueva: quien llega aquí
   quería su cuenta, y dejarle atrás una pestaña con un 404 muerto no ayuda.
5. **`trailingSlash: 'always'`** — conviene confirmar que Astro emite `dist/404.html` en la raíz y
   no `dist/404/index.html`, porque un host estático busca lo primero.
6. **Tercera copia del par de botones.** `.cta`/`.ghost` sobre tinta ya está escrito en
   `empresas.astro`, y en variante clara en `index.astro`. Esta sería la tercera. No lo resuelvo yo
   porque es refactor de `src/`, pero queda señalado: si el par se mueve a un sitio compartido,
   esta página debería nacer ya consumiéndolo.

---

## 11. Compliance

**Ningún claim nuevo.** La página no afirma nada sobre el servicio, no trae cifras, no menciona
regulación, no promete tiempos y no añade un sexto enlace a WhatsApp en blanco (D22). No requiere
validación de Compliance.

---

## 12. Código candidato

`src/pages/404.astro` — listo para trasladar. Los estilos son copia literal de `empresas.astro`.

```astro
---
/**
 * 404 — la dirección no existe.
 *
 * Reusa `PageHero` sin añadir nada: misma banda, mismas cuñas, misma secuencia
 * M6. Dos salidas, una interna y una a la plataforma, porque en el cutover el
 * tráfico más probable viene de URL de cuenta (/auth/login/, /app/) y no del
 * sitio de marketing (docs/migracion-urls.md).
 *
 * NO importa `Motion.astro` a propósito: el movimiento de `PageHero` es CSS de
 * carga, y un observador podría dejar el contenido oculto justo en la página
 * donde el usuario ya llegó. La página va en CERO bytes de JavaScript.
 */
import Base from '../layouts/Base.astro';
import Header from '../components/Header.astro';
import Footer from '../components/Footer.astro';
import PageHero from '../components/PageHero.astro';
import { platform } from '../lib/config/site.ts';
---
<Base
  title="Página no encontrada"
  description="La dirección no existe o cambió. Vuelve al inicio de DLPay o entra a tu cuenta."
  path="/404/"
  noindex
>
  <Header />
  <main id="main">
    <PageHero
      title="Esta página no existe."
      lead="El enlace puede estar antiguo o la dirección venir con un error de tipeo. Si venías a tu cuenta, entra directo desde acá."
      sequence
    >
      <Fragment slot="cta">
        <a class="cta" href="/">Ir al inicio</a>
        <a class="ghost" href={platform.loginUrl}>Entra a tu cuenta</a>
      </Fragment>
    </PageHero>
  </main>
  <Footer />
</Base>

<style>
  /* Copia literal del par de acciones sobre tinta de `empresas.astro`. Ver el
     punto 6 de la ficha: si el par se consolida en un sitio compartido, esta
     página debería consumirlo en vez de repetirlo. */
  .cta {
    display: inline-flex;
    align-items: center;
    gap: var(--s-2);
    background: var(--verde);
    color: var(--on-verde);
    font-weight: 700;
    font-size: var(--t-body);
    padding: var(--s-4) var(--s-6);
    border-radius: var(--r-2);
    text-decoration: none;
    transition: background-color var(--m-fast) var(--m-ease);
  }
  .cta:hover { background: var(--verde-hi); }
  .ghost {
    display: inline-flex;
    align-items: center;
    /* 0.40 y no 0.28: WCAG 1.4.11 pide 3:1 al contorno de un control y este
       alfa da 3.50:1 sobre `--tinta`. Mismo valor que Steps y empresas. */
    border: 1px solid var(--line-on-tinta);
    color: var(--on-tinta);
    font-weight: 600;
    font-size: var(--t-body-sm);
    padding: var(--s-4) var(--s-5);
    border-radius: var(--r-2);
    text-decoration: none;
    transition: border-color var(--m-fast) var(--m-ease);
  }
  .ghost:hover { border-color: var(--on-tinta); }
</style>
```

---

## 13. Sobre la vista

`index.html` **consume el `tokens.css` real del proyecto** por ruta relativa: no hay copia de
tokens, así que no puede quedar desalineada. Lo que sí replica —y por tanto caduca si alguien lo
toca— es el CSS de `PageHero.astro`, copiado literal para que la vista muestre lo que el
componente produce. Las fuentes se cargan con ruta relativa a `public/fonts/` porque la vista se
abre con `file://`.

Las dos franjas grises punteadas son **andamio de la vista**, no parte de la propuesta: marcan
dónde van `Header.astro` y `Footer.astro` para poder juzgar el ritmo vertical sin falsificar dos
componentes que ya existen.

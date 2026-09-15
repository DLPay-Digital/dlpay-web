# Addendum — el canto de la banda contra el pie

**Entrega:** `2026-09-15-404` · **Autor:** Claude Cowork · **Estado:** En revisión
**Origen:** el hallazgo que dejó anotado Claude Code al integrar (`e83b4df`).
**Evidencia:** `canto-sin.png`, `canto-con.png`, `pagina-integrada-1280.png`

---

## 1. El hallazgo, ampliado

Medido sobre el build real (`dist/404.html`), no sobre la vista:

| Pieza | Franja | Fondo |
|---|---|---|
| Cabecera | 0 → 109 px | `rgb(11,19,32)` |
| Banda del encabezado | 109 → 459,8 px | `rgb(11,19,32)` |
| Pie | 459,8 → 1025,5 px | `rgb(11,19,32)` |

**La cabecera también es tinta.** Así que no son dos piezas oscuras que se tocan: son **tres**, y la
404 es la única página del sitio **sin superficie de papel**, salvo la franja de anuncio de 24 px.
El Design System §1 describe el sistema como «superficie clara + zonas de tinta profunda»; aquí la
zona de tinta se queda sin el claro que la define.

## 2. Lo que se ve, y por qué

En `canto-sin.png`: las dos cuñas **se cortan planas** contra una línea horizontal que no existe.
No se lee como una decisión, se lee como un recorte.

La causa es mecánica: `overflow: hidden` de la banda recorta el `clip-path` de las cuñas. En las
otras tres páginas con `PageHero` eso no se nota porque la banda termina contra papel y el canto se
declara solo. Aquí no hay cambio de superficie que lo declare.

## 3. Propuesta  ·  ⚠️ SUPERADA — la regla de abajo estaba mal. Ver §5.

> Se conserva tal cual porque el error es parte del registro: el diagnóstico era correcto y
> la regla no. Lo que se integró es lo de §5.


Un filete de 1 px al final del contenido, **en `404.astro`**, no en `PageHero`:

```astro
<style>
  /* La única página del sitio donde el contenido termina contra el pie sin una
     superficie clara en medio: los dos son --tinta y, sin canto, las cuñas de la
     banda se cortan contra una línea que no existe.

     0.10 es el alfa de separador decorativo que ya usan `Header.astro` (borde
     inferior) y `Footer.astro` (divisor del pie). NO es --line-on-tinta: ese
     token está reservado al contorno de un CONTROL y pesa 0.40 (DS §2.2). */
  main { border-bottom: 1px solid rgba(237, 242, 239, 0.1); }
</style>
```

Verificado en el build: `main` y `.page-hero` tienen exactamente los mismos límites
(109 → 459,75 px), así que el filete cae justo en la costura.

### Las cuatro decisiones detrás de esa línea

| Decisión | Por qué |
|---|---|
| **Valor `rgba(237,242,239,.1)`** | No lo inventé: es el idioma ya escrito en `Header.astro:208` y `Footer.astro:120`. El DS §2.2 dice explícitamente que los separadores decorativos de 0.06–0.14 **no** usan `--line-on-tinta`. |
| **Literal y no token** | No existe token para «separador decorativo sobre tinta»; el sistema lo escribe a mano en tres componentes. Queda justificado en el sitio, como pide ADR-0004 §3. Si algún día se tokeniza, esta sería la cuarta línea que lo consume. |
| **En la página, no en `PageHero`** | Es la única página donde la banda toca el pie. En el componente cambiaría también `/como-funciona`, `/confianza` y `/empresas`, donde la banda ya termina contra papel y el canto existe. |
| **Sobre `main` y no sobre `.page-hero`** | Con `scopedStyleStrategy: 'class'`, una regla de la página no alcanza a un elemento que vive dentro del componente hijo — es la trampa de `development.md`. `main` sí está en la plantilla de la página y hoy contiene exactamente la banda. Y además dice lo correcto: el filete marca **dónde termina el contenido**, no dónde termina un componente. |

### Lo que descarté

- **Prolongar las cuñas hacia el pie.** La geometría representa movimiento, flujo o un paso
  (DS §6). Una cuña que atraviesa el pie es tapiz.
- **Quitarle las cuñas a la 404.** Exigiría una prop nueva en un componente compartido para
  resolver un problema de una página.
- **Poner el pie sobre papel.** Cambia las nueve rutas para arreglar una.

## 4. Lo que miré y decidí NO cambiar

**El pie pesa más que el mensaje.** Mide 566 px en escritorio y 1041 px en móvil, contra 351/322 de
la banda. Es inherente a colgar el pie completo de una página corta, y la alternativa sería rellenar
la 404 con contenido —justo lo que descarté en la ficha §3. El mensaje se lleva la primera pantalla
completa en los dos anchos, que es lo que tiene que pasar. Lo dejo medido, no corregido.

---

## 5. Corrección — 2026-09-15, tras la revisión de Claude Code

**La regla de §3 estaba mal y el error es mío.** `main` es transparente por omisión; detrás está el
`body`, que es `--papel`. El borde se pinta en el canto de `main`, **fuera** de la caja de fondo de
la banda, así que el alfa 0.10 componía contra papel y no contra tinta.

Medido en el build, muestreando el píxel de la fila del borde a 1280 px:

| Regla | Píxel del filete | Contraste contra `--tinta` | Lectura |
|---|---|---|---|
| `main { border-bottom }` — lo que propuse | `rgb(245,245,240)` | **17,03:1** | Un filete crema de lado a lado. Lo contrario de un separador |
| `main { background: var(--tinta); border-bottom }` — lo integrado | `rgb(33,42,52)` | **1,29:1** | Separador decorativo, que es lo que se buscaba |
| `.page-hero { border-bottom }` — la variante que sí fotografié | `rgb(33,42,52)` | **1,29:1** | Idéntica a la correcta |

Las cifras coinciden con las que midió Claude Code dentro del redondeo.

**Cómo se coló.** La evidencia de `canto-con.png` se hizo aplicando el borde a `.page-hero`, que
**sí** tiene fondo propio — y el fondo de un elemento pinta también bajo su borde. Al mover la regla
a `main` por la razón de ámbito de §3, el píxel cambió y la evidencia dejó de corresponder a la
propuesta. Peor: llegué a generar la captura de la variante sobre `main` —`canto-en-main.png`,
donde el filete crema se ve a simple vista— y **no la abrí**.

> `canto-en-main.png` no venía en la entrega pese a estar citado acá. Lo repuso Claude Code al
> versionar el addendum, recortado de su propia captura del build durante la revisión y con el
> mismo encuadre que `canto-sin.png` y `canto-con.png`: la fila del filete mide `rgb(245,245,241)`.
> Se deja porque es la evidencia de lo que salió mal, y un documento del registro no debería citar
> un archivo que no está.

**Tres reglas que salen de acá**, ya incorporadas a `cowork/README.md` §4:

1. Todo color con alfa declara contra qué compone, y su evidencia sale del **build real**. Una
   vista autónoma no puede reproducir el fondo que hay detrás de una caja transparente, que es
   exactamente de lo que depende un alfa.
2. Si una regla se mueve de un elemento a otro, la evidencia se **rehace**. El píxel cambia aunque
   la regla parezca la misma.
3. Ninguna captura se genera sin mirarla. Una captura sin abrir no es una verificación.

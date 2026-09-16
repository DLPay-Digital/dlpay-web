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
| `docs/design-system/motion-system-v1.md` | Los seis movimientos y sus **tres** excepciones |
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

### Reglas de evidencia

Salieron de un error real: una propuesta con un alfa se fotografió sobre un elemento y se
recomendó sobre otro, y el filete que iba a ser un separador salía crema a 17:1
(`2026-09-15-404/addendum-canto.md` §5).

1. **Todo color con alfa declara contra qué compone**, y su evidencia sale del **build real**, no
   de la vista. Una vista autónoma no puede reproducir lo que hay detrás de una caja transparente
   —el `body`, el pie, la cabecera—, y la composición de un alfa depende exactamente de eso.
2. **Si una regla se mueve de un elemento a otro, la evidencia se rehace.** El píxel cambia aunque
   la regla se vea igual: el fondo de un elemento pinta bajo su propio borde, y el de su padre no.
3. **Ninguna captura se genera sin mirarla.** Una captura sin abrir no es una verificación.

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
| 2026-09-16 | [`2026-09-16-blog-portada-de-dato`](2026-09-16-blog-portada-de-dato/ficha.md) — portada de dato y título debajo | **Integrada con cambios** | La estructura y los dos tipos, tal cual. El dibujo pasa de SVG a HTML: en móvil el SVG escalaba los rótulos a ~6 px |
| 2026-09-16 | [`2026-09-16-blog-sin-portada`](2026-09-16-blog-sin-portada/ficha.md) — el blog sin portadas, texto primero | **Integrada** | El listado pasa a índice tal cual se propuso |
| 2026-09-16 | [`2026-09-16-empresas-casos`](2026-09-16-empresas-casos/ficha.md) — lenguaje visual de «Para qué lo usan» (exploración) | **Integrada** | El diagnóstico de §1 es correcto y verificable; el tratamiento A es el único específico de DLPay |
| 2026-09-16 | [`2026-09-16-empresas-casos` · propuesta](2026-09-16-empresas-casos/propuesta.html) — los cuatro casos en «plano recortado» | **Integrada** | Los cuatro SVG trasladados literalmente. Sin cambios de dibujo |

### Notas de la integración de `2026-09-16-empresas-casos`

**El diagnóstico de §1 es el argumento de peso y lo confirmé.** El motivo no es estético: tres de
los cuatro emblemas simulaban producto que DLPay no presta. Con el cambio se van además las otras
tres cosas que señalaba, y las medí: `2.174,62` pasa de **seis apariciones a una** en `/empresas`
—la que queda es el portátil del encabezado, que sí deriva de `lib/pricing`—, y `--elev-card`
desaparece de las figuras.

**Los cuatro SVG van copiados literalmente.** Lo verifiqué comparando la fuente con el componente
dato a dato: los 16 `path` de dibujo, los 10 `stroke-width`, los 4 `rect`, los 8 `circle` y las 6
etiquetas coinciden **exactamente**. Lo único que no es copia literal son el plano y su complemento,
que se extrajeron a dos constantes (`PLANO`, `FUERA`) porque aparecen diez veces entre las cuatro
figuras y son la gramática común: el canto de la marca tiene que ser el mismo en todas por
definición, y repetirlo diez veces es diez sitios donde se puede desincronizar.

**Un error propio, dicho porque enseña algo:** intenté derivar `FUERA` de `PLANO` con `slice(1)` y
producía un `path` inválido — el `M` del segundo subtrazo es parte del dato. Corregido antes de
construir; las dos constantes van literales.

**Verificado en el navegador sobre el build, a 390 y 1280:** desborde horizontal **0** en los dos ·
las cuatro figuras a **460×300** en escritorio, así que las cuatro filas miden exactamente 300 px ·
`aria-hidden="true"` en las cuatro · sin sombra y sin radio · los dos `clipPath` aplicados en las
tres figuras que cruzan y **ninguno** en tesorería, que es el dibujo · los seis ids (`p1-in`…
`p4-out`) aparecen **una sola vez** cada uno. Todos los `var()` resuelven, incluidos los de los
atributos de presentación: `--f-num` da Spline Sans Mono y `--tinta` da `rgb(11, 19, 32)`.

**Contrastes recalculados.** Cinco de los seis coinciden al segundo decimal. El sexto no: la ficha
da **16,44** para «papel sobre tinta» y son **17,06** — 16,44 es la razón de `--on-tinta`, no de
`--papel`. Sale más alto, así que no cambia nada, pero conviene no arrastrar el número.

**Los cinco puntos de verificación, resueltos.** (1) Los ids globales quedan documentados en el
docblock del componente, con la condición exacta que los rompería: dos filas con el mismo `kind`.
(2) `aria-hidden` en las cuatro. (3) El dimensionado pasa de `380px` + `4/3` a `460px` con la
proporción del `viewBox`. (4) Las cuatro filas conservan su `data-enter` y siguen siendo cuatro
hermanas. (5) Ningún otro componente dependía de las importaciones de pricing; `/empresas` sigue en
**0 módulos externos**.

**Una corrección al punto 5 de la entrega:** dice que `/empresas` debía seguir en 545 B de JS y
mide **862 B**. No lo causa este cambio — son los 314 B del `is:inline` del Motion System, que creció
ayer al añadirle la red de seguridad por si el módulo que revela el contenido no llega a correr.

**Y un hallazgo que dejo anotado sin tocar:** la ficha tiene razón en que el Design System §4.5
reserva `--elev-card` **sólo** para la tarjeta del cotizador sobre tinta. Quitarla de las figuras
arregla una de **tres** infracciones: siguen usándola `Steps.astro:232` y `Header.astro:322`. La del
encabezado probablemente quiera ser `--elev-pop`. Es cambio visual y es decisión de Sebastián.
| 2026-09-16 | [`2026-09-16-empresas-encabezado`](2026-09-16-empresas-encabezado/ficha.md) — encabezado centrado y portátil en la costura | **Integrada** | Pasa el DoD. Ruta A, con la variante `layout="stacked"` opt-in en `PageHero`; sin cambios sobre lo propuesto |

### Notas de la integración de `2026-09-16-empresas-encabezado`

**Ruta A, como recomendaba la ficha.** `PageHero` gana una prop `layout` con dos valores: `split`
—lo que había, y el valor por omisión— y `stacked`. Elegí una prop y no una clase suelta porque la
variante cambia tres cosas a la vez (el recorte de la banda, su relleno inferior y la composición
del `inner`), y así queda un único interruptor con su docblock en vez de tres reglas que alguien
pueda separar. El aviso sobre `.inner.split` estaba bien visto y se respetó: en `stacked` esa clase
no se pone, en vez de intentar ganarle por especificidad.

**El reparto del CSS.** Lo que toca elementos de dentro del componente —`.page-hero`, `.inner`,
`.copy`, `.actions`, `.aside`— vive en `PageHero`; lo que toca elementos de la página —`--montaje`
en `main` y el `padding-top` de `.cases`— vive en `empresas.astro`. Escrito al revés no habría
aplicado: con `scopedStyleStrategy: 'class'` una regla de la página no alcanza a un elemento del
componente hijo, que es exactamente la trampa que documentó el addendum de la 404.

**Un añadido mío:** `var(--montaje, 0px)` en vez de `var(--montaje)`. Si algún día otra página usa
`stacked` sin declarar el valor, el saliente es cero y queda «una columna centrada» — una
degradación sensata en lugar de un `calc()` inválido que rompe el margen.

**Verificado en el navegador sobre el build, en ocho anchos** (360, 390, 430, 760, 899, 900, 1280,
1440): desborde horizontal **0** en los ocho, el saliente es exactamente `--montaje` en todos, y el
aire hasta «Para qué lo usan» es constante. El montaje representa entre el **41 % y el 53 %** del
portátil bajo 900 px y **49,5 %** por encima, que es lo que la ficha declara y por la razón que
declara: el portátil es fluido y su alto sale de su ancho.

**Los cuatro puntos de §9, comprobados.** (1) Quitar el recorte no afecta a nadie más: la variante
es opt-in y `/como-funciona`, `/confianza` y la 404 conservan `overflow: hidden`. (2) Esas tres
páginas quedan idénticas —mismas clases, `padding-bottom: 96px`, `text-align: start`, banda de
322 px—. (3) La banda se acorta exactamente el montaje; `flow-root` era necesario y se conservó con
su explicación. (4) El foco dentro del encabezado sigue siendo los dos botones y nada más: el
portátil va `aria-hidden="true"` y tiene cero elementos enfocables.

**Una diferencia menor con las medidas de la ficha,** que no cambia nada y anoto por higiene: mis
altos de banda salen 515/518/543/516/563 px donde la ficha da 520/528/540/488/561. Coinciden salvo
en 760, donde hay 28 px de diferencia. Los invariantes que importan —desborde cero, saliente exacto,
aire constante— se cumplen en los dos casos, así que lo atribuyo al entorno de medición y no lo
persigo.

**Lo de móvil que la ficha dejó abierto** —los dos botones centrados y apilados con anchos distintos
porque el texto es de distinto largo— se ve bien y queda como está. Es decisión de diseño; si se
quiere igualarlos, se pide.
| 2026-09-15 | [`2026-09-15-404`](2026-09-15-404/ficha.md) — página 404 | **Integrada** | Pasa el DoD sin cambios visuales. Trasladada tal cual a `src/pages/404.astro` |
| 2026-09-15 | [`2026-09-15-404` · addendum](2026-09-15-404/addendum-canto.md) — el canto de la banda contra el pie | **Integrada con cambios** | El diagnóstico es correcto y el filete entra, pero la regla propuesta no rendía lo que muestra la evidencia: hizo falta `background: var(--tinta)` en `main` |

### Notas de la integración del addendum `2026-09-15-404`

**El diagnóstico es correcto y lo confirmé entero.** Cabecera 0→109, banda 109→459,76, pie
459,76→1025,5, las tres `rgb(11,19,32)`: la 404 es efectivamente la única página sin superficie de
papel salvo la franja de anuncio. `main` y `.page-hero` comparten límites, el `overflow: hidden` de
la banda es lo que corta las cuñas, y las cuatro decisiones de §3 se sostienen una por una:
`Header.astro:208` y `Footer.astro:120` usan literalmente `rgba(237, 242, 239, 0.1)`, y el Design
System §2.2 dice explícitamente que los separadores decorativos de 0.06–0.14 **no** usan
`--line-on-tinta`. El razonamiento de `scopedStyleStrategy: 'class'` también: la regla de la página
alcanza a `main` y no alcanzaría a `.page-hero`.

**Pero la línea propuesta no produce lo que muestra `canto-con.png`.** `main` es transparente por
omisión y detrás está el `body`, que es `--papel`. El borde se pinta en el canto de `main`, **fuera**
de la caja de fondo de la banda, así que el alfa 0.1 no compone contra tinta sino contra papel.
Medido sobre el build, con el borde forzado a rojo puro para confirmar que esa fila era el borde y
no otra cosa: salía **`rgb(245,245,241)`**, un filete crema a **17,03:1** contra la tinta — una regla
dura de lado a lado de la página, no un separador. La evidencia de la entrega muestra `(33,42,52)`,
que es el valor correcto compuesto sobre tinta; el render del addendum se hizo en un contexto donde
detrás del borde ya había tinta.

**Corregido añadiendo una declaración**, no cambiando el enfoque: `background: var(--tinta)` en la
misma regla de `main`. Con el fondo propio, el borde compone contra tinta y da **`rgb(34,42,53)`**,
que coincide con la evidencia dentro del redondeo y con el valor esperado `(34,41,53)`. Contraste
contra la tinta: **1,29:1** — separador decorativo, que es lo que se buscaba. El fondo **no es
decorativo y no se puede quitar**; queda dicho en el comentario del código, con la medición, para que
nadie lo lea como una línea sobrante.

Sin efectos fuera de la página: cada ruta tiene su propia clase de alcance y la regla sólo aparece
en `404.html`. La página sigue en cero bytes de JavaScript y el sitemap en diez URL.

**`Claude outputs/`** pasa al `.gitignore`, con la razón anotada ahí mismo.

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

### Notas de la integración de las dos entregas del blog

**El diagnóstico es correcto y lo verifiqué.** Los dos «bloques de imagen» del artículo eran el
mismo archivo puesto dos veces, y ese archivo es una lámina de cuñas sobre tinta — papel tapiz, que
el Design System §6 prohíbe con esas palabras. No faltaban imágenes: sobraban dos marcadores.

**El listado va tal cual.** Índice de filas con filete, fecha tabular en columna propia, titular con
el peso. Medido: a 1280 la bajada queda alineada con el titular (x=349) y no cae en la columna de la
fecha (x=141) — la colocación explícita que avisaban era necesaria de verdad. Desborde 0 a 390 y
1280, y no queda ninguna `.card` ni `.grid`.

**El artículo va con la estructura propuesta** —portada arriba, y categoría, fecha, titular y bajada
debajo sobre papel— y con los dos tipos, `cifra` y `rango`. Verifiqué los dos con un artículo
temporal que ya borré.

**Dos cambios sobre lo entregado, los dos con medición detrás:**

1. **El dibujo pasa de SVG a HTML y CSS.** Un SVG a `width: 100%` escala TODO su contenido: a 390 px
   el lienzo de 760 se dibuja a 0,46, así que la etiqueta, la fecha y la fuente —13 y 14 px en el
   lienzo— se renderizaban a unos **6 px reales**. Está en la captura `articulo-390.png` de la
   propia entrega: esos dos rótulos son manchas. Es el mismo fallo que la auditoría externa
   encontró en los del globo, y no se podía repetir. En HTML los cuerpos son CSS y no escalan: hoy
   miden 13 px a cualquier ancho. De paso desaparece el otro problema, que era de fondo: las `x`
   estaban calculadas para «3,50» y «940,91», y con un número de otro largo la unidad se montaba
   encima. En escritorio el resultado es el de la maqueta —la cifra a 66 px, la unidad donde
   estaba— y lo comprobé contra las capturas.

2. **La fecha de la portada pierde el separador «·».** La maqueta traía `29 · 07 · 2026` y el
   Design System prohíbe expresamente «cadenas unidas con "·" como metadato decorativo». Pasa a
   `29-07-2026`, que además es el formato tabular que la propia entrega eligió para el índice.

**La decisión sobre `coverImage`: se borra.** Es lo que recomendaba la entrega y coincide con el
precedente del proyecto —lo que no se usa se elimina, como `ActivityFeed`—. El campo, el PNG y las
dos ramas condicionales de las plantillas se van enteros.

**La regla queda anotada donde manda:** Design System **§6.1, «La cuña no entra en las portadas»**,
con el porqué y con el error del que nace. El bloque `PENDIENTE DE ASSET` del borrador de la Fed se
reescribió entero para que nadie produzca ese PNG, y en su lugar explica qué poner en el
frontmatter cuando el artículo se cierre.

**Medido:** desborde horizontal **0** a 360, 390 y 1280 en las dos páginas y en los dos tipos de
portada. Cero JavaScript nuevo, cero imágenes, cero tokens nuevos, cero dependencias. El artículo de
ejemplo sigue siendo borrador: el candado de `lib/blog.ts` lo deja fuera del build, así que nada de
esto es público.

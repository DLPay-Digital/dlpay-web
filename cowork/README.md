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
4. **Un color opaco también declara su superficie.** Salió de un segundo error, el 2026-09-17:
   `--verde-deep` no tiene alfa y aun así incumplía AA, porque el DS lo documenta sólo contra
   `--papel` y la pieza iba sobre `--papel-2`. `--papel` y `--papel-2` **no son intercambiables**:
   4,90:1 y 4,44:1. La evidencia se calcula contra el fondo **efectivo** —subiendo por los
   ancestros y componiendo—, no contra el que uno supone.
5. **Si un número del DS no cuadra con la medición, se va a comprobar al build antes de tocar la
   maqueta.** En ese caso el hueco estaba en el sistema y había seis rótulos incumpliendo en
   producción; ajustar la maqueta lo habría tapado (`2026-09-17-como-funciona/ficha.md` §4).
6. **Si una pieza dice algo con la posición, tiene que decirlo también con texto.** Un carril, una
   columna o un lado del eje son información que sólo existe para quien mira. `display:none` sobre
   la etiqueta equivalente no la esconde: la borra del árbol de accesibilidad. Se oculta
   visualmente y se deja presente (`2026-09-17-como-funciona/ficha.md` §13.1).
7. **Toda entrega pasa por `design:accessibility-review` antes de darse por cerrada**, y la ficha
   lleva el resultado, incluidos los criterios que pasan limpios. Lo que no se pueda medir en este
   entorno se marca como no medido, no como correcto.
8. **Un valor candidato se evalúa sustituyéndolo en el build, no en una lámina hecha a mano.**
   Salió del tercer error, el 2026-09-17: medí bien el estado actual —porque lo saqué del build— y
   mal el valor propuesto, porque lo calculé sobre una muestra donde el fondo lo había escrito yo,
   y lo escribí con `--verde` en vez del `rgba(11,122,84,.1)` que dice el CSS. Corolario de la
   regla 3: **mirar una captura con una cifra mal escrita no detecta la cifra mal escrita.** Una
   captura verifica una forma, nunca un número.
9. **Los barridos se hacen por criterio, no por color.** Mi auditoría de contraste filtraba por
   `--verde-deep`, y por eso se le escaparon tres rótulos que fallaban en otro color. Se recorren
   **todos** los nodos de texto y se compara cada uno contra su piso.
10. **No se reporta un fallo visto en una captura sin medirlo antes.** Las cuñas salían como puntos
    al recortar la sección: el recorte desplaza el elemento a la vista, dispara el
    `IntersectionObserver` y fotografía el milisegundo cero de M3. Con movimiento por scroll, la
    captura recorre la página y espera antes de disparar.
11. **Las dependencias de la maqueta también caducan.** Una vista autónoma enlaza `tokens.css`; si
    la copia del entorno de medición es de otro día, se está midiendo contra un token que ya no
    existe. Pasó el 2026-09-17 con `--verde-deep`: la copia era del día 15 y devolvía 4,90 donde
    debía dar 5,44. Antes de medir se re-sincronizan las dependencias y **se comprueba un valor
    conocido** para saber que la copia es la buena.
12. **Toda sustitución de texto en un archivo lleva `assert`.** Un `replace` que no encuentra su
    ancla no falla: no hace nada, y uno se queda mirando una maqueta sin estilos buscándole un
    problema de diseño. Ocurrió dos veces —las cuñas de `/como-funciona` y el CSS del eje— y las dos
    se habrían evitado con una línea.
13. **Un andamio no aproxima el objeto que sustituye.** Un marcador de `<GloboRotativo />` en una
    maqueta no mide lo que mide el globo: el 2026-09-17 el relleno era mucho más bajo y la ficha
    afirmó que la banda bajaba de 1.060 a 941 px cuando en el build **sube a 1.247**. Ninguna
    medida de geometría de página —altos, densidades, porcentajes— sale de una vista con andamios:
    sale del build, o no se da.
14. **La regla que las engloba: si el número describe el estado PROPUESTO, se mide contra el build.**
    Tres errores en dos entregas y los tres iguales — el chip pintado a mano, la copia vieja de
    `tokens.css` y el andamio del globo. Las tres veces la cifra del estado actual estaba bien,
    porque salía del build, y la del propuesto mal, porque salía de algo que había construido yo.
    **Medir contra material propio no es medir: es comprobar que uno es consistente consigo mismo.**
15. **Una afirmación y su desmentido no caben en la misma sección.** En la misma §6 escribí que
    `/empresas` «no declara el límite en ninguna parte» y, cuatro líneas después, cité la frase de
    `business.ts` que sí lo declara. Antes de dar por buena una afirmación absoluta —«ninguno»,
    «nunca», «en ninguna parte»— se relee el párrafo siguiente.
16. **La prueba sin texto: antes de dibujar, qué dice la figura si le quitas los rótulos.**
    Aportada por el agente de Claude Code el 2026-09-17 y es de las buenas. El globo **falla**: sin
    rótulos, ocho arcos saliendo de Chile dicen «entregamos en ocho países», que es justo lo que la
    regla dura de `CLAUDE.md` §1 prohíbe sugerir. El carril de `/como-funciona` **pasa**: sin texto
    siguen siendo dos columnas y una frontera. El eje de alcance **pasa**: una línea que se
    interrumpe. Es barata y detecta el error que sale caro — una figura que afirma por su cuenta.
    Su corolario: si la figura sólo funciona con los rótulos puestos, es una lista con adornos.
17. **«Misma gramática que X» obliga a medir X, no la copia de X.** Cuarto caso del patrón, el
    2026-09-17: la ficha de J7 decía que la FAQ reutilizaba `Faq.astro` y daba 73 px de objetivo
    táctil, medidos sobre una maqueta con `padding: var(--s-5)` cuando el componente real usa
    `--s-4`: **56 px**. Si la vista autónoma no puede importar el componente, la ficha da las
    medidas del componente o no da ninguna.
18. **Una cifra correcta con la forma equivocada induce una conclusión falsa.** El 2026-09-17
    reporté las listas sin `role` por página —«11 en la Home, 8 en `/como-funciona`, 9 en
    `/empresas`»—. Las tres cifras eran correctas y **no son sumables**: la cabecera y el pie
    repiten sus listas en las diez páginas. El agente sumó, escribió 28, midió y encontró **84
    instancias**. El número que sirve no era ninguno de los dos: son **15 orígenes distintos en
    `src/`**, y tres de ellos explican 70 instancias. Antes de dar un recuento hay que decir
    **de qué** es el recuento —instancias renderizadas o sitios que hay que tocar— y si se puede
    sumar.
19. **Un puerto ocupado no da error: da la respuesta de otro.** Aportada por el agente de Claude
    Code el 2026-09-17, y es la tercera forma distinta de que la herramienta de medición mienta,
    después del servidor de desarrollo que envejece y de las maquetas con andamio. La suya es la
    peor de las tres porque el proceso viejo **era suyo**: un `http.server` de un turno anterior
    seguía tomando el puerto y servía un `dist/` que ya ni existía, así que la medición daba 84
    listas sin `role` después de haberlas corregido las 18. Estuvo a punto de ir a buscar el fallo
    al código.
    **Cómo se evita, y así lo hago desde ahora:** el servidor de medición se levanta en un
    **puerto efímero** que elige el sistema, nunca en uno fijo; y cuando el número sorprende, lo
    primero es **contrastar el archivo del `dist/` contra lo que devuelve el navegador**. Si no
    coinciden, el fallo está en la tubería, no en el código.
20. **Ninguna cifra se escribe sin haberla calculado.** «Un 4 % de luminancia» no salió de ningún
    cálculo: la caída real era 13,3 % en luminancia relativa y 6,3 % en L\*. Una cifra inventada
    en una ficha vale menos que no poner ninguna.

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
| 2026-09-17 | [`2026-09-17-gramatica-de-las-figuras`](2026-09-17-gramatica-de-las-figuras/gramatica.md) — el vocabulario de las cinco familias de figura, medido, y sección candidata para el DS §6.2 | **En revisión** | — |
| 2026-09-17 | [`2026-09-17-empresas-j7`](2026-09-17-empresas-j7/ficha.md) — J7: la columna que faltaba y la FAQ propia | **Integrada** | Las dos piezas. `Faq.astro` pasa a props en vez de duplicarse, y las preguntas viven en `business.ts` |
| 2026-09-17 | [`2026-09-17-eje-de-remesas`](2026-09-17-eje-de-remesas/ficha.md) — J5 y J6: el tramo que sí hacemos | **Integrada con cambios** | Las tres piezas. El eje sale como componente y la salvedad baja de 66ch a 47ch |
| 2026-09-17 | [`2026-09-17-como-funciona`](2026-09-17-como-funciona/ficha.md) — J2 y J3: los seis pasos en dos carriles | **Integrada** | Token, pieza y lote B. Un número de la ficha no cuadró y se corrigió la nota |
| 2026-09-17 | [`2026-09-17-confianza`](2026-09-17-confianza/ficha.md) — J1: la página de confianza gana su pieza | **Integrada** | La figura, la mención institucional y el lote B de J4. Las tres fases salen a `content/trust.ts` |
| 2026-09-17 | [`2026-09-17-j4-medida-y-objetivos`](2026-09-17-j4-medida-y-objetivos/ficha.md) — J4: la medida de lectura y los objetivos táctiles | **Integrada (lote A)** | Las 9 declaraciones, los 2 objetivos y el atributo. Las 7 de lote B viajan con el rediseño |
| 2026-09-17 | [`2026-09-17-estudio-nivel-2`](2026-09-17-estudio-nivel-2/estudio.md) — estudio del sitio y plan para subir de nivel | **Registrado** | Documento de análisis, no una entrega a trasladar. Origina la J4 |
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

### Notas de la integración de `2026-09-17-j4-medida-y-objetivos` (lote A)

**El hallazgo de fondo es correcto y lo medí por mi cuenta antes de tocar nada**, porque todo lo
demás cuelga de ese número. Con la fuente real del proyecto: el glifo cero —que es lo que vale
`1ch`— mide **9,07 px** a 16 px, y el carácter medio de un texto en español del propio sitio mide
**6,64 px**. Factor **1,367**, y el tope de 65 caracteres sale en **47,6ch**. La ficha da 1,38 y
47ch; la diferencia es la muestra de texto usada y no cambia la conclusión.

La evidencia del `.scope-box` también se sostiene: declara 66ch, mide **598 px** en pantalla y su
primera línea lleva **101 caracteres** contados con `Range.getClientRects()` (la ficha dice 113;
depende del párrafo y del ancho, y en los dos casos está muy por encima del 65–70 que fija el
Design System §3.1).

**Lote A aplicado entero:** las 9 declaraciones a 47ch, los dos objetivos táctiles y el atributo.
Verificado después del cambio, otra vez con `Range` y sobre el servidor al día: los párrafos caen
ahora entre **59 y 70 caracteres** —antes iban de 75 a 99— y el `max-width` resuelve a **426,1 px**,
que es exactamente 47ch. Ningún `max-width` de texto corrido queda por encima de 47ch salvo los
**7 del lote B**, que son justo los de `como-funciona.astro` y `confianza.astro`: el reparto de la
ficha cuadra.

**Los dos objetivos táctiles miden ahora 44,0 px** (antes 17,5 y 31,0, idénticos en los cuatro
anchos que comprobé). Se resolvieron como los del pie: `inline-flex` más `min-height`, porque sobre
un enlace que se dimensiona por su línea de texto el `min-height` solo no hace nada.

**Dos precisiones sobre lo pedido:**

1. **El `<svg class="wedge">` ya estaba oculto para tecnología asistiva.** Vive en
   `MacbookMockup.astro` y su raíz es `<figure class="mac" aria-hidden="true">`, que lo cubre por
   herencia. No había defecto de accesibilidad: añadir el atributo es consistencia, no arreglo, y
   así queda dicho. Los otros SVG «sin `aria-hidden`» del sitio son los isotipos de cabecera y pie,
   que llevan `role="img"` a propósito porque sí significan algo.
2. **El punto 5 ya estaba hecho, y con más detalle del pedido.** ADR-0007, 0008 y 0009 pasaron a
   **Aceptada el 2026-09-15** (commit `9ae2aba`). Y ADR-0007 no lista cuatro colores del globo:
   lista **siete**, con nombre semántico, hex y uso, más un apartado que explica su relación con
   ADR-0001. Comprobé contra el componente que los siete se usan y que **ninguno** está en
   `tokens.css`, que es justo lo que el ADR declara.

**El factor queda escrito en el Design System §3.1**, pegado a la regla de los 65–70 caracteres, con
los tres números, la equivalencia `65 caracteres = 47ch` y la condición de recalcularlo si cambia la
tipografía — con el porqué de no crear un token `--medida`, que es el argumento de la ficha y es
bueno: un token escondería la dependencia y el número seguiría ahí, equivocado, el día que cambie la
fuente.

### Notas de la integración de `2026-09-17-confianza`

**El diagnóstico se sostiene:** una página que se llama «Confianza que se comprueba» explicaba su
mecanismo sólo en prosa. La línea de tiempo de **tenencia** —no de pasos— es el acierto de la
entrega: el eje deja de ser «qué ocurre» y pasa a ser «de quién es la cuenta donde está la plata»,
que es exactamente lo que la página necesita mostrar en vez de afirmar.

**Las tres reglas, respetadas y comprobadas:**

1. **HTML y no SVG.** Comparto el argumento y ya lo habíamos pagado dos veces: los rótulos del globo
   y los de la portada del blog. Verificado en el render: a 390 px las tres fases apilan, el
   corchete se convierte en el canto izquierdo del bloque y **todo el texto se lee a su tamaño
   real**. La figura no lleva `aria-hidden` ni `aria-label` —el texto es texto— y lo único oculto
   son las tres barras, que sí son decorativas. La regla general queda escrita en el componente.
2. **La palabra retirada no aparece**, ni en el copy ni en el código: comprobado con un grep sobre
   `src/` entero y sobre el HTML construido. Las clases van en inglés como manda ADR-0003.
3. **La mención institucional se importa.** `institutionalStatement` y el `relationship` de
   FinteChile salen de `lib/config/alliances.ts` sin reescribirse. Aquí me equivoqué en el primer
   intento —escribí «Socio de FinteChile» a mano, que es justo lo que la entrega prohíbe— y lo
   corregí antes de construir. De paso queda colgada del candado `verified`: si la alianza deja de
   estar verificada, la frase desaparece sola.

**Acepté la sugerencia de la ficha:** las tres fases salen a `content/trust.ts` junto a
`mechanisms`, con su propio tipo `Phase`. Son datos, no maquetación, y el día que cambie el banco o
el recorrido se toca un solo sitio. El marcador de Compliance de la mención del banco viaja con el
dato, como en `mechanisms`.

**Lote B de J4, la parte de esta página:** las cuatro declaraciones a 47ch. Quedan sólo las tres de
`como-funciona.astro`, que van con su entrega.

**Medido:** desborde horizontal **0** a 390 y 1280. Contrastes recalculados, los cuatro coinciden
al segundo decimal con la ficha: `--ink` 16,00:1 · `--ink-mute` 5,50:1 · `--verde-deep` **4,90:1**,
que es el que llevan la barra, el corchete y «Lo tenemos nosotros». Ningún verde de marca sobre
claro — sobre papel daría 2,02:1 y la barra carga significado (DS §2.4). Cero componentes nuevos,
cero tokens nuevos, cero JavaScript nuevo, cero imágenes, cero movimiento nuevo.

### Notas de la integración de `2026-09-17-como-funciona`

**El token: cinco de seis números coinciden, el sexto no.** Recalculé las seis razones componiendo
capa a capa. Coinciden exactamente `#0B7A54` sobre papel (4,90), sobre papel-2 (**4,44**) y sobre el
chip (**3,92**), y `#0A7250` sobre papel (**5,44**) y sobre papel-2 (**4,93**). Hasta el chip
compuesto sale idéntico: `rgb(214,223,213)`.

**El sexto no.** La ficha afirma que `#0A7250` sobre el chip da **4,59** y **da 4,31** —4,35 si el
literal `rgba(11,122,84,.1)` no se toca, que es lo que ocurre, porque es un valor escrito a mano y
no el token—. Sigue **por debajo de AA**. Acepté el token igual, y conviene decir por qué: el caso
del chip **desaparece con esta misma entrega**, porque la pieza retira las pastillas `.who`. De los
otros dos consumidores del literal, `IconBadge` lleva un icono dentro y el cotizador lo usa como
anillo de foco: los dos son gráficos, con piso de 3:1. Así que el token arregla todo lo que queda
en pie, pero **no por la razón que daba la ficha**. La nota de límite quedó escrita en el DS §2.4
para que nadie vuelva a poner texto verde sobre un chip verde.

**Otra medición que no cuadra:** la ficha dice que la diferencia con `#0B7A54` es «un 4 % de
luminancia». La luminancia relativa cae un **13,3 %** y la claridad perceptual (L\*) un **6,3 %**.
Ninguna de las dos da 4. El cambio sigue siendo pequeño y la conclusión no se mueve, pero el número
no es ése.

**Un fallo que la ficha no listó:** las pastillas `.who.you` daban **4,32:1** (`--ink-mute` sobre
`rgba(11,19,32,.07)` encima de papel-2), también bajo AA. Eran seis rótulos incumpliendo, no tres
más tres: nueve en total. Los seis de `/como-funciona` se van con la pieza y los tres de la Home
los arregla el token.

**La pieza va tal cual, con un cambio de implementación.** Las cuñas de traspaso **no se listan a
mano**: se calculan comparando el `who` de cada paso con el del anterior. Da exactamente los pasos
03, 04 y 05 —verificado en el build—, y si mañana cambia el reparto en `process.ts` las cuñas se
mueven solas en vez de quedarse donde estaban. La colocación en grid sí va explícita, como pedía la
ficha y por la razón que da.

**Los dos puntos de accesibilidad, respetados y comprobados:** `.who` está en el DOM en los tres
anchos y **nunca** con `display:none` —oculto-pero-presente en escritorio—, y el `<ol>` lleva
`role="list"`. El orden del DOM coincide con el orden visual (1 a 6) también en dos columnas.

**Medido sobre el build:** desborde horizontal **0** a 390, 900 y 1280 · seis pasos · tres cuñas,
las tres con `data-draw` · ocultas bajo 900 px y visibles encima · el eje sólo en escritorio · la
banda del diagrama ya no existe. `FlowDiagram.astro` eliminado en el mismo commit, sin referencias
huérfanas.

**Lote B cerrado:** las tres declaraciones a 47ch. Ya no queda ningún `max-width` de texto corrido
por encima de 47ch en todo `src/`.

**Los dos hallazgos que exceden la entrega quedan sin tocar,** como pedías: las 41 listas sin `role`
y el `.sr-only` definido cuatro veces con dos implementaciones. Los dos son reales y los dejo
anotados acá para no perderlos.

### Notas de la integración de `2026-09-17-eje-de-remesas`

**El hallazgo de fondo es correcto y lo reproduje entero.** Sobre el build, a 1280: la banda del
globo en `y=977` con **1.060 px** (13,4 % de la página), la FAQ que nombra el límite al **88,8 %** y
**plegada**, y los dos botones a 16,6 % — con `auth/register` repetido desde el **10,3 %**, unos 500
px más arriba, y `/#cotizador` mandando hacia atrás. Todo coincide. El argumento de que el dibujo
hace la afirmación más grande y el texto que lo acota está 300 px por encima se sostiene.

**Las tres cosas que pediste:**

1 · **`/empresas` sí tenía el hueco, con un matiz.** Comprobado sobre el `main` del build:
«billetera», «cuenta bancaria», «moneda local» y «no depositamos» daban **cero**. Pero la página no
estaba muda: el primer caso de uso lleva «**Si tu proveedor sólo recibe por banco, conversémoslo
antes**», que es una salvedad real aunque indirecta, y «sin abrir una cuenta en el extranjero»
aparece en tesorería. Así que «no declara el límite **en ninguna parte**» está un punto pasado de
rosca; lo exacto es que **nunca lo declara de forma explícita**, y eso basta para justificar la
pieza en la página cuyo lector es el más propenso a suponer una transferencia bancaria.

2 · **No colisiona con la figura de `/confianza`, y comparto tu razón con un argumento más.** Aquella
responde *quién tiene mi dinero en cada momento* con tres lugares discretos; ésta responde *hasta
dónde llega el servicio* con una línea continua que cambia de dueño en una costura. Y el verde
significa **lo mismo en las dos**: el tramo que es nuestro. Que compartan «banco» y «billetera» como
extremos no es repetición, es que una empieza donde la otra termina. Si el verde significara cosas
distintas en cada una, entonces sí habría problema.

3 · **Sí, va como componente.** `EjeDeAlcance.astro`, con `milestones` opcional —omitirlo deja sólo
el tramo del cliente, que es el caso de `/como-funciona`— y la salvedad por `slot`, porque lleva
`<strong>`. Tres consumidores dejan atrás el Principio 5 de sobra, pero la razón de peso es otra:
**no es decoración, es la regla dura de §1 dibujada**. Tres copias de una figura que afirma algo es
peor que tres copias de un botón: si una deriva, el sitio deja de coincidir consigo mismo sobre
hasta dónde llega el servicio. Los literales viajan a `content/scope.ts` por lo mismo.

**Una medición tuya que no cuadra, y es del mismo tipo que la de `tokens.css`.** La ficha §7 dice
que la banda baja de 1.060 a **941 px** a 1280. Medida sobre el build real, **sube a 1.247** — y a
390, de 803 a 1.175. La diferencia es que tu maqueta tiene un `.globo-hueco` de andamio donde el
sitio tiene el globo de verdad, que es mucho más alto. **Es otra dependencia de la maqueta que
caduca**, igual que la copia vieja de los tokens.

Lo digo porque tumba la premisa de densidad de J5: la banda **no adelgaza, engorda 187 px**. La
pieza entra igual, y entra por la razón que tú misma pusiste primero — que el dibujo y el texto
hablaban de cosas distintas—. Esa no depende del alto. Y los dos botones se van por no aportar, que
también se sostiene solo.

**Un cambio sobre la maqueta:** `.suyo.solo .salvedad` estaba en `max-width: 66ch`, que son unos 91
caracteres reales y es justo lo que cerramos ayer con el lote B. Baja a **47ch**. Cuesta que en la
variante suelta el párrafo quede estrecho bajo tres columnas anchas; la medida de lectura gana.

**Medido tras integrar,** con barrido completo de nodos de texto y fondo efectivo compuesto por
ancestros, en las tres páginas y a 390 y 1280: **269 nodos, cero incumplimientos**. Desborde
horizontal 0 en las seis combinaciones. Una sola cuña por figura, con `data-draw` y `aria-hidden`.
Las dos listas con `role="list"`. Desvío de la costura **0,0 px** a 1280 en la Home y en `/empresas`
—en la variante suelta la cuña arranca en el borde, así que ahí esa medida no aplica—.

**`GloboRotativo.astro` no se tocó: cero líneas.**

### Notas de la integración de `2026-09-17-empresas-j7`

**Que el onboarding no se dibuje es la mejor decisión de la entrega.** Confirmé el dato y el matiz:
`onboarding` es un `string[]` de cuatro frases, sin `who` ni ninguna otra estructura. Deducir el
reparto de los verbos habría sido fabricar el dato para que encajara con el dibujo, que es
exactamente el error del diagrama de propagación. Aplicar la prueba sin texto y **aceptar que la
respuesta era «no dibujes»** cuesta más que dibujar.

**Las tres decisiones que dejaste abiertas, resueltas:**

1 · **`Faq.astro` pasa a props, no a un componente nuevo.** Tu argumento es el correcto: duplicar el
acordeón es barato, duplicar el criterio de qué es una objeción real no lo es. Añado una condición:
`items` y `title` van **obligatorias, sin valor por omisión**. Un `<Faq />` que cayera de vuelta al
contenido de la Home publicaría las preguntas equivocadas en silencio, y ése es justo el modo de
fallo que ya nos costó dos veces.

2 · **Las cuatro preguntas y la lista viven en `content/business.ts`.** De acuerdo sin reservas: son
contenido.

3 · **`.onboarding` con `role="list"`,** más la `.check` nueva.

**El marcador de D6 viaja y está comprobado que no se pierde:** vive como comentario junto a la
respuesta en `business.ts`, y verifiqué que **no llega al HTML construido**. Tu lectura de mi aviso
era la correcta — la pregunta toca condiciones comerciales, así que es §3 y no sólo visto bueno de
Sebastián—, y la respuesta sin cifra admite la cifra sin reescribirse.

**El fallo de alternancia era mío y va corregido en este mismo commit.** `scope` pasa a `--papel-2`.
La secuencia queda tinta · papel · papel-2 · papel · papel-2 · papel · tinta, verificada sobre el
build leyendo el fondo computado de las siete secciones. No lo separé en otro commit porque sin él
la sección nueva llegaba a una página con el fallo puesto.

**Una medición tuya que no reproduje, y no es error tuyo:** das 73 px de alto para los `<summary>` y
mido **56 a 1280** y 52–73 a 390. La diferencia es que tu maqueta usa `padding: var(--s-5)` y el
`Faq.astro` real usa `--s-4`. Al reutilizar el componente manda el componente. Los cuatro siguen
por encima del piso de 44, así que no cambia nada — pero es otra forma de la misma trampa: **la
maqueta y el componente no son el mismo objeto**.

**Medido tras integrar,** a 390 y 1280: **83 nodos de texto, cero incumplimientos** de contraste con
fondo efectivo compuesto. Desborde 0. Cuatro preguntas, ninguna abierta por omisión, cero elementos
interactivos más allá de los `<summary>` nativos. `align-content: start` en `.onboarding` hizo falta
de verdad: con la columna izquierda ahora más alta, sin él la rejilla repartía el sobrante entre las
cuatro filas.
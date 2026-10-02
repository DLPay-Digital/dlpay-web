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

### 3.a Cómo se nombran los archivos de una entrega  ·  *desde el 2026-09-28*

**Todo archivo que Cowork deja en `Claude outputs/` lleva por delante el nombre de su entrega.**
`puente4-ficha.md`, no `ficha.md`. Y **los prompts citan el nombre completo del archivo**, nunca
«la ficha» a secas.

El motivo es medido, no estético. `Claude outputs/` es **una carpeta plana compartida por todas las
entregas**: tres piezas del mismo día llamaron `ficha.md` a su ficha, el sistema renombró las
colisiones a `-1`, `-2` y `-3`, y los prompts que decían «lee `ficha.md`» quedaron apuntando a la
ficha de **otra** pieza. Cowork había empezado a organizar cada entrega en una carpeta de su lado y
dejó que los nombres se volvieran genéricos porque allá la carpeta los distinguía; **esa carpeta no
existe en la máquina de Sebastián.**

Y el daño no se queda en el nombre: el primer prompt del cuarto puente citaba el md5
`cd7a23f8…`, que **no corresponde a ningún archivo** de la carpeta. El archivo nunca cambió —su md5
es `c898096e…` desde el principio—, así que la suma no protegía nada. *Una suma de control que
apunta a un nombre ambiguo no es una verificación: es una decoración.*

**Corolario para el agente de Claude Code:** una entrega cuyos archivos no están en el
repositorio **no se integra de memoria**. Se piden. Y al integrarla se copian a
`cowork/<entrega>/` con el nombre con el que llegaron, para que la próxima vez el md5 tenga a qué
referirse.

---

## 3.b Instrucciones permanentes de Sebastián  ·  *escritas el 2026-09-22*

Hasta hoy estas instrucciones vivían **sólo en la conversación**, y una conversación se compacta.
No son reglas de evidencia —ésas están en §4— sino condiciones de encargo: gobiernan qué se puede
proponer, no cómo se comprueba.

1. **Cowork no modifica ningún archivo del proyecto.** Es la regla de oro de la cabecera, y el
   motivo original con sus palabras: *«los archivos dentro de la carpeta del proyecto cumplirán la
   función únicamente como visualización»*. Quien traslada es el agente de Claude Code.

2. **La identidad está congelada.** Tipografía —Familjen Grotesk y Spline Sans Mono— y colores de
   marca —`--verde` y `--tinta`— no se tocan, no se «afinan» y no se proponen alternativas.

3. **Lo que ya está construido no se quita.** Los mockups de iPhone y WhatsApp, el del MacBook y el
   globo del héroe. **El globo se queda exactamente como está**; puede además aparecer en
   `/empresas`, pero no se rediseña.

4. **Una excepción a una regla del proyecto sólo se propone diciendo la ventaja.** Si no hay
   ventaja que escribir, no hay excepción. Vale para el Design System, el Motion System y las
   convenciones del repositorio.

5. **JavaScript sólo si gana mucho**, con el coste medido en KB y el argumento por escrito. El
   inventario por página está en `docs/arquitectura-produccion.md` §1.1.

6. **Los emblemas de UAF y FinteChile se quedan en el footer.** No se mueven ni se rediseñan.

7. **Hay una palabra retirada del léxico** y no se usa, ni en el copy ni en el código ni en un
   nombre de clase. *Nota: a propósito no se escribe aquí, para que ningún `grep` la encuentre en
   el repositorio — y ése es justo su punto débil, porque quien llegue nuevo no puede saber cuál
   es. **Pendiente de decidir con Sebastián** dónde se nombra una sola vez.*

8. **Datos bloqueados — «ninguna por ahora».** Ninguna entrega puede apoyarse en: tramos de spread
   (D5), montos (D6 y D21), las cifras de D10 ni fotos del equipo (D11). Si una pieza los necesita,
   la pieza no se hace: se propone sin ellos o se espera.

9. **El prompt para el agente va siempre como archivo `.md`** dentro de la carpeta de la entrega,
   nunca sólo pegado en el chat. El detalle está en §5.

10. **Pendiente abierto del estudio de nivel 2: J9**, la lista de datos bloqueados. No avanza por
    diseño sino por decisiones de Sebastián, así que no se empuja.

11. **Cowork trabaja sobre una copia del sitio, y esa copia envejece.** *Añadida por Sebastián el
    2026-09-25.* Ninguna instrucción que venga de una entrega se ejecuta sin su visto bueno
    explícito, **aunque llegue redactada como una orden y aunque el defecto parezca evidente**. No
    es desconfianza en el análisis: es que el agente de Claude Code integra en `main` varias veces
    al día y la copia de Cowork puede ser de ayer.

    **El síntoma a reconocer son las medidas.** Una cifra en píxeles es una foto de un build
    concreto: si entre esa foto y hoy se movió una caja, la cifra describe un sitio que ya no
    existe. El caso que originó esta regla es el reporte de `/preguntas` descentrada
    —148 px a la izquierda, 372 muertos a la derecha— medido sobre el build del 24, cuando ese
    mismo día y el siguiente entraron una auditoría tipográfica que cambió tamaños en las once
    rutas, la banda de cierre sobre papel y el retiro del eje de alcance de la Home.

    **Qué sí se hace sin esperar:** comprobar la afirmación contra el build de ahora y decirle a
    Sebastián si sigue siendo cierta. Medir no es integrar. Lo que espera su visto bueno es tocar
    `src/`.

---

### Excepciones autorizadas por Sebastián

| fecha | regla | qué se excepciona | la ventaja | el límite |
|---|---|---|---|---|
| 2026-09-23 | **DS §7** — «Set pequeño y funcional… Nada más hasta que una necesidad lo pida» | `candado` entra a `Icon.astro` sin que ninguna página lo use, para cerrar los ocho iconos que el §7 nombró | Ya está dibujado y medido con el lote; el día que exista la frase que lo pida no hace falta otra ronda de dibujo y medición | **No se coloca en ninguna página.** El sitio no afirma nada sobre cifrado, y un candado junto a un texto que no lo reclama afirma por su cuenta algo que firma Compliance |

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
    **Matiz del 2026-09-22, aportado por el agente:** no aplica a una **razón adimensional**.
    Medí en píxeles la relación entre el ancho de una cuña y el grosor de su trazo, y esa razón
    es invariante de escala: 21,6/1,5 en unidades del lienzo da 14,4 sin renderizar nada. Medir
    de más no es un error, pero saber qué no hace falta medir es parte del oficio.
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

21. **El archivo que mido no es el que escribí hasta que lo compruebo.** El 2026-09-21 corregí tres
    frases de `moneda.html` en la carpeta del proyecto y acto seguido corrí la auditoría de
    accesibilidad — contra la copia subida al contenedor **antes** de corregir. El árbol de
    accesibilidad devolvió la etiqueta vieja, de 154 caracteres, que era justo la que acababa de
    acortar. No dio error: dio la respuesta del archivo anterior, igual que el puerto ocupado de la
    regla 19. **Entre editar y medir va un `md5sum` de los dos lados**, o la medición no vale.

22. **La prueba sin texto no basta cuando la figura tiene un dueño.** La regla 16 pregunta qué
    dice una figura si le quitas los rótulos. El 2026-09-21 la apliqué a una portada con dos
    monedas, una con una T y otra con un `$`, y concluí que pasaba: no había banco, ni cuenta, ni
    moneda local. Faltaba la otra mitad de la pregunta — **qué dice esto EN UNA PÁGINA DE DLPay**.
    Ahí un `$` no es un signo neutro: es nuestro dólar digital, y el bucle afirmaba que cambiamos
    activos tokenizados por él, que es lo que el artículo niega en su palabra 1.497 de 1.736.
    Rechazo del agente de Claude Code, correcto. **A la prueba sin texto se le añade el dominio:
    sin rótulos Y en esta página.**

23. **Citar una regla obliga a leer su cuerpo, no su título.** Cité el DS §6.1 cinco veces entre
    dos fichas y dos prompts, siempre por su título —«la cuña no entra en las portadas»— y siempre
    para decir «no llevo cuña». Su cuerpo dice tres cosas más y las tres excluían mi pieza: «una
    portada de artículo muestra un dato, no un movimiento», el chevron estaba **nombrado** entre lo
    que se rechazó en la portada de la Fed, y lo que sí puede llevar una portada va «**sin punta de
    flecha**». Es la regla 17 —«misma gramática que X» obliga a medir X— aplicada a una regla en
    vez de a un componente.
    **Lo mismo vale para el comentario de un token.** Apoyé toda una decisión de color en que
    `tokens.css` documentaba `--verde-hi` como «líneas del motivo geométrico sobre tinta». Ese uso
    no existía: las siete apariciones en `src/` son `:hover` de un botón. Un comentario no es un
    uso; se comprueba con un `grep` antes de apoyarse en él.

24. **Una cifra medida a un tamaño que redondea no es una cifra exacta.** Publiqué que el travesaño
    de la T daba «0,7041 = 207/294, desvío 0,0000». Había medido a 400 px, donde la tinta redondea
    a enteros que casualmente daban mi objetivo. A 1000 px la misma fuente da 517/735 = 0,70340 y
    el desvío real es 0,00068. La cifra no estaba inventada —esa es la regla 20—: estaba tomada con
    poca resolución y presentada como exacta, que es peor, porque parece verificada.

25. **Cuando la pieza cambia, la ficha se relee entera.** Reescribí la portada de dos monedas a una
    y actualicé las secciones que me parecieron afectadas, saltándome la de accesibilidad: seguía
    dando el nombre accesible de la versión anterior y hablando de «las dos monedas». Quien
    integrara desde la ficha habría publicado el rótulo de una moneda que no está dibujada. Una
    entrega no se parchea por secciones: se vuelve a leer de arriba abajo contra la pieza.

26. **Comprobar que algo no está en el árbol de accesibilidad no es comprobar qué sí está.** Puse
    `aria-hidden="true"` en el `<svg>` de una figura y escribí «igual que `UseCaseFigure`». No era
    igual: allí los rótulos son `<text>` dentro del SVG, y yo acababa de sacarlos a HTML —con
    motivo, para que no escalaran— y con eso los saqué también del alcance del atributo. Un lector
    de pantalla habría leído «pesos, dólar digital» sueltos entre dos párrafos. Mi comprobación
    decía «imágenes en el árbol: 0» y de ahí concluí que estaba oculta: comprobé que lo que oculté
    seguía oculto, no qué quedaba anunciándose. **Cuando muevo un elemento, se mueve también lo que
    lo gobernaba**, y la comprobación es «qué lee un lector de pantalla en esta zona», no «¿sigue
    oculto lo que oculté?».

27. **La maqueta se ve bien en su formato; el defecto aparece en el de destino.** El bloque HTML de
    una figura llevaba dos líneas en blanco, que en una maqueta no significan nada. En Markdown un
    bloque de HTML **termina en la primera línea vacía**: publicado, el artículo habría mostrado
    sólo la primera ficha y habría perdido el tramo, la cuña y la segunda. No da error, el archivo
    fuente se ve bien, y sólo aparece midiendo los trazos del HTML servido. **Si propongo dónde va
    una pieza, las reglas de ese formato son parte de la entrega.**

28. **Una unidad no es su nombre.** `1ch` no es un carácter: es el ancho del glifo **cero**, que en
    Familjen Grotesk mide 9,07 px frente a los 6,64 del carácter medio. Mi medidor dividía el ancho
    de la caja por `measureText('0')` y yo llamaba «caracteres» al resultado — y encima lo comparaba
    con el objetivo de **65–70 caracteres** del DS. **Todas las medidas de lectura que reporté iban
    un 37 % altas**, y el estudio de nivel 3 sacaba la conclusión invertida: daba las legales por
    catastróficas (33 «ch» = 45 caracteres reales) y el artículo del blog por leve (84 «ch» = **112
    caracteres**, un 72 % sobre el techo). Lo peor es que **el DS §3 lo documenta con esas mismas
    palabras**, así que es la regla 23 otra vez: leer el cuerpo, no el titular. Medido después sobre
    el build, el factor real va de 1,315 a 1,395. **Antes de comparar un número con un objetivo, hay
    que comprobar que los dos están en la misma unidad.**

29. **Una captura de página completa de este sitio miente.** `fullPage` no recorre la página, así
    que las entradas del Motion System no se disparan y los bloques de abajo salen en blanco. Yo
    estuve a punto de reportar «la Home está vacía» y el agente de Claude Code estuvo a punto de dar
    por rota una página que estaba bien. Lo encontramos los dos por separado el mismo día, lo que
    quiere decir que volverá a pasar. **Se captura con `reducedMotion: 'reduce'` y una pasada de
    scroll antes del disparo**, y se comprueba contando los elementos con opacidad menor que 1.

    **Matiz del 2026-09-24, y me volvió a pasar.** Al revisar `/precio` ya integrado capturé la
    página y la banda salía en negro: estuve a punto de reportar rota una pieza que funcionaba. El
    fallo era mío: el bucle de scroll iba **sin esperar entre pasos**, en un solo `evaluate`
    síncrono, así que el observador nunca llegó a disparar. **Una pasada de scroll sin espera entre
    pasos no es una pasada de scroll.** Medido en esa misma página: 7 elementos con opacidad menor
    que 1 antes, **1** después de una pasada con 70 ms entre pasos. Por eso el recuento no es un
    adorno de la regla: es lo único que distingue «la página está rota» de «la capturé mal».

33. **Derivar no es medir, aunque la derivación acierte.** Reporté el punteado de `/precio` como
    «2 y 6 px medidos en pantalla»: eran los valores declarados, y les apliqué una suposición —que
    `non-scaling-stroke` congela también el patrón de guiones—. El agente corrigió que en un lienzo
    estirado ×1,5467 saldrían 3,09 y 9,28: eso era el atributo **multiplicado por la escala**.
    **Contando píxeles de la captura a DPR 4, el periodo real es 8,00 —exactamente 2+6—**, así que
    el patrón no se estira y mi suposición era cierta; la suya, no. Da igual: **las dos eran
    derivaciones y las dos iban firmadas como medición.** La regla no es «no leas el atributo», que
    es la mitad: es que **lo único que mide es contar el resultado**. Y el que acertó por suposición
    no acertó mejor, acertó con más suerte.

31. **Citar una frase publicada obliga a leer su envoltorio.** Construí una banda entera sobre una
    frase de `/tarifas` —«no cambia después de que lo aceptas»— y escribí «no estrena claim» porque
    estaba publicada. La busqué con `grep`, saqué la línea y no leí las dos de arriba: la frase vive
    dentro de `<PendingNotice title="Tabla de tarifas: en publicación">`, bajo borde de aviso,
    **empezando por «mientras tanto»**, como parche mientras D5 siga abierta — y ese componente
    existe, dicho en su propia cabecera, «para no publicar nunca un texto inventado ocupando el
    lugar de uno que requiere revisión legal». No era un párrafo que sube a titular: era una
    salvedad provisional que pasa a ser el centro visual de una página. Lo encontró el agente al ir
    a pedir la firma. Es la **regla 23 un nivel más afuera**: no basta el cuerpo de lo que citas,
    hay que leer la caja en la que está. **El componente que la envuelve, el título de esa caja y la
    conjunción con la que empieza son parte de lo que la frase dice.**

32. **Los nombres de clase de una maqueta están pensados para una página vacía; la página real ya
    tiene los suyos.** Mi maqueta llamaba `.rot` a los rótulos. `/precio` **ya usaba `.rot`** para
    los dos rótulos de la figura de las barras, sobre papel — y al integrar heredaron
    `position:absolute` y un gris pensado para tinta. No aparece leyendo el CSS: el agente lo
    encontró **contando los elementos del render**, esperaba tres rótulos y salieron cinco. Es la
    regla 26 otra vez —contar lo que hay, no comprobar lo que no está— aplicada al trasladar. **Una
    entrega debería llevar sus clases con prefijo propio**, o el traslado tiene que contar.

30. **Una línea no llena su columna.** Caracteres por línea **no** es ancho de columna ÷ ancho de
    carácter. Eso es la **capacidad** de la medida; lo que el lector recorre es el **recuento** de
    la línea renderizada, y el corte de palabra deja el borde derecho dentado. Corregí la regla 28
    dividiendo por el ancho medio real —que era la unidad correcta— y **seguí midiendo capacidad
    cuando quería recuento**. Medido sobre el build contando carácter a carácter con `Range` y
    agrupando por `top`: el artículo del blog llena el **82 %** de sus 760 px y las legales el
    **67 %**, así que la brecha entre capacidad y recuento va del **4 % al 18 %** según el texto.
    Las cifras buenas son **38** en las legales antes del cambio (yo escribí 45) y **108** en el
    artículo (yo escribí 112). **Las dos definiciones son legítimas; mezclarlas no.** El defecto no
    es usar una, es comparar un «antes» contado con un «después» calculado, que es justo lo que
    hace hoy el comentario de `Legal.astro`. Se cuenta descartando la última línea de cada párrafo,
    que nunca llena.

34. **Un instrumento roto no avisa: devuelve ceros, y un cero parece un resultado.**
    La primera corrida de la prueba de la intro dijo «0 fotogramas, capa null» en los ocho caminos.
    Leído sin sospecha, eso era «la intro no se ejecuta nunca». No era eso: la sonda llamaba a
    `MutationObserver.observe(document.documentElement)` en `document-start`, donde `documentElement`
    todavía no existe; la excepción abortaba el resto de la sonda en silencio. Antes de creerle un
    cero a un instrumento, hay que probar que el instrumento mide.

35. **Tiempo transcurrido no es aparato lento, y una salvaguarda que los confunde mata lo que
    protege.** Rescatada el 2026-09-28 de una ficha extraviada de la intro de marca, porque la
    versión final la perdió. Cowork había escrito un presupuesto: si `<body>` llegaba después de
    700 ms, no se enseñaba el logo. **La medición lo tumbó.** Con 600 ms de retardo en el CSS el
    telón subía a 651 ms y el presupuesto mataba el logo — pero ahí **nunca hubo riesgo**, porque
    una hoja de estilos pendiente ya bloquea el pintado por su cuenta. El presupuesto medía el
    reloj de pared y creía estar midiendo la capacidad del aparato. La salvaguarda correcta no era
    un plazo sino un **tope absoluto**: cuando la red decide terminar, nada puede aparecer después.
    Antes de poner un umbral de tiempo, hay que preguntarse qué se cree que mide — y si la cosa que
    de verdad importa ya está protegida por otro mecanismo.

36. **El §9 concede la categoría; el catálogo del Motion System especifica el movimiento. «No pide
    excepción» hay que comprobarlo contra los dos.** Del 2026-09-28. Cowork propuso animar la cifra
    del cotizador argumentando —con razón— que el §9 permite «el dato que cambia» y que por tanto
    sólo faltaba aplicarlo. Pero ese movimiento **ya estaba especificado y ya estaba
    implementado**: es el **M2** `settle`, opacidad y 2 px sobre el valor nuevo, 160 ms, y vive en
    `Quoter.astro`. Lo que proponía no aplicaba el M2: lo **sustituía** por un recorrido de 17
    valores intermedios. El §9 es una lista de permisos de seis palabras; el catálogo es la
    especificación. Si el catálogo ya nombra la pieza, lo que se propone no es aplicar: es
    **enmendar**, y entonces sí hace falta pedirlo.

37. **Una entrega que dice «la carcasa tal cual» y cambia uno de sus valores es la deriva más
    difícil de cazar: sólo aparece cuando algún contenido cae justo en el límite.** Del 2026-09-28.
    La maqueta del primer puente topaba el titular en `14ch` y la carcasa se extrajo con ese valor.
    Las tres maquetas siguientes traían `15ch`, sin una línea que lo dijera, y sus tres prompts
    decían «usa `Puente.astro` tal cual». **Dos de los tres titulares miden igual a 14 y a 15ch**,
    así que sus tablas de alturas reprodujeron y la diferencia no existió. El tercero —«Las
    condiciones se acuerdan contigo»— sale en 3 líneas a 14ch y en 2 a 15ch: 35 px de diferencia
    contra una tabla que decía 465. Se resolvió comprobando los cuatro a 14, 15 y 16ch antes de
    tocar nada: **15 no mueve a ninguno de los otros tres y 16 reflowaría el segundo**, así que el
    valor no es «cuanto más ancho mejor». La regla: **quien cambia un valor de una pieza compartida
    lo declara en la entrega**, y quien la integra compara la maqueta con el componente en vez de
    creerle al «tal cual».

38. **Medir cajas en vez de tinta falla de dos maneras distintas, y la segunda es peor.** Del
    2026-09-28, con el cuarto puente. La primera es la caja de un elemento que **no llena** su
    sitio: la celda del riel mide 32 px de holgura donde la tinta mide 45. La segunda es la
    **envolvente de varios trozos de tinta**, que es lo que parece la corrección de la primera y no
    lo es: sus esquinas son puntos donde no pinta nada, porque combinan la *x* de un trozo con la
    *y* de otro. Medida así, la holgura del texto del primer puente daba **15 px** — bajo el piso de
    40 y falsa. El número honesto es **la distancia mínima entre cada rectángulo que de verdad pinta
    y la recta**, uno por uno. Los dos errores los cometimos los dos agentes, en el mismo día y con
    la misma pieza.

---

## 5. Protocolo con el agente de Claude Code

> **Cowork no ejecuta `git` que toque el índice.** *(2026-09-23, afinado el 2026-09-24)*
>
> El shell de Cowork en la carpeta conectada **no puede borrar archivos**, y `git` crea
> `.git/index.lock` en cada orden que **refresca el índice** y lo borra al terminar. Ese borrado
> falla, así que cada `git status` mío deja un lock huérfano y el siguiente `git commit` del agente
> muere con «Unable to create '.git/index.lock': File exists». Comprobado dos veces seguidas.
>
> **El matiz, medido el 2026-09-24:** la regla que escribí era «ningún `git`», y la incumplí al día
> siguiente con un `git show`. No pasó nada, y fui a ver por qué: **las órdenes que sólo leen
> objetos —`show`, `log`, `cat-file`— no toman el lock.** Las que lo toman son las que tocan el
> índice: `status`, `diff`, `add`, `commit`. La regla buena es ésa, no la mía. Una regla más ancha
> de lo necesario se incumple sin consecuencias, y una regla que se incumple sin consecuencias deja
> de ser una regla.
>
> Para leer el estado del repositorio se leen los archivos directamente. Si hace falta saber qué
> cambió, se pregunta al agente.

1. Cowork deja la entrega y la anota en el registro de abajo como `En revisión`.
   **El prompt para el agente va siempre como archivo `.md` dentro de la carpeta de la entrega**
   —`prompt-agente.md`—, nunca sólo pegado en el chat: así queda versionado junto a la pieza que
   describe y el agente lo lee del repositorio en vez de recibirlo de segunda mano.
   Convención del 2026-09-21, a petición de Sebastián.
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
| 2026-09-24 | [`2026-09-24-intro-de-marca`](2026-09-24-intro-de-marca/ficha.md) — micro intro de 830 ms: las dos piezas de la D se unen por la diagonal del isotipo, un destello, y la capa se retira sobre la Home | **En revisión** | La D **ya viene partida en dos subtrazos** dentro del `path` de `Logo.astro`: no hay que inventar el corte. Separarlas cambia el 0,16 % de los píxeles, todo antialias. El marcado lo inyecta el script, así que sin JS no hay intro y la página se ve. Pide enmienda de movimiento y choca con la regla dura 2, el cotizador |
| 2026-09-24 | [`2026-09-24-preguntas-v2`](2026-09-24-preguntas-v2/ficha.md) — `/preguntas` rehecha con **las mismas nueve preguntas**: agrupadas por preocupación en vez de por público, respuestas abiertas, índice pegajoso sin JS y el glosario como pliego | **En revisión** | Sebastián dijo que la primera versión era copiar y pegar, y tenía razón. La estructura sale del contenido: tres de las cinco preocupaciones emparejan una pregunta de persona con una de empresa, una a una |
| 2026-09-24 | [`2026-09-24-comparacion-estructural`](2026-09-24-comparacion-estructural/nota.md) — la comparación de dos recorridos, propuesta 3 de las oportunidades | **Descartada con motivo** | Dos paredes: el §1 prohíbe **sugerir** que somos otra vía al mismo destino, y dibujar dos recorridos en paralelo lo sugiere por su forma; y la versión honesta —que los destinos son distintos— ya la dibuja `EjeDeAlcance`, que es «la regla dura del §1 dibujada». La propuse yo con el aviso ya escrito y sin comprobarlo |
| 2026-09-24 | [`2026-09-24-preguntas-v2`](2026-09-24-preguntas-v2/ficha.md) — `/preguntas` agrupada en cinco preocupaciones, con índice y respuestas abiertas | **Integrada** | La estructura y la decisión de ingeniería, tal cual. El enlace del cierre nace con mensaje prellenado para no engrosar D22 |
| 2026-09-24 | [`2026-09-24-vocabulario-62`](2026-09-24-vocabulario-62/nota-agente.md) — revisión de las nueve marcas del §6.2 juntas, contra su uso real · **con adenda** | **Integrada** (`9af0997`) | Tres hallazgos: la tabla no distingue las dos líneas verdes aunque el cuerpo sí, la sección se contradice sobre cuántos punteados hay, y **la única marca punteada está dibujada con 43 % de ciclo en una pieza y 25 % en la otra** — la segunda es mía. La cuña, en cambio, tiene una sola ortografía en todo el sitio |
| 2026-09-24 | [`2026-09-24-vocabulario-62`](2026-09-24-vocabulario-62/nota-agente.md) — relectura del §6.2 con las nueve marcas juntas | **Integrada con cambios** | Los tres hallazgos son ciertos. Las cifras del tercero no, y el remedio que proponía no habría igualado las dos figuras |
| 2026-09-24 | [`2026-09-24-indice-del-blog`](2026-09-24-indice-del-blog/ficha.md) — la portada de cada artículo, como marca del índice | **Integrada con cambios** | La estructura tal cual. El pictograma sale del componente y no se copia, el verde no se vuelve gris, y el rango toma la precisión del par |
| 2026-09-24 | [`2026-09-24-precio-que-aceptas`](2026-09-24-precio-que-aceptas/ficha.md) — banda sobre tinta en `/precio`: el mercado se mueve, aceptas, y desde ahí tu precio es una recta mientras el gris sigue. **v2 · estrena la sexta familia del §6.2 y una enmienda de movimiento** | **Integrada** (`3dfded3`) | El dibujo y la geometría, literales. Todas mis cifras reproducen. Dos cosas mías corregidas por el agente: la frase que dibujo vive dentro de un `PendingNotice` y yo no leí el envoltorio (**regla 31**), y mi clase `.rot` pisaba una que `/precio` ya tenía (**regla 32**). Él generalizó la marca punteada del §6.2 de «frontera» a «un límite: cruzarlo cambia algo», que es mejor que abrir una fila nueva |
| 2026-09-24 | [`2026-09-24-precio-que-aceptas`](2026-09-24-precio-que-aceptas/ficha.md) — la banda «No cambia después de que lo aceptas» de `/precio` | **Integrada con cambios** | Trazado y geometría literales. Firma de Compliance pedida antes de integrar, por dónde vivía la frase. Una colisión de clases que rompía la otra figura de la página |
| 2026-09-23 | [`2026-09-23-precio`](2026-09-23-precio/ficha.md) — `/precio`: el cobro único. Dos barras del mismo largo y una tabla donde cinco filas dicen «Sin costo» y una dice dónde está el spread. **Copy firmado por Sebastián el 2026-09-23** | **Integrada** (`bcda1fe`) | El dibujo entero. La frase de volumen se importa como constante en vez de teclearse, y la medida pasa a 47ch. De aquí salen las reglas 28 y 29 |
| 2026-09-23 | [`2026-09-23-iconos`](2026-09-23-iconos/ficha.md) — cuatro iconos nuevos y tres listas que dejan de llevar ticks idénticos | **Integrada con cambios** | Los cuatro trazados tal cual y las tres ubicaciones tal cual. El tamaño sube de 19 a 20px: 19 está fuera de la grilla del §7 |
| 2026-09-23 | [`2026-09-23-medida-legales`](2026-09-23-medida-legales/nota-agente.md) — revisión de la medida de las legales, sin propuesta | **Registrada · dos cifras corregidas en los dos sentidos** | Acierta en que mis dos documentos se contradecían, y falla en cuál estaba mal. Su regla 30 es una distinción real |
| 2026-09-23 | [`2026-09-23-preguntas`](2026-09-23-preguntas/ficha.md) — `/preguntas`: las nueve preguntas reunidas desde `content/` sin duplicar texto, más un glosario de ocho términos. **Copy firmado por Sebastián el 2026-09-23** | **Integrada** (`bcda1fe`) | El dibujo entero. Cambió el envoltorio: `id` derivado del título y normalizado sin tildes, los títulos de las páginas de origen, el glosario sale a `content/glossary.ts` y la medida de 66ch pasa a 47ch. De aquí salen las reglas 28 y 29 |
| 2026-09-23 | [`2026-09-23-oportunidades`](2026-09-23-oportunidades/propuesta.md) — seis contenidos que añadir, con `wise.com` como referencia y el filtro de lo que nuestras propias reglas no permiten copiar | **Registrado** | Propuesta de contenido, no una entrega a trasladar |
| 2026-09-22 | [`2026-09-22-estudio-nivel-3`](2026-09-22-estudio-nivel-3/estudio.md) — estudio del sitio entero: medida de lectura, jerarquía, densidad y reparto de figuras, con ocho propuestas ordenadas | **Registrado** | Documento de análisis, no una entrega a trasladar |
| 2026-09-23 | [`2026-09-23-preguntas`](2026-09-23-preguntas/ficha.md) — `/preguntas`: las nueve preguntas reunidas y el glosario | **Integrada con cambios** | La estructura tal cual. Las preguntas se IMPORTAN en vez de copiarse, los títulos son los de las páginas de origen y la medida baja de 66ch a 47ch |
| 2026-09-23 | [`2026-09-23-precio`](2026-09-23-precio/ficha.md) — `/precio`: el cobro único | **Integrada con cambios** | La figura y la tabla tal cual. La frase de volumen se importa de `business.ts` con su marcador, y las medidas bajan de 66ch y 60ch a 47ch y 46ch |
| 2026-09-22 | [`2026-09-22-riel-tokenizado`](2026-09-22-riel-tokenizado/ficha.md) — figura de página: el peso no está tokenizado y el dólar digital sí | **Integrada** (`a0c12f5`) | El dibujo, copiado literalmente. Cambió el envoltorio: el `aria-hidden` pasa a cubrir también las etiquetas, se quitan las líneas en blanco que en Markdown cortaban el bloque, y del copy entra sólo la frase nueva. De aquí salen las reglas 26 y 27 |
| 2026-09-22 | [`2026-09-22-riel-tokenizado`](2026-09-22-riel-tokenizado/ficha.md) — figura de página: el peso, el dólar digital y la tokenización | **Integrada con cambios** | El dibujo tal cual. Cambia el envoltorio: `aria-hidden` cubre también las etiquetas, el copy no duplica lo que el artículo ya dice, y hubo que quitar las líneas en blanco del bloque HTML |
| 2026-09-21 | [`2026-09-21-portada-capa`](2026-09-21-portada-capa/ficha.md) — pictograma de portada para el artículo de tokenizados · cuatro versiones | **Integrada el 2026-09-22 por decisión de Sebastián** | La v2, la de un solo nodo. Entró enmendando el DS §6.1, no esquivándolo. El verde pasa a `--verde` por §6.2. La v1 de dos monedas sigue rechazada por §1 |
| 2026-09-17 | [`2026-09-17-gramatica-de-las-figuras`](2026-09-17-gramatica-de-las-figuras/gramatica.md) — el vocabulario de las familias de figura, medido, y sección candidata para el DS §6.2 | **Integrada** | Es el §6.2 del Design System desde el 2026-09-17. La tabla ha crecido después con el canto dividido, el límite punteado y la línea que deja de moverse |
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

### Notas de la revisión de `2026-09-21-portada-capa`  ·  NO integrada

**Es la entrega mejor medida que ha pasado por acá, y lo digo antes de lo demás.** Comprobé todas
las cifras de la ficha y **coinciden todas, sin excepción**: `ry/rx` 0,6730 contra el 0,6733 del
canto del isotipo (desvío 0,0003), los dos galones a 68,01° e iguales entre sí al centésimo, 24
marcas, `--verde-hi` 10,00:1 y `--on-tinta-mute` 8,18:1 sobre tinta, cero `<text>`, cero rellenos,
cero cuñas, `role="img"` con nombre corto. El `md5` del archivo es el declarado. Nada que corregir
en la ejecución.

**Y no se integra, por §1.** El motivo no está en la ficha: está en los comentarios del propio SVG.

```
<!-- la moneda T: el activo tokenizado. 24 marcas = está hecho de unidades -->
<!-- la moneda $: el dólar digital. Canto liso -->
```

Con eso el pictograma afirma **activo tokenizado ↔ dólar digital, en ambas direcciones**, y el
`$` no es «el dólar» en abstracto: es **nuestro producto**. La figura dice que cambiamos activos
tokenizados por nuestro dólar digital, y eso es justo lo que el artículo niega con sus palabras:
«no participamos en la tokenización de acciones, bonos ni fondos: nuestro servicio es el cambio de
divisas entre pesos chilenos y dólar digital».

La §7.1 de la ficha contiene la admisión —«pero DLPay no transa activos tokenizados»— y la resuelve
diciendo que la categoría y el titular enmarcan la pieza como reportaje. Ese argumento es más débil
de lo que parece, y se puede medir:

- la portada renderiza **antes** del titular (`[slug].astro:57`, sobre `<article>`), así que se ve
  antes de cualquier encuadre;
- la frase que lo niega está en la **palabra 1.497 de 1.736**, al 86 % del artículo.
  *(Corregido el 2026-09-21: escribí 1.739. El cuerpo tiene 1.736 palabras una vez quitados
  el frontmatter y los comentarios HTML. La cifra de Cowork era la correcta y la mía
  contaba tres palabras de un comentario. El 1.497 y el 86 % no cambian.)*

**Es el mismo fallo que el globo, y más estrecho.** Allí ocho arcos saliendo de Chile decían
«entregamos en ocho países» y hubo que poner el eje de alcance al lado para desambiguarlo. Aquí no
es geografía: es **qué transamos**, que es el punto que Sebastián marcó como condición de parada al
encargar este artículo.

La prueba sin texto (regla 16) no salva la pieza: no hay rótulos que quitar, así que lo que la
figura afirma por su cuenta **es todo lo que afirma**.

**El galón sobra en la discusión.** No hace falta resolver si un galón es una cuña (§7.2): el
problema no es la marca de dirección, es **qué dos cosas** une el bucle.

### Lo que sí la desbloquearía, sin rehacer el dibujo

Tres caminos, y ninguno es mío:

1. **Cambiar qué es la moneda de la izquierda.** Si en vez del activo tokenizado fuera **el peso
   chileno**, el bucle dibuja CLP ↔ dólar digital, que es exactamente nuestro servicio y es §1
   limpio. Pierde relación con el tema del artículo, así que serviría como portada de otro.
2. **Quitar el bucle y dejar las dos monedas.** Describe el asunto —un activo tokenizado y el
   dólar— sin afirmar que alguien los intercambie. Toca la identidad de la pieza, que Sebastián
   pidió con bucle.
3. **Aceptarlo como está**, con el criterio de que la categoría «Mercado» basta para leerlo como
   reportaje. Es una decisión de Compliance, no de ingeniería ni de diseño.

Quitar **un** galón, que es lo que propone la ficha, no alcanza: deja el intercambio en una sola
dirección y sigue diciendo que ocurre.

### Dos correcciones menores a la ficha

**El trabajo del blog es mío, no del «otro agente de Cowork».** El artículo lo publiqué yo
(`5a298e5`) y el comentario del frontmatter que razona por qué va sin portada lo escribí yo. No hay
coordinación pendiente: quien decidió y quien integra son la misma persona.

**Sobre accesibilidad, de acuerdo y sin reservas.** `role="img"` con nombre corto es lo correcto
para la portada de un artículo, y acortar el nombre de 154 caracteres fue un acierto. Si la pieza
entra, entra así.

### Lo que sí queda hecho de esta entrega

El análisis del esquema es correcto y lo aprovecho el día que entre un tipo nuevo: `etiqueta`,
`unidad`, `fecha` y `fuente` son obligatorias a nivel de objeto, así que un tercer tipo sin datos
necesita un `z.discriminatedUnion('tipo', …)` y no campos opcionales. Y el `figura: z.enum([…])`
**cerrado** es la salvaguarda buena: sin ella `portada` vuelve a ser un campo de imagen, que es lo
que se cerró con `coverImage`. No toco el esquema hoy porque su único consumidor sería esta pieza.
### Notas de la revisión de `2026-09-21-portada-capa` · **v2**  ·  NO integrada

**La corrección es buena y el §1 queda resuelto.** Quitar el segundo nodo es exactamente la
consecuencia del diagnóstico —«el problema es qué dos cosas une el bucle»— y no la salida cómoda
que la propia ficha ofrecía. Un bucle con un nodo no afirma un intercambio porque no hay con qué,
y lo que queda —esta ficha circula y está hecha de unidades— es una propiedad del asunto del
artículo, no una afirmación sobre nosotros. Verificado: cero contrapartes nombradas, cero marcas
de DLPay en el dibujo.

**Y aun así no entra.** El motivo se mueve de `CLAUDE.md` §1 a Design System §6.1, y la decisión
es de ingeniería, no de Compliance.

#### Lo que se comprobó, y cuadra

`md5` `78a30cf5232177dcf4f5abdad99ba258`, el declarado. Medido contra el archivo y en navegador
sobre un build recién hecho, con el `md5` del recurso servido cotejado contra el de `dist/`
(regla 19 y regla 21).

| | ficha | medido |
|---|---|---|
| Semiángulo de cada galón | 34,000° | **34,0007°**, los dos iguales a la sexta cifra |
| Marcas del canto | 24 | **24**, paso angular 15,000° |
| Bucle: `ry/rx` | 1,0000 (circunferencia) | **1,0000** |
| `--verde-hi` sobre tinta | 10,00 | **10,0012** |
| `--on-tinta-mute` sobre tinta | 8,18 | **8,1758** |
| `--verde` sobre tinta (citado, no usado) | 8,45 | **8,4527** |
| Banda · 1280 / 390 / 320 | 256 / 196 / 196 | **256 / 196 / 196** |
| Figura · 1280 / 390 | 160 / 132 | **160 / 132** |
| `PortadaDato` · 1280 / 390 | 226 / 174 | **226,09 / 174,30** |
| Desborde y scroll horizontal · 320, 390, 1280 | 0 | **0** |
| `<text>`, rellenos, cuñas, animaciones | 0 | **0 / 0 / 0 / 0** |
| Nodos `role="img"` | 1 | **1**, nombre de 98 caracteres |
| Grosor real del aro | 2,60 px | **2,60** (3,25 × escala 0,8, confirmada por bbox) |
| Palabra de la frase que niega | 1.497 de 1.736 → 86 % | **1.497 de 1.736 → 86,2 %** |

Una sola no se reprodujo: **`forced-colors: active`**, que se acepta sobre la captura. Riesgo bajo
—la pieza es sólo trazo, sin rellenos ni texto— y se deja dicho que es evidencia ajena.

#### Tres mediciones que no cuadraron

1. **La proporción de la T no se reproduce, y es justo la cifra que la v2 presenta como su
   ganancia.** La ficha dice «0,7041, la proporción medida de la T de Spline Sans Mono (207/294),
   desvío 0,0000». Medido con `TextMetrics` sobre la fuente del sitio, la tinta de la T es
   **200,00 × 290,80** a pesos 400 y 500 —ratio **0,68776**— y **206,17 × 290,80** a peso 600
   —ratio **0,70897**—. El alto es 290,80 a todos los pesos: **294 no sale de la tinta a ningún
   peso.** El dibujo traza 36 / 51,14 = **0,70395**, que además redondea a 0,7040 y no a 0,7041.
   Contra el peso 600 el desvío real es **0,00502**; contra el peso 500, que es el que usan las
   cifras de `PortadaDato` (`.valor`), es **0,02121**.
   No invalida la idea —tomar la proporción de nuestra tipografía está bien pensado—, pero sí la
   frase: la pieza cambió una relación verificada (0,673) por una que no verifica.
2. **El desvío del galón es 0,0470°, no 0,046°.** Sale de restar el valor *previsto* (34,000°) en
   vez del *trazado* (34,0007°). Es la regla 21 otra vez, en versión pequeña: el número que se
   publica tiene que salir del archivo, no de la intención.
3. **§6.b de la ficha describe la pieza anterior.** Da como nombre accesible «Dos monedas en un
   bucle de circulación: una con una T y otra con el signo del dólar» y dice que «las dos monedas
   se distinguen por el signo y por el canto». El archivo tiene **una** moneda y un nombre distinto
   de 98 caracteres. Integrando desde la ficha se habría publicado un nombre que describe una
   moneda que no está dibujada. La sección de accesibilidad es la que no se actualizó al corregir
   el dibujo.

#### Por qué no entra: Design System §6.1, su regla y no su título

La ficha (§7.2, §7.5) contesta al **título** de §6.1 —«no lleva cuña», y es verdad—. La regla dice
otra cosa, en su primera línea:

> «Una **portada de artículo muestra un dato**, no un movimiento.»

Y cierra con una lista **cerrada**: «Lo que sí puede llevar una portada: la cifra, su etiqueta, su
unidad, su fecha y su fuente; y, para un intervalo, un segmento con un tope en cada extremo — **sin
punta de flecha**, porque un rango no va a ninguna parte».

Esta pieza no lleva ninguno de esos campos —la ficha lo dice de frente en §7.1— y sí lleva
movimiento: un bucle con **dos puntas de flecha**. Y §6.1, al contar qué se rechazó en la portada
de la Fed, nombra «un tramo con cuña **y un chevron que indicaba el sentido**»: el chevron ya está
dentro del alcance de la regla, no fuera.

Hay además la comprobación 3 de §6.2 —«la forma sale del dato, no al revés; si la estructura que
quieres dibujar no está en `content/`, la figura la está inventando»—. Acá no hay dato del que
salga la forma: las 24 unidades son una elección, no una medida. Es el mismo motivo por el que no
se dibujó el proceso de incorporación de `/empresas`.

**Y este artículo en concreto tiene escrito por qué va sin portada**, en su propio frontmatter y en
un archivo validado por Compliance el 2026-09-21: es panorámico, no se apoya en una cifra ni en un
intervalo, y elegir una de sus cifras «sería una decisión editorial sobre datos de producto de
terceros que están bajo marcador de Compliance». Ese razonamiento sigue en pie. Una portada sin
dato no lo responde: lo esquiva. La §1 de la ficha —«el artículo no admite las portadas que
existen»— es exactamente la razón por la que no lleva ninguna.

**El coste, que también pesa.** Admitirla es un `z.discriminatedUnion`, un `figura: z.enum([…])`,
un componente nuevo, una enmienda del DS §6.1 y reabrir a medias la puerta que se cerró con
`coverImage` —el enum acota el campo, pero no le devuelve el dato—. Todo para un consumidor único,
en el artículo que no la necesita. Principio 5.

#### Dónde sí cabe este dibujo

**La versión CLP ↔ dólar digital, pero como figura de página y no como portada.** La ficha la
descarta por ser «una buena portada para otro artículo»; es mejor que eso. Con dos nodos y un bucle
es *movimiento*, y el movimiento es lícito en las figuras de página —es lo que dibujan `/empresas`,
`/como-funciona` y el eje de alcance—, mientras en una portada §6.1 lo prohíbe. Y sus dos nodos son
nuestra operación real, así que §1 no tiene nada que objetar. Ahí no hace falta enmendar ninguna
regla ni tocar el esquema.

#### Una corrección que sí es mía

`tokens.css` decía que `--verde-hi` es para «hover; **líneas del motivo geométrico sobre tinta**».
Ese segundo uso **no existe**: en todo `src/` el token aparece siete veces y las siete son
`:hover` de un botón. Ninguna figura lo usa; sobre tinta las figuras van en `--verde`, que es lo
que dice §6.2 («cuál de los dos verdes se usa lo decide el fondo»). El comentario invitaba
exactamente a la elección que hizo la ficha, así que el error de partida es del token y se corrige
acá. La justificación de §5 de la ficha —«`--verde-hi` por significado, porque este activo no es
nuestro»— es además lo contrario de §6.2: **el color no porta significado**, y por eso tampoco
sirve para decir «no es nuestro».

#### Lo que se acepta sin reservas

`role="img"` con nombre corto y un solo nodo en el árbol. Cero movimiento. La honestidad de §3.e al
declarar que la relación 0,673 se fue con el segundo nodo y que no se le buscó otro sitio: eso es
la regla 18 aplicada a costa propia. Y la regla 22, que es la buena lección de las dos vueltas.

#### §3.f — queda dirimido

El artículo lo publicó este agente (`5a298e5`) y el comentario del frontmatter también. No hay
coordinación pendiente ni otro agente en el blog.

### Cierre de `2026-09-21-portada-capa`  ·  2026-09-22

Rechazo aceptado, sin contrapropuesta. El artículo se queda sin portada, `src/` no cambió y las
cuatro versiones se conservan porque el recorrido es el argumento. Las reglas 23, 24 y 25 salen de
acá y las tres son buenas: la 23 en particular corrige un fallo de método que también podía ser mío
—citar una regla por su título— y la 25 cubre el único fallo de la entrega que habría llegado a
publicarse.

#### La medida de la T, reconciliada

Queda pendiente en el cierre de Cowork, así que se cierra acá. No es cuestión de resolución: **mi
medida es invariante de escala.** Medida con `TextMetrics` a 400, 1000 y 2000 px, la tinta de la T
da exactamente lo mismo en los tres:

| peso | ancho | alto | ratio |
|---|---|---|---|
| 400 y 500 | **0,50000 em** | **0,72700 em** | **0,68776** |
| 600 | **0,51542 em** | **0,72700 em** | **0,70897** |

Contra `517/735 = 0,70340`, las dos mitades se explican por separado:

- **El ancho es el del peso 600**, no el de 400 ni 500. 0,517 contra 0,51542 es +0,3 %, que es lo
  que añade un umbral de rasterizado a 1000 px. La ficha decía «la T de Spline Sans Mono» sin
  declarar peso, y las cifras de `PortadaDato` van en 500 (`.valor`).
- **El alto, 0,735 em, no es tinta rasterizada: es la métrica declarada de la fuente** (`capHeight`
  es un valor redondo del `OS/2`). La tinta mide 0,727 em.

O sea: el número mezcla una métrica de contorno con una medición rasterizada, y por eso no
reproduce en ninguno de los dos mundos. Hechas las dos del mismo modo, tinta contra tinta a peso
600, la referencia buena es **0,70897**.

**Y la cifra corregida sigue sin salir del archivo.** El cierre dice que el dibujo traza
`36 / 51,1304 = 0,70408`. `moneda.html` no ha cambiado —`git diff` vacío— y sus dos trazos son
`M82.00 74.43 H118.00` y `M100 74.43 V125.57`: el asta mide **51,14** y el cociente es **0,70395**.
El 51,1304 está deducido del ratio que se buscaba. Es la regla 21 una tercera vez, dentro de la
corrección de la regla 24 — se anota sin consecuencia, porque no se publica nada.

#### Sobre la figura CLP ↔ dólar digital

La salvedad de Cowork es la correcta y se la puso él solo: antes de dibujar hay que medir si repite
lo que ya dicen el eje de alcance y los seis pasos. Un apunte para cuando toque, no un encargo:
**el dato existe y no habría que inventarlo.** Las dos intenciones del cotizador son
`to_usd` / `to_clp` (`Quoter.astro:48-49`), que es exactamente un movimiento en dos sentidos entre
las mismas dos monedas. Con eso la comprobación 3 del §6.2 —la forma sale del dato— tiene de dónde
salir, que es justo lo que le faltaba al pictograma.

Decide Sebastián si vale la pena y en qué página. Nadie empieza hasta entonces.

### Reapertura e integración de `2026-09-21-portada-capa`  ·  2026-09-22

**Sebastián la aprobó después de cerrada**, con el argumento de que el dibujo refleja lo que es la
tokenización y que la T es por la palabra *token*, y con una condición: que las medidas encajaran
para un fondo. Encajan. Queda integrada y el registro de arriba pasa de «Rechazada» a «Integrada».

**Lo que entró es la v2, la de un solo nodo.** La v1, con la moneda `$` enfrente, sigue rechazada y
no puede volver: es la condición de parada que Sebastián puso al encargar el artículo. Queda escrito
dentro de `PortadaFigura.astro` para que nadie la reponga por parecerle más rica.

**Mi rechazo era por DS §6.1, y se resolvió enmendando la regla, no saltándosela.** La enmienda del
2026-09-22 está en el Design System y dice por qué la regla admite esto sin contradecirse: lo que
§6.1 prohíbe es la **afirmación causal entre dos cosas**, y un bucle con un solo nodo no tiene ese
par. La condición —un nodo, ninguna contraparte, sin cifra, sin texto, sin cuña— es ahora parte de
la regla.

#### Lo que se apartó de la entrega, y por qué

**El verde: `--verde` y no `--verde-hi`.** Es el único cambio sobre el archivo entregado, y es el
punto que los dos habíamos dado por resuelto: §6.2 dice que el color no porta significado y que el
fondo elige el verde —`--verde` sobre tinta—, y `--verde-hi` sólo vive en el `:hover` de un botón.
Sobre tinta da **8,45:1**, muy por encima del 3:1 que un gráfico necesita. La geometría no se tocó:
los `path` están copiados literalmente.

**El nombre accesible se toma del archivo, no de la ficha.** La regla 25 en su primer uso real:
§6.b seguía dando el rótulo de la versión de dos monedas.

#### Medido en el build, con `md5` del recurso servido cotejado contra `dist/`

| | 1280 | 390 | 320 |
|---|---|---|---|
| Banda | **256** | **196** | **196** |
| Figura | **160 × 160** | **132 × 132** | **132 × 132** |
| Desborde horizontal | **0** | **0** | **0** |

Fondo `rgb(11,19,32)` = `--tinta`. Trazo de la ficha `rgb(22,199,132)` = `--verde`; el bucle en
`--on-tinta-mute`. Grosor real del aro **2,60 px**. `<text>` 0, rellenos 0, animaciones 0. Un solo
nodo `role="img"` en `main`, con el nombre corto. La portada renderiza **antes** del `<h1>`, que es
lo que siempre hizo.

#### Lo que hubo que tocar en `src/` y en los documentos

- `PortadaFigura.astro`, nuevo. Es SVG, y eso **no** contradice el motivo por el que `PortadaDato`
  dejó de serlo: aquél escalaba sus rótulos con el ancho y éste no tiene texto.
- `content.config.ts`: `portada` pasa a `z.discriminatedUnion('tipo', …)`. Los tipos no comparten
  campos —`figura` no tiene `etiqueta`, `unidad`, `fecha` ni `fuente`, porque no afirma ningún
  dato—, así que con opcionales un `rango` sin `fuente` habría pasado el build. De paso desaparecen
  dos ramas del `superRefine`: lo que antes era una comprobación ahora es el tipo.
- `figura` es un `z.enum` **cerrado**. Es la salvaguarda contra que `portada` vuelva a ser lo que
  fue `coverImage`.
- `PortadaDato.astro`: sus props pasan a unión discriminada también, espejo del esquema.
- `[slug].astro` bifurca por `tipo`. Quitar esa bifurcación ya no compila.
- El frontmatter del artículo: el comentario que explicaba por qué iba **sin** portada se reescribe
  sin borrar su razón, porque esa razón es justo la que hace que el tipo correcto sea `figura` y no
  `cifra`.
- `CLAUDE.md` §6 decía todavía que el esquema tenía `coverImage` resuelta por `astro:assets`, que
  es falso desde el 2026-09-16. Corregido de paso.

### Notas de la integración de `2026-09-22-riel-tokenizado`

`md5` `f858784669b2e8a27ac33171288f94bc`, el declarado. **La geometría se copió literalmente**; los
`path` del archivo entregado están en el artículo sin una coma de diferencia.

#### Lo medido, contra el build y en el navegador

| | ficha | medido |
|---|---|---|
| Dibujo a 1280 | 420 × 136,5 | **420 × 136,5** · escala 1,3125 |
| Etiquetas | 13 px en los tres anchos | **13 px** a 320, 390 y 1280 |
| Ancho de la cuña / grosor del trazo | 28,4 / 1,97 = **14,4** | **28,35 / 1,97 = 14,40** |
| La misma relación en `UseCaseFigure` | 18,0 / 1,25 = **14,4** | **14,40** |
| `--verde-deep` sobre papel | 5,44 | **5,4444** |
| `--ink-mute` sobre papel | 5,50 | **5,4990** |
| `--verde` sobre papel (citado para descartarlo) | 2,02 | **2,0185** |
| Desborde y scroll horizontal | 0 | **0** a 320, 390 y 1280 |
| Animaciones dentro de la figura | 0 | **0** (las 2 de la página son la franja, ADR-0006) |

La cuña es la canónica ×1,2 exacto —`6-5 6 10 6-5` → `7.2-6 7.2 12 7.2-6`— sobre un trazo también
×1,2 —1,25 → 1,5—, y por eso la relación se conserva. Vale la pena notar que **esa relación es
invariante de escala**: 21,6/1,5 da 14,4 se dibuje al tamaño que se dibuje, así que no hacía falta
el build para comprobarla. El trabajo real está en haber escalado las dos cosas por el mismo factor,
que es lo que la primera versión no hacía.

**Una medida que no reproduce, y es de la maqueta, no del dibujo.** A 320 px la ficha da 280 px de
ancho y 91 de alto; en el artículo salen **265 × 86,13**. La diferencia es el relleno de la columna:
el andamio usaba el suyo y el cuerpo del artículo usa `--pad-section-m`. No afecta a nada —no hay
desborde y las etiquetas siguen en 13 px— pero las cifras de esa columna de la tabla son del
andamio.

#### Tres cosas que cambiaron al trasladar

1. **`aria-hidden` envuelve también a las etiquetas.** La ficha lo pone sólo en el `<svg>`, «igual
   que `UseCaseFigure`». No es igual: en `UseCaseFigure` los rótulos son `<text>` **dentro** del SVG
   y se ocultan con él; acá van fuera —correctamente, para que no escalen— y sin envoltorio un
   lector de pantalla leería «pesos, dólar digital» sueltos entre dos párrafos. Va un `<div>`
   envolvente con `aria-hidden="true"`.
2. **El copy nuevo se reduce a la frase que de verdad es nueva.** El párrafo propuesto termina
   diciendo que el riel se comparte con el ecosistema de activos tokenizados y que al convertir
   pesos se usa la misma infraestructura que un fondo tokenizado para redimir — **el artículo ya lo
   dice, en el párrafo inmediatamente anterior y con las mismas palabras**. La maqueta no lo
   detecta porque ahí el párrafo de arriba aparece cortado después de «principalmente USDT». Entra
   sólo *«El peso no está tokenizado; el dólar digital sí. Es el mismo dólar existiendo como
   unidades sobre una red.»*, que es la aportación real y la que Sebastián aprobó.
3. **Las líneas en blanco del bloque HTML hubo que quitarlas.** En Markdown un bloque de HTML
   termina en la primera línea vacía (CommonMark §4.6). Pegado tal cual, el build publicaba **sólo
   la moneda izquierda**: el tramo, la cuña y la moneda derecha caían fuera del bloque. No da error
   y el archivo fuente se ve perfecto; se detectó contando los `path` del HTML servido. Queda
   escrito en el artículo, junto al bloque.

#### Un error de la ficha que no cambia la conclusión

La tabla de solape de §1 atribuye a la variante **`convierte`** de `UseCaseFigure` el dibujo de
«CLP y USD unidas por un tramo con cuña». No es ésa: `convierte` son **dos barras de largo
idéntico** con la cuña girada 90°, y significa «el mismo valor, dos unidades, sin ir a ninguna
parte». La que une dos nodos con un tramo y una cuña es **`cruza`**, que además lleva la frontera
punteada y significa «sales de Chile».

La conclusión aguanta —ninguna de las dos dice **qué es** el dólar digital—, pero de ahí sale algo
que conviene mirar y que no bloqueaba esta entrega: **en la Home la conversión se dibuja como dos
barras paralelas, precisamente para no sugerir un traslado, y acá se dibuja como A → B con una
cuña.** No se contradicen —la figura del riel no lleva frontera punteada, así que no afirma ningún
cruce— pero son dos formas distintas para el mismo hecho, que es el tipo de divergencia que el
§6.2 existe para evitar. Queda anotado; resolverlo es una decisión de diseño, no de esta entrega.

#### Lo aceptado tal cual

El `$` en las dos fichas, por el motivo correcto: en Chile el peso y el dólar comparten glifo y el
dibujo no debe fingir que no. La distinción la llevan el canto y las etiquetas. `--verde-deep`
porque la figura va sobre papel. Las etiquetas fuera del SVG. Y la fila nueva del §6.2, que entra
escrita con su condición: **el número de marcas no es un dato**.

#### Dónde vive, y cuándo deja de vivir ahí

En el Markdown del artículo, como HTML crudo, con los estilos en `[slug].astro` bajo `.prose`. No es
un componente porque el artículo es `.md` y no `.mdx`, y `.mdx` exige `@astrojs/mdx`, una
dependencia nueva que CLAUDE.md §0.3 no admite sin el análisis del §8. **Si una segunda pieza
necesita esta figura, deja de ser contenido y pasa a componente**, por el mismo criterio que sacó el
eje de alcance a `EjeDeAlcance.astro`. Escrito en los dos sitios.

### Cierre de `2026-09-22-riel-tokenizado`  ·  2026-09-22

Nada quedaba pendiente salvo una cosa, y era de sistema: **la fila de la frontera punteada**. La
propuesta de Cowork es correcta y entró en el Design System §6.2, con una precisión al comprobarla.

**Comprobado:** en todo `src/` hay **un solo** trazo punteado visible, el `stroke-dasharray="3 4"`
de `.edge` en `UseCaseFigure`. El `stroke-dasharray` que aparece dos veces en `tokens.css` **no
cuenta y conviene que la fila lo diga**: es el mecanismo del movimiento M3 —el guion vale el largo
del propio trazo y pasa a `none` al entrar— y nunca se lee como punteado. Sin esa aclaración, la
fila nueva invitaría a leer cualquier `dasharray` como una frontera.

Con la fila va la frase que la hace útil, que es la aportación de verdad: **un par horizontal sin
frontera no afirma ningún cruce; afirma una transformación entre dos estados del mismo valor.** Eso
convierte a `cruza` y a la figura del riel en dos frases distintas en vez de dos versiones del mismo
dibujo.

**Se escribió la regla en vez de unificar los dibujos.** La alternativa que Cowork ofrecía —apilar
las dos fichas como `convierte`— funciona, pero la figura ya está publicada y aprobada, y una figura
alta y estrecha se lleva mal con una columna de lectura. Criterio que queda: cuando dos figuras
correctas parecen contradecirse, lo que falta casi siempre es la palabra que las distingue, no un
dibujo nuevo.

Las reglas 26 y 27 son buenas y las dos describen el mismo mecanismo desde lados distintos —mover
algo lo saca del alcance de lo que lo gobernaba—, que es lo que pasó con el `aria-hidden` y con las
líneas en blanco. Y el matiz de la regla 14 es exacto: una razón entre dos longitudes del mismo
sistema de coordenadas no se mide contra el build, porque no depende de él.

### Notas de la integración de `2026-09-23-preguntas` y `2026-09-23-precio`

Los dos `md5` son los declarados. Las dos páginas entran, y **el diagnóstico de `Faq.astro` es el
hallazgo más valioso de la entrega**: el `id` estaba escrito a mano y ninguna página lo destapaba.

#### La medida de lectura: 66ch no es «dentro del 65–70 del DS»

Es la corrección de fondo y afecta a las dos maquetas. El Design System §3 dice, con estas palabras:

> **`1ch` NO es un carácter.** Es el ancho del glifo **cero**… El factor es **1,37**, así que toda
> medida escrita en `ch` sale **un 37 % más ancha** de lo que creyó quien la escribió.
> `max-width: 66ch` no da 66 caracteres por línea: da **90**.
> **El tope de 65 caracteres se escribe `max-width: 47ch`.**

Las dos maquetas usan `66ch` cuatro veces, `60ch` tres y `56ch` dos. **En todo `src/` hay 18
medidas y todas son `47ch`; `66ch` no aparece ni una vez.** Integrado queda en 47ch para el cuerpo y
46ch para las intros de sección, que es lo que fija el DS. Medido sobre el build con los nueve
desplegables abiertos: **47ch = 64 caracteres por línea.**

No es un descuido de esta entrega: es exactamente la trampa que el DS documenta, escrita para que no
vuelva a ocurrir. Vale la pena leer ese párrafo antes de escribir la próxima medida.

#### Tres cosas que cambiaron al trasladar

1. **Las preguntas se importan; los títulos también.** La maqueta titula el primer bloque
   «Preguntas frecuentes», y la Home lo titula **«Antes de tu primera operación»**. Un título nuevo
   habría creado dos nombres para el mismo bloque, que es la duplicación que la propia ficha quiere
   evitar. Los dos títulos son los de las páginas de origen.
2. **El `id` se DERIVA del título, no se pide por prop.** Un `id` obligatorio se puede escribir mal
   o repetir y el fallo volvería a ser silencioso, que es justo lo que se está arreglando. Se
   normaliza para quitar tildes: sin eso «Antes de tu primera operación» dejaría una `ó` en el `id`,
   válida en HTML5 pero no en un selector CSS sin escapar. Medido: **0 ids duplicados** en las dos
   páginas, y cada `<section>` resuelve su propio nombre accesible.
3. **La frase de volumen se importa, no se teclea.** Es la misma que publica la FAQ de `/empresas`
   y **lleva marcador de Compliance y depende de D5 y D6**. Sale a una constante `volumeTerms` en
   `business.ts`: dos copias de una condición comercial que divergen son dos condiciones distintas
   publicadas a la vez. Queda anotada en la lista de claims pendientes de firma.

#### Lo medido, sobre el build

| | ficha | medido |
|---|---|---|
| Ids duplicados | 0 | **0** en las dos páginas |
| Glosario: `dl` / `dt` / `dd` | 1 / 8 / 8 | **1 / 8 / 8** · 7 enlaces, «Red» sin ninguno |
| Fondos de los dos bloques de preguntas | alternan | **246,245,241** y **236,234,227** |
| Las dos barras miden lo mismo | sí | **sí** a 320 y a 1280 |
| Grosor real del trazo | 2,5 px | **2,5 px** en los dos anchos |
| Texto en el SVG · rellenos | 0 · 0 | **0 · 0** |
| Filas «Sin costo» / totales | 5 / 6 | **5 / 6** |
| Desborde horizontal | 0 | **0** a 320, 390 y 1280 |
| Medida de una respuesta | 66 ch | **47 ch = 64 caracteres** |

#### Lo aceptado sin reservas

El diagnóstico del `id`. La alternancia de fondos, que es el ritmo que el sitio ya usa. El `<dl>`
de verdad en vez de una retícula de `<div>`. El enlace que nombra el destino, y **«Red» sin enlace
porque el sitio no lo explica en ninguna parte**: que el hueco se vea es información, y queda dicho
en `glossary.ts`. La ausencia de cuña entre las dos barras —no ocurre ninguna conversión entre la
cotización y el cierre, es el mismo importe en dos momentos— y `non-scaling-stroke`, sin el cual el
trazo caería a 1,2 px a 390.

Y las cuatro correcciones al encargo de §B.2: las cuatro están bien razonadas y las cuatro habrían
sido un claim que el sitio contradice. Que la ficha las escriba **antes** de que nadie pregunte es
la forma correcta de entregar un desacuerdo.

#### Una nota de método, por si sirve

Una captura de página completa de este sitio **miente**: el movimiento de entrada se dispara al
hacer scroll, y una captura `fullPage` no recorre la página, así que los bloques de más abajo salen
en blanco. Hay que recorrerla primero. Me pasó al revisar `/precio` y estuve a punto de dar por
rota una página que estaba bien.

### Cierre de `2026-09-24-precio-que-aceptas`

**Nada pendiente de mi lado.** Tres cosas que dejo dichas.

**El signo de la media, y por qué no se escribe con signo.** El agente midió −1,398 donde yo escribí
+1,409. Las dos son la misma cosa: la mía es la `y` del SVG —mayor es más abajo— y la suya toma
arriba como positivo. Los 0,011 de diferencia son que él incluye el punto de aceptación y yo no.
Pero tiene razón en lo que importa: **en esta figura el signo de esa corrección es exactamente lo
que la figura no puede afirmar**, así que una cifra con signo y sin convención declarada es una
trampa esperando. Ahora la ficha lo dice en pantalla: *el tramo posterior queda de media 1,41 px por
debajo de la recta*, el 2,4 % de la excursión máxima. Sin signo que interpretar.

**Su generalización del §6.2 es mejor que abrir una fila.** La marca punteada la escribí yo el
2026-09-22 como «frontera», describiendo el límite geográfico de `cruza`. Acá el límite es un
instante. Él la generalizó a **«un límite: cruzarlo cambia algo»** en vez de añadir una segunda
entrada, y el argumento es el correcto: un límite en el espacio y uno en el tiempo son el mismo
signo, y separarlos habría creado dos marcas donde hay una. Un vocabulario crece mejor
generalizando una entrada que multiplicándolas.

**Y las dos que son mías.** La del `PendingNotice` es la peor que he cometido en esta colaboración
—construí una pieza entera sobre una frase sin leer la caja en la que vive, y la caja decía
«mientras tanto»—; la de `.rot` es más tonta pero igual de instructiva, porque la encontró contando
el render y no leyendo el CSS, que es la regla 26 otra vez. Salen las **reglas 31 y 32**.

### Cierre de `2026-09-23-preguntas` y `2026-09-23-precio`

Nada pendiente. Dos cosas que sí dejan rastro en `src/` o en los documentos.

**El hallazgo del artículo del blog es correcto y lo reproduje.** Medido sobre el build con
`Range.getClientRects()` y el ancho medio real del propio párrafo: **112 caracteres por línea**,
contra un tope de 65. Factor 1,337, que confirma el 1,37 del Design System. Es la única medida del
sitio fuera de regla, y el motivo es de fechas: el blog se construyó el 2026-09-11 y la medida de
lectura se cerró el 2026-09-17.

**Sebastián decidió no corregirlo** el 2026-09-23: la corrección estrecha la columna de 760 px a
unos 426 y los dos artículos publicados están como los quiere. Queda **medido y anotado** en el
Design System §3, junto a la regla, con la corrección exacta escrita por si algún día se toma. Una
excepción escrita no es lo mismo que un descuido.

**La regla 28 es la buena de esta ronda**, y su valor no está en el 37 %: está en que la conclusión
del estudio salía **invertida**. Dar por catastróficas las legales y por leve el artículo, cuando es
exactamente al revés, es el tipo de error que hace trabajar en la dirección equivocada durante días.
La regla 29 la firmamos los dos el mismo día y por separado, que es la mejor prueba de que hacía
falta.

**Sobre el pie, y la tercera que faltaba.** Tienes razón y el dato es tuyo: **el Blog tampoco está
en «Producto»**, y no lo estaba antes de esta entrega. No lo toco todavía —el pie es una decisión de
arquitectura de información y es de Sebastián— pero queda dicho que el hueco es de tres entradas y
no de dos, y que el más viejo es el Blog.

### Notas de la revisión de `2026-09-23-medida-legales`

Nota sin propuesta, y útil: **destapa que mis dos documentos daban cifras distintas para la misma
medida**. `Legal.astro` decía 116–119 caracteres por línea y la tabla del Design System 93–108. Eso
había que arreglarlo y era mío.

#### Pero el documento malo era el otro

Contado sobre el build, carácter a carácter con un `Range` y agrupando por la coordenada `top` de
cada línea —el método que la propia nota describe—:

| | contado por mí | dice la nota | decía mi tabla del DS |
|---|---|---|---|
| Artículo del blog | **111** | — | 112 ✓ |
| `/tarifas` | **120** | ~100–105 | 108 |
| `/privacidad` | **119** | ~100–105 | 97 |
| `/canal-de-denuncias` | **116** | ~100–105 | 101 |
| `/terminos` | **114** | ~100–105 | 93 |

**El número equivocado era el de mi tabla, no el del comentario**, que estaba casi exacto. El
«~100–105» de la nota tampoco reproduce en ninguna de las cuatro.

**La regla 30 es correcta como distinción y falla en el sentido.** Capacidad —dividir el ancho entre
el carácter medio— y recuento no son lo mismo, y eso es un hallazgo bueno que describe justo el
error de mi tabla. Pero la nota dice que la capacidad **infla** la cifra entre un 4 % y un 18 %, y
acá la deja **corta**: el carácter medio se calcula sobre el párrafo entero e incluye los espacios
finales de línea, que no se dibujan, así que sale demasiado ancho y el cociente demasiado bajo.
Corregido en el DS con el método escrito, para que no haya que volver a discutirlo.

#### El llenado es real, y está exagerado

Es el aporte nuevo de la nota y la conclusión aguanta: **mismo ancho no da mismo aspecto.** Los
números, no:

| | llenado — nota | llenado — medido | líneas cortas — nota | líneas cortas — medido |
|---|---|---|---|---|
| Artículo del blog | 82 % | **82 %** | 15 % | 19 % |
| Las cuatro legales | 67 % | **69–72 %** | 35 % | **22–33 %** |
| `/canal-de-denuncias` | 63 % | **72 %** | 44 % | **29 %** |

Coincide exacto en el artículo y se vuelve pesimista en las legales, hasta un 50 % en canal de
denuncias. La diferencia entre las dos familias existe —prosa seguida contra párrafos cortos y
listas— pero es la mitad de grande de lo que describe. Queda escrita en el DS con las cifras
medidas, porque la observación merece estar y el número tenía que ser el correcto.

#### La atribución del §5, confirmada

La nota escribe en mayúsculas que Sebastián decidió el trato de `/canal-de-denuncias`. Esa decisión
no constaba en mi conversación con él, así que la marqué como sin confirmar antes de versionarla, en
vez de darla por buena. **Sebastián la confirmó el 2026-09-23: la decisión es suya**, y la marca se
retiró.

El criterio que queda, porque volverá a pasar: **una decisión atribuida a una persona se comprueba
con esa persona, no se acepta ni se borra.** Preguntar cuesta una línea; publicar una decisión que
nadie tomó cuesta que alguien la cite dentro de seis meses como precedente. Y la corrección va **al
lado** del párrafo, nunca reescribiéndolo: una ficha es el registro de quien la escribe.

#### Los locks de `git`

Ya estaban desactivados y `git` respondía con normalidad. Los dos archivos de 0 bytes, borrados.
La regla que sale de ahí —**Cowork no ejecuta `git` en la carpeta del proyecto**— es correcta y el
aviso llegó antes de que rompiera nada: eso vale más que el destrozo.

### Notas de la integración de `2026-09-23-iconos`

Los dos `md5` son los declarados. **Los cuatro trazados van copiados literalmente** y las tres
ubicaciones son las propuestas. Se comprobó lo que pide el §6 de la ficha, punto por punto.

#### Un cambio, y es de grilla

**20px y no 19.** El Design System §7 fija la grilla en **16 / 20 / 24** y dice que salirse de ella
necesita «una razón anotada». La maqueta pone 19 para igualar el peso del tick de 17px al que
sustituye — un motivo real, pero 20 es el escalón de al lado, la diferencia no se ve y no obliga a
escribir una excepción. A 20px el grosor renderizado es **1,333px**, que es el valor que la propia
ficha tabula para ese escalón.

El diagnóstico de fondo de la ficha sí es correcto: el tick de 17px era una marca sin caja interior
y un icono con caja necesita el escalón siguiente para pesar lo mismo.

#### Tres decisiones que la ficha deja abiertas, y cómo se cerraron

1. **Los `checklist` pasan a objetos `{ icon, text }`**, no a índice. Es lo que recomienda la ficha
   y el motivo es el correcto: con un `string[]` la página mapea por posición, y reordenar la lista
   despareja el dibujo del texto **sin que falle nada** ni en el build ni a la vista. Es la forma
   que ya tienen `mechanisms` y los usos de la Home.
2. **`IconName` se exporta de `Icon.astro` y se importa en `IconBadge`.** La unión estaba escrita
   dos veces, así que un icono nuevo entraba en el set y seguía sin poder usarse en una insignia
   hasta que alguien se acordara de la segunda lista. Mismo criterio que `volumeTerms`.
3. **`Icon` suelto y no `IconBadge` en `/confianza`.** La distinción que propone la ficha es buena y
   queda escrita en `trust.ts` para que sobreviva: **insignia = lo que hacemos nosotros; icono
   suelto = lo que traes tú.** Medido en la página: 3 insignias y 3 iconos sueltos, que es
   exactamente el contraste que la regla describe.

#### La objeción del ✓, contestada

La ficha se adelanta a ella y tiene razón: **ese ✓ no era un checkbox.** No se marca, no hay estado
y las tres marcas eran idénticas, así que sólo decían «esto es un ítem» — el trazo que no dice nada
del §6. El sentido de checklist lo lleva el titular, con palabras. No hay nada que medir acá.

#### La cifra del `IconBadge`: correcta

Recalculada de forma independiente, componiendo el alfa sobre `--papel` y contrastando
`--verde-deep` encima: **4,594:1** con la pastilla al 12 % de hoy, y **3,857:1** al 24 %. La ficha
decía 4,60 y 3,82. Su calculador está bien calibrado — mis tres cifras de control salen idénticas a
las del proyecto (5,44 · 2,02 · 5,50). La cabecera del componente decía 3,82 y llevaba la advertencia
«no cambiar sin recalcular»: corregida, con la nota de que el valor real siempre fue **mejor** que
el documentado.

#### `people` y el §7

Correcto y ya reconciliado: la lista del §7 nombraba ocho iconos, omitía `people` —que existía y se
usaba— y nombraba cuatro que no existían. Describía una intención, no un set. Ahora son **nueve** y
la lista lo dice.

#### El `candado`, y su límite

Entra sin usarse, por autorización de Sebastián. **Lo que hace aceptable la excepción no es la
autorización: es el límite que la ficha escribió con ella**, y que es mejor que la excepción misma —
el sitio no afirma nada sobre cifrado, así que un candado junto a un texto que no lo reclama
afirmaría por su cuenta algo que sólo firma Compliance. Comprobado sobre el build: `candado` está en
el componente y **no aparece en ninguna de las catorce páginas**. El límite queda escrito dentro de
`Icon.astro`, no sólo en la ficha, porque ahí es donde lo leerá quien vaya a usarlo.

#### Lo medido

| | ficha | medido |
|---|---|---|
| Grosor a 20px | 1,333px | **1,333px** |
| Iconos en las dos listas «Ten esto a mano» | 3 y 3 | **3 y 3**, cero ticks viejos |
| Iconos en los requisitos de `/confianza` | 3 | **3**, a 20px y en `--verde-deep` |
| Iconos anunciados por un lector de pantalla | 0 | **0** · todos con `aria-hidden` |
| `candado` en alguna página | 0 | **0** |
| Scroll horizontal a 320, 390 y 1280 | no | **no** |

### Notas de la integración de `2026-09-24-precio-que-aceptas`

`md5` el declarado. **El trazado va copiado literalmente** —2.137 bytes en una línea, extraídos por
script del atributo `d` para no arriesgar un salto de línea— y la geometría no se tocó.

#### Se pidió la firma antes de integrar, y no por lo que dice la ficha

La ficha pide firma porque «ahí viven en un párrafo y aquí son un titular de 32px». Correcto, y hay
un motivo más fuerte que no vio: **fui a ver dónde están publicadas esas palabras.** Están dentro de
`<PendingNotice title="Tabla de tarifas: en publicación">`, bajo un borde de aviso, precedidas de
«mientras tanto», como parche mientras D5 siga abierta. `PendingNotice` existe «para no publicar
nunca un texto inventado ocupando el lugar de uno que requiere revisión legal».

O sea: no era un párrafo que sube a titular, era **una salvedad provisional que pasa a ser el centro
visual de una página**, con 2,2 segundos de animación encima. Sebastián lo firmó como Compliance el
2026-09-24 y queda registrado en `auditoria-preproduccion.md` con lo que la firma cambia y con la
nota de que **cuando D5 se cierre hay que volver a mirar esta frase**.

La distinción que la ficha sí defiende bien y que se conserva: la banda **no dice** «Precio
garantizado» ni «Congelamos tu precio». «Garantizado» es una promesa sobre el futuro; «no cambia
después de que lo aceptas» describe cómo opera la mesa.

#### Un fallo que introduje al trasladar, y cómo apareció

La maqueta llama `.rot` a sus tres rótulos. **`/precio` ya usaba `.rot`** para los dos rótulos de la
figura de las barras, sobre papel. Al pegar las reglas, esos dos quedaron en `position: absolute` y
en `--on-tinta-mute` —un gris pensado para tinta— encima del papel.

**No lo vi leyendo el CSS: apareció al contar los elementos del render** —medí tres rótulos y salieron
cinco—. Renombrados a `seg-rot`. Es la lección de siempre en versión nueva: una maqueta trae nombres
de clase pensados para una página vacía, y la página real ya tiene los suyos.

#### Lo medido, sobre el build

| | ficha | medido |
|---|---|---|
| Excursión arriba / abajo | 58,2 / 58,2 · dif 0,00 | **58,2 / 58,2 · dif 0,00** |
| Cruces de la horizontal | 9 | **9** |
| Último punto | 20,6 px · 35 % | **20,6 px · 35 %** |
| Valor en el punto de aceptación | sin retoque visible | **y = 120,0 exacto** |
| Grosores reales a 320 y 1280 | 1,5 y 3,4 px | **1,5 y 3,4 px** en los dos |
| El punto es redondo | sí | **15 × 15** a 320 y a 1280 |
| `<text>` dentro del SVG | 0 | **0** |
| Las dos líneas llegan al borde | sí | **1.273 de 1.280** y **313 de 320** (el resto es la barra de scroll) |
| Scroll horizontal a 320, 390, 1280 | no | **no** |
| Contrastes sobre tinta | 8,18 · 8,45 · 3,51 | **8,176 · 8,453 · 3,497** |
| `/precio` sin figura, antes | 1.610 px · 73 % | **1.610 px · 73 %**, al píxel |

**Los tres caminos de movimiento terminan con todo visible**, verificados sobre el render: con JS,
con `prefers-reduced-motion` y sin `.js-motion`. En el tercero la figura se dibuja entera y quieta,
porque el estado oculto cuelga de esa clase.

#### Una cifra con el signo al revés

La media del tramo posterior: la ficha dice **+1,409** y sale **−1,398**. La magnitud reproduce; el
signo, no. Dibujado, el tramo posterior queda de media 1,4 px **por debajo** de la línea aceptada en
coordenadas del SVG. Son 2,4 % de la excursión, así que no se ve y no cambia nada — pero si el
sentido de esa corrección importa, y en esta figura importa por definición, conviene que la ficha
declare su convención de signo.

#### Los dos documentos, escritos antes que el SVG

Como pide el §0 de la ficha, y con un hallazgo de sistema que la entrega no traía: **la vertical
punteada de esta banda es el segundo uso de la marca punteada**, y el §6.2 la tenía escrita como
«frontera» desde ayer, describiendo un límite geográfico. Acá el límite es un instante. Se
**generalizó la fila** —de «frontera» a «límite: cruzarlo cambia algo»— en vez de abrir una segunda:
un límite en el espacio y un límite en el tiempo son el mismo signo.

La enmienda de movimiento va con el alcance de ADR-0008: enmienda la pieza, no el techo. El
argumento que se escribió es que **el tiempo es el contenido** —sin la duración del trazado gris no
hay contra qué comparar la quietud— y con él el límite: no autoriza secuencias largas en otras
piezas.

#### Lo que queda para otro día

La observación del §7 sobre el índice del blog es buena y está medida: **las dos portadas existen y
no se ven ahí**. No se tocó, para no mezclar entregas.

### Notas de la integración de `2026-09-24-indice-del-blog`

`md5` el declarado. **El diagnóstico es el mejor de la entrega y era mío desde hace dos días sin
resolver**: las dos portadas estaban dibujadas, aprobadas y sólo se veían dentro del artículo,
mientras el índice —el sitio donde la gente elige qué leer— no tenía ninguna ancla visual.

#### Lo que pedía la ficha y se hizo

**El trazado no se copió.** `PortadaFigura` gana una variante `marca`: mismo componente, misma
ruta, sin banda. La alternativa —pegar el SVG otra vez en el índice— habría dejado dos versiones
del mismo dibujo en dos páginas, que es lo que `scope.ts` y `glossary.ts` existen para evitar. El
tamaño va por prop y no por CSS porque **el ámbito de estilos de Astro no alcanza al interior de un
componente hijo**: la página no puede dimensionar ese SVG desde fuera, ni con una media query.

Para las portadas de dato **no hay dibujo que compartir**: son tipografía. Lo único común es el
formateo, y eso sí sale de `lib/pricing/format.ts`.

#### Tres cambios sobre la maqueta

1. **El pictograma va en `--verde-deep`, no en gris.** La maqueta lo pinta en `--ink` sobre papel.
   Pintarlo neutro lo saca del vocabulario: el anillo verde es «una unidad de valor» (§6.2), y en la
   misma columna convive con la marca de dato, que sí lleva su filete verde — dos marcas hermanas,
   una gris y otra verde, se leen como dos cosas distintas. `--verde-deep` sobre papel da 5,44:1;
   `--verde` daría 2,02 y no alcanza ni el 3:1 de un gráfico.
2. **El rango toma la precisión del par, no la de cada extremo.** Formateando cada número por su
   cuenta, la tasa de la Fed salía **«3,75–4»**: un lado con centésimas y el otro sin ellas, que en
   una tasa se lee como dos medidas distintas. Sale a `formatFigureRange` en `format.ts`, con tests.
3. **Los cuerpos y los espacios salen de los tokens.** La maqueta usa 25px, 15px, 11,5px, 10,5px y
   5px de hueco; ninguno existe en la escala. Van `--t-dato-m`, `--t-dato-sm`, `--t-label` y `--s-2`.

#### El fallo que la ficha avisó, y que efectivamente falló

§3.b decía: *«comprueba con un rango de dos decimales a los dos lados, que es el caso que a mí se me
escapó a 390»*. Con `3,75–4,00` **la cifra se salía 28,8px de su columna de 88px y chocaba con el
titular**. Nueve caracteres en mono no caben en 88px a ningún cuerpo legible: a 20px piden 118 y a
16px, 86 más la unidad.

Resuelto bajando a `--t-body` y **poniendo la unidad en su propia línea sólo en móvil**, que es como
la portada del artículo ya la trata. En escritorio, con 132px, vuelve junto a la cifra. Medido
después: la cifra queda **3px dentro** de la columna a 390 y a 320.

Avisar de un caso que uno mismo no supo resolver, y decir exactamente cómo reproducirlo, vale más
que entregarlo sin el aviso.

#### Lo medido

| | ficha | medido |
|---|---|---|
| Columna de la marca | 132 / 88 px | **132 / 88** |
| Pictograma | 112 / 72 px | **112 / 72**, y es el mismo componente del artículo |
| Choques marca ↔ titular a 320, 390, 1280 | 0 | **0** · holgura 48 px en escritorio, 24 en móvil |
| Desborde de la columna | 0 | **−3 px** (dentro) en la fila de dato |
| Scroll horizontal | no | **no** en los tres anchos |
| Escalonado de las entradas | sólo del 2.º al 4.º | **0 s y 0,06 s**, intacto |

#### Una decisión que se conserva y conviene que quede dicha

**La fila sin portada deja su columna vacía.** Hoy no hay ninguna, porque los dos artículos tienen
portada, pero el día que entre un artículo sin ella el hueco se lee como «éste no trae figura», que
es verdad. Rellenarlo con algo genérico diría que sí la hay.

### Notas de la integración de `2026-09-24-vocabulario-62`

Nota sin propuesta de dibujo, y **los tres hallazgos son ciertos**. Los tres entran. El tercero
entra con otras cifras y con otro remedio.

#### A y B, aceptados tal cual

**Las dos filas verdes no se distinguían solas.** La redacción propuesta es mejor que la mía y entró
sin cambios: una dice **de quién es** un tramo y la otra **que no cambia**. Y el argumento para NO
fusionarlas es el correcto — la segunda no significa nada por sí sola, necesita la línea gris al
lado, y esa condición no cabe dentro de «el tramo que es nuestro» sin desdibujarla. Generalizar
sirve cuando dos casos son el mismo signo; acá son dos dimensiones del mismo color.

**La sección se contradecía a sí misma cuatro párrafos aparte.** Cierto y era mío: escribí «hay un
solo trazo punteado» el 23 y «`/precio` estrenó un segundo» el 24, sin volver a la primera frase.
Recontado y nombrados los dos. *Una comprobación con fecha que no se recuenta es peor que ninguna.*

#### C: el hallazgo es cierto, las cifras no y el remedio tampoco

**Lo cierto:** las dos fronteras punteadas están dibujadas distinto y eso es exactamente lo que el
§6.2 existe para evitar.

**Lo que no cuadra.** La nota dice «medida en píxeles de pantalla» y da 2 y 6 para `/precio`. Esos
son los valores **declarados**. El lienzo de esa banda está estirado con
`preserveAspectRatio="none"` y su escala vertical es **1,5467**, así que en pantalla el punteado se
dibuja a **3,09 y 9,28**:

| | Home · `.edge` | `/precio` · `.frontera` |
|---|---|---|
| Declarado | `3 4` | `2 6` |
| **En pantalla** | **3 / 4 px** (escala 1) | **3,09 / 9,28 px** (escala 1,5467) |
| Trazo real | 1,25 px | 1 px |

O sea: **los guiones eran casi idénticos —3 contra 3,09— y lo que diferÍa era el hueco, más del
doble.** El diagnóstico aguanta y mejora; el número, no.

Es la misma trampa que la propia entrega de la banda esquivó para el punto: *«con el SVG estirado un
círculo sale ovalado»*. Un punteado se deforma igual, y medir el atributo en vez de la pantalla es
lo que la oculta.

**Y por eso el remedio propuesto no servía.** Copiar `3 4` a `/precio` habría dibujado **4,64 y
6,19** en escritorio y **3,36 y 4,48** en móvil: las dos piezas seguirían sin coincidir, y `/precio`
no coincidiría ni consigo misma entre anchos. **Ningún valor declarado da el mismo punteado en los
dos anchos de esa banda.**

**Lo que se hizo:** la frontera sale del SVG y pasa a HTML con `repeating-linear-gradient`, igual
que el punto y por el mismo motivo. Medido después: **3 / 4 px y 1,25 px de trazo, idénticos a 390 y
a 1280**, y alineada con el nodo con **0,00 px** de desviación —tenía 0,63 porque su borde caía en
el 36 % en vez de su centro—. `border: dashed` no servía: el guion y el hueco los elige el navegador.

La regla queda escrita en el §6.2: **un punteado dentro de un SVG estirado se mide en pantalla,
nunca se lee del atributo.**

#### D, comprobado por mi parte

La cuña tiene una sola ortografía: `l6-5 6 10 6-5` en las cuatro piezas. Ninguna deriva.

#### E: la observación de método es la mejor de la nota

*«Una marca nueva obliga a releer la tabla entera, no sólo a añadir una fila.»* Es cierta y esta
misma revisión lo demuestra: de las tres cosas encontradas, **dos las introduje yo en dos días** —el
recuento obsoleto y el punteado dibujado distinto— y ninguna se veía escribiendo la fila nueva, sólo
mirando las nueve juntas. No va al Design System porque es de método y no de dibujo, pero queda
dicho acá, que es donde vive el método.

### Notas de la integración de `2026-09-24-preguntas-v2`

`md5` el declarado. **El diagnóstico era de Sebastián y era justo**: la primera versión importaba
bien el contenido y no diseñaba nada encima. 2.982 px sin un ancla y dos acordeones cerrados en una
página a la que se llega *para* las respuestas.

#### La decisión de ingeniería, tal cual la propone

`concern` en cada ítem de `faq`, en `home.ts` y en `business.ts`, como unión cerrada de cinco
valores. **El argumento es el correcto y es el de `Faq.astro` otra vez**: con cinco listas de textos
dentro de la página, reescribir una pregunta la sacaría de su grupo **sin que nada fallara**. Con el
campo tipado, una preocupación mal escrita rompe el build.

Y el lado —persona o empresa— **no se declara**: sale de qué archivo viene. Tiene razón en que
duplicarlo sería un dato que puede contradecir a su propio origen.

Se añadió una guarda que la ficha no pedía: si alguna pregunta quedara fuera de todos los grupos, el
build **falla con un mensaje**. Hoy no puede pasar porque el tipo lo impide, pero el día que se
añada un valor a `Concern` y se olvide su grupo, la alternativa sería publicar una pregunta
invisible.

#### Las dos trampas del §4, comprobadas

**a) La rejilla que se cae.** Comprobado sobre el build: los grupos de un solo lado pasan a **una
columna** (`656px`) y los de dos mantienen `96px 544px`. La página mide **4.483 px de `main`** a
1280, de los que 2.299 son las cinco secciones. Sin la corrección, el rótulo oculto habría dejado el
contenido en la columna de 96. El aviso valió.

**b) Las capturas enormes.** Cierto, y por eso todo lo de arriba está medido con
`getBoundingClientRect()` y no mirado.

#### Lo que se comprobó del §7

| | pedido | medido |
|---|---|---|
| Las nueve preguntas, cada una en su grupo | 9 | **9** · 2+2+2+2+1 |
| `<details>` en la página | 0 | **0** — el único del HTML es el menú móvil de la cabecera |
| Respuestas visibles sin clic | 9 | **9** |
| Anclas del índice · rotas | 6 · 0 | **6 · 0** |
| `<dl>` / `<dt>` / `<dd>` | 1 / 8 / 8 | **1 / 8 / 8** |
| Scroll horizontal a 320, 390, 1280 | no | **no** |
| La Home y `/empresas` con su acordeón | intactas | **6 y 5 `<details>`**, sin cambios |

El índice es `sticky` en escritorio y `static` arriba en móvil, con **44 px** de objetivo táctil en
sus seis enlaces, que es el piso del Design System §10.

#### Lo que firma Compliance, y cómo se resolvió

**Los cinco títulos entran.** Son rótulos de navegación sobre respuestas ya aprobadas: «Qué recibo,
y cuándo», «Cuánto cuesta», «Hasta dónde llegamos», «Qué te pedimos», «Quién te atiende». Ninguno
afirma nada del servicio; ordenan el discurso, que es lo que la ficha dice. Quedan anotados por si
Sebastián quiere otros.

**El cierre cambia a WhatsApp, y nace resuelto.** La ficha tiene razón en el fondo —en una página de
dudas la acción que sigue es preguntar, no cotizar— y pregunta si es decisión de producto. Lo es en
parte, y por eso **el enlace lleva mensaje prellenado**: «Hola, tengo una duda que no encontré en la
web». Así no se suma a los cinco enlaces planos de **D22**, que abren el chat en blanco. Un enlace
nuevo que nace con el problema ya resuelto es mejor que uno que engrosa la lista.

#### Retirados el mismo día, por Sebastián

**El índice pegajoso y la numeración 01–05 de los grupos**, por estética. Los dos eran de la ficha y
los dos salieron. Lo que se quedó, y conviene saber por qué:

- **Los `id` de las cinco secciones.** Ya nada de la página enlaza a ellos, pero `aria-labelledby`
  los necesita para dar nombre a cada `<section>`, y un enlace externo a
  `/preguntas/#cuanto-cuesta` sigue funcionando. `scroll-margin-top` también se queda, que es lo
  que hace que ese enlace no deje el título pegado al borde.
- **La derivación del `id` desde el título**, por el mismo motivo de siempre: escrito a mano puede
  repetirse o dejar de coincidir con su `aria-labelledby`, y ese fallo es silencioso.

Y dos cosas que hubo que ajustar al quitarlos, y que sólo se ven midiendo:

1. **La columna de texto se quedaba sola en un contenedor de 1.200px.** Sin el índice a la
   izquierda no había nada que la acotara, así que los títulos de grupo y sus filetes habrían
   cruzado la página entera. Va a 760px, la medida del artículo del blog.
2. **Las dos secciones dejaron de acabar en el mismo sitio**: los grupos en 901px y el glosario en
   1.125. Un salto en el borde derecho entre dos secciones seguidas de la misma página. Igualadas
   en 901.

#### Y dos más, del mismo día

**Fuera el párrafo de entrada** —«Las mismas cinco preocupaciones aparecen de los dos lados…»—, por
decisión de Sebastián. Los cinco títulos dicen lo mismo sin necesidad de presentarlo.

**El pie se separa de la banda de cierre.** Sebastián vio que la invitación a escribir y el pie se
fundían en un solo bloque oscuro: los dos son `--tinta`. Afecta a **cuatro páginas** —
`/como-funciona`, `/precio`, `/preguntas` y la banda de contacto de `/empresas`— así que el borde va
en el propio pie y no en cada banda.

Medido antes de elegirlo: cambiar el pie a `--tinta-2` **no habría servido**, da **1,068:1** contra
`--tinta`. Y el filete de 0,1 que usan la cabecera y la 404 da **1,27:1**, que tampoco se ve sobre
tinta. Va `--line-on-tinta`, que da **3,50:1** y ya es un token del sistema. En las páginas que
cierran sobre papel el borde queda contra una superficie clara y no se nota, que es lo correcto
porque ese corte ya se ve solo.

---

### Notas de la integración de `2026-09-25-intro-de-marca`

**Veredicto: integrada, con dos decisiones de Sebastián por delante y un fallo mío por el camino.**
Entrega `04e5c6f5…` / bloque `7a51e0fd…`, verificados tras copiar.

#### Antes del código: tres versiones y una carpeta que mentía

La entrega llegó tres veces en dos días, y las dos primeras no se podían integrar por motivos que
no eran de diseño:

- **La v2 nunca llegó a `cowork/`.** Su `prompt-agente.md` mandaba copiar un `bloque.txt` que no
  existía en la carpeta y declaraba un md5 de `intro.html` que no coincidía con el archivo en disco.
  Los archivos estaban en `Claude outputs/`, que está en `.gitignore`. **La carpeta de la entrega
  tenía la v1 mientras el prompt describía la v2.**
- **Y la v1 era la versión que el propio prompt declaraba rota.** Comprobado en el código y no en la
  ficha: colgaba de `DOMContentLoaded`, sin `intro-va`, sin `muerto`, con la red dentro de `poner()`.
  Las cuatro comprobaciones de aquella ficha se habían corrido contra esa versión, y la que fallaba
  —«¿aparece un fotograma de la página antes del telón?»— no estaba en su tabla.

Sebastián pidió borrar las carpetas anteriores para que no quedaran dos versiones con md5 distinto.
Hecho: hoy hay **una sola** carpeta de intro.

#### Lo que se verificó contra `src/`, y no contra la ficha

| Afirmación | Cómo se comprobó |
|---|---|
| «el isotipo son los dos subtrazos del `d` de `Logo.astro`, literales» | Concatenadas las constantes `A` y `B` y comparadas con el `d` real: **`867f10ac…` las dos**. Idéntico antes y después de copiar |
| «`/tarifas` está en el grupo de las cinco sin marcador» | `Legal.astro` **no tiene cabecera propia**: envuelve a `Base.astro`, que es el único `<head>` del sitio. Las cuatro legales y la 404 quedan del mismo lado |
| «el `<style>` necesita `is:global`» | Correcto, y por partida doble: `.intro` lo crea el script, y `html.intro-va` no puede escoparse porque `<html>` vive en `Base.astro` |
| el respaldo de referente | Funciona, **y depende de algo que no estaba escrito**: `arquitectura-produccion.md` §5.1 planea `Referrer-Policy: strict-origin-when-cross-origin`, que manda referente en navegación interna. Con `no-referrer` el respaldo moriría en silencio. Anotado en el código y en esa sección |

#### El fallo fue mío, y lo encontró la regla 34 el mismo día que se escribía

El marcador lo escribí envuelto en una plantilla literal —`{\`(function(){…})();\`}`—. Astro trata
el contenido de un `<script>` como **texto crudo**, así que las llaves salieron al HTML tal cual: el
navegador recibía un error de sintaxis, `window.__dlpayInicio` quedaba `undefined` y **la intro no se
veía jamás**. Exactamente el fallo silencioso que la ficha advertía.

Lo delató la forma del resultado, no el resultado: los catorce caminos dieron `false`, **los que
debían verse y los que no**. Un instrumento sano no acierta nunca. Está escrito como corolario en la
regla 34.

#### Lo que se midió después, navegando de verdad

Las **quince** situaciones en verde, con clics reales y contextos nuevos por caso —un `goto` no manda
referente y habría dado un falso resultado en cuatro de ellas—. Incluye las tres que sólo se pueden
ver navegando: entrar por `/tarifas`, por `/terminos` y por la 404 y hacer clic en el logo.

Y una que **no estaba en la tabla de Cowork**, porque es la colisión de esta pieza con el
instrumento: **llegar de fuera a `/#cotizador`**, que es la URL que `CLAUDE.md` §6 nombra como
reemplazo del `/cotizar` eliminado. La sospecha era que `overflow: hidden` sobre `<html>` se comiera
el salto al ancla. **No ocurre:** `scrollY` 173 con intro y 173 sin ella, el cotizador en `top: 0`
en los dos.

- **CPU ×4:** telón a los 33 ms · **0 fotogramas** con la portada destapada antes de los 900 ms.
- **CPU ×6:** telón a los 117 ms · **0 fotogramas**.
- Altura **8.102 px** y los mismos ocultos tras la pasada de scroll, con intro y sin ella.
- `overflow` vuelve a `visible`, no queda `.intro` ni `intro-va`, y el cotizador da **1.087,31** para
  1.000.000 en los dos caminos.

#### Lo que la integración añadió por su cuenta

Una prop `zeroJs` en `Base.astro` y **`tests/zero-js.test.ts`**: 19 pruebas que fijan lo que era una
propiedad sin vigilante. Fallan si una de las cinco páginas estrena un `<script>`, si el marcador
llega donde no debe, si la intro se monta fuera de la Home, o si en la Home el marcador quedara
**después** de la intro — el fallo silencioso de arriba, convertido en test rojo.

Se comprobó que el detector mide: cuenta **6** scripts ejecutables en la Home y **0** en `/tarifas`.

---

### Notas de la integración de `2026-09-25-tarifas-v2`

**Veredicto: integrada, después de corregir la premisa.** Entrega `a7c2c544…`, verificada.

#### La afirmación central era falsa, y la entrega lo pedía comprobar

La ficha y el prompt decían, con estas palabras, «**no es una excepción a ninguna regla**». Eran
tres, y no se vieron porque la copia de `src/` que tenía Cowork son dos archivos:

| Dónde | Qué decía |
|---|---|
| **DS §4.5** | `--elev-card` → «**Sólo** la tarjeta del cotizador sobre la tinta» |
| **DS §4.5** | `--elev-pop` → «Menús/popovers (futuro)» |
| **`tokens.css`** | `--r-card` → «sólo la tarjeta del cotizador flotando sobre tinta» |

Esos tokens no se quedaban en la portada por descuido: estaban acotados por escrito. Y la regla no
estaba muerta —`BusinessEmblem.astro` lleva escrito que le quitaron `--elev-card` por §4.5— pero
tampoco se cumplía: `Header.astro` y `Steps.astro` la incumplían desde antes.

**Sebastián eligió reescribir §4.5 en vez de excepcionarla**, que era la salida honesta: una regla
que el propio proyecto incumple dos veces no protege nada. La versión nueva elige la elevación por
lo que el objeto ES y trae tres límites duros, incluido el que la entrega ya proponía por su cuenta
— la superficie alterna con el papel.

**El segundo dato también era falso, y por un motivo que conviene recordar al medir:** «las páginas
interiores no usan esos tokens» sale de mirar las hojas de estilo por página. Los usan **todas**, a
través de `Header.astro`. Un `grep` por hoja de página no ve lo que entra por un componente
compartido.

#### Lo que la integración cambió respecto a la maqueta

- **Las cifras no van escritas a mano.** Salen de `ConfigPriceSource → convert`, la misma cadena
  del cotizador. Esta página no puede desincronizarse de lo que el cotizador aplica.
- **«El monto» tenía dos `<text>` de 11 px dentro de un SVG que escala** — la regla que la propia
  ficha fija en su §4 y que vuelve a romper en la misma entrega. A 320 px la tarjeta mide ~280 y
  habrían caído a **10,2 px**, por debajo de su propio piso. Salieron del SVG.
- **Una octava cadena que no estaba en la lista de siete:** «El filete gris del borde es la marca
  que el sistema ya usa para lo que existe, es real y no es nuestro». Es la página explicándole al
  lector su gramática visual — una nota de diseño colada en el copy. No se integró.
- **La maqueta había perdido el enlace de WhatsApp del `PendingNotice`.** Es la única salida de la
  página. Se conservó.
- **No se inventó un segundo mecanismo de montaje.** `PageHero` ya tiene `layout="stacked"` con
  `--montaje`, construido para que una pieza sobresalga de la banda oscura; es lo que usa el
  portátil de `/empresas`.

#### Un fallo mío, del tipo que no da error

La tarjeta vive **dentro** de la ranura de `PageHero`, que es una banda en tinta y fija
`color: var(--on-tinta)`. Sin declarar `color`, la cifra «2.000.000» heredaba blanco roto sobre
papel: **ilegible, y sin un solo error en ninguna parte**. Lo vi en la captura, no en el código.
Ahora da 14,5:1.

#### Comprobado sobre el render, no sobre la maqueta

Sin scroll horizontal a 320, 390 y 1280 · rótulo más pequeño **13 px** en los tres, contra el piso
de 11 que fijó la entrega · cero `<text>` dentro de SVG · la barra no está partida y después del
punteado no hay nada · **un solo `--elev-card`** en la página, que es el límite nuevo · barra en
`--verde-deep` sobre papel y cifra en `--verde` sobre tinta · orden de lectura en el móvil
`barra → el precio que ves → acá termina`.

Y la página **sigue en cero bytes ejecutables**: salió de `Legal.astro` pero `zeroJs` viaja igual, y
`tests/zero-js.test.ts` lo comprueba sobre el build.

El `main` pasa de **1.428 px a 2.464 px** a 1280 — la ficha estimaba 2.787.

#### Dos cosas de su §7

La columna descentrada de `/preguntas` **ya está resuelta** (`8e11a53`): se quitó el tope de 760 en
vez de centrarla, porque el borde izquierdo coincidía con el del titular. Y las cifras de planicie
que cita —1.428 y 4.479 px— salen del build del 24; la de `/tarifas` ya no vale.

---

### Notas de la integración de `2026-09-25-como-funciona-v2`

**Veredicto: integrada, con el teléfono montado.** Entrega `e6ab9aea…`, verificada.

#### Su diagnóstico era correcto, y esta vez lo comprobaron antes de dibujar

Todo lo que afirman se sostiene contra el build de hoy: **3.001 px de `main`** (decían 3.007),
**cero anclas** de más de 24×24, **cero sombras** en todo el `main`, `WhatsAppMockup` usado sólo por
`Process` y `MacbookMockup`, el reparto saliendo de `step.who`, y el tiempo del paso 06 con su
marcador de Compliance.

**Y la decisión que mejor habla de la entrega es la que NO tomaron:** descartaron su propia idea
principal —agrandar los tiempos de los seis pasos— al leer que el del paso 06 lleva
`REQUIERE VALIDACIÓN DE COMPLIANCE`. Agrandar una cifra sin validar a tamaño de titular es el error
del `PendingNotice`, dos veces corregido. Es la primera entrega que comprueba la regla antes de
dibujar en vez de justificarse después.

#### Dos afirmaciones que no se sostienen

- **«La página sigue en cero bytes ejecutables si hoy lo está» — no lo está.** `/como-funciona`
  lleva cuatro `<script>`, uno de ellos un módulo. Es una de las ocho páginas con JavaScript. Las
  cinco que sí hay que cuidar son otras, y siguen intactas.
- **«En móvil el suelo es lo único que marca el reparto» — tampoco.** A 390 px siguen visibles
  **cuatro marcas de traspaso**. El suelo no carga solo, y menos aún haciendo 1,10:1.

#### El suelo va al revés que la maqueta, y el motivo importa

La entrega ponía los pasos de DLPay sobre `--papel-2`. Eso obligaba a pasar `.detail` a `--papel`
— **un tercer cambio que la entrega no declaraba**. Y habría roto algo: la página alterna sus
cuatro secciones a propósito (papel-2 · papel · papel-2 · papel), y con ese cambio `.detail` y
`.prep` quedaban las dos claras y pegadas.

Así que la sección se queda y **lo que se aclara es el paso**. La información es idéntica —el suelo
cambia donde cambia de manos— y el contraste mejora: 16:1 contra 14,5:1.

**Comprobado que sale del dato y no de una lista** (su comprobación 5): al cambiar el `who` del paso
04 en `process.ts`, se mueven el suelo **y** las marcas de traspaso; al revertir, vuelven los tres.

#### El hilo pasa a tener un solo dueño

Las tres burbujas eran literales de `Process.astro`. Copiarlas habría dejado **dos dueños de la
misma línea** en dos páginas — el fallo que D24 cerró para el monto mínimo y el que llevó
`content/scope.ts` a existir. Salieron a `content/process.ts` como `chatLines(monto, tasa)`, y
`Process.astro` lee de ahí. Comprobado que el HTML de la Home y el de esta página quedan **byte a
byte idénticos** tras la extracción.

#### Un fallo mío, el de anteayer al revés

Escribí el pie del teléfono en `--on-tinta` porque el teléfono está en la banda oscura. Pero el
bloque **monta**, y el pie es lo último que hay dentro: cae entero sobre la sección clara —la banda
termina en 769 px y el pie empieza en 839—. Blanco roto sobre claro, ilegible, sin error en ninguna
parte. En `/tarifas` fue la herencia de color hacia dentro; acá, el desbordamiento hacia fuera. **La
misma trampa tiene dos direcciones.**

#### Una aclaración que el §4.5 necesitaba

Su comprobación 2 pedía «una sola sombra en la página» y el render da **cuatro**: el bisel del
teléfono y el filete de 1 px de cada burbuja. No es un fallo — son cromo del propio mockup, que
describe un objeto de otra marca, y el componente ya declara esos tonos fuera del sistema.

El §4.5 ahora lo dice: **el límite de uno por página cuenta tokens de elevación, no `box-shadow`.**
Un teléfono se eleva con su bisel y no gasta el `--elev-card` de la página. Esta página usa **cero**.

#### Y lo de siempre

Borrado `cowork/_tmp-dist.tar.gz` (356 KB), como pedían.

---

### Notas de la integración de `2026-09-25-confianza-v2`

**Veredicto: integrada, con el nombre del banco fuera de la portada.** Entrega `d254b371…`.

#### Su diagnóstico, verificado entero

La banda mide **322 px exactos**, la figura empezaba **337 px** bajo la bajada, la figura es HTML
con cero SVG, y la entrega no trae **ni una** cadena nueva. Todo correcto.

#### Su mejor hallazgo no dependía de mover nada

Sobre papel, los dos tramos que **no** son nuestros iban en `--ink` a **16,00:1** y el que sí lo es
en `--verde-deep` a **5,44:1**: lo ajeno se dibujaba **2,9 veces más fuerte** que lo propio, justo
encima de una leyenda que dice «el tramo verde es el único que es nuestro». El dibujo contradecía a
su pie, y el §6.2 tiene la marca exacta para lo ajeno sin que esta figura la usara.

Sobre tinta queda al derecho: ajeno **3,50:1**, nuestro **8,45:1** — lo propio pesa 2,4 veces más.

#### Su §3 dimensionaba corto, y era la parte que decidía Sebastián

Decían «la mención de BCI sube a la portada», en singular. **Eran dos**: el rótulo del tramo nuestro
en `phases` y el `figcaption`. Y la del `figcaption` era **la única de las tres de la página sin
marcador**.

Sebastián eligió su tercera salida —que ellos no proponían—: la figura sube y el nombre no. El
tramo del medio se lee «En la cuenta de DLPay» y el banco se queda abajo, en `mechanisms`, con su
marcador.

**Quitar el nombre estrecha el claim, no lo amplía**, así que no necesitó firma nueva. La página
pasa de **tres menciones del banco a una**, y es la que sí está marcada.

#### Un error propio que casi reporto como hallazgo

La primera medición de la barra ajena sobre tinta dio **16,44:1** — que habría sido peor que antes
de moverla, y me habría hecho reportar un empeoramiento inexistente. Era la sonda leyendo
`rgba(237,242,239,.40)` sin componerlo contra la tinta: se quedaba con los tres primeros números e
ignoraba el alfa. Compuesto da 3,50:1.

Es **la regla 1 de evidencia** —«todo color con alfa declara contra qué compone»— y la rompí en el
instrumento, no en la pieza. Vale la pena que quede: la regla se escribió para las propuestas, y se
aplica igual a las mediciones que las comprueban.

#### Una nota de composición

Su render conserva el titular a la izquierda, pero la ranura `aside` de `PageHero` sólo ofrece
`split` —la figura apretada en media columna— o `stacked`, que **centra el titular**. Va `stacked`
sin `--montaje`: la figura se queda dentro de la banda, que es lo que la maqueta enseña. `/confianza`
es la cuarta página con esa portada.

#### Y lo de siempre

Borrado `cowork/_tmp-dist-borrar.tar.gz` (361 KB), como pedían.

---

### Revisión del material pendiente de Cowork  ·  2026-09-28

**Cero entregas nuevas desde el 25 por la noche.** Lo que había eran cuatro cosas sin resolver, y
dos de ellas no eran trabajo: eran restos.

#### 1 · Su revisión de `/preguntas` v2 — medida contra el build de hoy

Cowork dejó 71 líneas de revisión en la ficha de `2026-09-24-preguntas-v2` y nunca se habían
commiteado. Su petición concreta —«la columna de 760 px no está centrada, las otras dos del sitio
sí»— **ya está resuelta** desde `8e11a53`, y por el camino contrario al que proponía: en vez de
centrar una columna de 760 se retiró el tope, porque el borde izquierdo coincidía con el del
titular. Medido hoy: **141 / 141 a 1280 y 20 / 20 a 390**. Los 288 px vacíos que reportaba no
existen.

**Lo que sigue en pie, y no lo pide de vuelta:** la página mide **5.155 px a 1280 y 6.681 a 390**
—unas diecisiete pantallas— con **cero** formas de saltar a una sección desde la propia página. Las
seis secciones tienen `id` y los enlaces profundos funcionan; lo que no hay es nada que enlace a
ellos. El índice pegajoso lo retiró Sebastián por estética el 2026-09-24, y esto es el coste medido
de esa decisión, no una objeción a ella.

*Una corrección a su medición:* decía «513 px de blanco a la derecha de la línea más larga». Hoy son
**589**, y no es un empeoramiento: el texto no se movió —la respuesta más larga sigue midiendo
423 px, acotada por sus 47ch— y lo que creció fue el bloque, cuyos filetes y rótulos `persona y
empresa` ahora llegan al borde. Lo que antes era un hueco sin marcar hoy tiene un marco.

#### 2 · Una lección rescatada de una ficha extraviada

En la carpeta de `precio-que-aceptas` había un `ficha-1.md` que no era de esa entrega: era la ficha
**v5** de la intro de marca, caída ahí por el renombrado de descargas. La versión final no conserva
su §4, y ahí había algo que merecía sobrevivir — está ahora como **regla 35**: un presupuesto de
tiempo que confunde reloj de pared con aparato lento mata justo lo que pretende proteger.

Extraída la lección, el archivo se borra. **Dos fichas de la misma pieza con md5 distintos en dos
carpetas distintas es exactamente la trampa que nos costó dos días con esta entrega**, y guardar la
v5 al lado de la final la reabre.

#### 3 · Restos de instrumental

- `ziKncPYB` — 385 KB, un zip sin extensión, del 25 a las 16:48. Mismo minuto que el
  `_tmp-dist.tar.gz` que pidieron borrar ese día: es otro volcado del build para medir desde el
  contenedor.
- `_tmp-dist-cowork.zip` — **0 bytes**. Un volcado que falló.
- `datos-tmp.json` — 4,9 KB, y éste **estaba versionado**. Es la copia de las nueve preguntas que
  Cowork usó para maquetar `/preguntas`, con su texto duplicado fuera de `home.ts` y
  `business.ts`. Nadie lo cita. Es contenido con dos dueños esperando a divergir, que es el fallo
  que `content/scope.ts` y `chatLines()` existen para evitar.

Los tres borrados. **Y conviene que quede la pauta**, porque van cuatro veces en cinco días: el
instrumental de medición de Cowork no vive en `cowork/`. Si hace falta un volcado del build, lo
prepara el agente de Claude Code y va fuera del repositorio, como el zip que se les pasa.

---

### Notas de la integración de `2026-09-28-movimiento-que-ya-esta-permitido`

Tres puntos, **uno integrado y dos no**. Y los dos que no fallaron por el mismo motivo de método:
comprobaron una regla y no la otra.

#### B · Integrado, y mejor de lo que pedía  ·  `eb7e6e8`

Su auditoría —«303 interactivos, 72 sin ninguna transición»— **es correcta**. Repetida sobre las
once rutas, que son más de las ocho que midieron: **93 de 405**. Su criterio de dejar `a.skip` en
paz también era el bueno; ese enlace sólo existe al recibir el foco y ahí manda su `outline`.

Entró como **base en `tokens.css` con `:where()`** en vez de como 82 reglas nuevas: 24 líneas, cero
JavaScript, 93 → 0, y **un control que se añada mañana lo hereda sin que nadie se acuerde**. La
especificidad cero de `:where()` es lo que permite que cualquier componente siga pisándolo.

#### A · Rechazado — el §9 lo permite, pero el M2 ya lo especifica

Ver la **regla 36**, que nace de acá. Además de la cuestión de método hay una de contenido, y es la
que cierra la puerta: los 17 valores intermedios de su recorrido **son precios que nunca fueron el
precio**, en la página cuya disciplina entera consiste en no publicar cifras que no son. El
comentario de `Quoter.astro` ya lo decía —«no es un conteo desde cero: eso mostraría precios
falsos»— y arrancar del valor anterior en lugar de cero no lo arregla. La segunda línea del mismo
comentario descarta el resto: animar al teclear añade el retardo percibido que este cotizador
existe para no tener.

#### C · Rechazado por Sebastián — y la ficha decía la página equivocada

Su §4 se titulaba «el dibujo de la geometría en `/empresas`» y afirmaba que `UseCaseFigure` tiene
nueve trazos ahí. **`/empresas` tiene cero.** Los nueve están en **la Home**, en «Tres usos»:
`UseCases.astro` es lo único que renderiza esa figura y sólo lo importa `index.astro`. Un
`grep -rln UseCases src/pages/` lo dice en un segundo.

Eso convirtió la propuesta en otra cosa sin que su autor lo supiera: no era añadir movimiento a una
página interior plana, era **cambiar la Home**, que es la página que Sebastián declaró «caso
aparte». Se le llevó como decisión suya y dijo **«no lo quiero, al final traería más problemas que
venir a resolver algo»**. Queda cerrado: no se vuelve a proponer para la Home.

Lo que sí era bueno del punto C y conviene no perder: sus dos trampas. `.edge` lleva
`stroke-dasharray="3 4"` y `data-draw` lo destruiría. *(Sobre `--draw-len`: el runtime de
`Motion.astro` ya lo fija por trazo con `getTotalLength()` —comprobado, un trazo de 49 recibe 50—,
así que el 120 por omisión sólo muerde en la ventana anterior a que corra el módulo.)*

#### Un fallo mío al verificarlo, que es la regla 34 por tercera vez

Mi primera medición del punto B dio **«0 controles sin transición»** y estuve a punto de reportar
que su auditoría estaba inflada. Era falsa: corrí el navegador con `prefers-reduced-motion` activo,
y en este sitio ese modo le pone `transition-duration: .01ms !important` a **todo**. Nada podía
leerse como sin transición. El instrumento medía el modo, no el sitio. El número real es 93.

**Van tres veces en cinco días.** La conclusión operativa, que también se le pasó a Cowork: cuando
una medición devuelve el número que esperabas o un cero redondo, hay que sospechar del instrumento
antes de escribir la conclusión.

Se les pasó un texto de corrección con todo esto para hablarlo, a pedido de Sebastián.

---

### Notas de la integración de `2026-09-28-puente-home-tarifas`  ·  `3a32854` + `59f904b`

La primera pieza de una familia de cinco: un bloque partido por la diagonal de la marca, **papel
donde está el texto —que es la página en la que estás— y tinta donde está la figura —que es la
otra—**. El umbral no se dibuja con un marco: es el fondo.

#### Su §8 pedía medir antes de integrar, y algo había cambiado

Su copia era de `9ce2684` y ese mismo día el cotizador adelgazó: el héroe bajó 87 px y todo lo de
abajo se movió entre 77 y 91. **Pero las dos cifras que sostienen la elección de la posición no
cambiaron**, y por un motivo que conviene entender: el cotizador vive *dentro* del héroe, así que
encogerlo acortó la banda oscura y no el papel.

- El papel seguido entre las dos bandas oscuras sigue siendo **5.284 px exactos**.
- La distancia desde la última aparición del precio es **1.290 px** contra los 1.300 que citaban.

**La decisión de la posición E no hay que rehacerla.** Y la junta sale limpia: `process` es papel,
`trust` es papel-2, así que la mitad de tinta toca papel-2 por abajo — sin oscuro contra oscuro en
ninguna costura.

#### La excepción quedó escrita antes del código

**Design System §4.7.** Una sección tiene un fondo y eso sigue siendo la regla; la excepción es para
un bloque **cuyo asunto es cruzar**, con cinco límites escritos —hoy seis— incluido el que impide
que se extienda: no autoriza dos fondos en general, sino que un puente entre dos páginas enseñe las
dos. No gasta elevación, así que el límite de uno por página del §4.5 queda intacto.

#### Un archivo, no una carcasa con ranura — y la carcasa el mismo día

La entrega proponía ya `Puente.astro` + `FiguraTarifas.astro` porque vienen cuatro más. Entró como
**un archivo suelto**, citando el Principio 5: la carcasa se extrae «cuando aparezca el segundo, con
dos casos reales delante en vez de con uno y una previsión». Ellos habían dejado esa puerta abierta.

**El segundo apareció el mismo día**, así que la condición se cumplió y la carcasa salió en
`59f904b`, con dos casos delante y no con la previsión de cinco. Comprobado que no cambia nada:
alturas del puente de la Home **534 / 534 / 529 / 490 / 490** antes y después, y la llave sigue
midiendo exactamente lo que mide la barra en los cinco anchos.

El refactor trajo además una mejora que no estaba pedida: **el `id` del titular se deriva del
titular** en vez de ir escrito a mano. Con dos puentes y tres por venir, un `id` fijo se repetiría
el día que dos convivan en la misma página y `aria-labelledby` apuntaría al equivocado — es el mismo
fallo silencioso que se cerró en `Faq.astro`.

#### Qué firmó Sebastián

Como Compliance: «el número que viste» y «Ver las tarifas», las dos nuevas —cero apariciones previas
en `src/`—, y el párrafo del cuerpo, que es un **empalme de dos frases ya publicadas de
`/tarifas`**. La frase unida no existía publicada; no sube el peso de ninguna de las dos, pero las
junta, y eso fue a propósito. Queda en la cabecera del componente con el reparo delante.

#### Reproducido, con dos sondas mías mal hechas por el camino

Alturas 534 / 534 / 529 / 490 / 490 contra sus 534 / 529 / 529 / 490 / 490. Holgura contra el corte:
**78–82 px** por la figura, su rango exacto, y **112–196** por el texto. Los siete contrastes de su
tabla, clavados. Cero desborde y cero scroll de 320 a 2560. Texto mínimo 13 px. Con
`prefers-reduced-motion`, opacidad 1 y sin transformación; sin JavaScript, las cuatro piezas
visibles.

Las dos sondas: primero medí la holgura entre las dos esquinas más cercanas y me dijo que texto y
figura estaban «del mismo lado del corte», que era falso —lo desmintió la captura—; después medí el
borde de la **columna** del texto en vez de donde acaba su tinta, y me dio −68 px.

---

### Notas de la integración de `2026-09-28-puente-tarifas-confianza`  ·  `9d1eb60`

La segunda pieza, y la que convirtió la carcasa en carcasa. La línea de tenencia al otro lado del
corte, **en la misma carcasa que la primera sin tocarle una línea**. Entra justo bajo la frase que
la justifica —«te lo informa tu ejecutivo antes de que transfieras»— y su rótulo la repite literal.

#### La decisión que no pudieron medir, medida

Proponían dos caminos para que una banda a todo el ancho viva dentro de un contenedor con relleno,
y **no pudieron comprobar el riesgo del segundo porque su navegador usa barras superpuestas**. El
mío usa barras clásicas de 15 px, así que se pudo: con `margin-inline: calc(50% - 50vw)`, `50vw`
incluye la barra y `50%` no, y el bloque cruza el borde. El `.lienzo` de `/precio`, que ya usa esa
técnica, **se sale 2 px hoy** en ese caso — la página no llega a tener scroll horizontal, algo lo
absorbe, pero la tinta cruza.

Así que va la opción que recomendaban: **el cuerpo se parte en dos y el puente queda hermano suyo**,
como en la Home. Cero riesgo y las dos piezas de la familia construidas igual. *Hicieron lo correcto: dejaron el
riesgo marcado como no comprobado en vez de resolverlo por el lado que su entorno hacía parecer
seguro. Es la misma familia que la instrucción permanente 11 —una medida es una foto de un build—
ampliada a otra cosa: **también es una foto del navegador que la tomó.** Una barra superpuesta y
una clásica no miden lo mismo, y acá la diferencia era 2 px de tinta fuera del contenedor.*

#### Dónde no va, y eso sirve para los tres que faltan

**Al final de una página interior, no.** La mitad de tinta desembocaría en el pie, que también es
tinta, y las dos se funden: el bloque pierde su canto inferior y la figura parece del pie. Le pasa a
las cuatro páginas interiores porque todas terminan en el mismo pie oscuro. Queda escrito en el
**§4.7** como sexto límite. Acá el puente entra a media página y le quedan **489 px de papel** por
debajo.

#### `subgrid`, y no era cosmética

Los tres rótulos no miden lo mismo —«En la cuenta de DLPay» ocupa dos líneas y «En tu billetera»
una— y sin filas compartidas las tres barras quedarían a tres alturas distintas: **la línea de
tenencia dejaría de leerse como una línea**, que es lo único que la figura viene a decir.
Comprobado, las tres barras alineadas a los seis anchos.

La figura lee de `content/trust.ts`, el mismo origen que `/confianza`, así que **hereda el dato ya
estrechado del 2026-09-25** —el nombre del banco salió de `phases`— y no puede reintroducirlo.

Y no trae la nota «Acá confirmamos que llegó, antes de mover nada»: 45 caracteres en una columna de
177 px son cuatro líneas que desarman la miniatura. El argumento no se pierde porque **esa frase
pasa al rótulo del bloque**.

#### Qué firmó Sebastián

«Ver Confianza», nueva, y el párrafo del cuerpo, que empalma la segunda mitad de la bajada de
`/confianza` con la entradilla de «Qué pasa con tu plata». El reparo de Cowork queda en la cabecera:
juntas suenan a promesa de verificación, aunque ninguna de las dos afirme nada que `/confianza` no
afirme.

#### Reproducido

Alturas **644 / 624 / 564 / 525 / 525 / 525** a 320, 390, 768, 960, 1280 y 2560 — su tabla exacta.
Texto mínimo 13 px, cero desborde, cero scroll horizontal, cero elementos ocultos.

**Su petición sobre el §4.7 era correcta y la cifra no.** Pedían ampliar el rango de la familia por
el lado de la figura «de 78–82 a 61–82». Medido acá da **60 px planos** a partir de 960, así que el
§4.7 dice ahora **60 a 82** — y el piso sigue siendo 40, que queda lejos. Por el lado del texto,
93–196.

Y **`/tarifas` sigue en cero bytes ejecutables**: no carga `Motion.astro`, así que ahí el puente se
ve completo y quieto, con cero elementos en `opacity: 0`. Ése es el estado base del §9 y no una
degradación.

---

### Notas de la integración de `2026-09-28-puente-precio-tarifas` y `2026-09-28-puente-comofunciona-articulo`

Los puentes 3 y 4, integrados juntos. Con ellos la familia queda en **cuatro de cinco** y la carcasa
ha aguantado los cuatro **sin una línea nueva**, salvo un valor que resultó que era suyo desde el
segundo (ver abajo).

#### Primero: los archivos no estaban, y el md5 no protegía nada

El prompt del puente 4 llegó solo, sin carpeta. No era que faltaran: estaban en `Claude outputs/`
con nombres genéricos —`ficha.md`, `prompt-agente-2.md`— porque tres entregas del mismo día usaron
el mismo nombre y el sistema resolvió las colisiones con sufijos. El prompt decía «lee `ficha.md`»,
que en esa carpeta es la ficha de **otra** pieza.

Y una cosa peor, que conviene no pasar por alto: **ese primer prompt citaba el md5 `cd7a23f8…`, que
no corresponde a ningún archivo de la carpeta.** La maqueta nunca cambió —su suma es `c898096e…`
desde el principio—, así que la verificación apuntaba al vacío. Queda como **convención 3.a**: el
nombre de la entrega va por delante del nombre del archivo, y los prompts citan el nombre completo.

Los dos md5 de la entrega definitiva se comprobaron: `3cfd2388…` y `c898096e…`, los dos exactos.

#### Las dos objeciones al puente 4, concedidas por Cowork, y el tercer fallo que apareció detrás

La primera versión del prompt afirmaba que `/tarifas` era la única página sin `Motion.astro` (son
**cinco**: las cuatro legales y la 404) y que la columna de la figura medía 556 px (son **460 a 1280
y 384 a 960**; 556 era `--container ÷ 2` sin el relleno ni el `gap`). Cowork concedió las dos, y al
comprobar la segunda encontró el fallo que de verdad importaba: **`justify-self: end` no movía el
dibujo, lo encogía.** La celda pasa a ajustarse al contenido y un `<svg>` con `width: 100%` no tiene
ancho intrínseco, así que colapsaba a 300 px. Sus «136–212 px de holgura» eran 160 px de
encogimiento disfrazados.

La solución que entregó —`margin-inline-start: auto` y tope de **360 px**— es la correcta y su
barrido reproduce: con 420 la esquina superior del riel queda a 33 px del corte, bajo el piso de 40,
y a 960 el dibujo llena la columna y no hay holgura que ganar. 360 es el primer valor que pasa el
piso en los dos extremos.

**Es el mejor ciclo de corrección que ha tenido esta colaboración**: dos objeciones, las dos
aceptadas, y una tercera cosa encontrada por el propio autor al ir a comprobarlas. Eso último no lo
había hecho antes.

#### El valor de la carcasa que llevaba tres entregas cambiado sin avisar

La maqueta del puente 1 topa el titular en `14ch`; las de los puentes 2, 3 y 4 en `15ch`, y los tres
prompts dicen «usa `Puente.astro` tal cual». Los titulares del 2 y del 4 miden igual a 14 y a 15ch,
así que sus tablas reprodujeron y nadie lo notó. El del 3 no: «Las condiciones se acuerdan contigo»
son **3 líneas a 14ch y 2 a 15ch**, 35 px contra una tabla que decía 465.

Comprobado antes de tocar: **15ch no mueve a ninguno de los otros tres, y 16ch reflowaría el
puente 2.** Así que la carcasa pasa a 15ch y la tabla del puente 3 reproduce exacta. Queda como
**regla 37**.

#### Lo que cada figura trae, y una nota de la segunda que no es menor

**`FiguraMonto.astro`** es «El monto» de `/tarifas`: una línea recta, un corte punteado y dos
palabras. Hereda la regla dura de la cabecera de `tarifas.astro` —**no lleva barras ascendentes**,
porque escalones afirmarían tramos y los tramos son **D5**—. Y contesta literalmente a lo último que
dice `/precio`: «no publicamos una tabla por tramos». La clase de la nota se llama `.dice` y no
`.nota` porque `/precio` ya tiene una `.nota` con otro significado; el ámbito de Astro las separaría,
pero dos cosas distintas con el mismo nombre en una página es de lo que avisa la regla 32.

**`FiguraRiel.astro`** es el riel del artículo, y el SVG se copió **del artículo, no de la maqueta**
— comprobado idéntico trazo por trazo. El comentario del artículo ya había previsto este día: «si
una segunda pieza la necesita, deja de ser contenido y pasa a ser componente». Con un matiz que
quedó escrito en la cabecera: **el artículo no puede consumir el componente**, porque es `.md` y no
`.mdx`, y un componente ahí obligaría a instalar `@astrojs/mdx` — dependencia nueva, que §0.3 no
admite sin el análisis del §8. Son dos copias del mismo dibujo, a propósito.

Y una mejora sobre la maqueta: **el rótulo del puente 4 es `hinge.from`, no una copia del texto.**
Es la misma frase que la bisagra del eje que queda justo encima, y las dos salen de
`content/scope.ts`. Para una figura que cruza de página la regla es copiar; para una frase de la
**misma** página, es no poder desincronizarse.

#### Reproducido, con el instrumento arreglado

| | 320 | 390 | 768 | 960 | 1280 | 2560 |
|---|---|---|---|---|---|---|
| **P3** alto | 485 | 485 | 485 | 465 | 465 | 465 |
| **P4** alto | 569 | 591 | 600 | 500 | 500 | 500 |

**La tabla del puente 3 es exacta.** La del 4 difiere en 5 px a 320 y a 390 —569 contra 574 y 591
contra 596— e **es idéntica de 768 en adelante**; la diferencia viene de su banco de pruebas, no de
la pieza.

Holguras por la tinta, midiendo **rectángulo por rectángulo** y no por la envolvente: P3 **86** la
figura y **107–177** el texto; P4 **45–115** la figura y **72–141** el texto. Con los cuatro
puentes medidos así el rango de la familia es **45–115 / 72–177**, y el piso de 40 se respeta con el
caso más justo en el puente 4 a 960 px. *Ni mis cifras anteriores ni las de Cowork valían: las dos
medían cajas. Queda como **regla 38** y el §4.7 se reescribió con la tabla de los cuatro.*

Lo demás: cero recortado y cero fuera de `.puente` —que lleva `overflow: hidden`—, cero scroll
horizontal de 320 a 2560, texto mínimo 13 px, botones 187×57 y 194×57. Contrastes sobre tinta 8,18 /
16,44 / 8,18 y sobre papel 5,50 / 16,00 / 5,50, más 8,58 del botón; las figuras 8,18 y 8,45 sobre
tinta. Con `prefers-reduced-motion` y sin JavaScript, una pieza visible y quieta en los dos.

#### Su §6: los dos botones verdes, medidos

Cowork pidió que lo mirara antes de integrar. Son **345 px**, no 380, y pasa **igual en las dos
páginas**: el botón del puente y el «Cotizar ahora» de la banda de cierre, los dos en `#16C784`, los
dos visibles a la vez en una ventana de 900 px de alto. Roza el «una sola acción primaria por
pantalla» de `CLAUDE.md` §6.

**Queda integrado como llegó y anotado para Sebastián**, con la recomendación de dejarlo: los dos
botones no compiten por la misma intención —uno lleva a leer, el otro a cotizar—, viven en
superficies distintas y uno va a la izquierda y el otro centrado. La alternativa que Cowork ofrecía
—bajar la banda de cierre a `ghost`— debilita la única banda de conversión del sitio y rompería que
las cuatro bandas de cierre hablen al mismo volumen. **Es la única cosa discutible de las dos
piezas.**

#### Papel por debajo, y el sexto límite

489 px en `/tarifas`, **345 en `/precio` y en `/como-funciona`**. Es el caso más justo de la familia y
sigue cumpliendo el límite: lo que hay debajo es una banda de cierre entera, no un margen. `/precio`
queda en 4.232 px de documento y `/como-funciona` en 4.675.

#### Lo que el puente 4 cierra, y que no estaba en la entrega

`/como-funciona` usa «dólar digital» **cuatro veces** en su `<main>` y no lo explicaba ninguna: eso
sí estaba. Lo que no: **su `<main>` no tenía un solo enlace a otra página del sitio.** Salía a tres
sitios —la app de registro, WhatsApp y el ancla del cotizador— y a ninguna página de contenido. Era
la única página de contenido del sitio así. El puente lo cierra, y con el enlace de vuelta que el
artículo ya tenía queda un circuito completo.

*Una decisión editorial que queda anotada:* con este puente, «desde ese punto decides tú» aparece
**tres veces** en la página —el paso 06, la bisagra del eje y el rótulo—, las dos últimas a 330 px
una de otra. Las tres son deliberadas y el código ya explicaba por qué las dos primeras. La tercera
es de Sebastián, que aprobó la entrega con el rótulo así.

#### Firmas

Sebastián aprobó las dos entregas por escrito. Las dos cadenas que lo necesitaban:

- **«Las condiciones se acuerdan contigo»** era una **cláusula dentro de un párrafo** del cuerpo de
  «El monto» en `/tarifas` y acá es titular. Subir una frase a titular le cambia el peso; no afirma
  nada que la página no diga, pero no es el mismo acto de habla. El aviso queda en la cabecera del
  bloque, como se hizo con la cadena 7 de `/tarifas`.
- **«Leer el artículo»**, la etiqueta del botón del puente 4, es la única cadena nueva de las dos
  entregas. El titular ya tenía firma del **2026-09-22**, con su marcador en el `.md` del artículo.

#### Queda uno, y Cowork ya avisó que hay que replantearlo

**`/empresas` → ?** Su ficha lo deja abierto con tres salidas y la decisión es de Sebastián: buscarle
otra cara a `/confianza` —los mecanismos, no la línea de tenencia, que ya la enseña el puente 2—,
mandar `/empresas` a `/tarifas` con «El monto» —que chocaría con el puente 3—, o no hacerla, porque
`/empresas` es la única página con su propia banda de contacto al cierre. **La objeción que la
frena es la buena:** dos puentes con el mismo dibujo es plantilla, que es justo lo que el puente 3
evitó.

---

### Notas de la revisión de la tanda del `2026-09-29`  ·  *tres de cuatro integradas*

Una tanda con cuatro asuntos y un prompt maestro. **Lo mejor que trae no es lo que hay que tocar:
es una corrección de su propio instrumento y un trabajo que resulta que no hay que hacer.**

#### §0 · Su detector no veía las figuras construidas en HTML, y lo dijo

Contaba `svg`, `figure` y `[class*=mockup]`, así que se le escapaban el eje de alcance, «El monto»
de `/tarifas` y la tabla de `/empresas`. Corregido, el mapa cambia de verdad: `/empresas` pasa de
«5 figuras, 54 % liso» a **7 figuras y 20 %**.

**Lo que pedían comprobar —si alguna cifra vieja quedó escrita en el repositorio— tiene respuesta
corta: no.** De los diez números del antes/después, el único que aparece en `cowork/` es `4.479`, y
es precisamente uno de los que **no** cambia. Nada que corregir.

*La regla que sacan es buena y la firmo:* **un recuento que no enumera lo que busca no cuenta;
enumera lo que sabe buscar.** Va con la regla 38 en la misma familia, y es la cuarta trampa de
instrumento de la semana. Mi propio barrido de punteados del mismo día cayó en la variante
geométrica: filtraba por ancho mayor que cero y `.edge` es una línea vertical.

#### §1 · `/empresas` no se toca, y ése es el resultado  ·  **Integrada como decisión**

Estaba en su lista de páginas planas por el recuento viejo. Con el detector corregido tiene **7
figuras y su tramo liso mayor es de 1.051 px sobre 5.179**, o sea **20 %: la mejor proporción de
todas las páginas interiores**, por delante de `/tarifas` (36 %) y `/precio` (30 %). Reproducido
exacto, figura por figura: el MacBook, los cuatro emblemas, la tabla y el eje de alcance.

Queda escrito acá para que nadie la vuelva a poner en la lista.

#### §2 · La regla de portada  ·  **Integrada** en el Design System **§4.8**

Su deducción original —«una lista o un documento no lleva portada»— era falsa y Sebastián la
corrigió: **las páginas legales no llevan portada a propósito, para darles seriedad**, y `/tarifas`
es la excepción dentro de las legales.

Lo que añade valor es la medición: **las trece portadas caen en dos familias con un hueco vacío de
172 px entre ellas.** Reproducidas **trece de trece exactas** a 1280 px: 781 / 660 / 569 / 529 / 460
con objeto, y 288 / 262 / 262 / 262 / 236 / 236 sin él. Entre 288 y 460 no hay ninguna, y eso es la
regla: una portada de altura intermedia es una que no ha decidido a qué familia pertenece.

*Dos cosas que añadí al escribirla:* el ancho al que se mide, porque la portada que proponen para
`/preguntas` mide 434 px a 320 y eso cae dentro del hueco —la regla vale a 1280—; y que **los
artículos del blog son su propio caso** y por eso no entran en la tabla: 256 px el de tokenizados
con su emblema y 246 el de stablecoins con su portada de cifra, los dos en la familia corta.

#### §3 · El filete de «Lo que no vas a leer acá»  ·  **Integrada**

**El mejor hallazgo de la tanda.** Las cinco afirmaciones que DLPay decide **no** hacer llevaban
`border-left: 2px solid var(--verde)`, y el §6.2 publica que una línea verde a lo largo de un tramo
significa **«el tramo que es nuestro»**. Dicen lo contrario de lo que la sección dice. Y la colisión
estaba dentro de la misma página: `.phase.is-ours` usa el mismo filete verde para marcar dónde el
dinero pasa a estar en nuestra cuenta.

Va en `--on-tinta-mute`, que es el token al que el §6.2 le da el significado exacto que hace falta:
«existe, es real, no es nuestro». Comprobado: **ahora el único filete verde de la página es
`.phase`**, y el nuevo compone a 8,18:1 sobre tinta.

*Dos precisiones a su ficha.* Contaron «cinco filetes verdes de 2 px»; de 2 px hay **cuatro**, y el
quinto que citan —`.ours` de `EjeDeAlcance`— mide 1 px y va en `--verde-deep` porque está sobre
papel. Da igual para su conclusión, y de hecho la refuerza: los dos precedentes del filete apagado
miden 1 px y 3 px, así que **el portador del significado es el color y no el grosor**. Y la distancia
entre los dos filetes contradictorios es de **1.920 px**, no 1.700.

**Lo accesorio queda sin hacer, a propósito:** pasar la sección de dos a tres columnas baja la
sección de 743 a 679 px, pero es un cambio de composición en una página que Sebastián afinó a mano
el 2026-09-25 —dos cabeceras centradas, el zigzag, y «lo demás déjalo tal cual»—. Eso lo decide él,
no entra con un arreglo de semántica.

*Y su «lo que NO hay que hacer» de esa misma página es correcto y conviene no perderlo:* el zigzag de
«Qué pasa con tu plata» parece desperdiciar media sección y no. A tres columnas la sección **sube**
de 906 a 1.158 px, y a dos columnas a 1.337. La mitad vacía es el precio de la medida de lectura de
47ch.

#### §4 · La portada de `/preguntas`  ·  **Pendiente de Sebastián, con un reparo que no es el suyo**

El dato de la figura reproduce **exacto**: persona 5 preguntas —`recibo` ×2, `alcance`, `precio`,
`requisitos`— y empresa 4 —`atencion`, `requisitos`, `alcance`, `precio`—, con `concern` tipado y ya
usado por la página para agrupar. Construirla desde los datos, como piden, es posible y es lo
correcto.

Ellos avisan de lo que hay que pedir: **el punto lleno neutro como «una pregunta» es una marca nueva
y hay que escribirla en el §6.2 antes de dibujar.** Correcto.

**Pero hay un reparo más de fondo, y es mío:** sería **la primera figura del sitio cuyo asunto no es
el dinero ni su movimiento**. La regla dura del §5 de `CLAUDE.md` dice que cada trazo representa
«movimiento, flujo de valor o un paso de un proceso», y un punto que significa «una pregunta» no es
ninguna de las tres. Así que la enmienda no es sólo a la tabla del §6.2: **toca una regla dura de
`CLAUDE.md`**, y eso es decisión de Sebastián, no del Design System.

A favor de concederla: el objeto de `/preguntas` **son** las nueve preguntas, así que la figura
cumple el §4.8 mejor que cualquier alternativa, y el sitio no tiene marca para un asunto que no es
dinero porque hasta hoy no ha tenido una página cuyo objeto no lo sea.

Queda también su pregunta de negocio, que es buena: la figura afirma que los dos públicos preguntan
casi lo mismo, y eso es cierto **con nueve preguntas**. Si `business.ts` va a crecer mucho, la figura
envejece.

#### §4 · La portada de `/preguntas`  ·  **Integrada** el 2026-09-29, tras conceder la enmienda

Sebastián concedió la enmienda de la regla dura del §5 de `CLAUDE.md`: un trazo puede representar
además **una pregunta del visitante**, y sólo eso. Queda escrita allá con su alcance —no autoriza un
trazo por «un tema» ni por «una sección», que sería un índice dibujado— y la marca concreta, **punto
lleno neutro = una pregunta**, en el §6.2.

**El dato reproduce exacto** y la figura se construye de él, como pedían: nueve puntos derivados de
contar `faq` por `concern` en `home.ts` y `business.ts`. El lienzo sale en **546×208**, que es el de
su maqueta, sin habérselo copiado: sale de tres constantes —40 de margen, 42 dentro de una
preocupación, 106 entre preocupaciones— y de los datos. Si mañana entra una pregunta, aparece su
punto y el lienzo se ensancha. No hizo falta una guarda propia: la que ya tenía la página, que falla
el build si una pregunta se queda sin grupo, es la misma condición que esto necesita.

**Dos defectos del montaje que su maqueta no podía ver**, porque los dos salen de la rejilla real:

1. **A 768 px la figura salía de 713 px de ancho, más que los 468 que tiene en escritorio.** El
   dibujo era más grande en la tableta que en el monitor y aplastaba al titular. Bajo 900 px la
   figura deja de ser columna y toma el contenedor entero. Resuelto con un tope de 480 px.
2. **En `layout="split"` la portada cerraba en 402 px, dentro del hueco de 288 a 460** que el §4.8
   declara prohibido, y que yo mismo acababa de escribir esta mañana. Mi primer intento fue estirar
   el dibujo: `BRAZO` de 70 a 96 subía a 447, seguía corto, y dejaba una figura espigada y llena de
   vacío. **El problema no era el dibujo: era el layout.** Una figura de 2,63:1 va apretada en media
   columna, y ésa es la razón por la que las otras tres interiores con figura ancha usan `stacked`.
   Con `stacked` el dibujo recupera sus proporciones originales y la portada cierra en **477 px**.

   *Queda escrito en el §4.8 como regla:* **antes de tocar un dibujo para que su portada entre en la
   familia, hay que mirar la rejilla.**

**Y una afirmación suya que era falsa, al revés de lo que parecía.** Su ficha decía que a 320 px
«ninguna portada del sitio llega a 460». Medido: en móvil las portadas con objeto **crecen** al
apilarse —Home 1137, `/como-funciona` 684, `/confianza` 669 a 390 px—. La de `/preguntas` es la
**única que se encoge**, a 448, porque una banda no gana alto al estrecharse. No rompe la regla,
que se mide a 1280, pero es la más liviana de su familia en móvil y ahora está escrito.

**Reproducido:** portada **477 px de 900 a 2560** y 504 a 768, dentro de su familia; 447 y 448 a 320
y 390. Nueve puntos, cero recortado, cero scroll horizontal, rótulos a 13 px y fuera del SVG, sin
solape con el dibujo. Contrastes sobre tinta: **eje 8,45 · punto 16,44 · rótulo 8,18**.

*Una cosa que decidí no arreglar, con su medición:* a 320 px el tallo cae a **0,61 px**, bajo el
umbral de 1 px. Se queda, y el argumento es del propio §6.2: **los dos trazos que cargan significado
aguantan** —el punto mide 5,34 px de diámetro y el eje 1,46—, y el que se afina es el único que no
afirma nada. La alternativa tenía coste: subir el grosor del tallo bajo 900 px lo dejaba en 2,2 px a
768 contra los 2,64 del eje, y entonces el trazo sin significado pesaría casi lo mismo que el que lo
tiene.

**Su pregunta de negocio sigue abierta y es para Sebastián:** la figura afirma que los dos públicos
preguntan casi lo mismo, y eso es cierto con nueve preguntas. Se construye de los datos, así que no
mentirá al añadir una; pero si `business.ts` va a multiplicarse, la portada dejará de decir lo que
dice hoy.


---

### Notas de la integración de `2026-09-30 · preguntas: la portada y la arquitectura`

**Integrada.** El componente `TabletMockup.astro` es nuevo; `/preguntas` cambia de portada, gana la
banda de entrada, una salida al acabar las preguntas y un «volver arriba». Las respuestas, los seis
grupos, el glosario y el cierre **no se tocan**.

**Su §0 se agradece y hay que decirlo.** En `Claude outputs/` había **cinco entregas de la misma
página** y cuatro estaban muertas; el prompt las enumera con nombre y dice de cada una por qué cae.
Sin eso, la probabilidad de integrar `pq-portada4-*` —la tableta con una página web dentro, que es
casi idéntica de nombre— era alta. **Que una entrega declare qué parte de sí misma está muerta es lo
más útil que ha traído una hasta ahora.**

#### Lo que reprodujo exacto

Portada **634 px** a 960, 1280 y 2560 · **649** a 768 · aparato 410×536 y pantalla 372×496 con la
proporción clavada en **1,33 en los seis anchos** · saliente 96/132 · **cero desborde horizontal** ·
página **6.989 px contra 6.294** a 1280 · HTML **35.780 → 37.415** (ellos predijeron 37.090) ·
scroll del primer grupo al sexto **2.284 px**, su número al píxel · los **seis enlaces de la banda
resuelven, ninguno roto**, y el título aterriza en **y = 64** en los seis.

Contrastes, medidos en el navegador: chasis/tinta **12,79** · chasis/papel **1,33** · bisel/chasis
**14,43** · `--ink` sobre la burbuja saliente **12,44** · sobre la entrante **16,00** · recuento de
la banda **5,44**. Todos los suyos, al segundo decimal.

**Una cifra suya que no reproduce:** el nombre sobre `--verde-deep` da **5,25 y no 4,72**. El número
4,72 viene del comentario del teléfono, que lo declara para el mismo par, así que **uno de los dos
está desfasado y el medido es 5,25**. Queda anotado en la cabecera del componente nuevo; el del
teléfono no se toca, porque arreglar un comentario pide medir su página.

#### Lo que difiere, y no es culpa de nadie: la barra de scroll

A 320 y 390 sus números vienen 15 px anchos. El ancho útil con barra clásica es 305 y 375, no 320 y
390, así que el aparato sale 265 y 335 en vez de 280 y 350, y **a 3:4 eso son 20 px menos de alto**:
portada 484 y 552 contra sus 479 y 572. Arriba de 768 no aparece, porque la pieza toca su tope de
410. **Está escrito en el §4.8:** una cifra móvil que no dice si había barra no es comparable.

#### Seis defectos en los archivos entregados

Todos de integración, ninguno de diseño. La página entregada es una **copia completa** de
`preguntas.astro`, y ahí está el riesgo: lo que se rompe al copiar 650 líneas no se ve en el
resultado renderizado.

1. **`.inner` desaparecida.** El diff borra
   `.inner { max-width: var(--container); margin: 0 auto; padding: 0 var(--pad-section-m) }` y **no
   la repone**: sólo queda la del `@media (min-width: 900px)`, que ajusta el relleno y no el tope.
   Publicado así, el cuerpo entero de la página pierde su contenedor a todos los anchos y el texto
   corre de canto a canto. **Y contamina sus propias medidas**, porque sin tope el texto envuelve
   menos y la página sale más corta de lo que saldría.
2. **`path="/pq-v4/"`** en el `<Base>` — su ruta de pruebas. Habría publicado el canonical, el
   Open Graph y la entrada del sitemap de `/preguntas` apuntando a una URL que no existe.
3. **Un comentario que contradice a su propio CSS.** El JSX sobre `.chat` dice «el hilo se apoya
   ABAJO… misma decisión que la variante `bare` del teléfono»; el CSS treinta líneas más abajo dice
   «**centrado, y no apoyado abajo**» y pone `justify-content: center`. Es un resto de la v4, y de
   los dos el que manda es el que se ejecuta.
4. **Tres bloques de comentario huérfanos.** Se retira la figura de nueve puntos y se quedan: el
   comentario de cabecera que la explicaba (**50 líneas**, con su geometría y sus marcas), el de
   `<style>` que decía «los estilos de la figura de las nueve preguntas», y el del `max-width` que
   la contenía. Más el JSX de la ranura del héroe, que seguía hablando de rótulos fuera del SVG.
5. **Un comentario de la versión anterior.** El bloque nuevo abre con «la portada: una tableta con
   **esta misma página dentro**», que describe la v4 —la tableta con la web en pantalla— y no la v5,
   que es una conversación.
6. **Tres arreglos menores que no cuestan nada.** `!important` en el tramo de una columna, evitable
   escribiendo los filetes **mobile-first** en vez de poniéndolos y quitándolos; `aria-label="Los
   seis grupos de preguntas"` con el número escrito, cuando la lista se deriva; y el `id` y el
   título de la sexta sección **escritos dos veces**, en la banda y en el marcado, que es exactamente
   cómo un ancla deja de apuntar a nada sin que nada falle. Ahora salen de un `PRACTICA` único.

*Y una cosa de forma:* los comentarios nuevos venían **sin tildes** («la pagina», «esta dicho»),
contra el resto del repositorio. Reescritos.

#### Su §10, punto por punto

**Corrección 1 — aceptada, y el número es el suyo.** La cabecera decía que la portada cierra en
523 px; medido sobre el build de ayer da **477**, que es lo que el §4.8 ya publicaba. Los 523 salían
de su maqueta y los 477 del build: **dos números para la misma cosa, y el que estaba en el código
era el que nadie había medido en su sitio.** La cabecera se reescribe con esta entrega, así que se
resuelve sola.

**Corrección 2 — rechazada, y por el mismo motivo que la vez pasada.** Dice que el §4.8 «está
redactado como si valiera para todos los anchos» y que «en móvil ninguna portada del sitio llega a
460». Las dos mitades fallan: el §4.8 **ya dice** «el rango se mide a 1280 y sólo ahí», y en móvil
**tres de las seis pasan de 660** —Home 1137, `/como-funciona` 684, `/confianza` 669—. Es **la misma
afirmación falsa que ya trajo el 2026-09-29** y que ya está desmentida quince párrafos más arriba en
este archivo. Sí se afinó el §4.8, pero con lo que sí es verdad: una portada gana alto al apilarse y
lo pierde si su pieza se encoge a lo ancho, y por eso la tableta baja de 634 a 552.

#### Lo que la entrega no vio, y era lo más caro

**Retirar la figura de nueve puntos deja sin consumidor una marca del vocabulario y una enmienda de
una regla dura.** El punto lleno neutro —«una pregunta del visitante»— y la enmienda del
`CLAUDE.md` §5 que hizo falta para dibujarlo nacieron **el día anterior** para esa figura. Con ella
fuera, el Design System §6.2 seguía afirmando en su tabla de «lo que las figuras usan hoy» algo que
el build ya no hace, y esa tabla se escribe **midiendo**.

Resuelto así: la marca sale de la tabla y baja a una nota que cuenta que existió un día; la
concesión **se conserva**, porque la dio Sebastián y no se revoca por falta de uso. La lección va en
los dos documentos: *una marca se puede escribir antes de dibujarla, con razón, y aun así quedarse
sin nada que describir, porque el dibujo que la pedía puede caer por motivos que no tienen que ver
con ella.*

#### Sus tres «no las arregles», verificadas

Pide no tocar tres decisiones. Las tres se quedan, **y una de ellas tiene ahora un argumento mejor
que el suyo**:

- **Un solo intercambio.** Su razón era que la respuesta de los doce minutos —once líneas— empujaba
  su pregunta fuera de la pantalla. Cierto, pero eso sólo descarta **ese** par. Probé el segundo par
  con las dos respuestas cortas: a 1280 el hilo pasa de 177 a **414 px sobre 444 útiles** y entra
  raspando; **a 390 pide 433 sobre 357 y se sale por 76 px**, y con el hilo centrado eso recorta
  **por los dos extremos a la vez**, 38 arriba y 38 abajo. Una burbuja cortada por arriba es un
  fallo de maquetación, no una conversación con historia. **Un intercambio es lo único que sobrevive
  a 320 px**, y eso es más fuerte que «con dos quedaba raro». Está escrito en el componente.
- **El hilo centrado.** Centra exacto: **133 px de vacío arriba y 133 abajo**, medidos.
- **La proporción fija en 3:4.** Se mantiene en 1,33 en los seis anchos.

#### Una cosa para Sebastián, con su número

**El hilo ocupa el 40 % de la pantalla a 1280** y el 50 % a 390. Es la consecuencia aritmética de
sus tres decisiones juntas —un intercambio, centrado, 3:4— y ninguna de las tres se puede soltar sin
romper otra cosa: dos intercambios se cortan a 390, apoyarlo abajo deja el vacío arriba, y estirar la
pantalla convierte la tableta en una columna con marco. **Queda así y con el número delante**, que
es lo honesto: la portada enseña una conversación corta en una pantalla grande.

#### Aparte de la entrega: el type-check estaba roto

Esta tanda es la primera que trae archivos `.astro` a `Claude outputs/`, y `tsconfig.json` los
incluía: **`npm run check` devolvía 93 errores**, todos de código que no es del repositorio. Estar
en el `.gitignore` no saca a una carpeta del type-check. Añadida al `exclude`, y anotado en
`CLAUDE.md` §0.3: con la puerta roja por un motivo ajeno, un error de verdad pasa inadvertido.

#### Verificado sobre el build de hoy

`npm run check` en verde · **80/80 pruebas** · build de las 15 páginas · **cero `.js` referenciado**
en `/preguntas` · los **tres enlaces a WhatsApp de la página llevan mensaje prellenado**, así que
D22 sigue cerrada · celdas de la banda de **52 px** de alto, sobre el mínimo de 44 · el recuento
lleva su unidad para lector de pantalla («1 pregunta» / «4 preguntas») · **ningún ancestro recorta**
el saliente de la tableta · «volver arriba» apunta a `#main`, que existe.

#### Sigue abierto

**La decisión de contenedor**, que es de Sebastián y no de esta entrega: si `/preguntas` deja de
importar las nueve de la Home y `/empresas`. Hoy son 9 importadas + 4 propias, y la banda las cuenta
todas. Si las nueve salen, la banda pasa de seis celdas a una y **deja de tener sentido**: lo que
hoy justifica la banda es que hay trece respuestas en seis grupos. **Las dos decisiones están
atadas**, y conviene saberlo antes de mover una.

---

### Notas de la integración de `2026-09-30 · precio: la página entera`

**Integrada entera**, con las cuatro decisiones de Sebastián tomadas el mismo día: escala `dato`,
`.figura` fuera, sombra local al componente, «Volumen y frecuencia» se queda. Y una corrección mía
sobre la entrega: **el filete del panel pasa de punteado a `--line`** (§6.2).

**Es la mejor entrega que ha hecho hasta ahora, y conviene decir por qué:** no trae ni un defecto de
copia. La ruta del `<Base>` es la correcta, no hay CSS huérfano —**corrigió por su cuenta el error
que había cometido el día anterior**, que era retirar la sección `.figura` dejando su CSS— y el
comentario de `.seg-rot` está reescrito para decir que la figura ya no está.

#### Su hallazgo, que es el que justifica la entrega

Encontró que **la bajada contradecía al propio sitio**: decía «Lo que ves **al cotizar** es lo que
pagas» y la Home publica «¿El precio de la web es el precio final? **No.**». Y encontró que **su
propia entrega del día anterior lo empeoraba**, poniendo la misma cifra bajo «al cotizar» y bajo «al
pagar»: así la contradicción dejaba de ser una frase y pasaba a ser un número. Se descartó esa
versión y se rehízo el panel sobre «aceptas» / «recibes», que son los dos momentos entre los que el
sitio sí promete que no pasa nada.

**Eso es lo que debería hacer una revisión cruzada**, y es el segundo caso: la primera vez fue la
negación absoluta de custodia. **Las dos veces el fallo era una afirmación de negocio, no de
código.**

#### Reproducido contra el build

Las **siete anchuras al píxel**: portada 816 · 752 · 616 · 616 · 589 · 589 · 589. Primera acción
**3.190 → 622** a 1280 y **3.801 → 824** a 390 — sus dos números exactos, y el «antes» también.
Página 4.254 → 4.909 (dijo 4.912). Desborde cero en las siete. Las dos cifras coinciden siempre.

**El candado, probado:** cambiándole el texto a una pregunta de `home.ts`, el build se cae con
«/precio: la pregunta «…» ya no está publicada.» Es el mensaje que anunció, literal.

Contrastes, medidos: `.tres` en papel-2 **4,98** —su número— · rótulos del pozo 4,98 · cifra 14,5 ·
«Cotizar otro monto» sobre tinta 8,45 · salida 5,44. Todos AA. La cifra sale a **32 px y peso 500**,
la escala conforme. **WCAG 1.4.12 aplicado a la página entera: cero desborde y cero solapes.** Un
solo `--elev-card`, cero JavaScript nuevo, `astro check` limpio y 80/80 pruebas.

#### El punteado: corregido antes de integrar

El panel separaba «aceptas» de «recibes» con un **filete punteado**, citando el §6.2 —«un límite:
cruzarlo cambia algo»—. **Es la marca diciendo lo contrario que su figura:** las dos mitades
enseñan el mismo número y el pie explica por qué. Cruzar ese filete no cambia nada, y eso es toda
la pieza.

Su justificación —«el mismo signo que la banda usa para el mismo instante»— tampoco valía: en la
banda el punteado marca **un instante**, y en el panel el filete está **entre** dos momentos, que es
un tramo. Queda escrito en el §6.2 como precedente de cuándo **no** usarlo: *un límite es un punto
del recorrido, no el trecho entre dos.*

#### Y un error mío, que salió al ir a contar

Iba a escribir que esta entrega subía el recuento de marcas punteadas de siete a ocho. **Fui a
rehacer la foto y ya eran ocho.** El §6.2 decía siete desde el 2026-09-29, y ese mismo día —en el
mismo commit— yo añadí `.caduca` a la banda de `/precio` para los 12 minutos. Lo documenté en la
auditoría («un **segundo trazo punteado**») y no volví a contar en el §6.2, que acababa de corregir.

El recuento está rehecho barriendo **las quince rutas** del build, con el método escrito para que el
próximo no lo invente. Y con la lección, que es más incómoda que la anterior: *un recuento hay que
rehacerlo incluso —sobre todo— cuando uno acaba de tomarlo; añadir una marca y corregir el recuento
en la misma sesión no garantiza que el orden haya sido ése.*

#### Dos cosas suyas que no salen

1. **«Los rótulos de la banda quedan con 0 px de holgura contra su leyenda» a 1280.** Medido:
   **38, 17, 17, 38**. No hay nada pegado. Es la tercera vez que una alarma suya sale de medir una
   caja en vez de la tinta.
2. **«Cotizar otro monto» mide 189 × 44.** Medido: **178 × 44**. El alto, que es el que importa
   —el objetivo táctil—, es el suyo.

#### Una redundancia que introduce, y se queda

La leyenda del panel dice «un solo cobro, y va dentro» y **400 px más abajo** la bajada de `.costos`
dice «Un solo cobro en toda la operación, y va dentro del precio». La misma frase dos veces
seguidas. Se deja: la leyenda es del objeto y la bajada es de la sección, y quitar cualquiera de las
dos deja a su bloque sin decir lo que dice. **Queda anotado por si alguien lo lee como descuido.**

#### El pronóstico del §4.8 se cumplió, y eso merece quedar escrito

El Design System decía desde el 2026-09-29 que **la figura de barras de `/precio` no se podía subir
a la portada** —no era un objeto suelto sino una `section` con su propio `<h2>`— y que la página
«necesita otro objeto». Eso es exactamente lo que pasó. **La regla general, con dos casos ya:**
cuando una portada no llega a su familia, la pregunta no es cómo agrandar la figura que hay, sino
cuál es el objeto de la página. En `/preguntas` fue una tableta; acá, la cifra. En los dos casos la
figura anterior **no se estiró: se fue**.

#### Lo que queda para Sebastián

**D7 subió de exposición y eso es nuevo.** El panel publica **2.174,62 USD** en la portada de una
página titulada «Un solo número», así que `PUBLIC_QUOTE_SAMPLE_RATE` dejó de dar cifras dentro del
cotizador y pasó a dar *la* cifra de una página. Cowork reporta que el mercado estaba entre 969,88 y
981 y que el ejemplo es un 5,5–6,7 % más generoso; **ese dato no lo verifiqué** y verificarlo pide
una cotización de mercado. No corre prisa —el sitio no está publicado— pero el orden correcto es
fijar la tasa **antes** de publicar esta página.

**Y la decisión de contenedor ahora toca dos páginas:** tres de las preguntas que `/precio` importa
también están en `/preguntas`.

**Sus dos recortes propuestos** —la leyenda de la banda y el bloque «Volumen y frecuencia»— no van
en esta integración. El bloque se queda por decisión suya; la leyenda tiene firma de Compliance y
Cowork hizo bien en no tocarla.

---

### Notas de la integración de `2026-09-30 · confianza: la portada pasa a ser un objeto`

**Integrada la maqueta A**, el teléfono. Con las tres decisiones de Sebastián del mismo día: **A**
sobre B, **«a la cuenta de DLPay»** en vez de la razón social por D9, y **cambiar la figura del
puente** en vez de dejarla. Esa tercera no estaba en su lista, y es el hallazgo de esta revisión.

#### Su argumento se sostiene, y trae un defecto vivo que nadie había visto

La portada de hoy medía **460 px a 1280 —el piso exacto de su familia— y 437 a 768**, o sea
**dentro del hueco de 288 a 460 que el §4.8 declara prohibido**. Llevaba así desde que ese hueco se
escribió, el 2026-09-29, y se me pasó a mí: la tabla se midió a 1280 y la regla se comprobó a 1280.
**Una regla que sólo se verifica al ancho en que se escribió no está verificada.** Queda en el §4.8.

Su crítica de fondo también: la figura eran tres barras de 20 px que miden lo mismo y van
`aria-hidden`, con todo el significado en rótulos de 13 px. El titular de esa página dice «confianza
que **se comprueba**», y un diagrama no se comprueba. Tres avisos de tres remitentes, **dos de ellos
ajenos**, sí.

#### Reproducido contra el build

Portada de hoy: **694 · 669 · 649 · 437 · 460 · 460**, sus seis números exactos. Entrega A: **750 ·
686 · 722 · 722 · 698 · 698 · 698** —a 320 mido 750 y él 731, la diferencia es la barra de scroll, y
lo mismo explica que su columna de aviso dé 174 y la mía 159—.

**La costura sale 0,00** en el borde del chasis, medida en el viewport real a 1280, 390 y 320. Cero
desborde, texto mínimo 13 px, ningún `.entero` partido, «DLPay · tu ejecutivo» en una línea.

**WCAG 1.4.12 pasa**, medido con la tinta y no con cajas: nada se sale de la pantalla del teléfono,
nada se solapa, la costura sigue en 0 y el aparato crece de 750 a 1.116 sin recortar.

#### Un error mío de instrumento, dicho antes de que parezca hallazgo

Mi primer barrido dio **−9 px de costura en las siete anchuras** y estuve a punto de reportarlo. Lo
daba el instrumento: medí en un `iframe` **sin esperar `document.fonts.ready`**, así que medía con
las métricas de la fuente de respaldo. Con la espera puesta bajó a −2/−3, que es redondeo
sub-píxel del propio `iframe`; en el viewport real es **0,00**.

> **Un `iframe` sirve para barrer muchas anchuras y no sirve para una afirmación sub-píxel.** Para
> «0 px» hay que redimensionar el viewport de verdad, y siempre esperar las fuentes.

#### Lo que la entrega afirma dos veces y es falso

**«Si Sebastián retira la línea, `Phase` y `phases` quedan sin uso y se borran con ella»** —lo dice
el prompt en §2.4 y la ficha en §8.3—. **Tenían un segundo consumidor:** `FiguraTenencia.astro`, la
figura del puente de `/tarifas` a `/confianza`.

Y el problema era mayor que un import: **ese puente enseñaba la línea como anticipo del destino.**
Retirada la línea, el puente anticipaba una figura que el destino ya no tiene. Lo más notable es que
**el propio componente lo había previsto**, con estas palabras en su cabecera: *«copiada y no
factorizada… si la de destino cambia, el puente se queda como está hasta que alguien lo mire.»* Por
una vez alguien lo miró el mismo día. **Ese comentario se ganó su sitio.**

#### El puente rehecho, y cuatro intentos hasta que cupo

La figura del puente son ahora los mismos avisos con `forma="puente"`. **Comparte el componente en
vez de copiarlo**, al revés que los otros cuatro puentes, y la razón es el contenido: los avisos
llevan firma de Compliance y dos copias de una cadena firmada es cómo el sitio acaba diciendo dos
cosas. Se comparte el texto y se separa la presentación — que es exactamente lo que hacía
`FiguraTenencia`, que copiaba el dibujo e importaba el dato.

**Y no cupo de entrada.** La esquina superior izquierda del primer aviso caía **37 px del lado claro
del corte**, con lo que ese aviso —papel sobre papel— se quedaba sin borde. El §4.7 pide 40 de
holgura de tinta. Lo que probé:

| intento | a 1280 | a 960 |
|---|---|---|
| tal cual, 460 de ancho | −37 | — |
| estrechar a 366 | 30 | — |
| estrechar a 336 | 55 | **−14** |
| bajar la escala del aviso | — | −2 |
| **quitar el cuerpo del aviso** | **111** | **42** |

**El tercer intento es el que enseña:** estrechar arregló 1280 y no arregló 960, porque el corte pasa
por el centro de la banda y cuanto más estrecha es, más adentro de la columna queda. **Una holgura
que depende del ancho no se arregla con un ancho fijo.** Está en el §4.7.

Y lo que lo resolvió no fue una medida: **el puente enseña el remitente y el titular, no el cuerpo**.
199 px de alto en vez de 299. Entra por geometría —la figura va pegada abajo, así que cada píxel de
alto es un píxel que su esquina se aleja del corte— pero **se queda por argumento**: un puente
promete y el destino paga. Que te llegan tres avisos de tres remitentes y sólo uno es nuestro se lee
entero sin las cifras; las cifras están a un clic. *Es la regla del §4.8 dicha para un puente.*

**Un detalle de CSS que costó una vuelta:** la regla del ancho la escribí a mitad del archivo y **no
aplicaba**. `.tel` y `.puente` tienen la misma especificidad, así que entre reglas que coinciden gana
la última del archivo y no la del `@media` más estrecho; el bloque de 900 la pisaba desde abajo y la
figura seguía midiendo 460. Se vio midiendo, no leyendo. Queda anotado en el componente.

#### Lo que NO integré de su §5, y por qué

**La rama `suelto` no se borró.** La regla de la entrega era borrar la maqueta perdedora, y Sebastián
eligió el teléfono. **No se borra porque entre medio le apareció un consumidor de verdad:** es la
forma del puente, renombrada a `puente`. *Una rama alternativa y una variante con consumidor se
parecen en el código y no son lo mismo; el criterio para borrar es si algo la usa.*

#### Un hallazgo que no es de esta entrega

Con el espaciado de 1.4.12 a 320 px la página gana **20 px de desplazamiento horizontal**, y
**ninguno de los 26 elementos que se salen está dentro del teléfono**: son todos de la **cabecera**.
Comprobado en `/terminos` del build anterior, sin esta portada: mismo desborde. **Afecta a las
quince páginas.** Queda como B6 en la auditoría, sin tocar: la cabecera se comparte y un cambio ahí
se verifica en las quince.

*El reflejo que hay que vigilar:* lo primero que pensé fue anotarlo contra esta portada. **Una
medición sobre una página no dice de qué parte de la página es el problema hasta que se pregunta por
el culpable.**

#### Lo que queda para Sebastián

1. **D9.** Mientras siga abierta, el aviso dice «a la cuenta de DLPay» y **la portada de «Confianza
   que se comprueba» no da el dato que de verdad se comprueba.** El día que cierre es una línea.
2. **La sección «cómo saber que eres tú con nosotros»** (§6a de su ficha), que él no construyó y que
   necesita tres datos tuyos: si todas las operaciones salen de un único número, si la cuenta
   receptora es siempre la misma, y qué es lo que nunca pediremos. Con la CMF advirtiendo sobre
   fraudes por WhatsApp y DLPay operando por WhatsApp, **es el hueco más grande que señala.**
3. **La primera acción de la página sigue a 3.024 px** en escritorio. Él no la subió porque el
   teléfono llega a ras de la costura y no deja sitio; queda dicho.
4. **D7, por tercera vez:** la tasa de muestra aparece ya en **dos portadas**.

---

### Notas de la integración de `2026-09-30 · blog: el índice abre con la hoja del último artículo`

**Integrada entera**, con las cuatro decisiones de Sebastián del 2026-10-01: la hoja, la lista desde
el segundo, la bajada nueva y **quitar «novedades de DLPay» de la `description`**. Más dos
correcciones mías de detalle.

**Con esto se cierra el §4.8:** no queda ninguna página no legal abriendo sin objeto. Y la regla se
cumplió cuatro veces seguidas con la misma forma —`/preguntas`, `/precio`, `/confianza`, `/blog`—:
**no agrandar la figura que hay, preguntar cuál es el objeto de la página.** Acá el objeto estaba
delante todo el tiempo: *el objeto de un blog son sus artículos.*

#### Es la entrega más limpia de la serie, y hay dos motivos concretos

**Hizo el `grep` sin que nadie se lo pidiera.** Su §2 declara que `publishedPosts()` lo consumen
además `[slug].astro` y `sitemap.xml.ts` y que ninguno cambia, «es la lección de `phases` de ayer».
Comprobado: exacto. **Ayer esa misma frase —«queda sin uso»— estaba mal dos veces; hoy está bien y
viene con el método declarado.**

**Y se adelantó a la corrección de la barra de scroll.** Su §4 dice: «medí sin barra clásica, con
barra las cifras de móvil varían, como anotaste en `/confianza`». A 390 yo mido 783 y él 755, y la
diferencia está explicada antes de que yo la midiera. **Primera entrega que se adelanta a una
corrección en vez de recibirla.**

#### Reproducido contra el build

Portada **884 · 783 · 735 · 735 · 715 · 715 · 715** (la de 390 con barra). Primera acción **442 →
339** a 1280, con el «antes» exacto. Desborde cero, ningún recorte, y **WCAG 1.4.12 limpio**: con el
espaciado aplicado nada se sale de la hoja ni del pozo y la portada crece de 715 a 752. El foco de
teclado cae en la hoja con el anillo `--verde` a 2 px, y la hoja es enfocable.

**Los tres tipos de portada, probados poniendo cada artículo como el más reciente** —que es lo que
hacía falta porque hoy sólo se ejercita `cifra`—: `cifra` 715, `rango` 709 con los extremos a 26 px
y su segmento con topes, `figura` 709 con el pictograma de 112×112 dentro del pozo. Ninguna cifra se
parte, nada se sale. **Y el `rango` no repite el fallo de `PortadaDato`**: usa `formatRate` donde
toca y sale «3,75–4,00 %», no «3,75000».

**Su arreglo de los 8 px estaba justificado y lo verifiqué midiendo tinta.** En el build anterior el
hueco entre la cifra y su unidad era de **3 px**, y el primer enlace de la página se leía
literalmente **«292mil millones de dólares»**. Ahora son 8, los mismos en la lista y en la hoja.

#### Una cifra que no reproduce

**`figura` me da 709 y él dice 731.** Nada se sale y 709 está dentro de la familia, así que no es un
defecto — pero es un número que no sale y queda dicho. Las otras dos salen al píxel.

#### Dos correcciones mías, pequeñas

1. **`padding-bottom: 44px`** en la caja de la portada, fuera de la escala. En `/precio` ese hueco
   son 44 **porque se derivan**: bajo el panel hay un enlace cuyo objetivo táctil mide 44 y la caja
   los descuenta. Acá no hay nada debajo —la hoja *es* el enlace—, así que el 44 no venía de ningún
   sitio. Pasa a `--s-7`: la portada queda en **719** y la holgura en 48.
2. **El encabezado oculto decía «Artículos anteriores» también sin artículos**, donde un lector de
   pantalla oiría «Artículos anteriores · Todavía no hay artículos publicados». Condicional.

#### Y un error mío al montarlo, que conviene dejar escrito

Puse el comentario de la `description` **entre los atributos de `<Base>`**, y eso rompe la plantilla
entera: `astro check` devolvió **catorce «declarado y no usado»** —el `<style>`, los imports, todo—
porque el template dejó de parsearse. Ningún error mencionaba un comentario.

> **Es la tercera vez que un comentario en una posición inválida rompe el build en este proyecto**, y
> las tres veces el mensaje de error apuntó a otra parte. La forma de un comentario mal puesto es
> **un montón de símbolos que de pronto no se usan**. La `description` acabó en una constante del
> frontmatter, que es donde el comentario sí cabe.

#### Lo que decidió Sebastián y queda registrado

**La promesa del SEO se retira.** La `description` prometía «novedades de DLPay» con cero artículos
de esa categoría. **Cowork lo detectó y no lo tocó, que era lo correcto** —es una cadena con firma—,
y Sebastián la quitó. Se repone el día que haya un artículo `DLPay`; el esquema ya la admite. Queda
en la auditoría con fecha.

**Añadido unas horas después, y no es de Cowork.** Sebastián preguntó si las tres hojas de la
portada podían **ir alternándose cada 2 segundos**. Se descartó el mecanismo y se dio lo que
buscaba: **los cantos pasaron a llevar el titular y la fecha de su artículo**, cada uno como enlace
propio.

El motivo decisivo no fue de reglas: **la hoja es el enlace y es la primera acción de la página**,
así que un cambio cada 2 s mueve el destino bajo el cursor, y 2 segundos es menos de lo que cuesta
leer un titular de 90 caracteres y decidir. Lo que además habría costado —cuarto movimiento infinito,
JavaScript nuevo, el control de pausa de WCAG 2.2.2 que la regla del objeto prohíbe— está en
`motion-system-v1.md` §7, junto con una precisión de método: **la investigación de Fase 1 nunca
cubrió carruseles**, así que esto no era una regla preexistente sino una decisión nueva.

**Lo que costó, medido:** la portada sube de 719 a **791 px** y con eso `/blog` pasa a ser **la
portada más alta del sitio**, diez por encima de la Home. Tres enlaces en la pila, **cero anidados**
—los cantos son hermanos del enlace de la hoja, no sus hijos—, cero desborde en los seis anchos, y
el foco de teclado cae en cada canto con su anillo.

**Y un defecto que apareció al medir:** bajo 560 px la fecha del canto se oculta, y al perder ese
elemento alineado por la base la caja de línea se encogía a **43 px** — uno por debajo del objetivo
táctil, justo en los dos anchos donde el dedo es el único puntero. Resuelto con `min-height: 44px`.

*Queda una redundancia asumida:* los artículos 2 y 3 aparecen en los cantos y otra vez en la lista
de abajo, a unos 300 px, con distinto nivel de detalle —titular y fecha arriba, titular, bajada,
categoría y dato abajo—. Se deja así porque la alternativa, arrancar la lista después de lo que
enseña la portada, **la dejaría vacía mientras haya tres artículos o menos**. Se revisa cuando haya
un cuarto.

---

### Notas de la integración de `2026-10-01 · blog: el Diario DLPay`

**Integrada**, por decisión de Sebastián, con **ADR-0011** y cuatro enmiendas: la regla dura 1 del
Motion System, su §7 —que se escribió el día anterior—, el Principio 3 de `CLAUDE.md` y el §6.2.
Más la nomenclatura, que gana un tercer nombre.

**Dije que no a esto el 2026-09-30 y Sebastián lo pidió otra vez. Se monta.** Y de mis cuatro
argumentos de entonces **dos cayeron con esta implementación**, lo cual conviene reconocer sin
rodeos: es **CSS puro, cero JavaScript**, y la casilla de pausa vive **fuera** del objeto, así que
no es un control dentro del aparato. Cowork lo dijo él mismo, argumento por argumento, en vez de
rodearlo. Los otros dos siguen en pie y están en la ADR como coste aceptado.

#### El trabajo de ingeniería es real, y hay que decir cuál

**Encontró su propio fallo y lo demostró midiendo.** La perspectiva estaba en el abuelo de la hoja
y `perspective` sólo actúa sobre los hijos directos: la cara medía 567×368 —620 · cos 24° por el
mismo alto— en vez de 564×387. **Un bug de 3D que no se ve mirando el CSS.**

**Y cazó un fotograma fantasma de 0,9 ms**: entre `p` y `p + 0,01 %` la hoja interpolaba de vuelta
a 0° estando visible. Uno de cada ~18 ciclos a 60 Hz. Lo arregló con `steps(1, end)` y barrió 817
instantes.

#### Reproducido contra el build

Portada **627 a 320 y 674 a 1280** — sus dos números exactos. Subida de la hoja **52**, exacto.
**La hoja no tapa el control en ninguno de los 451 instantes** del ciclo, a 320 ni a 1280. Cero
desborde, el canto no pasa del borde derecho. 0 JS, 0 archivos, 0 `--elev-card`. Los `@keyframes`
se generan en el build (cuatro `diario-*`) con los retrasos negativos 0, −3, −6 s.

**La casilla pausa de verdad:** 12 animaciones de `running` a `paused` al marcarla, el texto visible
cambia a «Seguir», es enfocable y su objetivo táctil mide 78×44. **Con `prefers-reduced-motion`:
0 animaciones, una hoja quieta, el control no se dibuja.**

#### Un error mío de medición, que casi se convierte en un hallazgo falso

Escribí un detector de fantasmas y **dio 358 casos**. Todos falsos. Buscaba «hoja visible, girada
más de 90°, con el dorso por debajo de 0,98 de opacidad» y **no comprobé si la cara podía verse
siquiera**: `.hoja-cara` lleva `backface-visibility: hidden`, así que una hoja girada 180° no pinta
nada. Lo que mi detector llamaba fantasma era el desvanecimiento previsto. Lo confirmé con una
captura congelada a 2.997 ms: limpia.

> **Es la misma familia que el filtro `width > 0` que escondió `.edge`:** una condición que parece
> razonable y que ignora justo la propiedad que decide. Antes de reportar 358 de algo, una captura.

#### Y dos medidas suyas que no salen

1. **«Holgura con Pausar: 12».** Mi primera medición dio **−20** y la suya era la correcta: yo medí
   **cajas** y la hoja gira en 3D, así que su caja envolvente sube mucho más que su tinta. Repetido
   con `elementFromPoint`, como él declara: **12**. *Su número y mi error.*
2. **«Bajo el pliegue: 0».** Medido en tinta: **8 px durante los primeros 220 ms de cada ciclo**, en
   los dos anchos, y es `.hoja-cara`. Papel claro sobre papel claro, así que no se ve — pero el
   número es 8, no 0.

#### Lo que corregí al integrar

**El contraste de las orejas.** Lo reportaba como «de 5,10 a 5,56 **de media**, p5 ≥ 4,66, mínimo
4,12». **WCAG no tiene contraste medio:** donde el grano oscurece el papel bajo un trazo de 13 px,
ese punto no llega al 4,5 de AA, y «es una mota» no es como funciona el criterio. `--ink-mute` da
5,69 sobre el papel limpio; un paso más oscuro —`#525B68`— da 6,52 y deja el peor punto del grano en
**4,72**. Local, sin tocar `--ink-mute`, y a simple vista el mismo gris.

#### Lo que no pude verificar, y lo pidió él

**La máscara de la tinta en Safari.** Cowork sólo tiene Chromium y lo declaró; **este entorno
tampoco tiene WebKit**, y no voy a instalar un motor de navegador por mi cuenta. Leído el código,
el riesgo es bajo —es `-webkit-mask` en forma abreviada, con soporte largo en WebKit— y el fallo
sería benigno: sin máscara la letra sale entera, que para contraste es mejor. **Pero está sin
comprobar y queda escrito como pendiente**, en la ADR y en la auditoría.

#### Lo que queda abierto

- **`UltimoArticulo.astro` se queda sin consumidores.** No lo borro: regla 3. Decide él.
- **El Safari**, arriba.
- **El texto simulado de las columnas se queda**, por su decisión, y queda registrado en el §6.2
  como lo que es: **la única marca del sitio que no representa nada**. Con la alternativa escrita
  —el primer párrafo real del artículo— por si algún día se prefiere.

---

### Notas de la integración de `2026-10-01 · precio: el abanico de etiquetas, con cartulina`

**Integradas las dos entregas** —el abanico y el relieve— con tres decisiones de Sebastián:
montarlo con cartulina, **enmendar ADR-0011 a una lista cerrada de dos piezas**, y **borrar los dos
componentes que quedaban sin consumidores**.

#### La decisión que no era de diseño

ADR-0011 se escribió ayer y decía, con estas palabras, **«única pieza fuera del registro de
ADR-0001»**. Hoy hay una segunda. Eso se le planteó a Sebastián no como «¿la autorizo?» sino como
la elección entre **dos excepciones en un sitio cuya dirección sigue siendo A×C** y **la dirección
está cambiando y ADR-0001 debería decirlo**.

Eligió lo primero, y por eso el ADR pasa de una promesa a una **lista cerrada y nombrada**: el
Diario y el abanico, y una tercera pieza con materia no entra por ahí. *El argumento con el que se
concedió la primera —que era única— ya no está disponible para la segunda.*

Queda escrito que la excepción es **de registro y no de movimiento**: las etiquetas están quietas y
el cuarto movimiento infinito sigue siendo uno solo.

#### El delta de la página, limpio

95 líneas. Import y ranura, `.fp-caja` → `.et-hueco`, `.fp-otro` → `.et-otro` y el texto de la
puerta. **Cero CSS huérfano** —lo comprobé clase por clase— y sobrevive entero lo de ayer: la tabla
de costos con «Cancelar antes de transferir», la sección de preguntas y su `throw`.

#### Reproducido contra el build

Portada **731 a 960, 1280 y 2560** y **709 a 640 y 768** — exacto. Cinco etiquetas en las ocho
anchuras, aire de 53 a 55 px entre la bajada y la etiqueta más alta (declaran 47–54), **cero
desplazamiento lateral** y ninguna anchura en el hueco prohibido del §4.8.

**El contraste lo medí con su propio método** —máscara de tinta en rojo, captura del papel sin
texto, y comparación **píxel a píxel sobre los glifos**—:

| | peor píxel · yo | declarado |
|---|---|---|
| «Todo lo demás no tiene costo.» | **4,98** | 4,72 |
| «Convertir» | 5,51 | 5,07 |
| nombres de detrás | 11,80 – 13,24 | 9,22 |
| «Un solo cobro» · «El spread…» | 14,49 – 14,64 | 14,08 · 13,19 |

**Todos mis números salen por encima de los suyos y el orden coincide: sus cifras son
conservadoras**, que es la dirección correcta para una afirmación de seguridad. *Límite de mi
comprobación: 1280 a densidad 1×; su peor caso lo declaran a 390@3×, que muestrea el grano distinto
y aquí no se puede reproducir.*

**1.4.12: el abanico pasa.** Lo que se sale a 320 con el espaciado son **2 px de `.lienzo`**, dentro
de la banda de los 12 minutos y a 3.000 px de la portada — y eso ya estaba documentado en
`tarifas.astro` desde el 2026-09-28.

#### Dos errores míos de medición, en la misma sesión

El primer intento de medir el contraste dio **1,00** para los textos de la etiqueta de delante y
**1,07** para dos rótulos. Los dos eran míos:

1. **Mi CSS no ocultó los textos de delante** —el selector no los alcanzaba—, así que medí tinta
   contra tinta.
2. **Las cajas de los rótulos girados se salen de su etiqueta.** Medí el rectángulo envolvente y
   dentro caía la banda oscura del fondo.

> **Es la tercera vez esta semana que una caja se me cuela por una tinta**, y la tercera con la
> misma forma: el resultado era absurdo —1,00 es «el mismo color»— y eso es lo que delata el
> instrumento. **Un contraste de 1,00 nunca es un hallazgo; es una medición rota.**

#### Lo que se borró, y por qué no se pierde

`FiguraPrecio.astro` y `UltimoArticulo.astro` salieron del repositorio: dos portadas que duraron un
día cada una y se quedaron sin consumidores. **Están en el historial** y se recuperan de cualquier
commit. Era lo que pedía el Principio 5 —nada de componentes que ninguna página necesita— y evita
que dentro de un mes nadie sepa si sobran o esperan algo. La referencia que `blog/index.astro` hace
a `UltimoArticulo` en un comentario queda fechada en vez de borrada.

#### Sin verificar

**Safari y Firefox**, otra vez. Cowork lo declara —los `drop-shadow` encadenados y la `mask` del
aro— y este entorno sigue sin WebKit. **Van dos piezas seguidas con el mismo pendiente**, y conviene
resolverlo antes de Fase 6 en vez de acumularlo: son dos minutos en un Safari de verdad.

**Corregido el mismo día: faltaba el movimiento, y era mi fallo.** Sebastián lo vio de inmediato
—*«no tiene movimiento y ni siquiera se parecen en aspecto»*— y tenía razón en las dos mitades,
que resultaron ser la misma.

**Qué pasó.** El movimiento venía en la ficha de la primera entrega, en su §7, **fuera del
componente y marcado como opcional**, con sus cuatro líneas de CSS escritas. El prompt lo listaba
entre las cosas que Sebastián tenía que aprobar —«el abanico o la etiqueta sola, el titular, qué
hacer con `FiguraPrecio`, **el movimiento opcional** y la firma de Compliance»— y yo cité esa lista
en mi revisión **y luego hice tres preguntas que no lo incluían**.

> **Una entrega con una parte marcada «opcional» no está revisada hasta que esa parte se decide.**
> Lo opcional no es lo prescindible: es lo que alguien tiene que elegir.

**Y por qué explica también el aspecto.** Sin la apertura, el abanico está desplegado desde el
primer fotograma. Lo que él recordaba del GIF era el abanico **abriéndose**, y un abanico quieto no
se parece a eso por mucho que la geometría coincida al grado. *Comprobado antes de tocar nada: el
componente que monté es byte a byte el entregado, las cinco etiquetas abren sus 30° declarados, las
tres sombras encadenadas están, y los cuatro ruidos de la cartulina llegan al CSS del build.* El
código era fiel; lo que faltaba era la mitad que no estaba en el código.

**Montado y medido.** 440 ms con 160 de retraso, **una iteración**, girando sobre el ojal.
Reproducida a mano: 0° → −5,5° → −7° → −7,4° → −7,5°. Los rótulos llevan la misma animación y el
mismo eje —viven fuera del `li`, así que si no, los nombres se quedarían quietos sobre etiquetas que
giran—. Con `prefers-reduced-motion` el `animation-name` calculado es `none` y el abanico sale
abierto. **Cero JavaScript**: no cuelga del observador ni de `.js-motion`.

**Gobierno:** enmienda interna del Motion System, no ADR. Pasa del techo de 280 ms, como la banda de
los 12 minutos de esta misma página, y **la regla dura 1 queda intacta porque ocurre una sola vez**.
El sitio sigue teniendo cuatro movimientos infinitos.

*Un aviso de instrumento, por si alguien repite la comprobación:* `getAnimations()` devolvió **cero**
y no era un fallo — con relleno `backwards` la animación desaparece de la lista en cuanto termina, y
600 ms después de cargar ya no está. Se verifica por el estilo calculado y reproduciéndola a mano.

---

### Notas de la integración de `2026-10-02 · empresas: las cuatro secciones de después de la portada`

**Veredicto: integrada entera**, los cinco archivos sin tocar una línea, más el borrado de
`BusinessEmblem.astro` y los dos comentarios que lo nombraban. `npm run check` en 0 errores, 80
pruebas en verde, build en 446 ms.

**Base verificada antes de nada:** los quince md5 del prompt —diez del repositorio y cinco de la
entrega— coinciden exactamente, y la cabeza seguía en `9f66880`.

#### El diff, que es lo que se revisa

**La mejor entrega de la fase en este punto, y conviene decirlo porque las anteriores no lo fueron.**
`empresas.astro` llega como archivo entero, igual que las otras, pero su diff contra el de hoy es
**quirúrgico**: cambia los cuatro imports, sustituye los tres bloques de marcado por sus componentes,
retira exactamente el CSS que se queda sin dueño y reescribe «emblema» por «figura» en tres
comentarios. **No se perdió ni una regla ajena.** En `/preguntas` desapareció `.inner`, y en
`/confianza` se retiraron dos símbolos que sí tenían consumidor; acá no hay nada de eso, y lo
comprobé línea por línea antes de copiar.

**La corrección que trae el propio prompt vale lo mismo.** La ficha afirmaba que el artículo del
blog usa `EjeDeAlcance`, y Cowork lo desmintió antes de que yo lo mirara: lo había tomado de la fila
del Design System §8.1, que estaba desactualizada. `grep` lo confirma — el artículo sólo lo nombra en
un comentario, y `/confianza` también. **La fila decía «tres páginas» y eran dos.** Es la segunda vez
en la fase que una afirmación de «quién usa esto» resulta falsa, y la segunda que la caza un `grep`
de diez segundos.

#### Lo que verifiqué sobre el build, no sobre el dev

| Qué | Declarado | Medido acá |
|---|---|---|
| Contraste, peor píxel (7 casos, 1×/2×/3×) | 4,93 · 4,98 · 8,18 · 14,5–16,4 | **4,93 · 4,98 · 8,18 · 14,50 · 16,44** ✔ |
| Barrido 320→1300 cada 20, con y sin 1.4.12 | nada recortado ni pisado | **0 incidencias** ✔ |
| Fuente mínima | 13 px | **13 px** (`.cmp-quien`) ✔ |
| Desplazamiento lateral | 0, salvo 13 px a 320 con espaciado | **0, salvo 5 px a 320 con espaciado** — ver abajo |
| `axe-core` 4.13 a 1280 y 390 | sólo el contraste del portátil (10 y 9) | **10 y 9, idénticos al build de ayer** ✔ |
| Árbol a 390 | tabla, 5 filas, 3 col., 4 fila, 8 celdas | **exacto** ✔ |
| Lista «Nuestra parte» | 3 | **3** ✔ |
| Enfocables en `main` | 8 | **8** ✔ |
| Alto a 1280 | 6.369 (+517) | **6.344 (+489)** |
| Alto a 390 | 8.300 (+1.045) | **8.280 (+1.066)** |
| Peso transferido | +3,6 KB gzip | **+3,59 KB gzip** (15.779 → 19.369) ✔ |
| JavaScript nuevo | 0 | **0**: cuatro scripts en línea antes y después, ninguno externo ✔ |

Los altos difieren en 20–25 px sobre seis mil: es rasterización de fuentes entre dos equipos, no una
discrepancia. La historia que cuentan es la misma, y es la buena: **casi todo el crecimiento de 390
es la comparación**, porque hoy una columna entera está escondida detrás de un desplazamiento y
después se ve entera, a 16 px.

**El desplazamiento de 320 con espaciado es previo, y lo comprobé como se debe:** no mirando el
número, sino midiendo **`/como-funciona`, que no he tocado**. Da los mismos 5 px y señala los mismos
elementos de la cabecera. Que a ellos les saliera 13 y a mí 5 es la hoja de espaciado, que cada uno
escribe a su manera; lo que importa es que no sale de esta reforma.

#### Donde la entrega se equivoca

**La holgura al corte del relevo no es la que dice.** Declara «≥ 55 px en escritorio y ≥ 51 en
móvil». Barriendo de 320 a 1300 cada 20 px, el peor caso es **44,81 px a 920** y **40,48 px a 420**.

**No hay nada roto**: el piso del Design System §4.7 son 40 px, los dos lo pasan, y mi medida es
conservadora porque parte de la caja del renglón y no del trazo. Pero **la diferencia entre creer que
sobran 11 px y saber que sobran 0,48 es toda la diferencia** el día que alguien quiera mover el
chaflán.

Y lo que cierra el caso: **el componente lo decía**. Su comentario de móvil anuncia «la frase queda a
40 px de la esquina donde empieza el corte». El comentario tenía razón; la tabla de medidas, no.
*Registrado en `phase-4-construccion.md` §4.12.*

#### Lo que la entrega no vio, y toca al Design System

**`FiguraCaso` estrena marca punteada en `/empresas`**, dos veces —la frontera del cruce y la de la
cajonera—, y el §6.2 publicaba una tabla que dice **«`/empresas` no tiene ninguna»**. Rehice el
barrido con el método que esa misma sección documenta, sobre las quince rutas del build.

**Y al rehacerlo apareció algo peor: el recuento ya estaba desfasado desde ayer.** `.et-torsion`, el
punteado con el que el abanico de etiquetas dibuja la torsión del cordón, entró el 2026-10-01 con
`a3d3bf6` y nadie volvió a contar. **Lo firmé yo, con el aviso de «un recuento es una foto y quien la
cite tiene que rehacerla» escrito tres párrafos más arriba.** Escribir la lección no la aplica.

El §6.2 queda ahora con **nueve marcas**, y con una distinción que antes no hacía falta: el barrido
devuelve diez porque `.et-torsion` es **materia y no vocabulario** —dice «esto es un cordón
trenzado», no marca ningún límite— y la trae una de las dos piezas a las que ADR-0011 concede
textura. Desde que existe una pieza con materia, el número de píxeles punteados y el número de marcas
dejan de ser el mismo.

**Comprobado aparte, porque era la otra pregunta:** las figuras nuevas **no estrenan ninguna marca**.
Cruce, cajonera, calendario y pilas usan punto lleno verde, cuña, tramo verde, filete `--ink-mute`,
canto dividido en unidades y trazo punteado, todas ya en la tabla. Lo único nuevo es la distinción
entre una marca y **una parte del objeto**: el tirador de un cajón y las anillas del calendario no
significan nada, igual que el altavoz del teléfono.

#### Lo que arregla sin proponérselo

Dos fallos que `/empresas` tenía hoy y que no son de esta reforma: `scrollable-region-focusable` a
390 —la tabla necesitaba desplazarse y no era enfocable, que es WCAG— y `empty-table-header`, el
`<th>&nbsp;</th>` de la primera columna, que es buena práctica y no WCAG. Los dos medidos en el build
de ayer y ausentes en el de hoy. *La entrega los anunciaba juntos; son de categorías distintas y
conviene no venderlos como dos fallos de accesibilidad.*

#### Sin verificar

**WebKit: medio cerrado el mismo día.** El pendiente se había acumulado tres entregas seguidas —el
Diario con su `-webkit-mask`, el abanico con el `drop-shadow` encadenado y la `mask` del ojal, y
ahora las `cqw` de las figuras más la tabla de móvil con sus `role` puestos a mano—, porque ni este
entorno ni Cowork tienen WebKit.

**WebKit queda CERRADO el mismo día, en las dos mitades.** Sebastián revisó las tres piezas sobre
el build, página por página, primero en **Safari de escritorio** y después en un **iPhone**. Todo se
ve bien. Con eso cae el riesgo que de verdad preocupaba —que la `mask` no se aplicara y el abanico
saliera sin su agujero, o el papel del Diario sin grano— y **el pendiente desaparece del registro
después de tres entregas acumulándolo**.

**Las dos mitades hacían falta, y conviene que quede escrito por qué.** No porque falten usuarios de
Safari, sino porque **en iOS todos los navegadores son WebKit por obligación de Apple**: Chrome en
iPhone es Safari con otra carátula. Ese hueco no cubría a una minoría, cubría a todo el que entre
desde un teléfono Apple, en un sitio diseñado móvil primero. Y es otra versión de WebKit que la del
Mac, con otro rasterizado de fuentes y otra gestión de memoria para los filtros encadenados.

**Y el teléfono no era «la misma prueba en otra pantalla»:** bajo 760 px la comparación deja de ser
una tabla y pasa a una ficha por aspecto, el relevo se pone de pie con el corte en un chaflán, y el
abanico se acorta. **Esas tres maquetas no las había visto ningún WebKit** — el Mac nunca las
muestra.

*Cómo se hace, para no volver a inventarlo:* `npx astro preview --host 0.0.0.0 --port 4380` sobre el
build, y el teléfono en la misma Wi-Fi contra la IP de la máquina. **El `--host` es lo que falta por
omisión**: sin él el servidor sólo escucha en `localhost` y el teléfono no lo ve. Y la primera vez
macOS pide permiso de firewall para Node.

**Firefox sigue sin mirarse**, y es el pendiente menor: tiene motor propio, pero no es el único
navegador de ninguna plataforma, así que nadie queda sin salida si algo se ve distinto.

**Un lector de pantalla real.** El árbol está medido y es correcto; nadie lo ha oído en VoiceOver ni
en NVDA. Importa más que de costumbre porque la tabla de móvil **depende de `role` puestos a mano**:
si un lector los ignorara, los valores se quedarían sin encabezado.

#### Compliance

**Ninguna cadena nueva de producto**: las cuatro secciones leen `business.ts` y `scope.ts` sin tocar
una palabra. Lo que sí entra son **rótulos de figura** —«Chile», «Exterior», «USD», «CLP», los doce
meses, «Tu empresa», «Tu proveedor», «Nuestra parte»— y los nombres de columna repetidos en las
fichas de móvil. Son rótulos, no afirmaciones, pero quedan listados acá por si Compliance quiere
verlos.

**Y un rótulo que sí carga una regla dura:** «Tu empresa» bajo la cajonera. Está ahí porque la figura
dibuja una caja con saldos dentro, y `CLAUDE.md` §1 dice que **DLPay no guarda saldos** en el modo
asistido. Sin ese rótulo la caja se lee como nuestra. **No se quita.**

---

### Notas de la integración de `2026-10-02 · confianza: las cuatro secciones` + el arreglo del relevo

**Veredicto: integradas las dos partes**, los cuatro archivos sin tocar una línea. `npm run check`
en 0 errores, 80 pruebas, build en 490 ms. Los doce md5 del prompt coinciden y la cabeza seguía en
`d573851`.

#### Parte B primero, porque es la que corrige algo publicado

**Confirmado antes de integrar, sobre el build de ayer: el piso del §4.7 se rompía.** Barriendo cada
1 px, entre **417 y 419 px** de ancho la frase de la bisagra quedaba a **37,99 px** de la recta del
corte, bajo los 40. Con el arreglo —`--s-4` a `--s-5`— pasa a **44,63 px**, y en escritorio queda en
44,33; con el espaciado de 1.4.12, 64,8. Ningún ancho por debajo del piso en todo el rango.

**Y el resto de `/empresas` no se movió:** mismo alto a 1280 y 390, 0 incidencias en el barrido, los
mismos 8 enfocables y el mismo árbol de la tabla a 390.

**Una precisión sobre la causa, porque la ficha la atribuye a dos cosas y sólo una es mía.** Apunta a
la métrica (medir en horizontal en vez de perpendicular a la recta) y al paso. **La métrica explica
su medición, no la mía**: mi script medía perpendicular, y lo verifiqué calculando a la vez la
distancia al segmento del chaflán y a la recta que lo contiene — **dan el mismo número**, porque el
punto proyectado cae dentro del chaflán. Mi error fue sólo el paso, y fue suficiente.

**Lo que de verdad falló es lo que escribí con ese número.** Puse «nada está roto, el piso son 40 px
y los dos lo pasan». *«Nada está roto» es una afirmación, no la ausencia de un hallazgo, y pide la
misma prueba que un hallazgo.* Corregido en `phase-4-construccion.md` §4.12, dejando visible lo que
decía antes.

#### Parte A, sobre el build

| Qué | Declarado | Medido acá |
|---|---|---|
| Contraste, peor píxel (7 casos, 1×/2×/3×) | 4,98 los rótulos · ≥5,50 el resto | **4,98**, y el siguiente 5,44 ✔ |
| Figuras 320→1300, cada 2 px bajo 500, con y sin 1.4.12 | nada fuera de su lámina ni de su etiqueta, ninguna palabra partida, mínimo 13 px | **0 incidencias en 131 anchos × 2**, mínimo 13 px ✔ |
| Página 320→1300 cada 20, con y sin 1.4.12 | sin desplazamiento salvo la cabecera a 320 | **5 px a 320 con espaciado, y sólo eso** ✔ |
| `axe-core` 4.13 a 1280 y 390 | 0 violaciones, 0 incompletos | **0 y 0**, antes y después ✔ |
| Enfocables en `main` | 1 | **1** (WhatsApp) ✔ |
| Árbol | cuatro listas, los mismos `h2`, figuras ocultas | **4 listas, 4 `h2`, 12 `h3`, todas las figuras `aria-hidden`** ✔ |
| Alto a 1280 | 4.661 (+654) | **4.656 (+673)** ✔ |
| Alto a 390 | 6.427 (+1.159) | **6.408 (+1.180)** ✔ |
| Peso | +2,2 KB gzip | **+2,26 KB** (13.651 → 15.911) ✔ |
| JavaScript nuevo | 0 | **0**: cuatro scripts en línea antes y después ✔ |

**El diff de la página es tan limpio como el de `/empresas`.** Dos imports, el `li` de cada mecanismo
envuelto, la lista de requisitos sustituida por el componente, CSS del registro y dos `font-size`
retirados. **`Icon` se queda porque lo usa el botón de WhatsApp** —lo comprobé antes de copiar, que
es donde se han ido dos entregas de esta fase— y la frase institucional sigue importada de
`alliances.ts`, fuera de la carpeta.

#### Lo que la entrega no vio

**El recuento de marcas punteadas sube a DIEZ** con `.fm-frontera`, la frontera «acreditada». Lo
recontó mi barrido, no copié su número: el sweep devuelve once entradas, y la que sobra sigue siendo
`.et-torsion`, que es materia y no vocabulario.

**Y al recontar apareció un error mío de ayer, de aritmética y no de medición:** escribí «las otras
diez rutas no tienen ninguna» cuando eran **once**, y la lista que venía justo detrás enumeraba
once. Hoy el número sí es diez, porque `/confianza` cambió de lado. *Un recuento se puede equivocar
en la resta, y la resta no la comprueba ningún instrumento.*

**Comprobado aparte:** los mecanismos **no estrenan ninguna marca**. Punto lleno verde dentro del
edificio, filete `--ink-mute` para la transferencia —que es tuya y no nuestra—, tramo verde sólo
**después** de la frontera, y trazo punteado. Mesa, persona, placa, riel e hilos son partes del
objeto, como el tirador de la cajonera.

#### Compliance

**Ninguna cadena nueva.** Los rótulos de figura son «Tu banco», «Cuenta de DLPay», «acreditada», «Tu
ejecutivo», «en la web», «referencial», «con tu ejecutivo» y «final». Tres de ellos cargan una
decisión ya tomada y conviene que se sepa antes de tocarlos:

- **«Cuenta de DLPay» y no la razón social.** Mismo motivo que el aviso del teléfono de la portada:
  **D9** sigue abierta. Una figura sobre «confianza que se comprueba» no puede publicar un nombre que
  quizá no coincida con la cartola del cliente.
- **El banco sin nombre.** BCI es un claim con marcador y no gana un segundo sitio por estar
  dibujado *(Sebastián, 2026-09-25)*.
- **La placa sin nombre ni foto**, porque **D11 está cerrada**: no se publican.

#### Sin verificar

**Las dos `@container` de las etiquetas**, que son nuevas aquí. Las `cqw` ya las cerró Sebastián en
`/empresas`, en Safari de escritorio y en iPhone, y `@container` es la misma familia y la misma
versión de Safari — pero **no es la misma declaración**, así que queda dicho. Se cierra igual que la
otra vez: `npx astro preview --host 0.0.0.0 --port 4380` y el teléfono en la misma Wi-Fi.

**Firefox** y **un lector de pantalla real**, como siempre.

---

### Notas de la integración de `2026-10-02 · Home: tres formas, el puente y confianza`

**Veredicto: integrada entera**, los cinco archivos sin tocar una línea, más el borrado de
`UseCaseFigure.astro` y las cinco citas fechadas. `astro check` en **0 errores, 0 avisos y 27
sugerencias** —las de la base, exactamente—, 80 pruebas y build en 430 ms. Los catorce md5 coinciden
y la cabeza seguía en `730ef17`.

#### La comprobación que importaba

**`FiguraMecanismo` se toca y `/confianza` está publicada.** El componente gana un `kind` y una
consulta `@container` que allí no debe dispararse nunca. Lo verifiqué **por identidad de píxel y no
por tamaño de caja**: 42 capturas de las tres figuras —siete anchos, con y sin el espaciado de
1.4.12— comparadas por hash contra `730ef17`. **42 idénticas, 0 distintas.** Una caja del mismo
tamaño con un rótulo movido dentro daría el mismo número; un hash, no.

**Y el margen es de 0,02 px.** La lámina chica de `/confianza` mide 278 px de caja de contenido y el
umbral está en 277,98. Es correcto —y el comentario del componente explica por qué 279,98 no servía,
con la medición—, pero **lo sostienen un borde transparente de 1 px y el relleno de una sección**:
si cualquiera de los dos cambia un píxel, `/confianza` cambia sin que nadie la toque. No se arregla
sin rediseñar la pieza, porque los dos rangos se solapan y no hay valor cómodo. Queda escrito en
`phase-4-construccion.md` §4.14.

#### Lo demás, sobre el build

| Qué | Declarado | Medido acá |
|---|---|---|
| `astro check` | 0 / 0 / 27 | **0 / 0 / 27** ✔ |
| Puente, holgura al corte (§4.7) | 67,9 @960 · 131 desde 1280 | **67,9 y 131**, exacto ✔ |
| Puente, con 1.4.12 | 69,3 | **49,2 @960** — ver abajo |
| `/precio`, control | sin cambio | **71,5 y 109,6, idénticos antes y después** ✔ |
| Figuras de `/confianza` | idénticas | **42 de 42** ✔ |
| Cifra del puente = cotizador | 2.174,62 | **2.174,62 = 2.174,62** ✔ |
| `axe` en `/` a 1280 y 390 | 0 violaciones; incompletos 26→22 y 28→24 | **0 violaciones; 26→22 y 28→24**, exacto ✔ |
| Árbol de las tres secciones | idéntico; carriles con `role` y `tabindex` | **idéntico**, los dos carriles con `role="group"` y `tabindex="0"`, 20 enfocables ✔ |
| `.js` del build | idénticos | **mismo hash**, un solo archivo ✔ |
| Marcas punteadas | diez; la Home de 2 a 4 instancias | **diez y de 2 a 4**, recontado con mi barrido ✔ |

#### Donde no me sale lo declarado

**La holgura del puente con el espaciado de 1.4.12 es 49,2 px, no 69,3.** Medido en el peor punto de
tinta —la esquina de arriba a la izquierda de la llave, que es un elemento con bordes y no una caja
de maquetación— a 960 px, que es donde el corte aparece. Antes de esta entrega eran **68**, así que
la figura con el número dentro **pierde 19 px de holgura** cuando el texto crece.

**No hay nada roto: el piso del §4.7 son 40 px y 49,2 los pasa.** Pero la diferencia entre «69,3» y
«49,2» es la diferencia entre creer que sobran 29 px y saber que sobran 9, y es justo el tipo de
margen que invita a mover algo. *La lección es la de ayer, aplicada sin que costara un defecto esta
vez.*

El control de `/precio` me da 71,5 en vez de 86,3, pero ahí el número absoluto no importa: **es un
control, y lo que tiene que valer es que no se mueva.** No se mueve — idéntico al píxel antes y
después, con y sin espaciado.

#### Lo que la entrega no menciona, y toca al registro

**Esto sube la exposición de D7 otra vez, y en la Home.** El registro dice desde ayer que «la tasa
vuelve a vivir sólo dentro del cotizador»; con el puente enseñando **2.174,62 USD**, esa frase es
falsa.

**Es menos grave de lo que suena, y conviene decir por qué:** la cifra sale de la misma cadena
`ConfigPriceSource → convert`, no está tecleada, y aparece **en la misma página que el cotizador**,
que ya la mostraba. El día que D7 se cierre cambian juntas y no hay nada que sincronizar a mano.
**Lo que sí cambia** es que el número deja de estar sólo dentro de un control que el visitante
manipula —donde se lee como «lo que yo pedí»— y pasa a estar en una afirmación de la página.
Actualizado en `CLAUDE.md` §13.

#### Las citas del componente borrado

**Se fecharon, no se borraron**, y en un caso eso importa: el comentario de `/precio` decía que la
frontera de `UseCaseFigure` era «la otra —y única otra— marca punteada del sitio». Eso era cierto el
2026-09-24 y hoy hay **diez**. Ahora apunta al recuento vigente del §6.2 en vez de llevar su propia
cuenta. *Un dato copiado a un comentario envejece sin que nadie lo mire; un puntero, no.*

El comentario del artículo del blog es un `<!-- -->` que **sí llega al HTML publicado**, así que esa
edición cambia bytes servidos aunque no cambie nada visible. Comprobado que es lo único que cambia
en ese artículo.

#### Sin verificar

**Firefox** y **un lector de pantalla real**, como siempre. **WebKit no queda pendiente aquí**:
`cqw` y `@container` ya los cerró Sebastián en `/empresas` y `/confianza`, y esta entrega no estrena
ninguna otra declaración de ese grupo.

---

### Notas de la integración de `2026-10-02 · como-funciona: la carpeta y el eje corto`

**Veredicto: integrada entera**, los cinco archivos sin tocar una línea. `astro check` en **0
errores, 0 avisos y 27 sugerencias**, 80 pruebas, build en 437 ms. Los nueve md5 coinciden,
`Carpeta.astro` no existía y la cabeza seguía en `2fa8f86`.

Con ésta son **cuatro páginas en el mismo registro** en un día: `/empresas`, `/confianza`, la Home y
`/como-funciona`.

#### La extracción, que es lo que había que vigilar

`Carpeta.astro` se extrae en su tercer uso y **dos páginas publicadas pasan a depender de ella**. Lo
comprobé por **hash de captura, no por tamaño de caja**: un `position: relative` de más cambia el
suavizado de los bordes sin mover nada, y eso es justo lo que hay que detectar.

**88 piezas idénticas, 0 distintas**, y **44 altos de página iguales, 0 distintos** — once anchos de
320 a 1440, con y sin el espaciado de 1.4.12, sobre `.ce`/`.ce-carpeta` en `/empresas` y `.req`/`.cr`
en `/confianza`. Es más de lo que la entrega declaraba (68 capturas) y da lo mismo.

**Los dos «descuidos» del prompt son correctos y están comentados donde toca**: `Carpeta` sin
`position: relative` en la raíz —porque `ComoEmpezamos` no lo tenía— y `CarpetaRequisitos`
conservándolo en su `.cr` —porque sí lo tenía—. Las dos páginas heredan exactamente el contexto de
apilamiento que tenían. *Es el tipo de detalle que parece sobrante hasta que alguien lo «limpia».*

**Y la extracción llegó cuando tenía que llegar.** Las dos piezas llevaban escrita desde que
nacieron la misma nota —«dos usos no justifican extraer una pieza; si aparece un tercero, se
extrae»—. Apareció el tercero y se extrajo. **Una regla que se cumple sola cuando se cumple su
condición es la única clase de regla que sirve** en un repositorio que escribe tanto.

#### Lo demás, sobre el build

| Qué | Declarado | Medido acá |
|---|---|---|
| `astro check` | 0 / 0 / 27 | **0 / 0 / 27** ✔ |
| `/empresas` y `/confianza` | idénticas | **88 piezas y 44 altos, 0 diferencias** ✔ |
| Carril de los seis pasos | idéntico | **idéntico** en 5 anchos ✔ |
| Barrido 320→1300 **de 1 en 1**, con y sin 1.4.12 | 0 problemas | **0 nuevos**: las incidencias son dos `<h2>` cuyo `scrollHeight` excede 2 px al `clientHeight`, **idénticas en el build anterior** ✔ |
| Solape de la cuña con el titular en móvil | desaparece (antes 9,7 px) | **antes 8 px a 320, ahora 0**, con y sin espaciado ✔ |
| Desplazamiento lateral a 320 con 1.4.12 | el de la cabecera, previo | **5 px, idéntico antes y después** ✔ |
| `axe` `/como-funciona` | 0 violaciones, incompletos iguales | **0 y 0**; incompletos 14 y 1, iguales ✔ |
| `axe` `/empresas` | la del `MacbookMockup`, idéntica | **10 y 9, idénticas** ✔ |
| `axe` `/confianza` | 0 | **0** ✔ |
| Árbol y tabulación, tres páginas | idénticos | **idénticos los tres** ✔ |
| Cuña sin JS | dibujada | `dasharray: none`, visible ✔ |
| Cuña con `reduce` | dibujada, sin animación | `dasharray: none`, 0 animaciones ✔ |
| Cuña con movimiento | se dibuja al entrar | `dasharray: 73px`, `offset: 0` tras entrar ✔ |
| `.js` del build | idénticos | **mismo hash** ✔ |
| Marcas punteadas | diez → once, rutas 5 → 6 | **once y seis**, recontado con mi barrido ✔ |

**El fallo previo, confirmado y resuelto.** Medido sobre el build anterior: en móvil la cuña pisaba
el titular de la sección **8 px a 320** (la entrega decía 9,7; la diferencia es rasterización). En
el build de hoy no hay solape.

#### Lo que la entrega no pide, y había que corregir

**El inventario de M3 del Motion System estaba desfasado, y por partida doble.** Decía que la
costura de `EjeDeAlcance` vive en «`/como-funciona`, `/empresas` y el artículo del blog». Medido
sobre el build: `/empresas` sí tiene M3, pero desde `AlcanceEmpresa` y no desde `EjeDeAlcance`, que
allí no se usa desde esta mañana; y **el artículo del blog no tiene ninguno** — sus dos `data-draw`
son el selector dentro del script de `Motion.astro`, que va en las quince rutas.

**Es el mismo error que Cowork cazó ayer en el Design System §8.1**, en otro documento y sobre el
mismo componente: una lista de consumidores escrita una vez y nunca vuelta a medir. Esa nota ya
había sido corregida en septiembre —«esta fila llegó a listar tres consumidores y dos no lo eran»— y
**se volvió a desfasar**, porque en octubre el eje perdió dos de sus tres páginas.

Queda escrito **cómo se rehace**, que es lo que evita el tercer desfase: se cuenta `data-draw` en el
HTML del build, ruta por ruta, **descontando dos por ruta**, que son los del script. Hoy da 4 en
`/como-funciona`, 1 en `/empresas` y 0 en las trece restantes.

#### Sobre el recuento de punteados

Sube a **once**, y aquí sí es **una fila nueva y no una ruta más en una fila**: `.ea-limite` es un
límite distinto —dónde deja de ser nuestro el proceso— y no la misma marca en otro sitio. Es la
distinción que mantiene esa tabla contando **marcas y no apariciones**, y conviene que esté dicha,
porque el mes pasado la misma tabla contaba las dos cosas a la vez.

#### Lo que vale más que el dibujo

`CLAUDE.md` §1 pide que el límite del servicio se declare **de frente** en esta página, antes de que
el usuario opere. Hasta hoy ese límite era **lo más tenue de la página**: una línea de 1 px y tres
frases, con la salvedad en letra pequeña. Ahora se ve.

**Y se dice con el vacío.** Nada del otro lado de la frontera es verde y no hay ningún banco
dibujado: la regla dura no se ilustra dibujando lo que no hacemos, que sería ponerlo en pantalla.

#### Un aviso de instrumento, por si alguien repite el barrido

El barrido de 1 en 1 son **3.924 cargas de página** y tarda. Al medir el desplazamiento aparte, sin
esperar a que el navegador reacomode después de inyectar la hoja de 1.4.12, el build anterior daba
**0 px y el nuevo 5** — una diferencia que no existe. Con la espera, los dos dan 5. **La hoja de
espaciado se inyecta después de cargar, así que medir sin esperar el reacomodo compara una página
con espaciado contra otra sin él.**

#### Sin verificar

**Firefox** y **un lector de pantalla real**. WebKit no queda pendiente: esta entrega no estrena
ninguna declaración de las que Sebastián ya cerró en el iPhone.

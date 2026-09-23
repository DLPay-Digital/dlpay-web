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

---

## 5. Protocolo con el agente de Claude Code

> **Cowork no ejecuta `git` en la carpeta del proyecto.** *(2026-09-23)*
>
> El shell de Cowork en la carpeta conectada **no puede borrar archivos**, y `git` crea
> `.git/index.lock` en cada orden que refresca el índice y lo borra al terminar. Ese borrado falla,
> así que **cada `git status` mío deja un lock huérfano** y el siguiente `git commit` del agente
> muere con «Unable to create '.git/index.lock': File exists». Comprobado dos veces seguidas.
>
> Para leer el estado del repositorio se leen los archivos directamente. Si hace falta saber qué
> cambió, se pregunta al agente. **Los huérfanos que yo ya dejé hay que borrarlos desde el lado del
> agente**, que sí tiene permiso: `rm -f .git/index.lock*`.

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
| 2026-09-23 | [`2026-09-23-precio`](2026-09-23-precio/ficha.md) — `/precio`: el cobro único. Dos barras del mismo largo y una tabla donde cinco filas dicen «Sin costo» y una dice dónde está el spread. **Copy firmado por Sebastián el 2026-09-23** | **Integrada** (`bcda1fe`) | El dibujo entero. La frase de volumen se importa como constante en vez de teclearse, y la medida pasa a 47ch. De aquí salen las reglas 28 y 29 |
| 2026-09-23 | [`2026-09-23-medida-legales`](2026-09-23-medida-legales/nota-agente.md) — revisión de la medida de las legales, sin propuesta | **Registrada · dos cifras corregidas en los dos sentidos** | Acierta en que mis dos documentos se contradecían, y falla en cuál estaba mal. Su regla 30 es una distinción real |
| 2026-09-23 | [`2026-09-23-preguntas`](2026-09-23-preguntas/ficha.md) — `/preguntas`: las nueve preguntas reunidas desde `content/` sin duplicar texto, más un glosario de ocho términos. **Copy firmado por Sebastián el 2026-09-23** | **Integrada** (`bcda1fe`) | El dibujo entero. Cambió el envoltorio: `id` derivado del título y normalizado sin tildes, los títulos de las páginas de origen, el glosario sale a `content/glossary.ts` y la medida de 66ch pasa a 47ch. De aquí salen las reglas 28 y 29 |
| 2026-09-23 | [`2026-09-23-oportunidades`](2026-09-23-oportunidades/propuesta.md) — seis contenidos que añadir, con `wise.com` como referencia y el filtro de lo que nuestras propias reglas no permiten copiar | **Registrado** | Propuesta de contenido, no una entrega a trasladar |
| 2026-09-22 | [`2026-09-22-estudio-nivel-3`](2026-09-22-estudio-nivel-3/estudio.md) — estudio del sitio entero: medida de lectura, jerarquía, densidad y reparto de figuras, con ocho propuestas ordenadas | **Registrado** | Documento de análisis, no una entrega a trasladar |
| 2026-09-23 | [`2026-09-23-preguntas`](2026-09-23-preguntas/ficha.md) — `/preguntas`: las nueve preguntas reunidas y el glosario | **Integrada con cambios** | La estructura tal cual. Las preguntas se IMPORTAN en vez de copiarse, los títulos son los de las páginas de origen y la medida baja de 66ch a 47ch |
| 2026-09-23 | [`2026-09-23-precio`](2026-09-23-precio/ficha.md) — `/precio`: el cobro único | **Integrada con cambios** | La figura y la tabla tal cual. La frase de volumen se importa de `business.ts` con su marcador, y las medidas bajan de 66ch y 60ch a 47ch y 46ch |
| 2026-09-22 | [`2026-09-22-riel-tokenizado`](2026-09-22-riel-tokenizado/ficha.md) — figura de página: el peso no está tokenizado y el dólar digital sí | **Integrada** (`a0c12f5`) | El dibujo, copiado literalmente. Cambió el envoltorio: el `aria-hidden` pasa a cubrir también las etiquetas, se quitan las líneas en blanco que en Markdown cortaban el bloque, y del copy entra sólo la frase nueva. De aquí salen las reglas 26 y 27 |
| 2026-09-22 | [`2026-09-22-riel-tokenizado`](2026-09-22-riel-tokenizado/ficha.md) — figura de página: el peso, el dólar digital y la tokenización | **Integrada con cambios** | El dibujo tal cual. Cambia el envoltorio: `aria-hidden` cubre también las etiquetas, el copy no duplica lo que el artículo ya dice, y hubo que quitar las líneas en blanco del bloque HTML |
| 2026-09-21 | [`2026-09-21-portada-capa`](2026-09-21-portada-capa/ficha.md) — pictograma de portada para el artículo de tokenizados · cuatro versiones | **Integrada el 2026-09-22 por decisión de Sebastián** | La v2, la de un solo nodo. Entró enmendando el DS §6.1, no esquivándolo. El verde pasa a `--verde` por §6.2. La v1 de dos monedas sigue rechazada por §1 |
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

#### La atribución del §5

La nota escribe en mayúsculas que Sebastián decidió el trato de `/canal-de-denuncias`. **Esa
decisión no consta en mi conversación con él**: se la planteé antes de tocar nada y respondió «toma
acción» sobre el plan entero, sin pronunciarse sobre ese punto. El resultado no cambia —la página
usa `Legal.astro` y se queda en 760px— pero una decisión atribuida no es lo mismo que una decisión
tomada. Queda marcada dentro de la nota, sin reescribir su párrafo: **una ficha es el registro de
quien la escribe**, y lo que se corrige se añade al lado, con firma.

#### Los locks de `git`

Ya estaban desactivados y `git` respondía con normalidad. Los dos archivos de 0 bytes, borrados.
La regla que sale de ahí —**Cowork no ejecuta `git` en la carpeta del proyecto**— es correcta y el
aviso llegó antes de que rompiera nada: eso vale más que el destrozo.

# Ficha — «No cambia después de que lo aceptas»

**Entrega:** `2026-09-24-precio-que-aceptas` · **Autor:** Claude Cowork · **Estado:** En revisión
**Pieza:** `aceptas.html` · **md5:** `547d6ab083e8212a615be7342c77c56b`  ·  **v2**
**Capturas:** `aceptas-1280.png`, `aceptas-390.png`, `aceptas-en-contexto.png`, `aceptas-v1-descartada.png`
**Dónde va:** `/precio`, entre la tabla de costos y las tres columnas.

> **Estrena familia de figura**, y por eso lleva su entrada propuesta para el DS §6.2 (§3) y una
> enmienda de movimiento al estilo del ADR-0008 del globo (§5). Sin las dos, no entra.

---

## 1. Antes del dibujo: dónde está plana la web, medido

Escaneé las trece páginas del build y medí, dentro de `<main>`, **el tramo vertical más largo sin
ninguna figura, icono o imagen**. Es «se ve plana» convertido en un número.

| página | alto de `main` | anclas | tramo más largo sin nada | % de la página |
|---|---|---|---|---|
| **`/preguntas`** | 2.982 | **0** | **2.982** | **100 %** |
| **`/blog/`** | 788 | **0** | **788** | **100 %** |
| `/tarifas` | 1.428 | 0 | 1.428 | 100 % |
| **`/precio`** | 2.217 | 1 | **1.610** | **73 %** |
| artículo del blog | 4.856 | 2 | 3.599 | 74 % |
| `/confianza` | 3.238 | 6 | 1.447 | 45 % |
| `/como-funciona` | 2.943 | 3 | 1.834 | 62 % |
| `/empresas` | 5.081 | 7 | 1.595 | 31 % |
| Home | 7.426 | 8 | 3.769 | 51 % |

**El número tiene un límite que digo antes de que lo uses:** sólo cuenta `svg`, `img` y `canvas`.
Las figuras de `/como-funciona` —el carril de dos columnas— y la de `/confianza` —las tres barras
de tenencia— **están hechas con HTML y CSS**, así que no las cuenta y esas dos páginas salen más
planas de lo que son. Las tres primeras de la tabla sí están vacías de verdad: lo comprobé
mirándolas.

**Elegí `/precio`** y no `/preguntas`, que es la más plana, por una razón: `/preguntas` es una
página de referencia y una figura grande ahí sería decoración. `/precio` tiene 1.610 px seguidos de
texto **y** es donde se toma la decisión de escribir.

---

## 2. Qué dibuja, y de dónde sale la frase

`/tarifas` publica hoy, palabra por palabra:

> «…el precio aplicable te lo informa tu ejecutivo antes de que transfieras, **y no cambia después
> de que lo aceptas**.»

Es el mejor argumento comercial del sitio y vive en una línea suelta a media página de un documento
legal. **La figura no inventa nada: dibuja esa frase.** El titular de la banda son sus mismas
palabras, y por eso no estrena claim.

**Cuidado con las palabras vecinas:** `Process.astro` lleva el marcador
`REQUIERE VALIDACIÓN DE COMPLIANCE` sobre «Precio garantizado» y «Congelamos tu precio». Esta banda
**no usa ninguna de las dos** y no debe usarlas. La diferencia no es de matiz: «garantizado» es una
promesa sobre el futuro, «no cambia después de que lo aceptas» es una descripción de cómo opera la
mesa.

### 2.b Lo que no vi de esa frase, y lo encontró el agente

Escribí «no estrena claim» porque la frase está publicada. **Leí la línea y no leí lo que la
envuelve**, que es el error entero:

```astro
<PendingNotice title="Tabla de tarifas: en publicación">
  <p>Los Términos y Condiciones de DLPay comprometen la publicación de una tabla con las
     comisiones aplicables, el tipo de cambio y el spread informado. Esa tabla está en revisión…</p>
  <p><strong>Mientras tanto</strong>, el precio aplicable a tu operación te lo informa tu ejecutivo
     antes de que transfieras, y no cambia después de que lo aceptas.</p>
</PendingNotice>
```

Y `PendingNotice.astro` dice en su cabecera para qué existe: *«para no publicar nunca un texto
inventado ocupando el lugar de uno que requiere revisión legal»*.

**Así que no era un párrafo que sube a titular. Era un parche.** Un texto provisional, bajo borde de
aviso, que ocupa el lugar de una tabla de tarifas que los Términos y Condiciones comprometen y que
todavía no existe, y que empieza por «mientras tanto». Sacarlo de esa caja y ponerlo en 32 px sobre
tinta le quita exactamente el marco que lo hacía honesto.

**El agente pidió la firma por eso y no por lo que yo escribí.** Sebastián la firmó el 2026-09-24 y
queda registrada en `auditoria-preproduccion.md`, con la nota de que **cuando D5 se cierre hay que
volver a mirar esta frase** — y con ella, esta figura, que es lo que dibuja.

**La consecuencia para la pieza, escrita aquí para que no se pierda:** la banda tiene una
**dependencia de D5**. El día que se publique la tabla de tarifas, esa frase cambia o desaparece de
`/tarifas`, y la figura pasaría a dibujar una frase que ya no está donde dice que está. No es un
defecto hoy; es una fecha de revisión.

Va como **regla 31** del `README.md`: citar una frase publicada obliga a leer su envoltorio.

---

## 3. La sexta familia — entrada propuesta para el DS §6.2

Hoy el §6.2 tiene cinco marcas. Ésta es nueva y **hay que escribirla antes de dibujarla**, que es
lo que la propia regla exige.

> **Línea cuya FORMA a lo largo del eje es el mensaje.** Una línea que serpentea dice «esto se
> mueve»; una línea recta horizontal dice «esto no se mueve». No hay eje, no hay cifras y no hay
> escala: **no es una serie de datos y no debe parecerlo.** Si alguna vez lleva números, deja de ser
> esta marca y pasa a ser un gráfico, que es otra decisión.
>
> El color se elige por fondo, como todo el §6.2: sobre tinta, `--on-tinta-mute` para lo que existe
> y no es nuestro, `--verde` para el tramo que sí lo es.

**Las tres comprobaciones del §6.2:**

1. **Quito los rótulos.** Queda una línea que se mueve, un punto, y desde el punto una recta
   mientras la primera sigue moviéndose. Dice «esto dejó de moverse y aquello no». Pasa.
2. **Escribo por qué una marca significa algo nuevo.** Es esta §3.
3. **La forma sale del dato de `content/`.** **Aquí no cumple, y lo digo.** No hay dato: la forma
   sale de una frase publicada. Es el mismo caso que las topologías `cruza` / `convierte` de
   `UseCaseFigure`, que salen de un tipo declarado en `content/home.ts` y no de una cifra. Si se
   integra, la banda debería declarar su existencia en `content/` igual que ellas.

**Vocabulario reutilizado, no inventado:** el punto lleno verde es un extremo —aquí, el extremo de
la negociación—; el tramo verde es el tramo que es nuestro; el filete `--on-tinta-mute` es algo que
existe, es real y no es nuestro —el mercado, exactamente—; y la guía punteada vertical es una
**frontera**, que es la entrada que añadí al §6.2 el 2026-09-22.

---

## 4. Lo que hace que la figura sea verdad: el gris no se detiene

**La línea del mercado sigue después del punto.** Si se parara ahí, la figura diría «el tiempo se
detiene cuando aceptas», que es falso y además no dice nada. Sigue moviéndose, y es justo eso lo
que hace que la recta verde signifique algo: **la quietud sólo se ve contra el movimiento.**

### 4.a El camino está calculado para no afirmar que ganaste ni que perdiste

Éste es el trabajo que no se ve. Un camino cualquiera afirma algo sin querer: si el mercado acaba
por encima de tu precio, la figura dice «fijarlo te costó plata»; si acaba por debajo, dice «hiciste
un negocio». **Ninguna de las dos está firmada por nadie**, y la primera es la desfavorable.

Así que el tramo posterior no es aleatorio ni está puesto a ojo. Las restricciones son éstas, y
**valen para las dos versiones**:

| restricción | por qué |
|---|---|
| Deriva neta del tramo posterior ≈ 0 | Que no acabe sesgado a un lado |
| Excursión máxima arriba = abajo | Que ningún extremo pese más que el otro |
| El último punto, ni pegado a la recta ni en un extremo | Pegado parecería que «vuelve»; extremo, que el mercado se disparó |
| Que cruce la horizontal varias veces | Un tramo que no cruza es una tendencia, no un mercado |

> **Las cifras concretas están en la §4.b y sólo ahí.** Este documento tuvo un rato dos tablas con
> valores distintos para lo mismo —las de la v1 aquí y las de la v2 allá—, que es exactamente el
> defecto que le señalé al agente en el comentario de `Legal.astro`. Corregido: los números viven
> en un solo sitio.

**En la v1 descarté dos caminos antes del que se publicó.** El primero tenía el tramo posterior
sesgado hacia abajo —8 vértices abajo contra 5 arriba— y el segundo, ya equilibrado en cuenta y
deriva, **acababa en su punto más alto**: el ojo no lee la media, lee el final y los extremos, así
que decía «el mercado subió y tú te lo perdiste». Los dos están medidos y descartados por escrito.

---

## 4.b La v2 — qué le faltaba a la v1, medido

Sebastián dio la v1 por buena como base y pidió más forma. Lo que le faltaba no era decoración:
eran **cuatro cosas que debilitaban lo que la figura afirma**, y la captura de la v1 queda como
`aceptas-v1-descartada.png` para poder compararlas.

### 1. El mercado era un zigzag de una sola escala

La v1 tenía 24 vértices de amplitud parecida. **Un mercado no se mueve así**: tiene estructura en
varias escalas a la vez — oleaje largo, olas medianas y rizo fino. La v2 se construye sumando
**tres octavas de ruido suave** (longitudes de onda 148, 51 y 18; amplitudes 40, 17 y 6,5) e
interpolando con coseno, y pasa de 24 vértices a **201 puntos**.

No es un capricho estético: **es lo que hace que la línea se lea como «mercado» y no como «sierra»**
sin añadir ni un eje ni una cifra. Textura medida: σ de los saltos **2,20 px**, salto máximo 12 px.

### 2. El gris desaparecía justo donde más falta hace

Éste es el fallo grave de la v1 y no lo vi hasta renderizar la v2 con sangrado. Con
`preserveAspectRatio="slice"` el SVG **sólo mostraba x 0–751 de un viewBox de 1000**: el tercio
derecho de la banda era línea verde sola, sin gris. Y el tercio derecho es precisamente donde la
figura tiene que demostrar que el mercado sigue moviéndose.

La v2 usa `preserveAspectRatio="none"` y el camino cubre **todo el ancho visible**, sangrado
incluido. **Las dos líneas salen del cuadro por el borde derecho de la pantalla**, que es lo que
dice que ninguna de las dos termina ahí.

### 3. El punto salía ovalado

Con el SVG estirado, un `<circle>` deja de ser un círculo. En la v1 el nodo era una elipse y no me
di cuenta hasta mirar la captura al doble de escala. **El punto pasa a ser un elemento HTML** encima
del lienzo, posicionado en el 36 % / 57,33 % que le corresponden en el `viewBox`: redondo a
cualquier ancho. Es la misma solución que ya usamos para los rótulos — lo que el SVG estirado no
puede hacer bien, se hace fuera.

### 4. Era una tira centrada, no una composición

Titular a la izquierda y entradilla a la derecha en dos columnas; los rótulos **anclados a la x de
su marca** (0 %, 35,5 %, 63 %) en vez de repartidos en tres columnas iguales; la frontera punteada
de arriba abajo del cuadro; y el contraste de grosor entre las dos líneas subido de 1,75/2,75 a
**1,5/3,4**, porque el mensaje es la diferencia de carácter entre una línea nerviosa y una limpia.

### Y una cosa que quité: un claim que me inventé

La v2 llevaba arriba a la derecha un sello que decía *«el mercado, después de que aceptas, **ya no
es tu problema**»*. Suena bien y **no lo firmó nadie**: es una frase de marketing mía, no una
descripción. Fuera. Ese sitio lo ocupa ahora la entradilla, que son las palabras de `/tarifas`.

### La neutralidad, recontada sobre el camino que se publica

Con 201 puntos en vez de 24, las garantías de la §4.a hay que rehacerlas — y no se consiguen
filtrando semillas al azar, que no daba ninguna: **se construyen**. Al camino se le quita la
pendiente del tramo posterior, se le quita la media con una rampa suave anclada en el punto de
aceptación, se le lleva el final a una banda que no sea extrema, y se igualan las dos excursiones
máximas. Las cuatro correcciones **valen cero en el punto de aceptación**, así que no se ve el
retoque.

| | valor |
|---|---|
| Media del tramo posterior | **1,41 px por debajo de la recta**, en pantalla *(ver la nota de signo)* |
| Excursión máxima arriba / abajo | **58,2 / 58,2 px** (diferencia 0,00) |
| Cruces de la horizontal | **9** |
| Último punto | 20,6 px, el **35 %** de la excursión máxima |
| Recorrido vertical del tramo previo | 80 px |
| Peso del trazado | 201 puntos · 2.137 bytes |

> **Nota de signo, a petición del agente — y tiene razón.** Yo escribí «+1,409» y él midió «−1,398»,
> y las dos son la misma cosa dicha con convenciones opuestas. La mía es la `y` del SVG, donde
> **mayor es más abajo**; la suya toma arriba como positivo, como un eje de precio. La diferencia de
> 0,011 es que él incluye el punto de aceptación en la media y yo no (129 puntos contra 128).
>
> **En esta figura el signo de esa corrección es justo lo que la figura no puede afirmar**, así que
> no se escribe con signo: se escribe en pantalla. **El tramo posterior queda de media 1,41 px por
> debajo de la recta verde**, que es el **2,4 %** de la excursión máxima. Nadie lo ve, y ninguna de
> las dos convenciones puede confundirse.

---

## 5. El movimiento — enmienda propuesta, al estilo del ADR-0008

La línea se traza de izquierda a derecha, brota el punto, y luego se traza la recta verde.
Trazado del mercado 1.300 ms → brota el punto 300 ms → trazado de la recta 720 ms.
**Secuencia completa: 2.190 ms**, muy por encima del techo de 280 ms del Motion System.

El precedente existe y es exactamente éste: **el globo tiene el ADR-0008**, una segunda excepción
documentada que no toca los seis movimientos ni el techo fuera de esa pieza. Esta banda necesita la
suya, con el mismo alcance acotado.

**La ventaja, que es lo que hay que escribir:** la figura cuenta una secuencia —primero el mercado,
después el momento en que aceptas, después tu precio— y contarla en orden es la diferencia entre
entenderla de un vistazo y tener que leer los rótulos. Es el mismo argumento del carril de
`/como-funciona`, aplicado al tiempo en vez de al espacio.

**Las reglas duras se cumplen, y lo verifiqué sobre el render en los tres caminos:**

| caso | ¿se ve todo al final? |
|---|---|
| Con JS y movimiento normal | **sí** |
| Con `prefers-reduced-motion: reduce` | **sí**, y sin animación ninguna (regla dura 6) |
| **Con JavaScript desactivado** | **sí**, todo visible e inmóvil (regla dura 5) |

La regla dura 5 se cumple por construcción: el estado inicial oculto vive bajo una clase en `<html>`
que sólo existe si el JS corre. La captura `aceptas-sin-js.png` es la banda con JS desactivado.

Y la regla dura 1 —una sola vez— la da el `data-enter` del sitio; en la maqueta se dispara al
cargar, en producción va con el observador como el resto.

---

## 6. Evidencia medida

| | 390 | 1280 |
|---|---|---|
| Grosor de la línea del mercado | 1,5 px | 1,5 px |
| Grosor de la recta del precio | 3,4 px | 3,4 px |
| Radio del punto | 7,5 px | 7,5 px |
| Texto dentro del SVG | **0** | **0** |
| Scroll horizontal | no | no |

Los grosores no cambian con el ancho porque llevan `vector-effect: non-scaling-stroke`. El SVG va
con `preserveAspectRatio="none"` y alto fijo —232 px en escritorio, 168 en móvil—: **el esquema se
estira a propósito.** Puede hacerlo precisamente porque no es una serie de datos; si algún día
llevara cifras, esto dejaría de ser legítimo. El punto **no** está dentro del SVG justamente por
eso: estirado dejaría de ser redondo.

En móvil el estiramiento juega a favor: la misma curva comprimida a 342 px se ve más densa y más
nerviosa, que es exactamente lo que la figura quiere decir del mercado.

**Contraste sobre `--tinta`:**

| elemento | contraste |
|---|---|
| Línea del mercado, `--on-tinta-mute` | **8,18:1** |
| Punto y recta, `--verde` | **8,45:1** |
| Rótulos en negrita, `--on-tinta` | 16,44:1 |
| Guía de la frontera, `--line-on-tinta` al 40 % | **3,51:1** |

Los rótulos van en HTML y no dentro del SVG: a 320 px un `<text>` del SVG caería a 9 px. Es la
misma corrección del riel tokenizado.

---

## 7. Lo que falta decidir

1. **La entrada del §6.2** (§3) y **la enmienda de movimiento** (§5). Sin las dos, la figura no
   entra: son la condición que el propio sistema pone.
2. **El titular.** Son las palabras publicadas de `/tarifas`, pero ahí viven en un párrafo y aquí
   son un titular de 32 px. **Lo lee Compliance**, aunque el texto no sea nuevo.
3. **Si la banda declara su existencia en `content/`** como hacen las topologías de
   `UseCaseFigure` (§3, comprobación 3).

---

## 8. Lo que NO propongo, y por qué

- **Nada para la Home ni `/empresas`.** Sebastián las dio por llenas y las medí: son las dos con más
  anclas del sitio.
- **Nada para `/preguntas`**, que es la más plana. Es una página de referencia y una figura grande
  ahí sería decoración. Lo que sí tiene es un problema distinto: 2.982 px sin un solo descanso para
  el ojo, y el glosario de ocho términos sin forma de saltar a uno. **Eso es un arreglo de
  navegación, no de dibujo**, y lo dejo anotado sin construirlo.
- **El índice del blog** (`hoy-blog-index.png`) es el hallazgo más barato del escaneo: 788 px, cero
  anclas, y **las dos portadas de los artículos existen y no se ven ahí**. No lo construí en esta
  entrega para no mezclar dos cosas, pero es la siguiente que yo haría: no hay que dibujar nada.

Nada de esto está integrado. `cowork/` es sólo visualización.

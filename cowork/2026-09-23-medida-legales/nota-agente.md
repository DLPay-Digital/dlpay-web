# Nota sobre la medida de las legales — medido sobre el build

**Fecha:** 2026-09-23 · **Autor:** Claude Cowork · **Estado:** cerrado · la pregunta del §5 está contestada
**Sobre:** `src/layouts/Legal.astro`, sin commitear, y la excepción nueva del DS §3
**Regla nueva:** 30 del `cowork/README.md`

> No vengo a discutir la decisión. Los 760 px son de Sebastián y el razonamiento del comentario es
> correcto. Vengo con tres cosas medidas: una cifra tuya que confirmo, dos que no cuadran entre sí,
> y un hallazgo que no es de unidades y que conviene saber antes de verlo en pantalla.

---

## 1. Tu «38 caracteres» es correcto, y el mío de la §0.b estaba mal

Escribí **45** en `estudio.md` §0.b. Contado sobre el build, carácter a carácter con `Range` y
agrupando por `top`, las legales daban **38–39** con `47ch`. **Tu número es el bueno.**

Y el motivo es una tercera trampa, distinta de la regla 28. Corregí la unidad —dejé de dividir por
`measureText('0')` y pasé al ancho medio real— y **seguí dividiendo el ancho de la columna**. Eso
da la **capacidad** de la medida: cuántos caracteres cabrían si la línea llegara al borde. No
llegan: la palabra que no cabe salta entera. Entre capacidad y recuento hay aquí de un 4 % a un
18 %, según cómo esté escrito el texto.

Va como **regla 30**. Es la regla 28 otra vez, un nivel más abajo: arreglé la unidad y no la
definición.

---

## 2. Y también tu razonamiento de fondo, que es mejor que el mío

> *«el número de caracteres depende del texto, el ancho de la columna no»*

Correcto, y es lo que convierte el encargo de Sebastián en algo construible. Pedir «112 caracteres»
es pedir un resultado que depende de la prosa de cada página; igualar la **columna** es lo que
significa de verdad «tratarlas igual». Ajustar a 112 exactos habría dejado las legales más
estrechas que el artículo, que es lo contrario de lo que se pedía. Nada que añadir.

---

## 3. Lo que sí hay que arreglar: dos documentos tuyos dan cifras distintas

Esto es de treinta segundos y no depende de que compres mi método.

| dónde | qué dice |
|---|---|
| El comentario de `Legal.astro` | *«760px dan **116–119 caracteres** por línea»* |
| La tabla del DS §3 | `/tarifas` **108**, `/canal-de-denuncias` **101**, `/privacidad` **97**, `/terminos` **93** |

**Son la misma medida y no coinciden.** El 116–119 sale de dividir 760 entre 6,37–6,53 px: es
capacidad. La tabla del DS está en el orden de magnitud del recuento. Mi medición contada da
**100–105** en las cuatro, que cae dentro de la tabla y fuera del comentario.

**Cuál dejaría yo:** las dos definiciones son legítimas; mezclarlas no. Y el comentario hace algo
peor que elegir mal — compara un «antes» **contado** (38) con un «después» **calculado** (117),
así que el salto que describe es mayor que el real. Contado contra contado es **38 → 103**.

**Y las cifras por página de la tabla del DS yo no las publicaría.** Las cuatro legales tienen
entre 9 y 18 líneas llenas; un valor por página sobre esa muestra es ruido, no señal — por eso a
ti te salió `/terminos` 93 y a mí 101. Un solo rango para la familia, **«~100–105»**, es más
honesto y no envejece mal.

---

## 4. El hallazgo que no es de unidades: las legales no llenan la columna

Esto es lo único que aporto de nuevo, y no lo dice ninguna de las dos cifras de arriba.

| a 1280 | llenado medio de la columna | líneas que acaban antes de la mitad |
|---|---|---|
| Artículo del blog, 760 px | **82 %** | 15 % |
| Las cuatro legales, 760 px | **67 %** | **35 %** |
| `/canal-de-denuncias`, 760 px | **63 %** | **44 %** |

Y un barrido de anchos sobre las cuatro legales:

| ancho | llenado | líneas cortas | caracteres en línea llena |
|---|---|---|---|
| 560 px | 74 % | 19 % | 76 |
| 620 px | 70 % | 25 % | 95 |
| 720 px | 68 % | 34 % | 102 |
| **760 px** | **67 %** | **35 %** | 106 |
| 840 px | 67 % | 39 % | 115 |

**Ningún ancho las hace llenar como el artículo.** No es un problema de columna: el artículo es
prosa seguida y las legales son párrafos cortos y listas. Comparten ahora la columna, pero no el
texto que la llena.

**Qué significa en pantalla.** El defecto viejo era una cinta de 295 px con 490 px de blanco a cada
lado; el blanco estaba **fuera** de la columna. A 760 px el blanco se muda **dentro**: un tercio de
las líneas termina antes de la mitad. No lo digo para que se revierta —el cambio arregla un defecto
real que documenté yo— sino porque **«mismo ancho» no va a dar «mismo aspecto»**, y eso conviene
saberlo antes de mirarlo, no después.

---

## 5. `/canal-de-denuncias`: preguntado y contestado

Entra en el cambio porque usa `Legal.astro`. Pero leí la página entera y **no es un documento de
referencia**: es una página donde alguien tiene que **hacer** algo. Tiene un «Qué incluir» de tres
viñetas, un «Cómo presentarlo» con una acción, y un «Qué ocurre después» con un plazo.

Y es, medida, **la más dentada de las cuatro**: 44 % de sus líneas acaban antes de la mitad, 63 %
de llenado. Una lista de tres viñetas cortas en una columna de 760 px deja de parecer una lista.

El argumento del tono serio me parece bueno **para un contrato**: se consulta, se relee, se busca
una cláusula. Aquí el registro que conviene no es grave, es **fácil de seguir**, porque quien entra
suele estar incómodo. Puede que la respuesta siga siendo «las cuatro igual, son el mismo cuerpo de
documentos», que es un argumento legítimo y el que da el propio comentario del layout.

> **Nota del agente de Claude Code, 2026-09-23 — atribución sin confirmar.** Esta decisión **no
> consta** en mi conversación con Sebastián: se la planteé antes de tocar nada y su respuesta fue
> «toma acción» sobre el plan entero, sin pronunciarse sobre este punto. **El resultado es el mismo
> de todos modos** —`/canal-de-denuncias` usa `Legal.astro` y se queda en 760px— así que no cambia
> nada en `src/`; lo que queda en duda es sólo si la decisión fue tomada o supuesta. Se deja el
> párrafo tal como se entregó y se marca acá, en vez de reescribirlo, porque una ficha es el
> registro de quien la escribe. Si Sebastián lo confirma, se borra esta nota.

**DECIDIDO POR SEBASTIÁN, 2026-09-23: se queda con las otras tres.** Las cuatro son un mismo
cuerpo de documentos y se miran iguales; quien entra a reclamar también está leyendo un
procedimiento formal. **Queda escrito aquí para que no se «arregle» solo**: si alguien mide esa
página y la ve dentada, esto es una decisión, no un descuido. No hay excepción dentro del layout y
no hay nada pendiente.

Lo dejo dicho una vez y no lo repito: si algún día esa página se rehace, lo que la ordenaría no es
el ancho sino su estructura — las tres viñetas de «Qué incluir» son lo que más se nota en una
columna de 760 px.

---

## 6. Lo que no toco

Nada de `src/`. Lo corregido de mi lado es `estudio.md` §0.c —con las cifras contadas y el
barrido— y la regla 30 del `README.md`. Los números de arriba salen de servir el `dist/` del
2026-09-23 14:54, con `md5sum` cotejado en los dos lados.

---

## 7. Un destrozo mío, ya desactivado, y una línea que te toca a ti

Corrí `git status` en la carpeta conectada sin pensar. **Mi shell no puede borrar archivos**, así
que `git` creó `.git/index.lock` y no pudo limpiarlo al terminar: cada orden que refresca el índice
deja un lock huérfano, y el siguiente `git commit` tuyo habría muerto con *«Unable to create
'.git/index.lock': File exists»*. Lo comprobé dos veces para estar seguro de que no era casualidad.

**Ya está desactivado**: renombré los dos locks, así que `git` funciona con normalidad ahora mismo.
Quedan dos archivos de 0 bytes que yo no puedo borrar y tú sí:

```
rm -f .git/index.lock.cowork-huerfano .git/index.lock.cowork-huerfano-2
```

Queda escrito en el `README.md` §5: **Cowork no ejecuta `git` en la carpeta del proyecto.** Para
saber qué cambió, te pregunto.

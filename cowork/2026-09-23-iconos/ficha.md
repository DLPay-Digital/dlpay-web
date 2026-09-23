# Ficha — cuatro iconos que el §7 ya nombraba

**Entrega:** `2026-09-23-iconos` · **Autor:** Claude Cowork · **Estado:** En revisión
**Pieza:** `iconos.html` · **md5:** `84680c2d3fbe070682931f9d95dd9ccb`
**Capturas:** `iconos-set.png`, `iconos-escala.png`, `iconos-empresa-vs-banco.png`, `iconos-en-contexto.png`, `iconos-tinta.png`
**Dónde va:** `src/components/Icon.astro`. No estrena componente.

> **No es contenido nuevo: es un hueco del sistema.** El Design System §7 cierra el set con
> *«banco, reloj, chat/WhatsApp, chevron/paso, **documento, empresa, wallet, candado**. Nada más
> hasta que una necesidad lo pida»*, y `Icon.astro` sólo tiene cinco. Estos cuatro son los que
> faltaban, con su nombre tal cual el §7 los escribió.

---

## 1. La única decisión de dibujo que había que tomar: «empresa» no puede ser un edificio

`bank` ya es un edificio, y los iconos se usan a **20 px** dentro de `IconBadge`. Dibujé las dos
versiones y las puse juntas a 20 y a 16 px (`iconos-empresa-vs-banco.png`):

- **B · bloque de oficinas** — a 16 px es una masa rectangular con muescas, igual que `bank`. Dos
  siluetas del mismo género en un set de nueve es una colisión, no una familia.
- **A · maletín** — comparte el significado de negocio y **no comparte silueta**. Se distingue de
  `bank` a 16 px sin esfuerzo.

**Va A.** Y la razón no es de gusto: es que la comprobación se hizo mirando los dos al tamaño real
de uso, no al tamaño de diseño. B queda descartado y queda dibujado en la maqueta para que la
decisión sea revisable.

---

## 2. Tres cosas que la medición me hizo cambiar

Dibujé, medí, y tres de los cuatro estaban mal. Lo anoto porque el «largo de trazo» —la suma de la
longitud de todos los subtrazos— resultó ser un buen proxy del peso óptico, y no lo había usado antes.

| | v1 | v2 | qué pasaba |
|---|---|---|---|
| `empresa` | **86,9** | **71,9** | Era el icono más pesado de los nueve, por encima de `bank` (78). El filete de lado a lado costaba 18 unidades; pasa a un cierre corto de 3 y sigue leyéndose como maletín |
| `documento` | **80,1** | **75,8** | También pasaba a `bank`. La hoja se encogió medio punto por lado y los dos renglones bajaron de 7+4 a 5+3 |
| `wallet` | alto **14** | alto **15** | Los otros ocho miden 16,5–18 de alto. A 14 se veía achatado al lado del resto, aunque por sí solo estuviera bien |

**Ninguno de los cuatro supera ahora al más pesado que ya existía.** El set pasa de un rango de
59,5–78 a **59,5–78,6**, y el techo lo sigue marcando `bank`.

**Lo que no arreglé y digo igual:** los cuatro nuevos promedian **74,7** de trazo contra **66,5**
de los cuatro pictogramas viejos. Un 12 % más de tinta. Es estructural —una hoja, un maletín, una
billetera y un candado son contornos cerrados, y una casa, un reloj, dos figuras y un bocadillo no
lo son—, así que bajarlo más significaría dibujar otra cosa. A 20 px dentro de la insignia no se
nota; queda escrito por si algún día el set crece y hay que revisar el equilibrio.

---

## 3. Evidencia medida

Sobre el render real, con Playwright, `deviceScaleFactor: 2`. La caja útil sale de `getBBox()` y el
largo de trazo de `getTotalLength()`, no de leer el `path`.

| icono | caja útil | ancho × alto | largo de trazo | subtrazos |
|---|---|---|---|---|
| bank | 3,4 → 21,21 | 18 × 17 | 78 | 1 |
| clock | 3,3 → 21,21 | 18 × 18 | 64,8 | 2 |
| people | 3,3.5 → 21,20 | 18 × 16,5 | 59,5 | 3 |
| whatsapp | 3.5,3.7 → 20.6,20.5 | 17,1 × 16,8 | 63,7 | 2 |
| chevron | 9,5 → 16,19 | 7 × 14 | 19,8 | 1 |
| **documento** | 5,3.5 → 19,20.5 | **14 × 17** | **75,8** | 3 |
| **empresa** | 3,4 → 21,20 | **18 × 16** | **71,9** | 3 |
| **wallet** | 3,5.5 → 21,20.5 | **18 × 15** | **78,6** | 2 |
| **candado** | 4,3 → 20,21 | **16 × 18** | **72,5** | 3 |

`documento` es el único más estrecho que los demás (14 frente a 18): una hoja apaisada no es una
hoja. `chevron` queda fuera de la comparación porque no es un pictograma, es una marca direccional.

**Grosor real renderizado**, que es lo que el §7 promete que adelgaza solo al reducir:

| tamaño | 16 | 20 | 22 | 24 |
|---|---|---|---|---|
| grosor | 1,067 px | 1,333 px | 1,467 px | 1,6 px |

**Contraste**, calculado componiendo el alfa de la insignia sobre el fondo efectivo. El calculador
se calibró primero reproduciendo tres cifras que el proyecto ya tiene documentadas —`--verde-deep`
sobre `--papel` **5,44**, `--verde` sobre `--papel` **2,02**, `--ink-mute` sobre `--papel` **5,50**—
y las tres salen exactas:

| caso | contraste | pide WCAG |
|---|---|---|
| Icono `--verde-deep` en insignia 12 % sobre `--papel` | **4,60:1** | 3:1 |
| Icono `--verde-deep` en insignia 12 % sobre `--papel-2` | **4,19:1** | 3:1 |
| Icono `--verde` en insignia 14 % sobre `--tinta` | **6,72:1** | 3:1 |
| Icono suelto `--ink` sobre `--papel` | 16,00:1 | 3:1 |

---

## 4. Dos hallazgos que no son míos y que el agente debería mirar

**a) `people` existe en el código y no está en la lista del §7.** El §7 nombra ocho iconos;
`Icon.astro` tiene cinco, y uno de ellos —`people`— no está entre los ocho. Se usa de verdad, en
`content/home.ts` y en `content/trust.ts`. O el §7 se quedó atrás o `people` entró sin pasar por él.
Con esta entrega el set queda en nueve: los ocho del §7 más `people`. **Hay que reconciliar la lista
del §7**, y es una línea de documento, no de código.

**b) `IconBadge.astro` documenta 3,82:1 y el número real es 4,60:1.** Su cabecera dice *«el icono
encima queda en 3.82:1 … No cambiar sin recalcular»*. Calculado sobre los valores de hoy
—`--verde-deep` al 12 % sobre `--papel`— da **4,60:1**. El 3,82 corresponde a una pastilla al
**24 %**, así que en algún momento la pastilla se aclaró y la nota se quedó con la cifra anterior.

**No hay nada roto**: el contraste real es mejor que el documentado, no peor. Pero es exactamente
la deriva contra la que avisa el comentario de ese mismo archivo dos párrafos más abajo («este
literal hay que moverlo si el token se mueve — como pasó el 2026-09-17»). La nota necesita el
número de hoy.

---

## 5. Dónde van — buscado en el contenido, no inventado

**Pieza:** `ubicacion.html` · **md5:** `e56b10c111e8765f45bf5abaa8e849ee`
**Capturas:** `ubicacion-como-funciona.png`, `ubicacion-empresas.png`, `ubicacion-confianza.png`, `ubicacion-candado.png`

Tres bloques que **ya están publicados**. En dos de ellos hay hoy tres marcas idénticas que sólo
dicen «esto es un ítem de una lista»; en el tercero no hay ninguna.

| dónde | qué hay hoy | qué pasa a haber |
|---|---|---|
| `/como-funciona` → «Ten esto a mano» | 3 ticks iguales | `documento` · `bank` · `wallet` |
| `/empresas` → «Ten esto a mano» | 3 ticks iguales | `documento` · `bank` · `wallet` |
| `/confianza` → «Qué te pedimos, y por qué» | sin marca | `documento` · `empresa` · `bank` |

Las dos primeras salen de `content/process.ts` y `content/business.ts`; la tercera de
`trust.ts → requirements`. **Los tres ítems de cada lista coinciden uno a uno con un icono del
set**, y eso no es casualidad: el §7 nombró esos ocho iconos mirando lo que el sitio pide.

**En `/confianza` van con icono suelto, no con insignia.** Justo encima, en la misma página,
«Qué pasa con tu plata» ya usa `IconBadge`. Repetir la insignia convertiría la página en una pared
de pastillas y borraría una distinción que sí existe: **insignia = lo que hacemos nosotros; icono
suelto = lo que traes tú.**

**Lo que NO se toca:** la figura de `phases` en `/confianza` —las tres barras con el tramo verde—
es una figura del §6.2 y un icono al lado competiría con marcas que ya significan algo.

### 5.b Una corrección mía, encontrada mirando la maqueta

En la primera versión puse `empresa` en el primer ítem de `/empresas`, para que la marca
distinguiera las dos listas gemelas. **Era un motivo mío, no del contenido.** Lo que una empresa
trae son *documentos*; el maletín nombraría al dueño de los documentos, no la cosa que se pide. La
diferencia entre persona y empresa ya la llevan la página, el titular y el texto. Corregido: las
dos listas llevan `documento`, y `empresa` se queda con el único sitio donde nombra una empresa de
verdad —«Verificación de la empresa»—. Es la primera comprobación del §6.2 fallando en mi contra:
la marca tiene que nombrar lo que hay, no contar una historia.

### 5.c `candado` no tiene dónde ir, y no es un problema de diseño

Busqué «cifrado», «encriptado», «seguridad», «protección» y «resguardo» en todo `content/` y en
todas las páginas. **El sitio no afirma nada sobre cifrado.** Lo único que aparece es «es un
requisito de seguridad y cumplimiento», que habla de la verificación de identidad, y `/privacidad`,
que dice que la política está en revisión.

**Un candado no es una etiqueta: es una afirmación.** Al lado de un texto que no reclama seguridad,
dice por su cuenta «esto está cifrado», y eso lo firma Compliance, no un icono. Es justo lo
contrario de lo que promete `/confianza`. **Se queda dibujado y sin usar** hasta que exista una
frase sobre cómo se guardan los datos.

---

## 6. Lo que falta decidir

1. **Si `candado` entra igual al componente** aunque ninguna página lo use. Yo lo metería: está
   medido y dibujado, y el coste de tenerlo es cero. Lo que no haría es buscarle un sitio.
2. **Reconciliar `people` con la lista del §7** (§4.a).
3. **Recalcular la nota de `IconBadge`** (§4.b).

Nada de esto está integrado. `cowork/` es sólo visualización.

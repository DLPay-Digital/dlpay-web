# La portada de `/preguntas` · v2 — «Las nueve preguntas»

**Fecha:** 2026-09-29 · **Autor:** Claude Cowork
**Maqueta:** `preguntas-portada-maqueta.html` · **Medido sobre el build de `67abaa9`**
**No escribí nada en el repositorio.**

---

## 1. Por qué la v1 era un índice de Word, y tenías razón

La lista de los ocho términos del glosario no era una portada: era **el índice que tú mismo mandaste
quitar de esa página el 24 de septiembre**. Lo dice la cabecera de `preguntas.astro`:

> «La primera versión de esta forma traía un índice pegajoso de seis anclas y numeraba los grupos 01
> a 05. Las dos cosas se retiraron **por estética**.»

Yo tenía esa nota y aun así entregué un índice con otra ropa. **Y el fallo de método fue anterior:**
me convencí de que la página «no tenía objeto» y me refugié en «tipografía, no figura». Eso no es una
conclusión, es una rendición — y se nota en el resultado.

---

## 2. La página sí tiene un mecanismo propio, y lo dice su propio código

`preguntas.astro` declara de dónde sale cada pregunta:

> «**De qué lado es cada pregunta: de qué archivo viene.** No hay campo que lo diga, porque un campo
> así podría contradecir a su propio origen.»

Las nueve preguntas vienen de dos sitios — `home.ts` (persona) y `business.ts` (empresa)— y cada una
lleva su `concern`. Sacado de los datos, no de mi cabeza:

| preocupación | persona | empresa |
|---|---|---|
| Qué recibo, y cuándo | **2** | — |
| Cuánto cuesta | 1 | 1 |
| Hasta dónde llegamos | 1 | 1 |
| Qué te pedimos | 1 | 1 |
| Quién te atiende | — | **1** |
| | **5** | **4** |

**De las cinco preocupaciones, tres las preguntan las dos partes, y cada una tiene exactamente una
suya.** Es decir: **una persona y una empresa preguntan casi lo mismo.**

Ninguna otra página del sitio puede hacer esa afirmación —es la única que junta los dos públicos— y
es exactamente lo que un visitante quiere saber al llegar: *sea lo que sea, mis preguntas están acá.*

---

## 3. El dibujo

**Un punto por pregunta. Nueve, no cinco:** el recuento de la figura es el recuento de la página.
Arriba del eje las de una persona, abajo las de una empresa, y **cuando las dos preguntan por lo
mismo comparten la vertical**. Las dos asimetrías de los extremos —dos puntos solos arriba a la
izquierda, uno solo abajo a la derecha— son las dos preguntas que sólo hace un lado.

La forma se lee en un segundo y no enumera nada. **Eso es lo que la separa del índice:** dice
*cuántas, de quién y cuánto se parecen* sin nombrar ni un grupo.

**Las marcas, contra el §6.2:**

- **El eje verde** es el tramo con su significado publicado: **el tramo que es nuestro**. Lo que se
  responde es nuestro, y es lo único nuestro en la figura.
- **El punto lleno** no es el «punto verde = un extremo de la operación». Va en `--on-tinta`, neutro,
  y **estrena significado: una pregunta.** Es una marca nueva y hay que escribirla (§5).
- Los tallos van en `--on-tinta` al 40 %: unen cada pregunta con su respuesta y no afirman nada.

**Los rótulos van fuera del SVG.** Dentro escalan con el `viewBox` y a 390 px caen a **9,7 px** —lo
medí rompiéndolo primero, que es la tercera vez que ese error aparece en este proyecto—. Es la misma
regla que ya aplican el riel del artículo y la línea de tenencia de `/confianza`.

---

## 4. Medido

| | 320 | 390 | 768 | 960 | 1280 | 2560 |
|---|---|---|---|---|---|---|
| alto de la portada | 434 | **460** | 604 | 487 | **520** | 520 |
| desborde horizontal | 0 | 0 | 0 | 0 | 0 | 0 |
| texto más pequeño | 13 | 13 | 13 | 13 | 13 | 13 |
| rótulo `persona` / `empresa` | 13 px | 13 | 13 | 13 | 13 | 13 |

**Entra en la familia de portadas con objeto** —460 a 781 px— en todos los anchos: 434 a 320 es el
único por debajo, y a ese ancho ninguna portada del sitio llega a 460. Sin JavaScript: la figura es
SVG en línea, no depende de nada. Sin movimiento: no lleva `data-enter`, porque `/preguntas` es una
página de consulta y el §9 no regala entradas.

---

## 5. Lo que hay que escribir, y lo que necesita tu firma

**Una marca nueva en el §6.2:** «**Punto lleno neutro** = una pregunta». Hoy la tabla sólo tiene el
punto **verde**, que significa «un extremo de la operación». Un punto neutro no compite con él
—cambia la marca, no sólo el color, que es justo lo que el §6.2 exige— pero **estrena familia y eso
se escribe antes de dibujar**, como se hizo con la frontera punteada.

**Cadenas nuevas: ninguna.** «Preguntas» y la bajada son las publicadas; «persona» y «empresa» son
las dos palabras que el propio sitio usa para sus dos públicos, y están en el pie —«Para personas y
para empresas»—.

**Y una pregunta para ti, que es de negocio y no de diseño:** la figura afirma que los dos públicos
preguntan casi lo mismo. Es cierto **hoy**, con nueve preguntas. Si mañana `business.ts` crece a
quince, la portada deja de decir lo que dice. **Se construye desde los datos** —no con nueve puntos
escritos a mano— para que se mantenga sola; pero si el plan es que las preguntas de empresa se
multipliquen, mejor saberlo ahora.

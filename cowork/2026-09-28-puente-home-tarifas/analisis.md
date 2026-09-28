# Análisis del sitio · 2026-09-28

**Autor:** Claude Cowork
**Medido sobre:** un build que hice yo del `main` de hoy (commit `9ce2684`). Ya no dependo de que
me pasen el `dist`: construyo el sitio en el contenedor cuando lo necesito.
**Prototipo:** `prototipo-un-telefono.html` · **md5** `62141c292f0d92b80864fe69ad758b71` — **ábrelo
y desplázate**, es lo único de esta entrega que no se entiende en una captura.

---

## 1. Dónde está el sitio hoy

| página | `main` | anclas | tramo más largo sin ninguna |
|---|---|---|---|
| preguntas | 4.479 px | 0 | 4.479 px (100 %) |
| blog · artículo | 4.856 px | 2 | 3.599 px (74 %) |
| como funciona | 3.505 px | 1 | 2.791 px (80 %) |
| empresas | 5.176 px | 5 | 2.784 px (54 %) |
| confianza | 3.093 px | 1 | 2.697 px (87 %) |
| precio | 3.092 px | 2 | 1.197 px (39 %) |
| **home** | **7.115 px** | 8 | 1.193 px (17 %) |
| tarifas | 2.464 px | 2 | 1.178 px (48 %) |

La Home es la mejor página del sitio por este criterio y por cualquier otro. Y es donde está la
oportunidad más grande, que no tiene nada que ver con la planicie.

---

## 2. La oportunidad grande: un teléfono en vez de cuatro

**«Así se ve tu operación, paso a paso» mide 2.313 px a 1280 y 2.676 px a 390.** Son el **30 % de
la Home** dedicados a cuatro capturas del mismo teléfono en zigzag, cada una con dos frases al lado.

Los cinco sitios que miraste resuelven esto igual y no es casualidad: **un aparato que se queda
quieto y cambia de pantalla mientras lees**. El cliente no pierde de vista el producto, y la
sección deja de ser un catálogo de capturas para ser una demostración.

El prototipo hace eso. Mide **1.991 px a 1280** y **2.657 px a 390** — unos 300 px menos, aunque
el ahorro es lo de menos: lo que cambia es que el teléfono no se va.

**Cómo está hecho, y por qué se puede defender:**

- **Sin JavaScript se ven los cuatro hilos completos**, uno debajo de otro, separados por un
  punteado. La regla dura 5 se cumple por construcción, no por una red de seguridad. *(Lo rompí en
  la primera versión del prototipo —sin JS no se veía ni un hilo— y lo cacé midiendo, no mirando.)*
- **El movimiento son 180 ms de `opacity` y `transform`** en las burbujas al entrar, con 60 ms de
  desfase entre las dos. Bajo el techo de 280 ms. `prefers-reduced-motion` lo apaga entero.
- **El paso activo se marca con un filete de 56 px**, no con tamaño ni con color de fondo: la
  jerarquía la dan la tipografía y el espacio, que es el ADR-0001.
- **En móvil el teléfono va primero en el DOM.** Si va después, se pega cuando ya pasaste todos los
  pasos y no lo ves nunca — me pasó, está en la captura de la primera versión.
- Cero dependencias nuevas. Un `IntersectionObserver` y un oyente de scroll pasivo.

**Y una cosa que hay que resolver antes de tocar esta sección**, no después: el título del paso 2
es **«Precio garantizado»** y lleva `REQUIERE VALIDACIÓN DE COMPLIANCE` en `Process.astro`, con el
motivo escrito —el cotizador no emite precios cerrados— y **con la alternativa ya redactada ahí
mismo**: «2. Un ejecutivo confirma tu precio». Reconstruir la sección alrededor de un claim
pendiente sería el error del `PendingNotice` a mayor escala. El prototipo usa el texto actual para
que compares, pero si esto entra, entra con la frase resuelta.

---

## 3. La segunda: el número del cotizador salta

Medido sobre la Home: al escribir 5.000.000, el campo de salida cambia **una sola vez, 49 ms
después**, de `2.174,62` a `5.436,56`. No hay valores intermedios ni transición.

Es el elemento más visto del sitio —está en la portada de la Home— y salta como una hoja de
cálculo. Una cifra que recorre hasta su valor en ~240 ms se lee como un mercado vivo, que es
exactamente lo que DLPay es.

**Choca con la regla dura 3 del Motion System, «las cifras no entran», y creo que la regla no
cubre este caso:** se escribió para que las cifras no tengan animación de *entrada*, que es
distinto de una transición de *valor* cuando el usuario acaba de pedirla. La ventaja, que es lo que
la instrucción 4 me obliga a escribir: el número deja de ser un resultado impreso y pasa a ser un
instrumento que responde. Es la diferencia entre una web que informa un precio y una mesa que lo
calcula.

Si la excepción no te convence, no se hace. Pero está medido y es barato.

---

## 4. La tercera: las figuras de `/empresas` ya saben dibujarse y no lo hacen

`/empresas` es la página más trabajada del sitio: cuatro figuras angulares con el corte de 33,954°,
nodos verdes y líneas. Son lo más distintivo que tiene DLPay dibujado.

Y son estáticas. **La infraestructura para animarlas ya existe**: `Motion.astro` soporta
`data-draw` sobre `path`, y hoy lo usan las marcas de traspaso de `/como-funciona`. Poner ese
atributo en las líneas de las cuatro figuras hace que se tracen al entrar en pantalla, sin una
línea de JavaScript nueva y sin tocar el dibujo.

Es la más barata de las tres y la que menos riesgo tiene.

---

## 5. Lo que NO propongo, y por qué

- **`/preguntas`**, aunque sea la más plana. Es una referencia, se llega con una pregunta, y el
  índice y la numeración los quitaste tú por estética. Meterle figuras sería decoración.
- **El artículo del blog.** Lectura larga a 112 caracteres; su planicie es la decisión, igual que en
  lo legal.
- **El globo.** Se queda como está, que es tu instrucción 3.
- **Más portadas con objeto.** Cuatro de once ya lo tienen y no hay regla escrita que diga cuándo
  corresponde. Eso sigue pendiente y es media hora de documento.

---

## 6. Mi orden

1. **El teléfono único.** Es lo que más cambia la percepción y ya lo puedes tocar.
2. **El número del cotizador**, si aceptas la excepción.
3. **`data-draw` en `/empresas`**, que es casi gratis.

Y por encima de las tres sigue estando lo que no puedo hacer yo: la prueba social. Los cinco sitios
que miraste la ponen antes que nada.

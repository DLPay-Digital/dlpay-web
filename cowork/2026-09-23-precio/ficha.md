# Ficha — `/precio`, el cobro único

**Entrega:** `2026-09-23-precio` · **Autor:** Claude Cowork · **Estado:** En revisión · **cerrada por mi lado**
**Pieza:** `precio.html` · **md5:** `f590bed53efebe2570e3c4db58b8a0cb`
**Capturas:** `precio-1280.png`, `precio-390.png`
**Dónde va:** dentro del menú **Información**.

> **Versión 2, y cambia de raíz.** La v1 publicaba el dólar de referencia con su recorrido de 30 y
> 90 días. Sebastián la paró: *«mostrando el precio de los últimos 30 días nos estaríamos metiendo
> en un terreno que no nos conviene»*. Tiene razón y el motivo es de posicionamiento, no de datos:
> publicar una serie de precios convierte al sitio en un publicador de tipo de cambio, y el negocio
> es el cambio de divisas. **De paso desaparece el bloqueo de D7**: esta versión no necesita ninguna
> fuente de mercado.

---

## 1. Cuatro cosas del encargo que no se pueden dibujar como venían

Las digo primero porque si alguna se publica tal cual, hace daño.

### 1.1 «Convertir dinero: gratis» sería falso, y además regala el mejor argumento del rival

`/tarifas` publica hoy: *«DLPay toma una referencia de mercado y le aplica su **spread**. El
resultado es el precio que ves en el cotizador: un solo número, con el spread ya incorporado.»* Y la
Home: *«El precio que ves ya incluye nuestro spread.»*

**DLPay sí cobra: cobra en el spread.** Poner «convertir: gratis» encima de eso es exactamente lo
que el propio `/tarifas` dice que no hacemos —*«un tipo de cambio inflado por dentro para esconder
un cobro»*—. Es además la práctica que Wise lleva quince años atacando en campaña: anunciar cero
comisión y cobrar en el tipo de cambio. Publicarlo nos pondría del lado equivocado de esa frase.

**Y la versión honesta es más fuerte, no más débil.** «Un solo cobro en toda la operación, y va
dentro del precio» es la única afirmación de esta categoría que nadie puede desmontar. Es lo que
dibuja la página.

### 1.2 «Mantener el dinero en la cuenta» y «recibir dinero» describen un producto que no existe

`/confianza` dibuja dónde está la plata en cada momento: *en tu cuenta bancaria* → *en la cuenta de
DLPay en BCI, sólo mientras dura la operación* → *en tu billetera*. **No hay una cuenta DLPay donde
el cliente guarde dinero.** La billetera es suya y está fuera de nosotros.

Listar «mantener saldo» y «recibir dinero» como servicios gratuitos anunciaría una cuenta
multidivisa que es el producto de Wise, no el nuestro. En la tabla sí está **«recibir el dólar
digital en tu billetera: sin costo»**, que es verdad y es lo que hacemos.

### 1.3 «A diferencia de otros proveedores» y «más accesibles que el competitivo»

Son afirmaciones comparativas sin base auditable. `/confianza` promete no publicar lo que no
podemos probar, y «el mejor precio» ya está en la lista de claims con marcador
`REQUIERE VALIDACIÓN DE COMPLIANCE`. La página dice lo mismo sin nombrar a nadie: **«ves cuánto
recibes antes de transferir»**. El lector compara solo, y eso pega más.

### 1.4 «Descuentos por volumen»

**D5 está bloqueado** —«ninguna por ahora»— y `/empresas` ya publica: *«Las condiciones se conversan
según volumen y frecuencia: **no publicamos una tabla por tramos**.»* Esa es la frase que va en la
página. «Mientras más conviertes, más ahorras» es más rotunda y puede que sea verdad, pero es un
claim comercial nuevo: lo firma Compliance, no yo.

### 1.5 La pregunta que faltaba, contestada

Pregunté **quién paga el costo de red cuando se envía el dólar digital**, porque no está en ningún
archivo del proyecto y una tabla de costos que se salta un costo deja de ser una tabla de costos.
**Sebastián: lo asume DLPay.** Entra como quinta fila, y además es un diferenciador real que hasta
hoy no estaba dicho en ninguna parte del sitio.

### 1.6 Firma

El copy nuevo —los tres términos del glosario de `/preguntas` y los rótulos y títulos de esta
página, incluida «un solo cobro en toda la operación, y va dentro del precio»— queda **aprobado por
Sebastián como Compliance el 2026-09-23, sin marcador**.

---

## 2. La figura: dos barras del mismo largo, y nada entre ellas

**Lo que ves y lo que pagas miden lo mismo.** Entre la cotización y el cierre no se suma nada.

Es la topología de `convierte` —dos barras de largo idéntico— a escala de página. No estrena
familia ni marca: el sitio ya dice con esa forma «el mismo valor, sin ir a ninguna parte».

**Por qué no dibujo el spread como un trozo dentro de la barra.** Cualquier anchura que le diera
afirmaría una proporción, y los tramos son dato bloqueado (D5). La barra dice que el precio es uno
solo; cuánto de él es nuestro lo dice la tabla con palabras, no con un ancho.

**Por qué quité la cuña, que es la corrección de esta entrega.** La puse por reflejo, porque
`convierte` la lleva. Pero allí la cuña está porque **sí** ocurre una conversión —pesos a dólar
digital— y aquí no ocurre nada: es el mismo importe en dos momentos. **Una cuña habría afirmado una
transformación que no existe.** Y encima quedaba desproporcionada: en `convierte` la cuña mide
**0,23** del largo de la barra y a este tamaño daba **0,06**.

**Lo que hace la figura es la ausencia.** Entre las dos barras no hay nada, y eso es exactamente lo
que la página afirma.

---

## 3. La tabla: la repetición es el mensaje

| | |
|---|---|
| Registrarte y verificar tu identidad | Sin costo |
| Cotizar, las veces que quieras | Sin costo · sin cuenta |
| Hablar con tu ejecutivo | Sin costo |
| Recibir el dólar digital en tu billetera | Sin costo |
| **El costo de red del traspaso** | **Sin costo · lo asumimos nosotros** |
| **Convertir** | **El spread, ya incluido en el precio que ves** |

Cinco filas iguales y una distinta, marcada con el único filete verde grueso de la página. **El ojo
ve el patrón y ve la excepción**, y entiende el modelo de cobro entero sin leer un párrafo. Una
tabla que dijera «gratis» cinco veces diría menos: nadie entiende un precio sin saber dónde está el
cobro.

Cierra con la nota de `/tarifas`, ya publicada: lo que hagas después con ese dólar digital puede
tener costos de servicios ajenos a DLPay.

---

## 4. Copy: qué es nuevo y qué no

Las tres secciones —**Precio transparente**, **Conversión justa**, **Volumen y frecuencia**— están
escritas casi enteras con frases que el sitio ya publica: `/tarifas` para el spread y la comisión
aparte, `home.ts` para el precio referencial, `business.ts` para las condiciones por volumen.

**Copy nuevo:** los rótulos, los títulos de sección y las cuatro etiquetas de la tabla. Ninguno
afirma una cifra ni una comparación. Aun así es una página sobre precio: **la lee Compliance
entera**, no sólo lo nuevo.

---

## 5. Evidencia medida

| | 320 | 390 | 1280 |
|---|---|---|---|
| Alto de la página | 2.937 px | 2.764 px | 2.410 px |
| Las dos barras miden lo mismo | **sí** | **sí** | **sí** |
| Grosor real del trazo | 2,5 px | 2,5 px | 2,5 px |
| Texto dentro del SVG · rellenos | 0 · 0 | 0 · 0 | 0 · 0 |
| Filas «Sin costo» / filas totales | 5 / 6 | 5 / 6 | 5 / 6 |
| Ids duplicados · scroll horizontal | 0 · no | 0 · no | 0 · no |

Barras en `--verde-deep` sobre `--papel`: **5,44:1**. El trazo lleva
`vector-effect: non-scaling-stroke`; sin él, a 390 px se dibujaría a 1,2 px reales.

---

## 6. Lo que falta decidir

**Nada.** Las cuatro de §1 están resueltas, el costo de red está contestado (§1.5) y el copy está
firmado (§1.6). **Ya no depende de D5, ni de D6, ni de D7.**

Sólo queda una propuesta, reversible: etiqueta y ruta `Precio` y `/precio/`.
*(«Precio del dólar» era el nombre de la versión anterior y ya no describe la página.)*

Nada de esto está integrado. `cowork/` es sólo visualización.

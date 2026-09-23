# Orden de trabajo — dos páginas nuevas en el menú «Información»

**Fecha:** 2026-09-23 · **Autor:** Claude Cowork · **Aprobación:** Sebastián
**Las dos están cerradas por su lado. No queda nada pendiente de Compliance.**

| | página | archivo | md5 |
|---|---|---|---|
| **A** | **`/preguntas`** — las nueve preguntas reunidas + glosario de ocho términos | `cowork/2026-09-23-preguntas/preguntas.html` | `06630f13d67fd0c97e102a45070f823e` |
| **B** | **`/precio`** — el cobro único: qué cuesta y qué no | `cowork/2026-09-23-precio/precio.html` | `f590bed53efebe2570e3c4db58b8a0cb` |

Salen del estudio `cowork/2026-09-23-oportunidades/propuesta.md`, hecho con `wise.com` como
referencia. Las fichas completas, con los descartes y los errores propios, están en cada carpeta.
`cowork/` es sólo visualización: la integración es tuya.

## Las cinco decisiones de Sebastián que las gobiernan

1. Las preguntas ya publicadas **se quedan donde están**; `/preguntas` las reúne desde la misma
   fuente.
2. **`/tarifas` no se mueve** del pie.
3. **`/precio` cambió de enfoque:** fuera la serie de precios de 30 días, dentro el cobro único.
   *De paso desaparece el bloqueo de D7: esta versión no necesita ninguna fuente de mercado.*
4. **El costo de red del traspaso lo asume DLPay.** Entra como fila propia en la tabla de costos.
5. **El copy nuevo queda aprobado sin marcador**, firmado por Sebastián como Compliance el
   **2026-09-23**. No lleva `REQUIERE VALIDACIÓN DE COMPLIANCE`. Conviene que la fecha y el firmante
   queden escritos donde tú lleves ese registro.

---

# A · `/preguntas`

## A.1 Qué es

Las nueve preguntas que hoy viven en la Home (cinco) y en `/empresas` (cuatro), reunidas en una
página, más un glosario de ocho términos.

## A.2 Cero duplicación de texto, y es la clave

Las preguntas están en `content/home.ts` y `content/business.ts`, tipadas. **La página las importa
de ahí.** No se copian ni se reescriben: si mañana cambia una respuesta, cambia en los dos sitios a
la vez, que es lo mismo que `content/scope.ts` garantiza para el alcance del servicio.

## A.3 Un fallo de `Faq.astro` que esta página destapa

El componente trae el `id` escrito a mano:

```astro
<section class="faq" aria-labelledby="faq-title">
  <h2 id="faq-title">{title}</h2>
```

Hoy no molesta porque ninguna página lo usa dos veces. **`/preguntas` lo usa dos veces**, y dos
elementos con el mismo `id` son HTML inválido: el `aria-labelledby` del segundo bloque apunta al
título del primero, así que un lector de pantalla anunciaría las preguntas de empresa como
«Preguntas frecuentes».

En la maqueta va resuelto con `faq-personas` y `faq-empresas` —medido: **0 ids duplicados**—. En el
componente hay que generarlo, por prop o derivándolo del título. Cómo, es cosa tuya.

## A.4 Los dos grupos alternan `--papel` y `--papel-2`

`Faq.astro` trae `padding: var(--s-9) 0` y fondo `--papel`. Dos seguidos dejan **192 px** entre el
último desplegable de un grupo y el título del siguiente, sobre el mismo fondo: los dos bloques se
leen como uno solo mal espaciado. Alternar es el ritmo que el sitio ya usa entre secciones en todas
las páginas —medido: los fondos van alternando `246,245,241` y `236,234,227`—, así que no inventa
nada. Necesita una prop de superficie o un envoltorio; tú decides cuál.

## A.5 El glosario

`<dl>` / `<dt>` / `<dd>` de verdad, no una retícula de `<div>`: un lector de pantalla anuncia «lista
de descripción, 8 elementos» y permite saltar de término en término. Medido: 1 `<dl>`, 8 `<dt>`,
8 `<dd>`.

**Cinco de los ocho están definidos con palabras que el sitio ya publica:**

| término | de dónde sale |
|---|---|
| Dólar digital | `home.ts`, «¿Qué es el "dólar digital"?» |
| Precio referencial | `home.ts`, «¿El precio de la web es el precio final?» |
| Spread | `/tarifas`, «Cómo se compone el precio» |
| Verificación de identidad | `/confianza`, «Qué te pedimos, y por qué» |
| Ejecutivo | `/confianza`, «Una persona identificable cierra tu operación» |

**Tres son copy nuevo — stablecoin, billetera y red — y están aprobados** (decisión 5). Son las
palabras que el sitio usa en todas las páginas y no define en ninguna. Van sin cifras, sin plazos y
**sin nombrar ninguna red concreta**: nombrarlas sería una decisión de producto, no de redacción.

**Cada término enlaza a dónde se explica, y el enlace nombra el destino** —«→ Tarifas»,
«→ Confianza», «→ Cómo funciona», «→ En el blog»—. La primera versión repetía «Dónde se explica»
siete veces y era una retahíla verde que no informaba de nada. **«Red» no lleva enlace porque el
sitio no lo explica en ninguna parte**, y que eso se vea es parte de la información.

**Sin figura, y es una decisión.** Esta página es el mapa del vocabulario; un dibujo competiría con
el texto sin decir nada que el texto no diga.

## A.6 Evidencia medida

Con los nueve desplegables abiertos, `md5sum` de los dos lados.

| | 390 | 1280 |
|---|---|---|
| Alto | 4.802 px | 3.791 px |
| Medida de una respuesta | 38,9 ch | **66 ch** — dentro del 65–70 del DS |
| Medida de una definición | 38,9 ch | 54,2 ch |
| Ids duplicados · scroll horizontal | 0 · no | 0 · no |

Enlace en `--verde-deep` sobre `--papel`: **5,44:1**.

---

# B · `/precio` — el cobro único

## B.1 Qué dice la página

Que hay **un solo cobro en toda la operación y va dentro del precio**. Una figura, una tabla y tres
secciones.

## B.2 Cuatro cosas del encargo que NO se dibujaron como venían

Sebastián pidió mostrar que «todo es gratis». Cuatro partes de ese encargo chocaban con lo que el
sitio ya publica, y están resueltas así —razonadas en la ficha, resumidas aquí porque te va a llegar
la pregunta:

1. **«Convertir: gratis» sería falso.** `/tarifas` publica que DLPay aplica un spread. Anunciar cero
   comisión cobrando en el tipo de cambio es literalmente lo que esa misma página dice que no
   hacemos —«un tipo de cambio inflado por dentro para esconder un cobro»—. La versión que entra
   —«un solo cobro, y va dentro del precio»— es más fuerte, porque es la única afirmación de esta
   categoría que nadie puede desmontar.
2. **«Mantener saldo» y «recibir dinero» describen un producto que no existe.** `/confianza` dibuja
   que el dinero está en la cuenta del cliente, luego en la de DLPay en BCI mientras dura la
   operación, luego en la billetera del cliente. **No hay cuenta DLPay donde guardar saldo.** Sí
   entra «recibir el dólar digital en tu billetera: sin costo», que es verdad.
3. **«A diferencia de otros proveedores» y «más barato que el competitivo»** son comparativas sin
   base auditable; «el mejor precio» ya está en la lista `REQUIERE VALIDACIÓN DE COMPLIANCE`. La
   página dice lo mismo sin nombrar a nadie: «ves cuánto recibes antes de transferir».
4. **«Descuentos por volumen»**: D5 bloqueado y `/empresas` ya publica «no publicamos una tabla por
   tramos». La página usa esa frase literal.

## B.3 La figura: dos barras del mismo largo, y nada entre ellas

Topología de `convierte` a escala de página. **No estrena familia ni marca**, así que no hay nada
que escribir en el DS §6.2.

**Quité la cuña, y es la corrección de la entrega.** La había puesto por reflejo porque `convierte`
la lleva; pero allí la cuña está porque **sí** ocurre una conversión, y aquí es el mismo importe en
dos momentos. Una cuña habría afirmado una transformación que no existe — y además quedaba
desproporcionada: en `convierte` mide 0,23 del largo de la barra y a este tamaño daba 0,06.
**Lo que hace la figura es la ausencia.**

El spread **no** se dibuja como un trozo dentro de la barra: cualquier anchura afirmaría una
proporción, y los tramos son D5. La barra dice que el precio es uno solo; cuánto de él es nuestro lo
dice la tabla con palabras, no con un ancho.

## B.4 La tabla, con la fila que faltaba

| | |
|---|---|
| Registrarte y verificar tu identidad | Sin costo |
| Cotizar, las veces que quieras | Sin costo · sin cuenta |
| Hablar con tu ejecutivo | Sin costo |
| Recibir el dólar digital en tu billetera | Sin costo |
| **El costo de red del traspaso** | **Sin costo · lo asumimos nosotros** |
| **Convertir** | **El spread, ya incluido en el precio que ves** |

**La quinta fila es la decisión 4** y entró porque faltaba: una tabla de costos que se salta un
costo deja de ser una tabla de costos. Que DLPay lo asuma es además un diferenciador real y ahora
está dicho.

Cinco filas iguales y una distinta, marcada con el único filete verde grueso de la página: **el ojo
ve el patrón y ve la excepción**, y entiende el modelo de cobro entero sin leer un párrafo. Cierra
con la nota ya publicada de `/tarifas` sobre los servicios ajenos.

## B.5 Evidencia medida

| | 320 | 390 | 1280 |
|---|---|---|---|
| Alto | 2.937 px | 2.764 px | 2.410 px |
| **Las dos barras miden lo mismo** | **sí** | **sí** | **sí** |
| Grosor real del trazo | 2,5 px | 2,5 px | 2,5 px |
| Texto en el SVG · rellenos | 0 · 0 | 0 · 0 | 0 · 0 |
| Filas «Sin costo» / filas totales | 5 / 6 | 5 / 6 | 5 / 6 |
| Ids duplicados · scroll horizontal | 0 · no | 0 · no | 0 · no |

Barras en `--verde-deep` sobre `--papel`: **5,44:1**.

**Un detalle que te ahorra un rodeo:** el trazo lleva `vector-effect: non-scaling-stroke`. Sin él
escala con el dibujo y a 390 px se dibujaría a 1,2 px reales.

---

# El menú «Información»

Pasa de tres entradas a cinco. Con cinco sigue siendo un desplegable cómodo, pero conviene mirar el
orden entero de una vez en lugar de ir añadiendo al final. Mi propuesta:

> **Cómo funciona · Precio · Confianza · Blog · Preguntas**

De lo que explica el servicio a lo que resuelve una duda suelta. Rutas: `/precio/` y `/preguntas/`,
cada una con su `detail` en el desplegable, como las tres que ya están.

*(«Precio del dólar» era el nombre de la versión anterior y ya no describe la página.)*

---

# Lo que queda en tu tejado, y nada más

- **Cómo se genera el `id` de `Faq.astro`** (A.3) y **cómo se alterna la superficie** (A.4): las dos
  son de ingeniería.
- **Dónde registras la firma de Compliance del 2026-09-23** (decisión 5).
- Nada más. Las dos páginas no dependen de D5, ni de D6, ni de D7.

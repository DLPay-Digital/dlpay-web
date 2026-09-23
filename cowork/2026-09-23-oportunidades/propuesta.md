# Qué le falta al sitio — seis cosas que añadir

**Fecha:** 2026-09-23 · **Autor:** Claude Cowork · **Estado:** propuesta, nada construido
**Encargo:** contenido nuevo, no correcciones. El sitio está como Sebastián lo quiere.
**Referencia:** `wise.com` — la portada, `wise.com/us/pricing/send-money` y
`wise.com/us/currency-converter/usd-to-clp-rate`, leídas hoy.

---

## 0. Qué hace Wise, y qué de eso no podemos copiar

Wise apila once bloques en su portada. Seis de ellos **no podemos tenerlos, y no por falta de
tiempo:**

| lo que hace Wise | por qué no |
|---|---|
| Seis testimonios con Trustpilot | `/confianza` promete por escrito: «No mostramos testimonios» |
| «74 % llegan en menos de 20 segundos» | «No publicamos cifras de clientes ni de volumen». Y el ~5 min nuestro ya está bajo marcador de Compliance |
| Rejilla de 18 países con banderas | Es justo lo que el §1 prohíbe sugerir. El globo ya necesitó el eje de alcance al lado para no decirlo |
| Descarga de app, vídeo | No hay app, y el vídeo es otro oficio |
| Descuento por tramos de volumen | D5 bloqueado, «ninguna por ahora» |

**Esto no es una limitación, es la marca.** Wise vende escala; nosotros vendemos que una persona
identificable te confirma el precio y te dice hasta dónde llega el servicio. Si copiáramos su
portada perderíamos lo único que nos distingue.

Lo que sí vale la pena robarles es **la idea de que el precio es contenido**, no un formulario. Su
página más visitada no es la portada: es la del par de divisas, y es pura información.

---

## 1 · `/precio` — la página del dólar, con su historia

**Es la más grande de las seis y la que más se parece a lo que ya somos.**

La página de Wise para USD→CLP tiene, en orden: el tipo de cambio grande, un gráfico con selector
de plazo, una tabla de máximos, mínimos y media a 30 y 90 días, tablas de conversión a montos
redondos, preguntas, y enlaces a otros pares. Nada de eso es publicidad: es la información que
alguien busca **antes** de decidir.

Nosotros hoy tenemos el precio **sólo dentro del cotizador**, y sólo el de ahora. El sitio entero
se construyó sobre la idea de «el precio, de frente», y el precio no tiene página.

**Cómo la dibujaría, con lo que ya existe:**

- **El dato, arriba y grande.** Ya tenemos esa tipografía exacta: `PortadaDato` es
  etiqueta → cifra en mono de 66 px → fecha y fuente. Aquí es lo mismo, a página completa y sobre
  tinta.
- **El recorrido de los últimos 30 días.** Una línea. En nuestra gramática una línea es un tramo, y
  aquí el tramo es el tiempo; sin relleno, sin degradado, sin puntos en cada día. El sitio no tiene
  todavía ninguna figura de serie temporal: **sería la sexta familia**, y hay que escribir su
  entrada en el DS §6.2 antes de dibujarla.
- **Máximo, mínimo y media a 30 y 90 días.** Tres cifras con su fecha, en la retícula de datos que
  ya usa el cotizador.
- **Por qué el precio de la web es referencial.** Ese texto ya existe en `/tarifas`; aquí es donde
  lo busca la gente.
- **Abajo, el cotizador.** El único sitio del recorrido donde pedir algo es natural.

**Lo que la hace posible hoy:** la cadena `PriceSource → Quote` ya está en pie, y el esquema de
portadas ya obliga a declarar `fuente`. La misma disciplina sirve aquí: **ninguna cifra sin su
fuente y su hora.**

**Lo que hay que decidir antes:** de dónde sale la serie histórica y con qué frecuencia se
actualiza. Es una decisión de datos, no de diseño, y es la única que bloquea la página.

---

## 2 · El seguro de precio — nuestro mejor argumento está en una frase suelta

Wise convirtió su *rate lock* en un bloque entero de la portada. Nosotros tenemos **lo mismo y
mejor**, y vive escondido: una línea en `/tarifas` —«el precio aplicable te lo informa tu ejecutivo
antes de que transfieras, y no cambia después de que lo aceptas»— y medio paso en
`/como-funciona`.

Eso es exactamente lo que un banco no te da, y es lo que convierte.

**Cómo lo dibujaría:** el mercado se mueve, y el momento en que aceptas convierte tu precio en una
línea recta. Una línea que fluctúa, un punto lleno donde aceptas, y desde ahí una horizontal.
Nuestra gramática ya tiene las tres marcas: el punto lleno es un extremo de la operación, el tramo
verde es el que es nuestro, y la horizontal no necesita flecha porque no va a ninguna parte.

**Sin cifras en los ejes.** La figura dice *la forma* de lo que pasa, no cuánto se movió el dólar
—y así no depende de ningún dato bloqueado ni de ningún claim pendiente.

**Cuidado con la palabra:** «Precio garantizado» ya está en la lista de claims con marcador
`REQUIERE VALIDACIÓN DE COMPLIANCE`. La sección se puede diseñar; la palabra la elige Compliance.

---

## 3 · La comparación que sí podemos hacer: estructural, sin una sola cifra

Wise compara con los bancos en dinero. Nosotros no podemos —y tampoco queremos, porque `/confianza`
promete no publicar cifras que no podamos auditar.

Pero hay una comparación que es **verificable, honesta y nadie la ha dibujado**: **cuántas manos
toca el dinero y dónde termina cada recorrido.**

Ese es literalmente el carril de `/como-funciona`, que ya es la mejor pieza del sitio, aplicado a
dos recorridos en vez de a dos actores. Sin tiempos, sin comisiones, sin nombres de bancos: sólo la
topología. **Quien la mire saca su propia conclusión, que es mucho más fuerte que si se la damos.**

Es la propuesta con más potencia comercial y también la que más cuidado necesita al redactar: una
figura sobre «un banco» afirma algo sobre los bancos. Yo la dibujaría **sin nombrar a nadie** y
describiendo sólo nuestro recorrido frente al recorrido que el propio usuario ya conoce.

---

## 4 · `/preguntas` — reunir lo que hoy está repartido, y añadir el vocabulario

Wise tiene centro de ayuda. Nosotros tenemos **cinco preguntas en la Home, cuatro en `/empresas`,
y ninguna página donde vivan juntas**. Quien llega buscando una respuesta concreta no tiene dónde
entrar.

Y falta algo que el blog está generando sin querer: **un glosario.** Dólar digital, stablecoin,
spread, precio referencial, billetera, red, settlement. Son las palabras que usamos en todas las
páginas y que el 90 % de los visitantes no maneja.

Es la propuesta **más barata de todas**: cero datos bloqueados, cero claims nuevos, cero
decisiones pendientes. Y es la que más tráfico de búsqueda trae, porque la gente busca
«qué es dólar digital» mucho antes de buscar una casa de cambio.

---

## 5 · Las cuatro situaciones de `/empresas`, cada una con su página

Hoy los cuatro casos —pagos a proveedores, tesorería, pagos recurrentes, cambio por volumen—
tienen **una figura excelente y un párrafo de cuatro líneas cada uno**. La figura hace todo el
trabajo y el texto no la acompaña.

Cada uno da para una página: la figura arriba, en grande; qué problema resuelve; qué necesitas
tener a mano; dónde termina nuestra parte; y el cotizador.

**No hay que dibujar nada nuevo** —las cuatro figuras existen y están integradas—. Es la versión
honesta de las páginas de destino de Wise: en vez de multiplicar países, que es lo que no podemos
afirmar, multiplicamos **situaciones**, que es lo que sí sabemos.

---

## 6 · El blog, preparado para crecer

Dos artículos. El índice funciona con dos y **no funcionará con veinte**: no hay categorías, no hay
filtro, y las portadas de los artículos —que existen, una de dato y una de figura— no se ven en el
índice.

Antes de escribir el tercer artículo conviene decidir la forma del índice. Es barato ahora y caro
después.

---

## Por dónde empezaría

| | propuesta | qué la bloquea | qué devuelve |
|---|---|---|---|
| **1** | **`/preguntas` + glosario** | nada | la más barata, y la que más búsquedas capta |
| **2** | **El seguro de precio** | la palabra la firma Compliance | nuestro mejor argumento, hoy invisible |
| **3** | **`/precio`, la página del dólar** | de dónde sale la serie histórica | la página que más se parece a lo que decimos ser |
| **4** | **La comparación estructural** | redacción cuidadosa | la de más potencia comercial |
| **5** | **Las cuatro situaciones** | nada de diseño; es redactar | cuatro páginas con figuras ya hechas |
| **6** | **El índice del blog** | nada | barato ahora, caro después |

**Si tuviera que elegir una sola: la 3.** Es la única que cambia lo que el sitio *es* y no sólo lo
que dice. Un sitio que publica el precio del dólar con su historia y su fuente deja de ser un
folleto de una casa de cambio y pasa a ser un sitio al que se vuelve.

**Si hay que empezar mañana: la 1.** No depende de nadie.

---

## Lo que haría falta de ti antes de que yo dibuje

1. **Cuáles entran.**
2. **La serie histórica del precio** (propuesta 3): de dónde sale y cada cuánto se refresca.
3. **La palabra del seguro de precio** (propuesta 2), que es de Compliance.
4. **La serie temporal sería la sexta familia de figura del sistema.** Antes de dibujarla hay que
   escribir en el DS §6.2 qué significa esa marca, que es lo que la propia regla exige.

Nada de esto está construido. `cowork/` es sólo visualización.

---

**Fuentes:** [Wise — portada](https://wise.com/) · [Wise — precios](https://wise.com/us/pricing/send-money) · [Wise — USD a CLP](https://wise.com/us/currency-converter/usd-to-clp-rate)

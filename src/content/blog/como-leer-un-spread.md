---
title: 'Cómo leer un spread, y cómo comparar dos precios del dólar.'
description: 'Qué es un spread, cómo se calcula en porcentaje y en dinero, y por qué la única comparación justa entre dos precios es cuánto recibes al final.'
pubDate: 2026-10-13
category: 'Guía'
# BORRADOR. REQUIERE VALIDACIÓN DE COMPLIANCE — el artículo entero, el
# resumen y el ejemplo numérico. Se publica escribiendo `estado: publicado`
# después de la firma.
estado: borrador
ruta:
  paso: 4
  titulo: 'Cómo leer un spread'
resumen:
  - 'El spread es la distancia entre el precio que te ofrecen y una referencia de mercado del mismo momento.'
  - 'Se lee en porcentaje, pero se paga en dinero: el mismo porcentaje pesa más cuanto mayor es el monto.'
  - 'Para comparar dos precios, mira cuántos dólares recibes por tus pesos, con todo incluido, en el mismo momento y por el mismo monto.'
# El pictograma y su razonamiento están en `PortadaFigura.astro`.
portada:
  tipo: figura
  figura: spread
---

<!--
Guía de la ruta «Tu primera operación», paso 4. Borrador de Cowork del
2026-10-13 (entrega `aprende-`). REQUIERE VALIDACIÓN DE COMPLIANCE.

EL EJEMPLO NUMÉRICO ES INVENTADO, Y SE DICE EN EL TEXTO. Una referencia de
1.000 pesos por dólar no es la de ningún día (el observado de la fecha de
redacción era 978,61) y está elegida para que la cuenta se haga de cabeza.
No es un precio de DLPay ni de nadie. **No usa `lib/pricing`** a propósito:
ese módulo da los números del cotizador, y un ejemplo que se mueva con ellos
dejaría de ser un ejemplo. La aritmética está comprobada:
  · 10 / 1.000 = 1%.
  · 1.000.000 / 1.000 = 1.000,00 dólares; 1.000.000 / 1.010 = 990,10.
    Diferencia: 9,90.
  · 10.000.000 / 1.010 = 9.900,99. Diferencia con 10.000: 99,01.

Lo que se afirma de DLPay son frases ya publicadas y firmadas: la
composición, de `/tarifas`; «un solo cobro…», de `/precio`; el precio
referencial y el ejecutivo, de los artículos del blog.

La herramienta «¿Cuánto te están cobrando por el dólar?» (`/cuanto-te-cobran/`)
hace esta misma cuenta con los números de quien la usa, y se enlaza en «La
comparación que sí sirve». Entró con la entrega `spread-` de Cowork, el
2026-10-13.

Regla de estilo aplicada: cero rayas (em-dash o en-dash).
-->

Spread es una palabra que aparece en cualquier conversación sobre cambiar
pesos por dólares, y casi nunca con una cifra al lado. Saber leerlo es lo que
permite comparar dos precios sin equivocarse.

Esta guía explica qué es un spread, cómo se calcula y qué comparación sirve de
verdad. Los números son un ejemplo redondo, que no corresponde a ningún día ni
a nadie. No recomienda operar.

## Qué es un spread

En el cambio de divisas hay dos precios a la vez: el de compra, al que alguien
te compra dólares, y el de venta, al que te los vende. La distancia entre los
dos es el spread, y es lo que gana quien hace de intermediario.

También se llama spread a la distancia entre el precio que te ofrecen y una
referencia de mercado del mismo momento. Es la forma más útil de leerlo cuando
cambias: cuánto se aparta de la referencia el precio que pagas.

## Cómo se calcula

Con números redondos:

<figure class="g-spread" aria-labelledby="g-spread-t"><figcaption id="g-spread-t" class="g-rot">Un spread de ejemplo, con números redondos</figcaption><div class="g-spread-fig"><div class="g-nivel g-nivel-precio"><span class="g-nivel-que">el precio que te ofrecen</span><span class="g-nivel-cifra">1.010</span></div><div class="g-tramo"><span class="g-tramo-barra" aria-hidden="true"></span><span class="g-tramo-que">spread</span><span class="g-tramo-cifra">10 pesos por dólar · 1%</span></div><div class="g-nivel g-nivel-ref"><span class="g-nivel-que">la referencia de mercado</span><span class="g-nivel-cifra">1.000</span></div></div><p class="g-nota">Pesos por dólar. Un ejemplo: no es el precio de ningún día ni de nadie.</p></figure>

- La referencia de mercado está en 1.000 pesos por dólar.
- Te ofrecen el dólar a 1.010 pesos.
- La diferencia son 10 pesos por dólar.
- En porcentaje: 10 dividido por 1.000, o sea un 1%.

## En dinero, que es lo que pagas

El porcentaje sirve para comparar, pero lo que se paga es dinero, y crece con
el monto. Con el mismo 1% del ejemplo:

- Con 1.000.000 de pesos, a 1.000 recibirías 1.000 dólares y a 1.010 recibes
  990,10. La diferencia es de 9,90 dólares.
- Con 10.000.000 de pesos, la diferencia es de 99,01 dólares.

El spread no se ve en ninguna línea aparte: está dentro del número de dólares
que recibes.

## Lo que hace difícil comparar

Dos cosas hacen que dos precios parezcan comparables sin serlo.

**El momento.** El mercado se mueve durante el día. Dos precios tomados a
horas distintas no se comparan entre sí, y tampoco un precio de ahora contra
el dólar observado, que es un promedio del día hábil anterior.

**Lo que va aparte.** Un precio puede verse mejor que otro y traer una
comisión que se suma al final, o un costo de envío. Si comparas sólo los
precios, eso queda afuera.

## La comparación que sí sirve

Pregunta cuántos dólares recibes por tus pesos, con todo incluido, en el
mismo momento y por el mismo monto. Ese número ya contiene la referencia, el
spread y cualquier comisión, y es el único que se puede poner al lado de
otro.

Si lo que necesitas es una cantidad de dólares, vale lo mismo al revés:
cuántos pesos pagas por ella, en total.

Para hacer esta cuenta con tus números está la herramienta
[¿cuánto te están cobrando por el dólar?](/cuanto-te-cobran/): escribes el
precio que te ofrecen y una referencia del mismo momento, y te muestra el
spread en porcentaje y en pesos.

## Qué hacemos en la mesa

DLPay toma una referencia de mercado y le aplica su spread. El resultado es
el precio que ves en el cotizador: un solo número, con el spread ya
incorporado. No hay una comisión aparte que se sume al final: un solo cobro
en toda la operación, y va dentro del precio. Cómo se compone, en detalle,
está en [tarifas](/tarifas/).

El precio que aparece en el cotizador es referencial, y el precio final lo
confirma un ejecutivo antes de cerrar cada operación, porque el mercado se
mueve.

> El precio de referencia no es una promesa de ejecución. Lo confirma una persona antes de cerrar la operación.

Para entender el recorrido completo de una operación, desde tu transferencia
hasta el dólar digital en tu billetera, está la página de
[cómo funciona una operación](/como-funciona/). Para ver el precio
referencial en este mismo momento, el [cotizador](/#cotizador) está siempre
disponible.

## Fuentes

- Banco Central de Chile: [ficha metodológica del dólar observado](https://si3.bcentral.cl/estadisticas/Principal1/Metodologias/EC/PARIDADES/Dolar_observado.pdf), para el día y la hora de corte del observado.
- DLPay: [cómo se compone el precio](/tarifas/).

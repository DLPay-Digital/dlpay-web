---
title: 'Qué es el dólar observado y por qué no es el precio que te cobran.'
description: 'Qué es el dólar observado, cómo lo calcula el Banco Central de Chile, cuándo se publica y por qué ningún precio de compra o de venta coincide con él.'
pubDate: 2026-10-13
category: 'Guía'
# BORRADOR. REQUIERE VALIDACIÓN DE COMPLIANCE — el artículo entero, el
# resumen y la cifra de la portada. Se publica escribiendo `estado: publicado`
# después de la firma (CLAUDE.md §6).
estado: borrador
ruta:
  paso: 1
  titulo: 'El dólar observado'
resumen:
  - 'El dólar observado es un promedio: el de las compras y ventas de dólares del mercado cambiario formal durante el día hábil anterior.'
  - 'Lo calcula y lo publica el Banco Central de Chile, con dos decimales, y no se corrige después.'
  - 'Es una referencia para contratos y reajustes, no un precio al que alguien te venda dólares.'
  - 'Cualquier precio de compra o de venta se forma con el mercado del momento y lleva dentro el margen de quien lo ofrece.'
# La portada es la cifra de la que habla la guía, del día en que se escribió.
# Vive también en el cuerpo, en «Qué es», como exige `PortadaDato.astro`.
# Envejece: quien la actualice, actualice la fecha en los dos sitios.
portada:
  tipo: cifra
  etiqueta: 'Dólar observado'
  valor: 978.61
  unidad: 'pesos por dólar'
  fecha: 2026-10-13
  fuente: 'Banco Central de Chile'
---

<!--
Guía de la ruta «Tu primera operación», paso 1. Borrador de Cowork del
2026-10-13 (entrega `aprende-`). REQUIERE VALIDACIÓN DE COMPLIANCE.

REGISTRO DE VERIFICACIÓN, hecho el 2026-10-13 contra las fuentes primarias,
leídas en un navegador:

  1. La definición, el horario de corte (16:00), el plazo para informar
     (16:30), la difusión referencial en el sitio del Banco Central desde las
     17:30, la publicación en el Diario Oficial el día de su vigencia, el
     redondeo a dos decimales, que no se revisa después y las exclusiones:
     ficha metodológica del Banco Central, «Dólar observado», páginas 1 a 4.
  2. Que la ley orgánica obliga al Banco Central a publicar a diario el tipo
     de cambio (artículo 44, inciso segundo) y que el observado es uno de los
     sistemas de reajuste autorizados para créditos en moneda nacional
     (artículo 35 N.° 9): la misma ficha, página 2.
  3. 978,61 pesos por dólar el 13-10-2026: portada del sitio del Banco
     Central ese día y serie diaria de la Base de Datos Estadísticos, que
     coinciden.
  4. Que el 12-10-2026 no fue día hábil bancario: la serie diaria salta del
     09.Oct al 13.Oct. El valor del martes 13 se calculó, por definición, con
     las operaciones del viernes 9.

Regla de estilo aplicada: cero rayas (em-dash o en-dash).

Los cuatro párrafos de «Qué hacemos en la mesa» son frases ya publicadas y
firmadas: las dos primeras, del artículo del IPC; la de la composición, de
`/tarifas`; la última, de todos los artículos del blog.
-->

El dólar observado aparece en las noticias, en los contratos y en la
conversación de cualquiera que esté por cambiar pesos. Es un número oficial,
y por eso se toma como «el precio del dólar». No lo es, y conviene saber por
qué antes de comparar con él el precio que te ofrecen.

Esta guía explica qué es, cómo lo calcula el Banco Central de Chile, cuándo
se publica y para qué sirve. No pronostica y no recomienda operar.

## Qué es

El dólar observado es un promedio. El Banco Central de Chile lo define como
el promedio ponderado por montos de las compras y ventas al contado de
dólares contra pesos chilenos hechas en el Mercado Cambiario Formal durante
el día hábil bancario inmediatamente anterior.

Cada parte de esa definición importa:

- **Promedio ponderado por montos.** Una operación grande pesa más que una
  chica.
- **Al contado.** Operaciones que se pagan en el momento, no contratos a
  futuro.
- **Mercado Cambiario Formal.** Los bancos y las demás entidades que el Banco
  Central autoriza para operar en él.
- **El día hábil anterior.** El observado de hoy está hecho con operaciones de
  ayer.

El del martes 13 de octubre de 2026 fue de 978,61 pesos por dólar. Como el
lunes 12 no fue día hábil bancario, se calculó con las operaciones del viernes
9.

## Cómo se calcula

Las entidades del mercado formal informan al Banco Central sus compras y
ventas al contado de dólares hechas hasta las 16:00 de cada día hábil, y
tienen hasta las 16:30 para hacerlo. El Banco Central revisa que la
información sea consistente, por ejemplo que una operación entre dos bancos
la informen los dos con las mismas características, y calcula el promedio.

Quedan fuera las operaciones cuyo tipo de cambio no se negoció ese mismo día,
como el vencimiento de contratos de derivados con entrega física o las que se
pagan al valor del propio dólar observado. También quedan fuera las compras y
ventas de divisas que hace el Banco Central en sus programas.

El resultado se redondea a dos decimales, y no se revisa después: el valor
publicado es el definitivo.

## Cuándo se publica

El Banco Central difunde el valor en su sitio a partir de las 17:30 del mismo
día de las operaciones, como referencia, y lo publica en el Diario Oficial el
día hábil en que rige. El número que rige un día se conoce desde la tarde del
día hábil anterior.

<figure class="g-linea" aria-labelledby="g-linea-t"><figcaption id="g-linea-t" class="g-rot">Un dólar observado, de las operaciones al día en que rige</figcaption><ol class="g-linea-hitos"><li class="g-ops"><span class="g-hora">hasta las 16:00</span><span class="g-que">Las compras y ventas que cuentan</span></li><li><span class="g-hora">16:30</span><span class="g-que">Los bancos ya las informaron</span></li><li><span class="g-hora">17:30</span><span class="g-que">El Banco Central difunde el valor</span></li><li class="g-rige"><span class="g-hora">el día hábil siguiente</span><span class="g-que">Rige, y sale en el Diario Oficial</span></li></ol></figure>

Por eso, si miras el dólar observado un martes por la mañana, estás mirando
el mercado del lunes hasta las cuatro de la tarde.

## Para qué se usa

El dólar observado es el tipo de cambio que el Banco Central publica cada día
por mandato de su ley orgánica, que le encarga publicar el de las monedas
extranjeras de uso general. Además es uno de los sistemas de reajuste que el Banco Central
autoriza para los créditos en moneda nacional: un contrato puede fijar que
una deuda se ajuste según su valor.

Por eso aparece en contratos y en las noticias: es un número que cualquiera
puede consultar y que no cambia una vez publicado.

## Por qué no es el precio que te cobran

Tres razones, y ninguna depende de quién te venda los dólares.

**Es de ayer.** El observado de hoy se calculó con las operaciones del día
hábil anterior hasta las 16:00. El mercado siguió moviéndose después, así que
el precio de este momento puede estar arriba o abajo.

**Es un promedio de muchas operaciones.** Lo forman las de los bancos y demás
entidades del mercado formal, incluidas las que hacen entre ellos, y pesa más
una operación cuanto más grande es. No es una cotización para una operación
tuya, de tu monto y en este momento.

**Nadie compra ni vende al promedio.** Quien te vende dólares te da un precio
de venta, y quien te los compra, uno de compra. Los dos se forman con el
mercado del momento y llevan dentro el margen de quien opera, el spread. Así
que cuando comparas un precio con el observado, la diferencia mezcla dos
cosas: lo que se movió el mercado desde ayer y el spread.

La comparación útil no es contra el observado. Es entre precios del mismo
momento, para el mismo monto, mirando cuánto recibes al final. De eso trata
la última guía de esta ruta, la del spread.

## Qué hacemos en la mesa

En DLPay cada operación se cierra contra el mercado en el momento de
ejecutarla. El precio que aparece en el cotizador es referencial, lo dice
explícito la propia página, y el precio final lo confirma un ejecutivo antes
de cerrar cada operación, porque el mercado se mueve.

> El precio de referencia no es una promesa de ejecución. Lo confirma una persona antes de cerrar la operación.

DLPay convierte a la tasa de mercado, sin recargo, y lo que cobra va aparte
y a la vista: un costo de envío y una comisión de cambio, que el cotizador
enseña antes de que transfieras. Cuánto es cada uno, por destino y por monto,
está en [tarifas](/tarifas/).

Para entender el recorrido completo de una operación, desde tu transferencia
hasta el dólar digital en tu billetera, está la página de
[cómo funciona una operación](/como-funciona/). Para ver el precio
referencial en este mismo momento, el [cotizador](/#cotizador) está siempre
disponible.

## Fuentes

- Banco Central de Chile: [ficha metodológica del dólar observado](https://si3.bcentral.cl/estadisticas/Principal1/Metodologias/EC/PARIDADES/Dolar_observado.pdf)
- Banco Central de Chile: [serie diaria del dólar observado](https://si3.bcentral.cl/Siete/ES/Siete/Cuadro/CAP_TIPO_CAMBIO/MN_TIPO_CAMBIO4/DOLAR_OBS_ADO)
- Banco Central de Chile: [Compendio de Normas de Cambios Internacionales](https://www.bcentral.cl/compendio-de-normas-de-cambios-internacionales)

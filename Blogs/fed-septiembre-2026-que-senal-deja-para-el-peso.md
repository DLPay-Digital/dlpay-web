---
title: 'La Fed cerró su reunión de septiembre. Cómo llegó la señal al peso.'
description: 'El FOMC se reunió el 15 y 16 de septiembre. Qué comunicó, con qué voto y cómo se está traduciendo al mercado cambiario chileno, sin pronósticos.'
pubDate: 2026-09-17
category: 'Mercado'
---

<!--
REQUIERE VALIDACIÓN DE COMPLIANCE — Artículo con cifras de mercado y del comunicado oficial de
la Reserva Federal. Todos los datos duros son verificables y llevan su fuente al pie.

Verificación de cifras chilenas al 14-sep-2026: dólar observado $940,91 y TPM 4,5% fueron
tomados directamente del home de bcentral.cl (la página los muestra en portada). El home del
BCCh se renderiza por JavaScript, por lo que curl no los devuelve; se reverifican abriendo
https://www.bcentral.cl en un navegador. IPC agosto (4,1% anual, 0,6% mensual) también en el
home del BCCh.

PENDIENTE — actualizar el jueves 17-sep-2026 a primera hora con los cuatro datos del miércoles:
  1. Decisión del FOMC del 16-sep: rango final de la tasa (mantiene / sube / baja).
  2. Conteo del voto y disidencias, si las hubo.
  3. Un giro concreto del comunicado (una palabra o una frase que cambie respecto al de julio).
  4. Cierre intradía del DXY el miércoles y dólar observado del jueves en la apertura.
Los tramos que dependen de esos datos están marcados en el cuerpo con [PENDIENTE — ...].

PENDIENTE — portada del artículo:
  REESCRITO EL 2026-09-16. Lo que había acá pedía un PNG de 1200×630 con un diagrama de
  "propagación": dos marcadores rotulados "FOMC" y "CLP" unidos por un tramo con un chevron que
  indicaba el sentido del flujo. Ese asset NO se debe producir, por dos motivos.

  1 · El dibujo afirmaba lo que el artículo evita decir. La cuña es la marca del valor
      moviéndose (ADR-0001 §3, Design System §6): es la misma que dibuja pesos cruzando una
      frontera en /empresas. Dos marcadores unidos por una cuña dicen que algo de valor va de la
      Fed al peso chileno — una relación causal, justo en el artículo que escribe "no pronostica
      ni recomienda operar". La portada contradecía al texto.

      De ahí sale la regla que hoy gobierna esto: LA CUÑA NO ENTRA EN LAS PORTADAS. Una portada
      muestra un dato, no un movimiento. Está en el Design System §6.

  2 · Ya no hay archivo que producir. Las portadas son SVG dibujado en la página por
      `PortadaDato.astro`, y se declaran en el frontmatter. No se sube ningún PNG y no existe el
      campo `coverImage`, retirado el 2026-09-16.

  QUÉ HACER EN SU LUGAR. Este artículo cae en el tipo `rango`, porque la tasa objetivo de la Fed
  es literalmente un rango, y con eso la portada pasa a ser EL DATO del que habla el artículo sin
  afirmar ningún vínculo. Al cerrar el texto, añadir al frontmatter con las cifras de septiembre:

      portada:
        tipo: rango
        etiqueta: 'Tasa de fondos federales'
        min: 3.50            # REQUIERE VALIDACIÓN DE COMPLIANCE — cifra de mercado
        max: 3.75            # REQUIERE VALIDACIÓN DE COMPLIANCE — cifra de mercado
        unidad: '%'
        fecha: 2026-09-16
        fuente: 'comunicado del FOMC'

  `fuente` es obligatoria: el esquema rompe el build sin ella. Las cifras las aprueba Compliance
  junto con el texto, no ingeniería. Y si van en la portada tienen que estar TAMBIÉN en el cuerpo
  del artículo: una portada no puede ser el único sitio donde vive un dato.

  La paleta del bloque anterior también queda sin efecto. Pedía fondo --papel con trazos en
  --tinta y --verde-deep, que era lo correcto para un PNG suelto sobre página clara. La portada es
  una banda a sangre en tinta: sobre ella --verde rinde 8,45:1 y puede llevar el trazo, que es
  justamente lo que --verde-deep venía a resolver sobre claro.
-->

Esta semana la Reserva Federal de Estados Unidos volvió a decidir qué hace con su tasa de
interés. Se decidió en Washington y se leyó, casi al mismo minuto, en Santiago. El peso chileno
no queda al margen de una reunión del FOMC, y ésta llegó con más matices de los que suele tener
una decisión monetaria "aburrida".

Este artículo no pronostica ni recomienda operar. Hace tres cosas: recuerda en qué punto
arrancó la reunión, describe lo que la Fed comunicó y las señales que dejó, y explica cómo se
traducen al mercado cambiario chileno.

## Qué había en juego

En su reunión del 28 y 29 de julio el FOMC mantuvo su tasa de fondos federales en el rango de
**3,50% a 3,75%**. Lo relevante no fue la decisión: fue el conteo del voto. Nueve miembros a
favor de mantener, **tres en contra** —los presidentes de las Fed de Cleveland, Minneapolis y
Dallas— que preferían **subir** un cuarto de punto. No bajar. Subir.

Un voto disidente aislado es habitual. Tres disidencias en la misma dirección, todas por
endurecer, es la señal más restrictiva —"hawkish", en la jerga— que ha dado el comité en
varios meses. La razón declarada: la inflación sigue por sobre la meta del 2% que la Fed se
fija a sí misma, y hay componentes que no ceden, la energía entre ellos.

Con ese antecedente, la reunión de esta semana llegó cargada de expectativa. La pregunta no
era solamente qué hacía la Fed con la tasa. Era qué hacía con el sesgo.

## Qué comunicó el miércoles

[PENDIENTE — resultado real del 16-sep, dos o tres líneas: rango final de la tasa, conteo del
voto y disidencias si las hubo. Ejemplo del formato una vez conocido el dato: "El comunicado
del miércoles mantuvo la tasa en el rango de 3,50% a 3,75%, con un voto de 10 a 2. Los
disidentes esta vez fueron..." o "El FOMC subió la tasa 25 puntos base al rango de 3,75% a 4%,
con un voto de 8 a 4..."]

[PENDIENTE — un giro concreto del comunicado o de la conferencia de Powell que aporte lectura:
qué se sostiene, qué se suaviza, qué se endurece frente al comunicado de julio. Media hora
después del comunicado, en la conferencia de prensa, Jerome Powell dio el tono en tres o cuatro
frases: la que más importa esta vez es ésta.]

## Las tres señales que dejó

Tres cosas quedan sobre la mesa después de una reunión de la Fed, y las tres importan más que
el titular.

**El sesgo del comunicado.** Cada palabra pesa. Los términos que definen si el próximo paso es
endurecer, mantener o preparar el terreno para bajar están en un párrafo de cinco líneas. En
esta reunión [PENDIENTE — qué palabras cambiaron o se sostuvieron].

**El conteo del voto.** Después de una reunión con tres disidencias, el voto de esta semana
era la lectura más limpia del consenso interno del comité. [PENDIENTE — cómo se resolvió: si
las disidencias se sostuvieron, se ampliaron o desaparecieron].

**El *dot plot*.** Es el gráfico de proyecciones que muestra dónde ven cada uno de los
miembros del comité la tasa a fin de año, el año siguiente y a más largo plazo. Sólo se
publica en cuatro reuniones al año y ésta fue una de ellas. No es una promesa, pero es la guía
más limpia del rumbo que tiene en la cabeza el comité. [PENDIENTE — hacia dónde apuntó la
mediana].

## Cómo se lee desde Chile

El lunes 14 de septiembre el **dólar observado** que publica el Banco Central abrió en
**$940,91**. La **tasa de política monetaria** del Banco Central de Chile —la TPM— está en
**4,5%**. El diferencial entre la TPM chilena y la tasa de la Fed es una de las variables que
sostiene al peso: mientras el peso paga más que el dólar por dejarlo estacionado, el capital
tiende a quedarse.

Cuando la Fed endurece, el diferencial se estrecha y ese sostén se debilita. Cuando la Fed
mantiene con tono conciliador, el diferencial se sostiene y el peso encuentra piso. El vínculo
nunca es lineal: importa el precio del cobre, importa el índice DXY —que mide al dólar frente
a una canasta de monedas—, importa el humor global del riesgo. Pero la Fed suele ser el
gatillo más rápido.

Al cierre del miércoles el DXY [PENDIENTE — reacción intradía, una frase] y el peso [PENDIENTE
— dónde abrió el jueves]. El movimiento cuenta poco por sí solo. Lo que cuenta es hacia dónde
se acomodó la lectura y con cuánta convicción.

## Qué hacemos en la mesa

En DLPay cada operación se cierra contra el mercado en el momento de ejecutarla. El precio
que aparece en el cotizador es referencial —lo dice explícito la propia página— y el precio
final lo confirma un ejecutivo antes de cerrar cada operación, porque el mercado se mueve.
Cuando ocurre algo como una reunión de la Fed, el precio final que confirma el ejecutivo
refleja lo que hizo el mercado durante y después del anuncio.

> El precio de referencia no es una promesa de ejecución. Lo confirma una persona antes de cerrar la operación.

Después de una reunión de la Fed el precio suele acomodarse durante las horas siguientes
—primero al comunicado, después a la conferencia— hasta que el mercado encuentra un nuevo
equilibrio. Cualquier decisión operativa la conversa cada persona con su ejecutivo.

Para entender el recorrido completo de una operación —desde tu transferencia hasta el dólar
digital en tu billetera— está la página de [cómo funciona una operación](/como-funciona/).
Para ver el precio referencial en este mismo momento, el [cotizador](/#cotizador) está siempre
disponible.

## Fuentes

- Federal Reserve — [Comunicado del FOMC del 29 de julio de 2026](https://www.federalreserve.gov/newsevents/pressreleases/monetary20260729a.htm)
- Federal Reserve — [Calendario y materiales del FOMC](https://www.federalreserve.gov/monetarypolicy/fomccalendars.htm)
- Banco Central de Chile — [Indicadores diarios (dólar observado, TPM, UF)](https://www.bcentral.cl)

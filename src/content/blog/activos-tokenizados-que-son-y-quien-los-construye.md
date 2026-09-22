---
title: 'Activos tokenizados: qué son, quién los está construyendo y por qué la conversación se aceleró.'
description: 'Qué son, quién los está construyendo y qué rol cumplen las stablecoins como capa de settlement en el ecosistema global.'
pubDate: 2026-09-21
category: 'Mercado'
estado: publicado
# Portada de tipo `figura`, aprobada por Sebastián el 2026-09-22.
#
# NO lleva cifra, y el motivo es el mismo por el que estuvo sin portada hasta
# ahora: el artículo es panorámico y no se apoya en un dato puntual ni en un
# intervalo. Elegir una de sus cifras para que fuera LA cifra de la portada
# sería una decisión editorial sobre datos de producto de terceros que están
# bajo marcador de Compliance. Ese razonamiento no se cayó — es justo lo que
# hace que el tipo correcto sea `figura` y no `cifra` ni `rango`.
#
# El pictograma dibuja UNA ficha con una T, hecha de unidades, circulando. Dice
# una propiedad del asunto del artículo y no afirma nada sobre lo que DLPay
# hace. La condición está escrita en `PortadaFigura.astro` y no se puede
# relajar: **un solo nodo, ninguna contraparte**.
portada:
  tipo: figura
  figura: activo-tokenizado
---

<!--
Validado por Sebastián (Compliance) el 2026-09-21. Se conserva el registro de reverificación, que
es lo que permite auditar el artículo más adelante.

Cifras de producto de terceros. Cinco puntos a reverificar si el artículo se cita o se actualiza:
  1. xStocks de Kraken: disponibilidad vigente y sobre qué blockchain se emiten.
  2. Robinhood Europa: que la oferta de acciones tokenizadas siga vigente y sobre qué layer 2.
  3. Coinbase: estado de su petición a la SEC para ofrecer acciones tokenizadas en EE. UU.
  4. BUIDL de BlackRock: mecanismo de redención (a la fecha, en USDC y no por transferencia).
  5. Cifras agregadas de RWA: contrastar con rwa.xyz, que es la fuente citada.

SOBRE LA PORTADA. El bloque de asset pendiente que traía este borrador pedía un PNG de 1200x630
y una línea `coverImage` en el frontmatter. Ninguna de las dos cosas existe desde el 2026-09-16:
`coverImage` se retiró del esquema y las portadas las dibuja el sistema, declaradas en el
frontmatter. Este artículo llevó sin portada del 21 al 22 de septiembre, porque los dos tipos que
había entonces eran de dato y ninguno le servía. El 2026-09-22 Sebastián aprobó el pictograma y
entró como tipo `figura`; el porqué está arriba, junto al frontmatter, y la regla que hubo que
enmendar para admitirlo es el Design System §6.1.
-->

En las últimas semanas la conversación sobre activos tokenizados pasó de nota técnica en
algún reporte de consultoría a tema recurrente en la prensa financiera. BlackRock cruzó un
umbral simbólico con su fondo tokenizado de tesorería, Kraken lanzó xStocks con acciones
estadounidenses envueltas en tokens, Robinhood ofreció acciones tokenizadas a sus clientes
europeos y Coinbase presentó a la SEC una petición formal para hacer lo mismo en Estados
Unidos. En paralelo, la categoría "real world assets", los "RWA" que le dan nombre, dejó de
ser un nicho de conferencia y empezó a aparecer en balances y comunicados de gestores
tradicionales.

Este artículo describe qué son, quién los está construyendo, por qué se aceleró la
conversación y qué rol cumple la infraestructura de dólar digital en toda esta arquitectura.
Es una pieza de referencia. No pronostica, no recomienda operar y no toma postura sobre si
el fenómeno "es bueno o malo".

## De qué estamos hablando exactamente

Un activo tokenizado es la representación en un registro distribuido, una blockchain, de la
propiedad o del derecho sobre un activo del mundo real. Una acción, un bono del Tesoro
estadounidense, una participación en un fondo, un metro cuadrado de un edificio. En vez de
que la propiedad quede anotada en el sistema de post-negociación tradicional que usa una
bolsa, se anota en una red distribuida donde cada movimiento queda registrado y verificable.

Conviene decir lo que **no** es. No es un activo nuevo: una acción tokenizada de Apple sigue
siendo una acción de Apple, con los mismos derechos económicos asociados, dividendo,
votación, participación en la propiedad de la empresa, ; sólo cambia el formato del registro.
No es "cripto" en el sentido popular, porque su valor no depende de la especulación sobre el
token sino del activo subyacente. Y no es una desregulación disfrazada: cada jurisdicción
trata al activo tokenizado según las reglas del activo original.

Lo que cambia, y lo que explica el ruido de estas semanas, es la técnica. Liquidación en
minutos en vez de dos o tres días. Operatividad las veinticuatro horas del día, todos los
días del año, en vez de horario bursátil. Posibilidad de fraccionar hasta niveles imposibles
en el sistema tradicional. Transferencia sin necesidad de una cadena de bancos corresponsales
o custodios internacionales.

## El frente que está dando los titulares: las acciones tokenizadas

De los frentes activos hoy, el que más titulares se lleva es el de las acciones. Tres
protagonistas concentran casi toda la conversación.

**xStocks (Kraken × Backed Finance).** Kraken, el exchange de origen estadounidense, lanzó
xStocks en asociación con Backed Finance, una empresa suiza especializada en emitir tokens
respaldados por securities tradicionales. El producto ofrece acciones estadounidenses, Apple,
Tesla, Microsoft, NVIDIA entre las de más volumen, representadas como tokens sobre la
blockchain de Solana. Cada token está respaldado 1:1 por una acción real que Backed mantiene
en custodia con un broker regulado. El par de trading principal es contra USDC. Un dato clave
y a menudo pasado por alto: **xStocks no está disponible para usuarios residentes en Estados
Unidos**. Se ofrece a usuarios internacionales, y el motivo es explícitamente regulatorio: la
SEC todavía no ha creado un régimen específico para negociar acciones estadounidenses en
formato tokenizado dentro del país.

**Robinhood en Europa.** En 2025 Robinhood adquirió Bitstamp y sobre esa infraestructura
desplegó su oferta de acciones tokenizadas para clientes europeos. Ofrece más de doscientas
acciones estadounidenses tokenizadas, de Nasdaq y NYSE, emitidas sobre Arbitrum, la layer 2
de Ethereum. El movimiento tiene una lectura clara: darle a un cliente europeo acceso a
acciones estadounidenses sin las capas de intermediación tradicional del corretaje
transfronterizo. La regulación europea encaja aquí: MiCA regula los criptoactivos como tales,
pero los tokens que representan securities caen bajo MiFID, que es la regulación bursátil
tradicional. Robinhood Europa opera bajo esa lógica.

**La discusión en Estados Unidos.** Coinbase presentó a la SEC una petición formal para
poder ofrecer acciones tokenizadas dentro del país. La posición de la SEC bajo la actual
administración ha sido más receptiva al tema que en años anteriores, aunque sigue sin
definirse un régimen específico. Se discute públicamente si las acciones tokenizadas caen
bajo las mismas reglas de securities existentes o si merecen un tratamiento particular por
sus características técnicas. Es la parte de la conversación con menos certezas: cualquier
movimiento formal de la SEC en los próximos trimestres va a mover a todo el ecosistema.

## Los otros frentes, en breve

Fuera de las acciones, dos frentes tienen tracción real. El primero, y probablemente el más
maduro hoy, es el de **bonos y tesorería**. BlackRock lanzó en 2024 el fondo BUIDL, un fondo
tokenizado que invierte en bonos del Tesoro de Estados Unidos y opera principalmente sobre
Ethereum. Ondo Finance y Franklin Templeton BENJI compiten en el mismo espacio con productos
análogos. La pista técnica más interesante de estos productos es que BUIDL redime en USDC,
la stablecoin, no en dólares por transferencia bancaria. Esa decisión no es cosmética:
ancla al frente al riel de stablecoins como el sistema de settlement de facto.

El segundo frente reúne a **fondos, inmobiliario y commodities**. Iniciativas sobre real
estate como Propy o RealT existen, aunque a escala mucho menor. Commodities tokenizados
llevan más tiempo en el ecosistema, PAXG, respaldado por oro físico, es de 2019. Superstate
ofrece fondos tokenizados sobre tesorería, análogos a los de BlackRock. Ninguno de estos
frentes alcanza aún el volumen que ya movilizan los dos primeros, pero llevan la misma
dirección.

## Por qué se acelera: stablecoins como capa de settlement

Toda esta arquitectura tiene un elemento estructural que muchas veces queda tácito: necesita
un instrumento estándar para representar dólares en la blockchain. Sin él, cada token de una
acción tokenizada, de un bono o de un fondo se quedaría sin contraparte natural para
negociar. **USDT y USDC**, las dos stablecoins más grandes del mercado, emitidas por Tether
y por Circle respectivamente, cumplen ese rol. Son el settlement layer del ecosistema: la
moneda en la que se compra, se vende y se redime.

El caso de BUIDL es ilustrativo. Un inversor institucional entra al fondo aportando USDC;
el fondo compra bonos del Tesoro; cuando el inversor sale, recibe USDC. En xStocks es
análogo: la contraparte al token de la acción es USDC. En Robinhood Europa es lo mismo, las
acciones tokenizadas se negocian contra la stablecoin, no contra euros o dólares por
transferencia bancaria.

La consecuencia práctica es interesante: **a medida que el volumen de activos tokenizados
crece, el volumen que se mueve sobre USDT y USDC como capa de settlement crece con él**. No
es una relación especulativa; es una relación mecánica. La stablecoin ya no es un instrumento
"cripto" en el sentido en que la palabra se usa popularmente. Es la infraestructura sobre la
que se está armando una parte creciente del mercado financiero global.

## Qué NO son (conviene decirlo con claridad)

Tres cosas conviene sacar de la cabeza al hablar de activos tokenizados.

No son títulos desregulados. Una acción tokenizada de Apple, en manos de un usuario europeo,
sigue siendo una acción de Apple con las reglas de securities que le apliquen, MiFID en
Europa, la SEC en Estados Unidos, la CMF en Chile si algún día se ofreciera acá. El
envoltorio técnico no cambia la naturaleza legal del activo subyacente. Un bono del Tesoro
tokenizado sigue siendo un bono del Tesoro con la garantía soberana estadounidense detrás.

No son "cripto" en el sentido popular. El valor de un token que representa una acción de
Apple depende de lo que vale la acción de Apple, no de la especulación sobre el token. La
confusión es entendible, viven en la misma infraestructura técnica que las criptomonedas
especulativas, pero conceptualmente son cosas distintas.

Y no son productos financieros nuevos con reglas nuevas. Son los mismos activos con un
formato distinto de registro y liquidación. La innovación es de infraestructura, no de
instrumento.

## El mapa regulatorio, en breve

Estados Unidos está en proceso de definir su posición. La SEC ha recibido peticiones formales
de Coinbase y otras firmas; el régimen específico todavía no existe. Mientras tanto,
productos como xStocks se ofrecen sólo a usuarios no estadounidenses precisamente por esta
ambigüedad.

La Unión Europea tiene el marco más claro. MiCA regula los criptoactivos como tales, pero los
tokens que representan securities caen bajo MiFID, la regulación bursátil tradicional.
Robinhood Europa opera bajo esa lógica: lo que ofrece son securities con un envoltorio
técnico, no criptoactivos nuevos.

En Chile, la Ley Fintech, Ley 21.521, publicada en 2023, reconoce activos digitales bajo la
supervisión de la Comisión para el Mercado Financiero. No existe hoy un régimen específico
para tokenización de activos financieros tradicionales, pero la CMF sigue de cerca los
desarrollos internacionales. En LATAM más amplia, la CVM en Brasil y la CNBV en México están
en procesos análogos, cada una a su ritmo.

## Qué hacemos en la mesa

En DLPay operamos en el riel de dólar digital que hoy es la capa de settlement de todo el
ecosistema descrito. No participamos en la tokenización de acciones, bonos ni fondos: nuestro
servicio es el cambio de divisas entre pesos chilenos y dólar digital, principalmente
USDT. Lo que sí compartimos con el ecosistema de activos tokenizados es la infraestructura:
cuando alguien en DLPay convierte pesos a dólar digital, se mueve sobre el mismo riel que
utiliza un fondo tokenizado para redimir a un inversionista, o un exchange para liquidar la
compraventa de una acción tokenizada.

<!--
  FIGURA DE PÁGINA — el peso, el dólar digital y la tokenización.
  Entrega `cowork/2026-09-22-riel-tokenizado`, aprobada por Sebastián.

  Va en HTML crudo dentro del Markdown, y no como componente, porque este
  artículo es `.md` y no `.mdx`: usar un componente aquí obligaría a instalar
  `@astrojs/mdx`, que es una dependencia nueva y CLAUDE.md §0.3 no la admite sin
  el análisis del §8. Sus estilos viven en `[slug].astro`, bajo `.prose`, que es
  donde ya viven los del resto del cuerpo. **Si una segunda pieza la necesita,
  deja de ser contenido y pasa a ser componente.**

  `aria-hidden` envuelve al dibujo Y a sus etiquetas. En `UseCaseFigure` los
  rótulos van DENTRO del SVG, así que quedan ocultos con él; acá van fuera —para
  que no escalen con el ancho— y sin esta envoltura un lector de pantalla leería
  «pesos, dólar digital» sueltos entre dos párrafos. El párrafo de abajo dice lo
  mismo con palabras, y por eso no es opcional.
-->
<!--
  SIN LÍNEAS EN BLANCO dentro de este bloque. En Markdown un bloque de HTML
  termina en la primera línea vacía (CommonMark §4.6), así que las que traía la
  maqueta cortaban el SVG por la mitad: el build publicaba la moneda izquierda y
  perdía el tramo, la cuña y la moneda derecha. Se vio midiendo el HTML servido,
  no el archivo.
-->
<div class="riel" aria-hidden="true">
  <svg class="riel-fig" viewBox="0 0 320 104">
    <circle class="aro" cx="44" cy="52" r="30"/>
    <circle class="aro" cx="44" cy="52" r="24"/>
    <path class="signo" d="M44.00 36.40 V67.60"/>
    <path class="signo" d="M50.60 46.00 C50.60 43.00 47.72 41.20 44.00 41.20 C40.28 41.20 37.40 43.00 37.40 46.00 C37.40 49.00 40.04 50.50 44.00 52.00 C47.96 53.50 50.60 55.00 50.60 58.00 C50.60 61.00 47.72 62.80 44.00 62.80 C40.28 62.80 37.40 61.00 37.40 58.00"/>
    <path class="link" d="M80 52h69.2l7.2-6 7.2 12 7.2-6h69.2"/>
    <circle class="aro" cx="276" cy="52" r="30"/>
    <circle class="aro" cx="276" cy="52" r="24"/>
    <path class="unidad" d="M300.00 52.00 L306.00 52.00 M299.18 58.21 L304.98 59.76 M296.78 64.00 L301.98 67.00 M292.97 68.97 L297.21 73.21 M288.00 72.78 L291.00 77.98 M282.21 75.18 L283.76 80.98 M276.00 76.00 L276.00 82.00 M269.79 75.18 L268.24 80.98 M264.00 72.78 L261.00 77.98 M259.03 68.97 L254.79 73.21 M255.22 64.00 L250.02 67.00 M252.82 58.21 L247.02 59.76 M252.00 52.00 L246.00 52.00 M252.82 45.79 L247.02 44.24 M255.22 40.00 L250.02 37.00 M259.03 35.03 L254.79 30.79 M264.00 31.22 L261.00 26.02 M269.79 28.82 L268.24 23.02 M276.00 28.00 L276.00 22.00 M282.21 28.82 L283.76 23.02 M288.00 31.22 L291.00 26.02 M292.97 35.03 L297.21 30.79 M296.78 40.00 L301.98 37.00 M299.18 45.79 L304.98 44.24"/>
    <path class="signo" d="M276.00 36.40 V67.60"/>
    <path class="signo" d="M282.60 46.00 C282.60 43.00 279.72 41.20 276.00 41.20 C272.28 41.20 269.40 43.00 269.40 46.00 C269.40 49.00 272.04 50.50 276.00 52.00 C279.96 53.50 282.60 55.00 282.60 58.00 C282.60 61.00 279.72 62.80 276.00 62.80 C272.28 62.80 269.40 61.00 269.40 58.00"/>
  </svg>
  <div class="riel-tags"><span>pesos</span><span>dólar digital</span></div>
</div>

<!--
  REQUIERE VALIDACIÓN DE COMPLIANCE — aprobado por Sebastián el 2026-09-22 junto
  con la figura. Es la única frase nueva de la entrega: el resto del párrafo que
  la acompañaba en la maqueta repetía lo que el párrafo de arriba ya dice sobre
  el riel compartido, y no se duplica.
-->
**El peso no está tokenizado; el dólar digital sí.** Es el mismo dólar existiendo como unidades
sobre una red.

> El precio de referencia no es una promesa de ejecución. Lo confirma una persona antes de cerrar la operación.

La conversación sobre tokenización va a seguir. Es probable que en los próximos trimestres
veamos productos análogos aparecer en LATAM, autorizaciones regulatorias que hoy están
pendientes y, con toda probabilidad, más volumen liquidado sobre stablecoins. Nuestro
trabajo, mientras tanto, sigue siendo el mismo: ejecutar una operación de cambio de divisas
con precio claro, tiempos claros y una persona al otro lado.

Para entender el recorrido completo de una operación, desde tu transferencia hasta el dólar
digital en tu billetera, está la página de [cómo funciona una operación](/como-funciona/).
Para ver el precio referencial en este mismo momento, el [cotizador](/#cotizador) está
siempre disponible.

## Fuentes

- Kraken: [xStocks](https://www.kraken.com/xstocks)
- Backed Finance: [emisor de xStocks](https://backed.fi)
- BlackRock: [fondo BUIDL](https://www.blackrock.com)
- Ondo Finance: [ondo.finance](https://ondo.finance)
- Franklin Templeton: [BENJI](https://www.franklintempleton.com)
- SEC: [statements y filings públicos sobre tokenized securities](https://www.sec.gov)
- CMF Chile: [Ley Fintech (Ley 21.521)](https://www.cmfchile.cl)
- rwa.xyz: [data agregada de RWAs](https://rwa.xyz)

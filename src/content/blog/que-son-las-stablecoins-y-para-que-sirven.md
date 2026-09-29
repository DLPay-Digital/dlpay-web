---
title: 'Qué son las stablecoins, quiénes las emiten y para qué sirven desde Chile.'
description: 'Qué son, cómo mantienen su paridad con el dólar, quiénes las emiten hoy y para qué sirven desde Chile en el cambio de divisas.'
pubDate: 2026-09-29
category: 'Mercado'
estado: publicado
portada:
  tipo: cifra
  etiqueta: 'Stablecoins en circulación'
  valor: 292
  unidad: 'mil millones de dólares'
  fecha: 2026-09-29
  fuente: 'CoinGecko'
# Portada de tipo `cifra`, aprobada por Sebastián el 2026-09-29. **Es la primera
# del sitio**: hasta hoy ningún artículo usaba esta rama del esquema.
#
# NO es un pictograma, y la decisión está razonada en el Design System §6.1
# («El techo de la enmienda»). En corto: para este asunto no hay figura posible.
# La ficha de anillo con el canto dividido en unidades, que sería el dibujo
# obvio, se publicó el 2026-09-28 en `FiguraRiel.astro`, dentro de
# `/como-funciona`, y allí su rótulo dice «dólar digital»: usarla acá diría
# «stablecoin = el dólar digital de DLPay», en el artículo cuya frase central es
# «no emitimos stablecoins». Y lo único que distingue al
# asunto es la paridad, que no se dibuja sin afirmar que se sostiene, justo en un
# artículo con una sección dedicada a que puede no sostenerse.
#
# La cifra es la del SECTOR y no la de un emisor, y eso también es decisión:
# elevar a portada el market cap de Tether en un artículo que nombra a ocho
# emisores repetiría el sobre-alcance que el registro de verificación de abajo
# ya corrigió en su punto 2.
#
# Vive también en el cuerpo, en «Qué es una stablecoin», como exige
# `PortadaDato.astro`: una portada no puede ser el único sitio donde vive un dato.
---

<!--
Artículo explainer sobre la categoría stablecoin. **Validado por Sebastián como
Compliance y publicado el 2026-09-29.** Menciona por nombre a Tether, Circle,
Ripple, PayPal, Paxos, First Digital, Sky (antes MakerDAO) y Ethena, sin
comparar cualitativamente entre ellas: las descripciones son factuales
(jurisdicción, emisor, blockchain, mecanismo, foco declarado) y los juicios de
valor se retiraron en la segunda revisión.

REGISTRO DE VERIFICACIÓN DE DATOS, hecha el 2026-09-29 contra las fuentes:

  1. Market cap de USDT. CoinGecko daba **183,8 mil millones** ese día, así que
     la cifra del texto pasó de «más de 130 mil millones» a «más de 180», con
     la fecha y la fuente dentro del párrafo. La cifra es un orden de magnitud
     y envejece: quien la actualice, actualice también la fecha.
  2. El orden de los emisores. El texto decía «en orden por market cap y
     relevancia» y **con los datos de ese día no se cumplía**: PYUSD (2,69 mil
     millones) está sobre RLUSD (2,52), y USDS (9,77), USDe (4,91) y DAI (4,59)
     están sobre los dos, aunque el artículo los trate como «otras del
     mercado». Se retiró la afirmación de orden; la sección agrupa por MODELO,
     no por tamaño, y así es correcta.
  3. First Digital (FDUSD). Sede en Hong Kong y regulación local, confirmadas.
     Pero su tamaño **desmentía el presente**: 325 millones y puesto 145 en
     CoinGecko, frente a su tracción de 2024. La frase se fechó y se situó.
  4. Circle: IPO 2025 y atestaciones mensuales por Deloitte. Sin cambios.
  5. Ripple RLUSD: licencia NYDFS y lanzamiento en diciembre de 2024. Sin
     cambios. **El enlace de la ficha sí cambió**: `ripple.com/rlusd` daba 404
     y la página vigente es `ripple.com/products/stablecoin/`.
  6. De-peg de USDC en marzo de 2023 por exposición a SVB, y colapso de
     UST/Terra en mayo de 2022 con cerca de 40 mil millones. Sin cambios.
  7. Agregado del sector: CoinGecko declara en su propia ficha de categoría
     «The Stablecoins market cap today is $292 Billion», con el detalle
     $292.246.601.414. Es la cifra de la portada y vive también en el cuerpo.
     Envejece igual que la de Tether: quien la actualice, actualice la fecha en
     los dos sitios.
  8. Los siete enlaces del pie resuelven. Dos estaban rotos y se corrigieron
     (Ripple, arriba; y la categoría de CoinGecko, que en singular da 404).
     `firstdigitallabs.com` y `coingecko.com` devuelven 403 a `curl` por
     detección de bots y **se comprobaron en un navegador real**: los dos
     cargan.

CORRECCIÓN del mismo día, por la tarde: el párrafo de «Qué hacemos en la mesa»
  perdió su negación absoluta de custodia, que era inexacta para el modo de
  autoservicio. El detalle está en `docs/auditoria-preproduccion.md` y la regla
  que lo gobierna en `CLAUDE.md` §1. **No se transcribe acá a propósito: los
  comentarios de un `.md` viajan al HTML publicado, y una frase retirada no
  vuelve a la página ni dentro de un comentario.**

Lo único que queda sin fuente citable en el pie: «la de mayor uso en LATAM y en
Asia», sobre USDT. Es un claim de mercado sobre producto de un tercero y va
bajo la firma de Sebastián.

Regla de estilo aplicada en la redacción: **cero rayas** (em-dash o en-dash).
Comas y puntos según corresponda. Comprobado en el `.md` y en el HTML servido.
-->

Mencionamos "dólar digital" y "stablecoin" muchas veces en este blog, en las
conversaciones con clientes y en la documentación del servicio. Vale la pena
parar y explicar con precisión qué son. No es un concepto complicado: el
mecanismo cabe en un párrafo, y de esa simplicidad viene su utilidad.

Este artículo describe qué son las stablecoins, cómo se sostiene su paridad
con el dólar, quiénes las emiten hoy y para qué sirven en la práctica desde
Chile. También describe los riesgos, porque una explicación honesta requiere
ambos lados. No pronostica y no recomienda operar.

## Qué es una stablecoin

Una stablecoin es una moneda digital diseñada para mantener paridad con una
moneda tradicional. Casi siempre esa moneda es el dólar estadounidense: hay
stablecoins ancladas al euro, al oro y a canastas de monedas, pero el dólar
concentra la abrumadora mayoría del volumen del sector. El sector entero suma
292 mil millones de dólares en circulación al 29 de septiembre de 2026, según
CoinGecko.

La regla es directa. Un token USDT vale un dólar. Un token USDC vale un dólar.
Un token RLUSD vale un dólar. No es que "aproximadamente" valen un dólar. El
compromiso del emisor es que un token es redimible por un dólar en cualquier
momento, y ese compromiso es lo que sostiene el valor.

## Cómo se mantiene la paridad

La forma en que una stablecoin mantiene la paridad no es uniforme. Hay tres
modelos principales, muy distintos entre sí.

**Colateralizadas 1:1 con activos reales.** Es el modelo dominante. USDT,
USDC, RLUSD, PYUSD y FDUSD funcionan así. El emisor recibe un dólar, mantiene
ese dólar (o equivalente: bonos del Tesoro estadounidense de corto plazo,
papel comercial, depósitos bancarios) en reserva, y emite un token. Cuando
alguien redime, se destruye el token y el emisor libera el dólar. La paridad
se sostiene por arbitraje: si el token cae debajo del dólar en el mercado,
cualquiera puede comprarlo a descuento y redimirlo por el valor total al
emisor, ganando la diferencia. Si sube arriba del dólar, cualquiera puede
depositar dólares con el emisor y vender los tokens recién emitidos. Ese
arbitraje empuja el precio de vuelta al peg.

**Sobrecolateralizadas con cripto.** DAI y USDS (antes del ecosistema
MakerDAO, hoy Sky) funcionan así. Se emite un dólar de stablecoin depositando
más de un dólar en criptomonedas, típicamente 1,50 dólares o más en ETH u
otros activos digitales. Si el valor de la garantía cae por debajo de cierto
umbral, se liquida automáticamente para mantener la solvencia del sistema. Es
un modelo más descentralizado, pero requiere mecánica más compleja y
sobreexposición del usuario a la volatilidad cripto.

**Algorítmicas.** Intentan mantener la paridad con incentivos económicos
entre dos tokens, sin colateral real. UST/Terra fue el caso más famoso, y
colapsó en mayo de 2022 borrando cerca de 40 mil millones de dólares de
valor en pocos días. Tras ese episodio el modelo algorítmico puro perdió
adopción, y hoy se lo menciona sobre todo para distinguirlo de las
stablecoins colateralizadas. Cuando alguien dice "stablecoin" en 2026, en la
práctica se refiere al primer modelo.

## Los principales emisores hoy

Unos pocos actores concentran la mayor parte del mercado. Estos son los que
aparecen constantemente en la operación:

**Tether (USDT).** El más grande y el más antiguo. Lanzada en 2014, con más de
180 mil millones de dólares en circulación al 29 de septiembre de 2026, según
CoinGecko. Opera en múltiples blockchains (Ethereum, Tron, Solana, entre
otras) y publica atestaciones trimestrales de sus reservas. Es la stablecoin
con mayor volumen de trading en el mundo y la de mayor uso en LATAM y en
Asia.

**Circle (USDC).** El segundo emisor por tamaño, con foco institucional.
Circle publica atestaciones mensuales por Deloitte, y sus reservas están
principalmente en bonos del Tesoro estadounidense de corto plazo. La compañía
salió a bolsa (IPO) en 2025, y USDC es la contraparte de productos
institucionales como el fondo tokenizado BUIDL de BlackRock, que redime en
USDC. Regulado bajo licencias estatales de money transmitter en Estados
Unidos.

**Ripple (RLUSD).** El más nuevo entre los grandes. Lanzada en diciembre de
2024 por Ripple, con custodia bancaria tradicional. Emite en Ethereum y en el
XRP Ledger, y opera bajo licencia del Departamento de Servicios Financieros
de Nueva York (NYDFS). El foco declarado es el sector institucional y los
pagos transfronterizos entre bancos.

**PayPal (PYUSD).** Lanzada en 2023 por PayPal en asociación con Paxos como
emisor regulado. Enfoque en pagos dentro del ecosistema PayPal, remesas y
comercio digital. Disponible principalmente en Ethereum y Solana.

**First Digital (FDUSD).** Con sede en Hong Kong y emitida por First Digital
Group bajo la regulación local. Ganó tracción en Asia y en varios exchanges
internacionales grandes durante 2024, y hoy circula bastante menos que las
cuatro anteriores.

**Otras del mercado.** Vale la pena mencionar dos categorías fuera de las
cinco anteriores. Las **descentralizadas**, principalmente DAI y USDS del
ecosistema Sky, sobrecolateralizadas y gobernadas por un token DAO. Y las
**sintéticas**, como USDe (Ethena), que mantienen la paridad con estrategias
delta-neutrales usando derivados. Estas últimas tienen un perfil de riesgo
distinto del de las colateralizadas 1:1 y menos historia de mercado.

Cada emisor tiene su propio marco regulatorio, sus propias reservas y su
propia jurisdicción. Por eso, cuando se opera con stablecoins, conviene
fijarse en el emisor, no solo en el "ticker". Dos tokens pueden decir ambos
"un dólar" y estar emitidos bajo marcos distintos, con protecciones y
estándares distintos.

## Para qué sirven, en la práctica, desde Chile

Cuatro casos aparecen constantemente en la mesa.

**Cambio de divisas de CLP a dólar sin abrir cuenta en el exterior.** Un
chileno que quiere tener parte de sus ahorros en dólares no siempre puede o
quiere abrir una cuenta bancaria en Estados Unidos. Convertir pesos a dólar
digital le da esa exposición al dólar sin ese trámite, y puede convertir de
vuelta a pesos cuando lo necesite.

**Pagos internacionales rápidos.** Una empresa chilena que paga a
proveedores, freelancers o servicios en el exterior puede hacerlo en minutos
y a cualquier hora, sin depender de la cadena de bancos corresponsales ni de
sus horarios de operación. La contraparte tiene que aceptar dólar digital,
por supuesto.

**Recepción de pagos desde el exterior.** Un exportador, un consultor o un
profesional que factura afuera puede recibir en dólar digital y convertirlo a
pesos cuando el precio del mercado le convenga, en vez de estar amarrado al
día en que llegue una transferencia bancaria internacional.

**Tesorería en dólares.** Empresas que quieren mantener parte de su caja en
dólares como cobertura ante la volatilidad del peso pueden hacerlo en dólar
digital, sin abrir cuenta en el extranjero y sin los costos operativos de
mantenerla.

En los cuatro casos la stablecoin es el vehículo. El servicio que ofrece
DLPay es la conversión entre pesos chilenos y ese vehículo.

## Los riesgos que conviene tener claros

Ninguna herramienta financiera es libre de riesgo. Con las stablecoins, tres
son los importantes.

**Riesgo de contraparte del emisor.** Una stablecoin vale lo que respalda su
emisor. Si el emisor tiene problemas financieros, regulatorios o de reservas,
el token puede perder paridad. En marzo de 2023 USDC se separó brevemente del
dólar cuando quebró Silicon Valley Bank y Circle mantenía parte de sus
reservas allí. Recuperó la paridad en pocos días, cuando el gobierno
estadounidense garantizó los depósitos. Es el ejemplo canónico del riesgo, y
también un ejemplo de resiliencia del modelo cuando el marco regulatorio
responde.

**Riesgo regulatorio.** Cada jurisdicción está definiendo sus reglas para
stablecoins. Cambios normativos pueden restringir usos, forzar cambios en
emisores o redefinir qué instrumentos pueden operar en cada país. Circle
recibió mucha atención regulatoria en Estados Unidos antes de su IPO; Tether
opera bajo un marco distinto en El Salvador y en las Islas Vírgenes
Británicas. Cambios de esas reglas mueven el mapa completo.

**Riesgo operativo del usuario.** Las operaciones con stablecoins son
irreversibles una vez ejecutadas. Un error en la dirección de destino no
tiene "chargeback" ni forma de revertirlo con soporte. Por eso en DLPay
confirmamos cada paso con el cliente antes de ejecutar cualquier
transferencia.

Ninguno de estos riesgos es único de las stablecoins. Todos tienen
equivalentes en el sistema financiero tradicional. Lo importante es tenerlos
presentes.

## Qué hacemos en la mesa

DLPay opera con USDT como stablecoin principal, y con USDC como alternativa
cuando el mercado lo pide por temas de liquidez o de red. Nuestro servicio es
el cambio de divisas entre pesos chilenos y dólar digital: recibimos tu
transferencia en pesos, la verificamos en nuestra cuenta bancaria, y
entregamos el dólar digital en la billetera que nos indiques. El precio de la
web es referencial. El precio final lo confirma un ejecutivo antes de cerrar
cada operación, porque el mercado se mueve.

> El precio de referencia no es una promesa de ejecución. Lo confirma una persona antes de cerrar la operación.

No emitimos stablecoins. Cuando nos pides que te lo enviemos, el dólar digital
va a la billetera que nos indiques, y desde ahí lo que hagas con él es tu
decisión. Somos la mesa que cambia una divisa por otra.

Para entender el recorrido completo de una operación, desde tu transferencia
hasta el dólar digital en tu billetera, está la página de
[cómo funciona una operación](/como-funciona/). Para ver el precio
referencial en este mismo momento, el [cotizador](/#cotizador) está siempre
disponible.

## Fuentes

- Tether: [emisor de USDT](https://tether.to)
- Circle: [emisor de USDC](https://www.circle.com)
- Ripple: [emisor de RLUSD](https://ripple.com/products/stablecoin/)
- PayPal y Paxos: [emisor de PYUSD](https://www.paypal.com/pyusd)
- First Digital: [emisor de FDUSD](https://firstdigitallabs.com)
- Sky (antes MakerDAO): [emisor de DAI y USDS](https://sky.money)
- CoinGecko: [datos de market cap agregados del sector](https://www.coingecko.com/en/categories/stablecoins)

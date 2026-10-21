# ADR-0013 — De «dólar digital» a «envío de divisas»: el sitio cambia de enfoque, el límite no

- **Estado:** Aceptada — 2026-10-21
- **Decide:** Sebastián Villanueva
- **Ámbito:** el mensaje comercial de todo el sitio, el cotizador del héroe y el contenido tipado
  de `src/content/`. **No** el límite del servicio, que se queda donde está.
- **Referencia:** §1 de `CLAUDE.md` («Dónde termina el servicio», regla dura de contenido y
  «Dos modos de operar») · §6 (el cotizador) · D7 · D20 · ADR-0012

## Contexto

El 2026-10-21 Sebastián informa un servicio nuevo: **envío de divisas**. El cliente dice cuánto
quiere enviar y a dónde —«x cantidad a Europa»—, y DLPay hace por detrás la conversión de CLP a la
divisa de destino apoyándose en la divisa digital. No sólo euro: varias divisas.

**Todavía no opera.** Es el plan. El sitio está en Staging con `noindex`, así que se puede construir
sin publicar nada, pero nada de esto puede afirmarse en presente hasta que exista.

Hasta hoy el sitio se construyó alrededor de una sola afirmación: *cambiamos divisas y entregamos
dólar digital en tu billetera; desde ahí decides tú*. Esa frase está en **295 menciones repartidas
en 40 archivos**, y no como adorno: vive en el contenido tipado (`home.ts`, `process.ts`,
`business.ts`, `trust.ts`, `general.ts`, `glossary.ts`) y, sobre todo, en `src/content/scope.ts`,
que es la regla dura de §1 convertida en dato para que `/como-funciona`, `/empresas` y `/confianza`
no puedan decir cosas distintas sobre hasta dónde llega el servicio.

## Decisión

### 1. El mensaje pasa de una divisa a varias

El sitio deja de prometer **dólar**. Promete **la divisa que el cliente necesite**, entregada en
forma digital. El dólar pasa a ser una de las divisas y deja de ser el producto.

### 2. El límite del servicio NO se mueve — y esto es lo más importante de este ADR

La regla dura de `CLAUDE.md` §1 sigue vigente **palabra por palabra**:

> Prohibido afirmar o sugerir: que DLPay deposita en una cuenta bancaria en el extranjero, que
> realiza una transferencia bancaria internacional, o que el destinatario recibe moneda local.

Lo decidido es que **se sigue entregando en una billetera**; lo que cambia es la divisa que llega.
Así que `scope.ts` conserva su estructura —la bisagra, las tres opciones, la tercera como límite— y
sólo cambia de qué moneda habla.

**Se escribe acá porque el mensaje que originó este ADR sonaba a lo contrario.** «Que el dinero que
pidieron enviar llegue al destino» describe un servicio que termina en manos de quien recibe. Si
algún día el servicio es ése, **este ADR no alcanza**: hace falta otro que derogue la regla de §1, y
con firma de Compliance, porque entregar moneda local en destino es una actividad distinta de
cambiar divisas y cambia qué significan D20 y el proceso de inscripción en la CMF.

### 3. El sitio no dice «remesa»

**Decidido por Sebastián el 2026-10-21: el enfoque es el de cambio de divisas.** El público
entiende por remesa que el destinatario cobra, y mientras la entrega sea en billetera esa palabra
promete de más por omisión. El sitio dice **«cambio de divisas»** y **«envío de divisas»**, que es
lo que hace y es exacto.

No es una palabra prohibida para siempre: es una palabra que este servicio, tal como está definido
hoy, no describe. El día que el destinatario cobre en su moneda, la palabra será correcta — y hará
falta el ADR que derogue la regla de §1, que es el punto 2 de arriba.

### 4. Sale el mecanismo, se queda el qué

Son dos cosas distintas y la decisión las separa:

| | qué es | qué pasa |
|---|---|---|
| **USDT, stablecoin, redes, cadena de bloques** | el mecanismo | **sale** del mensaje comercial. Sobrevive en el blog y en el glosario, que son contenido educativo |
| **«divisa digital», «billetera»** | qué recibe el cliente | **se queda**. Sin esto el sitio no dice dónde termina, y el límite de §1 deja de ser comprobable |

Esto no es una concesión nueva: §1 ya decía que el dólar digital «es la infraestructura, no el
mensaje comercial». La decisión lleva esa regla hasta el final.

### 5. El cotizador pasa a «cuánto llega a destino»

Hoy es CLP ↔ USD con una tasa única. Pasa a tener **divisa de destino**, y la pregunta que responde
deja de ser «cuántos dólares recibo» para ser «cuánto llega». Es un cambio de la pieza central del
sitio y por tanto de `docs/design-system/cotizador-spec.md`.

Se construye con `ConfigPriceSource` y **valores de muestra**, como manda §0.3. No entra una fuente
de pricing real ni una fórmula de spread.

## Consecuencias

- **D7 se amplía.** Deja de ser «una tasa» y pasa a ser **una tasa por divisa**. Hoy
  `PUBLIC_QUOTE_SAMPLE_RATE` es un número del que cuelgan todas las cifras de muestra del sitio;
  con varias divisas son varios, y el día que haya fuente real hay que tenerla para cada una.
- **D20 cambia de forma, no de estado.** Los T&C publicados ya no coincidían con el servicio;
  ahora tampoco coinciden con éste, y de otra manera. Sigue bloqueando.
- **Los ocho enlaces al autoservicio.** El sitio lleva ocho veces a la plataforma con «Crear
  cuenta» e «Iniciar sesión», y esa plataforma opera con dólar digital. Si el mensaje deja de
  nombrarlo, esos enlaces llevan a un producto que la web no describe. `PENDIENTE DE DECISIÓN`.
- **Dos guías en borrador quedan descolocadas.** Las de stablecoins y activos tokenizados siguen
  siendo correctas y siguen sin publicarse; lo que cambia es su lugar en el mapa, de «explican
  nuestro producto» a «explican el mecanismo».
- **El glosario se parte en dos.** Lo que explica el mecanismo se queda como glosario; lo que
  nombraba el producto cambia de entrada.

## Las divisas, y quién atiende

**Catorce destinos, doce divisas** *(Sebastián, 2026-10-21; la lista es abierta — «etc.»)*:

| destino | divisa | destino | divisa |
|---|---|---|---|
| Estados Unidos | USD | Brasil | BRL |
| **Ecuador** | **USD** — dolarizado, no añade moneda | Uruguay | UYU |
| Europa | EUR | Paraguay | PYG |
| China | CNY | Bolivia | BOB |
| Japón | JPY | Colombia | COP |
| Argentina | ARS | Perú | PEN |
| Venezuela | VES | | |

**Quién atiende: un ejecutivo, siempre.** No hay un flujo en el que un tercero en destino reciba un
aviso o cobre por su cuenta; la operación la recibe DLPay y la cierra una persona. Es el **modo
asistido** que §1 ya describe, y por eso el sitio no estrena ningún recorrido nuevo: estrena
destinos.

## `PENDIENTE DE DECISIÓN` — qué llega exactamente, por divisa

El modelo dice «esa divisa, en forma digital, en la billetera que indiques». **Eso es cierto del
dólar, bastante menos del euro, y probablemente no de las otras diez**: no existe una versión
digital líquida de yuan, yen, bolívar, peso colombiano, sol, peso argentino, real, guaraní,
boliviano ni peso uruguayo que se pueda entregar en una billetera.

Así que, para la mayor parte de la lista, una de dos:

1. **Lo que llega sigue siendo dólar digital**, y lo que cambia es **en qué moneda se cotiza** —el
   cliente ve «cuánto llega» en su moneda de destino y recibe el equivalente en dólar digital—. Este
   ADR alcanza, y el sitio tiene que decirlo sin rodeos.
2. **El servicio paga en moneda local en destino.** Entonces estamos en la regla dura de §1 otra
   vez: hace falta un ADR que la derogue y firma de Compliance, porque es otra actividad.

**Hasta que se cierre, el sitio no promete una divisa que no sabemos entregar.** El selector sólo
ofrece las divisas que tengan tasa configurada, que es el mecanismo del punto siguiente.

## Las cifras: una tasa de muestra por divisa, y referencial

*Decidido por Sebastián el 2026-10-21.* Cada divisa tiene su tasa de muestra, y el sitio la publica
con la misma reserva que ya publica la del dólar: **es referencial y la confirma el ejecutivo.** Eso
no es una concesión nueva — `general.ts` ya publica «el que se aplica es el que tu ejecutivo te
confirma, no el que la web mostraba cuando cotizaste», y la banda de los 12 minutos de `/precio` lo
sostiene.

**El mecanismo es el de D21**, que el proyecto ya usa y que funcionó: la maquinaria se construye
entera y cada divisa **se enciende definiendo su variable de entorno**, sin tocar código. Una divisa
sin tasa configurada **no aparece en el selector**. Así no hay forma de publicar un número inventado,
que es lo que §3 y §7 prohíben.

**D7 se amplía con esto y sube de importancia.** Deja de ser «una tasa» y pasa a ser una por divisa,
y algunas de esta lista —bolívar y peso argentino sobre todo— se mueven lo bastante rápido como para
que una cifra de muestra envejezca en días. La etiqueta «referencial» protege de que se lea como
oferta; no protege de que sea inverosímil.

## Lo que este ADR NO concede

- **No mueve el límite del servicio.** Punto 2.
- **No autoriza la palabra «remesa».** Punto 3.
- **No publica ninguna cifra nueva.** Las tasas de muestra las fija Sebastián, una por una, y
  mientras no estén esa divisa no existe para el sitio.
- **No toca el modo autoservicio** ni los ocho enlaces a la plataforma, que siguen
  `PENDIENTE DE DECISIÓN`.

---
title: 'Antes de recibir: tu billetera, la red y la dirección.'
description: 'Los tres datos que tienen que coincidir para recibir dólar digital sin errores, cómo se reconoce cada uno y qué revisar antes de confirmar.'
pubDate: 2026-10-13
category: 'Guía'
# BORRADOR. REQUIERE VALIDACIÓN DE COMPLIANCE — el artículo entero y el
# resumen. Se publica escribiendo `estado: publicado` después de la firma.
#
# PENDIENTE DE DECISIÓN — en qué redes entrega DLPay (dato de operaciones).
# El ejemplo de la figura usa Tron porque es una de las tres redes que el
# artículo de stablecoins ya nombra; si DLPay no entrega por Tron, el ejemplo
# cambia de red antes de publicar.
estado: borrador
ruta:
  paso: 3
  titulo: 'Tu billetera, la red y la dirección'
resumen:
  - 'Para recibir dólar digital hacen falta tres datos que coincidan: la moneda, la red y la dirección de tu billetera.'
  - 'La misma moneda circula por varias redes, y lo que se manda por una red queda en esa red.'
  - 'Un traspaso hecho no se puede revertir: por eso la dirección se copia y se pega, y se revisa antes de confirmar.'
# El pictograma y su razonamiento están en `PortadaFigura.astro`.
portada:
  tipo: figura
  figura: billetera
---

<!--
Guía de la ruta «Tu primera operación», paso 3. Borrador de Cowork del
2026-10-13 (entrega `aprende-`). REQUIERE VALIDACIÓN DE COMPLIANCE.

El título no lleva «dólar digital» a propósito: CLAUDE.md §1 pide que el
dólar digital no protagonice un titular. La bajada sí lo nombra.

Describe el modo asistido, con ejecutivo, y lo dice. Ver CLAUDE.md §1, «Dos
modos de operar».

REGISTRO DE VERIFICACIÓN, hecho el 2026-10-13 contra las fuentes primarias,
leídas en un navegador:

  1. Que un USDT en una red equivale a un USDT en otra, y la lista de redes:
     Tether, «Supported Protocols and Integration Guidelines».
  2. Que USDT se emite con el estándar de Ethereum también en Avalanche,
     Celo y Kaia, entre otras: la misma página, «ERC20 Token via Ethereum,
     Avalanche, Cosmos, Celo and Kaia Blockchain».
  3. Direcciones de Ethereum, 42 caracteres con el prefijo 0x: ethereum.org,
     «Cuentas de Ethereum».
  4. Direcciones de Tron, 34 caracteres que empiezan con T, la forma que se
     ve en billeteras y exploradores: documentación de TRON, «Accounts and
     keys».

Frases ya publicadas y firmadas que se reutilizan:
  · la moneda y la alternativa, «Qué hacemos en la mesa» del artículo de
    stablecoins;
  · la red, definición del glosario de `/preguntas`;
  · la irreversibilidad y la confirmación de cada paso, «Riesgo operativo
    del usuario» del artículo de stablecoins;
  · «cuando nos pides que te lo enviemos…», el mismo artículo;
  · el costo de red, `/precio`.

Regla de estilo aplicada: cero rayas (em-dash o en-dash).
-->

Para recibir dólar digital no hace falta saber de tecnología, pero sí tener
claros tres datos y revisarlos antes de confirmar. Un error en cualquiera de
los tres no se corrige después.

Esta guía explica cuáles son, cómo se reconoce cada uno y qué mirar antes de
dar el visto bueno. Describe la operación con un ejecutivo.

## Los tres datos

Un traspaso de dólar digital necesita tres datos, y los tres tienen que
referirse a lo mismo:

- **La moneda.** DLPay opera con USDT como stablecoin principal, y con USDC
  como alternativa cuando el mercado lo pide por temas de liquidez o de red.
- **La red.** El canal por el que viaja el dólar digital. Hay varias, y la
  que se usa cambia el tiempo y el costo del traspaso, no el valor de lo que
  recibes.
- **La dirección.** El identificador de tu billetera en esa red: una cadena
  larga de letras y números.

<figure class="g-datos" aria-labelledby="g-datos-t"><figcaption id="g-datos-t" class="g-rot">Los tres datos, como los ves al recibir</figcaption><dl><div><dt>Moneda</dt><dd>USDT</dd></div><div><dt>Red</dt><dd>Tron</dd></div><div><dt>Dirección</dt><dd class="g-dir"><span class="g-dir-marca">TQ9x</span><span class="g-dir-medio" aria-hidden="true">······</span><span class="sr-only">, caracteres omitidos, </span><span class="g-dir-marca">4fZp</span></dd></div></dl><p class="g-nota">Un ejemplo. La dirección va cortada a propósito y no es de nadie: lo que se marca es lo que conviene comparar.</p></figure>

## La misma moneda, varias redes

USDT circula en más de una red: Ethereum, Tron y Solana, entre otras. Tether,
su emisor, lo dice así: un USDT en una red vale lo mismo que un USDT en otra.

Lo que no se puede es pasarlo de una red a otra con un traspaso común. Cada
red lleva su propio registro, y lo que se manda por una red queda en esa red.
Si tu billetera no está mirando la red por la que llegó, no lo vas a ver.

Por eso la red no es un detalle técnico que se deja para después. Antes de
dar tu dirección, mira en tu billetera en qué red la estás generando.

## Cómo se reconoce una dirección

Las direcciones de cada red tienen su forma:

- En **Tron**, 34 caracteres que empiezan con T.
- En **Ethereum**, 42 caracteres que empiezan con 0x.

La segunda tiene una trampa. Varias redes usan el mismo formato que Ethereum:
Tether emite USDT con ese estándar también en Avalanche, Celo y Kaia, entre
otras. Una dirección que empieza con 0x no te dice por sí sola de qué red es.
**La red la dice tu billetera, no la dirección.**

## Qué revisar antes de confirmar

1. **Copia y pega la dirección; nunca la escribas a mano.** Un carácter
   cambiado es otra dirección.
2. **Compara el principio y el final.** Después de pegarla, revisa que los
   primeros y los últimos cuatro caracteres sean los de tu billetera. Existen
   programas maliciosos que cambian lo que copiaste por otra dirección.
3. **Confirma la red por su nombre.** La que eliges en tu billetera tiene que
   ser la misma que confirmas con tu ejecutivo.
4. **Si tu billetera es la cuenta de un exchange, mira si pide un dato
   extra.** En algunas redes, un exchange pide además una etiqueta o memo
   para saber que el depósito es tuyo. Si lo pide y falta, el depósito puede
   no llegar a tu cuenta.
5. **Tu frase de recuperación no se comparte.** Para recibir sólo hace falta
   la dirección. La frase de recuperación, las palabras que permiten
   recuperar tu billetera, no se le da a nadie: quien la tiene controla la
   billetera.

## Por qué tanto cuidado

Las operaciones con stablecoins son irreversibles una vez ejecutadas. Un
error en la dirección de destino no tiene "chargeback" ni forma de revertirlo
con soporte. Por eso en DLPay confirmamos cada paso con el cliente antes de
ejecutar cualquier transferencia.

## Qué hacemos en la mesa

Cuando operas con un ejecutivo, le indicas la red y la dirección de tu
billetera, y la confirma contigo antes de enviar. Cuando nos pides que te lo
enviemos, el dólar digital va a la billetera que nos indiques, y desde ahí lo
que hagas con él es tu decisión. El costo de red del traspaso lo asumimos
nosotros.

> El precio de referencia no es una promesa de ejecución. Lo confirma una persona antes de cerrar la operación.

Para entender el recorrido completo de una operación, desde tu transferencia
hasta el dólar digital en tu billetera, está la página de
[cómo funciona una operación](/como-funciona/). Para ver el precio
referencial en este mismo momento, el [cotizador](/#cotizador) está siempre
disponible.

## Fuentes

- Tether: [redes en las que circula USDT](https://tether.to/en/supported-protocols/)
- ethereum.org: [cuentas y direcciones de Ethereum](https://ethereum.org/es/developers/docs/accounts/)
- TRON: [cuentas y direcciones](https://developers.tron.network/docs/account)

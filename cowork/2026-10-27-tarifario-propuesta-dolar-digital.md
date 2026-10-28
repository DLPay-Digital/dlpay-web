# Propuesta · el dólar digital como destino del cotizador

**Estado: propuesta, sin firma. No rige.** Cowork, entrega `tarifario-`, 2026-10-27.

Sebastián pidió el 2026-10-27 que el corredor «USDT / USDC» de su tarifario entre como destino.
Choca con dos reglas vigentes, así que esta entrega **lo deja preparado y no lo ofrece**. Esta
propuesta dice qué cambia, qué hace falta para encenderlo y qué preguntas quedan abiertas.

Va a `cowork/2026-10-27-tarifario-propuesta-dolar-digital.md`. Si se aprueba, se convierte en un
ADR (el siguiente número libre) y en la enmienda de `CLAUDE.md` §1 que se propone abajo.

---

## Qué pidió Sebastián

La fila «USDT / USDC (stablecoin)» de `tarifario_remesas_3_niveles.xlsx`:

| | |
|---|---|
| Costo de envío | $0 |
| Comisión de cambio | 0,80 % · 0,70 % · 0,60 %, en los tres tramos de siempre |

En `src/lib/pricing/tarifario.ts` está como `TARIFA_DOLAR_DIGITAL_EN_ESPERA`. Ningún destino la
usa, y `tests/tarifario.test.ts` lo comprueba.

## Con qué choca

1. **`CLAUDE.md` §1: «El dólar digital (USDT) es la infraestructura, no el mensaje comercial.»**
   La tabla de esa sección dice que «USDT, stablecoin, redes, cadena de bloques» **salen del
   mensaje comercial** y viven en el blog y el glosario. Un destino «USDT» en el cotizador es el
   mensaje comercial más visible del sitio.
2. **ADR-0014: el dinero llega a destino en la moneda local.** El sitio entero lo afirma, y el
   glosario dice de la billetera que «para enviar con nosotros no necesitas una». Un destino que
   entrega en una billetera es el modelo que ADR-0014 dejó atrás, ahora como opción.
3. **Compliance.** Entregar un activo digital en una billetera no es la misma actividad que pagar
   moneda local a un tercero, y `CLAUDE.md` §1 ya advierte que esa casilla regulatoria es la que
   hay que mirar. Necesita firma antes de cualquier texto.

## La enmienda que se propone

En `CLAUDE.md` §1, después del párrafo «**El dólar digital (USDT) es la infraestructura, no el
mensaje comercial.**…»:

```markdown
**Con una excepción, desde [fecha de la firma]: el dólar digital como destino.** El cotizador
ofrece, entre los destinos, recibir en dólar digital (USDT o USDC) en una billetera propia. Es una
opción más y no un titular: no aparece en la portada, en los titulares ni en la
descripción del servicio, que siguen diciendo que el dinero llega en la moneda del destino. Su
tarifa es la del tarifario. [Firma de Compliance, fecha.]
```

Y en ADR-0014, una línea al final: «Enmendado por ADR-00NN: el dólar digital entra como destino
opcional».

## Lo que hace falta para encenderlo

- [ ] Firma de Compliance, y la enmienda de arriba.
- [ ] **La divisa** en `currencies.ts`: `USDT`, «dólar digital», «dólares digitales», dos
      decimales, con `PUBLIC_QUOTE_RATE_USDT` y la muestra del dólar.
- [ ] **El destino** en `TARIFAS`, con `TARIFA_DOLAR_DIGITAL_EN_ESPERA` y `enSuMoneda: true`.
- [ ] **Su marca en el selector.** No es un país y no tiene bandera: necesita un ícono (el de
      billetera de las guías es la ficha del dólar digital, DS §6.1). `banderas.test.ts` falla si
      un destino queda sin bandera, así que hay que decidir cómo se exime.
- [ ] **La nota del riel**: «Llega a tu billetera, en dólar digital. El plazo te lo confirma tu
      ejecutivo.» Requiere validación.
- [ ] **El mensaje de WhatsApp**: «enviar CLP … a mi billetera, en dólar digital».
- [ ] Quitar el test «el dólar digital no es un destino ni una divisa» y poner los suyos.

## Preguntas abiertas

1. **¿USDT, USDC o los dos?** Si son los dos, ¿son dos destinos o uno con la elección en el chat?
2. **¿La billetera es siempre del cliente?** Si puede ser de un tercero, la regla de «cuentas
   del titular» de la verificación tiene que decir qué pasa.
3. **La red.** El sitio no nombra redes (§1). El ejecutivo la pregunta en el chat, y eso hay que
   escribirlo en la FAQ.
4. **El glosario.** «Billetera» dice hoy que no la necesitas para enviar con nosotros; con este
   destino, la necesitas para este destino.

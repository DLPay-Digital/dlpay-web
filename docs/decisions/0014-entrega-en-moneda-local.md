# ADR-0014 — El servicio llega hasta la moneda local del destino

- **Estado:** Aceptada — 2026-10-22
- **Decide:** Sebastián Villanueva
- **Ámbito:** dónde termina el servicio. Afecta a `CLAUDE.md` §1, a `src/content/scope.ts` y a
  las cuatro páginas que declaran el límite: `/como-funciona`, `/empresas`, `/confianza` y la Home.
- **Supera:** el **punto 2 de ADR-0013** —«el límite del servicio NO se mueve»—, escrito un día
  antes. ADR-0013 sigue vigente en todo lo demás: las doce divisas, el cotizador multidivisa y la
  salida del mecanismo del mensaje comercial.
- **Referencia:** `CLAUDE.md` §1 («Dónde termina el servicio», regla dura de contenido desde el
  2026-09-04) · D16 · D20 · §3

## Contexto

El 2026-10-21 Sebastián describió el servicio nuevo y respondió que la entrega seguía siendo **en
una billetera**, sólo que en otra divisa. ADR-0013 se escribió sobre esa respuesta y dejó la regla
dura intacta, con un `PENDIENTE DE DECISIÓN` abierto: *qué llega exactamente, por divisa*, porque
de las doce divisas sólo el dólar tiene una versión digital líquida que se pueda entregar en una
billetera.

**El 2026-10-22 Sebastián cerró ese pendiente, y lo cerró del otro lado:** lo que llega es **la
moneda local del destino al que el cliente quiere enviar**.

Eso es la segunda de las dos salidas que ADR-0013 nombró, y la que ese mismo ADR dijo que no se
podía tomar sin derogar la regla. Este documento la deroga.

## La regla que se deroga, entera y citada

Desde el 2026-09-04, `CLAUDE.md` §1 decía:

> **Prohibido afirmar o sugerir:** que DLPay deposita en una cuenta bancaria en el extranjero, que
> realiza una transferencia bancaria internacional, o que el destinatario recibe moneda local. La
> conversión a moneda fiat en destino es un proceso distinto, con otros servicios, que DLPay no
> presta hoy.

**La última frase es la que dejó de ser cierta**, y con ella cae la prohibición entera: si DLPay
presta ese proceso, prohibir que el sitio lo cuente sería ocultar el servicio.

**Se queda en el historial y no se borra**, por la convención de este directorio y porque explica
cuatro meses de redacción del sitio: media docena de frases están escritas como están para no
rozarla.

## Decisión

### 1. El servicio llega hasta la moneda local del destino

El flujo pasa a ser: **CLP del cliente → DLPay convierte → el destinatario recibe en la moneda
local de su país.** Lo que ocurre por detrás —la divisa digital como riel— sigue siendo
infraestructura y no mensaje, como `CLAUDE.md` §1 manda desde el principio.

### 2. Lo que el sitio ya puede decir, y no podía

- que el dinero **llega a destino en la moneda de destino**;
- que DLPay **se ocupa del recorrido completo**, no de un tramo;
- que el cliente **no necesita billetera, ni saber qué es**.

### 3. Lo que el sitio sigue sin poder decir

- **Plazos de la entrega final.** `REQUIERE VALIDACIÓN DE COMPLIANCE`. El «~5 min» del paso 06
  medía **nuestra** operación, y ahora hay un tramo más que no lo sabemos. La regla de D17 se
  mantiene con otra forma: **la rapidez no se predica de la recepción final mientras nadie dé un
  plazo que se pueda respaldar.**
- **El canal de entrega.** `PENDIENTE DE DECISIÓN — ¿cómo recibe el destinatario?` Cuenta
  bancaria, retiro en efectivo, billetera local: cambia según el país y nadie lo ha dicho. Hasta
  que se diga, **el sitio nombra el resultado y no el medio**: «llega en la moneda de su país», no
  «se deposita en su cuenta».
- **Nada regulatorio.** Sigue valiendo entero lo de §6: no se afirma estar regulado ni autorizado
  por la CMF. Y esta decisión **sube la tensión de esa frase**, no la baja; ver abajo.

### 4. «Remesa» sigue sin decirse, y ahora por una razón distinta

ADR-0013 no usaba la palabra porque el destinatario no cobraba. **Ahora cobra, así que la palabra
sería exacta** — y Sebastián mantuvo el 2026-10-21 el enfoque de **cambio de divisas**.

Queda anotado que la razón cambió: ya no es que la palabra prometa de más, es una decisión de
posicionamiento. **Si algún día se quiere usar, ya no hay nada que lo impida en el contenido**, y
lo que habrá que mirar es lo de la sección siguiente.

## Lo que esto le cuesta al proyecto, dicho sin rodeos

**Es un claim regulatorio, no un cambio de copy.** Cambiar divisas y entregar en una billetera, y
pagar moneda local a un tercero en otro país, no son la misma actividad ante un regulador. El sitio
publica hoy que **el proceso de inscripción en la CMF está en curso**, y ese trámite se describió
para el servicio anterior.

Por eso:

1. **Todo lo que este ADR habilita sale con `REQUIERE VALIDACIÓN DE COMPLIANCE`** hasta que alguien
   lo firme. No es una formalidad: es el marcador que §3 reserva para claims de este tipo.
2. **D20 deja de ser un desajuste y pasa a ser otra cosa.** Decía que los T&C hablaban de custodia
   y liquidaciones internacionales mientras el servicio era cambio de divisas — es decir, que el
   contrato **decía de más**. Ahora el servicio se parece bastante más a lo que ese contrato
   declara, y el problema se invierte: hay que comprobar si **alcanza**.
3. **D16 se reabre.** Se cerró el 2026-09-04 con «DLPay entrega dólar digital en la billetera; no
   deposita en cuentas bancarias en el extranjero». Las dos mitades dejaron de ser ciertas.

**Y queda dicho lo que no se midió:** este ADR no evalúa si el servicio puede prestarse, ni con qué
licencias, ni en qué países. No es una pregunta de ingeniería y no se responde acá.

## Consecuencias en el código

| Qué | Cómo queda |
|---|---|
| `src/content/scope.ts` | La bisagra se corre: ya no termina en la billetera. Las tres salidas desde la billetera **pierden su sujeto** |
| `EjeDeAlcance`, `AlcanceEmpresa` | Dibujaban la billetera y sus tres salidas, con la frontera punteada antes de «convertir a moneda local». **Esa frontera es justo lo que se cruzó** |
| `TelefonoAvisos` | El tercer aviso es el de la billetera del cliente, y ya no es el final del recorrido |
| Glosario | «Billetera» se define como «donde termina nuestra operación». Deja de serlo |
| `/terminos` | «El servicio es el cambio de divisas. DLPay no deposita en cuentas bancarias en el extranjero» |
| El paso 06 de `process.ts` | Y con él su gemelo de `scope.ts`, que es el mismo texto a propósito |

Nada de eso se toca en este commit: el registro va primero, y el contenido detrás, para que cada
cambio se pueda leer contra la decisión que lo autoriza.

# Plataforma de remesas · alcance de la versión 1

- **Estado:** borrador para que Sebastián lo apruebe — 2026-11-17
- **Decide:** Sebastián Villanueva
- **Qué es:** lo que hace la primera versión de la plataforma propia, pantalla por pantalla, **antes
  de escribir una línea de código**. La arquitectura (dónde corre, de qué se compone, cuánto
  cuesta) va en un ADR aparte, después de aprobar esto.
- **Dónde vivirá:** en un repositorio propio, `DLPay-Digital/dlpay-plataforma`. Se escribe acá
  mientras ese repositorio no exista, y se muda entero el día que exista.

---

## 1. De dónde sale esta decisión

El 2026-11-17 Sebastián decidió **construir una plataforma propia para el sitio de remesas**, con
**registro y validación de identidad propios**, en vez de apoyarse en la cuenta del cliente en
Guita.

Se consideró primero lo contrario: que el cliente se registrara y validara en Guita y que esta
plataforma lo reconociera con un «Iniciar sesión con Guita». Se descartó porque son **dos
empresas distintas** (ver `CLAUDE.md` §0.1, «Dos sitios, dos empresas»): pasar la identidad de un
cliente de una a otra pide su consentimiento, un acuerdo entre las dos sociedades, y confirmar que
la empresa de remesas puede apoyarse en la validación de otra ante la UAF. Además dependía de que
Guita habilitara un acceso que no sabemos si ofrece.

**Lo que no cambia:** mientras esto se construye, «Crear cuenta» e «Iniciar sesión» del sitio
siguen llevando a Guita (D30).

## 2. Lo que la versión 1 tiene que demostrar

**Que un cliente puede hacer de punta a punta, sin WhatsApp, lo que hoy hace con un ejecutivo**, y
que el equipo puede atenderlo desde un panel:

1. registrarse y validar su identidad;
2. cotizar con el mismo tarifario del sitio;
3. crear un envío y ver a qué cuenta transferir;
4. avisar que transfirió;
5. seguir el envío hasta que llega.

Y del lado del equipo: aprobar validaciones, confirmar precios y pagos, y mover cada envío de
estado.

**WhatsApp no desaparece.** El sitio dice que web y WhatsApp «son una sola conversación»
(principio UX de la Fase 2.5), y el cliente que prefiera el chat lo sigue teniendo.

## 3. Prototipo primero, con datos ficticios

La primera entrega es **un prototipo funcionando**, no una maqueta: se puede registrar, entrar y
operar de verdad. Pero:

| | en el prototipo | en la versión real |
|---|---|---|
| **Personas** | ficticias, creadas por el equipo | clientes |
| **Validación de identidad** | **simulada**: se sube cualquier imagen y el equipo aprueba a mano | un proveedor especializado (cédula, selfie, listas) — se elige con precios y el OK de Sebastián |
| **Documentos** | imágenes de prueba, borradas con cada reinicio | documentos reales, con su política de retención |
| **Dinero** | ninguno; «pagado» y «entregado» los marca el equipo | transferencias reales a la cuenta de la empresa |
| **Tasas** | las mismas del sitio (`tasas.json`) | las mismas, o la fuente que decida D7 |
| **Acceso** | privado: sólo el equipo | público |

**Por qué así:** la empresa de remesas todavía no está constituida y el Compliance está en pausa.
Guardar documentos de identidad reales antes de eso sería tener datos sensibles sin quién responda
por ellos (Principio 7).

## 4. Quién la usa

| Rol | Qué hace |
|---|---|
| **Cliente** | Persona natural en Chile que envía dinero al extranjero |
| **Ejecutivo** | Atiende operaciones: confirma precios, verifica pagos, marca envíos |
| **Cumplimiento** | Aprueba o rechaza validaciones de identidad. En el prototipo puede ser la misma persona que el ejecutivo; en la versión real conviene separarlos |
| **Administrador** | Da de alta a las personas del equipo |

**Fuera de la versión 1: empresas.** El sitio las atiende con un ejecutivo asignado y
condiciones por volumen, y su validación (KYB) es otra: la sociedad, sus representantes y sus
beneficiarios finales. Entra en una versión siguiente.

## 5. El recorrido del cliente

### 5.1 Registro y acceso

1. **Crea su cuenta** con correo y contraseña.
2. **Confirma su correo** con un enlace.
3. **Entra.** Si olvida la contraseña, la recupera por correo.

*Pendiente para el ADR:* contraseña, enlace mágico por correo o llaves de acceso (passkeys). La
recomendación inicial es contraseña con verificación en dos pasos opcional, por ser lo que el
cliente de una fintech chilena espera.

### 5.2 Validación de identidad (KYC)

Antes de su **primer envío**, no antes de cotizar. Es lo que el sitio ya dice: «si es tu primera
operación, antes te pedimos registro y verificación de identidad».

1. **Datos personales:** nombre completo, RUT, fecha de nacimiento, nacionalidad, dirección,
   ocupación y origen de los fondos.
2. **Cédula**, por los dos lados.
3. **Selfie.**
4. **Declaraciones:** que actúa por cuenta propia y si es persona expuesta políticamente (PEP).

Estados de la validación:

```
sin validar → en revisión → aprobada
                         ↘ rechazada (con motivo; puede reintentar)
                         ↘ falta información (vuelve al cliente)
```

**`REQUIERE VALIDACIÓN DE COMPLIANCE`** — qué datos se piden, en qué orden, y desde qué monto o
frecuencia se pide más (debida diligencia reforzada). La lista de arriba es la habitual de una
remesadora en Chile y es un punto de partida, no una definición.

### 5.3 Cotizar

**El mismo cotizador del sitio**: destino, monto, lo que llega y el detalle completo. Es la misma
aritmética (`tarifario.ts`) y las mismas tasas (`tasas.json`), compartidas y no copiadas, para que
el sitio y la plataforma no puedan dar dos cifras distintas.

**Como una remesa** *(Sebastián, 2026-11-17)*: el cliente elige cuánto manda en pesos y a qué
país, y **lo único que le importa es lo que llega**: «enviar 2 millones de pesos chilenos a Estados
Unidos y que lleguen en dólares». La cifra que manda en la pantalla es la que llega, como en el
cotizador del sitio desde el 2026-10-22.

### 5.4 Crear el envío

1. **Elige o crea el destinatario:** nombre, país y cómo recibe.
2. **Confirma la cotización.** Desde ahí corre la **ventana de 12 minutos** que el sitio promete:
   el precio queda fijo y el cliente tiene ese plazo para transferir.
3. **Ve los datos para transferir:** la cuenta de la empresa, el monto exacto y un código de
   referencia.

**`PENDIENTE DE DECISIÓN` — cómo recibe el destinatario (D16).** Los datos que se piden del
destinatario dependen de eso: una cuenta bancaria pide banco y número; el efectivo, un documento
de identidad; una billetera local, su número. Es la pregunta que más cambia esta pantalla, y sigue
abierta por país.

**Quién fija el precio final — decidido para la versión 1 el 2026-11-17: el ejecutivo (A).** En
palabras de Sebastián: el precio del dólar en la plataforma es **referencial**, porque sale de una
fuente que se actualiza una vez al día y el dólar se mueve durante el día; **ese movimiento lo
maneja DLPay**, y por eso entra el ejecutivo, para darle un precio al cliente y conversar con él.

**La B queda para planificar, no descartada:** un panel con el precio del dólar al momento y un
temporizador de 12 minutos para cerrar la operación sin esperar a nadie. **Tiene una condición
técnica:** «el precio al momento» no puede salir de la fuente de hoy, que da una tasa al día
(ADR-0019). Hace falta una fuente que se actualice durante el día —el plan Pro de la misma API da
una por hora por USD 10 al mes, y una de minutos cuesta más— o que el equipo publique su precio en
el panel varias veces al día. Se decide al planificarla.

Las dos formas, para referencia:

| | cómo | qué implica |
|---|---|---|
| **A. El ejecutivo confirma** | el cliente pide el envío y el ejecutivo lo confirma en el panel; la ventana de 12 minutos corre desde ahí | igual que hoy; el cliente espera a una persona |
| **B. La plataforma confirma** | la cotización de la plataforma es la final, con su ventana de 12 minutos | más rápido, y cambia lo que el sitio dice hoy en varias páginas: que el precio de la web es referencial y lo confirma un ejecutivo |

El prototipo construye la A. La B se diseña después, con su fuente de precio.

### 5.5 Avisar que transfirió

El cliente marca «Ya transferí» y sube el comprobante (opcional). **El envío no avanza hasta que el
equipo confirma que el dinero llegó**: es el paso que el sitio dice que «no se salta nunca».

### 5.6 Seguir el envío

Estados que ve el cliente:

```
esperando tu transferencia → verificando tu pago → en camino → entregado
            ↘ vencido (pasaron los 12 minutos sin transferir)
            ↘ cancelado
```

Avisos por correo en cada cambio. *Fuera de la versión 1:* avisos por WhatsApp o SMS.

**Sin plazos de entrega.** El sitio no promete cuánto tarda la entrega final (`CLAUDE.md` §1,
D17), así que la plataforma tampoco. Dice el estado, no una hora.

### 5.7 Su cuenta

Historial de envíos, sus destinatarios guardados, sus datos y su contraseña.

## 6. El panel del equipo

| Pantalla | Qué hace |
|---|---|
| **Validaciones** | Lista de pendientes; ver datos e imágenes; aprobar, rechazar con motivo o pedir más |
| **Envíos** | Todos, con filtros por estado; el detalle de cada uno, con su historial |
| **Confirmar pago** | Marcar que la transferencia llegó; si el monto no coincide, dejarlo anotado |
| **Marcar envío** | «En camino» y «entregado», con un comprobante o referencia del pago en destino |
| **Clientes** | Buscar por nombre, RUT o correo; ver sus validaciones y envíos |
| **Equipo** | Dar de alta y de baja a ejecutivos, con su rol |

**Todo lo que hace el equipo queda registrado**: quién aprobó una validación, quién confirmó un
pago, cuándo. Es lo primero que pide una auditoría, y agregarlo después es caro.

## 7. Seguridad desde el primer día

No es una etapa posterior (Principio 8). Aun con datos ficticios, el prototipo nace con:

- **Contraseñas guardadas como corresponde** (hash lento, nunca en texto) y límite de intentos.
- **Verificación en dos pasos obligatoria para el equipo**: el panel aprueba identidades y mueve
  dinero.
- **Cada cliente ve sólo lo suyo**, comprobado en el servidor y no en el navegador.
- **Los documentos no son públicos**: se ven con un enlace temporal, y sólo desde el panel.
- **Registro de auditoría** de las acciones del equipo (§6).
- **Sin secretos en el código** ni en el repositorio.

## 8. Lo que queda fuera de la versión 1

- Empresas y su validación (KYB).
- «Pasar a pesos» (recibir en Chile desde el extranjero): el cotizador del sitio lo tiene, y como
  operación es otro recorrido con otros controles. **Queda fuera** (Sebastián, 2026-11-17): la
  versión 1 es el cliente enviando sus pesos al destino que quiera.
- Pagos automáticos: la plataforma no mueve dinero; registra lo que el equipo hace.
- Conexión con bancos o proveedores de pago en destino.
- Aplicación móvil: la plataforma es web y funciona en el teléfono.
- Migrar clientes desde Guita.

## 9. Lo que Sebastián tiene que decidir

| # | Pregunta | Para cuándo |
|---|---|---|
| ~~1~~ | ~~¿Quién confirma el precio final?~~ **El ejecutivo**, en la versión 1; el panel con precio al momento y temporizador se planifica después (§5.4) | ✅ 2026-11-17 |
| ~~2~~ | ~~¿Entra «pasar a pesos»?~~ **No**: la versión 1 es enviar pesos al destino que el cliente elija (§8) | ✅ 2026-11-17 |
| 3 | **Cómo recibe el destinatario, por país** (D16, §5.4) | Antes de la versión real; el prototipo puede usar «cuenta bancaria» en todos |
| 4 | **¿Quién del equipo hará de cumplimiento?** (§4) | Antes de la versión real |
| 5 | **Los datos de la validación** (§5.2) | Con Compliance, cuando se reabra |

## 10. Lo que sigue a este documento

1. ~~**Sebastián lo aprueba**, con las respuestas 1 y 2 de §9.~~ Respondidas el 2026-11-17.
2. **Se crea el repositorio** `DLPay-Digital/dlpay-plataforma` (lo crea Sebastián) y este
   documento se muda ahí.
3. **ADR de arquitectura:** dónde corre, base de datos, archivos, correo, autenticación y costo
   mensual. Recomendación inicial: seguir en Cloudflare (Workers, D1 y R2), dentro del plan
   gratuito para el prototipo. **No se contrata nada que cueste dinero sin preguntar.**
4. **Prototipo**, por tramos que se puedan ver: primero registro y acceso, después cotizar y crear
   envíos, después el panel y la validación.

/**
 * Las preguntas GENERALES de `/preguntas`.
 *
 * ── Por qué existe este archivo, y no viven en `home.ts` ni en `business.ts` ─
 *
 * Las nueve preguntas del sitio están en esos dos archivos y **son de un solo
 * registro**: objeciones *previas a decidir*. Por eso viven donde se decide, la
 * Home y `/empresas`, y por eso las dos listas se parecen tanto que la portada
 * de `/preguntas` puede afirmar que «una persona y una empresa preguntan casi lo
 * mismo».
 *
 * Sebastián señaló el 2026-09-29 que, siendo así, importar esas nueve a
 * `/preguntas` convierte la página en un índice de las otras dos. Tenía razón.
 * Lo que ninguna página del sitio tenía es **el registro siguiente**: ya decidí,
 * cómo es esto en la práctica y qué pasa si algo se sale del guion.
 *
 * Eso es general por naturaleza: no cambia si eres persona o empresa. De ahí el
 * archivo, y de ahí que estas preguntas **no lleven `concern` ni lado**: los dos
 * campos existen para repartir por preocupación y por público, y acá no hay
 * público que repartir. `/preguntas` las rinde en su propia sección.
 *
 * ── Lo que falta, y está así a propósito ────────────────────────────────────
 *
 * Se revisaron cinco grupos de preguntas con Sebastián el 2026-09-29. Entran
 * **cuatro preguntas**: tres del grupo «qué pasa si algo se sale del guion» y
 * una del grupo «el dinero, antes y después». Lo que no entró, y por qué:
 *
 * **Dos preguntas necesitan un dato operativo** que no se ha dado y que no se
 * puede suponer:
 *
 * · **«¿Qué pasa si transfiero y no me llega nada?»** — a quién escribe, en
 *   cuánto se le responde, y qué se hace si el dinero salió de su banco y no
 *   llegó al nuestro.
 * · **El caso «ya transferí y quiero cancelar»**, que es la segunda mitad de la
 *   pregunta de cancelación de abajo: si se devuelven los pesos y con qué costo.
 *   La respuesta publicada cubre sólo el caso de no haber transferido, y **eso
 *   es deliberado**: una respuesta no puede insinuar una devolución que nadie ha
 *   confirmado.
 *
 * **Tres se descartaron por decisión de Sebastián**, y conviene que la ausencia
 * quede escrita para que nadie las proponga de vuelta creyendo que es un olvido:
 *
 * · **«¿Necesito una billetera? ¿Me ayudan a abrirla?»** — no ayudamos a
 *   abrirlas, no es el servicio, y la página se dirige a gente que ya sabe qué
 *   es una billetera. Decirlo sobraría.
 * · **«¿Me entregan un comprobante?», «¿tengo que declarar al SII?» y «¿emiten
 *   factura?»** — el registro del cambio queda en la plataforma, y **hoy no se
 *   emiten facturas**; sin factura, hablar de boletas no tiene sentido. El
 *   grupo entero se omite.
 *
 *   *Es «de momento», dicho por él: el proyecto evoluciona.* Así que esto NO es
 *   una regla permanente sino el estado a esta fecha, y el día que se emitan
 *   documentos las tres preguntas vuelven a tener sentido. Ojo entonces con la
 *   de la factura: **pasa por D9**, porque una factura la emite un RUT concreto
 *   y los T&C vigentes nombran una razón social distinta de la que usa el sitio.
 *
 * ── Los 12 minutos ─────────────────────────────────────────────────────────
 *
 * CONDICIÓN COMERCIAL — afirmada por DLPay (Sebastián, 2026-09-29). El plazo del
 * precio aceptado es de **12 minutos como máximo**, y dentro de ese plazo la
 * cotización está cerrada: no se renegocia. Se puede pedir otra cotización
 * aparte, pero no cambia la que está en curso.
 *
 * La misma cifra gobierna la banda «El precio que aceptas» de `/precio`, que se
 * rehízo el mismo día porque afirmaba lo contrario: su figura decía que la línea
 * del precio **no termina**. Si el plazo cambia, cambian los dos sitios.
 */
export interface GeneralItem {
  q: string;
  a: string;
}

export const generalFaq: readonly GeneralItem[] = [
  {
    q: '¿Qué pasa si el precio se mueve entre que acepto y transfiero?',
    a: 'Tu precio queda fijo 12 minutos. El que se aplica es el que tu ejecutivo te confirma, no el que la web mostraba cuando cotizaste, y se mantiene durante esa ventana para que transfieras. Si se pasa, se cotiza de nuevo con el precio del momento. Y el plazo vale para los dos lados: una vez que aceptas, la cotización está cerrada y no se renegocia. Puedes pedir otra aparte, pero no cambia la que está en curso.',
  },
  {
    q: '¿Puedo cancelar una operación después de aceptar el precio?',
    a: 'Sí, y no hace falta avisar: basta con no transferir. Al aceptar se abre la ventana de 12 minutos, y si no transfieres dentro de ella la cotización caduca sola. No se cobra nada por eso.',
  },
  {
    /*
      Los tres datos de esta respuesta los dio Sebastián el 2026-09-29: el
      recorrido (se deposita dólar digital en la plataforma y se convierte ahí),
      la cuenta de destino (cualquiera registrada, del titular) y que **el mínimo
      en pesos es fijo en 500.000 y su equivalente en dólares se mueve con el
      precio del día**.

      Lo del mínimo no hubo que cambiarlo en ninguna parte: `quote.ts` ya mide
      «el monto en pesos de la operación, sea el que se entrega o el que se
      recibe», así que el tope inferior se aplicaba a las dos direcciones desde
      siempre. Lo que faltaba era **decirlo**, y desde hoy `/tarifas` lo dice.

      **Esta respuesta es la primera página del sitio que describe el
      autoservicio**, y eso no es lo ideal: una FAQ cuenta algo que las páginas
      de producto no cuentan. Está anotado en `CLAUDE.md` §1 como trabajo
      pendiente de `/como-funciona`, que es donde corresponde.
    */
    q: '¿Puedo volver a pesos cuando quiera?',
    a: 'Sí. Depositas dólar digital en la plataforma y haces la conversión ahí, directo a pesos. Los pesos llegan a una cuenta bancaria registrada a tu nombre, la que elijas. El mínimo es el mismo en las dos direcciones: la operación tiene que valer al menos CLP 500.000, así que en dólares el mínimo se mueve con el precio del día.',
  },
  {
    q: '¿Qué pasa si mi banco retiene o rechaza la transferencia?',
    a: 'Se cotiza de nuevo. El plazo corre desde que aceptas, y lo que tarde tu banco no lo controlamos ni nosotros ni tú. Si la transferencia no llega dentro de la ventana, el precio aceptado caduca y tu ejecutivo te pasa el del momento. Por eso conviene aceptar cuando ya puedas transferir.',
  },
];

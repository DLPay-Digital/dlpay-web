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
 * El grupo «qué pasa si algo se sale del guion» tenía cinco preguntas. Entran
 * tres. Las otras dos necesitan un dato operativo que Sebastián todavía no ha
 * dado y que no se puede suponer:
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
    q: '¿Qué pasa si mi banco retiene o rechaza la transferencia?',
    a: 'Se cotiza de nuevo. El plazo corre desde que aceptas, y lo que tarde tu banco no lo controlamos ni nosotros ni tú. Si la transferencia no llega dentro de la ventana, el precio aceptado caduca y tu ejecutivo te pasa el del momento. Por eso conviene aceptar cuando ya puedas transferir.',
  },
];

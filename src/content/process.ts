/**
 * Contenido de /como-funciona. El recorrido completo: web, WhatsApp y
 * verificación como una sola secuencia (principio UX 3).
 *
 * REGLA: nada aquí puede afirmar algo que DLPay no pueda respaldar.
 */
import type { IconName } from '../components/Icon.astro';

export interface FlowNode {
  label: string;
  detail: string;
}

export interface DetailedStep {
  n: number;
  title: string;
  body: string;
  time: string;
  /** Qué hace la persona, para separarlo de lo que hace DLPay. */
  who: 'tú' | 'DLPay';
}

/** Nodos del diagrama: contrapartes reales, no adornos (Design System §6). */
export const flow: FlowNode[] = [
  { label: 'Tú', detail: 'Transfieres en pesos desde tu banco' },
  { label: 'El banco', detail: 'Confirmamos que el dinero llegó' },
  { label: 'DLPay', detail: 'Cambiamos al precio acordado' },
  { label: 'El destino', detail: 'Llega en la moneda de ese país' },
];

export const detailedSteps: DetailedStep[] = [
  {
    n: 1,
    who: 'tú',
    title: 'Dices qué necesitas',
    body: 'Enviar a otro país, o volver a pesos. Eliges el destino, escribes el monto y ves al instante el precio referencial y cuánto llega. No necesitas cuenta para esto.',
    time: 'ahora mismo',
  },
  {
    n: 2,
    who: 'tú',
    title: 'Escribes por WhatsApp',
    body: 'El botón abre el chat con tu operación ya escrita. No tienes que repetir nada: el ejecutivo ve el contexto de entrada.',
    time: 'un toque',
  },
  {
    n: 3,
    who: 'DLPay',
    title: 'Un ejecutivo confirma el precio',
    body: 'El precio de la web es referencial porque el mercado se mueve. Una persona te confirma el precio final, te pide los datos de quien recibe y te da los datos para transferir.',
    time: 'minutos',
  },
  {
    n: 4,
    who: 'tú',
    title: 'Transfieres en pesos',
    body: 'Desde tu banco a la cuenta de DLPay. Si es tu primera operación, antes te pedimos registro y verificación de identidad.',
    time: 'según tu banco',
  },
  {
    n: 5,
    who: 'DLPay',
    title: 'Verificamos la transferencia',
    body: 'Confirmamos que el dinero está acreditado antes de ejecutar nada. Es el paso que no se salta nunca.',
    time: 'al acreditarse',
  },
  {
    n: 6,
    who: 'DLPay',
    // REQUIERE VALIDACIÓN DE COMPLIANCE — que el dinero llega a destino en la
    // moneda de ese destino (ADR-0014, 2026-10-22).
    title: 'Llega a destino',
    // ── Historia de este paso, porque explica dos cosas que parecen raras ──
    //
    // Hasta el 2026-10-22 decía «Recibes el dólar digital» y terminaba en la
    // billetera del cliente, porque hasta ese día el servicio terminaba ahí:
    // la regla dura de §1 prohibía incluso SUGERIR que el destinatario recibía
    // moneda local. ADR-0014 derogó esa regla y el paso pasa a contar el
    // recorrido entero.
    //
    // 1. **El tiempo deja de ser un número.** Decía «~5 min desde el pago», y
    //    ese número medía NUESTRA operación, que entonces era todo. Ahora hay
    //    un tramo más y nadie ha dado un plazo que se pueda respaldar, así que
    //    ponerlo otra vez sería prometer lo que D17 lleva un año evitando.
    // 2. **No se nombra el canal.** Ni cuenta bancaria, ni efectivo, ni
    //    billetera local: cambia por país y D16 está reabierta por eso. Se dice
    //    el resultado, no el medio.
    //
    // La frase de la bisagra la REPITE `content/scope.ts` como dato: si se
    // toca acá, hay que tocarla allá, o el sitio deja de coincidir consigo
    // mismo sobre hasta dónde llega el servicio.
    body: 'Te confirmamos por el mismo chat cuando está entregado. Nos ocupamos del recorrido completo: hasta que el dinero llega a destino.',
    time: 'te lo confirma tu ejecutivo',
  },
];

/** Lo que conviene tener a mano antes de empezar. Reduce la fricción real. */
/**
 * Cada ítem lleva SU icono, y no lo decide la página por posición (2026-09-23).
 *
 * Con un `string[]` la página tenía que mapear icono por índice, y entonces
 * reordenar la lista —o añadir un ítem— desparejaba el dibujo del texto sin que
 * nada fallara ni en el build ni a la vista. Acá el icono viaja pegado a la
 * frase a la que pertenece. Es la forma que ya tienen `mechanisms` y los usos
 * de la Home.
 */
export interface ChecklistItem {
  icon: IconName;
  text: string;
}

export const checklist: readonly ChecklistItem[] = [
  { icon: 'documento', text: 'Tu cédula de identidad vigente' },
  { icon: 'bank', text: 'Una cuenta bancaria a tu nombre' },
  { icon: 'people', text: 'Los datos de quien recibe en el país de destino' },
];

/**
 * Las frases del chat, en un solo sitio.
 *
 * Las escribía `Process.astro` dentro de sus cuatro pasos, y hasta el
 * 2026-09-25 eran su propiedad privada. Ese día `/como-funciona` pidió tres de
 * ellas para el teléfono de su portada, y copiarlas habría dejado **dos dueños
 * de la misma línea** en dos páginas: la Home y ésta. Es el fallo que D24 cerró
 * para el monto mínimo y el mismo que llevó `content/scope.ts` a existir.
 *
 * **No formatea cifras a propósito.** Recibe el primer mensaje y la tasa ya
 * compuestos por quien la llama, que es quien tiene `lib/pricing` a mano. Así
 * este archivo sigue siendo contenido puro, sin una sola dependencia de
 * `lib/pricing`, y nadie puede hacer que la Home y esta página citen precios
 * distintos.
 *
 * **El primer mensaje no es una frase de este archivo desde el 2026-10-23.**
 * Decía «Hola, necesito convertir {monto} CLP. ¿Me confirman el precio?», y el
 * botón del cotizador ya escribía otra cosa: «Hola, quiero enviar CLP 2.000.000
 * a Estados Unidos, en dólares (…)». El paso 1 dice que la operación «llega
 * escrita automáticamente desde nuestro cotizador», así que la burbuja tiene que
 * ser ese texto y no uno parecido: quien llama la pide a `mensajeInicial()`
 * (`lib/pricing/mensaje-inicial.ts`), que la arma con la función del botón.
 * Decidido por Sebastián el 2026-10-23.
 *
 * Ninguna de estas frases lleva marcador de Compliance. Los dos que tenía el
 * paso 2 de `Process.astro` estaban en su TÍTULO («Precio garantizado») y en su
 * CUERPO («mesa de dinero»), no en las burbujas, y se fueron con esas frases el
 * 2026-10-23.
 */
export function chatLines(mensajeInicial: string, tasa: string) {
  return {
    /** Lo que el botón del cotizador escribe solo: `mensajeInicial()`. */
    pide: mensajeInicial,
    /** El ejecutivo, con el precio de verdad. */
    confirma: `Precio confirmado a ${tasa}. ¿Cerramos la operación?`,
    acepta: 'Sí, acepto.',
    transfiere: 'Transferencia enviada.',
    recibido: 'Fondos recibidos. Procesando...',
    entregado: '¡Listo! El dinero ya está en destino.',
  } as const;
}

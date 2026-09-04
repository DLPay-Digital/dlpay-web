/**
 * Contenido de /como-funciona. El recorrido completo: web, WhatsApp y
 * verificación como una sola secuencia (principio UX 3).
 *
 * REGLA: nada aquí puede afirmar algo que DLPay no pueda respaldar.
 */

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
  { label: 'DLPay', detail: 'Compramos al precio acordado' },
  { label: 'Tu wallet', detail: 'Recibes el dólar digital' },
];

export const detailedSteps: DetailedStep[] = [
  {
    n: 1,
    who: 'tú',
    title: 'Cotizas el monto',
    body: 'Escribes cuánto quieres cambiar en el cotizador. Ves al instante el precio referencial y cuánto recibes. No necesitas cuenta para esto.',
    time: 'ahora mismo',
  },
  {
    n: 2,
    who: 'tú',
    title: 'Escribes por WhatsApp',
    body: 'El botón abre el chat con tu monto y la dirección de la operación ya escritos. No tienes que repetir nada: el ejecutivo ve el contexto de entrada.',
    time: 'un toque',
  },
  {
    n: 3,
    who: 'DLPay',
    title: 'Un ejecutivo confirma el precio',
    body: 'El precio de la web es referencial porque el mercado se mueve. Una persona te confirma el precio final y los datos para transferir.',
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
    body: 'Confirmamos que el dinero está acreditado antes de entregar nada. Es el paso que no se salta nunca.',
    time: 'al acreditarse',
  },
  {
    n: 6,
    who: 'DLPay',
    // REQUIERE VALIDACIÓN DE COMPLIANCE — el tiempo de ~5 minutos
    title: 'Recibes tu dólar digital',
    body: 'Enviamos los USDT a la wallet que nos indicaste y te confirmamos la operación por el mismo chat.',
    time: '~5 min desde el pago',
  },
];

/** Lo que conviene tener a mano antes de empezar. Reduce la fricción real. */
export const checklist: string[] = [
  'Tu cédula de identidad vigente',
  'Una cuenta bancaria a tu nombre',
  'La dirección de la wallet donde quieres recibir el dólar digital',
];

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
  { label: 'DLPay', detail: 'Cambiamos al precio acordado' },
  { label: 'Tu billetera', detail: 'Recibes el dólar digital y decides qué hacer' },
];

export const detailedSteps: DetailedStep[] = [
  {
    n: 1,
    who: 'tú',
    title: 'Dices qué necesitas',
    body: 'Enviar al extranjero, pasar pesos a dólares o volver a pesos. Escribes el monto y ves al instante el precio referencial y cuánto recibes. No necesitas cuenta para esto.',
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
    body: 'El precio de la web es referencial porque el mercado se mueve. Una persona te confirma el precio final, te pide la billetera de destino y te da los datos para transferir.',
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
    // REQUIERE VALIDACIÓN DE COMPLIANCE — el tiempo de ~5 minutos
    title: 'Recibes el dólar digital',
    // Cerrado el 2026-09-04: DLPay entrega dólar digital en la billetera. NO
    // realiza depósito en cuenta bancaria en destino. El tiempo es el de nuestra
    // operación, no el de una liquidación bancaria.
    body: 'Enviamos el dólar digital a la billetera que nos indicaste y te confirmamos por el mismo chat. Ahí termina nuestra operación: desde ese punto decides tú.',
    time: '~5 min desde el pago',
  },
];

/** Lo que conviene tener a mano antes de empezar. Reduce la fricción real. */
export const checklist: string[] = [
  'Tu cédula de identidad vigente',
  'Una cuenta bancaria a tu nombre',
  'La dirección de la billetera donde quieres recibir el dólar digital',
];

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
  { label: 'Tu billetera', detail: 'Recibes el dólar digital y decides qué hacer' },
];

export const detailedSteps: DetailedStep[] = [
  {
    n: 1,
    who: 'tú',
    title: 'Dices qué necesitas',
    body: 'Pasar pesos a dólares o volver a pesos. Escribes el monto y ves al instante el precio referencial y cuánto recibes. No necesitas cuenta para esto.',
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
  { icon: 'wallet', text: 'La dirección de la billetera donde quieres recibir el dólar digital' },
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
 * **No formatea cifras a propósito.** Recibe el monto y la tasa ya compuestos
 * por quien la llama, que es quien tiene la cadena `ConfigPriceSource → convert`
 * a mano. Así este archivo sigue siendo contenido puro, sin una sola
 * dependencia de `lib/pricing`, y nadie puede hacer que la Home y esta página
 * citen precios distintos.
 *
 * Ninguna de estas frases lleva marcador de Compliance, y conviene saber por
 * qué: los dos marcadores del paso 2 de `Process.astro` están en su TÍTULO
 * («Precio garantizado») y en su CUERPO («mesa de dinero»), no en las burbujas.
 */
export function chatLines(monto: string, tasa: string) {
  return {
    /** Lo que el botón del cotizador escribe solo. */
    pide: `Hola, necesito convertir ${monto} CLP. ¿Me confirman el precio?`,
    /** El ejecutivo, con el precio de verdad. */
    confirma: `Precio confirmado a ${tasa}. ¿Cerramos la operación?`,
    acepta: 'Sí, acepto.',
    transfiere: 'Transferencia enviada.',
    recibido: 'Fondos recibidos. Procesando...',
    entregado: '¡Listo! Dólares digitales enviados a tu billetera.',
  } as const;
}

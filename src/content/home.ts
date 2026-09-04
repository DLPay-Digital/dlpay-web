/**
 * Datos estructurados de la Home (ADR-0002 §4: el copy vive en la página, los
 * datos repetidos viven aquí, tipados).
 *
 * REGLA DE CONTENIDO: nada aquí puede afirmar algo que DLPay no pueda respaldar.
 * Ver phase-2.5-definicion-experiencia.md §5.
 */

export interface Step {
  n: number;
  title: string;
  body: string;
  /** Tiempo concreto. Reduce la ansiedad del proceso (Fase 1, patrón 7). */
  time?: string;
}

export interface TrustBlock {
  icon: 'bank' | 'clock' | 'people';
  title: string;
  body: string;
}

export interface FaqItem {
  q: string;
  a: string;
}

/**
 * Para qué sirve DLPay. Tres usos, no una lista de servicios: la persona tiene
 * que reconocerse en uno en segundos, no leer un catálogo.
 */
export interface UseCase {
  title: string;
  body: string;
}

export const useCases: UseCase[] = [
  {
    title: 'Enviar dinero fuera de Chile',
    body: 'A una persona, o a tu propia cuenta en el extranjero. Sin depender de días hábiles ni de la cadena de bancos corresponsales.',
  },
  {
    title: 'Tener tus pesos en dólares',
    body: 'Conviertes cuando el precio te acomoda y vuelves a pesos cuando lo necesitas. No hace falta abrir una cuenta afuera.',
  },
  {
    title: 'Pagar desde tu empresa',
    body: 'Proveedores en el exterior, remuneraciones, tesorería. Con un ejecutivo que conoce tu operación.',
  },
];

/**
 * El recorrido completo: web + WhatsApp + verificación como UNA sola secuencia
 * (principio UX 3). Numerado porque es una secuencia real (Fase 1, patrón 11).
 */
export const steps: Step[] = [
  {
    n: 1,
    title: 'Dices qué necesitas',
    body: 'Enviar al extranjero, pasar tus pesos a dólares o volver a pesos. Escribes el monto y ves al instante cuánto recibes.',
    time: 'ahora mismo',
  },
  {
    n: 2,
    title: 'Continúas por WhatsApp',
    body: 'El botón abre el chat con tu operación ya escrita. Una persona te confirma el precio final y coordina el destino.',
    time: 'minutos',
  },
  {
    n: 3,
    title: 'Transfieres y verificamos',
    body: 'Transfieres desde tu banco y confirmamos la recepción en la cuenta de DLPay antes de mover nada.',
    time: 'según tu banco',
  },
  {
    n: 4,
    title: 'Tu dinero llega',
    // REQUIERE VALIDACIÓN DE COMPLIANCE — el tiempo de ~5 minutos
    body: 'Ejecutamos la operación y te confirmamos por el mismo chat, con el comprobante.',
    time: '~5 min desde el pago',
  },
];

export const trust: TrustBlock[] = [
  {
    icon: 'bank',
    // REQUIERE VALIDACIÓN DE COMPLIANCE — mención del banco por nombre
    title: 'Un banco de por medio',
    body: 'Recibimos y verificamos tu transferencia en la cuenta de DLPay en BCI antes de ejecutar la operación. No hay pasos a ciegas.',
  },
  {
    icon: 'clock',
    title: 'El precio, sin letra chica',
    body: 'El precio que ves ya incluye nuestro spread. No hay comisiones que aparezcan después ni un tipo de cambio inflado por dentro.',
  },
  {
    icon: 'people',
    title: 'Personas, no formularios',
    body: 'Un ejecutivo cierra cada operación por WhatsApp. Somos un equipo en Chile y pedimos verificación de identidad a todos, sin excepción.',
  },
];

export const faq: FaqItem[] = [
  {
    q: '¿Por qué es más rápido que un banco?',
    a: 'Porque no dependemos de la cadena de bancos corresponsales ni de sus horarios. Movemos tu dinero con dólar digital, que se transfiere en minutos y a cualquier hora. Lo que sí depende de tu banco es el momento en que tu transferencia en pesos llega a nosotros.',
  },
  {
    q: '¿El precio de la web es el precio final?',
    a: 'No. Es un precio referencial de mercado. Tu ejecutivo te confirma el precio final al momento de cerrar, porque el mercado se mueve. Preferimos decírtelo antes que después.',
  },
  {
    q: '¿Qué es el "dólar digital" que usan?',
    a: 'Son stablecoins, USDT o USDC: monedas digitales que siguen el valor del dólar. Es la infraestructura que hace rápida la operación. No necesitas saber de esto para operar; tu ejecutivo te guía.',
  },
  {
    q: '¿Necesito registrarme?',
    a: 'Sí. Pedimos registro y verificación de identidad antes de la primera operación, a personas y a empresas. Es un requisito de seguridad y cumplimiento, no un trámite opcional.',
  },
];

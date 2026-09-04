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
 * El recorrido completo: web + WhatsApp + KYC como UNA sola secuencia
 * (principio UX 3). Numerado porque es una secuencia real (Fase 1, patrón 11).
 */
export const steps: Step[] = [
  {
    n: 1,
    title: 'Cotizas el monto',
    body: 'Escribes cuánto quieres cambiar y ves al instante el precio referencial y cuánto recibes.',
    time: 'ahora mismo',
  },
  {
    n: 2,
    title: 'Confirmas con un ejecutivo',
    body: 'El botón abre WhatsApp con tu monto ya escrito. Una persona te confirma el precio final del momento.',
    time: 'minutos',
  },
  {
    n: 3,
    title: 'Transfieres y verificamos',
    body: 'Transfieres en pesos y confirmamos la recepción en la cuenta bancaria de DLPay antes de entregar nada.',
    time: 'según tu banco',
  },
  {
    n: 4,
    title: 'Recibes tu dólar digital',
    // REQUIERE VALIDACIÓN DE COMPLIANCE — el tiempo de ~5 minutos
    body: 'Te enviamos los USDT a tu wallet y te confirmamos la operación.',
    time: '~5 min desde el pago',
  },
];

export const trust: TrustBlock[] = [
  {
    icon: 'bank',
    // REQUIERE VALIDACIÓN DE COMPLIANCE — mención del banco por nombre
    title: 'Un banco de por medio',
    body: 'Recibimos y verificamos tu transferencia en la cuenta de DLPay en BCI antes de entregarte el dólar digital. No hay pasos a ciegas.',
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
    q: '¿El precio de la web es el precio final?',
    a: 'No. Es un precio referencial de mercado. Tu ejecutivo te confirma el precio final al momento de cerrar, porque el mercado se mueve. Preferimos decírtelo antes que después.',
  },
  {
    q: '¿Qué es el "dólar digital"?',
    a: 'Es una stablecoin: USDT o USDC, monedas digitales que siguen el valor del dólar. Puedes guardarlas, moverlas a cualquier hora y convertirlas de vuelta a pesos cuando quieras.',
  },
  {
    q: '¿Necesito registrarme para operar?',
    a: 'Sí. Pedimos registro y verificación de identidad antes de la primera operación, para personas y para empresas. Es un requisito de seguridad y cumplimiento, no un trámite opcional.',
  },
  {
    q: '¿Puedo operar fuera del horario bancario?',
    a: 'Puedes cotizar y escribirnos a cualquier hora. La entrega del dólar digital no depende de días hábiles, pero sí necesitamos ver tu transferencia acreditada.',
  },
];

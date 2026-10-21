/**
 * Datos estructurados de la Home (ADR-0002 §4: el copy vive en la página, los
 * datos repetidos viven aquí, tipados).
 *
 * REGLA DE CONTENIDO: nada aquí puede afirmar algo que DLPay no pueda respaldar.
 * Ver phase-2.5-definicion-experiencia.md §5.
 */

export interface TrustBlock {
  icon: 'bank' | 'clock' | 'people';
  title: string;
  body: string;
}

/**
 * Las cinco PREOCUPACIONES en las que se agrupan las nueve preguntas del sitio.
 *
 * Existe porque `/preguntas` las presenta agrupadas, y la pertenencia tenía que
 * viajar CON la pregunta y no en una lista aparte. Con cinco listas de textos
 * dentro de la página, reescribir una pregunta acá la sacaría de su grupo **sin
 * que nada fallara**: es el mismo fallo silencioso del `id` fijo de `Faq.astro`.
 *
 * Unión cerrada a propósito: una preocupación mal escrita rompe el build, igual
 * que un `category` fuera de la lista.
 *
 * El LADO —persona o empresa— no se declara: sale de qué archivo viene la
 * pregunta, `home.ts` o `business.ts`. Duplicarlo en un campo sería un dato que
 * puede contradecir a su propio origen.
 */
export type Concern = 'recibo' | 'precio' | 'alcance' | 'requisitos' | 'atencion';

export interface FaqItem {
  q: string;
  a: string;
  /** En qué preocupación entra. La agrupa `/preguntas`; acá no se usa. */
  concern: Concern;
}

/**
 * Para qué sirve DLPay. Tres usos, no una lista de servicios: la persona tiene
 * que reconocerse en uno en segundos, no leer un catálogo.
 */
export interface UseCase {
  title: string;
  body: string;
  /** Topología de la operación. Ver FiguraUso.astro: es el dato, no un adorno. */
  figure: 'cruza' | 'convierte' | 'reparte';
}

export const useCases: UseCase[] = [
  {
    figure: 'cruza',
    title: 'Mover dinero fuera de Chile',
    body: 'Recibes la divisa del destino y desde ahí la envías a quien necesites, en otro país o a tu propia billetera. Se mueve en minutos, sin cadena de bancos corresponsales.',
  },
  {
    figure: 'convierte',
    title: 'Tener tus pesos en otra moneda',
    body: 'Conviertes cuando el precio te acomoda y vuelves a pesos cuando lo necesitas. No hace falta abrir una cuenta afuera.',
  },
  {
    figure: 'reparte',
    title: 'Pagar desde tu empresa',
    body: 'A proveedores, servicios o equipos en el exterior que operan con divisa digital. Con un ejecutivo que conoce tu operación.',
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
    concern: 'recibo',
    a: 'Porque la divisa digital se transfiere en minutos y a cualquier hora, sin pasar por la cadena de bancos corresponsales. Lo que sí depende de tu banco es el momento en que tu transferencia en pesos nos llega. Y si después conviertes esa divisa a moneda local en otro país, ese último paso es un proceso aparte.',
  },
  {
    q: '¿DLPay deposita el dinero en una cuenta bancaria en el extranjero?',
    concern: 'alcance',
    a: 'No. Lo que hacemos es el cambio de divisas: recibes la divisa, en forma digital, en tu billetera. Desde ahí puedes mantenerla, enviarla a otra persona o convertirla a moneda local en destino, que es un servicio distinto y lo resuelves tú. Preferimos ser exactos en esto.',
  },
  {
    q: '¿El precio de la web es el precio final?',
    concern: 'precio',
    a: 'No. Es un precio referencial de mercado. Tu ejecutivo te confirma el precio final al momento de cerrar, porque el mercado se mueve. Preferimos decírtelo antes que después.',
  },
  {
    // PENDIENTE DE DECISIÓN — qué llega exactamente, por divisa (ADR-0013).
    // Esta respuesta es deliberadamente la del QUÉ y no la del CÓMO: el
    // mecanismo —stablecoin, USDT, redes— sale del mensaje comercial el
    // 2026-10-21 y se queda en el blog y el glosario. Y no afirma que exista
    // una versión digital de las doce divisas, porque no la hay: mientras eso
    // no se cierre, quien lo concreta es el ejecutivo, no la página.
    q: '¿Qué es la "divisa digital" que recibo?',
    concern: 'recibo',
    a: 'Es una versión digital de la moneda, pensada para conservar su valor y moverse por redes propias en minutos, sin depender de horarios bancarios. Es lo que permite que la operación no espere días hábiles. Cuál se usa en tu caso te lo confirma tu ejecutivo: no necesitas saber de esto para operar.',
  },
  {
    q: '¿Necesito registrarme?',
    concern: 'requisitos',
    a: 'Sí. Pedimos registro y verificación de identidad antes de la primera operación, a personas y a empresas. Es un requisito de seguridad y cumplimiento, no un trámite opcional.',
  },
];

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
    body: 'Dices a qué país y cuánto, y el dinero llega allá en la moneda de ese país. Sin la cadena de bancos corresponsales ni sus horarios.',
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

/**
 * «El mismo envío, por dos caminos»: la sección de la Home que pone lado a lado
 * el camino del banco y el de DLPay (`DosCaminos.astro`). Cowork, entrega
 * `caminos-`, a partir del análisis de anyenk.com del 2026-10-21: su
 * comparación con el banco es lo más fuerte de su página y ahí es una tabla
 * quieta. Reescrita el 2026-10-22 sobre ADR-0014.
 *
 * REQUIERE VALIDACIÓN DE COMPLIANCE — que el dinero llega a destino en la
 * moneda de ese destino (ADR-0014), y todo lo que esta sección dice del banco.
 *
 * ── Lo que dice de DLPay ya está publicado, y se cita dónde ───────────────
 *
 * · «Nos ocupamos del recorrido completo: tú transfieres en pesos acá y el
 *   dinero llega allá»: la FAQ «¿Qué recibe la persona a la que le envío?».
 * · «en la moneda de ese país»: «Mover dinero fuera de Chile», en esta página.
 * · «sin los horarios ni los días hábiles de una transferencia bancaria»: el
 *   héroe; «Sin los días hábiles de la cadena bancaria»: `Steps`.
 * · «Ese número ya lo incluye todo»: el puente de la Home a `/tarifas`.
 * · «Un ejecutivo por WhatsApp»: `business.ts`, y «Personas, no formularios».
 * · La nota es la FAQ, casi letra por letra: lo que depende de tu banco, y que
 *   cómo y cuándo recibe quien recibe te lo confirma tu ejecutivo.
 *
 * ── Lo que NO dice, por ADR-0014 §3 ───────────────────────────────────────
 *
 * · **Ningún plazo de la entrega final.** Por eso los dos carriles **no
 *   compiten**: corre primero el del banco y después el de DLPay, y el
 *   marcador de DLPay es «Sin días hábiles», que es lo publicado, y no un
 *   tiempo. Una carrera ganada diría «llega antes», y eso es un plazo.
 * · **El canal de entrega.** Quien recibe recibe «en la moneda de su país»:
 *   el resultado, no el medio (D16, reabierta).
 * · **«Remesa»**, que sigue sin decirse por posicionamiento (ADR-0014 §4).
 *
 * Lo que dice **del banco** es nuevo: «días hábiles y horario bancario», «una
 * cadena de bancos corresponsales», «comisiones y un tipo de cambio por
 * separado», «formularios y sucursal».
 */
export interface Parada {
  /** Lo que se lee bajo la pieza. */
  label: string;
  /** Dónde está, para quien no ve la frontera: se lee tras la etiqueta. */
  zona: 'en Chile' | 'en el exterior';
  /** Posición en el carril, de 0 a 1. La frontera está en `frontera`. */
  x: number;
  icon: 'bank' | 'whatsapp' | 'people';
  /** `tuya` va en tinta: tu banco, como en «Tres formas de usarlo». */
  tipo?: 'tuya';
  /** Lo que aparece al llegar. Sin movimiento, se ve desde el principio. */
  llega?: string;
}

export const dosCaminos = {
  title: 'El mismo envío, por dos caminos',
  body: 'Por el banco, tu transferencia pasa por una cadena de bancos corresponsales, cada uno con sus horarios. Con DLPay transfieres en pesos acá y nos ocupamos de que llegue allá, en la moneda de ese país.',
  /** Donde cruza la frontera, en los dos carriles. */
  frontera: 0.6,
  banco: {
    nombre: 'Por el banco',
    /** El marcador del carril: grande, a la derecha, y se enciende al llegar. */
    tiempo: 'Días hábiles',
    paradas: [
      { label: 'Tu banco', zona: 'en Chile', x: 0, icon: 'bank', tipo: 'tuya' },
      { label: 'Banco corresponsal', zona: 'en el exterior', x: 0.7, icon: 'bank' },
      { label: 'Otro corresponsal', zona: 'en el exterior', x: 0.85, icon: 'bank' },
      { label: 'Banco de quien recibe', zona: 'en el exterior', x: 1, icon: 'bank', llega: 'días hábiles después' },
    ] satisfies Parada[],
  },
  dlpay: {
    nombre: 'Con DLPay',
    tiempo: 'Sin días hábiles',
    paradas: [
      { label: 'Cotizas por WhatsApp', zona: 'en Chile', x: 0, icon: 'whatsapp' },
      { label: 'Transfieres pesos en Chile', zona: 'en Chile', x: 0.3, icon: 'bank', tipo: 'tuya' },
      { label: 'Quien recibe', zona: 'en el exterior', x: 1, icon: 'people', llega: 'en la moneda de su país' },
    ] satisfies Parada[],
  },
  nota: 'Ilustrativo. Lo que tarda tu transferencia en pesos depende de tu banco, y cómo y cuándo recibe quien recibe depende del destino: te lo confirma tu ejecutivo antes de que transfieras.',
  repetir: 'Ver de nuevo',
  compara: {
    caption: 'Lo que cambia entre enviar dinero por el banco y con DLPay',
    filas: [
      { que: 'Cuándo se mueve', banco: 'En días hábiles y horario bancario', dlpay: 'Sin los horarios ni los días hábiles de la cadena bancaria' },
      { que: 'Por dónde pasa', banco: 'Una cadena de bancos corresponsales', dlpay: 'Un solo recorrido, del que nos ocupamos nosotros' },
      { que: 'Qué pagas', banco: 'Comisiones y un tipo de cambio por separado', dlpay: 'Un solo número, que ya lo incluye todo' },
      { que: 'Con quién hablas', banco: 'Formularios y sucursal', dlpay: 'Un ejecutivo por WhatsApp' },
    ],
  },
};

export const faq: FaqItem[] = [
  {
    q: '¿Por qué es más rápido que un banco?',
    concern: 'recibo',
    a: 'Porque por detrás el valor no viaja por la cadena de bancos corresponsales, que es la que impone los días hábiles y los horarios. Lo que sí depende de tu banco es el momento en que tu transferencia en pesos nos llega. El plazo de la entrega en destino te lo confirma tu ejecutivo: cambia según el país.',
  },
  {
    // REQUIERE VALIDACIÓN DE COMPLIANCE — que el dinero llega a destino en la
    // moneda de ese destino (ADR-0014, 2026-10-22).
    //
    // Esta pregunta era, hasta el 2026-10-22, «¿DLPay deposita el dinero en
    // una cuenta bancaria en el extranjero?», y la respuesta empezaba por
    // «No». Era la pregunta que el límite anterior obligaba a responder. Ahora
    // la que la gente se hace es la de abajo, y la respuesta **no nombra el
    // canal** porque cambia por país y D16 está reabierta.
    q: '¿Qué recibe la persona a la que le envío?',
    concern: 'alcance',
    a: 'Recibe en la moneda de su país. Nos ocupamos del recorrido completo: tú transfieres en pesos acá y el dinero llega allá. Cómo lo recibe y en cuánto tiempo depende del destino, y te lo confirma tu ejecutivo antes de que transfieras.',
  },
  {
    q: '¿El precio de la web es el precio final?',
    concern: 'precio',
    a: 'No. Es un precio referencial de mercado. Tu ejecutivo te confirma el precio final al momento de cerrar, porque el mercado se mueve. Preferimos decírtelo antes que después.',
  },
  {
    // **Esta pregunta cambió de oficio el 2026-10-22.** Era «¿Qué es la
    // "divisa digital" que recibo?» y era la del QUÉ: el cliente recibía una
    // divisa digital, así que la pregunta tenía sentido. ADR-0014 cambió eso
    // —lo que llega a destino es la moneda de ese país— y la pregunta pasó a
    // afirmar algo falso en su propio enunciado, en la palabra «recibo».
    //
    // Ahora es la del CÓMO, que es donde el mecanismo puede vivir: `CLAUDE.md`
    // §1 autoriza explícitamente explicarlo «en una respuesta de la FAQ». La
    // respuesta dice que es el riel y no lo que se recibe, que es la
    // distinción que ADR-0013 y ADR-0014 obligan a mantener.
    //
    // El glosario ya no la cita: su entrada pasó a ser «Divisa», a secas.
    q: '¿Cómo se mueve el dinero si no pasa por la cadena de bancos?',
    concern: 'recibo',
    a: 'Por detrás usamos divisas en formato digital, que se transfieren por redes propias y no dependen de horarios bancarios. Es el riel, no lo que recibe quien recibe: a destino llega la moneda de ese país. No necesitas saber de esto para operar.',
  },
  {
    q: '¿Necesito registrarme?',
    concern: 'requisitos',
    a: 'Sí. Pedimos registro y verificación de identidad antes de la primera operación, a personas y a empresas. Es un requisito de seguridad y cumplimiento, no un trámite opcional.',
  },
];

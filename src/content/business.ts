/**
 * Contenido de /empresas. Lenguaje B2B: tesorería, liquidez, operaciones
 * recurrentes (phase-2.5 §4).
 *
 * REGLA: nada de cifras de volumen, número de clientes ni logos de empresas
 * hasta tener el dato verificable y la autorización (phase-2.5 §5, D10).
 */
import type { ChecklistItem } from './process.ts';
import type { FaqItem } from './home.ts';

/** La figura que acompaña a cada caso. Ver FiguraCaso.astro. */
export type EmblemKind = 'proveedores' | 'tesoreria' | 'recurrentes' | 'divisas';

export interface UseCase {
  title: string;
  body: string;
  /** La forma de la operación, no un adorno: misma lógica que `kind` en home.ts. */
  emblem: EmblemKind;
}

export interface Difference {
  aspect: string;
  person: string;
  company: string;
}

/*
  ── Lo que recibe una empresa (2026-10-26) ────────────────────────────────

  **Lo mismo que una persona**: el dinero llega a destino en la moneda de ese
  país (ADR-0014). Lo dijo Sebastián al responder al recorrido de primera
  visita: lo que cambia para una empresa es el acompañamiento y las
  condiciones por volumen, no lo que recibe. Estos textos venían de antes de
  ADR-0014 —«le pagas en forma digital», «reciben en divisa digital», «la
  dirección de la billetera donde quieres recibir»— y contradecían a la Home.

  REQUIERE VALIDACIÓN DE COMPLIANCE — que el dinero llega en la moneda del
  país de destino, igual que en el resto del sitio (ADR-0014).
*/
export const businessUseCases: UseCase[] = [
  {
    title: 'Pagos a proveedores en el exterior',
    emblem: 'proveedores',
    body: 'Le pagas a tu proveedor y el dinero llega en la moneda de su país, sin la cadena de bancos corresponsales ni sus horarios. Si tu proveedor sólo recibe por banco, conversémoslo antes.',
  },
  {
    title: 'Tesorería en moneda extranjera',
    emblem: 'tesoreria',
    body: 'Mantienes parte de la caja en la divisa que elijas y la conviertes de vuelta a pesos cuando la necesitas, sin abrir una cuenta en el extranjero.',
  },
  {
    title: 'Pagos recurrentes al exterior',
    emblem: 'recurrentes',
    body: 'Servicios, equipos o proveedores fijos en el exterior, que reciben en la moneda de su país. Tu ejecutivo ya conoce la operación y el ida y vuelta se acorta cada mes.',
  },
  {
    title: 'Cambio de divisas por volumen',
    emblem: 'divisas',
    body: 'CLP y divisas como operación independiente, en montos donde el spread de un banco pesa de verdad y una app retail no alcanza.',
  },
];

export const differences: Difference[] = [
  {
    aspect: 'Verificación',
    person: 'Identidad de la persona',
    company: 'Documentos de la empresa y de sus representantes',
  },
  {
    aspect: 'Atención',
    person: 'Un ejecutivo por WhatsApp',
    company: 'Un ejecutivo asignado que conoce tu operación',
  },
  {
    aspect: 'Condiciones',
    person: 'Las mismas para todos',
    company: 'Conversadas según volumen y frecuencia',
  },
  {
    aspect: 'Cotización',
    person: 'El cotizador de la web',
    company: 'El cotizador, o directo con tu ejecutivo',
  },
];

/** Pasos de incorporación de una empresa. Secuencia real. */
/**
 * Qué preparar antes de escribir.
 *
 * `/como-funciona` tiene su «Ten esto a mano» para una persona y `/empresas` no
 * tenía equivalente. Los tres salen de material ya aprobado: los dos primeros de
 * `trust.ts` —el segundo adaptado al titular empresa— y el tercero literal del
 * `checklist` de `process.ts`. *El tercero pedía «la dirección de la billetera
 * donde quieres recibir» hasta el 2026-10-26; desde entonces es el mismo de una
 * persona, porque lo que recibe una empresa es lo mismo.*
 */
export const checklist: readonly ChecklistItem[] = [
  { icon: 'documento', text: 'Los documentos de la sociedad y de quienes la representan legalmente' },
  { icon: 'bank', text: 'Una cuenta bancaria a nombre de la empresa' },
  { icon: 'people', text: 'Los datos de quien recibe en el país de destino' },
];

/**
 * Las objeciones de una EMPRESA antes de la primera operación.
 *
 * Las cinco de la Home son enteras de persona, y /empresas no tenía ninguna.
 * Ninguna de estas cuatro inventa sustancia: recomponen material ya escrito y
 * disperso por la página, `trust.ts` y `process.ts`.
 */
/**
 * Las condiciones por volumen, en UN solo sitio.
 *
 * Se publicaba en dos páginas —la pregunta «¿Desde qué volumen conviene?» de
 * `/empresas` y el bloque «Volumen y frecuencia» de `/precio`— y por eso es una
 * constante y no dos literales: es una condición comercial, y dos copias que
 * divergen serían dos condiciones distintas publicadas a la vez. *Desde el
 * 2026-10-26 la usa sólo `/empresas`*: el bloque de `/precio` salió porque
 * repetía su primera sección. Sigue siendo una constante, por si vuelve.
 *
 * PENDIENTE DE DECISIÓN — D6 (monto mínimo real) y D5 (transparencia del
 * spread). Y REQUIERE VALIDACIÓN DE COMPLIANCE: toca condiciones comerciales,
 * así que cae en CLAUDE.md §3 y no basta con el visto bueno del equipo.
 *
 * Va SIN cifra a propósito: dice lo que hoy sí se puede afirmar. Cuando D5 o D6
 * se cierren, la frase cambia acá y cambia en las dos páginas — y este
 * comentario es lo que hará que alguien la revise entonces.
 */
/*
  **Reescrita el 2026-10-27, con el tarifario.** Decía «Las condiciones se
  conversan según volumen y frecuencia: no publicamos una tabla por tramos», y
  desde ese día la tabla existe y está en `/tarifas`: la comisión baja en tres
  tramos. Lo que no cambió es que una empresa que opera montos grandes o
  seguido conversa sus condiciones con el ejecutivo, que es lo que `/precio`
  publica desde el 2026-10-26. La segunda frase se conserva tal cual.
  PENDIENTE DE DECISIÓN — que sobre la tabla todavía se conversen condiciones.
*/
export const volumeTerms =
  'La comisión de cambio baja con el monto, en tres tramos que publicamos en las tarifas. Sobre eso, si tu empresa opera montos grandes o de forma recurrente, las condiciones se conversan con tu ejecutivo. La operación pesa donde el spread de un banco pesa de verdad y una app retail no alcanza.';

export const faq: readonly FaqItem[] = [
  {
    q: '¿Quién atiende mi cuenta?',
    concern: 'atencion',
    a: 'Un ejecutivo asignado, el mismo cada vez. Conoce a dónde paga tu empresa, con qué frecuencia y en qué montos, así que no tienes que volver a explicar la operación cada mes.',
  },
  {
    q: '¿Qué documentos necesito?',
    concern: 'requisitos',
    a: 'Los documentos de la sociedad y de quienes la representan legalmente. Además, la cuenta desde la que transfieres tiene que estar a nombre de la empresa: recibimos transferencias sólo desde cuentas del titular de la operación, nunca de terceros.',
  },
  {
    q: '¿Qué pasa si mi proveedor sólo recibe por banco?',
    concern: 'alcance',
    a: 'Conversémoslo antes. El dinero llega en la moneda del país de tu proveedor; cómo lo recibe y en cuánto tiempo depende del destino, y tu ejecutivo te lo confirma antes de que transfieras. Si tu proveedor tiene un requisito particular, es justo lo que conviene revisar en ese primer mensaje.',
  },
  {
    q: '¿Desde qué volumen conviene?',
    concern: 'precio',
    a: volumeTerms,
  },
];

export const onboarding: string[] = [
  'Nos escribes y conversamos qué necesita tu empresa: a dónde paga, con qué frecuencia y en qué montos',
  'Nos envías los documentos de la sociedad y de quienes la representan',
  'Revisamos y habilitamos la cuenta',
  'Operas con tu ejecutivo asignado',
];

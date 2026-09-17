/**
 * Contenido de /empresas. Lenguaje B2B: tesorería, liquidez, operaciones
 * recurrentes (phase-2.5 §4).
 *
 * REGLA: nada de cifras de volumen, número de clientes ni logos de empresas
 * hasta tener el dato verificable y la autorización (phase-2.5 §5, D10).
 */

/** Emblema geométrico que acompaña a cada caso. Ver BusinessEmblem.astro. */
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

export const businessUseCases: UseCase[] = [
  {
    title: 'Pagos a proveedores en el exterior',
    emblem: 'proveedores',
    body: 'Conviertes a dólar digital y pagas a proveedores que operan con él, sin la cadena de bancos corresponsales ni sus horarios. Si tu proveedor sólo recibe por banco, conversémoslo antes.',
  },
  {
    title: 'Tesorería en dólares',
    emblem: 'tesoreria',
    body: 'Mantienes parte de la caja en dólar digital y la conviertes de vuelta a pesos cuando la necesitas, sin abrir una cuenta en el extranjero.',
  },
  {
    title: 'Pagos recurrentes al exterior',
    emblem: 'recurrentes',
    body: 'Servicios, equipos o proveedores fijos que reciben en dólar digital. Tu ejecutivo ya conoce la operación y el ida y vuelta se acorta cada mes.',
  },
  {
    title: 'Cambio de divisas por volumen',
    emblem: 'divisas',
    body: 'CLP y USD como operación independiente, en montos donde el spread de un banco pesa de verdad y una app retail no alcanza.',
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
 * `checklist` de `process.ts`.
 */
export const checklist: readonly string[] = [
  'Los documentos de la sociedad y de quienes la representan legalmente',
  'Una cuenta bancaria a nombre de la empresa',
  'La dirección de la billetera donde quieres recibir el dólar digital',
];

/**
 * Las objeciones de una EMPRESA antes de la primera operación.
 *
 * Las cinco de la Home son enteras de persona, y /empresas no tenía ninguna.
 * Ninguna de estas cuatro inventa sustancia: recomponen material ya escrito y
 * disperso por la página, `trust.ts` y `process.ts`.
 */
export const faq: readonly { q: string; a: string }[] = [
  {
    q: '¿Quién atiende mi cuenta?',
    a: 'Un ejecutivo asignado, el mismo cada vez. Conoce a dónde paga tu empresa, con qué frecuencia y en qué montos, así que no tienes que volver a explicar la operación cada mes.',
  },
  {
    q: '¿Qué documentos necesito?',
    a: 'Los documentos de la sociedad y de quienes la representan legalmente. Además, la cuenta desde la que transfieres tiene que estar a nombre de la empresa: recibimos transferencias sólo desde cuentas del titular de la operación, nunca de terceros.',
  },
  {
    q: '¿Qué pasa si mi proveedor sólo recibe por banco?',
    a: 'Conversémoslo antes. Nosotros entregamos dólar digital en la billetera que nos indiques y no depositamos dinero en cuentas bancarias en el extranjero. Si tu proveedor sólo opera con su banco, esa última conversión es un proceso distinto que DLPay no realiza.',
  },
  {
    // PENDIENTE DE DECISIÓN — D6 (monto mínimo real). Y REQUIERE VALIDACIÓN DE
    // COMPLIANCE: la respuesta toca condiciones comerciales, así que cae en
    // CLAUDE.md §3 y no basta con el visto bueno del equipo.
    //
    // Va SIN cifra a propósito: dice lo que hoy sí se puede afirmar. Cuando D6
    // se cierre, la cifra entra sin reescribir la respuesta — y este comentario
    // es lo que hará que alguien la revise entonces.
    q: '¿Desde qué volumen conviene?',
    a: 'Las condiciones se conversan según volumen y frecuencia: no publicamos una tabla por tramos. La operación pesa donde el spread de un banco pesa de verdad y una app retail no alcanza.',
  },
];

export const onboarding: string[] = [
  'Nos escribes y conversamos qué necesita tu empresa: a dónde paga, con qué frecuencia y en qué montos',
  'Nos envías los documentos de la sociedad y de quienes la representan',
  'Revisamos y habilitamos la cuenta',
  'Operas con tu ejecutivo asignado',
];

/**
 * Contenido de /empresas. Lenguaje B2B: tesorería, liquidez, operaciones
 * recurrentes (phase-2.5 §4).
 *
 * REGLA: nada de cifras de volumen, número de clientes ni logos de empresas
 * hasta tener el dato verificable y la autorización (phase-2.5 §5, D10).
 */

export interface UseCase {
  title: string;
  body: string;
}

export interface Difference {
  aspect: string;
  person: string;
  company: string;
}

export const useCases: UseCase[] = [
  {
    title: 'Pagos a proveedores en el exterior',
    body: 'Conviertes a dólar digital y pagas a proveedores que operan con él, sin la cadena de bancos corresponsales ni sus horarios. Si tu proveedor sólo recibe por banco, conversémoslo antes.',
  },
  {
    title: 'Tesorería en dólares',
    body: 'Mantienes parte de la caja en dólar digital y la conviertes de vuelta a pesos cuando la necesitas, sin abrir una cuenta en el extranjero.',
  },
  {
    title: 'Pagos recurrentes al exterior',
    body: 'Servicios, equipos o proveedores fijos que reciben en dólar digital. Tu ejecutivo ya conoce la operación y el ida y vuelta se acorta cada mes.',
  },
  {
    title: 'Cambio de divisas por volumen',
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
export const onboarding: string[] = [
  'Nos escribes y conversamos qué necesita tu empresa: a dónde paga, con qué frecuencia y en qué montos',
  'Nos envías los documentos de la sociedad y de quienes la representan',
  'Revisamos y habilitamos la cuenta',
  'Operas con tu ejecutivo asignado',
];

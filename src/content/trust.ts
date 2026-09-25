/**
 * Contenido de /confianza (phase-2.5 §5).
 *
 * REGLA DURA: aquí sólo va lo que DLPay puede respaldar HOY. Nada de cifras de
 * clientes o volumen, testimonios, logos, sellos ni afirmaciones regulatorias.
 * "Es preferible una web con menos badges pero 100% verificables" (Fase 1 §14.3).
 */
import type { IconName } from '../components/Icon.astro';

export interface Mechanism {
  icon: 'bank' | 'clock' | 'people';
  title: string;
  body: string;
}

/** El mecanismo explicado. La confianza se muestra, no se afirma. */
export const mechanisms: Mechanism[] = [
  {
    icon: 'bank',
    // REQUIERE VALIDACIÓN DE COMPLIANCE — mención del banco por nombre
    title: 'El dinero pasa por un banco, no por un intermediario opaco',
    body: 'Tu transferencia llega a la cuenta de DLPay en BCI y confirmamos que está acreditada antes de mover nada. No hay pasos a ciegas ni depósitos a cuentas de terceros.',
  },
  {
    icon: 'people',
    title: 'Una persona identificable cierra tu operación',
    body: 'No cierras contra un sistema automático. Un ejecutivo del equipo te confirma el precio final, coordina el destino del dinero y te avisa cuando la operación está lista.',
  },
  {
    icon: 'clock',
    title: 'El precio es referencial y lo decimos antes',
    body: 'El mercado se mueve, así que el número de la web es una referencia y el precio final te lo confirma tu ejecutivo. Preferimos decírtelo antes de que operes, no después.',
  },
];

/**
 * Dónde está el dinero en cada momento, y quién lo tiene.
 *
 * Es una línea de tiempo de TENENCIA, no de pasos: el eje no es «qué ocurre»
 * sino «de quién es la cuenta donde está la plata». Sólo un tramo es nuestro, y
 * eso es exactamente lo que la página necesita mostrar en vez de afirmar.
 *
 * Va acá y no escrito en la página porque son DATOS, igual que `mechanisms`:
 * el día que cambie el banco o el recorrido, se cambia en un sitio.
 *
 * Nada de esto es un claim nuevo, y desde el 2026-09-25 afirma **menos** que
 * antes: el nombre del banco salió de `phases` al subir la figura a la portada
 * y se queda sólo en `mechanisms`, con su marcador. «Lo tenemos nosotros» es la
 * misma afirmación dicha en primera persona.
 */
export interface Phase {
  /** Dónde está el dinero. */
  place: string;
  /** Quién lo tiene. */
  who: string;
  /** `true` sólo en el tramo que está en una cuenta de DLPay. */
  ours?: boolean;
  /** Hito colgado del tramo, cuando hay algo que marcar. */
  note?: string;
}

export const phases: readonly Phase[] = [
  { place: 'En tu cuenta bancaria', who: 'Lo tienes tú' },
  {
    /*
      **Sin el nombre del banco, por decisión de Sebastián del 2026-09-25**, al
      subir esta figura a la portada de `/confianza`.

      Decía «En la cuenta de DLPay en BCI» y llevaba el marcador de Compliance
      que acompaña a toda mención del banco por nombre. En mitad de la página
      era una frase más; sobre el pliegue, en verde y rotulando el único tramo
      nuestro, pasaba a ser lo primero que alguien lee en la página cuyo
      argumento es «confianza que se comprueba». Es el error del `PendingNotice`
      con otra ropa: un claim pendiente de validación que gana peso al cambiar
      de sitio.

      **Quitar el nombre ESTRECHA la afirmación, no la amplía**, así que no
      necesita firma nueva: decir «la cuenta de DLPay» afirma menos que decir en
      qué banco está. Y por eso este campo ya no lleva marcador — el claim que
      lo pedía dejó de estar aquí.

      El banco **sigue publicado en la página**, una vez, en `mechanisms`, con
      su marcador y a la altura donde siempre estuvo. De tres menciones se pasó
      a una.
    */
    place: 'En la cuenta de DLPay',
    who: 'Lo tenemos nosotros',
    ours: true,
    note: 'Acá confirmamos que llegó, antes de mover nada',
  },
  { place: 'En tu billetera', who: 'Lo tienes tú' },
];

/**
 * Lo que NO afirmamos. Una web que dice lo que no puede probar es menos creíble,
 * no más. Esta sección es una decisión de marca, no un descargo legal.
 */
export const honesty: { claim: string; reality: string }[] = [
  {
    claim: 'No decimos que estamos regulados por la CMF',
    reality: 'Porque no corresponde afirmarlo. Si alguna vez cambia, lo diremos con el respaldo a la vista.',
  },
  {
    claim: 'No publicamos cifras de clientes ni de volumen',
    reality: 'No tenemos un dato auditado que podamos mostrar, y un número sin respaldo no construye confianza.',
  },
  {
    claim: 'No mostramos testimonios',
    reality: 'Hasta poder verificarlos y contar con el consentimiento de quien los da.',
  },
  {
    claim: 'No decimos que depositamos en cuentas bancarias en el extranjero',
    reality: 'Nuestro servicio es el cambio de divisas: te entregamos dólar digital en tu billetera. Convertirlo a moneda local en destino es un proceso distinto que no realizamos.',
  },
  {
    claim: 'No prometemos rentabilidad ni protección del capital',
    reality: 'El valor del dólar se mueve, y las operaciones que usan dólar digital son irreversibles una vez ejecutadas. Por eso confirmamos cada paso contigo antes de darlo.',
  },
];

/** Qué pedimos y por qué. Explicar el requisito baja la fricción. */
/**
 * Los requisitos. El icono entró el 2026-09-23 y sale del dato, como en
 * `mechanisms`: reordenar la lista no despareja el dibujo del texto.
 *
 * **Van con `Icon` suelto y NO con `IconBadge`**, y la distinción es de
 * significado, no de estilo: en esta misma página «Qué pasa con tu plata» usa
 * insignias. **Insignia = lo que hacemos nosotros; icono suelto = lo que traes
 * tú.** Repetir las pastillas acá dejaría la página en una pared de píldoras y
 * borraría una diferencia que sí existe.
 */
export const requirements: { icon: IconName; title: string; body: string }[] = [
  {
    icon: 'documento',
    title: 'Verificación de identidad',
    body: 'A todas las personas, sin excepción, antes de la primera operación. Nos permite saber con quién operamos y es parte del cumplimiento que exige trabajar con un banco.',
  },
  {
    icon: 'empresa',
    title: 'Verificación de la empresa',
    body: 'Para empresas pedimos los documentos de la sociedad y de quienes la representan legalmente.',
  },
  {
    icon: 'bank',
    title: 'Cuenta bancaria a tu nombre',
    body: 'Recibimos transferencias sólo desde cuentas del titular de la operación. No operamos con fondos de terceros.',
  },
];

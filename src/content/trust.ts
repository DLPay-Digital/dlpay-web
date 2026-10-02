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

/*
  ── `Phase` y `phases` se retiraron el 2026-09-30 ──────────────────────────

  Eran la **línea de tenencia**: tres tramos —«En tu cuenta bancaria», «En la
  cuenta de DLPay», «En tu billetera»— con quién tenía el dinero en cada uno.
  Alimentaban la portada de `/confianza` y, copiada, la figura del puente de
  `/tarifas`.

  **La portada pasó a ser un objeto**: los tres avisos que le llegan al teléfono
  al cliente, en `components/TelefonoAvisos.astro`. Dicen los mismos tres
  momentos y en el mismo orden, pero **contados por quien tiene el dinero en
  cada uno** —su banco, nosotros, su billetera—, y dos de los tres no los
  escribe DLPay. Eso es lo que el titular de esa página promete y la línea no
  hacía: que se comprueba.

  **El puente de `/tarifas` se movió con ella**, porque enseñaba la línea como
  anticipo del destino. Usa el mismo componente con `forma="puente"`, y el
  porqué de compartirlo —en vez de copiarlo, que es lo que hacen los otros
  cuatro puentes— está en su cabecera: los avisos llevan firma de Compliance y
  dos copias de una cadena firmada es cómo el sitio acaba diciendo dos cosas.

  **Lo que se pierde con el dato, y dónde quedó a salvo.** La decisión de
  Sebastián del 2026-09-25 —sacar el nombre del banco de este archivo al subir
  la figura a la portada, porque un claim pendiente de validación gana peso al
  cambiar de sitio— vivía en un comentario de `phases`. Está registrada en
  `cowork/README.md`, en la integración de `2026-09-25-confianza-v2`, y **el
  banco sigue publicado una sola vez**, en `mechanisms`, con su marcador.

  Y la frase «la cuenta de DLPay» **no se perdió**: es la que dice hoy el aviso
  del banco, mientras D9 siga abierta.
*/

/**
 * Lo que NO afirmamos. Una web que dice lo que no puede probar es menos creíble,
 * no más. Esta sección es una decisión de marca, no un descargo legal.
 */
export const honesty: { claim: string; reality: string }[] = [
  {
    /*
      CLAIM REGULATORIO — afirmado por DLPay (Sebastián, 2026-09-29).
      Mismo trato que el de la UAF en `lib/config/alliances.ts`: quién lo afirma
      y cuándo, y el alcance fijado en la propia frase.

      Hasta hoy decía «No decimos que estamos regulados por la CMF» → «Porque no
      corresponde afirmarlo». Sebastián informó que el proceso de inscripción
      está en curso, así que la versión anterior había dejado de ser exacta: no
      es que no corresponda afirmarlo, es que todavía no ha terminado.

      **Lo que la frase dice y hasta dónde llega.** Dice que el trámite está en
      curso, y nada más. No dice, ni puede insinuar, que estar en proceso
      habilite a operar ni equivalga a estar inscrito: eso sigue prohibido por
      `CLAUDE.md` §6, que se acotó el mismo día para permitir exactamente esto y
      nada más. Ampliar la redacción es un claim distinto y vuelve a necesitar
      aprobación.

      Y conserva la promesa que la versión anterior ya publicaba —«lo diremos
      con el respaldo a la vista»—, que es lo que obliga a enseñar el respaldo
      cuando el trámite termine.
    */
    claim: 'No decimos que estamos inscritos en la CMF',
    reality:
      'Porque todavía no lo estamos: el proceso de inscripción está en curso. Cuando termine, lo diremos con el respaldo a la vista.',
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
 *
 * **Desde el 2026-10-02 el icono va en una placa CUADRADA, dentro de la
 * carpeta** (`CarpetaRequisitos.astro`). La distinción no cambia, se hace más
 * visible: **placa cuadrada = lo que traes tú; insignia redonda = lo que
 * hacemos nosotros.** Sigue sin ser `IconBadge`, que es lo que importa de la
 * regla de arriba; lo que gana es forma propia en vez de un icono suelto.
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

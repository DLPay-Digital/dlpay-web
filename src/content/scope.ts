/**
 * Dónde termina el servicio de DLPay, como dato.
 *
 * Es la regla dura de CLAUDE.md §1 —«prohibido afirmar o sugerir que DLPay
 * deposita en una cuenta bancaria en el extranjero»— convertida en contenido
 * tipado, para que las tres páginas que la declaran digan exactamente lo mismo.
 * Si una derivara, el sitio dejaría de coincidir consigo mismo sobre hasta dónde
 * llega el servicio, que es justo lo que no puede pasar.
 *
 * ── Nada de esto es copy nuevo ──────────────────────────────────────────────
 *
 * · La bisagra es la frase literal del paso 06 de `content/process.ts`.
 *   Se REPITE a propósito: una vez dentro del recorrido y otra como conclusión.
 *   No son dos versiones que puedan desincronizarse — es el mismo texto.
 * · Las tres opciones y la salvedad son las del bloque «Dónde termina nuestra
 *   operación» que `/como-funciona` ya publicaba en prosa.
 * · El vocabulario de empresas sale de `content/business.ts`.
 */

export interface Milestone {
  /** Qué ocurre, o dónde está el dinero. */
  what: string;
  /** El dato que lo acompaña: moneda, tiempo, quién. Opcional. */
  data?: string;
}

export interface Hinge {
  /** Lo que afirmamos de nosotros. */
  until: string;
  /** Lo que pasa a ser del cliente. */
  from: string;
}

/**
 * La bisagra, palabra por palabra como la escribe `process.ts` en el paso 06:
 * «Ahí termina nuestra operación: desde ese punto decides tú».
 */
export const hinge: Hinge = {
  until: 'Ahí termina nuestra operación:',
  from: 'desde ese punto decides tú',
};

/** Lo que el cliente puede hacer desde su billetera. El tercero es el límite. */
export const options: readonly string[] = [
  'Lo mantienes',
  'Se lo envías a otra persona',
  'Lo conviertes a moneda local en destino',
];

/**
 * El tramo que sí hacemos, en vocabulario de empresa.
 *
 * **Su gemelo para personas —`ourLeg`— se retiró el 2026-09-25**, cuando
 * Sebastián sacó el eje de alcance de la banda del globo y esa Home se quedó
 * con titular, bajada y globo. Era su único consumidor, así que el dato quedaba
 * sin nadie que lo leyera: un `export` que nadie importa es código muerto con
 * apariencia de contenido, y el día que alguien lo vuelva a usar no sabría si
 * sigue siendo lo que el sitio afirma.
 *
 * Decía, palabra por palabra, «tus pesos, en tu banco en Chile» · «cambiamos y
 * verificamos» · «dólar digital en tu billetera», y está en el historial si
 * vuelve a hacer falta. La asimetría de este archivo —bisagra y opciones para
 * los dos públicos, hitos sólo para empresas— es esa decisión y no un olvido.
 *
 * La bisagra cambia de posesivo —«nuestra parte» y no «nuestra operación»—
 * porque en /empresas el interlocutor es la sociedad y no la persona.
 */
export const ourLegBusiness: readonly Milestone[] = [
  { what: 'Los pesos de tu empresa', data: 'CLP' },
  { what: 'Cambiamos y verificamos', data: 'tu ejecutivo cierra' },
  { what: 'Dólar digital en la billetera que indiques', data: 'USD' },
];

export const hingeBusiness: Hinge = {
  until: 'Ahí termina nuestra parte:',
  from: 'desde ese punto decide tu empresa',
};

/** Las tres salidas de una empresa, sacadas de los casos de `business.ts`. */
export const optionsBusiness: readonly string[] = [
  'Pagas a un proveedor que opera con dólar digital',
  'Lo mantienes como tesorería en dólares',
  'Lo conviertes a moneda local en destino',
];

/**
 * Dónde termina el servicio de DLPay, como dato.
 *
 * Es la regla dura de CLAUDE.md §1 —«prohibido afirmar o sugerir que DLPay
 * deposita en una cuenta bancaria en el extranjero»— convertida en contenido
 * tipado, para que las tres páginas que la declaran digan exactamente lo mismo.
 * Si una derivara, el sitio dejaría de coincidir consigo mismo sobre hasta dónde
 * llega el servicio, que es justo lo que no puede pasar.
 *
 * ── Reescrito el 2026-10-22 (ADR-0014): el límite se movió ─────────────────
 *
 * Este archivo nació para que tres páginas no pudieran contradecirse sobre
 * dónde TERMINA el servicio, cuando terminaba en una billetera. **Ahora el
 * servicio llega hasta la moneda local del destino**, así que lo que hay que
 * mantener coherente es lo contrario: hasta dónde LLEGA.
 *
 * Lo que eso se llevó por delante, y conviene saberlo antes de buscarlo:
 *
 * · **`options` y `optionsBusiness` se retiran.** Eran las tres cosas que el
 *   cliente podía hacer *desde su billetera*, y la tercera —«lo conviertes a
 *   moneda local en destino»— era la frontera del servicio. Esa frontera es
 *   justo la que se cruzó: lo que era el límite pasó a ser el final del
 *   recorrido, así que las tres opciones se quedaron sin sujeto.
 * · **`ourLeg` vuelve.** Se había retirado el 2026-09-25 por quedarse sin
 *   consumidor, con la nota de que estaba en el historial «si vuelve a hacer
 *   falta». Hizo falta: con el recorrido entero contado, los hitos del tramo
 *   son otra vez el dato de la figura.
 * · **La bisagra cambia de oficio.** Decía dónde soltábamos; dice hasta dónde
 *   llegamos.
 *
 * ── El escalón de ADR-0013, del día anterior ───────────────────────────────
 *
 * Pasó de una divisa a doce y dejó el límite donde estaba. De aquella enmienda
 * sobrevive todo menos eso.
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
 * La bisagra, palabra por palabra como la escribe `process.ts` en el paso 06.
 *
 * Se REPITE a propósito: una vez dentro del recorrido y otra como conclusión.
 * No son dos versiones que puedan desincronizarse — es el mismo texto, y si se
 * toca acá hay que tocarlo allá.
 *
 * REQUIERE VALIDACIÓN DE COMPLIANCE — que el dinero llega a destino en la
 * moneda de ese destino (ADR-0014).
 */
export const hinge: Hinge = {
  until: 'Nos ocupamos del recorrido completo:',
  from: 'hasta que el dinero llega a destino',
};

/**
 * Los hitos del recorrido, del banco del cliente al destino.
 *
 * El tercero es el que ADR-0014 habilita y el que lleva el marcador de arriba.
 * **No nombra el canal** —cuenta bancaria, efectivo, billetera local— porque
 * cambia según el país y nadie lo ha decidido: `CLAUDE.md` §1 pide decir el
 * resultado y no el medio, y D16 está reabierta justo por eso.
 */
export const ourLeg: readonly Milestone[] = [
  { what: 'Tus pesos, en tu banco en Chile', data: 'CLP' },
  { what: 'Cambiamos y verificamos', data: 'tu ejecutivo cierra' },
  { what: 'Llega en la moneda del destino', data: 'quien recibe, cobra' },
];

/**
 * Lo que el sitio NO promete, y es el límite que queda.
 *
 * Un servicio que cubre el recorrido entero sigue teniendo bordes; lo que pasa
 * es que son otros. Estos dos son los que `CLAUDE.md` §1 declara prohibidos
 * mientras nadie los cierre, así que se publican como lo que son: lo que te
 * confirma una persona, no lo que afirma una página.
 */
export const caveats: readonly string[] = [
  'El plazo de la entrega final te lo confirma tu ejecutivo',
  'Cómo recibe quien recibe depende del país de destino',
];

/**
 * Lo mismo en vocabulario de empresa.
 *
 * **La asimetría de este archivo desapareció el 2026-10-22.** Tenía bisagra y
 * opciones para los dos públicos y hitos sólo para empresas, porque `ourLeg`
 * se había retirado el 2026-09-25 al quedarse sin consumidor. Ahora los dos
 * públicos tienen las tres cosas, y es más fácil de leer.
 *
 * La bisagra cambia de posesivo —«nuestra parte» y no «nuestra operación»—
 * porque en /empresas el interlocutor es la sociedad y no la persona.
 *
 * REQUIERE VALIDACIÓN DE COMPLIANCE — el tercer hito (ADR-0014).
 */
export const ourLegBusiness: readonly Milestone[] = [
  { what: 'Los pesos de tu empresa', data: 'CLP' },
  { what: 'Cambiamos y verificamos', data: 'tu ejecutivo cierra' },
  { what: 'Llega en la moneda del destino', data: 'a quien indiques' },
];

export const hingeBusiness: Hinge = {
  until: 'Nos ocupamos del recorrido completo:',
  from: 'hasta que el dinero llega a destino',
};

export const caveatsBusiness: readonly string[] = [
  'El plazo de la entrega final lo confirma tu ejecutivo',
  'Cómo recibe tu proveedor depende de su país',
];

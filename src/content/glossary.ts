/**
 * El vocabulario del sitio, como dato.
 *
 * Ocho términos que aparecen en todas las páginas y que hasta el 2026-09-23 no
 * se definían en ninguna. Viven acá y no dentro de `/preguntas` por el mismo
 * motivo que `content/scope.ts`: son contenido, y el día que una definición
 * cambie tiene que cambiar en un solo sitio.
 *
 * ── De dónde sale cada definición ──────────────────────────────────────────
 *
 * Cinco están escritas con palabras que el sitio YA publica, y cada una dice
 * dónde en su comentario. No son paráfrasis: se tomaron de la respuesta o del
 * párrafo que ya existía, para que el glosario no pueda contradecir a la página
 * que explica el término.
 *
 * Tres son copy nuevo —`stablecoin`, `billetera` y `red`—, aprobados por
 * Sebastián como Compliance el 2026-09-23. Van sin cifras, sin plazos y **sin
 * nombrar ninguna red concreta**: nombrarlas sería una decisión de producto, no
 * de redacción, y hoy no está tomada.
 *
 * ── El enlace, y el que falta ──────────────────────────────────────────────
 *
 * `href` es OPCIONAL a propósito y `red` no lo lleva, porque el sitio no explica
 * ese término en ninguna parte. El hueco queda anotado acá, y el día que exista
 * la página que lo explique, este archivo lo dirá. **En la página ya no se ve**
 * desde el 2026-10-26: decía «El sitio todavía no lo explica en ninguna parte»,
 * y un cliente lo leía como una nota olvidada (lo aprobó Sebastián).
 *
 * El texto del enlace nombra el DESTINO —«Tarifas», «Confianza»— y no dice
 * «dónde se explica»: con la misma frase repetida siete veces la columna se
 * vuelve una retahíla que no informa de nada.
 */

export interface Term {
  /** El término, tal como el sitio lo usa. */
  term: string;
  /** La definición. Una o dos frases; nunca una cifra sin fuente. */
  definition: string;
  /** Dónde se explica de verdad. Opcional: no todos tienen dónde. */
  href?: string;
  /** El nombre del destino, no «ver más». Obligatorio si hay `href`. */
  linkLabel?: string;
}

export const glossary: readonly Term[] = [
  {
    // ── Tres nombres en tres días, y el último es el bueno ──────────────
    //
    // Fue «Dólar digital» hasta el 2026-10-21 y «Divisa digital» hasta el 22.
    // Hoy es **«Divisa», a secas**, por decisión de Sebastián.
    //
    // El motivo no es de estilo: la definición terminaba en «Es lo que te
    // entregamos», y desde ADR-0014 **eso dejó de ser cierto** — lo que se
    // entrega es la moneda local del destino, no una versión digital de nada.
    // Lo detectó Cowork revisando staging. Con el claim fuera, lo que queda es
    // la palabra que el sitio usa de verdad en todas sus páginas.
    //
    // **El mecanismo no se pierde ni se esconde:** vive en la entrada
    // «Stablecoin», justo debajo, que es donde ADR-0013 lo deja — fuera del
    // mensaje comercial y dentro de lo educativo. Por eso esta entrada deja de
    // apuntar al artículo de activos tokenizados, que explica el riel y no la
    // palabra, y apunta a donde se explica la operación.
    term: 'Divisa',
    definition:
      'La moneda de otro país. Cambiar divisas es pasar de una a otra —de tus pesos a la moneda del destino— al precio de ese momento.',
    href: '/como-funciona/',
    linkLabel: 'Cómo funciona',
  },
  {
    // Copy nuevo, aprobado el 2026-09-23. Sin nombrar redes.
    term: 'Stablecoin',
    definition:
      'Una moneda digital diseñada para mantener su valor pegado al de otra moneda. Es por donde viaja el dinero mientras cruza, no lo que recibe quien recibe.',
    href: '/blog/activos-tokenizados-que-son-y-quien-los-construye/',
    linkLabel: 'En el blog',
  },
  {
    // Palabras de `home.ts`, respuesta «¿El precio de la web es el precio
    // final?», reescrita el 2026-10-27 con el tarifario.
    term: 'Precio referencial',
    definition:
      'La tasa que ves en la web: la de mercado en ese momento, sin recargo. Tu ejecutivo te confirma la final al cerrar, porque el mercado se mueve.',
    href: '/tarifas/',
    linkLabel: 'Tarifas',
  },
  /*
    **Las dos entradas de lo que cobramos, desde el 2026-10-27.** Son los dos
    nombres que el cotizador pone en el tramo, y un cliente que los lee ahí por
    primera vez los busca acá. Dicen lo mismo que `/tarifas`, con sus palabras.
    REQUIERE VALIDACIÓN DE COMPLIANCE.
  */
  {
    term: 'Costo de envío',
    definition:
      'Un monto fijo por operación, según el destino. Cubre el costo fijo del envío y nada más: se calcula en dólares y se pasa a pesos con el dólar del día.',
    href: '/tarifas/',
    linkLabel: 'Tarifas',
  },
  {
    term: 'Comisión de cambio',
    definition:
      'Un porcentaje de lo que envías, después del costo de envío. Depende del destino y baja con el monto. Es todo lo que DLPay cobra por cambiar.',
    href: '/tarifas/',
    linkLabel: 'Tarifas',
  },
  {
    // **Reescrita el 2026-10-27.** Decía «La diferencia que DLPay aplica sobre
    // la referencia de mercado. Ya viene incorporada en el número que ves», y
    // con el tarifario DLPay dejó de cobrar así. La palabra se queda porque el
    // blog y `/cuanto-te-cobran` la explican, y es la que un cliente necesita
    // para leer el precio de otro. REQUIERE VALIDACIÓN DE COMPLIANCE — que
    // DLPay no aplica spread.
    term: 'Spread',
    definition:
      'La diferencia entre el tipo de cambio que te ofrecen y el de mercado: un cobro que va dentro del precio y no se ve. DLPay no lo aplica: usa la tasa de mercado y cobra aparte, a la vista.',
    href: '/cuanto-te-cobran/',
    linkLabel: 'Cuánto te cobran',
  },
  {
    // Copy nuevo, aprobado el 2026-09-23. **Reescrito el 2026-10-22**: decía
    // «es donde termina nuestra operación», que era la frontera de
    // `content/scope.ts`, y ADR-0014 la movió. El término se queda porque el
    // blog lo usa y porque el autoservicio sí opera con una; lo que ya no es
    // cierto es que haga falta para que te enviemos dinero.
    term: 'Billetera',
    definition:
      'La aplicación o cuenta digital donde se guardan monedas digitales. Para enviar con nosotros no necesitas una: el dinero llega a destino en la moneda de ese país.',
    href: '/como-funciona/',
    linkLabel: 'Cómo funciona',
  },
  {
    // Copy nuevo, aprobado el 2026-09-23. SIN enlace: el sitio no lo explica en
    // ninguna parte. Ver la cabecera: el hueco se anota acá, no en la página.
    term: 'Red',
    definition:
      'El canal por el que viaja la divisa digital. Hay varias, y la que se usa cambia el tiempo y el costo del traspaso, no el valor de lo que recibes.',
  },
  {
    // Palabras de `/confianza`, «Qué te pedimos, y por qué».
    term: 'Verificación de identidad',
    definition:
      'Lo que te pedimos antes de la primera operación, a todas las personas y empresas sin excepción. Nos permite saber con quién operamos y es parte del cumplimiento que exige trabajar con un banco de por medio.',
    href: '/confianza/',
    linkLabel: 'Confianza',
  },
  {
    // Palabras de `/confianza`, «Una persona identificable cierra tu operación».
    term: 'Ejecutivo',
    definition:
      'La persona del equipo que confirma tu precio final, coordina el destino del dinero y te avisa cuando la operación está lista. No es un sistema automático.',
    href: '/confianza/',
    linkLabel: 'Confianza',
  },
];

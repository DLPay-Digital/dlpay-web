/**
 * Participación institucional publicada en el pie.
 *
 * REGLA DURA. Cada entrada es un CLAIM sobre la relación entre DLPay y una
 * institución. Ninguna se publica hasta que Compliance apruebe esa relación
 * redactada así, con ese logo y con permiso de uso de marca.
 *
 * El candado es `verified`. Mientras sea false la entrada no se renderiza:
 * el pie queda exactamente como está hoy. Mismo criterio que `isReal` en
 * lib/pricing — un dato sin respaldo no ocupa el lugar de uno respaldado.
 *
 * NO cambiar `verified` a true por tener el archivo. Se cambia cuando existe
 * la aprobación, y las dos cosas van en el mismo commit.
 */

export interface Alliance {
  /** Identificador estable. Sólo para la key del listado. */
  id: string;
  /** Nombre de la institución, escrito como ella lo escribe. */
  name: string;
  /**
   * La RELACIÓN real, no el nombre. Es el texto alternativo y por lo tanto
   * el claim que lee un lector de pantalla y que indexa un buscador.
   * "Socio de X" y "Supervisado por X" son afirmaciones muy distintas.
   */
  relationship: string;
  /** Ruta bajo public/. Fondo transparente, recortado, sin margen propio. */
  file: string;
  /** Alto de render en px. Se afina por logo: la masa óptica no es la altura. */
  height: number;
  /** Proporción ancho/alto del archivo. Reserva el espacio y evita CLS. */
  ratio?: number;
  /** Sitio de la institución. Opcional: no toda relación se enlaza. */
  href?: string;
  /** Compliance aprobó publicar esta relación con este logo. Ver cabecera. */
  verified: boolean;
}

/**
 * REQUIERE VALIDACIÓN DE COMPLIANCE — el rótulo de la fila es en sí un claim.
 * "Participación institucional" es deliberadamente neutro: no afirma respaldo,
 * acreditación ni supervisión. Cualquier variante que sí lo haga necesita
 * aprobación aparte.
 */
export const alliancesHeading = 'Participación institucional';

/**
 * Declaración visible bajo los logos.
 *
 * El claim regulatorio se dice CON PALABRAS, no se deja colgado de un emblema:
 * un logo suelto se lee como respaldo, una frase dice exactamente su alcance.
 *
 * REQUIERE VALIDACIÓN DE COMPLIANCE — afirmado por Sebastián el 2026-09-07.
 * Cualquier cambio de redacción es un claim nuevo.
 */
export const institutionalStatement =
  'está registrada y supervisada por la Unidad de Análisis Financiero (UAF).';

/*
  REQUIERE VALIDACIÓN DE COMPLIANCE — **la frase cambió de sujeto el 2026-09-24**
  sin que cambiara una palabra de su redacción.

  El pie compone `site.legalName` + esta frase. Hasta el 2026-09-24 decía «DLPZ
  INCZ SpA está registrada y supervisada por la UAF»; al cerrarse D9 pasó a decir
  **DLPZ PRO SpA**. Sebastián afirmó el registro ante la UAF y la membresía de
  FinteChile el 2026-09-07, y lo hizo sobre la OTRA sociedad.

  Un registro ante la UAF pertenece a un RUT, no a un grupo de empresas, y la
  membresía de un gremio también. **Hay que confirmar que las dos son de DLPZ PRO
  SpA**; si alguna fuera de DLPZ INCZ SpA, el pie estaría atribuyendo a una
  sociedad un registro que es de otra, que es exactamente el tipo de claim que
  este archivo existe para no dejar suelto.

  Mientras no se confirme, el `verified` de cada alianza sigue siendo el candado:
  ponerlo en `false` retira el emblema y la frase de una vez.
*/

export const alliances: readonly Alliance[] = [
  {
    id: 'fintechile',
    name: 'FinteChile',
    // REQUIERE VALIDACIÓN DE COMPLIANCE — ¿DLPZ **PRO** SpA es socio vigente?
    // La pregunta cambió de sujeto al cerrarse D9; ver la nota de arriba.
    // La membresía es verificable en el directorio público del gremio.
    relationship: 'Socio de FinteChile',
    file: '/alianzas/fintechile.png',
    height: 22,
    ratio: 5.128,
    href: 'https://fintechile.org/',
    verified: true, // Aprobado por Sebastián — 2026-09-07 (D25 cerrada)
  },
  {
    id: 'uaf',
    name: 'Unidad de Análisis Financiero',
    // CLAIM REGULATORIO — afirmado por DLPay (Sebastián, 2026-09-07).
    //
    // El registro y la supervisión de la UAF alcanzan el cumplimiento de la
    // Ley 19.913 (prevención de lavado de activos): son reales y verificables,
    // y NO equivalen a una autorización para operar ni a supervisión
    // prudencial. Por eso el texto dice exactamente "registrada y supervisada
    // por la UAF" y nada más: no "autorizada", no "certificada", no "avalada".
    //
    // Ampliar esa redacción es un claim distinto y vuelve a necesitar
    // aprobación. La prohibición de CLAUDE.md §6 sobre la CMF sigue intacta.
    relationship: 'Registrada y supervisada por la Unidad de Análisis Financiero',
    file: '/alianzas/uaf.png',
    // Más alto que FinteChile a propósito: el de la UAF es un lockup de tres
    // líneas y a 22px "GOBIERNO DE CHILE" se vuelve ilegible. A 30 pesa
    // ópticamente lo mismo que un wordmark de una línea a 22.
    height: 30,
    ratio: 6.020,
    verified: true, // Aprobado por Sebastián — 2026-09-07 (D26 cerrada)
  },
];

/** Lo único que consume el componente. Vacío = el bloque no existe. */
export const publishedAlliances = alliances.filter((a) => a.verified);

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

export const alliances: readonly Alliance[] = [
  {
    id: 'fintechile',
    name: 'FinteChile',
    // REQUIERE VALIDACIÓN DE COMPLIANCE — ¿DLPZ INCZ SpA es socio vigente?
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
    // aprobación.
    //
    // Sobre la CMF, actualizado el 2026-09-29: §6 sigue prohibiendo afirmar que
    // DLPay está regulada o autorizada por la CMF. Lo que se acotó ese día es
    // que sí se puede decir que el proceso de inscripción está en curso, y eso
    // se publica en un solo sitio: la sección «Lo que no vas a leer acá» de
    // `/confianza`, desde `content/trust.ts`. Acá no cambia nada: el emblema y
    // la frase del pie siguen siendo sólo los de la UAF.
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

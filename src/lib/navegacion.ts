/**
 * Las entradas del menú (Cowork, 2026-10-23, ADR-0018, tanda 4).
 *
 * Vivían en `Header.astro`. Salieron acá cuando la 404 empezó a enlazar tres
 * de ellas con sus mismos rótulos y descripciones: con dos copias, el día que
 * una entrada cambie de nombre en el menú, la 404 seguiría ofreciendo el viejo.
 * Los comentarios de diseño viajaron con ellas sin tocar una palabra.
 */

export interface EntradaMenu {
  label: string;
  href: string;
  detail?: string;
}

/**
 * Orden: primero a QUIÉN va dirigido y después el detalle.
 *
 * "Personas" apunta a la Home porque la Home está escrita para personas; es su
 * contrapartida de "Empresas", que sí tiene página propia. Sin ella, la Home no
 * tenía representación en el menú y la pareja Personas/Empresas no se leía.
 *
 * Efecto lateral bueno: ahora la Home marca `aria-current="page"` en su entrada,
 * cosa que antes no ocurría en ninguna ruta del menú.
 *
 * Este array alimenta la navegación de escritorio Y el cajón móvil: se ordena
 * una vez.
 */
export const navMain: EntradaMenu[] = [
  { label: 'Personas', href: '/' },
  { label: 'Empresas', href: '/empresas/' },
];

/**
 * Entradas agrupadas bajo «Información».
 *
 * REQUIERE VALIDACIÓN DE COMPLIANCE no aplica a estas descripciones porque
 * están escritas para NO abrir claim: la de Confianza dice qué verificamos y
 * qué no afirmamos, y evita a propósito la palabra «regulaciones». CLAUDE.md §6
 * prohíbe afirmar o sugerir que DLPay está regulado, y D26 fijó que el único
 * registro público admisible es «registrada y supervisada» ante la UAF.
 *
 * **El orden no es de llegada** (2026-09-23, al entrar `/precio` y
 * `/preguntas`): va de lo que explica el servicio a lo que resuelve una duda
 * suelta — cómo funciona, qué cuesta, por qué fiarse, qué leer, qué preguntar.
 * Añadir al final habría dejado «Preguntas» entre «Confianza» y «Blog» sin
 * criterio. Con cinco entradas el desplegable sigue siendo cómodo; con más
 * habría que replantearlo, no seguir añadiendo.
 */
export const navInfo: EntradaMenu[] = [
  {
    label: 'Cómo funciona',
    href: '/como-funciona/',
    detail: 'El recorrido del dinero, paso a paso',
  },
  {
    label: 'Precio',
    href: '/precio/',
    detail: 'Qué cuesta y qué no',
  },
  {
    label: 'Confianza',
    href: '/confianza/',
    detail: 'Qué verificamos y qué no afirmamos',
  },
  {
    label: 'Blog',
    href: '/blog/',
    detail: 'Qué mueve el precio del dólar',
  },
  {
    label: 'Preguntas',
    href: '/preguntas/',
    detail: 'Las dudas frecuentes y el glosario',
  },
];

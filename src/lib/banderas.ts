/**
 * Las banderas del sitio, redondas y dibujadas en código (Cowork, entrega `wise-`,
 * 2026-10-22). Sebastián eligió SVG propias y no emoji: los emoji de bandera no
 * existen en Windows, que enseña dos letras en su lugar.
 *
 * **Simplificadas a propósito, y sin escudos**, salvo una marca mínima donde
 * sin ella la bandera sería otra:
 * - México lleva un óvalo pardo y una rama, porque sin el escudo es la de Italia.
 *
 * *Ecuador y Paraguay llevaban la suya por el mismo motivo; salieron del sitio
 * con sus destinos el 2026-10-27, y con ellos Bolivia, Japón, Uruguay y
 * Venezuela. Entraron México, Costa Rica, Panamá y Sudáfrica (tarifario).*
 * Las banderas nacionales son de dominio público; estos dibujos son del proyecto.
 *
 * Cada una se dibuja en un cuadrado de 40 × 40 y la recorta un círculo en
 * `Bandera.astro`. **Sólo nombran un destino o una divisa**, siempre junto a su
 * nombre o su código: nunca solas, nunca como adorno (DS §7).
 */
export type CodigoBandera =
  | 'cl'
  | 'ar'
  | 'br'
  | 'cn'
  | 'co'
  | 'cr'
  | 'eu'
  | 'mx'
  | 'pa'
  | 'pe'
  | 'us'
  | 'za'
;

export const BANDERAS: Readonly<Record<CodigoBandera, string>> = {
  cl: '<rect width="40" height="40" fill="#fff"/><rect y="20" width="40" height="20" fill="#D52B1E"/><rect width="20" height="20" fill="#0039A6"/><path d="M10.00 5.80L10.94 8.70L13.99 8.70L11.53 10.50L12.47 13.40L10.00 11.60L7.53 13.40L8.47 10.50L6.01 8.70L9.06 8.70Z" fill="#fff"/>',
  ar: '<rect width="40" height="13.4" fill="#74ACDF"/><rect y="13.3" width="40" height="13.4" fill="#fff"/><rect y="26.6" width="40" height="13.4" fill="#74ACDF"/><circle cx="20" cy="20" r="3.6" fill="#F6B40E" stroke="#85340A" stroke-width="0.6"/>',
  br: '<rect width="40" height="40" fill="#009C3B"/><path d="M20 5 37 20 20 35 3 20Z" fill="#FFDF00"/><circle cx="20" cy="20" r="8.2" fill="#002776"/><path d="M12.2 18.2 Q20 15.6 27.9 21.6" fill="none" stroke="#fff" stroke-width="1.5"/>',
  cn: '<rect width="40" height="40" fill="#DE2910"/><path d="M11.00 6.00L12.35 10.15L16.71 10.15L13.18 12.71L14.53 16.85L11.00 14.29L7.47 16.85L8.82 12.71L5.29 10.15L9.65 10.15Z M19.00 4.10L19.43 5.41L20.81 5.41L19.69 6.22L20.12 7.54L19.00 6.73L17.88 7.54L18.31 6.22L17.19 5.41L18.57 5.41Z M22.00 7.60L22.43 8.91L23.81 8.91L22.69 9.72L23.12 11.04L22.00 10.23L20.88 11.04L21.31 9.72L20.19 8.91L21.57 8.91Z M22.00 12.10L22.43 13.41L23.81 13.41L22.69 14.22L23.12 15.54L22.00 14.73L20.88 15.54L21.31 14.22L20.19 13.41L21.57 13.41Z M19.00 15.60L19.43 16.91L20.81 16.91L19.69 17.72L20.12 19.04L19.00 18.23L17.88 19.04L18.31 17.72L17.19 16.91L18.57 16.91Z" fill="#FFDE00"/>',
  co: '<rect width="40" height="20" fill="#FCD116"/><rect y="20" width="40" height="10" fill="#003893"/><rect y="30" width="40" height="10" fill="#CE1126"/>',
  cr: '<rect width="40" height="40" fill="#fff"/><rect width="40" height="6.67" fill="#002B7F"/><rect y="33.33" width="40" height="6.67" fill="#002B7F"/><rect y="13.33" width="40" height="13.34" fill="#CE1126"/>',
  eu: '<rect width="40" height="40" fill="#003399"/><path d="M20.00 7.10L20.43 8.41L21.81 8.41L20.69 9.22L21.12 10.54L20.00 9.73L18.88 10.54L19.31 9.22L18.19 8.41L19.57 8.41Z M25.50 8.57L25.93 9.89L27.31 9.89L26.19 10.70L26.62 12.01L25.50 11.20L24.38 12.01L24.81 10.70L23.69 9.89L25.07 9.89Z M29.53 12.60L29.95 13.91L31.33 13.91L30.22 14.72L30.64 16.04L29.53 15.23L28.41 16.04L28.84 14.72L27.72 13.91L29.10 13.91Z M31.00 18.10L31.43 19.41L32.81 19.41L31.69 20.22L32.12 21.54L31.00 20.73L29.88 21.54L30.31 20.22L29.19 19.41L30.57 19.41Z M29.53 23.60L29.95 24.91L31.33 24.91L30.22 25.72L30.64 27.04L29.53 26.23L28.41 27.04L28.84 25.72L27.72 24.91L29.10 24.91Z M25.50 27.63L25.93 28.94L27.31 28.94L26.19 29.75L26.62 31.06L25.50 30.25L24.38 31.06L24.81 29.75L23.69 28.94L25.07 28.94Z M20.00 29.10L20.43 30.41L21.81 30.41L20.69 31.22L21.12 32.54L20.00 31.73L18.88 32.54L19.31 31.22L18.19 30.41L19.57 30.41Z M14.50 27.63L14.93 28.94L16.31 28.94L15.19 29.75L15.62 31.06L14.50 30.25L13.38 31.06L13.81 29.75L12.69 28.94L14.07 28.94Z M10.47 23.60L10.90 24.91L12.28 24.91L11.16 25.72L11.59 27.04L10.47 26.23L9.36 27.04L9.78 25.72L8.67 24.91L10.05 24.91Z M9.00 18.10L9.43 19.41L10.81 19.41L9.69 20.22L10.12 21.54L9.00 20.73L7.88 21.54L8.31 20.22L7.19 19.41L8.57 19.41Z M10.47 12.60L10.90 13.91L12.28 13.91L11.16 14.72L11.59 16.04L10.47 15.23L9.36 16.04L9.78 14.72L8.67 13.91L10.05 13.91Z M14.50 8.57L14.93 9.89L16.31 9.89L15.19 10.70L15.62 12.01L14.50 11.20L13.38 12.01L13.81 10.70L12.69 9.89L14.07 9.89Z" fill="#FFCC00"/>',
  mx: '<rect width="13.4" height="40" fill="#006847"/><rect x="13.3" width="13.4" height="40" fill="#fff"/><rect x="26.6" width="13.4" height="40" fill="#CE1126"/><ellipse cx="20" cy="19.2" rx="3" ry="3.6" fill="#8C5A2B"/><path d="M15.9 22.1 Q20 26 24.1 22.1" fill="none" stroke="#2E7D32" stroke-width="1.2"/>',
  pa: '<rect width="40" height="40" fill="#fff"/><rect x="20" width="20" height="20" fill="#D21034"/><rect y="20" width="20" height="20" fill="#005293"/><path d="M10.00 5.40L11.09 8.50L14.37 8.58L11.76 10.57L12.70 13.72L10.00 11.85L7.30 13.72L8.24 10.57L5.63 8.58L8.91 8.50Z" fill="#005293"/><path d="M30.00 25.40L31.09 28.50L34.37 28.58L31.76 30.57L32.70 33.72L30.00 31.85L27.30 33.72L28.24 30.57L25.63 28.58L28.91 28.50Z" fill="#D21034"/>',
  pe: '<rect width="40" height="40" fill="#fff"/><rect width="13.4" height="40" fill="#D91023"/><rect x="26.6" width="13.4" height="40" fill="#D91023"/>',
  us: '<rect width="40" height="40" fill="#fff"/><rect y="0.000" width="40" height="3.127" fill="#B22234"/><rect y="6.154" width="40" height="3.127" fill="#B22234"/><rect y="12.308" width="40" height="3.127" fill="#B22234"/><rect y="18.462" width="40" height="3.127" fill="#B22234"/><rect y="24.615" width="40" height="3.127" fill="#B22234"/><rect y="30.769" width="40" height="3.127" fill="#B22234"/><rect y="36.923" width="40" height="3.127" fill="#B22234"/><rect width="18" height="21.6" fill="#3C3B6E"/><circle cx="3.0" cy="3.0" r="0.9" fill="#fff"/><circle cx="7.0" cy="3.0" r="0.9" fill="#fff"/><circle cx="11.0" cy="3.0" r="0.9" fill="#fff"/><circle cx="15.0" cy="3.0" r="0.9" fill="#fff"/><circle cx="3.0" cy="7.2" r="0.9" fill="#fff"/><circle cx="7.0" cy="7.2" r="0.9" fill="#fff"/><circle cx="11.0" cy="7.2" r="0.9" fill="#fff"/><circle cx="15.0" cy="7.2" r="0.9" fill="#fff"/><circle cx="3.0" cy="11.4" r="0.9" fill="#fff"/><circle cx="7.0" cy="11.4" r="0.9" fill="#fff"/><circle cx="11.0" cy="11.4" r="0.9" fill="#fff"/><circle cx="15.0" cy="11.4" r="0.9" fill="#fff"/><circle cx="3.0" cy="15.6" r="0.9" fill="#fff"/><circle cx="7.0" cy="15.6" r="0.9" fill="#fff"/><circle cx="11.0" cy="15.6" r="0.9" fill="#fff"/><circle cx="15.0" cy="15.6" r="0.9" fill="#fff"/><circle cx="3.0" cy="19.8" r="0.9" fill="#fff"/><circle cx="7.0" cy="19.8" r="0.9" fill="#fff"/><circle cx="11.0" cy="19.8" r="0.9" fill="#fff"/><circle cx="15.0" cy="19.8" r="0.9" fill="#fff"/>',
  za: '<rect width="40" height="20" fill="#E03C31"/><rect y="20" width="40" height="20" fill="#001489"/><path d="M-1 -1 L17 20 L-1 41 M17 20 H41" fill="none" stroke="#fff" stroke-width="13"/><path d="M-1 -1 L17 20 L-1 41 M17 20 H41" fill="none" stroke="#007749" stroke-width="8"/><path d="M0 6.2 L11.8 20 L0 33.8Z" fill="#FFB81C"/><path d="M0 9.6 L8.9 20 L0 30.4Z" fill="#000"/>',
};

/**
 * Todos los códigos, para quien necesita la colección entera (la plantilla de la
 * que el cotizador copia las banderas de sus fichas). Se declara acá y no en el
 * componente: un `as` en la cabecera de un `.astro` le hace perder a Astro el
 * tipo de sus `Props` (comprobado el 2026-10-22 con `@astrojs/compiler`).
 */
export const CODIGOS_BANDERA = Object.keys(BANDERAS) as CodigoBandera[];

/** El país de cada destino del catálogo. */
const DE_DESTINO: Readonly<Record<string, CodigoBandera>> = {
  Argentina: 'ar', Brasil: 'br', Chile: 'cl', China: 'cn', Colombia: 'co', 'Costa Rica': 'cr',
  'Estados Unidos': 'us', Europa: 'eu', México: 'mx', Panamá: 'pa', Perú: 'pe', Sudáfrica: 'za',
};

/**
 * La bandera de cada divisa, para cuando no hay un país sino una moneda: el
 * selector de «Pasar a pesos» y la ficha de la moneda. El dólar es el de Estados
 * Unidos aunque también llegue a China y a Panamá: es la bandera de quien lo
 * emite.
 */
const DE_DIVISA: Readonly<Record<string, CodigoBandera>> = {
  CLP: 'cl', USD: 'us', EUR: 'eu', ARS: 'ar', BRL: 'br', COP: 'co', CRC: 'cr',
  MXN: 'mx', PEN: 'pe', ZAR: 'za',
};

export function banderaDeDestino(destino: string): CodigoBandera | undefined {
  return DE_DESTINO[destino];
}

export function banderaDeDivisa(codigo: string): CodigoBandera | undefined {
  return DE_DIVISA[codigo];
}

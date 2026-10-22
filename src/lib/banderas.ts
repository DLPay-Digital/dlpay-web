/**
 * Las banderas del sitio, redondas y dibujadas en código (Cowork, entrega `wise-`,
 * 2026-10-22). Sebastián eligió SVG propias y no emoji: los emoji de bandera no
 * existen en Windows, que enseña dos letras en su lugar.
 *
 * **Simplificadas a propósito, y sin escudos**, salvo dos marcas mínimas:
 * - Ecuador lleva un óvalo y el cóndor, porque sin escudo es la bandera de Colombia;
 * - Paraguay lleva el sello, por la misma razón frente a otras tricolores.
 * Las banderas nacionales son de dominio público; estos dibujos son del proyecto.
 *
 * Cada una se dibuja en un cuadrado de 40 × 40 y la recorta un círculo en
 * `Bandera.astro`. **Sólo nombran un destino o una divisa**, siempre junto a su
 * nombre o su código: nunca solas, nunca como adorno (DS §7).
 */
export type CodigoBandera =
  | 'cl'
  | 'ar'
  | 'bo'
  | 'br'
  | 'cn'
  | 'co'
  | 'ec'
  | 'eu'
  | 'jp'
  | 'py'
  | 'pe'
  | 'uy'
  | 'us'
  | 've'
;

export const BANDERAS: Readonly<Record<CodigoBandera, string>> = {
  cl: '<rect width="40" height="40" fill="#fff"/><rect y="20" width="40" height="20" fill="#D52B1E"/><rect width="20" height="20" fill="#0039A6"/><path d="M10.00 5.80L10.94 8.70L13.99 8.70L11.53 10.50L12.47 13.40L10.00 11.60L7.53 13.40L8.47 10.50L6.01 8.70L9.06 8.70Z" fill="#fff"/>',
  ar: '<rect width="40" height="13.4" fill="#74ACDF"/><rect y="13.3" width="40" height="13.4" fill="#fff"/><rect y="26.6" width="40" height="13.4" fill="#74ACDF"/><circle cx="20" cy="20" r="3.6" fill="#F6B40E" stroke="#85340A" stroke-width="0.6"/>',
  bo: '<rect width="40" height="13.4" fill="#D52B1E"/><rect y="13.3" width="40" height="13.4" fill="#F9E300"/><rect y="26.6" width="40" height="13.4" fill="#007934"/>',
  br: '<rect width="40" height="40" fill="#009C3B"/><path d="M20 5 37 20 20 35 3 20Z" fill="#FFDF00"/><circle cx="20" cy="20" r="8.2" fill="#002776"/><path d="M12.2 18.2 Q20 15.6 27.9 21.6" fill="none" stroke="#fff" stroke-width="1.5"/>',
  cn: '<rect width="40" height="40" fill="#DE2910"/><path d="M11.00 6.00L12.35 10.15L16.71 10.15L13.18 12.71L14.53 16.85L11.00 14.29L7.47 16.85L8.82 12.71L5.29 10.15L9.65 10.15Z M19.00 4.10L19.43 5.41L20.81 5.41L19.69 6.22L20.12 7.54L19.00 6.73L17.88 7.54L18.31 6.22L17.19 5.41L18.57 5.41Z M22.00 7.60L22.43 8.91L23.81 8.91L22.69 9.72L23.12 11.04L22.00 10.23L20.88 11.04L21.31 9.72L20.19 8.91L21.57 8.91Z M22.00 12.10L22.43 13.41L23.81 13.41L22.69 14.22L23.12 15.54L22.00 14.73L20.88 15.54L21.31 14.22L20.19 13.41L21.57 13.41Z M19.00 15.60L19.43 16.91L20.81 16.91L19.69 17.72L20.12 19.04L19.00 18.23L17.88 19.04L18.31 17.72L17.19 16.91L18.57 16.91Z" fill="#FFDE00"/>',
  co: '<rect width="40" height="20" fill="#FCD116"/><rect y="20" width="40" height="10" fill="#003893"/><rect y="30" width="40" height="10" fill="#CE1126"/>',
  ec: '<rect width="40" height="20" fill="#FFD100"/><rect y="20" width="40" height="10" fill="#034EA2"/><rect y="30" width="40" height="10" fill="#ED1C24"/><ellipse cx="20" cy="21" rx="4.3" ry="5.2" fill="#9FCDEB" stroke="#7A4E1F" stroke-width="1.1"/><path d="M14.6 15.4 Q20 12.4 25.4 15.4 Q22.4 15 20 16.6 Q17.6 15 14.6 15.4Z" fill="#3B2A1A"/>',
  eu: '<rect width="40" height="40" fill="#003399"/><path d="M20.00 7.10L20.43 8.41L21.81 8.41L20.69 9.22L21.12 10.54L20.00 9.73L18.88 10.54L19.31 9.22L18.19 8.41L19.57 8.41Z M25.50 8.57L25.93 9.89L27.31 9.89L26.19 10.70L26.62 12.01L25.50 11.20L24.38 12.01L24.81 10.70L23.69 9.89L25.07 9.89Z M29.53 12.60L29.95 13.91L31.33 13.91L30.22 14.72L30.64 16.04L29.53 15.23L28.41 16.04L28.84 14.72L27.72 13.91L29.10 13.91Z M31.00 18.10L31.43 19.41L32.81 19.41L31.69 20.22L32.12 21.54L31.00 20.73L29.88 21.54L30.31 20.22L29.19 19.41L30.57 19.41Z M29.53 23.60L29.95 24.91L31.33 24.91L30.22 25.72L30.64 27.04L29.53 26.23L28.41 27.04L28.84 25.72L27.72 24.91L29.10 24.91Z M25.50 27.63L25.93 28.94L27.31 28.94L26.19 29.75L26.62 31.06L25.50 30.25L24.38 31.06L24.81 29.75L23.69 28.94L25.07 28.94Z M20.00 29.10L20.43 30.41L21.81 30.41L20.69 31.22L21.12 32.54L20.00 31.73L18.88 32.54L19.31 31.22L18.19 30.41L19.57 30.41Z M14.50 27.63L14.93 28.94L16.31 28.94L15.19 29.75L15.62 31.06L14.50 30.25L13.38 31.06L13.81 29.75L12.69 28.94L14.07 28.94Z M10.47 23.60L10.90 24.91L12.28 24.91L11.16 25.72L11.59 27.04L10.47 26.23L9.36 27.04L9.78 25.72L8.67 24.91L10.05 24.91Z M9.00 18.10L9.43 19.41L10.81 19.41L9.69 20.22L10.12 21.54L9.00 20.73L7.88 21.54L8.31 20.22L7.19 19.41L8.57 19.41Z M10.47 12.60L10.90 13.91L12.28 13.91L11.16 14.72L11.59 16.04L10.47 15.23L9.36 16.04L9.78 14.72L8.67 13.91L10.05 13.91Z M14.50 8.57L14.93 9.89L16.31 9.89L15.19 10.70L15.62 12.01L14.50 11.20L13.38 12.01L13.81 10.70L12.69 9.89L14.07 9.89Z" fill="#FFCC00"/>',
  jp: '<rect width="40" height="40" fill="#fff"/><circle cx="20" cy="20" r="9" fill="#BC002D"/>',
  py: '<rect width="40" height="13.4" fill="#D52B1E"/><rect y="13.3" width="40" height="13.4" fill="#fff"/><rect y="26.6" width="40" height="13.4" fill="#0038A8"/><circle cx="20" cy="20" r="3.4" fill="#fff" stroke="#2C6E2F" stroke-width="0.8"/><path d="M20.00 18.40L20.36 19.51L21.52 19.51L20.58 20.19L20.94 21.29L20.00 20.61L19.06 21.29L19.42 20.19L18.48 19.51L19.64 19.51Z" fill="#F7D417"/>',
  pe: '<rect width="40" height="40" fill="#fff"/><rect width="13.4" height="40" fill="#D91023"/><rect x="26.6" width="13.4" height="40" fill="#D91023"/>',
  uy: '<rect width="40" height="40" fill="#fff"/><rect y="4.444" width="40" height="4.494" fill="#0038A8"/><rect y="13.333" width="40" height="4.494" fill="#0038A8"/><rect y="22.222" width="40" height="4.494" fill="#0038A8"/><rect y="31.111" width="40" height="4.494" fill="#0038A8"/><rect width="17.8" height="22.2" fill="#fff"/><circle cx="8.9" cy="11.1" r="4.4" fill="#FCD116" stroke="#7B3F00" stroke-width="0.5"/>',
  us: '<rect width="40" height="40" fill="#fff"/><rect y="0.000" width="40" height="3.127" fill="#B22234"/><rect y="6.154" width="40" height="3.127" fill="#B22234"/><rect y="12.308" width="40" height="3.127" fill="#B22234"/><rect y="18.462" width="40" height="3.127" fill="#B22234"/><rect y="24.615" width="40" height="3.127" fill="#B22234"/><rect y="30.769" width="40" height="3.127" fill="#B22234"/><rect y="36.923" width="40" height="3.127" fill="#B22234"/><rect width="18" height="21.6" fill="#3C3B6E"/><circle cx="3.0" cy="3.0" r="0.9" fill="#fff"/><circle cx="7.0" cy="3.0" r="0.9" fill="#fff"/><circle cx="11.0" cy="3.0" r="0.9" fill="#fff"/><circle cx="15.0" cy="3.0" r="0.9" fill="#fff"/><circle cx="3.0" cy="7.2" r="0.9" fill="#fff"/><circle cx="7.0" cy="7.2" r="0.9" fill="#fff"/><circle cx="11.0" cy="7.2" r="0.9" fill="#fff"/><circle cx="15.0" cy="7.2" r="0.9" fill="#fff"/><circle cx="3.0" cy="11.4" r="0.9" fill="#fff"/><circle cx="7.0" cy="11.4" r="0.9" fill="#fff"/><circle cx="11.0" cy="11.4" r="0.9" fill="#fff"/><circle cx="15.0" cy="11.4" r="0.9" fill="#fff"/><circle cx="3.0" cy="15.6" r="0.9" fill="#fff"/><circle cx="7.0" cy="15.6" r="0.9" fill="#fff"/><circle cx="11.0" cy="15.6" r="0.9" fill="#fff"/><circle cx="15.0" cy="15.6" r="0.9" fill="#fff"/><circle cx="3.0" cy="19.8" r="0.9" fill="#fff"/><circle cx="7.0" cy="19.8" r="0.9" fill="#fff"/><circle cx="11.0" cy="19.8" r="0.9" fill="#fff"/><circle cx="15.0" cy="19.8" r="0.9" fill="#fff"/>',
  ve: '<rect width="40" height="13.4" fill="#FFCC00"/><rect y="13.3" width="40" height="13.4" fill="#00247D"/><rect y="26.6" width="40" height="13.4" fill="#CF142B"/><path d="M12.95 21.83L13.20 22.59L14.00 22.59L13.35 23.06L13.60 23.82L12.95 23.36L12.31 23.82L12.55 23.06L11.91 22.59L12.71 22.59Z M14.25 19.58L14.50 20.34L15.30 20.34L14.65 20.81L14.90 21.57L14.25 21.10L13.61 21.57L13.86 20.81L13.21 20.34L14.01 20.34Z M16.25 17.90L16.50 18.66L17.30 18.66L16.65 19.13L16.90 19.89L16.25 19.43L15.60 19.89L15.85 19.13L15.20 18.66L16.00 18.66Z M18.70 17.01L18.94 17.77L19.74 17.77L19.10 18.24L19.34 19.00L18.70 18.53L18.05 19.00L18.30 18.24L17.65 17.77L18.45 17.77Z M21.30 17.01L21.55 17.77L22.35 17.77L21.70 18.24L21.95 19.00L21.30 18.53L20.66 19.00L20.90 18.24L20.26 17.77L21.06 17.77Z M23.75 17.90L24.00 18.66L24.80 18.66L24.15 19.13L24.40 19.89L23.75 19.43L23.10 19.89L23.35 19.13L22.70 18.66L23.50 18.66Z M25.75 19.58L25.99 20.34L26.79 20.34L26.14 20.81L26.39 21.57L25.75 21.10L25.10 21.57L25.35 20.81L24.70 20.34L25.50 20.34Z M27.05 21.83L27.29 22.59L28.09 22.59L27.45 23.06L27.69 23.82L27.05 23.36L26.40 23.82L26.65 23.06L26.00 22.59L26.80 22.59Z" fill="#fff"/>',
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
  Argentina: 'ar', Bolivia: 'bo', Brasil: 'br', Chile: 'cl', China: 'cn', Colombia: 'co',
  Ecuador: 'ec', 'Estados Unidos': 'us', Europa: 'eu', Japón: 'jp', Paraguay: 'py',
  Perú: 'pe', Uruguay: 'uy', Venezuela: 've',
};

/**
 * La bandera de cada divisa, para cuando no hay un país sino una moneda: el
 * selector de «Pasar a pesos» y la ficha de la moneda. El dólar es el de Estados
 * Unidos aunque también llegue a Ecuador: es la bandera de quien lo emite.
 */
const DE_DIVISA: Readonly<Record<string, CodigoBandera>> = {
  CLP: 'cl', USD: 'us', EUR: 'eu', ARS: 'ar', BOB: 'bo', BRL: 'br', CNY: 'cn',
  COP: 'co', JPY: 'jp', PEN: 'pe', PYG: 'py', UYU: 'uy', VES: 've',
};

export function banderaDeDestino(destino: string): CodigoBandera | undefined {
  return DE_DESTINO[destino];
}

export function banderaDeDivisa(codigo: string): CodigoBandera | undefined {
  return DE_DIVISA[codigo];
}

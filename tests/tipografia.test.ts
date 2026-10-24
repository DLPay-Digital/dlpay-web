/**
 * La letra de cifras, sólo en cifras (Cowork, entrega `tipo-`, 2026-10-24).
 *
 * Sebastián lo pidió viendo los dibujos: los rótulos de las figuras —«CHILE ·
 * EXTERIOR», «Tu banco», «Quien recibe»— iban en Spline Sans Mono, una tercera
 * letra junto al titular y la bajada. Desde ese día la regla es una:
 *
 * · **Familjen Grotesk para todo lo que son palabras**: rótulos, metadatos,
 *   categorías, fuentes, la miga de pan, los rótulos de los dibujos.
 * · **Spline Sans Mono sólo para cifras**: montos, tasas, fechas numéricas,
 *   números de paso, y los códigos de moneda junto a una cifra o en el
 *   cotizador y sus tablas.
 *
 * **Lo que protege:** que una regla nueva no vuelva a poner palabras en la
 * letra de cifras sin que nadie lo decida. Dos comprobaciones:
 *
 * 1. Sobre el código: cada regla CSS que pide `var(--f-num)` tiene que estar
 *    en la lista de abajo, con su motivo. Una regla nueva falla y pide que se
 *    clasifique.
 * 2. Sobre el build: todo lo que lleva la clase global `.num` tiene que ser una
 *    cifra o un código de moneda.
 */
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = fileURLToPath(new URL('../', import.meta.url));
const src = join(raiz, 'src');
const dist = join(raiz, 'dist');

/** Las reglas que pueden pedir la letra de cifras, y por qué. */
const PERMITIDAS: Record<string, string> = {
  'src/styles/tokens.css .num': 'la clase global de cifras',
  'src/components/CalculadoraSpread.astro .caja input': 'el campo donde escribes un precio',
  'src/components/CalculadoraSpread.astro .regla-n': 'la escala de la regla, 0 % y 5 %',
  'src/components/DosCaminos.astro .compara .n': 'los números de fila de la tabla',
  'src/components/FiguraTarifas.astro .num': 'el monto que recibes',
  'src/components/PortadaDato.astro .dato': 'la cifra o el intervalo de la portada',
  'src/components/PortadaDato.astro .pie time': 'la fecha del dato',
  'src/components/FilaArticulo.astro .cifra': 'la cifra de la marca',
  'src/components/FilaArticulo.astro .p-meta time': 'la fecha de publicación',
  'src/components/IndiceMovil.astro .indice-movil a::before': 'el número de cada sección',
  'src/pages/blog/[slug].astro .prose :global(code)': 'código dentro de un artículo',
  'src/pages/como-funciona.astro .n': 'el número de cada paso',
  'src/pages/preguntas.astro .entrada .n': 'el recuento de preguntas de cada grupo',
  'src/pages/tarifas.astro .dato .n': 'el monto de ejemplo',
  'src/styles/guias.css .prose figure.g-datos dd': 'la moneda, la red y la dirección, que se comparan carácter a carácter',
  'src/styles/guias.css .prose figure .g-nivel-cifra': 'los dos precios del ejemplo',
};

function archivos(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((d) =>
    d.isDirectory() ? archivos(join(dir, d.name)) : /\.(astro|css)$/.test(d.name) ? [join(dir, d.name)] : [],
  );
}

/** Las reglas CSS de un archivo que piden `var(--f-num)`, por su selector. */
function reglasConCifras(texto: string): string[] {
  const css = texto.replace(/\/\*[\s\S]*?\*\//g, '');
  const out: string[] = [];
  for (const m of css.matchAll(/font-family:\s*var\(--f-num\)/g)) {
    const abre = css.lastIndexOf('{', m.index);
    const estilo = css.lastIndexOf('<style>', abre);
    const antes = Math.max(css.lastIndexOf('}', abre - 1), css.lastIndexOf('{', abre - 1), estilo >= 0 ? estilo + '<style>'.length - 1 : -1);
    out.push(css.slice(antes + 1, abre).replace(/\s+/g, ' ').trim());
  }
  return out;
}

describe('la letra de cifras, sólo en cifras', () => {
  test('cada regla que pide la letra de cifras está clasificada', () => {
    const halladas = new Set<string>();
    for (const f of archivos(src)) {
      for (const sel of reglasConCifras(readFileSync(f, 'utf8'))) halladas.add(`${relative(raiz, f)} ${sel}`);
    }
    const nuevas = [...halladas].filter((h) => !(h in PERMITIDAS));
    assert.deepEqual(nuevas, [], `reglas en la letra de cifras sin clasificar. Si es una cifra, añádela a PERMITIDAS con su motivo; si son palabras, va en var(--f-text):\n  ${nuevas.join('\n  ')}`);
    const sobran = Object.keys(PERMITIDAS).filter((p) => !halladas.has(p));
    assert.deepEqual(sobran, [], `PERMITIDAS nombra reglas que ya no existen:\n  ${sobran.join('\n  ')}`);
  });

  test('lo que lleva la clase `.num` es una cifra o un código de moneda', { skip: !existsSync(dist) && 'sin dist/: corre `npm run build` antes' }, () => {
    const paginas = readdirSync(dist, { recursive: true, encoding: 'utf8' }).filter((f) => f.endsWith('.html'));
    const malos: string[] = [];
    for (const p of paginas) {
      const html = readFileSync(join(dist, p), 'utf8');
      for (const m of html.matchAll(/<(span|p|td|dd|div)\b[^>]*class="(?:[^"]*\s)?num(?:\s[^"]*)?"[^>]*>([\s\S]*?)<\/\1>/g)) {
        const texto = (m[2] ?? '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
        if (!texto) continue;
        const esCifra = /\d/.test(texto) || /^(US)?\$$|^[A-Z]{3}$/.test(texto);
        if (!esCifra) malos.push(`${p}: «${texto.slice(0, 40)}»`);
      }
    }
    assert.deepEqual(malos, [], `palabras con la clase de cifras:\n  ${malos.join('\n  ')}`);
  });
});

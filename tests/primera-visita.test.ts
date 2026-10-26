/**
 * Lo que salió del recorrido de primera visita (Cowork, entrega `orden-`,
 * 2026-10-26), y lo que cuidan estos tests para que no vuelva.
 *
 * Cowork recorrió el sitio como un cliente nuevo —una persona y una empresa—,
 * y Sebastián aprobó lo que encontró. Dos cosas se pueden comprobar sin mirar:
 *
 * 1. **Lo que recibe una empresa es lo mismo que una persona**: el dinero
 *    llega en la moneda del país de destino (ADR-0014). `/empresas` y una
 *    tarjeta de la Home decían «divisa digital», «en forma digital» y pedían
 *    «la dirección de la billetera». Se mira en el contenido, que es donde se
 *    escribe.
 * 2. **El sitio no le habla al equipo.** Cuatro textos explicaban la propia web
 *    o cómo leer un dibujo —«El sitio todavía no lo explica en ninguna parte»,
 *    «Cinco están definidos…», «La línea verde no sube ni baja…», «La barra no
 *    está partida…»—, y un cliente los leía como notas olvidadas. Se mira en el
 *    build, que es lo que se publica.
 *
 * **Lo que NO miran:** el portátil de la portada de `/empresas` sigue diciendo
 * «Retirar divisa digital», porque es una captura de la plataforma y no se
 * teclea (ver `MacbookMockup.astro`). Va `aria-hidden` y queda pendiente de una
 * captura nueva.
 */
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

import { businessUseCases, checklist as checklistEmpresa } from '../src/content/business.ts';
import { useCases } from '../src/content/home.ts';

const dist = fileURLToPath(new URL('../dist/', import.meta.url));

/** Lo que haría pensar que el cliente recibe otra cosa que la moneda del destino. */
const OTRA_COSA = /billetera|divisa digital|forma digital|d[oó]lar digital/i;

describe('lo que recibe una empresa', () => {
  test('los casos de /empresas dicen que llega en la moneda del destino', () => {
    for (const caso of businessUseCases) {
      assert.doesNotMatch(caso.body, OTRA_COSA, `«${caso.title}»: ${caso.body}`);
    }
  });

  test('lo que una empresa tiene a mano es lo mismo que una persona', () => {
    for (const item of checklistEmpresa) {
      assert.doesNotMatch(item.text, OTRA_COSA, item.text);
    }
    assert.ok(
      checklistEmpresa.some((item) => item.text === 'Los datos de quien recibe en el país de destino'),
      'falta «Los datos de quien recibe en el país de destino»',
    );
  });

  test('la tarjeta de empresas de la Home tampoco dice otra cosa', () => {
    for (const uso of useCases) {
      assert.doesNotMatch(uso.body, OTRA_COSA, `«${uso.title}»: ${uso.body}`);
    }
  });
});

describe('el sitio no le habla al equipo', { skip: !existsSync(dist) && 'sin dist/: corre `npm run build` antes' }, () => {
  /** Frases retiradas el 2026-10-26, y la página donde estaban. */
  const RETIRADAS: readonly [string, string][] = [
    ['preguntas/index.html', 'El sitio todavía no lo explica'],
    ['preguntas/index.html', 'Cinco están definidos'],
    ['precio/index.html', 'La línea verde no sube ni baja'],
    ['tarifas/index.html', 'La barra no está partida'],
  ];

  for (const [pagina, frase] of RETIRADAS) {
    test(`/${pagina.replace(/index\.html$/, '')} ya no dice «${frase}…»`, () => {
      const html = readFileSync(join(dist, pagina), 'utf8').replace(/<!--[\s\S]*?-->/g, '');
      assert.ok(!html.includes(frase), `/${pagina} todavía publica «${frase}»`);
    });
  }
});

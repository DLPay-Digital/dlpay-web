/**
 * Tests de la guarda de despliegue (CLAUDE.md §7).
 *
 * Lo crítico aquí no es el formato de la URL: es que sea IMPOSIBLE publicar un
 * build cuya URL canónica no resuelva fuera de la máquina de quien lo hizo, y
 * que la indexación esté cerrada salvo que alguien la abra a propósito.
 *
 * Los dos fallos que estos tests fijan salieron de una auditoría, y los dos
 * tenían la misma firma: build verde, páginas correctas, daño invisible hasta
 * que un buscador indexa.
 */
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import {
  DEV_SITE_URL,
  allowsIndexing,
  assertPublishableSiteUrl,
  resolveQuoteLimits,
  resolveSiteUrl,
  validateSiteUrl,
} from '../src/lib/config/environment.ts';

describe('URL publicable', () => {
  test('acepta un origen https y lo normaliza sin barra final', () => {
    for (const raw of ['https://dlpay.cl', 'https://dlpay.cl/', '  https://dlpay.cl  ']) {
      const result = validateSiteUrl(raw);
      assert.equal(result.ok, true, `debería aceptar ${raw}`);
      assert.equal(result.ok && result.url, 'https://dlpay.cl');
    }
  });

  test('acepta un subdominio de staging', () => {
    const result = validateSiteUrl('https://staging.dlpay.cl');
    assert.equal(result.ok && result.url, 'https://staging.dlpay.cl');
  });

  // El fallo original: la guarda comprobaba PRESENCIA, y `.env.example` traía
  // localhost. Copiar la plantilla producía un build verde con localhost en
  // canonical, Open Graph, JSON-LD, sitemap y robots.
  test('rechaza los hosts que sólo resuelven en la máquina de quien desarrolla', () => {
    const locales = [
      'http://localhost:4321',
      'https://localhost',
      'http://127.0.0.1:4321',
      'http://0.0.0.0:8080',
      'https://dlpay.localhost',
      'https://macbook.local',
      'https://dlpay.test',
      'https://dlpay.internal',
    ];
    for (const raw of locales) {
      assert.equal(validateSiteUrl(raw).ok, false, `debería rechazar ${raw}`);
    }
  });

  test('rechaza ausencia y valores vacíos', () => {
    for (const raw of [undefined, '', '   ']) {
      assert.equal(validateSiteUrl(raw).ok, false);
    }
  });

  test('rechaza lo que no es una URL', () => {
    for (const raw of ['dlpay.cl', 'no una url', '://dlpay.cl']) {
      assert.equal(validateSiteUrl(raw).ok, false, `debería rechazar ${raw}`);
    }
  });

  test('rechaza http en un host público: el canonical no invita a indexar la versión insegura', () => {
    assert.equal(validateSiteUrl('http://dlpay.cl').ok, false);
  });

  test('rechaza un protocolo que no es web', () => {
    for (const raw of ['ftp://dlpay.cl', 'file:///tmp/dlpay']) {
      assert.equal(validateSiteUrl(raw).ok, false, `debería rechazar ${raw}`);
    }
  });

  // Serviría el sitio en la raíz e inventaría enlaces internos rotos, sin error.
  test('rechaza una ruta: el sitio se sirve en la raíz del dominio', () => {
    assert.equal(validateSiteUrl('https://dlpay.cl/web').ok, false);
  });

  test('rechaza parámetros y fragmento', () => {
    assert.equal(validateSiteUrl('https://dlpay.cl/?utm=x').ok, false);
    assert.equal(validateSiteUrl('https://dlpay.cl/#top').ok, false);
  });

  test('el motivo del rechazo dice qué pasó, no que algo falló', () => {
    const result = validateSiteUrl('http://localhost:4321');
    assert.equal(result.ok, false);
    assert.match(result.ok ? '' : result.reason, /host local/);
  });
});

describe('resolución para trabajar', () => {
  test('devuelve la URL configurada cuando es publicable', () => {
    assert.equal(resolveSiteUrl({ PUBLIC_SITE_URL: 'https://dlpay.cl' }), 'https://dlpay.cl');
  });

  test('cae al origen de desarrollo cuando no hay nada configurado', () => {
    assert.equal(resolveSiteUrl({}), DEV_SITE_URL);
  });

  test('cae al origen de desarrollo en vez de propagar un valor inválido', () => {
    assert.equal(resolveSiteUrl({ PUBLIC_SITE_URL: 'dlpay.cl' }), DEV_SITE_URL);
  });
});

describe('guarda de build', () => {
  test('deja pasar una URL publicable y la devuelve normalizada', () => {
    assert.equal(assertPublishableSiteUrl({ PUBLIC_SITE_URL: 'https://dlpay.cl/' }), 'https://dlpay.cl');
  });

  test('detiene el build sin la variable', () => {
    assert.throws(() => assertPublishableSiteUrl({}), /PUBLIC_SITE_URL/);
  });

  // La regresión que esta guarda existe para impedir.
  test('detiene el build con localhost, aunque la variable esté definida', () => {
    assert.throws(
      () => assertPublishableSiteUrl({ PUBLIC_SITE_URL: 'http://localhost:4321' }),
      /host local/
    );
  });

  test('el mensaje dice cómo arreglarlo', () => {
    assert.throws(() => assertPublishableSiteUrl({}), /PUBLIC_SITE_URL=https:\/\/dlpay\.cl/);
  });
});

describe('política de indexación', () => {
  test('sólo el literal "true" abre la indexación', () => {
    assert.equal(allowsIndexing({ PUBLIC_ALLOW_INDEXING: 'true' }), true);
  });

  // Fallar cerrado es el punto: el modo seguro no puede depender de acordarse.
  test('cerrada por omisión y ante cualquier otro valor', () => {
    const cerrados = [undefined, '', 'false', 'TRUE', 'True', '1', 'yes', 'sí', ' true'];
    for (const value of cerrados) {
      assert.equal(
        allowsIndexing({ PUBLIC_ALLOW_INDEXING: value }),
        false,
        `${JSON.stringify(value)} no debería abrir la indexación`
      );
    }
  });

  test('la decide su propia variable, no la URL del sitio', () => {
    assert.equal(allowsIndexing({ PUBLIC_SITE_URL: 'https://dlpay.cl' }), false);
  });
});

describe('límites del cotizador (D24)', () => {
  // La garantía estructural es que existe UN resolutor y todos —el cotizador
  // que aplica el mínimo, /tarifas que lo publica, las ilustraciones— consumen
  // su resultado. Estos tests fijan que ese resolutor es determinista y que sus
  // valores por defecto viven aquí y en ningún otro sitio.
  test('sin variables, aplica los valores por defecto documentados', () => {
    const q = resolveQuoteLimits({});
    assert.equal(q.minPayClp, 500_000);
    assert.equal(q.maxPayClp, undefined);
    assert.equal(q.samplePayClp, 2_000_000);
  });

  test('lee el mínimo y el máximo cuando vienen bien', () => {
    const q = resolveQuoteLimits({ PUBLIC_QUOTE_MIN_CLP: '100000', PUBLIC_QUOTE_MAX_CLP: '50000000' });
    assert.equal(q.minPayClp, 100_000);
    assert.equal(q.maxPayClp, 50_000_000);
  });

  test('basura, cero o negativo caen al valor por defecto, nunca a NaN', () => {
    for (const raw of ['', 'abc', '0', '-5000', 'NaN']) {
      const q = resolveQuoteLimits({ PUBLIC_QUOTE_MIN_CLP: raw, PUBLIC_QUOTE_MAX_CLP: raw });
      assert.equal(q.minPayClp, 500_000, `mínimo con ${JSON.stringify(raw)}`);
      assert.equal(q.maxPayClp, undefined, `máximo con ${JSON.stringify(raw)}`);
    }
  });

  test('un monto con decimales se trunca: son pesos', () => {
    assert.equal(resolveQuoteLimits({ PUBLIC_QUOTE_MIN_CLP: '50000.9' }).minPayClp, 50_000);
  });

  test('el monto de muestra es el mismo para toda la web y no depende del entorno', () => {
    assert.equal(resolveQuoteLimits({}).samplePayClp, resolveQuoteLimits({ PUBLIC_QUOTE_MIN_CLP: '1' }).samplePayClp);
  });
});

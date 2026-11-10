#!/usr/bin/env node
/**
 * Trae las tasas de referencia y las escribe en `src/lib/pricing/tasas.json`.
 *
 * Lo corre `.github/workflows/tasas.yml` dos veces al día (ADR-0019); también
 * se puede correr a mano: `node scripts/actualizar-tasas.mjs`. Sin
 * dependencias: Node 18 o superior trae `fetch`.
 *
 * ── Qué hace ────────────────────────────────────────────────────────────────
 *
 * 1. Pide las tasas a la API abierta de ExchangeRate-API, **con base en el
 *    dólar**. Con base en el peso la respuesta trae el dólar como 0,001024
 *    —cuatro cifras, ±0,5 pesos de error—; con base en el dólar el peso viene
 *    con seis decimales y cada cruce sale preciso: CLP por EUR = CLP/USD ÷
 *    EUR/USD.
 * 2. Convierte cada divisa del catálogo a **CLP por 1 unidad**, la unidad de
 *    `currencies.ts`.
 * 3. Comprueba que nada se haya movido más de un 20 % desde la última
 *    lectura. Un salto así es un fallo de la fuente antes que del mercado, y
 *    el script se niega a escribirlo: el sitio sigue con la tasa anterior y la
 *    ejecución queda en rojo en GitHub, que es donde alguien lo va a ver.
 * 4. Escribe el archivo **sólo si alguna tasa cambió**. La API gratuita se
 *    actualiza una vez al día, así que la segunda ejecución del día casi
 *    siempre termina sin tocar nada, y sin commit.
 *
 * Sale con código 0 si escribió o si no había nada nuevo, y con 1 si la
 * fuente falló o no pasó la comprobación.
 */
import { readFile, writeFile } from 'node:fs/promises';

const FUENTE = 'https://open.er-api.com/v6/latest/USD';
const ARCHIVO = new URL('../src/lib/pricing/tasas.json', import.meta.url);
// Las nueve del catálogo. `tests/tasas.test.ts` falla si esta lista y
// `currencies.ts` se separan.
const DIVISAS = ['USD', 'EUR', 'ARS', 'BRL', 'COP', 'CRC', 'MXN', 'PEN', 'ZAR'];
const SALTO_MAXIMO = 0.2;

function fallar(motivo) {
  console.error(`actualizar-tasas: ${motivo}`);
  process.exit(1);
}

const res = await fetch(FUENTE, { headers: { accept: 'application/json' } });
if (!res.ok) fallar(`la fuente respondió ${res.status}`);
const datos = await res.json();
if (datos.result !== 'success') fallar(`la fuente respondió «${datos.result}»`);

const usd = datos.rates ?? {};
const clpPorUsd = usd.CLP;
if (!(clpPorUsd > 0)) fallar('la respuesta no trae el peso chileno');

const tasas = {};
for (const code of DIVISAS) {
  const porUsd = code === 'USD' ? 1 : usd[code];
  if (!(porUsd > 0)) fallar(`la respuesta no trae ${code}`);
  tasas[code] = Number((clpPorUsd / porUsd).toFixed(6));
}

let anterior;
try {
  anterior = JSON.parse(await readFile(ARCHIVO, 'utf8'));
} catch {
  anterior = undefined;
}

if (anterior) {
  for (const code of DIVISAS) {
    const antes = anterior.tasas?.[code];
    if (!(antes > 0)) continue;
    const salto = Math.abs(tasas[code] / antes - 1);
    if (salto > SALTO_MAXIMO) {
      fallar(`${code} pasó de ${antes} a ${tasas[code]} (${(salto * 100).toFixed(1)} %), más del ${SALTO_MAXIMO * 100} %`);
    }
  }
  if (DIVISAS.every((c) => anterior.tasas?.[c] === tasas[c])) {
    console.log(`actualizar-tasas: sin cambios (${anterior.actualizado})`);
    process.exit(0);
  }
}

const nuevo = {
  fuente: 'ExchangeRate-API (open.er-api.com), tasa de referencia de mercado',
  actualizado: new Date(datos.time_last_update_unix * 1000).toISOString(),
  unidad: 'CLP por 1 unidad de la divisa',
  tasas,
};
await writeFile(ARCHIVO, JSON.stringify(nuevo, null, 2) + '\n');
console.log(`actualizar-tasas: escrito (${nuevo.actualizado}), USD ${tasas.USD}`);

# ADR-0012 — Segunda excepción a «cero JS al cliente»: la calculadora del spread

- **Estado:** Aceptada — 2026-10-13
- **Decide:** Sebastián Villanueva (con análisis de Cowork, entrega `spread-`)
- **Ámbito:** `src/components/CalculadoraSpread.astro` y la ruta `/cuanto-te-cobran/` que la monta.
  El resto del sitio no cambia.
- **Identificador:** `cero-js-e2`
- **Referencia:** §7 de `CLAUDE.md` · ADR-0009, que exige enmienda propia para cada pieza con
  JavaScript y pide «revisar §7 completo» cuando aparezca «una calculadora»

## Contexto

`ideas-zesty-ficha.md`, idea 6: Zesty publica herramientas gratis que la gente usa y comparte. La
nuestra convierte el mensaje del sitio —«el precio de mercado, con el spread adentro»— en algo que
se usa: escribes el precio que te ofrecen y una referencia del mismo momento, y te dice el spread
en porcentaje y lo que te cuesta en dinero.

**Una calculadora que recalcula mientras escribes necesita ejecutar código.** HTML y CSS no hacen
aritmética con lo que escribe una persona.

ADR-0009 lo previó con estas palabras: si aparece «una calculadora», hay que «revisar §7
completo», porque podría ser «un cambio de doctrina en vez de acumulación de excepciones». Este ADR
hace esa revisión y concluye que **no** lo es. Las razones van en «Por qué no es un cambio de
doctrina».

## Decisión propuesta

Se autoriza una **excepción acotada** para la calculadora, con los guardarrieles de ADR-0009
adaptados a esta pieza.

### Guardarrieles

1. **Vanilla y sin dependencias.** Importa sólo dos módulos del propio repositorio:
   - `lib/pricing/format.ts`, el formato y la lectura de montos del cotizador;
   - `lib/spread.ts`, la cuenta. Es pura y tiene tests.
2. **La misma cuenta en el build y en el navegador.** El ejemplo que se ve sin JavaScript lo
   calcula `lib/spread.ts` al construir, y la isla recalcula con la misma función. Es el patrón del
   cotizador con `lib/pricing/quote.ts`.
3. **No toca la Home.**
   - `format.ts` se importa como `format.ts?isla`: la misma fuente con otra identidad, así que el
     empaquetador lo copia dentro de esta isla.
   - Sin eso, `format.ts` salía a un trozo compartido que el cotizador de la Home pasaba a pedir en
     cadena, después de su propio archivo.
   - **Medido:** el `.js` del cotizador es el mismo archivo, con el mismo md5 que en `cdc3f80`.
   - El tipo lo declara `src/env.d.ts` con `typeof import(...)`, así que TypeScript sigue
     comprobando cada uso.
4. **Peso:** 3.386 B minificados y 1.334 B comprimidos, en línea en la página: no es una petición
   más. **Techo: 5 KB minificados**, el mismo de ADR-0009. Si se pasa, se reabre este ADR.
5. **Alcance de escritura.** Sólo escribe `textContent` y `hidden` dentro de su raíz
   (`[data-calc]`). Escucha `input` en sus cuatro campos y nada más: ni `window`, ni `document`.
6. **Sin E/S.** No hay `fetch`, ni `localStorage` o `sessionStorage`, ni cookies, ni cambios en la
   URL. **El CSP lo garantiza además**, porque `connect-src 'none'` y `form-action 'none'`. No hay
   `<form>`.
7. **Sin JavaScript, la página sigue siendo útil.**
   - Muestra el ejemplo calculado, con un aviso de que es sólo eso.
   - Debajo, la fórmula para hacer la cuenta a mano.
8. **No conoce el precio de nadie.** No hay un número de DLPay ni de ningún proveedor en el código:
   no compara y no expone D7.
9. **CSP:** el script va en línea y su hash lo calcula solo el build, como el de los demás.

### Por qué no es un cambio de doctrina

- **No toca la interacción crítica.** El cotizador, la navegación y el resto de las rutas siguen
  exactamente como estaban, también en su JavaScript.
- **Es una pieza, en una ruta, con un techo.** No es una plataforma de componentes con estado.
- **Hay una alternativa sin JavaScript, y se dice cuál es:** una tabla de ejemplos precalculados.
  Se descartó porque no responde la pregunta de la página —«¿cuánto me cobran **a mí**?»— y la
  tabla la responde sólo si tu número cae en una de sus filas.

## Consecuencias

**Positivas:**

- Una herramienta que la gente puede usar y compartir, hecha con nuestra identidad y sin rastreo.
- Enseña a comparar lo que se recibe y no sólo la tasa, que es lo que el sitio sostiene sobre
  nuestro propio precio («un solo número, con el spread ya incorporado»).

**Negativas:**

- Es la tercera pieza con JavaScript propio, después del cotizador y del globo. Más superficie que
  mantener.
- Sin JavaScript, los campos se pueden editar pero no recalculan. Se avisa con `<noscript>`.

## Trigger de revisión

- El runtime pasa de 5 KB minificados.
- Se le quiere dar una referencia automática, con un precio de mercado en vivo. Eso es `fetch`, va
  contra `connect-src 'none'` y depende de D7: es otro ADR.
- Aparece una cuarta pieza con JavaScript. Entonces sí, se revisa §7 entero.

## Alternativas consideradas

1. **Tabla de ejemplos precalculados, sin JS.** Descartada: no responde con tu número.
2. **Un formulario que recarga la página con el resultado.** Imposible en un sitio estático sin
   servidor, y además `form-action 'none'`.
3. **Meter la calculadora dentro de la guía «Cómo leer un spread».** Descartada como lugar único:
   una herramienta se comparte por su URL. La guía la enlaza.
4. **Importar `format.ts` sin `?isla`.** Descartada por medición: cambiaba el JavaScript de la Home.

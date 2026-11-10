# ADR-0019 — Las tasas de referencia se actualizan solas, una vez al día

- **Estado:** Aceptada — 2026-11-10
- **Decide:** Sebastián Villanueva. Lo pidió ese día: «que los precios de las divisas se vayan
  actualizando cada cierto tiempo y sin tanta complicación», sin que sea en tiempo real. Eligió:
  - **la fuente gratuita**, ExchangeRate-API en su modo abierto, en vez del plan Pro (USD 10 al
    mes, una tasa por hora);
  - **una ejecución al día, a las 07:00.** Primero pidió cada 3 horas; al saber que la fuente
    gratuita cambia una vez al día, pasó a dos —«uno temprano en la mañana y otro al medio día»—,
    para no llenar el historial de GitHub, y el mismo día lo dejó en una: «lo mejor es que sea
    solo una vez al día, el de las 07:00am».
- **Ámbito:** de dónde salen las tasas del cotizador y de todo lo que se calcula con ellas —la
  tabla de `/tarifas`, los costos de envío en pesos, las cifras de ejemplo de la Home y de
  `/como-funciona`—. El cotizador, su aritmética y el tarifario no cambian.
- **Levanta** un límite duro de `CLAUDE.md` §0.3: «No integrar una fuente de pricing real».
- **Referencia:** D7 (`CLAUDE.md` §13); ADR-0005 (despliegue portable); ADR-0013 (el catálogo
  de divisas); el modelo de precio de `CLAUDE.md` §1.

## Contexto

Las tasas del catálogo eran **números fijos escritos a mano**: primero órdenes de magnitud sobre un
dólar de 919,70; desde el 2026-10-29, las que mostraba Global66 ese día a las 09:48. Las dos
envejecían: el peso argentino se mueve lo bastante como para que una cifra quede vieja en días, y
cada corrección pedía una entrega y un commit.

Las de Global66 tenían además un problema de fondo: **son su tasa al cliente, con su margen
dentro**, y el sitio dice que la tasa es «de mercado, sin recargo» (§1). Con ellas, esa frase era
falsa.

## Decisión

**Un proceso de GitHub Actions trae la tasa de referencia de mercado una vez al día, la escribe
en un archivo del repositorio y, si cambió, hace un commit. El push dispara el despliegue que ya
existe.**

```
10:00 UTC (07:00 en Chile en verano; 06:00 en invierno)
  → scripts/actualizar-tasas.mjs pide open.er-api.com/v6/latest/USD
  → escribe src/lib/pricing/tasas.json, sólo si algo cambió
  → commit a main como github-actions[bot]
  → Cloudflare reconstruye Staging, como en cada push
```

| pieza | qué es |
|---|---|
| `scripts/actualizar-tasas.mjs` | Node sin dependencias. Pide con base en el dólar y cruza: CLP por EUR = CLP/USD ÷ EUR/USD. Con base en el peso la API da el dólar con cuatro cifras (0,001024) y el error llega a medio peso |
| `src/lib/pricing/tasas.json` | Las nueve tasas en CLP por unidad, y cuándo las publicó la fuente |
| `src/lib/pricing/currencies.ts` | La muestra de cada divisa pasa a ser la del archivo. Una variable de entorno sigue mandando sobre ella, como antes |
| `.github/workflows/tasas.yml` | El horario. Sin credenciales: usa el `GITHUB_TOKEN` de cada ejecución, limitado a escribir en este repositorio |
| el pie | «Tasas de referencia del {fecha y hora de Chile} · Rates By Exchange Rate API», con enlace |
| `tests/tasas.test.ts` | Que el script, el archivo y el catálogo tengan las mismas nueve divisas, y que el proceso sólo pueda hacer commit de ese archivo |

### Por qué así

- **El sitio sigue siendo estático (ADR-0005).** El navegador no consulta a nadie: la tasa llega
  escrita en el HTML. No cambia el CSP, no hay servidor ni caché, y `dist/` se sigue pudiendo
  copiar a cualquier hosting. **El build tampoco sale a internet**: lee un archivo, así que
  construir sigue siendo reproducible y no falla si la fuente está caída.
- **Cada tasa publicada queda en el historial.** «¿Qué tasa mostraba el sitio el martes?» se
  contesta con `git log -- src/lib/pricing/tasas.json`.
- **Si la fuente falla, se queda la última tasa buena.** El script sale en rojo y no escribe nada;
  la ejecución fallida se ve en la pestaña Actions de GitHub. Lo mismo si una tasa salta más de un
  20 % desde la última lectura, que es antes un fallo de la fuente que del mercado.
- **El pie dice de cuándo es la tasa**, así que una tasa vieja no se lee como una de hoy.

### Por qué una vez al día, y a esa hora

La fuente gratuita publica una tasa al día, hacia las 00:00 UTC (las 21:00 de Chile en verano), así
que **más ejecuciones no traen tasas más frescas**: traen el mismo número. A las 07:00 la del día
ya está, y el sitio la tiene antes de que empiece la jornada. **Un commit al día, como mucho.**

Lo que se pierde es la red: si una mañana la fuente o GitHub fallan, el sitio sigue con la tasa del
día anterior hasta la mañana siguiente, y el pie lo dice. Se recupera corriéndolo a mano desde la
pestaña Actions de GitHub («Run workflow»).

### Lo que cuesta

Nada, medido el 2026-11-10 contra las páginas de precios:

| | uso | incluido gratis |
|---|---|---|
| ExchangeRate-API, modo abierto | 1 consulta al día | sin cuota fija; piden no pasar de una por hora |
| GitHub Actions | ~30 ejecuciones al mes, de menos de un minuto | unos 2.000 minutos al mes. **Sin tarjeta registrada, al agotarse se detiene, no cobra** |
| Cloudflare Workers Builds | ~30 builds al mes, de un minuto | 3.000 minutos al mes |

## Lo que no cambia

- **El freno de producción, `assertRatesConfirmed`.** Con la indexación abierta, cada divisa sigue
  necesitando su variable de entorno con una cifra distinta de la muestra. **Una tasa automática no
  cuenta como confirmada**: que producción la use es una decisión de Compliance, y cuando llegue
  basta con quitar ese freno.
- **El cotizador, la aritmética, el tarifario y el mensaje de WhatsApp.**
- **Lo que el sitio dice del precio**: referencial, y el que se aplica es el que confirma el
  ejecutivo.

## Consecuencias

- **Vuelve a ser cierto «de mercado, sin recargo»**, que con las tasas de Global66 no lo era.
- **Las cifras de ejemplo cambian cada día**: la tarjeta de `/tarifas`, el puente de la Home, el
  teléfono de `/como-funciona`. Ninguna está tecleada; todas salen de la misma cadena.
- **Todas las páginas cambian cada día**, porque el pie lleva la fecha. Es un build de un minuto.
- **El historial de `main` gana un commit al día que no es de Sebastián**, firmado
  `github-actions[bot]`. La regla de `CLAUDE.md` §10 —todo el historial firmado por él— tiene desde
  hoy esa excepción, acotada a un archivo.
- **Antes de empujar, hay que traerse lo del robot**: `git pull --rebase`. Como el robot sólo toca
  `tasas.json`, el rebase nunca choca con el trabajo de nadie.
- **Atribución obligatoria.** Las condiciones de la fuente gratuita piden el enlace «Rates By
  Exchange Rate API» en las páginas que usan sus tasas, y no permiten redistribuirlas. Va en el pie,
  que cubre a todas por construcción. El texto va en inglés porque es el que piden, con
  `lang="en"`.
- **GitHub desactiva un proceso programado tras 60 días sin actividad** en repositorios públicos.
  Éste es privado, y además el propio robot es actividad.

## Lo que queda abierto

- `PENDIENTE DE DECISIÓN` — **el peso argentino.** La fuente da la cotización oficial, y Argentina
  tiene varias. Si el ejecutivo opera con otra, Argentina necesita una fuente propia (Sebastián).
- `PENDIENTE DE DECISIÓN` — **si producción usa la tasa automática**, y con qué fuente (D7,
  Compliance).
- **Si una tasa al día se queda corta**, el plan Pro (USD 10 al mes) da una por hora sin cambiar
  código: cambia la URL y una clave, y el horario puede subir. No se contrata sin el OK de
  Sebastián.

`REQUIERE VALIDACIÓN DE COMPLIANCE` — las nueve tasas, su fuente y «de mercado, sin recargo» con
ellas.

## Alternativas descartadas

| | por qué no |
|---|---|
| **Un Worker que consulta la tasa en cada visita** | Tasas más frescas, a cambio de un servidor, una caché, una llamada desde el navegador, un CSP más ancho y más formas de fallar. Para «cada cierto tiempo» no compensa |
| **Que el build consulte la API** | Cada build saldría a internet, dejaría de ser reproducible y fallaría con la fuente caída. Y seguiría haciendo falta algo que dispare el build |
| **Copiar Global66 de forma automática** | Su tasa lleva su margen, leer su sitio con un programa probablemente choca con sus condiciones, y se rompe cada vez que cambian su página |
| **Cada 3 horas, o dos veces al día** | Las propuso Sebastián y las cambió él mismo: con la fuente gratuita traen el mismo número que la de la mañana y sólo suman ejecuciones |
| **El plan Pro** | Cuesta USD 10 al mes; se deja como siguiente paso si la tasa del día no alcanza |

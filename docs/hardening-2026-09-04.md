# Revisión de endurecimiento — 2026-09-04

> Alcance: funnel Home → `/cotizar` → WhatsApp *(`/cotizar` se eliminó el 2026-09-09; el
> funnel es hoy Home → WhatsApp)*, comportamiento del cotizador, seguridad del
> repositorio, performance, SEO y accesibilidad ya implementados.
> **Sin cambios visuales.** Sin funcionalidades nuevas. Sin dependencias nuevas.
>
> Los hallazgos se documentan **antes** de corregir. Cada uno indica si se corrigió en esta
> revisión o queda registrado como decisión.

---

## CRÍTICO

### C1 · Un build sin `PUBLIC_SITE_URL` publica `localhost` en todo el SEO

`astro.config.mjs` y `src/lib/config/site.ts` usan `http://localhost:4321` como valor por defecto.
Si el sitio se construye sin esa variable —lo más probable en un primer despliegue— entonces
`canonical`, `og:url`, `twitter:image`, `og:image` y **todas las URL del sitemap** apuntan a
localhost.

Lo grave no es el error sino que **es silencioso**: el build queda verde, las páginas se ven bien,
los enlaces internos funcionan. El daño aparece cuando un buscador indexa canonicals inválidos y
cuando alguien comparte el enlace y la previsualización no carga.

**Corregido:** el build **falla con un mensaje explícito** si se construye en modo producción sin
`PUBLIC_SITE_URL`. En desarrollo sigue usando localhost, que es lo correcto ahí.

---

## IMPORTANTE

### I1 · Un campo vacío manda «CLP 0» al ejecutivo

Con el campo en blanco o en cero, el estado es `ok`, el botón sigue activo y el mensaje que llega
por WhatsApp es *«Hola, quiero enviar CLP 0 al extranjero (recibo aprox. US$ 0,00…)»*.

Es el final del funnel: el ejecutivo recibe un mensaje sin sentido y el cliente queda esperando.

**Corregido:** sin monto, el mensaje pasa a ser el genérico *«quiero cotizar una operación»*, que
ya existía para el estado sin precio. El botón sigue llevando a WhatsApp — el fallback nunca es un
error seco.

### I2 · Los decimales en formato inglés producen un error de 100×

El parseo eliminaba todos los puntos por ser separador de miles en Chile. Verificado:

| Se escribe | Se interpretaba | Debería |
|---|---|---|
| `2174.62` | **217.462** | 2.174,62 |
| `2,000,000` | **2** | 2.000.000 |
| `1.5` | 15 | 1,5 |

Cualquiera que pegue un monto copiado de un correo, una factura o una web en inglés obtiene una
cifra cien veces mayor — y ese número viaja al mensaje de WhatsApp.

**Corregido:** el separador decimal se decide por su posición. Un separador seguido de **tres**
dígitos es de miles; seguido de **uno o dos** al final de la cadena es decimal. Cubre el formato
chileno, el inglés y el pegado desde cualquier fuente.

### I3 · El parseo de montos no tenía un solo test

La función que interpreta **todo el dinero que el usuario escribe** vivía dentro del componente
`.astro`, así que no era importable y no tenía cobertura. Era la única lógica de dinero sin tests,
justo la que más entradas hostiles recibe.

**Corregido:** se movió a `src/lib/pricing/format.ts` y tiene tests, incluidos los casos de I2.

### I4 · No existe tope superior y el estado `above_max` estaba muerto

Un monto de `999.999.999.999.999` se acepta con estado `ok` y llega tal cual al ejecutivo. La
especificación del cotizador define el estado `above_max` y **nunca se usaba**.

**Corregido a medias, a propósito:** se cablea el estado para que funcione cuando DLPay defina el
tope, mediante `PUBLIC_QUOTE_MAX_CLP`, y se añade una guarda numérica contra valores absurdos que
rompen el formateo. **No se inventa un máximo**: es una regla de negocio.
→ `PENDIENTE DE DECISIÓN — monto máximo` (CLAUDE.md §13).

### I5 · La tipografía que pinta el precio no se precarga

Se precarga Familjen Grotesk, pero **Spline Sans Mono es la que dibuja el precio referencial y el
monto recibido**, que son el elemento más importante del primer viewport y el que el Design System
declara protagonista. Al no precargarse, se pinta primero con la tipografía de reserva y salta al
llegar la real.

**Corregido:** se precarga también, sólo en las páginas que llevan cotizador.

---

## MENOR

### M1 · Los temporizadores del feed corren con la pestaña oculta
El refresco de tiempos se ejecuta cada 5 s aunque nadie mire. La guarda `document.hidden` sólo
cubría la aparición de operaciones nuevas. **Corregido.**

### M2 · El signo negativo se descartaba en silencio
`-5000` se interpretaba como `5000`: el filtro de caracteres borraba el signo antes de que nadie
pudiera verlo, y el monto cambiaba de sentido sin avisar. Ahora el signo se detecta **antes** de
filtrar y un monto negativo devuelve cero, que activa el mensaje genérico. **Corregido.**

### M3 · `JSON.stringify` dentro de `<script>` sin escapar
Los datos estructurados se inyectan con `set:html`. Si un valor de configuración contuviera
`</script>`, cerraría la etiqueta. No es explotable hoy —los valores vienen del build, no de un
usuario— pero la clase de fallo es conocida y el arreglo es de una línea. **Corregido.**

### M4 · Tres enlaces a WhatsApp sin mensaje prellenado
En `/tarifas`, `/como-funciona` y `/confianza` el enlace abre el chat en blanco. El principio UX 3
dice que la web y WhatsApp son una sola conversación, y en el resto del sitio el contexto siempre
viaja.
**No corregido:** añadir mensajes es una decisión de contenido y la revisión pidió no agregar
nada. Queda registrado para decidirlo.

### M5 · La Home carga tres hojas de estilo (22,4 KB)
Astro las separa por componente. No es un defecto: es el costo de esa granularidad, y son
paralelas y cacheables. Se registra como observación, no como problema.

---

## Sin hallazgos

- **Secretos:** ni en el historial de git ni en los archivos versionados. `.env` correctamente
  ignorado y ausente del índice.
- **Dependencias:** `npm audit` sin vulnerabilidades. Tres paquetes declarados *(cierto en esta
  fecha; hoy son cuatro — `@types/node` se sumó para que `astro check` verifique los tests. Ver
  `auditoria-preproduccion.md`, revisión 2026-09-08, B5)*.
- **Tabnabbing:** todos los enlaces externos llevan `rel="noopener"`.
- **Inyección:** los dos usos de `set:html` reciben valores del build, no de usuarios. El script
  del cotizador escribe con `textContent` y codifica la URL con `encodeURIComponent`.
- **Enlaces:** ninguno roto, ninguna ruta huérfana, y el número de WhatsApp sale siempre de la
  configuración en las nueve páginas.
- **Accesibilidad:** idioma, un `h1` por página, landmarks, enlace de salto, navegación rotulada,
  campos con etiqueta, SVG decorativos ocultos y contraste verificado por cálculo en los doce
  pares en uso.


---

## Verificación posterior

| Comprobación | Resultado |
|---|---|
| `npm run check` | 0 errores en 45 archivos |
| `npm test` | **47 tests**, 9 nuevos que fijan cada corrección |
| `npm run build` | verde · falla correctamente si falta `PUBLIC_SITE_URL` |
| Entradas hostiles | vacío, letras, negativos, decimal inglés, comas inglesas y símbolos de moneda: ninguna produce una cifra errónea ni `NaN` |
| Precarga de fuentes | 2 en las páginas con cotizador, 1 en el resto |
| **Líneas de estilo modificadas** | **0** — la revisión no cambió nada visual |

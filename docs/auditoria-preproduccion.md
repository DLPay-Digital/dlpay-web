# Auditoría técnica previa a producción — 2026-09-04

> Diseño **congelado**. Sin funcionalidades nuevas, sin dependencias nuevas, sin cambios visuales.
> Método: inspeccionar → clasificar → documentar → corregir sólo lo que corresponda.
>
> Continúa `hardening-2026-09-04.md`. Esta revisión busca lo que aquella no cubrió, e incluye una
> regresión introducida por ella misma.

---

## 🔴 CRÍTICO

### A1 · Los montos con tres o más decimales se multiplican por mil

`parseAmount` decide si un separador es decimal contando los dígitos que lo siguen: tres dígitos
agrupan miles. La regla funciona para `2.000.000` y para `2174.62`, pero **rompe el formato
chileno cuando hay más de dos decimales**, porque ahí la coma decimal va seguida de tres dígitos:

| Se escribe | Se interpreta | Debería | Error |
|---|---|---|---|
| `2.174,626` | **2.174.626** | 2.174,626 | ×1000 |
| `1.234,5678` | **12.345.678** | 1.234,5678 | ×10000 |

El campo de dólares acepta decimales, y un monto pegado desde una factura o una planilla puede
traer tres o cuatro. La cifra errónea **viaja al mensaje de WhatsApp**.

**Origen:** regresión introducida por la corrección I2 del hardening anterior, que resolvió el
formato inglés y rompió el chileno de alta precisión. El caso no estaba en los tests.

**Corregido:** cuando aparecen **ambos** separadores, el último manda como decimal, sin contar
dígitos — en `2.174,626` la coma es decimal por definición del formato. La heurística por posición
queda sólo para cuando hay un único tipo de separador. Con tests para los cuatro formatos.

---

## 🟠 IMPORTANTES

### B1 · La cifra que se muestra y la que se envía se calculan por caminos distintos

El componente hace la conversión con **cuatro expresiones propias** en vez de usar `convert()` y
`clpAmount()`, que es lo que consume el mensaje de WhatsApp. Son dos implementaciones de la misma
regla.

Además, las del componente **no llevan la guarda** `rate <= 0` que sí tiene el módulo. Con una tasa
corrupta, la pantalla mostraría `Infinity` y el mensaje diría `0`.

Va directo contra el requisito de que no exista ninguna posibilidad de mostrar o enviar un monto
incorrecto: hoy no divergen porque las dos fórmulas coinciden, pero **nada lo garantiza**.

**Corregido:** el componente usa las funciones del módulo. Una sola implementación, ya cubierta por
tests.

### B2 · La barra final es inconsistente y cada host la resuelve distinto

- Los enlaces internos apuntan a `/cotizar`.
- El sitemap declara `/cotizar/`.
- El build genera `dist/cotizar/index.html`.
- `trailingSlash` no está configurado.

Cloudflare Pages y Vercel **no se comportan igual** ante esto. En el mejor caso, cada navegación
interna paga una redirección; en el peor, un 404. Y para un buscador son dos URL distintas para el
mismo contenido.

Es un fallo que **no se ve en localhost** y aparece sólo al desplegar — justo la clase de problema
que esta auditoría busca.

**Corregido:** `trailingSlash: 'always'` declarado, y todos los enlaces internos, rutas canónicas y
el sitemap alineados con barra final.

### B3 · El aviso de monto mínimo probablemente nunca se anuncia

El mensaje de error se escribe **mientras la región sigue `hidden`**, y recién después se muestra.
Un lector de pantalla no vigila regiones ocultas: cuando el contenido cambia, la región no está en
el árbol de accesibilidad, así que el anuncio se pierde.

Efecto real: una persona que navega con lector de pantalla escribe un monto bajo el mínimo y **no
recibe ninguna señal** de que algo pasa.

**Corregido:** primero se muestra la región, después se escribe el texto.

---

## 🟡 MENORES

### C1 · El feed de actividad anuncia cada operación, para siempre
`aria-live="polite"` sobre una lista que emite una operación cada 14–46 segundos hace que un lector
de pantalla las lea todas, indefinidamente, sobre contenido **ambiental** que nadie pidió escuchar.
Interrumpe la lectura de lo que sí importa. **Corregido:** la lista deja de ser región viva; sigue
siendo legible y navegable, sólo que no interrumpe.

### C2 · Cambiar la fuente de actividad exige tocar dos lugares
`MockActivitySource` se instancia en el frontmatter y otra vez en el script del cliente. Al llegar
la fuente real habría que acordarse de las dos. **Corregido:** una función única en
`src/lib/activity/source.ts`; cambiar de fuente es cambiar una línea.

### C3 · `.inner` duplicado en las páginas interiores
Mismos valores repetidos en cuatro archivos. Sin efecto visual, pero es el mecanismo por el que
aparece la deriva. **No corregido:** tocarlo mueve el layout de todas las páginas y el diseño está
congelado. Queda registrado para la próxima ventana de cambios visuales.

---

## ✅ SIN PROBLEMAS

| Área | Resultado |
|---|---|
| Secretos | Nada en el historial ni en los archivos versionados. `.env` ignorado y fuera del índice. |
| Dependencias | `npm audit` sin vulnerabilidades. Tres paquetes: `astro`, `@astrojs/check`, `typescript`. |
| Peticiones a terceros | **Ninguna.** Fuentes auto-hospedadas, sin analítica, sin CDN, sin píxeles. |
| Tipos | Ni un `any`, ni un `@ts-ignore`. `astro check` limpio en 45 archivos. |
| Inyección | Los dos `set:html` reciben valores del build. El JSON-LD escapa `<`. El cotizador escribe con `textContent` y codifica la URL. |
| Enlaces externos | Todos con `rel="noopener"`. |
| Privacidad de la actividad | El tipo `ActivityEvent` sólo admite tipo, monto redondeado y momento: no hay dónde poner un dato personal. Con tests. |
| Datos de ejemplo | El distintivo depende de `isReal` y de `import.meta.env.DEV`: un build publicado siempre lo muestra. Verificado construyendo con la variable activada. |
| Acoplamiento con Guita | Un único punto (`src/lib/config/site.ts`). |
| Separación de capas | Contenido, pricing, actividad y configuración, cada uno en su módulo. La estructura admite remesas sin rehacer nada. |
| Contraste | Doce pares verificados por cálculo; el más ajustado, 1.09× su mínimo. |
| Accesibilidad estructural | Idioma, un `h1` por página, landmarks, enlace de salto, navegación rotulada, campos con etiqueta, SVG decorativos ocultos. |
| Peso | Home 26 KB HTML + 3,6 KB JS; CSS 36,6 KB; fuentes 89,5 KB. JS sólo en las dos páginas con cotizador. |

---

## 📌 DECISIONES PENDIENTES

Ninguna es técnica. Ninguna bloquea preparar el despliegue.

| # | Decisión | De quién |
|---|---|---|
| D1b | Proveedor de hosting (Cloudflare o Vercel) | Sebastián |
| D5 | Transparencia del spread → tabla de `/tarifas` | DLPay |
| D6 | Monto mínimo real | DLPay |
| D21 | Monto máximo (el estado está cableado y probado, inactivo sin el valor) | DLPay |
| D7 | Fuente oficial de precio | DLPay |
| D18 | Fuente real de actividad confirmada y anonimizada | DLPay |
| D9 | **Razón social** — bloquea publicar los textos legales | Compliance |
| D19 | Correo oficial de contacto | Compliance |
| D20 | Alcance descrito en los T&C frente al servicio real | Compliance |
| D22 | Mensaje prellenado en tres enlaces a WhatsApp | Sebastián |

---

## Verificación posterior

| Comprobación | Resultado |
|---|---|
| `npm run check` | 0 errores en 46 archivos |
| `npm test` | **48 tests**, con los cuatro formatos de monto fijados |
| `npm run build` | verde · falla a propósito sin `PUBLIC_SITE_URL` |
| Enlaces y rutas | ninguno roto, ninguna huérfana, barra final consistente |
| Datos de ejemplo | el distintivo sigue presente en el build |
| Aritmética | una sola implementación: pantalla y mensaje no pueden divergir |
| Cambios visuales | ninguno |

## Qué falta para desplegar

Todo lo que queda es **configuración y decisiones**, no trabajo de ingeniería:

1. Definir `PUBLIC_SITE_URL` en el entorno de despliegue. Sin ella el build falla a propósito.
2. Elegir proveedor (D1b) y crear la cuenta a nombre de DLPay.
3. El resto de variables `PUBLIC_*` está documentado en `.env.example`; ninguna es un secreto.
4. El plan de cutover, con lo que no debe capturarse, está en `docs/migracion-urls.md`.

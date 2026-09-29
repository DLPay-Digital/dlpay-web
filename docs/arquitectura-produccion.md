# Arquitectura de producción y mapa de integración

> Revisión de análisis. **No modifica la UI ni agrega funcionalidades.**
> Creado 2026-09-04 · actualizado 2026-09-08 con la guarda de despliegue y el escudo de
> indexación · **actualizado 2026-09-09**: se eliminó la ruta `/cotizar` y con ella el tercer
> script del cliente, y se descartó la actividad reciente por completo (D18). El sitio pasa a
> **ocho rutas** y **dos scripts** (§1.1, §2.2). **Actualizado 2026-09-15**: con `/blog` (2026-09-11)
> y el globo del héroe (2026-09-15) el sitio pasa a **nueve rutas estáticas más una por artículo**
> y **tres scripts**. Inventario rehecho en §1.1.
> Todo lo afirmado aquí está verificado contra el código y la salida del build, no descrito de
> memoria.

---

## 1. Qué corre dónde

La propiedad que define esta arquitectura: **el sitio no habla con nadie en tiempo de ejecución.**
Reverificado el 2026-09-08 — cero `fetch`, `XMLHttpRequest`, `WebSocket`, `EventSource`,
`sendBeacon` e importaciones dinámicas en `src/` y `tests/`. Cero recursos de terceros.

| Momento | Qué ocurre |
|---|---|
| **Build** | Se valida la configuración de despliegue (URL canónica y política de indexación), se resuelve el precio (`ConfigPriceSource`), se lee la configuración, se compone el HTML de las **diez** páginas —nueve rutas fijas más una por artículo del blog—, se genera el sitemap y el robots. Todo queda escrito en `dist/`. |
| **Cliente** | Entre **0 y 50,3 KB** de JavaScript según la página (tabla abajo). Cinco scripts en la Home, cuatro en las otras siete con JavaScript, **ninguno** en las cinco restantes; el peso está concentrado en la Home. |
| **Fuera del sistema** | La conversación por WhatsApp, la verificación bancaria y la ejecución de la operación. Nada de eso pasa por la web. |

### 1.1 El JavaScript que se envía — inventario exacto

Corrige una afirmación anterior de este documento («6 KB en las dos páginas con cotizador… más el
reloj del feed»). Ni eran dos páginas ni es un reloj.

> **Rehecho sobre el build del 2026-09-15.** La tabla anterior —dos scripts, ocho rutas— quedó
> obsoleta con `/blog` y, sobre todo, con el globo del héroe.

> **Rehecho otra vez el 2026-09-25**, con la intro de marca (ADR-0010) y su marcador de visita.
> Aparecen dos columnas nuevas y entran `/precio` y `/preguntas`, que faltaban desde el 2026-09-23.
> Medido sobre el build: bytes de los `<script>` ejecutables, en línea y de módulo.

| Página | `is:inline` | Motion | Marcador | Intro | Quoter | Globo | Total |
|---|---|---|---|---|---|---|---|
| `/` | 56 B | 489 B | 319 B | 6 293 B | 4 528 B | 40 525 B | **50,3 KB** |
| `/como-funciona/`, `/confianza/`, `/empresas/`, `/precio/`, `/preguntas/`, `/blog/`, `/blog/<slug>/` | 56 B | 489 B | 319 B | — | — | — | **1,1 KB** |
| `/terminos/`, `/privacidad/`, `/tarifas/`, `/canal-de-denuncias/` | — | — | — | — | — | — | **0 B** |
| `404.html` | — | — | — | — | — | — | **0 B** |

La intro añade además **≈1,2 KB de CSS**, y sólo a la hoja de la Home: ninguna otra página la carga.

**Cinco páginas en cero bytes ejecutables**: las cuatro legales y la 404, añadida el 2026-09-15. Lo
único que llevan es el bloque `application/ld+json`, que es dato y no se ejecuta. La 404 no figura
entre las rutas porque no lo es: el host la sirve bajo cualquier URL que no exista, va con
`noindex` y sin canónico, y queda fuera del sitemap.

**Desde el 2026-09-25 eso deja de depender de que alguien se acuerde.** Que estas cinco no ejecuten
nada era una propiedad del build sin nadie que la vigilara, y la intro de marca fue la primera pieza
que quiso ponerlas a ejecutar —Sebastián lo rechazó, es la «opción C» de ADR-0010—. `tests/zero-js.test.ts`
la fija: falla si una de las cinco estrena un `<script>`, si el marcador llega donde no debe, o si
en la Home el marcador quedara **después** de la intro, que es el fallo silencioso que dejaría la
intro sin verse nunca.

**El sitio deja de estar en «cero almacenamiento».** El marcador escribe una llave de sesión
(`dlpay-visita`). No contradice lo que publica la Política de Privacidad —habla de cookies *de
seguimiento* y analítica *de terceros*— pero sí vació el argumento con el que **D28** estuvo
aparcada: a partir de hoy, dejar la franja de notificación sin botón de cerrar es una decisión de
diseño y no de arquitectura.

**El tercer script es el globo, y conviene mirarlo de frente.** De sus 40 525 B, casi todo son las
coordenadas del mapamundi incrustadas en línea; el código que las proyecta y las rota son unas
pocas decenas de líneas de JavaScript sin dependencias. Aun así son dos reglas duras de
`CLAUDE.md` §7 en suspenso —«el cotizador es la única isla interactiva» y «cero JS al cliente»— más
la regla 1 del Motion System, porque la rotación es infinita. Las tres enmiendas están escritas
(ADR-0007, 0008 y 0009) y siguen en estado **Propuesta**: hasta que se acepten, el código va por
delante de la decisión.

**Eran tres scripts hasta el 2026-09-09, dos hasta el 2026-09-15, y hoy vuelven a ser tres.** El tercero era la actividad reciente
(2 336 B), y vivía **sólo** en `/cotizar/`. Al eliminarse esa ruta —duplicaba el cotizador del
héroe de la Home— el componente quedó sin consumidores y su generador de operaciones ficticias
**ya no llega a ningún navegador**. Es la mejor resolución posible del punto 3 de más abajo: no se
mitigó, desapareció.

Los tres scripts y qué hace cada uno:

1. **Cotizador** (`Quoter.astro`, chunk externo de 4 528 B / 2,0 KB gzip) — la isla interactiva
   original. Interpreta lo que el usuario escribe, convierte con la **misma** función que arma
   el mensaje, y compone un enlace `wa.me`. Nada sale del navegador.
2. **Motion System V1** (`Motion.astro`, 489 B en línea + 62 B síncronos en el `<head>`) — un
   `IntersectionObserver` que añade `is-in` una vez por elemento y deja de observarlo. Los 62 B
   ponen `.js-motion` antes de pintar; el estado oculto de `[data-enter]` existe **sólo** bajo esa
   clase (`tokens.css:139`), así que si el script no corre la página se ve completa e inmóvil.
   Se incluye únicamente en las páginas con movimiento de entrada: las cuatro legales no lo llevan.
4. **Globo rotativo** (`hero/GloboRotativo.astro`, 40 525 B en línea, **sólo en la Home**) —
   proyecta el mapamundi sobre una esfera y avanza la longitud 6°/s con `requestAnimationFrame`.
   Sin imports, sin `fetch` y sin red: los datos viajan en el propio script. Con
   `prefers-reduced-motion: reduce` no rota — dibuja una sola vez y se detiene.
3. ~~**Actividad reciente**~~ — *eliminada del proyecto el 2026-09-09.* Vivía sólo en `/cotizar` y
   arrastraba `mock-activity-source.ts` completo al navegador. Al eliminarse esa ruta quedó sin
   página, y al revisarla se descartó la funcionalidad entera: nunca salió de la investigación y
   chocaba con D10 —un feed de actividad **es** una cifra de volumen—. El componente,
   `lib/activity` y sus tests se borraron. Ver D18 en `CLAUDE.md` §13.

### Lo que esto implica

- **No hay servidor.** Nada que parchear, escalar, monitorear ni exponer.
- **No hay superficie de datos.** Cero formularios que envíen, cero cookies, cero `localStorage`.
  Los montos que el usuario escribe **no salen del navegador**: viajan sólo dentro del mensaje que
  él mismo envía por WhatsApp.
  *Matizado el 2026-09-25:* desde la intro de marca hay **una** llave de `sessionStorage`,
  `dlpay-visita`, que vale `'1'` y se borra al cerrar la pestaña. No identifica a nadie, no viaja a
  ninguna parte y no se lee desde el servidor —no hay servidor—, pero la frase «cero almacenamiento»
  ya no es exacta y no conviene seguir diciéndola. Ver ADR-0010.
- **No hay claves.** Todas las variables son `PUBLIC_*` y son configuración, no secretos.
- **No hay dependencias en producción.** Las **cuatro** declaradas son de build: `astro`,
  `@astrojs/check`, `typescript` y `@types/node` (este último sólo para que `astro check` verifique
  los tests). Ninguna llega al navegador.

Esto no es minimalismo por gusto: es la razón por la que este sitio puede publicarse sin un plan
de operación, sin rotación de credenciales y sin un incidente posible de fuga de datos.

---

## 2. Mapa de integración

### 2.1 Sistemas vivos hoy

| Sistema | Dirección | Cuándo | Dueño | Costura en el código | Estado |
|---|---|---|---|---|---|
| **WhatsApp Business** | Saliente | Al hacer clic | DLPay | `lib/config/site.ts` (número) + `lib/pricing/quote.ts` (mensaje) | Vivo. Es el final del funnel. |
| **Plataforma Guita** | Saliente | Al hacer clic | Guita | `lib/config/site.ts` — **dos constantes** | Vivo. Se reemplaza cuando exista infraestructura propia. |

**No hay más.** Ni analítica, ni CDN de fuentes, ni mapas, ni chat de terceros, ni píxeles.

### 2.2 Sistemas previstos, con la costura ya construida

| Sistema | Interfaz que lo espera | Implementación de hoy | Qué cuesta enchufarlo | Bloqueado por |
|---|---|---|---|---|
| **Fuente de precio real** | `PriceSource` | `ConfigPriceSource` (valor de muestra) | Una clase nueva + una línea. La UI consume `Quote` y no sabe de dónde viene. | D7 |
| **Auth / KYC propios** | — | Enlaces a Guita | Cambiar dos constantes. La web **no** reconstruye registro ni KYC: es etapa aparte. | Etapa independiente |

### 2.3 Sistemas que existen en la operación pero **no** tocan la web

Banco BCI, proveedores de liquidez, back-office de Guita, herramientas internas. Se registran para
que quede claro que **no** son integraciones pendientes: son operación, y la web no las conoce.

### 2.4 Diagrama del flujo real

```
   Persona
      │  escribe un monto
      ▼
   Cotizador (en su navegador)  ──── no sale nada a ningún servidor
      │  arma un mensaje
      ▼
   WhatsApp  ──►  Ejecutivo DLPay  ──►  confirma precio y datos
                                          │
                                          ▼
                          Transferencia · verificación en banco
                                          │
                                          ▼
                            Entrega de dólar digital a la billetera
```

La web cubre **sólo el primer tramo**. Todo lo demás es humano y operativo, y esa frontera está
declarada en `/como-funciona` y `/confianza`.

---

## 3. Modos de fallo y degradación

Qué pasa cuando algo falla, y qué ve la persona. Verificado en la salida del build.

| Falla | Consecuencia | Degradación |
|---|---|---|
| **El JavaScript no carga o falla** | El cotizador no recalcula | El CTA **ya trae un mensaje armado en el servidor**, con monto de ejemplo. El enlace a WhatsApp sigue funcionando. La navegación y el acordeón de FAQ no usan JS. |
| **Una tipografía no carga** | Se ve con la de reserva | Las cuatro tienen `font-display: swap` y stack de reserva declarado. Nada queda invisible. |
| **WhatsApp no está disponible** | El enlace no abre | **Sin cobertura.** No hay canal alternativo visible en el momento del clic. Ver §6. |
| **El precio de muestra es incorrecto** | Se muestra un referencial equivocado | Contenido, no arquitectura: el precio final lo confirma una persona, y la web lo dice en cada pantalla. |
| **La fuente de actividad falla** (a futuro) | La sección queda vacía o desactualizada | El componente no bloquea nada; es ambiental. |
| **El host se cae** | El sitio no responde | Es estático: se republica en otro host copiando `dist/`. Sin estado que migrar. |
| **Se despliega con la configuración mal puesta** | — | **No llega a ocurrir.** El build se niega: sin `PUBLIC_SITE_URL` válida aborta con salida 1, y sin `PUBLIC_ALLOW_INDEXING=true` publica `noindex` en vez de arriesgar la indexación. El fallo se convierte en un error de build, que es el único momento en que sale gratis. |

---

## 4. Revisión de capas — verificado

El grafo de importaciones se analizó completo. **No hay una sola dependencia invertida.**

```
   pages  ──►  layouts  ──►  components  ──►  content
                                │
                                ├──►  lib/pricing    (dominio: conversión y mensaje)
                                └──►  lib/config     (marca, contacto, enlaces a Guita,
                                          │           URL del sitio, indexación)
                                          └──►  lib/config/environment.ts
                                                (resolución y validación del entorno — PURO)

   astro.config.mjs  ──────────────────────►  lib/config/environment.ts
```

`environment.ts` es el único módulo que consumen **los dos runtimes**: el config de Astro (que se
evalúa antes de que Vite inyecte `import.meta.env`, y lee el entorno con `loadEnv` de Vite) y
`lib/config/site.ts` (que lo lee con `import.meta.env` durante el render). Es puro —no lee ninguna
de las dos fuentes, las recibe como argumento—, y por eso la resolución de la URL y la política de
indexación tienen **una sola implementación** en vez de una por runtime.

- **`lib/` no sabe que existe un navegador.** Verificado: ni una referencia a `document`, `window`
  o Astro. Por eso su lógica se puede testear con el runner de Node, sin DOM.
- **La conversión tiene una sola implementación**, consumida por la pantalla y por el mensaje.
- **La URL del sitio tiene una sola implementación y un solo punto de lectura.** `site.url` sale de
  `lib/config/site.ts` y alimenta canonical, Open Graph, JSON-LD, sitemap y robots. Hasta el
  2026-09-08 había **dos** lectores con dos respaldos a localhost, y la guarda vivía sólo en uno.
- **El acoplamiento con Guita son dos constantes** en un único archivo.
- **El contenido está separado de la presentación**: `src/content/` es dato tipado.

### ¿Aguanta crecer hacia remesas sin rehacerse?

Sí, y la razón es que **el eje del dominio es la intención, no la moneda**. `Intent` ya distingue
enviar de convertir; añadir un destino, un corredor o un tipo de operación es extender una unión
de tipos, no rehacer el modelo. La UI consume `Quote` y no conoce la fórmula.

Lo que **sí** exigiría rehacer: si la web tuviera que ejecutar operaciones, guardar estado de
usuario o mostrar datos autenticados. Eso no es una extensión — es otra aplicación, y por eso vive
en otra etapa y probablemente en otro subdominio.

---

## 5. Lo que falta para producción y **no** está en el código

Son configuración del host. No se commitean todavía porque atarían el proyecto a un proveedor
antes de que la decisión exista (ADR-0005).

### 5.1 Cabeceras de seguridad

ADR-0005 las exige y hoy **no hay ninguna**. Un sitio estático no puede fijarlas: las pone el host.
Conjunto recomendado, a aplicar al elegir proveedor:

| Cabecera | Valor | Por qué |
|---|---|---|
| `Content-Security-Policy` | `default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'none'; form-action 'none'; frame-ancestors 'none'; base-uri 'self'` | El sitio no llama a nadie: `connect-src 'none'` es literalmente cierto y cierra la exfiltración. `unsafe-inline` es necesario porque Astro inlinea el script y los estilos. |
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains` | Sólo tras confirmar que todos los subdominios sirven HTTPS. |
| `X-Content-Type-Options` | `nosniff` | |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Que WhatsApp no reciba la ruta completa. **No endurecer a `no-referrer` sin leer la nota de abajo.** |
| `Permissions-Policy` | `geolocation=(), camera=(), microphone=(), payment=()` | El sitio no usa ninguna. |
| `X-Frame-Options` | `DENY` | Redundante con `frame-ancestors`, para navegadores viejos. |
| `X-Robots-Tag` | `noindex, nofollow` — **sólo en Staging** | La defensa robusta contra la indexación de un despliegue que no es el sitio público. El HTML ya lleva `noindex` y el robots un `Disallow: /`, pero `Disallow` impide el rastreo y un buscador que no rastrea **nunca lee el `noindex`**: podría indexar una URL descubierta por un enlace externo. Como cabecera HTTP el veto no depende de que la página se lea. **Nunca en producción.** |

**Sobre `Referrer-Policy`, un acoplamiento del 2026-09-25 que conviene que se vea.** La intro de
marca decide si se muestra con dos comprobaciones, y la segunda es un respaldo que descarta la
visita cuando `document.referrer` es de nuestro propio origen (ADR-0010, «opción C»). Ese respaldo
es lo único que impide que la intro se dispare a mitad de visita a quien entró por una de las cinco
páginas que no llevan marcador. `strict-origin-when-cross-origin` manda referente en la navegación
interna, así que funciona; **`no-referrer` lo dejaría sin efecto en silencio** —ningún error, ningún
test rojo, sólo una intro apareciendo donde no debe—. Si algún día hace falta endurecerlo, el camino
es reabrir la opción A de ADR-0010, no quitar el respaldo.

Sobre el `unsafe-inline` de `script-src`: los scripts en línea los genera el build y son estables,
así que se pueden fijar por **hash** y dejar el CSP estricto sin `unsafe-inline`. Vale evaluarlo al
elegir proveedor; requiere calcular los hashes en el build. **Eran tres hasta el 2026-09-25**; con
el marcador de visita y la intro de marca son **cinco en la Home y cuatro en las otras siete
páginas con JavaScript**, más un bloque de estilo que ya cubre el `style-src`.

### 5.2 Caché

| Recurso | Nombre | Recomendación |
|---|---|---|
| `/_astro/*` (CSS y JS) | con hash de contenido | `max-age=31536000, immutable` |
| `/fonts/*.woff2` | **sin hash** | **No marcar inmutable.** Son el 33% del peso y su nombre es estable: si se reemplaza una fuente, los navegadores servirían la vieja. Usar `max-age=604800` con revalidación, o añadir hash al nombre en un cambio futuro. |
| HTML | — | `max-age=0, must-revalidate` |
| `/og-image.png`, iconos | estable | `max-age=86400` |

### 5.3 Variables de entorno del despliegue

Todas públicas. Dos son **decisiones de despliegue** y el build las trata como tales:

| Variable | Obligatoria | Comportamiento |
|---|---|---|
| `PUBLIC_SITE_URL` | **Sí** | El build **falla** si falta o si no es publicable: rechaza hosts locales (`localhost`, `127.0.0.1`, `0.0.0.0`, `::1`, `*.localhost`, `*.local`, `*.test`, `*.internal`), lo que no sea `https`, rutas que no sean la raíz del dominio, y parámetros o fragmento. Valida, no comprueba presencia. |
| `PUBLIC_ALLOW_INDEXING` | No | **Cerrada por omisión.** Sólo el literal `true` habilita la indexación. Cualquier otra cosa deja `noindex, nofollow` en las nueve páginas y `Disallow: /` en el robots. Se pone en `true` **únicamente** en el despliegue del sitio público. |

Ambas las valida la integración `dlpay:deploy-guard` de `astro.config.mjs` en el hook
`astro:config:setup`, cuando Astro declara que el comando es `build`. Pregunta a Astro **qué está
haciendo**, no cómo lo invocaron: cubre `npm run build`, `astro build`, `npx astro build`,
`--outDir`, un script envoltorio y la API programática. Aborta con **código de salida 1**, así que
un CI lo nota.

Cada build declara en su salida la decisión que aplicó — porque fallar cerrado tiene su propio
riesgo inverso, que es publicar el sitio real con `noindex` sin enterarse:

```
[dlpay:deploy-guard] URL canónica: https://dlpay.cl
[dlpay:deploy-guard] Indexación PERMITIDA — este build es para el sitio público.
```

Para verificar un build en local, la URL va en la misma línea:
`PUBLIC_SITE_URL=https://dlpay.cl npm run build`. El respaldo a `localhost` sigue existiendo para
`astro dev`, donde es la respuesta correcta.

El resto está documentado en `.env.example` con su valor y su porqué.

### 5.4 Redirecciones

En `docs/migracion-urls.md`. Lo crítico: `/auth/*`, `/app/`, `/onboarding*` y `/renewal/*` son de
la plataforma y **la web nueva no debe capturarlos**.

---

## 6. Hallazgos

### ✅ Resueltos el 2026-09-08

Detalle completo en `docs/auditoria-preproduccion.md`, revisión 2026-09-08.

| Hallazgo | Estado |
|---|---|
| La guarda de `PUBLIC_SITE_URL` se saltaba con `astro build` directo (dependía de `npm_lifecycle_event`) | Resuelto: integración `dlpay:deploy-guard` sobre el `command` de Astro |
| La guarda comprobaba presencia, no validez: `.env.example` traía `localhost` y producía builds verdes con localhost en todas las URL publicadas | Resuelto: validación real + plantilla limpia |
| Sin forma de evitar que Staging fuera indexado, incluidas las páginas legales pendientes de Compliance | Resuelto: `PUBLIC_ALLOW_INDEXING`, cerrado por omisión |
| Dos lectores de la URL del sitio, cada uno con su respaldo a localhost; la validación cubría la mitad de las URL | Resuelto: `lib/config/environment.ts` puro, un solo punto de lectura |

### 🟠 El monto mínimo tiene dos fuentes de verdad

> **Resuelto el 2026-09-09 por D24.** Lo que sigue describe el problema y se conserva porque
> explica por qué la solución es la que es; el «no corregido» del final ya no vale.

`PUBLIC_QUOTE_MIN_CLP` se leía en **dos lugares**, cada uno con su propio valor por defecto:

- `components/Quoter.astro` — lo **aplica** (bloquea la operación)
- `pages/tarifas.astro` — lo **publica** (se lo dice al usuario)

Coincidían porque leían la misma variable y repetían el mismo número. Pero bastaba con que alguien
cambiara un valor por defecto para que **la web publicara un mínimo y aplicara otro** — en una
página de tarifas, que es exactamente donde una discrepancia es un problema de confianza.

**Hoy hay un solo resolutor**, `resolveQuoteLimits` en `lib/config/environment.ts`, y los cinco
consumidores leen su resultado. La discrepancia dejó de ser posible por construcción, no por
disciplina, y `tests/config.test.ts` fija que los valores por defecto viven ahí y en ningún otro
sitio.

**Y se estrenó el 2026-09-25**, que es la prueba de que la consolidación servía para algo: Sebastián
confirmó el mínimo real —**CLP 500.000**, contra los 50.000 que eran placeholder— y el cambio fue
**una línea**. La página publica y el cotizador aplica el mismo número sin que nadie tenga que
acordarse de los dos sitios.

### 🟡 Las fuentes no llevan hash de contenido

Impide marcarlas como inmutables siendo el 33% del peso. Mitigable con la política de caché de
§5.2; resoluble del todo añadiendo hash al nombre. **No corregido:** afecta el build, y la ventana
para eso es la preparación del despliegue.

### 🟡 No hay cobertura si WhatsApp no abre

Todo el funnel termina en un único canal. Si el enlace no abre —app no instalada en escritorio,
bloqueo de red—, la persona queda sin salida visible en ese momento. No es un defecto de código
sino una decisión de producto: hoy WhatsApp **es** el canal.
📌 Queda como decisión: si conviene un canal de respaldo visible, y cuál.

---

## 7. Veredicto — 2026-09-08

**La arquitectura está terminada y en condiciones de producción. No queda ingeniería pendiente
para publicar.** Las razones son verificables, no de opinión:

- Sin servidor, sin base de datos, sin secretos, sin dependencias en ejecución.
- Sin recogida ni almacenamiento de datos personales.
- Sin peticiones a terceros, cero red en runtime — reverificado.
- Capas limpias, sin dependencias invertidas, con el dominio testeado y aislado del navegador.
- Una sola implementación de cada regla que puede mostrar un dato equivocado: la conversión, y
  ahora también la URL canónica y la política de indexación.
- Degradación real sin JavaScript.
- Portabilidad comprobada: publicar es copiar una carpeta.
- **Un build que se niega a publicar mal:** URL inválida → salida 1; indexación no autorizada
  explícitamente → `noindex`. Y declara en voz alta la decisión que aplicó.
- `npm run check` 0 errores en 56 archivos · `npm test` 68/68 · `npm audit` 0 vulnerabilidades.

### Lo que falta no es técnico

**Bloqueantes reales — Compliance:** D9 (razón social: se usa DLPZ INCZ SpA y los T&C publicados
dicen «DLPZ PRO SpA»), D19 (correo oficial de contacto) y D20 (el alcance de los T&C ya no coincide
con el servicio). Mientras estén abiertos, `/terminos/` y `/privacidad/` seguirán siendo páginas de
estado — y por eso el escudo de indexación no es una comodidad de Staging.

**Configuración de despliegue:** D1b (proveedor, a nombre de DLPay), las dos variables de §5.3, las
cabeceras de §5.1 —incluida `X-Robots-Tag` en Staging— y la política de caché de §5.2.

El detalle completo, con quién resuelve cada cosa, está en
`docs/auditoria-preproduccion.md` → *Bloqueantes de producción*.

# Arquitectura de producción y mapa de integración

> Revisión de análisis. **No modifica la UI ni agrega funcionalidades.** Fecha: 2026-09-04.
> Todo lo afirmado aquí está verificado contra el código y la salida del build, no descrito de
> memoria.

---

## 1. Qué corre dónde

La propiedad que define esta arquitectura: **el sitio no habla con nadie en tiempo de ejecución.**
Verificado — cero llamadas `fetch`, cero WebSocket, cero recursos de terceros.

| Momento | Qué ocurre |
|---|---|
| **Build** | Se resuelve el precio (`ConfigPriceSource`), se lee la configuración, se compone el HTML de las nueve páginas, se genera el sitemap y el robots. Todo queda escrito en `dist/`. |
| **Cliente** | 6 KB de JavaScript en las dos páginas con cotizador. Sólo hace tres cosas: interpretar lo que el usuario escribe, convertir, y armar un enlace `wa.me`. Más el reloj del feed de actividad. |
| **Fuera del sistema** | La conversación por WhatsApp, la verificación bancaria y la ejecución de la operación. Nada de eso pasa por la web. |

### Lo que esto implica

- **No hay servidor.** Nada que parchear, escalar, monitorear ni exponer.
- **No hay superficie de datos.** Cero formularios que envíen, cero `localStorage`, cero cookies.
  Los montos que el usuario escribe **no salen del navegador**: viajan sólo dentro del mensaje que
  él mismo envía por WhatsApp.
- **No hay claves.** Todas las variables son `PUBLIC_*` y son configuración, no secretos.
- **No hay dependencias en producción.** Las tres declaradas son de build.

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
| **Fuente de actividad real** | `StreamingActivitySource` | `MockActivitySource` | Una clase nueva + una línea en `lib/activity/source.ts`. | D18 |
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

---

## 4. Revisión de capas — verificado

El grafo de importaciones se analizó completo. **No hay una sola dependencia invertida.**

```
   pages  ──►  layouts  ──►  components  ──►  content
                                │
                                ├──►  lib/pricing    (dominio: conversión y mensaje)
                                ├──►  lib/activity   (dominio: eventos de la mesa)
                                └──►  lib/config     (marca, contacto, enlaces a Guita)
```

- **`lib/` no sabe que existe un navegador.** Verificado: ni una referencia a `document`, `window`
  o Astro. Por eso su lógica se puede testear con el runner de Node, sin DOM.
- **La conversión tiene una sola implementación**, consumida por la pantalla y por el mensaje.
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
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Que WhatsApp no reciba la ruta completa. |
| `Permissions-Policy` | `geolocation=(), camera=(), microphone=(), payment=()` | El sitio no usa ninguna. |
| `X-Frame-Options` | `DENY` | Redundante con `frame-ancestors`, para navegadores viejos. |

### 5.2 Caché

| Recurso | Nombre | Recomendación |
|---|---|---|
| `/_astro/*` (CSS y JS) | con hash de contenido | `max-age=31536000, immutable` |
| `/fonts/*.woff2` | **sin hash** | **No marcar inmutable.** Son el 33% del peso y su nombre es estable: si se reemplaza una fuente, los navegadores servirían la vieja. Usar `max-age=604800` con revalidación, o añadir hash al nombre en un cambio futuro. |
| HTML | — | `max-age=0, must-revalidate` |
| `/og-image.png`, iconos | estable | `max-age=86400` |

### 5.3 Variables de entorno del despliegue

Todas públicas. `PUBLIC_SITE_URL` es **obligatoria**: sin ella el build falla a propósito.
El resto está documentado en `.env.example` con su valor y su porqué.

### 5.4 Redirecciones

En `docs/migracion-urls.md`. Lo crítico: `/auth/*`, `/app/`, `/onboarding*` y `/renewal/*` son de
la plataforma y **la web nueva no debe capturarlos**.

---

## 6. Hallazgos de esta revisión

### 🟠 El monto mínimo tiene dos fuentes de verdad

`PUBLIC_QUOTE_MIN_CLP` se lee en **dos lugares**, cada uno con su propio valor por defecto:

- `components/Quoter.astro` — lo **aplica** (bloquea la operación)
- `pages/tarifas.astro` — lo **publica** (se lo dice al usuario)

Hoy coinciden porque leen la misma variable y repiten el mismo `50000`. Pero si alguien cambia un
valor por defecto, **la web publicaría un mínimo y aplicaría otro** — en una página de tarifas,
que es exactamente donde una discrepancia es un problema de confianza.

Corresponde moverlo a `lib/config`, junto al resto de la configuración de negocio. Es consolidación,
sin efecto en la UI. **No corregido:** esta revisión es de análisis; queda propuesto.

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

## 7. Veredicto

La arquitectura está en condiciones de producción. Las razones son verificables, no de opinión:

- Sin servidor, sin base de datos, sin secretos, sin dependencias en ejecución.
- Sin recogida ni almacenamiento de datos personales.
- Sin peticiones a terceros.
- Capas limpias, sin dependencias invertidas, con el dominio testeado y aislado del navegador.
- Degradación real sin JavaScript.
- Portabilidad comprobada: publicar es copiar una carpeta.

Lo que falta es **configuración del host y decisiones**, no ingeniería.

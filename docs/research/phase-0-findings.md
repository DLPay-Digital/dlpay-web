# Fase 0 — Documento de Hallazgos

> **Estado del documento:** en curso. Recoge la investigación de Fase 0 antes del checkpoint con DLPay.
> No cierra ninguna decisión de arquitectura, identidad, contenido ni pricing.
> **Fecha de la investigación:** 2026-09-02.
> **Autor:** Claude Code (bajo supervisión de Sebastián Villanueva).

---

## 0. Taxonomía de marcadores (usada en todo el documento)

| Marcador | Significado |
|---|---|
| **HECHO VERIFICADO** | Existe evidencia directa y reproducible (consulta DNS/WHOIS, header HTTP, documento publicado). |
| **INFERENCIA** | Conclusión razonable a partir de evidencia, pero no confirmada por una fuente primaria. |
| **PENDIENTE DE VERIFICACIÓN** | Falta evidencia; requiere acceso o información que hoy no tenemos. |
| **PENDIENTE DE DECISIÓN** | Requiere una decisión de DLPay / del proyecto. |
| **REQUIERE VALIDACIÓN DE COMPLIANCE** | Afirmación con implicancia legal; la aprobación es de DLPay, no de Claude. |
| **PENDIENTE DE ASSET** | Recurso de marca aún no disponible. |

---

## 1. Objetivo de Fase 0

Entender con precisión, **basándose en hechos**, el estado actual de la presencia digital de
DLPay antes de tomar cualquier decisión de UX, identidad, arquitectura o tecnología:

- entender la infraestructura actual;
- identificar las dependencias de Guita;
- determinar qué controla DLPay y qué controla Guita;
- identificar riesgos de migración;
- documentar dependencias técnicas;
- identificar información y assets que faltan;
- documentar las páginas legales y URLs que deberán considerarse en la nueva web;
- preparar las preguntas necesarias para el checkpoint con DLPay.

**Fase 0 NO construye la web.** No se instala Node/npm, no se inicializa la aplicación, no se
crean componentes ni se escribe código de producción. La única escritura permitida es esta
documentación. No se modifica ningún sistema productivo (dominio, DNS, correo, hosting,
cuentas, Guita).

**Fuera del alcance de Fase 0:** el estado regulatorio ante la CMF no se investiga ni se usa
como criterio de arquitectura, UX, contenido o migración en este proyecto.

---

## 2. Metodología

### 2.1 Fuentes usadas
- **Reconocimiento técnico pasivo** de `dlpay.cl` (y comparación con `guita.cl`):
  consultas DNS y WHOIS públicas, cabeceras HTTP (`curl`), `robots.txt` / `sitemap.xml`,
  certificado TLS, y lectura de **assets estáticos públicos** que el sitio sirve abiertamente
  (bundle JavaScript de Next.js, PDFs legales publicados).
- **Documentos legales publicados** por DLPay y enlazados desde el sitio:
  `dlpay-terms-and-conditions.pdf` (Versión 1.5 — Julio 2026) y `dlpay-privacy-policy.pdf`.
- **Documentos de negocio internos** ya presentes en la carpeta de trabajo de DLPay
  (`~/Desktop/DLPAY`), citados por nombre. Solo se citan **hechos de negocio no sensibles**
  (razón social, modelo, roles del equipo, proveedores). **No se copian ni se versionan** en
  este repositorio datos de clientes, KYC/KYB, historial transaccional, contratos ni documentos
  personales.

### 2.2 Lo que NO se hizo (por diseño y por los Términos y Condiciones del sitio)
Los T&C de DLPay (cláusula SÉPTIMA) prohíben expresamente el uso de scrapers/crawlers, la
ingeniería inversa y el testeo de vulnerabilidades sin consentimiento previo por escrito. En
consecuencia **no** se ejecutaron: consultas GraphQL contra la API, intentos de
autenticación, introspección de esquema, escáneres, crawlers automáticos ni enumeración
exhaustiva de rutas. La inspección profunda de la app autenticada y de `api.guita.cl` debe
hacerla DLPay con sus propias credenciales.

### 2.3 Límite de esta fase
Buena parte de los datos (credenciales del registrador, contrato con el proveedor, titularidad
de cuentas Google/AWS/DigitalOcean, licencias tipográficas, criterio de Compliance) **solo los
tiene DLPay o Guita**. Esos puntos quedan como `PENDIENTE DE VERIFICACIÓN` con preguntas
concretas en §10.

---

## 3. Resumen ejecutivo

1. **DLPay no controla su infraestructura web.** `HECHO VERIFICADO`: el dominio `dlpay.cl`
   está registrado a nombre de **Guita SpA** (no de DLPay), el DNS está en una cuenta de
   **DigitalOcean**, el sitio está alojado en **Firebase Hosting** (proyecto `dlpay-cl`) y toda
   la funcionalidad de aplicación (registro, login, onboarding, KYC, cotización) corre contra el
   backend de Guita en **`https://api.guita.cl/graphql`**. `dlpay.cl` es, técnicamente, **un
   sitio-inquilino dentro de la plataforma multi-tenant de Guita**.

2. **El sitio actual ya es una plataforma completa, no una landing.** `HECHO VERIFICADO`:
   incluye flujos de `/auth/*` (login, registro, confirmación, reset de clave, desbloqueo de
   cuenta), `/onboarding`, `/enhanced_onboarding`, `/renewal/verification` y `/complaints`.
   La KYC se hace con **FaceTec** (biometría/liveness) servido desde `shared.guita.cl`.

3. **El stack técnico del frontend es Next.js + Apollo (GraphQL).** `HECHO VERIFICADO`:
   App Router, React Server Components, Apollo Client contra `api.guita.cl`. Backend Guita en
   **Ruby on Rails sobre Google Cloud**. Assets compartidos en **AWS CloudFront/S3**.

4. **Correo en Google Workspace, con configuración incompleta.** `HECHO VERIFICADO`:
   `dlpay.cl` recibe correo vía Google (`MX smtp.google.com`), tiene DKIM (`google._domainkey`)
   **pero NO tiene registro SPF ni DMARC**. Riesgo de suplantación y de entregabilidad para una
   fintech.

5. **Inconsistencia de razón social y de dominios de correo.** `PENDIENTE DE VERIFICACIÓN ·
   REQUIERE VALIDACIÓN DE COMPLIANCE`: los T&C y la Política de Privacidad publicados nombran
   **"DLPZ PRO SpA"** (RUT 78.378.714-8); los documentos internos (deck BCI, organigrama)
   nombran **"DLPZ INCZ SpA" / "DLPay Digital"**; el dominio lo registra **"Guita SpA"**. Además
   la Política de Privacidad usa `contacto@dlpzpro.cl` mientras los T&C usan `contacto@dlpay.cl`.
   No se resuelve por inferencia: requiere confirmación de DLPay.

6. **Documentos legales referencian páginas que no existen.** `HECHO VERIFICADO`: los T&C
   citan `www.dlpay.cl/tarifas` (tabla de comisiones, tipo de cambio y spread) y
   `www.dlpay.cl/privacidad`; ambas rutas —y también `/terminos`— devuelven **HTTP 404**. La
   divulgación tarifaria exigida por el propio contrato **no está publicada**.

7. **No hay analítica ni tracking** detectable en el bundle público (sin GA/GTM/Meta/Hotjar/
   Sentry/Segment). `HECHO VERIFICADO` (alcance: solo lo observable en el bundle público).

8. **La marca no tiene sistema.** `HECHO VERIFICADO`: tres piezas oficiales (deck BCI,
   organigrama, web) con tres estéticas; único elemento común, el verde. No hay manual de
   marca, ni logo vectorial localizado, ni tipografías/licencias documentadas.

**Bloqueo principal para avanzar a un cutover** (no para el trabajo de diseño/arquitectura):
DLPay debe recuperar o co-administrar el **dominio**, el **DNS** y el **correo**, y confirmar la
**titularidad de todas las cuentas de infraestructura**. Hasta entonces, cualquier migración de
producción depende de Guita.

---

## 4. Inventario de sistemas

| # | Sistema | Qué es | Proveedor/Plataforma | Titular aparente | Evidencia | Marcador |
|---|---|---|---|---|---|---|
| S1 | Dominio `dlpay.cl` | Dominio principal | NIC Chile | **Guita SpA** | WHOIS `whois.nic.cl` | HECHO VERIFICADO (registrant); titularidad efectiva PENDIENTE DE VERIFICACIÓN |
| S2 | Zona DNS de `dlpay.cl` | Registros DNS | **DigitalOcean** (`ns1/2/3.digitalocean.com`) | Cuenta DO de Guita | `dig NS`, WHOIS | HECHO VERIFICADO (proveedor); dueño de la cuenta INFERENCIA |
| S3 | Hosting web | Sitio público + app shell | **Firebase Hosting** (proyecto `dlpay-cl`, `dlpay-cl.web.app`), CDN Fastly, edge Santiago | Cuenta Google/Firebase de Guita | `A 199.36.158.100`, `CNAME www → dlpay-cl.web.app`, TXT `hosting-site=dlpay-cl`, headers `x-fh-requested-host` + Fastly, `dlpay-cl.web.app` sirve el mismo sitio | HECHO VERIFICADO (plataforma); dueño INFERENCIA |
| S4 | Backend / API | API de la aplicación | **`https://api.guita.cl/graphql`** — Ruby on Rails sobre **Google Cloud** | **Guita** | `uri:"https://api.guita.cl/graphql"` en el bundle; headers de `api.guita.cl/`: `server: Google Frontend`, `via: 1.1 google`, `x-runtime`, `x-request-id`, `x-cloud-trace-context`; `A 34.49.26.8` (GCLB) | HECHO VERIFICADO |
| S5 | Assets compartidos | SDK FaceTec, imágenes | **`shared.guita.cl`** → AWS CloudFront (`d2rihof0aifpvl.cloudfront.net`) | Guita | `dig` + referencias en bundle (`shared.guita.cl/facetec/sdk/FaceTecSDK.js`) | HECHO VERIFICADO |
| S6 | KYC / biométrico | Verificación de identidad + liveness | **FaceTec** (SDK servido por Guita) | Contrato FaceTec de Guita | `shared.guita.cl/facetec/...`, `livenesscheckhelp.com` en bundle | HECHO VERIFICADO (uso); contrato/tenant PENDIENTE |
| S7 | Autenticación | Login/registro | Guita (email+clave) + **Google OAuth** + **reCAPTCHA** | Guita | rutas `/auth/*`; `accounts.google.com/gsi/client`; env `NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID`, `NEXT_PUBLIC_GOOGLE_CAPTCHA_SITE_KEY` | HECHO VERIFICADO |
| S8 | Correo `@dlpay.cl` | Correo corporativo/transaccional | **Google Workspace** | PENDIENTE (¿DLPay? ¿Guita?) | `MX 1 smtp.google.com`; DKIM `google._domainkey` presente; TXT `google-site-verification=...` | HECHO VERIFICADO (proveedor); dueño de la cuenta PENDIENTE DE VERIFICACIÓN |
| S9 | Documentos legales | T&C y Política de Privacidad (PDF) | **AWS S3** bucket `legal-documents-storage` (us-east-1) | Guita (bucket genérico, multi-tenant) | URLs en el footer del sitio; `HEAD` a los objetos (200, `application/pdf`); listado del bucket denegado (`AccessDenied`) | HECHO VERIFICADO |
| S10 | WhatsApp | Canal de contacto / cotización OTC | WhatsApp Business | DLPay (presumible) | `wa.me/56977615921` en el sitio; deck y apuntes internos | HECHO VERIFICADO (número); titularidad PENDIENTE |
| S11 | Back-office ("web de Guita") | Registro de operaciones, carga de historial | Plataforma Guita | Guita | Apuntes internos; carpeta `Cargar Guita/` con CSV de carga | HECHO VERIFICADO (existencia); detalle PENDIENTE |
| S12 | Código fuente del sitio actual | Repositorio del frontend Next.js | PENDIENTE (¿GitHub de Guita?) | Guita (presumible) | No localizado; el sitio es claramente un producto de Guita | PENDIENTE DE VERIFICACIÓN |
| S13 | Repositorio del proyecto nuevo | `~/Projects/dlpay-web` | Local (aún sin remoto) | DLPay (a crear) | Este repo | HECHO VERIFICADO (local); remoto/organización PENDIENTE DE DECISIÓN |
| S14 | Proveedores de liquidez USDT | Abastecimiento de inventario | **Skipo SpA**, **Koywe SpA** | Externos | Deck operacional BCI; apuntes internos | HECHO VERIFICADO (según docs internos) |
| S15 | Banca | Recepción/verificación de fondos CLP | **Banco BCI** | DLPay | Deck operacional BCI; apuntes internos | HECHO VERIFICADO (según docs internos) |
| S16 | Herramientas operativas | Binance P2P, Investing.com, Google Sheets, Slack | Externas | DLPay | Apuntes internos | HECHO VERIFICADO (según docs internos) |

---

## 5. Los 11 frentes de investigación

### Frente 1 — Dominio

| Dato | Valor | Marcador |
|---|---|---|
| Dominio principal | `dlpay.cl` | HECHO VERIFICADO |
| Registrador | NIC Chile (`whois.nic.cl`) | HECHO VERIFICADO |
| **Registrant name** | **Guita SpA** | HECHO VERIFICADO |
| Fecha de creación | **2026-03-04** (10:27 CLST) | HECHO VERIFICADO |
| Fecha de expiración | 2027-03-04 | HECHO VERIFICADO |
| Nameservers | `ns1.digitalocean.com`, `ns2...`, `ns3...` | HECHO VERIFICADO |
| DNSSEC en `dlpay.cl` | No se observó DS propio | PENDIENTE DE VERIFICACIÓN |
| Otros dominios DLPay | `dlpay.cl` es el único confirmado. `dlpzpro.cl` aparece **solo** dentro del correo `contacto@dlpzpro.cl` en la Política de Privacidad; no se investigó por instrucción. Otros TLD: no investigados. | PENDIENTE DE VERIFICACIÓN |

**Riesgo de migración:** el dominio **no pertenece a DLPay**. Para cualquier cutover se necesita
que Guita transfiera la titularidad del dominio a DLPay (o, como mínimo, delegue el control de
DNS). Un cambio de nameservers hecho por Guita sin coordinación podría afectar el sitio y el
correo simultáneamente. `PENDIENTE DE DECISIÓN` (negociación con Guita).

### Frente 2 — DNS

Registros observados en la zona `dlpay.cl` (servida por DigitalOcean):

| Tipo | Valor | Propósito | Marcador |
|---|---|---|---|
| `NS` | `ns1/2/3.digitalocean.com` | Delegación DNS a DigitalOcean | HECHO VERIFICADO |
| `SOA` | `ns1.digitalocean.com. hostmaster.dlpay.cl.` | Zona DO por defecto | HECHO VERIFICADO |
| `A` (apex) | `199.36.158.100` | Firebase Hosting | HECHO VERIFICADO |
| `A` (`www`) | `199.36.158.100` (+ `CNAME www → dlpay-cl.web.app`) | Firebase Hosting; `www` redirige 301 al apex | HECHO VERIFICADO |
| `MX` | `1 smtp.google.com` | Correo Google Workspace | HECHO VERIFICADO |
| `TXT` | `google-site-verification=mMYoslDwE206ljoecBbq7Q-qQO3yRUmFwBiZNskY_Vk` | Verificación Google (Workspace o Search Console) | HECHO VERIFICADO |
| `TXT` | `hosting-site=dlpay-cl` | Verificación de Firebase Hosting | HECHO VERIFICADO |
| `TXT` (`google._domainkey`) | Clave pública DKIM RSA (`v=DKIM1`) | Firma DKIM de Google Workspace | HECHO VERIFICADO |
| `TXT` (SPF `v=spf1`) | **AUSENTE** | — | HECHO VERIFICADO (ausencia) |
| `TXT` (`_dmarc`) | **AUSENTE** | — | HECHO VERIFICADO (ausencia) |
| `CAA` | AUSENTE | Cualquier CA puede emitir para el dominio | HECHO VERIFICADO |
| Wildcard `*` | No existe | — | HECHO VERIFICADO |
| Subdominios | Solo `www`. No se encontró `app`, `staging`, `mail`, etc. en un sondeo acotado de nombres comunes. | HECHO VERIFICADO (alcance limitado) |

**Servicios que dependen del DNS:** el sitio web (Firebase), el correo (Google Workspace), y la
verificación de dominio de Google/Firebase. Cambiar nameservers rompe los tres a la vez si no
se replican todos los registros.

### Frente 3 — Hosting / infraestructura web actual

| Dato | Valor | Marcador |
|---|---|---|
| Plataforma de hosting | **Firebase Hosting** (Google), proyecto **`dlpay-cl`** | HECHO VERIFICADO |
| Dominio Firebase por defecto | `dlpay-cl.web.app` (sirve el sitio idéntico; mismo `etag`) | HECHO VERIFICADO |
| CDN / edge | **Fastly** (headers `x-served-by: cache-scl…`, `x-cache`, `x-timer`), PoP Santiago (`SCL`) | HECHO VERIFICADO |
| Framework frontend | **Next.js (App Router)** con React Server Components | HECHO VERIFICADO (`/_next/static/chunks/app/(default)/…`, `self.__next_f`, `main-app-*.js`) |
| Cliente de datos | **Apollo Client (GraphQL)** con SSR data transport | HECHO VERIFICADO (`ApolloSSRDataTransport` en HTML; `apollo` en bundle) |
| Modo de entrega | HTML pre-renderizado servido como estático desde Firebase (sin cabeceras de SSR dinámico) | INFERENCIA (fuerte) |
| Backend | **`api.guita.cl/graphql`** — Ruby on Rails / Google Cloud | HECHO VERIFICADO |
| TLS | Certificado Google Trust Services (CN `yoga.k2a.in`, SAN con ~100 dominios no relacionados). Es el certificado compartido de Firebase Hosting; la agrupación la hace Google, **no** es evidencia sobre la cartera de clientes de Guita. | HECHO VERIFICADO |
| Cabeceras de seguridad | `Strict-Transport-Security` presente. CSP, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`: **no revisadas exhaustivamente** en esta fase. | PENDIENTE DE VERIFICACIÓN |
| Último deploy observado | 2026-09-02 ~13:45 GMT — **mismo timestamp que `guita.cl`** → pipeline de despliegue compartido | HECHO VERIFICADO |
| Rutas publicadas (sitemap) | `/`, `/app/`, `/auth/{login,register,confirm,password-reset,password-update,account-unlock}/`, `/onboarding/`, `/enhanced_onboarding/`, `/renewal/verification/`, `/complaints/`, `/apple-icon.png/`, `/manifest.webmanifest/` | HECHO VERIFICADO |
| `robots.txt` | `Allow: /` para todos; declara `Host` y `Sitemap` (formato `next-sitemap`) | HECHO VERIFICADO |
| Página 404 | Existe (`<title>No encontrado</title>`) | HECHO VERIFICADO |

**Riesgo de migración:** el sitio y `guita.cl` comparten proyecto/pipeline. DLPay no puede
desplegar en ese Firebase. La web nueva se construirá aparte y solo se conecta vía DNS al final.

### Frente 4 — Correo

| Registro | Estado | Marcador |
|---|---|---|
| `MX` | `1 smtp.google.com` → **Google Workspace** | HECHO VERIFICADO |
| DKIM (`google._domainkey`) | Presente, clave RSA `v=DKIM1` | HECHO VERIFICADO |
| **SPF** (`v=spf1`) | **AUSENTE** | HECHO VERIFICADO |
| **DMARC** (`_dmarc`) | **AUSENTE** | HECHO VERIFICADO |
| Proveedor de correo transaccional / SMS | No identificado en el bundle público. Los T&C y la Política mencionan notificaciones por correo y SMS. | PENDIENTE DE VERIFICACIÓN |
| Titularidad de la cuenta Google Workspace | Desconocida (¿DLPay? ¿Guita provisionó el tenant?) | PENDIENTE DE VERIFICACIÓN |
| Dirección de contacto oficial | T&C: `contacto@dlpay.cl`. Política de Privacidad: `contacto@dlpzpro.cl`. **Inconsistente.** | HECHO VERIFICADO (la inconsistencia) |

**Hallazgos:**
- Falta de **SPF y DMARC** en el dominio de una fintech: riesgo de suplantación (phishing a
  clientes) y de entregabilidad. Debe corregirlo **quien administre el DNS y el correo** (hoy,
  aparentemente Guita), sin esperar a la migración.
- Cambiar nameservers en el cutover **puede cortar el correo** si no se replican MX + DKIM (+
  SPF/DMARC cuando existan). Verificar y coordinar antes de tocar DNS.

### Frente 5 — Acceso al código actual

| Dato | Valor | Marcador |
|---|---|---|
| Ubicación del repositorio del sitio actual | No localizada | PENDIENTE DE VERIFICACIÓN |
| Propietario | Guita (el sitio es un producto de Guita) | INFERENCIA |
| Acceso de DLPay al código | Desconocido; probablemente inexistente | PENDIENTE DE VERIFICACIÓN |
| Tecnología (para eventual referencia) | Next.js App Router + TypeScript + Apollo Client; backend Rails | HECHO VERIFICADO (por fingerprint del bundle) |
| Posibilidad de exportar el frontend | Improbable sin acuerdo con Guita; y aunque se obtuviera, está acoplado a `api.guita.cl` | INFERENCIA |
| Contenido reutilizable sin el código | Textos públicos del sitio, PDFs legales, estructura de información, número de WhatsApp, imágenes públicas (`section-1/2/3.webp`, `stripes.svg`) | HECHO VERIFICADO |

**Conclusión:** el frontend actual **se reconstruye desde cero**. No aporta valor intentar
recuperar su código: es un template multi-tenant de Guita, acoplado a su backend. Lo
reutilizable es **contenido e información**, no código.

### Frente 6 — Relación DLPay ↔ proveedor ↔ Guita

**Modelo verificado (`HECHO VERIFICADO` salvo donde se indica):**

```
                 ┌─────────────────────────── GUITA (plataforma multi-tenant) ───────────────────────────┐
   Cliente ──►   │  Frontend Next.js (Firebase Hosting, proyecto dlpay-cl)  ─►  api.guita.cl/graphql     │
   dlpay.cl      │       │                                                         (Rails / Google Cloud) │
                 │       ├─► FaceTec SDK  (shared.guita.cl / AWS CloudFront)   ─►  KYC / liveness          │
                 │       ├─► Google OAuth + reCAPTCHA                                                       │
                 │       └─► PDFs legales (AWS S3 legal-documents-storage)                                  │
                 │  DNS: DigitalOcean · Dominio: registrado por "Guita SpA" · Correo: Google Workspace     │
                 └──────────────────────────────────────────────────────────────────────────────────────────┘
   Operación
   OTC real  ──►  WhatsApp Business (+56 9 7761 5921)  ─►  equipo DLPay  ─►  Binance P2P / Skipo / Koywe
   (paralela)                                                             ─►  verificación fondos BCI
                                                                          ─►  registro en "web de Guita" (back-office)
```

| Qué | Pertenece a | Marcador |
|---|---|---|
| Dominio `dlpay.cl` | Guita SpA (registrant) | HECHO VERIFICADO |
| DNS, hosting, backend, KYC, assets compartidos | Guita | HECHO VERIFICADO |
| Correo `@dlpay.cl` (cuenta Workspace) | PENDIENTE | PENDIENTE DE VERIFICACIÓN |
| Marca, contenido, textos legales (autoría), número WhatsApp | DLPay | INFERENCIA (fuerte) |
| Relación bancaria (BCI), proveedores de liquidez (Skipo, Koywe) | DLPay | HECHO VERIFICADO (docs internos) |
| Operación OTC diaria vía WhatsApp | DLPay | HECHO VERIFICADO (docs internos) |
| "web de Guita" (back-office de registro de operaciones) | Guita (usado por DLPay) | HECHO VERIFICADO |

**Interfaces entre sistemas:** el frontend habla GraphQL con `api.guita.cl`. La carga histórica
de operaciones al back-office se hace por **CSV manual** (carpeta `Cargar Guita/`), lo que
sugiere que **no hay API/automatización** para esa carga. `INFERENCIA`.

**Qué debe permanecer intacto durante la migración:** el sitio actual completo (marketing +
`/auth/*` + onboarding + KYC + `/complaints`) sigue siendo el único canal digital operativo de
DLPay. La web nueva **no** puede reemplazar `/auth/*`, onboarding ni KYC en esta etapa: esos
enlaces deben apuntar a la plataforma Guita hasta que exista infraestructura propia (etapa
aparte).

**Contrato / condiciones de salida:** `PENDIENTE DE VERIFICACIÓN`. No se encontró un contrato
Guita↔DLPay en la carpeta de trabajo. Se desconoce: propiedad de los datos de clientes y
operaciones, portabilidad, preaviso de terminación, y si Guita entregaría un export.

### Frente 7 — Integraciones

| Sistema | Propósito | Propietario | Dependencia | Evidencia | Riesgo de migración |
|---|---|---|---|---|---|
| `api.guita.cl/graphql` | Toda la lógica de la app (auth, cuentas, cotización, operaciones) | Guita | **Total** para la app; el sitio de marketing también hace una query GraphQL | `uri:` en bundle; `ApolloSSRDataTransport` en HTML | La web nueva de marketing **no** debe depender de esta API. La app sí, hasta etapa propia. |
| FaceTec (vía `shared.guita.cl`) | KYC / liveness | Guita / FaceTec | Alta (KYC) | refs en bundle | Fuera de alcance de la web nueva (es de la plataforma). |
| Google OAuth | Login social | Guita (client ID propio) | Media | `NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID` | Fuera de alcance por ahora. |
| Google reCAPTCHA | Anti-abuso en formularios | Guita | Media | `NEXT_PUBLIC_GOOGLE_CAPTCHA_SITE_KEY` | Si la web nueva tiene formularios, decidir anti-abuso por necesidad. |
| AWS S3 (`legal-documents-storage`) | Hosting de PDFs legales | Guita | Baja | URLs en footer | La web nueva debería **hospedar sus propios** documentos legales. |
| WhatsApp Business (`wa.me/56977615921`) | Contacto / cotización OTC | DLPay | Alta (canal comercial principal) | sitio + docs internos | Debe conservarse. Verificar titularidad del número/línea. |
| Binance P2P / Binance Pay | Referencia de precio y envío de USDT | Externo | Alta (operación) | docs internos | No es integración de la web; es operación. |
| Skipo SpA, Koywe SpA | Proveedores de liquidez USDT | Externos | Alta (operación) | docs internos | No es integración de la web. |
| Banco BCI (portal) | Verificación de fondos | DLPay | Alta (operación) | docs internos | No es integración de la web. |
| Google Sheets | Planillas de seguimiento y respaldo | DLPay | Media (operación interna) | docs internos | No es integración de la web. |
| Slack | Comunicación interna | DLPay | Baja | docs internos | No es integración de la web. |
| Analítica / tracking (GA, GTM, Meta, Hotjar, Sentry, etc.) | — | — | — | **No detectado** en el bundle público | La web nueva decide analítica **por necesidad** (Principio 5 de CLAUDE.md). |
| Automatizaciones (Make / n8n / Zapier) / CRM | — | — | — | No detectado; no verificado internamente | PENDIENTE DE VERIFICACIÓN |

### Frente 8 — Propiedad de cuentas

| Cuenta / servicio | Propietario actual | Acceso DLPay | Acceso de tercero | Riesgo | Acción pendiente |
|---|---|---|---|---|---|
| Registrador NIC Chile (`dlpay.cl`) | **Guita SpA** | Desconocido | Guita (registrant) | **Alto** — sin el dominio no hay cutover | Solicitar transferencia de titularidad del dominio a DLPay |
| DNS DigitalOcean (zona `dlpay.cl`) | Cuenta DO de Guita (INFERENCIA) | Desconocido | Guita | Alto | Solicitar acceso o traspaso de la zona; o preparar zona propia |
| Firebase / Google Cloud (proyecto `dlpay-cl`) | Cuenta Google de Guita (INFERENCIA) | Desconocido | Guita | Medio (se reemplaza con hosting propio) | Confirmar; no se requiere recuperar, sí documentar |
| Google Workspace (`@dlpay.cl`) | PENDIENTE | PENDIENTE | PENDIENTE | **Alto** — el correo es llave de recuperación de otras cuentas | Confirmar quién es el super-admin del tenant Workspace |
| AWS (S3 `legal-documents-storage`, CloudFront `shared.guita.cl`) | Guita | No | Guita | Bajo | Documentar; la web nueva usa almacenamiento propio |
| GitHub del sitio actual | PENDIENTE (¿Guita?) | Probablemente no | Guita | Bajo | Confirmar si existe algún acceso |
| GitHub del proyecto nuevo | A crear | — | — | — | `PENDIENTE DE DECISIÓN`: crear organización propia de DLPay |
| Hosting/plataforma para la web nueva | A crear | — | — | — | `PENDIENTE DE DECISIÓN` tras exploración visual/arquitectura |
| Cuenta CDN/DNS para la web nueva | A crear | — | — | — | `PENDIENTE DE DECISIÓN` |
| WhatsApp Business (+56 9 7761 5921) | DLPay (presumible) | Sí (presumible) | — | Medio | Confirmar titularidad de la línea/número y del perfil de WhatsApp Business |
| Cuenta Binance (P2P / Pay) | DLPay | Sí | — | Operación, no web | — |
| Portal BCI | DLPay | Sí | — | Operación, no web | — |
| FaceTec | Contrato de Guita | No | Guita | Fuera de alcance | — |
| reCAPTCHA / Google OAuth client | Guita | No | Guita | Fuera de alcance | — |

### Frente 9 — Assets de marca

| Asset | Estado | Marcador |
|---|---|---|
| Logo (vectorial) | **No localizado.** Existen `apple-icon.png` y `manifest.webmanifest` en el sitio (íconos raster). | `PENDIENTE DE ASSET — logo vectorial (SVG/AI) oficial y sus variantes` |
| Verde de marca (HEX exacto) | El verde es el único elemento consistente entre deck BCI, organigrama y web. El valor exacto **no está confirmado** por una fuente oficial. Los CSS del sitio contienen los colores en uso pero eso es **inferencia visual del template de Guita**, no un manual. | `PENDIENTE DE ASSET — HEX oficial del verde y de qué pieza es la fuente de verdad` |
| Tipografías | El sitio auto-hospeda una fuente (`e807dee2426166ad-s.p.woff2`, subset optimizado por `next/font`). Nombre de familia y licencia **no** determinados. Deck y organigrama usan otras tipografías. | `PENDIENTE DE ASSET — tipografías en uso + estado de licencias` |
| Iconografía | El deck BCI usa un motivo geométrico de red de nodos (heptágono). No hay set de iconos documentado. | `PENDIENTE DE ASSET — sistema de iconos` |
| Imágenes / ilustración | El sitio usa `section-1/2/3.webp` y `stripes.svg`. Origen (¿propio? ¿stock? ¿del template de Guita?) desconocido. | PENDIENTE DE VERIFICACIÓN |
| Fotografía | No se observa fotografía propia en el sitio. | HECHO VERIFICADO (alcance: homepage) |
| Manual de marca | **No existe.** | HECHO VERIFICADO |
| Piezas de referencia disponibles | Deck "Modelo Operacional" (BCI), "Organigrama" (PDF), web actual. Tres estéticas distintas. | HECHO VERIFICADO |
| Nomenclatura | "DLpay" (con 'p' minúscula) en el `<title>` y en los T&C; "DLPay" en otros lugares; "DLPay Digital", "DLPZ INCZ SpA", "DLPZ PRO SpA". Inconsistente. | `PENDIENTE DE DECISIÓN — grafía y nomenclatura oficial de la marca` |

> Regla (CLAUDE.md §5 y Principio 2): no se infiere ni se inventa identidad en esta fase. Cuando
> DLPay entregue los assets oficiales, esos tienen prioridad sobre cualquier observación de aquí.

### Frente 10 — Fuentes de pricing / cotizador

**Lo que se puede afirmar hoy:**

| Aspecto | Hallazgo | Marcador |
|---|---|---|
| El sitio actual tiene un "cotizador en tiempo real" | Sí; la homepage ejecuta una query GraphQL contra `api.guita.cl` al cargar (`ApolloSSRDataTransport`, estado `loading`) | HECHO VERIFICADO |
| De dónde sale el precio en el sitio actual | Del backend de Guita (`api.guita.cl/graphql`). El detalle del cálculo no es observable sin credenciales y su inspección está fuera de alcance. | HECHO VERIFICADO (que viene de Guita); mecánica interna PENDIENTE DE VERIFICACIÓN |
| Marco del precio según T&C (cláusula QUINTA) | *"el tipo de cambio aplicado (el cual es provisto y ejecutado por las contrapartes o proveedores de liquidez externos) y spread informado"*: el precio proviene de los **proveedores de liquidez** (Skipo/Koywe, por docs internos) y el spread se **divulga**. | HECHO VERIFICADO (texto publicado) |
| Operación OTC real (docs internos) | Referencia **P2P Binance** + spread de **0,4 a 1 CLP** según monto/volumen; cotización por WhatsApp | HECHO VERIFICADO (docs internos) |
| Página de tarifas / spread referenciada en los T&C | `www.dlpay.cl/tarifas` → **HTTP 404. No existe.** | HECHO VERIFICADO |

**Cadena de desacople (a mantener en el diseño, sin decidir implementación):**
`Market Price → Pricing/Spread DLPay → Quote → UI`.

**Lo que NO se decide en Fase 0** (queda `PENDIENTE DE DECISIÓN`, con evidencia a recabar):
proveedor de market price, fórmula de conversión, tramos de spread, si el cálculo lo hace una
API propia o Guita, frecuencia de actualización, mecanismo de *fallback*, y qué parte del
pricing es pública vs interna.

### Frente 11 — Restricciones legales que afectan a la web

> Alcance: solo los aspectos legales que impactan **contenido, páginas legales y migración de
> URLs** de la web nueva. El estado regulatorio ante la CMF **no** forma parte de esta
> investigación.

Fuente: T&C publicados (**"Versión 1.5 — Julio 2026"**) y Política de Privacidad publicada.

| Tema | Hallazgo | Marcador |
|---|---|---|
| Entidad operadora (T&C) | **"DLPZ PRO SpA"**, RUT **78.378.714-8**, domicilio **6 ½ Oriente 280, Viña del Mar**, representada por **Cristóbal Felipe De la Paz Valenzuela** | HECHO VERIFICADO (texto publicado) |
| Entidad en docs internos | **"DLPZ INCZ SpA"** / "DLPay Digital" (deck BCI, organigrama) | HECHO VERIFICADO (docs internos) |
| Registrant del dominio | **"Guita SpA"** | HECHO VERIFICADO |
| **Inconsistencia de razón social y de correos** | Tres nombres de entidad (**DLPZ PRO SpA / DLPZ INCZ SpA / Guita SpA**) y dos correos de contacto para ejercicio de derechos (`contacto@dlpay.cl` en los T&C vs `contacto@dlpzpro.cl` en la Política de Privacidad). **No se resuelve por inferencia.** | **PENDIENTE DE VERIFICACIÓN · REQUIERE VALIDACIÓN DE COMPLIANCE** (confirmación de DLPay) |
| Servicios descritos en los T&C | Intermediación y **custodia** de criptoactivos estables; gestión de **tesorería transfronteriza**; **pagos B2B**; liquidaciones internacionales. Es un alcance más amplio que el "OTC USDT" de los apuntes internos. Relevante para el **contenido** de la web nueva. | HECHO VERIFICADO (texto publicado) |
| Marco de datos personales (T&C) | **Ley 19.628** (Protección de la Vida Privada) + su actualización por la **Ley 21.719**; GDPR como estándar complementario. Derechos ARCO; respuesta en 15 días hábiles; canal `contacto@dlpay.cl` | HECHO VERIFICADO (texto publicado) |
| Política de Privacidad publicada | Plantilla **genérica orientada a GDPR** ("estándares internacionales", "72 horas", "Derechos ARCO"), **no alineada** al marco chileno que sí citan los T&C; nombra "DLPZ PRO SpA" y `contacto@dlpzpro.cl`; menciona *"cookies y herramientas analíticas"* que **no se detectan** en el sitio | HECHO VERIFICADO · REQUIERE VALIDACIÓN DE COMPLIANCE |
| Consumidor | **Ley 19.496**; SERNAC y Juzgados de Policía Local (derecho irrenunciable); cláusula arbitral CAM Santiago; respuesta a reclamos formales en 10 días hábiles | HECHO VERIFICADO (texto publicado) |
| Advertencia de riesgo | Los T&C incluyen advertencia sobre riesgos de stablecoins (de-peg, irreversibilidad blockchain, riesgo de contraparte); "no garantiza rentabilidad ni protección del capital" | HECHO VERIFICADO (texto publicado) |
| Canal de denuncias | Ruta `/complaints` existe. Base legal no confirmada. | PENDIENTE DE VERIFICACIÓN |
| Divulgación tarifaria | Los T&C obligan a publicar una tabla de comisiones/tarifas en `/tarifas`; **no está publicada** (404) | HECHO VERIFICADO · REQUIERE VALIDACIÓN DE COMPLIANCE |
| Prohibición de scraping / ingeniería inversa / pentest | T&C cláusula SÉPTIMA | HECHO VERIFICADO (relevante para el alcance de esta y futuras investigaciones) |
| Claims del sitio actual | "Compra y vende dólar digital como nunca antes", "sin comisiones ocultas", "tipo de cambio verificado", 6 testimonios con nombres/ciudades | `REQUIERE VALIDACIÓN DE COMPLIANCE — todo claim comercial y todo testimonio del sitio actual antes de reutilizarlo` |

**Páginas legales y URLs a considerar en la web nueva:**
- Hoy los enlaces legales del footer apuntan a **PDF en S3** (`legal-documents-storage`), no a
  rutas del sitio. No hay URLs legales on-site que preservar/redirigir.
- Los T&C se citan a sí mismos como disponibles en `www.dlpay.cl/privacidad` (y hablan de
  `www.dlpay.cl/tarifas`); esas rutas hoy dan 404.
- La web nueva deberá **publicar sus propias páginas** legales (términos, privacidad, canal de
  denuncias y, si corresponde, tarifas), con textos **revisados por Compliance** y alineados al
  marco chileno. `REQUIERE VALIDACIÓN DE COMPLIANCE`.

---

## 6. Evidencia encontrada (índice reproducible)

> Toda la evidencia proviene de consultas públicas o de documentos publicados por DLPay. No se
> almacenan aquí volcados completos; se listan los comandos/fuentes para reproducir.

| ID | Evidencia | Cómo se obtuvo |
|---|---|---|
| E1 | Registrant `dlpay.cl` = "Guita SpA"; creación 2026-03-04; NS DigitalOcean | `whois dlpay.cl` (respuesta de `whois.nic.cl`) |
| E2 | `A` apex `199.36.158.100`; `CNAME www → dlpay-cl.web.app`; `MX smtp.google.com`; TXT `hosting-site=dlpay-cl`, `google-site-verification=…`; sin SPF; sin DMARC; DKIM `google._domainkey` presente | `dig` (A/AAAA/NS/SOA/MX/TXT/CAA sobre `dlpay.cl`, `www.dlpay.cl`, `_dmarc.dlpay.cl`, `google._domainkey.dlpay.cl`) |
| E3 | Headers de `https://dlpay.cl/`: Fastly (`x-served-by`, `x-cache`), `x-fh-requested-host` (Firebase Hosting), HSTS; `www` → 301 apex | `curl -sD - -o /dev/null https://dlpay.cl/` y `.../www` |
| E4 | `robots.txt` (formato next-sitemap), `sitemap.xml` → `sitemap-0.xml` con 14 URLs | `curl https://dlpay.cl/robots.txt`, `/sitemap.xml`, `/sitemap-0.xml` |
| E5 | Frontend Next.js App Router + RSC + Apollo (`ApolloSSRDataTransport`, `self.__next_f`, chunks `app/(default)/…`) | `curl https://dlpay.cl/` + inspección del HTML y de chunks `/_next/static/chunks/*` |
| E6 | Endpoint backend `uri:"https://api.guita.cl/graphql"`; `shared.guita.cl/facetec/sdk/FaceTecSDK.js`; `accounts.google.com/gsi/client`; `NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID`, `NEXT_PUBLIC_GOOGLE_CAPTCHA_SITE_KEY`; sin librerías de analítica | `grep` sobre los chunks JS públicos descargados |
| E7 | `api.guita.cl/` → 404 con `server: Google Frontend`, `via: 1.1 google`, `x-runtime`, `x-request-id` (Rails/GCP); `A 34.49.26.8` | `curl -sD - https://api.guita.cl/` (GET simple, sin query) |
| E8 | `guita.cl`: mismo `A`, mismo NS, mismos headers Firebase/Fastly, mismo timestamp de deploy que `dlpay.cl`; registrant "Sebastian Ruiz / Guita", creado 2021-08-13, registrar 1API GmbH | `whois guita.cl`, `dig`, `curl -I https://guita.cl/` |
| E9 | Certificado TLS `dlpay.cl`: Google Trust Services, CN `yoga.k2a.in`, SAN con ~100 dominios (cert compartido de Firebase Hosting) | `openssl s_client -connect dlpay.cl:443 -servername dlpay.cl` + `openssl x509 -text` |
| E10 | `dlpay-cl.web.app` sirve el sitio idéntico (mismo `etag`) | `curl -I https://dlpay-cl.web.app/` |
| E11 | PDFs legales en `legal-documents-storage.s3.us-east-1.amazonaws.com` (`dlpay-terms-and-conditions.pdf` 200 `application/pdf`; `dlpay-privacy-policy.pdf` 200); listado del bucket → `AccessDenied` | `curl -I` a los objetos; `curl ".../?list-type=2"` |
| E12 | Contenido de T&C (v1.5, jul 2026): entidad "DLPZ PRO SpA" RUT 78.378.714-8, domicilio Viña del Mar, rep. Cristóbal De la Paz; descripción de servicios (intermediación, custodia, tesorería transfronteriza, pagos B2B); pricing vía proveedores de liquidez + spread informado; tabla de tarifas referenciada en `/tarifas`; marco de datos Ley 19.628 + 21.719; consumidor Ley 19.496; advertencia de riesgo sobre stablecoins; prohibición de scraping/ingeniería inversa | Lectura del PDF `terms.pdf` descargado a scratchpad |
| E13 | Contenido de Política de Privacidad: entidad "DLPZ PRO SpA", `contacto@dlpzpro.cl`, plantilla GDPR genérica, menciona cookies/analítica | Lectura del PDF `privacy.pdf` descargado a scratchpad |
| E14 | `/tarifas`, `/privacidad`, `/terminos` → **HTTP 404** (página "No encontrado" de Next.js, mismo cuerpo de 40.921 bytes) | `curl -o /dev/null -w '%{http_code}'` a las 3 rutas (con y sin barra final) |
| E15 | WhatsApp `wa.me/56977615921`; `<title>DLpay</title>`; `<meta description>` "Compra y vende dólar digital como nunca antes" | `grep` sobre el HTML de la homepage |
| E16 | Negocio (modelo OTC, spread 0,4–1 CLP, Skipo/Koywe, BCI, Binance Pay, equipo, herramientas) | Documentos internos `~/Desktop/DLPAY/` (deck BCI, organigrama, `DLPAY apuntes.docx`) — hechos de negocio no sensibles |

**Ubicación temporal de los PDFs legales descargados:** scratchpad de la sesión
(`/private/tmp/claude-501/.../scratchpad/phase0/`). **No** se copian a este repositorio.

---

## 7. Dependencias

### 7.1 Dependencias de terceros que DLPay hoy NO controla
1. **Dominio `dlpay.cl`** — registrado por Guita SpA. *(bloqueante para cutover)*
2. **DNS** — DigitalOcean, cuenta de Guita. *(bloqueante para cutover)*
3. **Correo `@dlpay.cl`** — Google Workspace, administrador desconocido. *(alto: llave de recuperación)*
4. **Hosting + backend + KYC + auth** — Guita (Firebase + `api.guita.cl` + FaceTec). *(se reemplaza por etapas; la app depende de esto hasta tener infraestructura propia)*
5. **PDFs legales** — bucket S3 de Guita.

### 7.2 Dependencias operativas (no de la web, pero condicionan el proyecto)
6. Debida diligencia **BCI** — canal de fondos.
7. Proveedores de liquidez **Skipo / Koywe** y **Binance** — operación.
8. **WhatsApp Business** — canal comercial principal; debe conservarse.

### 7.3 Dependencias que el proyecto nuevo introducirá (a decidir, no ahora)
- Repositorio (organización propia), plataforma de hosting, DNS/CDN, y — solo si se justifican —
  analítica, correo transaccional y anti-abuso de formularios. Todo `PENDIENTE DE DECISIÓN`.

---

## 8. Riesgos

| ID | Riesgo | Prob. | Impacto | Mitigación |
|---|---|---|---|---|
| R1 | DLPay no puede migrar porque **no controla el dominio** (Guita SpA es el registrant) | Alta | Alto | Negociar transferencia del dominio a DLPay **antes** de invertir en cutover; tener plan B (dominio nuevo) documentado |
| R2 | Un cambio de nameservers (por Guita o por DLPay) **rompe correo y sitio a la vez** | Media | Alto | Inventariar todos los registros (MX, DKIM, TXT, verificaciones) y replicarlos; bajar TTL; coordinar ventana con Guita |
| R3 | **Sin SPF ni DMARC**: suplantación de `@dlpay.cl` (phishing a clientes de una fintech) | Alta | Alto | Que el administrador actual del DNS/correo publique SPF + DMARC ya; no esperar a la migración |
| R4 | **Titularidad del tenant Google Workspace desconocida**: si es de Guita, DLPay podría perder el correo corporativo en una salida conflictiva | Media | Alto | Confirmar super-admin del Workspace; si es de Guita, planificar traspaso o migración de correo |
| R5 | **Datos de clientes y operaciones viven en Guita** sin export/portabilidad confirmada | Media | Alto | Pedir a Guita: propiedad de datos, formato de export, API; revisar contrato |
| R6 | **Inconsistencia de razón social** (DLPZ PRO / DLPZ INCZ / Guita) en documentos legales publicados | Alta (ya ocurre) | Alto (contractual/legal) | DLPay confirma la entidad correcta; se corrige T&C, Privacidad y footer antes de relanzar |
| R7 | **Documentos legales referencian páginas inexistentes** (`/tarifas`, `/privacidad`) | Alta (ya ocurre) | Medio-Alto | La web nueva publica esas páginas; mientras tanto, Compliance evalúa exposición |
| R8 | Reutilizar **contenido/claims/testimonios** del sitio actual sin validar | Media | Medio-Alto | Marcar todo claim como `REQUIERE VALIDACIÓN DE COMPLIANCE`; testimonios solo con consentimiento verificable |
| R9 | **Bus factor**: un mantenedor no-desarrollador + IA | Media | Medio | Arquitectura mínima, ADRs, `docs/`, convenciones (ya en CLAUDE.md) |
| R10 | Reconstruir "solo marketing" y rehacer al llegar auth/cotizador propio | Media | Medio | Costuras de desacople (config de Guita, cadena de pricing) desde el día 1 |
| R11 | Caer en estética "plantilla de IA" | Media | Medio | Exploración visual propia antes de codear (CLAUDE.md §5, Principio 3) |
| R12 | Perder SEO/posicionamiento en la migración | Media | Medio | Conservar URLs o 301; sitemap; cutover monitoreado. Nota: hoy las URLs legales son PDFs en S3 (externas), no rutas on-site |
| R13 | Fuga de datos sensibles al repositorio web | Baja | Alto | Repo separado (ya hecho), `.gitignore` + política de env desde el primer commit; nunca copiar KYC/contratos/transacciones |
| R14 | `api.guita.cl` cambia o se retira sin aviso y rompe el "cotizador en tiempo real" del sitio nuevo si llegara a depender de él | Baja-Media | Medio | La web nueva **no** depende de `api.guita.cl`; cotizador desacoplado sin fuente asumida |

---

## 9. Información faltante

| # | Falta | Frente | Cómo obtenerla |
|---|---|---|---|
| I1 | Credenciales / control del registrador NIC Chile de `dlpay.cl` | 1, 8 | DLPay ↔ Guita |
| I2 | Acceso a la zona DNS (DigitalOcean) | 2, 8 | DLPay ↔ Guita |
| I3 | Quién es el super-admin del Google Workspace `@dlpay.cl` | 4, 8 | DLPay (revisar admin.google.com) / Guita |
| I4 | Existencia y contenido del **contrato Guita ↔ DLPay** (propiedad de datos, portabilidad, preaviso de salida, SLA) | 6 | DLPay (área legal) |
| I5 | ¿Existe API o export de clientes y operaciones desde Guita? Formato. | 6, 7 | Guita |
| I6 | Ubicación y acceso al **código fuente** del sitio actual | 5 | Guita |
| I7 | Proveedor de correo/SMS transaccional en uso | 4, 7 | Guita / DLPay |
| I8 | **Razón social correcta** que opera dlpay.cl y relación entre DLPZ PRO SpA / DLPZ INCZ SpA / Guita SpA | 11 | DLPay (legal) |
| I9 | Dominio de correo oficial para ejercicio de derechos: `@dlpay.cl` vs `@dlpzpro.cl` | 4, 11 | DLPay (legal) |
| I10 | Alcance de servicios que describe correctamente a DLPay hoy: ¿el de los T&C (intermediación, custodia, tesorería transfronteriza, pagos B2B) o el "OTC USDT" de los apuntes? (afecta el contenido de la web) | 11 | DLPay |
| I11 | Fuente(s) oficial(es) de market price y metodología de spread; qué es público vs interno | 10 | DLPay |
| I12 | Assets de marca: logo vectorial, HEX del verde, tipografías + licencias, manual (si existe) | 9 | DLPay |
| I13 | Origen de las imágenes del sitio actual (`section-*.webp`, `stripes.svg`): ¿propias, stock, o del template de Guita? | 9 | DLPay / Guita |
| I14 | Titularidad de la línea/número y del perfil de WhatsApp Business (+56 9 7761 5921) | 7, 8 | DLPay |
| I15 | ¿Testimonios del sitio actual son reales y con consentimiento? | 11 | DLPay |
| I16 | ¿Hay automatizaciones (Make/n8n/Zapier) o CRM que la web deba alimentar? | 7 | DLPay |
| I17 | Cabeceras de seguridad del sitio actual (CSP, etc.) — no auditadas a fondo | 3 | Revisión técnica adicional (baja prioridad) |
| I18 | Base legal del canal `/complaints` | 11 | DLPay (legal) |
| I19 | ¿Existe `/tarifas` en algún borrador o solo falta publicarla? | 10, 11 | DLPay |

---

## 10. Preguntas para DLPay / proveedores (para el checkpoint)

**Para DLPay (dirección / legal / Sebastián):**
1. ¿Cuál es la **razón social** que opera dlpay.cl, y por qué aparecen tres nombres (DLPZ PRO SpA en los T&C y Privacidad, DLPZ INCZ SpA en documentos internos, Guita SpA en el dominio)? ¿Hay un grupo de sociedades?
2. ¿Qué correo es el oficial para privacidad y ejercicio de derechos: `contacto@dlpay.cl` o `contacto@dlpzpro.cl`? ¿DLPay usa un dominio de correo `@dlpzpro.cl`?
3. ¿DLPay tiene acceso al **panel de NIC Chile** del dominio? ¿Y a la cuenta de **DigitalOcean** que administra el DNS?
4. ¿Quién es el **administrador del Google Workspace** de `@dlpay.cl`? ¿DLPay o Guita?
5. ¿Existe un **contrato con Guita**? ¿Qué dice sobre propiedad de los datos de clientes/operaciones, portabilidad, preaviso de terminación y traspaso de dominio?
6. ¿Qué **alcance de servicios** describe correctamente a DLPay hoy para efectos del contenido de la web: el de los T&C (intermediación, custodia, tesorería transfronteriza, pagos B2B) o el "OTC USDT" de los apuntes internos?
7. ¿Cuál es la **fuente oficial de precio** y la metodología de spread que la web puede reflejar? ¿Qué es público y qué interno?
8. ¿Nos entregan los **assets de marca**: logo vectorial, HEX del verde, tipografías (y sus licencias), y cualquier manual?
9. ¿Los **testimonios** del sitio actual son reales y con consentimiento para reutilizarlos?
10. ¿Confirmas la titularidad de la línea y el perfil de **WhatsApp Business** (+56 9 7761 5921)?
11. ¿Hay **automatizaciones o CRM** (Make, n8n, Zapier, HubSpot…) que la web deba alimentar?

**Para Guita (a canalizar por DLPay):**
12. ¿Aceptan **transferir la titularidad del dominio `dlpay.cl`** a DLPay (o a la sociedad que corresponda)? ¿Con qué condiciones y plazos?
13. ¿Pueden **delegar o dar acceso a la zona DNS** mientras se coordina la migración?
14. ¿El tenant de **Google Workspace** de `@dlpay.cl` es de DLPay o lo provisionó Guita? Si es de Guita, ¿cómo se traspasa?
15. ¿Existe **API o export** de los datos de clientes y del historial de operaciones de DLPay? ¿En qué formato?
16. ¿Publicarían **SPF y DMARC** para `dlpay.cl` de inmediato (independiente de la migración)?
17. ¿DLPay tiene algún acceso al **repositorio del sitio actual**?
18. ¿Cuál es el **preaviso** y el procedimiento para que DLPay deje de usar la plataforma sin interrumpir a los clientes ya registrados?

---

## 11. Decisiones que deliberadamente NO se toman en Fase 0

- **Framework, hosting, DNS/CDN, lenguaje de estilos** de la web nueva → ADRs tras el checkpoint.
- **Identidad visual**: tipografía, paleta completa, modo claro/oscuro, iconografía, sistema
  gráfico, HEX del verde → etapa de exploración visual.
- **Cotizador**: proveedor de market price, fórmula, tramos de spread, API vs Guita, frecuencia,
  fallback → tras evidencia y decisión de DLPay.
- **Infraestructura de usuarios / auth / KYC / datos** → etapa independiente, por sensibilidad.
- **Analítica, correo transaccional, anti-abuso de formularios** → solo si una necesidad los
  justifica.
- **Estrategia de dominio** (transferir `dlpay.cl` vs dominio nuevo vs subdominio de staging
  permanente) → depende de la respuesta de Guita.
- **Qué páginas tendrá la web** (incluidas las legales) → cada una se justifica
  (Necesidad → UX → arquitectura → componente → implementación).
- **Reutilización de textos legales y claims** → tras validación de Compliance.

---

## 12. Checklist de cierre de Fase 0

- [x] Reconocimiento técnico pasivo de `dlpay.cl` (DNS, WHOIS, hosting, TLS, headers, sitemap)
- [x] Identificación del backend y de la relación con Guita
- [x] Revisión de correo (MX/DKIM/SPF/DMARC)
- [x] Lectura de los documentos legales publicados (T&C y Privacidad)
- [x] Verificación de rutas referenciadas por el contrato (`/tarifas`, `/privacidad`, `/terminos`)
- [x] Inventario de sistemas y de propiedad de cuentas (con lo verificable)
- [x] Registro de la inconsistencia de razón social / correos como `PENDIENTE DE VERIFICACIÓN · REQUIERE VALIDACIÓN DE COMPLIANCE`
- [x] Documentación de assets de marca faltantes (`PENDIENTE DE ASSET`)
- [x] Lista de riesgos, información faltante y preguntas para el checkpoint
- [ ] **Checkpoint con DLPay** — revisar estos hallazgos y responder §10
- [ ] Respuestas de Guita a las preguntas 12–18
- [ ] Confirmación de la razón social y del correo oficial (I8, I9)
- [ ] Entrega de assets de marca oficiales (I12)
- [ ] Decisión sobre estrategia de dominio
- [ ] SPF + DMARC publicados para `dlpay.cl` (acción que Guita puede hacer ya)

**Fase 0 se considera cerrada** cuando el checkpoint esté hecho, las preguntas críticas
(I1–I12) tengan respuesta o un plan para obtenerla, y DLPay apruebe pasar a la etapa de
exploración visual / arquitectura.

---

## 13. Tabla resumen

| Tema | Estado | Evidencia | Riesgo | Próxima acción |
|---|---|---|---|---|
| Dominio `dlpay.cl` | Registrado por **Guita SpA**, no por DLPay | E1 (WHOIS) | **Alto** (bloquea cutover) | Pregunta 12 a Guita: transferir titularidad |
| DNS | DigitalOcean, cuenta de Guita (INFERENCIA) | E1, E2 | Alto | Pregunta 13: acceso/delegación de la zona |
| Hosting | Firebase Hosting proyecto `dlpay-cl`, CDN Fastly | E2, E3, E10 | Medio (se reemplaza) | Documentado; construir web nueva aparte |
| Frontend actual | Next.js App Router + Apollo (GraphQL) | E5 | Bajo | Se reconstruye; no recuperar código |
| Backend | **`api.guita.cl/graphql`** (Rails / GCP) — de Guita | E6, E7 | Alto (la app depende de esto) | La web nueva no depende de él; app apunta a Guita por config |
| KYC | FaceTec vía `shared.guita.cl` | E6 | Medio | Fuera de alcance de la web nueva |
| Correo `@dlpay.cl` | Google Workspace; **sin SPF ni DMARC**; admin desconocido | E2 | **Alto** | Preguntas 14/16: titularidad + publicar SPF/DMARC ya |
| Código fuente actual | No localizado; presumiblemente de Guita | — | Bajo | Pregunta 17 |
| Relación con Guita | Multi-tenant: dominio, DNS, hosting, backend, KYC, correo | E1–E13 | Alto | Pregunta 5 (contrato) + 12–18 |
| Integraciones | GraphQL Guita, FaceTec, Google OAuth/reCAPTCHA, S3 legal, WhatsApp; **sin analítica** | E6, E11, E15 | Medio | Confirmar CRM/automatizaciones (I16) |
| Propiedad de cuentas | Mayoría en Guita o desconocida | §4, §5.F8 | Alto | Inventario completo con respuestas del checkpoint |
| Assets de marca | Sin manual, sin logo vectorial, sin HEX ni tipografías confirmadas | E15, docs internos | Medio | Pregunta 8: entregar assets oficiales |
| Cotizador / pricing | El precio viene de Guita; marco de los T&C = proveedores de liquidez + spread informado; `/tarifas` **no existe (404)** | E12, E14 | Medio-Alto | Pregunta 7 + decisión posterior; no se asume fuente |
| Razón social | **DLPZ PRO SpA / DLPZ INCZ SpA / Guita SpA** — inconsistente | E1, E12, docs internos | **Alto** | **PENDIENTE DE VERIFICACIÓN · REQUIERE VALIDACIÓN DE COMPLIANCE** — preguntas 1 y 2; no resolver por inferencia |
| Correo de ejercicio de derechos | `contacto@dlpay.cl` (T&C) vs `contacto@dlpzpro.cl` (Privacidad) | E12, E13 | Medio-Alto | **PENDIENTE DE VERIFICACIÓN** — pregunta 2 |
| Documentos legales | T&C razonablemente completos; Política de Privacidad = plantilla GDPR genérica desalineada; ambos citan páginas 404 | E11–E14 | Medio-Alto | Reescribir para la web nueva con Compliance |
| Páginas legales / URLs | Hoy son PDFs en S3 (externas); no hay URLs legales on-site que preservar; la web nueva debe publicar términos, privacidad, canal de denuncias y (si corresponde) tarifas | E4, E11, E14 | Medio | Plan de páginas legales + redirects al definir contenido |
| Claims / testimonios del sitio actual | Sin validar | E15 | Medio-Alto | `REQUIERE VALIDACIÓN DE COMPLIANCE` antes de reutilizar |
| Repo del proyecto nuevo | Local en `~/Projects/dlpay-web`; sin remoto | Este repo | Bajo | `PENDIENTE DE DECISIÓN`: organización propia de DLPay |

---

*Fin del documento de Fase 0 (versión de trabajo). Próximo hito: checkpoint con DLPay.*

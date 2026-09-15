# Mapa de URLs para el cutover

> Preparado en Fase 5. **Se ejecuta en Fase 6**, cuando DLPay controle el dominio y el DNS.
> Origen de los datos: `phase-0-findings.md`, Frente 3 (sitemap real de `dlpay.cl`).

## Por qué existe este documento

El sitio actual **no es sólo marketing**: es una plataforma con registro, login, onboarding y KYC.
Apuntar el dominio a la web nueva sin plan **dejaría fuera a los clientes ya registrados**. Este es
el inventario de qué pasa con cada URL que hoy existe.

## Qué hace la web nueva con cada ruta actual

| URL de hoy | Qué es | Acción en el cutover |
|---|---|---|
| `/` | Home de marketing | **La reemplaza** la Home nueva |
| `/auth/login/` | Inicio de sesión | **Conservar hacia la plataforma.** Los clientes ya registrados entran por acá |
| `/auth/register/` | Registro | **Conservar hacia la plataforma** |
| `/auth/confirm/` | Confirmación de cuenta | **Conservar** — llega desde correos ya enviados |
| `/auth/password-reset/` | Recuperar clave | **Conservar** — llega desde correos ya enviados |
| `/auth/password-update/` | Cambiar clave | **Conservar** |
| `/auth/account-unlock/` | Desbloquear cuenta | **Conservar** |
| `/app/` | Aplicación del cliente | **Conservar hacia la plataforma** |
| `/onboarding/` | Alta de cliente | **Conservar** |
| `/enhanced_onboarding/` | Alta ampliada | **Conservar** |
| `/renewal/verification/` | Renovación de verificación | **Conservar** |
| `/complaints/` | Canal de reclamos | **301 →** `/canal-de-denuncias/` |
| `/tarifas` | Citada por los T&C · hoy 404 | **Resuelta** por `/tarifas/` |
| `/privacidad` | Citada por los T&C · hoy 404 | **Resuelta** por `/privacidad/` |
| `/terminos` | Hoy 404 | **Resuelta** por `/terminos/` |

**Regla del cutover:** todo lo que hoy vive bajo `/auth/*`, `/app/`, `/onboarding*` y
`/renewal/*` **sigue siendo de la plataforma**. La web nueva no lo reemplaza y no debe capturarlo.
Lo más limpio es servir la plataforma en un subdominio (`app.dlpay.cl`) y redirigir esas rutas allí,
en vez de mantener dos sistemas repartiéndose el mismo dominio.

Los enlaces de "Iniciar sesión" y "Crear cuenta" de la web nueva ya salen de un punto único
(`src/lib/config/site.ts`): al existir el subdominio se cambian esas dos constantes.

## Antes de tocar el DNS

1. **Bajar el TTL** con anticipación (Fase 0, R2).
2. **Inventariar y replicar todos los registros**, no sólo los del sitio: `MX`, DKIM
   (`google._domainkey`), las verificaciones `TXT`. Cambiar los nameservers sin replicarlos
   **corta el correo y el sitio a la vez**.
3. Publicar **SPF y DMARC**, que hoy no existen (Fase 0, R3). No depende del cutover y conviene
   hacerlo antes.
4. Confirmar que el sitio anterior **queda en pie en su URL de origen**: revertir el DNS es el plan
   de rollback y restaura el estado en minutos.

## Después

- Enviar el sitemap (`/sitemap.xml`) a Search Console.
- Vigilar 404 y errores durante 48–72 h. **Desde el 2026-09-15 hay página propia** (`dist/404.html`,
  en la raíz del build): quien llegue a una URL muerta ve la identidad DLPay y dos salidas, el
  inicio y `platform.loginUrl`. La segunda es la que importa acá — lo más probable que caiga en la
  404 durante el cutover son las URL de cuenta de la tabla de arriba, si alguna redirección se
  escapa. **Comprobar que el host sirve `404.html`**: los estáticos gestionados lo hacen solos;
  nginx y Apache necesitan una directiva (`error_page 404 /404.html;`).
- Retirar los PDF legales del bucket de Guita una vez publicados los textos propios
  (`legal-brief.md` §2.5), para que no queden dos versiones circulando.

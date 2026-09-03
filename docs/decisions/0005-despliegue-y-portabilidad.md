# ADR-0005 — Estrategia de despliegue: portabilidad primero, proveedor diferido

- **Estado:** Aceptada — 2026-09-03
- **Decide:** Sebastián Villanueva (con análisis de Claude Code, Fase 3)
- **Ámbito:** cómo se construye y publica la web. **No** elige proveedor todavía.

## Contexto

`CLAUDE.md` §8 prohíbe dar por sentado un proveedor, y el Principio 10 exige maximizar
portabilidad y control. Al mismo tiempo, la web todavía no existe: elegir hoy hosting, cuentas y
pipeline sería decidir sin necesidad.

Restricción heredada de Fase 0 y **muy relevante** aquí: DLPay **no controla** hoy su dominio
(registrado por Guita SpA), su DNS (DigitalOcean de Guita) ni con certeza su correo. El cutover a
producción es Fase 6 y depende de una negociación externa. Nada de eso puede bloquear la
construcción.

## Decisión

1. **El desarrollo avanza en local.** Es suficiente para construir y revisar toda la Fase 4.
   No se crea ninguna cuenta ni se despliega nada todavía.

2. **La elección de proveedor se difiere**, con **Cloudflare** y **Vercel** como candidatos
   declarados. Se decide cuando exista algo que publicar y se registrará como enmienda a este ADR.
   → `PENDIENTE DE DECISIÓN — proveedor de hosting` (CLAUDE.md §13).

   Apuntes para cuando toque decidir, sin cerrar nada:
   - **Cloudflare** consolidaría hosting, CDN y **DNS** en una sola cuenta de DLPay — valioso
     porque en Fase 6 el DNS necesitará un destino bajo control de DLPay.
   - **Vercel** ofrece la mejor experiencia de revisión (URL de vista previa por rama, útil para
     aprobar cambios desde el teléfono).
   - En ambos casos: **cuenta propia de DLPay**, nunca personal ni de un tercero.

3. **La portabilidad se protege ahora, no después.** Reglas vinculantes desde el primer día:
   - La salida por defecto es **estática** (ADR-0002). Un sitio estático se publica en cualquier
     CDN, servidor o incluso desde un contenedor, sin runtime propietario.
   - **Ninguna función propietaria de plataforma en el núcleo**: nada de middleware, funciones de
     borde, almacenamiento de imágenes ni analítica específicos de un proveedor. Si alguna vez se
     necesita una, va detrás de una interfaz y se documenta como enmienda.
   - **Ninguna configuración de despliegue exclusiva** de un proveedor mientras no haya decisión.
   - Regla de verificación: *el sitio debe poder publicarse copiando la carpeta de build a
     cualquier servidor estático.* Si algo rompe esa afirmación, es una decisión de arquitectura y
     necesita su enmienda.

4. **Cuando llegue el despliegue**, los requisitos —independientes del proveedor— son: publicación
   desde git, vistas previas por rama, rollback inmediato a la versión anterior, HTTPS con
   certificado propio del dominio, y cabeceras de seguridad configurables (CSP, HSTS,
   `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`).

5. **Producción sigue congelada.** Ni dominio, ni DNS, ni correo, ni el Firebase de Guita se tocan.
   La web nueva se construye y se prueba aparte; la conexión al dominio es Fase 6, con TTL bajado
   con anticipación, verificación previa de los registros MX/DKIM para no romper el correo, y plan
   de rollback (el sitio anterior queda en pie; revertir DNS restaura el estado en minutos).

## Consecuencias

- Fase 4 se construye y revisa **en local**, sin dependencias externas ni cuentas nuevas.
- El proyecto no acumula lock-in mientras la decisión esté abierta: diferir es gratis porque la
  portabilidad está protegida por construcción.
- Los pendientes de infraestructura de Fase 0 (transferencia del dominio, acceso al DNS,
  titularidad del Workspace, SPF/DMARC ausentes) **no bloquean** Fases 3, 4 ni 5. Se retoman en
  Fase 6 y siguen registrados en `CLAUDE.md` §13.

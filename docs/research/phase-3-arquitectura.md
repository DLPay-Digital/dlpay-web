# Fase 3 — Arquitectura: decisiones y esqueleto

> **Estado:** cerrada. **Fecha del periodo:** 2026-09-03 a 2026-09-04.
> **Fecha de este registro:** 2026-09-17. **Autor:** Claude Code (sup. Sebastián Villanueva).
> **Insumo previo obligatorio:** `phase-2.5-definicion-experiencia.md`, que cierra diciendo que
> «recién entonces se pasa a Fase 3». No se rehace nada de las Fases 0–2.5.
> **Este documento se escribió a posteriori**, a partir del historial, los ADR y el código. Es un
> registro, no una investigación: la fase ya estaba cerrada cuando se escribió.

---

## 0. Taxonomía de marcadores

Se mantiene la de Fase 1, para que la serie se lea igual.

| Marcador | Significado |
|---|---|
| **HECHO** | Evidencia observable: código, commit, medición. |
| **DECISIÓN** | Elección tomada, con su ADR cuando lo tiene. |
| **DESCARTADO** | Alternativa evaluada y rechazada, con el motivo. |
| **PENDIENTE** | Abierto al cerrar la fase; se sigue en `CLAUDE.md` §13. |

---

## 1. Qué tenía que resolver esta fase

Las Fases 0–2.5 dejaron cerrado **qué** construir: la experiencia, la arquitectura de información,
la identidad visual y los principios de UX. Lo que no tocaron —a propósito— es **con qué**.

Fase 3 responde cuatro preguntas y nada más: con qué framework se construye, cómo se escriben los
estilos, dónde vive el código y cómo se publica. Cada una acabó en un ADR.

**Restricción heredada que condicionó las cuatro:** el sitio actual de DLPay es un inquilino dentro
de la plataforma de un proveedor externo —dominio, DNS, hosting y API ajenos—, y el objetivo del
proyecto es recuperar el control. Cualquier decisión que reprodujera esa dependencia estaba
descartada de entrada, aunque fuera cómoda.

---

## 2. Las cuatro decisiones

### 2.1 Framework y lenguaje — ADR-0002

**DECISIÓN: Astro + TypeScript, salida estática.**

El sitio es contenido: nueve rutas que se leen y una herramienta que calcula. Un framework que
hidrata toda la página para eso paga un coste permanente por un problema que no existe. Astro envía
cero JavaScript por omisión y permite marcar la excepción —el cotizador— como isla.

**DESCARTADO:** Next.js y Nuxt, por enviar runtime a páginas que no lo necesitan. Un generador sin
componentes, por hacer imposible el cotizador. Un CMS, porque el contenido lo escribe quien
construye y no hay redacción externa que justificarlo.

### 2.2 Estilos — ADR-0004

**DECISIÓN: CSS nativo con custom properties. Sin Tailwind ni framework de UI.**

El Design System V1 ya existía con su escala, sus tokens y sus reglas de contraste. Un framework de
utilidades habría obligado a traducirlo a la escala de otro, y la traducción es donde se pierden
las decisiones. Los tokens de `tokens.css` son el espejo literal del documento.

De aquí sale la regla que más se ha citado después: **ningún valor mágico**. Un color, un espaciado,
un radio o un tamaño escritos a mano son un error de revisión, salvo que estén justificados en el
sitio.

### 2.3 Repositorio y convenciones — ADR-0003

**DECISIÓN:** identificadores de código en inglés; commits, documentación y contenido en español.
El repositorio debe pertenecer a DLPay, no a una cuenta personal.

### 2.4 Despliegue — ADR-0005

**DECISIÓN: portabilidad primero, proveedor diferido.**

La regla vinculante que salió de acá: *el sitio debe poder publicarse copiando la carpeta de build a
cualquier servidor estático*. Elegir proveedor en Fase 3 habría sido decidir sin necesidad y con
información incompleta; la portabilidad mantiene la decisión abierta sin coste.

**PENDIENTE (D1b):** el proveedor. Sigue abierto y no bloquea.

---

## 3. El esqueleto

**HECHO.** Al cerrar la fase existía y estaba verificado:

- Astro 7 con TypeScript en modo estricto, `npm run check` y `npm run build` en verde.
- **Cero JavaScript enviado al cliente** en ese momento.
- Las fuentes del set T-C auto-hospedadas, nunca desde un CDN de terceros.
- Los tokens del Design System en código.
- La cadena `PriceSource → Quote` en pie.

### 3.1 La costura del precio

La pieza de arquitectura que más ha aguantado. La UI **no conoce** de dónde sale el precio: consume
un objeto `Quote` y nada más. `ConfigPriceSource` devuelve un valor de muestra; el día que exista
una fuente real se añade otra implementación y se cambia por variable de entorno, **sin tocar la
UI**.

Es la aplicación del principio «preparar costuras, no construir el futuro»: se construyó la
interfaz, no la integración.

**PENDIENTE (D7):** la fuente oficial de precio. Sigue abierta al 2026-09-17, y por eso el sitio
dice en cinco sitios que el precio es referencial.

### 3.2 Dependencias

**HECHO: cuatro paquetes, los cuatro de build.** `astro`, `@astrojs/check`, `typescript` y
`@types/node`. Ninguno llega al navegador. Ese número **no ha cambiado** en toda la Fase 4, pese a
haber entrado un blog con imágenes optimizadas, un globo rotativo y cinco familias de figura.

Cuando algo pareció necesitar una dependencia, la respuesta salió de las capacidades del framework
o del navegador: `astro:assets` con `sharp` —que ya viene como dependencia opcional de Astro— para
el blog, y SVG y CSS para todas las figuras.

---

## 4. Lo que esta fase decidió no hacer

- **No se construyó infraestructura de usuarios, KYC ni operaciones.** Sigue en la plataforma del
  proveedor y es una etapa aparte por sensibilidad de los datos.
- **No se integró una fuente de pricing real** ni se codificó fórmula de spread.
- **No se tocó producción:** ni dominio, ni DNS, ni correo, ni cuentas de terceros.

---

## 5. Qué quedó abierto al cerrar

| # | Pendiente | Estado al 2026-09-17 |
|---|---|---|
| D1b | Proveedor de hosting | Abierto, no bloquea |
| D3 | Organización GitHub de DLPay | **Abierto, y es el mayor riesgo operativo**: el repositorio no tiene copia fuera del equipo salvo un `git bundle` en Drive |
| D5, D6, D21 | Spread, monto mínimo, monto máximo | Abiertos, de DLPay |
| D7 | Fuente oficial de precio | Abierto |
| D9, D19, D20 | Razón social, correo oficial, alcance de los T&C | **Abiertos y bloquean los textos legales** |

---

## 6. Qué siguió

Fase 4: construir el sitio público. Ver `phase-4-construccion.md`.

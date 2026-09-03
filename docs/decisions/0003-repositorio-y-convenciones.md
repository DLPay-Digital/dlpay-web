# ADR-0003 — Repositorio, control de versiones y convenciones

- **Estado:** Aceptada — 2026-09-03
- **Decide:** Sebastián Villanueva (con análisis de Claude Code, Fase 3)
- **Ámbito:** dónde vive el código, cómo se versiona y bajo qué convenciones.

## Contexto

Al iniciar Fase 3 el proyecto llevaba cuatro fases de trabajo documentado **sin ningún control de
versiones**: `git status` devolvía *not a repository*. No había historial, ni `.gitignore`, ni
política de variables de entorno — pese a que `CLAUDE.md` §10 y el Principio 7 lo exigen desde el
primer commit.

Además, el repositorio debe **pertenecer a DLPay**, no a una cuenta personal como único dueño.
Esa titularidad todavía no está resuelta.

Riesgo específico de este proyecto (Principio 7): el repo vive en `~/Projects/dlpay-web`,
**separado** de la carpeta de documentos internos de DLPay (`~/Desktop/DLPAY`), que contiene
KYC/KYB, datos bancarios, historial de operaciones y contratos. Nada de eso puede acercarse al
repositorio.

## Decisión

1. **Repositorio git local, sin remoto por ahora.** Se inicializa ya para que exista historial
   trazable desde el primer día. El remoto se decide más adelante; no bloquea ninguna fase.
   → `PENDIENTE DE DECISIÓN — titularidad de la organización GitHub de DLPay` (CLAUDE.md §13, D3).

   **Por qué no esperar al remoto:** el historial es valioso por sí mismo. Un repo local se
   empuja a cualquier remoto después sin perder nada.

2. **Rama principal: `main`.**

3. **`.gitignore` desde el commit inicial**, cubriendo: artefactos de build y dependencias,
   variables de entorno, archivos del sistema operativo y del editor, y — de forma explícita —
   **patrones de datos sensibles** para que un `git add` accidental falle en lugar de filtrar.

4. **Política de variables de entorno:**
   - `.env.example` **sí** se versiona: documenta cada variable, su propósito y un valor de
     ejemplo. Nunca valores reales.
   - `.env`, `.env.local` y cualquier variante **nunca** se versionan.
   - Ningún secreto entra al código ni al cliente. En Astro, cualquier variable expuesta al
     navegador lleva prefijo público explícito: **lo que se prefija es público, y se trata como
     público**. El número de WhatsApp y el precio de muestra son configuración pública, no secretos.

5. **Convención de commits:** asunto imperativo en **español**, ≤ 72 caracteres, con prefijo de
   ámbito cuando aporte (`docs:`, `cotizador:`, `home:`, `build:`). Cuerpo explicando el **porqué**
   cuando no sea obvio. Sin commits masivos e inexplicables.

6. **Nunca `git add .` sin revisar** lo que entra (Principio 7). Se prefiere `git add` explícito.

7. **Branches y PRs** para cambios relevantes en cuanto exista remoto. Mientras el repo sea local,
   commits directos a `main` con mensajes comprensibles son aceptables dado el tamaño del equipo.

## Consecuencias

- Se crean `.gitignore` y `.env.example` antes del primer commit.
- El commit inicial incorpora el trabajo existente (documentación de Fases 0–2.5, ADRs, logos).
- Cuando se resuelva D3, basta añadir el remoto y empujar `main`. Se documentará el traspaso.
- Los datos internos de DLPay siguen fuera del repo, en su carpeta separada. **Nunca se copian.**

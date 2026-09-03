# ADR-0002 — Framework, lenguaje y arquitectura de contenido

- **Estado:** Aceptada — 2026-09-03
- **Decide:** Sebastián Villanueva (con análisis de Claude Code, Fase 3)
- **Ámbito:** con qué se construye la web pública. No cubre estilos (ADR-0004) ni despliegue (ADR-0005).

## Contexto

Fases 0–2.5 definieron **qué** se construye: siete páginas de contenido
(`/`, `/cotizar`, `/como-funciona`, `/empresas`, `/confianza`, `/faq`, legales) más **una** pieza
interactiva real, el cotizador. Todo lo demás es contenido estático con una identidad visual propia.

`CLAUDE.md` §7 nombraba **Next.js (App Router) + TypeScript** como *baseline provisional a confirmar
en un ADR*. Este ADR lo confirma o lo reemplaza. La restricción de fondo es el Principio 2:
la necesidad manda sobre la herramienta.

**Lo que la web necesita de verdad:**
- Renderizar HTML rápido, con JS mínimo (Principio UX 7: "lo único que carga es el precio").
- Una isla interactiva: el cotizador (estado local, `debounce`, recálculo bidireccional, deep link
  a WhatsApp). Ver `cotizador-spec.md`.
- Contenido versionado en git, editable sin CMS.
- Portabilidad real: poder desplegarse en cualquier host sin atarse a un proveedor (Principio 10).
- Ser mantenible por un equipo sin desarrollador de planta, asistido por Claude Code.

**Lo que la web NO necesita hoy:** sesiones, base de datos, rutas autenticadas, renderizado por
usuario, revalidación, i18n. Todo eso vive en la plataforma de Guita y es etapa independiente.

## Alternativas evaluadas

| | **Astro** | **Next.js (App Router)** | HTML/CSS a mano |
|---|---|---|---|
| JS enviado al cliente (sitio de contenido) | **0 KB por defecto**; solo se hidrata la isla declarada | ~90 KB+ de runtime React aunque la página sea estática | 0 KB |
| Ajuste al alcance v1 | Diseñado exactamente para esto: contenido + islas | Diseñado para aplicaciones; el sitio de contenido es un subconjunto | Sirve, pero sin componentes ni tipado |
| Portabilidad | Salida estática: cualquier CDN o servidor, sin Node en producción | Requiere runtime Node o adaptadores; `output: export` recorta capacidades | Total |
| Contenido | Colecciones tipadas (Markdown/MDX) integradas | Requiere convención o librería adicional | Manual, sin validación |
| Camino a una app futura | Habría que migrar si algún día web y app se fusionan | Camino directo | No escala |
| Mantenibilidad para este equipo | Modelo HTML-first, poca abstracción | Más conceptos (Server/Client Components, caching, revalidación) | Repetición, sin sistema |

## Decisión

1. **Framework: Astro. Lenguaje: TypeScript** (`strict`).

   **Por qué Astro y no Next.js.** El sitio es contenido con **una** isla. Astro entrega eso con
   cero JS de base y salida estática portable; Next.js cobraría el peso y la complejidad de un
   framework de aplicaciones para un sitio que no es una aplicación. La única ventaja real de
   Next.js era anticipar una futura migración de auth/KYC/área de cliente desde Guita — y eso
   **es exactamente lo que el Principio 6 prohíbe**: preparar costuras, no construir el futuro.
   Esa migración es una posibilidad, no un plan, y no debe condicionar la web pública V1.

   **Consecuencia asumida:** si algún día se decide que web y app compartan una sola base de
   código, habrá que migrar la capa de presentación. Se acepta: es un costo futuro e incierto
   frente a un beneficio presente y seguro.

2. **El cotizador es la única isla interactiva.** Se hidrata explícitamente
   (`client:load`, por ser contenido del primer viewport). Ninguna otra parte del sitio envía JS
   salvo que una necesidad concreta lo justifique y quede registrada.

3. **Sin framework de UI (React/Vue/Svelte) por ahora.** El cotizador se escribe con los
   componentes nativos de Astro y TypeScript del lado del cliente. Es un formulario con estado
   local: no justifica una librería. Si al construirlo aparece complejidad real que lo amerite,
   se registra como enmienda a este ADR con el análisis del §8 de `CLAUDE.md`.

4. **Arquitectura de contenido — la mínima que funciona:**
   - **El copy vive en la página** (`.astro`) por defecto. Siete páginas de marketing no
     justifican un sistema de contenido.
   - **Los datos estructurados y repetidos** (ítems de FAQ, pasos del proceso, bloques de
     confianza, enlaces del footer) viven en **archivos de datos tipados** en `src/content/`,
     validados con esquema. Se crea una colección **solo cuando una página real la necesita**.
   - **Nada de CMS, MDX ni i18n** hasta que exista una necesidad concreta.

5. **Idioma:** identificadores de código, nombres de archivo y comentarios técnicos en **inglés**;
   documentación, ADRs, mensajes de commit, contenido y copy en **español**.

## Requisito de entorno

Astro requiere **Node.js**. Hoy la máquina de desarrollo **no tiene Node, npm ni gestor de
versiones instalado** — verificado el 2026-09-03. Es el prerrequisito para crear el esqueleto y
también la causa de que el MCP de Playwright no conecte (`npx` no está en el `$PATH`).
Ver `docs/development.md`.

## Consecuencias

- El esqueleto se crea con Astro + TypeScript en cuanto haya Node.
- La salida por defecto es **estática**, lo que mantiene abiertas todas las opciones de
  despliegue (ADR-0005).
- Toda dependencia adicional pasa por el análisis escrito de `CLAUDE.md` §8. El punto de partida
  es: Astro, TypeScript y nada más.
- `CLAUDE.md` §7 se actualiza: el baseline provisional queda reemplazado por esta decisión.

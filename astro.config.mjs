// @ts-check
import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';

/**
 * Configuración de Astro — deliberadamente mínima (ADR-0002, ADR-0005).
 *
 * Regla de portabilidad vinculante: el sitio debe poder publicarse copiando
 * dist/ a cualquier servidor estático. Nada de funciones propietarias de
 * plataforma en el núcleo. Ninguna configuración específica de un proveedor
 * mientras la decisión de hosting siga diferida.
 *
 * `loadEnv` es de Vite (que Astro ya incluye): evita depender de @types/node
 * sólo para leer una variable en este archivo.
 */
const env = loadEnv('', '.', 'PUBLIC_');

export default defineConfig({
  /** Necesario para canonical, sitemap y Open Graph. Se fija al decidir hosting. */
  site: env.PUBLIC_SITE_URL || 'http://localhost:4321',
  output: 'static',
});

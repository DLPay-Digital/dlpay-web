/**
 * Colecciones de contenido tipadas.
 *
 * ── Por qué este archivo y no `src/content/config.ts` ───────────────────────
 *
 * `src/content/config.ts` es la ruta LEGADA. Astro 7 la sigue aceptando, pero
 * la API vigente es Content Layer y su configuración vive en la raíz de `src/`.
 * Además `src/content/` ya alberga módulos de datos normales —`home.ts`,
 * `business.ts`, `process.ts`, `trust.ts`— que NO son colecciones: poner ahí un
 * `config.ts` haría creer que esa carpeta entera es de colecciones. El `base`
 * del loader deja explícito qué se lee y qué no.
 *
 * ── Sin dependencias nuevas ────────────────────────────────────────────────
 *
 * El helper `image()` y el componente `<Image/>` son de `astro:assets`, del
 * propio framework. `sharp` ya viene como dependencia OPCIONAL de Astro
 * (^0.35.4, instalada), así que `package.json` sigue declarando los mismos
 * cuatro paquetes y el análisis del §8 no se activa.
 */
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.md' }),
  schema: () =>
    z.object({
      title: z.string(),
      description: z.string(),
      /** `coerce` porque en el frontmatter la fecha llega como texto. */
      pubDate: z.coerce.date(),
      /**
       * Dos categorías y nada más. El `enum` es la garantía: un valor fuera de
       * la lista rompe el build en vez de publicar una categoría inventada.
       */
      category: z.enum(['DLPay', 'Mercado']),
      /**
       * El candado de publicación, **cerrado por omisión**. Un artículo sin
       * `estado` es borrador y no entra a un build: ni al listado, ni a su
       * propia ruta, ni al sitemap. Se abre escribiendo `estado: publicado`, y
       * eso sólo después de que Compliance apruebe (CLAUDE.md §6). El filtro
       * único vive en `lib/blog.ts`; ver ahí el porqué.
       */
      estado: z.enum(['borrador', 'publicado']).default('borrador'),
      /**
       * La portada del artículo: una figura de DATO, no una imagen.
       *
       * Opcional a propósito — un artículo sin portada arranca por el titular y
       * la página funciona. No todo artículo de categoría DLPay tiene un dato
       * que mostrar.
       *
       * `fuente` es OBLIGATORIA, y no por formalismo: en cuanto hay una cifra
       * hay que decir de dónde salió. Es el mismo criterio de
       * `lib/config/alliances.ts`, donde el dato declara el alcance de su propio
       * claim. Las cifras de una portada son contenido de mercado y las aprueba
       * Compliance junto con el texto (CLAUDE.md §3 y §6), nunca ingeniería.
       *
       * Sustituye a `coverImage`, retirado el 2026-09-16. Lo que había era un
       * PNG de cuñas diagonales sobre tinta usado dos veces en el mismo
       * artículo: papel tapiz, que el Design System §6 prohíbe con esas
       * palabras. El campo se elimina en vez de quedar reservado, siguiendo el
       * precedente del proyecto —lo que no se usa se borra, como `ActivityFeed`
       * (D18)—: la portada de dato es un componente, no un campo de imagen.
       */
      portada: z
        .object({
          /** Un valor fuera de la lista rompe el build, igual que `category`. */
          tipo: z.enum(['cifra', 'rango']),
          etiqueta: z.string().min(1),
          /** Sólo en `cifra`. */
          valor: z.number().optional(),
          /** Sólo en `rango`. */
          min: z.number().optional(),
          max: z.number().optional(),
          unidad: z.string().min(1),
          fecha: z.coerce.date(),
          fuente: z.string().min(1),
        })
        /*
          Los campos de cifra dependen del tipo, y eso Zod no lo expresa con un
          objeto plano. El refinamiento convierte en ERROR DE BUILD lo que si no
          sería una portada a medio dibujar: un `rango` sin `max` saldría con un
          hueco, y nadie lo vería hasta mirar la página.
        */
        .superRefine((p, ctx) => {
          if (p.tipo === 'cifra' && p.valor === undefined) {
            ctx.addIssue({ code: 'custom', message: 'portada de tipo `cifra` necesita `valor`' });
          }
          if (p.tipo === 'rango' && (p.min === undefined || p.max === undefined)) {
            ctx.addIssue({ code: 'custom', message: 'portada de tipo `rango` necesita `min` y `max`' });
          }
          if (p.tipo === 'rango' && p.min !== undefined && p.max !== undefined && p.min > p.max) {
            ctx.addIssue({ code: 'custom', message: '`min` no puede ser mayor que `max`' });
          }
        })
        .optional(),
    }),
});

export const collections = { blog };

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
  schema: ({ image }) =>
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
       * Opcional a propósito: no todo artículo necesita portada, y el listado
       * ya contempla las dos formas. `image()` resuelve la ruta relativa al
       * propio archivo y entrega ancho, alto y formato, que es lo que permite
       * a `<Image/>` reservar el espacio y evitar saltos de layout.
       */
      coverImage: image().optional(),
    }),
});

export const collections = { blog };

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
       * Tres categorías y nada más. El `enum` es la garantía: un valor fuera de
       * la lista rompe el build en vez de publicar una categoría inventada.
       *
       * `Guía` entró el 2026-10-13 (Cowork, entrega `aprende-`): es lo que no
       * envejece con el mercado —qué es el dólar observado, cómo se lee un
       * spread— frente a `Mercado`, que comenta un dato con fecha. El índice
       * del blog las separa en dos listas por este campo.
       */
      category: z.enum(['DLPay', 'Mercado', 'Guía']),
      /**
       * La fecha de la última revisión de fondo, si la hubo. Se muestra junto
       * a la de publicación y va al `dateModified` de los datos estructurados.
       *
       * **Se escribe a mano y sólo cuando cambia lo que el artículo afirma**:
       * una cifra puesta al día, una sección nueva. Una errata no la mueve.
       * Si no está, el artículo no dice nada y `dateModified` es la
       * publicación, que es lo cierto.
       */
      actualizado: z.coerce.date().optional(),
      /**
       * «En corto»: de dos a cuatro frases arriba del cuerpo, para quien viene
       * a buscar la respuesta y no a leer el artículo entero. Es TEXTO NUEVO y
       * lo firma Compliance como el resto (CLAUDE.md §3): cada frase tiene que
       * estar dicha también en el cuerpo, porque un resumen no puede afirmar
       * algo que el artículo no sostiene.
       */
      resumen: z.array(z.string().min(1)).min(2).max(4).optional(),
      /**
       * El lugar del artículo en la ruta «Tu primera operación» del índice.
       * `paso` ordena; `titulo` es el nombre corto con que aparece en la ruta,
       * porque el titular entero no cabe en una columna de cuatro.
       *
       * La ruta se cuenta sobre lo PUBLICADO: un paso en borrador no existe, y
       * el siguiente ocupa su número. Ver `lib/blog.ts`.
       */
      ruta: z
        .object({ paso: z.number().int().min(1), titulo: z.string().min(1) })
        .optional(),
      /**
       * El candado de publicación, **cerrado por omisión**. Un artículo sin
       * `estado` es borrador y no entra a un build: ni al listado, ni a su
       * propia ruta, ni al sitemap. Se abre escribiendo `estado: publicado`, y
       * eso sólo después de que Compliance apruebe (CLAUDE.md §6). El filtro
       * único vive en `lib/blog.ts`; ver ahí el porqué.
       */
      estado: z.enum(['borrador', 'publicado']).default('borrador'),
      /**
       * La portada del artículo. **Nunca un archivo de imagen**: o una figura de
       * DATO, o un pictograma del asunto. Las dos las dibuja el sistema.
       *
       * Opcional a propósito — un artículo sin portada arranca por el titular y
       * la página funciona. No todo artículo tiene algo que mostrar arriba.
       *
       * Sustituye a `coverImage`, retirado el 2026-09-16. Lo que había era un
       * PNG de cuñas diagonales sobre tinta usado dos veces en el mismo
       * artículo: papel tapiz, que el Design System §6 prohíbe con esas
       * palabras. El campo se eliminó en vez de quedar reservado, siguiendo el
       * precedente del proyecto —lo que no se usa se borra, como `ActivityFeed`
       * (D18)—: una portada es un componente, no un campo de imagen.
       *
       * ── Por qué una unión discriminada y no un objeto con opcionales ──────
       *
       * Porque los tipos NO comparten campos. `cifra` y `rango` exigen
       * `etiqueta`, `unidad`, `fecha` y `fuente`; `figura` no tiene ninguno de
       * los cuatro, porque no afirma ningún dato y por tanto no hay nada que
       * citar. Con un objeto plano los cuatro tendrían que volverse opcionales y
       * un `rango` sin `fuente` pasaría el build — que es justo lo que no puede
       * pasar (ver abajo). La unión lo convierte en error de tipos y de build.
       *
       * `fuente` es OBLIGATORIA donde hay cifra, y no por formalismo: en cuanto
       * hay un número hay que decir de dónde salió. Es el mismo criterio de
       * `lib/config/alliances.ts`, donde el dato declara el alcance de su propio
       * claim. Las cifras de una portada son contenido de mercado y las aprueba
       * Compliance junto con el texto (CLAUDE.md §3 y §6), nunca ingeniería.
       *
       * ── La salvaguarda del tipo `figura` ─────────────────────────────────
       *
       * `figura` es un `z.enum` CERRADO, y esa es la condición que impide que
       * este campo se convierta otra vez en lo que fue `coverImage`. Un artículo
       * **elige** entre los pictogramas que el sistema ya dibuja y razona en
       * `PortadaFigura.astro`; no puede traer uno suyo. Un valor fuera de la
       * lista rompe el build, igual que `category`. Añadir uno nuevo es tocar
       * ese componente, que es donde está escrito qué puede y qué no puede
       * afirmar un dibujo en una página de DLPay.
       */
      portada: z
        .discriminatedUnion('tipo', [
          z.object({
            tipo: z.literal('cifra'),
            etiqueta: z.string().min(1),
            valor: z.number(),
            unidad: z.string().min(1),
            fecha: z.coerce.date(),
            fuente: z.string().min(1),
          }),
          z.object({
            tipo: z.literal('rango'),
            etiqueta: z.string().min(1),
            min: z.number(),
            max: z.number(),
            unidad: z.string().min(1),
            fecha: z.coerce.date(),
            fuente: z.string().min(1),
          }),
          z.object({
            tipo: z.literal('figura'),
            /** Cerrado. El catálogo y su porqué están en `PortadaFigura.astro`. */
            figura: z.enum(['activo-tokenizado', 'billetera', 'spread']),
          }),
        ])
        /*
          Lo único que la unión no expresa por sí sola: un intervalo al revés
          saldría dibujado con el tope mayor a la izquierda y nadie lo vería
          hasta mirar la página.
        */
        .superRefine((p, ctx) => {
          if (p.tipo === 'rango' && p.min > p.max) {
            ctx.addIssue({ code: 'custom', message: '`min` no puede ser mayor que `max`' });
          }
        })
        .optional(),
    })
    /* Una revisión no puede ser anterior a la publicación: se vería en la
       página como «actualizado» antes de existir. */
    .refine((d) => d.actualizado === undefined || d.actualizado >= d.pubDate, {
      message: '`actualizado` no puede ser anterior a `pubDate`',
      path: ['actualizado'],
    }),
});

export const collections = { blog };

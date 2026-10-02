# DLPay Web

La web propia de **DLPay** (marca de DLPZ INCZ SpA). Sitio estático, sin servidor y sin base de
datos: Astro + TypeScript, CSS nativo con tokens, y una sola isla interactiva —el cotizador—.

**Repositorio privado, y por un motivo concreto:** `docs/auditoria-preproduccion.md` lista los
claims publicados que todavía no tienen firma de Compliance, y `cowork/README.md` lleva los
veredictos internos de cada entrega. Nada de eso se lee fuera del equipo.

> **Antes de tocar nada, lee `CLAUDE.md`.** Es la fuente de verdad del proyecto: principios,
> límites de la fase actual, estándares y decisiones abiertas. Este README sólo te pone en marcha.

---

## Levantarlo

Necesitas **Node ≥ 20.3** (`package.json` lo declara; en el equipo donde se construyó corre
v24.20.0).

```bash
npm install     # cuatro paquetes, los cuatro de build
npm run dev     # http://localhost:4321
```

Y las tres comprobaciones que tienen que estar en verde antes de dar algo por hecho:

```bash
npm run check   # astro check — TypeScript strict, 0 errores
npm test        # 80 pruebas
PUBLIC_SITE_URL=https://dlpay.cl npm run build
```

**El build EXIGE `PUBLIC_SITE_URL` y la valida.** No es decorativa: de ella salen el canonical, el
Open Graph, el JSON-LD, el sitemap y el robots. La guarda rechaza hosts locales, lo que no sea
`https` y las rutas que no sean la raíz. Un `astro build` a secas falla, y falla a propósito.

> `build` en verde **no** quiere decir «terminado». El Definition of Done está en `CLAUDE.md` §9.

### Para escribir, `dev`. Para JUZGAR, `preview`

```bash
PUBLIC_SITE_URL=https://dlpay.cl npm run build && npm run preview
```

**No mires el resultado en `npm run dev`.** El servidor de desarrollo sirve los estilos como
módulos asíncronos, así que llegan **después del primer pintado**: cualquier animación que ocurra
**una sola vez** ya se perdió cuando su CSS aterriza. Tampoco aplica la cadena de producción, ni
exige `PUBLIC_SITE_URL`, ni pasa la guarda de despliegue.

Y **reinícialo a menudo**: un `astro dev` de días acaba sirviendo el HTML nuevo con el CSS viejo,
sin un solo error en consola. Ha costado cinco diagnósticos en esta fase; uno de ellos, cinco rondas
y un commit que no arreglaba nada porque no había nada roto.

#### Si «no se actualiza», esto es lo que pasa y cómo se arregla

**El síntoma no parece un problema de caché.** La página se ve, pero **a medias**: un dibujo nuevo
sale sin forma, o un texto oscuro aparece sobre un fondo oscuro. Es porque el servidor manda el
**HTML de hoy con el CSS de ayer**, y un elemento sin sus reglas no desaparece: se queda crudo.
Refrescar el navegador no sirve — lo viejo es lo que el servidor entrega.

**Se comprueba en un comando**, pidiéndole al servidor la hoja de un componente que cambiaste:

```bash
# ¿cuántas veces aparece una clase nueva en el archivo, y cuántas en lo que sirve el dev?
grep -c "mi-clase-nueva" src/components/MiComponente.astro
curl -s "http://localhost:4321/src/components/MiComponente.astro?astro&type=style&index=0&lang.css"   | grep -c "mi-clase-nueva"
```

**Si el segundo número es 0 y el primero no, es esto.**

**Y reiniciar el proceso NO siempre basta.** El módulo rancio vive en `node_modules/.vite`, que
sobrevive al reinicio. Hay que borrarlo:

```bash
lsof -nP -iTCP:4321 -sTCP:LISTEN -t | xargs kill
rm -rf node_modules/.vite
npm run dev
```

*Esto último se aprendió el 2026-10-02, y explica por qué en un diagnóstico anterior el servidor se
reinició y «seguía igual»: se mató el proceso y se dejó la caché.*

---

## Qué hay dentro

| | |
|---|---|
| `src/pages/` | las once rutas estáticas, más una por artículo y la 404 |
| `src/components/` | las piezas; cada una lleva en su cabecera el porqué de lo que hace |
| `src/content/` | el contenido tipado: preguntas, glosario, confianza, artículos del blog |
| `src/lib/pricing/` | la cadena `PriceSource → Quote`. **Las cifras del sitio salen de aquí, nunca se teclean** |
| `docs/` | lo vinculante: ADRs, Design System, Motion System, auditoría, arquitectura |
| `cowork/` | las entregas del segundo agente y el veredicto de cada integración |
| `tests/` | pruebas de la lógica determinística y del build |

**Los documentos que mandan**, por orden de uso:

1. **`CLAUDE.md`** — principios, límites, decisiones abiertas. El punto de entrada.
2. `docs/design-system/design-system-v1.md` — tokens, escala, componentes, accesibilidad.
3. `docs/design-system/motion-system-v1.md` — qué se mueve, dónde, y las cuatro excepciones.
4. `docs/decisions/` — los once ADR. Una decisión aceptada **no se reescribe**: se enmienda
   dejando visible lo anterior, o la supera un ADR nuevo que la cite.
5. `docs/auditoria-preproduccion.md` — qué falta para publicar y qué claims están sin firmar.

---

## Tres cosas que se pueden romper sin saberlo

**1 · El candado de publicación del blog.** Un artículo sin `estado: publicado` en su frontmatter
se ve con `astro dev` pero **no entra al build, ni al listado, ni al sitemap**. Está cerrado por
omisión a propósito: ningún artículo se publica sin pasar por Compliance. Si escribes uno y «no
aparece», es esto y está funcionando.

**2 · La indexación.** `PUBLIC_ALLOW_INDEXING` va **cerrada por omisión**: sin el literal `true`,
el sitio se publica con `noindex` y `Disallow: /`. El modo seguro es el que se obtiene sin hacer
nada, porque un Staging indexado publicaría bajo la marca DLPay páginas legales que todavía son
borradores.

**3 · `push --mirror`.** Nunca. `--mirror` sube todas las referencias, incluidas las de respaldo de
reescrituras, y republicaría historiales que se limpiaron a propósito. `git push` normal y ya.

---

## Cómo se trabaja

- **Rama `main`.** Para cambios relevantes, rama y pull request.
- **Hoy nada obliga a revisar.** El plan Free de GitHub no permite exigir revisión en un repo
  privado, así que **lo que sostiene el historial es el acuerdo, no la plataforma**. Cuando haya
  varias personas commiteando, el paso es GitHub Team.
- **Un commit sin `push` no está respaldado.** Empujar es parte de cerrar la sesión.
- **Lo que el remoto NO guarda:** `Claude outputs/` y `.env` están en el `.gitignore`. El segundo
  se reconstruye con `.env.example`; el primero existe sólo en el equipo de Sebastián.
- Commits, documentación y contenido **en español**; identificadores de código en inglés
  (ADR-0003).

---

## Lo que este proyecto deliberadamente NO hace

Nada de autenticación, KYC/KYB, área de cliente, motor de operaciones ni datos de usuarios: eso
sigue en la plataforma actual y es una etapa aparte. Y **nunca entran al repositorio** documentos
de identidad, datos bancarios de clientes, contratos ni credenciales (`CLAUDE.md`, Principio 7).

Tampoco se instalan dependencias sin el análisis escrito del §8. Hoy son cuatro, las cuatro de
build, y **cero en el navegador**.

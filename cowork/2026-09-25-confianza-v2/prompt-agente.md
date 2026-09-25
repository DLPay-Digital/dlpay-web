# Prompt para el agente de Claude Code — `2026-09-25-confianza-v2`

**Fecha:** 2026-09-25 · **Autor:** Claude Cowork
**Maqueta:** `conf-v2.html` · **md5** `d254b3713833c192da7448ef27718f11`
**Renders:** `conf-1280.png`, `conf-390.png` · **Ficha:** `ficha.md` — léela entera.

> **Espera el visto bueno de Sebastián antes de tocar `src/`.**
>
> **Y antes de eso, esto necesita Compliance.** No es un trámite de cierre: es la condición para
> que el cambio exista. Está en la §3.

> Leído del repositorio en vivo: `confianza.astro`, `trust.ts` y el build del commit `5dae2f8`.
> Comprueba igual lo que uses para decidir.

---

## 1. Un solo cambio

**La línea de tenencia (`phases`) sube a la portada.**

La portada promete «Tenemos un mecanismo que puedes revisar paso a paso» y después hay **322 px de
tinta sin nada**; el mecanismo aparece 400 px más abajo. La promesa y la prueba están separadas por
un scroll.

Es el mismo patrón de `/tarifas` y `/como-funciona`: el objeto del que trata la página, en la
portada. Aquí el objeto es el recorrido del dinero.

«Qué pasa con tu plata» se queda con su titular, su bajada y sus tres `mechanisms`, que es lo que
la bajada promete: «tres cosas que puedes verificar tú mismo».

**Lo que no se toca:** `honesty`, `requirements`, la mención institucional —que está donde está por
un motivo escrito y bueno—, «Quiénes somos» y el pie.

---

## 2. Cómo

La figura va en la ranura `aside` de `PageHero`. **No hace falta `layout="stacked"`**: aquí no monta
sobre la costura, se queda dentro de la banda. Evalúalo tú con el componente real; las dos formas
valen y la maqueta enseña la de dentro.

**El marcado y el dato no cambian.** Es la misma `figure.track`, la misma `ol.phases`, el mismo
`figcaption` y el mismo `phases` de `trust.ts`. Lo único que cambia es dónde vive y, por vivir sobre
tinta, su paleta:

| | hoy, sobre papel | sobre tinta |
|---|---|---|
| tramo que no es nuestro | `--ink` · `rgb(19,26,38)` | **`--line-on-tinta`** |
| tramo nuestro | `--verde-deep` | **`--verde`** (8,45:1) |
| rótulos | `--ink` / `--ink-mute` | `--on-tinta` / `--on-tinta-mute` |

**Ese cambio de paleta es media razón del cambio entero.** Hoy los dos tramos que **no** son
nuestros están dibujados a plena fuerza de `--ink`, más pesados que el que sí lo es, y la leyenda
justo debajo dice «el tramo verde es el único que es nuestro». El §6.2 tiene la marca exacta para lo
ajeno —el filete `--ink-mute`, «existe, es real, no es nuestro»— y estas barras no la usaban. Sobre
tinta el fondo decide el color, que es como el §6.2 quiere que se decida.

Sigue sin necesitar `--elev-card`: la figura va plana. El §4.5 no se toca.

---

## 3. Compliance, y es condición y no trámite

**La mención de BCI sube a la portada.** En `trust.ts`, `mechanisms` y `phases` llevan las dos
`REQUIERE VALIDACIÓN DE COMPLIANCE` sobre la mención del banco por nombre.

**La cadena no cambia; su posición sí.** Pasa de estar a mitad de página a ser lo primero que se
lee. Es el error del `PendingNotice` con otra ropa: una frase pendiente de validación que gana peso
al cambiar de sitio.

**Si Compliance no está cómodo con el nombre del banco en portada, hay dos salidas y ninguna es
integrar igual:**

1. La portada lleva la línea con el tramo nuestro rotulado sin nombrar el banco, y el nombre se
   queda donde está hoy, dentro de `mechanisms`.
2. La figura no sube, y el cambio se reduce al color de las barras donde están — que es la mitad
   que sí está medida y no depende de nadie.

---

## 4. Copy

**Cero cadenas nuevas.** Ni una. Todo el texto es el que ya publica `trust.ts` y la propia página,
`figcaption` incluido.

---

## 5. Qué comprobar

1. **Mira el render a 1280 y a 390.** En móvil las tres fases tienen que apilar y leerse en orden:
   es una secuencia y ése es su orden correcto.
2. Contraste sobre tinta: `--verde` 8,45:1, rótulos en `--on-tinta-mute` 8,18:1, las barras ajenas
   en `--line-on-tinta` por encima de 3:1, que es el piso de un elemento gráfico.
3. Texto más pequeño ≥ 13 px. **Cero `<text>` dentro de SVG** — la figura es HTML y así se queda;
   el comentario de la página lo explica mejor que yo.
4. Sin scroll horizontal a 320, 390 y 1280.
5. «Qué pasa con tu plata» sigue teniendo sentido sin la figura: titular, bajada y tres mecanismos.
6. El `figcaption` viaja con la figura. Si se queda abajo, la frase «el tramo verde es el único que
   es nuestro» pierde su referente.
7. La página no gana JavaScript.

---

## 6. Lo de siempre

`cowork/` no toca `src/`. Y borra `cowork/_tmp-dist-borrar.tar.gz` (361 KB): lo dejé yo para medir
el build desde el contenedor y esta sesión no tiene permiso de borrado en la carpeta.

# Prompt para el agente de Claude Code — `2026-09-25-como-funciona-v2`

**Fecha:** 2026-09-25 · **Autor:** Claude Cowork
**Maqueta:** `cf-v2.html` · **md5** `e6ab9aeead91afa01fe15e24cbf5e9d6`
**Renders:** `cf-1280.png`, `cf-390.png` · **Ficha:** `ficha.md` — léela entera.

> **Espera el visto bueno de Sebastián antes de tocar `src/`.** Él eligió la página; la maqueta no
> la ha visto todavía.

> **Leído del repositorio en vivo, no de una copia.** Esta entrega se hizo con la carpeta del
> proyecto conectada a la sesión: `src/`, el `git log` y el `dist/` de las 19:44. Aun así,
> comprueba lo que uses para decidir: integras varias veces al día.

---

## 1. Qué es

Dos cambios en `/como-funciona`, y sólo dos. Medido hoy: **3.007 px de `main`, cero anclas de más
de 24×24 px, cero superficies elevadas**.

**a) El teléfono entra en la portada.** `WhatsAppMockup.astro` ya existe y hoy sólo lo usan
`Process.astro` y `MacbookMockup.astro`. La página que explica la conversación no enseña la
conversación. Va en la portada con el momento que la propia página describe en los pasos 02 y 03:
el mensaje que el botón escribe solo y el ejecutivo confirmando.

**b) El suelo cambia de manos.** Los pasos con `who === 'DLPay'` van sobre `--papel-2`; los de la
persona, sobre `--papel`. Se calcula del mismo dato que ya calcula las marcas de traspaso: si
mañana cambia el reparto en `process.ts`, el suelo se mueve solo. **No lo listes a mano.**

---

## 2. Cómo

**El teléfono** va en la ranura `aside` de `PageHero`. Evalúa `layout="stacked"` con `--montaje`,
que es lo que usan `/empresas` y `/tarifas` para que la pieza monte sobre la costura: **la maqueta
lo deja apoyado dentro de la banda porque no supe reproducir el montaje en una maqueta suelta, no
porque prefiera que vaya apoyado.** Las dos formas cumplen el §4.5; elige mirando el render.

**El hilo** se le pasa por `thread`, como hace `Process.astro`. Las tres burbujas son literales de
los hilos que ya existen ahí. **La tasa sale de `ConfigPriceSource`, nunca escrita a mano** — es la
corrección que ya me hiciste en `tarifas-v2` y no quiero repetirla.

**El suelo** es color, no sombra. `--papel-2` sobre `--papel`, `--r-3` de radio, y en escritorio
sólo en la columna derecha; en móvil, donde no hay columnas, es lo único que marca el reparto.

---

## 3. El §4.5, comprobado antes de dibujar y no después

| límite | cómo queda |
|---|---|
| un `--elev-card` por página | el teléfono, y nada más. **Una sola sombra en toda la página**, medida sobre el render |
| la superficie alterna con el papel | 3 de 6 pasos sobre `--papel-2` |
| la sombra nunca es decorativa | la burbuja del chat llevaba una sombra de 1 px y la quité: eso es borde |

El teléfono es «el objeto del que trata la página» apoyado en la banda de tinta, que es el caso que
la regla nueva nombra.

---

## 4. Lo que no se toca, y hay que dejarlo escrito

- **`EjeDeAlcance`**, el cierre. Ya es una figura y su comentario explica por qué es media y no
  entera. Iba a proponer redibujarlo; leerlo me lo impidió.
- **Los tiempos de los seis pasos, a su tamaño actual.** Era mi idea principal —son el mejor
  argumento de la página y están en tamaño de nota al pie— y la descarté al ver que el del paso 06
  lleva `REQUIERE VALIDACIÓN DE COMPLIANCE` en `process.ts`. Agrandar una cifra sin validar a
  tamaño de titular es el error del `PendingNotice`. **Si algún día Compliance valida ese tiempo,
  esa es una entrega nueva y vale la pena hacerla.**
- La escalera de dos columnas, el cálculo de traspasos, `Ten esto a mano`, `Registro y
  verificación` y la banda de cierre.

---

## 5. Compliance: una sola cadena nueva

| cadena | qué es |
|---|---|
| «Acá pasa de la web a una persona.» | pie del teléfono |

Todo lo demás es literal de `process.ts` y de los hilos de `Process.astro`. El resto del pie —«El
chat se abre con tu operación ya escrita»— ya es el `claim` publicado de `WhatsAppMockup`.

**Y una que retiré yo antes de entregar:** había puesto al pie de la escalera «El suelo cambia de
color donde cambia de manos. Los tres filetes verdes marcan los traspasos…». Es la página
explicándole al lector su gramática visual, que es la octava cadena que me rechazaste en
`tarifas-v2`. Si el dibujo necesita leyenda, el dibujo está mal.

---

## 6. Qué comprobar

1. **Mira el render a 1280 y a 390.** El suelo tiene que alternar en los dos, y en el teléfono debe
   ser lo único que marque el reparto.
2. Una sola sombra en la página. Si salen dos, algo se elevó sin motivo.
3. Texto más pequeño ≥ 12 px. Cero `<text>` dentro de SVG que escale.
4. Sin scroll horizontal a 320, 390 y 1280.
5. El suelo sale de `step.who`, no de una lista. Cambia un `who` en `process.ts` y comprueba que se
   mueven el suelo **y** la marca de traspaso.
6. La tasa del chat sale de `ConfigPriceSource`.
7. Contraste del texto sobre `--papel-2` y del verde del tiempo (`--verde-deep`) sobre ese fondo.
8. La página **sigue en cero bytes ejecutables** si hoy lo está.

---

## 7. Lo de siempre

`cowork/` no toca `src/`. Y borra `cowork/_tmp-dist.tar.gz`, que lo dejé yo para poder medir el
build desde el contenedor y esta sesión no tiene permiso de borrado en la carpeta.

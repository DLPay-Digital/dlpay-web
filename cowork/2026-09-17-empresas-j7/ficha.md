# Ficha — J7: `/empresas` gana su FAQ y lo que hay que tener a mano

**Entrega:** `2026-09-17-empresas-j7` · **Autor:** Claude Cowork · **Estado:** En revisión
**Vista:** `index.html` · **Capturas:** `vista-1280.png`, `vista-390.png`, `empezamos-1280.png`,
`faq-cerrada-1280.png`
**Origen:** jugada J7 del estudio `2026-09-17-estudio-nivel-2`. **La jugada cambia de forma**, con el
visto bueno de Sebastián: ver §2.
**Última de nivel 2.**

---

## 1. El estado, medido

`/empresas` después de integrar el eje de alcance (`f99a49b`): **5.204 px, 5,8 pantallas, 441
palabras**. Es la página **menos densa del sitio** —1,32 pantallas por cada 100 palabras, frente a
0,92 de `/como-funciona`— y le faltan dos cosas que sus lectores necesitan:

| | `/como-funciona` | `/empresas` |
|---|---|---|
| FAQ | ninguna | **ninguna** |
| «Ten esto a mano» | 473 px · 89 palabras | **no existe** |

Y la FAQ del sitio —cinco preguntas, sólo en la Home— es **entera de persona**: cédula, registro,
qué es el dólar digital. Ninguna responde algo que pregunte una empresa.

## 2. El onboarding NO se dibuja, y por qué

J7 decía «proceso de incorporación dibujado». Le apliqué la prueba que aportó el agente —**qué dice
la figura si le quitas los rótulos**— y cuatro cajas en fila dicen «un proceso de cuatro pasos»,
que es exactamente lo que la lista numerada ya dice. **Es una lista con adornos.**

Y hay una razón más dura. `onboarding` en `business.ts` es un `string[]` de cuatro frases: no tiene
campo `who` ni ninguna otra estructura. El carril de `/como-funciona` funcionó porque el reparto
**ya estaba en el dato**. Aquí no está, y deducirlo de los verbos («nos envías» → tú, «revisamos» →
nosotros) sería **fabricar el dato para que encaje con el dibujo** — el mismo error que retiró la
portada de propagación del blog.

Sebastián eligió el cambio: la sección conserva sus cuatro pasos y **gana la columna que le
faltaba**, «Ten esto a mano», que es lo que `/como-funciona` tiene para una persona y `/empresas`
no tenía para nadie.

## 3. Las dos piezas

**A · «Cómo empezamos» se reparte en dos columnas.** Izquierda: el titular, la bajada que ya existe
—«No hay formulario que llenar a ciegas»— y la lista de qué preparar. Derecha: los cuatro pasos,
sin tocar. El lector ve a la vez **qué juntar** y **qué va a pasar**.

Tres ítems, la misma forma que la lista de personas:

| Ítem | De dónde sale |
|---|---|
| Los documentos de la sociedad y de quienes la representan legalmente | `trust.ts`, `requirements[1]`, **literal** |
| Una cuenta bancaria a nombre de la empresa | `trust.ts`, `requirements[2]` («sólo desde cuentas del titular de la operación»), adaptado al titular empresa |
| La dirección de la billetera donde quieres recibir el dólar digital | `process.ts`, `checklist[2]`, **literal** |

> Tenía un cuarto ítem —«A dónde paga tu empresa, con qué frecuencia y en qué montos»— y lo quité
> al mirar el render: es **palabra por palabra** la cola del paso 1, que estaba a su lado en la
> columna de enfrente. No es algo que se tenga a mano; es de lo que se habla.

**B · La FAQ propia.** Misma gramática que `Faq.astro`: `<details>`, cero JavaScript, teclado de
fábrica, el marcador `+` que gira a `×`. Cuatro preguntas, las cuatro objeciones del estudio.

## 4. Las cuatro respuestas y su procedencia

Ninguna inventa sustancia: las cuatro se arman con material que ya está escrito y disperso.

**1 · ¿Quién atiende mi cuenta?**
`differences[1].company` («Un ejecutivo asignado que conoce tu operación») + `business.ts` caso 3
(«Tu ejecutivo ya conoce la operación») + `onboarding[3]` + `home.ts` («Somos un equipo en Chile»).

**2 · ¿Qué documentos necesito?**
`trust.ts` `requirements[1]` y `requirements[2]`, los dos casi literales.

**3 · ¿Qué pasa si mi proveedor sólo recibe por banco?**
`business.ts` caso 1, **literal** («Si tu proveedor sólo recibe por banco, conversémoslo antes») +
la regla dura de `CLAUDE.md` §1. Es la misma frase que J5 subió a la costura del eje: aquí se
**desarrolla**, no se repite — el eje da el límite, la FAQ da qué hacer con él.

**4 · ¿Desde qué volumen conviene? — `PENDIENTE DE DECISIÓN (D6)`**
`differences[2].company` («Conversadas según volumen y frecuencia») + `business.ts` caso 4 («en
montos donde el spread de un banco pesa de verdad»).

> **Va sin cifra a propósito.** D6 —el monto mínimo real— sigue abierto, y `business.ts` tiene como
> regla de cabecera «nada de cifras de volumen». La respuesta dice lo que **sí** se puede decir hoy:
> que las condiciones se conversan y que no hay tabla pública por tramos. Cuando D6 se cierre, esta
> respuesta admite la cifra sin reescribirse.
>
> El agente avisó de algo que conviene dejar escrito: **una pregunta de empresa que toque precios,
> spreads, tiempos o condiciones comerciales entra en `CLAUDE.md` §3**, no sólo en el visto bueno de
> Sebastián. Ésta las toca, y por eso lleva marcador.

**Frases nuevas:** sólo el título de la sección, «Lo que nos preguntan las empresas», y las cuatro
preguntas. Las respuestas son recomposición de copia existente.

## 5. Un hallazgo fuera de la entrega: `/empresas` perdió la alternancia

Medido sobre el build de `f99a49b`:

| Sección | Superficie |
|---|---|
| `page-hero` | tinta |
| `cases` | papel |
| `diff` | papel-2 |
| `steps-band` | papel |
| `scope` | **papel** ← |
| `contact` | tinta |

`steps-band` y `scope` son **las dos papel**, seguidas. La alternancia se rompió al añadir el eje.
En `/como-funciona` el mismo bloque `scope` sí es papel-2, así que es una inconsistencia entre las
dos integraciones, no una decisión.

**Propuesta:** `scope` de `/empresas` pasa a `--papel-2`, y la FAQ nueva va en papel-2 también…
no: con `scope` en papel-2, la FAQ va en **papel**. Secuencia resultante:
tinta · papel · papel-2 · papel · papel-2 · papel · tinta. Entera.

*(La maqueta pone la FAQ sobre papel-2 porque muestra la sección aislada. Al integrar manda la
alternancia, no la maqueta.)*

## 6. Evidencia medida

`index.html` en Chromium, ×2, contra `tokens.css` sincronizado hoy.

| | 390 | 760 | 900 | 1280 |
|---|---|---|---|---|
| Desborde horizontal | 0 | 0 | 0 | 0 |
| Alto de la vista | 2.031 | 1.679 | 1.468 | 1.403 |
| Medida de respuesta | 350 px | 423 | 423 | 423 px (47ch) |
| Columnas de «Cómo empezamos» | 1 | 1 | 2 | 2 |

**Contraste** — 24 nodos de texto por ancho, barrido completo, fondo efectivo compuesto por
ancestros, sin filtrar por color: **mínimo 4,90:1, cero incumplimientos**. Ese 4,90 es del rótulo de
andamio (`--aviso-deep` sobre papel-2), que no viaja; el mínimo de lo que se integra es **4,93**.
Gráficos: el tick **5,44:1**, el marcador `+` **4,93:1** — piso 3:1.

**Objetivos táctiles:** los cuatro `<summary>` miden **73 px** de alto (98 el que envuelve a dos
líneas en móvil). Piso 44. La regla `min-height:44px` está igualmente declarada.

**Listas:** las dos con `role="list"`. **Interactivos:** sólo los cuatro `<summary>`, que son
nativos — foco, Enter y Espacio de fábrica, sin una línea de JavaScript.

**Ninguno de los `<details>` abre por defecto**, igual que en la Home.

## 7. Lo que descarté

**Dibujar el onboarding igual.** §2.

**Reutilizar `Faq.astro` tal cual.** No se puede: importa `faq` desde `content/home.ts` en duro.
Necesita props (`items`, `title`) — cambio pequeño y limpio, pero es tuyo.

**Una quinta pregunta sobre el precio de la web.** La Home ya tiene «¿El precio de la web es el
precio final?» y la respuesta vale igual para una empresa. Repetirla aquí habría sido rellenar.

**Poner cifras de volumen para que la cuarta respuesta quedara redonda.** Es D6 y es de Sebastián.
Una respuesta honesta sin cifra vale más que una cifra inventada para que la sección luzca.

## 8. Para el agente

1. `Faq.astro` necesita props para servir a dos páginas. Si prefieres un componente aparte, dilo:
   la duplicación de un acordeón es barata, pero la del criterio de «qué es una objeción real» no.
2. Las cuatro preguntas deberían vivir en `content/business.ts` junto al resto del contenido de la
   página, no en la página.
3. La cuarta respuesta lleva `PENDIENTE DE DECISIÓN — D6` en comentario. Que no se pierda al
   trasladar: es lo que hará que alguien la revise cuando la decisión se cierre.
4. El cambio de superficie de §5 es una corrección de tu integración anterior, no parte de J7.
   Puede ir en commit aparte.
5. **La lista `.onboarding` de esta sección es de las que quedan sin `role="list"`.** Como
   acordamos: ésta la toca mi entrega, así que va aquí; las demás las cierras tú.

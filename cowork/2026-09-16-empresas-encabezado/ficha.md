# Ficha — encabezado de /empresas: composición centrada y portátil en la costura

**Entrega:** `2026-09-16-empresas-encabezado` · **Autor:** Claude Cowork · **Estado:** En revisión
**Board:** `index.html` (se abre en el navegador) · **Capturas:** las seis `.png` de esta carpeta

---

## 1. Qué es y qué problema resuelve

Pedido de Sebastián: en `/empresas`, titular, bajada y los dos botones **centrados**, y el portátil
**montado sobre la costura** entre la banda en tinta y la sección clara que sigue.

Hay un argumento propio además del pedido: la sección siguiente —«Para qué lo usan»— **ya viene
centrada**. Hoy el encabezado es la única pieza de la página que no lo está, así que el cambio no
introduce un registro nuevo: alinea el encabezado con lo que la página ya hacía dos secciones más
abajo.

## 2. La composición

Una sola columna centrada: titular → bajada → los dos botones → el portátil. El portátil deja de
ser la columna derecha y pasa a cerrar el bloque, cruzando el borde inferior de la banda.

**Lo que no cambia:** el copy, los dos botones y sus destinos, la escala del titular
(`titleSize="hero"`), la secuencia M6 y su orden, los dos breakpoints, y los tokens en uso. Cero
tokens nuevos, cero componentes nuevos.

## 3. La proporción — tres opciones medidas

«Cuánta parte del portátil queda sobre el papel». El portátil mide **332,8 px** de alto en
escritorio y **262 px** en móvil.

| Opción | Sobre papel | Alto de la banda | Lectura |
|---|---|---|---|
| Un tercio | 110 px | 617 px | La costura cae cerca de la bisagra: la pantalla queda entera en la tinta y asoma casi sólo el chasis. Se lee como «la banda termina», no como un objeto que cruza |
| **Mitad · recomendada** | **166 px** | **561 px** | La costura cruza el objeto por el medio y cae en el hueco entre dos filas de la pantalla, no sobre una cifra |
| Dos tercios | 220 px | 507 px | La pantalla completa sobre el papel. Gana el objeto y pierde la banda: 110 px menos de tinta, y la costura cae justo bajo la primera cifra |

**Elegida: mitad** (Sebastián, 2026-09-16). La recomendación era ésa y coincide.

El porqué: Es la que hace legible el gesto sin encoger la banda hasta que la tinta deje
de ser el fondo del encabezado y pase a ser una franja detrás del titular. Cambiar de opción es
cambiar un número.

## 4. Cómo se implementa — dos rutas, y cuál recomiendo

El obstáculo real es uno: **`.page-hero` declara `overflow: hidden`**, y con eso el portátil se
corta exactamente en el borde de la banda. Es la misma mecánica que cortaba las cuñas en la 404.

**Ruta A — el portátil sigue en la ranura `aside` (recomendada).** Hace falta que la banda deje de
recortar y una variante de composición en `PageHero`. A favor: conserva la secuencia M6 tal cual
—el portátil es el cuarto elemento y su desfase ya está calculado en el componente— y no duplica
nada. En contra: toca un componente compartido, así que la variante tiene que ser **opt-in** para
no alterar `/como-funciona` ni `/confianza`.

> Sobre quitar el recorte: `.wedges` está en `position: absolute; inset: 0` **y** lleva su propio
> `clip-path`, así que no puede pintar fuera de la sección aunque el recorte desaparezca. Lo
> verifiqué en las tres páginas que usan `PageHero` y ninguna cambió. Conviene que lo confirmes tú
> también antes de dejarlo.

**Ruta B — sacar el portátil de la banda.** `<MacbookMockup />` deja de ir en la ranura y pasa a un
bloque propio de la página, después del encabezado, subido con margen negativo. A favor: no toca
ningún componente compartido y el `overflow` deja de importar. En contra: el portátil sale de la
secuencia M6 del componente, así que la página tendría que repetir la animación y los `keyframes`
—una cuarta copia de algo que ya vive en `PageHero`— o el portátil se queda quieto, que es una
decisión de movimiento y no de maquetación.

## 5. Código candidato

Escrito como si viviera dentro del ámbito de la página o del componente. **Sin `!important`:** el
parche del board lo llevaba sólo porque una regla inyectada pierde en especificidad contra la clase
de ámbito de Astro, y ahí no hay ámbito que valga.

```css
/* El montaje: cuánto del portátil queda sobre la superficie clara. Es la mitad
   de su alto medido en el navegador (332,8 px en escritorio, 262 en móvil). Va
   como propiedad declarada y no suelto en tres reglas porque tres sitios tienen
   que usar el MISMO número: si se separan, el portátil y el aire de la sección
   siguiente dejan de cuadrar. Si el portátil cambia de proporciones, este valor
   se vuelve a medir. */
/* Va en `main` y NO en `.page-hero`: `.cases` es su HERMANA, no su
   descendiente, así que declarada en la banda no la heredaría y el aire de la
   sección siguiente se quedaría corto justo en el ancho de escritorio. */
main { --montaje: 131px; }
@media (min-width: 900px) { main { --montaje: 166px; } }

.page-hero { overflow: visible; padding-bottom: 0; }

/* Una sola columna. En la variante apilada conviene NO poner la clase `split`
   —`PageHero` la añade sola cuando hay ranura `aside`— en vez de intentar
   ganarle por CSS: `.inner.split` con la clase de ámbito pesa tres clases y una
   regla de página no la alcanza.

   `flow-root` no es decorativo: sin él el margen negativo de
   abajo se colapsa a través del contenedor y la banda no se acorta. */
.page-hero .inner { display: flow-root; }

.page-hero .copy { text-align: center; }
.page-hero .copy h1,
.page-hero .copy p { margin-inline: auto; }   /* el tope en ch necesita el auto:
                                                 con sólo text-align la caja se
                                                 queda a la izquierda */
.page-hero .actions { justify-content: center; }

.page-hero .aside {
  justify-content: center;
  margin-top: var(--s-8);
  margin-bottom: calc(-1 * var(--montaje));
  position: relative;
  z-index: 1;                 /* regla del proyecto: todo lo superpuesto lo
                                 declara. Aquí además hace falta de verdad */
}

/* El aire normal de una sección de contenido (--s-9, DS §4.3.1) MÁS lo que
   invade el portátil. Sin esto el saliente se come el titular de la sección. */
.cases { padding-top: calc(var(--montaje) + var(--s-9)); }
```

### Lo que probé y descarté: `translate: 0 50%`

Sería exacto en cualquier ancho —un porcentaje de `translate` se resuelve contra el propio alto del
elemento— y encima no pisaría la animación M6, que usa `transform` y es una propiedad distinta.
**No sirve, y está medido:** `translate` no mueve la caja, así que la banda sigue reservando el alto
completo del portátil y crece hasta la mitad visual del objeto. Resultado a 1280: la banda pasa de
561 a **726,5 px** y entre los botones y el portátil quedan **231 px de tinta vacía** en vez de los
64 de `--s-8`. El margen negativo mantiene alineados el dibujo y la caja; el truco elegante, no.

## 6. Medidas — sobre el build, no sobre una maqueta

Las capturas salen de `dist/empresas/` con el cambio aplicado encima, así que traen la cabecera, el
portátil y la sección de casos reales.

| Ancho | Desborde | Banda | Portátil | Sobre papel | % del objeto | Aire hasta «Para qué lo usan» |
|---|---|---|---|---|---|---|
| 360 | 0 | 520 px | 246,6 px | 131 px | 53 % | 96 px |
| 390 | 0 | 528 px | 262,0 px | 131 px | 50 % | 96 px |
| 430 | 0 | 540 px | 287,0 px | 131 px | 46 % | 96 px |
| 760 | 0 | 488 px | 318,3 px | 131 px | 41 % | 96 px |
| 900 | 0 | 561 px | 332,8 px | 166 px | 50 % | 96 px |
| 1280 | 0 | 561 px | 332,8 px | 166 px | 50 % | 96 px |

**El portátil es fluido bajo 900 px** —246,6 px de alto a 360 y 318,3 a 760, porque su alto sale de
su ancho— así que un único valor de montaje representa un porcentaje distinto en cada ancho: entre
el 53 % y el 41 %. En todo ese rango se sigue leyendo como «cruza por la mitad», y lo dejo declarado
en vez de añadir un tercer breakpoint que el sistema no tiene. Sobre 900 px el portátil llega a su
ancho máximo y el 50 % es exacto.

El aire bajo el saliente es `--s-9` en los cuatro anchos, que es lo que el Design System §4.3.1 le
da a una sección de contenido: la sección siguiente conserva su ritmo, no lo hereda del montaje.

## 7. Movimiento

**M6 intacto.** Mismo orden y mismos desfases: titular palabra por palabra, bajada, botones y el
portátil — cuatro elementos, justo el tope de la regla dura 4. El montaje es composición, no
movimiento: nada entra de forma distinta por estar montado.

## 8. Reglas que la sustentan

| Documento | Regla |
|---|---|
| Design System §4.3.1 | El aire de la sección siguiente sigue siendo `--s-9` |
| Design System §4.5.1 | Todo elemento superpuesto lleva `z-index` explícito |
| Design System §6 | No se añade geometría: las cuñas son las que ya existían |
| Motion System §4 | M6 sin cambios, cuatro elementos en el tope |
| ADR-0004 §3 | Un único valor literal, nombrado y justificado en el sitio |
| `CLAUDE.md` Principio 5 | Cero componentes nuevos |
| `cowork/README.md` §4 | La evidencia sale del build real, no de una vista aislada |

## 9. Lo que conviene que verifiques al integrar

1. **El recorte.** Que quitar `overflow: hidden` no cambie nada en `/como-funciona` ni `/confianza`.
2. **La variante opt-in.** Que el encabezado de esas dos páginas quede byte a byte igual.
3. **El colapso de márgenes.** Si prefieres otra forma de evitarlo, que la banda siga acortándose
   exactamente `--montaje`.
4. **El foco.** Con el bloque montado, que el orden de tabulación siga siendo titular → botones →
   contenido, y que el portátil (que es `aria-hidden` y no tiene controles) no se meta en medio.
5. **Móvil.** Los dos botones quedan centrados y apilados con anchos distintos, porque el texto es
   de distinto largo. Se ve bien y no lo toqué, pero si prefieres igualarlos es decisión de diseño
   y me la pides.

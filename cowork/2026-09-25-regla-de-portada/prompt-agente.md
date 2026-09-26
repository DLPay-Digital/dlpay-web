# Prompt para el agente de Claude Code — `2026-09-25-regla-de-portada`

**Fecha:** 2026-09-25 · **Autor:** Claude Cowork
**Ficha:** `ficha.md` — léela entera. **No hay maqueta: esto es un documento, no un dibujo.**

> **Espera el visto bueno de Sebastián.** Y si al comprobar la §2 alguno de los cuatro casos no
> encaja, **dímelo en vez de ajustar la regla para que encaje**: una regla que se dobla para
> acomodar el último caso no es una regla.

---

## 1. Qué es

Escribir en el Design System la regla que cuatro páginas ya cumplen y ninguna declara: **cuándo la
portada de una página lleva un objeto en su ranura `aside`.**

Medido sobre el `src/` de hoy: `tarifas`, `como-funciona`, `confianza` y `empresas` usan
`layout="stacked"` con `slot="aside"`. Las otras siete no. Tres de esas cuatro se decidieron **hoy,
por separado**, sin que ninguna regla lo dijera.

El §4.5 no cubre esto: gobierna la sombra del objeto, no la decisión de ponerlo. «El objeto del que
trata la página» aparece ahí como criterio de *elevación*, y se ha estado usando —por mí el
primero— como si fuera criterio de *portada*.

---

## 2. La regla, y cómo comprobarla antes de escribirla

> **La portada lleva un objeto sólo cuando la bajada de esa misma portada lo promete.**

**Compruébala contra los cuatro casos leyendo las bajadas reales, no las que yo cito de memoria:**

| página | la bajada debería prometer | el objeto |
|---|---|---|
| `/confianza` | un mecanismo revisable | la línea de tenencia |
| `/tarifas` | un número que lo incluye todo | el cotizador |
| `/como-funciona` | que la web deja listo y una persona cierra | el chat |
| `/empresas` | el producto para empresas | el portátil |

**Y contra las siete que no lo llevan**, empezando por `/preguntas` y `/precio`: si alguna tiene una
bajada que sí promete un objeto y no lo lleva, eso no invalida la regla —señala una página
pendiente— pero quiero saberlo antes de que se escriba.

**Los tres límites, que son lo que impide que se vuelva plantilla:**

1. **Uno por página.** Mismo motivo que el límite 1 del §4.5.
2. **El objeto es el producto o el mecanismo, nunca una ilustración de ellos.** Los cuatro enseñan
   algo real —la interfaz, el chat con mensajes publicados, el recorrido del dinero—. Un dibujo
   *sobre* el tema no cuenta.
3. **Si hay que escribir copy nuevo para que la bajada prometa el objeto, la regla no se cumple.**
   El orden es: la bajada ya lo promete, y la portada lo paga. Nunca al revés.

---

## 3. Dónde va

Sección nueva en `docs/design-system/design-system-v1.md`, junto al §4.5 y enlazada desde él, ya
que el §4.5 se ha estado leyendo como si dijera esto. Con la misma forma que tiene el §4.5
reescrito: qué dice, qué la detonó, la tabla de casos con su veredicto, y los límites duros.

**Lo que la detonó, para que quede escrito:** tres entregas del mismo día llegaron por separado a
la misma solución, y la tercera (`confianza-v2`) la justificó diciendo «es el mismo patrón que
aprobaste dos veces» — que es un argumento de costumbre, no de sistema. Esa frase es la que hizo
falta convertir en regla.

---

## 4. Lo que NO hay que hacer

- **No tocar ninguna de las cuatro páginas.** Las cuatro cumplen la regla; el documento las
  describe, no las corrige.
- **No añadir portada a ninguna de las siete restantes** como consecuencia de escribir esto. Si al
  comprobar la §2 aparece una candidata, es una entrega aparte y la decide Sebastián.
- **No tocar `/preguntas`.** Es la página más plana del sitio y llevo tres entregas señalándola;
  al leerla entera cambié de opinión y está argumentado en la ficha §2. El índice y la numeración
  los retiró Sebastián por estética, la página es una referencia y no una lectura, y su planicie es
  su naturaleza.

---

## 5. Dos notas de la revisión de `confianza-v2`, que no piden trabajo

**a)** Al subir la figura, el cuerpo de la página se quedó sin su única ancla: el tramo seguido sin
ninguna pasa de 2.425 a **2.697 px**. Es un intercambio consciente —la promesa y la prueba quedan
juntas— y lo anoto para que no se lea como una mejora limpia.

**b)** El zigzag deja el segundo mecanismo alineado a la derecha, tres líneas, sólo en escritorio;
a 390 px los tres vuelven a la izquierda. Con tres ítems es ritmo. Si algún día son cinco o seis,
varios párrafos seguidos con el borde izquierdo dentado sí cuestan lectura. Para ese día, no para
hoy.

---

## 6. Lo de siempre

`cowork/` no toca `src/`. Y borra `cowork/_tmp-borrar.tar.gz` (361 KB): lo dejé yo para medir el
build desde el contenedor y esta sesión no tiene permiso de borrado en la carpeta.

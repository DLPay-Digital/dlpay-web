# Ficha — Intro de marca · v final, opción C

**Fecha:** 2026-09-25 · **Autor:** Claude Cowork
**Maqueta:** `intro.html` · **md5** `0b85179d9ec95fe469efcc683605c52b`
**Bloques a copiar:** `bloque.txt` · **md5** `7a51e0fd7ae5d53b1e4ce49b2e4d87b3`
**Peso:** marcador 766 bytes · intro 6.530 bytes · **0 KB de red** (van en la cabecera del documento)

Las 17 comprobaciones de esta ficha están hechas extrayendo los dos bloques **del propio
`bloque.txt` que se entrega**, no de una copia de trabajo, y sirviendo las páginas del build de
verdad para navegar entre ellas.

---

## 1. Cuándo se ve

**Una sola vez por inicio en la web, y sólo entrando por la home.**

| situación | ¿se ve? |
|---|---|
| entra por la home, primera página de la sesión | **sí** |
| recarga la home | no |
| home → `/tarifas` → clic al logo → home | no |
| entra por `/tarifas` y hace clic al logo | no |
| entra por `/terminos` y hace clic al logo | no |
| cae en la 404 y hace clic al logo | no |
| entra por `/tarifas`, pasa por `/precio`, llega a la home | no |
| entra por `/confianza` y va a la home | no |
| llega a la home desde otro sitio (buscador, enlace) | **sí** |
| pestaña nueva del mismo navegador, entra por la home | **sí** |
| cierra el navegador, vuelve a abrirlo, entra por la home | **sí** |
| `prefers-reduced-motion: reduce` | no |
| sin JavaScript | no |
| **hueco aceptado:** entra por una de las cinco páginas sin marcador y después **escribe** la dirección de la home | **sí** |

Ese último caso es la única excepción, es deliberada, y está en la lista para que nadie la trate
como un fallo más adelante.

---

## 2. Cómo funciona: dos piezas

**A · El marcador de visita.** En el `<head>`, lo primero, **sólo en las páginas que ya ejecutan
JavaScript**. Lee antes de escribir:

```js
var y = sessionStorage.getItem('dlpay-visita');
sessionStorage.setItem('dlpay-visita','1');
window.__dlpayInicio = !y;
```

`window.__dlpayInicio` es verdadero sólo en la primera página de la sesión de esa pestaña.

**B · La intro**, sólo en la home. Su primera comprobación es `if(!window.__dlpayInicio) return;`
y detrás lleva el respaldo:

```js
try{ if(document.referrer && new URL(document.referrer).origin===location.origin) return; }catch(e){}
```

Si el marcador falta, `__dlpayInicio` vale `undefined` y **no hay intro nunca**: el fallo cae del
lado seguro, pero es silencioso. Si tras integrar no se ve jamás, falta A o A quedó después de B.

---

## 3. Por qué el marcador no va en todas las páginas

Sobre el build del 24, **cinco páginas no ejecutan un solo byte**: `/tarifas`, `/terminos`,
`/privacidad`, `/canal-de-denuncias` y la 404 —las cinco llevan sólo un `application/ld+json`, que
no ejecuta—. Ponerlas a ejecutar es justo lo que la decisión D28 se negó a pagar para cerrar el
aviso de cookies, y gastarlo en una animación de entrada es un argumento más débil que aquél.

**Yo había escrito que el marcador costaba «767 bytes y una escritura por carga».** El número era
correcto y el coste real no lo vi; lo encontró el agente de Claude Code. Al comprobarlo apareció un
dato que cambia el tamaño del problema: `/tarifas` está en ese grupo de cinco, y no es una página
de borde — es la puerta de entrada comercial desde buscador.

Las tres opciones, medidas navegando con clics de verdad:

| caso | A · marcador en todas | B · sólo donde ya hay JS | **C · elegida** |
|---|---|---|---|
| entra por `/tarifas`, **clic** al logo → home | no | **SE VE** | no |
| entra por `/tarifas`, **escribe** la dirección de la home | no | **SE VE** | **SE VE** |
| entra por `/terminos`, clic al logo → home | no | **SE VE** | no |
| llega a la home desde otro sitio | se ve | se ve | se ve |

C cuesta 346 bytes más, sólo en la home, mantiene las cinco páginas en cero ejecutable y deja un
único hueco.

**Una nota sobre el método.** La primera vez que medí esto, las tres opciones dieron idéntico y el
respaldo parecía inútil. El fallo era mío: navegaba con `goto`, que no manda referente, así que
estaba midiendo la dirección escrita a mano y no el clic. Regla 33 otra vez: el instrumento tiene
que hacer lo que hace la persona.

**Descartado:** `history.length` para distinguir la entrada. Vale 1 en pestaña nueva, pero quien
venía leyendo otra cosa en esa pestaña y escribe nuestra dirección da más de 1 — y ésa sí es una
llegada de verdad. Suprimiría la intro justo a quien debería verla.

---

## 4. El fallo que encontró la prueba de esfuerzo

La primera versión colgaba la capa en `DOMContentLoaded`, porque cuando corre el script de la
cabecera todavía no existe `<body>`. Sin frenos no se nota. Con la CPU frenada sí, y mucho. Medido
**en píxeles**, cuadro a cuadro: **641 ms de portada visible a ×4** y **721 ms a ×6**, con el
titular y el cotizador ya puestos. Después caía el azul encima y al levantarse aparecía lo mismo.
Eso no es una intro: es tapar contenido ya servido. Está en `parpadeo-v1-vs-v5.png`.

La solución: el telón no es el `<div>`, es un pseudo-elemento de `<html>` —que sí existe cuando
corre el script de la cabecera— así que pinta en el primer fotograma.

```css
html.intro-va::before{content:"";position:fixed;inset:0;background:var(--tinta);z-index:9998}
html.intro-va{overflow:hidden}
```

Dos consecuencias que hubo que cubrir: la red de seguridad se arma junto con la clase y no dentro
de la función que cuelga la capa (si el hilo muere entre la cabecera y `<body>`, ahora la pantalla
se quedaría azul para siempre), y cuando esa red corta, corta con el mismo fundido de 380 ms de la
salida normal.

**La regla dura 5 se cumple por construcción:** sin JavaScript no se pone la clase, no hay telón y
la página se ve entera. No depende de la red de seguridad.

---

## 5. Medidas finales

| camino | telón | primer pintado | logo | scroll libre | ¿portada antes del telón? |
|---|---|---|---|---|---|
| normal 1280 | 27,9 | 112,0 | 90,7 | 937,5 | **no** |
| CPU ×4 | 100,5 | 244,0 | 446,0 | 1.288,6 | **no** |
| CPU ×6 · 390 | 69,5 | 340,0 | 558,9 | 1.422,2 | **no** |

En los diez caminos probados —incluidos ×10, ×20, red con 600 ms de retardo y `requestAnimationFrame`
anulado— la secuencia de píxeles es **blanco → telón → logo → página**. Nunca aparece la portada
antes del telón.

**Fotogramas.** En la ventana de la animación, sin filmar y sobre tres corridas: a 1× la media es
24,0 ms con p95 de 33,4; a ×4 la media es 24,2 con p95 de 50. La animación sólo toca `transform` y
`opacity`, y eso está medido, no afirmado.

**Sin efectos colaterales**, comparado contra la misma home sin intro:

| | altura | ocultos tras pasada de scroll | `overflow` final | cotizador |
|---|---|---|---|---|
| con intro | 8.102 px | 25 / 419 | `visible` | 1.087,31 |
| sin intro | 8.102 px | 25 / 419 | `visible` | 1.087,31 |

---

## 6. El `<style>` necesita `is:global`, y no hay atajo

Lo avisó el agente: Astro escopa los estilos por clase y `.intro` lo crea el script en tiempo de
ejecución, así que el bloque se quedaría **sin un solo estilo, en silencio**. Tiene razón, y el
problema es más ancho: la regla que de verdad no se puede escopar es `html.intro-va::before`,
porque la clase de ámbito se le pone a los elementos de la plantilla del componente y `<html>` no
está ahí, está en `Base.astro`.

Se evitaría metiendo el `<style>` en `Base.astro`, donde `<html>` sí es suyo — pero entonces 1,3 KB
de CSS viajan a todas las páginas para una pieza que sólo puede verse en la home. `is:global` en un
componente de la home es lo correcto, no un apaño.

---

## 7. Lo que queda pendiente y es de Sebastián

**a) La regla dura 2 del Motion System dice «el cotizador no entra».** Una capa a pantalla completa
lo tapa 937 ms. La regla se escribió para que el cotizador no tuviera entrada propia, y no la
tiene, pero queda detrás de algo que se mueve. Es tu excepción y hay que escribirla con la ventaja,
como manda la instrucción permanente 4.

**b) La enmienda de movimiento.** El techo publicado es 280 ms y esta pieza dura 830. Es la
tercera, después del ADR-0006 de la franja y el ADR-0008 del globo, y tiene que existir **antes**
de que el bloque entre en `src/`.

**c) El visitante no puede hacer scroll durante ~0,9 segundos** (937 ms normales, 1.289 a ×4). Es
el precio de un telón a pantalla completa. Si te parece mucho, el camino es acortar la animación,
no quitar el `overflow: hidden`: sin él la página se desplaza por detrás del telón y al levantarse
aparece a media altura.

---

## 8. Regla de evidencia nueva

**34 · Un instrumento roto no avisa: devuelve ceros, y un cero parece un resultado.**
La primera corrida de la prueba dijo «0 fotogramas, capa null» en los ocho caminos. Leído sin
sospecha, eso era «la intro no se ejecuta nunca». No era eso: la sonda llamaba a
`MutationObserver.observe(document.documentElement)` en `document-start`, donde `documentElement`
todavía no existe; la excepción abortaba el resto de la sonda en silencio. Antes de creerle un cero
a un instrumento, hay que probar que el instrumento mide.

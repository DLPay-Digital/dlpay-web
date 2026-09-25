# Prompt para el agente de Claude Code — `2026-09-25-intro-de-marca`

**Fecha:** 2026-09-25 · **Autor:** Claude Cowork
**Maqueta:** `intro.html` · **md5** `0b85179d9ec95fe469efcc683605c52b`
**Bloques a copiar:** `bloque.txt` · **md5** `7a51e0fd7ae5d53b1e4ce49b2e4d87b3`
**Ficha:** `ficha.md` — léela entera antes de tocar nada.

> **Sebastián eligió la opción C.** El marcador NO va en las cinco páginas que hoy no ejecutan
> nada; el hueco lo tapa el respaldo de referente, que ya viene dentro del bloque B. La D28 queda
> cerrada y las cinco páginas siguen en cero bytes ejecutables.
>
> **Sigue faltando la enmienda de movimiento y la decisión sobre la regla dura 2 (§5).**

---

## 0. El orden

1. **Sebastián decide** sobre la regla dura 2 (§5). Sin eso no entra.
2. Escribir la **enmienda de movimiento**, al estilo del ADR-0008 del globo, acotada a esta pieza:
   no toca el techo de 280 ms fuera de ella ni los seis movimientos.
3. Integrar las dos piezas de la §2.
4. Añadir la **regla 34** al `cowork/README.md` (texto literal en §7).

---

## 1. Qué es

Una intro de marca de 830 ms: telón sobre `--tinta`, el isotipo separado por su propio eje
(33,954°) que se une, un destello que lo barre, y la capa se funde dejando ver la web. **0 KB de
red**, sin dependencias nuevas, sin cambiar el diseño de ninguna página.

El isotipo son los dos subcaminos del `d` de `Logo.astro`, literales — ya lo verificaste byte a
byte y así tiene que seguir.

---

## 2. Dos piezas, y dónde va cada una

### A · El marcador de visita — 766 bytes

En el `<head>`, **lo primero**, antes que cualquier otro script incluido el `is:inline` de
`Motion.astro`.

**Va en las páginas que ya ejecutan JavaScript. NO va en estas cinco:**

```
/tarifas    /terminos    /privacidad    /canal-de-denuncias    404
```

Esas cinco llevan hoy sólo un `application/ld+json` y se quedan en cero bytes ejecutables. Como
el `<head>` es único (`Base.astro`), hará falta una condición por ruta o una prop del layout —
tú sabes mejor que yo cuál encaja. **Confírmalo antes contra `src/`:** que `/tarifas` esté en ese
grupo es lo que decidió la opción C, y yo lo medí sobre el build del 24.

### B · La intro — sólo en el `<head>` de la home, después del marcador

`is:inline`, sin `type="module"`, sin `defer`: tiene que correr **síncrono y antes de `<body>`**.
Si se difiere, el fallo de la §3 vuelve entero.

Sus dos primeras comprobaciones, en este orden y las dos necesarias:

```js
if(!window.__dlpayInicio) return;                         // no es el inicio de la sesión
try{ if(document.referrer && new URL(document.referrer).origin===location.origin) return; }catch(e){}
```

La segunda es el respaldo de la opción C: si el visitante viene de una dirección nuestra, esto no
es una entrada, es una navegación por dentro. Tapa el hueco de las cinco páginas sin marcador
cuando la persona llega haciendo clic.

**Si integras sólo B, la intro no se verá nunca**, porque `__dlpayInicio` valdrá `undefined`. El
fallo cae del lado seguro pero es silencioso.

### El `<style>` va con `is:global`

Tu aviso es correcto y el problema es más ancho de lo que parecía: la regla que de verdad no se
puede escopar es `html.intro-va::before`, porque la clase de ámbito se le pone a los elementos de
la plantilla del componente y `<html>` vive en `Base.astro`. Meter el `<style>` en `Base.astro`
lo evitaría, pero manda 1,3 KB de CSS a todas las páginas para algo que sólo se ve en la home.
`is:global` es lo correcto.

---

## 3. El detalle que costó cinco versiones y no es un detalle

La primera versión colgaba la capa en `DOMContentLoaded`. **Con la CPU frenada la portada se
pintaba entera antes de que la taparan: 641 ms visibles a ×4 y 721 ms a ×6, medidos en píxeles**,
con el titular y el cotizador ya puestos.

**Tres cosas que no se pueden relajar** (ya las verificaste en el código, quedan escritas para
quien lo lea después):

- **La clase `intro-va` se pone antes de construir el SVG**, en la primera línea útil del script.
  Si se pone después de armar el marcado, se pierden los milisegundos que justifican el cambio.
- **La red de seguridad se arma junto con la clase, no dentro de `poner()`.** El telón sube antes
  que nada; si el hilo muere entre la cabecera y `<body>` y no hay red, la pantalla se queda azul
  para siempre.
- **`muerto=true` se pone al entrar en `fundir()`**, no sólo al limpiar. Sin esa línea, a ×20 el
  logo asomaba a 3.474 ms y desaparecía 113 ms después.

---

## 4. Las reglas duras

| regla | cómo se cumple |
|---|---|
| 1 · una sola vez | una por inicio de sesión, y sólo entrando por la home (§6) |
| 3 · las cifras no entran | la capa tapa, no anima nada de la página |
| 5 · sin JS, todo se ve | **por construcción**: sin JS no se pone la clase, no hay telón ni capa |
| 6 · `prefers-reduced-motion` | el script sale antes de tocar el DOM, y el CSS anula telón y capa |

---

## 5. Lo que falta decidir, y es de Sebastián

**La regla dura 2 del Motion System dice «el cotizador no entra».** Un telón a pantalla completa lo
tapa 937 ms. La regla se escribió para que el cotizador no tuviera entrada propia —y no la tiene—
pero queda detrás de algo que se mueve. Se propone con la ventaja escrita, como manda la
instrucción permanente 4. **No integres mientras esto no esté resuelto.**

---

## 6. Qué comprobar antes de darla por buena

**Las catorce situaciones, navegando de verdad entre páginas servidas y con clics, no con cargas
directas** — un `goto` no manda referente y da un falso resultado en las cuatro del respaldo:

| situación | esperado |
|---|---|
| entra por la home, primera página de la sesión | **se ve** |
| recarga la home | no |
| home → `/tarifas` → clic al logo → home | no |
| entra por `/tarifas` y hace clic al logo | no |
| entra por `/terminos` y hace clic al logo | no |
| cae en la 404 y hace clic al logo | no |
| entra por `/tarifas`, pasa por `/precio`, llega a la home | no |
| entra por `/confianza` y va a la home | no |
| llega a la home desde otro sitio | **se ve** |
| pestaña nueva del mismo navegador, entra por la home | **se ve** |
| navegador cerrado y reabierto, entra por la home | **se ve** |
| `prefers-reduced-motion: reduce` | no |
| sin JavaScript | no |
| **hueco aceptado:** entra por una de las cinco y **escribe** la dirección de la home | **se ve** |

Ese último es deliberado. Está en la tabla para que nadie lo trate como un fallo más adelante.

**Y lo demás:**

1. **Filma el arranque con la CPU frenada ×4 y ×6** y mira los fotogramas uno a uno. La secuencia
   tiene que ser blanco → telón → logo → página. Si aparece un solo fotograma con la portada antes
   del telón, el script se difirió o la clase se pone tarde.
2. La altura de la Home no cambia: **8.102 px** a 1280 px, con intro y sin ella.
3. Tras una pasada de scroll **con `await` entre pasos** (regla 29), los ocultos son **25 de 419**,
   los mismos que sin intro.
4. El `overflow` de `<html>` vuelve a `visible` y se puede desplazar al segundo.
5. El cotizador responde: 1.000.000 → 1.087,31.
6. A los 2,5 s no queda `.intro` ni la clase `intro-va` en ningún camino.
7. Las cinco páginas de la §2.A siguen en cero bytes ejecutables después de integrar.
8. La enmienda de movimiento existe **antes** de que el bloque entre.

---

## 7. Regla 34 para el `cowork/README.md`, literal

> **34 · Un instrumento roto no avisa: devuelve ceros, y un cero parece un resultado.**
> La primera corrida de la prueba de la intro dijo «0 fotogramas, capa null» en los ocho caminos.
> Leído sin sospecha, eso era «la intro no se ejecuta nunca». No era eso: la sonda llamaba a
> `MutationObserver.observe(document.documentElement)` en `document-start`, donde `documentElement`
> todavía no existe; la excepción abortaba el resto de la sonda en silencio. Antes de creerle un
> cero a un instrumento, hay que probar que el instrumento mide.

---

## 8. Lo de siempre

`cowork/` no toca `src/`. La maqueta es sólo visualización. Copia los bloques literales: el
atributo `d` del isotipo va en una sola línea y un salto metido por el editor lo parte en silencio.

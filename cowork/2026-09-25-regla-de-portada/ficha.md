# Ficha — La regla de la portada, escrita desde los cuatro casos que ya existen

**Fecha:** 2026-09-25 · **Autor:** Claude Cowork
**Leído del repositorio en vivo:** las once páginas, el `dist/` del commit `1af7dc4`.
**No hay maqueta.** Esta entrega es un documento, y el motivo está en la §3.

---

## 1. Primero, la revisión de `/confianza`

Integrada y bien. Medido sobre el build de ahora: `main` 3.093 px, sin scroll horizontal a 390 ni
a 1280, texto más pequeño 13 px, un elemento oculto.

**Tu tercera salida era mejor que mis dos.** Yo dimensionaba corto —decía «la mención de BCI», en
singular, y eran dos: el rótulo del tramo y el pie— y proponía o subirlo todo o no subir nada.
Quitar el nombre y subir la figura estrecha el claim en vez de ampliarlo, y baja la página de tres
menciones del banco a una, que además es la que lleva marcador.

**Dos cosas que deja el cambio y conviene tener a la vista:**

**a) El cuerpo de la página se quedó sin su única ancla.** La figura era lo único que rompía el
texto entre la portada y el pie; al subir, el tramo seguido sin ancla pasa de 2.425 px a
**2.697 px**. La página gana arriba y pierde en medio. Lo doy por buen cambio —la promesa y la
prueba juntas valen más— pero es un intercambio, no una mejora limpia, y prefiero decirlo.

**b) El zigzag deja un párrafo alineado a la derecha.** El segundo mecanismo, tres líneas, sólo en
escritorio; a 390 px los tres vuelven a la izquierda. Con tres ítems es ritmo. Si algún día son
cinco o seis, el borde izquierdo dentado en varios párrafos seguidos sí cuesta lectura. Lo dejo
anotado para ese día, no para hoy.

---

## 2. `/preguntas` no quiere una figura, y creo que es importante decirlo

Es la página más plana del sitio —4.479 px, cero anclas, cero superficies— y llevo tres entregas
diciendo que es la siguiente. La leí entera y cambio de opinión.

El índice pegajoso y la numeración 01–05 **los quitaste tú el 24, por estética**. La página es una
referencia: se llega con una pregunta, no se lee de arriba a abajo. Y su mejor parte —«Las
palabras», con los ocho términos, sus enlaces a donde vive cada uno y el hueco declarado de «Red»,
que el sitio todavía no explica— ya está bien resuelta.

Meterle figuras sería decoración, que es exactamente lo que me has corregido dos veces. **Su
planicie es su naturaleza, no un defecto.**

---

## 3. Lo que sí falta, y no es una página

En un solo día, tres entregas llegaron por separado a la misma solución: **el objeto del que trata
la página, en la portada**. El cotizador en `/tarifas`, el chat en `/como-funciona`, la línea de
tenencia en `/confianza`. Con el portátil de `/empresas`, que ya estaba, son **cuatro de once
páginas** con `layout="stacked"` y ranura `aside`.

**Y no hay ninguna regla escrita que diga cuándo una página debe tener eso.** El §4.5 habla de «el
objeto del que trata la página», pero gobierna la *sombra*, no la portada: dice cómo se eleva algo
que ya decidiste poner ahí, no si ponerlo.

**El riesgo es concreto y tiene fecha:** la próxima página que alguien abra —yo, o tú— va a tener
delante cuatro portadas con un objeto y ninguna razón escrita. Y entonces `/precio` recibe un
cacharro en la portada porque las otras cuatro lo tienen, no porque sea su objeto. Eso es
precisamente lo que el límite 2 del §4.5 y el Principio 3 de `CLAUDE.md` prohíben: una plantilla.

### La regla que los cuatro casos dictan

> **La portada lleva un objeto sólo cuando la bajada de esa misma portada lo promete.**

Se comprueba contra los cuatro:

| página | lo que promete la bajada | el objeto |
|---|---|---|
| `/confianza` | «Tenemos un mecanismo que puedes revisar paso a paso» | la línea de tenencia |
| `/tarifas` | «Un solo número, y ese número ya lo incluye todo» | el cotizador |
| `/como-funciona` | «La web te deja listo y una persona cierra» | el chat |
| `/empresas` | el producto para empresas | el portátil |

Y contra las que no lo llevan: la bajada de `/preguntas` —«Lo que nos preguntan antes de operar, y
las palabras que usamos para responder»— no promete ningún objeto. Correcto que no tenga.

**Tres límites que la regla necesita para no volverse plantilla:**

1. **Uno por página**, como el `--elev-card` del §4.5 — y por el mismo motivo: si hay dos, ninguno
   es el objeto del que trata la página.
2. **El objeto es el producto o el mecanismo, nunca una ilustración de ellos.** Los cuatro casos
   enseñan algo real: la interfaz del cotizador, el chat con sus mensajes publicados, el recorrido
   del dinero con sus tres tenencias. Un dibujo *sobre* el tema no cuenta.
3. **Si hay que escribir copy nuevo para que la bajada prometa el objeto, la regla no se cumple.**
   Se cumple al revés: la bajada ya lo promete y la portada lo paga. Forzar la frase para justificar
   el cacharro es exactamente el fallo que la regla evita.

---

## 4. Por qué esto y no una quinta página

Porque las cuatro portadas ya existen y la regla no. Escribirla ahora cuesta un documento y se
apoya en cuatro casos con su razón; escribirla después de la sexta portada será describir una
costumbre. Y porque la alternativa honesta —seguir por planicie— me lleva a `/preguntas`, que
acabo de argumentar que no la necesita.

**No es trabajo mío integrarlo.** Es una sección del Design System, y quien la escribe es el agente
con tu visto bueno.

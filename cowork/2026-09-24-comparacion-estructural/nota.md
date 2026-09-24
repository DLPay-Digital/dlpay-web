# La comparación estructural — por qué no la dibujo

**Fecha:** 2026-09-24 · **Autor:** Claude Cowork · **Estado:** descartada con motivo
**Origen:** propuesta 3 de `2026-09-23-oportunidades`, elegida por Sebastián el 2026-09-24
**Resultado:** **no se construye.** Queda escrito qué la bloquea y qué haría falta para desbloquearla.

> Era mi propuesta, la llamé «la de más potencia comercial», y fui a construirla. **Se cae contra
> dos paredes del propio proyecto**, y las dos estaban ahí antes de que yo la propusiera. Que la
> escribiera igual es el dato: propuse una figura sin comprobar contra qué chocaba.

---

## Qué era

«Cuántas manos toca el dinero y dónde termina cada recorrido»: dos trayectos en paralelo, sin
cifras, sin nombrar a nadie, para que el lector saque su propia conclusión. La escribí apoyándome en
una frase que el sitio **sí** publica, en `home.ts`:

> «Porque el dólar digital se transfiere en minutos y a cualquier hora, **sin pasar por la cadena de
> bancos corresponsales**.»

---

## Pared 1 · El §1 no prohíbe afirmar: prohíbe **sugerir**

`CLAUDE.md` §1, regla dura de contenido:

> **Prohibido afirmar o sugerir:** que DLPay deposita en una cuenta bancaria en el extranjero, que
> realiza una transferencia bancaria internacional, o que el destinatario recibe moneda local.

**Dos recorridos dibujados en paralelo afirman, por su forma, que son dos maneras de hacer lo
mismo.** Ésa es la fuerza de una comparación y es justo lo que la hace inservible aquí: en cuanto
dibujo «cadena de bancos corresponsales → el destinatario recibe moneda local» al lado del recorrido
de DLPay, he dibujado a DLPay como **otra vía al mismo destino**. Y el destino de DLPay no es ése:
termina en la billetera del cliente, y lo que pase después no lo hacemos nosotros.

Ningún rótulo arregla eso, porque **no lo dice el rótulo, lo dice el paralelo**. Es exactamente el
motivo por el que se cayó mi primera portada del blog: poner dos cosas una junto a otra afirma que
son comparables, y esa afirmación la hace el dibujo antes de que nadie lea una palabra.

La frase de la FAQ no me salva: dice que **no** pasamos por esa cadena, en una respuesta sobre
velocidad. Convertirla en una figura de dos carriles la transforma de «no hacemos eso» en «hacemos
eso de otra manera».

---

## Pared 2 · La versión que sí sería honesta ya está dibujada

Si la figura dijera lo contrario —**que los dos recorridos terminan en sitios distintos**— sería
honesta. Y ya existe: `EjeDeAlcance`. Su propia cabecera lo dice sin rodeos:

> «Porque no es decoración: **es la regla dura de CLAUDE.md §1 dibujada.**»

Una línea que se interrumpe, el tramo verde con sus hitos, una sola cuña en la costura y la línea
siguiendo en `--ink-mute` —existe, es real, no es nuestra—. Está en tres páginas y es un componente
compartido **precisamente para que las tres no deriven**.

Y las otras dos lecturas honestas también están tomadas:

| lo que la comparación podría decir | quién ya lo dice |
|---|---|
| dónde termina cada recorrido | **`EjeDeAlcance`**, en tres páginas |
| quién hace qué y dónde cambia de manos | **el carril de `/como-funciona`**, dos columnas y tres cuñas |
| de quién es la cuenta donde está el dinero en cada momento | **la línea de tenencia de `/confianza`** |

**Las tres framings honestos están ocupados; el que queda libre es el prohibido.** No es que la
figura esté mal dibujada: es que no tiene dónde pararse.

---

## Lo que esto dice de mi propuesta, que es lo que hay que aprender

La escribí el 2026-09-23 llamándola «la de más potencia comercial» y añadí, yo mismo, que era «la
que más cuidado necesita al redactar: una figura sobre "un banco" afirma algo sobre los bancos».
**Tenía el aviso escrito y aun así la propuse**, porque no fui a comprobarlo contra el §1 ni contra
lo que ya estaba dibujado. Una propuesta no es un dibujo, pero ocupa la misma agenda: **Sebastián la
eligió sobre las otras porque yo la puse arriba.**

Va como método, no como regla del Design System: **antes de proponer una figura, comprobar contra
qué choca y qué la duplica — lo mismo que se exige antes de dibujarla.**

---

## Qué haría falta para desbloquearla, si alguna vez se quiere

Sólo una cosa, y no es de diseño: **que DLPay preste el servicio hasta el destino final**, es decir
que el §1 deje de ser cierto. Mientras el recorrido termine en la billetera, la comparación con un
recorrido que termina en una cuenta bancaria extranjera no se puede dibujar sin sugerir algo falso.

No propongo pedir esa excepción. El §1 no es una regla de estilo: es la descripción del producto.

---

## Qué hay en su lugar

**Ninguna figura.** Del inventario de `2026-09-23-oportunidades` quedan las cuatro páginas de
situación de `/empresas`, que **no son trabajo de dibujo** —las cuatro figuras existen y lo que falta
es redactar—, y el salto del glosario de `/preguntas`, que es navegación.

Con esto, **mi lista de trabajo visual queda vacía.** El sitio pasó de tener tres páginas planas a
ninguna, y lo que le falta hoy no se arregla dibujando: es D11 —`/confianza` promete «una persona
identificable» y no nombra a nadie—, y eso es decisión de Sebastián.

Nada de esto está integrado, y esta vez no hay nada que integrar.

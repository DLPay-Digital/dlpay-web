# Prompt para el agente de Claude Code — `2026-09-23-iconos`

**Fecha:** 2026-09-23 · **Autor:** Claude Cowork
**Maquetas:** `iconos.html` (`84680c2d…`) y `ubicacion.html` (`e56b10c1…`)
**Ficha:** `ficha.md` — léela entera antes de tocar nada.
**Autorizado por Sebastián el 2026-09-23**, incluida una excepción al Design System §7 que va
explicada abajo con su ventaja, como pide la regla 4 de sus instrucciones permanentes.

---

## Qué hay que hacer, en orden

1. Añadir cuatro iconos a `Icon.astro`.
2. Cambiar tres listas que ya existen para que cada ítem lleve el icono que le corresponde.
3. Dos correcciones de documentación que salen de este trabajo.

Ninguna página estrena sección y ningún componente es nuevo.

---

## 1. Los cuatro iconos

En `src/components/Icon.astro`, dentro de `paths`. No se toca el `<svg>` envolvente: mismo
`viewBox`, `stroke-width` 1.6, `stroke-linecap`/`linejoin` redondos, `aria-hidden`.

```js
documento: '<path d="M13.5 3.5H6.5A1.5 1.5 0 005 5v14a1.5 1.5 0 001.5 1.5h11a1.5 1.5 0 001.5-1.5V9z"/><path d="M13.5 3.5V9H19"/><path d="M8.5 13h5M8.5 16.5h3"/>',
empresa:   '<path d="M5 8h14a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2v-8a2 2 0 012-2z"/><path d="M9 8V6a2 2 0 012-2h2a2 2 0 012 2v2"/><path d="M10.5 13.5h3"/>',
wallet:    '<path d="M19 9V7A1.5 1.5 0 0017.5 5.5h-13A1.5 1.5 0 003 7v12a1.5 1.5 0 001.5 1.5h13A1.5 1.5 0 0019 19v-2"/><path d="M20 9h-4a3.5 3.5 0 000 7h4a1 1 0 001-1v-5a1 1 0 00-1-1z"/>',
candado:   '<path d="M5.5 10h13a1.5 1.5 0 011.5 1.5v8a1.5 1.5 0 01-1.5 1.5h-13A1.5 1.5 0 014 19.5v-8A1.5 1.5 0 015.5 10z"/><path d="M8 10V7a4 4 0 018 0v3"/><path d="M12 14.5v2.5"/>',
```

**La unión de `Props['name']`** pasa a incluir los cuatro. Ojo: **esa misma unión está repetida a
mano en `src/components/ui/IconBadge.astro`**. Exportarla desde `Icon.astro` e importarla en
`IconBadge` es lo correcto y es lo que hicimos con `volumeTerms`, pero es tu decisión.

Los cuatro están medidos —caja útil, largo de trazo y grosor renderizado a 16/20/22/24— en la ficha
§3. **Si cambias un trazado, vuelve a medir**: el equilibrio del set se ajustó a mano y `empresa`
bajó de 86,9 a 71,9 de trazo precisamente para no pasar a `bank`.

---

## 2. Dónde se colocan

### 2.a Las dos listas «Ten esto a mano»

| página | fuente | hoy | pasa a ser |
|---|---|---|---|
| `/como-funciona` | `content/process.ts → checklist` | 3 ticks idénticos | `documento` · `bank` · `wallet` |
| `/empresas` | `content/business.ts → checklist` | 3 ticks idénticos | `documento` · `bank` · `wallet` |

Las dos son **arrays de strings**, así que el icono no puede salir del dato como sale en
`mechanisms`. O el array pasa a ser de objetos `{ icon, text }`, o la página decide por índice.
**Lo primero es lo correcto** —es lo que ya hacen `trust.ts` y `home.ts`— y además deja el icono
junto al texto al que pertenece, que es lo que evita que se desincronicen si alguien reordena la
lista. Decides tú, pero si eliges el índice, escribe por qué.

El `<svg class="tick">` en línea desaparece de las dos páginas y lo sustituye `<Icon>`. El estilo
`.tick` de hoy es `17px`, `--verde-deep`, `margin-top: 3px`; en la maqueta el icono va a **19px** y
`margin-top: 2px`, que es lo que alinea su caja con la altura de x. Compruébalo sobre el build.

### 2.b `/confianza` → «Qué te pedimos, y por qué»

`content/trust.ts → requirements` es `{ title, body }[]` y no tiene icono. Pasa a `documento`,
`empresa`, `bank`, en ese orden, que es el que ya tiene.

**Va `Icon` suelto, NO `IconBadge`.** Justo encima, en la misma página, «Qué pasa con tu plata» ya
usa insignias. Repetirlas aquí deja la página en una pared de pastillas y borra una distinción que
sí existe: **insignia = lo que hacemos nosotros; icono suelto = lo que traes tú.**

### 2.c Lo que NO se toca

- **La figura de `phases`** en `/confianza` —las tres barras con el tramo verde—. Es una figura del
  §6.2; un icono al lado competiría con marcas que ya significan algo.
- **Los cinco iconos que ya existen.** `bank` se sigue usando tal cual. Sebastián lo confirmó: el
  alcance es cambiar los ticks, no redibujar el set viejo.
- **El glosario de `/preguntas`.** Ocho definiciones con ocho iconos sería decoración: el término ya
  está escrito al lado.

---

## 3. La excepción autorizada, y por qué no es un cheque en blanco

**Regla:** Design System §7 — *«Set pequeño y funcional… Nada más hasta que una necesidad lo
pida.»*

**La excepción:** `candado` entra a `Icon.astro` **sin que ninguna página lo use**.

**Autorizada por Sebastián el 2026-09-23**, para cerrar los ocho iconos que el propio §7 nombró y
que el set quede completo de una vez.

**La ventaja, que es lo que la regla 4 exige escribir:** ya está dibujado y medido con el resto del
lote, así que tenerlo no cuesta nada; y el día que exista la frase que lo pida no hay que abrir otra
ronda de dibujo, medición y revisión sólo por un icono.

**Y el límite, que importa tanto como la excepción.** `candado` **no se coloca en ninguna página.**
Busqué «cifrado», «encriptado», «seguridad», «protección» y «resguardo» en todo `content/` y en
todas las páginas: **el sitio no afirma nada sobre cifrado.** Un candado junto a un texto que no
reclama seguridad afirma por su cuenta «esto está cifrado», y eso es un claim que firma Compliance,
no un icono — justo lo contrario de lo que promete `/confianza`. La excepción es «entra al
componente», no «se usa».

---

## 4. La objeción que te vas a hacer, y mi respuesta

**«Quitar el ✓ de una lista titulada *Ten esto a mano* le quita el sentido de checklist.»**

Es una objeción buena y me la hice. Mi respuesta: **ese ✓ no es un checkbox** —no se marca nada,
no hay estado— sino una marca decorativa que toma prestado el aspecto de un checklist. Tres marcas
idénticas que sólo dicen «esto es un ítem» es exactamente lo que el §6 llama trazo que no dice nada.
El sentido de checklist lo lleva el titular, con palabras.

Si aun así crees que se pierde algo, dilo antes de integrarlo y lo medimos; no lo resuelvas a ojo
en una dirección u otra.

---

## 5. Dos correcciones de documentación

**a) `people` no está en la lista del §7.** El §7 nombra ocho iconos y `people` no es ninguno, pero
se usa en `content/home.ts` y `content/trust.ts`. Con esta entrega el set queda en **nueve**: los
ocho del §7 más `people`. Hay que reconciliar la lista del §7.

**b) `IconBadge.astro` documenta 3,82:1 y el número real es 4,60:1.** Recalculado sobre los valores
de hoy —`--verde-deep` al 12 % sobre `--papel`—; el 3,82 corresponde a una pastilla al **24 %**, así
que en algún momento la pastilla se aclaró y la nota se quedó con la cifra vieja. El contraste real
es **mejor** que el documentado, así que no hay nada roto; pero esa cabecera dice «No cambiar sin
recalcular» y lleva el número de antes.

Mi calculador está calibrado contra tres cifras del propio proyecto —`--verde-deep` sobre `--papel`
**5,44**, `--verde` sobre `--papel` **2,02**, `--ink-mute` sobre `--papel` **5,50**— y las tres
salen exactas. Aun así, **compruébalo tú antes de escribir un número nuevo en el archivo.**

---

## 6. Qué comprobar antes de dar por buena la integración

1. Los nueve iconos renderizan a 16, 20, 22 y 24 con grosor 1,067 / 1,333 / 1,467 / 1,6 px.
2. Las dos listas «Ten esto a mano» y los tres requisitos de `/confianza` muestran el icono que les
   toca, y el icono sigue al texto si alguien reordena el array.
3. Ningún icono queda anunciado por un lector de pantalla: todos siguen con `aria-hidden`, y el
   texto que llevan al lado es texto de verdad.
4. Sin scroll horizontal a 320, 390 y 1280.
5. `candado` está en el componente y **no aparece en ninguna página**.

---

## 7. Lo de siempre

`cowork/` no toca `src/`. Las maquetas son sólo visualización: los trazados y las ubicaciones son
el entregable, y quien los traslada eres tú.

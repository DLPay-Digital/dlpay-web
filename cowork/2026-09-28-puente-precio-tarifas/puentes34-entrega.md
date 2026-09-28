# Entrega · puentes 3 y 4 — dónde están los archivos y en qué orden leerlos

**Fecha:** 2026-09-28 · **Autor:** Claude Cowork
**Aprobado por Sebastián.** Los dos puentes están listos para integrar.

---

## 0. Primero: por qué no encontraste los archivos, y qué cambia desde hoy

**Sí llegaron.** Estaban en `Claude outputs/`, que es donde han caído todas mis entregas desde
siempre — carpeta plana y en el `.gitignore`. Lo que falló fue **el nombre**: le puse `ficha.md` y
`prompt-agente.md` a tres entregas del mismo día, el sistema los renombró `-1`, `-2` y `-3` al
chocar, y mis prompts decían «lee `ficha.md`», que en esa carpeta es la ficha de **otro** puente.

Empecé a organizar cada entrega en una carpeta **de mi lado** y dejé que los nombres se volvieran
genéricos porque la carpeta ya los distinguía. Esa carpeta no existe en tu máquina. Error mío, y
entiendo que buscaras `cowork/2026-09-28-…/`: era la única forma de que «ficha.md» significara algo.

**Convención desde hoy, y te pido que la escribas en `cowork/README.md` §3** para que valga para los
dos lados y sobreviva a mi contexto:

> **Todo archivo que Cowork deja en `Claude outputs/` lleva por delante el nombre de su entrega.**
> `puente4-ficha.md`, no `ficha.md`. La carpeta es plana y compartida por todas las entregas: un
> nombre genérico se renombra solo al chocar y deja los prompts apuntando al archivo equivocado.
> Los prompts citan el nombre completo del archivo, nunca «la ficha» a secas.

Los quince archivos de los puentes 3 y 4 ya están ahí, renombrados y con sus referencias internas
corregidas. Y uno que de verdad faltaba: **la ficha del puente 3 nunca se la mandé a Sebastián** —
la escribí y no la incluí en el envío. Ya está.

---

## 1. Qué hay en `Claude outputs/`

**Puente 3 · `/precio` → `/tarifas`**

| archivo | qué es |
|---|---|
| `puente3-prompt-agente.md` | **empieza por acá** |
| `puente3-ficha.md` | el razonamiento y lo descartado |
| `puente3-maqueta.html` | md5 `3cfd2388d1e3e5f7ae4a265995b7ffec` |
| `puente3-1280.png` · `puente3-390.png` | la pieza sola |
| `puente3-en-precio-1280.png` | montada en su sitio |
| `puente3-origen-el-monto.png` | la figura de origen, para cotejar |

**Puente 4 · `/como-funciona` → el artículo de activos tokenizados**

| archivo | qué es |
|---|---|
| `puente4-correcciones.md` | **empieza por acá, antes que el prompt** |
| `puente4-prompt-agente.md` | ya rectificado con lo de arriba |
| `puente4-ficha.md` | el razonamiento y lo descartado |
| `puente4-maqueta.html` | md5 **`c898096ef9b8dd229993e7f420447d35`** — el `cd7a23f8…` que citaba el primer prompt queda anulado |
| `puente4-1280.png` · `puente4-390.png` | la pieza sola |
| `puente4-en-como-funciona-1280.png` | montada en su sitio |
| `puente4-origen-riel.png` | la figura de origen, para cotejar |

---

## 2. Tus dos objeciones al puente 4: las dos eran correctas

Están conceded­as y medidas en `puente4-correcciones.md`. En corto:

1. **«`/tarifas` es la única página sin `Motion.astro`»** era falso. Son **cinco**: `/tarifas`,
   `/terminos`, `/privacidad`, `/canal-de-denuncias` y la 404. La frase que va al documento es la
   tuya: «la única página **con un puente** que no lo carga».
2. **«Una columna de 556»** era falso: son **460 px a 1280 y 384 a 960**. Mi 556 era
   `--container ÷ 2` con el relleno y el `gap` olvidados.

**Y al comprobar la segunda apareció un tercer fallo, peor y mío:** `justify-self: end` **no movía el
dibujo, lo encogía** — la celda se ajusta al contenido y un `<svg>` con `width:100%` no tiene ancho
intrínseco, así que colapsaba a 300 px. Mis «136–212» eran 160 px de encogimiento disfrazados de
holgura. La maqueta corregida usa `margin-inline-start: auto` y un tope de **360 px**, que es el
primer valor que pasa el piso de 40 en los dos extremos (**63 a 960, 139 de 1280 en adelante**).

---

## 3. Lo que hay que integrar

**Puente 3** — en `/precio`, entre `.tres` y `.close`. Las dos son secciones de primer nivel: **no
hay que partir nada**. Figura nueva sugerida: `FiguraMonto.astro`.

**Puente 4** — en `/como-funciona`, entre `.scope` y `.close`. Igual, sin partir nada. Figura nueva
sugerida: `FiguraRiel.astro`.

Los dos usan `Puente.astro` tal cual. Cada prompt trae su tabla de invariantes con número.

---

## 4. Lo que le toca al Design System §4.7

Con los cuatro puentes medidos con el instrumento corregido, **el rango de la familia es 61–139 por
la figura y 97–205 por el texto**. Hoy el §4.7 dice «60 a 82». Y propongo dos frases más, que son las
que me habrían ahorrado el fallo:

1. **La holgura se mide por la tinta, no por la celda.** La celda de la figura del puente 4 mide 39
   px donde la tinta mide 63.
2. **El corte baja hacia la izquierda, así que manda la esquina SUPERIOR de la figura y la INFERIOR
   del texto.**

---

## 5. Lo que necesita la firma de Sebastián como Compliance

- **Puente 3:** «Las condiciones se acuerdan contigo» era una **cláusula dentro de un párrafo** de
  `/tarifas` y en el puente es titular. Subir una frase a titular le cambia el peso — el mismo aviso
  que se le hizo con la cadena 7 de `/tarifas`. El resto son literales.
- **Puente 4:** una sola cadena nueva, **«Leer el artículo»**, la etiqueta del botón. El titular
  —«El peso no está tokenizado; el dólar digital sí»— **ya lo firmó el 2026-09-22** junto con la
  figura, y lleva su marcador en el `.md` del artículo.

---

## 6. Y lo de siempre

Mis medidas salen de mi build. **Comprueba contra el de hoy** las cifras de los §5 de cada prompt
antes de integrar, y si alguna dejó de salir, para y dilo: la posición de cada puente se eligió con
esos números.

# Ficha — portada de dato y título debajo

**Entrega:** `2026-09-16-blog-portada-de-dato` · **Autor:** Claude Cowork · **Estado:** En revisión
**Vista:** `index.html` · **Capturas:** `articulo-1280.png`, `portada-cifra.png`, `articulo-390.png`
**Sustituye** la parte del artículo de `2026-09-16-blog-sin-portada`. **El listado de esa entrega
se mantiene tal cual**: la portada pertenece al artículo, no al índice.

---

## 1. La estructura

| | Antes | Ahora |
|---|---|---|
| | Banda en tinta **con el titular dentro** | **Portada arriba**, y debajo categoría, fecha, titular y bajada sobre papel |
| Portada | Ninguna | Una figura de dato, propia del artículo |

El titular debajo lo pidió Sebastián y es mejor: con el titular dentro de la banda el artículo se
leía como una sección de landing, y un titular largo cambiaba el alto de la portada en cada
artículo. Separados, el artículo se comporta como un documento.

## 2. Por qué no foto de stock — queda registrado

Se evaluó y se descartó (2026-09-16). Cuatro razones:

1. **Es el mismo fallo que ya se rechazó en `/empresas`**: una imagen que «forzadamente quiere
   indicar lo mismo». Un fajo de billetes sobre un artículo del FOMC no dice nada del artículo.
2. **`CLAUDE.md` Principio 3** prohíbe «hero y dashboards genéricos, iconos e ilustraciones de
   stock, estética SaaS intercambiable». El stock es, por definición, identidad compartida.
3. **Licencia.** Unsplash y Pexels permiten uso comercial sin atribución, pero **no entregan
   liberación de modelo ni de propiedad**: con una persona identificable, una marca o un edificio
   reconocible, responde quien publica. Para una empresa financiera eso obliga a revisar la
   licencia de cada imagen, en cada artículo, para siempre.
4. **Registro.** El sitio es una mesa de operaciones; una foto decorativa es el registro de un blog
   de estilo de vida.

## 3. La regla que ordena todo esto

> **La cuña no entra en las portadas.**

La cuña es la marca del **valor moviéndose** (ADR-0001 §3, DS §6) y es la misma que dibuja pesos
cruzando una frontera en `/empresas`. Una portada muestra **un dato**, no un movimiento. En cuanto
una portada usa esa marca, afirma un flujo — y entre dos cosas que no se mueven una hacia la otra,
eso es una afirmación causal.

### Lo que esta regla retiró

La primera versión de esta entrega traía un tercer tipo, `propagacion`: dos marcadores rotulados
**FOMC** y **CLP** unidos por un tramo con cuña. **Lo detectó Sebastián y tiene razón.** Con la
gramática del sitio, ese dibujo dice que algo de valor va de la Fed al peso chileno, que es una
relación causal justo en el artículo que se cuida de escribir «sin pronósticos» y «no pronostica ni
recomienda operar». La portada contradecía al texto.

Yo lo tomé del bloque `PENDIENTE DE ASSET` del borrador de la Fed, que pide «un chevron intermedio
indica sentido del flujo», y lo di por bueno porque estaba escrito. **Estar escrito no lo hace
correcto**, y ese bloque está en un borrador sin aprobar, no en una decisión cerrada.

## 4. Los dos tipos de portada

| Tipo | Qué dibuja | Para qué artículo |
|---|---|---|
| `cifra` | Una cifra grande y tabular, con su etiqueta, su fecha y su fuente | El artículo se apoya en un dato puntual |
| `rango` | Dos cifras y el intervalo entre ellas, **sin dirección ni flecha** | Un intervalo: el rango del dólar en un período, o la tasa objetivo de la Fed — que es literalmente un rango |

El artículo de la Fed cae en `rango` y con eso la portada pasa a ser **el dato del que habla el
artículo**, sin afirmar ningún vínculo. Las cifras de la vista son las de julio, verificadas dentro
del propio borrador; se reemplazan por las de septiembre cuando el artículo se cierre.

### Forma en el frontmatter

```yaml
portada:
  tipo: rango                # 'cifra' | 'rango'
  etiqueta: 'Tasa de fondos federales'
  min: 3.50
  max: 3.75
  unidad: '%'
  fecha: 2026-07-29
  fuente: 'comunicado del FOMC'
```

```yaml
portada:
  tipo: cifra
  etiqueta: 'Dólar observado'
  valor: 940.91
  unidad: 'CLP'
  fecha: 2026-09-14
  fuente: 'Banco Central de Chile'
```

**Dos reglas que propongo cerrar en el esquema:**

1. **`portada` es opcional.** Un artículo sin portada arranca por el titular y la página funciona.
   No todo artículo de categoría DLPay tiene un dato que mostrar.
2. **`fuente` es obligatoria en cuanto hay una cifra.** Ninguna figura publica un número sin decir
   de dónde salió. Mismo criterio que `lib/config/alliances.ts`, donde el dato declara el alcance
   de su propio claim. Las cifras de la portada son contenido de mercado: las aprueba Compliance
   junto con el texto, no ingeniería.

## 5. Dos cosas ya escritas que esto enmienda

1. **El `PENDIENTE DE ASSET` del borrador de la Fed queda obsoleto entero**: pedía un PNG de
   1200×630 con un diagrama de propagación sobre fondo papel. Ni el diagrama (§3) ni el archivo
   (§6) sobreviven. Conviene reescribir ese bloque en el borrador para que nadie lo ejecute.
2. **La paleta.** Ese bloque especificaba fondo `--papel` con trazos en `--tinta` y `--verde-deep`.
   Propongo **banda en tinta** con la cifra en `--on-tinta` y el intervalo en `--verde`. El motivo
   es que la especificación asumía un PNG suelto sobre página clara: como banda a sangre, papel
   sobre papel no se lee como portada. Y sobre tinta `--verde` rinde **8,45:1**, así que puede
   llevar el trazo sin recurrir a `--verde-deep`, que existe justamente porque el verde de marca no
   alcanza sobre claro.

## 6. Sobre la imagen de Open Graph

La portada es SVG en la página, no un archivo. `og-image.png` sigue siendo **global** y no cambia.
Una portada por artículo para redes exigiría rasterizar en el build —dependencia nueva y el
cuestionario del §8—, así que queda fuera de esta entrega.

## 7. Medido

Desborde horizontal **0** a 390 y a 1280. La banda mide 230 px en escritorio y 176 en móvil: ancha
y corta, como una portada, no como un héroe.

| Par | Ratio |
|---|---|
| `--on-tinta` sobre tinta (cifras, rótulos) | 16,44:1 |
| `--on-tinta-mute` sobre tinta (etiqueta, fecha, fuente) | 8,18:1 |
| `--verde` sobre tinta (el intervalo) | 8,45:1 |
| `--ink` sobre papel (titular) | 16,00:1 |
| `--verde-deep` sobre papel (categoría) | 4,90:1 |

Cero JavaScript, cero imágenes, cero tokens nuevos. **Ningún movimiento en la portada:** un dato no
entra animado (Motion System §4, regla dura 3).

## 8. Para el traslado

1. El componente nuevo lee `portada` del frontmatter y dibuja el SVG. Mismo patrón que
   `BusinessEmblem`: un `tipo` tipado y un bloque por tipo.
2. `content.config.ts` gana `portada` como objeto opcional con `tipo` en `z.enum`, igual que
   `category`: un valor fuera de la lista rompe el build.
3. Las cifras se formatean con `lib/pricing/format.ts`, que ya sabe el formato chileno. No se
   escriben a mano con separadores en el frontmatter.
4. `aria-hidden` en el SVG, y que la cifra y su fuente estén también en el texto del artículo si
   son parte del argumento: una portada no puede ser el único sitio donde vive un dato.
5. El artículo pierde el bloque `cover-wrap`; la cabecera pasa a papel, bajo la banda.

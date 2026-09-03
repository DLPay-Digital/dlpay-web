# Desarrollo — puesta en marcha

> Estado: el proyecto está en **Fase 3 (arquitectura)**. Los ADRs están cerrados; el esqueleto de
> la aplicación todavía no se ha creado porque falta el prerrequisito de abajo.

## Prerrequisito: Node.js

La máquina de desarrollo **no tiene Node.js instalado** (verificado 2026-09-03: `node`, `npm`,
`npx`, `pnpm`, `bun` y `deno` no están disponibles; tampoco Homebrew ni un gestor de versiones).

Astro lo necesita (ADR-0002). Es además la causa de que el **MCP de Playwright no conecte**:
falla buscando `npx` en el `$PATH`. Instalar Node resuelve las dos cosas.

**Versión:** la **LTS activa** de Node.

**Cómo instalarlo** — cualquiera de estas opciones sirve; la primera es la más simple:

1. **Instalador oficial** — descargar el `.pkg` de macOS desde <https://nodejs.org> (elegir LTS) y
   ejecutarlo. Instala `node` y `npm` en `/usr/local/bin`, que ya está en el `$PATH`.

2. **Homebrew** — si prefieres gestor de paquetes (Homebrew tampoco está instalado hoy):
   ```
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   brew install node
   ```

3. **fnm** — si quieres poder cambiar de versión de Node por proyecto:
   ```
   brew install fnm      # requiere Homebrew
   fnm install --lts && fnm use --lts
   ```

Después de instalar, **abrir una terminal nueva** y comprobar:
```
node --version && npm --version
```

## Cuando Node esté disponible

El esqueleto se crea con Astro + TypeScript en modo estricto, sin plantilla de terceros y sin
dependencias más allá de Astro (ADR-0002 y ADR-0004: cero dependencias de estilo).

Estructura prevista — **cada carpeta se crea cuando una necesidad real la pide**, no antes:

```
dlpay-web/
├── src/
│   ├── pages/          # una ruta por página de la AI v1 (Fase 2.5 §9)
│   ├── layouts/
│   ├── components/     # componentes propios; el cotizador es la única isla
│   ├── styles/         # tokens.css — espejo del Design System V1
│   ├── content/        # datos estructurados tipados (FAQ, pasos, footer)
│   └── lib/
│       ├── pricing/    # PriceSource, ConfigPriceSource, tipo Quote
│       └── config/     # constantes de negocio y enlaces a la plataforma de Guita
├── public/             # assets estáticos (favicon, og-image, fuentes auto-hospedadas)
├── docs/
└── .env.example
```

## Comandos (una vez creado el esqueleto)

| Comando | Qué hace |
|---|---|
| `npm install` | Instala dependencias |
| `npm run dev` | Servidor de desarrollo en `http://localhost:4321` |
| `npm run build` | Genera el sitio estático en `dist/` |
| `npm run preview` | Sirve `dist/` localmente, como en producción |

`build` verde **no** equivale a "terminado" (`CLAUDE.md` §9).

## Variables de entorno

Copiar `.env.example` a `.env` y ajustar. `.env` nunca se versiona.
Toda variable `PUBLIC_` queda expuesta en el navegador: **lo que se prefija es público**.
Hoy no hay ningún secreto en el proyecto — todas las variables son configuración pública.

## Despliegue

No hay despliegue todavía, y es deliberado: el proveedor está diferido (ADR-0005). El desarrollo
avanza en local durante toda la Fase 4. Producción sigue congelada hasta Fase 6.

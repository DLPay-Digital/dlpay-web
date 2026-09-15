#!/usr/bin/env python3
"""
build-worldmap.py — Regenera datos cartográficos para GloboRotativo.astro
                    desde Natural Earth 110m.

Ámbito: solo se ejecuta cuando cambien destinos, tolerancia de simplificación,
o cuando actualicemos la versión de Natural Earth. NO se corre en cada build.

Dependencias:
    - shapely (dev-only, no dependencia runtime del proyecto)
      pip install shapely

Preparación:
    Bajar Natural Earth 110m a scripts/data/raw/ (gitignored):
    - https://www.naturalearthdata.com/http//www.naturalearthdata.com/download/110m/cultural/ne_110m_admin_0_countries.zip
    - https://www.naturalearthdata.com/http//www.naturalearthdata.com/download/110m/physical/ne_110m_land.zip

    Descomprimir y convertir shapefiles a GeoJSON (con ogr2ogr o similar):
    - ne_110m_admin_0_countries.geojson
    - ne_110m_land.geojson

Uso:
    python3 scripts/build-worldmap.py > /tmp/worldmap-block.js

    Después: abrir src/components/hero/GloboRotativo.astro y reemplazar
    el bloque entre los marcadores:
        // AUTO: worldmap-data start
        ... (contenido regenerado)
        // AUTO: worldmap-data end

Referencias formales: ADR-0002, cero-js-e1.
"""

import json
import sys
from pathlib import Path
from shapely.geometry import shape, mapping

RAW_DIR = Path(__file__).parent / "data" / "raw"

# Tolerancia de simplificación (grados). Valores actuales calibrados para escala
# globo de 420 px de diámetro. Aumentar reduce peso; disminuir mejora detalle.
LAND_TOLERANCE = 0.45      # ~50 km — costa suave pero legible
CHILE_TOLERANCE = 0.10     # ~11 km — mayor detalle para el highlight verde
BORDERS_TOLERANCE = 0.70   # ~78 km — bordes de países legibles a escala globo

# Precisión decimal (1 decimal = ~11 km, suficiente para escala globo).
COORD_PRECISION = 1

# Países con bordes visibles. Balance entre orientación geográfica y peso.
# Agregar/quitar según qué zonas se quieran anclar visualmente.
BORDERS_COUNTRIES = {
    "United States of America", "Canada", "Mexico",
    "Brazil", "Argentina", "Russia", "China", "India",
    "Australia", "France", "Spain", "Germany", "Italy",
    "Japan", "South Africa",
}


def flat_ring(ring, prec=COORD_PRECISION):
    """Aplana [[lon, lat], ...] a [lon1, lat1, lon2, lat2, ...] con precisión reducida."""
    out = []
    for pt in ring:
        out.append(round(pt[0], prec))
        out.append(round(pt[1], prec))
    return out


def geom_to_multipoly(geom_dict):
    """Convierte Polygon o MultiPolygon a formato compacto de anillos aplanados."""
    if geom_dict["type"] == "Polygon":
        return [[flat_ring(r) for r in geom_dict["coordinates"]]]
    if geom_dict["type"] == "MultiPolygon":
        return [[flat_ring(r) for r in poly] for poly in geom_dict["coordinates"]]
    return []


def main():
    countries_path = RAW_DIR / "ne_110m_admin_0_countries.geojson"
    land_path = RAW_DIR / "ne_110m_land.geojson"

    if not countries_path.exists() or not land_path.exists():
        print(
            f"ERROR: falta data raw. Bajar Natural Earth 110m a {RAW_DIR}",
            file=sys.stderr,
        )
        sys.exit(1)

    countries = json.load(open(countries_path))
    land = json.load(open(land_path))

    # Chile con tolerancia fina — es el highlight verde del globo
    chile_feat = next(
        (f for f in countries["features"] if f["properties"].get("ADMIN") == "Chile"),
        None,
    )
    if chile_feat is None:
        print("ERROR: no encontré Chile en el dataset de países", file=sys.stderr)
        sys.exit(1)

    chile_data = geom_to_multipoly(
        mapping(
            shape(chile_feat["geometry"]).simplify(
                CHILE_TOLERANCE, preserve_topology=True
            )
        )
    )

    # Tierra global — continentes completos
    land_data = []
    for f in land["features"]:
        simplified = shape(f["geometry"]).simplify(
            LAND_TOLERANCE, preserve_topology=True
        )
        land_data.extend(geom_to_multipoly(mapping(simplified)))

    # Bordes de países principales
    borders_data = []
    for f in countries["features"]:
        if f["properties"].get("ADMIN") in BORDERS_COUNTRIES:
            simplified = shape(f["geometry"]).simplify(
                BORDERS_TOLERANCE, preserve_topology=True
            )
            borders_data.extend(geom_to_multipoly(mapping(simplified)))

    # Emitir bloque JS listo para pegar entre los marcadores AUTO
    land_json = json.dumps(land_data, separators=(",", ":"))
    chile_json = json.dumps(chile_data, separators=(",", ":"))
    borders_json = json.dumps(borders_data, separators=(",", ":"))

    print("  // AUTO: worldmap-data start (regenerado por scripts/build-worldmap.py)")
    print(f"  const LAND={land_json};")
    print(f"  const CHILE={chile_json};")
    print(f"  const BORDERS={borders_json};")
    print("  // AUTO: worldmap-data end")

    # Reporte de peso a stderr (no interfiere con el pipe stdout)
    total_kb = (len(land_json) + len(chile_json) + len(borders_json)) / 1024
    print(
        f"\n[build-worldmap] LAND: {len(land_json)/1024:.1f} KB · "
        f"CHILE: {len(chile_json)/1024:.2f} KB · "
        f"BORDERS: {len(borders_json)/1024:.1f} KB · "
        f"TOTAL: {total_kb:.1f} KB",
        file=sys.stderr,
    )


if __name__ == "__main__":
    main()

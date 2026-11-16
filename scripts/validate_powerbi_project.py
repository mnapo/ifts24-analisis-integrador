#!/usr/bin/env python3
"""Static validation of the World Bank dataset and semantic model."""
from __future__ import annotations

import csv
from decimal import Decimal
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CSV_PATH = ROOT / "public/data/indicadores-banco-mundial.csv"
POWERBI = ROOT / "powerbi"
MODEL = POWERBI / "Finanzas.SemanticModel/definition"
REPORT = POWERBI / "Finanzas.Report/definition"

EXPECTED = {
    ("ARG", "IT.NET.USER.ZS"): Decimal("89.667"),
    ("BRA", "IT.NET.USER.ZS"): Decimal("84.463"),
    ("CHL", "IT.NET.USER.ZS"): Decimal("95.590"),
    ("URY", "IT.NET.USER.ZS"): Decimal("91.991"),
    ("ARG", "IQ.SPI.OVRL"): Decimal("80.391"),
    ("BRA", "IQ.SPI.OVRL"): Decimal("82.308"),
    ("CHL", "IQ.SPI.OVRL"): Decimal("89.379"),
    ("URY", "IQ.SPI.OVRL"): Decimal("80.147"),
}
MAPPINGS = {
    "country_code": "CodigoPais",
    "country": "Pais",
    "indicator_code": "CodigoIndicador",
    "indicator_name": "Indicador",
    "year": "Año",
    "value": "Valor",
    "unit": "Unidad",
    "source": "Fuente",
}


def check(condition: bool, message: str) -> None:
    if not condition:
        raise SystemExit(f"FAIL: {message}")
    print(f"OK: {message}")


def main() -> None:
    check((POWERBI / "Finanzas.pbip").is_file(), "PBIP entrypoint exists")
    check((MODEL / "model.tmdl").is_file(), "semantic model definition exists")
    fact_path = MODEL / "tables/FactIndicadores.tmdl"
    country_path = MODEL / "tables/Paises.tmdl"
    indicator_path = MODEL / "tables/Indicadores.tmdl"
    check(fact_path.is_file(), "fact table exists")
    check(country_path.is_file(), "country dimension exists")
    check(indicator_path.is_file(), "indicator dimension exists")
    check((MODEL / "relationships.tmdl").is_file(), "relationships exist")
    check((REPORT / "pages/pages.json").is_file(), "report pages metadata exists")
    check((REPORT / "pages/portada/page.json").is_file(), "cover page exists")
    check((REPORT / "pages/resumen/page.json").is_file(), "analysis page exists")

    fact = fact_path.read_text(encoding="utf-8")
    countries = country_path.read_text(encoding="utf-8")
    indicators = indicator_path.read_text(encoding="utf-8")
    relationships = (MODEL / "relationships.tmdl").read_text(encoding="utf-8")

    for measure in ("Valor del Indicador", "Promedio Regional", "Brecha vs. Promedio",
                    "Ranking País", "Países Analizados", "Indicadores Analizados"):
        check(f"measure '{measure}'" in fact, f"DAX measure: {measure}")

    for source, target in MAPPINGS.items():
        check(f"sourceColumn: {source}" in fact, f"fact mapping {source} -> {target}")
    for source in ("country_code", "country"):
        check(f"sourceColumn: {source}" in countries, f"country dimension mapping: {source}")
    for source in ("indicator_code", "indicator_name", "unit"):
        check(f"sourceColumn: {source}" in indicators, f"indicator dimension mapping: {source}")

    check("FactIndicadores.CodigoPais" in relationships and "Paises.CodigoPais" in relationships,
          "country relationship keys match")
    check("FactIndicadores.CodigoIndicador" in relationships and "Indicadores.CodigoIndicador" in relationships,
          "indicator relationship keys match")
    check("ValidRows = Table.SelectRows" in fact and "[value] >= 0 and [value] <= 100" in fact,
          "fact query filters invalid records")
    check("Table.Distinct(CleanText)" in countries and "Table.Distinct(CleanText)" in indicators,
          "dimension queries normalize and deduplicate rows")

    with CSV_PATH.open(encoding="utf-8-sig", newline="") as stream:
        reader = csv.DictReader(stream)
        check(reader.fieldnames == list(MAPPINGS), "CSV fields match the model mapping")
        rows = list(reader)

    check(len(rows) == 8, "8 dataset observations")
    keys = [(r["country_code"], r["indicator_code"], r["year"]) for r in rows]
    check(len(keys) == len(set(keys)), "country-indicator-year keys are unique")
    check({r["country_code"] for r in rows} == {"ARG", "BRA", "CHL", "URY"}, "four countries present")
    check({r["indicator_code"] for r in rows} == {"IT.NET.USER.ZS", "IQ.SPI.OVRL"}, "two indicators present")
    check({r["year"] for r in rows} == {"2024"}, "reference year is 2024")

    observed = {}
    for row in rows:
        value = Decimal(row["value"])
        check(Decimal("0") <= value <= Decimal("100"), f"value range valid: {row['country_code']} / {row['indicator_code']}")
        observed[(row["country_code"], row["indicator_code"])] = value
    check(observed == EXPECTED, "values match the documented 2024 snapshot")

    print("\nStatic validation passed.")
    print("Power BI Desktop refresh, report interaction and PBIX generation remain manual checks.")


if __name__ == "__main__":
    main()

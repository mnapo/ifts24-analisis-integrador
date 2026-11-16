#!/usr/bin/env python3
"""Static validation for the World Bank dataset and PBIP/TMDL source."""
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


def check(condition: bool, message: str) -> None:
    if not condition:
        raise SystemExit(f"FAIL: {message}")
    print(f"OK: {message}")


def main() -> None:
    check((POWERBI / "Finanzas.pbip").is_file(), "PBIP entrypoint exists")
    check((MODEL / "model.tmdl").is_file(), "semantic model definition exists")
    check((MODEL / "relationships.tmdl").is_file(), "relationships definition exists")
    check((MODEL / "tables/FactIndicadores.tmdl").is_file(), "fact table definition exists")
    check((MODEL / "tables/Paises.tmdl").is_file(), "country dimension exists")
    check((MODEL / "tables/Indicadores.tmdl").is_file(), "indicator dimension exists")
    check((REPORT / "pages/pages.json").is_file(), "report pages metadata exists")
    check((REPORT / "pages/portada/page.json").is_file(), "cover page metadata exists")
    check((REPORT / "pages/resumen/page.json").is_file(), "analysis page metadata exists")

    fact = (MODEL / "tables/FactIndicadores.tmdl").read_text(encoding="utf-8")
    for measure in (
        "Valor del Indicador", "Promedio Regional", "Brecha vs. Promedio",
        "Ranking País", "Países Analizados", "Indicadores Analizados",
    ):
        check(f"measure '{measure}'" in fact, f"DAX measure declared: {measure}")

    with CSV_PATH.open(encoding="utf-8-sig", newline="") as stream:
        reader = csv.DictReader(stream)
        columns = [
            "country_code", "country", "indicator_code", "indicator_name",
            "year", "value", "unit", "source",
        ]
        check(reader.fieldnames == columns, "CSV schema matches the model")
        rows = list(reader)

    check(len(rows) == 8, "CSV contains 8 observations")
    keys = [(r["country_code"], r["indicator_code"], r["year"]) for r in rows]
    check(len(keys) == len(set(keys)), "country-indicator-year keys are unique")
    check({r["country_code"] for r in rows} == {"ARG", "BRA", "CHL", "URY"}, "four expected countries are present")
    check({r["indicator_code"] for r in rows} == {"IT.NET.USER.ZS", "IQ.SPI.OVRL"}, "two expected indicators are present")
    check({r["year"] for r in rows} == {"2024"}, "all observations refer to 2024")

    observed = {}
    for row in rows:
        value = Decimal(row["value"])
        check(Decimal("0") <= value <= Decimal("100"), f"value range valid for {row['country_code']} / {row['indicator_code']}")
        observed[(row["country_code"], row["indicator_code"])] = value
    check(observed == EXPECTED, "all values match the documented World Bank 2024 snapshot")

    print("\nStatic validation passed.")
    print("Power BI Desktop refresh, visual behavior and PBIX generation remain manual validation steps.")


if __name__ == "__main__":
    main()

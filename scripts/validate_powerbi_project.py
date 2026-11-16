#!/usr/bin/env python3
"""Static validation for the synthetic Latin America indicators PBIP project."""
import csv
from decimal import Decimal
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
POWERBI = ROOT / "powerbi"
MODEL = POWERBI / "IndicadoresLatam.SemanticModel/definition"
REPORT = POWERBI / "IndicadoresLatam.Report/definition"
CSV_PATH = ROOT / "public/data/indicadores-banco-mundial.csv"
COUNTRIES = {"ARG", "BRA", "CHL", "URY"}
INDICATORS = {"NY.GDP.PCAP.CD", "FP.CPI.TOTL.ZG", "SL.UEM.TOTL.ZS", "IT.NET.USER.ZS"}
MEASURES = (
    "Valor del Indicador", "Promedio Regional", "Brecha vs. Promedio",
    "Ranking País", "Países Analizados", "Indicadores Analizados",
    "País Líder", "Valor del Líder", "Observaciones", "Años Analizados",
    "Periodo Analizado",
)

def check(condition, message):
    if not condition:
        raise SystemExit("FAIL: " + message)
    print("OK:", message)

def main():
    check((POWERBI / "IndicadoresLatam.pbip").is_file(), "PBIP entrypoint exists")
    check((MODEL / "model.tmdl").is_file(), "semantic model exists")
    check((REPORT / "pages/pages.json").is_file(), "report page metadata exists")
    fact = (MODEL / "tables/FactIndicadores.tmdl").read_text(encoding="utf-8")
    countries_dim = (MODEL / "tables/Paises.tmdl").read_text(encoding="utf-8")
    indicators_dim = (MODEL / "tables/Indicadores.tmdl").read_text(encoding="utf-8")
    rel = (MODEL / "relationships.tmdl").read_text(encoding="utf-8")
    for name in MEASURES:
        check("measure '" + name + "'" in fact, "measure " + name)
    check("AVERAGE(FactIndicadores[Valor])" in fact, "indicator measure uses average")
    check("RANKX(ALL(Paises)" in fact, "ranking removes country filter")
    check("TOPN(" in fact, "leader measure defined")
    check("[value] <= 100" not in fact, "no universal 0-100 value restriction")
    check("FactIndicadores.CodigoPais" in rel and "Paises.CodigoPais" in rel, "country relationship")
    check("FactIndicadores.CodigoIndicador" in rel and "Indicadores.CodigoIndicador" in rel, "indicator relationship")
    check("sourceColumn: country_code" in countries_dim and "sourceColumn: country" in countries_dim, "country dimension mappings")
    check("sourceColumn: indicator_code" in indicators_dim and "sourceColumn: indicator_name" in indicators_dim, "indicator dimension mappings")
    with CSV_PATH.open(encoding="utf-8-sig", newline="") as file:
        reader = csv.DictReader(file)
        rows = list(reader)
        check(reader.fieldnames == ["country_code", "country", "indicator_code", "indicator_name", "year", "value", "unit", "source"], "CSV schema")
    check(len(rows) == 240, "240 observations")
    check({row["country_code"] for row in rows} == COUNTRIES, "four target countries")
    check({row["indicator_code"] for row in rows} == INDICATORS, "four target indicators")
    check({int(row["year"]) for row in rows} == set(range(2010, 2025)), "complete 2010-2024 year range")
    keys = [(row["country_code"], row["indicator_code"], row["year"]) for row in rows]
    check(len(keys) == len(set(keys)), "unique country-indicator-year keys")
    check(all("sintéticos" in row["source"].lower() for row in rows), "synthetic origin disclosed in every row")
    check(all(Decimal(row["value"]) >= 0 for row in rows), "non-negative values")
    check(any(Decimal(row["value"]) > 100 for row in rows), "dataset supports values above 100")
    page1 = REPORT / "pages/portada/visuals"
    page2 = REPORT / "pages/resumen/visuals"
    check(len(list(page1.glob("*/visual.json"))) >= 9, "overview page has KPI, slicers and charts")
    check(len(list(page2.glob("*/visual.json"))) >= 4, "detail page has trend, slicers and table")
    print("Static validation passed. Open the PBIP in Power BI Desktop to refresh and verify rendered visuals.")

if __name__ == "__main__":
    main()

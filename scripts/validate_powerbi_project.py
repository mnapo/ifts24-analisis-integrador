#!/usr/bin/env python3
"""Static validation of World Bank dataset and IndicadoresLatam PBIP."""
import csv
from decimal import Decimal
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
POWERBI=ROOT/"powerbi"
MODEL=POWERBI/"IndicadoresLatam.SemanticModel/definition"
REPORT=POWERBI/"IndicadoresLatam.Report/definition"
CSV_PATH=ROOT/"public/data/indicadores-banco-mundial.csv"
EXPECTED={
("ARG","IT.NET.USER.ZS"):Decimal("89.667"),("BRA","IT.NET.USER.ZS"):Decimal("84.463"),
("CHL","IT.NET.USER.ZS"):Decimal("95.590"),("URY","IT.NET.USER.ZS"):Decimal("91.991"),
("ARG","IQ.SPI.OVRL"):Decimal("80.391"),("BRA","IQ.SPI.OVRL"):Decimal("82.308"),
("CHL","IQ.SPI.OVRL"):Decimal("89.379"),("URY","IQ.SPI.OVRL"):Decimal("80.147")}
MEASURES=("Valor del Indicador","Promedio Regional","Brecha vs. Promedio","Ranking País",
"Países Analizados","Indicadores Analizados","País Líder","Valor del Líder")

def check(ok,msg):
    if not ok: raise SystemExit("FAIL: "+msg)
    print("OK:",msg)

def main():
    check((POWERBI/"IndicadoresLatam.pbip").is_file(),"PBIP entrypoint renamed")
    check((MODEL/"model.tmdl").is_file(),"semantic model exists")
    check((REPORT/"pages/pages.json").is_file(),"report metadata exists")
    fact=(MODEL/"tables/FactIndicadores.tmdl").read_text(encoding="utf-8")
    countries=(MODEL/"tables/Paises.tmdl").read_text(encoding="utf-8")
    indicators=(MODEL/"tables/Indicadores.tmdl").read_text(encoding="utf-8")
    rel=(MODEL/"relationships.tmdl").read_text(encoding="utf-8")
    for name in MEASURES: check("measure '"+name+"'" in fact,"measure "+name)
    check("AVERAGE(FactIndicadores[Valor])" in fact,"indicator measure uses non-additive average")
    check("HASONEVALUE(Indicadores[CodigoIndicador])" in fact,"comparison measures require one indicator")
    check("RANKX(ALL(Paises)" in fact,"ranking removes country filter")
    check("TOPN(" in fact,"leader measure defined")
    check("FactIndicadores.CodigoPais" in rel and "Paises.CodigoPais" in rel,"country relationship")
    check("FactIndicadores.CodigoIndicador" in rel and "Indicadores.CodigoIndicador" in rel,"indicator relationship")
    check("sourceColumn: country_code" in countries and "sourceColumn: country" in countries,"country dimension mappings")
    check("sourceColumn: indicator_code" in indicators and "sourceColumn: indicator_name" in indicators,"indicator dimension mappings")
    check("ValidRows = Table.SelectRows" in fact,"Power Query validity filter")
    with CSV_PATH.open(encoding="utf-8-sig",newline="") as f:
        reader=csv.DictReader(f); rows=list(reader)
        check(reader.fieldnames==["country_code","country","indicator_code","indicator_name","year","value","unit","source"],"CSV schema")
    check(len(rows)==8,"eight observations")
    keys=[(r["country_code"],r["indicator_code"],r["year"]) for r in rows]
    check(len(keys)==len(set(keys)),"unique country-indicator-year keys")
    check({r["year"] for r in rows}=={"2024"},"year 2024")
    actual={}
    for r in rows:
        v=Decimal(r["value"]); check(0<=v<=100,"value range "+r["country_code"]+" "+r["indicator_code"])
        actual[(r["country_code"],r["indicator_code"])]=v
    check(actual==EXPECTED,"dataset values match expected snapshot")
    print("Static validation passed. Power BI Desktop refresh and PBIX generation remain manual.")

if __name__=="__main__": main()

#!/usr/bin/env python3
"""Descarga, transforma y valida WDI y OxCGRT para el observatorio."""

from __future__ import annotations

import csv
import json
import urllib.parse
import urllib.request
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
RAW = ROOT / "data" / "raw"
OUT = ROOT / "public" / "data"
VALIDATION = ROOT / "data" / "validation"
START_YEAR, END_YEAR = 2015, 2023
OX_START, OX_END = 2020, 2022
USER_AGENT = "ObservatorioSocioeconomicoLATAM/1.0 (academic project)"


def read_json(path: Path):
    return json.loads(path.read_text(encoding="utf-8"))


def download(url: str, destination: Path):
    destination.parent.mkdir(parents=True, exist_ok=True)
    request = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(request, timeout=120) as response:
        destination.write_bytes(response.read())


def write_csv(path: Path, rows: list[dict], fields: list[str]):
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", newline="", encoding="utf-8-sig") as file:
        writer = csv.DictWriter(file, fieldnames=fields, extrasaction="ignore")
        writer.writeheader()
        writer.writerows(rows)


def fetch_wdi(countries: list[str], indicators: list[dict]) -> list[dict]:
    country_path = ";".join(countries)
    indicator_path = ";".join(item["codigo"] for item in indicators)
    query = urllib.parse.urlencode({
        "date": f"{START_YEAR}:{END_YEAR}",
        "format": "json",
        "per_page": "20000"
    })
    url = f"https://api.worldbank.org/v2/country/{country_path}/indicator/{indicator_path}?{query}"
    raw_path = RAW / "wdi_indicadores.json"
    download(url, raw_path)
    payload = read_json(raw_path)
    if not isinstance(payload, list) or len(payload) < 2 or not isinstance(payload[1], list):
        raise RuntimeError(f"Respuesta WDI inesperada: {payload!r}")

    names = {item["codigo"]: item["nombre"] for item in indicators}
    rows = []
    for item in payload[1]:
        if not item.get("countryiso3code") or item.get("value") is None:
            continue
        rows.append({
            "iso3": item["countryiso3code"],
            "pais": item["country"]["value"],
            "anio": int(item["date"]),
            "codigo_indicador": item["indicator"]["id"],
            "indicador": names.get(item["indicator"]["id"], item["indicator"]["value"]),
            "valor": item["value"]
        })
    return rows


def fetch_oxcgrt(countries: set[str]) -> tuple[list[dict], list[str]]:
    url = "https://raw.githubusercontent.com/OxCGRT/covid-policy-dataset/main/data/OxCGRT_compact_national_v1.csv"
    raw_path = RAW / "oxcgrt_compact_national_v1.csv"
    download(url, raw_path)

    with raw_path.open(encoding="utf-8-sig", newline="") as file:
        reader = csv.DictReader(file)
        if not reader.fieldnames:
            raise RuntimeError("El CSV de OxCGRT no contiene encabezados.")
        fields = reader.fieldnames
        country_key = "CountryCode" if "CountryCode" in fields else "country_code"
        date_key = "Date" if "Date" in fields else "date"
        if country_key not in fields or date_key not in fields:
            raise RuntimeError(f"No se reconocen las columnas de país/fecha de OxCGRT: {fields}")

        candidates = [
            "StringencyIndex_Average", "GovernmentResponseIndex_Average",
            "ContainmentHealthIndex_Average", "EconomicSupportIndex",
            "StringencyIndex", "GovernmentResponseIndex",
            "ContainmentHealthIndex"
        ]
        selected = [name for name in candidates if name in fields]
        if not selected:
            raise RuntimeError("No se encontraron índices agregados esperados en OxCGRT.")

        daily = []
        for source in reader:
            iso3 = (source.get(country_key) or "").strip().upper()
            date_value = (source.get(date_key) or "").strip()
            if iso3 not in countries or not date_value:
                continue
            try:
                date = datetime.strptime(date_value, "%Y%m%d")
            except ValueError:
                continue
            if not OX_START <= date.year <= OX_END:
                continue
            row = {"iso3": iso3, "fecha": date.strftime("%Y-%m-%d"), "anio": date.year}
            for name in selected:
                raw = source.get(name, "")
                try:
                    row[name] = float(raw) if raw not in ("", None) else None
                except ValueError:
                    row[name] = None
            daily.append(row)
    return daily, selected


def aggregate_oxcgrt(daily: list[dict], metrics: list[str]) -> list[dict]:
    grouped: dict[tuple[str, int], dict[str, list[float]]] = {}
    for row in daily:
        bucket = grouped.setdefault((row["iso3"], row["anio"]), {metric: [] for metric in metrics})
        for metric in metrics:
            value = row.get(metric)
            if value is not None:
                bucket[metric].append(value)
    output = []
    for (iso3, year), values in sorted(grouped.items()):
        row = {"iso3": iso3, "anio": year, "dias_observados": max((len(v) for v in values.values()), default=0)}
        for metric, series in values.items():
            row[metric] = round(sum(series) / len(series), 4) if series else None
        output.append(row)
    return output


def validate(wdi: list[dict], ox_daily: list[dict], ox_yearly: list[dict], countries: list[str], indicators: list[dict]):
    expected_years = set(range(START_YEAR, END_YEAR + 1))
    wdi_keys = [(r["iso3"], r["anio"], r["codigo_indicador"]) for r in wdi]
    ox_keys = [(r["iso3"], r["fecha"]) for r in ox_daily]
    duplicate_wdi = len(wdi_keys) - len(set(wdi_keys))
    duplicate_ox = len(ox_keys) - len(set(ox_keys))
    country_coverage = sorted({r["iso3"] for r in wdi})
    indicator_coverage = sorted({r["codigo_indicador"] for r in wdi})
    yearly_coverage = sorted({r["anio"] for r in wdi})
    missing_indicators = sorted({i["codigo"] for i in indicators} - set(indicator_coverage))
    invalid_years = sorted(set(yearly_coverage) - expected_years)

    checks = {
        "sin_duplicados_wdi": duplicate_wdi == 0,
        "sin_duplicados_oxcgrt": duplicate_ox == 0,
        "sin_anios_fuera_de_rango": not invalid_years,
        "indicadores_wdi_presentes": not missing_indicators,
        "wdi_no_vacio": bool(wdi),
        "oxcgrt_no_vacio": bool(ox_daily)
    }
    summary = {
        "generado_utc": datetime.now(timezone.utc).isoformat(),
        "periodo_wdi": [START_YEAR, END_YEAR],
        "periodo_oxcgrt": [OX_START, OX_END],
        "paises_configurados": len(countries),
        "paises_con_datos_wdi": len(country_coverage),
        "paises_con_datos_oxcgrt": len({r["iso3"] for r in ox_daily}),
        "anios_wdi": yearly_coverage,
        "indicadores_wdi": indicator_coverage,
        "indicadores_sin_datos": missing_indicators,
        "filas_wdi": len(wdi),
        "filas_oxcgrt_diarias": len(ox_daily),
        "filas_oxcgrt_anuales": len(ox_yearly),
        "duplicados_wdi": duplicate_wdi,
        "duplicados_oxcgrt": duplicate_ox,
        "controles": checks,
        "estado": "aprobado" if all(checks.values()) else "requiere_revision"
    }
    VALIDATION.mkdir(parents=True, exist_ok=True)
    (VALIDATION / "summary.json").write_text(json.dumps(summary, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    if not all(checks.values()):
        raise RuntimeError("Falló la validación de datos. Revisar data/validation/summary.json.")
    return summary


def main():
    countries_config = read_json(ROOT / "config" / "paises.json")
    indicators_config = read_json(ROOT / "config" / "indicadores-wdi.json")
    countries = countries_config["iso3"]
    indicators = indicators_config["indicadores"]

    wdi = fetch_wdi(countries, indicators)
    ox_daily, ox_metrics = fetch_oxcgrt(set(countries))
    ox_yearly = aggregate_oxcgrt(ox_daily, ox_metrics)

    write_csv(OUT / "wdi_indicadores.csv", wdi,
              ["iso3", "pais", "anio", "codigo_indicador", "indicador", "valor"])
    write_csv(OUT / "oxcgrt_diario.csv", ox_daily,
              ["iso3", "fecha", "anio", *ox_metrics])
    write_csv(OUT / "oxcgrt_anual.csv", ox_yearly,
              ["iso3", "anio", "dias_observados", *ox_metrics])
    summary = validate(wdi, ox_daily, ox_yearly, countries, indicators)
    print(json.dumps(summary, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()

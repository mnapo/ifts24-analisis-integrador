#!/usr/bin/env python3
"""Validate the CSV and the checked-in PBIP/TMDL model without Power BI Desktop."""
from __future__ import annotations

import csv
import json
from collections import Counter, defaultdict
from datetime import date
from decimal import Decimal
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CSV_PATH = ROOT / "public/data/movimientos.csv"
POWERBI = ROOT / "powerbi"
MODEL = POWERBI / "Finanzas.SemanticModel/definition"
REPORT = POWERBI / "Finanzas.Report/definition"

EXPECTED_MEASURES = [
    "Total Ingresos",
    "Total Gastos",
    "Balance Neto",
    "Cantidad de Movimientos",
    "Promedio por Movimiento",
    "Cantidad de Ingresos",
    "Cantidad de Gastos",
]


def check(condition: bool, message: str) -> None:
    if not condition:
        raise SystemExit(f"FAIL: {message}")
    print(f"OK: {message}")


def main() -> None:
    check((POWERBI / "Finanzas.pbip").is_file(), "PBIP entrypoint exists")
    check((MODEL / "model.tmdl").is_file(), "semantic model definition exists")
    check((MODEL / "relationships.tmdl").is_file(), "date relationship definition exists")
    check((REPORT / "pages/pages.json").is_file(), "report page metadata exists")
    check((REPORT / "pages/resumen/page.json").is_file(), "summary page definition exists")

    model = (MODEL / "tables/Movimientos.tmdl").read_text(encoding="utf-8")
    for measure in EXPECTED_MEASURES:
        check(f"measure '{measure}'" in model, f"DAX measure declared: {measure}")

    with CSV_PATH.open(encoding="utf-8-sig", newline="") as f:
        reader = csv.DictReader(f)
        expected_columns = ["id", "fecha", "tipo", "categoria", "descripcion", "importe", "medio_pago"]
        check(reader.fieldnames == expected_columns, "CSV columns match the semantic model")
        rows = list(reader)

    ids = [int(row["id"]) for row in rows]
    check(len(rows) == 500, "CSV contains 500 rows")
    check(len(set(ids)) == len(ids), "movement IDs are unique")

    counts = Counter()
    totals = defaultdict(Decimal)
    category_totals = defaultdict(Decimal)
    for row in rows:
        date.fromisoformat(row["fecha"])
        check_type = row["tipo"]
        if check_type not in {"Ingreso", "Gasto"}:
            raise SystemExit(f"FAIL: unexpected transaction type {check_type!r}")
        amount = Decimal(row["importe"])
        if amount <= 0:
            raise SystemExit(f"FAIL: non-positive amount in movement {row['id']}")
        counts[check_type] += 1
        totals[check_type] += amount
        if check_type == "Gasto":
            category_totals[row["categoria"]] += amount

    check(counts["Ingreso"] == 88 and counts["Gasto"] == 412, "transaction type distribution matches expected")
    check(totals["Ingreso"] == Decimal("34766900"), "Total Ingresos matches CSV")
    check(totals["Gasto"] == Decimal("19607200"), "Total Gastos matches CSV")
    balance = totals["Ingreso"] - totals["Gasto"]
    check(balance == Decimal("15159700"), "Balance Neto matches CSV")
    average = (totals["Ingreso"] + totals["Gasto"]) / Decimal(len(rows))
    check(average == Decimal("108748.2"), "Promedio por Movimiento matches CSV")

    print("\nReference values for Power BI")
    print(f"Rows: {len(rows)}")
    print(f"Ingresos: ARS {totals['Ingreso']:,.2f}")
    print(f"Gastos: ARS {totals['Gasto']:,.2f}")
    print(f"Balance: ARS {balance:,.2f}")
    print(f"Promedio: ARS {average:,.2f}")
    print(f"Expense categories: {len(category_totals)}")
    print("\nStatic validation passed. Open and refresh the PBIP in Power BI Desktop to validate the engine and save a PBIX.")


if __name__ == "__main__":
    main()

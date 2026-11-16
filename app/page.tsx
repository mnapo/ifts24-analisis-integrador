"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Bar, BarChart, CartesianGrid, Cell, Line, LineChart, ResponsiveContainer,
  Tooltip, XAxis, YAxis,
} from "recharts";

type Row = {
  observation_id: string; country_code: string; country: string;
  indicator_code: string; indicator_name: string; year: number;
  value: number; unit: string; source: string;
};

const COLORS: Record<string, string> = { ARG: "#3976db", BRA: "#18a889", CHL: "#e5a544", URY: "#8875dc" };
const INDICATORS = [
  { code: "NY.GDP.PCAP.CD", label: "PIB per cápita", unit: "US$" },
  { code: "FP.CPI.TOTL.ZG", label: "Inflación", unit: "%" },
  { code: "SL.UEM.TOTL.ZS", label: "Desempleo", unit: "%" },
  { code: "IT.NET.USER.ZS", label: "Uso de Internet", unit: "%" },
] as const;

const number = (value: number, digits = 1) => new Intl.NumberFormat("es-AR", {
  minimumFractionDigits: digits, maximumFractionDigits: digits,
}).format(value);
const formatValue = (value: number, unit: string) =>
  unit === "US$" ? "US$ " + number(value, 0) : number(value) + "%";

function parseCsv(text: string): Row[] {
  const records: string[][] = [];
  let row: string[] = [], field = "", quoted = false;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (quoted) {
      if (char === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (char === '"') quoted = false;
      else field += char;
    } else if (char === '"') quoted = true;
    else if (char === ",") { row.push(field); field = ""; }
    else if (char === "\n") { row.push(field.replace(/\r$/, "")); records.push(row); row = []; field = ""; }
    else field += char;
  }
  if (field.length || row.length) { row.push(field.replace(/\r$/, "")); records.push(row); }
  const [header, ...data] = records;
  return data.filter((r) => r.length === header.length).map((r) => {
    const item = Object.fromEntries(header.map((key, i) => [key, r[i]]));
    return {
      observation_id: item.observation_id, country_code: item.country_code, country: item.country,
      indicator_code: item.indicator_code, indicator_name: item.indicator_name,
      year: Number(item.year), value: Number(item.value), unit: item.unit, source: item.source,
    };
  }).filter((r) => r.observation_id && r.country_code && Number.isFinite(r.value) && Number.isFinite(r.year));
}

function mean(values: number[]) {
  return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
}

export default function Page() {
  const [rows, setRows] = useState<Row[]>([]);
  const [country, setCountry] = useState("all");
  const [indicator, setIndicator] = useState<string>(INDICATORS[0].code);
  const [year, setYear] = useState("2024");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/data/indicadores-banco-mundial.csv")
      .then((response) => { if (!response.ok) throw new Error("Dataset no disponible"); return response.text(); })
      .then((csv) => setRows(parseCsv(csv)))
      .catch(() => setError("No fue posible cargar el dataset."))
      .finally(() => setLoading(false));
  }, []);

  const meta = INDICATORS.find((item) => item.code === indicator) ?? INDICATORS[0];
  const years = useMemo(() => [...new Set(rows.map((r) => r.year))].sort((a, b) => a - b), [rows]);
  const countries = useMemo(() => [...new Map(rows.map((r) => [r.country_code, r.country])).entries()], [rows]);

  const selectedRows = useMemo(() => rows.filter((r) =>
    r.indicator_code === indicator && (country === "all" || r.country_code === country)
  ), [rows, indicator, country]);

  const currentRows = useMemo(() => {
    const selected = selectedRows.filter((r) => r.year === Number(year));
    return countries
      .filter(([code]) => country === "all" || code === country)
      .map(([code, name]) => {
        const values = selected.filter((r) => r.country_code === code).map((r) => r.value);
        return { country_code: code, country: name, value: mean(values), observations: values.length };
      }).filter((r) => r.observations > 0).sort((a, b) => b.value - a.value);
  }, [selectedRows, countries, country, year]);

  const trendRows = useMemo(() => {
    const grouped = new Map<number, Record<string, number | string>>();
    for (const [code] of countries) {
      if (country !== "all" && country !== code) continue;
      for (const y of years) {
        const values = selectedRows.filter((r) => r.country_code === code && r.year === y).map((r) => r.value);
        if (!values.length) continue;
        const item = grouped.get(y) ?? { year: y };
        item[code] = mean(values);
        grouped.set(y, item);
      }
    }
    return [...grouped.values()].sort((a, b) => Number(a.year) - Number(b.year));
  }, [selectedRows, countries, years, country]);

  return (
    <main className="dashboard">
      <header className="dashboard-header">
        <div className="brand-mark">IFTS <span>24</span></div>
        <div className="header-title">
          <p>ANÁLISIS Y PROCESAMIENTO DE DATOS · 2026</p>
          <h1>Indicadores de desarrollo en América Latina</h1>
        </div>
        <span className="period">2010—2024</span>
      </header>

      <section className="filters" aria-label="Filtros del análisis">
        <label><span>Indicador</span><select value={indicator} onChange={(e) => setIndicator(e.target.value)}>{INDICATORS.map((item) => <option key={item.code} value={item.code}>{item.label}</option>)}</select></label>
        <label><span>País</span><select value={country} onChange={(e) => setCountry(e.target.value)}><option value="all">Todos los países</option>{countries.map(([code, name]) => <option key={code} value={code}>{name}</option>)}</select></label>
        <label><span>Año de comparación</span><select value={year} onChange={(e) => setYear(e.target.value)}>{years.map((y) => <option key={y} value={y}>{y}</option>)}</select></label>
      </section>

      {loading ? <div className="state">Cargando visualizaciones...</div> : error ? <div className="state error">{error}</div> : (
        <section className="visualizations">
          <article className="visual">
            <div className="visual-heading"><div><span>01 / COMPARACIÓN</span><h2>{meta.label} por país</h2></div><small>{year} · {meta.unit}</small></div>
            <div className="chart"><ResponsiveContainer width="100%" height="100%">
              <BarChart data={currentRows} margin={{ top: 18, right: 20, left: 8, bottom: 8 }}>
                <CartesianGrid stroke="#e9edf1" vertical={false} />
                <XAxis dataKey="country" axisLine={false} tickLine={false} tick={{ fill: "#667487", fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#8490a0", fontSize: 10 }} />
                <Tooltip formatter={(v) => [formatValue(Number(v), meta.unit), meta.label]} />
                <Bar dataKey="value" radius={[5, 5, 0, 0]} maxBarSize={70}>{currentRows.map((r) => <Cell key={r.country_code} fill={COLORS[r.country_code]} />)}</Bar>
              </BarChart>
            </ResponsiveContainer></div>
            <p className="caption">Promedio de {currentRows.reduce((sum, r) => sum + r.observations, 0).toLocaleString("es-AR")} observaciones sintéticas agrupadas por país.</p>
          </article>

          <article className="visual">
            <div className="visual-heading"><div><span>02 / EVOLUCIÓN</span><h2>Serie temporal</h2></div><small>2010—2024 · {meta.unit}</small></div>
            <div className="chart"><ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendRows} margin={{ top: 18, right: 20, left: 8, bottom: 8 }}>
                <CartesianGrid stroke="#e9edf1" vertical={false} />
                <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fill: "#667487", fontSize: 11 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#8490a0", fontSize: 10 }} />
                <Tooltip formatter={(v) => [formatValue(Number(v), meta.unit), "Promedio"]} />
                {countries.filter(([code]) => country === "all" || code === country).map(([code, name]) =>
                  <Line key={code} type="monotone" dataKey={code} name={name} stroke={COLORS[code]} strokeWidth={2.5} dot={false} connectNulls />
                )}
              </LineChart>
            </ResponsiveContainer></div>
            <p className="caption">Promedios anuales por país. El filtro de año se aplica a la comparación; la serie conserva el período completo.</p>
          </article>
        </section>
      )}

      <footer className="dashboard-footer"><span>Matías Napoli · IFTS 24</span><span>10.000 registros sintéticos · Uso académico</span></footer>
    </main>
  );
}

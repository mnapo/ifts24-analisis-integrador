"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Bar, BarChart, CartesianGrid, Cell, Line, LineChart, ResponsiveContainer,
  Tooltip, XAxis, YAxis,
} from "recharts";
import { Download, Globe2, Info, Search, TrendingUp } from "lucide-react";

type Row = {
  country_code: string; country: string; indicator_code: string;
  indicator_name: string; year: number; value: number; unit: string; source: string;
};

const COLORS: Record<string, string> = { ARG: "#3976db", BRA: "#18a889", CHL: "#e5a544", URY: "#8875dc" };
const INDICATORS = [
  { code: "NY.GDP.PCAP.CD", label: "PIB per cápita", unit: "US$", short: "US$ corrientes" },
  { code: "FP.CPI.TOTL.ZG", label: "Inflación", unit: "%", short: "Variación anual de precios" },
  { code: "SL.UEM.TOTL.ZS", label: "Desempleo", unit: "%", short: "Porcentaje de la fuerza laboral" },
  { code: "IT.NET.USER.ZS", label: "Uso de Internet", unit: "%", short: "Porcentaje de la población" },
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
      country_code: item.country_code, country: item.country,
      indicator_code: item.indicator_code, indicator_name: item.indicator_name,
      year: Number(item.year), value: Number(item.value), unit: item.unit, source: item.source,
    };
  }).filter((r) => r.country_code && Number.isFinite(r.value) && Number.isFinite(r.year));
}

export default function Page() {
  const [rows, setRows] = useState<Row[]>([]);
  const [country, setCountry] = useState("all");
  const [indicator, setIndicator] = useState<string>(INDICATORS[0].code);
  const [year, setYear] = useState("2024");
  const [query, setQuery] = useState("");
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
  const filtered = useMemo(() => rows.filter((r) =>
    r.indicator_code === indicator &&
    (country === "all" || r.country_code === country) &&
    (year === "all" || r.year === Number(year)) &&
    (r.country + " " + r.indicator_name).toLocaleLowerCase("es").includes(query.toLocaleLowerCase("es"))
  ), [rows, indicator, country, year, query]);

  const currentRows = useMemo(() => filtered.filter((r) => year === "all" ? r.year === Math.max(...filtered.map((x) => x.year), 0) : r.year === Number(year)), [filtered, year]);
  const average = currentRows.length ? currentRows.reduce((sum, r) => sum + r.value, 0) / currentRows.length : 0;
  const highest = [...currentRows].sort((a, b) => b.value - a.value)[0];
  const trendRows = useMemo(() => {
    const base = rows.filter((r) => r.indicator_code === indicator && (country === "all" || r.country_code === country));
    const grouped = new Map<number, Record<string, number | string>>();
    for (const r of base) {
      const item = grouped.get(r.year) ?? { year: r.year };
      item[r.country_code] = r.value;
      grouped.set(r.year, item);
    }
    return [...grouped.values()].sort((a, b) => Number(a.year) - Number(b.year));
  }, [rows, indicator, country]);

  const exportCsv = () => {
    const quote = (v: string | number) => '"' + String(v).replace(/"/g, '""') + '"';
    const header = ["country_code","country","indicator_code","indicator_name","year","value","unit","source"];
    const csv = [header.map(quote).join(","), ...filtered.map((r) =>
      [r.country_code,r.country,r.indicator_code,r.indicator_name,r.year,r.value,r.unit,r.source].map(quote).join(",")
    )].join("\n");
    const url = URL.createObjectURL(new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8" }));
    const anchor = document.createElement("a"); anchor.href = url; anchor.download = "indicadores-latam-sinteticos.csv"; anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="layout">
      <aside className="sidebar">
        <div className="brand"><b><Globe2 size={20} /></b><span>latam<span className="brand-light">insights</span><small>DATA EXPLORER</small></span></div>
        <p className="sidecap">ANÁLISIS</p>
        <div className="nav active">▦　 Panorama regional</div>
        <div className="side-note"><span className="live-dot" /> Dataset sintético<br /><small>Generado para fines académicos</small></div>
        <div className="profile"><b>IF</b><span>IFTS 24<small>Trabajo integrador · Individual</small></span></div>
      </aside>

      <section className="main">
        <header className="hero">
          <div>
            <div className="overline">ANÁLISIS DE DATOS <span> / </span> AMÉRICA LATINA</div>
            <h1>Indicadores de desarrollo</h1>
            <p>Comparación y evolución de cuatro indicadores para cuatro países.</p>
          </div>
          <div className="year-badge"><span>PERÍODO</span><strong>2010–2024</strong></div>
        </header>

        <section className="story-intro">
          <div className="story-icon"><TrendingUp size={19} /></div>
          <div><strong>Explorá las tendencias económicas y sociales de la región</strong><p>Seleccioná un indicador, un país y un año para comparar niveles y observar la evolución histórica.</p></div>
        </section>

        <div className="toolbar">
          <label>Indicador <select value={indicator} onChange={(e) => setIndicator(e.target.value)}>{INDICATORS.map((item) => <option key={item.code} value={item.code}>{item.label}</option>)}</select></label>
          <label>País <select value={country} onChange={(e) => setCountry(e.target.value)}><option value="all">Todos</option>{countries.map(([code, name]) => <option key={code} value={code}>{name}</option>)}</select></label>
          <label>Año <select value={year} onChange={(e) => setYear(e.target.value)}><option value="all">Último disponible</option>{years.map((y) => <option key={y} value={y}>{y}</option>)}</select></label>
          <label className="search"><Search size={15} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar país..." /></label>
          <button onClick={exportCsv} disabled={loading || !!error}><Download size={15} /> Exportar</button>
        </div>

        {loading ? <div className="state-panel">Cargando indicadores...</div> : error ? <div className="state-panel error">{error}</div> : (
          <>
            <div className="section-label">PANORAMA GENERAL <span>· {countries.length} PAÍSES · {INDICATORS.length} INDICADORES · DATOS SINTÉTICOS</span></div>
            <div className="cards">
              <article><label>Promedio del indicador</label><strong>{formatValue(average, meta.unit)}</strong><small>{meta.label} · {year === "all" ? "último año" : year}</small><div className="metric-mark teal" /></article>
              <article><label>Valor más alto</label><strong>{highest?.country ?? "—"}</strong><small>{highest ? formatValue(highest.value, meta.unit) : "Sin datos"}</small><div className="metric-mark blue" /></article>
              <article><label>Observaciones visibles</label><strong>{filtered.length}</strong><small>Según filtros seleccionados</small><div className="metric-mark gold" /></article>
              <article><label>Período del dataset</label><strong>15 <em>años</em></strong><small>2010 a 2024</small><div className="metric-mark purple" /></article>
            </div>

            <div className="charts">
              <article className="panel chart-panel">
                <div className="panel-heading"><div><h2>Comparación entre países</h2><p>{meta.label} · {meta.short}</p></div><span className="unit-pill">{meta.unit}</span></div>
                <div className="chart"><ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[...currentRows].sort((a,b) => b.value-a.value)} margin={{top:8,right:12,left:0,bottom:0}}>
                    <CartesianGrid stroke="#edf1f5" vertical={false}/><XAxis dataKey="country" axisLine={false} tickLine={false} tick={{fill:"#718096",fontSize:11}}/>
                    <YAxis axisLine={false} tickLine={false} tick={{fill:"#9aa5b3",fontSize:10}}/><Tooltip formatter={(v) => [formatValue(Number(v),meta.unit),meta.label]}/>
                    <Bar dataKey="value" radius={[6,6,0,0]} maxBarSize={54}>{currentRows.map((r)=><Cell key={r.country_code} fill={COLORS[r.country_code]}/>)}</Bar>
                  </BarChart>
                </ResponsiveContainer></div>
                <div className="chart-foot"><span>{year === "all" ? "Último año disponible" : "Año " + year}</span><span>Unidad: {meta.unit}</span></div>
              </article>

              <article className="panel chart-panel">
                <div className="panel-heading"><div><h2>Evolución temporal</h2><p>Serie anual por país · 2010–2024</p></div><span className="unit-pill">{meta.unit}</span></div>
                <div className="chart"><ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendRows} margin={{top:8,right:12,left:0,bottom:0}}>
                    <CartesianGrid stroke="#edf1f5" vertical={false}/><XAxis dataKey="year" axisLine={false} tickLine={false} tick={{fill:"#718096",fontSize:10}}/>
                    <YAxis axisLine={false} tickLine={false} tick={{fill:"#9aa5b3",fontSize:10}}/><Tooltip formatter={(v) => [formatValue(Number(v),meta.unit), "Valor"]}/>
                    {countries.filter(([code])=>country==="all"||code===country).map(([code,name])=><Line key={code} type="monotone" dataKey={code} name={name} stroke={COLORS[code]} strokeWidth={2.5} dot={false} connectNulls/>)}
                  </LineChart>
                </ResponsiveContainer></div>
                <div className="chart-foot"><span>Serie histórica sintética</span><span>Fuente: generación propia</span></div>
              </article>
            </div>

            <article className="panel table-panel">
              <div className="table-heading"><div><h2>Detalle de observaciones</h2><p>{meta.label} · {year === "all" ? "serie completa" : year}</p></div><span>{filtered.length} registros</span></div>
              <div className="table-wrap"><table><thead><tr><th>País</th><th>Año</th><th>Indicador</th><th>Código</th><th className="right">Valor</th><th>Unidad</th></tr></thead>
                <tbody>{filtered.slice(0,60).map((r,i)=><tr key={r.country_code+r.indicator_code+r.year}><td><span className="country-dot" style={{background:COLORS[r.country_code]}}/>{r.country}</td><td>{r.year}</td><td>{r.indicator_name}</td><td><code>{r.indicator_code}</code></td><td className="right value-cell">{number(r.value,3)}</td><td>{r.unit}</td></tr>)}</tbody>
              </table></div>
            </article>

            <div className="insight"><Info size={17}/><p><strong>Nota metodológica.</strong> Los 240 registros del dataset son sintéticos y autogenerados con fines académicos. Los códigos identifican indicadores del catálogo del Banco Mundial, pero los valores no provienen de esa institución ni deben interpretarse como estadísticas oficiales.</p></div>
          </>
        )}

        <footer><span>IFTS 24 · Análisis y procesamiento de datos · 2026</span><span>Dataset sintético · No oficial · Generación propia</span></footer>
      </section>
    </main>
  );
}

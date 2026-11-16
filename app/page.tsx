"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Bar, BarChart, CartesianGrid, Cell, Legend, ResponsiveContainer,
  Tooltip, XAxis, YAxis,
} from "recharts";
import { Download, Globe2, Info, Search, TrendingUp } from "lucide-react";

type IndicatorRow = {
  country_code: string;
  country: string;
  indicator_code: string;
  indicator_name: string;
  year: number;
  value: number;
  unit: string;
  source: string;
};

const COLORS: Record<string, string> = {
  ARG: "#3976db",
  BRA: "#18a889",
  CHL: "#e5a544",
  URY: "#8875dc",
};
const fmt = (n: number, digits = 1) =>
  new Intl.NumberFormat("es-AR", { minimumFractionDigits: digits, maximumFractionDigits: digits }).format(n);
const percent = (n: number) => `${fmt(n)}%`;
const INDICATORS = {
  internet: {
    code: "IT.NET.USER.ZS",
    title: "Acceso a Internet",
    subtitle: "Población que utiliza Internet",
    unit: "%",
    source: "https://data.worldbank.org/indicator/IT.NET.USER.ZS",
  },
  spi: {
    code: "IQ.SPI.OVRL",
    title: "Desempeño estadístico",
    subtitle: "Statistical Performance Indicators",
    unit: "puntos",
    source: "https://data.worldbank.org/indicator/IQ.SPI.OVRL",
  },
} as const;

function parseCsv(text: string): IndicatorRow[] {
  const lines = text.trim().split(/\r?\n/);
  return lines.slice(1).map((line) => {
    const values = line.split(",");
    const [country_code, country, indicator_code, indicator_name, year, value, unit, source] = values;
    return {
      country_code, country, indicator_code, indicator_name,
      year: Number(year), value: Number(value), unit, source,
    };
  }).filter((row) => row.country_code && Number.isFinite(row.value));
}

function MetricChart({
  title, subtitle, rows, selectedCountry, unit,
}: {
  title: string;
  subtitle: string;
  rows: IndicatorRow[];
  selectedCountry: string;
  unit: string;
}) {
  const sorted = [...rows].sort((a, b) => b.value - a.value);
  return (
    <article className="panel chart-panel">
      <div className="panel-heading">
        <div><h2>{title}</h2><p>{subtitle}</p></div>
        <span className="unit-pill">{unit}</span>
      </div>
      <div className="chart">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={sorted} margin={{ top: 8, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid stroke="#edf1f5" vertical={false} />
            <XAxis dataKey="country" axisLine={false} tickLine={false} tick={{ fill: "#718096", fontSize: 11 }} />
            <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fill: "#9aa5b3", fontSize: 10 }} />
            <Tooltip
              cursor={{ fill: "#f5f7fa" }}
              formatter={(value) => [`${fmt(Number(value))}${unit === "%" ? "%" : " pts"}`, title]}
              contentStyle={{ border: "1px solid #e8edf2", borderRadius: 10, fontSize: 12 }}
            />
            <Bar dataKey="value" name={title} radius={[6, 6, 0, 0]} maxBarSize={54}>
              {sorted.map((row) => (
                <Cell key={row.country_code} fill={COLORS[row.country_code]} opacity={selectedCountry === "all" || selectedCountry === row.country_code ? 1 : 0.28} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="chart-foot"><span>Escala de 0 a 100</span><span>Fuente: Banco Mundial · 2024</span></div>
    </article>
  );
}

export default function Page() {
  const [rows, setRows] = useState<IndicatorRow[]>([]);
  const [country, setCountry] = useState("all");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/data/indicadores-banco-mundial.csv")
      .then((response) => {
        if (!response.ok) throw new Error("No se pudo cargar el dataset.");
        return response.text();
      })
      .then((text) => setRows(parseCsv(text)))
      .catch(() => setError("No fue posible cargar los datos del Banco Mundial."))
      .finally(() => setLoading(false));
  }, []);

  const internetRows = useMemo(() => rows.filter((r) => r.indicator_code === INDICATORS.internet.code), [rows]);
  const spiRows = useMemo(() => rows.filter((r) => r.indicator_code === INDICATORS.spi.code), [rows]);
  const countries = useMemo(() => [...new Map(rows.map((r) => [r.country_code, r.country])).entries()], [rows]);
  const visibleRows = useMemo(
    () => rows.filter((r) =>
      (country === "all" || r.country_code === country) &&
      (r.country + " " + r.indicator_name).toLocaleLowerCase("es").includes(query.toLocaleLowerCase("es"))
    ),
    [rows, country, query],
  );

  const avgInternet = internetRows.length ? internetRows.reduce((s, r) => s + r.value, 0) / internetRows.length : 0;
  const avgSpi = spiRows.length ? spiRows.reduce((s, r) => s + r.value, 0) / spiRows.length : 0;
  const leaderInternet = [...internetRows].sort((a, b) => b.value - a.value)[0];
  const leaderSpi = [...spiRows].sort((a, b) => b.value - a.value)[0];

  const exportCsv = () => {
    const header = "country_code,country,indicator_code,indicator_name,year,value,unit,source";
    const content = [header, ...visibleRows.map((r) => [
      r.country_code, r.country, r.indicator_code, r.indicator_name, r.year, r.value, r.unit, r.source,
    ].join(","))].join("\n");
    const url = URL.createObjectURL(new Blob(["\ufeff" + content], { type: "text/csv;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "indicadores-banco-mundial-filtrados.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="layout">
      <aside className="sidebar">
        <div className="brand"><b><Globe2 size={20} /></b><span>latam<span className="brand-light">insights</span><small>DATA EXPLORER</small></span></div>
        <p className="sidecap">ANÁLISIS</p>
        <div className="nav active">▦　 Panorama regional</div>
        <div className="side-note"><span className="live-dot" /> Dataset público<br /><small>World Bank Open Data</small></div>
        <div className="profile"><b>IF</b><span>IFTS 24<small>Trabajo integrador · Individual</small></span></div>
      </aside>

      <section className="main">
        <header className="hero">
          <div>
            <div className="overline">WORLD BANK OPEN DATA <span> / </span> AMÉRICA LATINA</div>
            <h1>Indicadores de desarrollo</h1>
            <p>Una comparación regional de conectividad y capacidad estadística.</p>
          </div>
          <div className="year-badge"><span>PERÍODO</span><strong>2024</strong></div>
        </header>

        <section className="story-intro">
          <div className="story-icon"><TrendingUp size={19} /></div>
          <div><strong>¿Cómo se posicionan Argentina, Brasil, Chile y Uruguay?</strong><p>Explorá dos dimensiones complementarias del desarrollo regional con datos comparables del mismo año.</p></div>
        </section>

        <div className="toolbar">
          <label>País <select value={country} onChange={(e) => setCountry(e.target.value)}><option value="all">Todos los países</option>{countries.map(([code, name]) => <option key={code} value={code}>{name}</option>)}</select></label>
          <label className="search"><Search size={15} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar país o indicador..." /></label>
          <button onClick={exportCsv} disabled={loading || !!error}><Download size={15} /> Exportar datos</button>
        </div>

        {loading ? <div className="state-panel">Cargando indicadores...</div> : error ? <div className="state-panel error">{error}</div> : (
          <>
            <div className="section-label">PANORAMA GENERAL <span>· 4 PAÍSES · 2 INDICADORES</span></div>
            <div className="cards">
              <article><label>Promedio de acceso a Internet</label><strong>{percent(avgInternet)}</strong><small>Promedio de los países seleccionados</small><div className="metric-mark teal" /></article>
              <article><label>Promedio de desempeño estadístico</label><strong>{fmt(avgSpi)} <em>pts</em></strong><small>Escala de 0 a 100</small><div className="metric-mark blue" /></article>
              <article><label>Líder en conectividad</label><strong>{leaderInternet?.country ?? "—"}</strong><small>{leaderInternet ? percent(leaderInternet.value) + " de la población" : "Sin datos"}</small><div className="metric-mark gold" /></article>
              <article><label>Líder en desempeño estadístico</label><strong>{leaderSpi?.country ?? "—"}</strong><small>{leaderSpi ? fmt(leaderSpi.value) + " puntos" : "Sin datos"}</small><div className="metric-mark purple" /></article>
            </div>

            <div className="charts">
              <MetricChart title="Acceso a Internet" subtitle="Personas que utilizan Internet (% de la población)" rows={internetRows} selectedCountry={country} unit="%" />
              <MetricChart title="Desempeño estadístico" subtitle="Statistical Performance Indicators (SPI)" rows={spiRows} selectedCountry={country} unit="puntos" />
            </div>

            <article className="panel table-panel">
              <div className="table-heading"><div><h2>Detalle de indicadores</h2><p>Valores por país e indicador · año 2024</p></div><span>{visibleRows.length} observaciones</span></div>
              <div className="table-wrap"><table><thead><tr><th>País</th><th>Indicador</th><th>Código</th><th className="right">Valor</th><th>Unidad</th></tr></thead>
                <tbody>{visibleRows.map((r) => <tr key={r.country_code + r.indicator_code}><td><span className="country-dot" style={{ background: COLORS[r.country_code] }} />{r.country}</td><td>{r.indicator_code === INDICATORS.internet.code ? "Acceso a Internet" : "Desempeño estadístico (SPI)"}</td><td><code>{r.indicator_code}</code></td><td className="right value-cell">{fmt(r.value, 3)}</td><td>{r.unit}</td></tr>)}</tbody>
              </table></div>
            </article>

            <div className="insight"><Info size={17} /><p><strong>Lectura de los datos.</strong> Chile lidera ambos indicadores dentro del grupo comparado. Brasil presenta el menor porcentaje de uso de Internet, mientras que Argentina y Uruguay muestran puntajes SPI muy próximos. Son indicadores distintos: no deben sumarse ni interpretarse como evidencia de causalidad.</p></div>
          </>
        )}

        <footer>
          <span>IFTS 24 · Trabajo final de análisis de datos</span>
          <span>Fuente: <a href={INDICATORS.internet.source} target="_blank" rel="noreferrer">World Bank — Internet</a> · <a href={INDICATORS.spi.source} target="_blank" rel="noreferrer">World Bank — SPI</a> · Licencia CC BY 4.0</span>
        </footer>
      </section>
    </main>
  );
}

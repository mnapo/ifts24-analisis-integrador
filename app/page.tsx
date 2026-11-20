"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Scatter,
  ScatterChart, Tooltip, XAxis, YAxis
} from "recharts";

type WdiRow = { iso3: string; pais: string; anio: number; codigo_indicador: string; indicador: string; valor: number };
type OxRow = { iso3: string; anio: number; dias_observados: number; StringencyIndex_Average: number; GovernmentResponseIndex_Average: number; ContainmentHealthIndex_Average: number; EconomicSupportIndex: number };
type DataState = { wdi: WdiRow[]; ox: OxRow[]; error: string; loading: boolean };

const GDP = "NY.GDP.MKTP.KD.ZG";
const HEALTH = "SH.XPD.CHEX.PC.CD";
const slides = [
  { eyebrow: "OBSERVATORIO SOCIOECONÓMICO DE AMÉRICA LATINA", title: "La pandemia bajo la lupa de los datos.", body: "Un análisis comparativo de las respuestas sanitarias y sus efectos económicos y sociales en América Latina y el Caribe.", tag: "2015—2023 · 33 PAÍSES · BANCO MUNDIAL + OXCGRT", kind: "cover" },
  { eyebrow: "01 / CONTEXTO", title: "Una crisis, múltiples realidades.", body: "La pandemia encontró a los países de la región con estructuras productivas, condiciones sociales y capacidades sanitarias diferentes. La comparación temporal permite observar esas diferencias antes, durante y después de la emergencia.", tag: "PANORAMA REGIONAL", kind: "content" },
  { eyebrow: "02 / ACTIVIDAD ECONÓMICA", title: "El crecimiento antes, durante y después del shock.", body: "La evolución del PIB permite dimensionar la contracción de 2020 y observar la recuperación posterior. El promedio regional es simple y no está ponderado por población o tamaño económico.", tag: "WORLD DEVELOPMENT INDICATORS · VARIACIÓN ANUAL DEL PIB", kind: "chart", chart: "gdp" },
  { eyebrow: "03 / RESPUESTA PÚBLICA", title: "La intensidad de las medidas cambió con el tiempo.", body: "El índice de rigurosidad resume distintas políticas de contención. Se presenta como promedio anual: no equivale a una medida directa de cumplimiento ni de movilidad de la población.", tag: "OXFORD COVID-19 GOVERNMENT RESPONSE TRACKER", kind: "chart", chart: "stringency" },
  { eyebrow: "04 / SALUD Y CAPACIDAD", title: "La capacidad sanitaria previa también es desigual.", body: "El gasto corriente en salud por habitante ayuda a contextualizar las capacidades disponibles antes de la pandemia. Los valores están expresados en dólares estadounidenses corrientes y pueden faltar para algunos países y años.", tag: "WORLD DEVELOPMENT INDICATORS · US$ CORRIENTES POR HABITANTE", kind: "chart", chart: "health" },
  { eyebrow: "05 / RECUPERACIÓN", title: "Las trayectorias nacionales no fueron idénticas.", body: "La comparación entre 2020 y 2023 muestra diferencias en las caídas y los rebotes. Seleccioná un país para contrastar su evolución con el promedio regional.", tag: "CRECIMIENTO DEL PIB · 2019—2023", kind: "chart", chart: "recovery" },
  { eyebrow: "06 / RELACIONES", title: "¿Más restricciones, menor crecimiento?", body: "El diagrama cruza el índice anual de rigurosidad con el crecimiento del PIB para los países y años con ambos datos. Una asociación visual no demuestra que las restricciones hayan causado el resultado económico.", tag: "OXCGRT + WDI · OBSERVACIONES PAÍS/AÑO", kind: "chart", chart: "scatter" },
  { eyebrow: "07 / FUENTES Y COBERTURA", title: "Dos fuentes, una mirada regional.", body: "World Development Indicators aporta indicadores económicos, demográficos y sanitarios para 2015–2023. OxCGRT aporta índices de respuesta gubernamental para 2020–2022. La cobertura no es idéntica: WDI incluye 33 países y OxCGRT, 28.", tag: "FUENTES OFICIALES · COBERTURA VALIDADA", kind: "content" },
  { eyebrow: "08 / METODOLOGÍA", title: "De los registros a la comparación.", body: "Los datos se normalizaron por código ISO3 y año. Las observaciones diarias de OxCGRT se agregaron mediante promedios anuales. Se controlaron duplicados, períodos e integridad de los archivos. Los promedios regionales son no ponderados y excluyen los valores faltantes.", tag: "EXTRACCIÓN · TRANSFORMACIÓN · VALIDACIÓN", kind: "content" },
  { eyebrow: "09 / CONCLUSIONES", title: "Interpretar sin simplificar.", body: "Los datos permiten describir diferencias entre países y períodos, pero no identificar por sí solos efectos causales. La cobertura desigual, los indicadores agregados y las diferencias estructurales deben considerarse al interpretar los patrones.", tag: "RESULTADOS DESCRIPTIVOS Y LIMITACIONES", kind: "closing" }
];

function parseCsv<T>(text: string, map: (row: Record<string, string>) => T | null): T[] {
  const lines = text.replace(/^\uFEFF/, "").trim().split(/\r?\n/);
  if (lines.length < 2) return [];
  const parseLine = (line: string) => {
    const cells: string[] = []; let cell = ""; let quoted = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"' && line[i + 1] === '"' && quoted) { cell += '"'; i++; }
      else if (ch === '"') quoted = !quoted;
      else if (ch === "," && !quoted) { cells.push(cell); cell = ""; }
      else cell += ch;
    }
    cells.push(cell); return cells;
  };
  const headers = parseLine(lines[0]);
  return lines.slice(1).map((line) => {
    const values = parseLine(line);
    return map(Object.fromEntries(headers.map((header, i) => [header, values[i] ?? ""])));
  }).filter((row): row is T => row !== null);
}

const number = (value: string) => value === "" ? null : Number(value);
const countryName = (rows: WdiRow[], iso: string) => rows.find((row) => row.iso3 === iso)?.pais ?? iso;

function DataCharts({ chart, data, country }: { chart: string; data: DataState; country: string }) {
  const countries = useMemo(() => [...new Map(data.wdi.map((r) => [r.iso3, r.pais])).entries()].sort((a,b) => a[1].localeCompare(b[1], "es")), [data.wdi]);
  const gdp = useMemo(() => {
    const rows = data.wdi.filter((r) => r.codigo_indicador === GDP);
    return Array.from({ length: 9 }, (_, i) => {
      const year = 2015 + i; const values = rows.filter((r) => r.anio === year);
      const regional = values.length ? values.reduce((s,r) => s + r.valor, 0) / values.length : null;
      return { anio: year, region: regional, pais: values.find((r) => r.iso3 === country)?.valor ?? null, cobertura: values.length };
    });
  }, [data.wdi, country]);
  const ox = useMemo(() => Array.from({ length: 3 }, (_, i) => {
    const year = 2020 + i; const rows = data.ox.filter((r) => r.anio === year);
    const values = rows.map((r) => r.StringencyIndex_Average).filter(Number.isFinite);
    return { anio: year, region: values.length ? values.reduce((s,v) => s + v, 0) / values.length : null, pais: data.ox.find((r) => r.iso3 === country && r.anio === year)?.StringencyIndex_Average ?? null, cobertura: values.length };
  }), [data.ox, country]);
  const health = useMemo(() => Array.from({ length: 9 }, (_, i) => {
    const year = 2015 + i; const rows = data.wdi.filter((r) => r.codigo_indicador === HEALTH && r.anio === year);
    const values = rows.map((r) => r.valor);
    return { anio: year, region: values.length ? values.reduce((s,v) => s + v, 0) / values.length : null, pais: rows.find((r) => r.iso3 === country)?.valor ?? null, cobertura: values.length };
  }), [data.wdi, country]);
  const recovery = gdp.filter((r) => r.anio >= 2019);
  const scatter = useMemo(() => data.ox.flatMap((r) => {
    const match = data.wdi.find((w) => w.iso3 === r.iso3 && w.anio === r.anio && w.codigo_indicador === GDP);
    return match ? [{ x: r.StringencyIndex_Average, y: match.valor, pais: countryName(data.wdi, r.iso3), anio: r.anio }] : [];
  }), [data.ox, data.wdi]);
  const tooltip = { contentStyle: { background: "#101a2b", border: "1px solid #34445d", borderRadius: 10, color: "#f3f6fc" }, labelStyle: { color: "#aab8ca" } };
  const common = <><CartesianGrid stroke="#26364d" strokeDasharray="3 5" /><XAxis dataKey="anio" stroke="#8292a9" tickLine={false} axisLine={false} /><YAxis stroke="#8292a9" tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} /><Tooltip {...tooltip} /><Legend /></>;
  if (chart === "scatter") return <div className="chart-frame"><div className="chart-heading"><span>RIGUROSIDAD Y CRECIMIENTO</span><small>{scatter.length} observaciones comparables</small></div><ResponsiveContainer width="100%" height="100%"><ScatterChart margin={{ top: 12, right: 20, bottom: 24, left: 0 }}><CartesianGrid stroke="#26364d" strokeDasharray="3 5" /><XAxis type="number" dataKey="x" name="Rigurosidad" domain={[0,100]} stroke="#8292a9" label={{ value: "Índice de rigurosidad (0–100)", position: "insideBottom", offset: -12, fill: "#8292a9" }} /><YAxis type="number" dataKey="y" name="Crecimiento del PIB" stroke="#8292a9" tickFormatter={(v) => `${v}%`} /><Tooltip cursor={{ strokeDasharray: "3 3" }} {...tooltip} /><Scatter data={scatter} fill="#70dbc8" fillOpacity={0.72} /></ScatterChart></ResponsiveContainer><p className="chart-note">Cada punto representa un país y un año (2020–2022). No implica causalidad.</p></div>;
  const rows = chart === "stringency" ? ox : chart === "health" ? health : chart === "recovery" ? recovery : gdp;
  const unit = chart === "health" ? "US$ corrientes por habitante" : "Variación / índice promedio anual";
  return <div className="chart-frame"><div className="chart-heading"><span>{chart === "stringency" ? "ÍNDICE DE RIGUROSIDAD" : chart === "health" ? "GASTO CORRIENTE EN SALUD" : "CRECIMIENTO DEL PIB"}</span><small>{unit}</small></div><ResponsiveContainer width="100%" height="100%"><LineChart data={rows} margin={{ top: 12, right: 20, bottom: 8, left: 0 }}>{chart === "health" ? <><CartesianGrid stroke="#26364d" strokeDasharray="3 5" /><XAxis dataKey="anio" stroke="#8292a9" tickLine={false} axisLine={false} /><YAxis stroke="#8292a9" tickLine={false} axisLine={false} /><Tooltip {...tooltip} /><Legend /></> : common}<Line type="monotone" dataKey="region" name="Promedio regional" stroke="#70dbc8" strokeWidth={3} connectNulls={false} dot={{ r: 3, fill: "#70dbc8" }} activeDot={{ r: 5 }} /><Line type="monotone" dataKey="pais" name={countryName(data.wdi, country)} stroke="#f3b66b" strokeWidth={2} connectNulls={false} dot={{ r: 3 }} /></LineChart></ResponsiveContainer><p className="chart-note">Cobertura regional: {rows.map((r) => r.cobertura).join(" · ")} países con datos por año. Promedio simple, sin ponderar.</p></div>;
}

export default function Home() {
  const [active, setActive] = useState(0);
  const [country, setCountry] = useState("ARG");
  const [data, setData] = useState<DataState>({ wdi: [], ox: [], error: "", loading: true });
  const move = useCallback((direction: number) => setActive((current) => Math.max(0, Math.min(slides.length - 1, current + direction))), []);
  useEffect(() => {
    let cancelled = false;
    Promise.all([
      fetch("/data/wdi_indicadores.csv").then((r) => { if (!r.ok) throw new Error("No se pudo cargar WDI"); return r.text(); }),
      fetch("/data/oxcgrt_anual.csv").then((r) => { if (!r.ok) throw new Error("No se pudo cargar OxCGRT"); return r.text(); })
    ]).then(([wdiText, oxText]) => {
      const wdi = parseCsv(wdiText, (r) => { const valor = number(r.valor); return valor === null || !Number.isFinite(valor) ? null : { iso3:r.iso3, pais:r.pais, anio:Number(r.anio), codigo_indicador:r.codigo_indicador, indicador:r.indicador, valor }; });
      const ox = parseCsv(oxText, (r) => ({ iso3:r.iso3, anio:Number(r.anio), dias_observados:Number(r.dias_observados), StringencyIndex_Average:Number(r.StringencyIndex_Average), GovernmentResponseIndex_Average:Number(r.GovernmentResponseIndex_Average), ContainmentHealthIndex_Average:Number(r.ContainmentHealthIndex_Average), EconomicSupportIndex:Number(r.EconomicSupportIndex) }));
      if (!cancelled) setData({ wdi, ox, error:"", loading:false });
    }).catch((error: Error) => { if (!cancelled) setData((old) => ({ ...old, error:error.message, loading:false })); });
    return () => { cancelled = true; };
  }, []);
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (["ArrowRight", "PageDown", " "].includes(event.key)) { event.preventDefault(); move(1); }
      if (["ArrowLeft", "PageUp"].includes(event.key)) { event.preventDefault(); move(-1); }
      if (event.key === "Home") setActive(0);
      if (event.key === "End") setActive(slides.length - 1);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [move]);
  const slide = slides[active];
  const hasChart = slide.kind === "chart";
  return <main className="presentation">
    <header className="topbar"><a className="brand" href="#inicio" onClick={(event) => { event.preventDefault(); setActive(0); }}>OBSERVATORIO <span>LATAM</span></a><span className="counter">{String(active + 1).padStart(2, "0")} <i>/</i> {String(slides.length).padStart(2, "0")}</span></header>
    <section className={`slide ${slide.kind}`} key={active} aria-live="polite">
      <div className="slide-copy"><p className="eyebrow">{slide.eyebrow}</p><h1>{slide.title}</h1><p className="body-copy">{slide.body}</p><p className="slide-tag">{slide.tag}</p></div>
      {hasChart && <div className="data-panel">
        {data.loading ? <div className="data-status">Cargando datasets validados…</div> : data.error ? <div className="data-status error">{data.error}</div> : <>
          <div className="data-toolbar"><label htmlFor="country-select">País de comparación</label><select id="country-select" value={country} onChange={(e) => setCountry(e.target.value)}>{[...new Map(data.wdi.map((r) => [r.iso3,r.pais])).entries()].sort((a,b) => a[1].localeCompare(b[1],"es")).map(([iso,name]) => <option key={iso} value={iso}>{name}</option>)}</select><span>{data.wdi.length.toLocaleString("es-AR")} registros WDI · {data.ox.length} registros OxCGRT</span></div>
          <DataCharts chart={slide.chart!} data={data} country={country} />
        </>}
      </div>}
      {!hasChart && <div className="visual-mark" aria-hidden="true"><span>LATAM</span><b>{String(active + 1).padStart(2, "0")}</b></div>}
    </section>
    <footer className="controls"><button onClick={() => move(-1)} disabled={active === 0} aria-label="Diapositiva anterior">←</button><nav className="dots" aria-label="Navegación de diapositivas">{slides.map((item,index) => <button key={item.eyebrow} onClick={() => setActive(index)} className={index === active ? "dot active" : "dot"} aria-label={`Ir a diapositiva ${index + 1}`} aria-current={index === active ? "step" : undefined} />)}</nav><button onClick={() => move(1)} disabled={active === slides.length - 1} aria-label="Diapositiva siguiente">→</button></footer>
    <span className="keyboard-hint">USÁ ← → PARA NAVEGAR</span>
  </main>;
}

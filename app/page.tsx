"use client";

import { useCallback, useEffect, useState } from "react";

const slides = [
  { eyebrow: "OBSERVATORIO SOCIOECONÓMICO DE AMÉRICA LATINA", title: "La pandemia bajo la lupa de los datos.", body: "Un análisis comparativo de las respuestas sanitarias y sus efectos económicos y sociales en América Latina y el Caribe.", tag: "2015—2023 · 33 PAÍSES · BANCO MUNDIAL + OXCGRT", kind: "cover" },
  { eyebrow: "01 / CONTEXTO", title: "Una crisis, múltiples realidades.", body: "La pandemia encontró a los países de la región con estructuras productivas, condiciones sociales y capacidades sanitarias diferentes. La comparación temporal permite observar esas diferencias antes, durante y después de la emergencia.", tag: "PANORAMA REGIONAL", kind: "content" },
  { eyebrow: "02 / RESPUESTA PÚBLICA", title: "Restricciones y actividad económica.", body: "Se explora cómo evolucionaron las medidas gubernamentales y cómo se relacionaron con el desempeño económico. La intensidad de las respuestas se analiza junto con los cambios del PIB, sin asumir una relación causal directa.", tag: "OXCGRT + WORLD DEVELOPMENT INDICATORS", kind: "content" },
  { eyebrow: "03 / SALUD Y SOCIEDAD", title: "La vulnerabilidad también importa.", body: "La capacidad sanitaria previa, la esperanza de vida y las condiciones socioeconómicas permiten contextualizar las diferencias entre países y sus trayectorias durante la pandemia.", tag: "CONDICIONES PREVIAS Y RESULTADOS", kind: "content" },
  { eyebrow: "04 / RECUPERACIÓN", title: "Después de la caída.", body: "La evolución económica entre 2021 y 2023 permite comparar ritmos de recuperación y explorar si la magnitud de la contracción de 2020 se relacionó con las trayectorias posteriores.", tag: "EVOLUCIÓN 2020—2023", kind: "content" },
  { eyebrow: "05 / DATOS", title: "Dos fuentes, una mirada regional.", body: "World Development Indicators aporta indicadores económicos, demográficos y sanitarios para 2015–2023. OxCGRT aporta índices de respuesta gubernamental para 2020–2022. La unidad de análisis es país/año.", tag: "FUENTES Y COBERTURA", kind: "content" },
  { eyebrow: "06 / METODOLOGÍA", title: "De los registros a la comparación.", body: "Los datos se normalizan por código ISO3 y año. Las observaciones diarias de OxCGRT se agregan mediante promedios anuales. Se controlan duplicados, cobertura, períodos y valores faltantes antes de generar las visualizaciones.", tag: "EXTRACCIÓN · TRANSFORMACIÓN · VALIDACIÓN", kind: "content" },
  { eyebrow: "07 / CONCLUSIONES", title: "Interpretar sin simplificar.", body: "Las comparaciones permiten identificar patrones y diferencias regionales, pero no prueban causalidad. La cobertura desigual de algunos indicadores y la heterogeneidad entre países deben formar parte de la interpretación final.", tag: "RESULTADOS Y LIMITACIONES", kind: "closing" }
];

export default function Home() {
  const [active, setActive] = useState(0);
  const move = useCallback((direction: number) => setActive((current) => Math.max(0, Math.min(slides.length - 1, current + direction))), []);
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
  return <main className="presentation">
    <header className="topbar">
      <a className="brand" href="#inicio" onClick={(event) => { event.preventDefault(); setActive(0); }}>OBSERVATORIO <span>LATAM</span></a>
      <span className="counter">{String(active + 1).padStart(2, "0")} <i>/</i> {String(slides.length).padStart(2, "0")}</span>
    </header>
    <section className={`slide ${slide.kind}`} key={active} aria-live="polite">
      <div className="slide-copy">
        <p className="eyebrow">{slide.eyebrow}</p>
        <h1>{slide.title}</h1>
        <p className="body-copy">{slide.body}</p>
        <p className="slide-tag">{slide.tag}</p>
      </div>
      <div className="visual-mark" aria-hidden="true"><span>LATAM</span><b>{String(active + 1).padStart(2, "0")}</b></div>
    </section>
    <footer className="controls">
      <button onClick={() => move(-1)} disabled={active === 0} aria-label="Diapositiva anterior">←</button>
      <nav className="dots" aria-label="Navegación de diapositivas">
        {slides.map((item, index) => <button key={item.eyebrow} onClick={() => setActive(index)} className={index === active ? "dot active" : "dot"} aria-label={`Ir a diapositiva ${index + 1}`} aria-current={index === active ? "step" : undefined} />)}
      </nav>
      <button onClick={() => move(1)} disabled={active === slides.length - 1} aria-label="Diapositiva siguiente">→</button>
    </footer>
    <span className="keyboard-hint">USÁ ← → PARA NAVEGAR</span>
  </main>;
}

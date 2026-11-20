const sections = [
  { number: "01", title: "Panorama regional", description: "Indicadores económicos y sociales antes, durante y después de la pandemia." },
  { number: "02", title: "Restricciones y economía", description: "Evolución de las respuestas gubernamentales y su relación con la actividad económica." },
  { number: "03", title: "Impacto sanitario y social", description: "Capacidad sanitaria previa y evolución de los indicadores sociales." },
  { number: "04", title: "Datos y metodología", description: "Fuentes, cobertura, criterios de transformación y controles de calidad." }
];

export default function Home() {
  return <main>
    <header style={{ padding: "28px 6vw", display: "flex", justifyContent: "space-between", borderBottom: "1px solid #26344b" }}>
      <strong>OBSERVATORIO <span style={{ color: "#67d5c2" }}>LATAM</span></strong>
      <span style={{ color: "#91a0b8", fontSize: 13 }}>ANÁLISIS 2015—2023</span>
    </header>
    <section style={{ minHeight: "68vh", padding: "12vh 10vw 8vh", display: "flex", flexDirection: "column", justifyContent: "center", maxWidth: 1100 }}>
      <p style={{ color: "#67d5c2", letterSpacing: ".18em", fontSize: 12 }}>OBSERVATORIO SOCIOECONÓMICO DE AMÉRICA LATINA</p>
      <h1 style={{ fontSize: "clamp(42px, 7vw, 82px)", lineHeight: 1.02, letterSpacing: "-.055em", maxWidth: 900, margin: "18px 0 24px" }}>La pandemia bajo la lupa de los datos.</h1>
      <p style={{ color: "#b3bfd1", fontSize: 18, lineHeight: 1.7, maxWidth: 680 }}>Un análisis comparativo de las respuestas sanitarias y sus efectos económicos y sociales en América Latina y el Caribe.</p>
      <p style={{ color: "#91a0b8", fontSize: 13, marginTop: 34 }}>2015—2023 · PAÍS / AÑO · BANCO MUNDIAL + OXCGRT</p>
    </section>
    <section style={{ padding: "4vh 6vw 12vh", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: 14 }}>
      {sections.map((item) => <article key={item.number} style={{ background: "#121a2d", border: "1px solid #26344b", borderRadius: 16, padding: 24, minHeight: 190 }}>
        <span style={{ color: "#67d5c2", fontSize: 12 }}>{item.number}</span>
        <h2 style={{ fontSize: 21, margin: "24px 0 10px" }}>{item.title}</h2>
        <p style={{ color: "#91a0b8", lineHeight: 1.6, fontSize: 14 }}>{item.description}</p>
      </article>)}
    </section>
    <footer style={{ padding: "24px 6vw", borderTop: "1px solid #26344b", color: "#71819a", fontSize: 12 }}>Proyecto académico · Datos sujetos a validación y actualización metodológica.</footer>
  </main>;
}

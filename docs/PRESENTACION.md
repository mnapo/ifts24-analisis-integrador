# Presentación interactiva

La entrega se desarrolla en Next.js. No requiere Power BI.

## Visualizaciones

- Área: evolución regional del crecimiento del PIB.
- Barras horizontales: contracción del PIB en 2020 y promedio de crecimiento 2021–2023 por país.
- Líneas: inflación, desempleo, gasto corriente en salud, esperanza de vida e índice de Gini.
- Líneas múltiples: índices OxCGRT de respuesta gubernamental.
- Dispersión con tendencia lineal: rigurosidad y crecimiento del PIB.
- Burbujas: población y crecimiento del PIB por país/año.

## Fuentes y metodología

Los datos no son sintéticos. Se descargan de World Development Indicators (Banco Mundial) y del Oxford COVID-19 Government Response Tracker. Las fuentes y sus enlaces se incluyen en la presentación.

Los gráficos regionales utilizan promedios aritméticos simples de los países con dato disponible en cada año. No se ponderan por población ni PIB. Los faltantes se conservan y no se interpolan.

Los cruces WDI–OxCGRT se realizan por ISO3 y año, solo cuando ambas variables están disponibles. La tendencia lineal del diagrama de dispersión es descriptiva y no implica causalidad. El gráfico de recuperación utiliza el promedio de las tasas anuales 2021–2023, no el crecimiento acumulado.

La presentación no incorpora filtro de país: las comparaciones se muestran a escala regional o para el conjunto de países.

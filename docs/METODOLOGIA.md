# Metodología

## Naturaleza de los datos

Los valores publicados no son sintéticos ni fueron generados para completar gráficos. Son observaciones descargadas de fuentes estadísticas externas:

- **World Development Indicators (WDI), Banco Mundial:** API v2, indicadores nacionales anuales.
- **Oxford COVID-19 Government Response Tracker (OxCGRT):** archivo compacto nacional del conjunto de datos de políticas COVID-19.

Los datos son reales en el sentido de que proceden de series observadas y publicadas por esas fuentes. Como toda estadística oficial, pueden estar sujetos a revisiones, estimaciones, diferencias de cobertura y cambios metodológicos de origen. El ETL no inventa ni imputa valores.

Fuentes: [WDI](https://databank.worldbank.org/source/world-development-indicators) · [API del Banco Mundial](https://api.worldbank.org/) · [OxCGRT](https://github.com/OxCGRT/covid-policy-dataset).

## Pregunta e hipótesis

¿Cómo se relacionaron las respuestas gubernamentales frente a la pandemia de COVID-19 con la evolución económica y social de los países de América Latina y el Caribe?

1. La rigurosidad de las medidas podría asociarse con la contracción económica en el corto plazo.
2. La caída de 2020 podría relacionarse con distintas trayectorias de recuperación entre 2021 y 2023.
3. Las condiciones sanitarias previas podrían relacionarse con diferencias en los resultados observados.

Son hipótesis descriptivas; no presuponen causalidad.

## Cobertura

- WDI: 2015–2023.
- OxCGRT: 2020–2022.
- Unidad de análisis: país/año.
- Países configurados: 33 de América Latina y el Caribe.
- La cobertura efectiva varía según fuente, indicador, país y año.

## Tratamiento y agregación

**WDI.** Se consulta cada indicador por separado. Se conservan el código del indicador, país ISO3, año y valor original publicado. Los faltantes no se imputan.

**OxCGRT.** Se descarga el archivo compacto nacional. Las observaciones diarias se filtran por país y período y se agregan mediante promedio aritmético anual de los valores no nulos para cada índice. Un promedio anual resume la intensidad registrada durante el año y puede ocultar cambios dentro de ese período.

**Promedios regionales.** Se calculan como media aritmética simple entre países con dato disponible en cada año. No se ponderan por población ni por PIB; por ello no equivalen a un agregado económico regional.

**Cruces WDI–OxCGRT.** Se emparejan registros mediante la clave compuesta ISO3 + año. Por ejemplo, el diagrama de rigurosidad y crecimiento compara el índice anual OxCGRT de un país con la tasa de crecimiento del PIB WDI del mismo país y año. Solo se incluyen pares donde ambas variables están disponibles. No se interpolan ni se rellenan faltantes.

**Regresión descriptiva.** La recta del diagrama de dispersión se obtiene mediante mínimos cuadrados ordinarios sobre los pares observados. Es una tendencia lineal bivariada sin controles; no identifica un efecto causal.

**Población y PIB.** El diagrama de burbujas empareja población y crecimiento del PIB para el mismo ISO3 y año. La población se utiliza como eje y tamaño de burbuja, no como ponderador del promedio.

## Indicadores representados

- Crecimiento del PIB y PIB per cápita.
- Inflación y desempleo.
- Gasto corriente en salud por habitante.
- Esperanza de vida e índice de Gini.
- Índices OxCGRT de rigurosidad, respuesta gubernamental, contención/salud y apoyo económico.

## Limitaciones

- La disponibilidad de WDI varía por indicador, país y año; el Gini tiene menor frecuencia.
- OxCGRT cubre menos países que la selección WDI.
- El gasto sanitario en dólares corrientes no está ajustado por inflación ni paridad de poder adquisitivo.
- El promedio anual de políticas puede ocultar variaciones diarias.
- El índice de rigurosidad no mide cumplimiento, movilidad ni resultados sanitarios.
- Los cruces descriptivos no controlan diferencias estructurales, simultaneidad, rezagos ni factores externos; no permiten atribuir causalidad.

## Reproducibilidad

Ejecutar `python scripts/etl.py`. El proceso descarga las fuentes originales en `data/raw/`, genera CSV procesados en `public/data/` y registra controles en `data/validation/summary.json`.

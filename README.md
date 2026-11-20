# Observatorio Socioeconómico de América Latina

Análisis comparativo del impacto socioeconómico de la pandemia de COVID-19 en América Latina y el Caribe.

## Alcance

- Países: América Latina y el Caribe.
- Indicadores económicos y sociales: 2015–2023.
- Respuestas gubernamentales (OxCGRT): 2020–2022.
- Granularidad analítica: país/año.
- Fuentes: World Development Indicators (Banco Mundial) y Oxford COVID-19 Government Response Tracker.

## Inicio

1. Ejecutar `python scripts/etl.py`.
2. Revisar `data/validation/summary.json`.
3. Consultar los CSV publicados en `public/data/`.
4. Ejecutar `npm install` y `npm run dev` para iniciar el dashboard.

Los datos originales se descargan en `data/raw/` y no se versionan. Los archivos procesados se generan en `public/data/`.

## Estructura

- `app/`: dashboard Next.js.
- `scripts/`: extracción, transformación y validación.
- `config/`: indicadores y países incluidos.
- `data/raw/`: fuentes originales descargadas.
- `data/validation/`: resultados de controles de calidad.
- `public/data/`: datasets procesados para Power BI y el dashboard.
- `docs/`: metodología y modelo de datos.
- `powerbi/`: proyecto de Power BI.
- `archivo/`: proyecto anterior, preservado sin modificaciones.

## Fuentes

- [World Development Indicators](https://datatopics.worldbank.org/world-development-indicators/)
- [API del Banco Mundial](https://datahelpdesk.worldbank.org/knowledgebase/articles/889392)
- [OxCGRT: dataset final](https://github.com/OxCGRT/covid-policy-dataset)
- [Documentación y código de OxCGRT](https://github.com/OxCGRT/covid-policy-dataset/blob/main/documentation_and_codebook.md)

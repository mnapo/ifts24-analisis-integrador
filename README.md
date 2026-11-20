# Observatorio Socioeconómico de América Latina

Presentación interactiva sobre el impacto socioeconómico de la pandemia de COVID-19 en América Latina y el Caribe.

## Alcance

- Países: América Latina y el Caribe.
- Indicadores económicos y sociales: 2015–2023.
- Respuestas gubernamentales (OxCGRT): 2020–2022.
- Unidad de análisis: país/año.
- Fuentes: World Development Indicators (Banco Mundial) y Oxford COVID-19 Government Response Tracker.

## Presentación

La investigación se comunica íntegramente desde una aplicación Next.js. La navegación se organiza como una presentación de pantalla completa, con carrusel, flechas, indicadores de posición, teclado y transiciones.

## Datos

1. Ejecutar `python scripts/etl.py`.
2. Revisar `data/validation/summary.json`.
3. Consultar los CSV procesados en `public/data/`.

Los datos originales se descargan en `data/raw/` y no se versionan. Los datasets procesados alimentan directamente las visualizaciones de la presentación.

## Estructura

- `app/`: presentación Next.js.
- `components/`: componentes de navegación y visualización.
- `scripts/`: extracción, transformación y validación.
- `config/`: indicadores y países incluidos.
- `data/raw/`: fuentes originales descargadas.
- `data/validation/`: controles de calidad.
- `public/data/`: datasets procesados.
- `docs/`: metodología y criterios de análisis.
- `archivo/`: proyecto anterior preservado.

## Fuentes

- [World Development Indicators](https://datatopics.worldbank.org/world-development-indicators/)
- [API del Banco Mundial](https://datahelpdesk.worldbank.org/knowledgebase/articles/889392)
- [Dataset final OxCGRT](https://github.com/OxCGRT/covid-policy-dataset)
- [Documentación OxCGRT](https://github.com/OxCGRT/covid-policy-dataset/blob/main/documentation_and_codebook.md)

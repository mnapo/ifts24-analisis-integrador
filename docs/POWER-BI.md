# Procesamiento y visualización en Power BI

## Origen y traducción
Fuente: `public/data/indicadores-banco-mundial.csv`, datos 2024 de Argentina, Brasil, Chile y Uruguay.

| CSV | Modelo |
|---|---|
| country_code | FactIndicadores[CodigoPais], Paises[CodigoPais] |
| country | FactIndicadores[Pais], Paises[País] |
| indicator_code | FactIndicadores[CodigoIndicador], Indicadores[CodigoIndicador] |
| indicator_name | FactIndicadores[Indicador], Indicadores[NombreIndicador] |
| year | FactIndicadores[Año] |
| value | FactIndicadores[Valor] |
| unit | FactIndicadores[Unidad], Indicadores[Unidad] |
| source | FactIndicadores[Fuente] |

## Power Query
Las tres consultas leen el CSV UTF-8 desde GitHub. FactIndicadores promueve encabezados, tipa columnas, recorta texto y excluye registros incompletos o valores fuera de 0–100. Las dimensiones seleccionan sus campos, recortan espacios y eliminan duplicados.

## Modelo semántico
FactIndicadores es la tabla de hechos. Paises e Indicadores son dimensiones relacionadas 1:N con filtrado unidireccional. No se usa Calendario: todos los datos son de 2024.

## Medidas DAX
Ver `powerbi/medidas.dax`. Las ocho medidas evitan agregar indicadores heterogéneos: Valor del Indicador usa promedio y las medidas comparativas requieren un único indicador. Promedio Regional y Ranking País quitan el filtro de país, pero conservan el filtro de indicador. También se incluyen País Líder y Valor del Líder.

## Diseño sugerido
- Página 1: portada, título, integrantes, institución y fuente.
- Página 2: tarjetas KPI, dos gráficos de barras separados (Internet y SPI), tabla de observaciones y segmentadores de país e indicador.
- Mantener ambos indicadores separados porque tienen interpretaciones distintas aunque sus escalas sean 0–100.

## Apertura y entrega
Abrir `powerbi/IndicadoresLatam.pbip`, actualizar datos, validar relaciones y medidas, completar visuales y guardar `powerbi/informe-indicadores-regionales.pbix`. Exportar documentación y resumen ejecutivo a PDF.

PBIP/TMDL es el proyecto fuente versionable; no equivale al PBIX final. La actualización del motor, visuales y guardado PBIX requieren Power BI Desktop.

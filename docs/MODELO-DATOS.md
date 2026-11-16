# Modelo de datos

## Alcance
Comparación 2024 de Argentina, Brasil, Chile y Uruguay con dos indicadores de World Bank Open Data: uso de Internet (IT.NET.USER.ZS) y puntaje general SPI (IQ.SPI.OVRL). La granularidad es una fila por país, indicador y año.

## Diccionario CSV → modelo
| Campo | Tabla/columna |
|---|---|
| country_code | FactIndicadores[CodigoPais] / Paises[CodigoPais] |
| country | FactIndicadores[Pais] / Paises[País] |
| indicator_code | FactIndicadores[CodigoIndicador] / Indicadores[CodigoIndicador] |
| indicator_name | FactIndicadores[Indicador] / Indicadores[NombreIndicador] |
| year | FactIndicadores[Año] |
| value | FactIndicadores[Valor] |
| unit | FactIndicadores[Unidad] / Indicadores[Unidad] |
| source | FactIndicadores[Fuente] |

## Modelo semántico
- FactIndicadores: tabla de hechos.
- Paises: dimensión con CodigoPais como clave.
- Indicadores: dimensión con CodigoIndicador como clave y nombre/unidad como atributos.
- Relaciones 1:N unidireccionales desde Paises e Indicadores a FactIndicadores.

No hay dimensión calendario porque el dataset es una fotografía del año 2024.

## Power Query
Las tres particiones consumen el CSV publicado, promueven encabezados y transforman tipos. FactIndicadores recorta texto y descarta registros incompletos o valores fuera de 0–100. Las dimensiones proyectan sus atributos, recortan espacios y deduplican.

## Medidas DAX
Ocho medidas definidas en FactIndicadores.tmdl y powerbi/medidas.dax: Valor del Indicador (promedio, no suma), Promedio Regional, Brecha vs. Promedio, Ranking País, Países Analizados, Indicadores Analizados, País Líder y Valor del Líder. Las medidas de comparación requieren un indicador único y conservan su filtro mientras eliminan el filtro geográfico.

## Validación
Ejecutar `python scripts/validate_powerbi_project.py`. Es una validación estática; no sustituye la actualización y comprobación en Power BI Desktop.

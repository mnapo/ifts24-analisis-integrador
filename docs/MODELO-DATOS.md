# Modelo de datos

## Alcance

Dataset sintético de Argentina, Brasil, Chile y Uruguay para 2010–2024. Contiene 10.000 observaciones sintéticas distribuidas en cuatro países, cuatro indicadores y quince años. Cada observación tiene un `observation_id` único; cada combinación país-indicador cuenta con más de diez registros. Los valores fueron autogenerados para fines académicos; no deben citarse como estadísticas oficiales del Banco Mundial.

## Indicadores

| Código | Indicador | Unidad |
|---|---|---|
| NY.GDP.PCAP.CD | PIB per cápita (US$ corrientes) | US$ |
| FP.CPI.TOTL.ZG | Inflación, precios al consumidor (% anual) | % |
| SL.UEM.TOTL.ZS | Desempleo total (% de la fuerza laboral) | % |
| IT.NET.USER.ZS | Personas que utilizan Internet (% de la población) | % |

## Diccionario CSV → modelo

| Campo | Tabla/columna |
|---|---|
| observation_id | FactIndicadores[IdObservacion] (clave única) |
| country_code | FactIndicadores[CodigoPais] / Paises[CodigoPais] |
| country | FactIndicadores[Pais] / Paises[País] |
| indicator_code | FactIndicadores[CodigoIndicador] / Indicadores[CodigoIndicador] |
| indicator_name | FactIndicadores[Indicador] / Indicadores[NombreIndicador] |
| year | FactIndicadores[Año] |
| value | FactIndicadores[Valor] |
| unit | FactIndicadores[Unidad] / Indicadores[Unidad] |
| source | FactIndicadores[Fuente] |

## Modelo semántico

- FactIndicadores: tabla de hechos con granularidad observación sintética individual, identificada por observation_id; cada país–indicador–año contiene 41 o 42 valoraciones.
- Paises: dimensión con CodigoPais como clave.
- Indicadores: dimensión con CodigoIndicador como clave y nombre/unidad como atributos.
- Relaciones 1:N desde Paises e Indicadores hacia FactIndicadores.

El año se mantiene como atributo de la tabla de hechos para simplificar el modelo. El CSV se importa desde el mismo archivo central mediante Power Query.

## Power Query

Las tres particiones leen CSV UTF-8 con `QuoteStyle.Csv`, promueven encabezados y tipan columnas. FactIndicadores recorta textos y excluye registros incompletos o valores negativos. No se aplica un límite máximo común: el PIB per cápita supera 100 y cada indicador tiene su propia escala.

## Medidas DAX

FactIndicadores incluye medidas para valor del indicador, promedio regional, brecha, ranking, país líder, valor del líder, países, indicadores, observaciones y años analizados. Las comparaciones se calculan con un indicador único y usan promedio para no sumar observaciones.

## Validación

Ejecutar `python scripts/validate_powerbi_project.py`. La validación es estática y no sustituye la actualización y comprobación visual en Power BI Desktop.

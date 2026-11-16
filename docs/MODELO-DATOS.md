# Modelo de datos

## Tema y alcance

El modelo compara Argentina, Brasil, Chile y Uruguay durante 2024 mediante dos indicadores públicos de World Bank Open Data: uso de Internet y desempeño estadístico (SPI).

La granularidad de la tabla de hechos es una observación por país, indicador y año. El CSV contiene 8 observaciones.

## Fuente

- Portal: https://data.worldbank.org/
- Uso de Internet (IT.NET.USER.ZS): https://data.worldbank.org/indicator/IT.NET.USER.ZS
- Desempeño estadístico (IQ.SPI.OVRL): https://data.worldbank.org/indicator/IQ.SPI.OVRL
- API: https://datahelpdesk.worldbank.org/knowledgebase/articles/898581-api-basic-call-structures

## Traducción del CSV al modelo semántico

El archivo `public/data/indicadores-banco-mundial.csv` es la fuente única del dashboard y del modelo Power BI.

| Campo CSV | Tipo en Power Query | Tabla del modelo | Columna semántica |
|---|---|---|---|
| country_code | Texto | FactIndicadores / Paises | CodigoPais |
| country | Texto | FactIndicadores / Paises | Pais / País |
| indicator_code | Texto | FactIndicadores / Indicadores | CodigoIndicador |
| indicator_name | Texto | FactIndicadores / Indicadores | Indicador / NombreIndicador |
| year | Entero | FactIndicadores | Año |
| value | Decimal | FactIndicadores | Valor |
| unit | Texto | FactIndicadores / Indicadores | Unidad |
| source | Texto | FactIndicadores | Fuente |

Las columnas descriptivas repetidas en la tabla de hechos permiten conservar trazabilidad con el CSV. Las dimensiones se utilizan para filtrar y agrupar mediante claves.

## Modelo semántico

### FactIndicadores — tabla de hechos

Una fila por país, indicador y año. Incluye CodigoPais, CodigoIndicador, Año y Valor, además de Pais, Indicador, Unidad y Fuente para trazabilidad.

### Paises — dimensión de países

Una fila por país, con CodigoPais como clave y País como atributo descriptivo.

### Indicadores — dimensión de indicadores

Una fila por código de indicador, con CodigoIndicador como clave y NombreIndicador y Unidad como atributos.

### Relaciones

- Paises[CodigoPais] (1) → FactIndicadores[CodigoPais] (*).
- Indicadores[CodigoIndicador] (1) → FactIndicadores[CodigoIndicador] (*).

Las relaciones son uno-a-muchos y filtran en una sola dirección, desde las dimensiones hacia FactIndicadores.

No se crea una dimensión calendario: el análisis es una fotografía comparativa del año 2024. El año se conserva como entero en FactIndicadores.

## Power Query (ETL)

Las tres particiones M consumen el mismo CSV publicado en GitHub.

1. Descargan el archivo con `Web.Contents` y lo interpretan como CSV UTF-8.
2. Promueven la primera fila como encabezados.
3. En FactIndicadores convierten año a entero y valor a decimal; los demás campos son texto.
4. Normalizan los campos textuales con `Text.Trim`.
5. FactIndicadores descarta registros incompletos y valores fuera del rango 0–100.
6. Paises selecciona country_code y country, elimina duplicados y ordena por código.
7. Indicadores selecciona indicator_code, indicator_name y unit, elimina duplicados y ordena por código.

## Medidas DAX

- Valor del Indicador: suma el valor en el contexto de filtro actual.
- Promedio Regional: promedio del indicador entre los países del conjunto comparado.
- Brecha vs. Promedio: diferencia entre el valor del país y el promedio regional.
- Ranking País: posición descendente del país dentro del indicador filtrado.
- Países Analizados: cantidad distinta de países en el contexto actual.
- Indicadores Analizados: cantidad distinta de indicadores en el contexto actual.

El filtro de Indicadores mantiene separados el porcentaje de uso de Internet y el puntaje SPI. No se deben sumar ni comparar directamente sus unidades.

## Integridad y validación

- 8 observaciones, 4 países, 2 indicadores y año único 2024.
- Clave lógica única por país, indicador y año.
- Valores entre 0 y 100.
- Claves de dimensiones únicas y relacionadas con la tabla de hechos.
- Script estático: `python scripts/validate_powerbi_project.py`.

La validación estática no sustituye abrir el PBIP, actualizar el origen y comprobar las medidas en Power BI Desktop.

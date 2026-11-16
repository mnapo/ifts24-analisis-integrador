# Modelo de datos

## Tema y alcance

El modelo compara Argentina, Brasil, Chile y Uruguay durante 2024 mediante dos indicadores públicos del Banco Mundial: uso de Internet y desempeño estadístico (SPI).

La unidad de análisis es una observación por país e indicador. El CSV contiene 8 filas.

## Fuente

- World Bank Open Data: https://data.worldbank.org/
- Uso de Internet: https://data.worldbank.org/indicator/IT.NET.USER.ZS
- Puntaje general SPI: https://data.worldbank.org/indicator/IQ.SPI.OVRL
- API de indicadores: https://datahelpdesk.worldbank.org/knowledgebase/articles/898581-api-basic-call-structures

Los valores del CSV se expresan con un decimal. Los valores publicados por la fuente pueden tener mayor precisión; el redondeo se aplica únicamente para la presentación comparativa.

## Diccionario de datos

| Campo | Tipo | Descripción |
|---|---|---|
| country_code | Texto | Código ISO3 del país |
| country | Texto | Nombre del país |
| indicator_code | Texto | Código oficial del indicador |
| indicator_name | Texto | Nombre descriptivo |
| year | Entero | Año de referencia (2024) |
| value | Decimal | Valor observado |
| unit | Texto | Unidad de medida |
| source | Texto | Fuente de los datos |

## Modelo semántico

### Tabla de hechos: FactIndicadores

Granularidad: una fila por país, indicador y año. Contiene el valor observado y las claves de las dimensiones.

### Dimensión Paises

Una fila por país. Clave: CodigoPais.

### Dimensión Indicadores

Una fila por indicador y unidad. Clave: CodigoIndicador.

### Relaciones

- Paises[CodigoPais] (1) → FactIndicadores[CodigoPais] (*).
- Indicadores[CodigoIndicador] (1) → FactIndicadores[CodigoIndicador] (*).

Ambas relaciones usan filtrado unidireccional desde las dimensiones hacia la tabla de hechos.

No se incorpora una dimensión calendario porque el alcance de esta versión es una fotografía comparativa de un único año (2024), no una serie temporal.

## Preparación y controles

Power Query:
1. Obtiene el CSV desde el repositorio mediante Web.Contents.
2. Interpreta la primera fila como encabezados.
3. Asigna texto a claves, nombres, unidad y fuente.
4. Asigna entero a año y decimal a valor.
5. Elimina espacios laterales en campos de texto.
6. Las dimensiones se derivan mediante selección de columnas y eliminación de duplicados.

Controles:
- 8 filas, 4 países y 2 indicadores.
- No se admiten valores vacíos ni duplicados por combinación país-indicador-año.
- Año de referencia único: 2024.
- Valores dentro de los rangos esperados: Internet 0–100; SPI 0–100.

## Interpretación

Los dos indicadores son escalas porcentuales o puntuaciones de 0 a 100, pero miden fenómenos distintos. No deben sumarse ni compararse directamente entre sí. Se comparan países dentro de cada indicador.

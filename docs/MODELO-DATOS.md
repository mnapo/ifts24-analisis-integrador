# Modelo de datos

## Grano

La unidad analítica es país/año. Las fuentes se conservan separadas durante la preparación para evitar duplicar registros al combinar indicadores con distinta granularidad.

## Tablas

### DimPais

- `iso3` (clave)
- `pais`

### DimAnio

- `anio` (clave)

### FactWDI

- `iso3`
- `anio`
- `codigo_indicador`
- `indicador`
- `valor`

Clave lógica: `iso3 + anio + codigo_indicador`.

### FactOxCGRTDiario

- `iso3`
- `fecha`
- `anio`
- índices diarios disponibles en la fuente.

Clave lógica: `iso3 + fecha`.

### FactOxCGRTAnual

- `iso3`
- `anio`
- `dias_observados`
- promedios anuales de los índices seleccionados.

Clave lógica: `iso3 + anio`.

## Relaciones

- DimPais 1:N FactWDI, FactOxCGRTDiario y FactOxCGRTAnual.
- DimAnio 1:N FactWDI y FactOxCGRTAnual.
- FactOxCGRTDiario se relaciona con DimAnio por el año derivado de la fecha.

En Power BI, mantener WDI en formato largo permite filtrar por indicador sin crear una columna física por variable. Para visualizaciones que comparen métricas, crear medidas específicas.

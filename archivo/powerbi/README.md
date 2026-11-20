# IndicadoresLatam — Proyecto Power BI

Proyecto PBIP/TMDL para comparar Argentina, Brasil, Chile y Uruguay en 2024 usando indicadores de World Bank Open Data.

## Abrir
1. Abrir `IndicadoresLatam.pbip` con Power BI Desktop actualizado.
2. Actualizar el origen Web y comprobar las consultas.
3. Verificar relaciones y medidas.
4. Completar visualizaciones siguiendo `docs/POWER-BI.md`.
5. Guardar como `informe-indicadores-regionales.pbix`.

## Modelo
- FactIndicadores: observación por país, indicador y año.
- Paises: dimensión de países.
- Indicadores: dimensión de indicadores.
- Relaciones uno-a-muchos desde ambas dimensiones a la tabla de hechos.

## Medidas DAX
Ocho medidas: Valor del Indicador, Promedio Regional, Brecha vs. Promedio, Ranking País, Países Analizados, Indicadores Analizados, País Líder y Valor del Líder. Las medidas comparativas requieren un indicador seleccionado y no suman unidades diferentes.

## Validación
`python scripts/validate_powerbi_project.py`

El PBIP es el proyecto fuente, no un PBIX. El PBIX debe guardarse desde Power BI Desktop.

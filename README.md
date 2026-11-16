# Análisis Integrador — Indicadores de desarrollo en América Latina

Proyecto académico para el Trabajo Final de Análisis y procesamiento de datos. Compara Argentina, Brasil, Chile y Uruguay mediante indicadores económicos y sociales para 2010–2024.

## Dataset

Archivo central: `public/data/indicadores-banco-mundial.csv`.

- 4 países × 4 indicadores × 15 años × 41/42 observaciones por combinación = 10.000 registros. El campo `observation_id` identifica cada observación sintética.
- PIB per cápita (US$ corrientes): `NY.GDP.PCAP.CD`.
- Inflación anual: `FP.CPI.TOTL.ZG`.
- Desempleo total: `SL.UEM.TOTL.ZS`.
- Uso de Internet: `IT.NET.USER.ZS`.

**Importante:** los 10.000 registros son sintéticos y autogenerados para practicar procesamiento, modelado y visualización. No son datos oficiales ni estimaciones publicadas por el Banco Mundial. El campo `source` identifica esta condición en cada fila.

## Proyecto Power BI

Abrir `powerbi/IndicadoresLatam.pbip` en Power BI Desktop. Incluye modelo semántico y visualizaciones de comparación por país y evolución temporal. El dashboard web se simplificó a filtros y gráficos, sin buscador ni tabla de detalle. Actualizar el modelo y comprobar los visuales en Desktop antes de guardar/exportar el PBIX.

## Validación

Ejecutar `python scripts/validate_powerbi_project.py` para validar estáticamente el CSV, el modelo y la estructura de visualizaciones.

## Documentación

- `docs/MODELO-DATOS.md`
- `docs/POWER-BI.md`
- `docs/RESUMEN-EJECUTIVO.md`
- `docs/ESTADO-ENTREGA.md`

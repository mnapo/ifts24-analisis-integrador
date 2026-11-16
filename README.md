# Análisis Integrador — Indicadores de desarrollo en América Latina

Proyecto académico individual para el Trabajo Final de Desarrollo de un Reporte en Power BI. El análisis compara a Argentina, Brasil, Chile y Uruguay mediante indicadores públicos del Banco Mundial correspondientes a 2024.

## Pregunta de análisis

¿Cómo se posicionan estos cuatro países en acceso a Internet y desempeño de sus sistemas estadísticos?

## Fuente y dataset

Fuente primaria: [World Bank Open Data](https://data.worldbank.org/), con licencia de datos CC BY 4.0 según las fichas de los indicadores.

Dataset Power BI: `public/data/indicadores-banco-mundial.csv` (8 observaciones: 4 países × 2 indicadores).

Indicadores:
- `IT.NET.USER.ZS`: personas que utilizan Internet (% de la población).
- `IQ.SPI.OVRL`: Statistical Performance Indicators (SPI), puntaje general de 0 a 100.

El CSV contiene valores publicados para 2024, redondeados a un decimal para facilitar la comparación. No es una serie temporal: las conclusiones se limitan a una comparación transversal de ese año.

El archivo anterior `public/data/movimientos.csv` se conserva únicamente para no romper el dashboard Next.js financiero preexistente. No forma parte del análisis final de Power BI.

## Proyecto web complementario

El dashboard Next.js existente continúa siendo una demostración independiente del dataset financiero sintético anterior. El trabajo final de Power BI utiliza exclusivamente el nuevo CSV del Banco Mundial.

## Power BI

Abrir `powerbi/Finanzas.pbip` con Power BI Desktop. El nombre interno Finanzas se conserva del prototipo inicial; el contenido del modelo fue adaptado a indicadores regionales.

El modelo PBIP/TMDL incluye:
- Tabla de hechos `FactIndicadores`.
- Dimensión `Paises`.
- Dimensión `Indicadores`.
- Relaciones muchos-a-uno desde la tabla de hechos.
- Medidas DAX para valor, promedio regional, brecha y ranking.

Power Query carga el CSV publicado en GitHub, promueve encabezados, asigna tipos y limpia textos.

## Páginas del reporte

1. Portada: tema, autor e institución (completar datos personales).
2. Comparación regional: tarjetas de indicadores, barras por país, tabla comparativa y segmentadores.

Al ser un trabajo individual, se requiere una página informativa de análisis, además de la portada. Las visualizaciones deben completarse y probarse en Power BI Desktop.

## Validación

Ejecutar:

```bash
python scripts/validate_powerbi_project.py
```

La validación comprueba estructura, esquema, integridad y valores del CSV. No ejecuta el motor de Power BI.

## Entrega

- `powerbi/informe-indicadores-regionales.pbix`: pendiente de guardar desde Power BI Desktop.
- Documentación y resumen ejecutivo en PDF: exportar los Markdown de `docs/` a PDF.
- Completar el nombre del autor en la portada antes de exportar.

## Estructura

```text
public/data/indicadores-banco-mundial.csv
powerbi/Finanzas.pbip
powerbi/Finanzas.SemanticModel/definition/
powerbi/Finanzas.Report/definition/
docs/
scripts/validate_powerbi_project.py
```

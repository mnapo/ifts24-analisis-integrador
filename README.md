# Análisis Integrador — Indicadores de desarrollo en América Latina

Proyecto académico individual para el Trabajo Final de Desarrollo de un Reporte en Power BI. Compara Argentina, Brasil, Chile y Uruguay mediante dos indicadores públicos del Banco Mundial para 2024.

## Dashboard Next.js

La aplicación web presenta el mismo dataset del proyecto Power BI:
- Promedios regionales de acceso a Internet y desempeño estadístico.
- País líder en cada indicador.
- Gráficos comparativos por país.
- Filtro por país y búsqueda.
- Tabla de observaciones y exportación CSV.
- Referencias a las fuentes del Banco Mundial.

Ejecutar localmente con `npm install` y `npm run dev`.

## Fuente y dataset

Fuente: [World Bank Open Data](https://data.worldbank.org/).

CSV: `public/data/indicadores-banco-mundial.csv` (8 observaciones: 4 países × 2 indicadores).

- `IT.NET.USER.ZS`: personas que utilizan Internet (% de la población).
- `IQ.SPI.OVRL`: Statistical Performance Indicators, puntaje general de 0 a 100.

El dashboard Next.js y el proyecto Power BI consumen este mismo CSV. Los datos del antiguo dataset financiero sintético ya no forman parte del dashboard.

## Proyecto Power BI

Abrir `powerbi/Finanzas.pbip` con Power BI Desktop. El modelo contiene FactIndicadores, Paises e Indicadores, con relaciones y medidas DAX. Ver `docs/POWER-BI.md`.

## Documentación y entrega

- `docs/MODELO-DATOS.md`
- `docs/POWER-BI.md`
- `docs/RESUMEN-EJECUTIVO.md`
- `docs/ESTADO-ENTREGA.md`

El PBIX y los PDF finales deben generarse y validarse desde Power BI Desktop / exportación documental.

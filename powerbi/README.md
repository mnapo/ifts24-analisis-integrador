# Proyecto Power BI — Indicadores regionales

El proyecto fuente PBIP/TMDL implementa un modelo semántico para analizar dos indicadores del Banco Mundial en Argentina, Brasil, Chile y Uruguay durante 2024.

## Abrir

1. Descargar o clonar el repositorio.
2. Abrir `Finanzas.pbip` con Power BI Desktop actualizado.
3. Configurar el origen Web como anónimo si se solicita.
4. Actualizar datos y comprobar las consultas.
5. Completar las visualizaciones según `docs/POWER-BI.md`.
6. Guardar como `informe-indicadores-regionales.pbix`.

## Fuente y mapeo

CSV: `public/data/indicadores-banco-mundial.csv`.

- `country_code` → FactIndicadores[CodigoPais] / Paises[CodigoPais]
- `country` → FactIndicadores[Pais] / Paises[País]
- `indicator_code` → FactIndicadores[CodigoIndicador] / Indicadores[CodigoIndicador]
- `indicator_name` → FactIndicadores[Indicador] / Indicadores[NombreIndicador]
- `year` → FactIndicadores[Año]
- `value` → FactIndicadores[Valor]
- `unit` → FactIndicadores[Unidad] / Indicadores[Unidad]
- `source` → FactIndicadores[Fuente]

## Modelo semántico

- FactIndicadores: tabla de hechos, granularidad país-indicador-año.
- Paises: dimensión de cuatro países.
- Indicadores: dimensión de dos indicadores.
- Dos relaciones uno-a-muchos unidireccionales hacia FactIndicadores.
- Año de referencia: 2024.

## Medidas DAX

Valor del Indicador, Promedio Regional, Brecha vs. Promedio, Ranking País, Países Analizados e Indicadores Analizados.

## Power Query

FactIndicadores tipa los datos, normaliza texto y filtra registros incompletos o valores fuera del rango 0–100. Las dimensiones seleccionan sus atributos, recortan espacios, eliminan duplicados y ordenan por clave.

## Validación

Ejecutar:

```bash
python scripts/validate_powerbi_project.py
```

La comprobación es estática y no reemplaza la actualización en Power BI Desktop.

## PBIP y PBIX

PBIP/TMDL es el proyecto fuente versionable, no un PBIX binario. El PBIX final debe guardarse desde Power BI Desktop después de completar y verificar las visualizaciones.

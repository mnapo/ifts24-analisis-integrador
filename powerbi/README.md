# Proyecto Power BI — Indicadores regionales

El proyecto fuente está en formato PBIP + TMDL. Se conserva el nombre interno `Finanzas` por continuidad con el prototipo inicial; el modelo y el informe fueron adaptados al análisis de indicadores del Banco Mundial.

## Abrir

1. Descargar o clonar el repositorio completo.
2. Abrir `powerbi/Finanzas.pbip` con Power BI Desktop actualizado.
3. Configurar el origen Web como anónimo si se solicita.
4. Actualizar datos y revisar las consultas.
5. Crear las visualizaciones detalladas en `docs/POWER-BI.md`.
6. Guardar como `powerbi/informe-indicadores-regionales.pbix`.

## Dataset y modelo

CSV: `public/data/indicadores-banco-mundial.csv`.

- FactIndicadores: 8 observaciones.
- Paises: 4 países.
- Indicadores: 2 indicadores.
- Relaciones: FactIndicadores hacia Paises e Indicadores.
- Año de referencia: 2024.

## Medidas DAX

Valor del Indicador, Promedio Regional, Brecha vs. Promedio, Ranking País, Países Analizados e Indicadores Analizados.

## Power Query

Las particiones M leen el CSV publicado en GitHub, promueven encabezados, asignan tipos y derivan las dimensiones con eliminación de duplicados.

## Validación

```bash
python scripts/validate_powerbi_project.py
```

La validación es estática. No sustituye la actualización y comprobación en Power BI Desktop.

## PBIP y PBIX

PBIP/TMDL es el proyecto fuente textual versionable. No es un PBIX binario. El archivo PBIX final debe guardarse desde Power BI Desktop después de completar las visualizaciones.

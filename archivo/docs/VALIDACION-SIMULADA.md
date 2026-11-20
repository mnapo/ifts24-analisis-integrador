# Validación del dataset y del proyecto Power BI

**Dataset:** `public/data/indicadores-banco-mundial.csv`  
**Fuente:** World Bank Open Data  
**Cobertura:** 4 países × 2 indicadores × año 2024.

## 1. Integridad esperada

| Control | Resultado esperado |
|---|---:|
| Filas | 8 |
| Países | 4 |
| Indicadores | 2 |
| Años | 2024 |
| Valores nulos | 0 |
| Claves país-indicador-año duplicadas | 0 |

## 2. Valores de referencia

| País | Internet (%) | SPI (0–100) |
|---|---:|---:|
| Argentina | 89,7 | 80,4 |
| Brasil | 84,5 | 82,3 |
| Chile | 95,6 | 89,4 |
| Uruguay | 92,0 | 80,1 |

Los valores se redondearon a un decimal para el dataset de presentación. Las fichas oficiales son las referencias para la precisión y futuras revisiones.

## 3. Validación automatizada

Ejecutar desde la raíz:

```bash
python scripts/validate_powerbi_project.py
```

El script verifica archivos PBIP/TMDL, estructura del CSV, unicidad de claves, tipos, rangos y valores de referencia.

## 4. Validación pendiente en Power BI Desktop

La validación estática no ejecuta el motor de Power BI. Antes de entregar:
1. Abrir el PBIP.
2. Actualizar Power Query.
3. Confirmar las dimensiones y relaciones.
4. Revisar las seis medidas DAX.
5. Construir y probar las dos páginas.
6. Guardar el PBIX y comprobar que vuelve a abrir correctamente.

No se considera generado ni validado un PBIX hasta completar estos pasos.

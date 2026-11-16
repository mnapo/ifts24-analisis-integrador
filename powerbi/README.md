# Proyecto Power BI

El proyecto fuente está en formato **PBIP + TMDL**. Las medidas DAX ya están declaradas en el modelo semántico, dentro de `Finanzas.SemanticModel/definition/tables/Movimientos.tmdl`. El informe contiene una página inicial; las visualizaciones todavía deben configurarse en Power BI Desktop.

## Abrir

1. Descargar o clonar el repositorio completo.
2. Abrir `powerbi/Finanzas.pbip` con Power BI Desktop actualizado.
3. Si Power BI solicita cargar datos, aceptar la actualización. La tabla `Movimientos` obtiene el CSV publicado en GitHub mediante Power Query `Web.Contents`.
4. Comprobar las medidas en el panel Datos/Modelo.
5. Para obtener el archivo binario solicitado, usar **Archivo → Guardar como → Archivo de Power BI (.pbix)** y guardarlo como `powerbi/informe-financiero.pbix`.

## Modelo incluido

- `Movimientos`: 500 registros del CSV remoto.
- `Calendario`: calendario diario del año 2025.
- Relación activa muchos-a-uno desde Movimientos hacia Calendario.
- Medidas: Total Ingresos, Total Gastos, Balance Neto, Cantidad de Movimientos, Promedio por Movimiento, Cantidad de Ingresos y Cantidad de Gastos.

## Actualización del dataset

El origen se encuentra en:

`https://raw.githubusercontent.com/mnapo/ifts24-analisis-integrador/main/public/data/movimientos.csv`

Al modificar el CSV, actualizar los datos desde Power BI Desktop. El modelo usa importación (Import), no DirectQuery.

## Validación

Ejecutar desde la raíz del repositorio:

```bash
python scripts/validate_powerbi_project.py
```

La validación automatizada comprueba la estructura, el esquema del CSV, las medidas declaradas y los totales de control. No reemplaza la apertura y actualización del proyecto en Power BI Desktop.

## Limitación de formato

PBIP/TMDL es el formato fuente versionable y editable. Microsoft documenta que la conversión PBIP ↔ PBIX se realiza desde Power BI Desktop (Guardar como); no existe un conversor oficial de línea de comandos que genere un PBIX binario válido a partir de TMDL sin Desktop.

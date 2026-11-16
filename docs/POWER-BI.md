# Procesamiento y visualización en Power BI

Esta guía documenta el flujo recomendado para importar el dataset de movimientos financieros y construir un informe reproducible en Power BI Desktop.

## 1. Importar el CSV

1. Abrir Power BI Desktop.
2. Seleccionar **Obtener datos → Texto/CSV**.
3. Elegir el archivo `public/data/movimientos.csv` (o la ubicación real del CSV en el proyecto).
4. Revisar delimitador, codificación y vista previa.
5. Seleccionar **Transformar datos** para abrir Power Query.

## 2. Transformar con Power Query

- Asignar tipos de datos correctos a fecha, importe, tipo y categoría.
- Aplicar limpieza de espacios en campos de texto.
- Normalizar categorías y valores de tipo.
- Revisar nulos, errores de conversión y duplicados.
- Confirmar que no se altere accidentalmente el signo o valor de los importes.
- Cerrar y aplicar.

Los nombres de columnas de los ejemplos siguientes son nombres lógicos. Reemplazarlos por los nombres exactos que tenga el CSV si difieren.

## 3. Crear tabla calendario

En **Modelado → Nueva tabla**, crear una tabla calendario que cubra el rango de fechas del dataset:

```dax
Calendario =
CALENDAR(
    MIN(Movimientos[Fecha]),
    MAX(Movimientos[Fecha])
)
```

Agregar columnas útiles para segmentar:

```dax
Año = YEAR(Calendario[Date])
Mes = FORMAT(Calendario[Date], "MMMM")
NúmeroMes = MONTH(Calendario[Date])
AñoMes = FORMAT(Calendario[Date], "YYYY-MM")
```

Ordenar `Calendario[Mes]` por `Calendario[NúmeroMes]` y marcar Calendario como tabla de fechas. Si la columna generada por CALENDAR se llama `Date`, usar ese nombre en la relación o renombrarla a `Fecha`.

Crear la relación uno-a-muchos entre la fecha del calendario y la fecha de los movimientos.

## 4. Medidas DAX

Las siguientes medidas suponen que la tabla se llama `Movimientos`, que el importe está en `Importe` y que el campo `Tipo` contiene exactamente los valores `Ingreso` y `Gasto`. Adaptar los nombres y etiquetas a los valores reales del CSV.

```dax
Total Ingresos =
CALCULATE(
    SUM(Movimientos[Importe]),
    Movimientos[Tipo] = "Ingreso"
)

Total Gastos =
CALCULATE(
    SUM(Movimientos[Importe]),
    Movimientos[Tipo] = "Gasto"
)

Balance Neto =
[Total Ingresos] - [Total Gastos]

Cantidad de Movimientos =
COUNTROWS(Movimientos)

Promedio por Movimiento =
AVERAGE(Movimientos[Importe])
```

Formatear ingresos, gastos, balance y promedio como moneda. La medida de promedio considera el importe almacenado; si el informe requiere promedio exclusivo de gastos, crear una medida filtrada por tipo.

## 5. Diseño del informe

Propuesta de páginas y visualizaciones:

### Resumen

- Tarjetas: Total Ingresos, Total Gastos, Balance Neto y Cantidad de Movimientos.
- Gráfico de líneas: evolución mensual de ingresos y gastos.
- Gráfico de dona: distribución de gastos por categoría.
- Segmentadores: período y categoría.

### Análisis de gastos

- Barras: gastos por categoría.
- Columnas: gastos por mes.
- Tabla: detalle de movimientos.
- Segmentadores: categoría, período y tipo.

### Análisis temporal

- Evolución del balance neto.
- Comparación de ingresos y gastos por mes.
- Identificación de períodos con mayor gasto.

## 6. Validación cruzada

1. Comparar el número de filas importadas con el CSV.
2. Comparar ingresos, gastos y balance con los valores calculados desde el archivo fuente.
3. Repetir la comparación aplicando los mismos filtros de fecha y categoría en Power BI y en el dashboard Next.js.
4. Verificar que los segmentadores afecten a las visualizaciones esperadas.

## 7. Entrega

Guardar el informe como `powerbi/informe-financiero.pbix`. Incluir en la entrega:

- Archivo PBIX.
- Capturas de las páginas del informe.
- Descripción breve de las transformaciones aplicadas.
- Medidas DAX utilizadas.
- Conclusiones basadas en los indicadores.

El archivo PBIX y las capturas deben agregarse una vez que el informe se haya construido y validado en Power BI Desktop. Esta documentación no implica que ese entregable ya esté generado.

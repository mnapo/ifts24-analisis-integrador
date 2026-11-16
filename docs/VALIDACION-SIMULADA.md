# Validación simulada del modelo Power BI

**Fecha:** 16/11/2026  
**Dataset:** `public/data/movimientos.csv`  
**Tipo de prueba:** validación lógica y de consistencia sobre el CSV; simulación de resultados esperados en Power BI.

> Esta prueba no abre ni ejecuta Power BI Desktop y no valida un archivo PBIX. No existe todavía un PBIX generado. Los resultados siguientes se calcularon directamente sobre el CSV para anticipar los valores que deberían devolver las medidas DAX una vez importado el archivo.

## 1. Integridad del dataset

| Control | Resultado | Estado |
|---|---:|---|
| Filas de datos | 500 | OK |
| Columnas | 7 | OK |
| IDs únicos | 500 | OK |
| IDs faltantes | 0 | OK |
| Fechas vacías | 0 | OK |
| Importes vacíos o no numéricos | 0 | OK |
| Importes no positivos | 0 | OK |
| Tipos distintos de Ingreso/Gasto | 0 | OK |
| Registros fuera de 2025 | 0 | OK |

Columnas: `id`, `fecha`, `tipo`, `categoria`, `descripcion`, `importe`, `medio_pago`.

## 2. Distribución por tipo

| Tipo | Movimientos |
|---|---:|
| Ingreso | 88 |
| Gasto | 412 |
| **Total** | **500** |

## 3. Valores de referencia para las medidas

Importes expresados en pesos argentinos (ARS).

| Indicador | Valor esperado |
|---|---:|
| Total Ingresos | $34.766.900 |
| Total Gastos | $19.607.200 |
| Balance Neto | $15.159.700 |
| Cantidad de Movimientos | 500 |
| Promedio por Movimiento | $52.874,20 |

Comprobación aritmética: $34.766.900 - $19.607.200 = $15.159.700.

## 4. Gastos por categoría

| Categoría | Total |
|---|---:|
| Vivienda | $9.341.500 |
| Supermercado | $1.907.100 |
| Indumentaria | $1.828.000 |
| Educación | $1.806.800 |
| Servicios | $1.116.100 |
| Entretenimiento | $1.106.400 |
| Restaurantes | $984.400 |
| Salud | $792.400 |
| Transporte | $724.500 |
| **Total gastos** | **$19.607.200** |

La suma de categorías coincide con el total de gastos.

## 5. Pruebas funcionales previstas en Power BI

| Prueba | Resultado esperado |
|---|---|
| Filtrar Tipo = Ingreso | $34.766.900 y 88 filas |
| Filtrar Tipo = Gasto | $19.607.200 y 412 filas |
| Sin filtros | Balance de $15.159.700 |
| Filtrar una categoría de gasto | El total de gastos se limita a esa categoría |
| Filtrar un mes | Las tarjetas y gráficos reflejan únicamente ese mes |
| Seleccionar período completo | 500 movimientos en el año 2025 |

## 6. Modelo y medidas

La tabla de hechos se denomina `Movimientos`. La tabla calendario debe relacionarse en una relación uno-a-muchos desde `Calendario[Date]` hacia `Movimientos[fecha]`.

Medidas de referencia:

```dax
Total Ingresos =
CALCULATE(
    SUM(Movimientos[importe]),
    Movimientos[tipo] = "Ingreso"
)

Total Gastos =
CALCULATE(
    SUM(Movimientos[importe]),
    Movimientos[tipo] = "Gasto"
)

Balance Neto =
[Total Ingresos] - [Total Gastos]

Cantidad de Movimientos =
COUNTROWS(Movimientos)

Promedio por Movimiento =
AVERAGE(Movimientos[importe])
```

## 7. Resultado de la simulación

**Resultado lógico: APROBADO.** El CSV presenta 500 registros consistentes y los totales de referencia cierran aritméticamente. Las medidas propuestas son compatibles con el esquema y la codificación de importes positivos junto con una columna de tipo.

**Resultado Power BI Desktop: PENDIENTE.** Para convertir esta simulación en una validación real todavía se debe:

1. Importar el CSV en Power BI Desktop.
2. Crear la tabla calendario y su relación.
3. Crear las medidas DAX.
4. Construir las visualizaciones y aplicar los filtros de prueba.
5. Comparar los resultados con esta hoja.
6. Guardar el informe como `powerbi/informe-financiero.pbix` y comprobar que abre correctamente.

No interpretar el estado lógico aprobado como una certificación del archivo PBIX.

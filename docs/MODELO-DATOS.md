# Modelo de datos

## Caso de estudio

El dataset representa movimientos financieros personales ficticios. Cada fila corresponde a una operación individual y permite estudiar ingresos, gastos, distribución por categorías y evolución temporal.

Los 500 registros son sintéticos y fueron preparados para el trabajo práctico. No contienen información bancaria ni datos personales reales.

## Granularidad

**Una fila = un movimiento financiero.**

El modelo debe conservar el detalle de cada operación. Los indicadores agregados se calculan en Power BI y no deben reemplazar el CSV de origen.

## Preparación y controles

Al importar el CSV:

1. Verificar que cada movimiento tenga un identificador único, si el archivo incluye ese campo.
2. Convertir la fecha al tipo **Fecha**.
3. Convertir el importe a tipo **Número decimal fijo** o **Moneda**, según la configuración regional.
4. Comprobar que los importes sean positivos y que el sentido económico esté expresado por el campo de tipo (ingreso/gasto), si así está definido en el archivo.
5. Normalizar nombres de categorías y tipos para evitar duplicados por diferencias de mayúsculas o espacios.
6. Revisar valores nulos, filas duplicadas y registros fuera del período esperado.
7. Comparar el total de filas importadas con el archivo CSV original.

> Importante: conservar los nombres y valores reales de las columnas del CSV. Los pasos describen controles de calidad, no una modificación del dataset.

## Modelo recomendado

Para el alcance actual alcanza con una tabla de movimientos y una tabla calendario relacionada por fecha. La tabla calendario permite analizar tendencias por año, trimestre, mes y día.

Relación recomendada:

- `Calendario[Fecha]` (uno) → `Movimientos[Fecha]` (muchos).
- Dirección de filtro simple desde Calendario hacia Movimientos.

Si el CSV no contiene una columna de fecha con ese nombre, adaptar la relación al nombre real de la columna.

## Validación

Antes de diseñar el informe, comprobar:

- Cantidad total de movimientos.
- Total de ingresos.
- Total de gastos.
- Balance neto (ingresos menos gastos).
- Totales por categoría.
- Evolución mensual.

Los resultados de Power BI y del dashboard web deben coincidir para los mismos filtros y período.

# Procesamiento y visualización en Power BI

## Origen

`public/data/indicadores-banco-mundial.csv`: 240 observaciones sintéticas (4 países × 4 indicadores × 15 años, 2010–2024), identificadas por `observation_id`. Los valores son autogenerados con fines académicos y no representan datos oficiales del Banco Mundial. El campo `source` deja constancia de ello.

## Power Query

Las particiones leen el CSV UTF-8 publicado en GitHub con `QuoteStyle.Csv`. FactIndicadores promueve encabezados, tipa columnas, recorta textos y descarta filas incompletas o valores negativos. No se usa un filtro universal de 0 a 100 porque el PIB per cápita se expresa en dólares y puede superar ese rango.

## Modelo semántico

FactIndicadores es la tabla de hechos. Paises e Indicadores son dimensiones relacionadas 1:N con filtrado unidireccional. La granularidad es país–indicador–año: una observación por combinación. `observation_id` identifica cada fila de forma única.

## Medidas DAX

Las medidas calculan valor promedio, promedio regional, brecha, ranking, país líder, valor del líder, países, indicadores, observaciones y años analizados. Los indicadores heterogéneos no se suman entre sí.

## Visualizaciones incluidas

### Portada · Panorama regional
- Cuatro tarjetas: países analizados, indicadores, observaciones y años.
- Segmentadores desplegables para indicador, país y año.
- Gráfico de barras agrupadas para comparar países según el indicador seleccionado.
- Gráfico de líneas para evolución temporal por país.
- Aviso visible sobre el carácter sintético del dataset.

### Evolución y detalle
- Segmentadores por indicador y país.
- Serie temporal 2010–2024 por país.
- Tabla de detalle con país, año, indicador, valor, unidad y fuente.
- Aviso visible sobre el carácter sintético del dataset.

Los valores de distintos indicadores se analizan de forma separada para no mezclar unidades o escalas.

## Apertura y entrega

Abrir `powerbi/IndicadoresLatam.pbip` en Power BI Desktop, permitir la actualización del origen si se solicita, revisar credenciales/permisos de Web, actualizar datos y comprobar que todas las visualizaciones rendericen. Después guardar una copia PBIX desde Desktop y exportar a PDF.

El PBIP versiona la definición del informe y el modelo; la validación estática no garantiza por sí sola la apertura correcta del motor ni la representación final de cada visual.

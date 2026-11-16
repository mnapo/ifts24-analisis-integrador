# Procesamiento y visualización en Power BI

## 1. Origen

El modelo utiliza `public/data/indicadores-banco-mundial.csv`, con datos de Argentina, Brasil, Chile y Uruguay para 2024. Los indicadores son `IT.NET.USER.ZS` (uso de Internet, porcentaje de población) y `IQ.SPI.OVRL` (puntaje general SPI).

## 2. Traducción del dataset

| CSV | Modelo semántico |
|---|---|
| country_code | FactIndicadores[CodigoPais], Paises[CodigoPais] |
| country | FactIndicadores[Pais], Paises[País] |
| indicator_code | FactIndicadores[CodigoIndicador], Indicadores[CodigoIndicador] |
| indicator_name | FactIndicadores[Indicador], Indicadores[NombreIndicador] |
| year | FactIndicadores[Año] |
| value | FactIndicadores[Valor] |
| unit | FactIndicadores[Unidad], Indicadores[Unidad] |
| source | FactIndicadores[Fuente] |

## 3. Power Query

Las tres consultas usan `Web.Contents` sobre el CSV de GitHub, codificación UTF-8 y delimitador coma. La consulta de hechos promueve encabezados, tipa los ocho campos, normaliza texto, y filtra filas sin claves o atributos obligatorios y valores fuera de 0–100. Las dimensiones derivan sus columnas del mismo CSV, aplican recorte de espacios, eliminan duplicados y ordenan por su clave.

## 4. Modelo semántico y relaciones

- **FactIndicadores:** tabla de hechos con una observación por país, indicador y año.
- **Paises:** dimensión con clave CodigoPais.
- **Indicadores:** dimensión con clave CodigoIndicador y atributos NombreIndicador y Unidad.

Relaciones uno-a-muchos y unidireccionales desde Paises e Indicadores hacia FactIndicadores. No se requiere dimensión calendario porque todos los registros son de 2024.

## 5. Medidas DAX

```dax
Valor del Indicador =
SUM(FactIndicadores[Valor])

Promedio Regional =
AVERAGEX(ALL(Paises), [Valor del Indicador])

Brecha vs. Promedio =
[Valor del Indicador] - [Promedio Regional]

Ranking País =
RANKX(
    ALL(Paises[País]),
    [Valor del Indicador],
    ,
    DESC,
    DENSE
)

Países Analizados =
DISTINCTCOUNT(FactIndicadores[CodigoPais])

Indicadores Analizados =
DISTINCTCOUNT(FactIndicadores[CodigoIndicador])
```

## 6. Diseño del reporte

### Página 1 — Portada

Título, subtítulo, autor, institución IFTS 24 y fuente World Bank Open Data.

### Página 2 — Comparación regional

- Tarjetas de países e indicadores analizados.
- Gráfico de barras de uso de Internet por país.
- Gráfico de barras de puntaje SPI por país.
- Tabla con país, indicador, año y valor.
- Segmentadores por país e indicador.

Los indicadores se muestran en visualizaciones separadas para no mezclar unidades.

## 7. Narrativa

Chile presenta el mayor valor dentro del grupo en ambos indicadores. Brasil registra el menor uso de Internet. Para SPI, Brasil supera levemente a Argentina y Uruguay, mientras Chile lidera. Los datos describen una comparación transversal de 2024; no prueban causalidad ni permiten inferir tendencias temporales.

## 8. Abrir y completar

1. Abrir `powerbi/Finanzas.pbip` con Power BI Desktop actualizado.
2. Configurar el origen Web como anónimo si se solicita.
3. Actualizar datos y comprobar las tres consultas.
4. Revisar las dos relaciones y las seis medidas.
5. Crear las visualizaciones en las dos páginas.
6. Probar filtros, promedios y ranking por separado para ambos indicadores.
7. Guardar como `powerbi/informe-indicadores-regionales.pbix`.

## 9. PBIP/TMDL y entrega

Las tablas, columnas, particiones Power Query, relaciones y medidas DAX se mantienen en archivos TMDL versionables. El PBIP es el proyecto fuente, no un PBIX final. El archivo PBIX debe guardarse desde Power BI Desktop; documentación y resumen ejecutivo deben exportarse a PDF.

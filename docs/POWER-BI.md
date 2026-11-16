# Procesamiento y visualización en Power BI

## 1. Origen de datos

El proyecto utiliza `public/data/indicadores-banco-mundial.csv`, una extracción de World Bank Open Data para Argentina, Brasil, Chile y Uruguay en 2024.

El PBIP utiliza Power Query (M) y `Web.Contents` para importar el CSV publicado en GitHub.

## 2. Power Query

La consulta principal:
- Lee CSV con codificación UTF-8 y delimitador coma.
- Promueve encabezados.
- Convierte claves y descripciones a texto.
- Convierte año a entero y valor a decimal.
- Recorta espacios de los campos de texto.

Las consultas `Paises` e `Indicadores` derivan dimensiones a partir del mismo origen, seleccionando sus columnas y quitando duplicados.

## 3. Modelo semántico

- FactIndicadores: tabla de hechos con 8 observaciones.
- Paises: dimensión de cuatro países.
- Indicadores: dimensión de dos indicadores.

Relaciones uno-a-muchos desde Paises e Indicadores hacia FactIndicadores. El filtrado es unidireccional.

No se utiliza calendario porque todos los registros pertenecen a 2024.

## 4. Medidas DAX

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

El contexto de filtro de Indicadores permite evaluar cada medida para Internet o SPI por separado.

## 5. Diseño del reporte (trabajo individual)

### Página 1 — Portada

- Título: Indicadores de desarrollo en América Latina.
- Subtítulo: Acceso a Internet y desempeño estadístico (2024).
- Autor: completar nombre y apellido.
- Institución: IFTS 24.
- Fuente: World Bank Open Data.

### Página 2 — Comparación regional

- Tarjetas: países analizados, indicadores y año.
- Gráfico de barras: porcentaje de población usuaria de Internet por país.
- Gráfico de barras: puntaje SPI por país.
- Tabla comparativa con país, indicador y valor.
- Segmentadores: indicador y país.

La página debe facilitar una comparación sin mezclar unidades. Se recomienda separar los gráficos por indicador.

## 6. Narrativa

1. Chile presenta el mayor valor en ambos indicadores dentro del grupo seleccionado.
2. En uso de Internet, Brasil registra el menor valor del grupo.
3. En SPI, Uruguay y Argentina muestran valores cercanos, por debajo de Brasil y Chile.
4. Los resultados describen diferencias observadas en 2024; no prueban causalidad ni permiten inferir tendencias históricas.

## 7. Abrir y completar el proyecto

1. Clonar o descargar el repositorio.
2. Abrir `powerbi/Finanzas.pbip` en Power BI Desktop actualizado.
3. Configurar las credenciales de origen como anónimo si Power BI las solicita para raw.githubusercontent.com.
4. Actualizar datos y revisar las consultas.
5. Verificar las dos relaciones y las seis medidas.
6. Crear las visualizaciones indicadas en las dos páginas.
7. Probar los segmentadores y los rankings para ambos indicadores.
8. Guardar como `powerbi/informe-indicadores-regionales.pbix`.

## 8. Alcance de PBIP/TMDL

PBIP/TMDL permite versionar en texto las definiciones del informe y del modelo semántico. Las tablas, columnas, particiones M, relaciones y medidas DAX están declaradas en archivos TMDL.

La estructura del proyecto se genera y mantiene de forma procedural/versionable, pero eso no equivale a un PBIX terminado. La apertura, actualización, creación final de visualizaciones y guardado del PBIX deben realizarse en Power BI Desktop.

## 9. Entrega

- Archivo PBIX validado.
- Documentación técnica en PDF.
- Resumen ejecutivo en PDF.

El PBIX y los PDF se consideran pendientes hasta que se generen y se compruebe su apertura.

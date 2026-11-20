# Metodología

## Pregunta de análisis

¿Cómo se relacionaron las respuestas gubernamentales frente a la pandemia de COVID-19 con la evolución económica y social de los países de América Latina y el Caribe?

## Hipótesis de trabajo

1. Una mayor rigurosidad de las medidas sanitarias podría asociarse con una mayor contracción económica en el corto plazo y con diferencias en la presión sanitaria.
2. La intensidad de la caída económica de 2020 podría relacionarse con las trayectorias de recuperación entre 2021 y 2023.
3. Las condiciones sanitarias previas a la pandemia podrían relacionarse con diferencias en los resultados observados durante la crisis.

Estas hipótesis describen asociaciones para explorar; no presuponen causalidad.

## Cobertura

- WDI: 2015–2023.
- OxCGRT: 2020–2022.
- Unidad de análisis: país/año.
- Países: 33 países de América Latina y el Caribe incluidos en `config/paises.json`.

## Fuentes y tratamiento

WDI se consulta mediante la API v2 del Banco Mundial. Se conservan los códigos originales de los indicadores y sus valores; los faltantes no se imputan.

OxCGRT utiliza el archivo nacional compacto de la versión final del dataset. Las observaciones diarias se filtran por país y período y se agregan mediante promedio aritmético anual para los índices seleccionados.

Los datos diarios no se interpretan como datos económicos. Las variables de movilidad no se atribuyen a OxCGRT porque no forman parte de esta fuente.

## Limitaciones

- La disponibilidad de cada indicador WDI varía por país y año.
- El promedio anual puede ocultar cambios de política dentro de un mismo año.
- Los indicadores agregados no permiten atribuir causalidad.
- Las diferencias de cobertura deben revisarse antes de comparar países.

## Reproducibilidad

Ejecutar `python scripts/etl.py`. El proceso descarga las fuentes originales en `data/raw/`, genera CSV procesados en `public/data/` y registra controles en `data/validation/summary.json`.

# Análisis Integrador — Dashboard financiero

Proyecto académico de análisis y visualización de datos que combina un dashboard web desarrollado con **Next.js** y un flujo de análisis en **Power BI**.

El caso de estudio utiliza movimientos financieros personales ficticios para explorar ingresos, gastos, categorías de consumo y evolución del saldo. El objetivo es convertir datos transaccionales en información clara y útil para la toma de decisiones cotidianas.

## Objetivos

- Construir un dataset tabular, consistente y reproducible.
- Explorar indicadores financieros mediante una interfaz web.
- Importar y transformar los datos en Power BI.
- Diseñar medidas e informes que permitan analizar hábitos de ingresos y gastos.
- Documentar el proceso, desde los datos originales hasta las visualizaciones.

## Diseño

La interfaz sigue una estética fintech clara: fondo blanco y grises suaves, azul petróleo como color principal, acentos verdes y tarjetas limpias con gráficos modernos. El dashboard es responsive y prioriza la lectura rápida de los indicadores.

## Dataset

El proyecto utiliza un archivo CSV con **500 movimientos ficticios**. Los registros son sintéticos y se utilizan exclusivamente con fines educativos; no representan cuentas, personas ni operaciones reales.

El conjunto permite analizar, entre otras dimensiones:

- Fecha del movimiento.
- Tipo de operación (ingreso o gasto).
- Categoría.
- Descripción.
- Importe.
- Medio o cuenta asociada, cuando esté disponible en el archivo.

Consultar [Modelo de datos](docs/MODELO-DATOS.md) para conocer las recomendaciones de validación y preparación.

## Tecnologías

- Next.js y React para el dashboard web.
- CSV como formato de intercambio del dataset.
- Power BI Desktop para la importación, transformación, modelado y visualización.
- DAX para las medidas del informe.

## Puesta en marcha

Requisitos: Node.js y npm.

```bash
npm install
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000).

> Los comandos anteriores aplican cuando el código fuente de Next.js esté incorporado en este repositorio. La documentación puede publicarse de forma independiente.

## Flujo de trabajo

1. Generar y revisar el dataset CSV.
2. Explorar los datos en el dashboard de Next.js.
3. Importar el CSV en Power BI Desktop.
4. Revisar tipos de datos, valores nulos, duplicados y consistencia de categorías.
5. Crear las medidas DAX necesarias.
6. Construir visualizaciones y validar que los totales coincidan con el dataset.
7. Guardar el informe de Power BI (`.pbix`) y documentar los resultados.

Ver [Guía de Power BI](docs/POWER-BI.md), [Modelo de datos](docs/MODELO-DATOS.md) y [Estado de entrega](docs/ESTADO-ENTREGA.md).

## Estructura prevista

```text
.
├── docs/
│   ├── MODELO-DATOS.md
│   └── POWER-BI.md
├── public/
│   └── data/
│       └── movimientos.csv
├── src/                  # aplicación Next.js (si utiliza src/)
├── package.json
└── README.md
```

La estructura es orientativa: debe ajustarse a las rutas reales del código y del CSV al incorporar los archivos del proyecto.

## Estado de los entregables

- [ ] Aplicación Next.js y dashboard incorporados al repositorio remoto (preparados localmente).
- [ ] Dataset CSV de 500 movimientos incorporado al repositorio remoto (preparado localmente).
- [ ] Informe de Power BI (`.pbix`) generado y validado.
- [x] Documentación del modelo y del proceso de transformación publicada.
- [ ] Capturas o exportación del informe final.

El estado detallado y los próximos pasos están en [docs/ESTADO-ENTREGA.md](docs/ESTADO-ENTREGA.md).

## Alcance y limitaciones

Los datos son sintéticos. Los resultados sirven para demostrar técnicas de análisis y visualización, no para brindar asesoramiento financiero ni describir patrones de consumo reales. Las conclusiones deben interpretarse dentro de las reglas de generación del dataset.

## Autoría

Trabajo práctico integrador — IFTS 24.

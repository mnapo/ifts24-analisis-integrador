# Estado de entrega

Actualizado: 16 de noviembre de 2026.

## Estado conocido

| Componente | Estado | Observación |
|---|---|---|
| Proyecto Next.js | Incorporado | Código en `app/`, configuración y dependencias; falta ejecutar build y probar despliegue |
| Dataset CSV | Incorporado | `public/data/movimientos.csv`, 500 movimientos sintéticos |
| Dashboard fintech | Implementado | KPIs, filtros, gráficos, búsqueda y exportación CSV; falta prueba de ejecución |
| Guía y documentación | Publicada | README, modelo de datos y guía de Power BI |
| Medidas DAX | Integradas en TMDL | Definidas en el modelo semántico PBIP; falta validación dentro de Desktop |
| Proyecto Power BI (.pbip) | Generado | Modelo semántico TMDL, calendario, relación y página inicial del informe |\n| Informe Power BI (.pbix) | Pendiente | Debe abrirse el PBIP en Desktop, completar visualizaciones y guardar como PBIX |

## Historial del proyecto

El proyecto descargable se generó inicialmente en un repositorio Git local, rama `main`, con commit `c476f05` y 15 archivos. Ese commit local no equivale a un push a GitHub.

El repositorio remoto se encontraba inicialmente vacío. Se incorporaron el dataset CSV, la aplicación Next.js y documentación. Luego se agregó el proyecto PBIP/TMDL con medidas DAX, calendario y relación de fechas.

## Próximos pasos para completar la entrega

1. Incorporar al repositorio remoto los archivos del proyecto local (15 archivos, commit local `c476f05`), revisando que no se sobrescriban los documentos publicados.
2. Confirmar que el CSV esté en la ruta utilizada por la aplicación y documentar sus columnas reales.
3. Abrir el CSV en Power BI Desktop y aplicar las transformaciones descritas en [POWER-BI.md](POWER-BI.md).
4. Validar las medidas y visualizaciones contra el dataset.
5. Guardar y agregar el archivo `.pbix`, junto con capturas y conclusiones.

No marcar como finalizado ningún entregable hasta que esté presente en el repositorio y haya sido comprobado.

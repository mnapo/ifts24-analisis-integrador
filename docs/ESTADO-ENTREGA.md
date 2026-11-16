# Estado de entrega

Actualizado: 16 de noviembre de 2026.

## Estado conocido

| Componente | Estado | Observación |
|---|---|---|
| Proyecto Next.js | Preparado localmente | Generado en el trabajo previo; todavía no incorporado a este repositorio remoto |
| Dataset CSV | Preparado localmente | 500 movimientos sintéticos |
| Dashboard fintech | Preparado localmente | Responsive, con indicadores, gráficos y búsqueda |
| Guía y documentación | Publicada | README, modelo de datos y guía de Power BI |
| Medidas DAX | Documentadas | Requieren validación con los nombres y valores exactos del CSV |
| Informe Power BI (.pbix) | Pendiente | No fue generado ni validado |

## Historial del proyecto

El proyecto descargable se generó inicialmente en un repositorio Git local, rama `main`, con commit `c476f05` y 15 archivos. Ese commit local no equivale a un push a GitHub.

El repositorio remoto se encontraba vacío al iniciar esta tarea. En esta actualización se publicaron los documentos de proyecto y proceso de análisis. Por lo tanto, el contenido remoto todavía no incluye la aplicación Next.js ni el CSV.

## Próximos pasos para completar la entrega

1. Incorporar al repositorio remoto los archivos del proyecto local (15 archivos, commit local `c476f05`), revisando que no se sobrescriban los documentos publicados.
2. Confirmar que el CSV esté en la ruta utilizada por la aplicación y documentar sus columnas reales.
3. Abrir el CSV en Power BI Desktop y aplicar las transformaciones descritas en [POWER-BI.md](POWER-BI.md).
4. Validar las medidas y visualizaciones contra el dataset.
5. Guardar y agregar el archivo `.pbix`, junto con capturas y conclusiones.

No marcar como finalizado ningún entregable hasta que esté presente en el repositorio y haya sido comprobado.

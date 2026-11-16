# Estado de entrega

Actualizado: 16 de noviembre de 2026.

| Componente | Estado | Observación |
|---|---|---|
| Tema | Definido | Indicadores económicos y sociales de cuatro países |
| Dataset | Generado | 10.000 registros sintéticos, 2010–2024 |
| Indicadores | Incorporados | PIB per cápita, inflación, desempleo, uso de Internet |
| Fuente declarada | Explícita | Cada fila identifica datos sintéticos autogenerados |
| Power Query | Actualizado | CSV con comillas; sin límite universal 0–100 |
| Modelo semántico | Incorporado | FactIndicadores, Paises, Indicadores |
| Medidas DAX | Incorporadas | KPIs, promedio regional, brecha, ranking y líder |
| Visualizaciones | Definidas en PBIR | KPI, segmentadores, barras, líneas y tabla |
| PBIP | Incorporado | `powerbi/IndicadoresLatam.pbip` |
| Validación estática | Actualizada | `python scripts/validate_powerbi_project.py` |
| Apertura/refresh Desktop | Pendiente de verificación | Requiere Power BI Desktop |
| PBIX final | Pendiente | Guardar desde Power BI Desktop |
| PDF académico | Generado | Carátula oficial IFTS 24 + informe y anexo de 240 registros; artefacto de GitHub Actions |

## Próximos pasos

1. Abrir `powerbi/IndicadoresLatam.pbip` en Power BI Desktop.
2. Actualizar el modelo y verificar las credenciales de acceso web.
3. Confirmar que las dos páginas y todos los visuales se rendericen.
4. Guardar una copia PBIX.
5. Exportar el informe a PDF y adjuntarlo a la entrega.

**Nota:** los registros son sintéticos y no deben atribuirse al Banco Mundial.
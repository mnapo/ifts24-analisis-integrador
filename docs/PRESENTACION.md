# Presentación interactiva

La entrega se organiza en ocho reportes navegables:

1. Panorama regional: evolución del PIB, PIB per cápita, inflación, desempleo, población y gasto sanitario.
2. Restricciones sanitarias y economía: índices compuestos, medidas C1–C8, políticas económicas y duración diaria de C6.
3. Impacto sanitario y social: esperanza de vida, gasto sanitario y cambios observados.
4. Desigualdad y empleo: Gini, desempleo y asociaciones entre condiciones previas y shock económico.
5. Capacidad sanitaria: gasto por habitante, esperanza de vida y cambios entre períodos.
6. Comparación de países: caída y recuperación del PIB, políticas C6 y matriz multidimensional.
7. Medidas públicas y recuperación económica: relación descriptiva entre apoyo económico y rigurosidad de 2020 y crecimiento del PIB entre 2021 y 2023.
8. Exploración multidimensional: filtros de fuente, medida, país y período; serie temporal y matriz país × año.

## Interacción

- Navegación entre las tres páginas.
- Gráficos de series temporales, barras comparativas, áreas y dispersión.
- Ejes rotulados y unidades explícitas.
- Los puntos de dispersión se pueden seleccionar para consultar país, año y valores exactos.
- Selector de año para comparar duración de C6.
- Dispersión para contrastar los índices de apoyo económico y rigurosidad de 2020 con el crecimiento promedio del PIB entre 2021 y 2023.
- Exploración con filtros combinables de fuente, medida, país y período; visualización temporal y matriz país × año.
- Matriz comparativa con períodos y unidades explícitos; los faltantes se muestran como “Sin dato”.
- No se incluye filtro de país.

## Fuentes y criterios

World Development Indicators del Banco Mundial y Oxford COVID-19 Government Response Tracker. Los datos proceden de las fuentes originales; no se generan observaciones sintéticas. Los faltantes se conservan. Los promedios regionales son simples y no ponderados.

OxCGRT registra políticas oficiales: C1–C8 son medidas de contención y cierres; E1–E2, apoyo económico; H1–H8, medidas sanitarias. Las escalas ordinales son propias de cada indicador.

La duración de permanencia en el hogar se calcula desde C6-M diario: días con recomendación (C6 ≥ 1), días con obligación (C6 ≥ 2), días con la categoría más estricta (C6 = 3) y racha consecutiva máxima de obligación. La versión M representa la política aplicable a la mayoría, que puede cambiar entre población vacunada y no vacunada. También se distingue si la medida fue general o focalizada, porque OxCGRT registra la política más estricta de la jurisdicción; no equivale a cumplimiento ni encierro efectivo. C8EV no mide la cuarentena de viajeros no vacunados.

Los cruces se realizan por ISO3 y año, con pares completos. Las asociaciones son descriptivas y no demuestran causalidad. La cobertura de OxCGRT es menor que la de WDI.

## Hilo conductor para la exposición

**Pregunta central:** ¿La recuperación económica de América Latina y el Caribe después de la pandemia fue igual para todos, o las diferencias entre países condicionaron sus resultados?

La narración avanza desde el impacto regional hacia sus respuestas y consecuencias. En cada reporte, presentar primero la pregunta, explicar brevemente el concepto clave, leer el gráfico y cerrar con la transición al siguiente tema.

1. **Panorama regional — dimensionar el shock.** Abrir con la evolución del PIB real. El PIB real mide la producción descontando cambios de precios; su tasa anual distingue expansión y contracción. La media regional muestra una caída pronunciada en 2020, un rebote en 2021 y una desaceleración posterior. Aclarar que es una media simple, no ponderada por población ni tamaño económico.
2. **Restricciones y economía — observar las respuestas.** Explicar que OxCGRT registra políticas oficiales, no cumplimiento. El índice de rigurosidad resume medidas en escala 0–100. C6 distingue ausencia de medida (0), recomendación (1), obligación con excepciones esenciales (2) y obligación más estricta (3). Los días C6 ≥ 2 no equivalen a encierro efectivo ni continuo; el alcance puede ser general o focalizado.
3. **Impacto sanitario y social — ampliar la noción de impacto.** La esperanza de vida al nacer resume condiciones de mortalidad del período. Permite observar cambios sanitarios generales, pero no es un conteo de muertes por COVID-19 ni prueba causal del efecto de la pandemia.
4. **Desigualdad y empleo — mostrar las brechas.** El índice de Gini va de 0 (igualdad perfecta) a 100 (desigualdad máxima en la escala habitual). Describe distribución del ingreso, no riqueza ni pobreza directamente. El desempleo refiere a personas sin trabajo, disponibles y que buscan empleo; no captura por completo la informalidad ni la calidad laboral.
5. **Capacidad sanitaria — incorporar las condiciones previas.** El gasto corriente en salud por habitante aproxima recursos utilizados en servicios sanitarios. Está en dólares corrientes, sin ajuste por inflación ni poder adquisitivo. La asociación observada con esperanza de vida es descriptiva y no demuestra causalidad.
6. **Comparación de países — integrar sin crear un ranking artificial.** Leer conjuntamente caída del PIB, recuperación, Gini, desempleo, esperanza de vida y C6. Cada indicador conserva su unidad y período. Una asociación lineal baja o nula no demuestra ausencia de efectos: hay factores no controlados y posible causalidad inversa.
7. **Medidas públicas y recuperación económica — conectar respuestas con resultados posteriores.** Comparar el índice de apoyo económico y el índice de rigurosidad registrados en 2020 con el crecimiento promedio del PIB entre 2021 y 2023. Explicar que E1 y E2 describen categorías de apoyo a ingresos y alivio de deudas, no montos ejecutados ni cobertura efectiva. El índice de rigurosidad resume medidas de contención, no cumplimiento individual. Cada punto representa un país; los patrones permiten formular hipótesis, pero no probar que una política haya causado una recuperación mayor o menor. La caída inicial, la estructura productiva, la informalidad, el espacio fiscal y la situación sanitaria también pueden influir.
8. **Exploración multidimensional — dejar que el público investigue.** Cambiar fuente, indicador, país y período. Explicar dimensiones, medidas, segmentadores y matriz país × año. Cerrar recordando que la interfaz ilustra conceptos de BI, pero no ejecuta DAX ni sustituye el motor de Power BI.

**Conclusión para cerrar:** la pandemia fue un shock regional, pero no produjo una trayectoria uniforme. La recuperación económica es solo una parte de la historia: para comprender las diferencias hay que considerar políticas, condiciones sanitarias, empleo y distribución del ingreso. Los datos permiten describir patrones y asociaciones, no atribuir causas por sí solos.

**Frase metodológica para repetir cuando corresponda:** los promedios regionales son medias simples de países con datos; la cobertura varía entre indicadores; los faltantes se conservan y no se interpretan como cero.

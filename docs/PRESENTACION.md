# Presentación interactiva

La entrega se desarrolla como una presentación web en Next.js. No requiere Power BI.

## Navegación

- Diapositivas a pantalla completa, con controles, puntos clicables y teclado.
- Adaptación a escritorio y móviles.
- Gráficos interactivos construidos con Recharts.
- Selector de país para comparar cada trayectoria nacional con el promedio regional.

## Visualizaciones

1. Crecimiento anual del PIB (2015–2023).
2. Índice de rigurosidad de las medidas (2020–2022).
3. Gasto corriente en salud por habitante (2015–2023).
4. Recuperación del crecimiento del PIB (2019–2023).
5. Diagrama de dispersión entre rigurosidad y crecimiento del PIB (2020–2022).

Los CSV publicados en `public/data` se cargan desde el navegador. Los promedios regionales son simples, no ponderados, y cada gráfico informa la cobertura disponible. El diagrama de dispersión solo muestra asociación descriptiva; no permite inferir causalidad.

## Fuentes y cobertura

- World Development Indicators: indicadores económicos, demográficos y sanitarios, 2015–2023.
- Oxford COVID-19 Government Response Tracker: índices de respuesta gubernamental, 2020–2022.
- Cobertura validada: 33 países con datos WDI y 28 con datos OxCGRT.

## Navegación

Flechas inferiores, puntos, teclas izquierda/derecha, PageUp/PageDown, Home y End.

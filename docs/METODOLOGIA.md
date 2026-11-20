# Metodología

## Fuentes y naturaleza de los datos

- World Development Indicators (WDI), Banco Mundial: indicadores económicos, laborales, demográficos y sanitarios anuales.
- Oxford COVID-19 Government Response Tracker (OxCGRT): registro histórico de políticas públicas relacionadas con COVID-19.

Los datos proceden de las fuentes originales; no son sintéticos ni se generan observaciones para completar vacíos. Las fuentes pueden revisar estimaciones y series. Los faltantes se preservan.

## Cobertura

- WDI: 2015–2023.
- OxCGRT: 2020–2022.
- Unidad principal: país/año; las medidas OxCGRT también se conservan a nivel diario.
- Región: América Latina y el Caribe, según selección ISO3 del proyecto.
- La cobertura efectiva varía por indicador, país y fecha. OxCGRT tiene menor cobertura que WDI.

## Indicadores WDI

Crecimiento del PIB real (NY.GDP.MKTP.KD.ZG), crecimiento del PIB per cápita (NY.GDP.PCAP.KD.ZG), desempleo (SL.UEM.TOTL.ZS), inflación (FP.CPI.TOTL.ZG), Gini (SI.POV.GINI), esperanza de vida al nacer (SP.DYN.LE00.IN), gasto corriente en salud por habitante (SH.XPD.CHEX.PC.CD) y población (SP.POP.TOTL).

El gasto sanitario está expresado en dólares corrientes: no está ajustado por inflación ni paridad de poder adquisitivo.

## OxCGRT: qué miden las políticas

OxCGRT registra políticas oficiales, no el comportamiento efectivo de la población. Las variables son ordinales, categóricas o numéricas según el indicador; sus escalas no son intercambiables.

### Contención y cierres (C1–C8)

- C1: cierre de escuelas y universidades.
- C2: cierre de lugares de trabajo o recomendación/obligación de trabajo remoto.
- C3: cancelación de eventos públicos.
- C4: límites al tamaño de reuniones.
- C5: cierre o reducción del transporte público.
- C6: requisitos de permanencia en el hogar.
- C7: restricciones a desplazamientos dentro del país.
- C8: controles a viajes internacionales, incluidas cuarentenas de llegada.

### Políticas económicas (E1–E2)

E1 registra apoyo a los ingresos de trabajadores. E2 registra alivio de deuda y contratos de hogares. No equivalen al gasto fiscal total ni garantizan que cada hogar haya recibido asistencia.

### Políticas sanitarias (H1–H8)

Incluyen campañas de información, política de pruebas, rastreo de contactos, inversión sanitaria, mascarillas, política de vacunación y protección de personas mayores, entre otras. Se incorporan las variables ordinales disponibles en el archivo nacional compacto.

## ¿Cómo se mide la duración de la cuarentena?

OxCGRT no contiene una variable única denominada duración de la cuarentena. Se utiliza C6 (Stay at home requirements), que registra la política oficial de permanencia en el hogar:

| Código | Interpretación |
| --- | --- |
| 0 | Sin medida |
| 1 | Recomendación de no salir del hogar |
| 2 | Obligación de permanecer en casa, con excepciones para necesidades esenciales |
| 3 | Obligación con excepciones mínimas |

Desde la serie diaria se calculan por país/año:
- Días con recomendación: C6 ≥ 1.
- Días con obligación: C6 ≥ 2.
- Días en el nivel más estricto: C6 = 3.
- Racha consecutiva máxima con obligación: días contiguos con C6 ≥ 2. Una fecha faltante o un día sin obligación interrumpe la racha.

Estos indicadores describen duración de la serie C6-M (política aplicable a la mayoría), no días de cumplimiento individual, encierro efectivo ni una cuarentena total uniforme. Como la mayoría puede cambiar entre población vacunada y no vacunada, la serie no sigue necesariamente al mismo grupo a lo largo del tiempo. Los toques de queda se codifican como C6=2 aunque existan franjas horarias de circulación; por eso el conteo de días obligatorios no equivale necesariamente a días completos de encierro 24/7. C8 puede registrar cuarentena de viajeros internacionales, pero no se suma a C6 para construir duración del confinamiento nacional.

El archivo nacional compacto representa la política aplicable a la mayoría de la jurisdicción; no sustituye la variación subnacional. Para C1–C7, H6 y H8, la versión M (majority) ofrece una serie continua, pero puede cambiar de la población no vacunada a la vacunada cuando cambia cuál grupo supera el 50% de la población. Por lo tanto, no siempre sigue a un grupo fijo ni significa que la política se aplique a todas las personas. Las versiones E, NV y V tienen vacíos cuando no corresponden. C8 no tiene versión M: C8EV refleja la política para viajeros vacunados o para todos cuando no hay diferenciación, y no recoge necesariamente las restricciones a viajeros no vacunados.

## Índices compuestos

- Stringency Index: resume un conjunto de medidas de contención y cierre.
- Government Response Index: combina políticas sanitarias, de contención y económicas.
- Containment and Health Index: resume medidas de contención y políticas de salud.
- Economic Support Index: resume medidas de apoyo económico.

Se expresan en escala 0–100. No son porcentajes de personas confinadas, no miden cumplimiento ni prueban efectividad sanitaria.

## Transformación y agregación

1. WDI se descarga por indicador y se filtra a 2015–2023.
2. OxCGRT se descarga en formato nacional diario y se filtra a 2020–2022.
3. Los registros diarios se normalizan por ISO3 y fecha.
4. Los índices y medidas ordinales se agregan por país/año mediante media aritmética de valores no nulos.
5. La duración C6 se calcula contando días según umbrales explícitos; la racha se interrumpe ante fecha faltante o ausencia de obligación.
6. Los promedios regionales son medias simples de países con dato; no se ponderan por población ni PIB.
7. Los cruces WDI–OxCGRT se realizan por ISO3 + año, solo para pares completos.

## Criterios para los gráficos

- Gráficos temporales: medias simples por año o mes.
- Barras nacionales: valores observados para el período indicado.
- Dispersión: una observación país/año por punto. Al seleccionar un punto se presentan país, año y coordenadas.
- Referencias en cero: distinguen crecimiento de contracción.
- No se interpolan valores ausentes.
- Los promedios de tasas 2021–2023 no se interpretan como crecimiento acumulado.

## Limitaciones

Las políticas se adoptaron en respuesta a la evolución epidemiológica; existe simultaneidad y posible causalidad inversa. Las medias anuales pueden ocultar cambios intranuales. Las escalas ordinales no miden cumplimiento. Las diferencias estructurales, demográficas, laborales y sanitarias no están controladas. Las asociaciones son descriptivas, no causales.

La base actual no contiene una serie comparable y completa de mortalidad COVID-19 o exceso de mortalidad para todos los países seleccionados; no se inventan ni estiman esos valores.

## Reproducibilidad

Ejecutar python scripts/etl.py. Los archivos originales se guardan en data/raw/, los CSV transformados en public/data/ y los controles en data/validation/summary.json.

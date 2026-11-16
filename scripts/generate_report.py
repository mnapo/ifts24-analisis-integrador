#!/usr/bin/env python3
"""Build the academic PDF report and prepend the official IFTS 24 cover."""
import csv
import io
import math
from pathlib import Path

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.ticker import FuncFormatter
from pypdf import PdfReader, PdfWriter
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import mm
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Image, Table, TableStyle,
    PageBreak, KeepTogether,
)

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "public/data/indicadores-banco-mundial.csv"
COVER = ROOT / "caratula/V1.pdf"
OUT = ROOT / "reporte-integrador.pdf"
NAVY = colors.HexColor("#25486D")
BLUE = colors.HexColor("#5E7F9F")
PALE = colors.HexColor("#EFF3F6")
MUTED = colors.HexColor("#66788A")
COUNTRY_COLORS = {"Argentina":"#315f91","Brasil":"#27836e","Chile":"#bd853c","Uruguay":"#7865a5"}
INDICATORS = [
    ("NY.GDP.PCAP.CD","PIB per cápita","US$","Producto interno bruto por habitante, en dólares corrientes."),
    ("FP.CPI.TOTL.ZG","Inflación","%","Variación porcentual anual de los precios al consumidor."),
    ("SL.UEM.TOTL.ZS","Desempleo","%","Proporción de la fuerza laboral sin empleo."),
    ("IT.NET.USER.ZS","Uso de Internet","%","Porcentaje de la población que utiliza Internet."),
]

def fmt(v, unit):
    return ("US$ " + f"{v:,.0f}" if unit == "US$" else f"{v:.1f}%").replace(",", "X").replace(".", ",").replace("X", ".")

def chart_image(rows, code, unit, kind):
    grouped = {}
    for r in rows:
        grouped.setdefault((r["country"], r["year"]), []).append(r["value"])
    plot_rows = [{"country": country, "year": year, "value": sum(values) / len(values)}
                 for (country, year), values in grouped.items()]
    fig, ax = plt.subplots(figsize=(8.8, 3.1), dpi=170)
    fig.patch.set_facecolor("white")
    ax.set_facecolor("white")
    if kind == "bar":
        latest = max(r["year"] for r in plot_rows)
        selected = [r for r in plot_rows if r["year"] == latest]
        selected.sort(key=lambda r: r["value"], reverse=True)
        bars = ax.bar([r["country"] for r in selected], [r["value"] for r in selected],
                      color=[COUNTRY_COLORS[r["country"]] for r in selected], width=.56)
        ax.set_title(f"Comparación entre países · {latest}", loc="left", fontsize=11, fontweight="bold", color="#30475f", pad=14)
        ax.bar_label(bars, labels=[fmt(r["value"],unit) for r in selected], padding=4, fontsize=8, color="#526477")
    else:
        ax.set_title("Evolución anual · 2010–2024", loc="left", fontsize=11, fontweight="bold", color="#30475f", pad=14)
        for country, color in COUNTRY_COLORS.items():
            series = sorted([r for r in plot_rows if r["country"] == country], key=lambda r:r["year"])
            if series:
                ax.plot([r["year"] for r in series],[r["value"] for r in series],label=country,color=color,linewidth=2.1,marker="o",markersize=2.8)
        ax.legend(frameon=False,ncol=4,loc="upper left",fontsize=8)
    ax.grid(axis="y",color="#e9edf1",linewidth=.8)
    ax.spines[["top","right","left"]].set_visible(False)
    ax.spines["bottom"].set_color("#d8e0e7")
    ax.tick_params(axis="both",length=0,labelsize=8,colors="#66788a",pad=7)
    ax.yaxis.set_major_formatter(FuncFormatter(lambda x,pos: f"{x:,.0f}".replace(",", ".")))
    ax.set_ylabel(unit,fontsize=8,color="#66788a")
    fig.tight_layout()
    buf=io.BytesIO()
    fig.savefig(buf,format="png",bbox_inches="tight",facecolor="white")
    plt.close(fig)
    buf.seek(0)
    return buf

def footer(canvas, doc):
    canvas.saveState()
    w,h=A4
    canvas.setStrokeColor(colors.HexColor("#DCE3EA"))
    canvas.line(18*mm,15*mm,w-18*mm,15*mm)
    canvas.setFont("Helvetica",7)
    canvas.setFillColor(MUTED)
    canvas.drawString(18*mm,10*mm,"IFTS N.º 24 · Análisis y procesamiento de datos · 2026")
    canvas.drawRightString(w-18*mm,10*mm,str(doc.page))
    canvas.restoreState()

with DATA.open(encoding="utf-8-sig",newline="") as f:
    rows=list(csv.DictReader(f))
for r in rows:
    r["year"]=int(r["year"]); r["value"]=float(r["value"])

styles=getSampleStyleSheet()
styles.add(ParagraphStyle(name="ReportTitle",parent=styles["Title"],fontName="Helvetica-Bold",fontSize=23,leading=28,textColor=NAVY,alignment=TA_LEFT,spaceAfter=8))
styles.add(ParagraphStyle(name="Subtitle2",parent=styles["Normal"],fontSize=10,leading=15,textColor=MUTED,spaceAfter=12))
styles.add(ParagraphStyle(name="H1x",parent=styles["Heading1"],fontName="Helvetica-Bold",fontSize=16,leading=20,textColor=NAVY,spaceBefore=4,spaceAfter=9))
styles.add(ParagraphStyle(name="H2x",parent=styles["Heading2"],fontName="Helvetica-Bold",fontSize=11,leading=14,textColor=BLUE,spaceBefore=8,spaceAfter=5))
styles.add(ParagraphStyle(name="Bodyx",parent=styles["BodyText"],fontSize=9,leading=14,textColor=colors.HexColor("#435469"),spaceAfter=7))
styles.add(ParagraphStyle(name="Smallx",parent=styles["BodyText"],fontSize=7.5,leading=11,textColor=MUTED,spaceAfter=5))
styles.add(ParagraphStyle(name="Centerx",parent=styles["BodyText"],fontSize=9,leading=13,textColor=MUTED,alignment=TA_CENTER))

story=[]
story += [Paragraph("Indicadores de desarrollo en América Latina",styles["ReportTitle"]),
          Paragraph("Trabajo Práctico Integrador · Análisis y procesamiento de datos · 2026",styles["Subtitle2"]),
          Paragraph("<b>Alumno:</b> Matías Napoli &nbsp;&nbsp;&nbsp; <b>Profesor:</b> Pasztetnik Martín",styles["Bodyx"]),
          Spacer(1,5*mm),
          Paragraph("Resumen ejecutivo",styles["H1x"]),
          Paragraph("Este trabajo presenta un análisis comparativo de Argentina, Brasil, Chile y Uruguay a partir de cuatro indicadores económicos y sociales. El recorte temporal comprende 2010–2024 y permite observar diferencias entre países y patrones de evolución anual.",styles["Bodyx"]),
          Paragraph("Alcance del conjunto de datos",styles["H2x"]),
          Paragraph("<b>240 registros</b> · 4 países · 4 indicadores · 15 años. La granularidad de cada observación es país–indicador–año. Los indicadores se analizan de manera independiente para evitar comparar directamente magnitudes con unidades distintas.",styles["Bodyx"]),
          Paragraph("Advertencia metodológica",styles["H2x"]),
          Paragraph("<b>Los 240 valores son sintéticos y autogenerados con fines académicos.</b> No son observaciones oficiales del Banco Mundial ni deben utilizarse para describir la evolución económica real. Los códigos identifican referencias temáticas del catálogo de indicadores; no acreditan la procedencia de los valores.",styles["Bodyx"]),
          Paragraph("Indicadores incluidos",styles["H2x"])]
indicator_data=[["Indicador","Código","Unidad"]]
for code,label,unit,desc in INDICATORS:
    indicator_data.append([label,code,unit])
t=Table(indicator_data,colWidths=[58*mm,73*mm,25*mm],repeatRows=1)
t.setStyle(TableStyle([("BACKGROUND",(0,0),(-1,0),NAVY),("TEXTCOLOR",(0,0),(-1,0),colors.white),("FONTNAME",(0,0),(-1,0),"Helvetica-Bold"),("FONTSIZE",(0,0),(-1,-1),8),("GRID",(0,0),(-1,-1),.35,colors.HexColor("#DCE3EA")),("ROWBACKGROUNDS",(0,1),(-1,-1),[colors.white,PALE]),("VALIGN",(0,0),(-1,-1),"MIDDLE"),("LEFTPADDING",(0,0),(-1,-1),8),("RIGHTPADDING",(0,0),(-1,-1),8),("TOPPADDING",(0,0),(-1,-1),7),("BOTTOMPADDING",(0,0),(-1,-1),7)]))
story += [t,Spacer(1,5*mm),Paragraph("Procedimiento de análisis",styles["H2x"]),
          Paragraph("El archivo CSV se interpreta y tipa; se comprueba la clave compuesta país–indicador–año; luego se organiza una tabla de hechos y dimensiones de países e indicadores. Las visualizaciones resumen comparaciones del último año disponible y series históricas. Los resultados describen únicamente el conjunto sintético construido para la práctica.",styles["Bodyx"]),
          PageBreak()]

for code,label,unit,description in INDICATORS:
    subset=[r for r in rows if r["indicator_code"]==code]
    grouped={}
    for r in subset:
        grouped.setdefault((r["country"],r["year"]),[]).append(r["value"])
    summary=[{"country":country,"year":year,"value":sum(values)/len(values)}
             for (country,year),values in grouped.items()]
    latest=max(r["year"] for r in summary)
    latest_rows=[r for r in summary if r["year"]==latest]
    avg=sum(r["value"] for r in latest_rows)/len(latest_rows)
    high=max(latest_rows,key=lambda r:r["value"])
    low=min(latest_rows,key=lambda r:r["value"])
    story += [Paragraph(label,styles["H1x"]),Paragraph(description,styles["Bodyx"])]
    kpi=[[ "Promedio regional", "Máximo", "Mínimo", "Observaciones" ],
         [fmt(avg,unit), f"{high['country']} · {fmt(high['value'],unit)}", f"{low['country']} · {fmt(low['value'],unit)}", str(len(subset))]]
    kt=Table(kpi,colWidths=[39*mm,53*mm,53*mm,36*mm])
    kt.setStyle(TableStyle([("BACKGROUND",(0,0),(-1,0),PALE),("TEXTCOLOR",(0,0),(-1,0),MUTED),("FONTNAME",(0,0),(-1,0),"Helvetica-Bold"),("TEXTCOLOR",(0,1),(-1,1),NAVY),("FONTNAME",(0,1),(-1,1),"Helvetica-Bold"),("FONTSIZE",(0,0),(-1,-1),8),("GRID",(0,0),(-1,-1),.4,colors.HexColor("#DCE3EA")),("VALIGN",(0,0),(-1,-1),"MIDDLE"),("LEFTPADDING",(0,0),(-1,-1),7),("TOPPADDING",(0,0),(-1,-1),8),("BOTTOMPADDING",(0,0),(-1,-1),8)]))
    story += [kt,Spacer(1,4*mm)]
    for kind in ("bar","line"):
        buf=chart_image(subset,code,unit,kind)
        story.append(Image(buf,width=169*mm,height=59*mm))
        story.append(Spacer(1,2*mm))
    story.append(Paragraph(f"Lectura: en {latest}, el valor medio del conjunto seleccionado es {fmt(avg,unit)}. El rango entre países va de {low['country']} ({fmt(low['value'],unit)}) a {high['country']} ({fmt(high['value'],unit)}). Estos resultados describen los valores sintéticos del ejercicio, no mediciones reales.",styles["Bodyx"]))
    story.append(Paragraph("Fuente: elaboración propia · Datos sintéticos autogenerados (no oficiales).",styles["Smallx"]))
    story.append(PageBreak())

story += [Paragraph("Conclusiones y limitaciones",styles["H1x"]),
          Paragraph("El conjunto de datos permite ejercitar un flujo completo de análisis: lectura de fuentes tabulares, tipado y validación, modelado relacional, medidas de resumen y construcción de visualizaciones comparativas y temporales. El filtrado por país, indicador y año facilita estudiar cada dimensión sin mezclar escalas.",styles["Bodyx"]),
          Paragraph("La principal limitación es el carácter sintético de los valores. Las tendencias y variaciones fueron generadas con fines didácticos y no constituyen evidencia empírica. Por lo tanto, no corresponde inferir relaciones causales, formular pronósticos ni extrapolar los resultados a la situación económica real de los países.",styles["Bodyx"]),
          Paragraph("Diccionario de variables",styles["H2x"])]
dict_rows=[["Campo","Descripción"]]+[
["country_code","Código ISO de país"],["country","Nombre del país"],["indicator_code","Código temático del indicador"],["indicator_name","Nombre descriptivo del indicador"],["year","Año de observación"],["value","Valor numérico sintético"],["unit","Unidad de medida"],["source","Identificación explícita del origen sintético"]]
dt=Table(dict_rows,colWidths=[48*mm,133*mm],repeatRows=1)
dt.setStyle(TableStyle([("BACKGROUND",(0,0),(-1,0),NAVY),("TEXTCOLOR",(0,0),(-1,0),colors.white),("FONTNAME",(0,0),(-1,0),"Helvetica-Bold"),("FONTSIZE",(0,0),(-1,-1),8),("GRID",(0,0),(-1,-1),.35,colors.HexColor("#DCE3EA")),("ROWBACKGROUNDS",(0,1),(-1,-1),[colors.white,PALE]),("VALIGN",(0,0),(-1,-1),"MIDDLE"),("LEFTPADDING",(0,0),(-1,-1),7),("TOPPADDING",(0,0),(-1,-1),6),("BOTTOMPADDING",(0,0),(-1,-1),6)]))
story.append(dt)

tmp=ROOT/"reporte-contenido.pdf"
doc=SimpleDocTemplate(str(tmp),pagesize=A4,rightMargin=15*mm,leftMargin=15*mm,topMargin=15*mm,bottomMargin=21*mm,title="Indicadores de desarrollo en América Latina",author="Matías Napoli")
doc.build(story,onFirstPage=footer,onLaterPages=footer)

cover=PdfReader(str(COVER))
body=PdfReader(str(tmp))
writer=PdfWriter()
writer.append(cover)
# Fill the editable placeholder fields in the official first-page template.
from reportlab.pdfgen import canvas
cover_page=writer.pages[0]
page_width=float(cover_page.mediabox.width)
page_height=float(cover_page.mediabox.height)
overlay_buffer=io.BytesIO()
overlay_canvas=canvas.Canvas(overlay_buffer,pagesize=(page_width,page_height))
overlay_canvas.setFillColor(colors.white)
fields=[
    (162,296,220,"ANÁLISIS Y EXPLORACIÓN DE DATOS"),
    (119,272,90,"2026"),
    (199,248,266,"PASZTETNIK MARTÍN"),
    (160,224,260,"MATÍAS NAPOLI"),
    (162,200,220,"01/09/2026"),
    (162,176,220,"16/11/2026"),
]
for x,y,width,value in fields:
    overlay_canvas.setFillColor(colors.white)
    overlay_canvas.rect(x,y-3,width,19,fill=1,stroke=0)
    overlay_canvas.setFillColor(colors.black)
    overlay_canvas.setFont("Helvetica-Bold",11.5)
    overlay_canvas.drawString(x,y,value)
overlay_canvas.save()
overlay_buffer.seek(0)
overlay_page=PdfReader(overlay_buffer).pages[0]
cover_page.merge_page(overlay_page)
for page in body.pages:
    writer.add_page(page)
with OUT.open("wb") as f:
    writer.write(f)
print(f"Created {OUT} with official cover filled in uppercase (Matías Napoli / 2026 / Análisis y exploración de datos / Pasztetnik Martín; TP 01/09/2026; delivery 16/11/2026), plus {len(body.pages)} report pages; rows={len(rows)}")

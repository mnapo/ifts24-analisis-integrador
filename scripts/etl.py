#!/usr/bin/env python3
"""Descarga, transforma y valida WDI y OxCGRT para el observatorio."""
from __future__ import annotations
import csv, json, urllib.parse, urllib.request
from datetime import datetime, timedelta, timezone
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
RAW=ROOT/"data"/"raw"
OUT=ROOT/"public"/"data"
VALIDATION=ROOT/"data"/"validation"
START_YEAR,END_YEAR=2015,2023
OX_START,OX_END=2020,2022
USER_AGENT="ObservatorioSocioeconomicoLATAM/1.0 (academic project)"
INDEX_FIELDS=["StringencyIndex_Average","GovernmentResponseIndex_Average","ContainmentHealthIndex_Average","EconomicSupportIndex"]
POLICY_LABELS={
 "C1":"School closing","C2":"Workplace closing","C3":"Cancel public events","C4":"Restrictions on gatherings",
 "C5":"Close public transport","C6":"Stay at home requirements","C7":"Restrictions on internal movement",
 "C8":"International travel controls","E1":"Income support","E2":"Debt/contract relief for households",
 "H1":"Public information campaign","H2":"Testing policy","H3":"Contact tracing","H6":"Facial coverings",
 "H7":"Vaccination policy","H8":"Protection of elderly people"
}
def read_json(path): return json.loads(path.read_text(encoding="utf-8"))
def download(url,destination):
 destination.parent.mkdir(parents=True,exist_ok=True)
 request=urllib.request.Request(url,headers={"User-Agent":USER_AGENT})
 with urllib.request.urlopen(request,timeout=120) as response: destination.write_bytes(response.read())
def write_csv(path,rows,fields):
 path.parent.mkdir(parents=True,exist_ok=True)
 with path.open("w",newline="",encoding="utf-8-sig") as file:
  writer=csv.DictWriter(file,fieldnames=fields,extrasaction="ignore");writer.writeheader();writer.writerows(rows)
def fetch_wdi(countries,indicators):
 country_path=";".join(countries)
 query=urllib.parse.urlencode({"date":f"{START_YEAR}:{END_YEAR}","format":"json","per_page":"20000"})
 rows=[]
 for indicator in indicators:
  code=indicator["codigo"];raw_path=RAW/f"wdi_{code.replace('.','_')}.json"
  download(f"https://api.worldbank.org/v2/country/{country_path}/indicator/{code}?{query}",raw_path)
  payload=read_json(raw_path)
  if not isinstance(payload,list) or len(payload)<2 or not isinstance(payload[1],list): raise RuntimeError(f"Respuesta WDI inesperada para {code}")
  for item in payload[1]:
   if item.get("countryiso3code") and item.get("value") is not None:
    rows.append({"iso3":item["countryiso3code"],"pais":item["country"]["value"],"anio":int(item["date"]),"codigo_indicador":code,"indicador":indicator["nombre"],"valor":item["value"]})
 return rows
def choose_field(fields,code,label):
 candidates=[f"{code}M_{label}",f"{code}_{label}",f"{code}E_{label}",f"{code}NV_{label}",f"{code}V_{label}"]
 return next((v for v in candidates if v in fields),None)
def choose_flag(fields,code):
 candidates=[f"{code}M_Flag",f"{code}_Flag",f"{code}E_Flag"]
 return next((v for v in candidates if v in fields),None)
def fetch_oxcgrt(countries):
 url="https://raw.githubusercontent.com/OxCGRT/covid-policy-dataset/main/data/OxCGRT_compact_national_v1.csv"
 raw_path=RAW/"oxcgrt_compact_national_v1.csv";download(url,raw_path)
 with raw_path.open(encoding="utf-8-sig",newline="") as file:
  reader=csv.DictReader(file);fields=reader.fieldnames or []
  country_key="CountryCode" if "CountryCode" in fields else "country_code"
  date_key="Date" if "Date" in fields else "date"
  if country_key not in fields or date_key not in fields: raise RuntimeError("No se reconocen las columnas país/fecha de OxCGRT")
  indices=[v for v in INDEX_FIELDS if v in fields]
  if not indices: raise RuntimeError("No se encontraron índices agregados de OxCGRT")
  policy_fields={code:choose_field(fields,code,label) for code,label in POLICY_LABELS.items()}
  if policy_fields["C6"] is None: raise RuntimeError("OxCGRT no contiene C6 (Stay at home requirements); no se puede calcular duración")
  flag_fields={f"{code}_flag":choose_flag(fields,code) for code in ["C1","C2","C3","C4","C5","C6","C7","H6"]}
  daily=[]
  for source in reader:
   iso3=(source.get(country_key) or "").strip().upper();date_value=(source.get(date_key) or "").strip()
   if iso3 not in countries or not date_value: continue
   try: date=datetime.strptime(date_value,"%Y%m%d")
   except ValueError: continue
   if not OX_START<=date.year<=OX_END: continue
   row={"iso3":iso3,"fecha":date.strftime("%Y-%m-%d"),"anio":date.year}
   for field in indices:
    try: row[field]=float(source.get(field) or "") if source.get(field) not in ("",None) else None
    except ValueError: row[field]=None
   for code,field in policy_fields.items():
    try: row[code]=float(source.get(field) or "") if field and source.get(field) not in ("",None) else None
    except ValueError: row[code]=None
   for output,field in flag_fields.items():
    try: row[output]=float(source.get(field) or "") if field and source.get(field) not in ("",None) else None
    except ValueError: row[output]=None
   daily.append(row)
 measures=indices+list(POLICY_LABELS);flags=list(flag_fields)
 missing=[code for code,field in policy_fields.items() if field is None]
 if missing: print("Advertencia: medidas no disponibles en OxCGRT: "+", ".join(missing))
 return daily,measures,flags
def aggregate_oxcgrt(daily,metrics):
 grouped={}
 for row in daily: grouped.setdefault((row["iso3"],row["anio"]),[]).append(row)
 output=[]
 for (iso3,year),rows in sorted(grouped.items()):
  rows.sort(key=lambda r:r["fecha"]);result={"iso3":iso3,"anio":year,"dias_observados":len(rows)}
  for metric in metrics:
   values=[r[metric] for r in rows if r.get(metric) is not None]
   result[metric]=round(sum(values)/len(values),4) if values else None
   if metric in POLICY_LABELS:
    result[f"dias_con_dato_{metric}"]=len(values)
    if metric.startswith("C"): result[f"dias_{metric}_vigente"]=sum(v>0 for v in values)
  c6=[(r["fecha"],r.get("C6")) for r in rows]
  result["dias_C6_recomendacion"]=sum(v is not None and v>=1 for _,v in c6)
  result["dias_C6_obligatorio"]=sum(v is not None and v>=2 for _,v in c6)
  result["dias_C6_estricto"]=sum(v is not None and v>=3 for _,v in c6)
  longest=current=0;previous=None
  for date_text,value in c6:
   date=datetime.strptime(date_text,"%Y-%m-%d").date()
   if value is not None and value>=2:
    current=current+1 if previous and date==previous+timedelta(days=1) else 1;longest=max(longest,current)
   else: current=0
   previous=date if value is not None else None
  result["racha_max_C6_obligatorio"]=longest;output.append(result)
 return output
def validate(wdi,ox_daily,ox_yearly,countries,indicators):
 expected=set(range(START_YEAR,END_YEAR+1))
 wk=[(r["iso3"],r["anio"],r["codigo_indicador"]) for r in wdi];ok=[(r["iso3"],r["fecha"]) for r in ox_daily]
 duplicate_wdi=len(wk)-len(set(wk));duplicate_ox=len(ok)-len(set(ok))
 country_wdi=sorted({r["iso3"] for r in wdi});country_ox=sorted({r["iso3"] for r in ox_daily})
 indicator_coverage=sorted({r["codigo_indicador"] for r in wdi});year_coverage=sorted({r["anio"] for r in wdi})
 missing=sorted({i["codigo"] for i in indicators}-set(indicator_coverage))
 measure_coverage={code:sum(r.get(code) is not None for r in ox_daily) for code in POLICY_LABELS}
 checks={"sin_duplicados_wdi":duplicate_wdi==0,"sin_duplicados_oxcgrt":duplicate_ox==0,"sin_anios_fuera_de_rango":not(set(year_coverage)-expected),"indicadores_wdi_presentes":not missing,"wdi_no_vacio":bool(wdi),"oxcgrt_no_vacio":bool(ox_daily),"c6_disponible":measure_coverage.get("C6",0)>0}
 summary={"generado_utc":datetime.now(timezone.utc).isoformat(),"periodo_wdi":[START_YEAR,END_YEAR],"periodo_oxcgrt":[OX_START,OX_END],"paises_configurados":len(countries),"paises_con_datos_wdi":len(country_wdi),"paises_con_datos_oxcgrt":len(country_ox),"paises_oxcgrt_iso3":country_ox,"anios_wdi":year_coverage,"indicadores_wdi":indicator_coverage,"medidas_oxcgrt":measure_coverage,"indicadores_sin_datos":missing,"filas_wdi":len(wdi),"filas_oxcgrt_diarias":len(ox_daily),"filas_oxcgrt_anuales":len(ox_yearly),"duplicados_wdi":duplicate_wdi,"duplicados_oxcgrt":duplicate_ox,"controles":checks,"estado":"aprobado" if all(checks.values()) else "requiere_revision"}
 VALIDATION.mkdir(parents=True,exist_ok=True);(VALIDATION/"summary.json").write_text(json.dumps(summary,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
 if not all(checks.values()): raise RuntimeError("Falló la validación de datos. Revisar data/validation/summary.json.")
 return summary
def main():
 countries_config=read_json(ROOT/"config"/"paises.json");indicators_config=read_json(ROOT/"config"/"indicadores-wdi.json")
 countries=countries_config["iso3"];indicators=indicators_config["indicadores"]
 wdi=fetch_wdi(countries,indicators);daily,metrics,flags=fetch_oxcgrt(set(countries));yearly=aggregate_oxcgrt(daily,metrics)
 write_csv(OUT/"wdi_indicadores.csv",wdi,["iso3","pais","anio","codigo_indicador","indicador","valor"])
 write_csv(OUT/"oxcgrt_diario.csv",daily,["iso3","fecha","anio",*metrics,*flags])
 yearly_fields=["iso3","anio","dias_observados",*metrics,*[f"dias_con_dato_{k}" for k in POLICY_LABELS],*[f"dias_{k}_vigente" for k in POLICY_LABELS if k.startswith("C")],"dias_C6_recomendacion","dias_C6_obligatorio","dias_C6_estricto","racha_max_C6_obligatorio"]
 write_csv(OUT/"oxcgrt_anual.csv",yearly,yearly_fields)
 print(json.dumps(validate(wdi,daily,yearly,countries,indicators),ensure_ascii=False,indent=2))
if __name__=="__main__": main()

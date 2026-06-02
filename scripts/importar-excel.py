import pandas as pd
import sqlite3
import os
from datetime import datetime, date

EXCEL = r"C:\Users\pedro.sa\OneDrive - PME MAQUINAS E EQUIPAMENTOS LTDA\PEDRO\RELAÇÃO_GADO - GERAL - 2026.xlsx"
DB    = r"C:\Users\pedro.sa\fazendas-dona-olga\prisma\rebanho.db"

df = pd.read_excel(EXCEL, sheet_name="Geral", header=6)
df.columns = [str(c).strip() for c in df.columns]

# Colunas reais após leitura com header=6:
# 0:Data Reg., 1:Sexo, 2:Tipo, 3:Espec., 4:Pelagem,
# 5:Idade, 6:Nº, 7:Observações, 8:Peso (@), 9:Ref. (@),
# 10:Cor do brinco, 11:LOTE

cols = list(df.columns)

SEXOS_VALIDOS  = {"F", "M"}
TIPOS_VALIDOS  = {"Nelore", "Comum", "Leiteiro"}
ESPEC_VALIDOS  = {"Bezerra", "Novilha", "Vaca", "Bezerro", "Garrote", "Touro"}

animais = []
for _, row in df.iterrows():
    sexo  = str(row.iloc[1]).strip() if pd.notna(row.iloc[1]) else ""
    tipo  = str(row.iloc[2]).strip() if pd.notna(row.iloc[2]) else ""
    espec = str(row.iloc[3]).strip() if pd.notna(row.iloc[3]) else ""

    if sexo not in SEXOS_VALIDOS:
        continue
    if tipo not in TIPOS_VALIDOS:
        continue
    if espec not in ESPEC_VALIDOS:
        continue

    # Data de registro
    data_reg = row.iloc[0]
    if pd.isna(data_reg):
        continue
    if isinstance(data_reg, (datetime, date, pd.Timestamp)):
        data_reg = pd.Timestamp(data_reg).strftime("%Y-%m-%d %H:%M:%S")
    else:
        try:
            data_reg = pd.to_datetime(str(data_reg)).strftime("%Y-%m-%d %H:%M:%S")
        except:
            continue

    pelagem  = str(row.iloc[4]).strip() if pd.notna(row.iloc[4]) else ""
    numero   = str(row.iloc[6]).strip() if pd.notna(row.iloc[6]) else None
    if numero in ("nan", "-", "", "None"):
        numero = None

    obs      = str(row.iloc[7]).strip() if pd.notna(row.iloc[7]) else None
    if obs in ("nan", "None", ""):
        obs = None

    peso_raw = row.iloc[8]
    peso     = float(peso_raw) if pd.notna(peso_raw) and str(peso_raw).replace(".","").isdigit() else None
    try:
        peso = float(peso_raw) if pd.notna(peso_raw) else None
    except:
        peso = None

    ref_raw  = row.iloc[9]
    try:
        peso_ref = float(ref_raw) if pd.notna(ref_raw) else None
    except:
        peso_ref = None

    cor_brinco = str(row.iloc[10]).strip() if pd.notna(row.iloc[10]) else None
    if cor_brinco in ("nan", "None", ""):
        cor_brinco = None

    lote_raw = row.iloc[11]
    lote     = str(lote_raw).strip() if pd.notna(lote_raw) else None
    if lote in ("nan", "None", ""):
        lote = None

    now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    animais.append((
        data_reg,   # dataRegistro
        "Ativo",    # status
        sexo,
        tipo,
        espec,
        pelagem,
        numero,
        None,       # apelido
        obs,
        peso,
        peso_ref,
        cor_brinco,
        lote,
        "importacao",  # criadoPor
        now,        # criadoEm
        now,        # atualizadoEm
    ))

conn = sqlite3.connect(DB)
cur  = conn.cursor()

cur.execute("SELECT COUNT(*) FROM Animal")
existentes = cur.fetchone()[0]
if existentes > 0:
    print(f"Banco já tem {existentes} animais. Pulando importação.")
    conn.close()
else:
    cur.executemany("""
        INSERT INTO Animal
          (dataRegistro, status, sexo, tipo, espec, pelagem,
           numero, apelido, observacoes, peso, pesoRef,
           corBrinco, lote, criadoPor, criadoEm, atualizadoEm)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
    """, animais)
    conn.commit()
    print(f"Importados {len(animais)} animais com sucesso!")

conn.close()

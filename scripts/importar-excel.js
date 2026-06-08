/**
 * Script de importação do Excel para o banco SQLite
 * Uso: node scripts/importar-excel.js
 */

const xlsx = require('xlsx');
const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const EXCEL_PATH = 'C:/Users/pedro.sa/OneDrive - PME MAQUINAS E EQUIPAMENTOS LTDA/PEDRO/SUBIR APP.xlsx';
const DB_PATH = path.join(__dirname, '../prisma/rebanho.db');

// Converte serial do Excel para data ISO
function excelDateToISO(serial) {
  if (!serial || isNaN(serial)) return new Date().toISOString();
  const jsDate = new Date(Math.round((serial - 25569) * 86400 * 1000));
  return jsDate.toISOString();
}

// Limpa valor: "-" ou undefined ou vazio → null
function limpa(v) {
  if (v === undefined || v === null) return null;
  const s = String(v).trim();
  if (s === '-' || s === '' || s.toLowerCase() === 'null') return null;
  return s;
}

// Cor do brinco: "S/Brinco" → null
function limpaCorBrinco(v) {
  const s = limpa(v);
  if (!s || s === 'S/Brinco') return null;
  return s;
}

// Número do animal: pode ser inteiro → string
function limpaNumero(v) {
  if (v === undefined || v === null) return null;
  const s = String(v).trim();
  if (s === '-' || s === '') return null;
  // Se for numérico puro, pode deixar como string
  return s;
}

function main() {
  console.log('📖 Lendo Excel...');
  const wb = xlsx.readFile(EXCEL_PATH);
  const ws = wb.Sheets[wb.SheetNames[0]];
  const data = xlsx.utils.sheet_to_json(ws, { header: 1 });
  const rows = data.slice(1).filter(r => r && r.length > 0);

  console.log(`✅ ${rows.length} linhas encontradas`);

  console.log('🔌 Abrindo banco de dados...');
  const db = new Database(DB_PATH);

  // Limpa dados existentes (mantém auditoria)
  console.log('🗑️  Limpando animais e procedimentos existentes...');
  db.exec('DELETE FROM Procedimento');
  db.exec('DELETE FROM Animal');
  // Reset autoincrement
  db.exec("DELETE FROM sqlite_sequence WHERE name='Animal'");
  db.exec("DELETE FROM sqlite_sequence WHERE name='Procedimento'");

  // Prepara insert
  const insert = db.prepare(`
    INSERT INTO Animal (
      numero, apelido, sexo, tipo, espec, pelagem,
      lote, status, peso, pesoRef,
      corBrinco, observacoes,
      dataRegistro, criadoEm, atualizadoEm,
      numeroMae, apelidoMae, criadoPor
    ) VALUES (
      @numero, @apelido, @sexo, @tipo, @espec, @pelagem,
      @lote, @status, @peso, @pesoRef,
      @corBrinco, @observacoes,
      @dataRegistro, @criadoEm, @atualizadoEm,
      @numeroMae, @apelidoMae, @criadoPor
    )
  `);

  let ok = 0, erros = 0;

  const insertMany = db.transaction((rows) => {
    for (const row of rows) {
      try {
        // Colunas:
        // 0: TIPO ENTRADA  1: STATUS      2: Data Reg.   3: ID REG
        // 4: Sexo          5: ORIGEM      6: Tipo        7: Espec.
        // 8: Pelagem       9: Idade       10: Nº         11: Apelido
        // 12: Nº Mãe      13: Apelido Mãe 14: Observações 15: Peso(KGs)
        // 16: Cor brinco  17: LOTE

        const status  = limpa(row[1]) || 'Ativo';
        const dataReg = excelDateToISO(row[2]);
        const sexo    = limpa(row[4]) || 'F';
        const origem  = limpa(row[5]);
        const tipo    = limpa(row[6]) || 'Nelore';
        const espec   = limpa(row[7]) || 'Vaca';
        const pelagem = limpa(row[8]) || 'Branco';
        const numero  = limpaNumero(row[10]);
        const apelido = limpa(row[11]);
        const numMae  = limpaNumero(row[12]);
        const apMae   = limpa(row[13]);
        const obs     = limpa(row[14]);
        const pesoKg  = row[15] ? parseFloat(row[15]) : null;
        const pesoArr = pesoKg ? pesoKg / 30 : null; // converte para arrobas (1@ = 30kg, rendimento 50%)
        const corBr   = limpaCorBrinco(row[16]);
        const lote    = limpa(row[17]);

        // Monta observações finais
        let observacoes = obs || null;
        if (origem) {
          observacoes = observacoes ? `${observacoes} | Origem: ${origem}` : `Origem: ${origem}`;
        }

        insert.run({
          numero,
          apelido,
          sexo,
          tipo,
          espec,
          pelagem,
          lote,
          status,
          peso: pesoArr,
          pesoRef: pesoArr,
          corBrinco: corBr,
          observacoes,
          dataRegistro: dataReg,
          criadoEm: new Date().toISOString(),
          numeroMae: numMae,
          apelidoMae: apMae,
          atualizadoEm: new Date().toISOString(),
          criadoPor: 'importacao-excel',
        });

        ok++;
      } catch (e) {
        erros++;
        console.error(`❌ Erro na linha:`, row[10], '-', e.message);
      }
    }
  });

  insertMany(rows);

  const total = db.prepare('SELECT COUNT(*) as n FROM Animal').get();
  console.log(`\n✅ Importação concluída!`);
  console.log(`   ✔ ${ok} animais importados`);
  if (erros > 0) console.log(`   ✖ ${erros} erros`);
  console.log(`   📊 Total no banco: ${total.n} animais`);

  // Resumo por status e lote
  const porLote = db.prepare('SELECT lote, COUNT(*) as n FROM Animal GROUP BY lote').all();
  console.log('\n📋 Por lote:');
  porLote.forEach(l => console.log(`   ${l.lote || 'S/Lote'}: ${l.n}`));

  db.close();
}

main();

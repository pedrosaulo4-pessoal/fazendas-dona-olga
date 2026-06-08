/**
 * Migra dados do SQLite local para o Turso (nuvem)
 * Uso: TURSO_DATABASE_URL=libsql://... TURSO_AUTH_TOKEN=... node scripts/migrar-para-turso.js
 */

const Database = require('better-sqlite3');
const { createClient } = require('@libsql/client');
const path = require('path');

const TURSO_URL = process.env.TURSO_DATABASE_URL;
const TURSO_TOKEN = process.env.TURSO_AUTH_TOKEN;

if (!TURSO_URL) {
  console.error('❌ Defina TURSO_DATABASE_URL e TURSO_AUTH_TOKEN antes de rodar este script.');
  process.exit(1);
}

async function main() {
  console.log('🔌 Abrindo banco local...');
  const sqlite = new Database(path.join(__dirname, '../prisma/rebanho.db'));

  console.log('☁️  Conectando ao Turso...');
  const turso = createClient({ url: TURSO_URL, authToken: TURSO_TOKEN });

  console.log('📋 Criando tabelas no Turso...');
  await turso.executeMultiple(`
    CREATE TABLE IF NOT EXISTS Animal (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      dataRegistro DATETIME NOT NULL,
      status TEXT NOT NULL DEFAULT 'Ativo',
      sexo TEXT NOT NULL,
      tipo TEXT NOT NULL,
      espec TEXT NOT NULL,
      pelagem TEXT NOT NULL,
      numero TEXT,
      apelido TEXT,
      observacoes TEXT,
      peso REAL,
      pesoRef REAL,
      corBrinco TEXT,
      lote TEXT,
      numeroMae TEXT,
      apelidoMae TEXT,
      criadoPor TEXT,
      criadoEm DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      atualizadoEm DATETIME NOT NULL
    );
    CREATE TABLE IF NOT EXISTS Procedimento (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      animalId INTEGER,
      tipo TEXT NOT NULL,
      loteNome TEXT,
      loteObs TEXT,
      dataProcedimento DATETIME NOT NULL,
      quantidade INTEGER,
      pesoEstimado REAL,
      observacoes TEXT,
      registradoPor TEXT NOT NULL DEFAULT 'sistema',
      criadoEm DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (animalId) REFERENCES Animal(id)
    );
    CREATE TABLE IF NOT EXISTS AuditLog (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      usuario TEXT NOT NULL,
      acao TEXT NOT NULL,
      animalId INTEGER,
      detalhes TEXT,
      criadoEm DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (animalId) REFERENCES Animal(id)
    );
  `);

  // Migrar animais
  const animais = sqlite.prepare('SELECT * FROM Animal').all();
  console.log(`🐄 Migrando ${animais.length} animais...`);
  for (const a of animais) {
    await turso.execute({
      sql: `INSERT OR IGNORE INTO Animal
              (id,dataRegistro,status,sexo,tipo,espec,pelagem,numero,apelido,observacoes,
               peso,pesoRef,corBrinco,lote,numeroMae,apelidoMae,criadoPor,criadoEm,atualizadoEm)
            VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      args: [a.id, a.dataRegistro, a.status, a.sexo, a.tipo, a.espec, a.pelagem,
             a.numero, a.apelido, a.observacoes, a.peso, a.pesoRef, a.corBrinco,
             a.lote, a.numeroMae, a.apelidoMae, a.criadoPor, a.criadoEm, a.atualizadoEm],
    });
  }

  // Migrar procedimentos
  const procs = sqlite.prepare('SELECT * FROM Procedimento').all();
  console.log(`📋 Migrando ${procs.length} procedimentos...`);
  for (const p of procs) {
    await turso.execute({
      sql: `INSERT OR IGNORE INTO Procedimento
              (id,animalId,tipo,loteNome,loteObs,dataProcedimento,quantidade,
               pesoEstimado,observacoes,registradoPor,criadoEm)
            VALUES (?,?,?,?,?,?,?,?,?,?,?)`,
      args: [p.id, p.animalId, p.tipo, p.loteNome, p.loteObs, p.dataProcedimento,
             p.quantidade, p.pesoEstimado, p.observacoes, p.registradoPor || 'sistema', p.criadoEm],
    });
  }

  // Verificação final
  const totalAnimais = (await turso.execute('SELECT COUNT(*) as n FROM Animal')).rows[0].n;
  const totalProcs   = (await turso.execute('SELECT COUNT(*) as n FROM Procedimento')).rows[0].n;
  console.log(`\n✅ Migração concluída!`);
  console.log(`   🐄 ${totalAnimais} animais no Turso`);
  console.log(`   📋 ${totalProcs} procedimentos no Turso`);

  sqlite.close();
}

main().catch(e => { console.error('❌', e.message); process.exit(1); });

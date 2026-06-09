const { createClient } = require('@libsql/client');

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function main() {
  await turso.execute(`CREATE TABLE IF NOT EXISTS Foto (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    animalId INTEGER,
    url TEXT NOT NULL,
    nome TEXT NOT NULL,
    criadoEm DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (animalId) REFERENCES Animal(id)
  )`);
  console.log('✅ Tabela Foto criada no Turso!');
}

main().catch(e => { console.error('❌', e.message); process.exit(1); });

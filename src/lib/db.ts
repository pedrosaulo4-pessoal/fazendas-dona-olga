import { PrismaClient } from '@/generated/prisma/client';

// Lê via colchetes para evitar que o Turbopack substitua o valor em build-time
const env = process.env as Record<string, string | undefined>;

function createPrismaClient(): PrismaClient {
  const tursoUrl   = env['TURSO_DATABASE_URL']?.trim();
  const tursoToken = env['TURSO_AUTH_TOKEN']?.trim();

  if (tursoUrl && tursoUrl !== 'undefined') {
    // Produção: Turso (SQLite na nuvem)
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { createClient } = require('@libsql/client');
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { PrismaLibSql } = require('@prisma/adapter-libsql');
    const libsql = createClient({ url: tursoUrl, authToken: tursoToken });
    const adapter = new PrismaLibSql(libsql);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return new PrismaClient({ adapter } as any);
  }

  // Local: arquivo SQLite
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const path = require('path');
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3');
  const dbUrl = path.join(process.cwd(), 'prisma', 'rebanho.db');
  const adapter = new PrismaBetterSqlite3({ url: dbUrl });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return new PrismaClient({ adapter } as any);
}

let _client: PrismaClient | null = null;
function getClient(): PrismaClient {
  if (!_client) _client = createPrismaClient();
  return _client;
}

export const prisma = new Proxy({} as PrismaClient, {
  get(_: PrismaClient, prop: string | symbol) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (getClient() as any)[prop];
  },
});

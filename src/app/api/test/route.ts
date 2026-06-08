import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const env = process.env as any;
  const tursoUrl   = env['TURSO_DATABASE_URL']?.trim();
  const tursoToken = env['TURSO_AUTH_TOKEN']?.trim();

  const urlStatus = !tursoUrl ? 'ausente'
    : tursoUrl === 'undefined' ? 'string-undefined'
    : `ok (${tursoUrl.slice(0, 25)}...)`;

  // Teste 1: conexão direta LibSQL
  let directResult: unknown = null;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { createClient } = require('@libsql/client');
    const client = createClient({ url: tursoUrl, authToken: tursoToken });
    const r = await client.execute('SELECT COUNT(*) as n FROM Animal');
    directResult = { ok: true, count: Number(r.rows[0].n) };
  } catch (e: unknown) {
    directResult = { ok: false, error: e instanceof Error ? e.message : String(e) };
  }

  // Teste 2: via Prisma
  let prismaResult: unknown = null;
  try {
    const count = await prisma.animal.count();
    prismaResult = { ok: true, count };
  } catch (e: unknown) {
    prismaResult = { ok: false, error: e instanceof Error ? e.message : String(e) };
  }

  return NextResponse.json({ url_status: urlStatus, direct: directResult, prisma: prismaResult });
}

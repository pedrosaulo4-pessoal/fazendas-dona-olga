import { NextResponse } from 'next/server';

export async function GET() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const env = process.env as any;
  const tursoUrl   = env['TURSO_DATABASE_URL']?.trim();
  const tursoToken = env['TURSO_AUTH_TOKEN']?.trim();

  const urlStatus = !tursoUrl ? 'ausente'
    : tursoUrl === 'undefined' ? 'string-undefined'
    : `ok (${tursoUrl.slice(0, 25)}...)`;

  // Testa conexão direta com Turso SEM Prisma
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { createClient } = require('@libsql/client');
    const client = createClient({ url: tursoUrl, authToken: tursoToken });
    const result = await client.execute('SELECT COUNT(*) as n FROM Animal');
    return NextResponse.json({
      ok: true,
      total_animais: Number(result.rows[0].n),
      url_status: urlStatus,
      via: 'libsql-direto',
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ ok: false, error: msg, url_status: urlStatus, via: 'libsql-direto' }, { status: 500 });
  }
}

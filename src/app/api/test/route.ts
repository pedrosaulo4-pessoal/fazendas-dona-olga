import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  const env = process.env as Record<string, string | undefined>;
  const urlRaw = env['TURSO_DATABASE_URL'];
  const urlStatus = !urlRaw ? 'ausente' : urlRaw === 'undefined' ? 'string-undefined' : `ok (${urlRaw.slice(0, 20)}...)`;

  try {
    const count = await prisma.animal.count();
    return NextResponse.json({ ok: true, total_animais: count, url_status: urlStatus });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ ok: false, error: msg, url_status: urlStatus }, { status: 500 });
  }
}

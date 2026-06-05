import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const pagina = parseInt(searchParams.get('pagina') || '1');
  const porPagina = parseInt(searchParams.get('porPagina') || '20');

  const [logs, total] = await Promise.all([
    prisma.auditLog.findMany({
      orderBy: { criadoEm: 'desc' },
      skip: (pagina - 1) * porPagina,
      take: porPagina,
    }),
    prisma.auditLog.count(),
  ]);

  return NextResponse.json({ logs, total });
}

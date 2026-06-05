import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  const [animais, procedimentos, auditLogs] = await Promise.all([
    prisma.animal.findMany({ orderBy: { id: 'asc' } }),
    prisma.procedimento.findMany({ orderBy: { id: 'asc' } }),
    prisma.auditLog.findMany({ orderBy: { id: 'asc' } }),
  ]);

  const backup = {
    geradoEm: new Date().toISOString(),
    versao: 'V1.2',
    totais: {
      animais: animais.length,
      procedimentos: procedimentos.length,
      logs: auditLogs.length,
    },
    animais,
    procedimentos,
    auditLogs,
  };

  return new NextResponse(JSON.stringify(backup, null, 2), {
    headers: {
      'Content-Type': 'application/json',
      'Content-Disposition': `attachment; filename="backup-rebanho-${new Date().toISOString().split('T')[0]}.json"`,
    },
  });
}

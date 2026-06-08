import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const animal = await prisma.animal.findUnique({
    where: { id: parseInt(id) },
    include: {
      procedimentos: {
        orderBy: { dataProcedimento: 'desc' },
        take: 20,
      },
    },
  });

  if (!animal) return NextResponse.json({ error: 'Não encontrado' }, { status: 404 });
  return NextResponse.json(animal);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const animalId = parseInt(id);

  try {
    const body = await req.json().catch(() => ({}));
    const motivo = body.motivo || 'Excluído';

    const session = req.cookies.get('session');
    let usuario = 'sistema';
    try { if (session?.value) usuario = JSON.parse(session.value).login; } catch { /* */ }

    // Registra auditoria antes de excluir
    await prisma.auditLog.create({
      data: { usuario, acao: 'exclusao', animalId, detalhes: motivo },
    });

    // Exclui procedimentos vinculados e depois o animal
    await prisma.procedimento.deleteMany({ where: { animalId } });
    await prisma.animal.delete({ where: { id: animalId } });

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

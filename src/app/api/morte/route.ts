import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(req: NextRequest) {
  const session = req.cookies.get('session');
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  const usuario = JSON.parse(session.value).login;

  const body = await req.json();

  // Atualiza o animal para Morto
  const animal = await prisma.animal.update({
    where: { id: parseInt(body.animalId) },
    data: {
      status: 'Morto',
      peso: body.peso ? parseFloat(body.peso) : undefined,
      observacoes: body.observacoes || undefined,
      atualizadoEm: new Date(),
    },
  });

  await prisma.auditLog.create({
    data: {
      usuario,
      acao: 'morte',
      animalId: animal.id,
      detalhes: JSON.stringify({ ...body, dataMorte: body.dataMorte }),
    },
  });

  return NextResponse.json(animal);
}

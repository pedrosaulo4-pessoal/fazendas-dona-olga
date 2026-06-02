import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(req: NextRequest) {
  const session = req.cookies.get('session');
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  const usuario = JSON.parse(session.value).login;

  const body = await req.json();

  const animal = await prisma.animal.update({
    where: { id: parseInt(body.animalId) },
    data: {
      pesoRef: body.pesoAtual ? parseFloat(body.pesoAtual) : undefined,
      peso: body.pesoAtual ? parseFloat(body.pesoAtual) : undefined,
      lote: body.lote || undefined,
      atualizadoEm: new Date(),
    },
  });

  await prisma.auditLog.create({
    data: { usuario, acao: 'pesagem', animalId: animal.id, detalhes: JSON.stringify(body) },
  });

  return NextResponse.json(animal);
}

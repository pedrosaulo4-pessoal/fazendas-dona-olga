import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(req: NextRequest) {
  const session = req.cookies.get('session');
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  const usuario = JSON.parse(session.value).login;

  const body = await req.json();

  const proc = await prisma.procedimento.create({
    data: {
      animalId: body.animalId ? parseInt(body.animalId) : null,
      tipo: body.tipo,
      loteNome: body.loteNome || null,
      loteObs: body.loteObs || null,
      dataProcedimento: new Date(body.dataProcedimento),
      quantidade: body.quantidade ? parseInt(body.quantidade) : null,
      pesoEstimado: body.pesoEstimado ? parseFloat(body.pesoEstimado) : null,
      observacoes: body.observacoes || null,
      registradoPor: usuario,
    },
  });

  await prisma.auditLog.create({
    data: { usuario, acao: 'procedimento', animalId: body.animalId ? parseInt(body.animalId) : null, detalhes: JSON.stringify(body) },
  });

  return NextResponse.json(proc);
}

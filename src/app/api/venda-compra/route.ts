import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(req: NextRequest) {
  const session = req.cookies.get('session');
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  const usuario = JSON.parse(session.value).login;

  const body = await req.json();

  if (body.operacao === 'venda') {
    const animal = await prisma.animal.update({
      where: { id: parseInt(body.animalId) },
      data: { status: 'Vendido', observacoes: body.observacoes || undefined, atualizadoEm: new Date() },
    });
    await prisma.auditLog.create({
      data: { usuario, acao: 'venda', animalId: animal.id, detalhes: JSON.stringify(body) },
    });
    return NextResponse.json(animal);
  }

  // compra = novo animal
  const animal = await prisma.animal.create({
    data: {
      dataRegistro: new Date(body.dataCompra),
      status: 'Ativo',
      sexo: body.sexo,
      tipo: body.tipo ?? 'Comum',
      espec: body.espec ?? 'Vaca',
      pelagem: body.pelagem ?? '',
      numero: body.numero || null,
      apelido: body.apelido || null,
      observacoes: body.observacoes || null,
      peso: body.peso ? parseFloat(body.peso) : null,
      lote: body.lote || null,
      criadoPor: usuario,
    },
  });
  await prisma.auditLog.create({
    data: { usuario, acao: 'compra', animalId: animal.id, detalhes: JSON.stringify(body) },
  });
  return NextResponse.json(animal);
}

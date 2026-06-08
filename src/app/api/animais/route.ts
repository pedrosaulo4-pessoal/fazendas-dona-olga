import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q') ?? '';
  const status = searchParams.get('status') ?? 'Ativo';

  const animais = await prisma.animal.findMany({
    where: {
      status,
      OR: q
        ? [
            { numero: { contains: q } },
            { apelido: { contains: q } },
            { observacoes: { contains: q } },
          ]
        : undefined,
    },
    orderBy: { numero: 'asc' },
    take: 50,
  });

  return NextResponse.json(animais);
}

export async function POST(req: NextRequest) {
  const session = req.cookies.get('session');
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });

  let usuario = 'sistema';
  try { usuario = JSON.parse(session.value).login; } catch { /* usa 'sistema' */ }

  try {
    const body = await req.json();

    const animal = await prisma.animal.create({
      data: {
        dataRegistro: new Date(body.dataRegistro),
        status: body.status ?? 'Ativo',
        sexo: body.sexo,
        tipo: body.tipo,
        espec: body.espec,
        pelagem: body.pelagem,
        numero: body.numero || null,
        apelido: body.apelido || null,
        observacoes: body.observacoes || null,
        peso: body.peso ? parseFloat(body.peso) : null,
        pesoRef: body.pesoRef ? parseFloat(body.pesoRef) : null,
        corBrinco: body.corBrinco || null,
        lote: body.lote || null,
        numeroMae: body.numeroMae || null,
        apelidoMae: body.apelidoMae || null,
        criadoPor: usuario,
      },
    });

    await prisma.auditLog.create({
      data: { usuario, acao: body.acao ?? 'cadastro', animalId: animal.id, detalhes: JSON.stringify(body) },
    });

    return NextResponse.json(animal);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[POST /api/animais]', msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

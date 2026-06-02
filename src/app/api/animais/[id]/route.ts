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

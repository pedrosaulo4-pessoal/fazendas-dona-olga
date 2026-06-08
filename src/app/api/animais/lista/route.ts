import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const q = searchParams.get('q') || '';
  const status = searchParams.get('status') || '';
  const sexo = searchParams.get('sexo') || '';
  const lote = searchParams.get('lote') || '';
  const espec = searchParams.get('espec') || '';
  const pagina = parseInt(searchParams.get('pagina') || '1');
  const porPagina = parseInt(searchParams.get('porPagina') || '20');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = {};

  if (status) where.status = status;
  if (sexo) where.sexo = sexo;
  if (lote) where.lote = lote;
  if (espec) where.espec = espec;
  if (q) {
    where.OR = [
      { numero:    { contains: q } },
      { apelido:   { contains: q } },
      { numeroMae: { contains: q } },
      { apelidoMae:{ contains: q } },
      { observacoes:{ contains: q } },
      { lote:      { contains: q } },
    ];
  }

  const [animais, total] = await Promise.all([
    prisma.animal.findMany({
      where,
      orderBy: [{ status: 'asc' }, { numero: 'asc' }],
      skip: (pagina - 1) * porPagina,
      take: porPagina,
      select: {
        id: true,
        numero: true,
        apelido: true,
        sexo: true,
        tipo: true,
        espec: true,
        pelagem: true,
        lote: true,
        status: true,
        peso: true,
        dataRegistro: true,
      },
    }),
    prisma.animal.count({ where }),
  ]);

  return NextResponse.json({ animais, total });
}

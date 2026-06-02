import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  const [
    total,
    ativos,
    vendidos,
    mortos,
    machos,
    femeas,
    porLoteRaw,
    porTipoRaw,
    porEspecRaw,
    pesoMedioRaw,
  ] = await Promise.all([
    prisma.animal.count(),
    prisma.animal.count({ where: { status: 'Ativo' } }),
    prisma.animal.count({ where: { status: 'Vendido' } }),
    prisma.animal.count({ where: { status: 'Morto' } }),
    prisma.animal.count({ where: { status: 'Ativo', sexo: 'Macho' } }),
    prisma.animal.count({ where: { status: 'Ativo', sexo: 'Fêmea' } }),
    prisma.animal.groupBy({ by: ['lote'], where: { status: 'Ativo' }, _count: { id: true }, orderBy: { _count: { id: 'desc' } } }),
    prisma.animal.groupBy({ by: ['tipo'], where: { status: 'Ativo' }, _count: { id: true }, orderBy: { _count: { id: 'desc' } } }),
    prisma.animal.groupBy({ by: ['espec'], where: { status: 'Ativo' }, _count: { id: true }, orderBy: { _count: { id: 'desc' } } }),
    prisma.animal.aggregate({ where: { status: 'Ativo', peso: { not: null } }, _avg: { peso: true } }),
  ]);

  return NextResponse.json({
    total,
    ativos,
    vendidos,
    mortos,
    machos,
    femeas,
    porLote: porLoteRaw.map(r => ({ lote: r.lote || 'Sem lote', count: r._count.id })),
    porTipo: porTipoRaw.map(r => ({ tipo: r.tipo, count: r._count.id })),
    porEspec: porEspecRaw.map(r => ({ espec: r.espec, count: r._count.id })),
    pesoMedio: pesoMedioRaw._avg.peso,
  });
}

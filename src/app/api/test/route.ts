import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  const results: Record<string, unknown> = {};

  // Teste 1: leitura (count)
  try {
    const count = await prisma.animal.count();
    results.leitura = { ok: true, count };
  } catch (e: unknown) {
    results.leitura = { ok: false, error: e instanceof Error ? e.message : String(e) };
  }

  // Teste 2: escrita (cria animal de teste e apaga logo em seguida)
  try {
    const animal = await prisma.animal.create({
      data: {
        dataRegistro: new Date(),
        status: 'TESTE',
        sexo: 'F',
        tipo: 'TESTE',
        espec: 'TESTE',
        pelagem: 'TESTE',
        criadoPor: 'api-test',
      },
    });
    await prisma.animal.delete({ where: { id: animal.id } });
    results.escrita = { ok: true, id_criado: animal.id };
  } catch (e: unknown) {
    results.escrita = { ok: false, error: e instanceof Error ? e.message : String(e) };
  }

  return NextResponse.json(results);
}

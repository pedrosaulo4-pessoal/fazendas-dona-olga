import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(req: NextRequest) {
  const session = req.cookies.get('session');
  let usuario = 'sistema';
  try { if (session?.value) usuario = JSON.parse(session.value).login; } catch { /* */ }

  try {
    const body = await req.json();
    const { animalId, dataMorte, peso, observacoes, sexo, numeroMae } = body;

    let animal = null;

    if (animalId) {
      // Animal cadastrado: atualiza para Morto
      const updateData: Record<string, unknown> = {
        status: 'Morto',
        atualizadoEm: new Date(),
      };
      if (peso)        updateData.peso        = parseFloat(peso);
      if (observacoes) updateData.observacoes = observacoes;
      if (sexo)        updateData.sexo        = sexo;
      if (numeroMae)   updateData.numeroMae   = numeroMae;

      animal = await prisma.animal.update({
        where: { id: parseInt(animalId) },
        data: updateData,
      });
    }

    // Cria procedimento de morte
    await prisma.procedimento.create({
      data: {
        animalId: animal?.id ?? null,
        tipo: 'Morte',
        dataProcedimento: dataMorte ? new Date(dataMorte) : new Date(),
        pesoEstimado: peso ? parseFloat(peso) : null,
        observacoes: observacoes || null,
        registradoPor: usuario,
      },
    });

    await prisma.auditLog.create({
      data: {
        usuario,
        acao: 'morte',
        animalId: animal?.id ?? null,
        detalhes: JSON.stringify(body),
      },
    });

    return NextResponse.json({ ok: true, animal });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[POST /api/morte]', msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

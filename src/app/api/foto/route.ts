import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const fd = await req.formData();
    const foto = fd.get('foto') as File | null;
    const animalId = fd.get('animalId');
    const numero = fd.get('numero') as string || 'sem-numero';
    const dataFoto = fd.get('dataFoto') as string || new Date().toISOString().split('T')[0];

    if (!foto) return NextResponse.json({ error: 'Foto obrigatória' }, { status: 400 });

    const nomeCustom = fd.get('nomeCustom') as string | null;
    const [ano, mes, dia] = dataFoto.split('-');
    const ext = foto.name.split('.').pop() || 'jpg';
    const nomeBase = nomeCustom || `${numero}-${dia}-${mes}-${ano}`;
    const nomeArquivo = `${nomeBase}.${ext}`;
    const pasta = path.join(process.cwd(), 'public', 'fotos_rebanho', numero);

    await mkdir(pasta, { recursive: true });
    const bytes = await foto.arrayBuffer();
    await writeFile(path.join(pasta, nomeArquivo), Buffer.from(bytes));

    // Registra no audit log
    if (animalId && animalId !== '') {
      await prisma.auditLog.create({
        data: {
          usuario: 'usuario',
          acao: 'FOTO',
          animalId: parseInt(animalId as string),
          detalhes: `Foto adicionada: ${nomeArquivo}`,
        },
      });
    }

    return NextResponse.json({ ok: true, arquivo: nomeArquivo });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Erro ao salvar foto' }, { status: 500 });
  }
}

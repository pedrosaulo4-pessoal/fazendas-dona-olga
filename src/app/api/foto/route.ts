import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { prisma } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const fd = await req.formData();
    const foto = fd.get('foto') as File | null;
    const animalIdRaw = fd.get('animalId') as string | null;
    const numero = (fd.get('numero') as string) || 'sem-brinco';
    const dataFoto = (fd.get('dataFoto') as string) || new Date().toISOString().split('T')[0];
    const nomeCustom = fd.get('nomeCustom') as string | null;

    if (!foto) return NextResponse.json({ error: 'Foto obrigatória' }, { status: 400 });

    const [ano, mes, dia] = dataFoto.split('-');
    const ext = foto.name.split('.').pop() || 'jpg';
    const nomeBase = nomeCustom || `${numero}-${dia}-${mes}-${ano}`;
    const nomeArquivo = `${nomeBase}.${ext}`;

    // Salva no Vercel Blob (permanente)
    const blob = await put(
      `APP-AFAZENDA/fotos/${numero}/${nomeArquivo}`,
      foto,
      { access: 'public' }
    );

    const animalId = animalIdRaw && animalIdRaw !== '' ? parseInt(animalIdRaw) : null;

    // Registra na tabela Foto e no AuditLog
    await prisma.foto.create({
      data: {
        animalId,
        url: blob.url,
        nome: nomeArquivo,
      },
    });

    if (animalId) {
      await prisma.auditLog.create({
        data: {
          usuario: 'sistema',
          acao: 'FOTO',
          animalId,
          detalhes: `Foto: ${nomeArquivo} → ${blob.url}`,
        },
      });
    }

    return NextResponse.json({ ok: true, url: blob.url, arquivo: nomeArquivo });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error('[POST /api/foto]', msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

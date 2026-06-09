import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { put } from '@vercel/blob';
import * as XLSX from 'xlsx';

// Usa bracket notation para evitar inlining pelo Turbopack
const env = process.env as Record<string, string | undefined>;

// Protege contra chamadas externas (apenas Vercel Cron ou admin)
function autorizado(req: NextRequest): boolean {
  const cronSecret = env['CRON_SECRET'];
  const auth = req.headers.get('authorization');
  // Vercel Cron envia este header automaticamente
  if (cronSecret && auth === `Bearer ${cronSecret}`) return true;
  // Permite acesso manual via /api/backup/cron?secret=...
  const secret = new URL(req.url).searchParams.get('secret');
  if (secret && cronSecret && secret === cronSecret) return true;
  return false;
}

export async function GET(req: NextRequest) {
  const cronSecret = env['CRON_SECRET'];
  const querySecret = new URL(req.url).searchParams.get('secret');

  if (!autorizado(req)) {
    // Debug: mostrar info sobre o secret (sem revelar o valor completo)
    return NextResponse.json({
      error: 'Não autorizado',
      debug: {
        hasCronSecret: !!cronSecret,
        cronSecretLen: cronSecret?.length ?? 0,
        hasQuerySecret: !!querySecret,
        querySecretLen: querySecret?.length ?? 0,
        match: cronSecret && querySecret ? cronSecret === querySecret : false,
      }
    }, { status: 401 });
  }

  try {
    const hoje = new Date().toISOString().split('T')[0]; // AAAA-MM-DD

    // Busca todos os animais com procedimentos e fotos
    const animais = await prisma.animal.findMany({
      include: {
        procedimentos: { orderBy: { dataProcedimento: 'asc' } },
        fotos: { orderBy: { criadoEm: 'desc' }, take: 1 },
      },
      orderBy: { id: 'asc' },
    });

    // Monta as linhas do XLSX (uma linha por animal + uma por procedimento)
    const linhas: unknown[][] = [];

    // Cabeçalho
    linhas.push([
      'TIPO ENTRADA', 'STATUS', 'Data Reg.', 'ID REG', 'Sexo', 'Tipo', 'Espec.',
      'Pelagem', 'Nº', 'Apelido', 'Nº Mãe', 'Apelido Mãe', 'Observações',
      'Peso (KGs)', 'Cor Brinco', 'LOTE', 'Foto URL',
    ]);

    for (const a of animais) {
      const pesoKg = a.peso != null ? (a.peso * 30).toFixed(1) : '';
      const fotoUrl = a.fotos[0]?.url ?? '';
      const dataReg = a.dataRegistro ? new Date(a.dataRegistro).toLocaleDateString('pt-BR') : '';

      linhas.push([
        'Animal', a.status, dataReg, `A${String(a.id).padStart(6, '0')}`,
        a.sexo, a.tipo, a.espec, a.pelagem,
        a.numero ?? '', a.apelido ?? '',
        a.numeroMae ?? '', a.apelidoMae ?? '',
        a.observacoes ?? '', pesoKg, a.corBrinco ?? '', a.lote ?? '',
        fotoUrl,
      ]);

      // Linhas de procedimentos
      for (const p of a.procedimentos) {
        const dataProcBR = new Date(p.dataProcedimento).toLocaleDateString('pt-BR');
        const pesoProc = p.pesoEstimado != null ? (p.pesoEstimado * 30).toFixed(1) : '';
        linhas.push([
          p.tipo, a.status, dataProcBR, `P${String(p.id).padStart(6, '0')}`,
          a.sexo, a.tipo, a.espec, a.pelagem,
          a.numero ?? '', a.apelido ?? '',
          a.numeroMae ?? '', a.apelidoMae ?? '',
          p.observacoes ?? '', pesoProc, '', a.lote ?? '', '',
        ]);
      }
    }

    // Gera XLSX
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(linhas);
    ws['!cols'] = Array(17).fill({ wch: 18 });
    XLSX.utils.book_append_sheet(wb, ws, 'Registros');
    const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

    // Salva no Vercel Blob
    const nomeArquivo = `backup-${hoje}.xlsx`;
    const blob = await put(
      `APP-AFAZENDA/registros/${nomeArquivo}`,
      buffer,
      { access: 'public', contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }
    );

    return NextResponse.json({
      ok: true,
      data: hoje,
      animais: animais.length,
      arquivo: nomeArquivo,
      url: blob.url,
    });

  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

'use client';
import FormPage from '@/components/FormPage';

const VERSOES = [
  {
    versao: 'V1.2',
    data: '05/06/2026',
    atual: true,
    itens: [
      'Painel do Administrador completo (perfis, auditoria, backup, versões)',
      'Perfil Veterinário adicionado ao sistema',
      'Campo de foto nas telas de Nascimento e Morte',
      'Botão Emitir Relatório em Venda/Compra',
      'Ícone da vaquinha no app',
    ],
  },
  {
    versao: 'V1.1',
    data: '05/06/2026',
    atual: false,
    itens: [
      'Telas de Consultar Rebanho com filtros e paginação',
      'Detalhe individual de cada animal',
      'Relatório Geral do rebanho com estatísticas',
      'Todas as rotas de menu conectadas',
    ],
  },
  {
    versao: 'V1.0',
    data: '02/06/2026',
    atual: false,
    itens: [
      'Sistema publicado no Vercel',
      'Login com 3 perfis (Admin, Vaqueiro, Visitante)',
      'Telas de Nascimento, Morte, Procedimento, Venda/Compra',
      'Telas de Pesagem, Doença, Aborto, Foto',
      '173 animais importados da planilha Excel',
      'PWA instalável no celular',
    ],
  },
];

export default function VersoesPage() {
  return (
    <FormPage titulo="Versões">
      <div className="flex flex-col gap-4">
        {VERSOES.map(v => (
          <div key={v.versao} className={`rounded-xl border p-4 ${v.atual ? 'bg-[#1a237e] border-[#1a237e]' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className={`text-lg font-black ${v.atual ? 'text-[#FFD700]' : 'text-[#1a237e]'}`}>{v.versao}</span>
                {v.atual && (
                  <span className="text-[10px] bg-[#FFD700] text-gray-900 font-bold px-2 py-0.5 rounded-full">ATUAL</span>
                )}
              </div>
              <span className={`text-xs ${v.atual ? 'text-white/60' : 'text-gray-400'}`}>{v.data}</span>
            </div>
            <ul className="flex flex-col gap-1">
              {v.itens.map((item, i) => (
                <li key={i} className={`text-xs flex gap-1.5 ${v.atual ? 'text-white/90' : 'text-gray-600'}`}>
                  <span className={v.atual ? 'text-[#FFD700]' : 'text-green-500'}>•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </FormPage>
  );
}

'use client';
import { useState, useEffect } from 'react';
import FormPage from '@/components/FormPage';

type Registro = {
  id: number;
  numero: string | null;
  apelido: string | null;
  sexo: string;
  tipo: string;
  status: string;
  observacoes: string | null;
  atualizadoEm: string;
  criadoEm: string;
};

function fmtData(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR');
}

export default function RelatorioVendaCompraPage() {
  const [vendas, setVendas] = useState<Registro[]>([]);
  const [compras, setCompras] = useState<Registro[]>([]);
  const [loading, setLoading] = useState(true);
  const [aba, setAba] = useState<'vendas' | 'compras'>('vendas');

  useEffect(() => {
    Promise.all([
      fetch('/api/animais/lista?status=Vendido&porPagina=100').then(r => r.json()),
      fetch('/api/animais/lista?status=Ativo&porPagina=100').then(r => r.json()),
    ]).then(([v, c]) => {
      setVendas(v.animais || []);
      // Compras = animais com observação de compra (criados via compra)
      setCompras((c.animais || []).filter((a: Registro) =>
        a.observacoes?.toLowerCase().includes('comprado') || a.observacoes?.toLowerCase().includes('compra')
      ));
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const lista = aba === 'vendas' ? vendas : compras;

  return (
    <FormPage titulo="Relatório Venda/Compra">
      {/* Abas */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setAba('vendas')}
          className={`flex-1 py-3 rounded-lg font-bold text-sm transition-all
            ${aba === 'vendas' ? 'bg-[#1a237e] text-white' : 'bg-white border border-gray-300 text-gray-700'}`}
        >
          Vendas ({vendas.length})
        </button>
        <button
          onClick={() => setAba('compras')}
          className={`flex-1 py-3 rounded-lg font-bold text-sm transition-all
            ${aba === 'compras' ? 'bg-[#1a237e] text-white' : 'bg-white border border-gray-300 text-gray-700'}`}
        >
          Compras ({compras.length})
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Carregando...</div>
      ) : lista.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          Nenhum registro de {aba === 'vendas' ? 'venda' : 'compra'} encontrado.
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {lista.map(a => (
            <div key={a.id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
              <div className="flex justify-between items-start mb-1">
                <span className="font-bold text-[#1a237e]">
                  {a.numero ? `Nº ${a.numero}` : 'S/N'}
                  {a.apelido ? ` — ${a.apelido}` : ''}
                </span>
                <span className="text-xs text-gray-400">{fmtData(a.atualizadoEm)}</span>
              </div>
              <p className="text-xs text-gray-600">{a.sexo} · {a.tipo}</p>
              {a.observacoes && (
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">{a.observacoes}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </FormPage>
  );
}

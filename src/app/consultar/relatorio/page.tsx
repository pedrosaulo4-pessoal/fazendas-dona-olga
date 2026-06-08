'use client';
import { useState, useEffect } from 'react';
import FormPage from '@/components/FormPage';

type Resumo = {
  total: number;
  ativos: number;
  vendidos: number;
  mortos: number;
  machos: number;
  femeas: number;
  porLote: Array<{ lote: string; count: number }>;
  porTipo: Array<{ tipo: string; count: number }>;
  porEspec: Array<{ espec: string; count: number }>;
  pesoMedio: number | null;
};

function Card({ label, valor, cor }: { label: string; valor: string | number; cor?: string }) {
  return (
    <div className={`rounded-xl p-4 flex flex-col items-center ${cor || 'bg-white border border-gray-200'}`}>
      <span className="text-2xl font-bold text-[#1a237e]">{valor}</span>
      <span className="text-xs text-gray-600 mt-1 text-center">{label}</span>
    </div>
  );
}

function Barra({ label, valor, total }: { label: string; valor: number; total: number }) {
  const pct = total > 0 ? Math.round((valor / total) * 100) : 0;
  return (
    <div className="flex flex-col gap-1 mb-2">
      <div className="flex justify-between text-xs">
        <span className="text-gray-700 font-medium">{label || '—'}</span>
        <span className="text-gray-500">{valor} ({pct}%)</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2">
        <div className="bg-[#1a237e] h-2 rounded-full transition-all" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function RelatorioPage() {
  const [dados, setDados] = useState<Resumo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/relatorio')
      .then(r => r.json())
      .then(d => setDados(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <FormPage titulo="Relatório Geral"><div className="text-center py-12 text-gray-400">Carregando...</div></FormPage>;
  if (!dados) return <FormPage titulo="Relatório Geral"><div className="text-center py-12 text-gray-400">Erro ao carregar.</div></FormPage>;

  return (
    <FormPage titulo="Relatório Geral">
      <div className="flex flex-col gap-5">
        {/* Totais */}
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Rebanho Total</p>
          <div className="grid grid-cols-2 gap-3">
            <Card label="Total de Animais" valor={dados.total} />
            <Card label="Ativos" valor={dados.ativos} cor="bg-green-50 border border-green-200" />
            <Card label="Vendidos" valor={dados.vendidos} cor="bg-blue-50 border border-blue-200" />
            <Card label="Mortos" valor={dados.mortos} cor="bg-red-50 border border-red-200" />
          </div>
        </div>

        {/* Sexo */}
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Por Sexo (ativos)</p>
          <div className="grid grid-cols-2 gap-3">
            <Card label="Machos" valor={dados.machos} />
            <Card label="Fêmeas" valor={dados.femeas} />
          </div>
        </div>

        {/* Peso médio */}
        {dados.pesoMedio != null && (
          <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Peso Médio (ativos)</p>
            <p className="text-2xl font-bold text-[#1a237e]">{(dados.pesoMedio * 30).toFixed(0)} kg</p>
            <p className="text-xs text-gray-500">{dados.pesoMedio.toFixed(2)} arrobas</p>
          </div>
        )}

        {/* Por lote */}
        {dados.porLote.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Por Lote (ativos)</p>
            {dados.porLote.map(item => (
              <Barra key={item.lote} label={item.lote} valor={item.count} total={dados.ativos} />
            ))}
          </div>
        )}

        {/* Por tipo */}
        {dados.porTipo.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Por Tipo (ativos)</p>
            {dados.porTipo.map(item => (
              <Barra key={item.tipo} label={item.tipo} valor={item.count} total={dados.ativos} />
            ))}
          </div>
        )}

        {/* Por espécie */}
        {dados.porEspec.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Por Espécie/Raça (ativos)</p>
            {dados.porEspec.map(item => (
              <Barra key={item.espec} label={item.espec} valor={item.count} total={dados.ativos} />
            ))}
          </div>
        )}
      </div>
    </FormPage>
  );
}

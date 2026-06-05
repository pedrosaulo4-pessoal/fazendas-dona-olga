'use client';
import { useState, useEffect } from 'react';
import FormPage from '@/components/FormPage';

type Log = {
  id: number;
  usuario: string;
  acao: string;
  animalId: number | null;
  detalhes: string | null;
  criadoEm: string;
};

function fmtData(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString('pt-BR') + ' ' + d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

const ACAO_COR: Record<string, string> = {
  nascimento: 'bg-green-100 text-green-800',
  morte: 'bg-red-100 text-red-800',
  venda: 'bg-blue-100 text-blue-800',
  compra: 'bg-purple-100 text-purple-800',
  pesagem: 'bg-yellow-100 text-yellow-800',
  procedimento: 'bg-orange-100 text-orange-800',
  FOTO: 'bg-pink-100 text-pink-800',
};

export default function AuditoriaPage() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagina, setPagina] = useState(1);
  const [total, setTotal] = useState(0);
  const POR_PAGINA = 20;

  useEffect(() => {
    setLoading(true);
    fetch(`/api/auditoria?pagina=${pagina}&porPagina=${POR_PAGINA}`)
      .then(r => r.json())
      .then(d => { setLogs(d.logs || []); setTotal(d.total || 0); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [pagina]);

  const totalPaginas = Math.max(1, Math.ceil(total / POR_PAGINA));

  return (
    <FormPage titulo="Históricos / Auditoria">
      <p className="text-xs text-gray-500 text-right mb-3">{total} registro{total !== 1 ? 's' : ''} no total</p>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Carregando...</div>
      ) : logs.length === 0 ? (
        <div className="text-center py-12 text-gray-400">Nenhum registro encontrado.</div>
      ) : (
        <div className="flex flex-col gap-2">
          {logs.map(log => (
            <div key={log.id} className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${ACAO_COR[log.acao] || 'bg-gray-100 text-gray-700'}`}>
                    {log.acao}
                  </span>
                  <span className="text-xs font-semibold text-gray-700">{log.usuario}</span>
                </div>
                <span className="text-[10px] text-gray-400">{fmtData(log.criadoEm)}</span>
              </div>
              {log.animalId && (
                <p className="text-xs text-gray-500">Animal #{log.animalId}</p>
              )}
              {log.detalhes && (
                <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{log.detalhes}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {totalPaginas > 1 && (
        <div className="flex justify-between items-center mt-4 gap-2">
          <button onClick={() => setPagina(p => Math.max(1, p - 1))} disabled={pagina === 1}
            className="flex-1 py-3 rounded-lg border border-gray-300 text-sm font-medium disabled:opacity-40 bg-white">
            ← Anterior
          </button>
          <span className="text-sm text-gray-600">{pagina} / {totalPaginas}</span>
          <button onClick={() => setPagina(p => Math.min(totalPaginas, p + 1))} disabled={pagina === totalPaginas}
            className="flex-1 py-3 rounded-lg border border-gray-300 text-sm font-medium disabled:opacity-40 bg-white">
            Próxima →
          </button>
        </div>
      )}
    </FormPage>
  );
}

'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import FormPage from '@/components/FormPage';

type Animal = {
  id: number;
  numero: string | null;
  apelido: string | null;
  sexo: string;
  tipo: string;
  espec: string;
  pelagem: string;
  lote: string | null;
  status: string;
  peso: number | null;
  dataRegistro: string;
};

const STATUS_COR: Record<string, string> = {
  Ativo: 'bg-green-100 text-green-800',
  Vendido: 'bg-blue-100 text-blue-800',
  Morto: 'bg-red-100 text-red-800',
};

export default function AnimaisPage() {
  const router = useRouter();
  const [animais, setAnimais] = useState<Animal[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('Ativo');
  const [filtroSexo, setFiltroSexo] = useState('');
  const [filtroLote, setFiltroLote] = useState('');
  const [filtroEspec, setFiltroEspec] = useState('');
  const [pagina, setPagina] = useState(1);
  const POR_PAGINA = 20;

  const carregar = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (busca) params.set('q', busca);
    if (filtroStatus) params.set('status', filtroStatus);
    if (filtroSexo) params.set('sexo', filtroSexo);
    if (filtroLote) params.set('lote', filtroLote);
    if (filtroEspec) params.set('espec', filtroEspec);
    params.set('pagina', String(pagina));
    params.set('porPagina', String(POR_PAGINA));
    try {
      const res = await fetch(`/api/animais/lista?${params}`);
      const data = await res.json();
      setAnimais(data.animais || []);
      setTotal(data.total || 0);
    } catch { /* silencia */ }
    finally { setLoading(false); }
  }, [busca, filtroStatus, filtroSexo, filtroLote, filtroEspec, pagina]);

  useEffect(() => { carregar(); }, [carregar]);

  // Reset página ao mudar filtros
  useEffect(() => { setPagina(1); }, [busca, filtroStatus, filtroSexo, filtroLote, filtroEspec]);

  const totalPaginas = Math.max(1, Math.ceil(total / POR_PAGINA));

  return (
    <FormPage titulo="Lista de Animais">
      {/* Filtros */}
      <div className="flex flex-col gap-2 mb-4">
        <input
          type="text"
          placeholder="🔍 Buscar por número, apelido..."
          value={busca}
          onChange={e => setBusca(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base bg-white shadow-sm outline-none focus:border-[#1a237e]"
        />
        <div className="grid grid-cols-2 gap-2">
          <select value={filtroStatus} onChange={e => setFiltroStatus(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white">
            <option value="">Todos status</option>
            <option value="Ativo">Ativo</option>
            <option value="Vendido">Vendido</option>
            <option value="Morto">Morto</option>
          </select>
          <select value={filtroSexo} onChange={e => setFiltroSexo(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white">
            <option value="">Sexo</option>
            <option value="M">Macho</option>
            <option value="F">Fêmea</option>
          </select>
          <select value={filtroLote} onChange={e => setFiltroLote(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white">
            <option value="">Lote</option>
            {['Novilhada','Paridas','Bezerros Engorda','Leiteiro','Descarte','24h','Perdido'].map(l =>
              <option key={l} value={l}>{l}</option>
            )}
          </select>
          <select value={filtroEspec} onChange={e => setFiltroEspec(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white">
            <option value="">Espécie</option>
            {['Vaca','Novilha','Bezerra','Bezerro','Touro'].map(e =>
              <option key={e} value={e}>{e}</option>
            )}
          </select>
        </div>
        <p className="text-xs text-gray-500 text-right">{total} animal{total !== 1 ? 'is' : ''} encontrado{total !== 1 ? 's' : ''}</p>
      </div>

      {/* Lista */}
      {loading ? (
        <div className="text-center py-12 text-gray-400">Carregando...</div>
      ) : animais.length === 0 ? (
        <div className="text-center py-12 text-gray-400">Nenhum animal encontrado.</div>
      ) : (
        <div className="flex flex-col gap-2">
          {animais.map(a => (
            <div key={a.id}
              className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col gap-1 cursor-pointer active:bg-gray-50"
              onClick={() => router.push(`/consultar/animais/${a.id}`)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-bold text-[#1a237e] text-base">
                    {a.numero ? `Nº ${a.numero}` : 'S/N'}
                  </span>
                  {a.apelido && <span className="text-gray-600 ml-2 text-sm">— {a.apelido}</span>}
                </div>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${STATUS_COR[a.status] || 'bg-gray-100 text-gray-600'}`}>
                  {a.status}
                </span>
              </div>
              <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-gray-600">
                <span>{a.sexo}</span>
                <span>·</span>
                <span>{a.tipo}</span>
                <span>·</span>
                <span>{a.espec}</span>
                {a.pelagem && <><span>·</span><span>{a.pelagem}</span></>}
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-0.5">
                <span>{a.lote || '—'}</span>
                {a.peso != null && <span>{(a.peso * 30).toFixed(0)} kg</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Paginação */}
      {totalPaginas > 1 && (
        <div className="flex justify-between items-center mt-4 gap-2">
          <button
            onClick={() => setPagina(p => Math.max(1, p - 1))}
            disabled={pagina === 1}
            className="flex-1 py-3 rounded-lg border border-gray-300 text-sm font-medium disabled:opacity-40 bg-white"
          >
            ← Anterior
          </button>
          <span className="text-sm text-gray-600">{pagina} / {totalPaginas}</span>
          <button
            onClick={() => setPagina(p => Math.min(totalPaginas, p + 1))}
            disabled={pagina === totalPaginas}
            className="flex-1 py-3 rounded-lg border border-gray-300 text-sm font-medium disabled:opacity-40 bg-white"
          >
            Próxima →
          </button>
        </div>
      )}
    </FormPage>
  );
}

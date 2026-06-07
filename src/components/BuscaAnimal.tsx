'use client';

import { useState, useEffect, useRef } from 'react';

export interface AnimalEncontrado {
  id: number;
  numero: string | null;
  apelido: string | null;
  sexo: string;
  tipo: string;
  espec: string;
  peso: number | null;
  lote: string | null;
  corBrinco: string | null;
  numeroMae: string | null;
  apelidoMae: string | null;
  observacoes: string | null;
}

interface Props {
  onSelect: (animal: AnimalEncontrado) => void;
  semBrinco?: boolean;
  onSemBrincoChange?: (val: boolean) => void;
}

export default function BuscaAnimal({ onSelect, semBrinco, onSemBrincoChange }: Props) {
  const [q, setQ] = useState('');
  const [resultados, setResultados] = useState<AnimalEncontrado[]>([]);
  const [aberto, setAberto] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (q.length < 1) { setResultados([]); return; }
    const t = setTimeout(async () => {
      const res = await fetch(`/api/animais?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setResultados(data);
      setAberto(true);
    }, 300);
    return () => clearTimeout(t);
  }, [q]);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setAberto(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  function label(a: AnimalEncontrado) {
    const n = a.numero ?? a.apelido ?? `ID${a.id}`;
    return a.apelido ? `${n} — ${a.apelido}` : n;
  }

  return (
    <div ref={ref} className="relative">
      <div className="flex gap-2 items-center">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Buscar por número ou apelido..."
            value={q}
            onChange={e => setQ(e.target.value)}
            onFocus={() => q && setAberto(true)}
            className="w-full bg-white border border-gray-300 rounded px-4 py-4 text-gray-800
                       shadow-[3px_3px_0_rgba(0,0,0,0.12)] outline-none focus:border-[#1a237e]"
          />
          {aberto && resultados.length > 0 && (
            <div className="absolute z-50 top-full left-0 right-0 bg-white border border-gray-200 rounded-b-lg shadow-lg max-h-56 overflow-y-auto">
              {resultados.map(a => (
                <button
                  key={a.id}
                  type="button"
                  className="w-full text-left px-4 py-3 hover:bg-blue-50 border-b border-gray-100 last:border-0"
                  onClick={() => { onSelect(a); setQ(label(a)); setAberto(false); }}
                >
                  <span className="font-bold text-[#1a237e]">{a.numero ?? '—'}</span>
                  {a.apelido && <span className="text-gray-500 text-sm ml-2">{a.apelido}</span>}
                  <span className="text-gray-400 text-xs ml-2">{a.espec} · {a.sexo}</span>
                  {a.corBrinco && <span className="text-gray-400 text-xs ml-2">· {a.corBrinco}</span>}
                </button>
              ))}
            </div>
          )}
        </div>
        {onSemBrincoChange !== undefined && (
          <label className="flex items-center gap-1 text-xs text-gray-600 cursor-pointer flex-shrink-0">
            <input
              type="checkbox"
              checked={semBrinco ?? false}
              onChange={e => onSemBrincoChange(e.target.checked)}
              className="w-4 h-4 accent-[#1a237e]"
            />
            <span>Sem<br/>Brinco</span>
          </label>
        )}
      </div>
    </div>
  );
}

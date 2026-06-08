'use client';

import { AnimalEncontrado } from './BuscaAnimal';

const COR_HEX: Record<string, string> = {
  Amarelo: '#FFC107',
  Azul: '#2196F3',
  Laranja: '#FF9800',
  Rosa: '#E91E63',
  Verde: '#4CAF50',
};

interface Props {
  animal: AnimalEncontrado;
  pesoKg: string;
  onPesoKgChange: (v: string) => void;
  lote: string;
  onLoteChange: (v: string) => void;
  showPeso?: boolean;
}

const LOTES = ['Novilhada','Paridas','Bezerros Engorda','Leiteiro','Descarte','24h','Perdido'];

export default function AnimalSelecionado({ animal, pesoKg, onPesoKgChange, lote, onLoteChange, showPeso = true }: Props) {
  const corHex = animal.corBrinco ? COR_HEX[animal.corBrinco] : null;

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex flex-col gap-3">
      {/* Linha 1: número + brinco + sexo */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="font-black text-[#1a237e] text-base">
          Nº {animal.numero ?? 'S/N'}
        </span>
        {corHex && (
          <span
            className="text-xs font-bold px-2 py-0.5 rounded-full text-white"
            style={{ backgroundColor: corHex }}
          >
            {animal.corBrinco}
          </span>
        )}
        <span className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full font-semibold">
          {animal.sexo === 'F' ? 'Fêmea' : animal.sexo === 'M' ? 'Macho' : animal.sexo}
        </span>
        <span className="text-xs text-gray-500">{animal.espec}</span>
      </div>

      {/* Linha 2: apelido e mãe */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        {animal.apelido && (
          <div>
            <span className="text-gray-500 font-semibold uppercase tracking-wide">Apelido</span>
            <p className="font-bold text-gray-800">{animal.apelido}</p>
          </div>
        )}
        {(animal.numeroMae || animal.apelidoMae) && (
          <div>
            <span className="text-gray-500 font-semibold uppercase tracking-wide">Mãe</span>
            <p className="font-bold text-gray-800">
              {animal.numeroMae ?? ''}{animal.apelidoMae ? ` (${animal.apelidoMae})` : ''}
            </p>
          </div>
        )}
      </div>

      {/* Linha 3: peso editável */}
      {showPeso && (
        <div>
          <label className="text-[11px] font-bold tracking-[0.12em] uppercase text-gray-600 block mb-1">
            Último Peso (KG) — editável se houver peso mais atual
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              step="0.1"
              value={pesoKg}
              onChange={e => onPesoKgChange(e.target.value)}
              placeholder="0.0"
              className="w-full bg-white border border-gray-300 rounded px-4 py-3 text-gray-800 text-base
                         shadow-[2px_2px_0_rgba(0,0,0,0.10)] outline-none focus:border-[#1a237e]"
            />
            {pesoKg && (
              <span className="text-xs text-gray-500 whitespace-nowrap">
                {(parseFloat(pesoKg) / 30).toFixed(2)} @
              </span>
            )}
          </div>
          {animal.peso != null && !pesoKg && (
            <p className="text-xs text-gray-400 mt-1">
              Cadastrado: {(animal.peso * 30).toFixed(0)} kg / {animal.peso.toFixed(2)} @
            </p>
          )}
        </div>
      )}

      {/* Linha 4: lote editável */}
      <div>
        <label className="text-[11px] font-bold tracking-[0.12em] uppercase text-gray-600 block mb-1">
          Lote — editável se houver mudança
        </label>
        <select
          value={lote}
          onChange={e => onLoteChange(e.target.value)}
          className="w-full bg-white border border-gray-300 rounded px-4 py-3 text-gray-800 text-base
                     shadow-[2px_2px_0_rgba(0,0,0,0.10)] outline-none focus:border-[#1a237e] appearance-none"
        >
          <option value="">— mesmo lote —</option>
          {LOTES.map(l => <option key={l} value={l}>{l}</option>)}
        </select>
      </div>
    </div>
  );
}

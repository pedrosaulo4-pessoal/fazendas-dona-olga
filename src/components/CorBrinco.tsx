'use client';

const CORES = [
  { nome: 'Amarelo', hex: '#FFC107' },
  { nome: 'Azul',    hex: '#2196F3' },
  { nome: 'Laranja', hex: '#FF9800' },
  { nome: 'Rosa',    hex: '#E91E63' },
  { nome: 'Verde',   hex: '#4CAF50' },
];

interface Props {
  value: string;
  onChange: (cor: string) => void;
}

export default function CorBrinco({ value, onChange }: Props) {
  return (
    <div className="flex gap-3 flex-wrap">
      {CORES.map(c => (
        <button
          key={c.nome}
          type="button"
          onClick={() => onChange(c.nome)}
          className="flex flex-col items-center gap-1"
        >
          <span
            className="w-11 h-11 rounded-full transition-all"
            style={{
              backgroundColor: c.hex,
              border: value === c.nome ? '3px solid #1a237e' : '3px solid transparent',
              boxShadow: value === c.nome ? '0 0 0 2px #1a237e' : '0 2px 4px rgba(0,0,0,0.2)',
            }}
          />
          <span className="text-[10px] text-gray-600 font-medium">{c.nome}</span>
        </button>
      ))}
    </div>
  );
}

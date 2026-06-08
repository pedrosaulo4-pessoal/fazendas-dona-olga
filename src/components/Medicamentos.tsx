'use client';

const CATEGORIAS = [
  'Antiparasitários Endectocidas',
  'Vermífugos',
  'Carrapaticidas',
  'Mosquicidas e Ectoparasiticidas',
  'Antibióticos',
  'Antiprotozoários',
  'Anti-inflamatórios',
  'Reprodutivos',
  'Vacinas',
  'Vitaminas',
  'Minerais Injetáveis',
  'Modificadores Orgânicos',
  'Probióticos e Aditivos Zootécnicos',
  'Terapia Intramamária',
  'Soluções e Repositores Eletrolíticos',
];

interface Props {
  selecionados: string[];
  onChange: (lista: string[]) => void;
}

export default function Medicamentos({ selecionados, onChange }: Props) {
  function toggle(cat: string) {
    if (selecionados.includes(cat)) {
      onChange(selecionados.filter(c => c !== cat));
    } else {
      onChange([...selecionados, cat]);
    }
  }

  const col1 = CATEGORIAS.slice(0, 5);
  const col2 = CATEGORIAS.slice(5, 10);
  const col3 = CATEGORIAS.slice(10, 15);

  function Coluna({ items }: { items: string[] }) {
    return (
      <div className="flex flex-col gap-2">
        {items.map(cat => (
          <label key={cat} className="flex items-start gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={selecionados.includes(cat)}
              onChange={() => toggle(cat)}
              className="mt-0.5 w-4 h-4 accent-[#1a237e] flex-shrink-0"
            />
            <span className="text-xs text-gray-700 leading-tight">{cat}</span>
          </label>
        ))}
      </div>
    );
  }

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-3">
      <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-3">
        Categorias de Medicamentos
      </p>
      <div className="grid grid-cols-3 gap-3">
        <Coluna items={col1} />
        <Coluna items={col2} />
        <Coluna items={col3} />
      </div>
      {selecionados.length > 0 && (
        <p className="text-xs text-[#1a237e] font-semibold mt-3 border-t border-gray-200 pt-2">
          Selecionado{selecionados.length > 1 ? 's' : ''}: {selecionados.join('; ')}
        </p>
      )}
    </div>
  );
}

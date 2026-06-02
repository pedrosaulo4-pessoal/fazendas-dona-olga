'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
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
  pesoRef: number | null;
  corBrinco: string | null;
  observacoes: string | null;
  dataRegistro: string;
  criadoEm: string;
  procedimentos: Array<{ id: number; tipo: string; dataProcedimento: string; observacoes: string | null }>;
};

const STATUS_COR: Record<string, string> = {
  Ativo: 'bg-green-100 text-green-800',
  Vendido: 'bg-blue-100 text-blue-800',
  Morto: 'bg-red-100 text-red-800',
};

function Linha({ label, valor }: { label: string; valor?: string | null }) {
  if (!valor) return null;
  return (
    <div className="flex justify-between py-2 border-b border-gray-100">
      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</span>
      <span className="text-sm text-gray-800 font-medium text-right max-w-[60%]">{valor}</span>
    </div>
  );
}

function fmtData(iso: string) {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleDateString('pt-BR');
}

export default function AnimalDetalhe() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [animal, setAnimal] = useState<Animal | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/animais/${id}`)
      .then(r => r.json())
      .then(d => setAnimal(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <FormPage titulo="Animal"><div className="text-center py-12 text-gray-400">Carregando...</div></FormPage>;
  if (!animal) return <FormPage titulo="Animal"><div className="text-center py-12 text-gray-400">Animal não encontrado.</div></FormPage>;

  return (
    <FormPage titulo={animal.numero ? `Animal Nº ${animal.numero}` : 'Animal S/N'}>
      <div className="flex flex-col gap-4">
        {/* Status badge */}
        <div className="flex items-center justify-between">
          <span className={`text-sm font-bold px-3 py-1.5 rounded-full ${STATUS_COR[animal.status] || 'bg-gray-100'}`}>
            {animal.status}
          </span>
          {animal.apelido && <span className="text-gray-600 text-sm italic">&quot;{animal.apelido}&quot;</span>}
        </div>

        {/* Dados principais */}
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Identificação</p>
          <Linha label="Número" valor={animal.numero} />
          <Linha label="Apelido" valor={animal.apelido} />
          <Linha label="Cor do Brinco" valor={animal.corBrinco} />
          <Linha label="Sexo" valor={animal.sexo} />
          <Linha label="Tipo" valor={animal.tipo} />
          <Linha label="Espécie/Raça" valor={animal.espec} />
          <Linha label="Pelagem" valor={animal.pelagem} />
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Situação</p>
          <Linha label="Lote" valor={animal.lote} />
          <Linha label="Peso" valor={animal.peso != null ? `${(animal.peso * 15).toFixed(0)} kg / ${animal.peso.toFixed(2)} @` : null} />
          <Linha label="Data Registro" valor={fmtData(animal.dataRegistro)} />
          <Linha label="Cadastrado em" valor={fmtData(animal.criadoEm)} />
          {animal.observacoes && (
            <div className="py-2 border-b border-gray-100">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Observações</span>
              <p className="text-sm text-gray-800 mt-1">{animal.observacoes}</p>
            </div>
          )}
        </div>

        {/* Procedimentos */}
        {animal.procedimentos && animal.procedimentos.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
              Histórico ({animal.procedimentos.length})
            </p>
            <div className="flex flex-col gap-2">
              {animal.procedimentos.slice(0, 10).map(p => (
                <div key={p.id} className="border-b border-gray-100 pb-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-semibold text-[#1a237e]">{p.tipo}</span>
                    <span className="text-xs text-gray-500">{fmtData(p.dataProcedimento)}</span>
                  </div>
                  {p.observacoes && <p className="text-xs text-gray-600 mt-0.5">{p.observacoes}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={() => router.back()}
          className="w-full py-4 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white mt-2"
        >
          ← Voltar para Lista
        </button>
      </div>
    </FormPage>
  );
}

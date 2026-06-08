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
  numeroMae: string | null;
  apelidoMae: string | null;
  procedimentos: Array<{ id: number; tipo: string; dataProcedimento: string; observacoes: string | null; pesoEstimado: number | null }>;
};

const STATUS_COR: Record<string, string> = {
  Ativo: 'bg-green-100 text-green-800',
  Vendido: 'bg-blue-100 text-blue-800',
  Morto: 'bg-red-100 text-red-800',
};

const COR_HEX: Record<string, string> = {
  Amarelo: '#FFC107', Azul: '#2196F3', Laranja: '#FF9800', Rosa: '#E91E63', Verde: '#4CAF50',
};

const TIPO_COR: Record<string, string> = {
  Aborto: 'bg-red-50 border-red-200 text-red-700',
  Morte: 'bg-gray-50 border-gray-300 text-gray-700',
  Individual: 'bg-blue-50 border-blue-200 text-blue-700',
  Lote: 'bg-purple-50 border-purple-200 text-purple-700',
};

function fmtData(iso: string) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('pt-BR');
}

function calcularIdade(dataRegistro: string, status: string, procedimentos: Array<{ dataProcedimento: string }>): string {
  const nasc = new Date(dataRegistro);
  let fim: Date;
  if (status !== 'Ativo' && procedimentos.length > 0) {
    fim = new Date(procedimentos[procedimentos.length - 1].dataProcedimento);
  } else {
    fim = new Date();
  }
  const meses = (fim.getFullYear() - nasc.getFullYear()) * 12 + (fim.getMonth() - nasc.getMonth());
  if (meses < 1) return 'Menos de 1 mês';
  if (meses < 12) return `${meses} mês${meses > 1 ? 'es' : ''}`;
  const anos = Math.floor(meses / 12);
  const mesesResto = meses % 12;
  return mesesResto > 0 ? `${anos} ano${anos > 1 ? 's' : ''} e ${mesesResto} mês${mesesResto > 1 ? 'es' : ''}` : `${anos} ano${anos > 1 ? 's' : ''}`;
}

function LinhaInfo({ label, valor, cor }: { label: string; valor?: string | null; cor?: string }) {
  if (!valor) return null;
  return (
    <div className="flex justify-between items-center py-2 border-b border-gray-100">
      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</span>
      {cor ? (
        <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: cor }}>{valor}</span>
      ) : (
        <span className="text-sm text-gray-800 font-medium text-right max-w-[60%]">{valor}</span>
      )}
    </div>
  );
}

const MOTIVOS_EXCLUSAO = ['Não encontrado', 'Registro de teste'];

export default function AnimalDetalhe() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [animal, setAnimal] = useState<Animal | null>(null);
  const [loading, setLoading] = useState(true);
  const [fotoUrl, setFotoUrl] = useState<string | null>(null);
  const [modalExcluir, setModalExcluir] = useState(false);
  const [motivoSelecionado, setMotivoSelecionado] = useState('');
  const [excluindo, setExcluindo] = useState(false);

  async function handleExcluir() {
    if (!motivoSelecionado) return;
    setExcluindo(true);
    try {
      const res = await fetch(`/api/animais/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ motivo: motivoSelecionado }),
      });
      if (!res.ok) throw new Error('Falha ao excluir');
      router.replace('/consultar/animais');
    } catch {
      setExcluindo(false);
      setModalExcluir(false);
    }
  }

  useEffect(() => {
    fetch(`/api/animais/${id}`)
      .then(r => r.json())
      .then(d => {
        setAnimal(d);
        // Tenta carregar foto
        if (d.numero) {
          const url = `/fotos_rebanho/${d.numero}`;
          setFotoUrl(url);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <FormPage titulo="Animal"><div className="text-center py-12 text-gray-400">Carregando...</div></FormPage>;
  if (!animal) return <FormPage titulo="Animal"><div className="text-center py-12 text-gray-400">Animal não encontrado.</div></FormPage>;

  const dataRef = animal.dataRegistro || animal.criadoEm;

  return (
    <FormPage titulo={animal.numero ? `Animal Nº ${animal.numero}` : 'Animal S/N'}>
      <div className="flex flex-col gap-4">

        {/* Status + Apelido */}
        <div className="flex items-center justify-between">
          <span className={`text-sm font-bold px-3 py-1.5 rounded-full ${STATUS_COR[animal.status] || 'bg-gray-100'}`}>
            {animal.status}
          </span>
          {animal.apelido && <span className="text-gray-600 text-sm italic">&quot;{animal.apelido}&quot;</span>}
        </div>

        {/* Foto */}
        {fotoUrl && (
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <img
              src={fotoUrl}
              alt={`Foto animal ${animal.numero}`}
              className="w-full object-cover max-h-56"
              onError={() => setFotoUrl(null)}
            />
          </div>
        )}

        {/* Identificação */}
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Identificação</p>
          <LinhaInfo label="Número" valor={animal.numero} />
          <LinhaInfo label="Apelido" valor={animal.apelido} />
          {animal.corBrinco && (
            <LinhaInfo label="Cor do Brinco" valor={animal.corBrinco} cor={COR_HEX[animal.corBrinco]} />
          )}
          <LinhaInfo label="Sexo" valor={animal.sexo === 'F' ? 'Fêmea' : animal.sexo === 'M' ? 'Macho' : animal.sexo} />
          <LinhaInfo label="Tipo/Raça" valor={`${animal.tipo} — ${animal.espec}`} />
          <LinhaInfo label="Pelagem" valor={animal.pelagem} />
          <LinhaInfo label="Nº da Mãe" valor={animal.numeroMae} />
          <LinhaInfo label="Apelido da Mãe" valor={animal.apelidoMae} />
        </div>

        {/* Situação */}
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Situação</p>
          <LinhaInfo label="Lote" valor={animal.lote} />
          <LinhaInfo
            label="Peso"
            valor={animal.peso != null ? `${(animal.peso * 30).toFixed(0)} kg  /  ${animal.peso.toFixed(2)} @` : null}
          />
          <LinhaInfo label="Idade" valor={calcularIdade(dataRef, animal.status, animal.procedimentos)} />
          <LinhaInfo label="Data de Registro" valor={fmtData(dataRef)} />
          {animal.observacoes && (
            <div className="py-2">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Observações</span>
              <p className="text-sm text-gray-800 mt-1">{animal.observacoes}</p>
            </div>
          )}
        </div>

        {/* Histórico completo */}
        {animal.procedimentos && animal.procedimentos.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
              Histórico de Procedimentos ({animal.procedimentos.length})
            </p>
            <div className="flex flex-col gap-2">
              {animal.procedimentos.map(p => (
                <div key={p.id} className={`border rounded-lg p-3 ${TIPO_COR[p.tipo] || 'bg-gray-50 border-gray-200 text-gray-700'}`}>
                  <div className="flex justify-between items-start">
                    <span className="text-sm font-bold">{p.tipo}</span>
                    <span className="text-xs opacity-70">{fmtData(p.dataProcedimento)}</span>
                  </div>
                  {p.pesoEstimado != null && (
                    <p className="text-xs mt-0.5 opacity-80">
                      Peso: {(p.pesoEstimado * 30).toFixed(0)} kg / {p.pesoEstimado.toFixed(2)} @
                    </p>
                  )}
                  {p.observacoes && <p className="text-xs mt-1 opacity-80">{p.observacoes}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        <button onClick={() => router.back()}
          className="w-full py-4 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white mt-2">
          ← Voltar para Lista
        </button>

        {/* Botão excluir */}
        <button
          onClick={() => { setMotivoSelecionado(''); setModalExcluir(true); }}
          className="w-full py-3 border border-red-300 rounded-xl text-sm font-medium text-red-600 bg-white mt-1"
        >
          🗑️ Excluir Registro
        </button>
      </div>

      {/* Modal de confirmação de exclusão */}
      {modalExcluir && (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-5 flex flex-col gap-4 shadow-xl">
            <h2 className="text-base font-bold text-gray-800 text-center">Excluir Registro</h2>
            <p className="text-sm text-gray-600 text-center">Selecione o motivo da exclusão:</p>

            <div className="flex flex-col gap-2">
              {MOTIVOS_EXCLUSAO.map(motivo => (
                <button
                  key={motivo}
                  onClick={() => setMotivoSelecionado(motivo)}
                  className={`w-full py-3 rounded-xl text-sm font-medium border-2 transition-all
                    ${motivoSelecionado === motivo
                      ? 'border-red-500 bg-red-50 text-red-700'
                      : 'border-gray-200 bg-white text-gray-700'}`}
                >
                  {motivo}
                </button>
              ))}
            </div>

            <button
              onClick={handleExcluir}
              disabled={!motivoSelecionado || excluindo}
              className="w-full py-3 rounded-xl text-sm font-bold bg-red-600 text-white
                         disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {excluindo ? 'Excluindo...' : 'Confirmar Exclusão'}
            </button>

            <button
              onClick={() => setModalExcluir(false)}
              disabled={excluindo}
              className="w-full py-2 text-sm text-gray-500"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </FormPage>
  );
}

'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import FormPage from '@/components/FormPage';
import BuscaAnimal, { AnimalEncontrado } from '@/components/BuscaAnimal';
import AnimalSelecionado from '@/components/AnimalSelecionado';
import { Campo, Input, Textarea, BotaoSalvar, MensagemSucesso } from '@/components/CampoForm';

export default function DoencaPage() {
  const router = useRouter();
  const [animalId, setAnimalId] = useState<number | null>(null);
  const [semBrinco, setSemBrinco] = useState(false);
  const [animal, setAnimal] = useState<AnimalEncontrado | null>(null);
  const [pesoKg, setPesoKg] = useState('');
  const [lote, setLote] = useState('');
  const [dataObservacao, setDataObservacao] = useState(new Date().toISOString().split('T')[0]);
  const [detalhe, setDetalhe] = useState('');
  const [loading, setLoading] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [erro, setErro] = useState('');

  function handleSelect(a: AnimalEncontrado) {
    setAnimalId(a.id);
    setAnimal(a);
    setPesoKg(a.peso != null ? String((a.peso * 15).toFixed(1)) : '');
    setLote(a.lote ?? '');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!animalId && !semBrinco) { setErro('Selecione o animal.'); return; }
    setErro(''); setLoading(true);
    try {
      const res = await fetch('/api/animais', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          animalId,
          acao: 'doenca',
          dataObservacao,
          observacoes: `DOENÇA/CONDIÇÃO (${dataObservacao}): ${detalhe}`,
          sexo: animal?.sexo,
          lote: lote || animal?.lote,
        }),
      });
      if (!res.ok) throw new Error();
      setSucesso(true);
    } catch { setErro('Erro ao salvar.'); }
    finally { setLoading(false); }
  }

  return (
    <FormPage titulo="Informar Doença ou Condição">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Campo label="Nº do Animal">
          <BuscaAnimal semBrinco={semBrinco} onSemBrincoChange={setSemBrinco} onSelect={handleSelect} />
        </Campo>

        {animal && (
          <AnimalSelecionado
            animal={animal}
            pesoKg={pesoKg} onPesoKgChange={setPesoKg}
            lote={lote} onLoteChange={setLote}
          />
        )}

        <Campo label="Data da Observação">
          <Input type="date" value={dataObservacao} onChange={e => setDataObservacao(e.target.value)} required />
        </Campo>
        <Campo label="Detalhar a Situação">
          <Textarea value={detalhe} onChange={e => setDetalhe(e.target.value)} placeholder="Descreva os sintomas ou condição observada..." required />
        </Campo>
        {erro && <p className="text-red-600 text-sm text-center">{erro}</p>}
        <BotaoSalvar loading={loading} />
      </form>
      {sucesso && <MensagemSucesso msg="Doença/Condição registrada!" onClose={() => router.push('/menu')} />}
    </FormPage>
  );
}

'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import FormPage from '@/components/FormPage';
import BuscaAnimal, { AnimalEncontrado } from '@/components/BuscaAnimal';
import AnimalSelecionado from '@/components/AnimalSelecionado';
import { Campo, Input, Textarea, BotaoSalvar, MensagemSucesso } from '@/components/CampoForm';

export default function AbortoPage() {
  const router = useRouter();
  const [animalId, setAnimalId] = useState<number | null>(null);
  const [semBrinco, setSemBrinco] = useState(false);
  const [animal, setAnimal] = useState<AnimalEncontrado | null>(null);
  const [pesoKg, setPesoKg] = useState('');
  const [lote, setLote] = useState('');
  const [dataAborto, setDataAborto] = useState(new Date().toISOString().split('T')[0]);
  const [detalhe, setDetalhe] = useState('');
  const [loading, setLoading] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [erro, setErro] = useState('');

  function handleSelect(a: AnimalEncontrado) {
    setAnimalId(a.id);
    setAnimal(a);
    setPesoKg(a.peso != null ? String((a.peso * 30).toFixed(1)) : '');
    setLote(a.lote ?? '');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!animalId && !semBrinco) { setErro('Selecione o animal.'); return; }
    setErro(''); setLoading(true);
    try {
      await fetch('/api/procedimento', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          animalId,
          tipo: 'Aborto',
          dataProcedimento: dataAborto,
          observacoes: detalhe,
          registradoPor: 'usuario',
          pesoEstimado: pesoKg ? parseFloat(pesoKg) / 30 : null,
          loteNome: lote || null,
        }),
      });
      setSucesso(true);
    } catch { setErro('Erro ao salvar.'); }
    finally { setLoading(false); }
  }

  return (
    <FormPage titulo="Informar Aborto">
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

        <Campo label="Informe a Data do Aborto">
          <Input type="date" value={dataAborto} onChange={e => setDataAborto(e.target.value)} required />
        </Campo>
        <Campo label="Detalhar a Situação">
          <Textarea value={detalhe} onChange={e => setDetalhe(e.target.value)} placeholder="Descreva o ocorrido..." required />
        </Campo>
        {erro && <p className="text-red-600 text-sm text-center">{erro}</p>}
        <BotaoSalvar loading={loading} />
      </form>
      {sucesso && <MensagemSucesso msg="Aborto registrado com sucesso!" onClose={() => router.push('/menu')} />}
    </FormPage>
  );
}

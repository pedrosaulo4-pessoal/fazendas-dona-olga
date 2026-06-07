'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import FormPage from '@/components/FormPage';
import BuscaAnimal, { AnimalEncontrado } from '@/components/BuscaAnimal';
import AnimalSelecionado from '@/components/AnimalSelecionado';
import { Campo, Input, Textarea, BotaoSalvar, MensagemSucesso } from '@/components/CampoForm';

export default function VendaPage() {
  const router = useRouter();
  const [animalId, setAnimalId] = useState<number | null>(null);
  const [semBrinco, setSemBrinco] = useState(false);
  const [animal, setAnimal] = useState<AnimalEncontrado | null>(null);
  const [pesoKg, setPesoKg] = useState('');
  const [lote, setLote] = useState('');
  const [dataVenda, setDataVenda] = useState(new Date().toISOString().split('T')[0]);
  const [destino, setDestino] = useState('');
  const [observacoes, setObservacoes] = useState('');
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
      const res = await fetch('/api/venda-compra', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          animalId,
          operacao: 'venda',
          dataVenda,
          observacoes: `Vendido em ${dataVenda}. Destino: ${destino}. ${observacoes}`,
        }),
      });
      if (!res.ok) throw new Error();
      setSucesso(true);
    } catch { setErro('Erro ao salvar.'); }
    finally { setLoading(false); }
  }

  return (
    <FormPage titulo="Informar Venda">
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

        <Campo label="Informe a Data da Venda">
          <Input type="date" value={dataVenda} onChange={e => setDataVenda(e.target.value)} required />
        </Campo>
        <Campo label="Informe o Destino do Animal">
          <Input value={destino} onChange={e => setDestino(e.target.value)} placeholder="Fazenda / Frigorífico de destino" required />
        </Campo>
        <Campo label="Observações">
          <Textarea value={observacoes} onChange={e => setObservacoes(e.target.value)} />
        </Campo>
        {erro && <p className="text-red-600 text-sm text-center">{erro}</p>}
        <BotaoSalvar loading={loading} />
      </form>
      {sucesso && <MensagemSucesso msg="Venda registrada com sucesso!" onClose={() => router.push('/menu')} />}
    </FormPage>
  );
}

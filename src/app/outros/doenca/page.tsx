'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import FormPage from '@/components/FormPage';
import BuscaAnimal from '@/components/BuscaAnimal';
import { Campo, Input, Textarea, BotaoSalvar, MensagemSucesso } from '@/components/CampoForm';

export default function DoencaPage() {
  const router = useRouter();
  const [animalId, setAnimalId] = useState<number | null>(null);
  const [semBrinco, setSemBrinco] = useState(false);
  const [form, setForm] = useState({ apelidoMae: '', numeroMae: '', dataObservacao: new Date().toISOString().split('T')[0], sexo: '', pesoKg: '', lote: '', detalhe: '' });
  const [loading, setLoading] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [erro, setErro] = useState('');
  function set(k: string, v: string) { setForm(f => ({ ...f, [k]: v })); }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!animalId && !semBrinco) { setErro('Selecione o animal.'); return; }
    setErro(''); setLoading(true);
    try {
      const res = await fetch('/api/animais', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ animalId, acao: 'doenca', dataObservacao: form.dataObservacao, observacoes: `DOENÇA/CONDIÇÃO (${form.dataObservacao}): ${form.detalhe}`, sexo: form.sexo, lote: form.lote }),
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
          <BuscaAnimal semBrinco={semBrinco} onSemBrincoChange={setSemBrinco}
            onSelect={a => { setAnimalId(a.id); setForm(f => ({ ...f, sexo: a.sexo, lote: a.lote ?? '', pesoKg: String((a.peso ?? 0) * 15) })); }} />
        </Campo>
        <div className="grid grid-cols-2 gap-3">
          <Campo label="Nome/Apelido da Mãe"><Input value={form.apelidoMae} onChange={e => set('apelidoMae', e.target.value)} /></Campo>
          <Campo label="Nº da Mãe"><Input value={form.numeroMae} onChange={e => set('numeroMae', e.target.value)} /></Campo>
        </div>
        <Campo label="Data da Observação"><Input type="date" value={form.dataObservacao} onChange={e => set('dataObservacao', e.target.value)} required /></Campo>
        <div className="grid grid-cols-2 gap-3">
          <Campo label="Sexo"><Input value={form.sexo} readOnly className="bg-gray-50" /></Campo>
          <Campo label="Peso em KG"><Input type="number" step="0.1" value={form.pesoKg} onChange={e => set('pesoKg', e.target.value)} /></Campo>
        </div>
        <Campo label="Lote"><Input value={form.lote} readOnly className="bg-gray-50" /></Campo>
        <Campo label="Detalhar a Situação"><Textarea value={form.detalhe} onChange={e => set('detalhe', e.target.value)} placeholder="Descreva os sintomas ou condição observada..." required /></Campo>
        {erro && <p className="text-red-600 text-sm text-center">{erro}</p>}
        <BotaoSalvar loading={loading} />
      </form>
      {sucesso && <MensagemSucesso msg="Doença/Condição registrada!" onClose={() => router.push('/menu')} />}
    </FormPage>
  );
}

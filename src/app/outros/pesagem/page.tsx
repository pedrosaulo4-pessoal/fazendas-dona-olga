'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import FormPage from '@/components/FormPage';
import BuscaAnimal from '@/components/BuscaAnimal';
import { Campo, Input, Textarea, BotaoSalvar, MensagemSucesso, Select } from '@/components/CampoForm';

const LOTES = ['Novilhada','Paridas','Bezerros Engorda','Leiteiro','Descarte','24h','Perdido'];

export default function PesagemPage() {
  const router = useRouter();
  const [animalId, setAnimalId] = useState<number | null>(null);
  const [semBrinco, setSemBrinco] = useState(false);
  const [form, setForm] = useState({ apelidoMae: '', numeroMae: '', dataPesagem: new Date().toISOString().split('T')[0], sexo: '', pesoKg: '', lote: '', observacoes: '' });
  const [loading, setLoading] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [erro, setErro] = useState('');

  function set(k: string, v: string) { setForm(f => ({ ...f, [k]: v })); }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!animalId && !semBrinco) { setErro('Selecione o animal.'); return; }
    setErro(''); setLoading(true);
    try {
      // Converte kg para arrobas (1 @ = 15kg)
      const pesoArroba = form.pesoKg ? (parseFloat(form.pesoKg) / 15).toFixed(2) : null;
      const res = await fetch('/api/pesagem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ animalId, dataPesagem: form.dataPesagem, pesoAtual: pesoArroba, lote: form.lote, observacoes: form.observacoes }),
      });
      if (!res.ok) throw new Error();
      setSucesso(true);
    } catch { setErro('Erro ao salvar.'); }
    finally { setLoading(false); }
  }

  return (
    <FormPage titulo="Informar Pesagem">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Campo label="Nº do Animal">
          <BuscaAnimal semBrinco={semBrinco} onSemBrincoChange={setSemBrinco}
            onSelect={a => { setAnimalId(a.id); setForm(f => ({ ...f, sexo: a.sexo, lote: a.lote ?? '' })); }} />
        </Campo>
        <div className="grid grid-cols-2 gap-3">
          <Campo label="Nome/Apelido da Mãe"><Input value={form.apelidoMae} onChange={e => set('apelidoMae', e.target.value)} /></Campo>
          <Campo label="Nº da Mãe"><Input value={form.numeroMae} onChange={e => set('numeroMae', e.target.value)} /></Campo>
        </div>
        <Campo label="Informe a Data da Pesagem"><Input type="date" value={form.dataPesagem} onChange={e => set('dataPesagem', e.target.value)} required /></Campo>
        <div className="grid grid-cols-2 gap-3">
          <Campo label="Sexo"><Input value={form.sexo} readOnly className="bg-gray-50" /></Campo>
          <Campo label="Peso em KG"><Input type="number" step="0.1" value={form.pesoKg} onChange={e => set('pesoKg', e.target.value)} placeholder="0.0" required /></Campo>
        </div>
        <Campo label="Informe o Lote">
          <Select value={form.lote} onChange={e => set('lote', e.target.value)}>
            <option value="">Selecione...</option>
            {LOTES.map(l => <option key={l} value={l}>{l}</option>)}
          </Select>
        </Campo>
        <Campo label="Observações"><Textarea value={form.observacoes} onChange={e => set('observacoes', e.target.value)} /></Campo>
        {erro && <p className="text-red-600 text-sm text-center">{erro}</p>}
        <BotaoSalvar loading={loading} />
      </form>
      {sucesso && <MensagemSucesso msg="Pesagem registrada com sucesso!" onClose={() => router.push('/menu')} />}
    </FormPage>
  );
}

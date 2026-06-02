'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import FormPage from '@/components/FormPage';
import BuscaAnimal from '@/components/BuscaAnimal';
import { Campo, Input, Textarea, BotaoSalvar, MensagemSucesso } from '@/components/CampoForm';

export default function VendaPage() {
  const router = useRouter();
  const [animalId, setAnimalId] = useState<number | null>(null);
  const [semBrinco, setSemBrinco] = useState(false);
  const [form, setForm] = useState({ apelido: '', dataVenda: new Date().toISOString().split('T')[0], sexo: '', pesoEstimado: '', destino: '', observacoes: '' });
  const [loading, setLoading] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [erro, setErro] = useState('');

  function set(k: string, v: string) { setForm(f => ({ ...f, [k]: v })); }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!animalId && !semBrinco) { setErro('Selecione o animal.'); return; }
    setErro(''); setLoading(true);
    try {
      const res = await fetch('/api/venda-compra', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ animalId, operacao: 'venda', dataVenda: form.dataVenda, observacoes: `Vendido em ${form.dataVenda}. Destino: ${form.destino}. ${form.observacoes}` }),
      });
      if (!res.ok) throw new Error();
      setSucesso(true);
    } catch { setErro('Erro ao salvar.'); }
    finally { setLoading(false); }
  }

  return (
    <FormPage titulo="Informar Venda">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Campo label="Nº do Animal"><BuscaAnimal semBrinco={semBrinco} onSemBrincoChange={setSemBrinco} onSelect={a => { setAnimalId(a.id); setForm(f => ({ ...f, sexo: a.sexo, pesoEstimado: String(a.peso ?? '') })); }} /></Campo>
        <Campo label="Nome/Apelido do Animal"><Input value={form.apelido} onChange={e => set('apelido', e.target.value)} /></Campo>
        <Campo label="Informe a Data da Venda"><Input type="date" value={form.dataVenda} onChange={e => set('dataVenda', e.target.value)} required /></Campo>
        <div className="grid grid-cols-2 gap-3">
          <Campo label="Sexo"><Input value={form.sexo} readOnly className="bg-gray-50" /></Campo>
          <Campo label="Peso Estimado (@)"><Input type="number" step="0.1" value={form.pesoEstimado} onChange={e => set('pesoEstimado', e.target.value)} /></Campo>
        </div>
        <Campo label="Informe o Destino do Animal"><Input value={form.destino} onChange={e => set('destino', e.target.value)} placeholder="Fazenda / Frigorífico de destino" required /></Campo>
        <Campo label="Observações"><Textarea value={form.observacoes} onChange={e => set('observacoes', e.target.value)} /></Campo>
        {erro && <p className="text-red-600 text-sm text-center">{erro}</p>}
        <BotaoSalvar loading={loading} />
      </form>
      {sucesso && <MensagemSucesso msg="Venda registrada com sucesso!" onClose={() => router.push('/menu')} />}
    </FormPage>
  );
}

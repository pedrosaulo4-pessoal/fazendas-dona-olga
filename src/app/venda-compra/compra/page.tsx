'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import FormPage from '@/components/FormPage';
import { Campo, Input, Textarea, BotaoSalvar, MensagemSucesso, Select } from '@/components/CampoForm';

export default function CompraPage() {
  const router = useRouter();
  const [form, setForm] = useState({ numero: '', apelido: '', dataCompra: new Date().toISOString().split('T')[0], sexo: 'F', pesoEstimado: '', origem: '', observacoes: '' });
  const [loading, setLoading] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [erro, setErro] = useState('');

  function set(k: string, v: string) { setForm(f => ({ ...f, [k]: v })); }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setErro(''); setLoading(true);
    try {
      const res = await fetch('/api/venda-compra', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, operacao: 'compra', peso: form.pesoEstimado, observacoes: `Comprado em ${form.dataCompra}. Origem: ${form.origem}. ${form.observacoes}` }),
      });
      if (!res.ok) throw new Error();
      setSucesso(true);
    } catch { setErro('Erro ao salvar.'); }
    finally { setLoading(false); }
  }

  return (
    <FormPage titulo="Informar Compra">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Campo label="Nº do Animal"><Input value={form.numero} onChange={e => set('numero', e.target.value)} placeholder="Ex: A1500" /></Campo>
        <Campo label="Nome/Apelido do Animal"><Input value={form.apelido} onChange={e => set('apelido', e.target.value)} /></Campo>
        <Campo label="Informe a Data da Compra"><Input type="date" value={form.dataCompra} onChange={e => set('dataCompra', e.target.value)} required /></Campo>
        <div className="grid grid-cols-2 gap-3">
          <Campo label="Sexo"><Select value={form.sexo} onChange={e => set('sexo', e.target.value)}><option value="F">Fêmea</option><option value="M">Macho</option></Select></Campo>
          <Campo label="Peso Estimado (@)"><Input type="number" step="0.1" value={form.pesoEstimado} onChange={e => set('pesoEstimado', e.target.value)} /></Campo>
        </div>
        <Campo label="Informe a Origem do Animal"><Input value={form.origem} onChange={e => set('origem', e.target.value)} placeholder="Fazenda / Cidade de origem" required /></Campo>
        <Campo label="Observações"><Textarea value={form.observacoes} onChange={e => set('observacoes', e.target.value)} /></Campo>
        {erro && <p className="text-red-600 text-sm text-center">{erro}</p>}
        <BotaoSalvar loading={loading} />
      </form>
      {sucesso && <MensagemSucesso msg="Compra registrada com sucesso!" onClose={() => router.push('/menu')} />}
    </FormPage>
  );
}

'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import FormPage from '@/components/FormPage';
import { Campo, Input, Textarea, BotaoSalvar, MensagemSucesso } from '@/components/CampoForm';

const LOTES = ['Novilhada','Paridas','Bezerros Engorda','Leiteiro','Descarte','24h','Perdido'];

export default function ProcedimentoLotePage() {
  const router = useRouter();
  const [form, setForm] = useState({ loteNome: '', loteObs: '', dataProcedimento: new Date().toISOString().split('T')[0], quantidade: '', pesoEstimado: '', observacoes: '' });
  const [loading, setLoading] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [erro, setErro] = useState('');

  function set(k: string, v: string) { setForm(f => ({ ...f, [k]: v })); }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setErro(''); setLoading(true);
    try {
      const res = await fetch('/api/procedimento', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, tipo: 'Lote' }),
      });
      if (!res.ok) throw new Error();
      setSucesso(true);
    } catch { setErro('Erro ao salvar. Tente novamente.'); }
    finally { setLoading(false); }
  }

  return (
    <FormPage titulo="Procedimento de Lote">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Campo label="Nome do Lote">
          <select value={form.loteNome} onChange={e => set('loteNome', e.target.value)} required
            className="w-full bg-white border border-gray-300 rounded px-4 py-4 text-gray-800 shadow-[3px_3px_0_rgba(0,0,0,0.12)] outline-none focus:border-[#1a237e]">
            <option value="">Selecione...</option>
            {LOTES.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </Campo>
        <Campo label="Observações do Lote"><Input value={form.loteObs} onChange={e => set('loteObs', e.target.value)} placeholder="Descrição geral do lote" /></Campo>
        <Campo label="Data do Procedimento"><Input type="date" value={form.dataProcedimento} onChange={e => set('dataProcedimento', e.target.value)} required /></Campo>
        <div className="grid grid-cols-2 gap-3">
          <Campo label="Qtd. Animais"><Input type="number" value={form.quantidade} onChange={e => set('quantidade', e.target.value)} placeholder="0" /></Campo>
          <Campo label="Peso Est. (p/ cab.)"><Input type="number" step="0.1" value={form.pesoEstimado} onChange={e => set('pesoEstimado', e.target.value)} placeholder="0.0" /></Campo>
        </div>
        <Campo label="Observações (Medicamentos, Dosagem, etc)"><Textarea value={form.observacoes} onChange={e => set('observacoes', e.target.value)} placeholder="Descreva o procedimento realizado..." required /></Campo>
        {erro && <p className="text-red-600 text-sm text-center">{erro}</p>}
        <BotaoSalvar loading={loading} />
      </form>
      {sucesso && <MensagemSucesso msg="Procedimento de lote registrado!" onClose={() => router.push('/menu')} />}
    </FormPage>
  );
}

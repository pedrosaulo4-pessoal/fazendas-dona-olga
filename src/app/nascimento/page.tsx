'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import FormPage from '@/components/FormPage';
import { Campo, Input, Select, BotaoSalvar, MensagemSucesso } from '@/components/CampoForm';

const LOTES = ['Paridas','Bezerros Engorda','Novilhada','Leiteiro','Descarte','24h','Perdido'];
const PELAGENS = ['Branco','Preto','Vermelho','Marrom Escuro','Marrom Claro','Amarelo','Rosilho','Moura (Cinza)','Marrom Chitado','Vermelho Chitado','Amarelo Chitado','Preto Chitado','Malhado (Cinza)','Malhado (Preto)','Malhado (Vermelho)','Malhado (Marrom)'];

export default function NascimentoPage() {
  const router = useRouter();
  const [form, setForm] = useState({ numeroMae: '', apelidoMae: '', dataNascimento: new Date().toISOString().split('T')[0], sexo: 'F', pesoEstimado: '', lote: 'Paridas', pelagem: 'Branco' });
  const [loading, setLoading] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [erro, setErro] = useState('');

  function set(k: string, v: string) { setForm(f => ({ ...f, [k]: v })); }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(''); setLoading(true);
    try {
      const mae = form.numeroMae || form.apelidoMae;
      const obs = `Nascimento estimado (N. Est.) ${new Date(form.dataNascimento).toLocaleDateString('pt-BR', { month: '2-digit', year: 'numeric' })}. Filho${form.sexo === 'F' ? 'a' : ''} da ${mae}`;
      const res = await fetch('/api/animais', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dataRegistro: new Date().toISOString(),
          status: 'Ativo',
          sexo: form.sexo,
          tipo: 'Nelore',
          espec: form.sexo === 'F' ? 'Bezerra' : 'Bezerro',
          pelagem: form.pelagem,
          numero: null,
          observacoes: obs,
          peso: form.pesoEstimado || null,
          lote: form.lote,
          acao: 'nascimento',
        }),
      });
      if (!res.ok) throw new Error();
      setSucesso(true);
    } catch { setErro('Erro ao salvar. Tente novamente.'); }
    finally { setLoading(false); }
  }

  return (
    <FormPage titulo="Informar Nascimento">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Campo label="Nº da Mãe"><Input value={form.numeroMae} onChange={e => set('numeroMae', e.target.value)} placeholder="Ex: A199" /></Campo>
        <Campo label="Nome/Apelido da Mãe"><Input value={form.apelidoMae} onChange={e => set('apelidoMae', e.target.value)} placeholder="Ex: Devassa" /></Campo>
        <Campo label="Informe a Data de Nascimento"><Input type="date" value={form.dataNascimento} onChange={e => set('dataNascimento', e.target.value)} required /></Campo>
        <div className="grid grid-cols-2 gap-3">
          <Campo label="Informe o Sexo">
            <Select value={form.sexo} onChange={e => set('sexo', e.target.value)} required>
              <option value="F">Fêmea (F)</option>
              <option value="M">Macho (M)</option>
            </Select>
          </Campo>
          <Campo label="Peso Estimado (@)"><Input type="number" step="0.1" value={form.pesoEstimado} onChange={e => set('pesoEstimado', e.target.value)} placeholder="0.0" /></Campo>
        </div>
        <Campo label="Pelagem">
          <Select value={form.pelagem} onChange={e => set('pelagem', e.target.value)} required>
            {PELAGENS.map(p => <option key={p} value={p}>{p}</option>)}
          </Select>
        </Campo>
        <Campo label="Informe o Lote">
          <Select value={form.lote} onChange={e => set('lote', e.target.value)} required>
            {LOTES.map(l => <option key={l} value={l}>{l}</option>)}
          </Select>
        </Campo>
        {erro && <p className="text-red-600 text-sm text-center">{erro}</p>}
        <BotaoSalvar loading={loading} />
      </form>
      {sucesso && <MensagemSucesso msg="Nascimento registrado com sucesso!" onClose={() => router.push('/menu')} />}
    </FormPage>
  );
}

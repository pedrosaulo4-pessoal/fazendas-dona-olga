'use client';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import FormPage from '@/components/FormPage';
import CorBrinco from '@/components/CorBrinco';
import { Campo, Input, Select, BotaoSalvar, MensagemSucesso } from '@/components/CampoForm';

const LOTES = ['Paridas','Bezerros Engorda','Novilhada','Leiteiro','Descarte','24h','Perdido'];
const PELAGENS = ['Branco','Preto','Vermelho','Marrom Escuro','Marrom Claro','Amarelo','Rosilho','Moura (Cinza)','Marrom Chitado','Vermelho Chitado','Amarelo Chitado','Preto Chitado','Malhado (Cinza)','Malhado (Preto)','Malhado (Vermelho)','Malhado (Marrom)'];

export default function NascimentoPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    numeroMae: '', apelidoMae: '',
    numeroFilhote: '', apelidoFilhote: '',
    dataNascimento: new Date().toISOString().split('T')[0],
    sexo: 'F', pesoEstimado: '', lote: 'Paridas', pelagem: 'Branco', corBrinco: '',
  });
  const [foto, setFoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [erro, setErro] = useState('');
  const inputFotoRef = useRef<HTMLInputElement>(null);

  function set(k: string, v: string) { setForm(f => ({ ...f, [k]: v })); }

  function handleFoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFoto(file);
    const reader = new FileReader();
    reader.onload = ev => setPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(''); setLoading(true);
    try {
      const mae = form.numeroMae || form.apelidoMae;
      const obs = `Nascimento estimado (N. Est.) ${new Date(form.dataNascimento).toLocaleDateString('pt-BR', { month: '2-digit', year: 'numeric' })}${mae ? `. Filho${form.sexo === 'F' ? 'a' : ''} da ${mae}` : ''}`;
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
          numero: form.numeroFilhote || null,
          apelido: form.apelidoFilhote || null,
          peso: form.pesoEstimado ? parseFloat(form.pesoEstimado) / 30 : null,
          lote: form.lote,
          corBrinco: form.corBrinco || null,
          numeroMae: form.numeroMae || null,
          apelidoMae: form.apelidoMae || null,
          acao: 'nascimento',
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `HTTP ${res.status}`);
      }
      const animalCriado = await res.json();
      if (foto && animalCriado?.id) {
        const fd = new FormData();
        fd.append('foto', foto);
        fd.append('animalId', String(animalCriado.id));
        fd.append('numero', 'novo');
        fd.append('dataFoto', form.dataNascimento);
        await fetch('/api/foto', { method: 'POST', body: fd });
      }
      setSucesso(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro desconhecido';
      setErro(`Erro: ${msg}`);
    }
    finally { setLoading(false); }
  }

  return (
    <FormPage titulo="Informar Nascimento">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <Campo label="Nº da Mãe"><Input value={form.numeroMae} onChange={e => set('numeroMae', e.target.value)} placeholder="Ex: A199" /></Campo>
          <Campo label="Apelido da Mãe"><Input value={form.apelidoMae} onChange={e => set('apelidoMae', e.target.value)} placeholder="Ex: Devassa" /></Campo>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Campo label="Nº do Filhote"><Input value={form.numeroFilhote} onChange={e => set('numeroFilhote', e.target.value)} placeholder="Ex: B001" /></Campo>
          <Campo label="Apelido do Filhote"><Input value={form.apelidoFilhote} onChange={e => set('apelidoFilhote', e.target.value)} placeholder="Opcional" /></Campo>
        </div>
        <Campo label="Informe a Data de Nascimento">
          <Input type="date" value={form.dataNascimento} onChange={e => set('dataNascimento', e.target.value)} required />
        </Campo>
        <div className="grid grid-cols-2 gap-3">
          <Campo label="Sexo">
            <Select value={form.sexo} onChange={e => set('sexo', e.target.value)} required>
              <option value="F">Fêmea (F)</option>
              <option value="M">Macho (M)</option>
            </Select>
          </Campo>
          <Campo label="Peso Estimado (KG)">
            <Input type="number" step="0.1" value={form.pesoEstimado} onChange={e => set('pesoEstimado', e.target.value)} placeholder="0.0" />
          </Campo>
        </div>
        <Campo label="Pelagem">
          <Select value={form.pelagem} onChange={e => set('pelagem', e.target.value)} required>
            {PELAGENS.map(p => <option key={p} value={p}>{p}</option>)}
          </Select>
        </Campo>
        <Campo label="Cor do Brinco">
          <CorBrinco value={form.corBrinco} onChange={v => set('corBrinco', v)} />
        </Campo>
        <Campo label="Informe o Lote">
          <Select value={form.lote} onChange={e => set('lote', e.target.value)} required>
            {LOTES.map(l => <option key={l} value={l}>{l}</option>)}
          </Select>
        </Campo>
        <Campo label="Insira uma Foto">
          <div onClick={() => inputFotoRef.current?.click()}
            className="w-full border-2 border-dashed border-gray-300 rounded-lg bg-white
                       shadow-[3px_3px_0_rgba(0,0,0,0.12)] flex flex-col items-center justify-center
                       cursor-pointer active:bg-gray-50 transition-all" style={{ minHeight: '90px' }}>
            {preview
              ? <img src={preview} alt="Foto" className="max-h-40 rounded-lg object-contain my-2" />
              : <span className="text-gray-500 text-base py-6">Abrir Galeria</span>}
          </div>
          <input ref={inputFotoRef} type="file" accept="image/*" className="hidden" onChange={handleFoto} />
        </Campo>
        {erro && <p className="text-red-600 text-sm text-center">{erro}</p>}
        <BotaoSalvar loading={loading} />
      </form>
      {sucesso && <MensagemSucesso msg="Nascimento registrado com sucesso!" onClose={() => router.push('/menu')} />}
    </FormPage>
  );
}

'use client';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import FormPage from '@/components/FormPage';
import BuscaAnimal from '@/components/BuscaAnimal';
import { Campo, Input, Textarea, BotaoSalvar, MensagemSucesso } from '@/components/CampoForm';

export default function MortePage() {
  const router = useRouter();
  const [animalId, setAnimalId] = useState<number | null>(null);
  const [semBrinco, setSemBrinco] = useState(false);
  const [form, setForm] = useState({ apelidoAnimal: '', dataMorte: new Date().toISOString().split('T')[0], sexo: '', pesoEstimado: '', observacoes: '' });
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
    if (!animalId && !semBrinco) { setErro('Selecione o animal na lista.'); return; }
    setErro(''); setLoading(true);
    try {
      const res = await fetch('/api/morte', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ animalId, dataMorte: form.dataMorte, peso: form.pesoEstimado, observacoes: form.observacoes }),
      });
      if (!res.ok) throw new Error();

      // Envia foto se houver
      if (foto && animalId) {
        const fd = new FormData();
        fd.append('foto', foto);
        fd.append('animalId', String(animalId));
        fd.append('numero', String(animalId));
        fd.append('dataFoto', form.dataMorte);
        await fetch('/api/foto', { method: 'POST', body: fd });
      }

      setSucesso(true);
    } catch { setErro('Erro ao salvar. Tente novamente.'); }
    finally { setLoading(false); }
  }

  return (
    <FormPage titulo="Informar Morte">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Campo label="Nº do Animal">
          <BuscaAnimal
            semBrinco={semBrinco}
            onSemBrincoChange={setSemBrinco}
            onSelect={a => { setAnimalId(a.id); setForm(f => ({ ...f, sexo: a.sexo, pesoEstimado: String(a.peso ?? '') })); }}
          />
        </Campo>
        <Campo label="Nome/Apelido do Animal"><Input value={form.apelidoAnimal} onChange={e => set('apelidoAnimal', e.target.value)} placeholder="Opcional" /></Campo>
        <Campo label="Informe a Data da Morte"><Input type="date" value={form.dataMorte} onChange={e => set('dataMorte', e.target.value)} required /></Campo>
        <div className="grid grid-cols-2 gap-3">
          <Campo label="Sexo"><Input value={form.sexo} readOnly placeholder="Auto" className="bg-gray-50" /></Campo>
          <Campo label="Peso Estimado (@)"><Input type="number" step="0.1" value={form.pesoEstimado} onChange={e => set('pesoEstimado', e.target.value)} /></Campo>
        </div>
        <Campo label="Observações (Causa da Morte e Local)">
          <Textarea value={form.observacoes} onChange={e => set('observacoes', e.target.value)} placeholder="Descreva a causa e local da morte..." required />
        </Campo>
        <Campo label="Insira uma Foto">
          <div
            onClick={() => inputFotoRef.current?.click()}
            className="w-full border-2 border-dashed border-gray-300 rounded-lg bg-white
                       shadow-[3px_3px_0_rgba(0,0,0,0.12)] flex flex-col items-center justify-center
                       cursor-pointer active:bg-gray-50 transition-all"
            style={{ minHeight: '90px' }}
          >
            {preview ? (
              <img src={preview} alt="Foto" className="max-h-40 rounded-lg object-contain my-2" />
            ) : (
              <span className="text-gray-500 text-base py-6">Abrir Galeria</span>
            )}
          </div>
          <input ref={inputFotoRef} type="file" accept="image/*" className="hidden" onChange={handleFoto} />
        </Campo>
        {erro && <p className="text-red-600 text-sm text-center">{erro}</p>}
        <BotaoSalvar loading={loading} />
      </form>
      {sucesso && <MensagemSucesso msg="Morte registrada com sucesso!" onClose={() => router.push('/menu')} />}
    </FormPage>
  );
}

'use client';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import FormPage from '@/components/FormPage';
import BuscaAnimal from '@/components/BuscaAnimal';
import { Campo, Input, BotaoSalvar, MensagemSucesso } from '@/components/CampoForm';

export default function FotoPage() {
  const router = useRouter();
  const [animalId, setAnimalId] = useState<number | null>(null);
  const [semBrinco, setSemBrinco] = useState(false);
  const [form, setForm] = useState({ numero: '', dataFoto: new Date().toISOString().split('T')[0] });
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [erro, setErro] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setArquivo(file);
    const reader = new FileReader();
    reader.onload = ev => setPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!animalId && !semBrinco) { setErro('Selecione o animal.'); return; }
    if (!arquivo) { setErro('Selecione uma foto.'); return; }
    setErro(''); setLoading(true);
    try {
      const fd = new FormData();
      fd.append('foto', arquivo);
      fd.append('animalId', String(animalId ?? ''));
      fd.append('numero', form.numero);
      fd.append('dataFoto', form.dataFoto);
      const res = await fetch('/api/foto', { method: 'POST', body: fd });
      if (!res.ok) throw new Error();
      setSucesso(true);
    } catch { setErro('Erro ao enviar foto.'); }
    finally { setLoading(false); }
  }

  return (
    <FormPage titulo="Inserir Foto de Animal">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Campo label="Nº do Animal">
          <BuscaAnimal semBrinco={semBrinco} onSemBrincoChange={setSemBrinco}
            onSelect={a => { setAnimalId(a.id); setForm(f => ({ ...f, numero: a.numero ?? '' })); }} />
        </Campo>
        <Campo label="Data da Foto">
          <Input type="date" value={form.dataFoto} onChange={e => setForm(f => ({ ...f, dataFoto: e.target.value }))} required />
        </Campo>
        <Campo label="Foto do Animal">
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center gap-3 cursor-pointer bg-gray-50 active:bg-gray-100"
            onClick={() => inputRef.current?.click()}
          >
            {preview ? (
              <img src={preview} alt="Preview" className="max-h-48 rounded-lg object-contain" />
            ) : (
              <>
                <span className="text-4xl">📷</span>
                <span className="text-gray-500 text-sm text-center">Toque para selecionar ou tirar uma foto</span>
              </>
            )}
            <input ref={inputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFile} />
          </div>
          {arquivo && <p className="text-xs text-gray-500 mt-1 text-center">{arquivo.name}</p>}
        </Campo>
        {erro && <p className="text-red-600 text-sm text-center">{erro}</p>}
        <BotaoSalvar loading={loading} label={loading ? 'Enviando...' : 'Salvar Foto'} />
      </form>
      {sucesso && <MensagemSucesso msg="Foto salva com sucesso!" onClose={() => router.push('/menu')} />}
    </FormPage>
  );
}

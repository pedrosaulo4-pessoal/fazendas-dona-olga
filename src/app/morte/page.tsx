'use client';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import FormPage from '@/components/FormPage';
import BuscaAnimal, { AnimalEncontrado } from '@/components/BuscaAnimal';
import AnimalSelecionado from '@/components/AnimalSelecionado';
import { Campo, Input, Select, Textarea, BotaoSalvar, MensagemSucesso } from '@/components/CampoForm';

export default function MortePage() {
  const router = useRouter();
  const [animalId, setAnimalId] = useState<number | null>(null);
  const [semBrinco, setSemBrinco] = useState(false);
  const [animal, setAnimal] = useState<AnimalEncontrado | null>(null);
  const [pesoKg, setPesoKg] = useState('');
  const [lote, setLote] = useState('');
  const [sexo, setSexo] = useState('F');
  const [numeroMae, setNumeroMae] = useState('');
  const [dataMorte, setDataMorte] = useState(new Date().toISOString().split('T')[0]);
  const [observacoes, setObservacoes] = useState('');
  const [foto, setFoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [erro, setErro] = useState('');
  const inputFotoRef = useRef<HTMLInputElement>(null);

  function handleSelect(a: AnimalEncontrado) {
    setAnimalId(a.id);
    setAnimal(a);
    setPesoKg(a.peso != null ? String((a.peso * 30).toFixed(1)) : '');
    setLote(a.lote ?? '');
    setSexo(a.sexo ?? 'F');
  }

  function handleFoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFoto(file);
    const reader = new FileReader();
    reader.onload = ev => setPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  }

  // Monta o nome da foto: (numero|sem-brinco)-DD-MM-AAAA-sexo
  function montarNomeFoto(): string {
    const nomeAnimal = (animal?.numero || semBrinco) ? (animal?.numero ?? 'sem-brinco') : 'sem-brinco';
    const [ano, mes, dia] = dataMorte.split('-');
    return `${nomeAnimal}-${dia}-${mes}-${ano}-${sexo}`;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!animalId && !semBrinco) { setErro('Selecione o animal ou marque "Sem Brinco".'); return; }
    if (!foto) { setErro('A foto é obrigatória para registrar uma morte.'); return; }
    setErro(''); setLoading(true);
    try {
      const res = await fetch('/api/morte', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          animalId,
          dataMorte,
          peso: pesoKg ? parseFloat(pesoKg) / 30 : null,
          observacoes,
          sexo,
          numeroMae: numeroMae || null,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `HTTP ${res.status}`);
      }

      // Salva foto com nome padronizado
      const fd = new FormData();
      fd.append('foto', foto);
      fd.append('animalId', animalId ? String(animalId) : '');
      fd.append('numero', animal?.numero ?? 'sem-brinco');
      fd.append('dataFoto', dataMorte);
      fd.append('nomeCustom', montarNomeFoto());
      await fetch('/api/foto', { method: 'POST', body: fd });

      setSucesso(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro desconhecido';
      setErro(`Erro: ${msg}`);
    } finally { setLoading(false); }
  }

  return (
    <FormPage titulo="Informar Morte">
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

        <div className="grid grid-cols-2 gap-3">
          <Campo label="Sexo">
            <Select value={sexo} onChange={e => setSexo(e.target.value)} required>
              <option value="F">Fêmea (F)</option>
              <option value="M">Macho (M)</option>
            </Select>
          </Campo>
          <Campo label="Nº da Mãe">
            <Input value={numeroMae} onChange={e => setNumeroMae(e.target.value)} placeholder="Ex: A199" />
          </Campo>
        </div>

        <Campo label="Informe a Data da Morte">
          <Input type="date" value={dataMorte} onChange={e => setDataMorte(e.target.value)} required />
        </Campo>

        <Campo label="Observações (Causa e Local)">
          <Textarea value={observacoes} onChange={e => setObservacoes(e.target.value)}
            placeholder="Descreva a causa e local da morte..." required />
        </Campo>

        <Campo label="Foto *Obrigatória">
          <div onClick={() => inputFotoRef.current?.click()}
            className="w-full border-2 border-dashed border-gray-300 rounded-lg bg-white
                       shadow-[3px_3px_0_rgba(0,0,0,0.12)] flex flex-col items-center justify-center
                       cursor-pointer active:bg-gray-50 transition-all" style={{ minHeight: '90px' }}>
            {preview
              ? <img src={preview} alt="Foto" className="max-h-40 rounded-lg object-contain my-2" />
              : <span className="text-gray-500 text-base py-6">📷 Abrir Galeria</span>}
          </div>
          {foto && (
            <p className="text-xs text-gray-500 mt-1 text-center">
              Nome do arquivo: <span className="font-mono font-semibold">{montarNomeFoto()}.{foto.name.split('.').pop()}</span>
            </p>
          )}
          <input ref={inputFotoRef} type="file" accept="image/*" className="hidden" onChange={handleFoto} />
        </Campo>

        {erro && <p className="text-red-600 text-sm text-center">{erro}</p>}
        <BotaoSalvar loading={loading} />
      </form>
      {sucesso && <MensagemSucesso msg="Morte registrada com sucesso!" onClose={() => router.push('/menu')} />}
    </FormPage>
  );
}

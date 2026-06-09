'use client';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import FormPage from '@/components/FormPage';
import CorBrinco from '@/components/CorBrinco';
import { Campo, Input, Select, Textarea, BotaoSalvar, MensagemSucesso } from '@/components/CampoForm';

const TIPOS = ['Nelore', 'Leiteiro', 'Angus', 'Girolando', 'Gir', 'Mestiço', 'Comum'];
const ESPECIES = ['Vaca', 'Touro', 'Bezerro', 'Bezerra', 'Novilha', 'Novilho', 'Garrote', 'Garrotin'];
const LOTES = ['Paridas', 'Bezerros Engorda', 'Novilhada', 'Leiteiro', 'Descarte', '24h', 'Perdido'];
const PELAGENS = [
  'Branco', 'Preto', 'Vermelho', 'Marrom Escuro', 'Marrom Claro', 'Amarelo', 'Rosilho',
  'Moura (Cinza)', 'Marrom Chitado', 'Vermelho Chitado', 'Amarelo Chitado', 'Preto Chitado',
  'Malhado (Cinza)', 'Malhado (Preto)', 'Malhado (Vermelho)', 'Malhado (Marrom)',
];

export default function CadastroManualPage() {
  const router = useRouter();

  const hoje = new Date().toISOString().split('T')[0];

  const [form, setForm] = useState({
    dataNascimento: hoje,
    sexo: 'F',
    tipo: 'Nelore',
    espec: 'Vaca',
    pelagem: 'Branco',
    numero: '',
    apelido: '',
    pesoEstimado: '',
    corBrinco: '',
    lote: 'Paridas',
    numeroMae: '',
    apelidoMae: '',
    origem: '',
    observacoes: '',
  });

  const [foto, setFoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [erro, setErro] = useState('');
  const inputFotoRef = useRef<HTMLInputElement>(null);

  function set(k: string, v: string) { setForm(f => ({ ...f, [k]: v })); }

  // Quando muda o sexo, ajusta espec automaticamente (bezerro↔bezerra)
  function handleSexo(v: string) {
    set('sexo', v);
    if (form.espec === 'Bezerro' && v === 'F') set('espec', 'Bezerra');
    if (form.espec === 'Bezerra' && v === 'M') set('espec', 'Bezerro');
  }

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
      const origemObs = form.origem ? `Origem: ${form.origem}.` : '';
      const obsBase = [origemObs, form.observacoes].filter(Boolean).join(' ');

      const res = await fetch('/api/animais', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dataRegistro: new Date(form.dataNascimento).toISOString(),
          status: 'Ativo',
          sexo: form.sexo,
          tipo: form.tipo,
          espec: form.espec,
          pelagem: form.pelagem,
          numero: form.numero || null,
          apelido: form.apelido || null,
          observacoes: obsBase || null,
          peso: form.pesoEstimado ? parseFloat(form.pesoEstimado) / 30 : null,
          corBrinco: form.corBrinco || null,
          lote: form.lote || null,
          numeroMae: form.numeroMae || null,
          apelidoMae: form.apelidoMae || null,
          acao: 'cadastro-manual',
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `HTTP ${res.status}`);
      }

      const animalCriado = await res.json();

      if (foto && animalCriado?.id) {
        const nBrinco = form.numero || 'sem-brinco';
        const fd = new FormData();
        fd.append('foto', foto);
        fd.append('animalId', String(animalCriado.id));
        fd.append('numero', nBrinco);
        fd.append('dataFoto', hoje);
        await fetch('/api/foto', { method: 'POST', body: fd });
      }

      setSucesso(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro desconhecido';
      setErro(`Erro: ${msg}`);
    } finally { setLoading(false); }
  }

  return (
    <FormPage titulo="Cadastro de Animal">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">

        {/* Data de nascimento / registro */}
        <Campo label="Data de Nascimento / Registro">
          <Input
            type="date"
            value={form.dataNascimento}
            onChange={e => set('dataNascimento', e.target.value)}
            required
          />
        </Campo>

        {/* Número e Apelido */}
        <div className="grid grid-cols-2 gap-3">
          <Campo label="Nº do Brinco">
            <Input
              value={form.numero}
              onChange={e => set('numero', e.target.value)}
              placeholder="Ex: A199 (ou vazio)"
            />
          </Campo>
          <Campo label="Apelido">
            <Input
              value={form.apelido}
              onChange={e => set('apelido', e.target.value)}
              placeholder="Opcional"
            />
          </Campo>
        </div>

        {/* Sexo e Espécie */}
        <div className="grid grid-cols-2 gap-3">
          <Campo label="Sexo">
            <Select value={form.sexo} onChange={e => handleSexo(e.target.value)} required>
              <option value="F">Fêmea (F)</option>
              <option value="M">Macho (M)</option>
            </Select>
          </Campo>
          <Campo label="Categoria">
            <Select value={form.espec} onChange={e => set('espec', e.target.value)} required>
              {ESPECIES.map(s => <option key={s} value={s}>{s}</option>)}
            </Select>
          </Campo>
        </div>

        {/* Raça/Tipo */}
        <Campo label="Raça / Tipo">
          <Select value={form.tipo} onChange={e => set('tipo', e.target.value)} required>
            {TIPOS.map(t => <option key={t} value={t}>{t}</option>)}
          </Select>
        </Campo>

        {/* Pelagem e Peso */}
        <div className="grid grid-cols-2 gap-3">
          <Campo label="Pelagem">
            <Select value={form.pelagem} onChange={e => set('pelagem', e.target.value)} required>
              {PELAGENS.map(p => <option key={p} value={p}>{p}</option>)}
            </Select>
          </Campo>
          <Campo label="Peso (KG)">
            <Input
              type="number"
              step="0.1"
              value={form.pesoEstimado}
              onChange={e => set('pesoEstimado', e.target.value)}
              placeholder="Ex: 90"
            />
          </Campo>
        </div>

        {/* Cor do brinco */}
        <Campo label="Cor do Brinco">
          <CorBrinco value={form.corBrinco} onChange={v => set('corBrinco', v)} />
        </Campo>

        {/* Lote */}
        <Campo label="Lote">
          <Select value={form.lote} onChange={e => set('lote', e.target.value)}>
            <option value="">— Sem lote —</option>
            {LOTES.map(l => <option key={l} value={l}>{l}</option>)}
          </Select>
        </Campo>

        {/* Mãe */}
        <div className="grid grid-cols-2 gap-3">
          <Campo label="Nº da Mãe">
            <Input
              value={form.numeroMae}
              onChange={e => set('numeroMae', e.target.value)}
              placeholder="Ex: A199"
            />
          </Campo>
          <Campo label="Apelido da Mãe">
            <Input
              value={form.apelidoMae}
              onChange={e => set('apelidoMae', e.target.value)}
              placeholder="Opcional"
            />
          </Campo>
        </div>

        {/* Origem */}
        <Campo label="Origem">
          <Input
            value={form.origem}
            onChange={e => set('origem', e.target.value)}
            placeholder="Ex: FDP, Fazenda Boa Vista..."
          />
        </Campo>

        {/* Observações */}
        <Campo label="Observações">
          <Textarea
            value={form.observacoes}
            onChange={e => set('observacoes', e.target.value)}
            placeholder="Informações adicionais..."
          />
        </Campo>

        {/* Foto */}
        <Campo label="Foto (opcional)">
          <div
            onClick={() => inputFotoRef.current?.click()}
            className="w-full border-2 border-dashed border-gray-300 rounded-lg bg-white
                       shadow-[3px_3px_0_rgba(0,0,0,0.12)] flex flex-col items-center justify-center
                       cursor-pointer active:bg-gray-50 transition-all"
            style={{ minHeight: '90px' }}
          >
            {preview
              ? <img src={preview} alt="Foto" className="max-h-40 rounded-lg object-contain my-2" />
              : <span className="text-gray-500 text-base py-6">📷 Abrir Galeria</span>}
          </div>
          <input
            ref={inputFotoRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFoto}
          />
        </Campo>

        {erro && <p className="text-red-600 text-sm text-center">{erro}</p>}
        <BotaoSalvar loading={loading} />
      </form>

      {sucesso && (
        <MensagemSucesso
          msg="Animal cadastrado com sucesso!"
          onClose={() => router.push('/menu')}
        />
      )}
    </FormPage>
  );
}

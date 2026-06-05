'use client';
import { useState } from 'react';
import FormPage from '@/components/FormPage';

export default function BackupPage() {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  async function baixarBackup() {
    setLoading(true);
    setMsg('');
    try {
      const res = await fetch('/api/backup');
      if (!res.ok) throw new Error();
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const data = new Date().toLocaleDateString('pt-BR').replace(/\//g, '-');
      a.href = url;
      a.download = `backup-rebanho-${data}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setMsg('✅ Backup baixado com sucesso!');
    } catch {
      setMsg('❌ Erro ao gerar backup.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <FormPage titulo="Backup">
      <div className="flex flex-col gap-5 mt-4">

        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">O que é o backup?</p>
          <p className="text-sm text-gray-600">
            Exporta todos os dados de animais, procedimentos e histórico em formato JSON.
            Guarde o arquivo em um local seguro — ele pode ser usado para recuperar os dados se necessário.
          </p>
        </div>

        <button
          onClick={baixarBackup}
          disabled={loading}
          className="w-full bg-[#FFD700] text-gray-900 text-lg font-bold py-6 rounded-lg
                     shadow-[4px_4px_0_rgba(0,0,0,0.22)] active:shadow-none active:translate-x-1 active:translate-y-1
                     transition-all disabled:opacity-60 tracking-wider"
        >
          {loading ? 'GERANDO...' : '⬇️ BAIXAR BACKUP'}
        </button>

        {msg && (
          <p className="text-center text-sm font-semibold text-gray-700">{msg}</p>
        )}

        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <p className="text-xs text-yellow-800 font-semibold">💡 Dica</p>
          <p className="text-xs text-yellow-700 mt-1">
            Faça backup regularmente, especialmente antes de lançar muitos dados novos.
            Recomendado: uma vez por semana.
          </p>
        </div>

      </div>
    </FormPage>
  );
}

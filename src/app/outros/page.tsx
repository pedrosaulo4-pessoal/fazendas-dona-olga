'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import FormPage from '@/components/FormPage';

const ITENS = [
  { label: 'Consultar rebanho', href: '/consultar' },
  { label: 'Informar Pesagem', href: '/outros/pesagem' },
  { label: 'Informar doença ou condição', href: '/outros/doenca' },
  { label: 'Informar aborto', href: '/outros/aborto' },
  { label: 'Inserir foto de um animal', href: '/outros/foto' },
];

async function atualizarApp() {
  // 1. Remove todos os caches do navegador
  if ('caches' in window) {
    const nomes = await caches.keys();
    await Promise.all(nomes.map(n => caches.delete(n)));
  }
  // 2. Cancela o registro de qualquer service worker
  if ('serviceWorker' in navigator) {
    const registros = await navigator.serviceWorker.getRegistrations();
    await Promise.all(registros.map(r => r.unregister()));
  }
  // 3. Recarrega forçando busca no servidor (sem cache)
  window.location.href = '/?atualizado=' + Date.now();
}

export default function OutrosPage() {
  const router = useRouter();
  const [atualizando, setAtualizando] = useState(false);

  async function handleAtualizar() {
    setAtualizando(true);
    await atualizarApp();
  }

  return (
    <FormPage titulo="Em Outros Você Pode">
      <div className="flex flex-col gap-4 mt-4">
        {ITENS.map(item => (
          <button key={item.href} onClick={() => router.push(item.href)}
            className="w-full bg-[#FFD700] text-gray-900 text-base font-semibold py-6 rounded-lg
                       shadow-[4px_4px_0_rgba(0,0,0,0.22)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all">
            {item.label}
          </button>
        ))}

        {/* Separador */}
        <div className="border-t border-gray-300 my-2" />

        {/* Botão Atualizar App */}
        <button
          onClick={handleAtualizar}
          disabled={atualizando}
          className="w-full bg-white text-[#1a237e] text-base font-semibold py-5 rounded-lg border-2 border-[#1a237e]
                     shadow-[4px_4px_0_rgba(26,35,126,0.2)] active:shadow-none active:translate-x-1 active:translate-y-1
                     transition-all disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {atualizando ? (
            <>⏳ Atualizando...</>
          ) : (
            <>🔄 Atualizar Aplicativo</>
          )}
        </button>
        <p className="text-xs text-gray-400 text-center -mt-2">
          Use quando o app não refletir as últimas mudanças
        </p>
      </div>
    </FormPage>
  );
}

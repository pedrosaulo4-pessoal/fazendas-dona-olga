'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import InstallPrompt from '@/components/InstallPrompt';

export default function LoginPage() {
  const [login, setLogin] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login, senha }),
      });

      if (res.ok) {
        router.push('/menu');
        router.refresh();
      } else {
        const data = await res.json();
        setErro(data.error ?? 'Erro ao fazer login.');
      }
    } catch {
      setErro('Erro de conexão. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-dvh bg-[#e8e8e8] flex flex-col">
      {/* Header */}
      <header className="bg-[#1a237e] px-4 py-3 flex items-center gap-3 shadow-md">
        <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center flex-shrink-0 overflow-hidden p-1">
          <Image src="/logo.png" alt="Fazendas Dona Olga" width={56} height={56} className="object-contain" priority />
        </div>
        <div>
          <p className="text-white/80 text-[11px] tracking-[0.2em] uppercase font-medium">
            FAZENDAS DONA OLGA
          </p>
          <h1 className="text-white text-[1.6rem] font-black tracking-wider uppercase leading-tight">
            CONTROLE DE REBANHO
          </h1>
        </div>
      </header>

      {/* Body */}
      <div className="flex-1 px-6 pt-10 pb-8 flex flex-col max-w-lg mx-auto w-full">
        <h2 className="text-center text-[1.15rem] font-bold tracking-[0.18em] uppercase text-gray-800 mb-10">
          INFORME OS DADOS DE ACESSO
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Login */}
          <div>
            <label className="block text-[11px] font-bold tracking-[0.15em] uppercase text-gray-600 mb-2">
              LOGIN
            </label>
            <input
              type="text"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              autoCapitalize="none"
              autoCorrect="off"
              autoComplete="username"
              required
              className="w-full bg-white rounded border border-gray-300 px-4 py-4 text-gray-800 text-base
                         shadow-[3px_3px_0_rgba(0,0,0,0.12)] outline-none
                         focus:border-[#1a237e] focus:shadow-[3px_3px_0_rgba(26,35,126,0.25)]
                         transition-all"
            />
          </div>

          {/* Senha */}
          <div>
            <label className="block text-[11px] font-bold tracking-[0.15em] uppercase text-gray-600 mb-2">
              SENHA
            </label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              autoComplete="current-password"
              required
              className="w-full bg-white rounded border border-gray-300 px-4 py-4 text-gray-800 text-base
                         shadow-[3px_3px_0_rgba(0,0,0,0.12)] outline-none
                         focus:border-[#1a237e] focus:shadow-[3px_3px_0_rgba(26,35,126,0.25)]
                         transition-all"
            />
          </div>

          {/* Erro */}
          {erro && (
            <p className="text-red-600 text-sm text-center font-medium bg-red-50 py-2 px-3 rounded border border-red-200">
              {erro}
            </p>
          )}

          {/* Botão */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1a237e] text-white text-xl font-bold tracking-[0.15em] uppercase
                       py-5 rounded mt-2
                       shadow-[4px_4px_0_rgba(0,0,0,0.3)]
                       active:shadow-none active:translate-x-1 active:translate-y-1
                       transition-all duration-75
                       disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'ENTRANDO...' : 'ENTRAR'}
          </button>
        </form>
      </div>

      <p className="text-center text-gray-400 text-[11px] pb-4">V1</p>

      <InstallPrompt />
    </div>
  );
}

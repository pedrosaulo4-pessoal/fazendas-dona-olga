'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function EmConstrucao() {
  const router = useRouter();

  return (
    <div className="min-h-dvh bg-[#e8e8e8] flex flex-col">
      <header className="bg-[#1a237e] px-4 py-3 shadow-md flex items-center gap-3">
        <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center flex-shrink-0 overflow-hidden p-1">
          <Image src="/logo.png" alt="Fazendas Dona Olga" width={56} height={56} className="object-contain" />
        </div>
        <div>
          <p className="text-white/80 text-[11px] tracking-[0.2em] uppercase font-medium">
            FAZENDAS DONA OLGA
          </p>
          <h1 className="text-white text-[1.35rem] font-black tracking-wider uppercase leading-tight">
            CONTROLE DE REBANHO
          </h1>
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center px-6 gap-6">
        <div className="text-6xl">🚧</div>
        <h2 className="text-xl font-bold tracking-widest uppercase text-gray-700 text-center">
          Em Construção
        </h2>
        <p className="text-gray-500 text-center text-sm">
          Esta funcionalidade será implementada em breve.
        </p>
        <button
          onClick={() => router.back()}
          className="bg-[#FFD700] text-gray-900 font-bold text-base uppercase tracking-widest
                     px-8 py-4 rounded-lg mt-4
                     shadow-[4px_4px_0_rgba(0,0,0,0.22)]
                     active:shadow-none active:translate-x-1 active:translate-y-1
                     transition-all duration-75"
        >
          ← Voltar
        </button>
      </div>
    </div>
  );
}

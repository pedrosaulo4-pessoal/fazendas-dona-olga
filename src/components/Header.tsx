'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface HeaderProps {
  saudacao?: string;
  perfil?: string;
}

export default function Header({ saudacao, perfil }: HeaderProps) {
  const router = useRouter();

  return (
    <header className="bg-[#1a237e] px-4 py-3 shadow-md">
      <div className="flex items-start gap-3">
        <button onClick={() => router.push('/menu')} className="flex-shrink-0">
          <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center overflow-hidden p-1">
            <Image src="/logo.png" alt="Logo" width={56} height={56} className="object-contain" priority />
          </div>
        </button>
        <div className="flex-1 flex items-start justify-between min-w-0">
          <div>
            <p className="text-white/80 text-[10px] tracking-[0.2em] uppercase font-medium">FAZENDAS DONA OLGA</p>
            <h1 className="text-white text-[1.35rem] font-black tracking-wider uppercase leading-tight">
              CONTROLE DE REBANHO
            </h1>
            {saudacao && <p className="text-white text-[13px] font-semibold mt-0.5">{saudacao}</p>}
          </div>
          {perfil === 'admin' && (
            <button
              onClick={() => router.push('/admin')}
              className="bg-[#6b8e23] text-white text-[11px] font-bold px-3 py-1.5 rounded ml-2 flex-shrink-0
                         shadow-[2px_2px_0_rgba(0,0,0,0.2)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all"
            >
              Administrador
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

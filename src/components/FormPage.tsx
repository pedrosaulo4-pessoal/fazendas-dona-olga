'use client';

import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import Header from './Header';

interface Props {
  titulo: string;
  saudacao?: string;
  perfil?: string;
  children: ReactNode;
}

export default function FormPage({ titulo, saudacao, perfil, children }: Props) {
  const router = useRouter();
  return (
    <div className="min-h-dvh bg-[#e8e8e8] flex flex-col">
      <Header saudacao={saudacao} perfil={perfil} />
      <div className="flex-1 px-5 py-6 max-w-lg mx-auto w-full flex flex-col gap-1">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => router.back()} className="text-[#1a237e] text-2xl leading-none">‹</button>
          <h2 className="text-xl font-black tracking-widest uppercase text-gray-800">{titulo}</h2>
        </div>
        {children}
      </div>
    </div>
  );
}

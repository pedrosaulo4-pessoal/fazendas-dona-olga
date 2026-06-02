'use client';
import { useRouter } from 'next/navigation';
import FormPage from '@/components/FormPage';

const ITENS = [
  { label: 'Lista de Animais', href: '/consultar/animais' },
  { label: 'Relatório Geral', href: '/consultar/relatorio' },
];

export default function ConsultarPage() {
  const router = useRouter();
  return (
    <FormPage titulo="Consultar Rebanho">
      <div className="flex flex-col gap-4 mt-4">
        {ITENS.map(item => (
          <button key={item.href} onClick={() => router.push(item.href)}
            className="w-full bg-[#FFD700] text-gray-900 text-base font-semibold py-6 rounded-lg
                       shadow-[4px_4px_0_rgba(0,0,0,0.22)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all">
            {item.label}
          </button>
        ))}
      </div>
    </FormPage>
  );
}

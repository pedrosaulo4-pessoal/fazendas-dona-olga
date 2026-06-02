'use client';
import { useRouter } from 'next/navigation';
import FormPage from '@/components/FormPage';

const ITENS = [
  { label: 'Consultar rebanho', href: '/consultar' },
  { label: 'Informar Pesagem', href: '/outros/pesagem' },
  { label: 'Informar doença ou condição', href: '/outros/doenca' },
  { label: 'Informar aborto', href: '/outros/aborto' },
  { label: 'Inserir foto de um animal', href: '/outros/foto' },
];

export default function OutrosPage() {
  const router = useRouter();
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
      </div>
    </FormPage>
  );
}

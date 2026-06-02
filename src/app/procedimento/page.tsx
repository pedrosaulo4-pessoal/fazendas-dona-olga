'use client';
import { useRouter } from 'next/navigation';
import FormPage from '@/components/FormPage';

export default function ProcedimentoPage() {
  const router = useRouter();
  return (
    <FormPage titulo="Informar Procedimento">
      <div className="flex flex-col gap-4 mt-8">
        {[
          { label: 'Procedimento de Lote', href: '/procedimento/lote' },
          { label: 'Procedimento Individual', href: '/procedimento/individual' },
        ].map(item => (
          <button key={item.href} onClick={() => router.push(item.href)}
            className="w-full bg-[#FFD700] text-gray-900 text-lg font-semibold py-7 rounded-lg
                       shadow-[4px_4px_0_rgba(0,0,0,0.22)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all">
            {item.label}
          </button>
        ))}
      </div>
    </FormPage>
  );
}

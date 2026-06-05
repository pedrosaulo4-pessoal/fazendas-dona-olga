'use client';
import { useRouter } from 'next/navigation';
import FormPage from '@/components/FormPage';

const ITENS = [
  { label: 'LOGIN/SENHAS', href: '/admin/perfis' },
  { label: 'HISTÓRICOS/AUDITORIA', href: '/admin/auditoria' },
  { label: 'BACKUP', href: '/admin/backup' },
  { label: 'VERSÕES', href: '/admin/versoes' },
];

export default function AdminPage() {
  const router = useRouter();
  return (
    <FormPage titulo="Painel do Administrador">
      <div className="flex flex-col gap-4 mt-4">
        {ITENS.map(item => (
          <button key={item.href} onClick={() => router.push(item.href)}
            className="w-full bg-[#FFD700] text-gray-900 text-xl font-bold py-7 rounded-lg
                       shadow-[4px_4px_0_rgba(0,0,0,0.22)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all
                       tracking-wider">
            {item.label}
          </button>
        ))}
      </div>
    </FormPage>
  );
}

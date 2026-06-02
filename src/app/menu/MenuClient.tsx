'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { SessionUser, UserPerfil } from '@/lib/users';

interface MenuItem {
  label: string;
  href: string;
  roles: UserPerfil[];
}

const MENU_ITEMS: MenuItem[] = [
  {
    label: 'Informar nascimento',
    href: '/nascimento',
    roles: ['admin', 'veterinario', 'vaqueiro'],
  },
  {
    label: 'Informar morte',
    href: '/morte',
    roles: ['admin', 'veterinario', 'vaqueiro'],
  },
  {
    label: 'Informar venda/compra',
    href: '/venda-compra',
    roles: ['admin'],
  },
  {
    label: 'Informar procedimento',
    href: '/procedimento',
    roles: ['admin', 'veterinario'],
  },
  {
    label: 'Outros',
    href: '/outros',
    roles: ['admin', 'veterinario', 'vaqueiro', 'outros'],
  },
];

export default function MenuClient({ user }: { user: SessionUser }) {
  const router = useRouter();

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  }

  const itensVisiveis = MENU_ITEMS.filter((item) =>
    item.roles.includes(user.perfil)
  );

  return (
    <div className="min-h-dvh bg-[#e8e8e8] flex flex-col">
      {/* Header */}
      <header className="bg-[#1a237e] px-4 py-3 shadow-md">
        <div className="flex items-start gap-3">
          {/* Logo */}
          <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center flex-shrink-0 overflow-hidden p-1">
            <Image src="/logo.png" alt="Fazendas Dona Olga" width={56} height={56} className="object-contain" priority />
          </div>

          {/* Título + ações */}
          <div className="flex-1 flex items-start justify-between min-w-0">
            <div>
              <p className="text-white/80 text-[10px] tracking-[0.2em] uppercase font-medium">
                FAZENDAS DONA OLGA
              </p>
              <h1 className="text-white text-[1.35rem] font-black tracking-wider uppercase leading-tight">
                CONTROLE DE REBANHO
              </h1>
              <p className="text-white text-[13px] font-semibold mt-0.5">
                {user.saudacao}
              </p>
            </div>

            {/* Botões topo direito */}
            <div className="flex flex-col items-end gap-2 ml-2 flex-shrink-0">
              {user.perfil === 'admin' && (
                <button
                  onClick={() => router.push('/em-construcao')}
                  className="bg-[#6b8e23] text-white text-[11px] font-bold px-3 py-1.5 rounded
                             shadow-[2px_2px_0_rgba(0,0,0,0.2)]
                             active:shadow-none active:translate-x-[2px] active:translate-y-[2px]
                             transition-all"
                >
                  Administrador
                </button>
              )}
              <button
                onClick={handleLogout}
                className="text-white/60 text-[11px] underline underline-offset-2"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Conteúdo */}
      <div className="flex-1 px-5 py-8 flex flex-col max-w-lg mx-auto w-full">
        <h2 className="text-center text-[1.2rem] font-bold tracking-[0.15em] uppercase text-gray-800 mb-6">
          O QUE DESEJA FAZER?
        </h2>

        <div className="flex flex-col gap-4">
          {itensVisiveis.map((item) => (
            <button
              key={item.label}
              onClick={() => router.push(item.href)}
              className="w-full bg-[#FFD700] text-gray-900 text-lg font-semibold
                         py-6 px-4 rounded-lg
                         shadow-[4px_4px_0_rgba(0,0,0,0.22)]
                         active:shadow-none active:translate-x-1 active:translate-y-1
                         transition-all duration-75 text-center"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <p className="text-center text-gray-400 text-[11px] pb-4">V1</p>
    </div>
  );
}

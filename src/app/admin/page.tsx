'use client';
import { useRouter } from 'next/navigation';
import FormPage from '@/components/FormPage';

const USUARIOS = [
  { nome: 'Pedro', login: 'admin', perfil: 'Administrador', cor: 'bg-[#1a237e] text-white' },
  { nome: 'Vaqueiro', login: 'vaqueiro', perfil: 'Vaqueiro', cor: 'bg-yellow-100 text-yellow-900' },
  { nome: 'Visitante', login: 'visitante', perfil: 'Outros (Somente leitura)', cor: 'bg-gray-100 text-gray-700' },
];

const PERMISSOES: Record<string, string[]> = {
  admin: ['Nascimento', 'Morte', 'Venda/Compra', 'Procedimento', 'Pesagem', 'Doença', 'Aborto', 'Foto', 'Consultar', 'Administrador'],
  vaqueiro: ['Nascimento', 'Morte', 'Pesagem', 'Doença', 'Aborto', 'Foto', 'Consultar'],
  outros: ['Consultar'],
};

const MENU_ADMIN = [
  { label: 'Lista de Animais', href: '/consultar/animais' },
  { label: 'Relatório Geral do Rebanho', href: '/consultar/relatorio' },
  { label: 'Relatório Vendas/Compras', href: '/venda-compra/relatorio' },
];

export default function AdminPage() {
  const router = useRouter();

  return (
    <FormPage titulo="Painel Administrador">
      <div className="flex flex-col gap-5">

        {/* Atalhos rápidos */}
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Acesso Rápido</p>
          <div className="flex flex-col gap-2">
            {MENU_ADMIN.map(item => (
              <button key={item.href} onClick={() => router.push(item.href)}
                className="w-full bg-[#FFD700] text-gray-900 text-base font-semibold py-4 rounded-lg
                           shadow-[3px_3px_0_rgba(0,0,0,0.18)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all text-left px-4">
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Usuários */}
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Usuários do Sistema</p>
          <div className="flex flex-col gap-3">
            {USUARIOS.map(u => (
              <div key={u.login} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-bold text-gray-800">{u.nome}</p>
                    <p className="text-xs text-gray-500">Login: <span className="font-mono font-semibold">{u.login}</span></p>
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${u.cor}`}>{u.perfil}</span>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {(PERMISSOES[u.login === 'admin' ? 'admin' : u.login === 'vaqueiro' ? 'vaqueiro' : 'outros'] || []).map(p => (
                    <span key={p} className="text-[10px] bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded-full font-medium">
                      ✓ {p}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Senha padrão */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <p className="text-xs font-bold text-yellow-800 uppercase tracking-wide mb-1">⚠️ Senha padrão de todos os usuários</p>
          <p className="font-mono font-bold text-yellow-900 text-lg tracking-widest">fazenda123</p>
        </div>

      </div>
    </FormPage>
  );
}

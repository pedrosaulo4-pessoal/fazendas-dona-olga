'use client';
import { useState } from 'react';
import FormPage from '@/components/FormPage';
import { USERS, PERMISSOES, UserPerfil } from '@/lib/users';

const PERFIL_COR: Record<UserPerfil, string> = {
  admin: 'bg-[#1a237e] text-white',
  veterinario: 'bg-purple-100 text-purple-900',
  vaqueiro: 'bg-yellow-100 text-yellow-900',
  outros: 'bg-gray-100 text-gray-700',
};

const PERFIL_LABEL: Record<UserPerfil, string> = {
  admin: 'Administrador',
  veterinario: 'Veterinário',
  vaqueiro: 'Vaqueiro',
  outros: 'Visitante',
};

const TODAS_PERMISSOES = [
  'Nascimento', 'Morte', 'Venda/Compra', 'Procedimento',
  'Pesagem', 'Doença', 'Aborto', 'Foto', 'Consultar Rebanho', 'Administrador',
];

export default function PerfisPage() {
  const [senhasVisiveis, setSenhasVisiveis] = useState<Record<string, boolean>>({});

  function toggleSenha(id: string) {
    setSenhasVisiveis(prev => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <FormPage titulo="Login / Senhas / Perfis">
      <div className="flex flex-col gap-4">
        {USERS.map(u => {
          const perms = PERMISSOES[u.perfil];
          return (
            <div key={u.id} className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
              {/* Cabeçalho do card */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <div>
                  <p className="font-bold text-gray-900 text-base">{u.nome}</p>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${PERFIL_COR[u.perfil]}`}>
                    {PERFIL_LABEL[u.perfil]}
                  </span>
                </div>
              </div>

              {/* Login e Senha */}
              <div className="px-4 py-3 flex flex-col gap-2 border-b border-gray-100">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Login</span>
                  <span className="font-mono font-bold text-gray-800 text-sm">{u.login}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Senha</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-gray-800 text-sm">
                      {senhasVisiveis[u.id] ? u.senha : '••••••••'}
                    </span>
                    <button
                      onClick={() => toggleSenha(u.id)}
                      className="text-[11px] text-[#1a237e] underline"
                    >
                      {senhasVisiveis[u.id] ? 'ocultar' : 'ver'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Permissões */}
              <div className="px-4 py-3">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Acesso</p>
                <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                  {TODAS_PERMISSOES.map(p => {
                    const tem = perms.includes(p);
                    return (
                      <div key={p} className="flex items-center gap-1.5">
                        <span className={`text-sm ${tem ? 'text-green-500' : 'text-gray-300'}`}>
                          {tem ? '✓' : '✗'}
                        </span>
                        <span className={`text-xs ${tem ? 'text-gray-700 font-medium' : 'text-gray-400'}`}>
                          {p}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}

        {/* Nota */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mt-2">
          <p className="text-xs text-yellow-800 font-semibold">⚠️ Senha padrão de todos os usuários: <span className="font-mono font-bold tracking-widest">fazenda123</span></p>
          <p className="text-xs text-yellow-700 mt-1">Para alterar senhas, entre em contato com o administrador do sistema.</p>
        </div>
      </div>
    </FormPage>
  );
}

export type UserPerfil = 'admin' | 'veterinario' | 'vaqueiro' | 'outros';

export interface User {
  id: string;
  nome: string;
  login: string;
  senha: string;
  perfil: UserPerfil;
  saudacao: string;
}

export const USERS: User[] = [
  {
    id: '1',
    nome: 'Pedro',
    login: 'admin',
    senha: 'fazenda123',
    perfil: 'admin',
    saudacao: 'OLÁ PEDRO!',
  },
  {
    id: '2',
    nome: 'Vaqueiro',
    login: 'vaqueiro',
    senha: 'fazenda123',
    perfil: 'vaqueiro',
    saudacao: 'OLÁ VAQUEIRO!',
  },
  {
    id: '3',
    nome: 'Visitante',
    login: 'visitante',
    senha: 'fazenda123',
    perfil: 'outros',
    saudacao: 'OLÁ VISITANTE!',
  },
];

export function findUser(login: string, senha: string): User | null {
  return (
    USERS.find(
      (u) => u.login === login.trim().toLowerCase() && u.senha === senha
    ) ?? null
  );
}

export interface SessionUser {
  id: string;
  nome: string;
  login: string;
  perfil: UserPerfil;
  saudacao: string;
}

import { NextRequest, NextResponse } from 'next/server';
import { findUser, SessionUser } from '@/lib/users';

export async function POST(req: NextRequest) {
  const { login, senha } = await req.json();

  const user = findUser(login, senha);

  if (!user) {
    return NextResponse.json(
      { error: 'Login ou senha incorretos.' },
      { status: 401 }
    );
  }

  const session: SessionUser = {
    id: user.id,
    nome: user.nome,
    login: user.login,
    perfil: user.perfil,
    saudacao: user.saudacao,
  };

  const response = NextResponse.json({ success: true });
  response.cookies.set('session', JSON.stringify(session), {
    httpOnly: true,
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
    sameSite: 'lax',
  });

  return response;
}

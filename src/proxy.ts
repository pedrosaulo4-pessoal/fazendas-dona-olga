import { NextRequest, NextResponse } from 'next/server';

const ROTAS_PROTEGIDAS = [
  '/menu',
  '/nascimento',
  '/morte',
  '/procedimento',
  '/venda-compra',
  '/outros',
  '/consultar',
  '/admin',
  '/em-construcao',
];

export function proxy(req: NextRequest) {
  const session = req.cookies.get('session');
  const { pathname } = req.nextUrl;

  if (pathname === '/') {
    return NextResponse.redirect(
      new URL(session ? '/menu' : '/login', req.url)
    );
  }

  const protegida = ROTAS_PROTEGIDAS.some(r => pathname === r || pathname.startsWith(r + '/'));
  if (protegida && !session) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  if (pathname === '/login' && session) {
    return NextResponse.redirect(new URL('/menu', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/login',
    '/menu/:path*',
    '/nascimento/:path*',
    '/morte/:path*',
    '/procedimento/:path*',
    '/venda-compra/:path*',
    '/outros/:path*',
    '/consultar/:path*',
    '/admin/:path*',
    '/em-construcao',
  ],
};

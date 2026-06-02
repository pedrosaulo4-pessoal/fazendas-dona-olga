import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { SessionUser } from '@/lib/users';
import MenuClient from './MenuClient';

export default async function MenuPage() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session');

  if (!sessionCookie) redirect('/login');

  let user: SessionUser;
  try {
    user = JSON.parse(sessionCookie!.value);
  } catch {
    redirect('/login');
  }

  return <MenuClient user={user!} />;
}

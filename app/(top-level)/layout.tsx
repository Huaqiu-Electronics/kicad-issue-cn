import { getCurrentUser } from '@/lib/auth';
import { isAdmin } from '@/lib/admin';
import Header from '@/components/Header';

interface TopLevelLayoutProps {
  children: React.ReactNode;
}

export default async function TopLevelLayout({ children }: TopLevelLayoutProps) {
  const user = await getCurrentUser();
  const isUserAdmin = user ? isAdmin(user.email, user.role) : false;
  const lang = 'zh';

  return (
    <>
      <Header isUserAdmin={isUserAdmin} lang={lang} />
      <main>{children}</main>
    </>
  );
}

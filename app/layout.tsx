import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { getCurrentUser } from '@/lib/auth';
import { isAdmin } from '@/lib/admin';
import ClientProviders from '@/components/ui/ClientProviders';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'KiCad Issue CN',
  description: 'KiCad Issue CN - 中文问题提交平台',
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  const user = await getCurrentUser();
  const isUserAdmin = user ? isAdmin(user.email, user.role) : false;

  return (
    <html lang="zh" className={inter.className}>
      <body className="min-h-screen bg-background text-foreground">
        <ClientProviders user={user} isUserAdmin={isUserAdmin} lang="zh">
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}

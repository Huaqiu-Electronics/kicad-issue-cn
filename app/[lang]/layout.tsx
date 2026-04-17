import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { getCurrentUser } from '@/lib/auth';
import { isAdmin } from '@/lib/admin';
import Navigation from '@/components/Navigation';
import { ThemeProvider } from '@/components/ui/ThemeContext';
import ThemeApplier from '@/components/ThemeApplier';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'KiCad Issue CN',
  description: 'KiCad Issue CN - 中文问题提交平台',
};

interface RootLayoutProps {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}

export default async function RootLayout({ children, params }: RootLayoutProps) {
  const user = await getCurrentUser();
  const isUserAdmin = user ? isAdmin(user.email, user.role) : false;
  const { lang } = await params;

  return (
    <html lang={lang} className={inter.className}>
      <body className="min-h-screen bg-background text-foreground">
        <ThemeProvider>
          <ThemeApplier>
            <header className="sticky top-0 z-50 backdrop-blur-md bg-background/95 border-b border-border">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                  <Navigation user={user} isUserAdmin={isUserAdmin} lang={lang} />
                </div>
              </div>
            </header>
            <main>
              {children}
            </main>
          </ThemeApplier>
        </ThemeProvider>
      </body>
    </html>
  );
}

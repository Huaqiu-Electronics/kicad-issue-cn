'use client';

import Link from 'next/link';
import { Heart, Coffee } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import LanguageToggle from './LanguageToggle';
import { useI18n } from '@/app/hooks/useI18n';

interface NavigationProps {
  user: any;
  isUserAdmin: boolean;
  lang?: string;
}

export default function Navigation({ user, isUserAdmin, lang = 'zh' }: NavigationProps) {
  const handleLogout = async () => {
    await fetch('/api/auth/logout', {
      method: 'POST',
    });
    if (typeof window !== 'undefined') {
      window.location.href = `/${lang}/login`;
    }
  };
  const { t } = useI18n();

  return (
    <div className="flex items-center gap-4">
      <Link href={`/${lang}/issues`} className="text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
        {t('common.nav.issues')}
      </Link>
      {user ? (
        <div className="flex items-center gap-4">
          {isUserAdmin && (
            <Link href={`/${lang}/admin`} className="text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              {t('common.nav.admin')}
            </Link>
          )}
          <span className="text-sm text-muted-foreground">{user.email}</span>
          <button
            onClick={handleLogout}
            className="text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            {t('common.nav.logout')}
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <Link href={`/${lang}/login`} className="text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            {t('common.nav.login')}
          </Link>
          <Link href={`/${lang}/register`} className="text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            {t('common.nav.register')}
          </Link>
        </div>
      )}
      <LanguageToggle lang={lang} />
      <ThemeToggle />
    </div>
  );
}

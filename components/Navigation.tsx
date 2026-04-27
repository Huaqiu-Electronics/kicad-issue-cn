'use client';

import Link from 'next/link';
import { Heart, Coffee } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import LanguageToggle from './LanguageToggle';
import { useI18n } from '@/app/hooks/useI18n';
import { useAuth } from './ui/AuthContext';

interface NavigationProps {
  isUserAdmin: boolean;
  lang?: string;
}

export default function Navigation({ isUserAdmin, lang = 'zh' }: NavigationProps) {
  const { user, setUser } = useAuth();
  
  const handleLogout = async () => {
    await fetch('/api/auth/logout', {
      method: 'POST',
    });
    // Update user state
    setUser(null);
    if (typeof window !== 'undefined') {
      window.location.href = `/${lang}/login`;
    }
  };
  const { t } = useI18n();

  return (
    <div className="flex items-center gap-8">
      <nav className="flex items-center gap-6">
        <Link 
          href={`/${lang}/issues`} 
          className="text-sm font-medium text-foreground hover:text-primary transition-colors duration-200"
        >
          {t('common.nav.issues')}
        </Link>
        {user && isUserAdmin && (
          <Link 
            href={`/${lang}/admin`} 
            className="text-sm font-medium text-foreground hover:text-primary transition-colors duration-200"
          >
            {t('common.nav.admin')}
          </Link>
        )}
      </nav>
      
      <div className="flex items-center gap-4">
        {user ? (
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{user.email}</span>
            <button
              onClick={handleLogout}
              className="text-sm font-medium text-foreground hover:text-primary transition-colors duration-200"
            >
              {t('common.nav.logout')}
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Link 
              href={`/${lang}/login`} 
              className="text-sm font-medium text-foreground hover:text-primary transition-colors duration-200"
            >
              {t('common.nav.login')}
            </Link>
            <Link 
              href={`/${lang}/register`} 
              className="text-sm font-medium text-foreground hover:text-primary transition-colors duration-200"
            >
              {t('common.nav.register')}
            </Link>
          </div>
        )}
        
        <div className="flex items-center gap-3">
          <LanguageToggle lang={lang} />
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}

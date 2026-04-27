'use client';

import Link from "next/link";
import { useI18n } from '@/app/hooks/useI18n';

interface HomeContentProps {
  user: any;
}

export default function HomeContent({ user }: HomeContentProps) {
  const { t } = useI18n();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-card-foreground mb-4">
          {t('home.title')}
        </h1>

        <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
          {t('home.description')}
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          {user ? (
            <>
              <Link
                href="/issues/new"
                className="px-8 py-3 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-all transform hover:scale-105 shadow-lg"
              >
                {t('home.new_issue')}
              </Link>
              <Link
                href="/issues"
                className="px-8 py-3 border-2 border-border text-card-foreground rounded-xl hover:bg-muted transition-all transform hover:scale-105"
              >
                {t('home.view_issues')}
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="px-8 py-3 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-all transform hover:scale-105 shadow-lg"
              >
                {t('home.login')}
              </Link>
              <Link
                href="/register"
                className="px-8 py-3 border-2 border-border text-card-foreground rounded-xl hover:bg-muted transition-all transform hover:scale-105"
              >
                {t('home.register')}
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

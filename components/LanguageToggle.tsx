'use client';

import { useI18n } from '@/app/hooks/useI18n';

interface LanguageToggleProps {
  lang: string;
}

export default function LanguageToggle({ lang }: LanguageToggleProps) {
  const { changeLocale, t } = useI18n();

  return (
    <div className="relative">
      <button
        className="flex items-center gap-2 p-2 rounded-lg bg-secondary hover:bg-accent transition-colors duration-200"
        onClick={() => {
          const newLocale = lang === 'zh' ? 'en' : 'zh';
          changeLocale(newLocale);
        }}
        aria-label="Toggle language"
      >
        <svg className="w-5 h-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="text-sm font-medium text-foreground">
          {lang === 'zh' ? t('common.language.zh') : t('common.language.en')}
        </span>
      </button>
    </div>
  );
}

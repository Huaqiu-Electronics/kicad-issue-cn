'use client';

import { useI18n } from '@/app/hooks/useI18n';
import Link from 'next/link';

interface HomeContentProps {
  user: any;
  lang: string;
}

export default function HomeContent({ user, lang }: HomeContentProps) {
  const { t } = useI18n();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4 text-primary">KiCad Issue CN</h1>
        <p className="text-xl text-muted-foreground mb-8">
          {t('home.description', '中文问题提交平台，帮助您向 KiCad 社区报告问题')}
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link 
            href={`/${lang}/issues`} 
            className="px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-colors"
          >
            {t('home.viewIssues', '查看问题')}
          </Link>
          {!user && (
            <Link 
              href={`/${lang}/login`} 
              className="px-8 py-3 bg-secondary text-secondary-foreground rounded-lg hover:opacity-90 transition-colors"
            >
              {t('home.login', '登录')}
            </Link>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
          <h2 className="text-xl font-semibold mb-3 text-card-foreground">
            {t('home.feature1.title', '便捷的问题提交')}
          </h2>
          <p className="text-muted-foreground">
            {t('home.feature1.description', '使用中文提交问题，我们会帮助您翻译并提交到 GitLab')}
          </p>
        </div>
        <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
          <h2 className="text-xl font-semibold mb-3 text-card-foreground">
            {t('home.feature2.title', '完整的问题管理')}
          </h2>
          <p className="text-muted-foreground">
            {t('home.feature2.description', '查看、评论和跟踪问题的最新状态')}
          </p>
        </div>
        <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
          <h2 className="text-xl font-semibold mb-3 text-card-foreground">
            {t('home.feature3.title', '专业的技术支持')}
          </h2>
          <p className="text-muted-foreground">
            {t('home.feature3.description', '获取 KiCad 社区的专业技术支持和解决方案')}
          </p>
        </div>
      </div>
    </div>
  );
}

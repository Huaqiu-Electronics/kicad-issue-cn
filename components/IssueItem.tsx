'use client';

import Link from 'next/link';
import { LocalIssue } from '@/lib/db';
import { useI18n } from '@/app/hooks/useI18n';

interface IssueItemProps {
  issue: LocalIssue;
  lang?: string;
}

export default function IssueItem({ issue, lang = 'zh' }: IssueItemProps) {
  const { t } = useI18n();
  
  return (
    <Link 
      href={`/${lang}/issues/${issue.gitlab_iid}`} 
      className="block p-6 border border-border rounded-2xl bg-card hover:shadow-xl transition-all transform hover:-translate-y-1"
    >
      <h3 className="text-xl font-bold text-card-foreground mb-3">{issue.title}</h3>
      <div className="flex flex-wrap items-center gap-3 mb-3">
        <span className="px-3 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full">
          #{issue.gitlab_iid}
        </span>
        <span className="text-sm text-muted-foreground">{t('issues.submitted_by', 'Submitted by')} {issue.user_nickname}</span>
        <span className="text-sm text-muted-foreground">
          {new Date(issue.created_at).toLocaleString()}
        </span>
      </div>
    </Link>
  );
}

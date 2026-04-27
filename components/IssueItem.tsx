'use client';

import Link from 'next/link';
import { useI18n } from '@/app/hooks/useI18n';

interface IssueItemProps {
  issue: any;
  lang?: string;
  user?: any;
}

export default function IssueItem({ issue, lang = 'zh', user }: IssueItemProps) {
  const { t } = useI18n();
  
  if (issue.isGuestIssue) {
    // Guest issue
    return (
      <Link 
        href={`/${lang}/issues/guest/${issue.id}`} 
        className="block p-6 border border-yellow-300 rounded-2xl bg-yellow-50 dark:bg-yellow-900/10 hover:shadow-xl transition-all transform hover:-translate-y-1"
      >
        <div className="flex items-center gap-2 mb-3">
          <span className="px-3 py-1 text-xs font-medium bg-yellow-200 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-300 rounded-full">
            Pending
          </span>
        </div>
        <h3 className="text-xl font-bold text-card-foreground mb-3">{issue.title}</h3>
        <div className="flex flex-wrap items-center gap-3 mb-3">
          {issue.version && (
            <span className="text-sm text-muted-foreground">Version: {issue.version}</span>
          )}
          {issue.platform && (
            <span className="text-sm text-muted-foreground">Platform: {issue.platform}</span>
          )}
          <span className="text-sm text-muted-foreground">
            {new Date(issue.createdAt).toLocaleString()}
          </span>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">{issue.description}</p>
      </Link>
    );
  } else {
    // Regular issue
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
}

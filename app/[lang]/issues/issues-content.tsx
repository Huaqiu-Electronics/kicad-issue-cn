'use client';

import IssueListClient from '@/components/IssueListClient';
import { useI18n } from '@/app/hooks/useI18n';

interface IssuesContentProps {
  issues: any[];
  lang: string;
}

export default function IssuesContent({ issues, lang }: IssuesContentProps) {
  const { t } = useI18n();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <IssueListClient initialIssues={issues} t={t} lang={lang} />
    </div>
  );
}

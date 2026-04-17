'use client';

import IssueListClient from '@/components/IssueListClient';
import { useI18n } from '@/app/hooks/useI18n';

interface IssuesContentProps {
  issues: any[];
}

export default function IssuesContent({ issues }: IssuesContentProps) {
  const { t } = useI18n();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <IssueListClient initialIssues={issues} t={t} />
    </div>
  );
}

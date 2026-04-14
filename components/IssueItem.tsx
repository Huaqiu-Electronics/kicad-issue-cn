'use client';

import Link from 'next/link';
import { LocalIssue } from '@/lib/db';

interface IssueItemProps {
  issue: LocalIssue;
}

export default function IssueItem({ issue }: IssueItemProps) {
  const labels = issue.labels ? issue.labels.split(',') : [];
  
  return (
    <Link 
      href={`/issues/${issue.gitlab_iid}`} 
      className="block p-6 border border-gray-200 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-800 hover:shadow-xl transition-all transform hover:-translate-y-1"
    >
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{issue.title}</h3>
      <div className="flex flex-wrap items-center gap-3 mb-3">
        <span className="px-3 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full">
          #{issue.gitlab_iid}
        </span>
        <span className="text-sm text-gray-600 dark:text-gray-400">由 {issue.username} 提交</span>
        <span className="text-sm text-gray-500 dark:text-gray-500">
          {new Date(issue.created_at).toLocaleString()}
        </span>
      </div>
      {labels.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {labels.map((label, index) => (
            <span key={index} className="px-3 py-1 text-xs bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full">
              {label.trim()}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}

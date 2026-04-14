'use client';

import Link from 'next/link';
import { LocalIssue } from '@/lib/db';

interface IssueItemProps {
  issue: LocalIssue;
}

export default function IssueItem({ issue }: IssueItemProps) {
  const labels = issue.labels ? issue.labels.split(',') : [];
  
  return (
    <Link href={`/issues/${issue.gitlab_iid}`} className="block p-4 border rounded-lg hover:bg-gray-50 transition-colors">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{issue.title}</h3>
      <div className="flex items-center gap-2 mb-2">
        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
          #{issue.gitlab_iid}
        </span>
        <span className="text-sm text-gray-500">由 {issue.username} 提交</span>
        <span className="text-sm text-gray-500">
          {new Date(issue.created_at).toLocaleString()}
        </span>
      </div>
      {labels.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {labels.map((label, index) => (
            <span key={index} className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
              {label.trim()}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}

'use client';

import Link from 'next/link';
import { GitLabIssue } from '@/lib/types';

interface IssueItemProps {
  issue: GitLabIssue;
}

export default function IssueItem({ issue }: IssueItemProps) {
  return (
    <Link href={`/issues/${issue.iid}`} className="block p-4 border rounded-lg hover:bg-gray-50 transition-colors">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{issue.title}</h3>
      <div className="flex items-center gap-2 mb-2">
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
          issue.state === 'opened' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {issue.state}
        </span>
        <span className="text-sm text-gray-500">#{issue.iid}</span>
      </div>
      {issue.labels.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {issue.labels.map((label) => (
            <span key={label} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
              {label}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}

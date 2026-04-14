import Link from 'next/link';
import IssueList from '@/components/IssueList';
import { getAllIssues } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function IssuesPage() {
  const issues = await getAllIssues();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">问题列表</h1>
        <Link
          href="/issues/new"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          新建问题
        </Link>
      </div>
      <IssueList issues={issues} />
    </div>
  );
}

import Link from 'next/link';
import IssueList from '@/components/IssueList';
import { getAllIssues } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function IssuesPage() {
  const issues = await getAllIssues();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
        <h1 className="text-4xl font-bold text-card-foreground">问题列表</h1>
        <Link
          href="/issues/new"
          className="px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-all transform hover:scale-105 shadow-lg"
        >
          新建问题
        </Link>
      </div>
      <IssueList issues={issues} />
    </div>
  );
}

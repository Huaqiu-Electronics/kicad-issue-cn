import Link from 'next/link';
import IssueListClient from '@/components/IssueListClient';
import { getAllIssues } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function IssuesPage() {
  const issues = await getAllIssues();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <IssueListClient initialIssues={issues} />
    </div>
  );
}

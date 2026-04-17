import IssueListClient from '@/components/IssueListClient';
import { getIssuesByUserId } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function IssuesPage() {
  const user = await requireAuth();
  const issues = await getIssuesByUserId(user.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <IssueListClient initialIssues={issues} />
    </div>
  );
}

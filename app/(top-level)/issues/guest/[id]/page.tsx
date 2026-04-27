import { getGuestIssueById } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import GuestIssueDetailContent from './GuestIssueDetailContent';

export const dynamic = 'force-dynamic';

export default async function GuestIssueDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUser();
  const guestIssue = await getGuestIssueById(id);

  if (!guestIssue) {
    return <div className="text-center py-20">Issue not found</div>;
  }

  return (
    <GuestIssueDetailContent guestIssue={guestIssue} lang="zh" user={user} />
  );
}

import { getAllIssues, getAllGuestIssues } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import IssuesContent from './issues-content';

export const dynamic = 'force-dynamic';

export default async function IssuesPage({ params }: { params: Promise<{ lang: string }> }) {
  const user = await getCurrentUser();
  const { lang } = await params;
  
  // All users including guests should see all issues and pending guest issues
  const issues = await getAllIssues();
  const guestIssues = await getAllGuestIssues();

  return (
    <IssuesContent issues={issues} guestIssues={guestIssues} lang={lang} user={user} />
  );
}

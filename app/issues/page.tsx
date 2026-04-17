import { getIssuesByUserId, getAllIssues } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import IssuesContent from './issues-content';

export const dynamic = 'force-dynamic';

export default async function IssuesPage() {
  const user = await getCurrentUser();
  let issues;
  
  if (user) {
    issues = await getIssuesByUserId(user.id);
  } else {
    issues = await getAllIssues();
  }

  return (
    <IssuesContent issues={issues} />
  );
}

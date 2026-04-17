import { requireAuth } from '@/lib/auth';
import NewIssueForm from './form';

export const dynamic = 'force-dynamic';

export default async function NewIssuePage() {
  // Require authentication
  await requireAuth();

  return (
    <div>
      <NewIssueForm />
    </div>
  );
}

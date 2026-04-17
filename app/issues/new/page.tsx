import { redirect } from 'next/navigation';
import { requireAuth } from '@/lib/auth';
import NewIssueForm from './form';

export const dynamic = 'force-dynamic';

export default async function NewIssuePage() {
  try {
    // Require authentication
    await requireAuth();

    return (
      <div>
        <NewIssueForm />
      </div>
    );
  } catch (error) {
    // Redirect to login page if unauthorized
    redirect('/login');
  }
}

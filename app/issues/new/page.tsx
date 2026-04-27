import { redirect } from 'next/navigation';
import { requireAuth } from '@/lib/auth';
import NewIssueForm from './form';

export const dynamic = 'force-dynamic';

export default async function NewIssuePage({ 
  searchParams 
}: { 
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const search = await searchParams;

  try {
    // Require authentication
    await requireAuth();

    return (
      <div>
        <NewIssueForm 
          issuableTemplate={search['issuable_template'] as string} 
          issueDescription={search['issue[description]'] as string}
        />
      </div>
    );
  } catch (error) {
    // Redirect to login page if unauthorized
    redirect('/login');
  }
}

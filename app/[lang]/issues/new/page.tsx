import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { requireAuth } from '@/lib/auth';
import NewIssueForm from './form';

export const dynamic = 'force-dynamic';

export default async function NewIssuePage({ 
  params, 
  searchParams 
}: { 
  params: Promise<{ lang: string }>,
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { lang } = await params;
  const search = await searchParams;
  
  try {
    // Require authentication for creating issues
    await requireAuth();
    const user = await getCurrentUser();

    return (
      <NewIssueForm 
        user={user} 
        lang={lang} 
        issuableTemplate={search['issuable_template'] as string} 
        issueDescription={search['issue[description]'] as string}
      />
    );
  } catch (error) {
    // Redirect to login page if unauthorized
    redirect(`/${lang}/login`);
  }
}

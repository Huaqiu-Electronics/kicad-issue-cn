import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { requireAuth } from '@/lib/auth';
import NewIssueForm from './form';

export const dynamic = 'force-dynamic';

export default async function NewIssuePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  
  try {
    // Require authentication for creating issues
    await requireAuth();
    const user = await getCurrentUser();

    return (
      <NewIssueForm user={user} lang={lang} />
    );
  } catch (error) {
    // Redirect to login page if unauthorized
    redirect(`/${lang}/login`);
  }
}

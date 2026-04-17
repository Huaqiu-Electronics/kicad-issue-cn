import { getCurrentUser } from '@/lib/auth';
import { requireAuth } from '@/lib/auth';
import NewIssueForm from './form';

export const dynamic = 'force-dynamic';

export default async function NewIssuePage({ params }: { params: Promise<{ lang: string }> }) {
  // Require authentication for creating issues
  await requireAuth();
  const user = await getCurrentUser();
  const { lang } = await params;

  return (
    <NewIssueForm user={user} lang={lang} />
  );
}

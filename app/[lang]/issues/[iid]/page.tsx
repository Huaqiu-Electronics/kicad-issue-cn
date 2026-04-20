import { getIssue, listNotes } from '@/lib/gitlab';
import { getCurrentUser } from '@/lib/auth';
import IssueDetailContent from './IssueDetailContent';

export const dynamic = 'force-dynamic';

interface IssueDetailPageProps {
  params: Promise<{
    lang: string;
    iid: string;
  }>;
}

export default async function IssueDetailPage({ params }: IssueDetailPageProps) {
  // Get current user (optional)
  const user = await getCurrentUser();
  const { iid, lang } = await params;
  
  try {
    const issue = await getIssue(parseInt(iid));
    const notes = await listNotes(parseInt(iid));

    return (
      <IssueDetailContent issue={issue} notes={notes} user={user} lang={lang} />
    );
  } catch (error) {
    // Check if it's a 404 error (issue not found/deleted)
    if (error instanceof Error && error.message.includes('404')) {
      return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">Issue Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The issue you are looking for has been deleted or does not exist.
          </p>
          <a 
            href={`/${lang}/issues`} 
            className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Back to Issues List
          </a>
        </div>
      );
    }
    
    // For other errors, re-throw them
    throw error;
  }
}


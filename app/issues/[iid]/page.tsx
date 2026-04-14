import Link from 'next/link';
import { getIssue, listNotes } from '@/lib/gitlab';
import CommentList from '@/components/CommentList';
import CommentForm from '@/components/CommentForm';

export const dynamic = 'force-dynamic';

export default async function IssueDetailPage({ params }: { params: Promise<{ iid: string }> }) {
  const { iid } = await params;
  const issue = await getIssue(parseInt(iid));
  const notes = await listNotes(parseInt(iid));

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/issues" className="text-blue-600 hover:text-blue-800">
          ← Back to issues
        </Link>
      </div>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold text-gray-900">{issue.title}</h1>
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
            issue.state === 'opened' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
          }`}>
            {issue.state}
          </span>
          <span className="text-sm text-gray-500">#{issue.iid}</span>
        </div>
        {issue.labels.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {issue.labels.map((label) => (
              <span key={label} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                {label}
              </span>
            ))}
          </div>
        )}
        <div className="text-sm text-gray-500 mb-4">
          Created {new Date(issue.created_at).toLocaleString()}
        </div>
        {issue.description && (
          <div className="p-4 border rounded-lg bg-gray-50">
            <p className="text-gray-700 whitespace-pre-wrap">{issue.description}</p>
          </div>
        )}
      </div>
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-900">Comments</h2>
        <CommentList notes={notes} />
        <CommentForm iid={parseInt(iid)} />
      </div>
    </div>
  );
}

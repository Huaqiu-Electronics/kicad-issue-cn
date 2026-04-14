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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <Link href="/issues" className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          返回问题列表
        </Link>
      </div>
      <div className="mb-12 p-8 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg">
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">{issue.title}</h1>
          <span className={`px-4 py-2 text-sm font-medium rounded-full ${
            issue.state === 'opened' 
              ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' 
              : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
          }`}>
            {issue.state}
          </span>
          <span className="text-lg text-gray-500 dark:text-gray-400">#{issue.iid}</span>
        </div>
        {issue.labels.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {issue.labels.map((label) => (
              <span key={label} className="px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full">
                {label}
              </span>
            ))}
          </div>
        )}
        <div className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          创建于 {new Date(issue.created_at).toLocaleString()}
        </div>
        {issue.description && (
          <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900">
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{issue.description}</p>
          </div>
        )}
      </div>
      <div className="space-y-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">评论</h2>
        <CommentList notes={notes} />
        <CommentForm iid={parseInt(iid)} />
      </div>
    </div>
  );
}

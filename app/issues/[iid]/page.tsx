import Link from 'next/link';
import { getIssue, listNotes } from '@/lib/gitlab';
import CommentList from '@/components/CommentList';
import CommentForm from '@/components/CommentForm';
import { getCurrentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function IssueDetailPage({ params }: { params: Promise<{ iid: string }> }) {
  // Get current user (optional)
  const user = await getCurrentUser();
  
  const { iid } = await params;
  const issue = await getIssue(parseInt(iid));
  const notes = await listNotes(parseInt(iid));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link href="/issues" className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          返回问题列表
        </Link>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Issue header */}
          <div className="bg-card border border-border rounded-lg shadow-sm">
            <div className="border-b border-border px-6 py-5">
              <div className="flex flex-wrap items-center gap-4 mb-3">
                <h1 className="text-2xl font-bold text-card-foreground">{issue.title}</h1>
                <span className="text-muted-foreground">#{issue.iid}</span>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                  issue.state === 'opened' 
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' 
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {issue.state}
                </span>
                {issue.author && (
                  <span className="text-sm text-card-foreground">
                    由 <span className="font-semibold">{issue.author.name}</span>
                    <span className="text-muted-foreground ml-1">@{issue.author.username}</span> 创建
                  </span>
                )}
                <span className="text-sm text-muted-foreground">
                  {new Date(issue.created_at).toLocaleString()}
                </span>
              </div>
            </div>
            
            {/* Labels */}
            {issue.labels.length > 0 && (
              <div className="border-b border-border px-6 py-4">
                <div className="flex flex-wrap gap-2">
                  {issue.labels.map((label) => (
                    <span key={label} className="px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full">
                      {label}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {/* Description */}
            {issue.description && (
              <div className="px-6 py-6">
                <div className="prose dark:prose-invert max-w-none">
                  <div className="whitespace-pre-wrap text-card-foreground">
                    {issue.description}
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Comments */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-card-foreground">评论 ({notes.length})</h2>
            <CommentList notes={notes} />
            {user && <CommentForm iid={parseInt(iid)} />}
          </div>
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-lg shadow-sm">
            <div className="border-b border-border px-4 py-3">
              <h3 className="text-sm font-semibold text-card-foreground">问题信息</h3>
            </div>
            <div className="p-4 space-y-3">
              <div className="text-sm">
                <span className="text-muted-foreground">状态: </span>
                <span className={`font-medium ${
                  issue.state === 'opened' 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-muted-foreground'
                }`}>
                  {issue.state}
                </span>
              </div>
              <div className="text-sm">
                <span className="text-muted-foreground">创建时间: </span>
                <span className="text-card-foreground">
                  {new Date(issue.created_at).toLocaleString()}
                </span>
              </div>
              {issue.labels.length > 0 && (
                <div className="text-sm">
                  <span className="text-muted-foreground">标签: </span>
                  <span className="text-card-foreground">
                    {issue.labels.join(', ')}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

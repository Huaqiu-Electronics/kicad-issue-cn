import { NextResponse } from 'next/server';
import { getIssue } from '@/lib/gitlab';
import { issueExists, getIssueByGitlabIid } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export async function GET(request: Request, { params }: { params: Promise<{ iid: string }> }) {
  try {
    // Require authentication
    await requireAuth();
    
    const { iid } = await params;
    const numericIid = parseInt(iid);
    
    if (!await issueExists(numericIid)) {
      return NextResponse.json({ error: 'Issue not found' }, { status: 404 });
    }
    
    const localIssue = await getIssueByGitlabIid(numericIid);
    const gitlabIssue = await getIssue(numericIid);
    
    return NextResponse.json({
      ...gitlabIssue,
      local: localIssue,
    });
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      if (error.message === 'Unauthorized') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }
    return NextResponse.json({ error: 'Failed to get issue' }, { status: 500 });
  }
}

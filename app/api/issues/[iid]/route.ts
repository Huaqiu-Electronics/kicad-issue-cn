import { NextResponse } from 'next/server';
import { getIssue } from '@/lib/gitlab';
import { issueExists, getIssueByGitlabIid } from '@/lib/db';

export async function GET(request: Request, { params }: { params: Promise<{ iid: string }> }) {
  try {
    const { iid } = await params;
    const numericIid = parseInt(iid);
    
    if (!issueExists(numericIid)) {
      return NextResponse.json({ error: 'Issue not found' }, { status: 404 });
    }
    
    const localIssue = getIssueByGitlabIid(numericIid);
    const gitlabIssue = await getIssue(numericIid);
    
    return NextResponse.json({
      ...gitlabIssue,
      local: localIssue,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to get issue' }, { status: 500 });
  }
}

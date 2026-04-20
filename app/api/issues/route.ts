import { NextResponse } from 'next/server';
import { createIssue } from '@/lib/gitlab';
import { insertIssue, getIssuesByUserId, getAllIssues } from '@/lib/db';
import { requireAuth, getCurrentUser } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    // Require authentication
    const user = await requireAuth();
    
    const body = await request.json();
    if (!body.title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }
    
    const gitlabIssue = await createIssue(body);
    
    const localIssue = await insertIssue({
      gitlab_iid: gitlabIssue.iid,
      title: body.title,
      user_id: user.id,
    });
    
    return NextResponse.json(localIssue);
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      if (error.message === 'Unauthorized') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }
    return NextResponse.json({ error: 'Failed to create issue' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    // Get current user (optional)
    const user = await getCurrentUser();
    let issues;
    
    if (user) {
      issues = await getIssuesByUserId(user.id);
    } else {
      issues = await getAllIssues();
    }
    return NextResponse.json(issues);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to list issues' }, { status: 500 });
  }
}

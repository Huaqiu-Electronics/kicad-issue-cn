import { NextResponse } from 'next/server';
import { createIssue } from '@/lib/gitlab';
import { insertIssue, getAllIssues } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }
    
    const gitlabIssue = await createIssue(body);
    
    const localIssue = await insertIssue({
      gitlab_iid: gitlabIssue.iid,
      title: body.title,
      description: body.description,
      labels: body.labels?.join(',') || undefined,
      username: body.username || 'Anonymous',
    });
    
    return NextResponse.json(localIssue);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create issue' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const issues = await getAllIssues();
    return NextResponse.json(issues);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to list issues' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { createIssue, listIssues } from '@/lib/gitlab';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }
    const issue = await createIssue(body);
    return NextResponse.json(issue);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create issue' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const state = searchParams.get('state') || undefined;
    const labels = searchParams.get('labels') || undefined;
    const issues = await listIssues(state, labels);
    return NextResponse.json(issues);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to list issues' }, { status: 500 });
  }
}

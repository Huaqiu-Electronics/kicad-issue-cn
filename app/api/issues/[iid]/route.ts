import { NextResponse } from 'next/server';
import { getIssue } from '@/lib/gitlab';

export async function GET(request: Request, { params }: { params: Promise<{ iid: string }> }) {
  try {
    const { iid } = await params;
    const issue = await getIssue(parseInt(iid));
    return NextResponse.json(issue);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to get issue' }, { status: 500 });
  }
}

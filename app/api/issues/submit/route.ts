import { NextResponse } from 'next/server';
import { createIssue } from '@/lib/gitlab';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const title = url.searchParams.get('title');
    const description = url.searchParams.get('description');
    const labels = url.searchParams.get('labels');
    const version = url.searchParams.get('version');
    const platform = url.searchParams.get('platform');

    if (!title || !description) {
      return NextResponse.json({ error: 'Title and description are required' }, { status: 400 });
    }

    // Check if user is logged in
    const user = await getCurrentUser();

    if (user) {
      // Logged-in user: create GitLab issue directly
      const issueLabels = labels ? labels.split(',').map((label: string) => label.trim()) : [];
      issueLabels.push('cn-user');
      
      const issueData = {
        title,
        description,
        labels: issueLabels
      };

      const gitlabIssue = await createIssue(issueData);

      // Create local issue record
      const localIssue = await prisma.issue.create({
        data: {
          gitlabIid: gitlabIssue.iid,
          title,
          userId: user.id
        }
      });

      return NextResponse.json({ status: 'created', gitlabIid: gitlabIssue.iid });
    } else {
      // Guest user: create GuestIssue
      const guestIssue = await prisma.guestIssue.create({
        data: {
          title,
          description,
          labels,
          version,
          platform
        }
      });

      return NextResponse.json({ status: 'pending_review' });
    }
  } catch (error) {
    console.error('Error in GET /api/issues/submit:', error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'Failed to submit issue' }, { status: 500 });
  }
}

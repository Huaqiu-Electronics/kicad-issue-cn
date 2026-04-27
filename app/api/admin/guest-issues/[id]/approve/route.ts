import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { createIssue } from '@/lib/gitlab';
import { prisma } from '@/lib/db';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Require authentication
    const user = await requireAuth();
    const { id } = await params;

    // Get the guest issue
    const guestIssue = await prisma.guestIssue.findUnique({
      where: { id }
    });

    if (!guestIssue) {
      return NextResponse.json({ error: 'Guest issue not found' }, { status: 404 });
    }

    if (guestIssue.status !== 'pending') {
      return NextResponse.json({ error: 'Guest issue is not pending' }, { status: 400 });
    }

    // Create GitLab issue
    const issueLabels = guestIssue.labels ? guestIssue.labels.split(',').map((label: string) => label.trim()) : [];
    issueLabels.push('cn-user');
    
    const issueData = {
      title: guestIssue.title,
      description: guestIssue.description,
      labels: issueLabels
    };

    const gitlabIssue = await createIssue(issueData);

    // Update guest issue status
    const updatedGuestIssue = await prisma.guestIssue.update({
      where: { id },
      data: {
        status: 'approved',
        gitlabIid: gitlabIssue.iid,
        reviewerId: user.id
      }
    });

    // Create local issue record
    await prisma.issue.create({
      data: {
        gitlabIid: gitlabIssue.iid,
        title: guestIssue.title,
        userId: user.id
      }
    });

    return NextResponse.json(updatedGuestIssue);
  } catch (error) {
    console.error('Error approving guest issue:', error);
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Failed to approve guest issue' }, { status: 500 });
  }
}

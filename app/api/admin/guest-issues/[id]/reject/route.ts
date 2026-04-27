import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    // Require authentication
    const user = await requireAuth();

    // Get the guest issue
    const guestIssue = await prisma.guestIssue.findUnique({
      where: { id: params.id }
    });

    if (!guestIssue) {
      return NextResponse.json({ error: 'Guest issue not found' }, { status: 404 });
    }

    if (guestIssue.status !== 'pending') {
      return NextResponse.json({ error: 'Guest issue is not pending' }, { status: 400 });
    }

    // Update guest issue status
    const updatedGuestIssue = await prisma.guestIssue.update({
      where: { id: params.id },
      data: {
        status: 'rejected',
        reviewerId: user.id
      }
    });

    return NextResponse.json(updatedGuestIssue);
  } catch (error) {
    console.error('Error rejecting guest issue:', error);
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Failed to reject guest issue' }, { status: 500 });
  }
}

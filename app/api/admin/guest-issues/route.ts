import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET(request: Request) {
  try {
    // Require authentication
    const user = await requireAuth();

    // Get pending guest issues
    const guestIssues = await prisma.guestIssue.findMany({
      where: { status: 'pending' },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(guestIssues);
  } catch (error) {
    console.error('Error listing guest issues:', error);
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Failed to list guest issues' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { updateGuestIssue } from '@/lib/db';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Require authentication
    const user = await requireAuth();
    const { id } = await params;
    const body = await request.json();

    const updatedIssue = await updateGuestIssue(id, {
      title: body.title,
      description: body.description,
      labels: body.labels,
    });

    return NextResponse.json(updatedIssue);
  } catch (error) {
    console.error('Error updating guest issue:', error);
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Failed to update guest issue' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/admin';
import { v4 as uuidv4 } from 'uuid';

export async function POST() {
  try {
    // Check if user is admin
    await requireAdmin();

    // Generate invite code (UUID)
    const code = uuidv4();

    // Create invite
    const invite = await prisma.invite.create({
      data: {
        code,
      },
    });

    return NextResponse.json({ invite: { id: invite.id, code: invite.code, used: invite.used, createdAt: invite.createdAt } });
  } catch (error) {
    console.error('Create invite error:', error);
    if (error instanceof Error) {
      if (error.message === 'Forbidden') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
      if (error.message === 'Unauthorized') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    // Check if user is admin
    await requireAdmin();

    // List invites
    const invites = await prisma.invite.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ invites });
  } catch (error) {
    console.error('List invites error:', error);
    if (error instanceof Error) {
      if (error.message === 'Forbidden') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
      if (error.message === 'Unauthorized') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/admin';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    // Check if user is admin
    await requireAdmin();

    // Get email from request body
    const body = await request.json();
    const { email } = body;

    // Generate invite code (UUID)
    const code = uuidv4();

    // Create invite
    const invite = await prisma.invite.create({
      data: {
        email,
        code,
      },
    });

    return NextResponse.json({ invite: { id: invite.id, email: invite.email, token: invite.code, used: invite.used, createdAt: invite.createdAt, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() } });
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

    // Format invites with token and expiresAt
    const formattedInvites = invites.map(invite => ({
      id: invite.id,
      email: invite.email,
      token: invite.code,
      used: invite.used,
      createdAt: invite.createdAt,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    }));

    return NextResponse.json({ invites: formattedInvites });
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

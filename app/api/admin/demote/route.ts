import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdmin, isAdmin } from '@/lib/admin';
import { getCurrentUser } from '@/lib/auth';

const ADMIN_EMAILS = process.env.ADMIN_EMAILS?.split(',') || [];

export async function POST(request: NextRequest) {
  try {
    // Check if user is admin
    const currentUser = await requireAdmin();

    const { email } = await request.json();

    // Find user to demote
    const userToDemote = await prisma.user.findUnique({ where: { email } });
    if (!userToDemote) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Prevent self-demotion
    if (userToDemote.email === currentUser.email) {
      return NextResponse.json({ error: 'Cannot demote yourself' }, { status: 400 });
    }

    // Check if user is an admin
    if (!isAdmin(userToDemote.email, userToDemote.role)) {
      return NextResponse.json({ error: 'User is not an admin' }, { status: 400 });
    }

    // Check if this is the last admin
    const allUsers = await prisma.user.findMany();
    const adminCount = allUsers.filter(user => isAdmin(user.email, user.role)).length;
    if (adminCount <= 1) {
      return NextResponse.json({ error: 'Cannot demote the last admin' }, { status: 400 });
    }

    // Demote user
    const updatedUser = await prisma.user.update({ where: { id: userToDemote.id }, data: { role: 'user' } });

    return NextResponse.json({ user: { id: updatedUser.id, email: updatedUser.email, role: updatedUser.role } });
  } catch (error) {
    console.error('Demote error:', error);
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

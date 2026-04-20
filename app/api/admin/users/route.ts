import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/admin';

const ADMIN_EMAILS = process.env.ADMIN_EMAILS?.split(',') || [];

export async function GET() {
  try {
    await requireAdmin();

    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    // Apply admin email logic
    const usersWithAdminRole = users.map(user => {
      if (ADMIN_EMAILS.includes(user.email) && user.role !== 'admin') {
        return { ...user, role: 'admin' };
      }
      return user;
    });

    return NextResponse.json({ users: usersWithAdminRole });
  } catch (error) {
    console.error('List users error:', error);
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
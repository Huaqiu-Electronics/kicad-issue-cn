import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/admin';

export async function POST(request: NextRequest) {
  try {
    // Check if user is admin
    await requireAdmin();

    const { email } = await request.json();

    // Find user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Promote user to admin
    const updatedUser = await prisma.user.update({ where: { id: user.id }, data: { role: 'admin' } });

    return NextResponse.json({ user: { id: updatedUser.id, email: updatedUser.email, role: updatedUser.role } });
  } catch (error) {
    console.error('Promote error:', error);
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

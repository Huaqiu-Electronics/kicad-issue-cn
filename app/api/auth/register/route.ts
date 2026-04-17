import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { prisma } from '@/lib/db';
import { setSessionCookie } from '@/lib/auth';

const ADMIN_EMAILS = process.env.ADMIN_EMAILS?.split(',') || [];

export async function POST(request: NextRequest) {
  try {
    const { email, password, inviteCode } = await request.json();

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    // Check if admin email bypasses invite
    if (!ADMIN_EMAILS.includes(email)) {
      // Require valid invite
      if (!inviteCode) {
        return NextResponse.json({ error: 'Invite code required' }, { status: 400 });
      }

      const invite = await prisma.invite.findUnique({ where: { code: inviteCode } });
      if (!invite || invite.used) {
        return NextResponse.json({ error: 'Invalid or used invite code' }, { status: 400 });
      }

      // Mark invite as used
      await prisma.invite.update({ where: { id: invite.id }, data: { used: true, usedBy: email } });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        role: ADMIN_EMAILS.includes(email) ? 'admin' : 'user',
      },
    });

    // Set session cookie
    await setSessionCookie(user.id);

    return NextResponse.json({ user: { id: user.id, email: user.email, role: user.role } });
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

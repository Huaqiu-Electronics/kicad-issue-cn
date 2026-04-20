import { cookies } from 'next/headers';
import { prisma } from './db';

const ADMIN_EMAILS = process.env.ADMIN_EMAILS?.split(',') || [];

export async function getCurrentUser() {
  try {
    const cookiesObj = await cookies();
    const sessionCookie = cookiesObj.get('session');
    if (!sessionCookie) return null;

    const userId = sessionCookie.value;
    const user = await prisma.user.findUnique({ where: { id: userId } });
    
    // Check if user should be admin
    if (user && ADMIN_EMAILS.includes(user.email) && user.role !== 'admin') {
      return { ...user, role: 'admin' };
    }
    
    return user;
  } catch (error) {
    console.error('Error in getCurrentUser:', error);
    return null;
  }
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('Unauthorized');
  }
  return user;
}

export async function setSessionCookie(userId: string) {
  const cookiesObj = await cookies();
  cookiesObj.set('session', userId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });
}

export async function clearSessionCookie() {
  const cookiesObj = await cookies();
  cookiesObj.delete('session');
}

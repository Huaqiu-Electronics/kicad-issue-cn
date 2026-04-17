import { getCurrentUser } from './auth';

const ADMIN_EMAILS = process.env.ADMIN_EMAILS?.split(',') || [];

export async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('Unauthorized');
  }

  if (user.role !== 'admin' && !ADMIN_EMAILS.includes(user.email)) {
    throw new Error('Forbidden');
  }

  return user;
}

export function isAdmin(email: string, role: string): boolean {
  return role === 'admin' || ADMIN_EMAILS.includes(email);
}

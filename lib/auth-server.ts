import { cookies } from 'next/headers';
import { verifySession, sessionCookie } from '@/lib/auth';

/** Returns the current user's id from the signed session cookie, or throws 401. */
export async function requireUserId(): Promise<string> {
  const token = cookies().get(sessionCookie.name)?.value;
  if (!token) throw Object.assign(new Error('Not authenticated'), { status: 401 });

  const payload = await verifySession(token);
  if (!payload?.sub) throw Object.assign(new Error('Invalid session'), { status: 401 });

  return payload.sub; // this is your User.id
}

/** Optionally expose the full (verified) session payload if you need name/email/admin */
export async function requireSession() {
  const token = cookies().get(sessionCookie.name)?.value;
  if (!token) throw Object.assign(new Error('Not authenticated'), { status: 401 });
  const payload = await verifySession(token);
  if (!payload?.sub) throw Object.assign(new Error('Invalid session'), { status: 401 });
  return payload;
}

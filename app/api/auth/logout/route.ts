// /src/app/api/auth/logout/route.ts
import { NextResponse } from 'next/server';
import { sessionCookie } from '@/lib/auth';

export async function POST() {
  const res = NextResponse.json({ ok: true });
  // Clear cookie by setting maxAge 0
  res.cookies.set(sessionCookie.name, '', {
    httpOnly: true,
    secure: sessionCookie.secure,
    sameSite: sessionCookie.sameSite,
    path: sessionCookie.path,
    maxAge: 0,
  });
  return res;
}

// /app/api/auth/me/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifySession } from '@/lib/auth'; // from the auth.ts we added earlier

const COOKIE = 'letlapa_session';

export async function GET() {
  const token = cookies().get(COOKIE)?.value;
  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 200 });
  }

  const payload = await verifySession(token);
  if (!payload) {
    return NextResponse.json({ authenticated: false }, { status: 200 });
  }

  return NextResponse.json(
    {
      authenticated: true,
      user: {
        id: payload.sub,
        email: payload.email,
        name: payload.name ?? null,
        isAdmin: !!payload.isAdmin,
      },
    },
    { status: 200 }
  );
}

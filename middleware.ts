// /middleware.ts  (project root)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const COOKIE = 'letlapa_session';

export async function middleware(req: NextRequest) {
  const token = req.cookies.get(COOKIE)?.value;

  if (token) {
    try {
      const key = new TextEncoder().encode(process.env.JWT_SECRET!);
      await jwtVerify(token, key); // valid token -> allow
      return NextResponse.next();
    } catch {
      // fall through to redirect
    }
  }

  const login = new URL('/login', req.url);
  login.searchParams.set('from', req.nextUrl.pathname);
  return NextResponse.redirect(login);
}

// Only run on these paths
export const config = {
  matcher: ['/profile/:path*', '/account/:path*', '/checkout/:path*'],
};

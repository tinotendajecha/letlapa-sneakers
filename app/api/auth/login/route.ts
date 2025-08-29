// /src/app/api/auth/login/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { signSession, sessionCookie } from '@/lib/auth';

const LoginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = LoginSchema.safeParse({
      email: (body.email || '').toLowerCase().trim(),
      password: body.password,
    });
    if (!parsed.success) {
      const msg = parsed.error.issues?.[0]?.message ?? 'Invalid input';
      return NextResponse.json({ error: msg }, { status: 400 });
    }

    const { email, password } = parsed.data;

    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, name: true, email: true, passwordHash: true, isAdmin: true },
    });

    // Don’t reveal which check failed
    if (!user || !user.passwordHash) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const token = await signSession({
      sub: user.id,
      email: user.email,
      name: user.name,
      isAdmin: user.isAdmin ?? false,
    });

    const res = NextResponse.json({ ok: true }, { status: 200 });
    res.cookies.set(sessionCookie.name, token, {
      httpOnly: sessionCookie.httpOnly,
      secure: sessionCookie.secure,
      sameSite: sessionCookie.sameSite,
      path: sessionCookie.path,
      maxAge: sessionCookie.maxAge,
    });
    return res;
  } catch (err) {
    console.error('Login error:', err);
    return NextResponse.json({ error: 'Failed to login' }, { status: 500 });
  }
}

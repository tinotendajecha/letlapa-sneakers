import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { Prisma } from '@prisma/client';

const RegisterSchema = z.object({
  name: z.string().min(2, 'Name is too short').max(60),
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = RegisterSchema.safeParse({
      name: body.name ?? body.fullName, // allow either field name
      email: (body.email || '').toLowerCase().trim(),
      password: body.password,
    });

    if (!parsed.success) {
      const msg = parsed.error.issues?.[0]?.message ?? 'Invalid input';
      return NextResponse.json({ error: msg }, { status: 400 });
    }

    const { name, email, password } = parsed.data;

    // quick existence check
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) {
      return NextResponse.json({ error: 'Email already in use' }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        // isAdmin defaults to false in your schema
        // you can also create empty related rows here if you want:
        // profile: { create: {} },
        // shippingPref: { create: {} },
      },
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err: any) {
    // unique constraint fallback
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
      return NextResponse.json({ error: 'Email already in use' }, { status: 409 });
    }
    console.error('Register error', err);
    return NextResponse.json({ error: 'Failed to register' }, { status: 500 });
  }
}

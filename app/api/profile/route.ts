import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireUserId } from '@/lib/auth-server';

export async function GET() {
  try {
    const userId = await requireUserId();
    const [user, profile] = await Promise.all([
      prisma.user.findUnique({ where: { id: userId }, select: { name: true, email: true } }),
      prisma.profile.findUnique({ where: { userId } }),
    ]);

    return NextResponse.json({
      name: user?.name ?? '',
      email: user?.email ?? '',
      phone: profile?.phone ?? '',
      whatsapp: profile?.whatsapp ?? '',
    });
  } catch (e: any) {
    const status = e?.status ?? 500;
    return NextResponse.json({ error: e.message ?? 'Failed to load profile' }, { status });
  }
}

export async function PUT(req: Request) {
  try {
    const userId = await requireUserId();
    const body = await req.json();

    // Update User.name if provided
    if (typeof body.name === 'string') {
      await prisma.user.update({ where: { id: userId }, data: { name: body.name || null } });
    }

    // Upsert Profile(phone/whatsapp)
    if (typeof body.phone !== 'undefined' || typeof body.whatsapp !== 'undefined') {
      const existing = await prisma.profile.findUnique({ where: { userId } });

      if (!existing) {
        await prisma.profile.create({
          data: {
            userId,
            phone: (body.phone ?? '') || null,
            whatsapp: (body.whatsapp ?? '') || null,
          },
        });
      } else {
        await prisma.profile.update({
          where: { userId },
          data: {
            phone: typeof body.phone !== 'undefined' ? (body.phone || null) : existing.phone,
            whatsapp: typeof body.whatsapp !== 'undefined' ? (body.whatsapp || null) : existing.whatsapp,
          },
        });
      }
    }

    const [user, profile] = await Promise.all([
      prisma.user.findUnique({ where: { id: userId }, select: { name: true, email: true } }),
      prisma.profile.findUnique({ where: { userId } }),
    ]);

    return NextResponse.json({
      name: user?.name ?? '',
      email: user?.email ?? '',
      phone: profile?.phone ?? '',
      whatsapp: profile?.whatsapp ?? '',
    });
  } catch (e: any) {
    const status = e?.status ?? 500;
    return NextResponse.json({ error: e.message ?? 'Failed to save profile' }, { status });
  }
}

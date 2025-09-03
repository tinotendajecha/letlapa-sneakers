import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireUserId } from '@/lib/auth-server';
import { Province } from '@prisma/client';

const SA_TO_ENUM: Record<string, Province> = {
  'Gauteng': 'GAUTENG',
  'Western Cape': 'WESTERN_CAPE',
  'KwaZulu-Natal': 'KWAZULU_NATAL',
  'Eastern Cape': 'EASTERN_CAPE',
  'Free State': 'FREE_STATE',
  'Limpopo': 'LIMPOPO',
  'Mpumalanga': 'MPUMALANGA',
  'North West': 'NORTH_WEST',
  'Northern Cape': 'NORTHERN_CAPE',
};
const ENUM_TO_SA: Record<Province, string> =
  Object.fromEntries(Object.entries(SA_TO_ENUM).map(([k, v]) => [v, k])) as any;

function toClient(addr: any, defaultId?: string) {
  return {
    id: addr.id,
    label: addr.label ?? 'Address',
    line1: addr.line1,
    line2: addr.line2 ?? '',
    suburb: addr.suburb ?? '',
    province: ENUM_TO_SA[addr.province as Province],
    postalCode: addr.postalCode ?? '',
    country: addr.country ?? 'South Africa',
    isDefault: !!defaultId && addr.id === defaultId,
  };
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const userId = await requireUserId();
    const body = await req.json();
    const { id } = params;

    const existing = await prisma.address.findFirst({ where: { id, userId } });
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const data: any = {
      label: body.label ?? existing.label,
      line1: body.line1 ?? existing.line1,
      line2: body.line2 ?? existing.line2,
      suburb: body.suburb ?? existing.suburb,
      postalCode: body.postalCode ?? existing.postalCode,
      country: body.country ?? existing.country,
    };
    if (body.province) {
      const p = SA_TO_ENUM[body.province];
      if (!p) return NextResponse.json({ error: 'Invalid province' }, { status: 400 });
      data.province = p;
    }

    const updated = await prisma.address.update({ where: { id }, data });

    if (typeof body.isDefault === 'boolean') {
      await prisma.user.update({
        where: { id: userId },
        data: { defaultAddressId: body.isDefault ? id : null },
      });
    }

    const user = await prisma.user.findUnique({ where: { id: userId }, select: { defaultAddressId: true } });
    return NextResponse.json({ address: toClient(updated, user?.defaultAddressId ?? undefined) });
  } catch (e: any) {
    const status = e?.status ?? 500;
    return NextResponse.json({ error: e.message ?? 'Failed to update address' }, { status });
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    const userId = await requireUserId();
    const { id } = params;

    const existing = await prisma.address.findFirst({ where: { id, userId } });
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const user = await prisma.user.findUnique({ where: { id: userId }, select: { defaultAddressId: true } });
    const clearDefault = user?.defaultAddressId === id;

    await prisma.$transaction([
      prisma.address.delete({ where: { id } }),
      ...(clearDefault ? [prisma.user.update({ where: { id: userId }, data: { defaultAddressId: null } })] : []),
    ]);

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    const status = e?.status ?? 500;
    return NextResponse.json({ error: e.message ?? 'Failed to delete address' }, { status });
  }
}

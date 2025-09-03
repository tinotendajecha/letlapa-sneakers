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

export async function GET() {
  try {
    const userId = await requireUserId();
    const [user, addresses] = await Promise.all([
      prisma.user.findUnique({ where: { id: userId }, select: { defaultAddressId: true } }),
      prisma.address.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } }),
    ]);
    return NextResponse.json({
      addresses: addresses.map(a => toClient(a, user?.defaultAddressId ?? undefined)),
    });
  } catch (e: any) {
    const status = e?.status ?? 500;
    return NextResponse.json({ error: e.message ?? 'Failed to fetch addresses' }, { status });
  }
}

export async function POST(req: Request) {
  try {
    const userId = await requireUserId();
    const body = await req.json();

    const provinceEnum = SA_TO_ENUM[body.province];
    if (!provinceEnum) return NextResponse.json({ error: 'Invalid province' }, { status: 400 });

    const created = await prisma.address.create({
      data: {
        userId,
        label: body.label ?? null,
        line1: body.line1,
        line2: body.line2 ?? null,
        suburb: body.suburb ?? null,
        province: provinceEnum,
        postalCode: body.postalCode ?? null,
        country: body.country ?? 'South Africa',
      },
    });

    if (body.isDefault) {
      await prisma.user.update({ where: { id: userId }, data: { defaultAddressId: created.id } });
    }

    const user = await prisma.user.findUnique({ where: { id: userId }, select: { defaultAddressId: true } });
    return NextResponse.json({ address: toClient(created, user?.defaultAddressId ?? undefined) }, { status: 201 });
  } catch (e: any) {
    const status = e?.status ?? 500;
    return NextResponse.json({ error: e.message ?? 'Failed to create address' }, { status });
  }
}

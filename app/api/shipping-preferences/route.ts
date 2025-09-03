import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireUserId } from '@/lib/auth-server';
import { DeliveryWindow } from '@prisma/client';

const UI_TO_ENUM: Record<string, DeliveryWindow> = {
  'Anytime': 'ANYTIME',
  'Weekdays 9–17h': 'WEEKDAYS_9_17',
  'Evenings 17–20h': 'EVENINGS_17_20',
  'Weekends': 'WEEKENDS',
};
const ENUM_TO_UI: Record<DeliveryWindow, string> = {
  ANYTIME: 'Anytime',
  WEEKDAYS_9_17: 'Weekdays 9–17h',
  EVENINGS_17_20: 'Evenings 17–20h',
  WEEKENDS: 'Weekends',
};

export async function GET() {
  try {
    const userId = await requireUserId();
    const pref = await prisma.shippingPreference.findUnique({ where: { userId } });

    return NextResponse.json({
      instructions: pref?.instructions ?? '',
      deliveryWindow: pref ? ENUM_TO_UI[pref.deliveryWindow] : 'Anytime',
    });
  } catch (e: any) {
    const status = e?.status ?? 500;
    return NextResponse.json({ error: e.message ?? 'Failed to load shipping preferences' }, { status });
  }
}

export async function PUT(req: Request) {
  try {
    const userId = await requireUserId();
    const body = await req.json();

    const data: { instructions?: string | null; deliveryWindow?: DeliveryWindow } = {};
    if (typeof body.instructions === 'string') data.instructions = body.instructions || null;

    if (typeof body.deliveryWindow === 'string') {
      const enumVal = UI_TO_ENUM[body.deliveryWindow];
      if (!enumVal) return NextResponse.json({ error: 'Invalid deliveryWindow' }, { status: 400 });
      data.deliveryWindow = enumVal;
    }

    await prisma.shippingPreference.upsert({
      where: { userId },
      update: data,
      create: { userId, instructions: data.instructions ?? null, deliveryWindow: data.deliveryWindow ?? 'ANYTIME' },
    });

    const pref = await prisma.shippingPreference.findUnique({ where: { userId } });
    return NextResponse.json({
      instructions: pref?.instructions ?? '',
      deliveryWindow: pref ? ENUM_TO_UI[pref.deliveryWindow] : 'Anytime',
    });
  } catch (e: any) {
    const status = e?.status ?? 500;
    return NextResponse.json({ error: e.message ?? 'Failed to save shipping preferences' }, { status });
  }
}

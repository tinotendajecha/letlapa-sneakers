// app/api/payments/paystack/init/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/auth-server";
import { paystack } from "@/lib/paystack";

export async function POST(req: Request) {
  try {
    const userId = await requireUserId();
    const { orderId } = await req.json();

    if (!orderId) {
      return NextResponse.json({ error: "orderId required" }, { status: 400 });
    }

    const order = await prisma.order.findFirst({
      where: { id: orderId, userId },
      include: { user: { select: { email: true } } },
    });
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
    if (order.total <= 0) return NextResponse.json({ error: "Invalid total" }, { status: 400 });

    // initialize transaction (amount is in cents already)
    const initRes = await paystack<{
      data: { authorization_url: string; access_code: string; reference: string };
    }>("/transaction/initialize", {
      method: "POST",
      json: {
        email: order.user.email,
        amount: order.total,        // cents (lowest unit)
        currency: "ZAR",
        reference: order.payReference, // we generated on order create
        callback_url: `${process.env.BASE_URL}/api/payments/paystack/callback`,
        metadata: {
          orderId: order.id,
          userId,
          cancel_action: `${process.env.BASE_URL}/checkout`,
        },
      },
    });

    // persist access_code for resume
    await prisma.order.update({
      where: { id: order.id },
      data: {
        payAccessCode: initRes.data.access_code,
      },
    });

    return NextResponse.json({
      authorizationUrl: initRes.data.authorization_url,
      accessCode: initRes.data.access_code,
      reference: initRes.data.reference,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Init failed" }, { status: 500 });
  }
}

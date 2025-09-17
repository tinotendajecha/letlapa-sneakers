// app/api/payments/paystack/webhook/route.ts
import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const raw = await req.text();

  // verify signature
  const signature = req.headers.get("x-paystack-signature") || "";
  const computed = crypto
    .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY || "")
    .update(raw)
    .digest("hex");

  if (signature !== computed) {
    return new NextResponse("Invalid signature", { status: 401 });
  }

  const payload = JSON.parse(raw);
  const event = payload?.event;
  const data = payload?.data;

  if (event === "charge.success") {
    const reference = data?.reference as string | undefined;
    if (reference) {
      const order = await prisma.order.findFirst({ where: { payReference: reference } });
      if (order && order.status !== "PAID") {
        const amountOk = Number(data.amount) === Number(order.total);
        const currencyOk = (data.currency || "").toUpperCase() === "ZAR";
        if (amountOk && currencyOk) {
          await prisma.order.update({ where: { id: order.id }, data: { status: "PAID" } });
        }
      }
    }
  }

  // you can handle refunds/failed here as well
  return new NextResponse("ok", { status: 200 });
}
